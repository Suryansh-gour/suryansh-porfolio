import React from "react";
import { motion } from "framer-motion";
import { Download, FolderGit2, Mail } from "lucide-react";
import { RESUME_URL } from "@/components/Resume";

export default function ResumeCTA() {
  return (
    <section className="px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto glass-panel border border-[var(--card-border)] rounded-3xl p-8 sm:p-12 text-center shadow-xl relative overflow-hidden"
      >
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <h3 className="relative text-2xl sm:text-3xl font-extrabold font-heading text-[var(--foreground)]">
          Interested in{" "}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            working together?
          </span>
        </h3>
        <p className="relative mt-3 text-sm text-[var(--text-muted)] max-w-xl mx-auto leading-relaxed">
          I&apos;m open to internships, freelance projects and collaborations in full stack
          development and AI. Take a look at my work or reach out directly.
        </p>

        <div className="relative mt-8 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4">
          <a
            href={RESUME_URL}
            download="Suryansh_Gour_Resume.pdf"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-primary via-secondary to-accent text-white font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/30 transform hover:-translate-y-0.5 transition-all text-sm duration-200"
          >
            <Download size={16} /> Download Resume
          </a>
          <a
            href="#projects"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--foreground)] font-bold flex items-center justify-center gap-2 hover:border-primary/40 hover:text-primary transform hover:-translate-y-0.5 transition-all text-sm duration-200"
          >
            <FolderGit2 size={16} /> View Projects
          </a>
          <a
            href="#contact"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--foreground)] font-bold flex items-center justify-center gap-2 hover:border-primary/40 hover:text-primary transform hover:-translate-y-0.5 transition-all text-sm duration-200"
          >
            <Mail size={16} /> Contact Me
          </a>
        </div>
      </motion.div>
    </section>
  );
}
