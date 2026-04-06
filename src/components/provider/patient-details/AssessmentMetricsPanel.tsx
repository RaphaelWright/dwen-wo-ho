"use client";

import { Brain, AlertCircle, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { MetricCategory } from "@/hooks/provider/use-provider-patient-details";

interface AssessmentMetricsPanelProps {
  metrics: MetricCategory[];
}

const categoryIcons = [Brain, AlertCircle, BookOpen];

export function AssessmentMetricsPanel({ metrics }: AssessmentMetricsPanelProps) {
  if (metrics.length === 0) return null;

  return (
    <div className="space-y-6">
      {metrics.map((category, idx) => {
        const Icon = categoryIcons[idx] || Brain;
        return (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-card rounded-3xl shadow-sm border border-border overflow-hidden group hover:border-primary/20 transition-colors duration-300"
          >
            {/* Card Header */}
            <div className="px-6 py-4 border-b border-border bg-muted/20 flex items-center gap-4">
              <div className="p-2 bg-accent rounded-xl shadow-sm border border-border group-hover:border-primary/20 transition-colors">
                <Icon className="w-5 h-5 text-teal-600" />
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

            {/* Metrics Grid */}
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              {category.items.map((item, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="flex justify-between items-end mb-1">
                    <span className="font-medium text-foreground text-sm">
                      {item.name}
                    </span>
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded text-background"
                      style={{ backgroundColor: item.color }}
                    >
                      {item.value}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2.5em] leading-relaxed">
                    {item.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mt-1">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
                      className="h-full rounded-full opacity-60"
                      style={{ backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
