import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";

interface Project {
  title: string;
  category: "AI & Data Science" | "Full Stack";
  image: string;
  description: string;
  features?: string[];
  tags: string[];
  github: string;
  demo: string;
}

const PROJECTS_DATA: Project[] = [
  {
    title: "AgriFuse",
    category: "AI & Data Science",
    image: "/agrifuse.jpg",
    description: "An AI-powered Smart Agriculture Platform designed to empower farmers. It integrates advanced machine learning models with accessible web interfaces to optimize agricultural yield and promote sustainability.",
    features: [
      "Crop Disease Detection via Computer Vision",
      "Interactive Weather Forecasting Dashboard",
      "Market Crop Price Prediction using Time-Series Analysis",
      "Decentralized Carbon Credit Exchange system"
    ],
    tags: ["Next.js", "React", "Python", "FastAPI", "Tailwind CSS", "MongoDB"],
    github: "https://github.com/Suryansh-gour/AgriFuse",
    demo: "https://agrifuse-smart.vercel.app"
  },
  {
    title: "Breedify",
    category: "AI & Data Science",
    image: "/breedify.jpg",
    description: "An intelligent animal breed classification and recognition system. It leverages convolutional neural network (CNN) architectures to parse uploaded images of pets, returning breeds, confidence scores, and detailed care guides.",
    features: [
      "Convolutional Neural Network (CNN) Classifier",
      "Dynamic scan border overlay with canvas matching",
      "Detailed breed characteristics & care recommendations",
      "Searchable catalog of international dog & cat breeds"
    ],
    tags: ["Next.js", "React 19", "Python", "TensorFlow", "FastAPI", "Tailwind CSS"],
    github: "https://github.com/Suryansh-gour/Breedify",
    demo: "https://breedify-ai.vercel.app"
  },
  {
    title: "Inventory Management System",
    category: "Full Stack",
    image: "/inventory.jpg",
    description: "A professional corporate Inventory Tracking Suite. It features real-time inventory adjustments, suppliers transaction logs, product categorization, and interactive sales visualization indicators.",
    features: [
      "Real-time stock level counters & alert triggers",
      "Predictive analytics for replenishment schedules",
      "Comprehensive supplier logs & transaction database",
      "Responsive analytics graphs using Chart.js/Recharts"
    ],
    tags: ["Next.js", "React", "Node.js", "Express.js", "MongoDB", "Mongoose"],
    github: "https://github.com/Suryansh-gour/inventory-management",
    demo: "https://inventory-suite-sys.vercel.app"
  }
];

const CATEGORIES = ["All", "AI & Data Science", "Full Stack"] as const;

export default function Projects() {
  const [filter, setFilter] = useState<typeof CATEGORIES[number]>("All");

  const filteredProjects = PROJECTS_DATA.filter((p) => {
    if (filter === "All") return true;
    return p.category === filter;
  });

  return (
    <section id="projects" className="py-20 relative px-6">
      {/* Decorative Blur */}
      <div className="absolute top-1/3 right-full translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-extrabold font-heading text-[var(--foreground)] mb-4"
          >
            Featured <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Projects</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: 80 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-1 bg-gradient-to-r from-primary via-secondary to-accent mx-auto rounded-full mb-8"
          />

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center items-center gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  filter === cat
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--text-muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid Layout */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                layout
                key={project.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="glass-panel rounded-3xl overflow-hidden border border-[var(--card-border)] hover:border-primary/30 hover:shadow-2xl transition-all duration-300 flex flex-col group h-full"
              >
                {/* Image Container with Hover Zoom */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-950/20">
                  <img
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent opacity-60 pointer-events-none" />
                  
                  {/* Category Pill Tag inside Image */}
                  <span className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-[var(--foreground)] border border-white/10 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    {project.category}
                  </span>
                </div>

                {/* Card Info Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold font-heading text-[var(--foreground)] group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                      {project.description}
                    </p>

                    {/* Features list if defined */}
                    {project.features && (
                      <ul className="text-[11px] text-[var(--text-muted)] font-medium space-y-1.5 list-disc pl-4 opacity-90">
                        {project.features.map((feat, i) => (
                          <li key={i}>{feat}</li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Tech stack and Action Buttons */}
                  <div className="pt-6 mt-6 border-t border-[var(--card-border)] space-y-4">
                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 dark:bg-slate-800/80 text-[var(--text-muted)] rounded-md border border-[var(--card-border)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Links Buttons */}
                    <div className="flex items-center gap-4">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-xs font-semibold text-[var(--foreground)] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <Github size={14} /> GitHub
                      </a>
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/95 hover:shadow-md hover:shadow-primary/10 transition-all cursor-pointer"
                      >
                        <ExternalLink size={14} /> Live Demo
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
