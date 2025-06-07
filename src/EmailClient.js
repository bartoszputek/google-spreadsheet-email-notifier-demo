import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

export default class EmailClient {
  constructor({ config }) {
    this.config = config;

    this.ses = new SESClient({ region: config.region });
  }

  async sendEmail({ email, message, subject }) {
    if (!this.config.sendRealEmails) {
      console.log("Not sending a real email.");

      return;
    }

    const command = new SendEmailCommand({
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Body: {
          Text: { Data: message },
        },
        Subject: { Data: subject },
      },
      Source: this.config.fromEmail,
    });

    let response = await this.ses.send(command);
    return response;
  }

  async sendNotificationEmail({ values }) {
    const mappedValues = values.map((value) => ({
      cellValue: value.cellValue,
      date: new Date(value.date).toString(),
    }));

    const message = `Found values: \n ${JSON.stringify(mappedValues, null, 2)}.`;
    const subject = "Google Spreadsheet Email Notifier Demo - The values have been found!";

    return this.sendEmail({ email: this.config.destinationEmail, message, subject });
  }
}
