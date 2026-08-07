import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Folder, GitFork, Link2, Star } from "lucide-react";
import { Github } from "@/components/BrandIcons";
import { useTheme } from "./ThemeProvider";

interface Repo {
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
}

const BACKUP_REPOS: Repo[] = [
  {
    name: "AgriFuse",
    description: "AI-powered Smart Agriculture Platform. Features crop disease detection, weather dashboard, market price prediction, and carbon credit exchange.",
    html_url: "https://github.com/Suryansh-gour/AgriFuse",
    stargazers_count: 5,
    forks_count: 2,
    language: "Python"
  },
  {
    name: "Breedify",
    description: "Deep learning system for animal breed recognition and classification. Uses CNNs for species classifications and provides comprehensive care guidelines.",
    html_url: "https://github.com/Suryansh-gour/Breedify",
    stargazers_count: 4,
    forks_count: 1,
    language: "Python"
  },
  {
    name: "inventory-management",
    description: "SaaS inventory control and forecasting module. Includes real-time adjustments, transaction trails, and sales graphical analytics.",
    html_url: "https://github.com/Suryansh-gour/inventory-management",
    stargazers_count: 3,
    forks_count: 0,
    language: "JavaScript"
  },
  {
    name: "aws-cloud-projects",
    description: "A collection of configurations, serverless function routines, and templates from AWS cloud learning courses.",
    html_url: "https://github.com/Suryansh-gour",
    stargazers_count: 2,
    forks_count: 1,
    language: "Shell"
  }
];

interface GithubApiRepo {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  fork: boolean;
}

export default function GithubStats() {
  const { theme } = useTheme();
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await fetch("https://api.github.com/users/Suryansh-gour/repos?sort=updated&per_page=6");
        if (response.ok) {
          const data = (await response.json()) as GithubApiRepo[];
          // Filter out forks if there are enough original repos
          const filtered = data
            .filter((repo) => !repo.fork)
            .slice(0, 4)
            .map((repo) => ({
              name: repo.name,
              description: repo.description || "No description provided.",
              html_url: repo.html_url,
              stargazers_count: repo.stargazers_count,
              forks_count: repo.forks_count,
              language: repo.language || "Web"
            }));
          
          if (filtered.length > 0) {
            setRepos(filtered);
          } else {
            setRepos(BACKUP_REPOS);
          }
        } else {
          setRepos(BACKUP_REPOS);
        }
      } catch (error) {
        console.error("Error fetching GitHub repos:", error);
        setRepos(BACKUP_REPOS);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  // Theme queries for github-readme-stats (Transparent background matches dark/light themes)
  const titleColor = theme === "dark" ? "2563EB" : "0F172A"; // primary blue / dark text
  const iconColor = theme === "dark" ? "06B6D4" : "2563EB"; // accent cyan / primary blue
  const textColor = theme === "dark" ? "94A3B8" : "475569"; // muted text

  const statsUrl = `https://github-readme-stats.vercel.app/api?username=Suryansh-gour&show_icons=true&theme=transparent&title_color=${titleColor}&icon_color=${iconColor}&text_color=${textColor}&hide_border=true&locale=en`;
  const languagesUrl = `https://github-readme-stats.vercel.app/api/top-langs/?username=Suryansh-gour&layout=compact&theme=transparent&title_color=${titleColor}&icon_color=${iconColor}&text_color=${textColor}&hide_border=true&langs_count=6`;
  const streakUrl = `https://github-readme-streak-stats.herokuapp.com/?user=Suryansh-gour&theme=transparent&hide_border=true&currStreakNum=${titleColor}&sideNums=${textColor}&sideLabels=${textColor}&currStreakLabel=${iconColor}&dates=${textColor}`;

  return (
    <section id="github" className="py-20 relative px-6">
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />

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
            GitHub <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Activity</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: 80 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"
          />
        </div>

        {/* GitHub Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Embed Stats Cards */}
          <div className="lg:col-span-6 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -35 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="glass-panel p-6 rounded-3xl border border-[var(--card-border)] hover:border-primary/20 transition-all duration-300 shadow-lg flex flex-col items-center justify-center overflow-hidden"
            >
              <h3 className="text-sm font-bold font-heading mb-4 text-[var(--foreground)] uppercase tracking-wider self-start flex items-center gap-2">
                <Github size={16} /> User Stats
              </h3>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={statsUrl}
                alt="Suryansh Gour GitHub Stats"
                className="w-full h-auto max-w-md select-none pointer-events-none"
                loading="lazy"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -35 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="glass-panel p-6 rounded-3xl border border-[var(--card-border)] hover:border-primary/20 transition-all duration-300 shadow-lg flex flex-col items-center justify-center overflow-hidden"
            >
              <h3 className="text-sm font-bold font-heading mb-4 text-[var(--foreground)] uppercase tracking-wider self-start flex items-center gap-2">
                <Github size={16} /> Streak Records
              </h3>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={streakUrl}
                alt="Suryansh Gour GitHub Streak"
                className="w-full h-auto max-w-md select-none pointer-events-none"
                loading="lazy"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -35 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="glass-panel p-6 rounded-3xl border border-[var(--card-border)] hover:border-primary/20 transition-all duration-300 shadow-lg flex flex-col items-center justify-center overflow-hidden"
            >
              <h3 className="text-sm font-bold font-heading mb-4 text-[var(--foreground)] uppercase tracking-wider self-start flex items-center gap-2">
                <Github size={16} /> Language Breakdown
              </h3>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={languagesUrl}
                alt="Suryansh Gour Top Languages"
                className="w-full h-auto max-w-md select-none pointer-events-none"
                loading="lazy"
              />
            </motion.div>
          </div>

          {/* Right Column: Repositories List */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-heading text-[var(--foreground)] flex items-center gap-2">
                <Folder className="text-primary w-5 h-5" /> Repositories
              </h3>
              <a
                href="https://github.com/Suryansh-gour"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
              >
                View GitHub Profile <Link2 size={12} />
              </a>
            </div>

            {loading ? (
              // Loading Skeleton
              <div className="space-y-4">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="glass-panel p-6 rounded-2xl border border-[var(--card-border)] animate-pulse h-32" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {repos.map((repo, idx) => (
                  <motion.div
                    key={repo.name}
                    initial={{ opacity: 0, x: 35 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="glass-panel p-6 rounded-3xl border border-[var(--card-border)] hover:border-primary/30 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-bold font-heading text-[var(--foreground)] group-hover:text-primary transition-colors flex items-center gap-2">
                          <Folder size={14} className="text-primary" /> {repo.name}
                        </h4>
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-slate-500 hover:text-primary transition-colors cursor-pointer"
                        >
                          <Link2 size={12} />
                        </a>
                      </div>
                      <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-2">
                        {repo.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-6 pt-4 mt-4 border-t border-[var(--card-border)] text-xs font-mono text-[var(--text-muted)]">
                      <span className="flex items-center gap-1.5 font-semibold text-[var(--foreground)]">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                        {repo.language}
                      </span>
                      <span className="flex items-center gap-1 hover:text-yellow-500 transition-colors">
                        <Star size={12} /> {repo.stargazers_count}
                      </span>
                      <span className="flex items-center gap-1 hover:text-primary transition-colors">
                        <GitFork size={12} /> {repo.forks_count}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
