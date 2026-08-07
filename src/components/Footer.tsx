import React from "react";
import { Heart } from "lucide-react";
import { Github, Instagram, Linkedin } from "@/components/BrandIcons";

export default function Footer() {
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 80,
        behavior: "smooth"
      });
    }
  };

  return (
    <footer className="border-t border-[var(--card-border)] bg-slate-950/20 backdrop-blur-md py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Logo and signature */}
        <div className="flex flex-col items-center md:items-start gap-1">
          <a
            href="#home"
            onClick={(e) => handleScrollTo(e, "home")}
            className="font-heading font-bold text-lg tracking-wider bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent cursor-pointer"
          >
            Suryansh.gour
          </a>
          <span className="text-[10px] text-[var(--text-muted)] font-medium">
            BCA Student | AI &amp; Data Science | AWS Learner
          </span>
        </div>

        {/* Quick links menu */}
        <nav>
          <ul className="flex flex-wrap justify-center items-center gap-6 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            {["home", "about", "skills", "projects", "certifications", "experience", "resume", "contact"].map((section) => (
              <li key={section}>
                <a
                  href={`#${section}`}
                  onClick={(e) => handleScrollTo(e, section)}
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  {section}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Social and copyright */}
        <div className="flex flex-col items-center md:items-end gap-2.5">
          <div className="flex items-center gap-4">
            <a href="https://github.com/Suryansh-gour" target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-primary transition-colors cursor-pointer"><Github size={16} /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-primary transition-colors cursor-pointer"><Linkedin size={16} /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-primary transition-colors cursor-pointer"><Instagram size={16} /></a>
          </div>
          
          <div className="text-[10px] text-[var(--text-muted)] font-mono flex items-center gap-1">
            <span>&copy; 2026 Suryansh Gour. Built with</span>
            <Heart size={10} className="text-red-500 fill-red-500 animate-pulse" />
            <span>in Next.js</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
