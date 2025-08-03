---
title: Virtualtrails
layout: case_study
url: https://virtualtrails.app
featured_image: /img/case-studies/virtualtrails.webp
summary: VirtualTrails is a map-based web application that enables users to track their progress along virtual trails individually or in teams, with fitness platform integrations and achievement systems to encourage behavioral change.
---
<br>
VirtualTrails is a web application that allows users to complete virtual trails by recording their progress along predefined routes, either individually or as part of a team. The application focuses on behavior change rather than complex features, built primarily around a map-based user interface. Users can earn achievements by reaching milestone distances, and journeys can be shared for others to view. The platform supports both competitive and collaborative journey modes, with integration to fitness platforms like Fitbit, Strava, and Garmin for automatic progress tracking.

### Technology Stack

**Backend:**
- Ruby on Rails (Ruby web framework)
- PostgreSQL (primary database)
- GoodJob (background job processing)
- Puma (web server)

**Frontend:**
- TypeScript/JavaScript with Shakapacker (webpack)
- Bootstrap (CSS framework)
- Mapbox GL (mapping and geospatial features)
- Stimulus (JavaScript framework)
- Turbo (SPA-like navigation)

**Authentication & Integration:**
- Devise (authentication)
- OmniAuth (OAuth providers: Google, Apple, Fitbit, Strava, Garmin)
- Apple Push Notification Service (APNS)
- Fitness Platforms: Fitbit, Strava, Garmin, Apple Health

**Development & Testing:**
- Minitest/RSpec (testing framework)
- Capybara (system testing)
- Jest (JavaScript testing)
- ESLint/Prettier (code formatting)
- RuboCop (Ruby linting)

**Infrastructure:**
- Fly.io (hosting platform)
- Docker (containerization)
- Sentry (error monitoring)

### Development Timeline

**Early Development (2023):**
- Initial Rails application setup with core models
- Basic journey and user functionality
- Database migrations starting from February 2023

**Feature Development (2023-2024):**
- Team and collaborative journey features
- Challenge system implementation (November 2023)
- Fitness platform integrations (Fitbit, Strava, Garmin)
- Competition journey mode development (June 2024)

**Recent Enhancements (2024+):**
- Competitive journey leaderboards and features
- Shared journey improvements
- APNS refactoring for better reliability
- Push notification enhancements
- Achieved service long-term stability

### Architecture Patterns

**Domain-Driven Design:**
- Clear separation of concerns with dedicated models for journeys, teams, challenges, and progress updates
- Rich domain models with business logic encapsulated in model classes

**Service Objects:**
- Processor classes for handling external API data
- Timeline aggregator for complex query orchestration
- View objects for representing complex data required for specific views

**Policy-Based Authorization:**
- Pundit integration for fine-grained access control
- Separate policy classes for different resources

**Background Job Processing:**
- GoodJob for asynchronous processing of fitness data sync
- Webhook processing for external platform integrations

**Hotwire Native Integration:**
- Companion iOS app built with SwiftUI and Hotwire Native
- Native functionality for Apple Health sync and push notifications

**API Integration Patterns:**
- Webhook-based data synchronization with fitness platforms
- OAuth flows for platform authorization
- Push notification services for real-time updates

### Challenges Faced

**Data Integration Complexity:**
- Multiple fitness platform integrations (Fitbit, Strava, Garmin) with different APIs and data formats
- Webhook reliability and data consistency issues
- Activity processing edge cases

**Architectural Decisions:**
- Competition journey mode requiring careful data modeling for leaderboards and progress tracking
- Auditable progress updates based on the source(s) of data contributing to route progress

**Technical Challenges:**
- APNS connection management and reliability
- Progress update distance capping to prevent overshooting route distances
- Apple Health sync reliability and data consistency
- Leveraging solid core data model to build complex features

**Performance Considerations:**
- Large competition timelines requiring optimization for multiple participants
- Map rendering performance with multiple competitor markers
- Database query optimization for complex journey relationships

**Security & Privacy:**
- OAuth token management across multiple platforms
- User data privacy in competitive/collaborative features
- Session management and authentication security