import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

/**
 * Dispatches an emergency SMS alert using AWS SNS.
 * @param {string[]} phoneNumbers Array of trusted contact phone numbers (E.164 format e.g. +1234567890).
 * @param {string} transcriptionContext Context extracted from the AI regarding the emergency.
 */
export async function sendAlertSMS(phoneNumbers, transcriptionContext) {
  if (!phoneNumbers || phoneNumbers.length === 0) {
    console.log("[SNS] No trusted phone numbers provided to send SMS.");
    return null;
  }

  // Instantiate client inside the function so hot-reloading captures updated `.env.local` region safely.
  const snsClient = new SNSClient({
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || process.env.ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || process.env.SECRET_ACCESS_KEY
    }
  });

  const message = `EMERGENCY ALERT via Voice Assistant:\n\nDetails:\n${transcriptionContext}\n\nPlease take immediate action.`;
  const responses = [];

  // SNS PublishCommand sends to only one number at a time if sending directly to phone numbers
  for (const number of phoneNumbers) {
    try {
      const params = {
        Message: message,
        PhoneNumber: number
      };
      
      const command = new PublishCommand(params);
      const data = await snsClient.send(command);
      console.log(`[SNS] Emergency SMS dispatched successfully to ${number}. Message ID:`, data.MessageId);
      responses.push(data);
    } catch (error) {
      console.error(`[SNS] Failed to send emergency SMS to ${number}:`, error);
      // We don't throw immediately so we can attempt sending to other numbers in the array
      responses.push({ error });
    }
  }
  
  return responses;
}
