import React, { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { BookOpen, Briefcase, Calendar, MapPin, Trophy, Users } from "lucide-react";

interface TimelineItem {
  type: "internship" | "training" | "hackathon" | "volunteer";
  role: string;
  organization: string;
  location: string;
  duration: string;
  description: string[];
  icon: React.ReactNode;
}

const TIMELINE_DATA: TimelineItem[] = [
  {
    type: "internship",
    role: "HR Intern",
    organization: "Scratchly (SaaS/CRM Startup)",
    location: "Bhopal, MP",
    duration: "3 Months",
    icon: <Briefcase className="w-5 h-5" />,
    description: [
      "Managed candidate follow-ups, screening communication, and selection coordination on behalf of the HR team.",
      "Contributed to content planning, audience engagement, and startup operations in a fast-paced early-stage environment.",
      "Maintained candidate tracking data and supported end-to-end recruitment workflow across multiple hiring rounds."
    ]
  },
  {
    type: "internship",
    role: "Web Developer Intern",
    organization: "Codec Technologies Pvt. Ltd.",
    location: "Bhopal, MP",
    duration: "45 Days",
    icon: <BookOpen className="w-5 h-5" />,
    description: [
      "Completed a 45-day AICTE & ICAC Approved Web Development Internship focused on practical web application development.",
      "Developed responsive web interfaces using HTML, CSS, JavaScript, and modern web development practices.",
      "Worked on frontend development, debugging, and UI optimization to improve user experience."
    ]
  },
  {
    type: "hackathon",
    role: "Navonmesh 2026 — Binary Battle",
    organization: "Scope Global Skills University & AIC-RNTU Foundation",
    location: "Software Hackathon",
    duration: "15 March 2026",
    icon: <Trophy className="w-5 h-5" />,
    description: [
      "Participated in Binary Battle, a software-focused hackathon organized jointly by Scope Global Skills University and AIC-RNTU Foundation.",
      "Awarded Certificate of Participation for delivering a working prototype under competition constraints."
    ]
  },
  {
    type: "hackathon",
    role: "Zinnovatio 3.0 — Gen-Z Hackathon",
    organization: "Dept. of CSE, Chandigarh University · Powered by byteXL",
    location: "National Level",
    duration: "1 Nov 2025",
    icon: <Trophy className="w-5 h-5" />,
    description: [
      "Competed in a national-level Gen-Z hackathon organized by Chandigarh University's CSE department powered by byteXL.",
      "Awarded Certificate of Participation for innovative solution development and presentation."
    ]
  },
  {
    type: "volunteer",
    role: "Campus Ambassador",
    organization: "AWS User Group, SAGE University Bhopal",
    location: "SAGE University, Bhopal",
    duration: "Ongoing",
    icon: <Users className="w-5 h-5" />,
    description: [
      "Led campus outreach, engagement, and coordination as the official AWS User Group Campus Ambassador at SAGE University.",
      "Represented the AWS program across the campus, organizing awareness sessions and connecting students with cloud learning resources."
    ]
  }
];

export default function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress for drawing the vertical line
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <section id="experience" className="py-20 relative px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-extrabold font-heading text-[var(--foreground)] mb-4"
          >
            My <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Journey</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: 80 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"
          />
        </div>

        {/* Timeline Container */}
        <div ref={containerRef} className="relative max-w-4xl mx-auto">
          {/* Vertical Line representing progress */}
          <motion.div
            className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-slate-200 dark:bg-slate-800 origin-top rounded-full hidden md:block"
            style={{ scaleY, translateX: "-50%" }}
          />

          {/* Simple static background line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-slate-100 dark:bg-slate-800/80 transform md:-translate-x-1/2" />

          {/* Timeline Nodes */}
          <div className="space-y-12 md:space-y-16">
            {TIMELINE_DATA.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={`exp-${index}`}

                  className="flex flex-col md:flex-row items-stretch relative"
                >
                  {/* Left Column (empty or holds card based on side) */}
                  <div className={`flex-1 hidden md:block pr-12 text-right ${isEven ? "" : "order-3"}`}>
                    {isEven && (
                      <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.5 }}
                      >
                        <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-primary mb-2">
                          <Calendar size={12} /> {item.duration}
                        </span>
                        <h4 className="text-sm font-heading font-semibold text-slate-500 dark:text-slate-400">
                          {item.organization}
                        </h4>
                        <span className="text-[10px] text-[var(--text-muted)] flex items-center justify-end gap-1 mt-1">
                          <MapPin size={10} /> {item.location}
                        </span>
                      </motion.div>
                    )}
                  </div>

                  {/* Icon Node Center */}
                  <div className="absolute left-4 md:left-1/2 top-0 transform -translate-y-2 md:-translate-x-1/2 flex items-center justify-center z-10">
                    <motion.div
                      initial={{ scale: 0.6, rotate: -45 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                      className={`w-10 h-10 rounded-full border border-[var(--card-border)] bg-[var(--background)] flex items-center justify-center shadow-lg text-primary ${
                        item.type === "internship" ? "text-primary border-primary/30" : 
                        item.type === "training" ? "text-secondary border-secondary/30" : 
                        item.type === "hackathon" ? "text-accent border-accent/30" : "text-emerald-400 border-emerald-400/30"
                      }`}
                    >
                      {item.icon}
                    </motion.div>
                  </div>

                  {/* Right Column (holds card or details) */}
                  <div className={`flex-1 pl-16 md:pl-12 ${isEven ? "order-3" : ""}`}>
                    <motion.div
                      initial={{ opacity: 0, x: isEven ? 30 : -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.5 }}
                      className="glass-panel p-6 rounded-3xl border border-[var(--card-border)] hover:border-primary/20 transition-all duration-300 shadow-lg"
                    >
                      {/* Mobile Header Info */}
                      <div className="md:hidden mb-4">
                        <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-primary mb-1">
                          <Calendar size={12} /> {item.duration}
                        </span>
                        <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                          {item.organization}
                        </h4>
                        <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1 mt-1">
                          <MapPin size={10} /> {item.location}
                        </span>
                      </div>

                      {/* Desktop Content Header */}
                      <span className={`inline-block text-[10px] font-bold tracking-wider px-3 py-1 rounded-full uppercase mb-3 ${
                        item.type === "internship" ? "bg-primary/10 text-primary border border-primary/25" :
                        item.type === "training" ? "bg-secondary/10 text-secondary border border-secondary/25" :
                        item.type === "hackathon" ? "bg-accent/10 text-accent border border-accent/25" :
                        "bg-emerald-400/10 text-emerald-400 border border-emerald-400/25"
                      }`}>
                        {item.type}
                      </span>
                      
                      <h3 className="text-lg font-bold font-heading text-[var(--foreground)] mb-3">
                        {item.role}
                      </h3>

                      {!isEven && (
                        <div className="hidden md:block mb-3">
                          <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                            {item.organization}
                          </h4>
                          <div className="flex gap-4 text-[10px] text-[var(--text-muted)] mt-1.5 font-mono">
                            <span className="flex items-center gap-1"><Calendar size={10} /> {item.duration}</span>
                            <span className="flex items-center gap-1"><MapPin size={10} /> {item.location}</span>
                          </div>
                        </div>
                      )}

                      {/* Bullets List */}
                      <ul className="space-y-2 text-xs text-[var(--text-muted)] leading-relaxed pl-4 list-disc">
                        {item.description.map((bullet, i) => (
                          <li key={i}>{bullet}</li>
                        ))}
                      </ul>
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
