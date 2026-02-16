export interface ServiceItem {
  title: string;
  description: string;
  className: string;
}

export interface ServicesConstants {
  HERO: {
    TITLE: string;
    TITLE_HIGHLIGHT: string;
    SUBTITLE: string;
  };
  ITEMS: {
    CRISIS_SUPPORT: ServiceItem;
    SAFE_CONFIDENTIAL: ServiceItem;
    PEER_COMMUNITIES: ServiceItem;
    EXPERT_THERAPY: ServiceItem;
    MOOD_CHECKINS: ServiceItem;
  };
}
