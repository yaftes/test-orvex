# Orvex Prompt Studio — Content Brief for the UI/UX Designer

## About the product

Orvex Prompt Studio is a marketplace and workshop for reusable AI "skills." A **skill** is a ready-made prompt package that makes an AI assistant (ChatGPT, Claude, Gemini, Grok) do one job well — like "write a property listing," "explain an exam topic to my kid," or "plan a week of meals from what's in my fridge." Instead of staring at a blank chat box, a person picks a skill, sees in plain language what it does, uses it, or customizes it to their own voice and rules.

The product has three connected parts:

1. **Skills (the marketplace).** Find a skill, understand it, use it or make your own copy, edit it, and publish it. Skills are versioned like software — each release has a version number, a changelog, and can be marked outdated. Skills carry social signals: stars (likes), forks (copies people made), saves, comments, and reviews.
2. **Memory.** A personal profile of who the user is and how they work, so every AI they use "sounds like them." It's built by describing their role and answering questions, and it keeps growing over time.
3. **The Librarian.** A personal desk that collects useful things from a user's AI sessions and helps file each one into the right place — their Wiki, their Memory, or the trash — after a quick review.

This document lists **what content each page needs to hold**. It intentionally does not prescribe layout, colors, or styling — those are the designer's decisions. Each section below is one page (or one clearly related pair of pages).

---

## The pages and what each one contains

### 1. Marketing landing page (for logged-out visitors)

The first impression for someone who isn't signed in.

- A headline and short subheadline explaining what Orvex is.
- A primary call-to-action to get started / sign up, and a secondary way to browse the marketplace.
- A "how it works" explanation broken into a few simple steps.
- A list of the core benefits (ready-made skills for your job; see what a skill does before you trust it; add your own voice and rules; works across ChatGPT/Claude/Gemini/Grok; tune what the AI knows about you; your team pulls from one shared source).
- A preview of a few real skills from the marketplace (as an enticement).
- Sign-in / sign-up entry points.
- A footer.

### 2. Sign in / Sign up / Choose organization

The account entry flow.

- Sign-in form (email + password) and a "continue with Google" option.
- Sign-up form.
- A "choose your workspace/organization" step right after signing up (with a sensible default so it isn't a dead end).
- Clear links between sign-in and sign-up, and a way to recover a forgotten password.

### 3. Home dashboard (the signed-in landing page)

Where a returning user lands. The daily home base.

- A personal greeting ("Welcome back, [first name]").
- A quick way to jump into the marketplace.
- A row of **personal stat counts**, each one clickable to the matching page: **Following** (people you follow), **Published** (skills you released), **Drafts** (works in progress), **Forked** (skills you copied to customize), **Saves** (skills saved to your library). Every count must reflect real data — show 0 honestly, never a fake number.
- A **recent activity** area showing the latest skills from creators the user follows (skill name, who made it, when, its category). Each is clickable through to the skill.
- A **people you follow** list (a handful, with a way to see all or find more people).
- A **quick links** area to the user's own stuff (Drafts, Published, Saved, Review) each showing its count.
- Honest empty states when there's nothing yet (e.g., "follow a few creators and their skills show up here").

### 4. Marketplace (browse & discover)

The catalog. This is large — over a thousand skills across thousands of roles and ~24 broad categories — so discovery is the main job here.

- A **search field** (searches skill titles, descriptions, roles, categories, and tags).
- **Filters**, each shown as selectable chips with a live count of how many results match:
  - **Category** (pick one at a time).
  - **Roles** (pick several).
  - **Tags** (pick several).
- A **sort control** with options: relevance (only when searching), trending, most-starred, popular, and recent (the default).
- A **result count** ("84 skills") and a **clear-filters** action when any filter is active.
- A **grid of skill cards** that keeps loading more as the user scrolls (no pagination clicks).
- **Each skill card** shows: title, one-line description, category, role/tag labels, its current version number, and its signals (stars, forks, saves). A card may show a "New" badge (only when it genuinely has no saves yet) or a "deprecated/outdated" badge. The whole card is clickable to the detail page.
- The three honest states: a loading placeholder while fetching, a helpful empty state ("try adjusting your filters" vs. "nothing published yet"), and an error state with a retry.

### 5. Skill detail page

The single most important page — where someone decides to trust and use a skill. It has two tabs: **Overview** and **Versions**.

**Top of the page (shared by both tabs):**

- Skill title and one-line description.
- Category label.
- The creator (name/avatar) with a **Follow** action.
- Two primary actions: **"Use it"** (get the prompt to use right away) and **"Make it yours"** (create your own editable copy). On the public/read-only version of this page, these are the only actions — no owner/editing controls appear here.
- If this skill was copied from another, an **attribution** line: "Based on [original skill]," linking back.

**Overview tab — "the pieces":**

- The skill's content shown as clean, readable pieces (each section of the prompt rendered in plain language — never raw code or markup).
- A **package summary** with the key facts: current version, star count (and whether the viewer has starred it), how many times it's been forked this week and in total, and when it was last published. Includes a **Star** toggle.
- If a skill can't be broken into neat pieces, a **"view source"** fallback that shows the plain source text (read-only here).
- **Comments** — a comment thread plus a composer to write one. The composer supports emoji: a row of one-tap quick reactions and an emoji picker. It shows a character count and has a clear "post" action. Comments can be replied to. Writing a comment requires being signed in (prompt to sign in otherwise).
- **Reviews** — a place to leave and read reviews/ratings, and a **Save** action to add the skill to your library.
- **Suggest an edit** — a way for a signed-in visitor to propose a change to the skill, shown as a before/after.

**Versions tab:**

- A list of every release, newest first. Each entry shows: the version number, its changelog notes, who published it and when, and a badge if it's marked outdated (with the reason). Each entry has: **View** (open that frozen version) and **Get this version** (make a copy based on that specific version).

### 6. Builder / Editor (create or customize a skill)

Where a person authors a new skill or edits a copy they made. The content the page must support:

- The skill's editable content, shown as blocks the user can change directly.
- Editing actions: add a block, remove/disable a block (with an easy undo), and reorder blocks — including moving a block to a different section.
- A **save status indicator** that honestly shows saving / saved / "couldn't save — retrying," since edits save automatically.
- A **word count** of the current prompt.
- A **copy** action to grab the finished prompt text.
- A **preview** action to see the skill exactly as a reader would (read-only).
- A **publish** action that opens a short form (title, category, one-line description) to release the skill to the marketplace.
- If this is a copy of another skill, a visible "based on [original]" link.

### 7. Use it (get the prompt)

A focused delivery page for actually using a skill.

- The ready-to-use prompt text, front and center.
- A one-tap **copy** action.
- **Deep links** to open the prompt directly in the major assistants (Claude, ChatGPT, and others), so there's no manual copy-paste.
- The presentation should feel assistant-agnostic — it's not tied to one AI.

### 8. Export

- A choice of export format (e.g., a Claude-shaped or ChatGPT-shaped version).
- The exported text shown clearly with a copy action.

### 9. Drafts (your works in progress)

A private space for skills the user is still working on.

- Two tabs: **Created by you** (authored from scratch) and **Forked** (copies of others' skills you're customizing), each showing its count.
- A short hint line explaining the difference between the tabs.
- A **list of draft cards**. Cards here are intentionally simple — no buttons on them; clicking a card opens its manage page. Each card shows the skill's title, category, how many edits it has, and when it was last touched.
- Distinct, guiding empty states per tab ("hit Create skill to start one from scratch" / "open any marketplace skill and hit Make it yours").

### 10. Draft manage page (one draft)

Opens when a draft card is clicked. Shows the skill **and** the right actions for its type.

- The skill's content (readable view).
- For a **created** draft: **Edit**, **Publish**, and **Delete** actions.
- For a **forked** draft: **Edit** and **Use** actions (and the ability to drop the customization while keeping the original skill intact).
- Clear, plain-language confirmations for destructive actions.

### 11. Published (your live skills)

The user's released skills.

- A list of the skills the user has published.
- Each entry can **expand to reveal all of its versions**.
- Clicking a version opens that version's frozen snapshot page.

### 12. Version snapshot page (one frozen release)

A read-only view of a single published version.

- The exact, frozen content of that version.
- The version's details (number, changelog, date).
- For the owner: a **Deprecate** action (with an optional short reason) to mark this version outdated, and an **Undeprecate** action to reverse it. Note in the content that deprecating the most recent version changes which one is treated as "latest," and deprecating every version hides the skill from the marketplace.

### 13. Review inbox (suggestions on your skills)

Where a skill owner reviews edits that other people suggested — similar to comments/suggestions in a shared doc.

- A list of pending suggestions across the skills the user owns.
- **Each suggestion** shows: who suggested it (their real name), when, an optional note explaining why, and the proposed change as a **before/after** for each affected block.
- **Accept / decline** controls for each individual change.
- An **Apply decisions** action that commits the accepted changes and drops the rest.
- Honest states: loading, an "all caught up — no pending suggestions" empty state, and error/retry.

### 14. Memory — onboarding

How a new user first builds their Memory.

- An intro screen inviting them to describe what they do, in their own words (with a few example phrasings like "I'm a high-school biology teacher in the UK" or "I run a startup and write investor updates").
- A **guided form that builds itself** as they go — sections appear and get filled in, section by section, based on what they've told it.
- A follow-up screen recommending a few **starter skills** suited to them.

### 15. Memory — editor and portrait ("Your Memory")

The ongoing home for a user's Memory.

- A **question-based profile editor** where the user can review and change what the AI knows about them, saved automatically.
- A **"portrait" view** that grows over time: new facts about the user arrive as small **suggestion cards**, each with simple choices — **"Yes, that's me," "Not quite,"** or **tweak it.**
- The ability to **add something manually** ("tell me something" → it becomes a line on the profile).
- The ability to **add facts by dropping in a document** (the system reads it and proposes suggestions).
- **Personal or sensitive** items are clearly flagged and each needs a deliberate "yes" — they're never added in bulk.
- The tone is calm: no counters or pressure, and a gentle "all caught up" state when there's nothing to review.

### 16. The Librarian (the sorting desk)

A desk where things captured from the user's AI sessions get filed. The page needs to express a clear "in-tray → review → filed" flow.

**The overall page:**

- A title and a one-line explanation ("new captures from your AI sessions, ready to review and file").
- A live count of how many items are waiting.
- An **in-tray** (the list of items waiting to be reviewed, oldest first).
- The **destinations** ("shelves") shown with running counts: **Your Wiki** (durable knowledge), **Memory** (how you like to work), and **Trash** (throwaway).
- A **"file all the safe ones at once"** action for items that only add something and don't touch anything existing, plus a clearly separated "held back for your review" group for anything that needs a human eye.
- A satisfying **"all caught up"** summary once the in-tray is empty, tallying what went where.

**Each item in the in-tray contains:**

- A short preview of the captured content.
- The Librarian's **proposed decision**: file it as new (to Wiki or Memory), update an existing entry, merge it with a duplicate it found, or discard it — and which destination it's headed to.
- A small **conversation** where the Librarian explains its suggestion in plain language and the user can ask about that specific item.
- The **action buttons** matching the suggestion (file it, merge, update, or discard), with a confirmation step for anything destructive.
- If the item is **sensitive** (contains secrets, personal info, or confidential work), it's shown **sealed** — its contents hidden until the user chooses to open it — and it can never be filed automatically; it always waits for the user.
- When the suggestion is to update or merge, a **before/after** comparison (with any sensitive fields hidden).

**Elsewhere in the app (not on this page):**

- A small, non-intrusive **"items waiting" badge** in the main navigation that appears when the in-tray builds up. It's a gentle nudge, never a modal interruption, and it should feel light at first and only more prominent if things pile up for a while.

**Connecting outside tools:**

- A place to **connect an external AI client** so it can send captures to the Librarian. When connecting, the user gets a one-time secret and simple setup instructions, and can revoke a connection at any time.

### 17. Your Wiki

- A launch point into the user's own hosted wiki (a private space Orvex hosts for durable knowledge), with a clear explanation of what it is and a way in.

### 18. Activity feed

- A chronological list of recent skills from the creators the user follows (skill, creator, when, category), each clickable through to the skill.
- An empty state that nudges the user to follow more people.

### 19. Following

- A list of the people the user follows, each linking to that person's profile, with a way to find more people to follow.

### 20. Collections

- The user's named groups of skills.
- The ability to create a collection, add skills to it, and share it (a shared collection is viewable by anyone with the link).
- A public **shared-collection view** for visitors: the collection's name and its skills.

### 21. Author profile (public)

- A creator's public page: their name/avatar, a **Follow** action, and the list of skills they've published (with the usual signals).

### 22. Share page (public)

- A shareable, live view of a single skill for people who aren't signed in, with a clear invitation to make their own copy.

### 23. Account & settings

- The user's profile details.
- Connected accounts and integrations.
- Appearance/preferences.
- A link to their wiki.
- A clearly separated "danger zone" for destructive account actions.
- Sign out.

### 24. Admin (internal, restricted)

- A restricted panel for system administrators (organization and user management). Only shown to admins.

---

## A few rules that apply to every page

These aren't styling notes — they're content and behavior expectations the whole product follows, so please design for them everywhere:

1. **Every number is real.** Stars, forks, saves, follower counts, stats — all reflect actual data. Show 0 honestly; never invent a placeholder number. A "New" label means genuinely new.
2. **No blank screens, ever.** Every page that loads data needs three honest states: a **loading** placeholder, a **helpful empty state** that tells the user what to do next, and an **error state** with a way to retry.
3. **The right actions in the right place.** A read-only/public view of a skill shows only "Use it" and "Make it yours." Owner actions (edit, publish, delete, deprecate) live on the owner's own management pages — they never leak into public views.
4. **Shareable state.** Searches, filters, and the selected tab should be reflected in the address so a view can be shared and the back button behaves as expected.
5. **A calm, non-nagging tone** — especially in Memory and the Librarian. No guilt, no count-shaming, no forced pop-ups. Nudges are gentle and dismissible.
6. **Works across assistants.** Anywhere a skill is delivered or exported, it should feel model-agnostic (Claude, ChatGPT, Gemini, Grok), not tied to one.
7. **Accessible by default.** Everything should be keyboard-navigable and screen-reader-friendly.

---

## Where to start

If a starting order helps, the highest-impact pages are, in order: **Marketplace**, **Skill detail**, **Builder**, the **Drafts → Published lifecycle**, the **Home dashboard**, then the two distinctive experiences — the **Librarian** and **Memory**.
