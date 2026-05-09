import { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { useInfiniteProjectsQuery } from '../features/projects/hooks/useProjectsQuery';
import { ApiProjectCard } from '../features/projects/components/ApiProjectCard';
import { SectionLayout } from '../shared/ui/SectionLayout';
import type { ProjectSearchFilter } from '../features/projects/api/types';

const STATUS_FILTER_OPTIONS: { label: string; value: string | undefined }[] = [
  { label: 'Todos', value: undefined },
  { label: 'Abertos', value: 'OPEN' },
  { label: 'Fechados/indisponíveis', value: 'IN_PROGRESS,CLOSED' },
];

export function ExploreProjectsPage() {
  const [searchInput, setSearchInput] = useState('');
  const [debouncedQ, setDebouncedQ] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQ(searchInput.trim()), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const hasFilters = !!debouncedQ || !!statusFilter;

  const filters: ProjectSearchFilter | undefined = hasFilters
    ? {
        ...(debouncedQ ? { q: debouncedQ } : {}),
        ...(statusFilter ? { status: statusFilter } : {}),
      }
    : undefined;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending, isError } =
    useInfiniteProjectsQuery(20, filters);
  const projects = data?.pages.flat() ?? [];

  function clearFilters() {
    setSearchInput('');
    setDebouncedQ('');
    setStatusFilter(undefined);
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <section className="relative overflow-hidden paper-tex">
        <div className="mx-auto max-w-[1200px] px-6 pb-10 pt-14">
          <div className="mb-7 flex items-center gap-3">
            <div className="mono text-[11px] uppercase tracking-[.22em] text-mute">explorar</div>
            <span className="h-px w-8 bg-line-2" />
            <span className="serif italic text-[14px] text-mute">projetos publicados</span>
          </div>

          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-8">
              <h1 className="display text-[44px] font-bold leading-[1.05] text-ink md:text-[56px]">
                Encontre projetos para construir junto
              </h1>
              <p className="mt-4 max-w-[52ch] text-[16.5px] leading-[1.6] text-ink-2">
                Explore projetos publicados pela comunidade e encontre onde contribuir.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="flex-1 bg-cream">
        <div className="mx-auto max-w-[1200px] px-6 pb-24">
          <SectionLayout
            eyebrow="projetos publicados"
            title="Projetos publicados"
            id="published-projects"
            divider={false}
          >
            <div className="mb-6 flex flex-col gap-3">
              <input
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Buscar projetos..."
                className="w-full max-w-md rounded-lg border border-line-2 bg-cream px-4 py-2.5 text-[14px] text-ink placeholder:text-mute focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <div className="flex flex-wrap items-center gap-2">
                {STATUS_FILTER_OPTIONS.map((option) => (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => setStatusFilter(option.value)}
                    className={`rounded-full border px-4 py-1.5 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                      statusFilter === option.value
                        ? 'border-primary/40 bg-primary/10 text-primary'
                        : 'border-line-2 bg-cream text-ink-2 hover:border-primary/30 hover:text-primary'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
                {hasFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="rounded-full border border-line-2 px-4 py-1.5 text-[13px] text-mute transition-colors hover:border-line hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    Limpar filtros
                  </button>
                )}
              </div>
            </div>

            {isPending ? (
              <p className="text-[14px] text-mute">Carregando...</p>
            ) : isError ? (
              <p className="text-[14px] text-mute">
                Não foi possível carregar os projetos. Tente novamente.
              </p>
            ) : projects.length === 0 ? (
              <div className="rounded-xl border border-dashed hairline px-6 py-12 text-center">
                {hasFilters ? (
                  <>
                    <p className="text-[16px] font-medium text-ink">Nenhum projeto encontrado.</p>
                    <p className="mx-auto mt-2 max-w-[44ch] text-[14px] leading-relaxed text-mute">
                      Tente ajustar os filtros ou buscar com outros termos.
                    </p>
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="mt-6 inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-line-2 px-5 py-2.5 text-[14px] font-medium text-ink transition-colors hover:border-primary/30 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                      Limpar filtros
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-[16px] font-medium text-ink">
                      Ainda não há projetos publicados.
                    </p>
                    <p className="mx-auto mt-2 max-w-[44ch] text-[14px] leading-relaxed text-mute">
                      Seja o primeiro a publicar um projeto e encontrar pessoas para construir
                      junto.
                    </p>
                    <Link
                      to="/projects/new"
                      className="mt-6 inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-primary-hover active:bg-primary-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                      Começar um projeto
                    </Link>
                  </>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {projects.map((project) => (
                  <ApiProjectCard key={project.id} project={project} />
                ))}
                {hasNextPage && (
                  <button
                    type="button"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="mt-2 cursor-pointer self-center rounded-full border border-line-2 px-5 py-2 text-[13px] font-medium text-ink transition-colors hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
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
