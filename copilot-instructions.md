# Copilot Instructions

This file indexes available skills and their auto-trigger keywords.

**For project rules, conventions, data-testid requirements, testing guidelines, and other project standards, see [AGENTS.md](AGENTS.md).**

---

## Skills Registry

### smart-commit

**Purpose:** Incrementally stage and commit git changes grouped by logical context, with conventional commit messages. Produces clean, readable git history where each commit represents one coherent unit of work.

**Location:** [.agents/skills/smart-commit/SKILL.md](.agents/skills/smart-commit/SKILL.md)

**Auto-trigger keywords:**
- "smart commit"
- "commit by context"
- "gradual commit"
- "group my changes"
- "commit changes separately"
- "split commits"
- "organize commits"
- "help me commit"

When the user says any of these phrases or similar, invoke the smart-commit skill workflow.
