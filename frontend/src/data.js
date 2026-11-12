export const LINKS = {
  github: 'https://github.com/ARTiwary',
  linkedin: 'https://www.linkedin.com/in/ayush-raj-tiwary-3b4392227',
  email: 'ayushrajtiwary07@gmail.com',
  resume: '/resume.pdf',
};

export const SWITCH_URL = 'https://artiwary.netlify.app'; // creative version of the site

export const filters = ['All', 'GenAI', 'Vision', 'Full-stack'];

export const stats = [
  { n: 94, suffix: '%', label: 'MRI classifier accuracy' },
  { n: 58, suffix: '', label: 'automated tests in Gather' },
  { n: 190, suffix: '+', label: 'verified ML internship hours' },
  { n: 2, suffix: '', label: 'industry internships' },
];

export const featured = [
  {
    title: 'Gather',
    tags: ['GenAI', 'Full-stack'],
    kind: 'GenAI · Full-stack',
    blurb: 'AI event planner for weddings, birthdays and community events. Give it guests, budget, date and style; get a budget split, timeline, vendor checklist and risks, then refine the plan in chat.',
    points: [
      'Budget lines are re-allocated server-side, so they always sum to the budget exactly.',
      '58 tests (~98% line coverage), 0 axe accessibility violations, zero runtime dependencies.',
      'Strict CSP, validated input, sanitised model output, per-IP rate limiting.',
    ],
    stack: ['Node.js', 'Groq · gpt-oss-120b', 'Vanilla JS', 'GitHub Actions'],
    code: 'https://github.com/ARTiwary/Event-Planner',
    live: 'https://event-planner-afif.vercel.app/',
    poster: '/img/gather-poster.jpg',
    loop: '/videos/gather-loop.mp4',
    full: '/videos/gather-full.mp4',
  },
  {
    title: 'Smart Dining Assistant',
    tags: ['GenAI', 'Full-stack'],
    kind: 'RAG · Full-stack',
    blurb: 'QR-per-table ordering with an in-house assistant (Zara) that answers menu questions in English, Hinglish and Telugu without staff.',
    points: ['Groq + ChromaDB RAG pipeline.', 'About 40% faster order-taking.', 'Admin dashboard with live order lifecycle and daily revenue.'],
    stack: ['Next.js', 'Node.js', 'PostgreSQL', 'ChromaDB', 'Groq', 'Docker'],
    code: 'https://github.com/ARTiwary/smart-dinning-assistent',
    live: 'https://smart-dinning-assistent.vercel.app',
    poster: '/img/smart-dining.webp',
  },
  {
    title: 'MRI Brain Tumor Detection',
    tags: ['Vision', 'Full-stack'],
    kind: 'Computer vision · ML in production',
    blurb: 'Four-class MRI classifier served through FastAPI, with touchless zoom, pan and scan navigation using OpenCV hand gestures.',
    points: ['94% accuracy on 4,000+ scans (CNN + ResNet18).', 'Sub-300 ms inference latency.', 'Deployed end to end: FastAPI backend, React frontend.'],
    stack: ['PyTorch', 'ResNet18', 'FastAPI', 'OpenCV', 'React'],
    code: 'https://github.com/ARTiwary/MRI-brain-tumour-detection-with-gesture-control-',
    live: 'https://brain-tumor-with-gesture.netlify.app/',
    poster: '/img/mri-tumor.webp',
  },
];

export const more = [
  { title: 'Road Accident Detection', tags: ['Vision'], stack: 'CNN · FastAPI · React', code: 'https://github.com/ARTiwary/Road_accident-_alert_system' },
  { title: 'Suraksha-Setu Tourist Safety', tags: ['Full-stack'], stack: 'Python · React', code: 'https://github.com/ARTiwary/compass-comfort-kit' },
  { title: 'Gesture File Transfer', tags: ['Vision', 'Full-stack'], stack: 'React · Node.js', code: 'https://github.com/ARTiwary/Air-gesture-recognition', live: 'https://air-gesture-drop.netlify.app/' },
  { title: 'Just Divide Game', tags: ['Full-stack'], stack: 'React · Tailwind', code: 'https://github.com/ARTiwary/just-divide-game', live: 'https://artiwary-just-divide.netlify.app/' },
];

export const experience = [
  {
    role: 'Backend, AI & SaaS Innovation Intern',
    org: 'Axentra OS',
    dates: 'Aug 2026 – Present',
    logo: '/logos/axentra.png',
    points: [
      'Built Pydantic-validated CRUD APIs (FastAPI, PostgreSQL) for customer and product records.',
      'Designed a replenishment engine for a skincare e-commerce client: predicts consumption cycles, prompts a repurchase on day 25, and follows up 10–15 days later.',
    ],
  },
  {
    role: 'Machine Learning Engineering Intern',
    org: 'FlyRank.ai',
    dates: 'Jul – Sep 2026',
    logo: '/logos/flyrank.png',
    points: [
      '36 practical assignments, 190+ verified hours: embeddings, clustering, intent modeling.',
      'Capstone accepted by the lead mentor; 20 Anthropic Academy courses (Claude API, MCP).',
    ],
    docs: [
      { label: 'ML certificate', href: '/certificates/flyrank-ml-certificate.pdf' },
      { label: 'AI Fluency certificate', href: '/certificates/flyrank-ai-fluency-certificate.pdf' },
      { label: 'Recommendation letter', href: '/certificates/flyrank-recommendation-letter.pdf' },
    ],
  },
];

export const stack = [
  ['AI / ML', ['Python', 'PyTorch', 'TensorFlow', 'OpenCV', 'scikit-learn', 'LangChain', 'ChromaDB', 'Groq', 'Embeddings & clustering']],
  ['Backend', ['FastAPI', 'Node.js', 'Express', 'PostgreSQL', 'REST APIs', 'Pydantic', 'Docker']],
  ['Frontend', ['React', 'Next.js', 'Tailwind CSS', 'GSAP', 'Accessibility (WCAG)']],
  ['Foundations', ['Java', 'C++', 'Data structures & algorithms', 'OOP', 'System design', 'Git', 'Linux']],
];
