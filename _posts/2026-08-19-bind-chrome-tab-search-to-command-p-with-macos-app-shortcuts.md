---
title: Bind Chrome Tab Search to Command-P with macOS App Shortcuts
category: TIL
---

I wanted ⌘P to open Chrome's Tab Search to leverage my muscle memory from VS Code. Chrome doesn't let you rebind its built-in shortcuts — ⌘P is wired to Print, Tab Search is wired to ⌘⇧A, and neither shows up in Chrome's shortcut settings (chrome://settings/shortcuts).

On macOS you can get there with App Shortcuts. You're not changing Chrome's internal bindings, you're assigning ⌘P to the Search Tabs menu command, and macOS takes precedence over Chrome's Print dialog.

1. System Settings → Keyboard → Keyboard Shortcuts…
2. App Shortcuts
3. Click +
4. Application: Google Chrome
5. Menu Title: Search Tabs…
6. Keyboard Shortcut: ⌘P
7. Done, then quit and reopen Chrome

The menu item is 'Search Tabs…' (normally ⌘⇧A). If ⌘P doesn't work after that, open Chrome's Window or View menu and copy the menu item's wording exactly. Some versions show "Search tabs" instead of "Search Tabs…", depending on locale.

You don't lose printing — File → Print still works, or give Print its own shortcut if you want.

I've found this a pretty good use of App Shortcuts: Tab Search becomes your ⌘P equivalent of VSCode's palette.
