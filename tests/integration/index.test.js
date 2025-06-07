import "dotenv/config";
import fs from "fs";

import { handler } from "../../src/index.js";

const event = JSON.parse(fs.readFileSync("event.json", "utf-8"));

await handler(event);
