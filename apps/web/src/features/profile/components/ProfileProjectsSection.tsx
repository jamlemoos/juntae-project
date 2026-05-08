import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { useMyProjectsQuery } from '../../projects/hooks/useProjectsQuery';
import { ApiProjectCard } from '../../projects/components/ApiProjectCard';

export function ProfileProjectsSection() {
  const { data: projects, isLoading } = useMyProjectsQuery();

  if (isLoading) {
    return <div className="py-6 text-center text-[13px] text-mute">Carregando projetos…</div>;
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line-2 bg-cream-2/50 p-6 md:p-7">
        <div className="display text-[20px] font-semibold leading-tight text-ink">
          Você ainda não criou nenhum projeto.
        </div>
        <p className="serif italic mt-3 max-w-[52ch] text-[16px] leading-[1.55] text-ink-2">
          Crie o seu projeto ou entre em um que já está acontecendo.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Link
            to="/projects/new"
            className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-primary-hover active:bg-primary-active"
          >
            Criar projeto
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
          <Link
            to="/projects"
            className="inline-flex cursor-pointer items-center rounded-full px-5 py-2.5 text-[14px] font-medium text-ink ring-1 ring-line transition-colors hover:bg-cream-2"
          >
            Explorar projetos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {projects.map((project) => (
        <ApiProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
