import React from "react";
import type { LogLevel } from "../types/log";
import "../styles/LogStyles.css";
import { LogLevelOptions } from "../utils/constants";

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  levels: LogLevel[];
  onLevelsChange: (levels: LogLevel[]) => void;
  resourceId: string;
  onResourceIdChange: (value: string) => void;
  startTime: string;
  onStartTimeChange: (value: string) => void;
  endTime: string;
  onEndTimeChange: (value: string) => void;
}

const levelOptions: LogLevel[] = LogLevelOptions;

export const FilterBar: React.FC<FilterBarProps> = ({
  search,
  onSearchChange,
  levels,
  onLevelsChange,
  resourceId,
  onResourceIdChange,
  startTime,
  onStartTimeChange,
  endTime,
  onEndTimeChange,
}) => {
  const toggleLevel = (level: LogLevel) => {
    if (levels.includes(level)) {
      onLevelsChange(levels.filter((l) => l !== level));
    } else {
      onLevelsChange([...levels, level]);
    }
  };

  return (
    <div className="filter-bar">
      <input
        type="text"
        placeholder="Search message..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <div className="checkbox-group">
        {levelOptions.map((lvl) => (
          <label key={lvl}>
            <input
              type="checkbox"
              checked={levels.includes(lvl)}
              onChange={() => toggleLevel(lvl)}
            />
            {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
          </label>
        ))}
      </div>

      <input
        type="text"
        placeholder="Resource ID..."
        value={resourceId}
        onChange={(e) => onResourceIdChange(e.target.value)}
      />
      Start Time
      <input
        type="datetime-local"
        value={startTime}
        onChange={(e) => onStartTimeChange(e.target.value)}
      />
      End Time
      <input
        type="datetime-local"
        value={endTime}
        onChange={(e) => onEndTimeChange(e.target.value)}
      />
    </div>
  );
};
