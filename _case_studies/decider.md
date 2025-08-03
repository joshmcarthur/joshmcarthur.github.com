---
title: Decider
layout: case_study
url: https://apps.apple.com/nz/app/list-decider/id6742088444
featured_image:
  - /img/case-studies/decider-choice-light.webp
  - /img/case-studies/decider-main-light.webp
summary: |
  Decider is a privacy-focused iOS/iPadOS/macOS app that helps users make decisions by randomly selecting from a list of options, supporting multiple input methods like clipboard text, live text scanning, and share extensions.
---

Decider is a lightweight iOS/iPadOS/macOS app that helps users make decisions by randomly selecting from a list of options. The app supports multiple input methods including clipboard text, live text scanning, and share extensions, with support for checkbox lists. It's designed as a privacy-focused tool with no data collection, processing everything on-device and storing history locally.

## Technology Stack
- **Primary Language**: Swift 5.0
- **UI Framework**: SwiftUI
- **Platform Support**: iOS 17.6+, iPadOS 17.6+, macOS 14.0+
- **Development Environment**: Xcode 15.0+
- **Key Frameworks**:
  - VisionKit (for text scanning)
  - UniformTypeIdentifiers (for file type handling)
  - UIKit (for share extension)
  - SwiftUI (for main app interface)
- **Architecture**: MVVM with ObservableObject pattern
- **Data Storage**: UserDefaults with JSON encoding/decoding

## Architecture Patterns
- **MVVM Architecture**: Uses `@ObservableObject` classes for state management
- **Cross-Platform Design**: Conditional compilation with `#if canImport(AppKit)` for macOS compatibility
- **Shared Code Patterns**: `AnimatedSelectionView` shared between main app and share extension
- **Extension Architecture**: Share extension using UIKit with SwiftUI integration via `UIHostingController`
- **Data Persistence**: Simple JSON-based persistence using `UserDefaults` and `Codable` protocol
- **Error Handling**: Comprehensive error handling with user-friendly alerts and fallbacks

## Challenges Faced
- **Cross-Platform Compatibility**: Managing different clipboard APIs (`NSPasteboard` vs `UIPasteboard`) and conditional compilation
- **Text Processing Complexity**: Checkbox list parsing with `[ ]` and `[x]` format support
- **Share Extension Integration**: Complex text extraction from various data types (String, Data, URL) with multiple fallback mechanisms
- **Animation Performance**: Custom confetti animation system with particle management and timing coordination
- **State Management**: Coordinating state between main app and share extension while maintaining data consistency
- **Input Validation**: Robust error handling for edge cases like single-item lists, empty text, and malformed input
- **Privacy Requirements**: Ensuring all processing happens on-device with no network dependencies
