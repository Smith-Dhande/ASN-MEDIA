const getRelativeDate = (daysFromNow) => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split('T')[0];
};

const baseClients = [
  {
    id: "cli_101",
    name: "Aura Luxury Beauty",
    contactName: "Elena Rostova",
    email: "elena@auraluxury.com",
    phone: "+91 98765 12345",
    company: "Aura Beauty Pvt Ltd",
    status: "Active",
    packageAssigned: "Social Media Retainer (Tier A)",
    monthlyRetainer: 4500,
    startDate: "2025-11-01",
    expiryDate: getRelativeDate(22), // Expiring in 22 days (within 1 month)
    assignedStaff: ["Sarah Jenkins", "Rohan Verma"],
    activeProjectsCount: 2,
    pendingTasksCount: 5,
    totalPaid: 40500,
    outstandingDue: 0,
    reviewScannerId: "scn_301",
  },
  {
    id: "cli_102",
    name: "Vanguard Architecture",
    contactName: "Marcus Sterling",
    email: "m.sterling@vanguardarch.io",
    phone: "+91 98765 23456",
    company: "Vanguard Design Group",
    status: "Active",
    packageAssigned: "Video Production & Retainer",
    monthlyRetainer: 7500,
    startDate: "2025-06-15",
    expiryDate: getRelativeDate(6), // Expiring in 6 days (urgent)
    assignedStaff: ["Vikramaditya S.", "Rohan Verma"],
    activeProjectsCount: 1,
    pendingTasksCount: 4,
    totalPaid: 75000,
    outstandingDue: 7500,
    reviewScannerId: "scn_302",
  },
  {
    id: "cli_103",
    name: "Kalon Artisanal Apparel",
    contactName: "Priya Nair",
    email: "priya@kalonapparel.in",
    phone: "+91 98765 34567",
    company: "Kalon Fashion House",
    status: "Active",
    packageAssigned: "Content Creation Suite",
    monthlyRetainer: 3800,
    startDate: "2026-01-10",
    expiryDate: getRelativeDate(14), // Expiring in 14 days
    assignedStaff: ["Ananya Sen"],
    activeProjectsCount: 2,
    pendingTasksCount: 6,
    totalPaid: 11400,
    outstandingDue: 0,
    reviewScannerId: null,
  },
  {
    id: "cli_104",
    name: "Solace Hospitality Group",
    contactName: "Julian Vance",
    email: "j.vance@solaceresorts.com",
    phone: "+91 98765 45678",
    company: "Solace Resorts Ltd",
    status: "Pending",
    packageAssigned: "Brand Strategy & Launch Package",
    monthlyRetainer: 12000,
    startDate: "2026-04-01",
    expiryDate: getRelativeDate(-4), // Expired 4 days ago
    assignedStaff: ["Sarah Jenkins", "Vikramaditya S."],
    activeProjectsCount: 1,
    pendingTasksCount: 3,
    totalPaid: 6000,
    outstandingDue: 6000,
    reviewScannerId: "scn_303",
  },
  {
    id: "cli_105",
    name: "Elysian Fine Jewelry",
    contactName: "Meera Kapoor",
    email: "meera@elysiangems.com",
    phone: "+91 98765 56789",
    company: "Elysian Gems LLP",
    status: "Active",
    packageAssigned: "Social Media Retainer (Tier B)",
    monthlyRetainer: 3200,
    startDate: "2025-09-01",
    expiryDate: getRelativeDate(85), // 85 days left
    assignedStaff: ["Rohan Verma"],
    activeProjectsCount: 1,
    pendingTasksCount: 2,
    totalPaid: 22400,
    outstandingDue: 0,
    reviewScannerId: "scn_304",
  },
];

// Generate additional client entries to total 25
const companyNames = [
  "Maison de Luxe", "Veritas Wealth", "Apex Athletics", "Chronos Horology",
  "Zephyr Aviation", "Lumière Aesthetics", "Opus Capital", "Velvet & Vine",
  "AeroDynamics", "Celeste Skincare", "Oasis Resorts", "Sovereign Real Estate",
  "Nectar Beverages", "Valence Robotics", "Prism Digital", "Aura Botanicals",
  "Zenith Watches", "Mirage Dining", "Starlight Media", "Vanguard Labs"
];

const generatedClients = companyNames.map((comp, idx) => {
  const num = 106 + idx;
  const statuses = ["Active", "Active", "Active", "Pending", "Completed", "Archived"];
  const packages = [
    "Social Media Retainer (Tier A)",
    "Social Media Retainer (Tier B)",
    "Video Production & Retainer",
    "Content Creation Suite",
    "Brand Strategy & Launch Package"
  ];
  const retainers = [3200, 3800, 4500, 6000, 7500, 12000];
  const status = statuses[idx % statuses.length];
  const isExpiringSoon = idx % 4 === 0;

  return {
    id: `cli_${num}`,
    name: comp,
    contactName: `Executive ${idx + 1}`,
    email: `contact@${comp.toLowerCase().replace(/[^a-z]/g, '')}.com`,
    phone: `+91 987${(100000 + idx * 1234).toString().slice(0, 5)}`,
    company: `${comp} Inc`,
    status,
    packageAssigned: packages[idx % packages.length],
    monthlyRetainer: retainers[idx % retainers.length],
    startDate: "2025-08-01",
    expiryDate: isExpiringSoon ? getRelativeDate(4 + ((idx % 6) * 4)) : getRelativeDate(60 + (idx * 15)),
    assignedStaff: ["Sarah Jenkins"],
    activeProjectsCount: (idx % 3) + 1,
    pendingTasksCount: (idx % 5) + 1,
    totalPaid: retainers[idx % retainers.length] * 6,
    outstandingDue: idx % 4 === 0 ? retainers[idx % retainers.length] : 0,
    reviewScannerId: idx % 2 === 0 ? `scn_30${(idx % 4) + 1}` : null,
  };
});

const allClients = [...baseClients, ...generatedClients];

// Base Enquiries
const baseEnquiries = [
  {
    id: "enq_201",
    name: "Devika Sharma",
    email: "devika@luxevel.com",
    phone: "+91 98112 33445",
    company: "Luxevel Skincare",
    serviceRequested: "Social Media Management",
    budgetTier: "₹50,000 - ₹1,00,000",
    timeline: "Within 1 Month",
    description: "We are launching a new organic skincare line in May and need complete social strategy.",
    status: "New",
    dateSubmitted: "2026-09-26 14:20",
    assignedTo: "Sarah Jenkins",
    notes: ["Initial inquiry received via website contact form."],
  },
  {
    id: "enq_202",
    name: "Arjun Mehta",
    email: "arjun@nexuscapital.vc",
    phone: "+91 98223 44556",
    company: "Nexus Capital",
    serviceRequested: "Video Production",
    budgetTier: "₹1,00,000 - ₹2,50,000",
    timeline: "Immediately",
    description: "Looking for a 90-second cinematic founder story film and podcast highlights suite.",
    status: "In Contact",
    dateSubmitted: "2026-09-24 10:15",
    assignedTo: "Vikramaditya S.",
    notes: ["Discovery call scheduled for Monday at 3 PM."],
  },
  {
    id: "enq_203",
    name: "Natasha Roy",
    email: "natasha@maisonroy.com",
    phone: "+91 98334 55667",
    company: "Maison Roy Interiors",
    serviceRequested: "Brand Strategy",
    budgetTier: "₹50,000 - ₹1,00,000",
    timeline: "1 - 3 Months",
    description: "Architectural & interior design brand requiring a full repositioning playbook.",
    status: "Proposal Sent",
    dateSubmitted: "2026-09-21 16:45",
    assignedTo: "Sarah Jenkins",
    notes: ["Proposal PDF v2 sent on Sept 23. Awaiting client review."],
  },
  {
    id: "enq_204",
    name: "Karan Patel",
    email: "karan@urbanpulse.fit",
    phone: "+91 98445 66778",
    company: "UrbanPulse Fitness",
    serviceRequested: "Content Creation",
    budgetTier: "< ₹50,000",
    timeline: "Flexible",
    description: "Need short-form video reels for Instagram and workout photo shoots.",
    status: "Converted",
    dateSubmitted: "2026-09-15 11:30",
    assignedTo: "Ananya Sen",
    notes: ["Converted to active project on Sept 18."],
  },
];

const generatedEnquiries = Array.from({ length: 22 }, (_, idx) => {
  const num = 205 + idx;
  const statuses = ["New", "In Contact", "Proposal Sent", "Converted", "Lost"];
  const services = ["Social Media Management", "Content Creation", "Video Production", "Brand Strategy"];
  const budgets = ["< ₹50,000", "₹50,000 - ₹1,00,000", "₹1,00,000 - ₹2,50,000", "> ₹2,50,000"];
  const names = ["Rohan Roy", "Siddharth Malhotra", "Kavya Menon", "Aarav Gupta", "Tanya Sen", "Kabir Bedi", "Divya Pillai"];
  const companies = ["Aura Couture", "Apex Mobility", "Velvet Café", "Omni Health", "Starlight Jewels", "Zephyr AI", "Titan Arch"];

  return {
    id: `enq_${num}`,
    name: names[idx % names.length] + ` ${idx + 1}`,
    email: `enquiry_${num}@${companies[idx % companies.length].toLowerCase().replace(/[^a-z]/g, '')}.io`,
    phone: `+91 98${idx}12 99887`,
    company: companies[idx % companies.length],
    serviceRequested: services[idx % services.length],
    budgetTier: budgets[idx % budgets.length],
    timeline: "Within 1 Month",
    description: `Comprehensive retainer request for ${services[idx % services.length]} across digital channels.`,
    status: statuses[idx % statuses.length],
    dateSubmitted: `2026-09-${Math.max(1, 25 - idx)} 09:30`,
    assignedTo: idx % 2 === 0 ? "Sarah Jenkins" : "Vikramaditya S.",
    notes: [`Initial touchpoint logged on Sept ${Math.max(1, 25 - idx)}.`],
  };
});

const allEnquiries = [...baseEnquiries, ...generatedEnquiries];

// Packages & Services
const allPackages = [
  {
    id: "pkg_1",
    name: "Social Media Retainer (Tier A)",
    type: "Monthly Retainer",
    monthlyFee: 4500,
    deliverablesCount: 16,
    description: "Full platform management, 12 Reels/Shorts, 16 Carousel posts, daily community management, monthly analytics report.",
    activeSubscribers: 6,
  },
  {
    id: "pkg_2",
    name: "Video Production & Retainer",
    type: "Monthly Retainer",
    monthlyFee: 7500,
    deliverablesCount: 8,
    description: "2 Full Brand/Commercial Films, 6 High-Impact Reels, complete 4K mastering, custom sound design, multi-aspect export.",
    activeSubscribers: 4,
  },
  {
    id: "pkg_3",
    name: "Content Creation Suite",
    type: "Monthly Retainer",
    monthlyFee: 3800,
    deliverablesCount: 20,
    description: "Editorial photo shoots, graphic design toolkits, short-form reels, typography templates, platform publishing.",
    activeSubscribers: 5,
  },
  {
    id: "pkg_4",
    name: "Brand Strategy & Launch Package",
    type: "Fixed Project",
    monthlyFee: 12000,
    deliverablesCount: 5,
    description: "Complete brand positioning architecture, tone-of-voice guidelines, audience mapping, go-to-market rollout playbook.",
    activeSubscribers: 3,
  },
  {
    id: "pkg_5",
    name: "Social Media Retainer (Tier B)",
    type: "Monthly Retainer",
    monthlyFee: 3200,
    deliverablesCount: 10,
    description: "Standard platform maintenance, 8 short clips, 10 carousel posts, weekly moderation.",
    activeSubscribers: 8,
  },
  {
    id: "pkg_6",
    name: "Executive Personal Branding",
    type: "Monthly Retainer",
    monthlyFee: 5500,
    deliverablesCount: 12,
    description: "LinkedIn leadership articles, keynote film editing, press kit management, media training.",
    activeSubscribers: 3,
  },
  {
    id: "pkg_7",
    name: "E-Commerce Visual Suite",
    type: "Fixed Project",
    monthlyFee: 8500,
    deliverablesCount: 40,
    description: "High-resolution product catalog imagery, 3D render overlays, promo ad cutdowns.",
    activeSubscribers: 2,
  },
  {
    id: "pkg_8",
    name: "AI Review & Reputation Monitor",
    type: "Monthly Add-on",
    monthlyFee: 1500,
    deliverablesCount: 4,
    description: "Real-time Google Place review scraping, sentiment indexing, automated owner reply drafts.",
    activeSubscribers: 12,
  },
];

const allServices = [
  { id: "svc_1", name: "Social Media Management", code: "SMM", status: "Active" },
  { id: "svc_2", name: "Content Creation", code: "CC", status: "Active" },
  { id: "svc_3", name: "Video Production", code: "VP", status: "Active" },
  { id: "svc_4", name: "Brand Strategy", code: "BS", status: "Active" },
  { id: "svc_5", name: "Reputation & Review Management", code: "RRM", status: "Active" },
  { id: "svc_6", name: "Executive Personal Branding", code: "EPB", status: "Active" },
  { id: "svc_7", name: "E-Commerce Photo & Video", code: "ECV", status: "Active" },
  { id: "svc_8", name: "3D Motion Graphics & Sound", code: "MGS", status: "Active" },
];

const allAssignments = allClients.slice(0, 20).map((cli, idx) => ({
  id: `asg_${idx + 1}`,
  clientName: cli.name,
  clientId: cli.id,
  packageName: cli.packageAssigned,
  monthlyRetainer: cli.monthlyRetainer,
  startDate: cli.startDate,
  expiryDate: cli.expiryDate,
  leadStaff: cli.assignedStaff[0] || "Sarah Jenkins",
  status: cli.status,
}));

// Projects & Tasks
const baseProjects = [
  {
    id: "prj_401",
    title: "Autumn Editorial Campaign",
    clientName: "Aura Luxury Beauty",
    clientId: "cli_101",
    status: "In Progress",
    progressPct: 70,
    dueDate: "2026-10-15",
    leadStaff: "Rohan Verma",
    deliverables: ["8 Editorial Reels", "12 Studio Stills", "Campaign Copybook"],
  },
  {
    id: "prj_402",
    title: "Monograph Brand Film 4K",
    clientName: "Vanguard Architecture",
    clientId: "cli_102",
    status: "Review",
    progressPct: 90,
    dueDate: "2026-09-30",
    leadStaff: "Vikramaditya S.",
    deliverables: ["120s Hero Film", "30s Cutdowns", "Color Grade Master"],
  },
  {
    id: "prj_403",
    title: "Festive Collection Reel Series",
    clientName: "Kalon Artisanal Apparel",
    clientId: "cli_103",
    status: "In Progress",
    progressPct: 45,
    dueDate: "2026-10-10",
    leadStaff: "Ananya Sen",
    deliverables: ["6 Lookbook Reels", "Carousel Series"],
  },
  {
    id: "prj_404",
    title: "Brand Launch Playbook",
    clientName: "Solace Hospitality Group",
    clientId: "cli_104",
    status: "Planning",
    progressPct: 20,
    dueDate: "2026-11-01",
    leadStaff: "Sarah Jenkins",
    deliverables: ["Positioning Matrix", "Tone of Voice Guide", "Launch Map"],
  },
];

const generatedProjects = Array.from({ length: 20 }, (_, idx) => {
  const num = 405 + idx;
  const statuses = ["Planning", "In Progress", "Review", "Completed"];
  const client = allClients[idx % allClients.length];
  const titles = [
    "Winter Lookbook Production", "Founder Story Documentary", "Social Grid Redesign",
    "Product Launch Teasers", "Keynote Video Master", "Annual Report Design",
    "Brand Repositioning Playbook", "Architectural Showcase Film", "Luxe E-Commerce Shoot"
  ];

  return {
    id: `prj_${num}`,
    title: `${titles[idx % titles.length]} #${idx + 1}`,
    clientName: client.name,
    clientId: client.id,
    status: statuses[idx % statuses.length],
    progressPct: (idx * 15) % 100,
    dueDate: `2026-10-${(idx % 25) + 1}`,
    leadStaff: idx % 2 === 0 ? "Rohan Verma" : "Vikramaditya S.",
    deliverables: ["Deliverable Asset Pack v1", "Final Export Master"],
  };
});

const allProjects = [...baseProjects, ...generatedProjects];

// Tasks
const baseTasks = [
  {
    id: "tsk_501",
    title: "Final Color Grade Export - Monograph Film",
    projectId: "prj_402",
    clientName: "Vanguard Architecture",
    assignee: "Vikramaditya S.",
    status: "Review",
    priority: "High",
    dueDate: "2026-09-28",
  },
  {
    id: "tsk_502",
    title: "Edit Reel #3: Velvet Hydration Serum",
    projectId: "prj_401",
    clientName: "Aura Luxury Beauty",
    assignee: "Rohan Verma",
    status: "In Progress",
    priority: "High",
    dueDate: "2026-09-29",
  },
  {
    id: "tsk_503",
    title: "Draft Tone-of-Voice Archetype Document",
    projectId: "prj_404",
    clientName: "Solace Hospitality Group",
    assignee: "Sarah Jenkins",
    status: "In Progress",
    priority: "Medium",
    dueDate: "2026-10-02",
  },
  {
    id: "tsk_504",
    title: "Studio Lighting Rig Setup for Festive Shoot",
    projectId: "prj_403",
    clientName: "Kalon Artisanal Apparel",
    assignee: "Ananya Sen",
    status: "To Do",
    priority: "Medium",
    dueDate: "2026-10-04",
  },
  {
    id: "tsk_505",
    title: "Monthly Analytics Reporting Deck",
    projectId: "prj_401",
    clientName: "Aura Luxury Beauty",
    assignee: "Sarah Jenkins",
    status: "Completed",
    priority: "Low",
    dueDate: "2026-09-25",
  },
];

const generatedTasks = Array.from({ length: 25 }, (_, idx) => {
  const num = 506 + idx;
  const statuses = ["To Do", "In Progress", "Review", "Completed"];
  const priorities = ["Low", "Medium", "High", "Urgent"];
  const assignees = ["Sarah Jenkins", "Vikramaditya Sharma", "Rohan Verma", "Ananya Sen"];
  const titles = [
    "Retouch Studio Still #4", "Audio Sound Design Mix", "Typography Layout Proofing",
    "Instagram Reel Cutdown", "Client Deck Review", "Export ProRes Master",
    "Color Match Correction", "Script Storyboard Pitch", "Social Content Scheduling"
  ];

  return {
    id: `tsk_${num}`,
    title: `${titles[idx % titles.length]} (${idx + 1})`,
    projectId: allProjects[idx % allProjects.length].id,
    clientName: allProjects[idx % allProjects.length].clientName,
    assignee: assignees[idx % assignees.length],
    status: statuses[idx % statuses.length],
    priority: priorities[idx % priorities.length],
    dueDate: `2026-10-${(idx % 28) + 1}`,
  };
});

const allTasks = [...baseTasks, ...generatedTasks];

// Payments
const basePayments = [
  {
    id: "pay_601",
    invoiceNumber: "INV-2026-0901",
    clientName: "Aura Luxury Beauty",
    clientId: "cli_101",
    amount: 4500,
    method: "Bank Transfer",
    date: "2026-09-01",
    dueDate: "2026-09-05",
    status: "Paid",
  },
  {
    id: "pay_602",
    invoiceNumber: "INV-2026-0902",
    clientName: "Vanguard Architecture",
    clientId: "cli_102",
    amount: 7500,
    method: "Wire Transfer",
    date: "2026-09-01",
    dueDate: "2026-09-15",
    status: "Overdue",
  },
  {
    id: "pay_603",
    invoiceNumber: "INV-2026-0903",
    clientName: "Kalon Artisanal Apparel",
    clientId: "cli_103",
    amount: 3800,
    method: "Bank Transfer",
    date: "2026-09-10",
    dueDate: "2026-09-15",
    status: "Paid",
  },
  {
    id: "pay_604",
    invoiceNumber: "INV-2026-0904",
    clientName: "Solace Hospitality Group",
    clientId: "cli_104",
    amount: 6000,
    method: "Cheque / Wire",
    date: "2026-09-20",
    dueDate: "2026-10-05",
    status: "Pending",
  },
];

const generatedPayments = Array.from({ length: 24 }, (_, idx) => {
  const num = 605 + idx;
  const statuses = ["Paid", "Paid", "Pending", "Overdue"];
  const methods = ["Bank Transfer", "Wire Transfer", "Credit Card", "Cheque / Wire"];
  const client = allClients[idx % allClients.length];

  return {
    id: `pay_${num}`,
    invoiceNumber: `INV-2026-09${idx + 5 < 10 ? '0' + (idx + 5) : idx + 5}`,
    clientName: client.name,
    clientId: client.id,
    amount: client.monthlyRetainer || 4500,
    method: methods[idx % methods.length],
    date: `2026-09-${Math.max(1, 20 - idx)}`,
    dueDate: `2026-09-${Math.max(5, 25 - idx)}`,
    status: statuses[idx % statuses.length],
  };
});

const allPayments = [...basePayments, ...generatedPayments];

// Review Scanners
const defaultScannerQuestions = [
  {
    id: "q1",
    question: "What did you like most?",
    type: "dropdown",
    required: true,
    options: [
      { id: "o1", label: "Food & Quality", value: "Food & Quality" },
      { id: "o2", label: "Customer Service", value: "Customer Service" },
      { id: "o3", label: "Ambience & Vibe", value: "Ambience & Vibe" },
      { id: "o4", label: "Staff Attention", value: "Staff Attention" }
    ]
  },
  {
    id: "q2",
    question: "What stood out to you?",
    type: "dropdown",
    required: true,
    options: [
      { id: "o5", label: "Friendly Staff", value: "Friendly Staff" },
      { id: "o6", label: "Quick Service", value: "Quick Service" },
      { id: "o7", label: "Great Presentation", value: "Great Presentation" },
      { id: "o8", label: "Clean Environment", value: "Clean Environment" }
    ]
  },
  {
    id: "q3",
    question: "How was your overall experience?",
    type: "dropdown",
    required: true,
    options: [
      { id: "o9", label: "Excellent", value: "Excellent" },
      { id: "o10", label: "Very Good", value: "Very Good" },
      { id: "o11", label: "Good", value: "Good" },
      { id: "o12", label: "Satisfactory", value: "Satisfactory" }
    ]
  }
];

const baseScanners = [
  {
    id: "scn_301",
    slug: "aura-luxury-beauty",
    clientName: "Aura Luxury Beauty",
    name: "Aura Luxury Beauty Review",
    placeName: "Aura Luxury Flagship Studio - Mumbai",
    placeId: "ChIJN1t_t_x55zsR2001",
    googleReviewUrl: "https://search.google.com/local/writereview?placeid=ChIJN1t_t_x55zsR2001",
    avgRating: 4.9,
    totalReviewsScraped: 142,
    sentimentPctPositive: 96,
    status: "Active",
    ratingRequired: true,
    questions: defaultScannerQuestions,
    lastScanDate: "2026-09-26 08:00",
  },
  {
    id: "scn_302",
    slug: "vanguard-architecture",
    clientName: "Vanguard Architecture",
    name: "Vanguard Architecture Review",
    placeName: "Vanguard Design Studio - Worli",
    placeId: "ChIJN1t_t_x55zsR2002",
    googleReviewUrl: "https://search.google.com/local/writereview?placeid=ChIJN1t_t_x55zsR2002",
    avgRating: 4.8,
    totalReviewsScraped: 88,
    sentimentPctPositive: 92,
    status: "Active",
    ratingRequired: true,
    questions: defaultScannerQuestions,
    lastScanDate: "2026-09-26 08:00",
  },
  {
    id: "scn_303",
    slug: "solace-hospitality-group",
    clientName: "Solace Hospitality Group",
    name: "Solace Hospitality Review",
    industry: "Restaurant & Hospitality",
    placeName: "Solace Resort & Spa - Goa",
    placeId: "ChIJN1t_t_x55zsR2003",
    googleReviewUrl: "https://search.google.com/local/writereview?placeid=ChIJN1t_t_x55zsR2003",
    avgRating: 4.7,
    totalReviewsScraped: 310,
    sentimentPctPositive: 89,
    status: "Active",
    ratingRequired: true,
    questions: defaultScannerQuestions,
    lastScanDate: "2026-09-25 12:00",
  },
  {
    id: "scn_304",
    slug: "apex-multispecialty-hospital",
    clientName: "Apex Multispecialty Hospital",
    name: "Apex Multispecialty Hospital & Research Center",
    industry: "Hospital / Healthcare",
    placeName: "Apex Hospital Campus - Bandra West",
    placeId: "ChIJN1t_t_x55zsR2004",
    googleReviewUrl: "https://search.google.com/local/writereview?placeid=ChIJN1t_t_x55zsR2004",
    avgRating: 4.9,
    totalReviewsScraped: 420,
    sentimentPctPositive: 97,
    status: "Active",
    ratingRequired: true,
    doctors: [
      { id: "doc_101", name: "Dr. Rajesh Sharma", department: "Cardiology", qualification: "MD, DM (Cardiology) - Senior Consultant", available: true },
      { id: "doc_102", name: "Dr. Sneha Verma", department: "Pediatrics & Child Care", qualification: "MBBS, MD (Pediatrics)", available: true },
      { id: "doc_103", name: "Dr. Vikramaditya Roy", department: "Orthopedics & Joint Replacement", qualification: "MS (Ortho), M.Ch", available: true },
      { id: "doc_104", name: "Dr. Ananya Deshmukh", department: "Neurology", qualification: "MD, DM (Neurology)", available: true },
      { id: "doc_105", name: "Dr. Kabir Malhotra", department: "General Medicine", qualification: "MBBS, MD (Internal Medicine)", available: true }
    ],
    questions: [
      {
        id: "hq1",
        question: "How was your medical consultation?",
        type: "dropdown",
        required: true,
        options: [
          { id: "ho1", label: "Doctor's Care & Diagnosis", value: "Doctor's Care & Diagnosis" },
          { id: "ho2", label: "Clear Treatment Explanation", value: "Clear Treatment Explanation" },
          { id: "ho3", label: "Patient & Attentive Consultation", value: "Patient & Attentive Consultation" },
          { id: "ho4", label: "Nursing & Hospital Support", value: "Nursing & Hospital Support" }
        ]
      },
      {
        id: "hq2",
        question: "What stood out during your hospital visit?",
        type: "dropdown",
        required: true,
        options: [
          { id: "ho5", label: "Compassionate Staff & Nurses", value: "Compassionate Staff & Nurses" },
          { id: "ho6", label: "Pristine & Clean Facilities", value: "Pristine & Clean Facilities" },
          { id: "ho7", label: "Minimal Waiting Time", value: "Minimal Waiting Time" },
          { id: "ho8", label: "Advanced Medical Equipment", value: "Advanced Medical Equipment" }
        ]
      },
      {
        id: "hq3",
        question: "How was your overall treatment experience?",
        type: "dropdown",
        required: true,
        options: [
          { id: "ho9", label: "Excellent & Highly Satisfied", value: "Excellent & Highly Satisfied" },
          { id: "ho10", label: "Very Good & Reassuring", value: "Very Good & Reassuring" },
          { id: "ho11", label: "Good Experience", value: "Good Experience" },
          { id: "ho12", label: "Satisfactory Care", value: "Satisfactory Care" }
        ]
      }
    ],
    lastScanDate: "2026-09-26 10:30",
  },
];

const generatedScanners = Array.from({ length: 15 }, (_, idx) => {
  const num = 304 + idx;
  const client = allClients[idx % allClients.length];
  const ratings = [4.9, 4.8, 4.7, 4.6, 5.0];
  const slug = `${(client.name || 'scanner').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-review-${num}`;

  return {
    id: `scn_${num}`,
    slug: slug,
    clientName: client.name,
    name: `${client.name} Review`,
    placeName: `${client.name} - Location #${idx + 1}`,
    placeId: `ChIJN1t_t_x55zsR${num}`,
    googleReviewUrl: `https://search.google.com/local/writereview?placeid=ChIJN1t_t_x55zsR${num}`,
    avgRating: ratings[idx % ratings.length],
    totalReviewsScraped: (idx + 1) * 24 + 15,
    sentimentPctPositive: 85 + (idx % 12),
    status: idx % 5 === 0 ? "Paused" : "Active",
    ratingRequired: true,
    questions: defaultScannerQuestions,
    lastScanDate: `2026-09-26 0${idx % 9}:00`,
  };
});

const allScanners = [...baseScanners, ...generatedScanners];

// Staff Members
const allStaff = [
  {
    id: "stf_1",
    name: "Sarah Jenkins",
    email: "sarah@asnmedia.in",
    role: "Super Admin",
    avatar: "SJ",
    activeTasksCount: 4,
    status: "Active",
  },
  {
    id: "stf_2",
    name: "Vikramaditya Sharma",
    email: "vikram@asnmedia.in",
    role: "Creative Director & Lead Editor",
    avatar: "VS",
    activeTasksCount: 5,
    status: "Active",
  },
  {
    id: "stf_3",
    name: "Rohan Verma",
    email: "rohan@asnmedia.in",
    role: "Social Media Strategist",
    avatar: "RV",
    activeTasksCount: 6,
    status: "Active",
  },
  {
    id: "stf_4",
    name: "Ananya Sen",
    email: "ananya@asnmedia.in",
    role: "Content Creator & Designer",
    avatar: "AS",
    activeTasksCount: 3,
    status: "Active",
  },
  {
    id: "stf_5",
    name: "Kabir Mehta",
    email: "kabir@asnmedia.in",
    role: "Project Manager",
    avatar: "KM",
    activeTasksCount: 4,
    status: "Active",
  },
  {
    id: "stf_6",
    name: "Tanya Kapoor",
    email: "tanya@asnmedia.in",
    role: "Accountant",
    avatar: "TK",
    activeTasksCount: 2,
    status: "Active",
  },
  {
    id: "stf_7",
    name: "Aarav Nair",
    email: "aarav@asnmedia.in",
    role: "Video Editor",
    avatar: "AN",
    activeTasksCount: 5,
    status: "Active",
  },
  {
    id: "stf_8",
    name: "Pooja Hegde",
    email: "pooja@asnmedia.in",
    role: "Content Strategist",
    avatar: "PH",
    activeTasksCount: 3,
    status: "Active",
  },
  {
    id: "stf_9",
    name: "Devanshu Roy",
    email: "dev@asnmedia.in",
    role: "Motion Designer",
    avatar: "DR",
    activeTasksCount: 4,
    status: "Active",
  },
  {
    id: "stf_10",
    name: "Neha Joshi",
    email: "neha@asnmedia.in",
    role: "Copywriter",
    avatar: "NJ",
    activeTasksCount: 2,
    status: "Active",
  },
];

// Notifications
const allNotifications = Array.from({ length: 25 }, (_, idx) => {
  const types = ["EXPIRING_PACKAGE", "NEW_ENQUIRY", "OVERDUE_PAYMENT", "TASK_REVIEW"];
  const titles = [
    "Package Expiring Soon", "New Website Enquiry", "Payment Overdue Alert", "Task Pending Review"
  ];
  const messages = [
    "Retainer package for Vanguard Architecture expires in 19 days.",
    "Devika Sharma submitted a project inquiry for Luxevel Skincare.",
    "Invoice INV-2026-0902 (₹75,000) is currently overdue.",
    "Monograph Brand Film 4K color grade is ready for final review."
  ];

  return {
    id: `notif_${idx + 1}`,
    type: types[idx % types.length],
    title: titles[idx % titles.length],
    message: `${messages[idx % messages.length]} (#${idx + 1})`,
    timestamp: `${(idx % 12) + 1} hours ago`,
    read: idx > 4,
    link: idx % 2 === 0 ? "/admin/clients/expiring" : "/admin/enquiries",
  };
});

// Activity Logs
const allActivityLogs = Array.from({ length: 30 }, (_, idx) => {
  const actors = ["Sarah Jenkins", "Vikramaditya S.", "Rohan Verma", "System Sentinel", "Ananya Sen"];
  const actions = [
    "Created Lead Record", "Updated Task Status to Review", "Flagged Overdue Payment Alert",
    "Assigned Deliverable Assets", "Configured Google Review Scanner", "Exported PDF Report"
  ];
  const categories = ["Leads", "Tasks", "Payments", "Projects", "Scanners", "Reports"];

  return {
    id: `log_${idx + 1}`,
    actor: actors[idx % actors.length],
    action: actions[idx % actions.length],
    entity: `Entity Record #${101 + idx}`,
    category: categories[idx % categories.length],
    timestamp: `2026-09-26 ${(idx % 12) + 10}:15`,
  };
});

export const mockData = {
  dashboardMetrics: {
    totalClients: allClients.length,
    activeClients: allClients.filter(c => c.status === "Active").length,
    pendingClients: allClients.filter(c => c.status === "Pending").length,
    completedClients: allClients.filter(c => c.status === "Completed").length,
    newEnquiries: allEnquiries.filter(e => e.status === "New").length,
    activeProjects: allProjects.filter(p => p.status === "In Progress" || p.status === "Planning").length,
    pendingTasks: allTasks.filter(t => t.status !== "Completed").length,
    expiringPackages: allClients.filter(c => {
      if (!c.expiryDate) return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const exp = new Date(c.expiryDate);
      exp.setHours(0, 0, 0, 0);
      const diffDays = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
      return diffDays <= 30;
    }).length,
    totalPaymentCollected: allPayments.filter(p => p.status === "Paid").reduce((acc, p) => acc + p.amount, 0),
    outstandingPayments: allPayments.filter(p => p.status === "Overdue" || p.status === "Pending").reduce((acc, p) => acc + p.amount, 0),
    activeReviewScanners: allScanners.filter(s => s.status === "Active").length,
    revenueGrowthPct: 14.5,
  },

  clients: allClients,
  enquiries: allEnquiries,
  packages: allPackages,
  services: allServices,
  assignments: allAssignments,
  projects: allProjects,
  tasks: allTasks,
  payments: allPayments,
  reviewScanners: allScanners,
  staff: allStaff,
  notifications: allNotifications,
  activityLogs: allActivityLogs,
};
