import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { JobCard } from './components/JobCard';
import type { Job } from './components/JobCard';
import { AdminJobCard } from './components/AdminJobCard';
import { JobDetail } from './components/JobDetail';
import { Guide } from './components/Guide';
import { AdBlock } from './components/AdBlock';
import { CandidateArea } from './components/CandidateArea';
import initialJobs from './data/vagas_mock.json';
import './App.css';

export interface CandidateApplication {
  jobId: string;
  job: Job;
  status: 'SALVA' | 'CANDIDATADO' | 'ENTREVISTA' | 'APROVADO' | 'REPROVADO';
  notes: string;
  dateAdded: string;
}

function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [currentRoute, setCurrentRoute] = useState<'portal' | 'admin' | 'vaga' | 'guide' | 'profile'>('portal');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  
  // Estado das candidaturas salvas pelo candidato
  const [applications, setApplications] = useState<CandidateApplication[]>([]);
  
  // Estados de busca/filtro
  const [searchTerm, setSearchTerm] = useState('');
  const [searchLocation, setSearchLocation] = useState('');

  // Estados do cadastro de alertas
  const [subName, setSubName] = useState('');
  const [subEmail, setSubEmail] = useState('');
  const [submittingSub, setSubmittingSub] = useState(false);

  // Estado do Usuário Logado/Cadastrado (para alertas)
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    nome: string;
    email: string;
    whatsapp_configurado: boolean;
    whatsapp?: string;
    cidade?: string;
    estado?: string;
    categorias_vagas?: string;
    frequencia_envio?: string;
    token_confirmacao: string;
  } | null>(null);

  // Notificações temporárias (Toast)
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5678/webhook';

  // Inicializa os dados (carrega do n8n API, com fallback no localStorage se offline)
  useEffect(() => {
    const loadJobs = async () => {
      try {
        const res = await fetch(`${API_URL}/vagas`);
        if (!res.ok) throw new Error("Erro na resposta da API");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setJobs(data);
          localStorage.setItem('jab_jobs', JSON.stringify(data));
          console.log("Vagas carregadas com sucesso da API do n8n!");
          return;
        }
      } catch (e) {
        console.warn("API do n8n indisponível. Carregando dados offline do localStorage...", e);
      }

      // Fallback offline anterior se a API falhar
      const savedJobs = localStorage.getItem('jab_jobs');
      if (savedJobs) {
        try {
          setJobs(JSON.parse(savedJobs));
        } catch (e) {
          console.error("Erro ao ler vagas do localStorage, carregando inicial", e);
          setJobs(initialJobs as Job[]);
          localStorage.setItem('jab_jobs', JSON.stringify(initialJobs));
        }
      } else {
        setJobs(initialJobs as Job[]);
        localStorage.setItem('jab_jobs', JSON.stringify(initialJobs));
      }
    };

    loadJobs();

    // Carregar candidaturas do Candidato
    const savedApps = localStorage.getItem('jab_candidate_applications');
    if (savedApps) {
      try {
        setApplications(JSON.parse(savedApps));
      } catch (e) {
        console.error("Erro ao ler candidaturas do localStorage", e);
        setApplications([]);
      }
    }

    // Carregar sessão de usuário para alertas
    const savedUser = localStorage.getItem('jab_user_session');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        refreshUserStatus(user.id);
      } catch (e) {
        console.error("Erro ao ler sessão do usuário", e);
      }
    }

    // Verificar token de confirmação na URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('confirmar');
    if (token) {
      confirmEmail(token);
    }
  }, []);

  // Lógica de aprovação/validação
  const handleApprove = async (id: string) => {
    // Atualiza localmente de imediato para boa UX
    const updatedJobs = jobs.map(job => {
      if (job.id === id) {
        return {
          ...job,
          status: 'VALIDADO' as const,
          data_validacao: new Date().toISOString()
        };
      }
      return job;
    });
    setJobs(updatedJobs);
    localStorage.setItem('jab_jobs', JSON.stringify(updatedJobs));

    // Sincroniza com a API do n8n
    try {
      const res = await fetch(`${API_URL}/vagas/moderacao`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'VALIDADO' })
      });
      if (res.ok) {
        showToast("Vaga aprovada e publicada no portal! 🚀");
      } else {
        throw new Error();
      }
    } catch (e) {
      console.warn("Erro ao sincronizar aprovação com n8n, salvo apenas localmente", e);
      showToast("Vaga aprovada localmente (API n8n indisponível)");
    }
  };

  // Lógica de rejeição
  const handleReject = async (id: string) => {
    const updatedJobs = jobs.map(job => {
      if (job.id === id) {
        return {
          ...job,
          status: 'REJEITADO' as const
        };
      }
      return job;
    });
    setJobs(updatedJobs);
    localStorage.setItem('jab_jobs', JSON.stringify(updatedJobs));

    try {
      const res = await fetch(`${API_URL}/vagas/moderacao`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'REJEITADO' })
      });
      if (res.ok) {
        showToast("Vaga rejeitada e removida da triagem.");
      } else {
        throw new Error();
      }
    } catch (e) {
      console.warn("Erro ao sincronizar rejeição com n8n, salvo apenas localmente", e);
      showToast("Vaga rejeitada localmente (API n8n indisponível)");
    }
  };

  // Lógica de cadastro de Alertas por E-mail (Double Opt-in)
  const handleSubscribeForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName || !subEmail) return;

    setSubmittingSub(true);
    try {
      const res = await fetch(`${API_URL}/usuarios/cadastro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: subName, email: subEmail })
      });
      if (res.ok) {
        showToast("Quase lá! Enviamos um link de ativação para o seu e-mail. ✉️");
        setSubName('');
        setSubEmail('');
      } else {
        const errData = await res.json();
        showToast(errData.message || "Erro ao cadastrar e-mail.");
      }
    } catch (e) {
      console.error("Erro ao cadastrar e-mail", e);
      showToast("Erro ao cadastrar (API n8n indisponível).");
    } finally {
      setSubmittingSub(false);
    }
  };

  const confirmEmail = async (token: string) => {
    showToast("Confirmando seu e-mail... ⏳");
    try {
      const res = await fetch(`${API_URL}/usuarios/confirmar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      if (res.ok) {
        const user = await res.json();
        setCurrentUser(user);
        localStorage.setItem('jab_user_session', JSON.stringify(user));
        showToast(`E-mail verificado! Bem-vindo(a) ao seu Painel, ${user.nome}! 🎉`);
        setCurrentRoute('profile');
        // Limpar parâmetros da URL sem recarregar
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        throw new Error();
      }
    } catch (e) {
      console.error("Erro ao confirmar e-mail", e);
      showToast("Token de confirmação inválido ou expirado.");
    }
  };

  const refreshUserStatus = async (userId: string) => {
    try {
      const res = await fetch(`${API_URL}/usuarios/preferencias?id=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(prev => {
          if (!prev) return null;
          const updated = { ...prev, ...data };
          localStorage.setItem('jab_user_session', JSON.stringify(updated));
          return updated;
        });
      }
    } catch (e) {
      console.warn("Erro ao carregar preferências atualizadas", e);
    }
  };

  // Adicionar/Remover vaga do painel do candidato
  const handleSaveJob = (job: Job) => {
    const exists = applications.some(app => app.jobId === job.id);
    if (exists) {
      handleRemoveJob(job.id);
      showToast("Vaga removida do seu painel pessoal!");
      return;
    }

    const newApp: CandidateApplication = {
      jobId: job.id,
      job: job,
      status: 'SALVA',
      notes: '',
      dateAdded: new Date().toISOString()
    };

    const updatedApps = [...applications, newApp];
    setApplications(updatedApps);
    localStorage.setItem('jab_candidate_applications', JSON.stringify(updatedApps));
    showToast("Vaga salva no seu painel de acompanhamento! 💼");
  };

  const handleRemoveJob = (jobId: string) => {
    const updatedApps = applications.filter(app => app.jobId !== jobId);
    setApplications(updatedApps);
    localStorage.setItem('jab_candidate_applications', JSON.stringify(updatedApps));
  };

  const handleUpdateStatus = (jobId: string, status: CandidateApplication['status']) => {
    const updatedApps = applications.map(app => {
      if (app.jobId === jobId) {
        return { ...app, status };
      }
      return app;
    });
    setApplications(updatedApps);
    localStorage.setItem('jab_candidate_applications', JSON.stringify(updatedApps));
    
    const statusLabels = {
      SALVA: 'Salva',
      CANDIDATADO: 'Candidatada',
      ENTREVISTA: 'Entrevista Agendada 📞',
      APROVADO: 'Aprovada! Parabéns! 🎉',
      REPROVADO: 'Processo Encerrado ❌'
    };
    showToast(`Status atualizado para: ${statusLabels[status]}`);
  };

  const handleUpdateNotes = (jobId: string, notes: string) => {
    const updatedApps = applications.map(app => {
      if (app.jobId === jobId) {
        return { ...app, notes };
      }
      return app;
    });
    setApplications(updatedApps);
    localStorage.setItem('jab_candidate_applications', JSON.stringify(updatedApps));
  };

  // Abre detalhes da vaga navegando para a nova "página"
  const handleOpenDetails = (job: Job) => {
    setSelectedJob(job);
    setCurrentRoute('vaga');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Contagens
  const pendingJobs = jobs.filter(job => job.status === 'PENDENTE');
  const validatedJobs = jobs.filter(job => job.status === 'VALIDADO' || job.status === 'PUBLICADO');

  // Filtros aplicados no Portal Público
  const filteredJobs = validatedJobs.filter(job => {
    const matchTerm = job.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      job.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      job.descricao.toLowerCase().includes(searchTerm.toLowerCase());
                      
    const matchLocation = searchLocation === '' || 
                          job.localidade.toLowerCase().includes(searchLocation.toLowerCase());
                          
    return matchTerm && matchLocation;
  });

  return (
    <div style={styles.app}>
      <Header 
        currentRoute={currentRoute === 'vaga' ? 'portal' : currentRoute} 
        onRouteChange={(route) => {
          setCurrentRoute(route);
          window.scrollTo({ top: 0 });
        }} 
        pendingCount={pendingJobs.length}
        candidateJobsCount={applications.length}
      />

      {currentRoute === 'portal' && (
        /* ════════════════ PORTAL PÚBLICO DE VAGAS ════════════════ */
        <main className="fade-in">
          {/* Hero Section (Gupy-Style) */}
          <section style={styles.hero}>
            <div className="container" style={styles.heroContainer}>
              <span style={styles.heroBadge}>🌱 Oportunidades Reais</span>
              <h1 style={styles.heroTitle}>
                Conectando o futuro do trabalho aos jovens talentos do Brasil.
              </h1>
              <p style={styles.heroSubtitle}>
                Encontre vagas de Jovem Aprendiz verificadas manualmente, livres de spam e golpes. Sua carreira começa aqui.
              </p>

              {/* Barra de Pesquisa Integrada */}
              <div className="search-bar glass">
                <div className="search-input-group">
                  <span style={styles.searchIcon}>🔍</span>
                  <input 
                    type="text" 
                    placeholder="Cargo, empresa ou palavra-chave..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={styles.searchInput}
                  />
                </div>
                <div className="search-divider"></div>
                <div className="search-input-group">
                  <span style={styles.searchIcon}>📍</span>
                  <input 
                    type="text" 
                    placeholder="Cidade, estado ou 'Remoto'..."
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    style={styles.searchInput}
                  />
                </div>
                <button style={styles.searchButton}>Buscar Vagas</button>
              </div>
            </div>
          </section>

          {/* AdSense Top Banner */}
          <div className="container">
            <AdBlock type="horizontal" />
          </div>

          {/* Grid de Conteúdo */}
          <section className="container main-grid">
            {/* Listagem de Vagas */}
            <div style={styles.jobListSection}>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>
                  Vagas de Aprendiz Disponíveis
                  <span style={styles.jobCountBadge}>{filteredJobs.length}</span>
                </h2>
                {(searchTerm !== '' || searchLocation !== '') && (
                  <button 
                    style={styles.clearFilters} 
                    onClick={() => { setSearchTerm(''); setSearchLocation(''); }}
                  >
                    Limpar filtros
                  </button>
                )}
              </div>

              {filteredJobs.length === 0 ? (
                <div style={styles.emptyState}>
                  <span style={styles.emptyIcon}>🔍</span>
                  <h3>Nenhuma vaga encontrada</h3>
                  <p>Tente ajustar os termos de pesquisa ou remover os filtros de localidade.</p>
                </div>
              ) : (
                <div style={styles.list}>
                  {filteredJobs.map((job, index) => {
                    const isSaved = applications.some(app => app.jobId === job.id);
                    const elements = [
                      <JobCard 
                        key={job.id} 
                        job={job} 
                        onOpenDetails={handleOpenDetails} 
                        onSaveJob={handleSaveJob}
                        isSaved={isSaved}
                      />
                    ];

                    // Insere um AdSense Inline no feed após a 2ª vaga
                    if (index === 1 && filteredJobs.length > 2) {
                      elements.push(<AdBlock key="ad-inline" type="inline" />);
                    }

                    return elements;
                  })}
                </div>
              )}
            </div>

            {/* Sidebar Lateral */}
            <aside style={styles.sidebar}>
              {/* Box de Alertas de Vagas (Double Opt-in) */}
              <div className="whatsapp-subscribe-box">
                <h3 className="whatsapp-title">Alertas de Vagas 🟢</h3>
                <p className="whatsapp-text">
                  Cadastre seu e-mail para ativar e configurar alertas personalizados de vagas no seu WhatsApp de forma 100% segura.
                </p>
                <form onSubmit={handleSubscribeForm} className="whatsapp-form">
                  <input 
                    type="text" 
                    placeholder="Seu nome..." 
                    value={subName}
                    onChange={(e) => setSubName(e.target.value)}
                    required
                    className="whatsapp-input"
                  />
                  <input 
                    type="email" 
                    placeholder="seu-email@dominio.com" 
                    value={subEmail}
                    onChange={(e) => setSubEmail(e.target.value)}
                    required
                    className="whatsapp-input"
                  />
                  <button type="submit" disabled={submittingSub} className="whatsapp-submit-btn">
                    {submittingSub ? 'Enviando link...' : 'Começar Configuração'}
                  </button>
                </form>
              </div>

              {/* Box Informativo da Lei do Jovem Aprendiz */}
              <div style={styles.infoBox}>
                <h3 style={styles.infoTitle}>Direito do Aprendiz 🇧🇷</h3>
                <p style={styles.infoText}>
                  A **Lei da Aprendizagem (Lei 10.097/2000)** garante ao jovem de 14 a 24 anos:
                </p>
                <ul style={styles.infoList}>
                  <li>✓ Carteira assinada (regime CLT).</li>
                  <li>✓ Salário mínimo hora proporcional.</li>
                  <li>✓ Jornada máxima de 6h (estudantes).</li>
                  <li>✓ Curso de capacitação teórica pago pela empresa.</li>
                  <li>✓ FGTS recolhido a alíquota de 2%.</li>
                </ul>
              </div>

              {/* AdSense Sidebar Banner */}
              <AdBlock type="sidebar" />
            </aside>
          </section>
        </main>
      )}

      {currentRoute === 'guide' && (
        /* ════════════════ GUIA COMECE POR AQUI ════════════════ */
        <Guide />
      )}

      {currentRoute === 'vaga' && (
        /* ════════════════ PÁGINA DETALHADA DA VAGA ════════════════ */
        <JobDetail 
          job={selectedJob} 
          onBack={() => {
            setCurrentRoute('portal');
            window.scrollTo({ top: 0 });
          }} 
          onSaveJob={handleSaveJob}
          isSaved={selectedJob ? applications.some(app => app.jobId === selectedJob.id) : false}
        />
      )}

      {currentRoute === 'admin' && (
        /* ════════════════ PAINEL ADMINISTRATIVO DE MODERAÇÃO ════════════════ */
        <main style={styles.adminMain} className="fade-in">
          <section style={styles.adminHero}>
            <div className="container">
              <span style={styles.adminBadge}>ÁREA RESTRITA</span>
              <h1 style={styles.adminTitle}>Painel de Triagem Manual JAB</h1>
              <p style={styles.adminSubtitle}>
                Abaixo estão listadas as vagas recentemente capturadas pelo n8n. Clique em "Abrir Link da Vaga" para verificar os detalhes manualmente, e decida se aprova ou rejeita a publicação.
              </p>
            </div>
          </section>

          <section className="container" style={styles.adminContent}>
            <div style={styles.adminSectionHeader}>
              <h2 style={styles.sectionTitle}>
                Fila de Vagas Pendentes
                <span style={styles.pendingCountBadge}>{pendingJobs.length}</span>
              </h2>
              <div style={styles.adminTip}>
                💡 <em>Dica: Vagas validadas aparecem instantaneamente no portal público.</em>
              </div>
            </div>

            {pendingJobs.length === 0 ? (
              <div style={styles.emptyAdminState}>
                <span style={styles.emptyAdminIcon}>🎉</span>
                <h3>Fila de triagem vazia!</h3>
                <p>Nenhuma nova vaga pendente de moderação no momento. Todos os dados foram analisados.</p>
                <button 
                  style={styles.backToPortalButton} 
                  onClick={() => setCurrentRoute('portal')}
                >
                  Voltar ao Portal de Vagas
                </button>
              </div>
            ) : (
              <div style={styles.adminGrid}>
                {pendingJobs.map(job => (
                  <AdminJobCard 
                    key={job.id} 
                    job={job}
                    onApprove={handleApprove}
                    onReject={handleReject}
                  />
                ))}
              </div>
            )}
          </section>
        </main>
      )}

      {currentRoute === 'profile' && (
        /* ════════════════ ÁREA DO CANDIDATO ════════════════ */
        <CandidateArea 
          applications={applications}
          onUpdateStatus={handleUpdateStatus}
          onUpdateNotes={handleUpdateNotes}
          onRemoveJob={handleRemoveJob}
          onNavigateToPortal={() => {
            setCurrentRoute('portal');
            window.scrollTo({ top: 0 });
          }}
          currentUser={currentUser}
          onRefreshUserStatus={refreshUserStatus}
        />
      )}

      {/* Toast Notification de Feedback */}
      {toastMessage && (
        <div style={styles.toastContainer} className="fade-in">
          <div style={styles.toast}>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
      
      {/* Rodapé Premium */}
      <footer style={styles.appFooter}>
        <div className="container" style={styles.footerContainer}>
          <div style={styles.footerBrand}>
            <h3>JAB</h3>
            <p>Conectando o futuro do trabalho aos jovens talentos do Brasil.</p>
          </div>
          <div style={styles.footerLinks}>
            <a href="#termos" style={styles.footerLink}>Termos de Uso</a>
            <a href="#privacidade" style={styles.footerLink}>Privacidade</a>
            <a href="#contato" style={styles.footerLink}>Fale Conosco</a>
          </div>
        </div>
        <div style={styles.footerCopy}>
          © 2026 JAB (Jovem Aprendiz Brasil) — Desenvolvido de acordo com o Protocolo VLAEG da ATLAS.
        </div>
      </footer>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  app: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: 'var(--color-snow)',
  },
  hero: {
    background: 'linear-gradient(135deg, var(--color-accent-dark) 0%, var(--color-accent) 100%)', // Azul Carreira
    padding: 'var(--space-xl) 0',
    color: 'var(--color-white)',
    textAlign: 'center',
    position: 'relative',
  },
  heroContainer: {
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
    fontWeight: 600,
    letterSpacing: '0.05em',
  },
  heroTitle: {
    color: 'var(--color-white)',
    fontSize: 'var(--text-xl)',
    maxWidth: '800px',
    margin: 'var(--space-xs) 0',
    lineHeight: 1.2,
  },
  heroSubtitle: {
    fontSize: 'var(--text-base)',
    color: 'rgba(255, 255, 255, 0.85)',
    maxWidth: '650px',
    lineHeight: 1.5,
    marginBottom: 'var(--space-md)',
  },
  searchInput: {
    width: '100%',
    border: 'none',
    outline: 'none',
    fontSize: 'var(--text-sm)',
    color: 'var(--color-dark)',
    fontFamily: 'inherit',
  },
  searchButton: {
    backgroundColor: 'var(--color-primary)', // Verde Aprendiz
    color: 'var(--color-dark)', // Escuro JAB
    padding: 'var(--space-xs) var(--space-lg)',
    borderRadius: 'var(--radius-sm)',
    fontSize: 'var(--text-sm)',
    fontWeight: 700,
    boxShadow: 'var(--shadow-sm)',
  },
  jobListSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-md)',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 'var(--text-lg)',
    color: 'var(--color-dark)',
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-xs)',
  },
  jobCountBadge: {
    backgroundColor: 'var(--color-accent-light)',
    color: 'var(--color-accent)',
    fontSize: 'var(--text-xs)',
    fontWeight: 700,
    padding: '2px 8px',
    borderRadius: 'var(--radius-pill)',
  },
  clearFilters: {
    backgroundColor: 'transparent',
    color: 'var(--color-gray-text)',
    fontSize: 'var(--text-xs)',
    textDecoration: 'underline',
    fontWeight: 500,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-sm)',
  },
  emptyState: {
    backgroundColor: 'var(--color-white)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-xl) var(--space-md)',
    textAlign: 'center',
    border: '1px solid var(--color-gray-light)',
    boxShadow: 'var(--shadow-sm)',
  },
  emptyIcon: {
    fontSize: '3rem',
    display: 'block',
    marginBottom: 'var(--space-xs)',
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-md)',
  },
  infoBox: {
    backgroundColor: 'var(--color-primary-ice)',
    border: '1px solid var(--color-primary-medium)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-md)',
    textAlign: 'left',
  },
  infoTitle: {
    fontSize: 'var(--text-md)',
    color: 'var(--color-primary-dark)',
    marginBottom: 'var(--space-xs)',
  },
  infoText: {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-dark)',
    marginBottom: 'var(--space-xs)',
    lineHeight: 1.4,
  },
  infoList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    fontSize: 'var(--text-xs)',
    color: 'var(--color-dark)',
    fontWeight: 500,
  },
  adminMain: {
    backgroundColor: 'var(--color-snow)',
    minHeight: '80vh',
  },
  adminHero: {
    background: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-dark) 100%)', // Azul Carreira
    padding: 'var(--space-lg) 0',
    color: 'var(--color-white)',
    borderBottom: '4px solid var(--color-primary)', // Linha Verde Aprendiz divisória
  },
  adminBadge: {
    backgroundColor: 'var(--color-highlight)',
    color: 'var(--color-dark)',
    padding: '2px 10px',
    borderRadius: 'var(--radius-pill)',
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.05em',
    display: 'inline-block',
    marginBottom: 'var(--space-2xs)',
  },
  adminTitle: {
    color: 'var(--color-white)',
    fontSize: 'var(--text-xl)',
    marginBottom: 'var(--space-2xs)',
  },
  adminSubtitle: {
    fontSize: 'var(--text-sm)',
    color: 'rgba(255, 255, 255, 0.85)',
    maxWidth: '700px',
    lineHeight: 1.5,
  },
  adminContent: {
    paddingTop: 'var(--space-md)',
    paddingBottom: 'var(--space-xl)',
  },
  adminSectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 'var(--space-md)',
  },
  pendingCountBadge: {
    backgroundColor: 'var(--color-warning-bg)',
    color: 'var(--color-warning)',
    fontSize: 'var(--text-xs)',
    fontWeight: 700,
    padding: '2px 8px',
    borderRadius: 'var(--radius-pill)',
    border: '1px solid var(--color-warning)',
  },
  adminTip: {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-gray-text)',
  },
  emptyAdminState: {
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-gray-light)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-xl) var(--space-md)',
    textAlign: 'center',
    boxShadow: 'var(--shadow-sm)',
  },
  emptyAdminIcon: {
    fontSize: '3rem',
    display: 'block',
    marginBottom: 'var(--space-xs)',
  },
  backToPortalButton: {
    backgroundColor: 'var(--color-accent)',
    color: 'var(--color-white)',
    padding: 'var(--space-xs) var(--space-md)',
    borderRadius: 'var(--radius-sm)',
    marginTop: 'var(--space-sm)',
    fontSize: 'var(--text-sm)',
  },
  adminGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: 'var(--space-md)',
  },
  appFooter: {
    backgroundColor: 'var(--color-dark)', // Escuro JAB
    color: 'rgba(255, 255, 255, 0.6)',
    padding: 'var(--space-lg) 0 var(--space-md) 0',
    marginTop: 'auto',
    borderTop: '1px solid var(--color-gray-light)',
  },
  footerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 'var(--space-md)',
    paddingBottom: 'var(--space-md)',
  },
  footerBrand: {
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  footerLinks: {
    display: 'flex',
    gap: 'var(--space-md)',
  },
  footerLink: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 'var(--text-sm)',
    transition: 'var(--transition-fast)',
  },
  footerCopy: {
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    paddingTop: 'var(--space-md)',
    fontSize: 'var(--text-2xs)',
    textAlign: 'center',
  },
  toastContainer: {
    position: 'fixed',
    bottom: 'var(--space-md)',
    right: 'var(--space-md)',
    zIndex: 9999,
  },
  toast: {
    backgroundColor: 'var(--color-dark)',
    color: 'var(--color-white)',
    padding: 'var(--space-sm) var(--space-md)',
    borderRadius: 'var(--radius-sm)',
    boxShadow: 'var(--shadow-lg)',
    fontSize: 'var(--text-xs)',
    fontWeight: 700,
    borderLeft: '4px solid var(--color-primary)',
  }
};

export default App;
