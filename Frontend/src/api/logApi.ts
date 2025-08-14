import type { LogEntry, LogLevel } from "../types/log";
import { BASE_URL } from "../utils/constants";

export const ingestLog = async (log: Omit<LogEntry, "id">): Promise<void> => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(log),
  });
  if (!res.ok) {
    throw new Error(`Failed to ingest log: ${res.statusText}`);
  }
};

interface FetchLogsFilters {
  search?: string;
  level?: LogLevel[];
  resourceId?: string;
  startTime?: string;
  endTime?: string;
}

export const fetchLogs = async (
  filters?: FetchLogsFilters
): Promise<LogEntry[]> => {
  const params = new URLSearchParams();

  if (filters) {
    if (filters.search) params.append("search", filters.search);
    if (filters.level?.length) params.append("level", filters.level.join(","));
    if (filters.resourceId) params.append("resourceId", filters.resourceId);
    if (filters.startTime) params.append("startTime", filters.startTime);
    if (filters.endTime) params.append("endTime", filters.endTime);
  }

  const res = await fetch(`${BASE_URL}?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch logs: ${res.statusText}`);
  }
  return await res.json();
};
