export default function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="border-b border-gray-100 px-6 py-4 flex items-center justify-between max-w-5xl mx-auto">
        <span className="font-semibold text-lg tracking-tight">Juntaê</span>
        <nav className="flex gap-6 text-sm text-gray-500">
          <a href="#about" className="hover:text-gray-900 transition-colors">
            Sobre
          </a>
          <a href="#how" className="hover:text-gray-900 transition-colors">
            Como funciona
          </a>
        </nav>
      </header>

      <main>
        <section className="max-w-5xl mx-auto px-6 py-24 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-6">
            Monte seu time. <span className="text-violet-600">Construa projetos reais.</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
            Juntaê conecta pessoas com habilidades complementares para formar times em hackathons,
            startups e projetos de impacto no Rio Grande do Norte.
          </p>
          <div className="flex justify-center gap-4">
            <button
              type="button"
              className="bg-violet-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-violet-700 transition-colors"
            >
              Criar conta
            </button>
            <button
              type="button"
              className="border border-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:border-gray-400 transition-colors"
            >
              Ver projetos
            </button>
          </div>
        </section>

        <section id="how" className="bg-gray-50 py-20">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Como funciona</h2>
            <ol className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              {steps.map((step) => (
                <li key={step.number} className="flex flex-col items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-violet-100 text-violet-600 font-bold flex items-center justify-center text-lg">
                    {step.number}
                  </span>
                  <h3 className="font-semibold text-gray-900">{step.title}</h3>
                  <p className="text-sm text-gray-500">{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="about" className="max-w-5xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Por que o Juntaê?</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Boas ideias não faltam. O que falta é o time certo para executá-las. O Juntaê existe
            para que nenhum projeto fique parado por falta de pessoas.
          </p>
        </section>
      </main>

      <footer className="border-t border-gray-100 px-6 py-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Juntaê
      </footer>
    </div>
  );
}

const steps = [
  {
    number: 1,
    title: 'Crie seu perfil',
    description: 'Cadastre suas habilidades e áreas de interesse.',
  },
  {
    number: 2,
    title: 'Encontre projetos',
    description: 'Explore projetos abertos e vagas disponíveis.',
  },
  {
    number: 3,
    title: 'Monte seu time',
    description: 'Candidate-se ou convide pessoas para o seu projeto.',
  },
];
