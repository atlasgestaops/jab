import React from 'react';
import type { Job } from './JobCard';
import { AdBlock } from './AdBlock';

interface JobDetailProps {
  job: Job | null;
  onBack: () => void;
  onSaveJob?: (job: Job) => void;
  isSaved?: boolean;
}

export const JobDetail: React.FC<JobDetailProps> = ({ job, onBack, onSaveJob, isSaved = false }) => {
  if (!job) return null;

  const isRemote = job.localidade.toLowerCase().includes('remoto');

  // Formatação de data amigável
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div style={styles.page} className="fade-in">
      {/* Top Breadcrumb & Back Button */}
      <div className="container" style={styles.breadcrumbContainer}>
        <button style={styles.backButton} onClick={onBack}>
          ← Voltar para a lista de vagas
        </button>
      </div>

      {/* AdSense Top Banner */}
      <div className="container">
        <AdBlock type="horizontal" />
      </div>

      {/* Main Grid: Details on Left, Sidebar with Ad/Info on Right */}
      <div className="container detail-grid">
        {/* Left Side: Job Content */}
        <main style={styles.mainContent}>
          <div style={styles.cardHeader}>
            <span style={styles.company}>{job.empresa}</span>
            <h1 style={styles.title}>{job.titulo}</h1>
            
            <div style={styles.metaContainer}>
              <div style={styles.metaItem}>
                <span>{isRemote ? '💻' : '📍'}</span>
                <span>{job.localidade}</span>
              </div>
              <div style={styles.metaItem}>
                <span>💼</span>
                <span>Jovem Aprendiz</span>
              </div>
              {job.data_publicacao && (
                <div style={styles.metaItem}>
                  <span>📅</span>
                  <span>Publicada em {formatDate(job.data_publicacao)}</span>
                </div>
              )}
            </div>
          </div>

          <div style={styles.descriptionSection}>
            <h2 style={styles.sectionTitle}>Descrição da Vaga</h2>
            <div style={styles.sectionText} dangerouslySetInnerHTML={{ __html: job.descricao }} />
          </div>

          <div style={styles.applySection}>
            <p style={styles.applyPrompt}>
              Gostou da oportunidade? Clique no botão abaixo para ser direcionado ao portal de inscrição original.
            </p>
            <div style={styles.applyActionsContainer}>
              <a 
                href={job.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                style={styles.applyLink}
                onClick={() => onSaveJob && onSaveJob(job)}
              >
                <button style={styles.applyButton}>
                  Enviar Currículo / Candidatar-se ↗
                </button>
              </a>

              {onSaveJob && (
                <button 
                  style={isSaved ? styles.detailSavedButton : styles.detailSaveButton} 
                  onClick={() => onSaveJob(job)}
                >
                  {isSaved ? 'Vaga Salva no seu Painel ✓' : 'Salvar Vaga no Painel'}
                </button>
              )}
            </div>
          </div>

          {/* AdSense Footer Banner */}
          <div style={styles.bottomAd}>
            <AdBlock type="horizontal" />
          </div>
        </main>

        {/* Right Side: Sidebar */}
        <aside style={styles.sidebar}>
          {/* AdSense Sidebar Banner */}
          <AdBlock type="sidebar" />

          {/* Box de segurança JAB */}
          <div style={styles.securityBox}>
            <h3 style={styles.securityTitle}>🔒 Vaga Verificada</h3>
            <p style={styles.securityText}>
              Esta vaga foi triada e validada manualmente pela equipe do JAB. Não cobramos taxas e não solicitamos dados bancários. Denuncie qualquer atividade suspeita.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    paddingBottom: 'var(--space-xl)',
    backgroundColor: 'var(--color-snow)',
  },
  breadcrumbContainer: {
    paddingTop: 'var(--space-md)',
    paddingBottom: 'var(--space-xs)',
    display: 'flex',
  },
  backButton: {
    backgroundColor: 'transparent',
    color: 'var(--color-accent-dark)',
    border: 'none',
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 0',
  },
  mainContent: {
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-gray-light)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--space-lg)',
    boxShadow: 'var(--shadow-sm)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-lg)',
  },
  cardHeader: {
    borderBottom: '1px solid var(--color-gray-light)',
    paddingBottom: 'var(--space-md)',
  },
  company: {
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    color: 'var(--color-accent)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  title: {
    fontSize: 'var(--text-xl)',
    color: 'var(--color-dark)',
    marginTop: 'var(--space-2xs)',
    marginBottom: 'var(--space-sm)',
  },
  metaContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 'var(--space-xs)',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'var(--color-snow)',
    padding: '6px 12px',
    borderRadius: 'var(--radius-pill)',
    fontSize: 'var(--text-xs)',
    color: 'var(--color-gray-text)',
    fontWeight: 500,
    border: '1px solid var(--color-gray-light)',
  },
  descriptionSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-sm)',
  },
  sectionTitle: {
    fontSize: 'var(--text-md)',
    color: 'var(--color-dark)',
    borderLeft: '4px solid var(--color-primary)',
    paddingLeft: 'var(--space-xs)',
  },
  sectionText: {
    fontSize: 'var(--text-base)',
    color: 'var(--color-dark)',
    lineHeight: 1.7,
    whiteSpace: 'pre-wrap',
  },
  applySection: {
    backgroundColor: 'var(--color-primary-ice)',
    border: '1px solid var(--color-primary-medium)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-md)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'var(--space-sm)',
    textAlign: 'center',
  },
  applyPrompt: {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-dark)',
    fontWeight: 500,
  },
  applyLink: {
    textDecoration: 'none',
  },
  applyButton: {
    backgroundColor: 'var(--color-primary)',
    color: 'var(--color-dark)',
    padding: 'var(--space-sm) var(--space-xl)',
    borderRadius: 'var(--radius-sm)',
    fontSize: 'var(--text-base)',
    fontWeight: 700,
    boxShadow: 'var(--shadow-sm)',
    transition: 'var(--transition-fast)',
    cursor: 'pointer',
  },
  applyActionsContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
    marginTop: 'var(--space-2xs)',
  },
  detailSaveButton: {
    backgroundColor: 'var(--color-white)',
    color: 'var(--color-gray-text)',
    border: '1px dashed var(--color-gray-medium)',
    padding: 'var(--space-sm) var(--space-xl)',
    borderRadius: 'var(--radius-sm)',
    fontSize: 'var(--text-base)',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
  },
  detailSavedButton: {
    backgroundColor: 'var(--color-success-bg)',
    color: 'var(--color-success)',
    border: '1px solid var(--color-success)',
    padding: 'var(--space-sm) var(--space-xl)',
    borderRadius: 'var(--radius-sm)',
    fontSize: 'var(--text-base)',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
  },
  bottomAd: {
    borderTop: '1px solid var(--color-gray-light)',
    paddingTop: 'var(--space-md)',
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-md)',
  },
  securityBox: {
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-gray-light)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-md)',
    boxShadow: 'var(--shadow-sm)',
  },
  securityTitle: {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-dark)',
    marginBottom: 'var(--space-xs)',
  },
  securityText: {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-gray-text)',
    lineHeight: 1.4,
  }
};
