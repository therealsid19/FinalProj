import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';

const reminders = [];

export async function GET(request) {
  const { userId } = getAuth(request);

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userReminders = reminders.filter(reminder => reminder.userId === userId);
  return NextResponse.json(userReminders);
}

export async function POST(request) {
  const { userId } = getAuth(request);

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const newReminder = await request.json();
  newReminder.userId = userId;
  reminders.push(newReminder);
  return NextResponse.json(newReminder, { status: 201 });
}

export async function PUT(request) {
  const { userId } = getAuth(request);

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const updatedReminder = await request.json();
  const reminderIndex = reminders.findIndex(rem => rem.id === updatedReminder.id && rem.userId === userId);
  
  if (reminderIndex > -1) {
    reminders[reminderIndex] = { ...reminders[reminderIndex], ...updatedReminder };
    return NextResponse.json(reminders[reminderIndex]);
  }
  
  return NextResponse.json({ error: 'Reminder not found' }, { status: 404 });
}

export async function DELETE(request) {
  const { userId } = getAuth(request);

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = new URL(request.url).searchParams;
  const reminderIndex = reminders.findIndex(rem => rem.id === id && rem.userId === userId);
  
  if (reminderIndex > -1) {
    reminders.splice(reminderIndex, 1);
    return NextResponse.json({}, { status: 204 });
  }
  
  return NextResponse.json({ error: 'Reminder not found' }, { status: 404 });
}
