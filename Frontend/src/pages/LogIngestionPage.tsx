import React, { useState } from "react";
import { ingestLog } from "../api/logApi";
import type { LogLevel } from "../types/log";
import "../styles/LogIngestionPage.css";

export const LogIngestionPage: React.FC = () => {
  const [level, setLevel] = useState<LogLevel>("info");
  const [message, setMessage] = useState("");
  const [resourceId, setResourceId] = useState("");
  const [traceId, setTraceId] = useState("");
  const [commit, setCommit] = useState("");
  const [spanId, setSpanId] = useState("");
  const [metadata, setMetadata] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("");
    try {
      await ingestLog({
        timestamp: new Date().toISOString(),
        level,
        message,
        resourceId,
        traceId,
        commit,
        spanId,
        metadata: JSON.parse(metadata),
      });
      setMessage("");
      setResourceId("");
      setTraceId("");
      setCommit("");
      setSpanId("");
      setMetadata("");
      setStatus("✅ Log ingested successfully!");
    } catch (err) {
      console.error(err);
      console.log("Failed to ingest log:", err);
      setStatus("❌ Failed to ingest log.");
    }
  };

  return (
    <form className="log-ingestion-form" onSubmit={handleSubmit}>
      <h2 className="log-ingestion-title">Ingest Log</h2>
      {status && (
        <p
          className={`log-ingestion-status ${
            status.includes("✅")
              ? "log-ingestion-status-success"
              : "log-ingestion-status-error"
          }`}
        >
          {status}
        </p>
      )}
      <select
        className="log-ingestion-select"
        value={level}
        onChange={(e) => setLevel(e.target.value as LogLevel)}
      >
        <option value="info">Info</option>
        <option value="warning">Warning</option>
        <option value="error">Error</option>
        <option value="debug">Debug</option>
      </select>
      <input
        className="log-ingestion-input"
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
      />
      <input
        className="log-ingestion-input"
        placeholder="Resource ID"
        value={resourceId}
        onChange={(e) => setResourceId(e.target.value)}
        required
      />
      <input
        className="log-ingestion-input"
        placeholder="Trace ID"
        value={traceId}
        onChange={(e) => setTraceId(e.target.value)}
        required
      />
      <input
        className="log-ingestion-input"
        placeholder="Commit"
        value={commit}
        onChange={(e) => setCommit(e.target.value)}
        required
      />
      <input
        className="log-ingestion-input"
        placeholder="Span ID"
        value={spanId}
        onChange={(e) => setSpanId(e.target.value)}
        required
      />
      <textarea
        className="log-ingestion-textarea"
        placeholder="Metadata JSON"
        value={metadata}
        onChange={(e) => setMetadata(e.target.value)}
        rows={2}
      />
      <button className="log-ingestion-button" type="submit">
        Submit
      </button>
    </form>
  );
};
