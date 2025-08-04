---
title: Emote
layout: case_study
url: https://github.com/joshmcarthur/cleanish-clock
featured_image:
  - /img/case-studies/emote-dark.webp
  - /img/case-studies/emote-light.webp
summary: |
  Emote is a Flutter mobile application designed for emotional check-ins to support positive mental health. The app allows users to record their emotional states through a hierarchical emotion selection system and provides analytics to track emotional patterns over time.
---

Emote is a Flutter mobile application designed for emotional check-ins to support positive mental health. The app allows users to record their emotional states through a hierarchical emotion selection system and provides analytics to track emotional patterns over time. All data is stored locally on the device with no cloud integration to support privacy and offline functionality.

### Technology Stack

**Primary Technologies:**
- **Flutter/Dart** - Cross-platform mobile framework
- **SQLite** - Local database storage
- **Flutter Local Notifications** - Reminder system

**Development Tools:**
- Flutter Driver for integration testing
- Flutter Test for unit testing
- Gradle for Android builds

### Development Timeline

**Initial Development (2019-2020):**
- Initial commit with basic emotion check-in functionality
- Early refactoring to separate classes into files
- Implementation of local notifications and reminder scheduling
- Basic UI improvements and preference persistence

**Major Feature Additions:**
- **v1.3.0** (Feb 2020) - Check-in export functionality (CSV format)
- **v1.4.0** (Feb 2020) - Analytics support with multiple chart types
- **v1.5.0** (Mar 2020) - Flutter 0.17 upgrade and UI improvements

**Database Evolution:**
- **v3 Migration** (Feb 2020) - Major database schema refactor:
  - Migrated emotion tree from hardcoded structure to database table
  - Abstracted database layer from check-in repository
  - Implemented upgrade/downgrade migration paths
  - Added transaction support

**Testing Infrastructure:**
- Integration tests for SQLite interactions
- Flutter Driver integration tests
- Widget and unit test coverage

## Architecture Patterns

**Repository Pattern:**
- Separate repositories for emotions (`EmotionRepository`) and check-ins (`CheckinRepository`)
- Abstract `EmotionResolver` interface for database operations
- Clean separation between data access and business logic

**Hierarchical Data Model:**
- Three-level emotion hierarchy (primary → secondary → tertiary)
- Parent-child relationships stored in database with foreign keys
- Color-coded emotion system with depth-based opacity

**Observer Pattern:**
- `FutureBuilder` widgets for reactive UI updates
- Database changes trigger automatic UI refreshes

**Adapter Pattern:**
- `NotificationAdapter` wraps Flutter Local Notifications
- `DatabaseAdapter` provides singleton database access

**Navigation Architecture:**
- Route-based navigation with `MaterialPageRoute`
- Global navigator key for notification-triggered navigation
- Tab-based analytics interface with multiple chart views

### Challenges Faced

**Database Migration Complexity:**
- Major schema refactor from v2 to v3 required careful migration logic
- Emotion tree migration from hardcoded structure to database table
- Implemented both upgrade and downgrade paths for version compatibility

**Timezone Handling:**
- Ensuring timezone-safe date grouping and presentation
- Ensuring timezone-safe scheduled notifications
- Regression tests for timezone-safe date operations

**UI State Management:**
- Resolving issues with ListView not reloading data after refactoring
- ChoiceChip selection state management in dark theme
- FloatingActionButton workflow control implementation

**Testing Challenges:**
- Integration test setup for SQLite interactions
- Widget test implementation for complex UI components
- Flutter Driver integration test configuration

**Data Export Implementation:**
- CSV export functionality required careful data formatting
- File sharing integration across platforms
- Simple data visualisation and reporting
