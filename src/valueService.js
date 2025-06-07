export function isValueFound(cellValue, valuesToFind) {
  if (typeof cellValue !== "string" || (!cellValue) instanceof String) {
    return false;
  }

  return valuesToFind.some((value) => {
    return value.toLowerCase() === cellValue.trim().toLowerCase();
  });
}

export function getValuesForNotification({ valuesFound, valuesDump }) {
  const valuesForNotification = [];

  valuesFound.forEach((value) => {
    const existingValue = valuesDump.find((v) => v.cellValue === value.cellValue);

    if (!existingValue) {
      valuesForNotification.push(value);

      return;
    }

    const includeDate = existingValue.dates.some((d) => datesAreOnSameDay(new Date(d.date), value.date));

    if (includeDate) {
      return;
    }

    valuesForNotification.push(value);
  });

  return valuesForNotification;
}

export function createValuesDump({ valuesForNotification, valuesDump }) {
  const newValuesDump = [...valuesDump];

  valuesForNotification.forEach((value) => {
    const existingValue = newValuesDump.find((v) => v.cellValue === value.cellValue);

    if (!existingValue) {
      newValuesDump.push({
        cellValue: value.cellValue,
        dates: [{ date: value.date }],
      });

      return;
    }

    existingValue.dates.push({ date: value.date });
  });

  return newValuesDump;
}

const datesAreOnSameDay = (first, second) =>
  first.getFullYear() === second.getFullYear() && first.getMonth() === second.getMonth() && first.getDate() === second.getDate();
