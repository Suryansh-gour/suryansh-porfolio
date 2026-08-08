import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Check, Copy, Mail, MapPin, Send, Share2 } from "lucide-react";
import { Github, Linkedin } from "@/components/BrandIcons";
import confetti from "canvas-confetti";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  website?: string; // honeypot
}

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormData>();

  const copyEmail = () => {
    navigator.clipboard.writeText("goursuryansh51@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone ?? "",
          subject: data.subject,
          message: data.message,
          website: data.website ?? ""
        })
      });

      if (response.ok) {
        setSubmitStatus("success");
        triggerConfetti();
        reset();
      } else {
        setSubmitStatus("error");
      }
    } catch (err) {
      console.error("Contact form error:", err);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 },
      colors: ["#2563EB", "#7C3AED", "#06B6D4"]
    });
  };

  return (
    <section id="contact" className="py-20 bg-slate-900/30 relative px-6">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-full -translate-x-1/2 w-80 h-80 bg-accent/5 rounded-full blur-3xl -z-10 pointer-events-none" />

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
            Get In <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Touch</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: 80 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"
          />
        </div>

        {/* Contact Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left Column: Coordinates & Map */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="glass-panel p-8 rounded-3xl border border-[var(--card-border)] hover:border-primary/20 transition-all duration-300 shadow-xl flex-1 flex flex-col justify-between"
            >
              <div className="space-y-6">
                <h3 className="text-2xl font-bold font-heading text-[var(--foreground)]">Contact Details</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Have an exciting project, internship opportunity, or question? Drop me a line, and I will get back to you as soon as possible.
                </p>

                <div className="space-y-4">
                  {/* Email row */}
                  <div className="flex items-center gap-4 group">
                    <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-primary">
                      <Mail size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)]">Email Me</p>
                      <button
                        onClick={copyEmail}
                        className="text-xs font-semibold text-[var(--foreground)] hover:text-primary transition-colors flex items-center gap-2 truncate cursor-pointer"
                      >
                        goursuryansh51@gmail.com
                        {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      </button>
                    </div>
                  </div>

                  {/* Location row */}
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-secondary">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)]">Location</p>
                      <p className="text-xs font-semibold text-[var(--foreground)]">
                        SAGE University, Bhopal, MP, India
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social links drawer inside details */}
              <div className="pt-6 mt-8 border-t border-[var(--card-border)]">
                <div className="flex items-center gap-3">
                  <Share2 className="text-accent w-4 h-4" />
                  <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Social Platforms</span>
                </div>
                <div className="flex items-center gap-4 mt-3">
                  <a href="https://github.com/Suryansh-gour" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/85 hover:text-primary transition-colors cursor-pointer"><Github size={16} /></a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/85 hover:text-primary transition-colors cursor-pointer"><Linkedin size={16} /></a>
                </div>
              </div>
            </motion.div>

            {/* Google Map Container with dark-friendly styled iframe placeholder */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="h-60 rounded-3xl overflow-hidden border border-[var(--card-border)] relative shadow-lg"
            >
              {/* Using a clean embed from google maps centered in Bhopal, MP */}
              <iframe
                title="Bhopal Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117290.41372545803!2d77.34808383921867!3d23.25992985161047!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397c428f17d75c85%3A0xb6d5930068b5a037!2sBhopal%2C%20Madhya%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "grayscale(1) invert(0.9) contrast(1.2)" }}
                allowFullScreen={false}
                loading="lazy"
              />
            </motion.div>
          </div>

          {/* Right Column: React Hook Form Container */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="glass-panel p-8 rounded-3xl border border-[var(--card-border)] hover:border-primary/20 transition-all duration-300 shadow-xl h-full flex flex-col justify-between"
            >
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <h3 className="text-2xl font-bold font-heading text-[var(--foreground)]">Send Message</h3>

                {/* Name */}
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-mono text-[var(--text-muted)] font-semibold uppercase tracking-wider">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    {...register("name", { required: "Name is required" })}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 rounded-xl border border-[var(--card-border)] bg-[var(--background)] text-sm text-[var(--foreground)] placeholder-slate-500 focus:outline-none focus:border-primary transition-colors"
                  />
                  {errors.name && <span className="text-[10px] text-red-500 font-semibold">{errors.name.message}</span>}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-mono text-[var(--text-muted)] font-semibold uppercase tracking-wider">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" }
                    })}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded-xl border border-[var(--card-border)] bg-[var(--background)] text-sm text-[var(--foreground)] placeholder-slate-500 focus:outline-none focus:border-primary transition-colors"
                  />
                  {errors.email && <span className="text-[10px] text-red-500 font-semibold">{errors.email.message}</span>}
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label htmlFor="phone" className="text-xs font-mono text-[var(--text-muted)] font-semibold uppercase tracking-wider">Phone Number</label>
                  <input
                    id="phone"
                    type="tel"
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: { value: /^[+0-9()\-\s]{7,20}$/, message: "Enter a valid phone number" }
                    })}
                    placeholder="+91 90000 00000"
                    className="w-full px-4 py-3 rounded-xl border border-[var(--card-border)] bg-[var(--background)] text-sm text-[var(--foreground)] placeholder-slate-500 focus:outline-none focus:border-primary transition-colors"
                  />
                  {errors.phone && <span className="text-[10px] text-red-500 font-semibold">{errors.phone.message}</span>}
                </div>

                {/* Honeypot (hidden from humans, catches bots) */}
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  {...register("website")}
                  className="hidden"
                />

                {/* Subject */}
                <div className="space-y-1.5">
                  <label htmlFor="subject" className="text-xs font-mono text-[var(--text-muted)] font-semibold uppercase tracking-wider">Subject</label>
                  <input
                    id="subject"
                    type="text"
                    {...register("subject", { required: "Subject is required" })}
                    placeholder="Enter message subject"
                    className="w-full px-4 py-3 rounded-xl border border-[var(--card-border)] bg-[var(--background)] text-sm text-[var(--foreground)] placeholder-slate-500 focus:outline-none focus:border-primary transition-colors"
                  />
                  {errors.subject && <span className="text-[10px] text-red-500 font-semibold">{errors.subject.message}</span>}
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label htmlFor="message" className="text-xs font-mono text-[var(--text-muted)] font-semibold uppercase tracking-wider">Your Message</label>
                  <textarea
                    id="message"
                    rows={5}
                    {...register("message", { required: "Message content is required" })}
                    placeholder="Describe your project or inquiry..."
                    className="w-full px-4 py-3 rounded-xl border border-[var(--card-border)] bg-[var(--background)] text-sm text-[var(--foreground)] placeholder-slate-500 focus:outline-none focus:border-primary transition-colors resize-none"
                  />
                  {errors.message && <span className="text-[10px] text-red-500 font-semibold">{errors.message.message}</span>}
                </div>

                {/* Submit Trigger */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-primary via-secondary to-accent text-white font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/30 transform hover:-translate-y-0.5 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isSubmitting ? (
                    <>Sending...</>
                  ) : (
                    <>
                      Send Message <Send size={14} />
                    </>
                  )}
                </button>

                {/* Status Messages */}
                {submitStatus === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-semibold rounded-xl text-center"
                  >
                    Your message was sent successfully!
                  </motion.div>
                )}
                {submitStatus === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-semibold rounded-xl text-center"
                  >
                    An error occurred. Please try again later.
                  </motion.div>
                )}
              </form>
            </motion.div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
