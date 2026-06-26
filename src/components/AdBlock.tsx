import React from 'react';

interface AdBlockProps {
  type: 'horizontal' | 'sidebar' | 'inline';
}

export const AdBlock: React.FC<AdBlockProps> = ({ type }) => {
  if (type === 'horizontal') {
    return (
      <div className="adsense-placeholder-horizontal fade-in">
        {/* Aqui seria inserido o código real do Google AdSense, ex:
        <ins className="adsbygoogle"
             style={{ display: 'block' }}
             data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
             data-ad-slot="XXXXXXXXXX"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
        */}
      </div>
    );
  }

  if (type === 'sidebar') {
    return (
      <div className="adsense-placeholder-sidebar fade-in">
        {/* Google AdSense Vertical Banner */}
      </div>
    );
  }

  // default: inline (dentro da lista de vagas)
  return (
    <div className="adsense-placeholder-inline fade-in">
      <div style={styles.inlineContent}>
        <div style={styles.tag}>Patrocinado</div>
        <h4 style={styles.title}>Curso Gratuito: Preparatório para Primeiro Emprego</h4>
        <p style={styles.description}>
          Aprenda a criar seu currículo, se destacar em entrevistas e dominar ferramentas básicas de informática. Inscreva-se agora e ganhe certificado!
        </p>
        <button style={styles.button}>Conhecer Curso</button>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  inlineContent: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    textAlign: 'left',
  },
  tag: {
    fontFamily: 'Outfit, sans-serif',
    fontSize: 'var(--text-2xs)',
    fontWeight: 700,
    color: 'var(--color-accent)',
    letterSpacing: '0.05em',
    marginBottom: 'var(--space-2xs)',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 'var(--text-md)',
    color: 'var(--color-accent-dark)',
    marginBottom: 'var(--space-2xs)',
  },
  description: {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-gray-text)',
    lineHeight: 1.4,
    marginBottom: 'var(--space-xs)',
  },
  button: {
    alignSelf: 'flex-start',
    backgroundColor: 'var(--color-accent)',
    color: 'var(--color-white)',
    padding: 'var(--space-xs) var(--space-sm)',
    borderRadius: 'var(--radius-sm)',
    fontSize: 'var(--text-xs)',
    boxShadow: 'var(--shadow-sm)',
  }
};
