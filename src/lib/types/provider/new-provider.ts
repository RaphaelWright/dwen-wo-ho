export type Patient = {
  id: number;
  name: string;
  school: string;
  schoolLabel: string;
  time: string;
  score: number;
  color: string;
  emoji: string;
};

export type NotificationItem = {
  id: number;
  unread: boolean;
  emoji: string;
  patient: string;
  text: string;
  meta: string;
};

export type ProfileData = {
  title: string;
  name: string;
  specialty: string;
  status: string;
  phone: string;
};
