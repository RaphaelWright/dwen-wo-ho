import Image from "next/image";
import { OrbitalItem } from "@/components/ui/orbital-carousel";

export const orbitalItemsLocal: OrbitalItem[] = [
  {
    id: 1,
    content: (
      <Image
        src="/hero/black-counsellor-lady.png"
        alt="Black Counsellor"
        width={120}
        height={120}
        className="h-full w-full rounded-full object-cover"
        priority
      />
    ),
  },
  {
    id: 2,
    content: (
      <Image
        src="/hero/counsellor.png"
        alt="Counsellor Lady"
        width={120}
        height={120}
        className="h-full w-full rounded-full object-cover"
      />
    ),
  },
  {
    id: 3,
    content: (
      <Image
        src="/hero/counsellor-mann.png"
        alt="Counsellor Man"
        width={120}
        height={120}
        className="h-full w-full rounded-full object-cover"
      />
    ),
  },
  {
    id: 4,
    content: (
      <Image
        src="/hero/student-counsel.png"
        alt="Student Counsel"
        width={120}
        height={120}
        className="h-full w-full rounded-full object-cover"
      />
    ),
  },
];
