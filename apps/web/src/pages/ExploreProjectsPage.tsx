import { Link } from '@tanstack/react-router';
import { useProjectsQuery } from '../features/projects/hooks/useProjectsQuery';
import { useProjectDrafts } from '../features/projects/hooks/useProjectDrafts';
import { ApiProjectCard } from '../features/projects/components/ApiProjectCard';
import { ProjectListCard } from '../features/projects/components/ProjectListCard';
import { SectionLayout } from '../shared/ui/SectionLayout';

export function ExploreProjectsPage() {
  const { data: projects = [], isPending, isError } = useProjectsQuery({ page: 1, limit: 20 });
  const storedProjects = useProjectDrafts();
  const localPublishedProjects = storedProjects.filter(
    ({ data }) => data.publishStatus === 'published'
  );

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
            {isPending ? (
              <p className="text-[14px] text-mute">Carregando...</p>
            ) : isError ? (
              <p className="text-[14px] text-mute">
                Não foi possível carregar os projetos. Tente novamente.
              </p>
            ) : projects.length === 0 ? (
              <div className="rounded-xl border border-dashed hairline px-6 py-12 text-center">
                <p className="text-[16px] font-medium text-ink">
                  Ainda não há projetos publicados.
                </p>
                <p className="mx-auto mt-2 max-w-[44ch] text-[14px] leading-relaxed text-mute">
                  Seja o primeiro a publicar um projeto e encontrar pessoas para construir junto.
                </p>
                <Link
                  to="/projects/new"
                  className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-2.5 text-[14px] font-medium text-cream transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-line-2 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
                >
                  Começar um projeto
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {projects.map((project) => (
                  <ApiProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </SectionLayout>

          {localPublishedProjects.length > 0 && (
            <SectionLayout
              eyebrow="publicados localmente"
              title="Publicados neste navegador"
              divider
            >
              <div className="flex flex-col gap-3">
                <p className="mb-1 text-[13px] text-mute">
                  Estes projetos publicados estão salvos apenas neste navegador. Eles aparecem
                  separadamente porque a seção acima mostra apenas os projetos disponíveis pela API.
                </p>
                {localPublishedProjects.map(({ id, data }) => (
                  <ProjectListCard key={id} id={id} data={data} status={data.publishStatus} />
                ))}
              </div>
            </SectionLayout>
          )}
        </div>
      </section>
    </div>
  );
}
