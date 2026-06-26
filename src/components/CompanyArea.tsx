import React, { useState, useEffect } from 'react';
import type { Job } from './JobCard';

interface Company {
  id: string;
  cnpj: string;
  nome_fantasia: string;
  email: string;
  telefone: string;
  site?: string;
  token_acesso: string;
}

interface CompanyAreaProps {
  company: Company;
  onLogout: () => void;
  apiUrl: string;
  showToast: (message: string) => void;
}

// Lista de Estados do Brasil (UFs)
const BRAZIL_STATES = [
  { sigla: 'AC', nome: 'Acre' },
  { sigla: 'AL', nome: 'Alagoas' },
  { sigla: 'AP', nome: 'Amapá' },
  { sigla: 'AM', nome: 'Amazonas' },
  { sigla: 'BA', nome: 'Bahia' },
  { sigla: 'CE', nome: 'Ceará' },
  { sigla: 'DF', nome: 'Distrito Federal' },
  { sigla: 'ES', nome: 'Espírito Santo' },
  { sigla: 'GO', nome: 'Goiás' },
  { sigla: 'MA', nome: 'Maranhão' },
  { sigla: 'MT', nome: 'Mato Grosso' },
  { sigla: 'MS', nome: 'Mato Grosso do Sul' },
  { sigla: 'MG', nome: 'Minas Gerais' },
  { sigla: 'PA', nome: 'Pará' },
  { sigla: 'PB', nome: 'Paraíba' },
  { sigla: 'PR', nome: 'Paraná' },
  { sigla: 'PE', nome: 'Pernambuco' },
  { sigla: 'PI', nome: 'Piauí' },
  { sigla: 'RJ', nome: 'Rio de Janeiro' },
  { sigla: 'RN', nome: 'Rio Grande do Norte' },
  { sigla: 'RS', nome: 'Rio Grande do Sul' },
  { sigla: 'RO', nome: 'Rondônia' },
  { sigla: 'RR', nome: 'Roraima' },
  { sigla: 'SC', nome: 'Santa Catarina' },
  { sigla: 'SP', nome: 'São Paulo' },
  { sigla: 'SE', nome: 'Sergipe' },
  { sigla: 'TO', nome: 'Tocantins' }
];

export function CompanyArea({ company, onLogout, apiUrl, showToast }: CompanyAreaProps) {
  const [companyJobs, setCompanyJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);

  // Estados do formulário de nova vaga
  const [jobTitle, setJobTitle] = useState('');
  const [jobCompany, setJobCompany] = useState(company.nome_fantasia || '');
  const [jobUrl, setJobUrl] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [submittingJob, setSubmittingJob] = useState(false);

  // Estados do Dropdown Encadeado de Localidades (IBGE)
  const [selectedState, setSelectedState] = useState('');
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [loadingCities, setLoadingCities] = useState(false);

  // Carrega as cidades da API do IBGE sempre que o estado selecionado mudar
  useEffect(() => {
    if (!selectedState) {
      setCities([]);
      setSelectedCity('');
      return;
    }

    if (selectedState === 'REMOTO') {
      setCities([]);
      setSelectedCity('Remoto');
      return;
    }

    const fetchCities = async () => {
      setLoadingCities(true);
      try {
        const res = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedState}/municipios`);
        if (!res.ok) throw new Error("Erro ao buscar cidades");
        const data = await res.json();
        
        // Mapeia e ordena as cidades em ordem alfabética
        const cityNames = data.map((c: any) => c.nome).sort((a: string, b: string) => a.localeCompare(b, 'pt-BR'));
        setCities(cityNames);
        setSelectedCity(cityNames[0] || '');
      } catch (e) {
        console.error("Erro ao carregar cidades do IBGE", e);
        showToast("Erro ao carregar lista de cidades.");
        setCities([]);
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, [selectedState]);

  // Carrega as vagas cadastradas por essa empresa
  const loadCompanyJobs = async () => {
    setLoadingJobs(true);
    try {
      const res = await fetch(`${apiUrl}/empresas/vagas?empresa_id=${company.id}`);
      if (!res.ok) throw new Error("Erro na requisição");
      const data = await res.json();
      if (Array.isArray(data)) {
        setCompanyJobs(data);
      }
    } catch (e) {
      console.error("Erro ao carregar vagas da empresa", e);
      showToast("Erro ao carregar suas vagas cadastradas.");
    } finally {
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    loadCompanyJobs();
    setJobCompany(company.nome_fantasia || '');
  }, [company.id, company.nome_fantasia]);

  const handleSubmitJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle || !jobCompany || !selectedState || (selectedState !== 'REMOTO' && !selectedCity) || !jobDesc) {
      showToast("Por favor, preencha os campos obrigatórios.");
      return;
    }

    // Formata a localidade final (ex: "Porto Alegre - RS" ou "Remoto")
    const formattedLocation = selectedState === 'REMOTO' 
      ? 'Remoto' 
      : `${selectedCity} - ${selectedState}`;

    setSubmittingJob(true);
    try {
      const res = await fetch(`${apiUrl}/vagas/cadastrar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: jobTitle,
          empresa: jobCompany,
          localidade: formattedLocation,
          url: jobUrl,
          descricao: jobDesc,
          empresa_id: company.id
        })
      });

      if (res.ok) {
        showToast("Vaga enviada para a fila de moderação! 🎉");
        // Limpar formulário
        setJobTitle('');
        setJobCompany(company.nome_fantasia || '');
        setSelectedState('');
        setSelectedCity('');
        setJobUrl('');
        setJobDesc('');
        // Recarregar a lista
        loadCompanyJobs();
      } else {
        throw new Error();
      }
    } catch (e) {
      console.error("Erro ao cadastrar vaga", e);
      showToast("Erro ao enviar a vaga (API n8n indisponível).");
    } finally {
      setSubmittingJob(false);
    }
  };

  return (
    <div className="company-panel container fade-in" style={styles.container}>
      {/* Header do Painel */}
      <div style={styles.header}>
        <div>
          <span style={styles.companyBadge}>🏢 Empresa Parceira</span>
          <h2 style={styles.companyName}>{company.nome_fantasia}</h2>
          <p style={styles.companyMeta}>
            CNPJ: {company.cnpj} | E-mail: {company.email} {company.site && `| Site: ${company.site}`}
          </p>
        </div>
        <button className="btn-secondary" onClick={onLogout} style={styles.logoutBtn}>
          Sair do Painel
        </button>
      </div>

      <div style={styles.grid}>
        {/* Formulário de Cadastro de Vaga */}
        <section className="glass" style={styles.card}>
          <h3 style={styles.sectionTitle}>📣 Anunciar Nova Vaga</h3>
          <p style={styles.sectionSubtitle}>
            Publique vagas exclusivas de Jovem Aprendiz. Elas passarão pela curadoria do administrador antes de ficarem públicas.
          </p>
          <form onSubmit={handleSubmitJob} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Título do Cargo *</label>
              <input
                type="text"
                placeholder="Ex: Jovem Aprendiz Administrativo"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Nome da Empresa Contratante *</label>
              <input
                type="text"
                placeholder="Ex: Coca-Cola, Itaú ou sua própria empresa"
                value={jobCompany}
                onChange={(e) => setJobCompany(e.target.value)}
                required
                style={styles.input}
              />
            </div>

            {/* Selects Encadeados de Localidade (Estado -> Cidade) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Estado / Região *</label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  required
                  style={styles.select}
                >
                  <option value="">Selecione...</option>
                  <option value="REMOTO">Trabalho Remoto</option>
                  {BRAZIL_STATES.map((state) => (
                    <option key={state.sigla} value={state.sigla}>
                      {state.nome} ({state.sigla})
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Cidade *</label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  disabled={!selectedState || selectedState === 'REMOTO' || loadingCities}
                  required={selectedState && selectedState !== 'REMOTO'}
                  style={styles.select}
                >
                  {selectedState === 'REMOTO' ? (
                    <option value="Remoto">Remoto</option>
                  ) : !selectedState ? (
                    <option value="">Aguardando estado...</option>
                  ) : loadingCities ? (
                    <option value="">Buscando cidades...</option>
                  ) : (
                    cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Link de Inscrição da Vaga (URL)</label>
              <input
                type="url"
                placeholder="Ex: https://carreiras.empresa.com/vaga"
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Descrição da Vaga / Requisitos *</label>
              <textarea
                rows={5}
                placeholder="Descreva as atividades, os requisitos necessários e os benefícios oferecidos..."
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                required
                style={styles.textarea}
              />
            </div>

            <button type="submit" className="btn-primary" disabled={submittingJob} style={styles.submitBtn}>
              {submittingJob ? "Enviando vaga..." : "Publicar Vaga de Aprendiz"}
            </button>
          </form>
        </section>

        {/* Listagem de Vagas Enviadas */}
        <section className="glass" style={styles.card}>
          <h3 style={styles.sectionTitle}>📊 Suas Vagas Cadastradas</h3>
          <p style={styles.sectionSubtitle}>
            Acompanhe o andamento das vagas enviadas por sua empresa e o status de moderação técnica.
          </p>

          {loadingJobs ? (
            <div style={styles.loading}>Carregando suas vagas...</div>
          ) : companyJobs.length === 0 ? (
            <div style={styles.emptyState}>
              <p>Nenhuma vaga cadastrada ainda.</p>
              <span style={{ fontSize: '2rem' }}>📢</span>
            </div>
          ) : (
            <div style={styles.jobsList}>
              {companyJobs.map((job) => (
                <div key={job.id} style={styles.jobItem}>
                  <div style={styles.jobMain}>
                    <h4 style={styles.jobTitleText}>{job.titulo}</h4>
                    <p style={styles.jobLocationText}>📍 {job.localidade}</p>
                  </div>
                  <div style={styles.statusBadgeContainer}>
                    <span style={{
                      ...styles.statusBadge,
                      ...getStatusStyle(job.status)
                    }}>
                      {job.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

const getStatusStyle = (status: Job['status']) => {
  switch (status) {
    case 'VALIDADO':
    case 'PUBLICADO':
      return { backgroundColor: '#10b98122', color: '#10b981', borderColor: '#10b98144' };
    case 'PENDENTE':
      return { backgroundColor: '#f59e0b22', color: '#f59e0b', borderColor: '#f59e0b44' };
    case 'REJEITADO':
      return { backgroundColor: '#ef444422', color: '#ef4444', borderColor: '#ef444444' };
    default:
      return { backgroundColor: '#e5e7eb22', color: '#9ca3af', borderColor: '#e5e7eb44' };
  }
};

const styles = {
  container: {
    paddingTop: '2rem',
    paddingBottom: '4rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '1.5rem',
    flexWrap: 'wrap' as const,
    gap: '1rem',
  },
  companyBadge: {
    fontSize: '0.75rem',
    textTransform: 'uppercase' as const,
    fontWeight: 'bold',
    letterSpacing: '1px',
    color: 'var(--primary-color)',
    display: 'block',
    marginBottom: '0.25rem',
  },
  companyName: {
    margin: 0,
    fontSize: '2rem',
    fontWeight: 700,
  },
  companyMeta: {
    margin: '0.25rem 0 0 0',
    color: '#9ca3af',
    fontSize: '0.9rem',
  },
  logoutBtn: {
    padding: '0.6rem 1.2rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    alignItems: 'start',
  },
  card: {
    padding: '2rem',
    borderRadius: '16px',
  },
  sectionTitle: {
    margin: 0,
    fontSize: '1.4rem',
    fontWeight: 600,
  },
  sectionSubtitle: {
    margin: '0.5rem 0 1.5rem 0',
    color: '#9ca3af',
    fontSize: '0.9rem',
    lineHeight: '1.4',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.2rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.4rem',
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: 500,
    color: '#d1d5db',
  },
  input: {
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    backgroundColor: '#00000033',
    color: '#ffffff',
    outline: 'none',
  },
  select: {
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    backgroundColor: '#0c0f16',
    color: '#ffffff',
    outline: 'none',
    cursor: 'pointer',
  },
  textarea: {
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    backgroundColor: '#00000033',
    color: '#ffffff',
    outline: 'none',
    resize: 'vertical' as const,
  },
  submitBtn: {
    padding: '0.75rem',
    borderRadius: '8px',
    marginTop: '0.5rem',
    fontWeight: 'bold',
  },
  loading: {
    textAlign: 'center' as const,
    padding: '2rem 0',
    color: '#9ca3af',
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '3rem 0',
    color: '#9ca3af',
    border: '1px dashed var(--border-color)',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '1rem',
  },
  jobsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  },
  jobItem: {
    padding: '1rem',
    borderRadius: '12px',
    backgroundColor: '#ffffff05',
    border: '1px solid #ffffff0a',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
  },
  jobMain: {
    flex: 1,
  },
  jobTitleText: {
    margin: 0,
    fontSize: '1rem',
    fontWeight: 600,
  },
  jobLocationText: {
    margin: '0.2rem 0 0 0',
    fontSize: '0.8rem',
    color: '#9ca3af',
  },
  statusBadgeContainer: {
    flexShrink: 0,
  },
  statusBadge: {
    padding: '0.3rem 0.6rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    border: '1px solid',
  },
};
