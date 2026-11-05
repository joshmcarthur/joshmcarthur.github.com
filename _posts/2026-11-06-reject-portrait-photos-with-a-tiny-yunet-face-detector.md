---
title: Reject portrait photos with a tiny YuNet face detector
category: TIL
---

I run [Aotearoa, Again](https://aotearoa-again.joshmcarthur.com/), which picks
up old archival photos, colourises one a day, and publishes to YouTube, email,
Bluesky, and Instagram. Before anything hits human review, the harvester already
throws out a lot of stuff I don't want: colour originals, book covers, newspaper
spreads, and so on.

Portraits were the awkward gap for me: a studio shot of one or two people is
usually a bad fit, because I don't know who they are and colourising their face
for a daily post feels wrong. I still want crowd scenes and tiny background
faces in the frame.

I'd been manually discarding studio shots for a while, and what I wanted was a
rough "probably a portrait" signal so I'm not clicking discard on quite so many
candidates myself.

## YuNet

I've vendored [OpenCV Zoo
YuNet](https://github.com/opencv/opencv_zoo/tree/main/models/face_detection_yunet)
(`face_detection_yunet_2023mar.onnx`, MIT). The ONNX file in the repo is 227 KB,
and it runs through the `onnxruntime` gem with resize and prep using libvips
like everything else in the app.

I have a thin wrapper over the model, which pads the photo to 640×640, runs
inference, decodes boxes the same way OpenCV's `FaceDetectorYN` does, runs NMS,
and returns each face as a fraction of the image area (bounding box area over
the photo area).

## When to discard

For my specific use case, I found that discarding when there's one or two faces
and the largest covers at least 1% of the frame was a good compromise between
false positives and false negatives. Three or more faces stay even if they take
up a decent proportion of the frame, and a single tiny face stays too. In tests,
a seated studio portrait landed around 0.013; a rider in a wider scene around
0.003.
