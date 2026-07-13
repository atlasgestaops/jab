import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { JobCard } from './components/JobCard';
import type { Job } from './components/JobCard';
import { AdminJobCard } from './components/AdminJobCard';
import { JobDetail } from './components/JobDetail';
import { Guide } from './components/Guide';
import { AdBlock } from './components/AdBlock';
import { CandidateArea } from './components/CandidateArea';
import { CompanyArea } from './components/CompanyArea';
import { Linktree } from './components/Linktree';
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
  const [currentRoute, setCurrentRoute] = useState<'portal' | 'admin' | 'vaga' | 'guide' | 'profile' | 'company-panel' | 'linktree'>('portal');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [pendingJobId, setPendingJobId] = useState<string | null>(null);
  
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

  // Estados da Empresa Logada
  const [currentCompany, setCurrentCompany] = useState<{
    id: string;
    cnpj: string;
    nome_fantasia: string;
    email: string;
    telefone: string;
    site?: string;
    token_acesso: string;
  } | null>(null);

  // Controle de login e perfis
  const [loginRole, setLoginRole] = useState<'candidate' | 'company' | null>(null);
  const [isLoginMode, setIsLoginMode] = useState(true);

  // Campos de Cadastro de Empresa
  const [compCnpj, setCompCnpj] = useState('');
  const [compName, setCompName] = useState('');
  const [compEmail, setCompEmail] = useState('');
  const [compPhone, setCompPhone] = useState('');
  const [compSite, setCompSite] = useState('');
  const [submittingComp, setSubmittingComp] = useState(false);
  const [companyLoginInput, setCompanyLoginInput] = useState('');

  // Estados para Gerenciamento de Fontes de Busca (Admin)
  const [adminTab, setAdminTab] = useState<'triagem' | 'fontes'>('triagem');
  const [sources, setSources] = useState<{ id: number; nome_fonte: string; url: string; ativa: boolean }[]>([]);
  const [newSourceName, setNewSourceName] = useState('');
  const [newSourceUrl, setNewSourceUrl] = useState('');
  const [submittingSource, setSubmittingSource] = useState(false);

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
        let jobsData: Job[] = [];
        if (Array.isArray(data)) {
          jobsData = data;
        } else if (data && typeof data === 'object' && !(data as any).success) {
          jobsData = [data as Job];
        }

        if (jobsData.length > 0) {
          setJobs(jobsData);
          localStorage.setItem('jab_jobs', JSON.stringify(jobsData));
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

    // Carregar sessão de empresa
    const savedCompany = localStorage.getItem('jab_company_session');
    if (savedCompany) {
      try {
        setCurrentCompany(JSON.parse(savedCompany));
      } catch (e) {
        console.error("Erro ao ler sessão de empresa", e);
      }
    }

    // Verificar token de confirmação na URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('confirmar');
    if (token) {
      confirmEmail(token);
    }

    // Verificar se está acessando a página do Linktree, vaga específica ou outras rotas
    const pathname = window.location.pathname.replace(/\/$/, '');
    const pathParts = pathname.split('/');
    if (pathname === '/linktree' || urlParams.get('page') === 'linktree') {
      setCurrentRoute('linktree');
    } else if (pathParts[1] === 'vaga' && pathParts[2]) {
      setPendingJobId(pathParts[2]);
    } else if (pathname === '/profile') {
      setCurrentRoute('profile');
    } else if (pathname === '/admin') {
      setCurrentRoute('admin');
    } else if (pathname === '/guide') {
      setCurrentRoute('guide');
    }
  }, []);

  // Sincronizar rota ao navegar pelos botões Avançar/Voltar do navegador
  useEffect(() => {
    const handlePopState = () => {
      const pathname = window.location.pathname.replace(/\/$/, '');
      const pathParts = pathname.split('/');
      const urlParams = new URLSearchParams(window.location.search);
      
      if (pathname === '/linktree' || urlParams.get('page') === 'linktree') {
        setCurrentRoute('linktree');
      } else if (pathParts[1] === 'vaga' && pathParts[2]) {
        const jobId = pathParts[2];
        const foundJob = jobs.find(j => j.id === jobId);
        if (foundJob) {
          setSelectedJob(foundJob);
          setCurrentRoute('vaga');
        } else {
          setPendingJobId(jobId);
        }
      } else if (pathname === '/profile') {
        setCurrentRoute('profile');
      } else if (pathname === '/admin') {
        setCurrentRoute('admin');
      } else if (pathname === '/guide') {
        setCurrentRoute('guide');
      } else {
        setCurrentRoute('portal');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [jobs]);

  // Resolver ID de vaga pendente após carregar vagas da API/Mock
  useEffect(() => {
    if (pendingJobId && jobs.length > 0) {
      const foundJob = jobs.find(j => j.id === pendingJobId);
      if (foundJob) {
        setSelectedJob(foundJob);
        setCurrentRoute('vaga');
        setPendingJobId(null);
      }
    }
  }, [pendingJobId, jobs]);

  // Carregar fontes de busca para o administrador
  useEffect(() => {
    if (currentRoute === 'admin') {
      loadSources();
    }
  }, [currentRoute]);

  const loadSources = async () => {
    try {
      const res = await fetch(`${API_URL}/fontes`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setSources(data);
        }
      }
    } catch (e) {
      console.error("Erro ao carregar fontes de busca", e);
    }
  };

  const handleAddSource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSourceName || !newSourceUrl) return;

    setSubmittingSource(true);
    try {
      const res = await fetch(`${API_URL}/fontes/cadastrar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome_fonte: newSourceName, url: newSourceUrl })
      });
      if (res.ok) {
        showToast("Fonte de busca cadastrada com sucesso! 🎉");
        setNewSourceName('');
        setNewSourceUrl('');
        loadSources();
      } else {
        showToast("Erro ao cadastrar fonte de busca.");
      }
    } catch (e) {
      console.error("Erro ao cadastrar fonte de busca", e);
      showToast("Erro ao conectar com a API (n8n offline).");
    } finally {
      setSubmittingSource(false);
    }
  };

  const handleDeleteSource = async (id: number) => {
    if (!window.confirm("Deseja realmente remover esta fonte de busca? O robô não varrerá mais esta empresa.")) return;

    try {
      const res = await fetch(`${API_URL}/fontes/deletar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        showToast("Fonte de busca removida com sucesso.");
        loadSources();
      } else {
        showToast("Erro ao remover fonte de busca.");
      }
    } catch (e) {
      console.error("Erro ao remover fonte de busca", e);
      showToast("Erro ao conectar com a API.");
    }
  };

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

  // Cadastro de Empresa Recrutadora
  const handleRegisterCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!compCnpj || !compName || !compEmail || !compPhone) {
      showToast("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setSubmittingComp(true);
    try {
      const res = await fetch(`${API_URL}/empresas/cadastro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cnpj: compCnpj,
          nome_fantasia: compName,
          email: compEmail,
          telefone: compPhone,
          site: compSite
        })
      });
      const data = await res.json();
      if (res.ok) {
        if (data.id) {
          setCurrentCompany(data);
          localStorage.setItem('jab_company_session', JSON.stringify(data));
          showToast(`Empresa ${data.nome_fantasia} cadastrada e logada com sucesso! 🏢`);
          setCurrentRoute('company-panel');
          // Limpar campos
          setCompCnpj('');
          setCompName('');
          setCompEmail('');
          setCompPhone('');
          setCompSite('');
        } else {
          showToast(data.message || "Erro ao cadastrar empresa.");
        }
      } else {
        showToast(data.message || "CNPJ ou E-mail da empresa já cadastrado.");
      }
    } catch (e) {
      console.error("Erro no cadastro de empresa", e);
      showToast("Erro ao conectar com a API do n8n.");
    } finally {
      setSubmittingComp(false);
    }
  };

  // Login simplificado de Empresa por E-mail ou CNPJ
  const handleCompanyLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyLoginInput) return;

    setSubmittingComp(true);
    try {
      const res = await fetch(`${API_URL}/empresas/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: companyLoginInput,
          cnpj: companyLoginInput
        })
      });
      const data = await res.json();
      if (res.ok && data.id) {
        setCurrentCompany(data);
        localStorage.setItem('jab_company_session', JSON.stringify(data));
        showToast(`Bem-vindo de volta, ${data.nome_fantasia}! 🎉`);
        setCurrentRoute('company-panel');
        setCompanyLoginInput('');
      } else {
        showToast("Empresa não encontrada com os dados informados.");
      }
    } catch (e) {
      console.error("Erro no login de empresa", e);
      showToast("Erro ao conectar com a API (n8n offline).");
    } finally {
      setSubmittingComp(false);
    }
  };

  const handleCompanyLogout = () => {
    setCurrentCompany(null);
    localStorage.removeItem('jab_company_session');
    showToast("Sessão da empresa encerrada.");
    setCurrentRoute('portal');
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
    window.history.pushState({ jobId: job.id }, "", `/vaga/${job.id}`);
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

  if (currentRoute === 'linktree') {
    return (
      <div style={{ ...styles.app, backgroundColor: 'var(--color-snow)', minHeight: '100vh', padding: 0 }}>
        <Linktree 
          onNavigate={(route) => {
            setCurrentRoute(route);
            let path = '/';
            if (route === 'linktree') path = '/linktree';
            else if (route === 'profile') path = '/profile';
            else if (route === 'admin') path = '/admin';
            else if (route === 'guide') path = '/guide';
            window.history.pushState({}, "", path);
            window.scrollTo({ top: 0 });
          }}
        />
        {toastMessage && (
          <div style={styles.toastContainer} className="fade-in">
            <div style={styles.toast}>
              <span>{toastMessage}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={styles.app}>
      <Header 
        currentRoute={((currentRoute as string) === 'vaga' || (currentRoute as string) === 'linktree' ? 'portal' : currentRoute) as any} 
        onRouteChange={(route) => {
          setCurrentRoute(route);
          let path = '/';
          const r = route as string;
          if (r === 'linktree') path = '/linktree';
          else if (r === 'profile') path = '/profile';
          else if (r === 'admin') path = '/admin';
          else if (r === 'guide') path = '/guide';
          window.history.pushState({}, "", path);
          window.scrollTo({ top: 0 });
        }} 
        pendingCount={pendingJobs.length}
        candidateJobsCount={applications.length}
        hasCompanySession={currentCompany !== null}
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
            window.history.pushState({}, "", "/");
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
              
              {/* Navegação por Abas no Admin */}
              <div style={styles.adminNav}>
                <button 
                  style={adminTab === 'triagem' ? styles.adminNavBtnActive : styles.adminNavBtn}
                  onClick={() => setAdminTab('triagem')}
                >
                  Triagem de Vagas ({pendingJobs.length})
                </button>
                <button 
                  style={adminTab === 'fontes' ? styles.adminNavBtnActive : styles.adminNavBtn}
                  onClick={() => setAdminTab('fontes')}
                >
                  Gerenciar Fontes de Busca ({sources.length})
                </button>
              </div>
            </div>
          </section>

          <section className="container" style={styles.adminContent}>
            {adminTab === 'triagem' && (
              <>
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
              </>
            )}

            {adminTab === 'fontes' && (
              <div style={styles.sourcesContainer}>
                {/* Form de Cadastro */}
                <div style={styles.sourcesFormCard}>
                  <h3 style={styles.formTitle}>Cadastrar Nova Fonte</h3>
                  <p style={styles.formSubtitle}>Insira uma empresa parceira ou seu respectivo portal de vagas Gupy para incluir no mapeamento diário.</p>
                  <form onSubmit={handleAddSource} style={styles.sourcesForm}>
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Nome da Empresa</label>
                      <input 
                        type="text" 
                        placeholder="Ex: Assaí Atacadista"
                        value={newSourceName}
                        onChange={(e) => setNewSourceName(e.target.value)}
                        required
                        style={styles.formInput}
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>URL do Portal Gupy</label>
                      <input 
                        type="url" 
                        placeholder="Ex: https://assai.gupy.io/"
                        value={newSourceUrl}
                        onChange={(e) => setNewSourceUrl(e.target.value)}
                        required
                        style={styles.formInput}
                      />
                    </div>
                    <button type="submit" disabled={submittingSource} style={styles.formSubmitBtn}>
                      {submittingSource ? 'Salvando...' : 'Adicionar Fonte'}
                    </button>
                  </form>
                </div>

                {/* Listagem */}
                <div style={styles.sourcesListCard}>
                  <h3 style={styles.sectionSubtitle}>Fontes de Busca Ativas ({sources.length})</h3>
                  {sources.length === 0 ? (
                    <p style={styles.noSources}>Nenhuma fonte de busca cadastrada no momento. Adicione uma no formulário ao lado.</p>
                  ) : (
                    <div style={styles.tableWrapper}>
                      <table style={styles.table}>
                        <thead>
                          <tr>
                            <th style={styles.th}>Empresa</th>
                            <th style={styles.th}>URL do Portal</th>
                            <th style={styles.th}>Status</th>
                            <th style={styles.thAction}>Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sources.map(source => (
                            <tr key={source.id} style={styles.tr}>
                              <td style={styles.td}><strong>{source.nome_fonte}</strong></td>
                              <td style={styles.td}>
                                <a href={source.url} target="_blank" rel="noopener noreferrer" style={styles.sourceLink}>
                                  {source.url} 🔗
                                </a>
                              </td>
                              <td style={source.ativa ? styles.statusBadgeActive : styles.statusBadgeInactive}>
                                {source.ativa ? 'Ativa' : 'Inativa'}
                              </td>
                              <td style={styles.tdAction}>
                                <button 
                                  onClick={() => handleDeleteSource(source.id)} 
                                  style={styles.deleteBtn}
                                  title="Excluir Fonte"
                                >
                                  🗑️ Excluir
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
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
          currentUser={currentUser || {
            id: 'guest_candidate_id',
            nome: 'Candidato Visitante',
            email: 'visitante@candidato.com',
            whatsapp_configurado: true,
            whatsapp: '5511999999999',
            cidade: 'São Paulo',
            estado: 'SP',
            categorias_vagas: 'Administrativo, Tecnologia',
            frequencia_envio: 'Diária',
            token_confirmacao: 'tok_visitante'
          }}
          onRefreshUserStatus={refreshUserStatus}
        />
      )}

      {currentRoute === 'company-panel' && (
        /* ════════════════ ÁREA DA EMPRESA PARCEIRA ════════════════ */
        <CompanyArea 
          company={currentCompany || {
            id: 'guest_company_id',
            cnpj: '12.345.678/0001-90',
            nome_fantasia: 'Empresa Visitante Ltda',
            email: 'recrutamento@visitante.com',
            telefone: '(11) 99999-9999',
            site: 'https://visitante.com',
            token_acesso: 'tok_comp_visitante'
          }}
          onLogout={handleCompanyLogout}
          apiUrl={API_URL}
          showToast={showToast}
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
  loginCard: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '2.5rem',
    borderRadius: '16px',
    border: '1px solid var(--border-color)',
  },
  selectionGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem',
    marginTop: '1.5rem',
  },
  selectionButton: {
    padding: '2rem 1.5rem',
    borderRadius: '12px',
    border: '1px solid var(--border-color)',
    backgroundColor: '#ffffff05',
    color: 'var(--color-dark)',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.2s ease-in-out',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  selectionDesc: {
    fontSize: '0.8rem',
    color: '#9ca3af',
    marginTop: '0.5rem',
    lineHeight: '1.3',
    fontWeight: 'normal',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--primary-color)',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '0.9rem',
    padding: 0,
  },
  formInline: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginTop: '1rem',
  },
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
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 'var(--space-md)',
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
  },
  adminNav: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1.5rem',
  },
  adminNavBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#ffffff90',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 600,
    transition: 'all 0.2s ease-in-out',
  },
  adminNavBtnActive: {
    backgroundColor: 'var(--color-primary)',
    color: 'var(--color-dark)',
    border: '1px solid var(--color-primary)',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 700,
    boxShadow: '0 4px 12px rgba(115, 222, 126, 0.2)',
  },
  sourcesContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '2rem',
    alignItems: 'start',
  },
  sourcesFormCard: {
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-gray-light)',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: 'var(--shadow-sm)',
  },
  sourcesListCard: {
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-gray-light)',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: 'var(--shadow-sm)',
    overflow: 'hidden',
  },
  formTitle: {
    fontSize: '1.2rem',
    color: 'var(--color-dark)',
    marginBottom: '0.5rem',
    fontWeight: 700,
    textAlign: 'left',
  },
  formSubtitle: {
    fontSize: '0.8rem',
    color: 'var(--color-gray-text)',
    marginBottom: '1.5rem',
    lineHeight: 1.4,
    textAlign: 'left',
  },
  sourcesForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    textAlign: 'left',
  },
  formLabel: {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: 'var(--color-dark)',
  },
  formInput: {
    padding: '10px 12px',
    border: '1px solid var(--color-gray-light)',
    borderRadius: '6px',
    fontSize: '0.85rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  formSubmitBtn: {
    backgroundColor: 'var(--color-accent)',
    color: 'var(--color-white)',
    padding: '12px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: '0.5rem',
    transition: 'all 0.2s',
  },
  sectionSubtitle: {
    fontSize: '1.1rem',
    color: 'var(--color-dark)',
    marginBottom: '1rem',
    fontWeight: 600,
    textAlign: 'left',
  },
  noSources: {
    fontSize: '0.9rem',
    color: 'var(--color-gray-text)',
    padding: '2rem 0',
    textAlign: 'center',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  th: {
    padding: '12px',
    borderBottom: '2px solid var(--color-gray-light)',
    fontSize: '0.85rem',
    fontWeight: 700,
    color: 'var(--color-dark)',
  },
  thAction: {
    padding: '12px',
    borderBottom: '2px solid var(--color-gray-light)',
    fontSize: '0.85rem',
    fontWeight: 700,
    color: 'var(--color-dark)',
    textAlign: 'right',
  },
  tr: {
    borderBottom: '1px solid var(--color-gray-light)',
  },
  td: {
    padding: '12px',
    fontSize: '0.85rem',
    color: 'var(--color-dark)',
    verticalAlign: 'middle',
  },
  tdAction: {
    padding: '12px',
    fontSize: '0.85rem',
    textAlign: 'right',
    verticalAlign: 'middle',
  },
  sourceLink: {
    color: 'var(--color-accent)',
    textDecoration: 'none',
    fontWeight: 500,
  },
  statusBadgeActive: {
    backgroundColor: 'var(--color-primary-ice)',
    color: 'var(--color-primary-dark)',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: 700,
  },
  statusBadgeInactive: {
    backgroundColor: '#f3f4f6',
    color: '#6b7280',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: 700,
  },
  deleteBtn: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  }
};

export default App;
