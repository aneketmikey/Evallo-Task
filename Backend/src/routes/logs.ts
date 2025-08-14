import express from "express";
import { appendLog, streamLogs } from "../utils/storage";
import { LogEntry, LogLevel } from "../utils/types";
import { v4 as uuidv4 } from "uuid";
import { LogLevelOptions } from "../utils/constants";
const router = express.Router();

/**
 * POST /api/v1/logs
 * Accepts a log payload (all fields except id are accepted).
 * Server will set id (uuid) and timestamp if missing.
 */
router.post("/", async (req, res) => {
  try {
    const body = req.body;

    // Basic validation
    if (!body || typeof body !== "object") {
      return res.status(400).json({ error: "Invalid JSON body" });
    }

    const {
      timestamp,
      level,
      traceId,
      message,
      commit,
      spanId,
      resourceId,
      metadata,
    } = body;

    // level validation
    const allowedLevels: LogLevel[] = LogLevelOptions;
    if (!allowedLevels.includes(level)) {
      return res
        .status(400)
        .json({ error: `level must be one of ${allowedLevels.join(",")}` });
    }

    if (typeof message !== "string" || message.trim() === "") {
      return res
        .status(400)
        .json({ error: "message is required and must be a string" });
    }

    if (typeof resourceId !== "string" || resourceId.trim() === "") {
      return res
        .status(400)
        .json({ error: "resourceId is required and must be a string" });
    }

    // metadata must be object if provided
    if (
      metadata !== undefined &&
      (typeof metadata !== "object" || Array.isArray(metadata))
    ) {
      return res.status(400).json({ error: "metadata must be an object" });
    }

    const entry: LogEntry = {
      id: uuidv4(),
      timestamp: timestamp
        ? new Date(timestamp).toISOString()
        : new Date().toISOString(),
      level,
      traceId,
      message,
      commit,
      spanId,
      resourceId,
      metadata,
    };

    let result = await appendLog(entry);
    console.log("Log entry appended:", result);
    if (!result) {
      return res.status(500).json({ error: "Failed to append log entry" });
    }
    return res.status(201).json({ id: entry.id });
  } catch (err) {
    console.error("POST /api/logs error:", err);
    return res.status(500).json({ error: "internal server error" });
  }
});

/**
 * GET /api/v1/logs
 * Query params:
 *   - search: full-text case-insensitive search across message
 *   - level: comma-separated levels (e.g. error,info)
 *   - resourceId: substring match
 *   - startTime: ISO string (inclusive)
 *   - endTime: ISO string (inclusive)
 *
 * Returns JSON array of LogEntry in reverse-chronological order (most recent first)
 */
router.get("/", async (req, res) => {
  try {
    const { search, level, resourceId, startTime, endTime } = req.query;
    const searchStr =
      typeof search === "string" && search.trim() !== ""
        ? search.trim().toLowerCase()
        : null;
    const levels =
      typeof level === "string" && level.trim() !== ""
        ? (level as string).split(",").map((s) => s.trim())
        : null;
    const resourceFilter =
      typeof resourceId === "string" && resourceId.trim() !== ""
        ? resourceId.trim()
        : null;
    const start =
      typeof startTime === "string" && startTime
        ? new Date(startTime as string)
        : null;
    const end =
      typeof endTime === "string" && endTime
        ? new Date(endTime as string)
        : null;

    const matches: LogEntry[] = [];

    // Stream through the file and push matches.
    // We'll collect and sort in-memory by timestamp descending.
    await streamLogs((log) => {
      // filter by level(s)
      if (levels && levels.length > 0) {
        if (!levels.includes(log.level)) return true; // continue
      }

      // resourceId substring
      if (resourceFilter) {
        if (!log.resourceId.includes(resourceFilter)) return true;
      }

      // timestamp range
      const ts = new Date(log.timestamp);
      if (start && ts < start) return true;
      if (end && ts > end) return true;

      // search on message (case-insensitive)
      if (searchStr) {
        if (!log.message || !log.message.toLowerCase().includes(searchStr))
          return true;
      }

      matches.push(log);

      return true; // continue reading
    });

    // sort reverse-chronological
    matches.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return res.json(matches);
  } catch (err) {
    console.error("GET /api/logs error:", err);
    return res.status(500).json({ error: "internal server error" });
  }
});

export default router;
