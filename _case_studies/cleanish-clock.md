---
title: Cleanish Clock
layout: case_study
url: https://github.com/joshmcarthur/cleanish-clock
featured_image:
  - /img/case-studies/cleanish-clock-light.webp
  - /img/case-studies/cleanish-clock-dark.webp
  - /img/case-studies/cleanish-clock-widget.webp
  - /img/case-studies/cleanish-clock-standby.webp
summary: |
  Cleanish Clock is a minimal iOS clock widget application inspired by Android launcher clock widgets. The project provides a clean, no-nonsense digital clock display that works both as a standalone app and as iOS home screen widgets.
---

Cleanish Clock is a minimal iOS clock widget application inspired by Android launcher clock widgets. The project provides a clean, no-nonsense digital clock display that works both as a standalone app and as iOS home screen widgets. The app intentionally avoids App Store distribution due to Apple's Minimum Functionality requirements, instead focusing on providing a simple, elegant time display solution for users who build it themselves.

### Technology Stack

**Primary Technologies:**

- **Swift** - Main programming language
- **SwiftUI** - UI framework for both main app and widget
- **WidgetKit** - iOS widget framework for home screen integration
- **Xcode** - Development environment and build system

**Build & Deployment:**

- **Codemagic** - CI/CD pipeline for automated builds
- **iOS 14.2+** - Minimum deployment target for main app
- **iOS 17.0+** - Deployment target for widget features (StandBy mode support)

**Platform Support:**

- iPhone (portrait and landscape orientations)
- iPad (all orientations)
- iOS Widgets (systemSmall and systemMedium sizes)

### Development Timeline

- **iOS 14.2** - Initial release targeting iOS 14.2 minimum
- **iOS 17.0** - Added StandBy mode support for newer iOS versions
- **Continuous Integration** - Codemagic CI/CD pipeline established for automated builds

### Architecture Patterns

**Design Patterns:**

- **MVVM with SwiftUI** - Uses SwiftUI's declarative syntax with state management
- **Timeline Provider Pattern** - WidgetKit's TimelineProvider for efficient widget updates
- **Observer Pattern** - Timer.publish for real-time clock updates in main app

**Key Architectural Decisions:**

- **Minimalist Approach** - Single ContentView with minimal state management
- **Widget-First Design** - Primary focus on widget functionality over app features
- **Responsive Layout** - Dynamic sizing based on widget family (small vs medium)
- **System Integration** - Uses UIColor.label and UIColor.secondaryLabel for automatic dark/light mode support

**Code Organization:**

- **Separation of Concerns** - Main app and widget extension as separate targets
- **Static Configuration** - Widget uses StaticConfiguration for predictable updates
- **Formatted Display** - Centralized date/time formatting with DateFormatter

### Challenges Faced

**Platform Limitations:**

- **App Store Restrictions** - Apple's Minimum Functionality guidelines prevented App Store distribution
- **Widget Background Constraints** - iOS prevents transparent backgrounds in widgets for security reasons
- **Deployment Complexity** - Requires manual building and installation due to App Store limitations

**Technical Challenges:**

- **Timeline Management** - Complex widget update scheduling (24-hour timeline with minute-level granularity)
- **Font Rendering** - Custom tracking (-1.5) and system font usage for consistent display
- **Multi-Device Support** - Responsive design for different widget sizes and orientations
- **StandBy Mode Integration** - iOS 17+ feature requiring different layout considerations

**Development Constraints:**

- **Minimal Feature Set** - Intentional limitation to core clock functionality
- **Distribution Model** - Reliance on source code distribution rather than App Store
