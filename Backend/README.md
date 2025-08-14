# Log Ingestion Backend (Node.js + Express)

## Overview

This is the backend service for the **Log Ingestion and Querying System**.  
It provides a RESTful API to ingest structured log data and query/filter logs using a JSON file-based database.

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **File-based persistence** - Using `ndjson` for structured storage

## Prerequisites

- Node.js 20.x or higher

## Installation & Setup

1. **Clone the repository**

   ```bash
   git clone the repository
   cd Backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   Add `.env` file with your configuration:

   ```bash
   BACKEND_SERVER_PORT=3000
   ```

4. **Start the server**

   ```bash
   # Development mode

   npm run dev

   # Production mode

   npm run build
   npm start
   ```

The server will start on: `http://localhost:3000`

## API Documentation

### Log Ingestion

**POST `/api/v1/logs`**

Ingest a new log entry.

#### Request Body Schema

```json
{
  "level": "string",         // Required: error | warn | info | debug
  "message": "string",       // Required: Log message
  "resourceId": "string",    // Required: Resource identifier
  "timestamp": "string",     // Required: ISO 8601 datetime
  "traceId": "string",      // Required: Trace identifier
  "spanId": "string",       // Required: Span identifier
  "commit": "string",       // Required: Commit hash
  "metadata": {             // Required: Additional metadata
    "parentResourceId": "string"
  }
}
```

#### Response Codes

- `201` - Created: Log successfully stored
- `400` - Bad Request: Schema validation failed
- `500` - Internal Server Error

### Log Querying

**GET `/api/v1/logs`**

Retrieve logs with filtering capabilities.

#### Query Parameters

| Parameter       | Type   | Description                  |
| --------------- | ------ | ---------------------------- |
| level           | string | Filter by log level          |
| message         | string | Full-text search in messages |
| resourceId      | string | Filter by resource ID        |
| timestamp_start | string | ISO 8601 start datetime      |
| timestamp_end   | string | ISO 8601 end datetime        |

#### Example Query

```bash
GET /api/v1/logs?level=error&message=database&timestamp_start=2023-09-15T00:00:00Z
```

## Error Handling

The API uses standard HTTP status codes and returns error responses in the following format:

```json
{
  "status": 400,
  "error": "Specific errors accordingly"
}
{
  "status": 500,
  "error": "internal server error"
}
{
  "status": 500,
  "error": "Failed to append log entry"
}
```

## Monitoring & Health Checks

- **GET `/health`** - Basic health check endpoint

## Data Storage

- Logs are stored in `./data/logs.ndjson`

## Log Ingestion and Querying System — Design Decisions & Approach

## Architecture Overview

### Route Handler (`logs.ts`)

- Implements RESTful endpoints for **log ingestion** and **querying**.
- Performs **validation** and **request processing** before passing data to storage.
- Supports filtering via query parameters.

### Storage Layer (`storage.ts`)

- Manages persistent storage using **NDJSON (Newline-Delimited JSON)** format.
- Provides **streaming capabilities** for efficient log reading without loading the entire file into memory.

---

## Key Design Decisions

### 1. File Storage Format — NDJSON

**Benefits:**

- Allows **line-by-line processing** of logs.
- Supports **easy append operations** without rewriting the whole file.
- No need to load entire file into memory for reads.
- Simple backup and rotation procedures.

---

### 2. Streaming Implementation

**Benefits:**

- **Memory efficient** for large log datasets.
- Allows **early termination** when enough results are found.
- Uses **async iterator pattern** for improved control flow.
- Built-in **backpressure handling** to prevent overload.

---

### 3. Error Handling Strategy

- **Comprehensive validation** performed in route handlers before storage operations.
- **Granular error messages** provided to clients for better debugging.
- Graceful degradation on storage failures — system avoids crashes.
- Internal errors logged for developer visibility.

---

### 4. API Design Choices

- **RESTful endpoints** with clear, semantic routes.
- Filters passed as **query parameters** for flexibility.
- **Structured JSON** responses for predictable consumption.
- Proper use of **HTTP status codes** for error states and successes.

---

## Assumptions Made

### Data Volume

- Log file size is manageable on a **single machine**.
- Append operations are **infrequent** compared to read operations.
- Read operations are **more common** than writes.

### Consistency Requirements

- **Eventually consistent** reads are acceptable.
- No strict **read-after-write guarantee** required.
- System operates in a **single writer** scenario.

### Performance Expectations

- Query time may be **linear with file size**.
- Memory constraints are **not critical** for typical usage scenarios.
- No Race conditions as **unique id** is generated for each log.

---

## Summary

This design optimizes for **simplicity, memory efficiency, and developer clarity** over raw query performance.  
It is ideal for **moderate-scale logging systems** where:

- Log ingestion is straightforward.
- Read operations outnumber writes.
- Sequential file scans are acceptable given the operational constraints.

