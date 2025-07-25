---
layout: post-topographic
title: "Testing Topographic Blog Layout"
date: 2025-01-25
featured_image: "/img/sample-project.jpg"
projects:
  - name: "Contour Generation System"
    url: "#"
    description: "Dynamic SVG contour generation that wraps around actual content shapes rather than bounding boxes."
  - name: "Elevation Mapping"
    url: "#"
    description: "CSS-based elevation system that assigns topographic meaning to different content types."
---

This is a test post to demonstrate the new topographic layout system. The contours you see are generated dynamically based on the actual content shapes and their assigned elevation levels.

## How It Works

The system analyzes each content element and assigns it an elevation based on its semantic importance:

- **Post titles** are peaks (elevation 100)
- **Featured images** are plateaus (elevation 80)
- **Project sections** are ridges (elevation 70)
- **Main content** forms slopes (elevation 50)
- **Individual projects** are foothills (elevation 30)
- **Navigation elements** are markers (elevation 20)

## Technical Implementation

The contour generation uses a simplified marching squares algorithm to trace elevation boundaries. Each content element contributes to an elevation grid with distance-based falloff, creating natural topographic transitions.

The SVG contours are rendered with subtle glows and transparency to maintain readability while adding the topographic aesthetic that reflects your civil engineering and geospatial background.

## Future Enhancements

- River systems for content flow
- Interactive elevation controls
- Seasonal color schemes
- Performance optimizations for complex layouts