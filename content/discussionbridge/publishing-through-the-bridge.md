---
title: 'Hugo publishing through The Bridge'
date: 2026-09-01T00:02:00-07:00
description: 'A generated Hugo article resolved into one durable Bridge Record.'
discussionbridge_mode: 'to_discourse'
discussionbridge_publish: true
---

This article begins in Hugo. During the trusted build, the Hugo adapter sends
its stable content identity, canonical URL, title, author and bounded rendered
HTML to The Bridge.

## Stable across rebuilds

An exact rebuild or retry resolves the same Bridge Record and topic. A changed
canonical identity fails closed rather than silently creating a replacement.

{{< discussionbridge mode="fullInteractive" >}}
