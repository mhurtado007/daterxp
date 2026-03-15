"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Lock } from "lucide-react";

const previewCourses = [
  {
    icon: "💪",
    title: "Confidence & Mindset",
    description: "Build unshakeable self-worth and stop letting fear hold you back.",
    lessons: 5,
    xp: 300,
    color: "#ff1a1a",
  },
  {
    icon: "💬",
    title: "Conversation Skills",
    description: "Master the art of engaging conversation that keeps her hooked.",
    lessons: 5,
    xp: 300,
    color: "#ff6600",
  },
  {
    icon: "🍷",
    title: "First Dates",
    description: "Plan, execute, and crush first dates that lead to second ones.",
    lessons: 5,
    xp: 300,
    color: "#cc0044",
  },
  {
    icon: "👁️",
    title: "Body Language",
    description: "Communicate attraction without saying a word through powerful body language.",
    lessons: 5,
    xp: 300,
    color: "#8800ff",
  },
];

export function CoursesPreview() {
  return (
    <section className="py-24 px-6 bg-[#0d0000]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Your Learning Path
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Four expert courses covering every aspect of dating mastery.
            Start anywhere and progress at your own pace.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {previewCourses.map((course, i) => (
            <motion.div
              key={course.title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card glass-card-hover rounded-2xl p-6 flex items-start gap-4 transition-all duration-300"
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{
                  backgroundColor: `${course.color}20`,
                  border: `1px solid ${course.color}40`,
                }}
              >
                {course.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-lg mb-1">{course.title}</h3>
                <p className="text-gray-400 text-sm mb-3 leading-relaxed">{course.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>{course.lessons} lessons</span>
                  <span>•</span>
                  <span className="text-red-400 font-medium">+{course.xp} XP</span>
                </div>
              </div>
              <Lock className="w-4 h-4 text-gray-600 flex-shrink-0 mt-1" />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, #ff2a2a, #cc0000)",
              boxShadow: "0 0 20px rgba(255,26,26,0.4)",
            }}
          >
            Unlock All Courses
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
