import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Comece por aqui — Jovem Aprendiz",
  description:
    "Entenda requisitos, benefícios, cargos, currículo e dress code para se tornar Jovem Aprendiz antes de buscar vagas."
};

export default function LandingPage() {
  return (
    <div className="space-y-6 pb-6">
      <section className="relative -mx-4 mt-[-1rem] h-[70vh] max-h-[720px] overflow-hidden rounded-b-3xl bg-slate-900 shadow-soft">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/hero-jab.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/30 to-black/70" />

        <div className="relative flex h-full flex-col justify-end px-6 pb-10 pt-24 text-center text-white">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-sky-100">
            Programa Jovem Aprendiz
          </p>
          <h1 className="mt-3 text-xl font-semibold leading-tight tracking-tight">
            Entenda tudo sobre o programa Jovem Aprendiz e conquiste seu emprego.
          </h1>
          <p className="mt-3 text-sm text-slate-100">
            Veja os requisitos, benefícios, cargos mais comuns e dicas práticas antes de se candidatar.
          </p>
          <div className="mt-4 flex flex-col items-center gap-2">
            <Link
              href="#comece"
              className="inline-flex min-w-[11rem] items-center justify-center rounded-full bg-sky-500 px-8 py-3 text-sm font-semibold text-white shadow-soft hover:bg-sky-600"
            >
              COMEÇE
            </Link>
            <Link
              href="/vagas"
              className="inline-flex items-center justify-center text-xs font-medium text-sky-100 underline underline-offset-4"
            >
              Ir direto para as vagas
            </Link>
          </div>
        </div>
      </section>

      <section
        id="comece"
        className="space-y-3 rounded-xl2 border border-slate-200 bg-white p-4 shadow-soft"
      >
        <h2 className="text-base font-semibold text-slate-900">
          1. Requisitos para ser Jovem Aprendiz
        </h2>
        <details className="group rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm open:bg-white">
          <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-slate-800">
            Ver requisitos mínimos
            <span className="text-xs text-slate-500 group-open:rotate-180">⌄</span>
          </summary>
          <div className="mt-2 space-y-2 text-sm text-slate-700">
            <p>
              <strong>Escolaridade:</strong> Ensino fundamental ou médio completo ou em andamento.
            </p>
            <p>
              <strong>Idade:</strong> entre 14 e 24 anos.
            </p>
            <p className="text-xs text-slate-500">
              Esses são os requisitos mínimos. As empresas podem acrescentar critérios como pacote Office,
              responsabilidade, comprometimento e interesse, sempre dentro da lei.
            </p>
          </div>
        </details>
      </section>

      <section className="space-y-3 rounded-xl2 border border-amber-300 bg-amber-100 p-4 shadow-soft">
        <h2 className="text-base font-semibold text-slate-900">2. Benefícios do programa</h2>
        <p className="text-sm text-slate-800">
          Como Jovem Aprendiz, você tem direitos trabalhistas e formação profissional dentro da empresa e no
          curso de capacitação.
        </p>
        <div className="grid grid-cols-2 gap-3 text-center text-xs font-semibold text-slate-900">
          <div className="space-y-1 rounded-full bg-amber-50 px-3 py-3">
            <p>Benefícios da CLT</p>
            <p className="text-[11px] font-normal text-slate-700">
              FGTS, INSS, 13º, férias, vale‑transporte e mais.
            </p>
          </div>
          <div className="space-y-1 rounded-full bg-amber-50 px-3 py-3">
            <p>Curso de capacitação</p>
            <p className="text-[11px] font-normal text-slate-700">
              Formação gratuita e obrigatória.
            </p>
          </div>
          <div className="space-y-1 rounded-full bg-amber-50 px-3 py-3">
            <p>Jornada reduzida</p>
            <p className="text-[11px] font-normal text-slate-700">
              Entre 4 e 6 horas diárias.
            </p>
          </div>
          <div className="space-y-1 rounded-full bg-amber-50 px-3 py-3">
            <p>Remuneração</p>
            <p className="text-[11px] font-normal text-slate-700">
              Compatível com a jornada de trabalho.
            </p>
          </div>
          <div className="space-y-1 rounded-full bg-amber-50 px-3 py-3">
            <p>Vale transporte</p>
            <p className="text-[11px] font-normal text-slate-700">
              Sempre garantido em vagas de aprendiz.
            </p>
          </div>
          <div className="space-y-1 rounded-full bg-amber-50 px-3 py-3">
            <p>Treinamento</p>
            <p className="text-[11px] font-normal text-slate-700">
              Vivência prática na rotina da empresa.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-3 rounded-xl2 border border-slate-200 bg-white p-4 shadow-soft">
        <h2 className="text-base font-semibold text-slate-900">3. Cargos e funções do aprendiz</h2>
        <p className="text-sm text-slate-700">
          Cada área tem atividades diferentes, mas todas têm algo em comum: aprender fazendo.
        </p>
        <div className="space-y-2 text-sm">
          {[
            "Administrativo",
            "Assistente de Vendas",
            "Atendente de Loja",
            "Auxiliar de Produção",
            "Auxiliar de Serviços Gerais",
            "Marketing",
            "Qualidade",
            "Recursos Humanos",
            "Financeiro",
            "Logística",
            "Operador de Caixa",
            "Operador de Loja",
            "Recepcionista",
            "TI"
          ].map((area) => (
            <details
              key={area}
              className="group rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 open:bg-white"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-slate-800">
                Jovem Aprendiz {area}
                <span className="text-xs text-slate-500 group-open:rotate-180">⌄</span>
              </summary>
              {area === "TI" ? (
                <div className="mt-2 space-y-1 text-sm text-slate-700">
                  <p>
                    Na área de Tecnologia da Informação, o jovem aprendiz de TI apoia em manutenção de
                    equipamentos, suporte técnico e gestão de sistemas.
                  </p>
                  <p className="text-[13px]">
                    <strong>Habilidades necessárias:</strong> informática e pacote Office, atenção a problemas
                    técnicos, lógica para resolver situações e proatividade.
                  </p>
                </div>
              ) : (
                <p className="mt-2 text-sm text-slate-700">
                  Atuação de apoio na área de {area.toLowerCase()}, aprendendo rotinas do setor com
                  acompanhamento de profissionais experientes.
                </p>
              )}
            </details>
          ))}
        </div>
      </section>

      <section className="space-y-3 rounded-xl2 border border-slate-200 bg-white p-4 shadow-soft">
        <h2 className="text-base font-semibold text-slate-900">
          4. Como criar um currículo para Jovem Aprendiz
        </h2>
        <p className="text-sm text-slate-700">
          O currículo deve alinhar seu perfil ao cargo de interesse. Como o foco é primeiro emprego, a
          clareza do objetivo conta muito.
        </p>
        <ul className="list-disc space-y-1 pl-4 text-sm text-slate-700">
          <li>Use um objetivo direto, por exemplo: “Jovem Aprendiz Administrativo”.</li>
          <li>Liste sua escolaridade e cursos rápidos (online ou presenciais).</li>
          <li>Destaque habilidades como responsabilidade, organização e vontade de aprender.</li>
          <li>Mantenha o visual limpo, com boa leitura e sem exageros.</li>
        </ul>
        <div className="mt-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-6 text-center text-xs text-slate-500">
          Espaço para imagem ilustrativa de currículo limpo e organizado (exemplo para cargo administrativo).
        </div>
      </section>

      <section className="space-y-3 rounded-xl2 border border-slate-200 bg-white p-4 shadow-soft">
        <h2 className="text-base font-semibold text-slate-900">5. Dress code (como se vestir)</h2>
        <p className="text-sm text-slate-700">
          Aposte em roupas básicas, limpas e confortáveis. Algumas empresas terão uniforme, outras apenas um
          estilo social casual.
        </p>
        <div className="grid grid-cols-2 gap-3 text-xs text-slate-800">
          <div className="space-y-1 rounded-xl bg-slate-50 p-3 text-center">
            <p className="font-semibold">Básico</p>
            <p className="text-[11px] text-slate-600">
              Calça jeans sem rasgos, camiseta lisa e tênis limpo.
            </p>
          </div>
          <div className="space-y-1 rounded-xl bg-slate-50 p-3 text-center">
            <p className="font-semibold">Mais formal</p>
            <p className="text-[11px] text-slate-600">
              Calça social, camisa ou blusa neutra e sapato fechado.
            </p>
          </div>
        </div>
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-4 text-center text-xs text-slate-500">
          Espaço para exemplos visuais de looks básicos e formais.
        </div>
      </section>

      <section className="space-y-3 rounded-xl2 border border-slate-200 bg-sky-50 p-4 shadow-soft">
        <h2 className="text-base font-semibold text-slate-900">6. Próximo passo</h2>
        <p className="text-sm text-slate-700">
          Depois de entender o programa, você pode buscar vagas e entrar para a comunidade de apoio.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            href="/vagas"
            className="inline-flex flex-1 items-center justify-center rounded-full bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-soft hover:bg-sky-700"
          >
            Buscar vagas de Jovem Aprendiz
          </Link>
          <Link
            href="/comunidade"
            className="inline-flex flex-1 items-center justify-center rounded-full border border-sky-200 bg-white px-4 py-3 text-sm font-semibold text-sky-700 hover:bg-sky-50"
          >
            Grupos e comunidade
          </Link>
        </div>
      </section>
    </div>
  );
}

