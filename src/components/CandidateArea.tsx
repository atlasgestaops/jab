import React, { useState } from 'react';
import type { CandidateApplication } from '../App';

interface CandidateAreaProps {
  applications: CandidateApplication[];
  onUpdateStatus: (jobId: string, status: CandidateApplication['status']) => void;
  onUpdateNotes: (jobId: string, notes: string) => void;
  onRemoveJob: (jobId: string) => void;
  onNavigateToPortal: () => void;
  currentUser: {
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
  } | null;
  onRefreshUserStatus: (userId: string) => void;
}

type StatusFilter = 'TODOS' | CandidateApplication['status'];

export const CandidateArea: React.FC<CandidateAreaProps> = ({
  applications,
  onUpdateStatus,
  onUpdateNotes,
  onRemoveJob,
  onNavigateToPortal,
  currentUser,
  onRefreshUserStatus,
}) => {
  const [filter, setFilter] = useState<StatusFilter>('TODOS');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState<string>('');

  // Contagem de estatísticas
  const totalCount = applications.length;
  const sentCount = applications.filter(app => app.status === 'CANDIDATADO').length;
  const interviewCount = applications.filter(app => app.status === 'ENTREVISTA').length;
  const approvedCount = applications.filter(app => app.status === 'APROVADO').length;

  // Filtragem da lista
  const filteredApps = applications.filter(app => {
    if (filter === 'TODOS') return true;
    return app.status === filter;
  });

  const handleNotesFocus = (id: string, notes: string) => {
    setEditingNotesId(id);
    setTempNotes(notes);
  };

  const handleNotesBlur = (id: string) => {
    onUpdateNotes(id, tempNotes);
    setEditingNotesId(null);
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch (e) {
      return 'Data indisponível';
    }
  };

  return (
    <main className="container fade-in" style={{ padding: 'var(--space-md) var(--space-sm)' }}>
      {/* Hero Section do Painel */}
      <section className="candidate-hero" style={styles.hero}>
        <div style={styles.heroContent}>
          <span className="badge-profile" style={styles.badge}>PAINEL PESSOAL</span>
          <h1 style={styles.title}>Meu Gerenciador de Vagas 💼</h1>
          <p style={styles.subtitle}>
            Organize suas inscrições, agende suas entrevistas e acompanhe o progresso de cada candidatura para não perder nenhuma oportunidade.
          </p>
        </div>
      </section>

      {/* Seção de Alertas do WhatsApp (Double Opt-in e Chatbot) */}
      {currentUser && (
        <section className="whatsapp-alert-manager glass" style={styles.alertManager}>
          <div style={styles.alertHeader}>
            <span style={styles.alertIcon}>🤖</span>
            <div>
              <h2 style={styles.alertTitle}>Configurações do Robô de Vagas</h2>
              <p style={styles.alertSubtitle}>Cadastrado com o e-mail: <strong>{currentUser.email}</strong></p>
            </div>
          </div>

          {!currentUser.whatsapp_configurado ? (
            <div style={styles.alertSetup}>
              <p style={styles.alertText}>
                Seu e-mail está confirmado! Para começar a receber as vagas de Jovem Aprendiz no seu WhatsApp, clique no botão abaixo para iniciar a conversa e configurar as preferências (região, categorias de interesse e frequência de alertas) com o nosso assistente (JAB).
              </p>
              <div style={styles.alertActions}>
                <a 
                  href={`https://wa.me/5511999999999?text=Iniciar%20cadastro%20${currentUser.token_confirmacao}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="whatsapp-submit-btn"
                  style={styles.setupButton}
                >
                  Ativar Alertas no WhatsApp 🟢
                </a>
                <button 
                  onClick={() => onRefreshUserStatus(currentUser.id)}
                  style={styles.refreshButton}
                >
                  🔄 Já configurei / Atualizar Status
                </button>
              </div>
            </div>
          ) : (
            <div style={styles.alertActive}>
              <div style={styles.preferenceGrid}>
                <div style={styles.prefItem}>
                  <span style={styles.prefLabel}>📞 WhatsApp</span>
                  <span style={styles.prefValue}>{currentUser.whatsapp || 'Configurando...'}</span>
                </div>
                <div style={styles.prefItem}>
                  <span style={styles.prefLabel}>📍 Localidade</span>
                  <span style={styles.prefValue}>{currentUser.cidade ? `${currentUser.cidade}/${currentUser.estado || 'SP'}` : 'Não configurada'}</span>
                </div>
                <div style={styles.prefItem}>
                  <span style={styles.prefLabel}>🎯 Categorias</span>
                  <span style={styles.prefValue}>{currentUser.categorias_vagas || 'Todas as vagas'}</span>
                </div>
                <div style={styles.prefItem}>
                  <span style={styles.prefLabel}>⏱️ Frequência</span>
                  <span style={styles.prefValue}>
                    {currentUser.frequencia_envio === 'REALTIME' && 'Tempo Real ⚡'}
                    {currentUser.frequencia_envio === 'DIARIO' && 'Resumo Diário 📅'}
                    {currentUser.frequencia_envio === 'SEMANAL' && 'Resumo Semanal 🗓️'}
                  </span>
                </div>
              </div>
              <div style={styles.alertActiveActions}>
                <span style={styles.activeBadge}>🟢 Status: Robô Ativo e Filtrando Vagas</span>
                <a 
                  href={`https://wa.me/5511999999999?text=Reconfigurar`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={styles.reconfigureLink}
                >
                  Alterar preferências no WhatsApp ↗
                </a>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Grid de Estatísticas */}
      <section className="stats-grid" style={styles.statsGrid}>
        <div className="stats-card" style={{ ...styles.statsCard, borderLeft: '4px solid var(--color-gray-medium)' }}>
          <span style={styles.statsIcon}>📂</span>
          <div>
            <div style={styles.statsNumber}>{totalCount}</div>
            <div style={styles.statsLabel}>Total Monitoradas</div>
          </div>
        </div>

        <div className="stats-card" style={{ ...styles.statsCard, borderLeft: '4px solid var(--color-accent)' }}>
          <span style={styles.statsIcon}>✉️</span>
          <div>
            <div style={styles.statsNumber}>{sentCount}</div>
            <div style={styles.statsLabel}>Currículos Enviados</div>
          </div>
        </div>

        <div className="stats-card" style={{ ...styles.statsCard, borderLeft: '4px solid var(--color-highlight)' }}>
          <span style={styles.statsIcon}>📞</span>
          <div>
            <div style={styles.statsNumber}>{interviewCount}</div>
            <div style={styles.statsLabel}>Entrevistas Agendadas</div>
          </div>
        </div>

        <div className="stats-card" style={{ ...styles.statsCard, borderLeft: '4px solid var(--color-success)' }}>
          <span style={styles.statsIcon}>🎉</span>
          <div>
            <div style={styles.statsNumber}>{approvedCount}</div>
            <div style={styles.statsLabel}>Vagas Conquistadas</div>
          </div>
        </div>
      </section>

      {/* Controles de Filtro */}
      <section className="filter-section" style={styles.filterSection}>
        <div style={styles.filterGroup}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-dark)' }}>Filtrar Status:</span>
          <div style={styles.filterButtons}>
            {(['TODOS', 'SALVA', 'CANDIDATADO', 'ENTREVISTA', 'APROVADO', 'REPROVADO'] as StatusFilter[]).map((status) => {
              const labelMap: Record<StatusFilter, string> = {
                TODOS: 'Todas',
                SALVA: '📝 Salvas',
                CANDIDATADO: '✉️ Candidatadas',
                ENTREVISTA: '📞 Entrevistas',
                APROVADO: '🎉 Aprovadas',
                REPROVADO: '❌ Reprovadas'
              };
              
              const isActive = filter === status;
              return (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  style={{
                    ...styles.filterButton,
                    backgroundColor: isActive ? 'var(--color-dark)' : 'var(--color-white)',
                    color: isActive ? 'var(--color-white)' : 'var(--color-gray-text)',
                    borderColor: isActive ? 'var(--color-dark)' : 'var(--color-gray-light)',
                  }}
                >
                  {labelMap[status]}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Listagem de Vagas Monitoradas */}
      {filteredApps.length === 0 ? (
        <div className="empty-candidate-state" style={styles.emptyState}>
          <span style={styles.emptyIcon}>🔍</span>
          <h3>Nenhuma vaga encontrada neste filtro</h3>
          <p>
            {filter === 'TODOS'
              ? 'Você ainda não salvou nenhuma candidatura. Vá para o Portal de Vagas e salve sua primeira oportunidade!'
              : `Você não possui candidaturas com o status "${filter.toLowerCase()}".`}
          </p>
          <button onClick={onNavigateToPortal} style={styles.backButton}>
            Explorar Vagas no Portal
          </button>
        </div>
      ) : (
        <div className="candidate-applications-list" style={styles.applicationsList}>
          {filteredApps.map((app) => {
            const { job, status, notes, dateAdded, jobId } = app;
            
            // Definição da cor e borda baseado no status
            const statusConfig = {
              SALVA: { color: 'var(--color-gray-medium)', label: 'Salva', border: '#9CA3AF' },
              CANDIDATADO: { color: 'var(--color-accent)', label: 'Candidatado', border: '#2965AE' },
              ENTREVISTA: { color: 'var(--color-highlight)', label: 'Entrevista', border: '#FABD14' },
              APROVADO: { color: 'var(--color-success)', label: 'Aprovado 🎉', border: '#059669' },
              REPROVADO: { color: 'var(--color-error)', label: 'Não Selecionado ❌', border: '#DC2626' }
            };

            const currentStatus = statusConfig[status];

            return (
              <div 
                key={jobId} 
                className={`app-card-candidate status-border-${status.toLowerCase()}`}
                style={{
                  ...styles.applicationCard,
                  borderLeft: `5px solid ${currentStatus.border}`
                }}
              >
                {/* Cabeçalho do Card */}
                <div style={styles.cardHeader}>
                  <div>
                    <span style={{ 
                      ...styles.statusBadge, 
                      backgroundColor: `${currentStatus.color}15`, 
                      color: currentStatus.color,
                      borderColor: `${currentStatus.color}40`
                    }}>
                      {currentStatus.label}
                    </span>
                    <h3 style={styles.jobTitle}>{job.titulo}</h3>
                    <p style={styles.jobSub}>
                      <strong>{job.empresa}</strong> • {job.localidade} • <span style={styles.origem}>Origem: {job.origem}</span>
                    </p>
                  </div>
                  
                  {/* Dropdown de Ações Rápidas de Status */}
                  <div style={styles.statusControl}>
                    <label style={styles.statusLabelSelect}>Alterar Status:</label>
                    <select
                      value={status}
                      onChange={(e) => onUpdateStatus(jobId, e.target.value as any)}
                      style={styles.statusSelect}
                    >
                      <option value="SALVA">📝 Salva</option>
                      <option value="CANDIDATADO">✉️ Candidatado</option>
                      <option value="ENTREVISTA">📞 Entrevista</option>
                      <option value="APROVADO">🎉 Aprovado</option>
                      <option value="REPROVADO">❌ Reprovado</option>
                    </select>
                  </div>
                </div>

                {/* Notas do Candidato */}
                <div style={styles.notesSection}>
                  <div style={styles.notesHeader}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-gray-text)' }}>
                      ✍️ Minhas Anotações de Processo Seletivo:
                    </span>
                  </div>
                  <textarea
                    placeholder="Escreva aqui detalhes do processo (ex: data da entrevista, perguntas feitas, nome de quem te entrevistou...)"
                    value={editingNotesId === jobId ? tempNotes : notes}
                    onChange={(e) => setTempNotes(e.target.value)}
                    onFocus={() => handleNotesFocus(jobId, notes)}
                    onBlur={() => handleNotesBlur(jobId)}
                    className="candidate-notes-textarea"
                    style={styles.notesTextarea}
                  />
                </div>

                {/* Rodapé do Card */}
                <div style={styles.cardFooter}>
                  <span style={styles.dateLabel}>Adicionado em: {formatDate(dateAdded)}</span>
                  <div style={styles.footerActions}>
                    <a 
                      href={job.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={styles.externalLink}
                    >
                      Abrir link original ↗
                    </a>
                    <button 
                      onClick={() => onRemoveJob(jobId)} 
                      style={styles.removeButton}
                      title="Remover vaga do painel de controle"
                    >
                      Excluir Registro 🗑️
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
};

const styles = {
  hero: {
    background: 'linear-gradient(135deg, var(--color-dark) 0%, #2e2e4e 100%)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--space-lg) var(--space-md)',
    color: 'var(--color-white)',
    marginBottom: 'var(--space-md)',
    textAlign: 'left' as const,
    boxShadow: 'var(--shadow-md)',
  },
  heroContent: {
    maxWidth: '800px',
  },
  badge: {
    fontSize: 'var(--text-2xs)',
    letterSpacing: '0.15em',
    fontWeight: 800,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'var(--color-highlight)',
    padding: '4px 10px',
    borderRadius: 'var(--radius-pill)',
    display: 'inline-block',
    marginBottom: 'var(--space-xs)',
  },
  title: {
    fontSize: 'var(--text-xl)',
    color: 'var(--color-white)',
    marginBottom: 'var(--space-2xs)',
  },
  subtitle: {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-gray-medium)',
    lineHeight: '1.5',
    margin: 0,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 'var(--space-sm)',
    marginBottom: 'var(--space-md)',
  },
  statsCard: {
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-gray-light)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-sm) var(--space-md)',
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
    boxShadow: 'var(--shadow-sm)',
    textAlign: 'left' as const,
  },
  statsIcon: {
    fontSize: '2rem',
  },
  statsNumber: {
    fontSize: '1.75rem',
    fontWeight: 800,
    color: 'var(--color-dark)',
    lineHeight: 1,
  },
  statsLabel: {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-gray-text)',
    fontWeight: 600,
    marginTop: '4px',
  },
  filterSection: {
    backgroundColor: 'var(--color-white)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-sm)',
    border: '1px solid var(--color-gray-light)',
    marginBottom: 'var(--space-md)',
    textAlign: 'left' as const,
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 'var(--space-xs)',
  },
  filterButtons: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '6px',
  },
  filterButton: {
    padding: '8px var(--space-sm)',
    fontSize: 'var(--text-xs)',
    border: '1px solid',
    borderRadius: 'var(--radius-pill)',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
  },
  applicationsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 'var(--space-sm)',
  },
  applicationCard: {
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-gray-light)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-md)',
    boxShadow: 'var(--shadow-sm)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 'var(--space-sm)',
    textAlign: 'left' as const,
    transition: 'var(--transition-normal)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap' as const,
    gap: 'var(--space-sm)',
  },
  statusBadge: {
    fontSize: 'var(--text-2xs)',
    fontWeight: 800,
    padding: '3px 8px',
    borderRadius: 'var(--radius-pill)',
    border: '1px solid',
    display: 'inline-block',
    marginBottom: 'var(--space-2xs)',
  },
  jobTitle: {
    fontSize: 'var(--text-md)',
    fontWeight: 700,
    color: 'var(--color-dark)',
    margin: '4px 0',
  },
  jobSub: {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-gray-text)',
    margin: 0,
  },
  origem: {
    color: 'var(--color-accent-warm)',
    fontWeight: 600,
  },
  statusControl: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-start',
    gap: '4px',
  },
  statusLabelSelect: {
    fontSize: 'var(--text-2xs)',
    fontWeight: 700,
    color: 'var(--color-gray-text)',
  },
  statusSelect: {
    padding: '6px 12px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--color-gray-light)',
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    color: 'var(--color-dark)',
    backgroundColor: 'var(--color-snow)',
    cursor: 'pointer',
    outline: 'none',
  },
  notesSection: {
    borderTop: '1px dashed var(--color-gray-light)',
    paddingTop: 'var(--space-sm)',
  },
  notesHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '6px',
  },
  notesTextarea: {
    width: '100%',
    minHeight: '70px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--color-gray-light)',
    padding: '8px var(--space-xs)',
    fontSize: 'var(--text-xs)',
    fontFamily: 'inherit',
    lineHeight: '1.4',
    color: 'var(--color-dark)',
    resize: 'vertical' as const,
    outline: 'none',
    backgroundColor: '#FAFBFD',
    transition: 'var(--transition-fast)',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid var(--color-gray-light)',
    paddingTop: 'var(--space-xs)',
    flexWrap: 'wrap' as const,
    gap: 'var(--space-sm)',
  },
  dateLabel: {
    fontSize: 'var(--text-2xs)',
    color: 'var(--color-gray-medium)',
    fontWeight: 600,
  },
  footerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-md)',
  },
  externalLink: {
    fontSize: 'var(--text-xs)',
    fontWeight: 700,
    color: 'var(--color-accent)',
  },
  removeButton: {
    backgroundColor: 'transparent',
    color: 'var(--color-error)',
    fontSize: 'var(--text-2xs)',
    padding: '4px 8px',
    border: '1px solid transparent',
    borderRadius: 'var(--radius-sm)',
    fontWeight: 600,
  },
  emptyState: {
    padding: 'var(--space-2xl) var(--space-md)',
    textAlign: 'center' as const,
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-gray-light)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-sm)',
    maxWidth: '600px',
    margin: '0 auto',
  },
  emptyIcon: {
    fontSize: '3.5rem',
    display: 'block',
    marginBottom: 'var(--space-sm)',
  },
  backButton: {
    backgroundColor: 'var(--color-primary)',
    color: 'var(--color-dark)',
    padding: 'var(--space-sm) var(--space-md)',
    borderRadius: 'var(--radius-sm)',
    fontWeight: 700,
    marginTop: 'var(--space-md)',
    boxShadow: 'var(--shadow-sm)',
  },
  alertManager: {
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-primary-medium)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-md)',
    marginBottom: 'var(--space-md)',
    boxShadow: 'var(--shadow-sm)',
    textAlign: 'left' as const,
  },
  alertHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-xs)',
    marginBottom: 'var(--space-sm)',
    borderBottom: '1px solid var(--color-gray-light)',
    paddingBottom: 'var(--space-xs)',
  },
  alertIcon: {
    fontSize: '2rem',
  },
  alertTitle: {
    fontSize: 'var(--text-md)',
    color: 'var(--color-primary-dark)',
    margin: 0,
  },
  alertSubtitle: {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-gray-text)',
    margin: 0,
  },
  alertText: {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-dark)',
    lineHeight: '1.5',
    marginBottom: 'var(--space-sm)',
  },
  alertSetup: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  alertActions: {
    display: 'flex',
    gap: 'var(--space-sm)',
    flexWrap: 'wrap' as const,
    alignItems: 'center',
  },
  setupButton: {
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
    width: 'auto',
    padding: '10px var(--space-md)',
  },
  refreshButton: {
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-gray-medium)',
    color: 'var(--color-dark)',
    padding: '10px var(--space-md)',
    borderRadius: 'var(--radius-sm)',
    fontWeight: 700,
    cursor: 'pointer',
  },
  alertActive: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 'var(--space-sm)',
  },
  preferenceGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 'var(--space-xs)',
    backgroundColor: 'var(--color-snow)',
    padding: 'var(--space-sm)',
    borderRadius: 'var(--radius-sm)',
  },
  prefItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2px',
  },
  prefLabel: {
    fontSize: 'var(--text-2xs)',
    color: 'var(--color-gray-text)',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
  },
  prefValue: {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-dark)',
    fontWeight: 700,
  },
  alertActiveActions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    gap: 'var(--space-sm)',
  },
  activeBadge: {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-success)',
    fontWeight: 700,
  },
  reconfigureLink: {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-accent)',
    fontWeight: 700,
  },
};
