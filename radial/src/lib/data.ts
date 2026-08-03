export type Trend = {
  title: string
  growth: string
  citations: number
  description: string
  tags: string[]
}

export type ActivityItem = {
  type: string
  message: string
  time: string
}

export type Patent = {
  id: string
  number: string
  title: string
  status: 'granted' | 'examination'
  filingDate: string
  inventors: string[]
  jurisdictions: string[]
}

export type Funding = {
  id: string
  title: string
  funder: string
  amount: string
  deadline: string
  fit: number
  badges: string[]
}

export type Publication = {
  id: string
  title: string
  authors: string[]
  venue: string
  year: number
  citations: number
  doi: string
}

export type ScoreMetric = {
  label: string
  value: number
  target: number
  hint: string
}

export type Report = {
  id: string
  title: string
  type: 'PDF' | 'DOCX'
  date: string
  size: string
  snippet: string
}

export type Collaborator = {
  id: string
  name: string
  institution: string
  topics: string[]
  score: number
}

export type Resource = {
  id: string
  name: string
  type: string
  status: 'available' | 'in-use' | 'maintenance'
  location: string
}

export type AlertItem = {
  id: string
  type: 'patent' | 'grant' | 'citation' | 'system' | 'collab'
  message: string
  time: string
  read: boolean
}

export const trends: Trend[] = [
  {
    title: 'Graphene-Oxide Membranes',
    growth: '+142%',
    citations: 12480,
    description: 'Emerging separation membranes with record water-flux and selectivity.',
    tags: ['Nanomaterials', 'Water'],
  },
  {
    title: 'Federated Bioimaging AI',
    growth: '+118%',
    citations: 9840,
    description: 'Privacy-preserving federated learning across distributed medical imaging.',
    tags: ['AI', 'Biomedical'],
  },
  {
    title: 'Perovskite Tandem Solar Cells',
    growth: '+96%',
    citations: 15670,
    description: 'Next-generation photovoltaic stacks pushing beyond 33% efficiency.',
    tags: ['Energy', 'Materials'],
  },
  {
    title: 'Quantum Error Mitigation',
    growth: '+74%',
    citations: 6720,
    description: 'Noise-aware protocols making near-term quantum processors practical.',
    tags: ['Quantum', 'Computing'],
  },
  {
    title: 'Self-Healing Battery Electrolytes',
    growth: '+61%',
    citations: 4310,
    description: 'Autonomously repairing ion-conducting electrolytes for long-life cells.',
    tags: ['Energy', 'Chemistry'],
  },
]

export const activity: ActivityItem[] = [
  { type: 'patent', message: 'Patent US-2026-0118 filed — "Self-Healing Electrolyte Architecture"', time: '2h ago' },
  { type: 'grant', message: 'NSF CAREER deadline approaching in 6 days', time: '5h ago' },
  { type: 'citation', message: 'Your paper on adaptive membranes crossed 500 citations', time: '1d ago' },
  { type: 'system', message: 'Monthly innovation report generated and saved to Reports', time: '2d ago' },
  { type: 'collab', message: 'Dr. Elena received a collaboration request from ETH Zurich', time: '3d ago' },
]

export const portfolioSummary = [
  { label: 'Active Portfolio Items', value: 42 },
  { label: 'New Opportunities', value: 17 },
  { label: 'Trending Citations', value: '+312 this month' },
]

export const patents: Patent[] = [
  {
    id: 'p1',
    number: 'US-2026-0118',
    title: 'Self-Healing Electrolyte Architecture for Lithium-Ion Cells',
    status: 'examination',
    filingDate: '2026-02-14',
    inventors: ['Dr. Elena Vasquez', 'Prof. M. Okafor', 'L. Chen'],
    jurisdictions: ['US', 'EP'],
  },
  {
    id: 'p2',
    number: 'US-2025-0942',
    title: 'Graphene-Oxide Membrane with Tunable Ion Selectivity',
    status: 'granted',
    filingDate: '2025-07-02',
    inventors: ['Dr. Elena Vasquez', 'Dr. R. Tanaka'],
    jurisdictions: ['US', 'JP', 'KR'],
  },
  {
    id: 'p3',
    number: 'EP-2025-0317',
    title: 'Federated Model Fusion for Distributed Biomedical Imaging',
    status: 'granted',
    filingDate: '2025-03-19',
    inventors: ['Dr. Elena Vasquez', 'Prof. H. Lindqvist'],
    jurisdictions: ['EP', 'US'],
  },
  {
    id: 'p4',
    number: 'US-2024-0785',
    title: 'Perovskite Tandem Photovoltaic Stack and Method of Fabrication',
    status: 'granted',
    filingDate: '2024-11-08',
    inventors: ['Dr. Elena Vasquez', 'S. Barros', 'Prof. M. Okafor'],
    jurisdictions: ['US'],
  },
  {
    id: 'p5',
    number: 'WO-2024-0551',
    title: 'Noise-Aware Quantum Error Mitigation for Short-Horizon Circuits',
    status: 'examination',
    filingDate: '2024-06-27',
    inventors: ['Dr. Elena Vasquez', 'Dr. A. Novak'],
    jurisdictions: ['WO'],
  },
]

export const funding: Funding[] = [
  {
    id: 'f1',
    title: 'Advanced Materials for Next-Generation Water Purification',
    funder: 'National Science Foundation',
    amount: '$850K · 3 years',
    deadline: '2026-03-20',
    fit: 94,
    badges: ['Methodology match', 'Topic match'],
  },
  {
    id: 'f2',
    title: 'Federated AI for Distributed Clinical Imaging',
    funder: 'Horizon Europe',
    amount: '€2.1M · 4 years',
    deadline: '2026-04-12',
    fit: 89,
    badges: ['Topic match', 'Dataset match'],
  },
  {
    id: 'f3',
    title: 'Quantum Sensing and Error Mitigation R&D',
    funder: 'Department of Energy',
    amount: '$1.4M · 3 years',
    deadline: '2026-05-01',
    fit: 82,
    badges: ['Methodology match'],
  },
  {
    id: 'f4',
    title: 'Sustainable Energy Storage Materials Consortium',
    funder: 'Bill & Melinda Gates Foundation',
    amount: '$3.0M · 5 years',
    deadline: '2026-03-05',
    fit: 76,
    badges: ['Topic match'],
  },
  {
    id: 'f5',
    title: 'Frontier Fellowship — Early Career Investigators',
    funder: 'European Research Council',
    amount: '€1.5M · 5 years',
    deadline: '2026-06-15',
    fit: 71,
    badges: ['Career match'],
  },
]

export const publications: Publication[] = [
  {
    id: 'pub1',
    title: 'Graphene-Oxide Membranes with Tunable Ion Selectivity for Water Purification',
    authors: ['E. Vasquez', 'R. Tanaka', 'M. Okafor'],
    venue: 'Nature Nanotechnology',
    year: 2025,
    citations: 512,
    doi: '10.1038/nnano.2025.0142',
  },
  {
    id: 'pub2',
    title: 'Federated Model Fusion for Privacy-Preserving Biomedical Imaging',
    authors: ['E. Vasquez', 'H. Lindqvist', 'S. Barros'],
    venue: 'Nature Medicine',
    year: 2025,
    citations: 388,
    doi: '10.1038/s41591-025-03118-9',
  },
  {
    id: 'pub3',
    title: 'Perovskite Tandem Stacks: Toward 35% Module Efficiency',
    authors: ['E. Vasquez', 'S. Barros', 'M. Okafor'],
    venue: 'Science',
    year: 2024,
    citations: 641,
    doi: '10.1126/science.adp2214',
  },
  {
    id: 'pub4',
    title: 'Noise-Aware Error Mitigation for Short-Horizon Quantum Circuits',
    authors: ['E. Vasquez', 'A. Novak'],
    venue: 'PRX Quantum',
    year: 2024,
    citations: 214,
    doi: '10.1103/PRXQuantum.5.020322',
  },
  {
    id: 'pub5',
    title: 'Self-Healing Electrolytes: A Roadmap for Durable Energy Storage',
    authors: ['E. Vasquez', 'L. Chen'],
    venue: 'Advanced Energy Materials',
    year: 2023,
    citations: 175,
    doi: '10.1002/aenm.202303121',
  },
]

export const pubStats = {
  citations: 1930,
  hIndex: 24,
  count: 58,
  recent: '+312 in last 90 days',
}

export const scoreBreakdown: ScoreMetric[] = [
  { label: 'Novelty', value: 84, target: 80, hint: 'Strong differentiation vs. global baselines' },
  { label: 'Translation', value: 72, target: 75, hint: '+2 patents published from current pipeline' },
  { label: 'Velocity', value: 68, target: 75, hint: 'Median time-to-publication above peer median' },
  { label: 'Collaboration', value: 81, target: 80, hint: 'Cross-institutional density in top decile' },
  { label: 'Funding Efficiency', value: 77, target: 80, hint: 'Award-to-submission ratio improved 9%' },
]

export const benchmarks = [
  { label: 'Your Score', value: 78 },
  { label: 'Field Median', value: 61 },
  { label: 'Top Decile', value: 84 },
]

export const improvements = [
  'Increase translation velocity by drafting patents within 6 months of key findings.',
  'Broaden collaboration beyond core nanomaterials into adjacent sensing domains.',
  'Target 2 additional high-fit grants per cycle using semantic matching.',
  'Publish pre-prints earlier to compress time-to-first-citation.',
]

export const reports: Report[] = [
  {
    id: 'r1',
    title: 'Monthly Innovation Brief — February 2026',
    type: 'PDF',
    date: '2026-02-28',
    size: '4.2 MB',
    snippet: 'Portfolio health, trend radar, and funding pipeline for the past 30 days.',
  },
  {
    id: 'r2',
    title: 'Quarterly Patent Landscape Analysis',
    type: 'PDF',
    date: '2026-02-15',
    size: '8.7 MB',
    snippet: 'Competitive white-space mapping across membranes, AI imaging, and quantum.',
  },
  {
    id: 'r3',
    title: 'Collaboration & Impact Report — 2025',
    type: 'DOCX',
    date: '2026-01-30',
    size: '2.1 MB',
    snippet: 'Co-authorship network, impact metrics, and suggested partners.',
  },
  {
    id: 'r4',
    title: 'Funding Recommendations — Q1 2026',
    type: 'PDF',
    date: '2026-01-08',
    size: '1.9 MB',
    snippet: 'Top 20 semantically-matched grant opportunities with fit scores.',
  },
]

export const profile = {
  name: 'Dr. Elena Vasquez',
  title: 'Principal Investigator · Advanced Materials',
  affiliation: 'Center for Nanoscale Innovation, University of Geneva',
  bio: 'Materials scientist and AI researcher building adaptive membranes, federated imaging systems, and durable energy storage. Passionate about translating lab breakthroughs into licensed technologies.',
  interests: ['Nanomaterials', 'Membrane Science', 'Federated AI', 'Energy Storage', 'Quantum Sensing'],
  metrics: [
    { label: 'Publications', value: 58 },
    { label: 'Citations', value: '1,930' },
    { label: 'h-index', value: 24 },
    { label: 'Patents', value: 5 },
    { label: 'Grants Won', value: 11 },
  ],
  recentActivity: [
    { type: 'Patent filed', detail: 'US-2026-0118 — Self-Healing Electrolyte Architecture', time: '2h ago' },
    { type: 'Grant awarded', detail: 'Horizon Europe FLAME-2 consortium kickoff', time: '3d ago' },
    { type: 'Publication', detail: 'Pre-print published for federated imaging benchmark', time: '1w ago' },
  ],
  affiliations: [
    'Center for Nanoscale Innovation, University of Geneva',
    'Institute for Applied Photonics, ETH Zurich',
    'National Institute of Clean Energy, Singapore',
  ],
}

export const collaborators: Collaborator[] = [
  {
    id: 'c1',
    name: 'Prof. Marcus Okafor',
    institution: 'ETH Zurich',
    topics: ['Membrane Science', 'Perovskite PV'],
    score: 96,
  },
  {
    id: 'c2',
    name: 'Dr. Rina Tanaka',
    institution: 'Kyoto University',
    topics: ['Ion Transport', 'Nanofiltration'],
    score: 91,
  },
  {
    id: 'c3',
    name: 'Prof. Helena Lindqvist',
    institution: 'Karolinska Institute',
    topics: ['Federated AI', 'Medical Imaging'],
    score: 88,
  },
  {
    id: 'c4',
    name: 'Dr. Andrei Novak',
    institution: 'TU Delft',
    topics: ['Quantum Error Mitigation'],
    score: 84,
  },
]

export const resources: Resource[] = [
  {
    id: 'res1',
    name: 'Cryo-FIB-SEM Suite',
    type: 'Imaging',
    status: 'available',
    location: 'NanoLab B2',
  },
  {
    id: 'res2',
    name: 'GPU Cluster — 8× H100',
    type: 'Computing',
    status: 'in-use',
    location: 'Data Center 1',
  },
  {
    id: 'res3',
    name: 'Ion-Beam Etcher',
    type: 'Fabrication',
    status: 'available',
    location: 'Cleanroom A',
  },
  {
    id: 'res4',
    name: 'Impedance Analyzer',
    type: 'Measurement',
    status: 'maintenance',
    location: 'Materials Lab',
  },
  {
    id: 'res5',
    name: 'Climate-Controlled Wet Lab Bay',
    type: 'Lab Space',
    status: 'in-use',
    location: 'Chemistry Wing 3',
  },
]

export const alerts: AlertItem[] = [
  { id: 'a1', type: 'patent', message: 'Examination report received for US-2026-0118', time: '2h ago', read: false },
  { id: 'a2', type: 'grant', message: 'NSF CAREER deadline in 6 days — draft ready for review', time: '5h ago', read: false },
  { id: 'a3', type: 'citation', message: 'Nature Nanotechnology paper crossed 500 citations', time: '1d ago', read: false },
  { id: 'a4', type: 'system', message: 'Monthly innovation report is ready in Reports', time: '2d ago', read: true },
  { id: 'a5', type: 'collab', message: 'New collaboration request from TU Delft', time: '3d ago', read: true },
  { id: 'a6', type: 'grant', message: 'Semantic fit updated for 4 funding opportunities', time: '4d ago', read: true },
]
