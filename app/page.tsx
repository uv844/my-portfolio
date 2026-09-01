import { getSiteData } from "@/lib/data";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Work from "@/components/sections/Work";
import Stack from "@/components/sections/Stack";
import Experience from "@/components/sections/Experience";
import Education from "@/components/sections/Education";
import Credentials from "@/components/sections/Credentials";
import Contact from "@/components/sections/Contact";

/** Page is statically rendered and revalidated, so live stats refresh without a deploy. */
export const revalidate = 1800;

export default async function Home() {
  const data = await getSiteData();

  return (
    <>
      <Hero leetcode={data.leetcode} contributions={data.contributions} />

      <About />

      <Work projects={data.projects} now={data.fetchedAt} />

      <Stack />

      {/* One anchor for the nav's "Path" link; the three blocks keep their own
          ids so individual sections stay deep-linkable. */}
      <div id="path">
        <Experience />
        <Education />
        <Credentials />
      </div>

      <Contact />
    </>
  );
}
