import React from 'react';

export interface Job {
  id: string;
  titulo: string;
  empresa: string;
  localidade: string;
  descricao: string;
  url: string;
  origem: string;
  status: 'PENDENTE' | 'VALIDADO' | 'REJEITADO' | 'PUBLICADO';
  data_publicacao?: string;
  data_fechamento?: string;
  data_descoberta: string;
}

interface JobCardProps {
  job: Job;
  onOpenDetails: (job: Job) => void;
  onSaveJob?: (job: Job) => void;
  isSaved?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onOpenDetails, onSaveJob, isSaved = false }) => {
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

  const isRemote = job.localidade.toLowerCase().includes('remoto');

  return (
    <article className="job-card fade-in" onClick={() => onOpenDetails(job)}>
      <div style={styles.mainInfo}>
        <span style={styles.company}>{job.empresa}</span>
        <h3 style={styles.title}>
          {job.titulo}
        </h3>
        
        <div style={styles.metaContainer}>
          <div style={styles.metaItem}>
            <span style={styles.metaIcon}>{isRemote ? '💻' : '📍'}</span>
            <span style={styles.metaText}>{job.localidade}</span>
          </div>

          {job.data_publicacao && (
            <div style={styles.metaItem}>
              <span style={styles.metaIcon}>📅</span>
              <span style={styles.metaText}>{formatDate(job.data_publicacao)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="job-card-actions" onClick={(e) => e.stopPropagation()}>
        <button style={styles.detailButton} onClick={() => onOpenDetails(job)}>
          Ver Vaga
        </button>

        {onSaveJob && (
          <button 
            style={isSaved ? styles.savedButton : styles.saveButton} 
            onClick={() => onSaveJob(job)}
          >
            {isSaved ? 'Salva ✓' : 'Salvar Vaga'}
          </button>
        )}

        <a 
          href={job.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          style={styles.applyButtonLink}
          onClick={() => onSaveJob && onSaveJob(job)}
        >
          <button style={styles.applyButton}>
            Candidatar-se ↗
          </button>
        </a>
      </div>
    </article>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  mainInfo: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    textAlign: 'left',
  },
  company: {
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    textTransform: 'uppercase',
    color: 'var(--color-accent)',
    letterSpacing: '0.05em',
    marginBottom: '4px',
  },
  title: {
    fontSize: 'var(--text-lg)',
    color: 'var(--color-dark)',
    marginBottom: 'var(--space-xs)',
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
  },
  metaContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 'var(--space-sm)',
    alignItems: 'center',
    marginTop: 'var(--space-2xs)',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'var(--color-snow)',
    padding: '4px 10px',
    borderRadius: 'var(--radius-pill)',
    border: '1px solid var(--color-gray-light)',
  },
  metaIcon: {
    fontSize: '0.85rem',
  },
  metaText: {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-gray-text)',
    fontWeight: 500,
  },
  detailButton: {
    backgroundColor: 'var(--color-accent-light)',
    color: 'var(--color-accent)',
    border: '1px solid var(--color-accent-peach)',
    padding: 'var(--space-xs) var(--space-sm)',
    borderRadius: 'var(--radius-sm)',
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    transition: 'var(--transition-fast)',
  },
  saveButton: {
    backgroundColor: 'var(--color-white)',
    color: 'var(--color-gray-text)',
    border: '1px dashed var(--color-gray-medium)',
    padding: 'var(--space-xs) var(--space-sm)',
    borderRadius: 'var(--radius-sm)',
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    transition: 'var(--transition-fast)',
  },
  savedButton: {
    backgroundColor: 'var(--color-success-bg)',
    color: 'var(--color-success)',
    border: '1px solid var(--color-success)',
    padding: 'var(--space-xs) var(--space-sm)',
    borderRadius: 'var(--radius-sm)',
    fontSize: 'var(--text-sm)',
    fontWeight: 700,
    transition: 'var(--transition-fast)',
  },
  applyButtonLink: {
    textDecoration: 'none',
  },
  applyButton: {
    backgroundColor: 'var(--color-primary)', // Verde Aprendiz
    color: 'var(--color-dark)', // Escuro JAB (Contraste 7.0:1 AAA)
    padding: 'var(--space-xs) var(--space-sm)',
    borderRadius: 'var(--radius-sm)',
    fontSize: 'var(--text-sm)',
    fontWeight: 700,
    boxShadow: 'var(--shadow-sm)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    transition: 'var(--transition-fast)',
  }
};
