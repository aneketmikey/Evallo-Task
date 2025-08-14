import React, { useEffect, useState } from "react";
import { FilterBar } from "../components/FilterBar";
import { LogTable } from "../components/LogTable";
import { fetchLogs } from "../api/logApi";
import type { LogEntry, LogLevel } from "../types/log";

export const LogViewerPage: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [search, setSearch] = useState("");
  const [levels, setLevels] = useState<LogLevel[]>([]);
  const [resourceId, setResourceId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    const loadLogs = async () => {
      const data = await fetchLogs({
        search,
        level: levels,
        resourceId,
        startTime,
        endTime,
      });
      setLogs(data);
    };
    loadLogs();
  }, [search, levels, resourceId, startTime, endTime]);

  return (
    <div>
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        levels={levels}
        onLevelsChange={setLevels}
        resourceId={resourceId}
        onResourceIdChange={setResourceId}
        startTime={startTime}
        onStartTimeChange={setStartTime}
        endTime={endTime}
        onEndTimeChange={setEndTime}
      />
      <LogTable logs={logs} />
    </div>
  );
};
