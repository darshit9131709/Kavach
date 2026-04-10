import { NextResponse } from 'next/server';
import { sendAlertEmails } from '@/lib/ses';
import { VapiClient } from '@vapi-ai/server-sdk';
import connectDB from '@/lib/mongodb';
import TrustedContact from '@/models/TrustedContact';

export async function POST(request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'No message body provided' }, { status: 400 });
    }

    switch (message.type) {
      case 'status-update':
        console.log(`[VAPI] Call ${message.call?.id} status updated to: ${message.call?.status}`);
        break;
        
      case 'transcript':
        console.log(`[VAPI] ${message.role}: ${message.transcript}`);
        
        // --- REGEX KEYWORD TRIGGERING ---
        if (message.role === 'user' && /\b(help|danger|emergency|attack)\b/i.test(message.transcript)) {
          console.log(`[VAPI] Priority keyword detected in transcript! Triggering AI Context Analysis mid-call.`);
          try {
            // Check config explicitly to avoid crashes if API Key is not yet configured
            const apiKey = process.env.VAPI_PRIVATE_API_KEY || process.env.VAPI_API_KEY;
            if (apiKey && message.call?.id) {
                const vapiClient = new VapiClient({ token: apiKey });
                await vapiClient.calls.message.create(message.call.id, {
                  role: 'system',
                  content: `The user just triggered a severe priority keyword. Check the context of their statement. If the user appears to be in an actual emergency or danger, immediately invoke the 'send_emergency_alert' function call. If it's irrelevant, safely ignore it.`
                });
            } else {
                console.log("[VAPI Warning] VAPI_PRIVATE_API_KEY missing or missing call ID, could not inject prompt.");
            }
          } catch (err) {
            console.error('Failed to inject prompt to Vapi call:', err);
          }
        }
        break;

      case 'tool-calls':
      case 'function-call':
        // Handle custom function calls logic
        const funcCall = message.type === 'tool-calls' ? message.toolCalls?.[0]?.function : message.functionCall;
        const callId = message.type === 'tool-calls' ? message.toolCalls?.[0]?.id : message.call?.id;

        console.log(`[VAPI] Function call ${funcCall?.name} triggered.`);
        
        if (funcCall?.name === 'send_emergency_alert') {
           const contextMsg = funcCall.parameters?.context || "No context provided.";
           
           // Fetch invoking User ID tracked through vapi customer extension metadata
           let invokingUserId = message.call?.customer?.extension;
           
           // Fallback to extract from AI's parameter payload if metadata was blocked during connection validation
           const regexIdMatch = contextMsg.match(/\[USERID:([^\]]+)\]/);
           if (regexIdMatch && regexIdMatch[1]) {
             invokingUserId = regexIdMatch[1];
           }
           
           if (!invokingUserId || invokingUserId === 'anonymous' || invokingUserId === 'undefined') {
             console.log("[VAPI Warning] Missing invoking User ID. Cannot fetch dynamic MongoDB contacts. Alert rejected.");
             return NextResponse.json({
                 results: [{
                     toolCallId: callId,
                     error: "Cannot dispatch alerts: Vapi user metadata missing, failed to map DB entries. Did you start the context with [USERID:...]?"
                 }]
             });
           }
           
           try {
             await connectDB();
             
             // Fetch target user's custom trusted contacts
             const dynamicContacts = await TrustedContact.find({ userId: invokingUserId }).lean();
             
             if (dynamicContacts.length === 0) {
               console.log(`[VAPI Warning] User ${invokingUserId} triggered alert but has 0 saved trusted contacts.`);
               return NextResponse.json({
                   results: [{
                       toolCallId: callId,
                       result: "No trusted contacts configured. Advise user to add contacts ASAP."
                   }]
               });
             }
             
             // Extract target emails and phones dynamically from MongoDB
             const trustedContactsEmails = dynamicContacts.map(c => c.email).filter(Boolean);
             const trustedContactPhones = dynamicContacts.map(c => c.phone).filter(Boolean);
             
             // Dynamically import sns.js to keep the file cleaner if not in use
             const { sendAlertSMS } = await import('@/lib/sns');
             
             // Run both Email and SMS dispatches in parallel
             const alertPromises = [];
             
             if (trustedContactsEmails.length > 0) {
               alertPromises.push(sendAlertEmails(trustedContactsEmails, contextMsg));
             }
             
             if (trustedContactPhones.length > 0) {
               alertPromises.push(sendAlertSMS(trustedContactPhones, contextMsg));
             }
             
             await Promise.all(alertPromises);
             
             return NextResponse.json({ 
                 results: [{
                     toolCallId: callId,
                     result: `Alerts (Email & SMS) dispatched successfully to ${dynamicContacts.length} dynamic trusted contacts. Inform the user help is heavily on the way.`
                 }]
             });
           } catch(err) {
             console.error("[Webhook Error] Alert Dispatch Failure:", err);
             return NextResponse.json({
                 results: [{
                     toolCallId: callId,
                     error: "Failed to dispatch alerts due to an internal server error."
                 }]
             });
           }
        }
        break;

      case 'end-of-call-report':
        console.log(`[VAPI] Call ended. Summary: ${message.summary}`);
        break;
        
      default:
        console.log(`[VAPI] Unhandled message type: ${message.type}`);
    }

    // Always respond with a 200 so Vapi knows the webhook was received
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error handling Vapi webhook:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
