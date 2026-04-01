"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { awardVictoryPhaseXP } from "@/lib/actions/victoryRoad";
import {
  Zap,
  MapPin,
  Star,
  Check,
  ChevronDown,
  Lock,
  Flame,
  RotateCcw,
  ChevronUp,
  Target,
} from "lucide-react";

type PhaseState = {
  completed: boolean;
  unlocked: boolean;
};

const STORAGE_KEY = "approach-warmup-session";

const PHASES = [
  {
    id: 1,
    title: "Boot-Up",
    emoji: "🧠",
    icon: Target,
    xp: 50,
    color: "#ff2a2a",
    glow: "rgba(255,42,42,0.4)",
    description: "Get your mind and emotions ready",
  },
  {
    id: 2,
    title: "The Approach",
    emoji: "⚡",
    icon: Zap,
    xp: 100,
    color: "#ff6b00",
    glow: "rgba(255,107,0,0.4)",
    description: "Execute with confidence",
  },
  {
    id: 3,
    title: "After Approach",
    emoji: "📍",
    icon: MapPin,
    xp: 75,
    color: "#a855f7",
    glow: "rgba(168,85,247,0.4)",
    description: "Make the right next move",
  },
  {
    id: 4,
    title: "Reflection",
    emoji: "⭐",
    icon: Star,
    xp: 125,
    color: "#f59e0b",
    glow: "rgba(245,158,11,0.4)",
    description: "Level up your self-awareness",
  },
];

const DEFAULT_PHASE_STATES: PhaseState[] = [
  { completed: false, unlocked: true },
  { completed: false, unlocked: false },
  { completed: false, unlocked: false },
  { completed: false, unlocked: false },
];

type SessionState = {
  phaseStates: PhaseState[];
  activePhase: number | null;
  totalXP: number;
  mission: string;
  contingency: string;
  checklist: boolean[];
  phase2Ratings: (string | null)[];
  nextStep: string;
  hadGoodTime: boolean | null;
  wentRight: string;
  wentWrong: string;
  wantsFollowUp: boolean | null;
};

const DEFAULT_SESSION: SessionState = {
  phaseStates: DEFAULT_PHASE_STATES,
  activePhase: 1,
  totalXP: 0,
  mission: "",
  contingency: "",
  checklist: [false, false, false, false],
  phase2Ratings: [null, null, null, null, null],
  nextStep: "",
  hadGoodTime: null,
  wentRight: "",
  wentWrong: "",
  wantsFollowUp: null,
};

export default function ApproachWarmUpPage() {
  const [loading, setLoading] = useState(true);

  const [phaseStates, setPhaseStates] = useState<PhaseState[]>(DEFAULT_PHASE_STATES);
  const [activePhase, setActivePhase] = useState<number | null>(1);
  const [totalXP, setTotalXP] = useState(0);
  const [xpBurst, setXpBurst] = useState<{ amount: number; id: number } | null>(null);
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<SessionState[]>([]);

  // Phase 1
  const [mission, setMission] = useState("");
  const [contingency, setContingency] = useState("");
  const [checklist, setChecklist] = useState<boolean[]>([false, false, false, false]);

  // Phase 2
  const [phase2Ratings, setPhase2Ratings] = useState<(string | null)[]>([null, null, null, null, null]);
  const [phase2CardIndex, setPhase2CardIndex] = useState(0);

  // Phase 3
  const [nextStep, setNextStep] = useState("");

  // Phase 4
  const [hadGoodTime, setHadGoodTime] = useState<boolean | null>(null);
  const [wentRight, setWentRight] = useState("");
  const [wentWrong, setWentWrong] = useState("");
  const [wantsFollowUp, setWantsFollowUp] = useState<boolean | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s: SessionState = JSON.parse(raw);
        setPhaseStates(s.phaseStates ?? DEFAULT_PHASE_STATES);
        setActivePhase(s.activePhase ?? 1);
        setTotalXP(s.totalXP ?? 0);
        setMission(s.mission ?? "");
        setContingency(s.contingency ?? "");
        setChecklist(s.checklist ?? [false, false, false, false]);
        setPhase2Ratings(s.phase2Ratings ?? [null, null, null, null, null]);
        setNextStep(s.nextStep ?? "");
        setHadGoodTime(s.hadGoodTime ?? null);
        setWentRight(s.wentRight ?? "");
        setWentWrong(s.wentWrong ?? "");
        setWantsFollowUp(s.wantsFollowUp ?? null);
      }
      const rawHistory = localStorage.getItem(STORAGE_KEY + "-history");
      if (rawHistory) setHistory(JSON.parse(rawHistory));
    } catch {}
    setLoading(false);
  }, []);

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const save = useCallback((patch: Partial<SessionState>) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const current: SessionState = raw ? JSON.parse(raw) : DEFAULT_SESSION;
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...patch }));
      } catch {}
    }, 400);
  }, []);

  function restartRoadmap() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const current: SessionState = JSON.parse(raw);
        if (current.phaseStates.some((p) => p.completed)) {
          const rawHistory = localStorage.getItem(STORAGE_KEY + "-history");
          const hist: SessionState[] = rawHistory ? JSON.parse(rawHistory) : [];
          hist.unshift(current);
          localStorage.setItem(STORAGE_KEY + "-history", JSON.stringify(hist.slice(0, 20)));
          setHistory(hist.slice(0, 20));
        }
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SESSION));
    } catch {}
    setPhaseStates(DEFAULT_PHASE_STATES);
    setActivePhase(1);
    setTotalXP(0);
    setMission("");
    setContingency("");
    setChecklist([false, false, false, false]);
    setPhase2Ratings([null, null, null, null, null]);
    setPhase2CardIndex(0);
    setNextStep("");
    setHadGoodTime(null);
    setWentRight("");
    setWentWrong("");
    setWantsFollowUp(null);
    setShowRestartConfirm(false);
  }

  function completePhase(phaseIndex: number) {
    const xpGained = PHASES[phaseIndex].xp;
    const newPhaseStates = phaseStates.map((s, i) => {
      if (i === phaseIndex) return { ...s, completed: true };
      if (i === phaseIndex + 1) return { ...s, unlocked: true };
      return s;
    });
    const newXP = totalXP + xpGained;
    const newActivePhase = phaseIndex + 1 < PHASES.length ? phaseIndex + 2 : null;
    setPhaseStates(newPhaseStates);
    setTotalXP(newXP);
    setActivePhase(newActivePhase);
    setXpBurst({ amount: xpGained, id: Date.now() });
    setTimeout(() => setXpBurst(null), 2000);
    save({ phaseStates: newPhaseStates, totalXP: newXP, activePhase: newActivePhase });
    awardVictoryPhaseXP(xpGained);
  }

  function updateMission(v: string) { setMission(v); save({ mission: v }); }
  function updateContingency(v: string) { setContingency(v); save({ contingency: v }); }
  function updateChecklist(v: boolean[]) { setChecklist(v); save({ checklist: v }); }
  function updatePhase2Ratings(v: (string | null)[]) { setPhase2Ratings(v); save({ phase2Ratings: v }); }
  function updateNextStep(v: string) { setNextStep(v); save({ nextStep: v }); }
  function updateHadGoodTime(v: boolean) { setHadGoodTime(v); save({ hadGoodTime: v }); }
  function updateWentRight(v: string) { setWentRight(v); save({ wentRight: v }); }
  function updateWentWrong(v: string) { setWentWrong(v); save({ wentWrong: v }); }
  function updateWantsFollowUp(v: boolean) { setWantsFollowUp(v); save({ wantsFollowUp: v }); }

  const allDone = phaseStates.every((p) => p.completed);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600 text-sm animate-pulse">Loading your progress...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 px-4 relative">
      {/* Header */}
      <div className="max-w-lg mx-auto pt-8 pb-4 text-center">
        <h1 className="text-3xl font-bold text-white mb-1">Approach Warm-Up</h1>
        <p className="text-gray-500 text-sm">Complete all 4 phases to earn your XP</p>

        {/* XP Counter */}
        <div
          className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full text-sm font-bold"
          style={{ background: "rgba(255,42,42,0.15)", border: "1px solid rgba(255,42,42,0.3)" }}
        >
          <Flame className="w-4 h-4 text-red-500" />
          <span className="text-red-400">{totalXP} XP earned</span>
        </div>

        {/* Restart button */}
        {phaseStates.some((p) => p.completed) && (
          <div className="mt-4">
            {showRestartConfirm ? (
              <div className="flex items-center justify-center gap-3">
                <span className="text-xs text-gray-400">Save progress &amp; start fresh?</span>
                <button
                  onClick={restartRoadmap}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                  style={{ background: "rgba(255,42,42,0.3)", border: "1px solid rgba(255,42,42,0.5)" }}
                >
                  Yes, restart
                </button>
                <button
                  onClick={() => setShowRestartConfirm(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-gray-500"
                  style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowRestartConfirm(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium text-gray-500 hover:text-gray-300 transition-colors"
                style={{ border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <RotateCcw className="w-3 h-3" />
                Start new warm-up
              </button>
            )}
          </div>
        )}
      </div>

      {/* XP Burst Animation */}
      <AnimatePresence>
        {xpBurst && (
          <motion.div
            key={xpBurst.id}
            initial={{ opacity: 1, y: 0, scale: 1 }}
            animate={{ opacity: 0, y: -80, scale: 1.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
          >
            <span className="text-4xl font-black text-yellow-400">
              +{xpBurst.amount} XP
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Path */}
      <div className="max-w-lg mx-auto relative">
        {PHASES.map((phase, index) => {
          const state = phaseStates[index];
          const isActive = activePhase === phase.id;
          const isLeft = index % 2 === 0;

          return (
            <div key={phase.id} className="relative">
              {/* Connector line */}
              {index < PHASES.length - 1 && (
                <div className="flex justify-center">
                  <div className="relative w-1 h-16">
                    <div className="absolute inset-0 bg-red-900/30 rounded-full" />
                    {state.completed && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "100%" }}
                        className="absolute top-0 left-0 right-0 rounded-full"
                        style={{ background: phase.color }}
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Phase Node */}
              <div className={`flex ${isLeft ? "justify-start pl-8" : "justify-end pr-8"} mb-0`}>
                <div className="flex flex-col items-center gap-2 w-full max-w-xs">
                  {/* Node Button */}
                  <motion.button
                    onClick={() => {
                      if (state.unlocked) {
                        setActivePhase(isActive ? null : phase.id);
                      }
                    }}
                    whileHover={state.unlocked ? { scale: 1.05 } : {}}
                    whileTap={state.unlocked ? { scale: 0.95 } : {}}
                    className="relative w-full"
                    style={{ opacity: state.unlocked ? 1 : 0.4 }}
                  >
                    <div
                      className="rounded-2xl p-4 border transition-all duration-300"
                      style={{
                        background: state.completed
                          ? `linear-gradient(135deg, ${phase.color}33, ${phase.color}11)`
                          : isActive
                          ? `linear-gradient(135deg, ${phase.color}22, transparent)`
                          : "rgba(20,0,0,0.6)",
                        borderColor: state.completed
                          ? phase.color
                          : isActive
                          ? `${phase.color}88`
                          : "rgba(120,0,0,0.2)",
                        boxShadow: isActive ? `0 0 20px ${phase.glow}` : "none",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        {/* Icon circle */}
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl relative"
                          style={{
                            background: state.completed
                              ? `linear-gradient(135deg, ${phase.color}, ${phase.color}aa)`
                              : `${phase.color}22`,
                            border: `2px solid ${phase.color}66`,
                          }}
                        >
                          {state.completed ? (
                            <Check className="w-7 h-7 text-white" strokeWidth={3} />
                          ) : !state.unlocked ? (
                            <Lock className="w-6 h-6 text-gray-600" />
                          ) : (
                            <span>{phase.emoji}</span>
                          )}
                        </div>

                        <div className="text-left flex-1">
                          <div className="text-xs font-semibold text-gray-500 mb-0.5">
                            Phase {phase.id}
                          </div>
                          <div className="text-base font-bold text-white">{phase.title}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{phase.description}</div>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          <span
                            className="text-xs font-bold px-2 py-0.5 rounded-full"
                            style={{
                              background: `${phase.color}22`,
                              color: phase.color,
                              border: `1px solid ${phase.color}44`,
                            }}
                          >
                            +{phase.xp} XP
                          </span>
                          {state.unlocked && !state.completed && (
                            <motion.div
                              animate={{ rotate: isActive ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDown className="w-4 h-4 text-gray-500" />
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.button>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isActive && state.unlocked && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="w-full overflow-hidden"
                      >
                        <div
                          className="rounded-2xl p-5 border"
                          style={{
                            background: "rgba(15,0,0,0.8)",
                            borderColor: `${phase.color}33`,
                          }}
                        >
                          {index === 0 && (
                            <Phase1Content
                              mission={mission}
                              setMission={updateMission}
                              contingency={contingency}
                              setContingency={updateContingency}
                              checklist={checklist}
                              setChecklist={updateChecklist}
                              onComplete={() => completePhase(0)}
                              color={phase.color}
                            />
                          )}
                          {index === 1 && (
                            <Phase2Content
                              ratings={phase2Ratings}
                              setRatings={updatePhase2Ratings}
                              cardIndex={phase2CardIndex}
                              setCardIndex={setPhase2CardIndex}
                              onComplete={() => completePhase(1)}
                              color={phase.color}
                            />
                          )}
                          {index === 2 && (
                            <Phase3Content
                              nextStep={nextStep}
                              setNextStep={updateNextStep}
                              onComplete={() => completePhase(2)}
                              color={phase.color}
                            />
                          )}
                          {index === 3 && (
                            <Phase4Content
                              hadGoodTime={hadGoodTime}
                              setHadGoodTime={updateHadGoodTime}
                              wentRight={wentRight}
                              setWentRight={updateWentRight}
                              wentWrong={wentWrong}
                              setWentWrong={updateWentWrong}
                              wantsFollowUp={wantsFollowUp}
                              setWantsFollowUp={updateWantsFollowUp}
                              onComplete={() => completePhase(3)}
                              color={phase.color}
                            />
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          );
        })}

        {/* Victory Banner */}
        <AnimatePresence>
          {allDone && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 text-center rounded-2xl p-8 border border-yellow-500/40"
              style={{
                background: "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(255,42,42,0.1))",
                boxShadow: "0 0 40px rgba(245,158,11,0.2)",
              }}
            >
              <div className="text-5xl mb-3">🏆</div>
              <h2 className="text-2xl font-black text-white mb-1">Warm-Up Complete!</h2>
              <p className="text-gray-400 text-sm mb-4">You crushed all 4 phases</p>
              <div className="text-3xl font-black text-yellow-400 mb-6">+{totalXP} XP Total</div>
              {showRestartConfirm ? (
                <div className="flex items-center justify-center gap-3">
                  <span className="text-xs text-gray-400">Save &amp; start a new warm-up?</span>
                  <button
                    onClick={restartRoadmap}
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
                    style={{ background: "rgba(255,42,42,0.4)", border: "1px solid rgba(255,42,42,0.6)" }}
                  >
                    Yes, restart
                  </button>
                  <button
                    onClick={() => setShowRestartConfirm(false)}
                    className="px-4 py-2 rounded-xl text-sm text-gray-500"
                    style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowRestartConfirm(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                  style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}
                >
                  <RotateCcw className="w-4 h-4" />
                  Start new warm-up
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Past Warm-Ups */}
        {history.length > 0 && (
          <div className="mt-8">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-gray-200 transition-colors"
              style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
            >
              <span>Past Warm-Ups ({history.length})</span>
              {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            <AnimatePresence>
              {showHistory && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden space-y-3 mt-3"
                >
                  {history.map((entry, idx) => {
                    const completedPhases = entry.phaseStates?.filter((p) => p.completed).length ?? 0;
                    return (
                      <div
                        key={idx}
                        className="rounded-xl p-4"
                        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-500">Warm-Up #{history.length - idx}</span>
                          <span className="text-xs font-bold text-yellow-500">+{entry.totalXP} XP</span>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {PHASES.map((phase, i) => {
                            const done = entry.phaseStates?.[i]?.completed;
                            return (
                              <div
                                key={phase.id}
                                className="flex-1 h-1.5 rounded-full"
                                style={{ background: done ? phase.color : "rgba(255,255,255,0.08)" }}
                              />
                            );
                          })}
                        </div>
                        <p className="text-xs text-gray-600">{completedPhases}/4 phases completed</p>
                        {entry.mission && (
                          <p className="text-xs text-gray-500 mt-1 truncate">🎯 {entry.mission}</p>
                        )}
                        {entry.wentRight && (
                          <p className="text-xs text-gray-500 mt-0.5 truncate">✅ {entry.wentRight}</p>
                        )}
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Phase 1: Boot-Up ────────────────────────────────────────────────────────

const CHECKLIST_ITEMS = [
  "Am I feeling positive?",
  "Basic Grooming and hygiene?",
  "Add bass to the voice, slow down speaking.",
  "Am I ready to win, but possibly face rejection?",
];

function Phase1Content({
  mission, setMission, contingency, setContingency,
  checklist, setChecklist, onComplete, color,
}: {
  mission: string; setMission: (v: string) => void;
  contingency: string; setContingency: (v: string) => void;
  checklist: boolean[]; setChecklist: (v: boolean[]) => void;
  onComplete: () => void; color: string;
}) {
  const canComplete = mission.trim() && contingency.trim() && checklist.every(Boolean);

  return (
    <div className="space-y-5">
      {/* Mindset */}
      <div
        className="rounded-xl px-4 py-3 text-center font-semibold text-white italic"
        style={{ background: `${color}22`, border: `1px solid ${color}33` }}
      >
        💭 &ldquo;I&apos;m a man who is worthy of any woman I want&rdquo;
      </div>

      {/* Mission */}
      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
          🎯 Mission — What is my goal for today?
        </label>
        <textarea
          value={mission}
          onChange={(e) => setMission(e.target.value)}
          placeholder="e.g. Stay present, have fun, see if we connect..."
          rows={2}
          className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 resize-none focus:outline-none focus:ring-1 transition-all"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${color}33`,
          }}
        />
      </div>

      {/* Checklist */}
      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
          ✅ Pre-Approach Checklist
        </label>
        <div className="space-y-2">
          {CHECKLIST_ITEMS.map((item, i) => (
            <button
              key={i}
              onClick={() => {
                const updated = [...checklist];
                updated[i] = !updated[i];
                setChecklist(updated);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all"
              style={{
                background: checklist[i] ? `${color}22` : "rgba(255,255,255,0.03)",
                border: `1px solid ${checklist[i] ? color + "66" : "rgba(255,255,255,0.06)"}`,
              }}
            >
              <div
                className="w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center transition-all"
                style={{
                  background: checklist[i] ? color : "transparent",
                  border: `2px solid ${checklist[i] ? color : "rgba(255,255,255,0.2)"}`,
                }}
              >
                {checklist[i] && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
              </div>
              <span className={`text-sm ${checklist[i] ? "text-white" : "text-gray-500"}`}>
                {item}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Contingency */}
      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
          🔄 Contingency — How will I respond if she flakes?
        </label>
        <textarea
          value={contingency}
          onChange={(e) => setContingency(e.target.value)}
          placeholder="e.g. I'll call a friend, enjoy the evening solo, no hard feelings..."
          rows={2}
          className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 resize-none focus:outline-none focus:ring-1 transition-all"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${color}33`,
          }}
        />
      </div>

      <CompleteButton onComplete={onComplete} disabled={!canComplete} color={color} xp={50} />
    </div>
  );
}

// ─── Phase 2: The Approach — Quiz ────────────────────────────────────────────

const PHASE2_QUIZ = [
  {
    category: "Communication",
    skill: "Silence",
    emoji: "🤫",
    teach: "Confident men are comfortable with silence. A pause isn't a problem — it's power. Let her fill it.",
    scenario: "There's a 5-second pause in conversation. What's the right move?",
    options: [
      "Launch into a story immediately to keep the energy up",
      "Ask a rapid-fire question to break the tension",
      "Hold relaxed eye contact and let her fill the silence",
      "Apologize and say you're not great at conversation",
    ],
    correct: 2,
    explanation: "Silence is attractive when you're relaxed in it. Rushing to fill every pause signals anxiety. Hold eye contact, stay calm — she'll naturally fill it.",
  },
  {
    category: "Approach",
    skill: "Delivery",
    emoji: "🎯",
    teach: "What you say opens the door, but how you say it keeps her in the room.",
    scenario: "What is more important for the approach?",
    options: [
      "A gift",
      "What you say",
      "How you say what you say",
      "Wearing a designer brand shirt",
    ],
    correct: 2,
    explanation: "What you say does matter, but HOW you say it is key to keep her interested in you. She might forget what you say, but not how you made her feel during that interaction.",
  },
  {
    category: "Mindset",
    skill: "Confidence",
    emoji: "💪",
    teach: "Her beauty is not a reason to freeze. Stay grounded and move forward.",
    scenario: "When you first approach a beautiful woman, do you let her beauty intimidate you?",
    options: [
      "Yes",
      "No",
    ],
    correct: 1,
    explanation: "Beautiful women are all over the place. They aren't a rare commodity. You'll meet plenty more and there's no need to be stunned if she's stunning. You're unfazed. Move forward with the approach.",
  },
  {
    category: "Approach",
    skill: "Opener",
    emoji: "🗣️",
    teach: "The first words you say set the tone. Make them natural, not rehearsed.",
    scenario: "What is the best type of initial line?",
    options: [
      "A compliment on her looks",
      "Starting off with 'excuse me' or 'I'm sorry'",
      "Ask a question in relation to the environment (ex: directions, opinion)",
      "Not a word. Intense eye contact until she talks.",
    ],
    correct: 2,
    explanation: "Asking for directions at a mall, school campus, or favorite restaurant at a food court are fantastic ice breakers, especially if you aren't as experienced with approaching women.",
  },
  {
    category: "Approach",
    skill: "Contact",
    emoji: "📱",
    teach: "Timing matters. Ask too early and it's awkward. Wait too long and the moment is gone.",
    scenario: "When should you exchange contact info?",
    options: [
      "Right after she says her name",
      "Wait for her to ask for my number",
      "Let my hesitation dominate my decision-making and not ask for her number",
      "As you are ending the conversation and need to leave",
    ],
    correct: 3,
    explanation: "Exchanging contact info is not awkward at all, whether it's a phone number, Instagram account, or WhatsApp. If there is mutual interest, it will be a smooth process.",
  },
];

function Phase2Content({
  ratings, setRatings, cardIndex, setCardIndex, onComplete, color,
}: {
  ratings: (string | null)[];
  setRatings: (v: (string | null)[]) => void;
  cardIndex: number;
  setCardIndex: (v: number) => void;
  onComplete: () => void;
  color: string;
}) {
  const q = PHASE2_QUIZ[cardIndex];
  const selectedStr = ratings[cardIndex];
  const selected = selectedStr !== null ? parseInt(selectedStr) : null;
  const answered = selected !== null;
  const isCorrect = selected === q.correct;
  const allAnswered = ratings.every((r) => r !== null);

  function choose(idx: number) {
    if (answered) return;
    const updated = [...ratings];
    updated[cardIndex] = String(idx);
    setRatings(updated);
  }

  function goNext() {
    if (cardIndex < PHASE2_QUIZ.length - 1) setCardIndex(cardIndex + 1);
  }
  function goPrev() {
    if (cardIndex > 0) setCardIndex(cardIndex - 1);
  }

  return (
    <div className="space-y-4">
      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2">
        {PHASE2_QUIZ.map((_, i) => (
          <button key={i} onClick={() => setCardIndex(i)}>
            <div
              className="rounded-full transition-all duration-300"
              style={{
                width: i === cardIndex ? "20px" : "8px",
                height: "8px",
                background:
                  ratings[i] !== null
                    ? parseInt(ratings[i]!) === PHASE2_QUIZ[i].correct
                      ? "#22c55e"
                      : "#ef4444"
                    : i === cardIndex
                    ? "rgba(255,255,255,0.6)"
                    : "rgba(255,255,255,0.15)",
              }}
            />
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={cardIndex}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.25 }}
          className="space-y-3"
        >
          {/* Skill header */}
          <div
            className="rounded-2xl px-5 py-4"
            style={{
              background: `linear-gradient(135deg, ${color}22, transparent)`,
              border: `1px solid ${color}33`,
            }}
          >
            <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color }}>
              {q.category} — {q.skill} {q.emoji}
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">{q.teach}</p>
          </div>

          {/* Question */}
          <div className="px-1">
            <p className="text-sm font-bold text-white mb-3">🎯 {q.scenario}</p>
            <div className="space-y-2">
              {q.options.map((opt, i) => {
                const isSelected = selected === i;
                const isRight = i === q.correct;
                let bg = "rgba(255,255,255,0.03)";
                let border = "rgba(255,255,255,0.08)";
                let textColor = "#9ca3af";
                let icon = null;

                if (answered) {
                  if (isRight) { bg = "rgba(34,197,94,0.15)"; border = "#22c55e"; textColor = "#86efac"; icon = "✓"; }
                  else if (isSelected) { bg = "rgba(239,68,68,0.15)"; border = "#ef4444"; textColor = "#fca5a5"; icon = "✗"; }
                } else if (isSelected) {
                  bg = `${color}22`; border = color; textColor = "white";
                }

                return (
                  <motion.button
                    key={i}
                    onClick={() => choose(i)}
                    whileHover={!answered ? { scale: 1.01 } : {}}
                    whileTap={!answered ? { scale: 0.99 } : {}}
                    className="w-full flex items-start gap-3 px-4 py-3 rounded-xl text-left transition-all"
                    style={{
                      background: bg,
                      border: `1px solid ${border}`,
                      cursor: answered ? "default" : "pointer",
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5"
                      style={{ background: `${border}44`, color: textColor, border: `1px solid ${border}` }}
                    >
                      {icon ?? String.fromCharCode(65 + i)}
                    </div>
                    <span className="text-sm" style={{ color: textColor }}>{opt}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {answered && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl px-4 py-3"
                style={{
                  background: isCorrect ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                  border: `1px solid ${isCorrect ? "#22c55e44" : "#ef444444"}`,
                }}
              >
                <p className="text-xs font-bold mb-1" style={{ color: isCorrect ? "#4ade80" : "#f87171" }}>
                  {isCorrect ? "✓ Correct!" : "✗ Not quite —"}
                </p>
                <p className="text-xs text-gray-400 leading-relaxed">{q.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* Nav */}
      <div className="flex items-center justify-between">
        <button
          onClick={goPrev}
          disabled={cardIndex === 0}
          className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
          style={{
            background: cardIndex === 0 ? "transparent" : "rgba(255,255,255,0.06)",
            color: cardIndex === 0 ? "#374151" : "#9ca3af",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          ← Back
        </button>
        <span className="text-xs text-gray-600">{cardIndex + 1} / {PHASE2_QUIZ.length}</span>
        {cardIndex < PHASE2_QUIZ.length - 1 ? (
          <button
            onClick={goNext}
            disabled={!answered}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: answered ? `${color}22` : "transparent",
              color: answered ? "white" : "#374151",
              border: `1px solid ${answered ? color + "66" : "rgba(255,255,255,0.06)"}`,
            }}
          >
            Next →
          </button>
        ) : <div className="w-20" />}
      </div>

      <CompleteButton onComplete={onComplete} disabled={!allAnswered} color={color} xp={100} />
    </div>
  );
}

// ─── Phase 3: After Approach — Strategy Quiz ─────────────────────────────────

const PHASE3_QUIZ = [
  {
    emoji: "📱",
    scenario: "You received her contact info. When should you message her?",
    options: [
      "Wait 2-3 days",
      "Whenever you 'feel' like it",
      "Later in the day at your convenience",
      "Never, what if she doesn't respond?",
    ],
    correct: 2,
    explanation: "There is no need to wait 2-3 days. You will probably forget of each other by then. Later in the day is ideal, since she will likely remember you since the interaction was the day of.",
  },
  {
    emoji: "💬",
    scenario: "You get a response, how will you feel and respond?",
    options: [
      "Feel ecstatic and reply with a paragraph",
      "Feel relief and answer to her question/one word",
      "Get nervous and not respond",
      "Remain composed and reply to her message with the intent of meeting up in person",
    ],
    correct: 3,
    explanation: "No need to let your emotions run wild. Especially if you are inexperienced with women. Remain calm and cool while responding to lead to a date. True connection is made in person, not through text.",
  },
  {
    emoji: "🤷",
    scenario: "What will you feel if she does not respond or stops replying?",
    options: [
      "Profound sadness",
      "Relief that she removed herself as an option in your life and allows a more qualified woman to be a part of your life",
      "Text her again, and again, and ….",
      "Call her until she responds",
    ],
    correct: 1,
    explanation: "She removed herself, which is her right. Your self-worth is not tied to any one woman's response. A woman who is genuinely interested will respond. Keep moving forward.",
  },
];

function Phase3Content({
  nextStep, setNextStep, onComplete, color,
}: {
  nextStep: string; setNextStep: (v: string) => void;
  onComplete: () => void; color: string;
}) {
  const answers: (number | null)[] = [0, 1, 2].map((i) => {
    const match = nextStep.match(new RegExp(`q${i}:(\\d)`));
    return match ? parseInt(match[1]) : null;
  });

  const [qIndex, setQIndex] = useState(0);
  const q = PHASE3_QUIZ[qIndex];
  const selected = answers[qIndex];
  const answered = selected !== null;
  const isCorrect = selected === q.correct;
  const allAnswered = answers.every((a) => a !== null);

  function choose(idx: number) {
    if (answered) return;
    const parts = [0, 1, 2].map((i) => {
      if (i === qIndex) return `q${i}:${idx}`;
      return answers[i] !== null ? `q${i}:${answers[i]}` : null;
    }).filter(Boolean);
    setNextStep(parts.join(","));
  }

  return (
    <div className="space-y-4">
      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2">
        {PHASE3_QUIZ.map((q3, i) => (
          <button key={i} onClick={() => setQIndex(i)}>
            <div
              className="rounded-full transition-all duration-300"
              style={{
                width: i === qIndex ? "20px" : "8px",
                height: "8px",
                background:
                  answers[i] !== null
                    ? answers[i] === q3.correct ? "#22c55e" : "#ef4444"
                    : i === qIndex ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.15)",
              }}
            />
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={qIndex}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.25 }}
          className="space-y-3"
        >
          <p className="text-sm font-bold text-white">
            {q.emoji} Scenario {qIndex + 1}: {q.scenario}
          </p>

          <div className="space-y-2">
            {q.options.map((opt, i) => {
              const isSelected = selected === i;
              const isRight = i === q.correct;
              let bg = "rgba(255,255,255,0.03)";
              let border = "rgba(255,255,255,0.08)";
              let textColor = "#9ca3af";
              let icon = null;

              if (answered) {
                if (isRight) { bg = "rgba(34,197,94,0.15)"; border = "#22c55e"; textColor = "#86efac"; icon = "✓"; }
                else if (isSelected) { bg = "rgba(239,68,68,0.15)"; border = "#ef4444"; textColor = "#fca5a5"; icon = "✗"; }
              } else if (isSelected) {
                bg = `${color}22`; border = color; textColor = "white";
              }

              return (
                <motion.button
                  key={i}
                  onClick={() => choose(i)}
                  whileHover={!answered ? { scale: 1.01 } : {}}
                  whileTap={!answered ? { scale: 0.99 } : {}}
                  className="w-full flex items-start gap-3 px-4 py-3 rounded-xl text-left transition-all"
                  style={{ background: bg, border: `1px solid ${border}`, cursor: answered ? "default" : "pointer" }}
                >
                  <div
                    className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5"
                    style={{ background: `${border}44`, color: textColor, border: `1px solid ${border}` }}
                  >
                    {icon ?? String.fromCharCode(65 + i)}
                  </div>
                  <span className="text-sm" style={{ color: textColor }}>{opt}</span>
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence>
            {answered && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl px-4 py-3"
                style={{
                  background: isCorrect ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                  border: `1px solid ${isCorrect ? "#22c55e44" : "#ef444444"}`,
                }}
              >
                <p className="text-xs font-bold mb-1" style={{ color: isCorrect ? "#4ade80" : "#f87171" }}>
                  {isCorrect ? "✓ Correct!" : "✗ Not quite —"}
                </p>
                <p className="text-xs text-gray-400 leading-relaxed">{q.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <button
          onClick={() => setQIndex(Math.max(0, qIndex - 1))}
          disabled={qIndex === 0}
          className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
          style={{
            background: qIndex === 0 ? "transparent" : "rgba(255,255,255,0.06)",
            color: qIndex === 0 ? "#374151" : "#9ca3af",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          ← Back
        </button>
        <span className="text-xs text-gray-600">{qIndex + 1} / {PHASE3_QUIZ.length}</span>
        {qIndex < PHASE3_QUIZ.length - 1 ? (
          <button
            onClick={() => setQIndex(qIndex + 1)}
            disabled={!answered}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: answered ? `${color}22` : "transparent",
              color: answered ? "white" : "#374151",
              border: `1px solid ${answered ? color + "66" : "rgba(255,255,255,0.06)"}`,
            }}
          >
            Next →
          </button>
        ) : <div className="w-20" />}
      </div>

      <CompleteButton onComplete={onComplete} disabled={!allAnswered} color={color} xp={75} />
    </div>
  );
}

// ─── Phase 4: Reflection ─────────────────────────────────────────────────────

function Phase4Content({
  hadGoodTime, setHadGoodTime, wentRight, setWentRight,
  wentWrong, setWentWrong, wantsFollowUp, setWantsFollowUp,
  onComplete, color,
}: {
  hadGoodTime: boolean | null; setHadGoodTime: (v: boolean) => void;
  wentRight: string; setWentRight: (v: string) => void;
  wentWrong: string; setWentWrong: (v: string) => void;
  wantsFollowUp: boolean | null; setWantsFollowUp: (v: boolean) => void;
  onComplete: () => void; color: string;
}) {
  const canComplete =
    hadGoodTime !== null && wentRight.trim() && wentWrong.trim() && wantsFollowUp !== null;

  return (
    <div className="space-y-5">
      {/* Did you have a good time */}
      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
          😊 Did you have a good time?
        </label>
        <div className="flex gap-3">
          {[{ v: true, label: "Yes 🔥" }, { v: false, label: "Not really" }].map(({ v, label }) => (
            <button
              key={String(v)}
              onClick={() => setHadGoodTime(v)}
              className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: hadGoodTime === v ? `${color}33` : "rgba(255,255,255,0.04)",
                border: `1px solid ${hadGoodTime === v ? color : "rgba(255,255,255,0.08)"}`,
                color: hadGoodTime === v ? "white" : "#6b7280",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* What went right */}
      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
          ✅ What went right?
        </label>
        <textarea
          value={wentRight}
          onChange={(e) => setWentRight(e.target.value)}
          placeholder="e.g. Good conversation, made her laugh, led confidently..."
          rows={2}
          className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 resize-none focus:outline-none transition-all"
          style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${color}33` }}
        />
      </div>

      {/* What went wrong */}
      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
          ⚠️ What went wrong?
        </label>
        <textarea
          value={wentWrong}
          onChange={(e) => setWentWrong(e.target.value)}
          placeholder="e.g. Got nervous, talked too much, lost the thread..."
          rows={2}
          className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 resize-none focus:outline-none transition-all"
          style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${color}33` }}
        />
      </div>

      {/* Follow up */}
      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
          🔁 Do you want to schedule the first date with her?
        </label>
        <div className="flex gap-3">
          {[{ v: true, label: "Yes 💯" }, { v: false, label: "No thanks" }].map(({ v, label }) => (
            <button
              key={String(v)}
              onClick={() => setWantsFollowUp(v)}
              className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: wantsFollowUp === v ? `${color}33` : "rgba(255,255,255,0.04)",
                border: `1px solid ${wantsFollowUp === v ? color : "rgba(255,255,255,0.08)"}`,
                color: wantsFollowUp === v ? "white" : "#6b7280",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <CompleteButton onComplete={onComplete} disabled={!canComplete} color={color} xp={125} />
    </div>
  );
}

// ─── Shared Complete Button ───────────────────────────────────────────────────

function CompleteButton({
  onComplete, disabled, color, xp,
}: {
  onComplete: () => void; disabled: boolean; color: string; xp: number;
}) {
  return (
    <motion.button
      onClick={onComplete}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className="w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-300"
      style={{
        background: disabled
          ? "rgba(255,255,255,0.05)"
          : `linear-gradient(135deg, ${color}, ${color}bb)`,
        color: disabled ? "#4b5563" : "white",
        boxShadow: disabled ? "none" : `0 0 20px ${color}66`,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {disabled ? "Complete all fields to continue" : `Complete Phase — Earn +${xp} XP`}
    </motion.button>
  );
}
