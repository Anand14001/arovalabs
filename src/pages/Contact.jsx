import ContactHero from '../components/contact/ContactHero';
import ContactChannels from '../components/contact/ContactChannels';
import HomeCollectionCTA from '../components/contact/HomeCollectionCTA';
import LocationsSection from '../components/contact/LocationsSection';

/*
 * /contact-us/
 *
 * Rebuilt from the ground up. The reference page was a gradient banner, three
 * centred icon cards, a form beside a photograph and a map iframe pointed at
 * the London Eye — four blocks with no relationship to each other.
 *
 * The sequence now follows what someone came to do, in the order the questions
 * occur, and each section takes a different shape so the page has a rhythm
 * rather than a repeated template:
 *
 *   1. Hero          photograph bleeding off the left edge, the form itself on
 *                    the right. The first screen is the thing you came for.
 *   2. Channels      the direct routes on a descending stagger — phone,
 *                    WhatsApp, email, the main laboratory.
 *   3. Home collection  the one full-colour field, answering "I can't come in".
 *   4. Locations     the close: tabs, one full-width map, a detail card.
 *
 * Every address, number, hour, link and line of copy is the site's own. Two
 * things are deliberately absent: a contact FAQ, because the only FAQ content
 * in the project has placeholder answers (one patient testimonial repeated
 * under six unrelated questions), and any operating-hours table beyond the
 * per-laboratory hours the data actually carries.
 */
export default function Contact() {
  return (
    <>
      <ContactHero />
      <ContactChannels />
      <HomeCollectionCTA />
      <LocationsSection />
    </>
  );
}
