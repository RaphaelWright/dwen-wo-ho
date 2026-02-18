import Image from "next/image";
import { OrbitalItem } from "../ui/orbital-carousel";

export const orbitalItemsLocal: OrbitalItem[] = [
  {
    id: 1,
    content: (
      <Image
        src="/hero/black-counsellor-lady.png"
        alt="Black Counsellor"
        width={120}
        height={120}
        className="rounded-full object-cover w-full h-full"
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
        className="rounded-full object-cover w-full h-full"
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
        className="rounded-full object-cover w-full h-full"
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
        className="rounded-full object-cover w-full h-full"
      />
    ),
  },
];
