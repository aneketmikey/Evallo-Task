import fs from "fs";
import path from "path";
import readline from "readline";
import { LogEntry } from "./types";

const DATA_DIR = path.resolve(__dirname, "../../data");
const LOG_FILE = path.join(DATA_DIR, "logs.ndjson");// Newline-delimited JSON file

// Ensure the data directory and log file exist
// If not, create them
// This is a one-time setup, so we can safely ignore errors if they already exist

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(LOG_FILE))
    fs.writeFileSync(LOG_FILE, "", { encoding: "utf8" });
}

ensureDataDir();

/**
 * Append a log to the ndjson file (one JSON object per line).
 * Returns a promise that resolves once data is flushed.
 */
export async function appendLog(log: LogEntry): Promise<boolean> {
  const line = JSON.stringify(log) + "\n";
  return new Promise((resolve, reject) => {
    fs.appendFile(LOG_FILE, line, "utf8", (err) => {
      if (err) return reject(false);
      resolve(true);
    });
  });
}

/**
 * Stream logs from disk and call `onEntry(log)` for each parsed log.
 * If onEntry returns `false` (synchronously), streaming stops early.
 */
export async function streamLogs(
  onEntry: (log: LogEntry) => boolean | Promise<boolean>
): Promise<void> {
  return new Promise((resolve, reject) => {
    const input = fs.createReadStream(LOG_FILE, { encoding: "utf8" });
    const rl = readline.createInterface({ input, crlfDelay: Infinity });

    // Use async iterator instead of events
    (async () => {
      try {
        for await (const line of rl) {
          if (!line) continue;
          try {
            const obj = JSON.parse(line) as LogEntry;
            const cont = await onEntry(obj);
            if (cont === false) {
              break;
            }
          } catch (err) {
            console.error("Failed to parse line in log file:", err);
          }
        }
        resolve();
      } catch (err) {
        reject(err);
      } finally {
        rl.close();
        input.destroy();
      }
    })();
  });
}

