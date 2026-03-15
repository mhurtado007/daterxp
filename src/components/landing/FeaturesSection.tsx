"use client";

import { motion } from "framer-motion";
import { Zap, Flame, Trophy, BookOpen, Target, Users } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Expert Courses",
    description:
      "Structured lessons on confidence, conversation, body language, and first dates — all designed by dating coaches.",
    color: "#ff1a1a",
  },
  {
    icon: Zap,
    title: "Earn XP & Level Up",
    description:
      "Every lesson you complete earns XP. Level up from Newcomer to Legend as your dating skills grow.",
    color: "#ff6600",
  },
  {
    icon: Flame,
    title: "Daily Streaks",
    description:
      "Build momentum with daily streaks. Consistency is the key to transformation — streak bonuses keep you motivated.",
    color: "#ff4400",
  },
  {
    icon: Target,
    title: "Interactive Quizzes",
    description:
      "Reinforce your learning with scenario-based quizzes. Apply concepts in realistic situations before the real thing.",
    color: "#cc0044",
  },
  {
    icon: Trophy,
    title: "Badges & Achievements",
    description:
      "Unlock badges for milestones like completing courses, hitting streak records, and reaching new levels.",
    color: "#ffcc00",
  },
  {
    icon: Users,
    title: "Leaderboard",
    description:
      "See how you rank against other learners this week. Friendly competition keeps you pushing forward.",
    color: "#aa00ff",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 px-6 bg-[#0d0000]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Everything You Need to
            <span className="text-red-500"> Win</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            DaterXP combines proven dating psychology with addictive game mechanics
            to make self-improvement feel like progress — because it is.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="glass-card glass-card-hover rounded-2xl p-6 cursor-default transition-all duration-300"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{
                  backgroundColor: `${feature.color}20`,
                  border: `1px solid ${feature.color}40`,
                }}
              >
                <feature.icon
                  className="w-6 h-6"
                  style={{ color: feature.color }}
                />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
