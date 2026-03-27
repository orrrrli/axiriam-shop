import { estudioContent } from './estudio-content';
import EstudioHero from '@/components/organisms/estudio/estudio-hero';
import EstudioAbout from '@/components/organisms/estudio/estudio-about';
import EstudioHowItWorks from '@/components/organisms/estudio/estudio-how-it-works';
import EstudioMission from '@/components/organisms/estudio/estudio-mission';
import EstudioHistory from '@/components/organisms/estudio/estudio-history';
import EstudioTestimonials from '@/components/organisms/estudio/estudio-testimonials';
import EstudioCtaBanner from '@/components/organisms/estudio/estudio-cta-banner';
import EstudioLinks from '@/components/organisms/estudio/estudio-links';
import EstudioFooter from '@/components/organisms/estudio/estudio-footer';

export const metadata = {
  title: 'Estudio — Axiriam',
  description:
    'Conocé el proceso artesanal detrás de cada gorro quirúrgico Axiriam. Calidad premium, diseño argentino.',
};

export default function EstudioPage() {
  return (
    <main>
      <EstudioHero {...estudioContent.hero} />
      <EstudioAbout {...estudioContent.about} />
      <EstudioHowItWorks {...estudioContent.howItWorks} />
      <EstudioMission {...estudioContent.mission} />
      <EstudioHistory {...estudioContent.history} />
      <EstudioTestimonials {...estudioContent.testimonials} />
      <EstudioCtaBanner {...estudioContent.ctaBanner} />
      <EstudioLinks {...estudioContent.links} />
      <EstudioFooter />
    </main>
  );
}
