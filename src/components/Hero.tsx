import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { ArrowUpRight, Download, Github, Linkedin, MessageSquare } from "lucide-react";

// LeetCode Icon component as SVG
const LeetCodeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M13.483 0a1.374 1.374 0 0 0-.961.414l-7.904 7.9a1.379 1.379 0 0 0 .185 2.11l.224.162c.165.12.39.12.554-.002l6.23-4.67a1.378 1.378 0 0 1 2.015.344L18.44 14.1a1.378 1.378 0 0 1-.22 1.637l-4.7 4.7a1.378 1.378 0 0 1-1.93.023L5.42 14.3a1.378 1.378 0 0 1-.02-1.933l1.83-1.83a.35.35 0 0 0-.25-.6h-3.48a1.378 1.378 0 0 0-1.378 1.38v3.48a1.378 1.378 0 0 0 .4 1.03l8.53 8.53a1.378 1.378 0 0 0 1.95 0l8.53-8.53a1.378 1.378 0 0 0 0-1.95l-8.53-8.53A1.374 1.374 0 0 0 13.483 0z" />
  </svg>
);

const TYPING_PHRASES = [
  "BCA Student (AI & Data Science)",
  "Creative Developer",
  "Full Stack Web Developer",
  "AWS Cloud Learner",
  "Hackathon Participant"
];

export default function Hero() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Typing effect parameters
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentPhrase = TYPING_PHRASES[phraseIndex];
    
    const tick = () => {
      if (!isDeleting) {
        setDisplayedText(currentPhrase.substring(0, displayedText.length + 1));
        if (displayedText === currentPhrase) {
          // Wait before starting deletion
          timer = setTimeout(() => setIsDeleting(true), 2000);
          return;
        }
      } else {
        setDisplayedText(currentPhrase.substring(0, displayedText.length - 1));
        if (displayedText === "") {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % TYPING_PHRASES.length);
          return;
        }
      }
      
      const speed = isDeleting ? 40 : 80;
      timer = setTimeout(tick, speed);
    };

    timer = setTimeout(tick, 100);

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, phraseIndex]);

  // Mouse 3D tilt variables for the avatar card
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-300, 300], [15, -15]);
  const rotateY = useTransform(x, [-300, 300], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 80,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden px-6"
    >
      {/* Decorative Radial Gradients for Premium Look */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-20 pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[450px] h-[450px] bg-secondary/10 rounded-full blur-3xl -z-20 pointer-events-none animate-pulse-slow" style={{ animationDelay: "2s" }} />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Content Column */}
        <div className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left order-2 lg:order-1">
          {/* Welcome Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="self-center lg:self-start inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-wider mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            BCA Student &amp; AWS Campus Ambassador
          </motion.div>

          {/* Name Header */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-heading tracking-tight mb-4 text-[var(--foreground)]"
          >
            Hi, I&apos;m{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Suryansh Gour
            </span>
          </motion.h1>

          {/* Typing Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="h-10 text-xl md:text-2xl font-mono text-[var(--text-muted)] mb-3 flex items-center justify-center lg:justify-start"
          >
            <span>{displayedText}</span>
            <span className="ml-1 w-2 h-5 bg-accent inline-block animate-pulse" />
          </motion.div>

          {/* SAGE University Details */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-sm text-slate-500 dark:text-slate-400 font-medium tracking-wide mb-8 max-w-xl self-center lg:self-start"
          >
            Pursuing BCA in Artificial Intelligence &amp; Data Science at{" "}
            <span className="text-secondary dark:text-cyan-400 font-semibold">SAGE University, Bhopal</span>.
            Full-stack developer, hackathon participant, and AWS Campus Ambassador.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-10"
          >
            <button
              onClick={() => handleScrollTo("contact")}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-primary/30 transform hover:-translate-y-0.5 transition-all text-sm duration-200 cursor-pointer"
            >
              Contact Me <MessageSquare size={16} />
            </button>
            <button
              onClick={() => handleScrollTo("projects")}
              className="px-8 py-3.5 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] hover:bg-slate-100 dark:hover:bg-slate-800 text-[var(--foreground)] font-semibold flex items-center gap-2 transform hover:-translate-y-0.5 transition-all text-sm duration-200 cursor-pointer"
            >
              View Projects <ArrowUpRight size={16} />
            </button>
            <a
              href="/resume.pdf"
              download
              className="px-8 py-3.5 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary dark:text-cyan-400 font-semibold flex items-center gap-2 transform hover:-translate-y-0.5 transition-all text-sm duration-200 cursor-pointer"
            >
              Resume <Download size={16} />
            </a>
          </motion.div>

          {/* Social Icons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex items-center justify-center lg:justify-start gap-5"
          >
            <a
              href="https://github.com/Suryansh-gour"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary transition-all duration-200 cursor-pointer"
              title="GitHub"
            >
              <Github size={20} />
            </a>
            <a
              href="https://linkedin.com/in/suryansh-gour"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary transition-all duration-200 cursor-pointer"
              title="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="https://leetcode.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary transition-all duration-200 cursor-pointer flex items-center justify-center"
              title="LeetCode"
            >
              <LeetCodeIcon className="w-5 h-5" />
            </a>
          </motion.div>
        </div>

        {/* Right Columns: Animated Image / Avatar Frame */}
        <div className="lg:col-span-5 flex justify-center order-1 lg:order-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 80 }}
            className="relative"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 via-secondary/20 to-accent/30 rounded-3xl blur-2xl transform scale-95 pointer-events-none -z-10 animate-pulse-slow" />

            {/* Main Image Frame (Glassmorphism card representation) */}
            <div
              className="w-72 h-80 sm:w-80 sm:h-96 md:w-96 md:h-[420px] rounded-3xl p-3 glass-panel border border-[var(--card-border)] flex flex-col justify-between shadow-2xl relative overflow-hidden group select-none"
              style={{ transform: "translateZ(30px)" }}
            >
              {/* Card Accent Lines */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary to-accent opacity-20 blur-xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-secondary to-accent opacity-20 blur-xl pointer-events-none" />

              {/* Graphic Node Network Grid inside Card */}
              <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

              {/* Top Details */}
              <div className="flex justify-between items-center text-xs font-mono text-[var(--text-muted)] tracking-wider">
                <span>[surya_gour]</span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  ONLINE
                </span>
              </div>

              {/* Profile Photo */}
              <div className="flex-1 flex flex-col items-center justify-center relative py-2 overflow-hidden">
                {/* Subtle glow ring behind photo */}
                <div className="absolute w-52 h-52 rounded-full bg-gradient-to-tr from-primary/30 via-secondary/20 to-accent/30 blur-2xl pointer-events-none" />

                {/* Photo */}
                <div className="relative w-44 h-44 sm:w-52 sm:h-52 md:w-56 md:h-56 rounded-2xl overflow-hidden border-2 border-primary/30 shadow-xl shadow-primary/20 z-10">
                  <img
                    src="/suryansh.jpg"
                    alt="Suryansh Gour"
                    className="absolute inset-0 h-full w-full object-cover object-top"
                  />
                  {/* Subtle gradient overlay at bottom for depth */}
                  <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-slate-950/60 to-transparent pointer-events-none" />
                </div>

                {/* Technical Coordinates overlay */}
                <div className="absolute bottom-4 left-4 font-mono text-[9px] text-[var(--text-muted)] leading-tight opacity-75">
                  <div>LAT: 23.2599° N</div>
                  <div>LON: 77.4126° E</div>
                  <div>LOC: BHOPAL, IN</div>
                </div>
                
                <div className="absolute bottom-4 right-4 font-mono text-[9px] text-[var(--text-muted)] leading-tight text-right opacity-75">
                  <div>SYS: NODE_v20</div>
                  <div>DB: MONGODB</div>
                  <div>CLOUD: AWS_EC2</div>
                </div>
              </div>

              {/* Bottom Tag */}
              <div 
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border border-primary/15 flex items-center justify-between text-xs font-mono font-medium text-[var(--foreground)]"
                style={{ transform: "translateZ(10px)" }}
              >
                <span>STUDENT &amp; CREATOR</span>
                <span className="text-accent">&lt;/&gt;</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
