import { NextResponse } from 'next/server';
import { VapiClient } from '@vapi-ai/server-sdk';

// Initialize the VapiClient with the server (private) API key
const vapi = new VapiClient({
  token: process.env.VAPI_PRIVATE_API_KEY || ''
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { phoneNumberId, customerNumber, assistantId } = body;

    // Optional validation
    if (!customerNumber) {
      return NextResponse.json({ error: 'Missing customer number' }, { status: 400 });
    }

    if (!process.env.VAPI_PRIVATE_API_KEY) {
      return NextResponse.json(
        { error: 'VAPI_PRIVATE_API_KEY is not configured on the server.' },
        { status: 500 }
      );
    }

    // Create an outbound call via the Vapi server-sdk
    const call = await vapi.calls.create({
      phoneNumberId: phoneNumberId || "YOUR_PHONE_NUMBER_ID",
      customer: { number: customerNumber },
      assistantId: assistantId || process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID
    });

    console.log(`[VAPI] Run Outbound Call created: ${call.id} for ${customerNumber}`);
    
    return NextResponse.json({ success: true, callId: call.id });
  } catch (error) {
    console.error('Error creating Vapi Outbound call:', error);
    return NextResponse.json(
      { error: 'Failed to create outbound call', details: error.message },
      { status: 500 }
    );
  }
}
