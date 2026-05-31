# Spec-Kit Usage Guide

Playable Instrument uses GitHub's [spec-kit](https://github.com/github/spec-kit) for structured feature specifications.

---

## What is Spec-Kit?

Spec-kit = standardized specification template. Ensures consistent, complete documentation across projects.

Benefits:
- **Clarity** — clear goals, success criteria, acceptance tests
- **Traceability** — links to code, PRs, design docs
- **Handoff** — new team members understand intent + decisions
- **Metrics** — success criteria make it easy to measure impact
- **Accountability** — what done looks like is explicit

---

## Our Spec Format

All specs follow: `SPEC_<feature>.md`

Sections (in order):

1. **Title + Metadata** (YAML frontmatter)
   ```yaml
   title: Feature Name
   status: [planning|in-progress|shipped]
   effort: [S|M|L|XL] + hours
   shipped: YYYY-MM-DD (if done)
   ```

2. **Summary** — one-liner, why it matters

3. **Problem** — pain point being solved

4. **Goals** — success objectives (5-7 items)

5. **Success Criteria** — measurable acceptance conditions

6. **Design** — architecture, key decisions, trade-offs

7. **Acceptance Tests** — table of scenarios → expected results

8. **References** — links to code, PRs, docs, external resources

9. **Implementation Status** — phases (design→build→test→deploy)

10. **Performance** — latency, memory, size targets

11. **Future / Out of Scope** — what's deliberately NOT included

12. **Notes** — lessons learned, decisions, additional context

---

## How to Create a Spec

### For New Features (In Planning)

1. Copy `SPEC_TEMPLATE.md` → `SPEC_<feature_name>.md`
2. Fill in:
   - Title
   - Problem statement
   - Goals (draft)
   - Design (rough)
   - Acceptance tests (draft)
3. Commit with message: `docs: add spec for <feature>`
4. Link from `BACKLOG.md` under "Planning"
5. Discuss with SPM, TL, Designer (use spec as anchor)
6. Iterate until consensus

### For In-Progress Features

1. Update status: `in-progress`
2. Add implementation phases:
   ```yaml
   - [x] Phase 1: Design approved
   - [x] Phase 2: Core build
   - [ ] Phase 3: Testing
   - [ ] Phase 4: Merge + deploy
   ```
3. As code ships, update phases
4. Keep links to PRs current

### For Shipped Features

1. Update status: `shipped`
2. Update shipped date: `shipped: YYYY-MM-DD`
3. Mark all success criteria: `[x]`
4. Add actual measurements (vs. targets)
5. Archive in `BACKLOG.md` → "Shipped (V2)"

---

## Example Workflow

### Week 1: Planning

**SPM** creates spec with problem + goals
**TL** adds design + implementation estimate
**Designer** adds UI/interaction details
→ Commit as `SPEC_<feature>.md`

### Week 2: Build

**TL** updates status → `in-progress`, adds phase checklist
Each PR links to spec: `Implements SPEC_FEATURE.md`
→ Phases marked done as code merges

### Week 3: Ship

Spec updated:
- [x] All success criteria met
- [x] All acceptance tests passing
- status: `shipped`
- shipped: `2026-05-31`
- Performance metrics filled in

→ Merged to main, reference in BACKLOG.md "Shipped"

---

## Current Specs (V2)

All 8 post-V1 items have been retrofitted:

| Spec | Status | Shipped |
|------|--------|---------|
| SPEC_ROUTER_TESTING.md | shipped | 2026-05-31 |
| SPEC_DEPLOY.md | shipped | 2026-05-31 |
| SPEC_INSTRUMENTS.md | shipped | 2026-05-31 |
| SPEC_AUTH.md | shipped | 2026-05-31 |
| SPEC_ANALYTICS.md | shipped | 2026-05-31 |
| SPEC_OG_IMAGES.md | shipped | 2026-05-31 |
| SPEC_MIDI.md | shipped | 2026-05-31 |
| SPEC_WIND_UI.md | shipped | 2026-05-31 |

---

## Future Work (V3 Backlog)

When planning V3, create specs for each item:

```bash
cp SPEC_TEMPLATE.md SPEC_MULTI_LANGUAGE_SUPPORT.md
# Fill in summary, problem, goals, design
git add SPEC_MULTI_LANGUAGE_SUPPORT.md
git commit -m "docs: add spec for multi-language support"
```

Then add to BACKLOG.md → "Planning (V3)"

---

## Best Practices

### ✅ DO

- **Link to code** — reference actual files/lines
- **Quantify success** — "accuracy ≥85%" not "high quality"
- **List trade-offs** — why choose this design?
- **Include error cases** — acceptance tests for failures
- **Update as you build** — spec evolves, don't freeze it
- **Reference PRs** — link GitHub PR numbers when merged
- **Measure results** — fill in actual vs. target metrics

### ❌ DON'T

- **Spec without problem** — always start with "why"
- **Make success vague** — "improve performance" → "p95 latency <100ms"
- **Ignore alternative designs** — document why you chose this one
- **Skip acceptance tests** — how do we know when it's done?
- **Leave stale specs** — update status as work progresses
- **Over-engineer early** — simple specs are better than long ones

---

## Spec-to-PR Mapping

Each PR should reference its spec:

```
feat: add MIDI input support

Implements SPEC_MIDI.md

- Added Web MIDI API wrapper (midiInput.ts)
- Added React hooks (useMIDIInstrument, useMIDI)
- Added UI component (MIDIControls)

Acceptance tests:
✅ Connect USB keyboard
✅ Play note → engine.hit() called
✅ Note-off → stops
✅ Velocity passed correctly

See SPEC_MIDI.md for complete acceptance criteria.
```

Vercel/GitHub CI can check:
- Builds (no TS errors)
- Tests pass
- Links back to spec
- Spec marked in-progress → shipped

---

## Metrics & Reporting

After shipping, review:

1. **Did we hit success criteria?** (all [x]?)
2. **Did we hit effort estimate?** (actual vs. estimate)
3. **What's the performance vs. target?**
4. **What surprised us?** (lessons learned)

Use these for:
- Refine future estimates
- Identify bottlenecks
- Celebrate wins
- Adjust prioritization

---

## Integration with BACKLOG.md

Specs are the detailed form of backlog items.

```
BACKLOG.md: Bird's eye (list of what's in progress)
SPEC_<feature>.md: Detailed (how to solve it)
```

BACKLOG references specs:

```markdown
## Shipped (V2)

- [x] **1. Router testing** — ✅ [SPEC_ROUTER_TESTING.md](SPEC_ROUTER_TESTING.md)
- [x] **2. Deploy** — ✅ [SPEC_DEPLOY.md](SPEC_DEPLOY.md)
```

---

## Questions?

When in doubt:
- **Is it clear why this matters?** (Problem section)
- **Can someone not on the team understand the design?** (Design section)
- **How do we know it's done?** (Acceptance tests)

If you can answer these, spec is solid.

---

## See Also

- [BACKLOG.md](BACKLOG.md) — high-level roadmap
- [SPEC_TEMPLATE.md](SPEC_TEMPLATE.md) — template for new specs
- GitHub spec-kit: https://github.com/github/spec-kit
