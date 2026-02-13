import Header from "@/components/header";
import PatientsHero from "@/components/hero/patients";
import JsonLd from "@/components/json-ld";
import { JSON_LD_HOME_PAGE } from "@/lib/constants/json-ld";

export default function Home() {
  return (
    <>
      <JsonLd data={JSON_LD_HOME_PAGE} />
      <Header />
      <main>
        <PatientsHero />
      </main>
    </>
  );
}
