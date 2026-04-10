import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

/**
 * Dispatches an emergency alert email using AWS SES.
 * @param {string[]} toAddresses Array of trusted contact emails.
 * @param {string} transcriptionContext Context extracted from the AI regarding the emergency.
 */
export async function sendAlertEmails(toAddresses, transcriptionContext) {
  if (!process.env.SES_FROM_EMAIL_ADDRESS || toAddresses.length === 0) {
    throw new Error("Missing from-address configuration or contact list for SES Alert.");
  }

  // Instantiate client inside the function so hot-reloading captures updated `.env.local` region safely.
  const sesClient = new SESClient({
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || process.env.ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || process.env.SECRET_ACCESS_KEY
    }
  });

  const params = {
    Destination: {
      ToAddresses: toAddresses,
    },
    Message: {
      Body: {
        Text: {
          Charset: "UTF-8",
          Data: `Emergency Alert triggered via Voice Assistant!\n\nDetails / Context identified by AI:\n${transcriptionContext}\n\nPlease take immediate action.`,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "URGENT: Emergency Voice Alert Detected",
      },
    },
    Source: process.env.SES_FROM_EMAIL_ADDRESS,
  };

  try {
    const command = new SendEmailCommand(params);
    const data = await sesClient.send(command);
    console.log("[SES] Emergency Email dispatched successfully. Message ID:", data.MessageId);
    return data;
  } catch (error) {
    console.error("[SES] Failed to send emergency email. Ensure the recipient is verified in AWS SES Sandbox Mode. Error:", error.message);
    return { error: error.message }; 
  }
}
