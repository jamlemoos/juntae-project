import { Link } from '@tanstack/react-router';
import { Plus } from 'lucide-react';
import { useProjectDrafts } from '../features/projects/hooks/useProjectDrafts';
import { useInfiniteMyProjectsQuery } from '../features/projects/hooks/useProjectsQuery';
import { ProjectListCard } from '../features/projects/components/ProjectListCard';
import { ApiProjectCard } from '../features/projects/components/ApiProjectCard';
import { SectionLayout } from '../shared/ui/SectionLayout';

export function ProjectsPage() {
  const localDraftProjects = useProjectDrafts();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending, isError } =
    useInfiniteMyProjectsQuery(20);
  const ownedProjects = data?.pages.flat() ?? [];

  return (
    <div className="flex min-h-screen flex-col bg-cream">
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

      <section className="flex-1 bg-cream">
        <div className="mx-auto max-w-[1200px] px-6 pb-24">
          {localDraftProjects.length > 0 && (
            <SectionLayout eyebrow="01 · rascunhos" title="Meus rascunhos" divider={false}>
              <div className="flex flex-col gap-3">
                {localDraftProjects.map(({ id, data }) => (
                  <ProjectListCard key={id} id={id} data={data} status={data.publishStatus} />
                ))}
              </div>
            </SectionLayout>
          )}

          <SectionLayout
            eyebrow={localDraftProjects.length > 0 ? '02 · publicados' : '01 · publicados'}
            title="Projetos publicados"
            divider={localDraftProjects.length > 0}
          >
            {isPending ? (
              <p className="text-[14px] text-mute">Carregando...</p>
            ) : isError ? (
              <p className="text-[14px] text-mute">
                Não foi possível carregar os projetos. Tente novamente.
              </p>
            ) : ownedProjects.length === 0 ? (
              <div className="rounded-xl border border-dashed hairline px-6 py-10 text-center">
                <p className="text-[14px] text-ink-2">Você ainda não publicou nenhum projeto.</p>
                <p className="mt-1.5 text-[13px] text-mute">
                  Seus projetos aparecerão aqui quando estiverem prontos para receber pessoas.
                </p>
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
                {ownedProjects.map((project) => (
                  <ApiProjectCard key={project.id} project={project} />
                ))}
                {hasNextPage && (
                  <button
                    type="button"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="mt-2 self-center rounded-full border border-line-2 px-5 py-2 text-[13px] font-medium text-ink transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-line-2 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
                  >
                    {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
                  </button>
                )}
              </div>
            )}
          </SectionLayout>
        </div>
      </section>
    </div>
  );
}
