---
title: Photonook
layout: case_study
url: https://github.com/joshmcarthur/photonook
summary: |
  PhotoNook is a web and native application ecosystem that transforms old tablets into digital photo frames.
featured_image:
  - /img/case-studies/photonook-app.webp
  - /img/case-studies/photonook-frame.webp
---

PhotoNook is a family photo sharing application designed to repurpose old tablets into digital photo frames while providing simple photo sharing from mobile devices via a iOS and Android app. The core concept is a dual-mode progressive web application that can operate as either a kiosk device (photo display) or a publisher (photo sharing interface). The application uses a privacy-first approach with temporary photo storage that acts as a distribution proxy, automatically deleting photos after successful distribution to frames.

### Technology Stack

**Backend:**
- Ruby on Rails
- SQLite database (development) / PostgreSQL (production)
- Solid Queue for background job processing
- Active Storage for image handling with ImageMagick/Vips
- Authentication-zero for authentication
- Pundit for authorization
- OmniAuth for OAuth integrations (Google Photos)
- WebAuthn for passwordless authentication

**Frontend:**
- Server-side rendering with Rails views
- Bootstrap 5.3 with utility API for styling
- Stimulus.js for JavaScript interactions
- Turbo for SPA-like navigation
- React.js for device frame interface
- Progressive Web App (PWA) capabilities
- Service Workers for offline functionality

**Infrastructure:**
- Action Mailbox for email processing
- Background job processing for photo sync
- Temporary photo storage with auto-deletion

### Development Timeline

- **May 2025**: Initial user system setup
- **June 2025**: Core data models (accounts, devices, photo sources, cached photos)
- **July 2025**: Advanced features (device events, email integration, verification codes)

Key milestones:
- User authentication system (late May 2025)
- Multi-tenant account architecture (June 2025)
- Device management and photo sources (June 2025)
- Google Photos integration (June 2025)
- Email photo sharing (July 2025)
- Device event tracking (July 2025)
- Role-based access control (July 2025)

### Architecture Patterns

**Multi-Tenant Architecture:**
- Account-scoped models with `belongs_to :account` relationships
- Secure token-based device authentication
- Role-based user permissions (admin, member, viewer)

**Privacy-First Design:**
- Temporary photo storage with automatic expiration
- No permanent photo storage on servers
- Backend acts as distribution proxy only
- Encrypted credentials storage

**Dual-Mode Application:**
- Publisher mode for photo sharing and management
- Frame mode for photo display on tablets
- Responsive design with mobile-first approach
- Progressive Web App capabilities

**Service Worker Pattern:**
- Aggressive photo caching for offline viewing
- Background sync for new photos
- Cache management with size limits
- Offline-first photo display

**Background Job Processing:**
- Solid Queue for reliable job processing
- Periodic photo source synchronization
- Image optimization and resizing
- Webhook processing for external integrations

### Challenges Faced

**Complex Photo Flow Architecture:**
- Multiple photo sources (Google Photos, email, uploads)
- Temporary storage with automatic cleanup
- Device-specific photo feeds
- Real-time synchronization across devices

**Offline Functionality:**
- Service worker implementation for photo caching
- Background sync for device events
- Cache size management and cleanup
- Offline-first photo display requirements

**Multi-Device Synchronization:**
- Device approval workflow
- Secure token-based API access
- Real-time photo distribution
- Event tracking across devices

**OAuth Integration Complexity:**
- Google Photos API integration
- Token refresh and management
- Photo picker session handling
- Album-based photo selection

**Email Processing:**
- Action Mailbox for inbound email processing
- Attachment validation and processing
- Device-specific email addresses
- Error handling and user notifications