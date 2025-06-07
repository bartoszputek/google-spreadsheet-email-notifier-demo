import { runWorker } from "./worker.js";

const config = {
  googleCredentials: {
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL.replace(/\\n/g, "\n"),
    key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets", "https://www.googleapis.com/auth/drive.file"],
  },
  ses: {
    region: process.env.REGION,
    fromEmail: process.env.FROM_EMAIL,
    destinationEmail: process.env.DESTINATION_EMAIL,
    sendRealEmails: process.env.SEND_REAL_EMAILS === "true",
  },
  s3: {
    region: process.env.REGION,
    bucket: process.env.BUCKET,
    key: process.env.S3_KEY,
  },
};

export const handler = async (event) => {
  try {
    console.log("Received event:", event);

    const data = {
      spreadsheetId: "your-spreadsheet-id", // Replace with your actual spreadsheet ID
      startingCell: "A3", // Replace with your cell
      endingCell: "M23", // Replace with your ending cell
      valuesToFind: event.detail.valuesToFind ?? [],
    };

    await runWorker({ data, config });

    console.log(`Successfully processed order.`);
    return "Success";
  } catch (error) {
    console.error(`Failed to process order: ${error?.message}.`);
    throw error;
  }
};
