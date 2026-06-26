import React from 'react';
import type { Job } from './JobCard';

interface AdminJobCardProps {
  job: Job;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const AdminJobCard: React.FC<AdminJobCardProps> = ({ job, onApprove, onReject }) => {
  // Formatação de data amigável
  const formatDateTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <article className="admin-job-card fade-in">
      <div style={styles.header}>
        <div>
          <span style={styles.originBadge}>{job.origem}</span>
          <h3 style={styles.title}>{job.titulo}</h3>
          <span style={styles.company}>{job.empresa} — 📍 {job.localidade}</span>
        </div>
        <div style={styles.statusBadge}>PENDENTE</div>
      </div>

      <div style={styles.body}>
        <p style={styles.description}>
          {job.descricao.length > 220 
            ? `${job.descricao.substring(0, 220)}...` 
            : job.descricao
          }
        </p>
        <div style={styles.discoveryInfo}>
          Coletado em: {formatDateTime(job.data_descoberta)}
        </div>
      </div>

      <div className="admin-job-card-footer">
        <a 
          href={job.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          style={styles.link}
        >
          Abrir Link da Vaga ↗
        </a>

        <div className="admin-actions-container">
          <button 
            style={styles.rejectButton} 
            onClick={() => onReject(job.id)}
            title="Rejeitar vaga e arquivar"
          >
            Rejeitar ✗
          </button>
          
          <button 
            style={styles.approveButton} 
            onClick={() => onApprove(job.id)}
            title="Aprovar e publicar no portal"
          >
            Aprovar Vaga ✓
          </button>
        </div>
      </div>
    </article>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 'var(--space-sm)',
  },
  originBadge: {
    backgroundColor: 'var(--color-accent-light)',
    color: 'var(--color-accent)',
    fontSize: '10px',
    fontWeight: 700,
    textTransform: 'uppercase',
    padding: '2px 8px',
    borderRadius: 'var(--radius-pill)',
    marginBottom: '6px',
    display: 'inline-block',
  },
  title: {
    fontSize: 'var(--text-md)',
    color: 'var(--color-dark)',
    marginBottom: '2px',
  },
  company: {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-gray-text)',
    fontWeight: 500,
  },
  statusBadge: {
    backgroundColor: 'var(--color-warning-bg)',
    color: 'var(--color-warning)',
    fontSize: '10px',
    fontWeight: 700,
    padding: '4px 10px',
    borderRadius: 'var(--radius-pill)',
    border: '1px solid var(--color-warning)',
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-2xs)',
  },
  description: {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-dark)',
    lineHeight: 1.5,
  },
  discoveryInfo: {
    fontSize: 'var(--text-2xs)',
    color: 'var(--color-gray-medium)',
    fontStyle: 'italic',
  },
  link: {
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    color: 'var(--color-accent)',
    transition: 'var(--transition-fast)',
  },
  rejectButton: {
    backgroundColor: 'var(--color-error-bg)',
    color: 'var(--color-error)',
    border: '1px solid var(--color-error)',
    padding: 'var(--space-xs) var(--space-sm)',
    borderRadius: 'var(--radius-sm)',
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
  },
  approveButton: {
    backgroundColor: 'var(--color-success)',
    color: 'var(--color-white)',
    padding: 'var(--space-xs) var(--space-sm)',
    borderRadius: 'var(--radius-sm)',
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    boxShadow: 'var(--shadow-sm)',
  }
};
