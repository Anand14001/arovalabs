import AboutHero from '../components/about/AboutHero';
import CorePurpose from '../components/about/CorePurpose';
import LeadershipStory from '../components/about/LeadershipStory';
import Accreditations from '../components/about/Accreditations';
import AboutLocations from '../components/about/AboutLocations';
import Testimonials from '../components/Testimonials';

/*
 * /about-us/
 *
 * Rebuilt from the ground up. The reference page was seven sections of one
 * shape — centred heading, grid of white cards, repeat — under a gradient
 * banner, which gave a founding story, a set of accreditations and a list of
 * feature bullets exactly the same weight.
 *
 * It now reads as an argument, each movement shaped by what it has to prove:
 *
 *   Claim      the headline, with the three Arova Advantage figures banded
 *              directly beneath it. The evidence arrives with the claim.
 *   Purpose    vision and mission at the size statements of intent deserve,
 *              divided by a hairline rather than boxed in cards.
 *   Story      the founder, the 1995 founding and the second generation now
 *              running it — a sticky portrait against scrolling history, with
 *              the NABL certificate at artifact size beside it.
 *   Proof      the four accreditations as image-led tiles, with the four
 *              supporting reasons as a quieter divided row underneath, so
 *              credentials and claims don't look alike.
 *   Patients   the verified Google reviews.
 *   Network    the six laboratories as a numbered index.
 *
 * Every figure, name, paragraph, address and certificate is the site's own. Two
 * deliberate changes: the hero's two buttons, which point at "#" on the
 * reference and therefore do nothing, now jump to the sections of this page
 * that answer them; and the laboratories are an index here rather than a second
 * copy of the interactive finder that /contact-us/ owns.
 */
export default function About() {
  return (
    <>
      <AboutHero />
      <CorePurpose />
      <LeadershipStory />
      <Accreditations />
      <Testimonials />
      <AboutLocations />
    </>
  );
}
