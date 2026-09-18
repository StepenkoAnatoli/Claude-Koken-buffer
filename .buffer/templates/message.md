---
protocol: buffer/v1
id: msg_YYYYMMDDTHHMMSSmmmZ_0123456789ab
sender: example-sender
recipient: example-recipient
thread_id: thr_example-thread
timestamp: 2026-09-18T00:00:00.000Z
intent: request
status: queued
---

Replace this text with a non-empty, UTF-8 message body.

For a real message, replace every placeholder before saving this file outside
`.buffer/templates/`. `queued` is only valid for an unrouted outbox message;
use `routed` in the sender and thread copies after routing, `pending` in an
inbox copy, and `archived` in an archive copy.
