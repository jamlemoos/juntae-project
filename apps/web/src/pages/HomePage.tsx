import { HomeCreateIdea } from '../components/home/HomeCreateIdea';
import { HomeHero } from '../components/home/HomeHero';
import { HomeHowItWorks } from '../components/home/HomeHowItWorks';
import { HomeManifesto } from '../components/home/HomeManifesto';

export function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeManifesto />
      <HomeHowItWorks />
      <HomeCreateIdea />
    </>
  );
}
