import assert from "assert";
import { describe, it } from "node:test";
import { getValuesForNotification, createValuesDump, isValueFound } from "../../src/valueService.js";

describe("isValueFound", () => {
  it("should return true if value matches exactly (case-insensitive)", () => {
    // given
    const valuesToFind = ["Alice", "Bob"];
    // when
    const result = isValueFound("alice", valuesToFind);
    // then
    assert.strictEqual(result, true);
  });

  it("should return true if value matches with extra spaces", () => {
    // given
    const valuesToFind = ["Alice", "Bob"];
    // when
    const result = isValueFound("  Bob  ", valuesToFind);
    // then
    assert.strictEqual(result, true);
  });

  it("should return false if value does not match", () => {
    // given
    const valuesToFind = ["Alice", "Bob"];
    // when
    const result = isValueFound("Charlie", valuesToFind);
    // then
    assert.strictEqual(result, false);
  });

  it("should return false if value is not a string", () => {
    // given
    const valuesToFind = ["Alice", "Bob"];
    // when
    const result = isValueFound(123, valuesToFind);
    // then
    assert.strictEqual(result, false);
  });

  it("should return false if value is an empty string", () => {
    // given
    const valuesToFind = ["Alice", "Bob"];
    // when
    const result = isValueFound("", valuesToFind);
    // then
    assert.strictEqual(result, false);
  });
});

describe("getValuesForNotification", () => {
  it("should notify all values if valuesDump is empty", () => {
    // given
    const valuesFound = [
      { cellValue: "Alice", date: new Date("2025-06-01") },
      { cellValue: "Bob", date: new Date("2025-06-01") },
    ];
    const valuesDump = [];

    // when
    const result = getValuesForNotification({ valuesFound, valuesDump });

    // then
    assert.deepStrictEqual(result, valuesFound);
  });

  it("should not notify values already notified for the same date", () => {
    // given
    const valuesFound = [
      { cellValue: "Alice", date: new Date("2025-06-01") },
      { cellValue: "Bob", date: new Date("2025-06-01") },
    ];
    const valuesDump = [
      {
        cellValue: "Alice",
        dates: [
          {
            date: new Date("2025-06-01"),
          },
        ],
      },
    ];

    // when
    const result = getValuesForNotification({ valuesFound, valuesDump });

    // then
    assert.deepStrictEqual(result, [valuesFound[1]]);
  });

  it("should not notify values already notified for the same date for serialized date", () => {
    // given
    const valuesFound = [
      { cellValue: "Alice", date: new Date("2025-06-01") },
      { cellValue: "Bob", date: new Date("2025-06-01") },
    ];
    const valuesDump = [
      {
        cellValue: "Alice",
        dates: [
          {
            date: "2025-06-01T00:00:00.000Z",
          },
        ],
      },
    ];

    // when
    const result = getValuesForNotification({ valuesFound, valuesDump });

    // then
    assert.deepStrictEqual(result, [valuesFound[1]]);
  });

  it("should notify values if date is different", () => {
    // given
    const valuesFound = [{ cellValue: "Alice", date: new Date("2025-06-02") }];
    const valuesDump = [
      {
        cellValue: "Alice",
        dates: [
          {
            date: new Date("2025-06-01"),
          },
        ],
      },
    ];

    // when
    const result = getValuesForNotification({ valuesFound, valuesDump });

    // then
    assert.deepStrictEqual(result, valuesFound);
  });
});

describe("createValuesDump", () => {
  it("should add new values to dump", () => {
    // given
    const valuesForNotification = [{ cellValue: "Alice", date: new Date("2025-06-01") }];
    const valuesDump = [];

    // when
    const result = createValuesDump({ valuesForNotification, valuesDump });

    // then
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].cellValue, "Alice");
    assert.strictEqual(result[0].dates[0].date.getTime(), new Date("2025-06-01").getTime());
  });

  it("should append date to existing value", () => {
    // given
    const valuesForNotification = [{ cellValue: "Alice", date: new Date("2025-06-02") }];
    const valuesDump = [
      {
        cellValue: "Alice",
        dates: [
          {
            date: new Date("2025-06-01"),
          },
        ],
      },
      {
        cellValue: "Bob",
        dates: [
          {
            date: new Date("2025-06-01"),
          },
        ],
      },
    ];

    // when
    const result = createValuesDump({ valuesForNotification, valuesDump });

    // then
    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0].dates.length, 2);
    assert.strictEqual(result[0].dates[0], valuesDump[0].dates[0]);
    assert.strictEqual(result[0].dates[1].date.getTime(), new Date("2025-06-02").getTime());
    assert.strictEqual(result[1], valuesDump[1]);
  });

  it("should add values with the same cellValue under one value in dump", () => {
    // given
    const valuesForNotification = [
      { cellValue: "Alice", date: new Date("2025-06-01") },
      { cellValue: "Alice", date: new Date("2025-06-02") },
    ];
    const valuesDump = [];

    // when
    const result = createValuesDump({ valuesForNotification, valuesDump });

    // then
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].dates.length, 2);
    assert.strictEqual(result[0].cellValue, "Alice");
    assert.strictEqual(result[0].dates[0].date, valuesForNotification[0].date);
    assert.strictEqual(result[0].dates[1].date, valuesForNotification[1].date);
  });
});
