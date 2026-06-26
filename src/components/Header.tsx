import React, { useState } from 'react';

interface HeaderProps {
  currentRoute: 'portal' | 'admin' | 'guide' | 'profile' | 'company-panel';
  onRouteChange: (route: 'portal' | 'admin' | 'guide' | 'profile' | 'company-panel') => void;
  pendingCount: number;
  candidateJobsCount: number;
  hasCompanySession: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentRoute, 
  onRouteChange, 
  pendingCount, 
  candidateJobsCount,
  hasCompanySession
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleRouteChange = (route: 'portal' | 'admin' | 'guide' | 'profile' | 'company-panel') => {
    onRouteChange(route);
    setIsMenuOpen(false);
  };

  return (
    <header className="app-header">
      <div className="container header-container">
        <div className="header-logo-container" onClick={() => handleRouteChange('portal')}>
          <img 
            src="/logo-jab.png" 
            alt="JAB Logo" 
            className="header-logo" 
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const nextEl = e.currentTarget.nextElementSibling as HTMLElement;
              if (nextEl) {
                nextEl.style.display = 'flex';
              }
            }}
          />
          <div className="header-fallback-logo fade-in">
            <span style={{ fontSize: '1.5rem' }}>🟢</span>
            <span style={{ letterSpacing: '-0.03em' }}>JAB</span>
          </div>
        </div>

        <button 
          className={`header-mobile-toggle ${isMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Alternar menu de navegação"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        <nav className={`header-nav ${isMenuOpen ? 'open' : ''}`}>
          <button 
            onClick={() => handleRouteChange('portal')}
            className={`header-nav-button ${currentRoute === 'portal' ? 'active-portal' : ''}`}
          >
            Portal de Vagas
          </button>
          
          <button 
            onClick={() => handleRouteChange('guide')}
            className={`header-nav-button ${currentRoute === 'guide' ? 'active-guide' : ''}`}
          >
            Comece por Aqui
          </button>

          <button 
            onClick={() => handleRouteChange('profile')}
            className={`header-nav-button header-profile-button ${currentRoute === 'profile' ? 'active-profile' : ''}`}
          >
            Meu Painel 💼
            {candidateJobsCount > 0 && (
              <span className="header-profile-badge">{candidateJobsCount}</span>
            )}
          </button>

          <button 
            onClick={() => handleRouteChange('company-panel')}
            className={`header-nav-button header-company-button ${currentRoute === 'company-panel' ? 'active-profile' : ''}`}
            style={{ borderColor: 'var(--primary-color)' }}
          >
            Painel Empresa 🏢
          </button>
          
          <button 
            onClick={() => handleRouteChange('admin')}
            className={`header-nav-button header-admin-button ${currentRoute === 'admin' ? 'active-admin' : ''}`}
          >
            Moderação Admin
            {pendingCount > 0 && (
              <span className="header-badge">{pendingCount}</span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};
