import { JWT } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";
import EmailClient from "./EmailClient.js";
import S3Client from "./S3Client.js";
import { isValueFound, getValuesForNotification, createValuesDump } from "./valueService.js";

export async function runWorker({ config, data }) {
  const jwt = new JWT({
    email: config.googleCredentials.email,
    key: config.googleCredentials.key,
    scopes: config.googleCredentials.scopes,
  });
  const doc = new GoogleSpreadsheet(data.spreadsheetId, jwt);

  const emailClient = new EmailClient({ config: config.ses });
  const s3Client = new S3Client({ config: config.s3 });

  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];

  const { startingCell, endingCell, valuesToFind } = data;

  await sheet.loadCells(`${startingCell}:${endingCell}`);

  const valuesFound = [];

  for (let i = startingCell.charCodeAt(0); i <= endingCell.charCodeAt(0); i++) {
    for (let j = Number(startingCell.slice(1)); j <= Number(endingCell.slice(1)); j++) {
      const cellIndex = String.fromCharCode(i) + j;

      const cell = sheet.getCellByA1(cellIndex);

      if (isValueFound(cell.value, valuesToFind)) {
        valuesFound.push({
          cellValue: cell.value,
          date: new Date(),
        });
      }
    }
  }

  if (!valuesFound.length) {
    console.log("None of the values were found.");

    return;
  }

  console.log("Found values:", { valuesFound });

  const valuesDump = await s3Client.getValuesForNotification();

  const valuesForNotification = getValuesForNotification({ valuesFound, valuesDump });

  if (!valuesForNotification.length) {
    return;
  }

  console.log("Values to notify:", { valuesForNotification });

  await emailClient.sendNotificationEmail({ values: valuesForNotification });

  const newValuesDump = createValuesDump({ valuesForNotification, valuesDump });

  await s3Client.putValuesToNotification(newValuesDump);
}
