import {
  FiUsers,
  FiRadio,
  FiActivity,
  FiImage,
  FiCalendar,
} from "react-icons/fi";
import { MdSchool, MdHealthAndSafety } from "react-icons/md";
import { HiOutlineSpeakerphone } from "react-icons/hi";

export const CREATE_MODAL_ITEMS_CONFIG = [
  {
    id: "schools",
    label: "New Schools",
    icon: MdSchool,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    requiresHandler: true,
  },
  {
    id: "team",
    label: "New Member",
    icon: FiUsers,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
    requiresHandler: true,
  },
  {
    id: "partners",
    label: "New Partners",
    icon: MdHealthAndSafety,
    color: "text-green-500",
    bgColor: "bg-green-50",
    requiresHandler: true,
  },
  {
    id: "reach",
    label: "Reach",
    icon: HiOutlineSpeakerphone,
    color: "text-orange-500",
    bgColor: "bg-orange-50",
    requiresHandler: true,
  },
  {
    id: "radio",
    label: "Radio",
    icon: FiRadio,
    color: "text-pink-500",
    bgColor: "bg-pink-50",
    isComingSoon: true,
  },
  {
    id: "lineup",
    label: "Health Lineup",
    icon: FiActivity,
    color: "text-red-500",
    bgColor: "bg-red-50",
    isComingSoon: true,
  },
  {
    id: "banner",
    label: "Banner",
    icon: FiImage,
    color: "text-indigo-500",
    bgColor: "bg-indigo-50",
    isComingSoon: true,
  },
  {
    id: "events",
    label: "Events",
    icon: FiCalendar,
    color: "text-yellow-500",
    bgColor: "bg-yellow-50",
    isComingSoon: true,
  },
];
