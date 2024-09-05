import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";

const systemPrompt = `
    You are a sophisticated health diagnosis assistant. Your role is to help users by providing potential diagnoses based on their symptoms or health concerns. Given a user’s query describing their symptoms or health issues, you should retrieve relevant information and generate a response that lists the top 3 possible illnesses that match the user's symptoms.

Guidelines:
Analyze the User's Query:

Understand the symptoms, duration, severity, and any other relevant details provided by the user.
Retrieve Information:

Use the RAG model to fetch and evaluate information related to the symptoms described.
Generate Top 3 Possible Diagnoses:

Based on the retrieved information, generate a list of the top 3 possible illnesses that could match the user’s symptoms.
Include brief descriptions of each illness to provide context.
Ensure Accuracy and Clarity:

Present the information clearly and concisely.
Ensure that the generated illnesses are relevant to the symptoms described.
Avoid providing a definitive diagnosis; instead, suggest the top possible conditions and recommend consulting a healthcare professional for a thorough examination.
Example:
User Query: "I have been experiencing severe headaches, nausea, and sensitivity to light for the past week."

Response:

Migraine:

Description: Migraines are intense headaches often accompanied by nausea, vomiting, and sensitivity to light and sound. They can last from a few hours to several days.
Cluster Headache:

Description: Cluster headaches are severe headaches that occur in cyclical patterns or clusters. They often involve one-sided pain, severe intensity, and can be accompanied by nausea and sensitivity to light.
Tension-Type Headache:

Description: Tension-type headaches are characterized by a dull, aching pain and pressure around the forehead or the back of the head. They may be accompanied by neck pain and sensitivity to light.
`

export async function POST(req) {
    const data = await req.json()
    const pc = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY,
    })
    const index = pc.index('rag').namespace('ns1')
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    })

    const text = data[data.length-1].content
    const embedding = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
        encoding_format: 'float'
    })

    const results = await index.query({
        topK: 3,
        includeMetadata: true,
        vector: embedding.data[0].embedding
    })

    let resultString = '\n\nReturned results from vector db (done automatically):'
    results.matches.forEach((match) => {
        resultString += `\n
        Disease: ${match.metadata.disease}
        Symptoms: ${match.metadata.symptoms}
        Description: ${match.metadata.description}
        Treatment: ${match.metadata.treatment}
        \n\n
        `
    })

    const lastMessage = data[data.length - 1]
    const lastMessageContent = lastMessage.content + resultString
    const lastDataWithoutLastMessage = data.slice(0, data.length - 1)

    const completion = await openai.chat.completions.create({
        messages: [
            {role: 'system', content: systemPrompt},
            ...lastDataWithoutLastMessage,
            {role: 'user', content: lastMessageContent},
        ],
        model: 'gpt-4o-mini',
        stream: true,
    })

    const stream = new ReadableStream({
        async start(controller){
            const encoder = new TextEncoder()
            try{
                for await (const chunk of completion){
                    const content = chunk.choices[0]?.delta?.content;
                    if (content){
                        const text = encoder.encode(content);
                        controller.enqueue(text);
                    }
                }
            } catch(err) {
                controller.error(err)
            } finally {
                controller.close()
            }
        },
    });
    return new NextResponse(stream)
}