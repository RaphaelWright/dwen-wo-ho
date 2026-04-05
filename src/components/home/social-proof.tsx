import { PARTNER_SCHOOLS } from "@/lib/constants/components/social-proof";
import WidthConstraint from "../ui/width-constraint";
import { MarqueeRow } from "../shared/marquee-row";

const SocialProof = () => {
  const row1Items = [
    ...PARTNER_SCHOOLS.slice(0, 10),
    ...PARTNER_SCHOOLS.slice(0, 10),
  ];
  const row2Items = [...PARTNER_SCHOOLS.slice(4), ...PARTNER_SCHOOLS.slice(4)];

  return (
    <WidthConstraint>
      <div className="text-center mb-8">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
          Trusted by students from top schools
        </p>
      </div>

      <div className="relative flex flex-col gap-8 overflow-hidden mask-gradient">
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-20 bg-linear-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-20 bg-linear-to-l from-background to-transparent z-10 pointer-events-none" />

        <MarqueeRow items={row1Items} direction="left" speed={40} />
        <MarqueeRow items={row2Items} direction="right" speed={45} />
      </div>
    </WidthConstraint>
  );
};

export default SocialProof;
