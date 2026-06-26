import React, { useState } from 'react';
import { AdBlock } from './AdBlock';

type TabType = 'trilha' | 'cargos' | 'preparacao' | 'buscar';

interface Slide {
  title: string;
  emoji: string;
  description: string;
  bullets: string[];
  question: string;
  options: string[];
  correctAnswer: number;
}

interface CargoInfo {
  title: string;
  description: string;
  skills: string[];
}

interface PerguntaEntrevista {
  id: number;
  question: string;
  answer: string;
}

export const Guide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('trilha');
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [trilhaConcluida, setTrilhaConcluida] = useState<boolean>(false);
  const [expandedCargo, setExpandedCargo] = useState<string | null>(null);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  // Controle de Progresso Linear (Desbloqueio de Abas)
  // Nível 1: Trilha
  // Nível 2: Cargos
  // Nível 3: Preparação (Currículo & Entrevista)
  // Nível 4: Buscar Vagas
  const [unlockedLevel, setUnlockedLevel] = useState<number>(1);

  // Estados do Quiz
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Definição dos Slides do Mini Curso com Perguntas do Quiz
  const slides: Slide[] = [
    {
      title: 'O que é o Jovem Aprendiz?',
      emoji: '🌱',
      description: 'Uma iniciativa do governo federal (Lei nº 10.097/2000) criada para integrar estudantes ao mercado corporativo de forma segura. O foco está no aprendizado inicial do trabalho.',
      bullets: [
        'Une prática na empresa com teoria em cursos.',
        'Carteira de Trabalho assinada desde o primeiro dia.',
        'Prioridade para alunos da rede pública de ensino.'
      ],
      question: 'Qual é o principal objetivo do Programa Jovem Aprendiz?',
      options: [
        'Fornecer mão de obra barata para as empresas.',
        'Unir o aprendizado prático na empresa com o estudo teórico.',
        'Substituir funcionários experientes por profissionais mais jovens.'
      ],
      correctAnswer: 1
    },
    {
      title: 'Quem pode participar?',
      emoji: '🎓',
      description: 'O programa é focado em jovens que estão ingressando no mercado e precisam de flexibilidade para continuar estudando.',
      bullets: [
        'Ter idade entre 14 e 24 anos incompletos.',
        'A idade máxima não se aplica a pessoas com deficiência.',
        'Contrato temporário de trabalho de no máximo 2 anos.'
      ],
      question: 'Qual é a faixa etária padrão para participar do programa Jovem Aprendiz?',
      options: [
        'De 10 a 16 anos incompletos.',
        'De 14 a 24 anos incompletos (sem limite para PCD).',
        'Qualquer idade a partir de 18 anos completos.'
      ],
      correctAnswer: 1
    },
    {
      title: 'Requisitos Escolares',
      emoji: '🏫',
      description: 'A educação formal é prioridade número um. A lei protege seu rendimento escolar a todo custo.',
      bullets: [
        'Estar matriculado e frequentando o Ensino Fundamental ou Médio.',
        'Jovens que já concluíram o Ensino Médio também podem participar.',
        'Faltas sem justificativa na escola podem causar a rescisão do contrato.'
      ],
      question: 'O que acontece se o Jovem Aprendiz abandonar ou tiver muitas faltas na escola?',
      options: [
        'O contrato de aprendizagem pode ser rescindido (demissão).',
        'A empresa dobra a sua jornada prática para compensar.',
        'Não há interferência, pois a escola não tem relação com o trabalho.'
      ],
      correctAnswer: 0
    },
    {
      title: 'Seus Direitos (Benefícios CLT)',
      emoji: '⚖️',
      description: 'Como aprendiz, você é amparado pela CLT e possui direitos garantidos por lei que trazem estabilidade financeira.',
      bullets: [
        'Salário-mínimo hora proporcional à sua escala.',
        'Férias remuneradas (obrigatoriamente batendo com o recesso escolar).',
        'FGTS com alíquota reduzida de 2% recolhida pelo contratante.'
      ],
      question: 'Qual é a taxa (alíquota) de FGTS recolhida pela empresa para o Jovem Aprendiz?',
      options: [
        '8% (igual ao funcionário CLT comum).',
        '2% (alíquota reduzida e protegida por lei).',
        'Não há recolhimento de FGTS para contratos de aprendiz.'
      ],
      correctAnswer: 1
    },
    {
      title: 'Sua Jornada de Trabalho',
      emoji: '🕒',
      description: 'A carga de trabalho prática na empresa é reduzida para que você mantenha uma boa rotina de estudos.',
      bullets: [
        'Limite máximo de 6 horas diárias para estudantes.',
        'Escala de até 8 horas permitida apenas se já concluiu o Ensino Médio.',
        'Intervalo de almoço e descanso obrigatório por lei (não computado na carga).'
      ],
      question: 'Qual é a jornada diária máxima permitida para o aprendiz que ainda estuda?',
      options: [
        '4 horas diárias.',
        '6 horas diárias.',
        '8 horas diárias.'
      ],
      correctAnswer: 1
    },
    {
      title: 'O Curso de Capacitação',
      emoji: '📚',
      description: 'Pelo menos um dia na semana é reservado para aulas teóricas gratuitas administradas por agências parceiras.',
      bullets: [
        'Aulas no SENAI, SENAC, CIEE, ESPRO, entre outras.',
        'O curso técnico/teórico é pago inteiramente pela empresa.',
        'Faltas no curso contam como falta no trabalho e descontam do salário.'
      ],
      question: 'Quem é o responsável por custear a formação teórica (curso) do Jovem Aprendiz?',
      options: [
        'O próprio estudante, através de mensalidade reduzida.',
        'A empresa que contratou o Jovem Aprendiz.',
        'A escola pública onde o jovem está matriculado.'
      ],
      correctAnswer: 1
    },
    {
      title: 'O Processo de Seleção',
      emoji: '🛣️',
      description: 'As etapas de recrutamento servem para as empresas conhecerem suas motivações pessoais e seu perfil.',
      bullets: [
        'Envio de currículo (geralmente focado em habilidades e objetivos).',
        'Testes básicos (português, lógica) e dinâmicas de grupo.',
        'Entrevista com o setor de RH e, no final, com o gestor da vaga.'
      ],
      question: 'Qual etapa do processo seletivo costuma decidir a contratação do Jovem Aprendiz?',
      options: [
        'O envio inicial do currículo no site.',
        'A entrevista final com o gestor responsável pelo setor.',
        'A dinâmica de grupo inicial para quebra-gelo.'
      ],
      correctAnswer: 1
    },
    {
      title: 'Suas Responsabilidades',
      emoji: '🎯',
      description: 'Essa é a porta de entrada para a sua efetivação profissional. As empresas observam muito a sua atitude e vontade.',
      bullets: [
        'Demonstrar interesse, proatividade e evitar ficar muito passivo.',
        'Ser extremamente pontual e zelar pelas normas de vestimenta e ética.',
        'Manter boas notas na escola e assiduidade no curso e na empresa.'
      ],
      question: 'Qual comportamento e postura profissional a empresa mais espera do Jovem Aprendiz?',
      options: [
        'Saber fazer todas as atividades complexas sozinho sem perguntar nada.',
        'Ficar em silêncio na sua mesa de trabalho e evitar novas responsabilidades.',
        'Demonstrar proatividade, pontualidade e muita vontade de aprender.'
      ],
      correctAnswer: 2
    }
  ];

  // Dados dos Cargos
  const cargos: CargoInfo[] = [
    {
      title: 'Jovem Aprendiz Administrativo',
      description: 'O jovem aprendiz administrativo desempenha funções essenciais nos escritórios, aprendendo a organizar documentos, elaborar relatórios, utilizar softwares de escritório, e apoiar diversas atividades administrativas no dia a dia da empresa.',
      skills: ['Conhecimentos básicos de informática e pacote Office.', 'Boa comunicação escrita e verbal.', 'Organização and atenção aos detalhes.']
    },
    {
      title: 'Jovem Aprendiz Assistente de Vendas',
      description: 'No papel de assistente de vendas, o aprendiz auxilia nas atividades relacionadas ao atendimento ao cliente, organização de produtos, reposição de estoque e apoio às estratégias de vendas.',
      skills: ['Boa comunicação interpessoal.', 'Proatividade.', 'Habilidade em lidar com o público.']
    },
    {
      title: 'Jovem Aprendiz Atendente de Loja',
      description: 'Atuando no varejo, o jovem aprendiz atendente de loja realiza tarefas como recepção de clientes, auxílio na organização de produtos, e oferece suporte no processo de vendas.',
      skills: ['Comunicação eficaz.', 'Cordialidade.', 'Iniciativa.']
    },
    {
      title: 'Jovem Aprendiz Auxiliar de Produção',
      description: 'O aprendiz auxiliar de produção atua nas linhas de produção fabris e industriais, aprendendo a operar máquinas sob supervisão, realizar montagens, conferir produtos e zelar pela qualidade e eficiência dos processos.',
      skills: ['Agilidade.', 'Atenção aos detalhes.', 'Trabalho em equipe.']
    },
    {
      title: 'Jovem Aprendiz Auxiliar de Serviços Gerais',
      description: 'Nessa função, o jovem aprendiz realiza atividades de apoio à limpeza, organização e manutenção de espaços físicos, contribuindo diretamente para o bom funcionamento do ambiente de trabalho.',
      skills: ['Responsabilidade.', 'Proatividade.', 'Aprendizagem rápida.']
    },
    {
      title: 'Jovem Aprendiz de Marketing',
      description: 'Atuando no setor de marketing ou comunicação, o aprendiz contribui para a criação de conteúdos simples para redes sociais, monitoramento de interações digitais e apoio na execução de campanhas publicitárias.',
      skills: ['Criatividade.', 'Conhecimentos em redes sociais.', 'Conhecimento em informática.', 'Boa comunicação.']
    },
    {
      title: 'Jovem Aprendiz de Qualidade',
      description: 'Na área de controle de qualidade, o aprendiz auxilia na inspeção de produtos ou serviços, organização de relatórios de conformidade e implementação de padrões de qualidade nas operações.',
      skills: ['Atenção aos detalhes.', 'Organização.', 'Foco em solução de problemas.']
    },
    {
      title: 'Jovem Aprendiz de Recursos Humanos',
      description: 'No setor de Recursos Humanos (RH), o aprendiz contribui em atividades administrativas como triagem inicial de currículos, organização de pastas de funcionários e suporte em processos seletivos e treinamentos.',
      skills: ['Organização.', 'Perfil comunicativo.', 'Extrema discrição.', 'Conhecimento em informática e pacote Office.']
    },
    {
      title: 'Jovem Aprendiz Financeiro',
      description: 'No setor financeiro, o aprendiz desempenha funções de auxílio no controle de contas a pagar/receber, arquivamento físico e digital de comprovantes e suporte em planilhas de faturamento.',
      skills: ['Organização sistemática.', 'Conhecimento em informática e planilhas.', 'Bom raciocínio matemático.']
    },
    {
      title: 'Jovem Aprendiz Logística',
      description: 'Atuando na área logística de centros de distribuição ou estoques, o aprendiz apoia em tarefas como controle de entradas e saídas de mercadorias, movimentação de caixas e operação de sistemas de controle logístico.',
      skills: ['Organização e foco.', 'Raciocínio matemático.', 'Capacidade de solução de problemas rápidos.', 'Conhecimentos em informática e pacote Office.']
    },
    {
      title: 'Jovem Aprendiz Operador de Caixa',
      description: 'O operador de caixa aprendiz atua em supermercados, lojas ou drogarias, realizando transações financeiras, auxiliando na conferência e empacotamento de produtos e prestando atendimento cordial.',
      skills: ['Facilidade com matemática básica.', 'Cordialidade e simpatia.', 'Foco e atenção aos detalhes.']
    },
    {
      title: 'Jovem Aprendiz Operador de Loja',
      description: 'O operador de loja aprendiz trabalha na operação diária das gôndolas e seções comerciais, auxiliando na precificação correta, organização e reposição de produtos nas prateleiras.',
      skills: ['Organização física.', 'Comunicação eficaz.', 'Trabalho em equipe.']
    },
    {
      title: 'Jovem Aprendiz Recepcionista',
      description: 'Como recepcionista, o aprendiz acolhe e direciona visitantes, atende chamadas telefônicas e realiza tarefas administrativas básicas relacionadas ao atendimento na entrada da empresa.',
      skills: ['Excelente comunicação verbal.', 'Cordialidade e postura profissional.', 'Organização.', 'Conhecimento em informática e pacote Office.']
    },
    {
      title: 'Jovem Aprendiz TI',
      description: 'Na área de Tecnologia da Informação, o jovem aprendiz TI apoia na manutenção e formatação básica de computadores, suporte técnico primário aos funcionários e gestão de inventários de hardware.',
      skills: ['Conhecimento prático de informática.', 'Entendimento básico de problemas técnicos.', 'Lógica de resolução de problemas.', 'Proatividade.']
    }
  ];

  // Dados de Entrevistas
  const perguntas: PerguntaEntrevista[] = [
    {
      id: 1,
      question: 'Fale um pouco sobre você.',
      answer: '“Sou uma pessoa dedicada aos estudos e comprometida em alcançar meus objetivos profissionais. Gosto de desafios e estou entusiasmado para começar minha trajetória como Jovem Aprendiz nesta empresa, onde vejo a oportunidade de aprender e crescer.”'
    },
    {
      id: 2,
      question: 'Por que você quer ser um Jovem Aprendiz em nossa empresa?',
      answer: '“Pesquisei sobre a empresa e estou muito impressionado com o compromisso com a inovação e o desenvolvimento de talentos. Acredito que esta oportunidade me permitirá adquirir experiência prática valiosa e contribuir para o sucesso da equipe.”'
    },
    {
      id: 3,
      question: 'Quais são suas principais habilidades e como você acha que elas se encaixam nesta posição?',
      answer: '“Minhas habilidades incluem organização, facilidade de comunicação e rapidez para aprender novas tarefas. Acredito que essas características se alinham com a agilidade exigida pelo setor e me ajudarão a dar suporte eficiente ao time.”'
    },
    {
      id: 4,
      question: 'Como você lida com desafios e situações de pressão?',
      answer: '“Encaro desafios como oportunidades de aprendizado. Em situações de maior pressão, procuro manter a calma, respirar fundo, listar minhas prioridades e focar em resolver um problema por vez, buscando sempre feedback para melhorar.”'
    },
    {
      id: 5,
      question: 'Quais são seus objetivos profissionais e como este programa contribuirá para alcançá-los?',
      answer: '“Meu objetivo é desenvolver competências corporativas sólidas e ter uma base de carreira bem estruturada. Acredito que este programa proporcionará o aprendizado prático e teórico que preciso para crescer profissionalmente.”'
    },
    {
      id: 6,
      question: 'Como você descreveria sua experiência em trabalhar em equipe?',
      answer: '“Participei de projetos escolares em grupo onde a colaboração era essencial. Aprendi a ouvir diferentes opiniões, expressar minhas ideias com respeito e trabalhar focado no objetivo final do grupo, apoiando os colegas quando necessário.”'
    },
    {
      id: 7,
      question: 'Como você planeja equilibrar seus estudos com a rotina de trabalho?',
      answer: '“Tenho uma abordagem organizada para gerenciar meu tempo. Crio cronogramas de estudo semanais e reservo horários específicos para minhas tarefas. Além disso, mantenho uma comunicação transparente na empresa e na escola para garantir o equilíbrio.”'
    },
    {
      id: 8,
      question: 'Você já teve alguma experiência em voluntariado ou atividades extracurriculares?',
      answer: '“Sim, participei de ações na escola e na minha comunidade (como arrecadação de alimentos/grêmio escolar). Isso me ajudou a desenvolver liderança, responsabilidade social e empatia, demonstrando minha vontade de agir e colaborar.”'
    },
    {
      id: 9,
      question: 'Como você se mantém atualizado sobre as tendências do mercado ou da área em que deseja atuar?',
      answer: '“Assisto a palestras online, leio artigos em sites confiáveis e busco realizar cursos livres na internet. Acredito que manter a curiosidade ativa é fundamental para não ficar para trás, mesmo no início da minha carreira.”'
    },
    {
      id: 10,
      question: 'Como você lida com feedback construtivo dos seus superiores?',
      answer: '“Encaro o feedback como a forma mais rápida de crescimento. Ouço com atenção os pontos de melhoria apontados, busco entender o que posso mudar no meu dia a dia e coloco em prática as sugestões imediatamente, agradecendo pela orientação.”'
    }
  ];

  // Links de Plataformas de Vagas
  const plataformas = [
    { name: 'Gupy', url: 'https://www.gupy.io' },
    { name: 'CIEE', url: 'https://portal.ciee.org.br' },
    { name: 'Vagas.com', url: 'https://www.vagas.com.br' },
    { name: 'Infojobs', url: 'https://www.infojobs.com.br' },
    { name: 'Indeed', url: 'https://br.indeed.com' },
    { name: 'Catho', url: 'https://www.catho.com.br' },
    { name: 'Glassdoor', url: 'https://www.glassdoor.com.br' },
    { name: '99jobs', url: 'https://www.99jobs.com' },
    { name: 'Taqe', url: 'https://www.taqe.com.br' },
    { name: 'Espro', url: 'https://www.espro.org.br' }
  ];

  const handleSelectOption = (idx: number) => {
    if (isCorrect === true) return;

    setSelectedOption(idx);
    const correct = idx === slides[currentSlide].correctAnswer;
    setIsCorrect(correct);
  };

  const handleNextSlide = () => {
    if (isCorrect !== true) return;

    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      setTrilhaConcluida(true);
      // Desbloqueia o Nível 2 (Cargos e Funções)
      setUnlockedLevel(prev => Math.max(prev, 2));
    }
  };

  const handlePrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
      setSelectedOption(null);
      setIsCorrect(null);
    }
  };

  const resetTrilha = () => {
    setCurrentSlide(0);
    setTrilhaConcluida(false);
    setSelectedOption(null);
    setIsCorrect(null);
  };

  return (
    <div style={styles.container} className="fade-in">
      {/* Hero Section */}
      <section style={styles.hero}>
        <div className="container" style={styles.heroContent}>
          <span style={styles.heroBadge}>📚 GUIA COMECE POR AQUI</span>
          <h1 style={styles.heroTitle}>A Trilha de Preparação do Aprendiz</h1>
          <p style={styles.heroSubtitle}>
            Aprenda as regras fundamentais do programa de slides, domine as profissões e simule sua entrevista de emprego.
          </p>
        </div>
      </section>

      {/* AdSense Top Banner */}
      <div className="container">
        <AdBlock type="horizontal" />
      </div>

      {/* Main Grid / Navigation Area */}
      <div className="container guide-grid">
        {/* Sidebar Navigation */}
        <aside style={styles.sidebar}>
          <div className="guide-tabs-list">
            <button
              onClick={() => setActiveTab('trilha')}
              className={`guide-tab-button ${activeTab === 'trilha' ? 'active' : ''}`}
            >
              🏁 Mini Curso (Slides)
            </button>
            <button
              onClick={() => unlockedLevel >= 2 && setActiveTab('cargos')}
              className={`guide-tab-button ${activeTab === 'cargos' ? 'active' : ''} ${unlockedLevel < 2 ? 'disabled' : ''}`}
              disabled={unlockedLevel < 2}
            >
              {unlockedLevel < 2 ? '🔒 ' : ''}💼 Cargos e Funções
            </button>
            <button
              onClick={() => unlockedLevel >= 3 && setActiveTab('preparacao')}
              className={`guide-tab-button ${activeTab === 'preparacao' ? 'active' : ''} ${unlockedLevel < 3 ? 'disabled' : ''}`}
              disabled={unlockedLevel < 3}
            >
              {unlockedLevel < 3 ? '🔒 ' : ''}📝 Currículo & Entrevista
            </button>
            <button
              onClick={() => unlockedLevel >= 4 && setActiveTab('buscar')}
              className={`guide-tab-button ${activeTab === 'buscar' ? 'active' : ''} ${unlockedLevel < 4 ? 'disabled' : ''}`}
              disabled={unlockedLevel < 4}
            >
              {unlockedLevel < 4 ? '🔒 ' : ''}🚀 Onde Buscar Vagas
            </button>
          </div>
          <AdBlock type="sidebar" />
        </aside>

        {/* Content Area */}
        <main className="guide-content-area">
          {activeTab === 'trilha' && (
            <div className="fade-in" style={styles.tabContent}>
              <h2 style={styles.contentTitle}>🏁 Mini Curso Jovem Aprendiz</h2>
              
              {!trilhaConcluida ? (
                <>
                  <p style={styles.paragraph}>
                    Preparamos uma trilha rápida em formato de slides para você entender como funciona a Lei da Aprendizagem. 
                    <strong> Responda à pergunta do slide para liberar o botão de avançar!</strong>
                  </p>

                  {/* Progress Bar */}
                  <div className="guide-progress-container">
                    <div className="guide-progress-header">
                      <span>Progresso da Trilha</span>
                      <span>Slide {currentSlide + 1} de {slides.length}</span>
                    </div>
                    <div className="guide-progress-bar">
                      <div 
                        className="guide-progress-fill" 
                        style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Slide Card */}
                  <div className="guide-slide-card fade-in" key={currentSlide}>
                    <span className="guide-slide-emoji">{slides[currentSlide].emoji}</span>
                    <h3 style={styles.slideTitle}>{slides[currentSlide].title}</h3>
                    <p style={styles.slideDesc}>{slides[currentSlide].description}</p>
                    
                    <ul className="guide-slide-bullets">
                      {slides[currentSlide].bullets.map((bullet, idx) => (
                        <li key={idx}>{bullet}</li>
                      ))}
                    </ul>

                    {/* Quiz Section */}
                    <div className="guide-quiz-container">
                      <h4 className="guide-quiz-question">⭐ Desafio: {slides[currentSlide].question}</h4>
                      <div className="guide-quiz-options">
                        {slides[currentSlide].options.map((opt, idx) => {
                          let optionClass = '';
                          if (selectedOption === idx) {
                            optionClass = isCorrect ? 'correct' : 'incorrect';
                          }
                          if (isCorrect === true) {
                            optionClass += ' disabled';
                          }

                          return (
                            <button
                              key={idx}
                              onClick={() => handleSelectOption(idx)}
                              className={`guide-quiz-option ${optionClass}`}
                              disabled={isCorrect === true}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {/* Quiz Feedback */}
                      {isCorrect !== null && (
                        <div className={`guide-quiz-feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
                          {isCorrect 
                            ? '🎉 Correto! O botão de avançar foi desbloqueado.' 
                            : '❌ Resposta incorreta. Dica: releia os tópicos do slide e tente novamente!'}
                        </div>
                      )}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="guide-slide-nav">
                      <button 
                        onClick={handlePrevSlide} 
                        disabled={currentSlide === 0}
                        className="guide-slide-btn-prev"
                      >
                        ← Voltar
                      </button>
                      <button 
                        onClick={handleNextSlide}
                        disabled={isCorrect !== true}
                        className={currentSlide === slides.length - 1 ? 'guide-slide-btn-finish' : 'guide-slide-btn-next'}
                        style={isCorrect !== true ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                      >
                        {currentSlide === slides.length - 1 ? 'Concluir Trilha! 🎉' : 'Avançar →'}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* Trilha Concluída */
                <div className="guide-congrats-card">
                  <span style={{ fontSize: '4rem' }}>🎉</span>
                  <h3 style={{ color: 'var(--color-primary-dark)', fontSize: 'var(--text-lg)' }}>
                    Parabéns! Você concluiu a trilha com sucesso.
                  </h3>
                  <p style={styles.paragraph}>
                    Você respondeu corretamente a todos os desafios da trilha! A seção <strong>💼 Cargos e Funções</strong> foi desbloqueada.
                  </p>
                  <p style={{ ...styles.paragraph, fontSize: 'var(--text-xs)', color: 'var(--color-gray-text)' }}>
                    O que deseja fazer agora para dar continuidade à sua jornada?
                  </p>

                  <div className="guide-congrats-buttons">
                    <button 
                      onClick={() => {
                        setUnlockedLevel(prev => Math.max(prev, 2));
                        setActiveTab('cargos');
                        window.scrollTo({ top: 0 });
                      }} 
                      style={styles.actionBtnPrimary}
                    >
                      💼 Conhecer as Funções dos Cargos (Próximo Passo)
                    </button>
                    <button 
                      onClick={resetTrilha}
                      style={styles.actionBtnOutline}
                    >
                      🔄 Reiniciar Mini Curso
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'cargos' && (
            <div className="fade-in" style={styles.tabContent}>
              <h2 style={styles.contentTitle}>💼 Cargos e Funções Comuns do Jovem Aprendiz</h2>
              <p style={styles.paragraph}>
                Clique nos cartões abaixo para conferir as atividades desempenhadas em cada cargo e as principais habilidades exigidas pelos recrutadores.
              </p>

              <div className="guide-profession-grid">
                {cargos.map((cargo) => {
                  const isExpanded = expandedCargo === cargo.title;
                  return (
                    <div 
                      key={cargo.title}
                      onClick={() => setExpandedCargo(isExpanded ? null : cargo.title)}
                      className={`guide-profession-card ${isExpanded ? 'expanded' : ''}`}
                    >
                      <div style={styles.professionHeader}>
                        <span style={styles.professionIcon}>{isExpanded ? '📂' : '📁'}</span>
                        <h4 style={styles.professionCardTitle}>{cargo.title}</h4>
                      </div>
                      
                      {isExpanded ? (
                        <div className="guide-profession-body fade-in" style={styles.professionBody}>
                          <p style={styles.professionDesc}>{cargo.description}</p>
                          <h5 style={styles.skillsTitle}>Requisitos & Habilidades desejadas:</h5>
                          <ul style={styles.skillsList}>
                            {cargo.skills.map((skill, idx) => (
                              <li key={idx}>{skill}</li>
                            ))}
                          </ul>
                          <div style={styles.collapseIndicator}>Clique para recolher ▲</div>
                        </div>
                      ) : (
                        <div style={styles.expandPrompt}>Clique para ver detalhes ▼</div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Botão de Transição Linear de Aba (Cargos -> Preparação) */}
              <div className="guide-tab-action-container">
                <button
                  onClick={() => {
                    setUnlockedLevel(prev => Math.max(prev, 3));
                    setActiveTab('preparacao');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={styles.actionBtnPrimary}
                >
                  Entendi as Funções! Avançar para Currículo & Entrevista 🔓
                </button>
              </div>
            </div>
          )}

          {activeTab === 'preparacao' && (
            <div className="fade-in" style={styles.tabContent}>
              <h2 style={styles.contentTitle}>📝 Como se Preparar para as Oportunidades</h2>
              
              {/* Currículo */}
              <div style={styles.sectionBlock}>
                <h3 style={styles.subtitle}>📄 Como criar um Currículo sem Experiência Profissional</h3>
                <p style={styles.paragraph}>
                  Muitos candidatos a Jovem Aprendiz não possuem histórico profissional. O segredo é focar nas suas competências, interesses e formação acadêmica:
                </p>
                <div style={styles.resumeSteps}>
                  <div style={styles.resumeStep}>
                    <strong>1. Dados Pessoais:</strong> Nome completo, e-mail profissional, telefone de contato, cidade/estado e link do LinkedIn (se tiver). Não inclua documentos ou fotos desnecessárias.
                  </div>
                  <div style={styles.resumeStep}>
                    <strong>2. Objetivo:</strong> Indique a área onde quer aprender. Exemplo: <em>"Atuar como Jovem Aprendiz na área administrativa, buscando contribuir para os processos internos e desenvolver habilidades organizacionais."</em>
                  </div>
                  <div style={styles.resumeStep}>
                    <strong>3. Formação Acadêmica:</strong> Nome da escola, ano que está cursando (ou previsão de formatura) e turno de estudos (ex: matutino).
                  </div>
                  <div style={styles.resumeStep}>
                    <strong>4. Habilidades:</strong> Competências pessoais (dedicação, pontualidade, facilidade em trabalhar em equipe) e técnicas (básico em Excel, Word, informática básica).
                  </div>
                  <div style={styles.resumeStep}>
                    <strong>5. Atividades Extracurriculares:</strong> Trabalho voluntário, esportes, projetos escolares relevantes, cursos de inglês ou informática livre são grandes diferenciais!
                  </div>
                </div>
              </div>

              <div style={{ margin: 'var(--space-md) 0' }}>
                <AdBlock type="inline" />
              </div>

              {/* Simulador de Entrevista */}
              <div style={styles.sectionBlock}>
                <h3 style={styles.subtitle}>💬 Simulador de Perguntas e Respostas da Entrevista</h3>
                <p style={styles.paragraph}>
                  Selecionamos as 10 perguntas mais comuns feitas por recrutadores em processos seletivos do Jovem Aprendiz. Clique em cada uma para ver uma sugestão de resposta e o que dizer:
                </p>

                <div className="guide-interview-container">
                  {perguntas.map((p) => {
                    const isExpanded = expandedQuestion === p.id;
                    return (
                      <div key={p.id} className="guide-interview-item">
                        <div 
                          className="guide-interview-header"
                          onClick={() => setExpandedQuestion(isExpanded ? null : p.id)}
                        >
                          <span style={styles.interviewQuestionText}>
                            ❓ <strong>Pergunta {p.id}:</strong> {p.question}
                          </span>
                          <span>{isExpanded ? '▲' : '▼'}</span>
                        </div>
                        {isExpanded && (
                          <div className="guide-interview-answer fade-in">
                            <p style={styles.answerText}>{p.answer}</p>
                            <div style={styles.answerTip}>
                              💡 <strong>Dica do Recrutador:</strong> Adapte a resposta à sua realidade. Seja sincero sobre suas fraquezas, mas mostre entusiasmo e disposição para aprender rápido.
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Botão de Transição Linear de Aba (Preparação -> Buscar) */}
              <div className="guide-tab-action-container">
                <button
                  onClick={() => {
                    setUnlockedLevel(prev => Math.max(prev, 4));
                    setActiveTab('buscar');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={styles.actionBtnPrimary}
                >
                  Concluir Preparação! Ir para Onde Buscar Vagas 🔓
                </button>
              </div>
            </div>
          )}

          {activeTab === 'buscar' && (
            <div className="fade-in" style={styles.tabContent}>
              <h2 style={styles.contentTitle}>🚀 Não está encontrando vagas? Veja como agir</h2>
              
              <div style={styles.infoBoxYellow}>
                <h4>⚠️ Dica de Carreira: A Regra dos 3 Meses</h4>
                <p>
                  Se você está se candidatando ativamente a vagas e não recebeu nenhum chamado para entrevista nos últimos <strong>3 meses</strong>, 
                  não desanime! Isso geralmente indica que o seu currículo precisa de refinamento. 
                  Recomendamos buscar cursos de capacitação básica online gratuitos para rechear seu currículo e torná-lo mais atrativo.
                </p>
              </div>

              <h3 style={styles.subtitle}>🌐 Principais Portais e Agências de Recrutamento</h3>
              <p style={styles.paragraph}>
                Além de buscar vagas em nosso portal (onde triamos apenas anúncios oficiais de Jovem Aprendiz), você pode se cadastrar 
                diretamente nos maiores portais de emprego do país:
              </p>

              <div style={styles.platformGrid}>
                {plataformas.map((plat) => (
                  <a 
                    key={plat.name} 
                    href={plat.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={styles.platformButton}
                  >
                    <span>🔗 {plat.name}</span>
                    <span style={styles.platformArrow}>→</span>
                  </a>
                ))}
              </div>

              <div style={{ ...styles.card, marginTop: 'var(--space-lg)' }}>
                <h4 style={styles.cardTitle}>🎒 Onde fazer Cursos Gratuitos para Melhorar o Currículo?</h4>
                <p style={styles.cardText}>
                  Existem diversas instituições respeitadas que oferecem cursos rápidos e gratuitos com certificado digital. Adicione-os na seção de Formação Adicional:
                </p>
                <ul style={{ ...styles.list, marginTop: 'var(--space-xs)' }}>
                  <li><strong>Fundação Bradesco (Escola Virtual):</strong> Cursos excelentes de Excel, Word, Postura Profissional e Redação Empresarial.</li>
                  <li><strong>SEBRAE:</strong> Cursos focados em empreendedorismo, comunicação, planejamento e proatividade.</li>
                  <li><strong>SENAI (Cursos Livres):</strong> Introdução à TI, Logística e Metrologia básica.</li>
                  <li><strong>CIEE Saber Virtual:</strong> Cursos focados no mercado corporativo e nos processos seletivos do programa.</li>
                </ul>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* AdSense Bottom Banner */}
      <div className="container" style={{ marginTop: 'var(--space-lg)', marginBottom: 'var(--space-lg)' }}>
        <AdBlock type="horizontal" />
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'var(--color-snow)',
  },
  hero: {
    background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-accent-dark) 100%)',
    padding: 'var(--space-lg) 0',
    color: 'var(--color-white)',
    textAlign: 'center',
    marginBottom: 'var(--space-md)',
  },
  heroContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'var(--space-xs)',
  },
  heroBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    color: 'var(--color-white)',
    padding: '4px 12px',
    borderRadius: 'var(--radius-pill)',
    fontSize: 'var(--text-xs)',
    fontWeight: 700,
    letterSpacing: '0.05em',
  },
  heroTitle: {
    color: 'var(--color-white)',
    fontSize: 'var(--text-xl)',
    maxWidth: '800px',
    margin: 'var(--space-xs) 0',
    lineHeight: 1.25,
  },
  heroSubtitle: {
    fontSize: 'var(--text-base)',
    color: 'rgba(255, 255, 255, 0.85)',
    maxWidth: '650px',
    lineHeight: 1.5,
  },
  mainGrid: {
    marginTop: 'var(--space-sm)',
    alignItems: 'start',
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-md)',
    width: '100%',
  },
  tabContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-sm)',
  },
  contentTitle: {
    fontSize: 'var(--text-lg)',
    color: 'var(--color-dark)',
    marginBottom: 'var(--space-xs)',
  },
  paragraph: {
    fontSize: 'var(--text-sm)',
    lineHeight: 1.6,
    color: 'var(--color-dark)',
  },
  subtitle: {
    fontSize: 'var(--text-md)',
    color: 'var(--color-accent-dark)',
    marginTop: 'var(--space-sm)',
    borderBottom: '2px solid var(--color-accent-light)',
    paddingBottom: '6px',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 'var(--space-md)',
    marginTop: 'var(--space-sm)',
  },
  card: {
    backgroundColor: 'var(--color-snow)',
    border: '1px solid var(--color-gray-light)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-md)',
  },
  cardTitle: {
    fontSize: 'var(--text-md)',
    marginBottom: 'var(--space-xs)',
  },
  cardText: {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-gray-text)',
    lineHeight: 1.5,
  },
  list: {
    listStyleType: 'none',
    paddingLeft: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    fontSize: 'var(--text-sm)',
  },
  benefitsFlex: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: 'var(--space-xs)',
  },
  tag: {
    backgroundColor: 'var(--color-primary-ice)',
    color: 'var(--color-primary-dark)',
    fontSize: 'var(--text-xs)',
    fontWeight: 700,
    padding: '6px 12px',
    borderRadius: 'var(--radius-pill)',
    border: '1px solid var(--color-primary-mist)',
  },
  bulletSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    backgroundColor: 'var(--color-accent-light)',
    padding: 'var(--space-md)',
    borderRadius: 'var(--radius-md)',
    fontSize: 'var(--text-sm)',
    border: '1px solid var(--color-accent-peach)',
  },
  timelineContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  professionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-xs)',
  },
  professionIcon: {
    fontSize: '1.25rem',
  },
  professionCardTitle: {
    fontSize: 'var(--text-sm)',
    fontWeight: 700,
    color: 'var(--color-dark)',
  },
  expandPrompt: {
    fontSize: 'var(--text-2xs)',
    color: 'var(--color-gray-text)',
    textAlign: 'right',
    marginTop: 'var(--space-xs)',
  },
  professionBody: {
    marginTop: 'var(--space-xs)',
    borderTop: '1px solid var(--color-primary-mist)',
    paddingTop: 'var(--space-xs)',
  },
  professionDesc: {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-dark)',
    lineHeight: 1.5,
    marginBottom: 'var(--space-xs)',
  },
  skillsTitle: {
    fontSize: 'var(--text-xs)',
    fontWeight: 700,
    color: 'var(--color-primary-dark)',
    marginBottom: '4px',
  },
  skillsList: {
    listStyleType: 'disc',
    paddingLeft: 'var(--space-md)',
    fontSize: 'var(--text-xs)',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    color: 'var(--color-dark)',
  },
  collapseIndicator: {
    fontSize: 'var(--text-2xs)',
    color: 'var(--color-primary-dark)',
    textAlign: 'right',
    marginTop: 'var(--space-sm)',
    fontWeight: 700,
  },
  sectionBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-sm)',
  },
  resumeSteps: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: 'var(--space-xs)',
  },
  resumeStep: {
    backgroundColor: 'var(--color-snow)',
    padding: 'var(--space-sm)',
    borderRadius: 'var(--radius-sm)',
    fontSize: 'var(--text-sm)',
    borderLeft: '3px solid var(--color-accent-peach)',
  },
  interviewQuestionText: {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-dark)',
  },
  answerText: {
    fontSize: 'var(--text-sm)',
    lineHeight: 1.6,
    color: 'var(--color-dark)',
    fontStyle: 'italic',
    paddingLeft: 'var(--space-sm)',
    borderLeft: '3px solid var(--color-primary)',
    marginBottom: 'var(--space-sm)',
  },
  answerTip: {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-gray-text)',
    backgroundColor: 'var(--color-primary-ice)',
    padding: 'var(--space-xs) var(--space-sm)',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--color-primary-mist)',
  },
  infoBoxYellow: {
    backgroundColor: 'var(--color-warning-bg)',
    border: '1px solid var(--color-highlight)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-md)',
    fontSize: 'var(--text-sm)',
    color: 'var(--color-dark)',
    lineHeight: 1.5,
    marginBottom: 'var(--space-md)',
  },
  platformGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: 'var(--space-xs)',
    marginTop: 'var(--space-xs)',
  },
  platformButton: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 'var(--space-sm)',
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-gray-light)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--color-accent-dark)',
    fontSize: 'var(--text-sm)',
    fontWeight: 700,
    boxShadow: 'var(--shadow-sm)',
    transition: 'var(--transition-fast)',
  },
  platformArrow: {
    color: 'var(--color-accent)',
  },
  slideTitle: {
    fontSize: 'var(--text-lg)',
    color: 'var(--color-accent-dark)',
    margin: 'var(--space-xs) 0',
  },
  slideDesc: {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-dark)',
    lineHeight: 1.5,
    maxWidth: '550px',
    marginBottom: 'var(--space-xs)',
  },
  actionBtnPrimary: {
    backgroundColor: 'var(--color-primary)',
    color: 'var(--color-dark)',
    padding: 'var(--space-sm) var(--space-md)',
    fontWeight: 700,
    borderRadius: 'var(--radius-sm)',
    boxShadow: 'var(--shadow-sm)',
  },
  actionBtnSecondary: {
    backgroundColor: 'var(--color-accent-light)',
    color: 'var(--color-accent-dark)',
    padding: 'var(--space-sm) var(--space-md)',
    fontWeight: 700,
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--color-accent-peach)',
  },
  actionBtnOutline: {
    backgroundColor: 'transparent',
    color: 'var(--color-gray-text)',
    padding: 'var(--space-sm) var(--space-md)',
    fontWeight: 600,
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--color-gray-light)',
  }
};
