import React from 'react';
import type { Job } from './JobCard';

interface AdminActiveJobCardProps {
  job: Job;
  onDelete: (id: string) => void;
}

export const AdminActiveJobCard: React.FC<AdminActiveJobCardProps> = ({ job, onDelete }) => {
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

  const stripHtml = (htmlStr: string) => {
    if (!htmlStr) return '';
    return htmlStr.replace(/<[^>]*>/g, '').replace(/&nbsp;/gi, ' ');
  };

  const cleanDescription = stripHtml(job.descricao);

  const handleDeleteClick = () => {
    if (window.confirm(`Deseja realmente remover a vaga "${job.titulo}" do portal público?`)) {
      onDelete(job.id);
    }
  };

  return (
    <article className="admin-job-card fade-in" style={styles.card}>
      <div style={styles.header}>
        <div>
          <span style={styles.originBadge}>{job.origem}</span>
          <h3 style={styles.title}>{job.titulo}</h3>
          <span style={styles.company}>{job.empresa} — 📍 {job.localidade}</span>
        </div>
        <div style={styles.statusBadge}>ATIVA</div>
      </div>

      <div style={styles.body}>
        <p style={styles.description}>
          {cleanDescription.length > 220 
            ? `${cleanDescription.substring(0, 220)}...` 
            : cleanDescription
          }
        </p>
        <div style={styles.timeInfo}>
          <div>Coletada em: {formatDateTime(job.data_descoberta)}</div>
          {job.data_validacao && (
            <div>Aprovada em: {formatDateTime(job.data_validacao)}</div>
          )}
        </div>
      </div>

      <div className="admin-job-card-footer" style={styles.footer}>
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
            style={styles.deleteButton} 
            onClick={handleDeleteClick}
            title="Remover vaga do portal e arquivar"
          >
            Remover Vaga ✗
          </button>
        </div>
      </div>
    </article>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  card: {
    borderLeft: '4px solid var(--color-success, #22c55e)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 'var(--space-sm, 12px)',
  },
  originBadge: {
    backgroundColor: 'var(--color-accent-light, #e0f2fe)',
    color: 'var(--color-accent, #0284c7)',
    fontSize: '10px',
    fontWeight: 700,
    textTransform: 'uppercase',
    padding: '2px 8px',
    borderRadius: 'var(--radius-pill, 9999px)',
    marginBottom: '6px',
    display: 'inline-block',
  },
  title: {
    fontSize: 'var(--text-md, 16px)',
    color: 'var(--color-dark, #1e293b)',
    marginBottom: '2px',
  },
  company: {
    fontSize: 'var(--text-xs, 12px)',
    color: 'var(--color-gray-text, #64748b)',
    fontWeight: 500,
  },
  statusBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    color: 'var(--color-success, #22c55e)',
    fontSize: '10px',
    fontWeight: 700,
    padding: '4px 10px',
    borderRadius: 'var(--radius-pill, 9999px)',
    border: '1px solid var(--color-success, #22c55e)',
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-2xs, 6px)',
  },
  description: {
    fontSize: 'var(--text-sm, 14px)',
    color: 'var(--color-dark, #1e293b)',
    lineHeight: 1.5,
  },
  timeInfo: {
    fontSize: 'var(--text-2xs, 10px)',
    color: 'var(--color-gray-medium, #94a3b8)',
    fontStyle: 'italic',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'var(--space-sm, 12px)',
    paddingTop: 'var(--space-xs, 8px)',
    borderTop: '1px solid var(--color-gray-light, #f1f5f9)',
  },
  link: {
    fontSize: 'var(--text-sm, 14px)',
    fontWeight: 600,
    color: 'var(--color-accent, #0284c7)',
    textDecoration: 'none',
  },
  deleteButton: {
    backgroundColor: 'var(--color-error-bg, rgba(239, 68, 68, 0.1))',
    color: 'var(--color-error, #ef4444)',
    border: '1px solid var(--color-error, #ef4444)',
    padding: 'var(--space-xs, 6px) var(--space-sm, 12px)',
    borderRadius: 'var(--radius-sm, 6px)',
    fontSize: 'var(--text-sm, 14px)',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  }
};
