---
title: Clippy
layout: case_study
url: https://github.com/joshmcarthur/clippy
featured_image: /img/case-studies/clippy.webp
summary: |
  Clippy is a Ruby on Rails web application that processes video and audio files by extracting audio, transcribing it using OpenAI's Whisper API, and generating summaries with entity extraction
---

Clippy is a Ruby on Rails web application that processes video and audio files by extracting audio, transcribing it using OpenAI's Whisper API, and generating summaries with entity extraction. The application is designed primarily for meeting recordings but can handle any spoken audio content. It features a real-time processing pipeline with background job processing and provides an interactive web interface for viewing transcripts with synchronized media playback.

### Technology Stack

**Backend:**

- Ruby 3.3.0 with Rails 7.1.3
- Litestack for SQLite support in production
- Puma web server with Thruster for SSL/HTTP2

**Frontend:**

- Hotwire (Turbo + Stimulus) for reactive UI
- Bootstrap 5 for styling and components
- Sass for CSS preprocessing
- Importmap for JavaScript module management

**AI/Processing:**

- OpenAI API (Whisper for transcription, GPT for summarization)
- FFmpeg for audio extraction and video processing
- Image processing with libvips

**Infrastructure:**

- Docker containerization
- Active Storage for file management
- ActionCable for real-time updates
- Self-hostable with local file storage

### Development Timeline

**March 2024 - Initial Development:**

- 03/25: Core functionality added (uploads, transcripts, summaries, segments)
- 03/26: Added additional summary fields
- 03/25-26: Audio segments and language support added

**April 2024 - Feature Expansion:**

- 04/01: Enhanced audio segments with text formatting
- 04/06: Added processing timestamps
- 04/10: Implemented clips functionality
- 04/16: Added processing stage tracking

This project was developed over approximately 3 weeks with rapid iteration and feature additions.

### Architecture Patterns

**Pipeline Pattern:** The application implements a processing pipeline with defined stages (pending → started → extracting_audio → transcribing → collating → summarising → complete) managed through state machines and background jobs.

**Job Queue Pattern:** Uses Rails' ActiveJob for asynchronous processing, allowing the web interface to remain responsive during long-running transcription and summarization tasks.

**Observer Pattern:** Implements Rails' `broadcasts_refreshes` for real-time UI updates when processing stages change.

**Repository Pattern:** Clean separation between models (Upload, Transcript, AudioSegment, etc.) with well-defined relationships and responsibilities.

**Service Object Pattern:** Processing logic is encapsulated in specialized job classes (ExtractAudioJob, TranscribeAudioSegmentJob, etc.) rather than being embedded in models.

**Real-time Synchronization:** Uses Stimulus controllers for client-side media synchronization with transcript segments, enabling click-to-seek functionality and automatic scrolling.

### Challenges Faced

**File Processing Complexity:** The application handles multiple file formats (video/audio) requiring FFmpeg integration and chunking of large files to work within OpenAI's 25MB upload limit.

**Asynchronous Processing:** Managing the multi-stage processing pipeline with proper error handling and state management across background jobs.

**Real-time UI Updates:** Implementing live progress updates and synchronized media playback without page refreshes using ActionCable and Stimulus.

**Cost Management:** Processing costs can be significant (~$0.30/hour of audio), so the application is built to support local processing and other OpenAI-compatible services.

**Security Considerations:** The application is intentionally unauthenticated, requiring deployment behind a proxy (Nginx/Caddy) for access control in production environments. I deploy this application behind Cloudflare Access.

**Configuration Management:** API keys and credentials support multiple sources, including environment variables, Rails encrypted credentials, and local files, to aid in self-hosting.
