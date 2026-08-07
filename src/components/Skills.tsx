import React from "react";
import { motion } from "framer-motion";
import { Cloud, Code2, Database, Laptop } from "lucide-react";

interface SkillItem {
  name: string;
  level: number;
}

interface SkillCategory {
  title: string;
  icon: React.ReactNode;
  skills: SkillItem[];
}

const SKILL_DATA: SkillCategory[] = [
  {
    title: "Programming & Web",
    icon: <Code2 className="w-5 h-5 text-primary" />,
    skills: [
      { name: "JavaScript", level: 90 },
      { name: "TypeScript", level: 78 },
      { name: "Python (basics)", level: 72 },
      { name: "HTML / CSS", level: 95 },
      { name: "SQL", level: 80 },
      { name: "Bootstrap", level: 85 },
    ]
  },
  {
    title: "Frameworks & Platforms",
    icon: <Laptop className="w-5 h-5 text-accent" />,
    skills: [
      { name: "React", level: 82 },
      { name: "Node.js", level: 85 },
      { name: "Next.js", level: 80 },
      { name: "Vite", level: 78 },
      { name: "Git (Branching, Merging)", level: 88 },
    ]
  },
  {
    title: "AI & Data Tools",
    icon: <Database className="w-5 h-5 text-secondary" />,
    skills: [
      { name: "OpenCV", level: 72 },
      { name: "Pandas", level: 70 },
      { name: "Streamlit", level: 68 },
      { name: "Tkinter", level: 65 },
      { name: "GitHub Copilot / Claude / ChatGPT", level: 92 },
    ]
  },
  {
    title: "Cloud & Databases",
    icon: <Cloud className="w-5 h-5 text-emerald-400" />,
    skills: [
      { name: "AWS (Cloud Practitioner Essentials)", level: 78 },
      { name: "Neo4j (Graph Database)", level: 75 },
      { name: "Vercel / Netlify", level: 88 },
      { name: "MySQL / SQL", level: 80 },
    ]
  }
];

export default function Skills() {
  return (
    <section id="skills" className="py-20 bg-slate-900/30 relative px-6">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-secondary/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />

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
            My <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Skills</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: 80 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-1 bg-gradient-to-r from-primary via-secondary to-accent mx-auto rounded-full"
          />
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SKILL_DATA.map((category, catIndex) => (
            <motion.div
              key={catIndex}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: catIndex * 0.15 }}
              className="glass-panel p-6 sm:p-8 rounded-3xl border border-[var(--card-border)] hover:border-primary/20 transition-all duration-300 shadow-xl"
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80">
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold font-heading text-[var(--foreground)]">
                  {category.title}
                </h3>
              </div>

              {/* Category Skills */}
              <div className="space-y-5">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex} className="space-y-2">
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span className="text-[var(--foreground)] font-semibold">{skill.name}</span>
                      <span className="text-primary font-mono">{skill.level}%</span>
                    </div>

                    {/* Progress Bar Container */}
                    <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-800/80 rounded-full overflow-hidden relative">
                      <motion.div
                        className="h-full bg-gradient-to-r from-primary via-secondary to-accent rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
