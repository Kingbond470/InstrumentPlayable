# V3+ Planning — Spec-Driven Development

After shipping V2 (8 features, all documented), we now have a template for V3 and beyond.

---

## Workflow for V3+

### Phase 1: Planning (SPM + TL + Designer)

1. **Problem identification**
   - What user pain point are we solving?
   - Who experiences it?
   - Why is it a priority?

2. **Spec creation**
   ```bash
   cp SPEC_TEMPLATE.md SPEC_<feature>.md
   ```
   
   Fill in:
   - Title + metadata (status: `planning`)
   - Problem statement
   - Goals (5-7 objectives)
   - Design sketch
   - Acceptance tests (draft)

3. **Review & consensus**
   - SPM: Does this solve the problem?
   - TL: Is it technically feasible? Effort estimate?
   - Designer: UX makes sense? Interaction clear?
   - Iterate spec until all agree

4. **Add to BACKLOG.md**
   - Planning section
   - Effort estimate
   - Link to spec

### Phase 2: Build (TL + Designers)

1. **Refine spec** (24 hours into feature)
   - Update design based on implementation reality
   - Update acceptance tests if needed
   - Keep spec in sync with code

2. **Structure phases**
   ```
   status: in-progress
   
   Implementation:
   - [x] Phase 1: Design approved
   - [ ] Phase 2: Core build
   - [ ] Phase 3: Testing
   - [ ] Phase 4: Merge
   ```

3. **PR references spec**
   ```
   feat: add [feature]
   
   Implements SPEC_<feature>.md
   
   Checklist:
   - [ ] All acceptance tests passing
   - [ ] No TypeScript errors
   - [ ] Build: ✓ success
   ```

4. **Update phases as code ships**

### Phase 3: Test (QA + TL)

1. **Manual testing**
   - Walk through every acceptance test scenario
   - Record results in spec

2. **Automated tests** (if applicable)
   - Unit tests for business logic
   - Integration tests for API routes
   - E2E tests for user flows

3. **Performance validation**
   - Measure actual vs. target metrics
   - Update SPEC_<feature>.md with real numbers

4. **Approval checklist**
   - [x] All acceptance tests passing
   - [x] Performance targets met (or documented trade-off)
   - [x] No new bugs in related features
   - [x] Spec updated with actual results

### Phase 4: Ship (TL)

1. **Update spec**
   ```yaml
   status: shipped
   shipped: 2026-06-15
   ```
   Mark all criteria [x]

2. **Merge to main**
   ```
   git merge --squash feature/xyz
   git commit -m "feat: ..."  # Reference spec
   ```

3. **Update BACKLOG.md**
   - Move from Planning → Shipped (V3)
   - Add spec link
   - Record actual effort vs. estimate

4. **Write retrospective**
   - What went well?
   - What was harder than expected?
   - Learnings for next feature?

---

## V3 Candidate Features

8 items in planning phase:

### Must-Have (High Priority)

1. **Multi-language support** (i18n)
   - Spanish, Mandarin, Hindi, Arabic
   - Effort: L (5h) — needs translation management
   - Owner: Designer + TL
   - Spec: [TBD] Create SPEC_MULTI_LANGUAGE.md

2. **Instrument history & favorites**
   - Recently played, favorite-star, quick access
   - Effort: M (3h) — localStorage + UI
   - Owner: TL + Designer
   - Spec: [TBD] Create SPEC_HISTORY.md

3. **Collection sharing**
   - Save user's favorite 5 instruments as bundle
   - Share URL → friend loads same 5
   - Effort: M (3h) — URL encoding + preview
   - Owner: TL
   - Spec: [TBD] Create SPEC_COLLECTIONS.md

### Nice-to-Have (Medium Priority)

4. **Breath modulation (wind instruments)**
   - Intensity affects synth envelope (sustain, release)
   - Effort: M (3h) — InstrumentEngine integration
   - Owner: TL
   - Spec: [TBD] Create SPEC_WIND_MODULATION.md

5. **Vibrato/tremolo**
   - Horizontal micro-movements → pitch wobble
   - Vertical micro-movements → amplitude wobble
   - Effort: L (5h) — complex gesture detection
   - Owner: Designer + TL
   - Spec: [TBD] Create SPEC_WIND_EFFECTS.md

6. **MIDI file playback**
   - Drag SMF → playback over instrument
   - Effort: L (6h) — MIDI parsing + sequencer
   - Owner: TL
   - Spec: [TBD] Create SPEC_MIDI_PLAYBACK.md

### Future (Lower Priority)

7. **Keyboard visualization**
   - Piano roll or note names overlay
   - Effort: M (4h) — UI component
   - Owner: Designer + TL
   - Spec: [TBD] Create SPEC_KEYBOARD_VIZ.md

8. **User library sync**
   - Authenticated kits persist across devices
   - Requires backend database
   - Effort: XL (10h) — auth + DB + sync logic
   - Owner: TL
   - Spec: [TBD] Create SPEC_LIBRARY_SYNC.md

---

## How to Start V3

When ready to begin V3 (post-V2 beta feedback):

1. **Prioritize**
   - SPM discusses with team
   - Pick 3-5 features for V3 (not all 8)
   - Set release date (e.g., 2026-08-31)

2. **Create specs for selected items**
   ```bash
   for feature in MULTI_LANGUAGE HISTORY COLLECTIONS; do
     cp SPEC_TEMPLATE.md SPEC_$feature.md
     # Fill in content
   done
   ```

3. **Update BACKLOG.md**
   ```markdown
   ## Planning (V3)
   
   - [ ] **1. Multi-language support** — [SPEC_MULTI_LANGUAGE.md](...)
   ```

4. **Assign ownership**
   - Who's TL? Who's Designer? Who's QA?
   - Discuss timeline per feature

5. **Kick off sprint**
   - Plan meeting with team
   - Review specs together
   - Estimate effort
   - Assign work

---

## Metrics to Track

After each feature ships, record:

| Item | V2 | V3 | V4 |
|------|----|----|-----|
| Avg effort estimate (hours) | 4h | TBD | TBD |
| Actual vs. estimate | 90% accurate | TBD | TBD |
| Acceptance test coverage | 85% | TBD | TBD |
| Performance targets met | 100% | TBD | TBD |
| Bugs found in first week | <2/feature | TBD | TBD |
| Time to ship (planning → merge) | 7 days | TBD | TBD |

Use these to:
- Refine estimation
- Identify process bottlenecks
- Celebrate improvements

---

## Spec-Kit Best Practices (Learned from V2)

✅ **What worked:**
- Specs as decision anchor (SPM/TL/Designer aligned)
- Acceptance tests = clear done criteria
- Effort estimates calibrated over time
- Links to code + PRs = traceability
- Retrofitting specs was worthwhile (clarity, lessons for V3)

❌ **Avoid:**
- Specs written in vacuum (not reviewed with team)
- Success criteria too vague (quantify!)
- Acceptance tests that don't test failures
- Specs that get stale (update during build phase)

---

## Resources

- [SPEC_KIT_GUIDE.md](SPEC_KIT_GUIDE.md) — detailed how-to
- [SPEC_TEMPLATE.md](SPEC_TEMPLATE.md) — copy this to start
- [BACKLOG.md](BACKLOG.md) — overview of all work
- GitHub spec-kit: https://github.com/github/spec-kit

---

## Questions for Team

Before V3 kicks off:

1. **Priorities** — Which 3-5 features matter most?
2. **Timeline** — When should V3 ship?
3. **Resources** — Who owns what?
4. **Constraints** — Any blockers or dependencies?
5. **Success** — What does V3 success look like?

Answer these → specs get easier.

---

**Next:** Plan V3 with team. Then copy SPEC_TEMPLATE.md and start writing specs.
