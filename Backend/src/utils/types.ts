export type LogLevel = "error" | "warning" | "info" | "debug";

export interface LogEntry {
  id: string;
  timestamp: string; // ISO string
  level: LogLevel;
  traceId: string;
  message: string;
  commit: string;
  spanId: string;
  resourceId: string;
  metadata: Record<string, string>;
}
