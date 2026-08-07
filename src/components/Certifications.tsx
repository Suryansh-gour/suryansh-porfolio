import React from "react";
import { motion } from "framer-motion";
import { Award, CheckCircle, ExternalLink } from "lucide-react";

interface Certificate {
  title: string;
  issuer: string;
  date: string;
  credentialId?: string;
  badgeColor: string;
  verifyLink: string;
}

const CERTIFICATES_DATA: Certificate[] = [
  {
    title: "Neo4j Certified Professional",
    issuer: "Neo4j",
    date: "2025",
    badgeColor: "from-blue-600 to-indigo-700",
    verifyLink: "https://neo4j.com/graphacademy/"
  },
  {
    title: "AWS Cloud Practitioner Essentials & Builder Labs",
    issuer: "AWS Skill Builder",
    date: "2025",
    badgeColor: "from-amber-500 to-orange-600",
    verifyLink: "https://skillbuilder.aws/"
  },
  {
    title: "Web App Development Training Certificate",
    issuer: "SAGE University, Bhopal",
    date: "2024",
    badgeColor: "from-cyan-500 to-blue-600",
    verifyLink: "https://github.com/Suryansh-gour"
  },
  {
    title: "Business Communication & Operations",
    issuer: "Infosys Springboard, Skillsoft & Cisco",
    date: "2024",
    badgeColor: "from-violet-500 to-purple-600",
    verifyLink: "https://github.com/Suryansh-gour"
  }
];

export default function Certifications() {
  return (
    <section id="certifications" className="py-20 bg-slate-900/30 relative px-6">
      {/* Decorative blurred background orb */}
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-secondary/5 rounded-full blur-3xl -z-10 pointer-events-none" />

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
            Certifications &amp; <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Badges</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: 80 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"
          />
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CERTIFICATES_DATA.map((cert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-panel p-6 rounded-3xl border border-[var(--card-border)] hover:border-primary/30 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Badge Visual Icon header */}
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${cert.badgeColor} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Award size={22} />
                </div>

                <h3 className="text-base font-bold font-heading text-[var(--foreground)] mb-2 group-hover:text-primary transition-colors">
                  {cert.title}
                </h3>
                
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  {cert.issuer}
                </p>
                
                <p className="text-[10px] text-[var(--text-muted)] font-mono mb-4">
                  Issued {cert.date}
                </p>

                {cert.credentialId && (
                  <div className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 w-fit border border-[var(--card-border)]">
                    <CheckCircle size={10} className="text-accent" />
                    <span className="text-[9px] font-mono text-[var(--text-muted)] font-medium">
                      ID: {cert.credentialId}
                    </span>
                  </div>
                )}
              </div>

              {/* Verify Link */}
              <div className="pt-6 mt-6 border-t border-[var(--card-border)]">
                <a
                  href={cert.verifyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider cursor-pointer"
                >
                  Verify Credential <ExternalLink size={10} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
