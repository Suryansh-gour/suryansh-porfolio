import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const STATUS_TEXTS = [
  "Initializing portfolio...",
  "Loading AI & Data Science modules...",
  "Spinning up AWS instances...",
  "Compiling Full Stack resources...",
  "Optimizing layout design...",
  "Welcome!"
];

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // Lock scrolling during loading
    document.body.style.overflow = "hidden";

    // Progress counter animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsFinished(true);
          setTimeout(() => {
            document.body.style.overflow = "";
            onComplete();
          }, 600); // Small delay to let the fade out happen
          return 100;
        }
        // Increment progress by a random amount to make it feel natural
        const increment = Math.floor(Math.random() * 8) + 2;
        return Math.min(prev + increment, 100);
      });
    }, 80);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = "";
    };
  }, [onComplete]);

  // Rotate status texts
  useEffect(() => {
    if (progress < 20) setStatusIndex(0);
    else if (progress < 40) setStatusIndex(1);
    else if (progress < 60) setStatusIndex(2);
    else if (progress < 80) setStatusIndex(3);
    else if (progress < 95) setStatusIndex(4);
    else setStatusIndex(5);
  }, [progress]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          className="fixed inset-0 bg-[#0F172A] flex flex-col items-center justify-center text-white"
          style={{ zIndex: 9999 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {/* Logo / Monogram */}
          <div className="mb-8 relative flex items-center justify-center">
            <motion.div
              className="w-20 h-20 rounded-2xl border-2 border-primary flex items-center justify-center text-3xl font-bold font-heading text-cyan-400 relative z-10"
              initial={{ scale: 0.8, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              SG
            </motion.div>
            <motion.div
              className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>

          {/* Loading Bar Container */}
          <div className="w-64 md:w-80 h-1 bg-slate-800 rounded-full overflow-hidden mb-4 relative">
            <motion.div
              className="h-full bg-gradient-to-r from-primary via-secondary to-accent"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeInOut" }}
            />
          </div>

          {/* Progress Percent */}
          <motion.div
            className="text-4xl font-extrabold font-heading text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent mb-2"
            key={progress}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
          >
            {progress}%
          </motion.div>

          {/* Changing Status Text */}
          <motion.div
            className="text-sm text-slate-400 font-mono tracking-wider h-5 flex items-center"
            key={statusIndex}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 0.8, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            {STATUS_TEXTS[statusIndex]}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
