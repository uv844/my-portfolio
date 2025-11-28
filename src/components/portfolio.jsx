// src/components/portfolio.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
// image imports (relative to src/components)
import myPhoto from "../assets/images/my-photo.jpg";
import mySmallPhoto from "../assets/images/my-small-photo.jpg";
import pythonLogo from "../assets/images/python-logo.png";
import javaLogo from "../assets/images/java-logo.png";
import cLogo from "../assets/images/c-logo.png";
import modelTrainingLogo from "../assets/images/model-training-logo.png";
import promptEngineeringLogo from "../assets/images/prompt-engineering-logo.png";
import htmlCssLogo from "../assets/images/html-css-logo.png";

// certificates
import certJava from "../assets/Certificates/yuvraj-java-nptel.png";
import certAI from "../assets/Certificates/yuvraj-ai-nptel.png";
import certPython from "../assets/Certificates/yuvraj-python-nptel.png";
import certLetsUpgrade from "../assets/Certificates/letsupgrade-java-bootcamp.png";

// projects
import studyPlannerImg from "../assets/Projects/study-planner.avif";
import hospitalImg from "../assets/Projects/hospital-management-system.png";
import nQueensImg from "../assets/Projects/N-Queens.png";
import housePredictImg from "../assets/Projects/house-price-prediction.png";
import diwaliImg from "../assets/Projects/diwali-sales-analysis.jpeg";
import irisImg from "../assets/Projects/iris-model.jpeg";


export default function Portfolio() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("");

  const sectionAnim = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const education = [
    {
      year: "2023–2027",
      title: "B.Tech — AI & ML",
      desc: "Undergraduate degree focused on AI, ML, DL & full-stack development.",
      college: "Raj Kumar Goel Institute Of Technology",
      university: "Dr. APJ Abdul Kalam Technical University",
      cgpa: "8.32/10",
    },
    {
      year: "2022–2022",
      title: "Class 12th — PCM",
      desc: "Completed senior secondary education with strong academic performance.",
      school: "St. Teresa's Academy, Modinagar",
      percentage: "92.25%",
      board: "ISC",
    },
    {
      year: "2020–2021",
      title: "Class 10th",
      desc: "Completed high school with excellent academic results.",
      school: "St. Teresa's Academy, Modinagar",
      percentage: "90%",
      board: "ICSE",
    },
  ];

  const certifications = [
    {
      year: "2025",
      title: "Programming in Java — NPTEL",
      level: "Elite + Gold",
      issuer: "NPTEL / IIT Kharagpur",
      name: "YUVRAJ SINGH",
      score: "91%",
      assignments: "24.88/25",
      exam: "66/75",
      duration: "Jul–Oct 2025 (12 week course)",
      roll: "NPTEL25CS110S456601353",
      img: "/assets/Certificates/yuvraj-java-nptel.png",
      verify: "https://nptel.ac.in/noc/E_Certificate/NPTEL25CS110S45660135310998279",
    },
    {
      year: "2025",
      title: "Artificial Intelligence: Concepts and Techniques — NPTEL",
      level: "Elite + Silver",
      issuer: "NPTEL / IISc Bangalore",
      name: "YUVRAJ SINGH",
      score: "75%",
      assignments: "24.06/25",
      exam: "51/75",
      duration: "Jul–Oct 2025 (12 week course)",
      roll: "NPTEL25CS159S1256600841",
      img: "/assets/Certificates/yuvraj-ai-nptel.png",
      verify: "https://archive.nptel.ac.in/noc/Ecertificate/?q=NPTEL25CS159S125660084110998279",
    },
    {
      year: "2024",
      title: "Programming, Data Structures and Algorithms using Python — NPTEL",
      level: "Elite",
      issuer: "NPTEL / IIT Madras",
      name: "Yuvraj Singh",
      score: "73%",
      assignments: "23.96/25",
      exam: "48.75/75",
      duration: "Jul–Sep 2024 (8 week course)",
      roll: "NPTEL24CS78S435500788",
      img: "/assets/Certificates/yuvraj-python-nptel.png",
      verify: "https://archive.nptel.ac.in/noc/Ecertificate/?q=NPTEL24CS78S43550078802782399",
    },
    {
      year: "2024",
      title: "Java Project Bootcamp — LetsUpgrade",
      issuer: "LetsUpgrade",
      name: "Yuvraj Singh",
      duration: "9–13 July 2024 (5 days)",
      img: "/assets/Certificates/letsupgrade-java-bootcamp.png",
      verify: "https://verify.letsupgrade.in/",
    },
  ];

  const projects = [
    {
      title: "Smart Study Planner",
      desc: "Smart planner that schedules study sessions based on workload and priorities.",
      img: "/assets/Projects/study-planner.avif",
      repo: "https://github.com/uv844/SMART_STUDY_PLANNER",
    },
    {
      title: "Hospital Management System",
      desc: "A digital platform that organizes hospital workflows and patient data.",
      img: "/assets/Projects/hospital-management-system.png",
      repo: "https://github.com/uv844/Hospital_Management_System",
    },
    {
      title: "Simple N-Queens Solver",
      desc: "A tool that solves the N-Queens puzzle using backtracking and displays valid board configurations.",
      img: "/assets/Projects/N-Queens.png",
      repo: "https://github.com/uv844/N-Queen-Solver",
    },
    {
      title: "House Prediction Model",
      desc: "A regression-based ML model that predicts house prices using key features like location, size, and amenities.",
      img: "/assets/Projects/house-price-prediction.png",
      repo: "https://github.com/uv844/NASSCOM/blob/main/housing_price_prediction%20(1).ipynb",
    },
    {
      title: "Diwali Sales Analysis Model",
      desc: "Analyzes Diwali sales data to identify customer behavior, top-selling categories, and revenue patterns.",
      img: "/assets/Projects/diwali-sales-analysis.jpeg",
      repo: "https://github.com/uv844/NASSCOM/blob/main/Diwali_Sales_Analysis_Yuvraj.ipynb",
    },
    {
      title: "Iris Classification Model",
      desc: "A machine learning model that classifies iris flowers into species using the classic Iris dataset.",
      img: "/assets/Projects/iris-model.jpeg",
      repo: "https://github.com/uv844/NASSCOM/blob/main/Yuvraj_Exp5_K_NN_classification_iris_data_with_CV.ipynb",
    },
  ];

  useEffect(() => {
    const ids = [
      "education",
      "certifications",
      "skills",
      "projects",
      "achievements",
      "contact",
    ];

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setCurrent(entry.target.id);
        });
      },
      { root: null, rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });

    return () => obs.disconnect();
  }, []);

  const navItems = [
    { id: "education", label: "Education" },
    { id: "certifications", label: "Certifications" },
    { id: "skills", label: "Skills" },
    { id: "achievements", label: "Achievements" },
    { id: "projects", label: "Projects" },
    { id: "contact", label: "Contact" },
  ];

  // smooth scroll helper
  function smoothScrollToId(id, duration = 700) {
    const el = document.getElementById(id);
    if (!el) return;
    const headerOffset = 96;
    const start = window.pageYOffset;
    const target = el.getBoundingClientRect().top + window.pageYOffset - headerOffset;
    const distance = target - start;
    let startTime = null;

    function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const time = Math.min(1, (timestamp - startTime) / duration);
      const eased = easeInOutCubic(time);
      window.scrollTo(0, Math.round(start + distance * eased));
      if (time < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-200 to-white text-slate-900 font-sans scroll-smooth">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full backdrop-blur-lg bg-white/40 border-b border-white/40 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 p-4">
          <div className="flex items-center gap-4">
            <img
              src="/assets/images/my-small-photo.jpg"
              alt="Small Profile"
              className="w-10 h-10 rounded-full border border-white/30 shadow-md object-cover"
            />
            <h1 className="text-lg md:text-xl font-semibold tracking-wide">Yuvraj Singh</h1>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:block">
            <ul className="flex items-center gap-1 md:gap-2 lg:gap-3 text-base">
              {navItems.map((item) => (
                <li key={item.id}>
                  <div className="relative group">
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        smoothScrollToId(item.id);
                      }}
                      className="group relative px-2 py-1 transition-colors hover:text-indigo-600"
                    >
                      {item.label}
                    </a>
                    <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-indigo-600 transition-all duration-300 group-hover:w-full" />
                  </div>
                </li>
              ))}

              <li>
                <a
                  href="/assets/YUVRAJ%20SINGH%20CV.pdf"
                  download
                  className="px-3 py-1 border border-white/40 rounded-md backdrop-blur-md bg-white/30 shadow-sm hover:shadow-lg transform hover:-translate-y-0.5 transition"
                >
                  Resume
                </a>
              </li>
            </ul>
          </nav>

          {/* Mobile hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setOpen(!open)}
              aria-label="menu"
              className="p-2 rounded-md border border-white/30 bg-white/20"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 7H20M4 12H20M4 17H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu panel */}
        {open && (
          <div className="md:hidden px-4 pb-4">
            <ul className="flex flex-col gap-3">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      smoothScrollToId(item.id);
                      setOpen(false);
                    }}
                    className="block px-3 py-2 rounded-md hover:bg-indigo-50"
                  >
                    {item.label}
                  </a>
                </li>
              ))}

              <li>
                <a href="/assets/YUVRAJ%20SINGH%20CV.pdf" download className="block px-3 py-2 rounded-md border border-white/30 text-center">
                  Resume
                </a>
              </li>
            </ul>
          </div>
        )}
      </header>

      {/* Main Section */}
      <main className="pt-28 max-w-6xl mx-auto p-6 space-y-20">
        {/* Hero Section */}
        <section id="home" className="flex flex-col md:flex-row md:items-start md:gap-8">
          <motion.img
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7 }}
            src="/assets/images/my-photo.jpg"
            alt="Profile"
            className="w-56 h-56 md:w-64 md:h-64 rounded-2xl object-cover shadow-2xl transition-transform transform hover:scale-105 hover:shadow-[0_20px_40px_rgba(99,102,241,0.12)] md:mr-6"
          />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionAnim}
            transition={{ duration: 0.7 }}
            className="backdrop-blur-xl bg-white/40 p-6 md:p-10 rounded-2xl border border-white/40 shadow-lg flex-1 md:max-w-3xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Yuvraj Singh</h2>
            <p className="text-base md:text-lg opacity-90 mb-4">
              I am a passionate B.Tech AIML student and a developer exploring
              machine learning, web technologies, and innovative solutions.
            </p>
            <div className="flex gap-3 flex-wrap">
              <a href="#skills" className="px-4 py-2 rounded-full border border-indigo-200/40 text-sm font-medium hover:scale-105 transform transition-shadow shadow-sm hover:shadow-[0_12px_30px_rgba(99,102,241,0.12)]">See my work</a>
              <a href="/resume.pdf" download className="px-4 py-2 rounded-full bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition">Download Resume</a>
            </div>

            <div className="flex gap-4 mt-4 text-2xl">
              <a href="https://github.com/uv844" className="p-2 rounded-md transition transform hover:scale-105 hover:shadow-[0_8px_32px_rgba(17,24,39,0.12)]" aria-label="GitHub">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                  <path d="M12 .5a12 12 0 00-3.79 23.4c.6.11.82-.26.82-.58v-2.1c-3.34.73-4.04-1.61-4.04-1.61-.54-1.38-1.32-1.75-1.32-1.75-1.08-.74.08-.73.08-.73 1.2.08 1.83 1.24 1.83 1.24 1.06 1.82 2.78 1.29 3.46.99.11-.78.42-1.29.76-1.59-2.66-.3-5.46-1.33-5.46-5.92 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 016 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.9 1.24 3.22 0 4.6-2.8 5.61-5.47 5.91.43.37.81 1.1.81 2.22v3.29c0 .32.21.7.82.58A12 12 0 0012 .5z" />
                </svg>
              </a>

              <a href="https://www.linkedin.com/in/yuvraj-singh-258649312/" className="p-2 rounded-md transition transform hover:scale-105 hover:shadow-[0_8px_32px_rgba(10,102,194,0.12)]" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4.98 3.5a2.5 2.5 0 11.02 0H4.98zM3 8.98h4v12H3v-12zm7.5 0h3.8v1.6h.05c.53-1 1.82-2.05 3.75-2.05 4.01 0 4.75 2.65 4.75 6.10v6.35h-4v-5.6c0-1.33-.02-3.04-1.86-3.04-1.86 0-2.14 1.45-2.14 2.94v5.7h-4v-12z" />
                </svg>
              </a>

              <a href="https://www.instagram.com/__yuvraj_03_/" className="p-2 rounded-md transition transform hover:scale-105 hover:shadow-[0_8px_32px_rgba(219,39,119,0.12)]" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 6.5A4.5 4.5 0 1016.5 13 4.5 4.5 0 0012 8.5zm6.5-3.5a1 1 0 11-1 1 1 1 0 011-1z" />
                </svg>
              </a>
            </div>
          </motion.div>
        </section>

        {/* Education */}
        <motion.section id="education" style={{ scrollMarginTop: 96 }} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionAnim} transition={{ duration: 0.6 }} className="space-y-6">
          <h3 className="text-2xl md:text-3xl font-bold">Education</h3>

          <div className="grid sm:grid-cols-2 gap-6 items-start">
            {education.map((e) => (
              <motion.div key={e.title} whileHover={{ scale: 1.03 }} className="backdrop-blur-xl bg-white/40 p-4 rounded-xl border border-white/30 shadow-sm hover:shadow-lg transition transform hover:-translate-y-1 w-full h-full">
                <div className="font-semibold text-sm mb-2">{e.year}</div>
                <h4 className="text-lg font-semibold">{e.title}</h4>
                {e.college && (
                  <p className="opacity-80 text-sm mt-1">{e.college}</p>
                )}
                {e.university && (
                  <p className="opacity-80 text-sm mt-1">University: {e.university}</p>
                )}
                {e.school && (
                  <p className="opacity-80 text-sm mt-1">{e.school}</p>
                )}
                {e.board && (
                  <p className="opacity-80 text-sm mt-1">Board: {e.board}</p>
                )}
                {e.cgpa && (
                  <p className="opacity-80 text-sm mt-1">CGPA: {e.cgpa}</p>
                )}
                {e.percentage && (
                  <p className="opacity-80 text-sm mt-1">Percentage: {e.percentage}</p>
                )}
                <p className="text-sm opacity-90 mt-2">{e.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Certifications */}
        <motion.section id="certifications" style={{ scrollMarginTop: 96 }} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionAnim} transition={{ duration: 0.6 }} className="space-y-6">
          <h3 className="text-2xl md:text-3xl font-bold">Certifications</h3>

          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {certifications.map((c) => (
              <motion.div key={c.title} whileHover={{ scale: 1.02 }} className="backdrop-blur-xl bg-white/40 p-4 rounded-xl border border-white/30 shadow-sm hover:shadow-lg transition transform hover:-translate-y-1">
                <div className="flex items-start gap-4">
                  {c.img && (
                    <img src={c.img} alt={c.title} className="w-28 h-20 object-cover rounded-md" />
                  )}

                  <div className="flex-1">
                    <div className="font-semibold text-sm mb-1">{c.year} {c.issuer && `• ${c.issuer}`}</div>
                    <h4 className="text-lg font-semibold">{c.title}</h4>
                    {c.level && (
                      <p className="text-sm font-medium mt-1 text-indigo-700">Level: {c.level}</p>
                    )}
                    {c.name && (
                      <p className="text-sm opacity-90 mt-1 font-medium">Awarded to {c.name}</p>
                    )}

                    {c.score && (
                      <div className="mt-3 flex items-center gap-6">
                        <div className="text-2xl font-bold">{c.score}</div>
                        <div className="flex items-center gap-3 text-sm opacity-90">
                          {c.assignments && <div className="px-3 py-1 border border-white/20 rounded-md">Assignments: {c.assignments}</div>}
                          {c.exam && <div className="px-3 py-1 border border-white/20 rounded-md">Exam: {c.exam}</div>}
                        </div>
                      </div>
                    )}

                    {c.duration && (
                      <p className="text-sm opacity-80 mt-3">{c.duration}</p>
                    )}

                    {c.roll && (
                      <p className="text-xs opacity-70 mt-2">Roll: {c.roll}</p>
                    )}
                  </div>
                </div>

                {c.verify && (
                  <div className="mt-3 text-right">
                    <a href={c.verify} target="_blank" rel="noreferrer" className="text-sm underline">Verify Certificate</a>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Skills */}
        <motion.section id="skills" style={{ scrollMarginTop: 96 }} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={sectionAnim} transition={{ duration: 0.6 }} className="space-y-6">
          <h3 className="text-2xl md:text-3xl font-bold">Skills</h3>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              "Python",
              "Java",
              "C",
              "DSA",
              "Model Training",
              "Prompt Engineering",
              "HTML & CSS",
            ].map((skill) => (
              <motion.div
                key={skill}
                whileHover={{ scale: 1.04, rotate: -3 }}
                className="backdrop-blur-xl bg-white/40 p-4 rounded-xl border border-white/30 shadow-sm hover:shadow-lg transition transform hover:-translate-y-1"
              >
                <div className="flex flex-col items-center justify-center gap-3">
                  {skill === "Python" && (
                    <motion.div initial={{ y: 0 }} animate={{ y: [0, -6, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
                      <img src="/assets/images/python-logo.png" alt="Python" className="w-12 h-12 object-contain" />
                    </motion.div>
                  )}

                  {skill === "Java" && (
                    <motion.div initial={{ y: 0 }} animate={{ y: [0, -6, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
                      <img src="/assets/images/java-logo.png" alt="Java" className="w-12 h-12 object-contain" />
                    </motion.div>
                  )}

                  {skill === "C" && (
                    <motion.div initial={{ y: 0 }} animate={{ y: [0, -6, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
                      <img src="/assets/images/c-logo.png" alt="C" className="w-12 h-12 object-contain" />
                    </motion.div>
                  )}

                  {skill === "DSA" && (
                    <motion.div initial={{ y: 0 }} animate={{ y: [0, -6, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l7 4-7 4-7-4z" fill="#4CAF50"/><path d="M5 10l7 4 7-4v6l-7 4-7-4z" fill="#2E7D32"/></svg>
                    </motion.div>
                  )}

                  {skill === "Model Training" && (
                    <motion.div initial={{ y: 0 }} animate={{ y: [0, -6, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
                      <img src="/assets/images/model-training-logo.png" alt="Model Training" className="w-12 h-12 object-contain" />
                    </motion.div>
                  )}

                  {skill === "Prompt Engineering" && (
                    <motion.div initial={{ y: 0 }} animate={{ y: [0, -6, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
                      <img src="/assets/images/prompt-engineering-logo.png" alt="Prompt Engineering" className="w-12 h-12 object-contain" />
                    </motion.div>
                  )}

                  {skill === "HTML & CSS" && (
                    <motion.div initial={{ y: 0 }} animate={{ y: [0, -6, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
                      <img src="/assets/images/html-css-logo.png" alt="HTML CSS" className="w-12 h-12 object-contain" />
                    </motion.div>
                  )}

                  <div className="text-center text-lg font-semibold">{skill}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Achievements */}
        <motion.section id="achievements" style={{ scrollMarginTop: 96 }} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={sectionAnim} transition={{ duration: 0.6 }} className="space-y-6">
          <h3 className="text-2xl md:text-3xl font-bold">Achievements</h3>
          <ul className="list-disc pl-6 space-y-2 text-base opacity-90">
            <li className="backdrop-blur-xl bg-white/30 p-3 rounded-md border border-white/10 shadow-sm">Built multiple AI and web development projects.</li>
            <li className="backdrop-blur-xl bg-white/30 p-3 rounded-md border border-white/10 shadow-sm">President of Tech Society, Nebula at RKGIT.</li>
            <li className="backdrop-blur-xl bg-white/30 p-3 rounded-md border border-white/10 shadow-sm">Organizing debugging & tech events in college.</li>
            <li className="backdrop-blur-xl bg-white/30 p-3 rounded-md border border-white/10 shadow-sm">Participated in Smart India Hackathon (SIH) and other Hackathons.</li>
            <li className="backdrop-blur-xl bg-white/30 p-3 rounded-md border border-white/10 shadow-sm">Winner and participated in many college tech events.</li>
            </ul>
        </motion.section>

        {/* Projects */}
        <motion.section id="projects" style={{ scrollMarginTop: 96 }} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionAnim} transition={{ duration: 0.6 }} className="space-y-6">
          <h3 className="text-2xl md:text-3xl font-bold">Projects</h3>

          <div className="grid sm:grid-cols-2 gap-6">
            {projects.map((p) => (
              <motion.div key={p.title} whileHover={{ scale: 1.03 }} className="backdrop-blur-xl bg-white/40 p-4 rounded-xl border border-white/30 shadow-sm hover:shadow-lg transition transform hover:-translate-y-1">
                {p.img && <img src={p.img} alt={p.title} className="w-full h-40 object-cover rounded-md mb-3" />}
                <h4 className="text-lg font-semibold mb-1">{p.title}</h4>
                <p className="text-sm opacity-80 mb-3">{p.desc}</p>
                {p.repo && (
                  <a href={p.repo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-white/60 border border-indigo-300 text-sm rounded-lg shadow-md hover:shadow-[0_8px_24px_rgba(99,102,241,0.35)] hover:bg-indigo-100/70 backdrop-blur-md transition">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="opacity-90"><path d="M12 .5a12 12 0 00-3.79 23.4c.6.11.82-.26.82-.58v-2.1c-3.34.73-4.04-1.61-4.04-1.61-.54-1.38-1.32-1.75-1.32-1.75-1.08-.74.08-.73.08-.73 1.2.08 1.83 1.24 1.83 1.24 1.06 1.82 2.78 1.29 3.46.99.11-.78.42-1.29.76-1.59-2.66-.3-5.46-1.33-5.46-5.92 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 016 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.9 1.24 3.22 0 4.6-2.8 5.61-5.47 5.91.43.37.81 1.1.81 2.22v3.29c0 .32.21.7.82.58A12 12 0 0012 .5z"/></svg>
                    <span>Repository</span>
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Contact - premium */}
        <motion.section id="contact" style={{ scrollMarginTop: 96 }} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={sectionAnim} transition={{ duration: 0.6 }} className="space-y-6">
          <h3 className="text-2xl md:text-3xl font-bold">Contact Me</h3>

          <div className="grid md:grid-cols-2 gap-6 items-stretch">
            {/* Info card */}
            <div className="backdrop-blur-xl bg-white/40 p-6 rounded-2xl border border-white/30 shadow-lg flex flex-col justify-between">
              <div>
                <h4 className="text-xl font-semibold mb-2">Let's build something great ✨</h4>
                <p className="opacity-80 mb-4">Prefer email? Send me a message — I usually reply within a day.</p>

                <div className="space-y-3">
                  {/* Email */}
                  <div className="flex items-center gap-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="opacity-90">
                      <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                    <span className="font-medium">yuvrajch1503@gmail.com</span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="opacity-90">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5.5z" />
                    </svg>
                    <span className="font-medium">Modinagar, India</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex gap-3">
                  <a href="https://github.com/uv844" className="p-2 rounded-md transition transform hover:scale-105 hover:shadow-[0_8px_32px_rgba(17,24,39,0.12)]" aria-label="GitHub">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 .5a12 12 0 00-3.79 23.4c.6.11.82-.26.82-.58v-2.1c-3.34.73-4.04-1.61-4.04-1.61-.54-1.38-1.32-1.75-1.32-1.75-1.08-.74.08-.73.08-.73 1.2.08 1.83 1.24 1.83 1.24 1.06 1.82 2.78 1.29 3.46.99.11-.78.42-1.29.76-1.59-2.66-.3-5.46-1.33-5.46-5.92 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 016 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.9 1.24 3.22 0 4.6-2.8 5.61-5.47 5.91.43.37.81 1.1.81 2.22v3.29c0 .32.21.7.82.58A12 12 0 0012 .5z" /></svg>
                  </a>
                  <a href="https://www.linkedin.com/in/yuvraj-singh-258649312/" className="p-2 rounded-md transition transform hover:scale-105 hover:shadow-[0_8px_32px_rgba(10,102,194,0.12)]" aria-label="LinkedIn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 11.02 0H4.98zM3 8.98h4v12H3v-12zm7.5 0h3.8v1.6h.05c.53-1 1.82-2.05 3.75-2.05 4.01 0 4.75 2.65 4.75 6.10v6.35h-4v-5.6c0-1.33-.02-3.04-1.86-3.04-1.86 0-2.14 1.45-2.14 2.94v5.7h-4v-12z" /></svg>
                  </a>
                  <a href="https://www.instagram.com/__yuvraj_03_/" className="p-2 rounded-md transition transform hover:scale-105 hover:shadow-[0_8px_32px_rgba(219,39,119,0.12)]" aria-label="Instagram">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 6.5A4.5 4.5 0 1016.5 13 4.5 4.5 0 0012 8.5zm6.5-3.5a1 1 0 11-1 1 1 1 0 011-1z" /></svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Form */}
            <form action="https://formsubmit.co/yuvrajch1503@gmail.com" method="POST" className="backdrop-blur-xl bg-white/40 p-6 rounded-2xl border border-white/30 shadow-lg">
              {/* honeypot */}
              <input type="text" name="_honey" style={{ display: "none" }} />
              <input type="hidden" name="_captcha" value="false" />

              <div className="grid gap-4">
                <input type="text" name="name" placeholder="Your Name" required className="p-3 rounded-lg bg-white/70 border border-white/50 w-full" />
                <input type="email" name="email" placeholder="Your Email" required className="p-3 rounded-lg bg-white/70 border border-white/50 w-full" />
                <textarea name="message" placeholder="Your Message" required className="p-3 rounded-lg bg-white/70 border border-white/50 h-40"></textarea>

                <div className="flex items-center justify-between gap-4">
                  <button type="submit" className="px-6 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-lg hover:shadow-[0_20px_40px_rgba(99,102,241,0.18)]">Send Message</button>
                  
                </div>
              </div>
            </form>
          </div>
        </motion.section>

      </main>

      {/* Mobile sticky indicator (mobile only) */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 md:hidden z-50">
  <div className="flex bg-white/30 backdrop-blur rounded-full p-2 gap-2 shadow-lg">
    {navItems.map((item) => (
      <a
        key={item.id}
        href={`#${item.id}`}
        onClick={(e) => { e.preventDefault(); smoothScrollToId(item.id); }}
        className="block w-3 h-3 rounded-full bg-white/60 transition-all hover:bg-indigo-600 hover:shadow-[0_8px_32px_rgba(99,102,241,0.18)]"
      ></a>
    ))}
  </div>
</div>

      {/* Footer */}
      <footer className="text-center py-6 opacity-60 text-sm">
        © {new Date().getFullYear()} Yuvraj Singh. All rights reserved.
      </footer>
    </div>
  );
}
