import { profile, socials } from "@/content/profile";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 mt-24 border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-display text-lg font-semibold tracking-tight">
              {profile.name}
            </p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-dim">
              {profile.role} · {profile.location}
            </p>
          </div>

          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="open"
                  className="link-wipe font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-accent"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="hairline my-8" />

        <div className="flex flex-col-reverse gap-3 font-mono text-[10px] uppercase tracking-[0.14em] text-dim sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {profile.name}. All rights reserved.</p>
          <p className="flex items-center gap-3">
            <span>Next.js · TypeScript · Tailwind</span>
            <a
              href="#top"
              data-cursor="top"
              className="text-muted transition-colors hover:text-accent"
            >
              Back to top ↑
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
