// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA LAYER
// Everything the UI renders comes from this one file. To wire the mock up to
// a real backend, replace these exports with API calls — the components only
// consume the shapes, never this module's internals.
// ─────────────────────────────────────────────────────────────────────────────

// ——— People ———
export const users = [
  { id: 'u_maya', name: 'Maya Chen', handle: 'mayachen', role: 'Real-estate broker', followers: 2841, following: 122, skillCount: 14, bio: 'Top-1% listing agent turned prompt tinkerer. Everything I ship, I use daily.' },
  { id: 'u_daniel', name: 'Daniel Okafor', handle: 'dokafor', role: 'High-school teacher', followers: 1932, following: 87, skillCount: 9, bio: 'Biology teacher. I build skills that make hard topics feel easy for kids.' },
  { id: 'u_sofia', name: 'Sofia Marchetti', handle: 'sofiam', role: 'Content strategist', followers: 5210, following: 301, skillCount: 22, bio: 'Words that convert. Ex-agency, now freelance. My skills carry my whole playbook.' },
  { id: 'u_jonas', name: 'Jonas Weber', handle: 'jweber', role: 'Startup founder', followers: 3467, following: 156, skillCount: 11, bio: 'Founder @ Klarwerk. Investor updates, hiring loops, product specs — automated.' },
  { id: 'u_amara', name: 'Amara Diallo', handle: 'amarad', role: 'UX researcher', followers: 1204, following: 98, skillCount: 7, bio: 'Research ops nerd. Interview guides and synthesis, minus the drudgery.' },
  { id: 'u_liam', name: 'Liam O’Sullivan', handle: 'liamos', role: 'Sales lead', followers: 987, following: 64, skillCount: 5, bio: 'Enterprise SaaS sales. Cold email skills that actually get replies.' },
  { id: 'u_priya', name: 'Priya Raghavan', handle: 'priyar', role: 'Product manager', followers: 4102, following: 210, skillCount: 16, bio: 'PM at a fintech. PRDs, roadmaps and stakeholder updates on autopilot.' },
  { id: 'u_tom', name: 'Tom Lindqvist', handle: 'tomlq', role: 'Home cook & dad', followers: 655, following: 40, skillCount: 4, bio: 'Meal plans from whatever’s in the fridge. Feeding four on a budget.' },
  { id: 'u_grace', name: 'Grace Njeri', handle: 'gracen', role: 'HR director', followers: 1780, following: 133, skillCount: 8, bio: 'People ops. Job descriptions, feedback and policies, written like a human.' },
  { id: 'u_hiro', name: 'Hiro Tanaka', handle: 'hirot', role: 'Data analyst', followers: 2310, following: 178, skillCount: 12, bio: 'SQL whisperer. Skills for clean analysis narratives and dashboards docs.' },
]

export const currentUser = {
  id: 'u_me', name: 'Yafet Tesfaye', handle: 'yafet', role: 'Product engineer',
  email: 'yafet.tesfaye@orvex.ai', org: 'Orvex', followers: 128, following: 5,
  bio: 'Building things people actually use.',
}

export const organizations = [
  { id: 'org_personal', name: 'Personal workspace', members: 1, kind: 'personal' },
  { id: 'org_orvex', name: 'Orvex', members: 14, kind: 'team' },
  { id: 'org_side', name: 'Weekend Projects', members: 3, kind: 'team' },
]

export const userById = (id) => users.find((u) => u.id === id) || currentUser

// ——— Taxonomy ———
export const categories = [
  'Real Estate', 'Education', 'Marketing', 'Sales', 'Engineering', 'Design',
  'Legal', 'Finance', 'HR & People', 'Health', 'Cooking', 'Travel',
  'Writing', 'Customer Support', 'Data & Analytics', 'Product', 'Research',
  'Social Media', 'E-commerce', 'Parenting', 'Fitness', 'Career',
  'Productivity', 'Personal Growth',
]

export const roles = [
  'Broker', 'Teacher', 'Copywriter', 'Founder', 'Researcher', 'Account exec',
  'Product manager', 'Parent', 'Recruiter', 'Analyst', 'Designer', 'Consultant',
  'Marketer', 'Engineer', 'Coach', 'Student',
]

export const tags = [
  'listings', 'email', 'summaries', 'lesson-plans', 'seo', 'cold-outreach',
  'meal-prep', 'interviews', 'reports', 'social', 'onboarding', 'feedback',
  'brainstorm', 'rewrite', 'translate', 'planning', 'analysis', 'storytelling',
]

// ——— Skills (hand-crafted flagship set) ———
const BLOCKS_LISTING = [
  { id: 'b1', section: 'Role', title: 'Who the AI becomes', content: 'You are a seasoned real-estate copywriter who has written over 3,000 property listings. You write with warmth and precision, always truthful, never over-promising. Fair-housing compliant, always.' },
  { id: 'b2', section: 'What it asks you', title: 'Details it collects first', content: 'Before writing, it asks for: property type and size, three standout features, the neighborhood vibe, target buyer, and anything that must legally be disclosed.' },
  { id: 'b3', section: 'Instructions', title: 'How it writes', content: 'Opens with a hook about the single best feature. Paints one scene of living there — morning coffee on the deck, kids walking to the school two blocks over. Keeps paragraphs to three sentences max. Closes with a clear next step for booking a viewing.' },
  { id: 'b4', section: 'Tone & voice', title: 'The voice it uses', content: 'Warm but grounded. Confident, not salesy. Words a neighbor would use, not a brochure. No "stunning", no "must-see", no exclamation marks.' },
  { id: 'b5', section: 'Output format', title: 'What you get back', content: 'A headline (max 10 words), a 150–200 word body, a bulleted feature list, and three social captions sized for Instagram, Facebook and LinkedIn.' },
  { id: 'b6', section: 'Guardrails', title: 'What it never does', content: 'Never invents features, square footage or school ratings. Never uses language that could violate fair-housing rules. Flags any claim it can’t verify from your input and asks instead of guessing.' },
]

const BLOCKS_EXPLAIN = [
  { id: 'b1', section: 'Role', title: 'Who the AI becomes', content: 'You are a patient tutor who explains one exam topic at a time to a teenager. You adapt to how they answer, never talk down, and celebrate small wins.' },
  { id: 'b2', section: 'What it asks you', title: 'Details it collects first', content: 'The subject and exam board, the specific topic, the student’s age, and one thing they already understand well (to build the explanation on top of it).' },
  { id: 'b3', section: 'Instructions', title: 'How it teaches', content: 'Starts from what the student knows. Explains with one everyday analogy, then the formal definition, then a worked example. Ends every explanation with two check-questions and adjusts if the answers wobble.' },
  { id: 'b4', section: 'Tone & voice', title: 'The voice it uses', content: 'Encouraging, concrete, zero jargon until the concept has landed. Short sentences. Asks, never lectures.' },
  { id: 'b5', section: 'Guardrails', title: 'What it never does', content: 'Never gives exam answers to copy. Never fakes a source. If a topic needs a diagram it says so honestly instead of describing one badly.' },
]

const BLOCKS_MEALS = [
  { id: 'b1', section: 'Role', title: 'Who the AI becomes', content: 'You are a practical home-cooking planner. You care about food waste, weeknight time limits and picky eaters more than culinary flair.' },
  { id: 'b2', section: 'What it asks you', title: 'Details it collects first', content: 'What’s in the fridge/pantry (a photo description or a list), how many people, dietary limits, how much time on weeknights, and which nights are chaos nights.' },
  { id: 'b3', section: 'Instructions', title: 'How it plans', content: 'Builds seven dinners that use perishables first. Reuses prep across nights (chop once, use twice). Chaos nights get 15-minute meals. Produces one consolidated shopping list for only what’s missing.' },
  { id: 'b4', section: 'Output format', title: 'What you get back', content: 'A Mon–Sun table with meal, prep time, and which fridge items it uses up. Then the shopping list grouped by aisle. Then three "rescue swaps" if an ingredient turns out to be off.' },
  { id: 'b5', section: 'Guardrails', title: 'What it never does', content: 'Never plans around ingredients you didn’t mention. Never ignores an allergy, ever. Flags anything past a safe storage window instead of cooking with it.' },
]

const BLOCKS_COLD = [
  { id: 'b1', section: 'Role', title: 'Who the AI becomes', content: 'You are an SDR coach who has reviewed 40,000 cold emails. You know that relevance beats cleverness and that shorter wins.' },
  { id: 'b2', section: 'What it asks you', title: 'Details it collects first', content: 'Who the prospect is (role, company, one recent trigger event), what you sell in one sentence, and one customer of yours they’d recognize.' },
  { id: 'b3', section: 'Instructions', title: 'How it writes', content: 'Leads with the trigger event, not your product. One idea per email. A soft, specific ask ("worth 15 minutes?") instead of a hard close. Generates a 3-touch sequence: opener, value nudge, graceful breakup.' },
  { id: 'b4', section: 'Tone & voice', title: 'The voice it uses', content: 'Peer-to-peer, plain-spoken, zero buzzwords. Reads like it was typed quickly by someone smart, not assembled by a template.' },
  { id: 'b5', section: 'Output format', title: 'What you get back', content: 'Three emails under 90 words each, subject lines under 6 words, plus a note on the best send window based on the prospect’s timezone.' },
  { id: 'b6', section: 'Guardrails', title: 'What it never does', content: 'Never fabricates a mutual connection or fake personalization. Never writes a false urgency line. Won’t send-spam vibes: if the input has no genuine relevance hook, it says so and asks for one.' },
]

const BLOCKS_STANDUP = [
  { id: 'b1', section: 'Role', title: 'Who the AI becomes', content: 'You are a chief of staff who turns messy work notes into a crisp status update your team actually reads.' },
  { id: 'b2', section: 'What it asks you', title: 'Details it collects first', content: 'Your raw notes (paste anything — bullet fragments, Slack copy-paste, half sentences), who the update is for, and the one decision you need from them.' },
  { id: 'b3', section: 'Instructions', title: 'How it writes', content: 'Sorts everything into Progress / Blockers / Next. Puts the needed decision at the top, bolded. Cuts anything that’s noise for this audience. Keeps the whole update under 150 words.' },
  { id: 'b4', section: 'Guardrails', title: 'What it never does', content: 'Never softens a blocker into a "challenge". Never reports something as done that your notes only say is in progress.' },
]

const now = Date.now()
const daysAgo = (d) => new Date(now - d * 864e5).toISOString()

/** Flagship, fully-detailed skills. */
export const skills = [
  {
    id: 'sk_listing-pro',
    title: 'Property Listing Pro',
    tagline: 'Turn a plain address and three facts into a listing that books viewings.',
    category: 'Real Estate', roles: ['Broker', 'Marketer'], tags: ['listings', 'storytelling'],
    version: '3.2.0', stars: 1284, starredByMe: true, forksTotal: 342, forksWeek: 18, saves: 2109, savedByMe: true,
    rating: 4.8, reviewCount: 96, creatorId: 'u_maya', updatedAt: daysAgo(2), publishedAt: daysAgo(210),
    isNew: false, deprecated: false, basedOn: null,
    blocks: BLOCKS_LISTING,
    versions: [
      { v: '3.2.0', notes: 'Added fair-housing guardrail phrasing review pass; social captions now sized per platform.', by: 'u_maya', date: daysAgo(2), deprecated: null },
      { v: '3.1.0', notes: 'New "neighborhood vibe" question. Tightened headline rule to 10 words.', by: 'u_maya', date: daysAgo(34), deprecated: null },
      { v: '3.0.0', notes: 'Full rewrite around a scene-first structure. Breaking: output format changed.', by: 'u_maya', date: daysAgo(88), deprecated: null },
      { v: '2.4.1', notes: 'Fixed bullet list occasionally repeating the headline feature.', by: 'u_maya', date: daysAgo(140), deprecated: { reason: 'Superseded by the 3.x structure — output format differs.' } },
      { v: '2.4.0', notes: 'Added Facebook caption variant.', by: 'u_maya', date: daysAgo(170), deprecated: { reason: 'Superseded by the 3.x structure — output format differs.' } },
    ],
  },
  {
    id: 'sk_explain-teen',
    title: 'Explain It To My Teen',
    tagline: 'One exam topic, explained from what your kid already knows.',
    category: 'Education', roles: ['Teacher', 'Parent'], tags: ['lesson-plans', 'summaries'],
    version: '2.0.1', stars: 923, starredByMe: false, forksTotal: 267, forksWeek: 31, saves: 1560, savedByMe: true,
    rating: 4.9, reviewCount: 74, creatorId: 'u_daniel', updatedAt: daysAgo(5), publishedAt: daysAgo(160),
    isNew: false, deprecated: false, basedOn: null,
    blocks: BLOCKS_EXPLAIN,
    versions: [
      { v: '2.0.1', notes: 'Check-questions now adapt difficulty when the first answer is shaky.', by: 'u_daniel', date: daysAgo(5), deprecated: null },
      { v: '2.0.0', notes: 'Rebuilt around "start from what they know". Breaking: intake questions changed.', by: 'u_daniel', date: daysAgo(60), deprecated: null },
      { v: '1.3.0', notes: 'Added exam-board awareness (AQA, Edexcel, IB).', by: 'u_daniel', date: daysAgo(120), deprecated: null },
    ],
  },
  {
    id: 'sk_fridge-week',
    title: 'Fridge-First Meal Week',
    tagline: 'Seven dinners from what you already have, waste-free.',
    category: 'Cooking', roles: ['Parent'], tags: ['meal-prep', 'planning'],
    version: '1.4.0', stars: 731, starredByMe: false, forksTotal: 148, forksWeek: 9, saves: 1204, savedByMe: false,
    rating: 4.7, reviewCount: 52, creatorId: 'u_tom', updatedAt: daysAgo(9), publishedAt: daysAgo(130),
    isNew: false, deprecated: false, basedOn: null,
    blocks: BLOCKS_MEALS,
    versions: [
      { v: '1.4.0', notes: 'Added "chaos nights" — 15-minute meals on nights you flag as busy.', by: 'u_tom', date: daysAgo(9), deprecated: null },
      { v: '1.3.0', notes: 'Shopping list now grouped by aisle.', by: 'u_tom', date: daysAgo(55), deprecated: null },
      { v: '1.2.0', notes: 'Rescue swaps for off ingredients.', by: 'u_tom', date: daysAgo(90), deprecated: null },
    ],
  },
  {
    id: 'sk_cold-email',
    title: 'Cold Email That Gets Replies',
    tagline: 'A 3-touch sequence built on a real trigger, not a template.',
    category: 'Sales', roles: ['Account exec', 'Founder'], tags: ['cold-outreach', 'email'],
    version: '4.0.0', stars: 1876, starredByMe: true, forksTotal: 512, forksWeek: 42, saves: 2871, savedByMe: false,
    rating: 4.6, reviewCount: 143, creatorId: 'u_liam', updatedAt: daysAgo(1), publishedAt: daysAgo(300),
    isNew: false, deprecated: false, basedOn: null,
    blocks: BLOCKS_COLD,
    versions: [
      { v: '4.0.0', notes: 'Breaking: now generates a 3-touch sequence instead of a single email. Added send-window note.', by: 'u_liam', date: daysAgo(1), deprecated: null },
      { v: '3.2.0', notes: 'Subject lines capped at 6 words after reply-rate testing.', by: 'u_liam', date: daysAgo(40), deprecated: null },
      { v: '3.1.0', notes: 'Added graceful-breakup email.', by: 'u_liam', date: daysAgo(95), deprecated: null },
    ],
  },
  {
    id: 'sk_standup',
    title: 'Messy Notes → Crisp Update',
    tagline: 'Paste your chaos, get a 150-word status your boss actually reads.',
    category: 'Productivity', roles: ['Product manager', 'Engineer', 'Consultant'], tags: ['summaries', 'reports'],
    version: '1.1.0', stars: 640, starredByMe: false, forksTotal: 89, forksWeek: 12, saves: 977, savedByMe: true,
    rating: 4.8, reviewCount: 38, creatorId: 'u_priya', updatedAt: daysAgo(3), publishedAt: daysAgo(45),
    isNew: false, deprecated: false, basedOn: null,
    blocks: BLOCKS_STANDUP,
    versions: [
      { v: '1.1.0', notes: 'Decision-needed line now pinned to the top and bolded.', by: 'u_priya', date: daysAgo(3), deprecated: null },
      { v: '1.0.0', notes: 'First release.', by: 'u_priya', date: daysAgo(45), deprecated: null },
    ],
  },
  {
    id: 'sk_investor-update',
    title: 'Investor Update, Founder Voice',
    tagline: 'Monthly updates that read confident even when the month was rough.',
    category: 'Finance', roles: ['Founder'], tags: ['reports', 'email', 'storytelling'],
    version: '2.2.0', stars: 1102, starredByMe: false, forksTotal: 234, forksWeek: 15, saves: 1688, savedByMe: false,
    rating: 4.7, reviewCount: 67, creatorId: 'u_jonas', updatedAt: daysAgo(7), publishedAt: daysAgo(240),
    isNew: false, deprecated: false, basedOn: null,
    blocks: [
      { id: 'b1', section: 'Role', title: 'Who the AI becomes', content: 'You are a founder’s ghostwriter who has drafted hundreds of investor updates. You know investors skim, pattern-match, and remember honesty.' },
      { id: 'b2', section: 'What it asks you', title: 'Details it collects first', content: 'The three numbers that matter this month, one thing that went wrong, one thing you learned, and the single ask you have for your investors.' },
      { id: 'b3', section: 'Instructions', title: 'How it writes', content: 'Numbers first, no throat-clearing. The bad news gets one honest paragraph with what you’re doing about it — buried bad news destroys trust. Ends with a specific, answerable ask.' },
      { id: 'b4', section: 'Tone & voice', title: 'The voice it uses', content: 'Direct, calm, numerate. Optimism earned by evidence, not adjectives.' },
      { id: 'b5', section: 'Guardrails', title: 'What it never does', content: 'Never spins a down month as a win. Never vague-asks ("any intros appreciated") — always one named, concrete request.' },
    ],
    versions: [
      { v: '2.2.0', notes: 'Added "one thing you learned" section after LP feedback.', by: 'u_jonas', date: daysAgo(7), deprecated: null },
      { v: '2.1.0', notes: 'Ask section now requires a named, concrete request.', by: 'u_jonas', date: daysAgo(70), deprecated: null },
    ],
  },
  {
    id: 'sk_interview-guide',
    title: 'User Interview Guide Builder',
    tagline: 'From a research question to a 45-minute guide with follow-up probes.',
    category: 'Research', roles: ['Researcher', 'Product manager', 'Designer'], tags: ['interviews', 'planning'],
    version: '1.6.0', stars: 587, starredByMe: false, forksTotal: 120, forksWeek: 7, saves: 890, savedByMe: false,
    rating: 4.9, reviewCount: 41, creatorId: 'u_amara', updatedAt: daysAgo(12), publishedAt: daysAgo(190),
    isNew: false, deprecated: false, basedOn: null,
    blocks: [
      { id: 'b1', section: 'Role', title: 'Who the AI becomes', content: 'You are a senior UX researcher who writes interview guides that surface stories, not opinions.' },
      { id: 'b2', section: 'What it asks you', title: 'Details it collects first', content: 'Your research question, who you’re interviewing, what decision this research feeds, and what you already believe (so it can help you avoid confirming it).' },
      { id: 'b3', section: 'Instructions', title: 'How it builds the guide', content: 'Warm-up → context → story-mining → specifics → wrap. Every main question gets two follow-up probes. Leading questions get rewritten automatically with a note explaining why.' },
      { id: 'b4', section: 'Output format', title: 'What you get back', content: 'A timed 45-minute guide, a one-page cheat sheet version, and a "bias check" list of the assumptions you brought in.' },
      { id: 'b5', section: 'Guardrails', title: 'What it never does', content: 'Never writes yes/no mains. Never lets "would you use X?" through — it converts hypotheticals into past-behavior questions.' },
    ],
    versions: [
      { v: '1.6.0', notes: 'Added bias-check output. Probes are now behavior-anchored.', by: 'u_amara', date: daysAgo(12), deprecated: null },
      { v: '1.5.0', notes: 'One-page cheat sheet variant.', by: 'u_amara', date: daysAgo(100), deprecated: null },
    ],
  },
  {
    id: 'sk_jd-human',
    title: 'Job Descriptions, Like a Human',
    tagline: 'JDs that tell the truth about the job and still attract great people.',
    category: 'HR & People', roles: ['Recruiter', 'Founder'], tags: ['onboarding', 'rewrite'],
    version: '2.1.0', stars: 445, starredByMe: false, forksTotal: 76, forksWeek: 4, saves: 623, savedByMe: false,
    rating: 4.5, reviewCount: 29, creatorId: 'u_grace', updatedAt: daysAgo(20), publishedAt: daysAgo(150),
    isNew: false, deprecated: false, basedOn: null,
    blocks: [
      { id: 'b1', section: 'Role', title: 'Who the AI becomes', content: 'You are a people-ops lead who writes job posts candidates screenshot and send to friends.' },
      { id: 'b2', section: 'Instructions', title: 'How it writes', content: 'Describes an actual week in the role, not a virtues list. Splits must-haves (max 5) from nice-to-haves honestly. States salary range and why. Cuts every cliché — no rockstars, ninjas, or fast-paced environments.' },
      { id: 'b3', section: 'Guardrails', title: 'What it never does', content: 'Never lists 12 requirements for a junior role. Never hides the level or the range. Flags biased phrasing (gendered words, age-coded terms) with suggested swaps.' },
    ],
    versions: [
      { v: '2.1.0', notes: 'Bias-phrase flagging with inline swaps.', by: 'u_grace', date: daysAgo(20), deprecated: null },
      { v: '2.0.0', notes: 'Rebuilt around "a week in the role" structure.', by: 'u_grace', date: daysAgo(110), deprecated: null },
    ],
  },
  {
    id: 'sk_seo-brief',
    title: 'SEO Content Brief Machine',
    tagline: 'Keyword in, complete writer-ready brief out — intent, outline, entities.',
    category: 'Marketing', roles: ['Marketer', 'Copywriter'], tags: ['seo', 'planning'],
    version: '3.0.0', stars: 1543, starredByMe: false, forksTotal: 401, forksWeek: 22, saves: 2260, savedByMe: true,
    rating: 4.6, reviewCount: 118, creatorId: 'u_sofia', updatedAt: daysAgo(4), publishedAt: daysAgo(280),
    isNew: false, deprecated: false, basedOn: null,
    blocks: [
      { id: 'b1', section: 'Role', title: 'Who the AI becomes', content: 'You are a search strategist who reverse-engineers intent before touching an outline.' },
      { id: 'b2', section: 'What it asks you', title: 'Details it collects first', content: 'Target keyword, your product/site, audience sophistication, and two competitor URLs you respect.' },
      { id: 'b3', section: 'Instructions', title: 'How it builds the brief', content: 'Classifies intent (informational/commercial/navigational). Drafts an H2/H3 outline that answers the intent in the first screen. Lists entities and questions to cover, internal link ideas, and a meta title/description pair.' },
      { id: 'b4', section: 'Guardrails', title: 'What it never does', content: 'Never keyword-stuffs. Never proposes content that just clones the competitors — each brief must name its "only we can say this" angle.' },
    ],
    versions: [
      { v: '3.0.0', notes: 'Breaking: briefs now require an "only we can say this" angle. Entity list added.', by: 'u_sofia', date: daysAgo(4), deprecated: null },
      { v: '2.5.0', notes: 'Meta title/description pair added.', by: 'u_sofia', date: daysAgo(80), deprecated: null },
    ],
  },
  {
    id: 'sk_sql-narrative',
    title: 'Analysis → Narrative',
    tagline: 'Turn query results into a story stakeholders can retell.',
    category: 'Data & Analytics', roles: ['Analyst'], tags: ['analysis', 'reports', 'summaries'],
    version: '1.2.0', stars: 389, starredByMe: false, forksTotal: 54, forksWeek: 6, saves: 512, savedByMe: false,
    rating: 4.7, reviewCount: 21, creatorId: 'u_hiro', updatedAt: daysAgo(15), publishedAt: daysAgo(85),
    isNew: false, deprecated: false, basedOn: null,
    blocks: [
      { id: 'b1', section: 'Role', title: 'Who the AI becomes', content: 'You are an analytics translator. You turn tables into narratives without torturing the data.' },
      { id: 'b2', section: 'Instructions', title: 'How it writes', content: 'Lead with the "so what" in one sentence. Three supporting findings max, each with its number. One caveat section — honest about sample size, seasonality and confounders. Ends with the decision the data supports (or "this data can’t answer that yet").' },
      { id: 'b3', section: 'Guardrails', title: 'What it never does', content: 'Never implies causation from correlation. Never hides a small n. Refuses to cherry-pick a date range without flagging it.' },
    ],
    versions: [
      { v: '1.2.0', notes: 'Caveat section is now mandatory.', by: 'u_hiro', date: daysAgo(15), deprecated: null },
    ],
  },
  {
    id: 'sk_prd-first-draft',
    title: 'PRD First Draft',
    tagline: 'A one-pager PRD from a problem statement — opinions included.',
    category: 'Product', roles: ['Product manager', 'Founder'], tags: ['planning', 'reports'],
    version: '2.3.0', stars: 856, starredByMe: false, forksTotal: 198, forksWeek: 11, saves: 1340, savedByMe: false,
    rating: 4.5, reviewCount: 58, creatorId: 'u_priya', updatedAt: daysAgo(6), publishedAt: daysAgo(200),
    isNew: false, deprecated: false, basedOn: null,
    blocks: [
      { id: 'b1', section: 'Role', title: 'Who the AI becomes', content: 'You are a principal PM who writes one-pagers that get decisions made in a single review.' },
      { id: 'b2', section: 'Instructions', title: 'How it writes', content: 'Problem → evidence → proposed bet → what we’re NOT doing → open questions with an owner each. Forces a success metric with a number, not a direction.' },
      { id: 'b3', section: 'Guardrails', title: 'What it never does', content: 'Never writes "improve engagement" as a goal. Never lets scope hide in an appendix.' },
    ],
    versions: [
      { v: '2.3.0', notes: '"What we’re NOT doing" section is now required.', by: 'u_priya', date: daysAgo(6), deprecated: null },
    ],
  },
  {
    id: 'sk_lesson-lab',
    title: 'Lesson Plan Lab',
    tagline: 'A full 50-minute lesson with starter, activities and exit ticket.',
    category: 'Education', roles: ['Teacher'], tags: ['lesson-plans', 'planning'],
    version: '1.0.0', stars: 34, starredByMe: false, forksTotal: 6, forksWeek: 6, saves: 0, savedByMe: false,
    rating: 4.9, reviewCount: 3, creatorId: 'u_daniel', updatedAt: daysAgo(1), publishedAt: daysAgo(1),
    isNew: true, deprecated: false, basedOn: null,
    blocks: [
      { id: 'b1', section: 'Role', title: 'Who the AI becomes', content: 'You are a curriculum designer who plans lessons teachers can actually run — with timings that survive contact with a real classroom.' },
      { id: 'b2', section: 'Instructions', title: 'How it plans', content: 'Do-now starter (5m) → direct instruction (12m) → guided practice (15m) → independent task (12m) → exit ticket (6m). Every activity names its materials and its differentiation options.' },
      { id: 'b3', section: 'Guardrails', title: 'What it never does', content: 'Never plans an activity that needs materials you didn’t confirm you have. Exit ticket always maps to the stated objective.' },
    ],
    versions: [
      { v: '1.0.0', notes: 'First release.', by: 'u_daniel', date: daysAgo(1), deprecated: null },
    ],
  },
  {
    id: 'sk_support-empath',
    title: 'Support Replies With Spine',
    tagline: 'Empathetic replies that still say no when no is the answer.',
    category: 'Customer Support', roles: ['Consultant'], tags: ['email', 'rewrite'],
    version: '1.8.0', stars: 512, starredByMe: false, forksTotal: 97, forksWeek: 3, saves: 731, savedByMe: false,
    rating: 4.4, reviewCount: 33, creatorId: 'u_sofia', updatedAt: daysAgo(28), publishedAt: daysAgo(170),
    isNew: false, deprecated: false, basedOn: null,
    blocks: [
      { id: 'b1', section: 'Role', title: 'Who the AI becomes', content: 'You are a support lead who believes clarity is kindness. You never hide a "no" inside three paragraphs of apology.' },
      { id: 'b2', section: 'Instructions', title: 'How it writes', content: 'Acknowledge the actual frustration in one specific sentence. Give the answer in the second sentence — even if it’s no. Then the why, then the workaround if one exists, then one concrete next step.' },
      { id: 'b3', section: 'Guardrails', title: 'What it never does', content: 'Never promises a roadmap item. Never blames the user. Never writes "we apologize for any inconvenience" — it names the actual inconvenience.' },
    ],
    versions: [
      { v: '1.8.0', notes: 'Workaround section added when the answer is no.', by: 'u_sofia', date: daysAgo(28), deprecated: null },
    ],
  },
  {
    id: 'sk_legacy-tweetstorm',
    title: 'Tweetstorm Composer (Classic)',
    tagline: 'Long-form threads for the old timeline era.',
    category: 'Social Media', roles: ['Marketer'], tags: ['social', 'storytelling'],
    version: '2.0.0', stars: 780, starredByMe: false, forksTotal: 203, forksWeek: 0, saves: 940, savedByMe: false,
    rating: 4.1, reviewCount: 61, creatorId: 'u_sofia', updatedAt: daysAgo(400), publishedAt: daysAgo(600),
    isNew: false, deprecated: true, deprecatedReason: 'Platform changed its format rules; use "Short-form Story Engine" instead.',
    basedOn: null,
    blocks: [
      { id: 'b1', section: 'Role', title: 'Who the AI becomes', content: 'You are a thread-writer from the golden age of tweetstorms.' },
      { id: 'b2', section: 'Instructions', title: 'How it writes', content: 'Hook tweet, then one idea per tweet, numbered, with a recap and CTA at the end.' },
    ],
    versions: [
      { v: '2.0.0', notes: 'Numbered format.', by: 'u_sofia', date: daysAgo(400), deprecated: { reason: 'Platform changed its format rules; use "Short-form Story Engine" instead.' } },
      { v: '1.0.0', notes: 'First release.', by: 'u_sofia', date: daysAgo(600), deprecated: { reason: 'Superseded.' } },
    ],
  },
  {
    id: 'sk_listing-luxury',
    title: 'Luxury Listing Pro',
    tagline: 'Property Listing Pro, retuned for the $2M+ market.',
    category: 'Real Estate', roles: ['Broker'], tags: ['listings', 'storytelling'],
    version: '1.2.0', stars: 214, starredByMe: false, forksTotal: 31, forksWeek: 2, saves: 356, savedByMe: false,
    rating: 4.6, reviewCount: 14, creatorId: 'u_sofia', updatedAt: daysAgo(11), publishedAt: daysAgo(70),
    isNew: false, deprecated: false,
    basedOn: { id: 'sk_listing-pro', title: 'Property Listing Pro' },
    blocks: [
      { id: 'b1', section: 'Role', title: 'Who the AI becomes', content: 'You are a luxury property storyteller. Understatement is the brand: the details carry the price tag, not the adjectives.' },
      { id: 'b2', section: 'Instructions', title: 'How it writes', content: 'Names materials, makers and provenance (Gaggenau, white oak, 1928 bones). One paragraph on privacy and position. No price adjectives — "exceptional" is banned; "book-matched Calacatta" is not.' },
      { id: 'b3', section: 'Guardrails', title: 'What it never does', content: 'Everything from Property Listing Pro, plus: never names neighbors or prior owners, never implies celebrity association.' },
    ],
    versions: [
      { v: '1.2.0', notes: 'Provenance-naming guidance added.', by: 'u_sofia', date: daysAgo(11), deprecated: null },
      { v: '1.0.0', notes: 'Forked from Property Listing Pro v3.0.0 and retuned for luxury.', by: 'u_sofia', date: daysAgo(70), deprecated: null },
    ],
  },
]

// Generated long-tail so the marketplace scrolls forever-ish (deterministic).
const GEN_TITLES = [
  ['Weekly Retro Facilitator', 'Productivity', 'Runs a blameless retro and extracts 3 actions.', ['planning', 'feedback'], ['Product manager', 'Engineer']],
  ['Grant Proposal Skeleton', 'Writing', 'A fundable structure for first-time grant writers.', ['reports', 'planning'], ['Researcher', 'Consultant']],
  ['Onboarding Email Series', 'Marketing', 'Five emails that activate, not annoy.', ['email', 'onboarding'], ['Marketer']],
  ['Contract Red-Flag Scanner', 'Legal', 'Plain-English summary of the clauses that bite.', ['analysis', 'summaries'], ['Founder', 'Consultant']],
  ['Physio Home Plan', 'Health', 'A gentle, progressive plan from your PT’s notes.', ['planning'], ['Coach']],
  ['Itinerary Architect', 'Travel', 'Real routes, real opening hours, zero backtracking.', ['planning'], ['Parent', 'Student']],
  ['Performance Review Drafter', 'HR & People', 'Specific, fair, growth-oriented reviews.', ['feedback', 'reports'], ['Recruiter']],
  ['Landing Page Teardown', 'Design', 'A conversion-focused critique with rewrites.', ['analysis', 'rewrite'], ['Designer', 'Marketer']],
  ['Churn Interview Miner', 'Research', 'Finds the real reason they left.', ['interviews', 'analysis'], ['Researcher', 'Founder']],
  ['Meeting → Minutes', 'Productivity', 'Transcript in, decisions and owners out.', ['summaries'], ['Consultant']],
  ['Ad Copy Splitter', 'Marketing', '12 angle variations for one offer.', ['social', 'brainstorm'], ['Marketer', 'Copywriter']],
  ['Budget Reality Check', 'Finance', 'A monthly budget that admits you order takeout.', ['planning', 'analysis'], ['Student', 'Parent']],
  ['College Essay Socratic', 'Education', 'Draws the story out of the student — never writes it for them.', ['storytelling', 'feedback'], ['Student', 'Teacher']],
  ['Bug Report Translator', 'Engineering', 'From "it’s broken" to a reproducible report.', ['reports', 'rewrite'], ['Engineer']],
  ['Etsy Listing Optimizer', 'E-commerce', 'Titles and tags tuned for handmade search.', ['listings', 'seo'], ['Marketer']],
  ['Bedtime Story Weaver', 'Parenting', 'Tonight’s story, starring your kid and their day.', ['storytelling'], ['Parent']],
  ['5K Training Coach', 'Fitness', 'Couch to 5K, adjusted weekly to how it felt.', ['planning'], ['Coach', 'Student']],
  ['Salary Negotiation Prep', 'Career', 'Your case, their counters, your responses.', ['planning', 'interviews'], ['Student', 'Engineer']],
  ['Deep Work Scheduler', 'Personal Growth', 'A week designed around your actual energy.', ['planning'], ['Founder', 'Engineer']],
  ['Press Release, Unstuffed', 'Writing', 'News announcements journalists don’t delete.', ['reports', 'storytelling'], ['Marketer', 'Founder']],
  ['Refund Policy Humanizer', 'Customer Support', 'Policies people can read without a lawyer.', ['rewrite'], ['Founder']],
  ['Data Dictionary Builder', 'Data & Analytics', 'Column-by-column docs your team will keep updated.', ['reports', 'analysis'], ['Analyst', 'Engineer']],
  ['Portfolio Case Study Coach', 'Design', 'Turns your project into a hiring-manager-ready story.', ['storytelling', 'feedback'], ['Designer', 'Student']],
  ['Open House Follow-Up', 'Real Estate', 'Same-day notes that turn visitors into offers.', ['email', 'listings'], ['Broker']],
]

const GEN_CREATORS = ['u_maya', 'u_daniel', 'u_sofia', 'u_jonas', 'u_amara', 'u_liam', 'u_priya', 'u_tom', 'u_grace', 'u_hiro']

export const generatedSkills = GEN_TITLES.flatMap(([title, category, tagline, tg, rl], i) =>
  [0, 1].map((variant) => {
    const idx = i * 2 + variant
    const stars = ((idx * 137) % 900) + 12
    const isNew = idx % 11 === 0
    return {
      id: `sk_gen_${idx}`,
      title: variant === 0 ? title : `${title} (Team Edition)`,
      tagline: variant === 0 ? tagline : `${tagline} Built for shared team workflows.`,
      basedOn: variant === 1 ? { id: `sk_gen_${idx - 1}`, title } : null,
      category, roles: rl, tags: tg,
      version: `${1 + (idx % 3)}.${idx % 6}.0`,
      stars, starredByMe: false,
      forksTotal: Math.floor(stars / 4), forksWeek: (idx * 7) % 20,
      saves: isNew ? 0 : Math.floor(stars * 1.6), savedByMe: false,
      rating: 4 + ((idx % 9) / 10), reviewCount: (idx * 3) % 60,
      creatorId: GEN_CREATORS[idx % GEN_CREATORS.length],
      updatedAt: daysAgo((idx % 40) + 1), publishedAt: daysAgo((idx % 300) + 10),
      isNew, deprecated: false,
      blocks: [
        { id: 'b1', section: 'Role', title: 'Who the AI becomes', content: `You are an experienced practitioner focused on one job: ${tagline.toLowerCase()}` },
        { id: 'b2', section: 'Instructions', title: 'How it works', content: 'It asks for the minimum context it needs, works in clearly labeled steps, and always explains what it would need to do a better job.' },
        { id: 'b3', section: 'Guardrails', title: 'What it never does', content: 'Never invents facts you didn’t provide. Flags uncertainty instead of guessing. Keeps your data in your prompt — nothing implied to be shared.' },
      ],
      versions: [
        { v: `${1 + (idx % 3)}.${idx % 6}.0`, notes: 'Iterative improvements from community feedback.', by: GEN_CREATORS[idx % GEN_CREATORS.length], date: daysAgo((idx % 40) + 1), deprecated: null },
        { v: `${1 + (idx % 3)}.0.0`, notes: 'First release in this line.', by: GEN_CREATORS[idx % GEN_CREATORS.length], date: daysAgo((idx % 300) + 10), deprecated: null },
      ],
    }
  })
)

export const allSkills = [...skills, ...generatedSkills]
export const skillById = (id) => allSkills.find((s) => s.id === id)

/** Marketplace skills forked from this one (its direct children). */
export const forksOf = (id) => allSkills.filter((s) => s.basedOn?.id === id)

/** Your own draft copies of this skill. */
export const myForksOf = (id) => drafts.forked.filter((d) => d.basedOn?.id === id)

/**
 * Deterministic weekly time-series for a skill — the mock stand-in for real
 * analytics. Same id always yields the same curve; trending skills trend up.
 */
export function seriesFor(id, weeks = 12) {
  let h = 7
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) & 0x7fffffff
  const rand = () => {
    h = (h * 1103515245 + 12345) & 0x7fffffff
    return h / 0x7fffffff
  }
  const skill = skillById(id)
  const heat = skill ? Math.min(1, skill.forksWeek / 30) : 0.4
  const out = []
  let level = 2 + rand() * 4
  for (let i = 0; i < weeks; i++) {
    level += rand() * (2.5 + heat * 6) - 1 + heat * (i / weeks) * 2.2
    level = Math.max(0.5, level)
    out.push(Math.round(level * 10) / 10)
  }
  return out
}

/** Cumulative star curve ending at the skill's real star count. */
export function starCurveFor(skill, weeks = 12) {
  const deltas = seriesFor(`stars:${skill.id}`, weeks)
  const sum = deltas.reduce((a, b) => a + b, 0)
  let acc = Math.max(0, skill.stars * 0.55)
  const scale = (skill.stars - acc) / sum
  return deltas.map((d) => Math.round((acc += d * scale)))
}

/** Rating distribution (5→1 stars) consistent with the skill's average. */
export function ratingDistFor(skill) {
  const r = skill.rating ?? 4.5
  const n = Math.max(1, skill.reviewCount ?? 1)
  const five = Math.max(0.05, (r - 3.4) / 1.6)
  const weights = [five, 0.72 * five, 0.18, 0.07, 0.04]
  const total = weights.reduce((a, b) => a + b, 0)
  return weights.map((w) => Math.round((w / total) * n))
}

// ——— Comments & reviews (for flagship skills) ———
export const commentsBySkill = {
  'sk_listing-pro': [
    {
      id: 'c1', userId: 'u_liam', text: 'Used this for a tired 2-bed that sat for 60 days. Rewrote the listing, three viewings booked that weekend. The "scene" trick is the whole game.', date: daysAgo(3), reactions: { '\u{1F525}': 12, '\u{1F44D}': 8 },
      replies: [
        { id: 'c1r1', userId: 'u_maya', text: 'This makes my week. The scene-first structure came from A/B testing 40 of my own listings.', date: daysAgo(3), reactions: { '\u{1F49C}': 6 } },
      ],
    },
    {
      id: 'c2', userId: 'u_grace', text: 'Would love a rental-market variant — the viewing CTA doesn’t quite fit lease listings.', date: daysAgo(8), reactions: { '\u{1F44D}': 4 },
      replies: [],
    },
    {
      id: 'c3', userId: 'u_tom', text: 'Not even in real estate and I forked it to write our Airbnb description. Absurdly good.', date: daysAgo(15), reactions: { '\u{1F602}': 9, '\u{1F525}': 3 },
      replies: [],
    },
  ],
  'sk_cold-email': [
    { id: 'c4', userId: 'u_jonas', text: 'Reply rate went from 2% to 9% over three weeks. The breakup email alone books meetings.', date: daysAgo(2), reactions: { '\u{1F525}': 21, '\u{1F92F}': 5 }, replies: [] },
    { id: 'c5', userId: 'u_priya', text: 'The "no relevance hook, no email" guardrail is such a quietly great design decision.', date: daysAgo(6), reactions: { '\u{1F44D}': 11 }, replies: [] },
  ],
}

export const reviewsBySkill = {
  'sk_listing-pro': [
    { id: 'r1', userId: 'u_liam', rating: 5, text: 'The gold standard for listing skills. The guardrails block saved me from a fair-housing mistake I didn’t know I was making.', date: daysAgo(5) },
    { id: 'r2', userId: 'u_sofia', rating: 5, text: 'I forked this into a luxury variant and the bones held up perfectly. Beautifully structured.', date: daysAgo(30) },
    { id: 'r3', userId: 'u_hiro', rating: 4, text: 'Excellent output. Wish the intake questions were configurable — I always skip the neighborhood one.', date: daysAgo(52) },
  ],
  'sk_cold-email': [
    { id: 'r4', userId: 'u_maya', rating: 5, text: 'Adapted it for real-estate prospecting. The trigger-event framing works in any industry.', date: daysAgo(9) },
    { id: 'r5', userId: 'u_grace', rating: 4, text: 'Great structure. The v4 sequence change broke my saved workflow, but the changelog was honest about it.', date: daysAgo(1) },
  ],
}

// ——— My stuff: drafts, published, review inbox ———
export const drafts = {
  created: [
    { id: 'd_release-notes', title: 'Release Notes, Humanized', category: 'Writing', edits: 23, lastTouched: daysAgo(0.2), blocks: BLOCKS_STANDUP.slice(0, 3), status: 'draft' },
    { id: 'd_retro-bot', title: 'Sprint Retro Synthesizer', category: 'Productivity', edits: 9, lastTouched: daysAgo(2), blocks: BLOCKS_STANDUP.slice(0, 2), status: 'draft' },
  ],
  forked: [
    {
      id: 'd_cold-email-fintech', title: 'Cold Email — Fintech Edition', category: 'Sales', edits: 14, lastTouched: daysAgo(1),
      basedOn: { id: 'sk_cold-email', title: 'Cold Email That Gets Replies', version: '4.0.0' },
      blocks: BLOCKS_COLD, status: 'draft',
    },
    {
      id: 'd_listing-rentals', title: 'Rental Listing Variant', category: 'Real Estate', edits: 4, lastTouched: daysAgo(5),
      basedOn: { id: 'sk_listing-pro', title: 'Property Listing Pro', version: '3.2.0' },
      blocks: BLOCKS_LISTING, status: 'draft',
    },
  ],
}

export const myPublished = [
  {
    id: 'sk_standup', // published by "me" for the mock
    title: 'Messy Notes → Crisp Update', category: 'Productivity',
    tagline: 'Paste your chaos, get a 150-word status your boss actually reads.',
    stars: 640, forksTotal: 89, saves: 977, currentVersion: '1.1.0',
    versions: [
      { v: '1.1.0', notes: 'Decision-needed line now pinned to the top and bolded.', date: daysAgo(3), deprecated: null },
      { v: '1.0.0', notes: 'First release.', date: daysAgo(45), deprecated: null },
    ],
  },
  {
    id: 'sk_weekly-review',
    title: 'Weekly Review Ritual', category: 'Personal Growth',
    tagline: 'Fifteen honest minutes that set up the whole next week.',
    stars: 112, forksTotal: 19, saves: 208, currentVersion: '1.2.0',
    versions: [
      { v: '1.2.0', notes: 'Added an energy audit question.', date: daysAgo(12), deprecated: null },
      { v: '1.1.0', notes: 'Wins section now comes before gaps — order matters for honesty.', date: daysAgo(50), deprecated: null },
      { v: '1.0.0', notes: 'First release.', date: daysAgo(120), deprecated: { reason: 'Early structure buried the weekly priorities at the bottom.' } },
    ],
  },
]

export const suggestions = [
  {
    id: 'sug_1', skillId: 'sk_standup', skillTitle: 'Messy Notes → Crisp Update',
    userId: 'u_hiro', date: daysAgo(1),
    note: 'The blocker section reads passive. Active phrasing makes owners obvious — tried this on my team for two weeks.',
    changes: [
      {
        id: 'ch_1', blockTitle: 'How it writes',
        before: 'Sorts everything into Progress / Blockers / Next. Puts the needed decision at the top, bolded.',
        after: 'Sorts everything into Progress / Blockers / Next. Every blocker names who can unblock it. Puts the needed decision at the top, bolded.',
      },
    ],
  },
  {
    id: 'sug_2', skillId: 'sk_standup', skillTitle: 'Messy Notes → Crisp Update',
    userId: 'u_amara', date: daysAgo(2),
    note: null,
    changes: [
      {
        id: 'ch_2', blockTitle: 'What it never does',
        before: 'Never softens a blocker into a "challenge". Never reports something as done that your notes only say is in progress.',
        after: 'Never softens a blocker into a "challenge". Never reports something as done that your notes only say is in progress. Never pads the update to look busier than the week was.',
      },
      {
        id: 'ch_3', blockTitle: 'Details it collects first',
        before: 'Your raw notes (paste anything — bullet fragments, Slack copy-paste, half sentences), who the update is for, and the one decision you need from them.',
        after: 'Your raw notes (paste anything — bullet fragments, Slack copy-paste, half sentences), who the update is for, the one decision you need from them, and when you need it by.',
      },
    ],
  },
  {
    id: 'sug_3', skillId: 'sk_weekly-review', skillTitle: 'Weekly Review Ritual',
    userId: 'u_tom', date: daysAgo(4),
    note: 'Small wording tweak — "failures" made me avoid the review on bad weeks. "Gaps" kept me honest without the sting.',
    changes: [
      {
        id: 'ch_4', blockTitle: 'How it guides you',
        before: 'Reviews wins first, then failures, then picks three priorities for next week.',
        after: 'Reviews wins first, then gaps, then picks three priorities for next week.',
      },
    ],
  },
]

// ——— Memory ———
export const memorySections = [
  {
    id: 'ms_role', title: 'Who you are', icon: 'user',
    entries: [
      { id: 'me_1', q: 'What do you do?', a: 'Product engineer at Orvex, building a prompt marketplace. I ship full-stack features end to end.' },
      { id: 'me_2', q: 'Who do you usually write for?', a: 'My team (engineers + a designer), our founder, and occasionally users in release notes.' },
    ],
  },
  {
    id: 'ms_voice', title: 'How you sound', icon: 'mic',
    entries: [
      { id: 'me_3', q: 'Describe your writing voice', a: 'Direct and warm. Short sentences. I’d rather be clear than impressive. Light humor is fine, memes are not.' },
      { id: 'me_4', q: 'Words or phrases you avoid?', a: '"Leverage", "synergy", "circle back". Exclamation marks in professional writing.' },
    ],
  },
  {
    id: 'ms_rules', title: 'Your rules', icon: 'shield',
    entries: [
      { id: 'me_5', q: 'Standing instructions for any AI', a: 'Give me the answer first, the reasoning second. If you’re unsure, say so — confident wrong answers are the worst outcome. Use metric units.' },
    ],
  },
  {
    id: 'ms_context', title: 'Your world', icon: 'globe',
    entries: [
      { id: 'me_6', q: 'Tools and stack', a: 'React, Vite, Tailwind, Node, Postgres. We deploy on Fridays (yes, really).' },
      { id: 'me_7', q: 'Private context', a: 'Prepping a stealth feature called “Atlas” for the July launch — keep it out of anything public.', sensitive: true },
    ],
  },
]

export const portraitSuggestions = [
  { id: 'ps_1', text: 'You tend to prefer bullet points over paragraphs in work documents.', source: 'From 14 recent sessions', sensitive: false },
  { id: 'ps_2', text: 'You’re preparing a July product launch — deadlines around July 22 keep appearing.', source: 'From your last 6 sessions', sensitive: false },
  { id: 'ps_3', text: 'Your manager’s name appears to be Selam, and you draft updates for her on Mondays.', source: 'From session on Jun 29', sensitive: true },
  { id: 'ps_4', text: 'You often convert times to East Africa Time (EAT) — likely your home timezone.', source: 'From 9 recent sessions', sensitive: false },
]

export const starterSkills = ['sk_standup', 'sk_prd-first-draft', 'sk_sql-narrative']

// ——— The Librarian ———
export const librarianItems = [
  {
    id: 'li_1', capturedAt: daysAgo(6), source: 'Claude session',
    preview: 'The staging database resets every Sunday at 02:00 UTC. Seed script lives in tools/seed — run with --fresh after a reset.',
    proposal: { kind: 'new', destination: 'wiki', reason: 'Looks like durable team knowledge about your staging environment. Nothing like it exists in your Wiki yet, so I’d file it as a new entry under "Infrastructure".' },
    sensitive: false, safe: true, conversation: [],
  },
  {
    id: 'li_2', capturedAt: daysAgo(5), source: 'ChatGPT session',
    preview: 'When writing release notes, you asked to always lead with the user-facing change, and keep internal refactors to a single line at the end.',
    proposal: { kind: 'update', destination: 'memory', reason: 'You already have a Memory entry about release-note style. This adds a new preference — I’d update that entry rather than duplicate it.' },
    sensitive: false, safe: false,
    diff: {
      before: 'Release notes: plain language, no ticket numbers in the text.',
      after: 'Release notes: plain language, no ticket numbers in the text. Lead with the user-facing change; internal refactors get one line at the end.',
    },
    conversation: [
      { who: 'librarian', text: 'This looks like a refinement of your existing release-notes preference, so I’m proposing an update instead of a new entry. The before/after shows exactly what changes.' },
    ],
  },
  {
    id: 'li_3', capturedAt: daysAgo(4), source: 'Claude session',
    preview: 'Postgres connection string for the analytics replica: postgres://analytics_ro:••••••••@rep-04.internal:5432/warehouse',
    proposal: { kind: 'discard', destination: 'trash', reason: 'This contains a credential. I never file secrets automatically — and honestly, this belongs in your secret manager, not your Wiki. I’d discard it.' },
    sensitive: true, safe: false, conversation: [
      { who: 'librarian', text: 'This item is sealed because it contains what looks like a database credential. I can’t and won’t file it automatically. My suggestion: discard it here and store it in your secret manager.' },
    ],
  },
  {
    id: 'li_4', capturedAt: daysAgo(3), source: 'Claude session',
    preview: 'Team decision: all new API endpoints use cursor pagination, not offset. Agreed in the API review on June 26.',
    proposal: { kind: 'merge', destination: 'wiki', reason: 'Your Wiki has an "API conventions" entry that mentions pagination but predates this decision. I’d merge this in as the authoritative rule.' },
    sensitive: false, safe: false,
    diff: {
      before: 'Pagination: prefer cursor-based where practical.',
      after: 'Pagination: all new endpoints use cursor pagination (decided in API review, Jun 26 2026). Offset pagination only for legacy endpoints.',
    },
    conversation: [],
  },
  {
    id: 'li_5', capturedAt: daysAgo(2), source: 'Gemini session',
    preview: 'You prefer code reviews to start with a summary of what the PR does, before line comments.',
    proposal: { kind: 'new', destination: 'memory', reason: 'A clear working preference. Nothing similar in Memory — I’d add it under "Your rules".' },
    sensitive: false, safe: true, conversation: [],
  },
  {
    id: 'li_6', capturedAt: daysAgo(0.5), source: 'Claude session',
    preview: 'Draft performance feedback for a teammate: "[Name] has grown a lot this quarter, but struggles with…"',
    proposal: { kind: 'discard', destination: 'trash', reason: 'This is sensitive personal feedback about a colleague. It shouldn’t live in your Wiki or Memory — I’d discard it once you’ve used it.' },
    sensitive: true, safe: false, conversation: [],
  },
]

export const shelves = [
  { id: 'wiki', name: 'Your Wiki', description: 'Durable knowledge', count: 128 },
  { id: 'memory', name: 'Memory', description: 'How you like to work', count: 42 },
  { id: 'trash', name: 'Trash', description: 'Throwaway', count: 311 },
]

export const librarianConnections = [
  { id: 'conn_1', name: 'Claude Desktop', connectedAt: daysAgo(40), lastCapture: daysAgo(0.5) },
  { id: 'conn_2', name: 'Cursor', connectedAt: daysAgo(12), lastCapture: daysAgo(3) },
]

// ——— Social: following, activity, collections ———
export const followingIds = ['u_maya', 'u_sofia', 'u_daniel', 'u_priya', 'u_liam']

export const activity = [
  { id: 'a1', type: 'published', skillId: 'sk_cold-email', userId: 'u_liam', date: daysAgo(1), version: '4.0.0' },
  { id: 'a2', type: 'published', skillId: 'sk_lesson-lab', userId: 'u_daniel', date: daysAgo(1), version: '1.0.0' },
  { id: 'a3', type: 'published', skillId: 'sk_listing-pro', userId: 'u_maya', date: daysAgo(2), version: '3.2.0' },
  { id: 'a4', type: 'published', skillId: 'sk_seo-brief', userId: 'u_sofia', date: daysAgo(4), version: '3.0.0' },
  { id: 'a5', type: 'published', skillId: 'sk_explain-teen', userId: 'u_daniel', date: daysAgo(5), version: '2.0.1' },
  { id: 'a6', type: 'published', skillId: 'sk_prd-first-draft', userId: 'u_priya', date: daysAgo(6), version: '2.3.0' },
  { id: 'a7', type: 'published', skillId: 'sk_investor-update', userId: 'u_jonas', date: daysAgo(7), version: '2.2.0' },
]

export const collections = [
  {
    id: 'col_1', name: 'My daily drivers', shareId: 'daily-drivers-x7k2', shared: true,
    description: 'The skills I open every single day.',
    skillIds: ['sk_standup', 'sk_prd-first-draft', 'sk_sql-narrative', 'sk_cold-email'],
  },
  {
    id: 'col_2', name: 'For the launch', shareId: null, shared: false,
    description: 'Everything for the July launch push.',
    skillIds: ['sk_seo-brief', 'sk_investor-update'],
  },
]

// ——— Wiki preview ———
export const wikiEntries = [
  { id: 'w1', title: 'API conventions', updated: daysAgo(3), excerpt: 'Cursor pagination for all new endpoints; error envelope shape; naming rules…' },
  { id: 'w2', title: 'Staging environment', updated: daysAgo(6), excerpt: 'Sunday 02:00 UTC resets, seed script usage, test-account credentials location…' },
  { id: 'w3', title: 'Release checklist', updated: daysAgo(14), excerpt: 'Pre-flight checks, comms templates, rollback procedure…' },
]

// ——— Admin ———
export const adminOrgs = [
  { id: 'org_orvex', name: 'Orvex', members: 14, skills: 89, plan: 'Team', created: daysAgo(400) },
  { id: 'org_acme', name: 'Acme Learning', members: 31, skills: 204, plan: 'Business', created: daysAgo(220) },
  { id: 'org_nova', name: 'Nova Realty Group', members: 8, skills: 47, plan: 'Team', created: daysAgo(90) },
]

export const adminUsers = [
  { id: 'au_1', name: 'Yafet Tesfaye', email: 'yafet.tesfaye@orvex.ai', org: 'Orvex', role: 'Admin', status: 'active', lastSeen: daysAgo(0.01) },
  { id: 'au_2', name: 'Maya Chen', email: 'maya@novarealty.com', org: 'Nova Realty Group', role: 'Member', status: 'active', lastSeen: daysAgo(0.3) },
  { id: 'au_3', name: 'Daniel Okafor', email: 'd.okafor@acmelearning.io', org: 'Acme Learning', role: 'Member', status: 'active', lastSeen: daysAgo(1) },
  { id: 'au_4', name: 'Sofia Marchetti', email: 'sofia@freelance.it', org: 'Personal', role: 'Member', status: 'active', lastSeen: daysAgo(0.1) },
  { id: 'au_5', name: 'Former Employee', email: 'old@orvex.ai', org: 'Orvex', role: 'Member', status: 'suspended', lastSeen: daysAgo(60) },
]

// ——— Export shapes ———
export function buildPromptText(skill) {
  return skill.blocks.map((b) => `## ${b.section}: ${b.title}\n\n${b.content}`).join('\n\n')
}

export function buildExport(skill, format) {
  const body = buildPromptText(skill)
  if (format === 'claude') {
    return `<skill name="${skill.title}" version="${skill.version}">\n<instructions>\n${skill.blocks.map((b) => `  <${b.section.toLowerCase().replace(/[^a-z]+/g, '_')}>\n  ${b.content}\n  </${b.section.toLowerCase().replace(/[^a-z]+/g, '_')}>`).join('\n')}\n</instructions>\n</skill>`
  }
  if (format === 'chatgpt') {
    return `# Custom instructions — ${skill.title} (v${skill.version})\n\n${body}\n\n---\nRespond according to the instructions above for every message in this conversation.`
  }
  return `${skill.title} (v${skill.version})\n${'─'.repeat(40)}\n\n${body}`
}
