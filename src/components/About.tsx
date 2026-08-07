import React from "react";
import { motion } from "framer-motion";
import { BrainCircuit, Cloud, Code, GraduationCap } from "lucide-react";
import AnimatedCounter from "./AnimatedCounter";

const STATS = [
  { value: 3, label: "Projects Deployed", suffix: "+" },
  { value: 4, label: "Certifications", suffix: "+" },
  { value: 2, label: "Internships", suffix: "" },
  { value: 2, label: "Hackathons", suffix: "" },
];

const PILLARS = [
  {
    icon: <BrainCircuit className="w-6 h-6 text-accent" />,
    title: "AI & Data Science",
    description: "Applying AI-assisted development with tools like ChatGPT, Claude, GitHub Copilot, OpenCV, and Streamlit to build intelligent, real-world applications."
  },
  {
    icon: <Code className="w-6 h-6 text-primary" />,
    title: "Full Stack Development",
    description: "Building responsive frontends with React, Next.js, and Tailwind CSS, backed by Node.js, Vite, and SQL/NoSQL databases."
  },
  {
    icon: <Cloud className="w-6 h-6 text-secondary" />,
    title: "Cloud & Graph Databases",
    description: "AWS Cloud Practitioner Essentials graduate and Neo4j Certified Professional — exploring cloud infrastructure and graph-based data modeling."
  }
];

export default function About() {
  return (
    <section id="about" className="py-20 relative px-6 overflow-hidden">
      {/* Decorative Blur BG */}
      <div className="absolute top-1/2 left-full -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-extrabold font-heading text-[var(--foreground)] mb-4"
          >
            About <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Me</span>
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Tech Pillars & Cards */}
          <div className="lg:col-span-6 grid grid-cols-1 gap-6">
            {PILLARS.map((pillar, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="glass-panel p-6 rounded-2xl border border-[var(--card-border)] hover:border-primary/30 hover:shadow-lg transition-all duration-300 flex gap-4 group"
              >
                <div className="p-3.5 h-fit rounded-xl bg-slate-100 dark:bg-slate-800/80 group-hover:scale-110 transition-transform duration-300">
                  {pillar.icon}
                </div>
                <div>
                  <h3 className="text-lg font-heading font-semibold text-[var(--foreground)] mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Column: Bio & Counters */}
          <div className="lg:col-span-6 flex flex-col justify-between h-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <GraduationCap className="text-primary w-6 h-6" />
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">Education &amp; Background</span>
              </div>
              
              <h3 className="text-2xl font-bold font-heading text-[var(--foreground)] mb-4">
                Creative Developer Building Real-World Solutions
              </h3>
              
              <p className="text-[var(--text-muted)] text-base leading-relaxed mb-6">
                I am pursuing a <strong>BCA degree specializing in Artificial Intelligence and Data Science</strong> at <strong>SAGE University, Bhopal</strong> (Aug 2024 – May 2027). I am a creative developer with hands-on experience in full-stack web development, AI-assisted tooling, and cloud technologies.
              </p>
              
              <p className="text-[var(--text-muted)] text-base leading-relaxed mb-8">
                From interning at a SaaS startup and a government-approved web development firm, to competing in national hackathons and serving as an <strong>AWS User Group Campus Ambassador</strong> — I focus on delivering projects that solve real problems. I have freelanced, built deployed applications, and hold certifications from Neo4j, AWS, and Infosys.
              </p>
            </motion.div>

            {/* Counters Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-[var(--card-border)]">
              {STATS.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="text-center sm:text-left"
                >
                  <div className="text-3xl font-bold font-heading bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-1">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs text-[var(--text-muted)] font-medium leading-tight uppercase tracking-wider">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
