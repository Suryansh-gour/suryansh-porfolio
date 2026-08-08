import React from "react";
import { motion } from "framer-motion";
import { Download, FileText, Mail, MapPin, Phone } from "lucide-react";

export default function Resume() {
  return (
    <section id="resume" className="py-20 relative px-6 overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-extrabold font-heading text-[var(--foreground)] mb-4"
          >
            My <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Resume</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: 80 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"
          />
        </div>

        {/* Content Layout */}
        <div className="flex flex-col items-center justify-center max-w-4xl mx-auto space-y-8">
          
          {/* Action Trigger download button */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 w-full sm:w-auto"
          >
            <a
              href={RESUME_URL}
              download="Suryansh_Gour_Resume.pdf"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-primary via-secondary to-accent text-white font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/30 transform hover:-translate-y-0.5 transition-all text-sm duration-200 cursor-pointer"
            >
              <Download size={16} /> Download Resume
            </a>
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--foreground)] font-bold flex items-center justify-center gap-2 hover:border-primary/40 hover:text-primary transform hover:-translate-y-0.5 transition-all text-sm duration-200 cursor-pointer"
            >
              <ExternalLink size={16} /> View Resume
            </a>
          </motion.div>

          {/* Graphical Mockup representing the actual resume document */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-3xl glass-panel border border-[var(--card-border)] rounded-3xl p-6 sm:p-10 shadow-2xl relative"
          >
            {/* Header section representing personal card info */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start border-b border-[var(--card-border)] pb-8 mb-8 gap-4">
              <div>
                <h3 className="text-3xl font-extrabold font-heading text-[var(--foreground)] tracking-tight">
                  Suryansh Gour
                </h3>
                <p className="text-sm font-semibold text-primary mt-1">
                  BCA Student (AI &amp; Data Science) | Full Stack Developer
                </p>
                <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mt-2 font-mono">
                  <MapPin size={12} className="text-accent" />
                  SAGE University, Bhopal, India
                </div>
              </div>
              <div className="flex flex-col gap-1.5 text-xs font-mono text-[var(--text-muted)] sm:text-right">
                <span className="flex sm:justify-end items-center gap-2">
                  goursuryansh51@gmail.com <Mail size={12} className="text-primary" />
                </span>
                <span className="flex sm:justify-end items-center gap-2">
                  +91 9302026030 <Phone size={12} className="text-secondary" />
                </span>
              </div>
            </div>

            {/* Document body columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Left column info */}
              <div className="space-y-6 md:border-r md:border-[var(--card-border)] md:pr-8">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-3 flex items-center gap-1.5">
                    <FileText size={12} /> Education
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="text-xs font-bold text-[var(--foreground)]">Bachelor of Computer Applications (BCA)</h5>
                      <p className="text-[11px] text-[var(--text-muted)] mt-0.5 font-medium">Specialization: AI &amp; Data Science</p>
                      <p className="text-[10px] text-primary font-semibold mt-1">SAGE University, Bhopal</p>
                      <p className="text-[9px] text-[var(--text-muted)] font-mono mt-0.5">Aug 2024 – May 2027 · 3rd Year</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-3 flex items-center gap-1.5">
                    <FileText size={12} /> Core Skills
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {["JavaScript", "TypeScript", "Python", "HTML/CSS", "React", "Node.js", "Next.js", "AWS", "Neo4j", "Git", "SQL", "OpenCV"].map((s) => (
                      <span key={s} className="text-[9px] font-mono px-2 py-0.5 bg-slate-100 dark:bg-slate-800/80 border border-[var(--card-border)] text-[var(--text-muted)] rounded-md font-semibold">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right column info */}
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-3 flex items-center gap-1.5">
                    <FileText size={12} /> Professional Summary
                  </h4>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    Creative Developer and BCA student (AI & Data Science) at SAGE University, Bhopal, with hands-on experience in full-stack web development, AI-assisted development, and cloud technologies. Hackathon participant with proven ability to deliver real-world projects through internships, freelance work, and a deployed portfolio.
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-3 flex items-center gap-1.5">
                    <FileText size={12} /> Experience
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <h5 className="text-xs font-bold text-[var(--foreground)]">HR Intern</h5>
                      <p className="text-[10px] text-primary font-semibold">Scratchly (SaaS/CRM Startup) · 3 Months · Bhopal</p>
                      <p className="text-[11px] text-[var(--text-muted)] mt-1">Managed recruitment workflows, candidate tracking, and contributed to startup operations.</p>
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-[var(--foreground)]">Web Developer Intern</h5>
                      <p className="text-[10px] text-primary font-semibold">Codec Technologies Pvt. Ltd. · 45 Days · Bhopal</p>
                      <p className="text-[11px] text-[var(--text-muted)] mt-1">AICTE & ICAC approved internship — built responsive UIs, debugged frontend, optimized UX.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-3 flex items-center gap-1.5">
                    <FileText size={12} /> Key Projects
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="text-xs font-bold text-[var(--foreground)] flex justify-between">
                        <span>AgriFuse — AI Agri-Tech Platform</span>
                        <span className="text-[9px] font-mono text-primary">Next.js, Python, AI</span>
                      </h5>
                      <p className="text-[11px] text-[var(--text-muted)] mt-1">
                        AI-powered platform connecting farmers with resources — crop disease detection, weather dashboard, market prediction.
                      </p>
                    </div>

                    <div>
                      <h5 className="text-xs font-bold text-[var(--foreground)] flex justify-between">
                        <span>Breedify — AI Breed Identifier</span>
                        <span className="text-[9px] font-mono text-primary">Python, OpenCV, AWS</span>
                      </h5>
                      <p className="text-[11px] text-[var(--text-muted)] mt-1">
                        Animal breed recognition via image analysis and ML — confidence scores, care guides, and breed catalog.
                      </p>
                    </div>

                    <div>
                      <h5 className="text-xs font-bold text-[var(--foreground)] flex justify-between">
                        <span>Web Apps — Freelance</span>
                        <span className="text-[9px] font-mono text-primary">JS, Node.js</span>
                      </h5>
                      <p className="text-[11px] text-[var(--text-muted)] mt-1">
                        Two client-facing apps with admin panels and complete booking flows — both live in production.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
