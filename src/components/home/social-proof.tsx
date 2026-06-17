import { PARTNER_SCHOOLS } from "@/lib/constants/components/marketing/landing";
import WidthConstraint from "../ui/width-constraint";
import { MarqueeRow } from "../shared/marquee-row";

const row1Items = PARTNER_SCHOOLS.slice(0, 10);
const row2Items = PARTNER_SCHOOLS.slice(4);

const SocialProof = () => {
  return (
    <WidthConstraint>
      <div className="mb-8 text-center">
        <p className="text-muted-foreground text-sm font-semibold tracking-widest uppercase">
          Trusted by students from top schools
        </p>
      </div>

      <div className="mask-gradient relative flex flex-col gap-8 overflow-hidden">
        <div className="from-background pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-8 bg-linear-to-r to-transparent sm:w-20" />
        <div className="from-background pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-8 bg-linear-to-l to-transparent sm:w-20" />

        <MarqueeRow items={row1Items} direction="left" speed={40} />
        <MarqueeRow items={row2Items} direction="right" speed={45} />
      </div>
    </WidthConstraint>
  );
};

export default SocialProof;
