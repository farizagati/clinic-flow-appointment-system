---
name: smart-commit
description: >
  Incrementally stage and commit git changes grouped by logical context, with conventional commit messages.
  Use this skill whenever the user says "smart commit", "commit by context", "gradual commit",
  "group my changes", "commit changes separately", "split commits", "organize commits",
  or asks to commit their work in a structured/organized way. Also trigger when the user has many
  unstaged changes and asks for help committing — even if they just say "commit my changes" or
  "help me commit", this skill is the right choice because it produces cleaner git history than
  a single bulk commit.
---

# Smart Commit

Analyze uncommitted git changes, group them by logical context, and commit each group
separately with a clear conventional commit message. This produces a clean, readable git
history where each commit is focused on one concern.

## Workflow

### Step 1: Gather changes

Run these commands to understand the full picture:

```
git status
git diff --stat
git diff
git diff --cached --stat   (check for already-staged files)
git log --oneline -5       (recent commits for message style reference)
```

Read every changed file's diff carefully. You need the actual content to group intelligently.

### Step 2: Group changes by context

Analyze the diffs and assign each changed file to a logical group. A group is a set of
files that represent one coherent unit of work. Think about it from the perspective of
someone reading `git log` months later — each commit should tell a self-contained story.

Common grouping strategies:
- **By feature**: files that implement the same feature together
- **By layer**: all styling changes, all API changes, all config changes
- **By concern**: bug fix vs. new feature vs. refactor vs. docs

Grouping rules:
- A file belongs to exactly one group
- If a file has changes spanning multiple concerns, put it in the most dominant group
- Prefer fewer, meaningful groups over many tiny ones (2-5 groups is typical)
- Already-staged files form their own group if they differ from what you'd choose — ask the user

### Step 3: Present the plan

Show the user a numbered list of groups with:
- Group number and proposed commit type + message
- The files in that group
- A one-line summary of what the changes in that group do

Format example:

```
Here's how I'd organize your changes:

1. feat(auth): add JWT token refresh logic
   - src/api/auth.ts
   - src/api/tokenStore.ts
   → Adds automatic token refresh when the access token expires

2. style(dashboard): update card layout and spacing
   - src/components/Dashboard.module.css
   - src/components/Card.module.css
   → Adjusts grid gap and card padding for the new design

3. chore: update dependencies and config
   - package.json
   - tsconfig.json
   → Bumps dayjs to 1.11.x and enables strict mode

Proceeding with this plan — reply before I finish if you want to adjust.
```

Present the plan and immediately start committing. Do not wait for a reply before beginning.
The user can interrupt mid-way if they want to adjust grouping, merge/split groups, reorder, change a message, or skip a group.

### Step 4: Commit each group incrementally

For each group, in order:

1. **Stage only that group's files:**
   ```
   git add <file1> <file2> ...
   ```

2. **Commit** using a HEREDOC for proper formatting:
   ```bash
   git commit -m "$(cat <<'EOF'
   <type>(<scope>): <subject>

   <optional body — only if the change needs explanation>

   EOF
   )"
   ```

5. Move to the next group.

After all groups are committed, show a summary:
```
git log --oneline -<N>
```
where N is the number of commits just created.

## Commit message format

Use [Conventional Commits](https://www.conventionalcommits.org/):

| Type       | When to use                                    |
|------------|------------------------------------------------|
| `feat`     | New feature or capability                      |
| `fix`      | Bug fix                                        |
| `style`    | CSS, formatting, whitespace (no logic change)  |
| `refactor` | Code restructuring without behavior change     |
| `docs`     | Documentation only                             |
| `chore`    | Build, config, dependencies, tooling           |
| `test`     | Adding or updating tests                       |
| `perf`     | Performance improvement                        |
| `ci`       | CI/CD configuration                            |

Rules for the subject line:
- Lowercase, imperative mood ("add" not "Added" or "Adds")
- No period at the end
- Under 72 characters
- Scope is optional — use it when it adds clarity (e.g., `feat(auth):` or `style(dashboard):`)

Add a body only when the "why" isn't obvious from the subject. Keep it to 1-2 sentences.


## Edge cases

- **No changes found**: Tell the user "Working tree is clean — nothing to commit."
- **Only staged changes**: Ask if they want to commit what's already staged as-is, or unstage and regroup.
- **Untracked files**: Include them in the analysis. Ask the user if they should be committed or added to .gitignore.
- **Sensitive files** (.env, credentials, secrets): Flag them and do NOT stage. Warn the user.
- **Merge conflicts**: Do not attempt to commit files with unresolved conflicts. Flag them.
- **Single logical change**: If all changes belong to one group, just make one commit — don't force artificial splits.
