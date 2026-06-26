import React from 'react';
import type { Job } from './JobCard';

interface JobModalProps {
  job: Job | null;
  onClose: () => void;
}

export const JobModal: React.FC<JobModalProps> = ({ job, onClose }) => {
  if (!job) return null;

  const isRemote = job.localidade.toLowerCase().includes('remoto');

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()} className="fade-in">
        <header style={styles.header}>
          <div>
            <span style={styles.company}>{job.empresa}</span>
            <h2 style={styles.title}>{job.titulo}</h2>
          </div>
          <button style={styles.closeButton} onClick={onClose} aria-label="Fechar modal">
            ✕
          </button>
        </header>

        <div style={styles.body}>
          <div style={styles.metaContainer}>
            <div style={styles.metaItem}>
              <span>{isRemote ? '💻' : '📍'}</span>
              <span>{job.localidade}</span>
            </div>
            <div style={styles.metaItem}>
              <span>💼</span>
              <span>Jovem Aprendiz</span>
            </div>
            <div style={styles.metaItem}>
              <span>🏢</span>
              <span>Origem: {job.origem}</span>
            </div>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Descrição da Vaga e Atividades</h3>
            <p style={styles.sectionText}>{job.descricao}</p>
          </div>
        </div>

        <footer style={styles.footer}>
          <button style={styles.cancelButton} onClick={onClose}>
            Fechar
          </button>
          
          <a 
            href={job.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            style={styles.applyLink}
          >
            <button style={styles.applyButton}>
              Candidatar-se na Origem ↗
            </button>
          </a>
        </footer>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(26, 26, 46, 0.4)', // Escuro JAB com transparência
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: 'var(--space-sm)',
  },
  modal: {
    backgroundColor: 'var(--color-white)',
    borderRadius: 'var(--radius-lg)',
    width: '100%',
    maxWidth: '650px',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: 'var(--shadow-lg)',
    overflow: 'hidden',
  },
  header: {
    padding: 'var(--space-md)',
    borderBottom: '1px solid var(--color-gray-light)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 'var(--space-sm)',
  },
  company: {
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    color: 'var(--color-accent)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  title: {
    fontSize: 'var(--text-lg)',
    color: 'var(--color-dark)',
    marginTop: '4px',
  },
  closeButton: {
    backgroundColor: 'var(--color-snow)',
    color: 'var(--color-gray-text)',
    border: 'none',
    width: '32px',
    height: '32px',
    borderRadius: 'var(--radius-pill)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'var(--transition-fast)',
  },
  body: {
    padding: 'var(--space-md)',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-md)',
    flex: 1,
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
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-xs)',
  },
  sectionTitle: {
    fontSize: 'var(--text-md)',
    color: 'var(--color-dark)',
    borderLeft: '4px solid var(--color-primary)',
    paddingLeft: 'var(--space-xs)',
  },
  sectionText: {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-dark)',
    lineHeight: 1.6,
    whiteSpace: 'pre-wrap', // Preserva quebras de linha da descrição
  },
  footer: {
    padding: 'var(--space-md)',
    borderTop: '1px solid var(--color-gray-light)',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 'var(--space-xs)',
    backgroundColor: 'var(--color-snow)',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    color: 'var(--color-gray-text)',
    border: '1px solid var(--color-gray-light)',
    padding: 'var(--space-xs) var(--space-lg)',
    borderRadius: 'var(--radius-sm)',
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
  },
  applyLink: {
    textDecoration: 'none',
  },
  applyButton: {
    backgroundColor: 'var(--color-primary)',
    color: 'var(--color-dark)',
    padding: 'var(--space-xs) var(--space-lg)',
    borderRadius: 'var(--radius-sm)',
    fontSize: 'var(--text-sm)',
    fontWeight: 700,
    boxShadow: 'var(--shadow-sm)',
  }
};
