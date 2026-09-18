#!/usr/bin/env bash
# Test suite for the koken-bus CLI.
# Runs against a THROWAWAY copy of the bus in a temp dir — never touches bus/threads.
# Usage: bus/test.sh

set -uo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PASS=0
FAIL=0

ok()   { PASS=$((PASS+1)); printf '  \033[32mpass\033[0m %s\n' "$1"; }
bad()  { FAIL=$((FAIL+1)); printf '  \033[31mFAIL\033[0m %s\n'  "$1"; [ -n "${2:-}" ] && printf '       %s\n' "$2"; }

# assert_ok <desc> <cmd...>
assert_ok() { local d="$1"; shift; if out=$("$@" 2>&1); then ok "$d"; else bad "$d" "$out"; fi; }
# assert_fail <desc> <cmd...>   (expects non-zero exit)
assert_fail() { local d="$1"; shift; if out=$("$@" 2>&1); then bad "$d" "expected failure, got success"; else ok "$d"; fi; }
# assert_contains <desc> <needle> <cmd...>
assert_contains() {
  local d="$1" n="$2"; shift 2
  out=$("$@" 2>&1)
  if grep -qF -- "$n" <<<"$out"; then ok "$d"; else bad "$d" "missing '$n' in: ${out:0:300}"; fi
}

# assert_absent <desc> <needle> <cmd...>  (needle must NOT appear)
assert_absent() {
  local d="$1" n="$2"; shift 2
  out=$("$@" 2>&1)
  if grep -qF -- "$n" <<<"$out"; then bad "$d" "unexpected '$n' in: ${out:0:300}"; else ok "$d"; fi
}

SANDBOX="$(mktemp -d)"
trap 'rm -rf "$SANDBOX"' EXIT
mkdir -p "$SANDBOX/bus"
cp -r "$REPO/bus/lib" "$REPO/bus/buffer" "$REPO/bus/modules.json" "$SANDBOX/bus/"
touch "$SANDBOX/real-artifact.md"
B="$SANDBOX/bus/buffer"

printf '\n\033[1mkoken-bus test suite\033[0m\n\n'

printf '\033[1m▸ setup\033[0m\n'
assert_ok        "init creates the layout"                 "$B" init
assert_ok        "validate passes on an empty bus"         "$B" validate
assert_contains  "modules lists registered participants" "copilot" "$B" modules

printf '\n\033[1m▸ send\033[0m\n'
assert_ok        "send a basic note"     "$B" send --thread t1 --from human --to arena --intent note --subject "hello world" --body "Body text."
assert_contains  "message id is derived" "t1.001.human"  "$B" thread t1
assert_contains  "recipient inbox filled" "t1.001.human" "$B" inbox arena
assert_ok        "bus still valid"       "$B" validate

printf '\n\033[1m▸ send validation\033[0m\n'
assert_fail  "rejects unregistered sender"     "$B" send --thread t1 --from nobody --to arena --intent note --subject x --body y
assert_fail  "rejects unregistered recipient"  "$B" send --thread t1 --from human --to nobody --intent note --subject x --body y
assert_fail  "rejects unknown intent"          "$B" send --thread t1 --from human --to arena --intent gossip --subject x --body y
assert_fail  "rejects missing subject"         "$B" send --thread t1 --from human --to arena --intent note --body y
assert_fail  "rejects missing recipient"       "$B" send --thread t1 --from human --intent note --subject x --body y
assert_fail  "rejects non-kebab thread"        "$B" send --thread "Bad Thread" --from human --to arena --intent note --subject x --body y
assert_fail  "rejects bad date format"         "$B" send --thread t1 --from human --to arena --intent note --subject x --body y --date "18/09/2026"
assert_fail  "review without --re is rejected" "$B" send --thread t1 --from arena --to human --intent review --subject x --body y
assert_fail  "--re must resolve"               "$B" send --thread t1 --from arena --to human --intent review --re t1.999.ghost --subject x --body y

printf '\n\033[1m▸ authority\033[0m\n'
assert_fail  "agent cannot send status agreed" "$B" send --thread t1 --from arena --to human --intent decision --status agreed --subject x --body y
assert_ok    "human can send status agreed"    "$B" send --thread t1 --from human --to arena --intent decision --status agreed --subject "ruling" --body "Decided."
assert_contains "agreed message is not in an inbox" "○" "$B" inbox arena --all

printf '\n\033[1m▸ replies and transitions\033[0m\n'
"$B" send --thread t2 --from human --to gpt --intent ask --subject "a question" --body "Q?" >/dev/null
assert_contains "ask lands in recipient inbox" "t2.001.human" "$B" inbox gpt
"$B" send --thread t2 --from gpt --to human --via human --intent answer --re t2.001.human --subject "an answer" --body "A." >/dev/null
assert_absent   "answering clears the inbox" "t2.001.human" "$B" inbox gpt
assert_contains "reply marks original answered" "answered" "$B" thread t2
assert_ok       "bus valid after reply" "$B" validate

# terminal status must survive a later reply
"$B" send --thread t3 --from human --to arena --intent decision --status agreed --subject "binding" --body "Bound." >/dev/null
"$B" send --thread t3 --from arena --to human --intent review --re t3.001.human --subject "late comment" --body "Note." >/dev/null
if grep -q '^status: agreed' "$SANDBOX"/bus/threads/t3/001-*.md; then
  ok "reply does NOT downgrade an agreed decision"
else
  bad "reply does NOT downgrade an agreed decision" "status was overwritten"
fi

printf '\n\033[1m▸ route and archive\033[0m\n'
"$B" send --thread t4 --from human --to arena --intent propose --subject "routable" --body "P." >/dev/null
assert_ok       "route adds a recipient"        "$B" route t4.001.human --to claude
assert_contains "new recipient sees it" "t4.001.human" "$B" inbox claude
assert_ok       "unroute clears pointers"       "$B" route t4.001.human --unroute
assert_absent   "inbox empty after unroute" "t4.001.human" "$B" inbox claude
assert_contains "unroute returns it to draft" "draft" "$B" thread t4
assert_ok       "bus valid after unroute"     "$B" validate
assert_ok       "re-route restores"             "$B" route t4.001.human
assert_ok       "archive marks handled"         "$B" archive t4.001.human
assert_absent   "archived leaves the inbox" "t4.001.human" "$B" inbox arena
assert_contains "archive keeps the file" "t4.001.human" "$B" thread t4
assert_fail     "archive rejects unknown status" "$B" archive t4.001.human --status bogus
assert_contains "archive --status agreed refused for agent sender" "skipped" "$B" archive t3.002.arena --status agreed

printf '\n\033[1m▸ draft\033[0m\n'
"$B" send --thread t5 --from human --to arena --intent note --subject "draft msg" --body "D." --draft >/dev/null
assert_absent   "draft is not in the inbox" "t5.001.human" "$B" inbox arena
assert_ok       "routing a draft opens it" "$B" route t5.001.human
assert_contains "opened draft appears" "t5.001.human" "$B" inbox arena

printf '\n\033[1m▸ artifacts\033[0m\n'
assert_ok   "existing artifact accepted" "$B" send --thread t6 --from human --to arena --intent note --subject "with artifact" --body "A." --artifacts real-artifact.md
assert_ok   "bus valid with artifact"    "$B" validate
"$B" send --thread t6 --from human --to arena --intent note --subject "ghost artifact" --body "A." --artifacts does-not-exist.md >/dev/null 2>&1
assert_fail "validate rejects a missing artifact path" "$B" validate
rm -rf "$SANDBOX/bus/threads/t6"
find "$SANDBOX/bus/inbox" "$SANDBOX/bus/outbox" "$SANDBOX/bus/archive" -name '*.ptr' -exec grep -l 't6/' {} \; 2>/dev/null | xargs -r rm -f
assert_ok   "bus valid again after cleanup" "$B" validate

printf '\n\033[1m▸ corruption detection\033[0m\n'
CORRUPT="$SANDBOX/bus/threads/t1/001-human-to-arena-hello-world.md"
cp "$CORRUPT" "$SANDBOX/backup.md"
sed -i 's/^spec: .*/spec: wrong-spec\/9/' "$CORRUPT"
assert_fail "validate catches a wrong spec" "$B" validate
cp "$SANDBOX/backup.md" "$CORRUPT"

sed -i 's/^id: .*/id: not-a-valid-id/' "$CORRUPT"
assert_fail "validate catches a malformed id" "$B" validate
cp "$SANDBOX/backup.md" "$CORRUPT"

sed -i 's/^to: .*/to: [ghostmodule]/' "$CORRUPT"
assert_fail "validate catches an unregistered recipient" "$B" validate
cp "$SANDBOX/backup.md" "$CORRUPT"

sed -i '1d' "$CORRUPT"
assert_fail "validate catches missing front matter" "$B" validate
cp "$SANDBOX/backup.md" "$CORRUPT"

echo "bus/threads/t1/nonexistent.md" > "$SANDBOX/bus/inbox/arena/dangling.ptr"
assert_fail "validate catches a dangling pointer" "$B" validate
rm -f "$SANDBOX/bus/inbox/arena/dangling.ptr"
assert_ok   "validate clean after repairs" "$B" validate

printf '\n\033[1m▸ reindex (repair path)\033[0m\n'
# Pointers are a DERIVED git-visible index; envelopes are the source of truth.
# Destroying the index must not lose a single message.
find "$SANDBOX/bus/inbox" "$SANDBOX/bus/outbox" "$SANDBOX/bus/archive" -name '*.ptr' -delete
assert_contains "inbox survives total pointer loss" "t5.001.human" "$B" inbox arena
assert_contains "reindex rebuilds pointers" "rebuilt" "$B" reindex
assert_ok       "bus valid after reindex"   "$B" validate
if [ -f "$SANDBOX"/bus/inbox/arena/001-human-to-arena-draft-msg.ptr ]; then
  ok "open message has an inbox pointer again"
else
  bad "open message has an inbox pointer again" "pointer not recreated"
fi
if [ -f "$SANDBOX"/bus/inbox/arena/001-human-to-arena-routable.ptr ]; then
  bad "archived message not put back in an inbox" "stale pointer recreated"
else
  ok "archived message not put back in an inbox"
fi
if [ -f "$SANDBOX"/bus/archive/t4/001-human-to-arena-routable.ptr ]; then
  ok "archived message gets an archive pointer"
else
  bad "archived message gets an archive pointer" "missing"
fi

printf '\n\033[1m▸ output formats\033[0m\n'
assert_ok       "validate --json is parseable" bash -c "'$B' validate --json | python3 -c 'import json,sys; json.load(sys.stdin)'"
assert_ok       "inbox --json is parseable"    bash -c "'$B' inbox --json | python3 -c 'import json,sys; json.load(sys.stdin)'"
assert_contains "thread list renders" "threads" "$B" thread
assert_contains "status renders"      "koken bus" "$B" status
assert_contains "help renders"        "USAGE" "$B" help
assert_fail     "unknown command exits non-zero" "$B" bogus-command

printf '\n\033[1m▸ real repository bus\033[0m\n'
assert_ok       "the committed bus validates" "$REPO/bus/buffer" validate
assert_contains "cost-cut thread is present" "cost-cut" "$REPO/bus/buffer" thread

printf '\n\033[1m%s passed, %s failed\033[0m\n\n' "$PASS" "$FAIL"
[ "$FAIL" -eq 0 ] || exit 1
