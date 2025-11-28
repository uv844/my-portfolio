import React from "react";

function Nav() {
  return (
    <nav className="w-full bg-white/70 backdrop-blur sticky top-0 z-20">
      <div className="max-w-4xl mx-auto p-4 flex items-center justify-between">
        <div className="font-semibold text-lg">Yuvraj Singh</div>
        <div className="space-x-4 text-sm">
          <a href="#about" className="hover:underline">About</a>
          <a href="#projects" className="hover:underline">Projects</a>
          <a href="#contact" className="hover:underline">Contact</a>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <header className="py-20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">Hi — I’m Yuvraj</h1>
        <p className="mt-4 text-gray-600">
          2nd-year B.Tech student in AIML. I build web projects, ML prototypes and
          organise tech events.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <a href="#projects" className="px-4 py-2 bg-slate-900 text-white rounded-md">See projects</a>
          <a href="#contact" className="px-4 py-2 border rounded-md">Get in touch</a>
        </div>
      </div>
    </header>
  );
}

function Projects() {
  const sample = [
    {
      title: "Portfolio (this site)",
      desc: "React + Vite + Tailwind starter portfolio.",
      link: "#"
    },
    {
      title: "Debugging event platform (WIP)",
      desc: "A platform with participant/admin logins and image-based problems.",
      link: "#"
    }
  ];

  return (
    <section id="projects" className="py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl font-semibold">Projects</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {sample.map((p) => (
            <article key={p.title} className="p-4 border rounded-lg">
              <h3 className="font-medium">{p.title}</h3>
              <p className="text-sm text-gray-600 mt-2">{p.desc}</p>
              <a href={p.link} className="text-sm mt-3 inline-block text-sky-600">View →</a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="py-12 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl font-semibold">About</h2>
        <p className="mt-4 text-gray-700">
          I’m a 2nd-year B.Tech student in AIML with an interest in full stack web development,
          ML prototyping and organising technical events for students.
        </p>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl font-semibold">Contact</h2>
        <p className="mt-4">
          Email: <a href="mailto:youremail@example.com" className="text-sky-600">youremail@example.com</a>
        </p>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <div className="min-h-screen font-sans text-slate-900 bg-white">
      <Nav />
      <main>
        <Hero />
        <About />
        <Projects />
        <Contact />
      </main>
      <footer className="py-6 border-t mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Yuvraj Singh. Built with React + Vite.
        </div>
      </footer>
    </div>
  );
}
