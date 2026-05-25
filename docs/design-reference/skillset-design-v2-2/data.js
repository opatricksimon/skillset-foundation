/* Mock data for Skillset v2 prototype */

window.SkillsetData = {
  // categories for marketplace nav
  categories: [
    { id: 'all',       label: 'All paths',    count: 248 },
    { id: 'design',    label: 'Design',       count: 42 },
    { id: 'product',   label: 'Product',      count: 31 },
    { id: 'eng',       label: 'Engineering',  count: 58 },
    { id: 'business',  label: 'Business',     count: 36 },
    { id: 'writing',   label: 'Writing',      count: 22 },
    { id: 'leadership',label: 'Leadership',   count: 19 },
    { id: 'ai',        label: 'AI fluency',   count: 27 },
  ],

  // curated learning paths (NEW feature for v2)
  paths: [
    {
      id: 'p1',
      title: 'Become a Product Designer',
      glyph: 'Pd',
      tone: 'navy',
      desc: 'Twelve weeks from blank canvas to portfolio. Discovery, systems, prototyping, and the craft of presenting decisions to executives.',
      modules: 12, hours: 38, completers: '1,240'
    },
    {
      id: 'p2',
      title: 'Lead with Clarity',
      glyph: 'Lc',
      tone: 'red',
      desc: 'A program for engineering managers shifting from senior IC. Weekly cohort sessions with practitioners from Stripe, Linear and Figma.',
      modules: 9, hours: 24, completers: '612'
    },
    {
      id: 'p3',
      title: 'Write Like an Editor',
      glyph: 'We',
      tone: 'warm',
      desc: 'Rebuild your writing instincts. From product copy to long-form essays, taught by senior editors at The Atlantic and Stripe Press.',
      modules: 7, hours: 18, completers: '845'
    },
    {
      id: 'p4',
      title: 'Ship with AI Fluency',
      glyph: 'Ai',
      tone: 'green',
      desc: 'Pragmatic AI for product teams — prompts, evals, agents, and the playbooks for embedding LLMs into real surfaces without drift.',
      modules: 8, hours: 22, completers: '397'
    },
  ],

  // featured courses
  courses: [
    {
      id: 'c1',
      title: 'Design Systems at scale',
      cat: 'Design',
      instructor: 'Mariana Costa',
      instructorRole: 'Design Lead, Linear',
      duration: '6h 24m',
      lessons: 38,
      price: 249,
      strike: 320,
      rating: 4.9,
      reviews: 412,
      cohort: 'Self-paced',
      bg: 'linear-gradient(135deg, #2c5282 0%, #0f2744 60%, #1a365d 100%)',
      accent: 'rgba(178,34,52,0.45)',
      desc: 'Build a system that teams can ship against — tokens, primitives, governance, and the rituals that keep adoption high.',
    },
    {
      id: 'c2',
      title: 'The art of the prototype',
      cat: 'Product',
      instructor: 'Daniel Park',
      instructorRole: 'Principal Designer, Figma',
      duration: '4h 12m',
      lessons: 22,
      price: 189,
      strike: 240,
      rating: 4.8,
      reviews: 287,
      cohort: 'Self-paced',
      bg: 'linear-gradient(135deg, #b22234 0%, #6e0e1c 70%, #3a0510 100%)',
      accent: 'rgba(255,255,255,0.18)',
      desc: 'A working prototype is the fastest way to align stakeholders. This is how senior designers build them — in hours, not weeks.',
    },
    {
      id: 'c3',
      title: 'Editing as a craft',
      cat: 'Writing',
      instructor: 'Helena Rosa',
      instructorRole: 'Senior Editor, Stripe Press',
      duration: '5h 08m',
      lessons: 26,
      price: 199,
      rating: 4.9,
      reviews: 198,
      cohort: 'Cohort Jul 8',
      bg: 'linear-gradient(135deg, #c07b0a 0%, #80520a 70%, #4d3206 100%)',
      accent: 'rgba(255,255,255,0.20)',
      desc: 'Rewrite a paragraph fifteen times until it earns its place. Editing as the central act of writing well.',
    },
    {
      id: 'c4',
      title: 'Pricing & packaging',
      cat: 'Business',
      instructor: 'Tomás Beltrán',
      instructorRole: 'VP Revenue, Notion',
      duration: '3h 44m',
      lessons: 18,
      price: 229,
      rating: 4.7,
      reviews: 156,
      cohort: 'Self-paced',
      bg: 'linear-gradient(135deg, #1f8a5b 0%, #115d3c 70%, #06321f 100%)',
      accent: 'rgba(255,255,255,0.16)',
      desc: 'Price for the value your buyers actually feel. The mental models, pricing pages, and a framework I use with founders.',
    },
    {
      id: 'c5',
      title: 'Calm leadership',
      cat: 'Leadership',
      instructor: 'Ada Okonkwo',
      instructorRole: 'Director of Engineering, Vercel',
      duration: '7h 02m',
      lessons: 32,
      price: 279,
      strike: 340,
      rating: 4.9,
      reviews: 524,
      cohort: 'Cohort Aug 4',
      bg: 'linear-gradient(135deg, #163252 0%, #0a1828 100%)',
      accent: 'rgba(178,34,52,0.32)',
      desc: 'How senior leaders set direction without burning everyone out. Frameworks, weekly habits, and the things nobody teaches you.',
    },
    {
      id: 'c6',
      title: 'Evals for AI products',
      cat: 'AI',
      instructor: 'Jiwon Lee',
      instructorRole: 'AI Lead, Anthropic Apps',
      duration: '5h 38m',
      lessons: 24,
      price: 259,
      rating: 4.8,
      reviews: 142,
      cohort: 'Self-paced',
      bg: 'linear-gradient(135deg, #2c5282 0%, #b22234 110%)',
      accent: 'rgba(255,255,255,0.20)',
      desc: 'Treat your model like infrastructure. Evals, golden sets, and the dashboards we keep open every day to keep quality from drifting.',
    },
  ],

  // featured instructors
  faculty: [
    { id: 'i1', name: 'Mariana Costa',  init: 'M', region: 'São Paulo · BR', role: 'Design Lead, Linear', students: '4,820', courses: 3 },
    { id: 'i2', name: 'Daniel Park',    init: 'D', region: 'Seoul · KR',     role: 'Principal Designer, Figma', students: '6,140', courses: 2 },
    { id: 'i3', name: 'Helena Rosa',    init: 'H', region: 'Lisbon · PT',    role: 'Senior Editor, Stripe Press', students: '2,380', courses: 4 },
    { id: 'i4', name: 'Ada Okonkwo',    init: 'A', region: 'Lagos · NG',     role: 'Director of Eng, Vercel', students: '9,210', courses: 5 },
  ],

  // course detail — the syllabus for "Design Systems at scale"
  syllabus: [
    {
      n: 1, title: 'The case for a design system', meta: '4 lessons · 38 min',
      lessons: [
        { name: 'Why systems fail before they ship', dur: '8:24', type: 'video', preview: true },
        { name: 'Mapping your design surface', dur: '12:08', type: 'video' },
        { name: 'A note on the politics of adoption', dur: '6:42', type: 'reading' },
        { name: 'Module 1 reflection', dur: '5 min', type: 'quiz' },
      ]
    },
    {
      n: 2, title: 'Tokens: the structural layer', meta: '6 lessons · 72 min',
      lessons: [
        { name: 'Naming things, the only hard part', dur: '14:18', type: 'video' },
        { name: 'Color tokens, semantic vs raw', dur: '11:42', type: 'video' },
        { name: 'Typography scales that survive year two', dur: '13:06', type: 'video' },
        { name: 'Spacing as a language', dur: '9:24', type: 'video' },
        { name: 'Worked example: rebuilding Linear\u2019s scale', dur: '18:38', type: 'video' },
        { name: 'Module 2 reflection', dur: '8 min', type: 'quiz' },
      ]
    },
    {
      n: 3, title: 'Components & primitives', meta: '7 lessons · 1h 24m',
      lessons: [
        { name: 'Primitives vs patterns', dur: '12:00', type: 'video' },
        { name: 'The button is never just a button', dur: '15:42', type: 'video' },
        { name: 'Form controls, fully covered', dur: '21:16', type: 'video' },
        { name: 'Modal, popover, sheet — and when not', dur: '14:30', type: 'video' },
      ]
    },
    {
      n: 4, title: 'Governance & adoption', meta: '5 lessons · 1h 02m',
      lessons: [
        { name: 'The contribution model that works', dur: '13:48', type: 'video' },
        { name: 'Office hours: the most underrated ritual', dur: '11:22', type: 'video' },
      ]
    },
    {
      n: 5, title: 'Shipping & maintenance', meta: '4 lessons · 48 min',
      lessons: [
        { name: 'Versioning without breaking teams', dur: '14:08', type: 'video' },
      ]
    },
  ],

  // student dashboard: enrolled courses
  enrolled: [
    { id: 'e1', title: 'Design Systems at scale', instructor: 'Mariana Costa', progress: 64, nextLesson: 'Component primitives', tone: 'navy' },
    { id: 'e2', title: 'Pricing & packaging',     instructor: 'Tomás Beltrán', progress: 38, nextLesson: 'Bundling vs unbundling',  tone: 'green' },
    { id: 'e3', title: 'Editing as a craft',      instructor: 'Helena Rosa',   progress: 12, nextLesson: 'Cutting the first draft', tone: 'warm' },
  ],

  // classroom: active lesson + curriculum
  classroom: {
    courseTitle: 'Design Systems at scale',
    instructor: 'Mariana Costa',
    currentModule: 2,
    currentLesson: 2,
    progress: 64,
    activeLessonTitle: 'Color tokens, semantic vs raw',
    activeLessonEyebrow: 'Module 2 · Lesson 2',
    duration: { current: '08:42', total: '11:42' },
    scrubPct: 74,
  },

  // notes for current lesson
  notes: [
    { ts: '02:14', body: 'Two-tier system: raw tokens (—color-blue-600) feed semantic tokens (—color-primary). Components only ever consume the semantic layer.' },
    { ts: '06:01', body: 'Mariana\u2019s rule: if you can name it after a thing on the screen (—surface-card), it\u2019s semantic. If you can only name it after a color, it\u2019s raw.' },
    { ts: '08:42', body: 'Color modes don\u2019t mean dark mode — they mean any inversion. High contrast, brand-on-brand, error states. Build the swap surface once.' },
  ],

  // ai chat messages (seed)
  aiChat: [
    { from: 'bot', text: 'I have the transcript and your three notes from this lesson loaded. Ask me anything — I\u2019ll point to the timestamp.' },
    { from: 'usr', text: 'Why not just expose raw tokens to components?' },
    { from: 'bot', text: 'Mariana addresses this at 04:38. The short version: raw tokens leak intent. If a button uses —color-blue-600 directly, you can\u2019t change brand color in 2027 without touching every component.' },
  ],
  aiSuggest: [
    'Summarize the lesson in 3 bullets',
    'Quiz me on tokens',
    'Compare to Tailwind v4 tokens',
  ],

  // teacher studio kpis
  kpis: [
    { label: 'Revenue, 30d',  value: '$48,210', delta: '+18.4%', up: true,  spark: [10,14,12,18,22,19,26,28,32,36,34,42] },
    { label: 'New students',  value: '1,284',   delta: '+11.2%', up: true,  spark: [16,18,14,20,22,26,28,24,30,32,30,38] },
    { label: 'Completion',    value: '72%',     delta: '+3.1%',  up: true,  spark: [60,58,62,64,63,66,68,67,70,71,70,72] },
    { label: 'Avg rating',    value: '4.86',    delta: '-0.04',  up: false, spark: [4.9,4.92,4.88,4.86,4.86,4.86] },
  ],

  // chart series (monthly revenue, last 12)
  revenue: {
    months: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'],
    values: [12400, 14200, 15800, 17400, 19800, 22000, 26800, 24200, 29800, 34200, 41200, 48210],
  },

  // top performing courses (studio)
  studioCourses: [
    { id: 's1', code: 'DS', title: 'Design Systems at scale', tone: 'navy', students: 1820, revenue: '$22,840', delta: '+14%' },
    { id: 's2', code: 'PR', title: 'The art of the prototype', tone: 'red',  students: 980,  revenue: '$11,620', delta: '+9%'  },
    { id: 's3', code: 'TT', title: 'Tokens & theming workshop', tone: 'warm', students: 540,  revenue: '$8,140',  delta: '+22%' },
    { id: 's4', code: 'PP', title: 'Pricing & packaging',       tone: 'green', students: 410,  revenue: '$5,610',  delta: '+6%'  },
  ],

  // course builder draft
  builderDraft: {
    title: 'Color theory for product designers',
    cat: 'Design',
    status: 'Draft',
    completion: 64,
    modules: [
      { id: 'bm1', n: 1, title: 'Why color is a language', lessons: [
        { id: 'bl1', name: 'A short history of color theory in product', dur: '14:08', type: 'v' },
        { id: 'bl2', name: 'The vocabulary you actually need',           dur: '9:42',  type: 'v' },
        { id: 'bl3', name: 'Reading: Munsell, Itten, and why we still cite them', dur: '6 min', type: 't' },
      ] },
      { id: 'bm2', n: 2, title: 'Building a palette from scratch', lessons: [
        { id: 'bl4', name: 'Choosing a brand hue you won\u2019t hate in two years', dur: '11:22', type: 'v' },
        { id: 'bl5', name: 'Neutrals: the load-bearing wall', dur: '13:06', type: 'v' },
        { id: 'bl6', name: 'Worked example: the Skillset palette',  dur: '18:14', type: 'v' },
        { id: 'bl7', name: 'Reflection quiz',                        dur: '5 min', type: 'q' },
      ] },
      { id: 'bm3', n: 3, title: 'Color modes & accessibility', lessons: [
        { id: 'bl8', name: 'Dark mode is not "invert it"', dur: '12:30', type: 'v' },
        { id: 'bl9', name: 'Contrast, motion, and ergonomics',  dur: '10:48', type: 'v' },
      ] },
    ],
    checks: [
      { label: 'Course title & category',  done: true  },
      { label: 'Hero artwork uploaded',    done: true  },
      { label: 'At least 3 modules',       done: true  },
      { label: 'Pricing set',              done: false },
      { label: 'Trailer video (60–90s)',   done: false },
      { label: 'Submitted for Skillset review', done: false },
    ],
  },
};
