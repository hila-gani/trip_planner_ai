# Trip Planner AI

A full-stack AI-powered travel planning application that generates personalized trip itineraries based on user preferences.  
The project combines a modern Next.js frontend with a backend pipeline that uses Retrieval-Augmented Generation (RAG) to provide context-aware travel recommendations.

---

## Features

- **Personalized Trip Generation** — Create customized travel itineraries using Gemini AI.
- **RAG-Based Recommendation Pipeline** — Enhance AI responses with relevant contextual information.
- **Interactive Maps Integration** — Visualize locations and routes using the Google Maps API.
- **Modern Responsive UI** — Built with React, Next.js, and Tailwind CSS.
- **Type-Safe Development** — Implemented with TypeScript for improved maintainability and reliability.

---

## Tech Stack

### Frontend
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS

### Backend
- Python
- SQL

### AI / ML
- Google Gemini API
- Sentence Embeddings
- Vector Similarity Search
- Retrieval-Augmented Generation (RAG)

### Tools
- Git
- ESLint
- PostCSS

---

## Engineering Highlights

### Semantic Retrieval Pipeline
Implemented embedding-based semantic search using vector similarity to retrieve contextually relevant travel information for the LLM.

### RAG Workflow
Built a Retrieval-Augmented Generation pipeline that injects relevant context into prompts before itinerary generation.

### Component-Based Architecture
Designed a modular React architecture with reusable UI components and custom hooks for state management.

### Interactive User Experience
Integrated Google Maps APIs for location visualization and route exploration.

---

## Project Structure

```text
.
├── frontend/
├── backend/
├── public/
└── README.md
```

---

## Getting Started

### Install dependencies

```bash
npm install
```

### Run the frontend

```bash
npm run dev
```

### Run the backend

```bash
python app.py
```

---

## Demo

(Add screenshots or GIFs here)

---

## Future Improvements

- Real-time travel data integration
- Multi-user trip collaboration
- Budget optimization and recommendation ranking
- Deployment and cloud scaling
