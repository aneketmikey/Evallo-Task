import React from "react";
import type { LogEntry } from "../types/log";
import { LogRow } from "./LogRow";
import "../styles/LogStyles.css";

interface LogTableProps {
  logs: LogEntry[];
}

export const LogTable: React.FC<LogTableProps> = ({ logs }) => {
  return (
    <div className="log-table-container">
      <table className="log-table">
        <thead>
          <tr className="log-table-header">
            <th className="cell-timestamp">Timestamp</th>
            <th className="cell-level">Level</th>
            <th className="cell-resource">Resource ID</th>
            <th className="cell-trace">Trace ID</th>
            <th className="cell-commit">Commit</th>
            <th className="cell-span">Span ID</th>
            <th className="cell-message">Message</th>
          </tr>
        </thead>
        <>
          {logs.map((log) => (
            <LogRow key={log.id} log={log} />
          ))}
        </>
      </table>
    </div>
  );
};
