import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";

const systemPrompt = `
    You are a sophisticated health diagnosis assistant. Your role is to help users by providing potential diagnoses based on their symptoms or health concerns. Additionally, if the user asks for clinic recommendations, suggest the nearest clinics based on the user's location.

Guidelines:
Analyze the User's Query:

Understand the symptoms, duration, severity, and any other relevant details provided by the user.
If the user requests nearby clinics, retrieve relevant information based on the user's location.
Retrieve Information:

Use the RAG model to fetch and evaluate information related to the symptoms described.
Generate Top 3 Possible Diagnoses:

Based on the retrieved information, generate a list of the top 3 possible illnesses that could match the user’s symptoms.
Include brief descriptions of each illness to provide context.
Suggest Nearest Clinics:

If requested by the user, suggest the nearest doctors with relevant specialties.
Include Doctor's name, Specialty, clinic name, location, Phone and website.
Ensure Accuracy and Clarity:

Present the information clearly and concisely.
Ensure that the generated illnesses and doctors are relevant to the symptoms described.
Avoid providing a definitive diagnosis; instead, suggest the top possible conditions and recommend consulting a healthcare professional for a thorough examination.
Example:
User Query: "I have been experiencing severe headaches, nausea, and sensitivity to light for the past week. Can you suggest a nearby doctor?"

Response:

Migraine:

Description: Migraines are intense headaches often accompanied by nausea, vomiting, and sensitivity to light and sound. They can last from a few hours to several days.
Cluster Headache:

Description: Cluster headaches are severe headaches that occur in cyclical patterns or clusters. They often involve one-sided pain, severe intensity, and can be accompanied by nausea and sensitivity to light.
Tension-Type Headache:

Description: Tension-type headaches are characterized by a dull, aching pain and pressure around the forehead or the back of the head. They may be accompanied by neck pain and sensitivity to light.

Nearest Healthcare Provider:

- HealthCare Clinic: Doctor: Dr. James Ronaldo, Specialty: Dermatology, Location: 123 Main St, CityName. Phone: (123) 456-7890. Website: www.healthcare.com
- City Hospital: Location: 456 Elm St, CityName. Contact: (987) 654-3210, info@cityhospital.com. Website: www.cityhospital.com
`

export async function POST(req) {
    try {
        const data = await req.json();
        const pc = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY,
        });

        const index_diseases = pc.index('rag-diseases').namespace('ns1');
        const index_doctors = pc.index('rag-doc').namespace('ns1');
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const text = data[data.length - 1].content;

        // Fetch the embedding
        let embedding;
        try {
            embedding = await openai.embeddings.create({
                model: 'text-embedding-3-small',
                input: text,
                encoding_format: 'float'
            });
        } catch (error) {
            return new NextResponse("Error creating embedding: " + error.message, { status: 500 });
        }

        // Query for diseases
        let diseaseString = '\n\nBased on your symptoms, here are the top 3 possible diagnoses:';
        let results_diseases;
        try {
            results_diseases = await index_diseases.query({
                topK: 3,
                includeMetadata: true,
                vector: embedding.data[0].embedding
            });
        } catch (error) {
            return new NextResponse("Error querying diseases: " + error.message, { status: 500 });
        }

        // If no matches, provide a fallback message
        if (!results_diseases.matches.length) {
            diseaseString = "\n\nNo matching diagnoses found based on your symptoms.";
        } else {
            results_diseases.matches.forEach((match, index) => {
                diseaseString += `\n\n${index + 1}. **${match.id}**\n` +
                    `- **Symptoms:** ${match.metadata.symptoms}\n` +
                    `- **Description:** ${match.metadata.description}\n` +
                    `- **Treatment:** ${match.metadata.treatment}\n`;
            });
        }

        // Query for doctors if needed
        let clinicString = '';
        if (text.toLowerCase().includes('clinic') || text.toLowerCase().includes('hospital') || text.toLowerCase().includes('doctor')) {
            let results_doctors;
            try {
                results_doctors = await index_doctors.query({
                    topK: 3,
                    includeMetadata: true,
                    vector: embedding.data[0].embedding
                });
            } catch (error) {
                return new NextResponse("Error querying doctors: " + error.message, { status: 500 });
            }

            // If no doctors are found
            if (!results_doctors.matches.length) {
                clinicString = "\n\nNo nearby clinics or doctors found.";
            } else {
                clinicString = '\n\nNearest Healthcare Provider:\n';
                results_doctors.matches.forEach((match, index) => {
                    clinicString += `\n${index + 1}. **Doctor:** ${match.id}\n` +
                        `- **Specialty:** ${match.metadata.specialty}\n` +
                        `- **Clinic Name:** ${match.metadata.clinic_name}\n` +
                        `- **Location:** ${match.metadata.clinic_location}\n` +
                        `- **Phone:** ${match.metadata.Phone}\n` +
                        `- **Website:** [${match.metadata.website}](${match.metadata.website})\n`;
                });
            }
            console.log(results_diseases)
            console.log(results_doctors)
        }
        
        // Combine the user’s last message with the results
        const lastMessage = data[data.length - 1];
        const lastMessageContent = lastMessage.content + diseaseString + clinicString;
        const lastDataWithoutLastMessage = data.slice(0, data.length - 1);

        const completion = await openai.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                ...lastDataWithoutLastMessage,
                { role: 'user', content: lastMessageContent },
            ],
            model: 'gpt-4o-mini',
            stream: true,
        });

        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();
                try {
                    for await (const chunk of completion) {
                        const content = chunk.choices[0]?.delta?.content;
                        if (content) {
                            const text = encoder.encode(content);
                            controller.enqueue(text);
                        }
                    }
                } catch (err) {
                    controller.error(err);
                } finally {
                    controller.close();
                }
            },
        });
        return new NextResponse(stream);
    } catch (error) {
        return new NextResponse("Error processing request: " + error.message, { status: 500 });
    }
}