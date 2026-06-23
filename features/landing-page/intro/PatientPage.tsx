"use client";

import styles from "./PatientPage.module.css";

interface PatientPageProps {
  isVisible: boolean;
  onBack: () => void;
}

export function PatientPage({ isVisible, onBack }: PatientPageProps) {
  return (
    <div className={`${styles.patientPage} ${isVisible ? styles.show : ""}`}>
      <button className={styles.backBtn} onClick={onBack}>
        ← Back
      </button>
      <div className={styles.title}>Patient Welcome Page</div>
    </div>
  );
}
