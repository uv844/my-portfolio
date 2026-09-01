/**
 * Single source of truth for every factual claim on the site.
 * Everything here is transcribed from the CV or verified against a live profile.
 * Change a fact here, not in a section component.
 */

export const profile = {
  name: "Yuvraj Singh",
  initials: "YS",
  role: "Full Stack Developer",
  /**
   * The h1 reads "I build <role> web apps.", where the middle line cycles through
   * `roles` (see components/fx/RoleCycle). Keep each entry short — it renders at up
   * to 7rem, and a long word wraps and breaks the three-line shape.
   */
  headline: { before: "I build", after: "web apps." },
  roles: ["full-stack", "front-end", "back-end", "API-first", "Java-powered"],
  tagline:
    "B.Tech CSE (AI & ML) student building full-stack web apps — React and TypeScript interfaces over Java, Node.js and REST API backends.",
  summary:
    "B.Tech CSE (AI & ML) student who builds web applications end to end — React and TypeScript on the front, Java, Node.js and RESTful APIs behind them. Strong in Object-Oriented Programming and Data Structures & Algorithms, with hands-on database work in MySQL. Skilled in writing clean, efficient, and maintainable code.",
  seeking: "Looking for full-stack, frontend, backend or Java developer roles.",
  location: "Modinagar, Uttar Pradesh, India",
  timezone: "Asia/Kolkata",
  email: "yuvrajch1503@gmail.com",
  phone: "+91 8445043370",
  resume: "/Yuvraj-Singh-CV.pdf",
  photo: "/yuvraj.jpeg",
  siteUrl: "https://yuvraj-portfolio-xi.vercel.app",
  available: true,
  availableLabel: "Open to SWE internships",
} as const;

export const socials = [
  { label: "GitHub", handle: "uv844", href: "https://github.com/uv844" },
  {
    label: "LinkedIn",
    handle: "yuvraj-singh",
    href: "https://www.linkedin.com/in/yuvraj-singh-258649312/",
  },
  {
    label: "LeetCode",
    handle: "yuvrajch1503",
    href: "https://leetcode.com/u/yuvrajch1503/",
  },
  {
    label: "GeeksforGeeks",
    handle: "yuvrajc6klu",
    href: "https://www.geeksforgeeks.org/profile/yuvrajc6klu?tab=activity",
  },
] as const;

/**
 * Regrouped from the CV's own list to lead with the interface layer, then the
 * services behind it — the CV grouped everything under "Languages", which read as
 * backend-only. Every CV skill is still here; TypeScript and Tailwind CSS are the
 * two additions, both backed by shipped projects in content/projects.ts.
 *
 * Stays at six groups deliberately: the Stack grid is 3-up on desktop and 2-up on
 * tablet, and a seventh would orphan a card on its own row at both widths.
 */
export const skillGroups = [
  {
    title: "Frontend",
    items: ["React", "TypeScript", "JavaScript", "HTML", "CSS", "Tailwind CSS"],
  },
  {
    title: "Backend & APIs",
    items: ["Java", "Python", "Node.js", "Express", "REST APIs"],
  },
  {
    title: "Databases",
    items: ["MySQL", "MongoDB", "SQL Server"],
  },
  {
    title: "Data Structures & Algorithms",
    items: ["Arrays", "LinkedList", "Stack", "Queue", "Trees"],
  },
  {
    title: "Core CS",
    items: ["OOP", "DBMS", "Operating Systems"],
  },
  {
    title: "Tools",
    items: ["Git", "GitHub", "VS Code"],
  },
] as const;

export const experience = [
  {
    org: "Raj Kumar Goel Institute of Technology",
    title: "President — Nebula Society",
    meta: "College Technical Society",
    period: "Nov 2024 — Present",
    current: true,
    points: [
      "Managed and coordinated a team of 30+ members.",
      "Organized structured technical events with 100+ participants.",
      "Ensured smooth execution of tasks and deadlines.",
      "Maintained consistency and accountability across team activities.",
    ],
  },
] as const;

export const education = [
  {
    period: "2023 — 2027",
    title: "B.Tech — CSE (AI & ML)",
    institution: "Raj Kumar Goel Institute of Technology",
    affiliation: "Dr. A.P.J. Abdul Kalam Technical University",
    location: "Ghaziabad, Uttar Pradesh",
    metricLabel: "CGPA",
    metric: "8.32",
    metricSuffix: "/10",
    note: "Undergraduate degree focused on AI, ML and full-stack development.",
    current: true,
  },
  {
    period: "2022",
    title: "Class 12 — PCM",
    institution: "St. Teresa's Academy, Modinagar",
    affiliation: "ISC",
    location: "Modinagar, Uttar Pradesh",
    metricLabel: "Score",
    metric: "92.25",
    metricSuffix: "%",
    note: "Senior secondary education with strong academic performance.",
    current: false,
  },
  {
    period: "2020 — 2021",
    title: "Class 10",
    institution: "St. Teresa's Academy, Modinagar",
    affiliation: "ICSE",
    location: "Modinagar, Uttar Pradesh",
    metricLabel: "Score",
    metric: "90",
    metricSuffix: "%",
    note: "High school with excellent academic results.",
    current: false,
  },
] as const;

export const certifications = [
  {
    title: "Programming in Java",
    issuer: "NPTEL · IIT Kharagpur",
    year: "2025",
    badge: "Elite + Gold",
  },
  {
    title: "AI: Concepts & Techniques",
    issuer: "NPTEL · IISc Bangalore",
    year: "2025",
    badge: "Elite",
  },
  {
    title: "Programming & DSA in Python",
    issuer: "NPTEL · IIT Madras",
    year: "2024",
    badge: "Elite + Silver",
  },
  {
    title: "Java Bootcamp",
    issuer: "LetsUpgrade",
    year: "2023",
    badge: "Completed",
  },
] as const;

export const achievements = [
  {
    metric: "580+",
    label: "problems solved",
    detail: "Across LeetCode, GeeksforGeeks and CodeChef",
  },
  {
    metric: "SIH 2025",
    label: "qualifier",
    detail: "Smart India Hackathon",
  },
  {
    metric: "Finalist",
    label: "GUVI HCL AI Buildathon",
    detail: "National-level AI build competition",
  },
  {
    metric: "30+",
    label: "members led",
    detail: "As President of Nebula Society",
  },
] as const;

/**
 * Hero stat rail. `live` entries get overwritten by real API data at request time;
 * the values here are the fallback shown if an upstream is unreachable.
 *
 * NOTE: LeetCode's own API reports ~156 solved for this account. The 580+ figure is
 * the CV's combined total across LeetCode + GeeksforGeeks + CodeChef. These are
 * deliberately kept as two separate, separately-labelled stats — never merged.
 */
export const fallbackStats = {
  leetcodeSolved: 156,
  leetcodeEasy: 92,
  leetcodeMedium: 56,
  leetcodeHard: 8,
  leetcodeRanking: 1090730,
  contributions: 197,
  cgpa: "8.32",
  totalSolved: "580+",
} as const;

export const navLinks = [
  { label: "About", href: "#about", id: "about" },
  { label: "Work", href: "#work", id: "work" },
  { label: "Stack", href: "#stack", id: "stack" },
  { label: "Path", href: "#path", id: "path" },
  { label: "Contact", href: "#contact", id: "contact" },
] as const;
