import { createFileRoute } from "@tanstack/react-router";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Certifications from "@/components/Certifications";
import Experience from "@/components/Experience";
import GithubStats from "@/components/GithubStats";
import Resume from "@/components/Resume";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ParticleBackground from "@/components/ParticleBackground";
import CustomCursor from "@/components/CustomCursor";
import LoadingScreen from "@/components/LoadingScreen";
import ScrollProgress from "@/components/ScrollProgress";
import ScrollToTop from "@/components/ScrollToTop";

const title = "Suryansh Gour | BCA (AI & Data Science) | Full Stack Developer";
const description =
  "Portfolio of Suryansh Gour — BCA (AI & Data Science) student at SAGE University Bhopal. Full stack developer, AI enthusiast and AWS learner.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <LoadingScreen onComplete={() => setIsLoading(false)} />

      <AnimatePresence>
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col min-h-screen relative"
          >
            <ScrollProgress />
            <CustomCursor />
            <ParticleBackground />

            <Navbar />

            <main className="flex-grow">
              <Hero />
              <About />
              <Skills />
              <Projects />
              <Certifications />
              <Experience />
              <GithubStats />
              <Resume />
              <Contact />
            </main>

            <Footer />

            <ScrollToTop />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
