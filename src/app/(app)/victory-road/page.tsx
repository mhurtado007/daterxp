"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { awardVictoryPhaseXP } from "@/lib/actions/victoryRoad";
import {
  Shield,
  Zap,
  MapPin,
  Star,
  Check,
  ChevronDown,
  Lock,
  Flame,
  RotateCcw,
  ChevronUp,
} from "lucide-react";

type PhaseState = {
  completed: boolean;
  unlocked: boolean;
};

type HistoryEntry = {
  id: string;
  completed_at: string;
  total_xp: number;
  phase_states: PhaseState[];
  mission: string | null;
  went_right: string | null;
  went_wrong: string | null;
  had_good_time: boolean | null;
};

const PHASES = [
  {
    id: 1,
    title: "Preparation",
    emoji: "🛡️",
    icon: Shield,
    xp: 50,
    color: "#ff2a2a",
    glow: "rgba(255,42,42,0.4)",
    description: "Get your mind and body ready",
  },
  {
    id: 2,
    title: "The Date",
    emoji: "⚡",
    icon: Zap,
    xp: 100,
    color: "#ff6b00",
    glow: "rgba(255,107,0,0.4)",
    description: "Execute with confidence",
  },
  {
    id: 3,
    title: "After Date",
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

export default function VictoryRoadPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);

  const [phaseStates, setPhaseStates] = useState<PhaseState[]>(DEFAULT_PHASE_STATES);
  const [activePhase, setActivePhase] = useState<number | null>(1);
  const [totalXP, setTotalXP] = useState(0);
  const [xpBurst, setXpBurst] = useState<{ amount: number; id: number } | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

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

  const loadHistory = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("victory_road_history")
      .select("*")
      .eq("user_id", user.id)
      .order("completed_at", { ascending: false })
      .limit(20);
    if (data) setHistory(data);
  }, [supabase]);

  // Load from Supabase on mount
  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("victory_road_sessions")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (data) {
        setPhaseStates(data.phase_states ?? DEFAULT_PHASE_STATES);
        setActivePhase(data.active_phase ?? 1);
        setTotalXP(data.total_xp ?? 0);
        setMission(data.mission ?? "");
        setContingency(data.contingency ?? "");
        setChecklist(data.checklist ?? [false, false, false, false]);
        setPhase2Ratings(data.phase2_ratings ?? [null, null, null, null, null]);
        setNextStep(data.next_step ?? "");
        setHadGoodTime(data.had_good_time ?? null);
        setWentRight(data.went_right ?? "");
        setWentWrong(data.went_wrong ?? "");
        setWantsFollowUp(data.wants_follow_up ?? null);
      }
      setLoading(false);
      loadHistory();
    }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced save to Supabase
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const save = useCallback(async (patch: Record<string, unknown>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("victory_road_sessions").upsert(
      { user_id: user.id, ...patch },
      { onConflict: "user_id" }
    );
  }, [supabase]);

  function scheduleSave(patch: Record<string, unknown>) {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => save(patch), 800);
  }

  async function restartRoadmap() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (phaseStates.some((p) => p.completed)) {
      await supabase.from("victory_road_history").insert({
        user_id: user.id,
        total_xp: totalXP,
        phase_states: phaseStates,
        mission: mission || null,
        went_right: wentRight || null,
        went_wrong: wentWrong || null,
        had_good_time: hadGoodTime,
      });
    }

    const reset = {
      phase_states: DEFAULT_PHASE_STATES,
      active_phase: 1,
      total_xp: 0,
      mission: "",
      contingency: "",
      checklist: [false, false, false, false],
      phase2_ratings: [null, null, null, null, null],
      next_step: "",
      had_good_time: null,
      went_right: "",
      went_wrong: "",
      wants_follow_up: null,
    };

    await supabase.from("victory_road_sessions").upsert(
      { user_id: user.id, ...reset },
      { onConflict: "user_id" }
    );

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
    loadHistory();
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
    save({ phase_states: newPhaseStates, total_xp: newXP, active_phase: newActivePhase });
    awardVictoryPhaseXP(xpGained);
  }

  // Field-level save helpers
  function updateMission(v: string) { setMission(v); scheduleSave({ mission: v }); }
  function updateContingency(v: string) { setContingency(v); scheduleSave({ contingency: v }); }
  function updateChecklist(v: boolean[]) { setChecklist(v); scheduleSave({ checklist: v }); }
  function updatePhase2Ratings(v: (string | null)[]) { setPhase2Ratings(v); scheduleSave({ phase2_ratings: v }); }
  function updateNextStep(v: string) { setNextStep(v); scheduleSave({ next_step: v }); }
  function updateHadGoodTime(v: boolean) { setHadGoodTime(v); scheduleSave({ had_good_time: v }); }
  function updateWentRight(v: string) { setWentRight(v); scheduleSave({ went_right: v }); }
  function updateWentWrong(v: string) { setWentWrong(v); scheduleSave({ went_wrong: v }); }
  function updateWantsFollowUp(v: boolean) { setWantsFollowUp(v); scheduleSave({ wants_follow_up: v }); }

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
        <h1 className="text-3xl font-bold text-white mb-1">Victory Road</h1>
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
                Start new roadmap
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
              <h2 className="text-2xl font-black text-white mb-1">Victory Achieved!</h2>
              <p className="text-gray-400 text-sm mb-4">You crushed all 4 phases</p>
              <div className="text-3xl font-black text-yellow-400 mb-6">+{totalXP} XP Total</div>
              {showRestartConfirm ? (
                <div className="flex items-center justify-center gap-3">
                  <span className="text-xs text-gray-400">Save &amp; start a new roadmap?</span>
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
                  Start new roadmap
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Past Roadmaps */}
        {history.length > 0 && (
          <div className="mt-8">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-gray-200 transition-colors"
              style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
            >
              <span>Past Roadmaps ({history.length})</span>
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
                  {history.map((entry) => {
                    const completedPhases = (entry.phase_states as PhaseState[])?.filter((p) => p.completed).length ?? 0;
                    const date = new Date(entry.completed_at).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric",
                    });
                    return (
                      <div
                        key={entry.id}
                        className="rounded-xl p-4"
                        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-500">{date}</span>
                          <span className="text-xs font-bold text-yellow-500">+{entry.total_xp} XP</span>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {PHASES.map((phase, i) => {
                            const done = (entry.phase_states as PhaseState[])?.[i]?.completed;
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
                        {entry.went_right && (
                          <p className="text-xs text-gray-500 mt-0.5 truncate">✅ {entry.went_right}</p>
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

// ─── Phase 1: Preparation ───────────────────────────────────────────────────

const CHECKLIST_ITEMS = [
  "Dressed for the correct occasion?",
  "Basic grooming and hygiene handled?",
  "Plan to be there on time?",
  "Mentally and emotionally prepared?",
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
        💭 &ldquo;I&apos;m going to have a great time!&rdquo;
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
          ✅ Pre-Date Checklist
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

// ─── Phase 2: The Date — Scenario Quiz ───────────────────────────────────────

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
    category: "Communication",
    skill: "Listening",
    emoji: "👂",
    teach: "Most guys wait for their turn to talk. You actually listen — and it's magnetic.",
    scenario: "She mentions her sister just got married and she has mixed feelings about it. You:",
    options: [
      "Share a story about your own family to relate",
      "Say 'That's cool!' and pivot to a new topic",
      "Give her advice on how to feel about it",
      "Ask 'Mixed feelings — what's going on with that?' and lean in",
    ],
    correct: 3,
    explanation: "Follow her emotional thread. She opened a door — walk through it. Asking a specific follow-up shows you actually heard her, not just the words.",
  },
  {
    category: "Dynamics",
    skill: "Awareness",
    emoji: "👁️",
    teach: "Her signals are louder than her words. Learn to read the room.",
    scenario: "She's laughing, leaning toward you, and touching her hair when you speak. This means:",
    options: [
      "She's nervous and uncomfortable — give her more space",
      "She's being polite but isn't interested",
      "She's attracted and engaged — keep going",
      "She wants to leave but doesn't know how to say it",
    ],
    correct: 2,
    explanation: "Leaning in, laughing, and self-touching (hair, neck, wrist) are classic interest signals. These are green lights. Don't second-guess them — calibrate and escalate.",
  },
  {
    category: "Dynamics",
    skill: "Escalation",
    emoji: "🔥",
    teach: "Escalation builds tension. Slow and calibrated beats fast and clumsy every time.",
    scenario: "You want to begin physical escalation. The best first move is:",
    options: [
      "Go for a kiss — be bold and don't hesitate",
      "Tell her directly that you're attracted to her",
      "A light touch on her arm during a moment of shared laughter",
      "Wait for her to make the first move",
    ],
    correct: 2,
    explanation: "Start small and test the waters. A light arm touch during laughter is natural and low-stakes. If she doesn't pull back, you have a green light to escalate further.",
  },
  {
    category: "Dynamics",
    skill: "Leading",
    emoji: "🧭",
    teach: "She wants you to lead. Indecision is the mood killer — make the call.",
    scenario: "The first spot is winding down. She asks what you want to do next. You say:",
    options: [
      "'I don't know, what do you want to do?'",
      "'Whatever you want — I'm easy!'",
      "'We should probably call it a night soon'",
      "'I know a rooftop bar nearby — let's go'",
    ],
    correct: 3,
    explanation: "Suggest and invite — don't ask permission. 'Let's go' with a specific plan is attractive. It signals confidence and takes the decision-making pressure off her.",
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

// ─── Phase 3: After Date — Strategy Quiz ─────────────────────────────────────

const PHASE3_QUIZ = [
  {
    emoji: "🚶",
    scenario: "The date was great. You're saying goodbye outside. What's the highest-value next move?",
    options: [
      "Tell her you'll text her and head home",
      "Ask if she wants to keep hanging out somewhere",
      "Suggest a specific second location — 'There's a great spot nearby, let's keep going'",
      "Tell her you had an amazing time and you really like her",
    ],
    correct: 2,
    explanation: "Suggesting a specific second location keeps momentum without coming off as desperate. Vague 'want to keep hanging?' signals indecision. Be specific and lead.",
  },
  {
    emoji: "🏠",
    scenario: "She invites you up to her place. What's the right mindset going in?",
    options: [
      "Rush in before she changes her mind — don't overthink it",
      "Tell her you should probably just go home to not seem too eager",
      "Stay calm, be present, and don't act overly excited or nervous",
      "Immediately bring up what happens next so expectations are clear",
    ],
    correct: 2,
    explanation: "Calm and present is the move. Excitement signals neediness. Nervousness signals inexperience. She invited you — act like it's a natural outcome, not a lottery win.",
  },
  {
    emoji: "🚗",
    scenario: "You're heading home alone. The date went well. When do you text her?",
    options: [
      "Immediately — strike while the iron is hot",
      "Wait exactly 3 days so you don't seem needy",
      "A few hours later with a brief, warm message referencing something specific from the date",
      "Wait for her to text first — don't show your hand",
    ],
    correct: 2,
    explanation: "A few hours gives it breathing room without playing games. Reference something specific ('still laughing about the story you told about your dog') — it shows you were present and creates an inside thread.",
  },
];

function Phase3Content({
  nextStep, setNextStep, onComplete, color,
}: {
  nextStep: string; setNextStep: (v: string) => void;
  onComplete: () => void; color: string;
}) {
  // nextStep stores "q0:2,q1:0,q2:3" style answers
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
          🔁 Do YOU want a follow-up date with her?
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
