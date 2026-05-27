# Product Requirements Document
## VedaAI — AI Assessment Creator
**Version:** 1.0  
**Date:** May 27, 2026  
**Role:** Full Stack Engineer Assignment  
**Status:** Draft

---

## Table of Contents

1. Overview
2. Goals & Success Criteria
3. User Personas
4. System Architecture
5. Feature Requirements
6. Frontend Specifications
7. Backend Specifications
8. AI Layer Specifications
9. Data Models
10. API Contracts
11. WebSocket Events
12. State Management
13. Non-Functional Requirements
14. Bonus Features
15. Constraints & Risks
16. Deliverables Checklist

---

## 1. Overview

VedaAI Assessment Creator is a full-stack web application that allows teachers to create structured examination papers using AI. A teacher fills out an assignment form (topic, difficulty, question types, marks, etc.), submits it, and the system asynchronously generates a well-formatted question paper via an LLM. The output is displayed in a clean, exam-paper-like UI and can optionally be exported as a PDF.

The system uses a job queue (BullMQ) to handle AI generation in the background, Redis for caching and job state, MongoDB for persistence, and WebSockets to push real-time progress updates to the frontend.

---

## 2. Goals & Success Criteria

### Primary Goals
- Allow teachers to create assignment configurations through a validated form UI.
- Asynchronously generate a structured question paper using an LLM.
- Display the generated paper in an exam-ready, hierarchical format.
- Provide real-time status updates during generation via WebSocket.

### Success Criteria
| Metric | Target |
|---|---|
| Assignment creation form submission | < 2 seconds round trip to queue |
| AI generation time (end-to-end) | < 30 seconds for typical paper |
| WebSocket update delivery | < 500ms lag from worker event |
| Output rendering | Structured sections, no raw LLM text |
| Mobile responsiveness | Usable on 375px viewport |

---

## 3. User Personas

### Primary: Teacher / Educator
- Wants to create question papers quickly without manual effort.
- Needs to specify subject, difficulty, number of questions, marks distribution, and question types.
- Expects a clean, print-ready output.

### Secondary: Student (Output Consumer)
- Views or receives the generated paper.
- Fills in Name, Roll Number, and Section on the output page.
- Not a system user; interacts only with the final rendered output.

---

## 4. System Architecture

### High-Level Flow

```
Teacher (Browser)
    |
    | HTTP POST /api/assignments
    v
Express API Server (Node.js + TypeScript)
    |
    | Enqueue job
    v
BullMQ Job Queue  <-->  Redis (job state + cache)
    |
    | Worker picks up job
    v
AI Worker (LLM call + prompt structuring)
    |
    | Parse + store result
    v
MongoDB (assignments + generated papers)
    |
    | Emit event
    v
WebSocket Server
    |
    | Push update
    v
Teacher (Browser) — renders output page
```

### Component Breakdown

| Component | Technology |
|---|---|
| Frontend | Next.js 14+ (App Router), TypeScript |
| State Management | Zustand |
| Styling | Tailwind CSS |
| Backend API | Node.js + Express (TypeScript) |
| Database | MongoDB (Mongoose ODM) |
| Cache / Job State | Redis |
| Job Queue | BullMQ |
| AI Provider | Anthropic Claude API (or OpenAI GPT-4) |
| Real-Time | WebSocket (ws or socket.io) |
| PDF Export (Bonus) | Puppeteer or react-pdf |

---

## 5. Feature Requirements

### F1 — Assignment Creation Form
**Priority:** P0 (Required)

The teacher fills out a form to define the parameters of the question paper.

**Fields:**

| Field | Type | Validation |
|---|---|---|
| Title / Subject | Text | Required, max 200 chars |
| Topic / Chapter | Text | Required |
| Class / Grade | Select or Text | Required |
| Due Date | Date Picker | Required, must be in the future |
| Question Types | Multi-select | At least one selected (MCQ, Short Answer, Long Answer, True/False, Fill in the Blank) |
| Number of Questions | Number input per type | Required, min 1, no negatives |
| Marks per Question | Number input per type | Required, min 1, no negatives |
| Difficulty Distribution | Slider or Select | Easy / Medium / Hard percentage mix |
| Additional Instructions | Textarea | Optional, max 500 chars |
| Reference File Upload | File input | Optional; PDF or .txt only, max 5MB |

**Validation Rules:**
- No field that is "Required" may be empty on submission.
- Number fields must be positive integers.
- Total questions across all types must be ≥ 1.
- Due date must be ≥ today's date.
- Uploaded file must be PDF or plain text; reject other formats with a clear error message.

**UX:**
- Inline field-level error messages (show on blur or submit).
- Submit button disabled until the form is valid.
- Loading state on the submit button during API call.

---

### F2 — Job Queue & Background Processing
**Priority:** P0 (Required)

Upon form submission, the backend does not process the generation synchronously.

**Flow:**
1. Frontend POSTs assignment data to `POST /api/assignments`.
2. API validates the payload, creates an Assignment document in MongoDB with `status: "pending"`, and enqueues a BullMQ job.
3. API returns `{ assignmentId, status: "pending" }` immediately (HTTP 202 Accepted).
4. BullMQ worker picks up the job and calls the LLM.
5. Worker parses the response, stores the generated paper in MongoDB, updates `status: "completed"`.
6. Worker emits a WebSocket event to the relevant client session.

**Redis Usage:**
- Cache completed question papers by `assignmentId` (TTL: 1 hour) to avoid re-querying MongoDB on repeated views.
- Store job progress state (e.g., `{ step: "generating", progress: 40 }`) for polling fallback.

---

### F3 — AI Question Generation
**Priority:** P0 (Required)

The worker must not pass the raw form data directly to the LLM. It must construct a structured prompt and parse a structured response.

**Prompt Engineering:**

The worker builds a prompt that instructs the LLM to return a JSON object with a specific schema (see Data Models section). The prompt includes:
- Subject, topic, grade level
- Total number of questions per type
- Difficulty distribution
- Marks per question type
- Any additional instructions from the teacher
- Reference file content (if uploaded, extracted as text)

**LLM Response Parsing:**
- The LLM is instructed to respond only with valid JSON.
- The worker parses the JSON and validates it against the expected schema before storing.
- If parsing fails, the job retries up to 3 times with a fallback prompt that reinforces JSON-only output.
- On final failure, the assignment `status` is set to `"failed"` and the frontend is notified.

**Output Structure:**
- Grouped into Sections (e.g., Section A: MCQ, Section B: Short Answer).
- Each section has a title, instruction, and list of questions.
- Each question has: question text, type, difficulty tag, and marks.

---

### F4 — WebSocket Real-Time Updates
**Priority:** P0 (Required)

The frontend opens a WebSocket connection after submitting the form and listens for events tied to the `assignmentId`.

**Events (Server → Client):**

| Event | Payload | Description |
|---|---|---|
| `job:queued` | `{ assignmentId }` | Job successfully added to queue |
| `job:processing` | `{ assignmentId, progress }` | Worker has started, with optional % progress |
| `job:completed` | `{ assignmentId }` | Generation done; frontend should fetch result |
| `job:failed` | `{ assignmentId, error }` | Generation failed; show error state |

**Frontend Behavior:**
- On receiving `job:completed`, redirect to the output page or fetch the result automatically.
- On `job:failed`, display a user-friendly error with a Retry option.
- Gracefully handle WebSocket disconnects with exponential backoff reconnection.

---

### F5 — Output / Question Paper Page
**Priority:** P0 (Required)

The generated paper is displayed in a structured, exam-paper-style layout.

**Page Layout:**

```
┌────────────────────────────────────────┐
│  [School / Institution Name]           │
│  Subject: Mathematics  Class: 10       │
│  Time: 2 Hours  Max Marks: 80         │
├────────────────────────────────────────┤
│  Student Information                   │
│  Name: ___________  Roll No: _______  │
│  Section: _______                      │
├────────────────────────────────────────┤
│  Section A — Multiple Choice           │
│  Instruction: Attempt all questions    │
│                                        │
│  1. [Question text]           [2 Marks]│
│     [Easy]                             │
│                                        │
│  2. [Question text]           [2 Marks]│
│     [Medium]                           │
├────────────────────────────────────────┤
│  Section B — Short Answer              │
│  ...                                   │
└────────────────────────────────────────┘
```

**Required UI Elements:**

- Paper header (subject, class, max marks, time).
- Student info section with editable input lines (Name, Roll Number, Section).
- Sections rendered in order (A, B, C...).
- Each section: title, instruction line, questions list.
- Each question: number, question text, difficulty badge (color-coded), marks aligned right.

**Difficulty Badge Colors:**
- Easy → Green
- Medium / Moderate → Amber / Yellow
- Hard → Red

**Action Bar (top of page):**
- Regenerate button (triggers a new generation job for the same assignment config).
- Download as PDF button (bonus).
- Back to form button.

---

## 6. Frontend Specifications

### Pages & Routes

| Route | Description |
|---|---|
| `/` or `/create` | Assignment creation form |
| `/assignments/[id]/status` | Loading/status page while job processes |
| `/assignments/[id]/paper` | Generated question paper output |

### Component Tree (High Level)

```
App
├── CreateAssignmentPage
│   ├── AssignmentForm
│   │   ├── FormField (reusable)
│   │   ├── QuestionTypeConfigurator
│   │   ├── FileUploader
│   │   ├── DifficultySelector
│   │   └── SubmitButton
│   └── ValidationSummary
├── StatusPage
│   ├── ProgressIndicator
│   └── WebSocketListener
└── PaperOutputPage
    ├── PaperHeader
    ├── StudentInfoSection
    ├── SectionBlock (repeated)
    │   ├── SectionHeader
    │   └── QuestionItem (repeated)
    │       ├── QuestionText
    │       ├── DifficultyBadge
    │       └── MarksLabel
    └── ActionBar
        ├── RegenerateButton
        ├── DownloadPDFButton (bonus)
        └── BackButton
```

### State Management (Zustand)

**Store: `assignmentStore`**
```typescript
interface AssignmentState {
  form: AssignmentFormData;
  currentAssignmentId: string | null;
  jobStatus: 'idle' | 'pending' | 'processing' | 'completed' | 'failed';
  jobProgress: number;
  generatedPaper: GeneratedPaper | null;
  wsConnected: boolean;

  setFormField: (field: keyof AssignmentFormData, value: any) => void;
  submitAssignment: () => Promise<void>;
  setJobStatus: (status: JobStatus) => void;
  setPaper: (paper: GeneratedPaper) => void;
}
```

### WebSocket Management (Frontend)

- Establish connection on mount of `StatusPage` using the `assignmentId`.
- Use a custom hook `useAssignmentSocket(assignmentId)` that:
  - Opens a WebSocket connection.
  - Dispatches Zustand actions on events.
  - Cleans up on unmount.
  - Implements reconnection with exponential backoff (max 5 retries).

---

## 7. Backend Specifications

### API Endpoints

#### `POST /api/assignments`
Create a new assignment and enqueue a generation job.

**Request Body:**
```json
{
  "title": "string",
  "topic": "string",
  "grade": "string",
  "dueDate": "ISO8601 date string",
  "questionTypes": [
    { "type": "MCQ", "count": 10, "marksEach": 2 }
  ],
  "difficulty": { "easy": 40, "medium": 40, "hard": 20 },
  "instructions": "string (optional)",
  "referenceFileKey": "string (optional, S3 or local path)"
}
```

**Response (202):**
```json
{
  "assignmentId": "string",
  "status": "pending"
}
```

---

#### `GET /api/assignments/:id`
Get assignment metadata and job status.

**Response (200):**
```json
{
  "assignmentId": "string",
  "status": "pending | processing | completed | failed",
  "progress": 0,
  "createdAt": "ISO8601"
}
```

---

#### `GET /api/assignments/:id/paper`
Get the generated question paper. Returns cached version from Redis if available.

**Response (200):**
```json
{
  "assignmentId": "string",
  "paper": { ... GeneratedPaper schema ... }
}
```

**Response (404):** If not yet generated or failed.

---

#### `POST /api/assignments/:id/regenerate`
Re-enqueue a generation job for an existing assignment config.

**Response (202):**
```json
{
  "assignmentId": "string",
  "status": "pending"
}
```

---

#### `POST /api/upload`
Upload a reference PDF or text file.

**Request:** multipart/form-data with file.  
**Response (200):** `{ "fileKey": "string" }`

---

### BullMQ Queue

**Queue Name:** `question-generation`

**Job Data:**
```typescript
interface GenerationJobData {
  assignmentId: string;
  formData: AssignmentFormData;
  referenceText?: string; // extracted from uploaded file
}
```

**Worker Behavior:**
1. Extract and validate `jobData`.
2. Build structured LLM prompt.
3. Call LLM API.
4. Parse and validate JSON response.
5. Store in MongoDB; cache in Redis.
6. Emit WebSocket event.
7. On failure: retry up to 3 times; mark as `failed` on exhaustion.

**BullMQ Job Options:**
```typescript
{
  attempts: 3,
  backoff: { type: 'exponential', delay: 2000 }
}
```

---

### WebSocket Server

- Use `ws` library or `socket.io`.
- Clients subscribe to a room/channel identified by `assignmentId`.
- Worker emits events to the relevant room after each state change.
- Heartbeat ping every 30 seconds to detect dead connections.

---

## 8. AI Layer Specifications

### Prompt Template

```
You are an expert educator. Generate a structured question paper in JSON format only.

Assignment Details:
- Subject: {{subject}}
- Topic: {{topic}}
- Grade: {{grade}}
- Additional Instructions: {{instructions}}

Question Configuration:
{{#each questionTypes}}
- {{type}}: {{count}} questions, {{marksEach}} marks each
{{/each}}

Difficulty Distribution:
- Easy: {{difficulty.easy}}%
- Medium: {{difficulty.medium}}%
- Hard: {{difficulty.hard}}%

{{#if referenceText}}
Reference Material:
{{referenceText}}
{{/if}}

Return ONLY a valid JSON object matching this exact schema. No prose, no markdown, no explanation:
{
  "title": "string",
  "subject": "string",
  "grade": "string",
  "totalMarks": number,
  "sections": [
    {
      "id": "A",
      "title": "Section A — Multiple Choice Questions",
      "instruction": "Attempt all questions",
      "questions": [
        {
          "number": 1,
          "text": "Question text here",
          "type": "MCQ",
          "difficulty": "easy | medium | hard",
          "marks": 2
        }
      ]
    }
  ]
}
```

### Response Validation

After receiving the LLM response, the worker validates:
- Top-level keys: `title`, `subject`, `grade`, `totalMarks`, `sections`.
- Each section has `id`, `title`, `instruction`, `questions`.
- Each question has `number`, `text`, `type`, `difficulty`, `marks`.
- `difficulty` value is one of `"easy"`, `"medium"`, `"hard"`.
- `marks` is a positive integer.
- Total questions match the requested count (within ±1 tolerance).

If validation fails, the worker logs the raw response and retries with a stricter prompt.

---

## 9. Data Models

### MongoDB: `Assignment`

```typescript
{
  _id: ObjectId,
  title: string,
  topic: string,
  grade: string,
  dueDate: Date,
  questionTypes: [{ type: string, count: number, marksEach: number }],
  difficulty: { easy: number, medium: number, hard: number },
  instructions: string,
  referenceFileKey: string,
  status: 'pending' | 'processing' | 'completed' | 'failed',
  jobId: string,
  createdAt: Date,
  updatedAt: Date
}
```

### MongoDB: `GeneratedPaper`

```typescript
{
  _id: ObjectId,
  assignmentId: ObjectId (ref: Assignment),
  title: string,
  subject: string,
  grade: string,
  totalMarks: number,
  sections: [
    {
      id: string,
      title: string,
      instruction: string,
      questions: [
        {
          number: number,
          text: string,
          type: string,
          difficulty: 'easy' | 'medium' | 'hard',
          marks: number
        }
      ]
    }
  ],
  generatedAt: Date,
  version: number  // increments on regeneration
}
```

### Redis Keys

| Key Pattern | Value | TTL |
|---|---|---|
| `paper:{assignmentId}` | Serialized GeneratedPaper JSON | 1 hour |
| `job:progress:{assignmentId}` | `{ step, progress }` JSON | 1 hour |

---

## 10. API Contracts

### Error Response Schema

All error responses follow:
```json
{
  "error": {
    "code": "VALIDATION_ERROR | NOT_FOUND | GENERATION_FAILED | ...",
    "message": "Human-readable message",
    "details": {}
  }
}
```

### HTTP Status Codes Used

| Code | Meaning |
|---|---|
| 200 | OK |
| 202 | Accepted (job enqueued) |
| 400 | Bad Request (validation failure) |
| 404 | Resource not found |
| 409 | Conflict (e.g., regeneration while already processing) |
| 500 | Internal Server Error |

---

## 11. WebSocket Events

### Client → Server

| Event | Payload | Description |
|---|---|---|
| `subscribe` | `{ assignmentId }` | Subscribe to updates for an assignment |
| `unsubscribe` | `{ assignmentId }` | Unsubscribe |
| `ping` | — | Heartbeat |

### Server → Client

| Event | Payload | Description |
|---|---|---|
| `job:queued` | `{ assignmentId }` | Job added to queue |
| `job:processing` | `{ assignmentId, progress: number }` | Worker running |
| `job:completed` | `{ assignmentId }` | Paper ready |
| `job:failed` | `{ assignmentId, error: string }` | Generation failed |
| `pong` | — | Heartbeat response |

---

## 12. State Management

### Zustand Store Structure

```typescript
// assignmentStore.ts
interface AssignmentFormData {
  title: string;
  topic: string;
  grade: string;
  dueDate: string;
  questionTypes: QuestionTypeConfig[];
  difficulty: DifficultyConfig;
  instructions: string;
  referenceFile: File | null;
}

interface QuestionTypeConfig {
  type: 'MCQ' | 'ShortAnswer' | 'LongAnswer' | 'TrueFalse' | 'FillBlank';
  count: number;
  marksEach: number;
}

interface DifficultyConfig {
  easy: number;    // percentage
  medium: number;
  hard: number;
}

type JobStatus = 'idle' | 'pending' | 'processing' | 'completed' | 'failed';

interface AssignmentState {
  form: AssignmentFormData;
  formErrors: Partial<Record<keyof AssignmentFormData, string>>;
  currentAssignmentId: string | null;
  jobStatus: JobStatus;
  jobProgress: number;
  generatedPaper: GeneratedPaper | null;
  wsConnected: boolean;
  // Actions
  updateForm: (updates: Partial<AssignmentFormData>) => void;
  validateForm: () => boolean;
  submitAssignment: () => Promise<void>;
  setJobStatus: (status: JobStatus, progress?: number) => void;
  setPaper: (paper: GeneratedPaper) => void;
  resetForm: () => void;
}
```

---

## 13. Non-Functional Requirements

### Performance
- API response for job enqueueing: < 500ms.
- Redis cache hit for paper retrieval: < 50ms.
- WebSocket event delivery: < 500ms after worker emits.
- LLM generation: target < 25 seconds; show progress indicator during wait.

### Reliability
- BullMQ jobs retry up to 3 times on failure.
- Failed jobs log the raw LLM response and error for debugging.
- MongoDB indexes on `assignmentId` and `status` for efficient queries.

### Security
- Input sanitization on all text fields (XSS prevention).
- File upload validation: MIME type + extension check; scan for executable content.
- Environment variables for all secrets (LLM API key, MongoDB URI, Redis URI).
- Rate limiting on `POST /api/assignments` (e.g., 10 requests/minute per IP).

### Scalability
- BullMQ supports horizontal worker scaling; the queue decouples load.
- Redis caching reduces repeated LLM calls for the same paper.
- MongoDB supports sharding for long-term growth.

### Accessibility
- All form inputs have associated labels.
- Error messages are linked to fields via `aria-describedby`.
- Keyboard navigation works for all interactive elements.
- Color is not the only indicator of difficulty (badge also has text label).

### Mobile Responsiveness
- Form and output page usable at 375px minimum viewport width.
- Font sizes ≥ 14px for readability.
- Action bar stacks vertically on small screens.

---

## 14. Bonus Features

### B1 — PDF Export
**Signal value: High**

On the output page, a "Download PDF" button generates a properly formatted PDF of the question paper.

**Implementation options:**
- Puppeteer (headless Chrome): renders the page HTML and exports as PDF. Best fidelity.
- `@react-pdf/renderer`: renders a defined React component tree to PDF. Better for styling control.

The PDF must include:
- Paper header, student info boxes, all sections and questions.
- Difficulty badges rendered as colored labels (not just text).
- Page numbers and proper margins.

### B2 — Regenerate with Feedback
The Regenerate action on the output page optionally accepts a short note from the teacher (e.g., "Make questions harder", "Remove duplicate questions") that is appended to the next generation prompt.

### B3 — Improved Caching
- Cache partial progress in Redis so that if the worker crashes and restarts mid-job, it can resume from the last checkpoint rather than restarting from scratch.
- Cache LLM responses by a hash of the prompt inputs (subject + topic + config hash) with a longer TTL (24 hours) so identical assignments don't re-call the LLM.

### B4 — UI Polish
- Subtle entry animations for question items as the paper renders.
- Print stylesheet (`@media print`) for clean browser printing separate from PDF export.
- Dark mode support.

---

## 15. Constraints & Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| LLM returns malformed JSON | Medium | High | Retry with stricter prompt; validate schema; fallback error state |
| LLM rate limits / timeouts | Medium | Medium | BullMQ retry with backoff; surface timeout error clearly |
| WebSocket connection drops | Medium | Medium | Reconnect with backoff; polling fallback on `job:status` endpoint |
| Uploaded file too large / wrong type | Low | Low | Server-side MIME + size validation before enqueue |
| Redis/MongoDB unavailable | Low | High | Circuit breaker pattern; health check endpoint |
| LLM generates inappropriate content | Low | Medium | Prompt includes explicit instruction to stay on-topic educationally |

---

## 16. Deliverables Checklist

### Required
- [ ] Next.js frontend with TypeScript
- [ ] Assignment creation form with full validation
- [ ] Zustand state management
- [ ] WebSocket client integration (subscribe / receive events)
- [ ] Express backend with TypeScript
- [ ] MongoDB models: Assignment, GeneratedPaper
- [ ] Redis caching (paper + job state)
- [ ] BullMQ job queue + worker
- [ ] WebSocket server with room-based subscriptions
- [ ] LLM prompt construction and structured JSON parsing
- [ ] Output page with sections, questions, difficulty badges, marks
- [ ] Student info editable fields (Name, Roll No, Section)
- [ ] Action bar (Regenerate, Back)
- [ ] Mobile-responsive layout
- [ ] GitHub repository with clean code and setup instructions
- [ ] README with architecture overview and approach

### Bonus
- [ ] PDF export (Puppeteer or react-pdf)
- [ ] Regenerate with teacher feedback note
- [ ] Improved prompt caching (hash-based, 24h TTL)
- [ ] UI animations and polish
- [ ] Dark mode

---

## Appendix: Environment Variables

```env
# Backend
PORT=3001
MONGODB_URI=mongodb://localhost:27017/vedaai
REDIS_URL=redis://localhost:6379
LLM_PROVIDER=anthropic           # or openai
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...            # if using OpenAI
JWT_SECRET=...                   # if auth is added

# Frontend (Next.js)
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

---

*End of Document*
