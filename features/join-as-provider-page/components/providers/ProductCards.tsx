"use client";

import styles from "./ProductCards.module.css";
import { CARDS } from "@/features/join-as-provider-page/data/providers";

interface ProductCardsProps {
  isVisible: boolean;
  pills: boolean[];
  bubbles: boolean[];
  bubbleRefs: React.RefObject<HTMLParagraphElement | null>[];
}

export function ProductCards({
  isVisible,
  pills,
  bubbles,
  bubbleRefs,
}: ProductCardsProps) {
  return (
    <div
      className={styles.cards}
      style={{ display: isVisible ? "grid" : "none" }}
    >
      {CARDS.map((card, i) => (
        <div
          key={card.id}
          className={`${styles.card} ${i === 1 ? styles.cardMiddle : ""}`}
        >
          <span
            className={`${styles.pill} ${styles[card.pillStyle]} ${pills[i] ? styles.in : ""}`}
          >
            {card.pillLabel}
          </span>
          <p
            ref={bubbleRefs[i]}
            className={`${styles.bubble} ${bubbles[i] ? styles.in : ""}`}
          />
        </div>
      ))}
    </div>
  );
}
