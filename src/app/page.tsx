import ExperienceCanvas from '@/components/ExperienceCanvas';
import HUD from '@/components/HUD';

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <ExperienceCanvas />
      <HUD />
    </main>
  );
}
