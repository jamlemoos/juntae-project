import { Link } from '@tanstack/react-router';
import { Plus } from 'lucide-react';
import { useProjectDrafts } from '../features/projects/hooks/useProjectDrafts';
import { ProjectListCard } from '../features/projects/components/ProjectListCard';
import { SectionLayout } from '../shared/ui/SectionLayout';

export function ProjectsPage() {
  const drafts = useProjectDrafts();

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden paper-tex">
        <div className="mx-auto max-w-[1200px] px-6 pb-10 pt-14">
          <div className="mb-7 flex items-center gap-3">
            <div className="mono text-[11px] uppercase tracking-[.22em] text-mute">projetos</div>
            <span className="h-px w-8 bg-line-2" />
            <span className="serif italic text-[14px] text-mute">construindo em equipe</span>
          </div>

          <div className="grid grid-cols-12 items-end gap-8">
            <div className="col-span-12 lg:col-span-8">
              <h1 className="display text-[44px] font-bold leading-[1.05] text-ink md:text-[56px]">
                Projetos
              </h1>
              <p className="mt-4 max-w-[52ch] text-[16.5px] leading-[1.6] text-ink-2">
                Seus projetos, rascunhos e ideias que você está construindo.
              </p>
            </div>
            <div className="col-span-12 lg:col-span-4 lg:text-right">
              <Link
                to="/projects/new"
                className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[14px] font-medium text-cream transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-line-2 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
              >
                <Plus size={15} aria-hidden="true" />
                Começar projeto
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Body ── */}
      <section className="flex-1 bg-cream">
        <div className="mx-auto max-w-[1200px] px-6 pb-24">
          <SectionLayout eyebrow="01 · rascunhos" title="Meus rascunhos" divider={false}>
            {drafts.length === 0 ? (
              <div className="rounded-xl border border-dashed hairline px-6 py-10 text-center">
                <p className="text-[14px] text-ink-2">Você ainda não começou nenhum projeto.</p>
                <Link
                  to="/projects/new"
                  className="mt-4 inline-flex items-center gap-1.5 text-[13px] text-accent transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-line-2 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
                >
                  <Plus size={13} aria-hidden="true" />
                  Começar projeto
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {drafts.map(({ id, data }) => (
                  <ProjectListCard key={id} id={id} data={data} status="draft" />
                ))}
              </div>
            )}
          </SectionLayout>

          <SectionLayout eyebrow="02 · publicados" title="Projetos publicados" divider>
            <div className="rounded-xl border border-dashed hairline px-6 py-10 text-center">
              <p className="text-[14px] text-ink-2">Você ainda não publicou nenhum projeto.</p>
              <p className="mt-1.5 text-[13px] text-mute">
                Seus projetos aparecerão aqui quando estiverem prontos para receber pessoas.
              </p>
            </div>
          </SectionLayout>
        </div>
      </section>
    </div>
  );
}
