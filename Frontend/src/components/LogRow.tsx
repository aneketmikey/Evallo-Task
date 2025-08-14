import React from "react";
import type { LogEntry } from "../types/log";
import "../styles/LogStyles.css";

interface LogRowProps {
  log: LogEntry;
}

export const LogRow: React.FC<LogRowProps> = ({ log }) => {
  return (
    <tbody className="log-table-header">
      <tr className={`log-row ${log.level}`}>
        <td className="log-cell cell-timestamp">
          {new Date(log.timestamp).toLocaleString()}
        </td>
        <td className="log-cell cell-level">{log.level}</td>
        <td className="log-cell cell-resource">{log.resourceId}</td>
        <td className="log-cell cell-trace">{log.traceId}</td>
        <td className="log-cell cell-commit">{log.commit}</td>
        <td className="log-cell cell-span">{log.spanId}</td>
        <td className="log-cell cell-message">{log.message}</td>
      </tr>
    </tbody>
  );
};
