---
title: Droplet
layout: case_study
featured_image: /img/case-studies/droplet.webm
summary: |
  Droplet is a macOS menubar application built with SwiftUI that simplifies file sharing by allowing users to drag-and-drop files for automatic upload to Amazon S3 buckets, generating shareable URLs with a streamlined configuration interface.
---

Droplet is a SwiftUI menubar application for macOS that enables drag-and-drop file uploads to Amazon S3. When a file is dropped onto the app's popover, it uploads to a configured S3 bucket, generates a presigned URL, and automatically copies the URL to the clipboard. The app includes a settings interface for AWS credentials and bucket configuration.

### Technology Stack

**Primary Languages & Frameworks:**
- **Swift**
- **SwiftUI** for UI components
- **AppKit/Cocoa** for menubar integration and system-level functionality

**Key Dependencies:**
- **SotoS3** - AWS SDK for Swift, handling S3 operations and presigned URL generation
- **AVFoundation** - For file handling
- **UserNotifications** - For local notification system

**Development Tools:**
- **Xcode** project structure
- **Git** for version control
- **macOS** as target platform

### Development Timeline

**November 2021 Development Cycle:**
- **Nov 9**: Initial commits with working version and README
- **Nov 11**: Core functionality - icon addition, UI improvements for file uploads
- **Nov 12**: Major feature additions:
  - Settings view implementation ("really hacky settings view")
  - AWS client integration into drop delegate
  - Local notification system for background uploads
  - Security entitlements for non-App Store release
  - UI polish and demo updates

**Development Pattern:** Rapid iterative development over 4 days with focus on core functionality first, then user experience improvements.

### Architecture Patterns

**Design Patterns:**
- **Delegate Pattern** - `DropletDropDelegate` implements `DropDelegate` for drag-and-drop functionality
- **App Delegate Pattern** - `DropletAppDelegate` manages application lifecycle and menubar integration
- **MVVM-like Structure** - SwiftUI views with `@State` and `@AppStorage` for data binding
- **Dependency Injection** - AWS client instantiated within drop delegate for latest settings

**Key Architectural Decisions:**
- **Menubar-only Interface** - Uses `LSUIElement` to run without dock icon
- **Popover-based UI** - Settings and main interface share same popover space
- **App Sandbox** - Implements macOS security model with minimal required permissions
- **Asynchronous Upload** - Multipart upload with progress tracking and background completion
- **Persistent Settings** - Uses `@AppStorage` for AWS credentials persistence

### Challenges Faced

**Technical Challenges:**
- **AWS Client Lifecycle Management** - Initially had separate AWS client file, later moved client initialization into drop delegate to ensure latest settings are used
- **Background Upload Handling** - Implemented local notifications for when uploads complete while app is not in foreground
- **Security Entitlements** - Created separate entitlements file for non-App Store distribution with hardened security settings
- **File Type Detection** - Comprehensive MIME type mapping system for proper S3 content-type headers

**UI/UX Challenges:**
- **Settings Integration** - into a predominantly on-demand, menubar application
- **Popover Management** - Complex logic for showing/hiding multi-state UI within the same popover space
- **Progress Indication** - Upload progress tracking and UI state management during file operations
