"use client";

import {
  ChevronLeft,
  User,
  Activity,
  Brain,
  BookOpen,
  AlertCircle,
  Clock,
  CheckCircle2,
  Plus,
  School,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  useCuratorPatientDetails,
  generateColor,
} from "@/hooks/curator/useCuratorPatientDetails";
import { MOCK_PATIENT_ACTIONS } from "@/lib/constants/mock-data";

export default function PatientDetailsPage() {
  const {
    router,
    patientResult,
    lockInAssessment,
    isLoading,
    activeTab,
    setActiveTab,
    metrics,
  } = useCuratorPatientDetails();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted/5">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">
            Loading patient details...
          </p>
        </div>
      </div>
    );
  }

  if (!patientResult || !lockInAssessment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-muted/5">
        <Button
          onClick={() => router.back()}
          className="mb-3 text-muted-foreground hover:text-foreground text-sm flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </Button>
        <p className="text-destructive text-sm">
          Failed to load patient details
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/5 flex flex-col animate-in fade-in duration-500">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Header Card */}
        <div className="bg-card rounded-3xl shadow-sm border border-border p-6 md:p-8 mb-8 relative overflow-hidden">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="rounded-full mb-6 transition-colors gap-2 pl-0 hover:bg-transparent text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="size-5" /> Back to List
          </Button>

          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            {/* Avatar / Initials */}
            <div className="w-24 h-24 md:w-32 md:h-32 bg-teal-500/10 rounded-3xl flex items-center justify-center text-teal-600 shadow-inner shrink-0 ring-1 ring-teal-500/20">
              <User className="w-12 h-12 md:w-16 md:h-16 opacity-80" />
            </div>

            {/* Patient Info */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                {patientResult?.patientName}
              </h1>
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full border border-border/50">
                  <Activity className="w-4 h-4 text-teal-600" />
                  <span className="font-medium">
                    {patientResult?.patientAge} yrs, {patientResult?.patientSex}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full border border-border/50">
                  <School className="w-4 h-4 text-teal-600" />
                  <span className="font-medium">
                    {patientResult?.schoolName}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full border border-border/50">
                  <Calendar className="w-4 h-4 text-teal-600" />
                  <span className="font-medium">
                    Joined{" "}
                    {new Date(
                      patientResult?.createdAt || "",
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Locked-In Score Indicator */}
            <div className="flex flex-col items-center p-6 bg-muted/30 rounded-3xl border border-border/50 min-w-40 mx-auto sm:mx-0 backdrop-blur-sm">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                Locked In Score
              </span>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-5xl font-bold text-teal-600 tracking-tight">
                  {lockInAssessment?.lockedInScore.split("/")[0]}
                </span>
                <span className="text-lg text-muted-foreground font-medium">
                  /10
                </span>
              </div>
              <div
                className="px-4 py-1.5 rounded-full text-xs font-bold text-white uppercase tracking-wide shadow-sm"
                style={{
                  backgroundColor: generateColor(
                    lockInAssessment?.lockedInColor || "gray",
                  ),
                }}
              >
                {lockInAssessment?.lockedInScoreDescription || "Unknown"}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Assessment Data */}
          <div className="lg:col-span-2 space-y-6">
            {/* Detailed Metrics Cards */}
            {metrics.map((category, idx) => (
              <div
                key={idx}
                className="bg-card rounded-3xl shadow-sm border border-border overflow-hidden group hover:border-primary/20 transition-colors duration-300"
              >
                <div className="px-6 py-4 border-b border-border bg-muted/20 flex items-center gap-4">
                  <div className="p-2 bg-accent rounded-xl shadow-sm border border-border group-hover:border-primary/20 transition-colors">
                    {idx === 0 ? (
                      <Brain className="w-5 h-5 text-teal-600" />
                    ) : idx === 1 ? (
                      <AlertCircle className="w-5 h-5 text-teal-600" />
                    ) : (
                      <BookOpen className="w-5 h-5 text-teal-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg tracking-tight">
                      {category.name}
                    </h3>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
                      {category.description} • Score: {category.score}
                    </p>
                  </div>
                </div>

                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                  {category.items.map((item, i) => (
                    <div key={i} className="flex flex-col gap-2">
                      <div className="flex justify-between items-end mb-1">
                        <span className="font-medium text-foreground text-sm">
                          {item.name}
                        </span>
                        <span
                          className="text-xs font-medium px-2 py-0.5 rounded"
                          style={{ backgroundColor: item.color }}
                        >
                          {item.value}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2.5em] leading-relaxed">
                        {item.description}
                      </p>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mt-1">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          className="h-full rounded-full opacity-60"
                          style={{ backgroundColor: item.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Actions & History */}
          <div className="space-y-6">
            <div className="bg-card rounded-3xl shadow-sm border border-border h-full flex flex-col overflow-hidden">
              <div className="p-6 flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-foreground">
                    Actions History
                  </h2>
                  <Button
                    variant={"link"}
                    className="text-sm text-primary font-medium hover:underline"
                  >
                    View All
                  </Button>
                </div>

                {/* Tabs Switcher for this card */}
                <div className="flex p-1 bg-muted rounded-xl mb-6 shrink-0 gap-1">
                  <Button
                    onClick={() => setActiveTab("assessment")}
                    variant="ghost"
                    className={cn(
                      "flex-1 py-1.5 h-8 text-xs font-bold rounded-lg transition-all hover:bg-none",
                      activeTab === "assessment"
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                    )}
                  >
                    Pending
                  </Button>
                  <Button
                    onClick={() => setActiveTab("history")}
                    variant="ghost"
                    className={cn(
                      "flex-1 py-1.5 h-8 text-xs font-bold rounded-lg transition-all hover:bg-none",
                      activeTab === "history"
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                    )}
                  >
                    History
                  </Button>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-border">
                  {MOCK_PATIENT_ACTIONS.map((action, i) => (
                    <div
                      key={i}
                      className="flex gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border group"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                        <action.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-foreground truncate">
                          {action.title}
                        </h4>
                        <p className="text-xs text-muted-foreground truncate">
                          {action.subtitle}
                        </p>
                        <div className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground">
                          <Clock className="w-3 h-3" />{" "}
                          <p className="pt-0.5">{action.date}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 border-t border-border bg-muted/10 mt-auto">
                <Button className="w-full h-10 rounded-lg bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-sm">
                  <Plus className="w-4 h-4" /> Add Action
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
