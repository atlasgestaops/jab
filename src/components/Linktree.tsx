import React, { useState } from 'react';
import { AdBlock } from './AdBlock';

interface LinktreeProps {
  onNavigate: (route: 'portal' | 'admin' | 'vaga' | 'guide' | 'profile' | 'company-panel' | 'linktree') => void;
  onOpenAlertsModal?: () => void;
}

export const Linktree: React.FC<LinktreeProps> = ({ onNavigate, onOpenAlertsModal }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqData = [
    {
      q: "1. Preciso pagar alguma coisa para me candidatar?",
      a: "Não! Todo o processo de cadastro e candidatura é totalmente gratuito. O site apenas conecta você às vagas de Jovem Aprendiz disponíveis no mercado."
    },
    {
      q: "2. É necessário ter experiência anterior?",
      a: "Não! As vagas de Jovem Aprendiz são justamente voltadas para quem busca o primeiro emprego. Nenhuma experiência de trabalho anterior é exigida das candidaturas."
    },
    {
      q: "3. Qual a idade mínima e máxima para me inscrever?",
      a: "Pela Lei da Aprendizagem, o programa aceita jovens de 14 a 24 anos incompletos, mas algumas empresas podem ter faixas de contratação específicas dentro desse limite (ex: 18 a 22 anos para vagas noturnas ou industriais)."
    },
    {
      q: "4. Depois do cadastro, como vou saber se fui chamado?",
      a: "A empresa contratante ou o agente de integração (como CIEE, IEL, etc.) entrará em contato diretamente com você por e-mail, telefone ou WhatsApp. Fique de olho na sua caixa de entrada e spam!"
    },
    {
      q: "5. Quanto tempo leva para receber uma resposta?",
      a: "Varia de empresa para empresa. Algumas retornam em poucos dias, outras levam semanas para iniciar o processo seletivo. A nossa recomendação é se cadastrar no maior número possível de vagas compatíveis com você."
    },
    {
      q: "6. Que tipo de atividades um Jovem Aprendiz faz?",
      a: "As tarefas são de cunho prático administrativo ou operacional, com supervisão direta. Inclui suporte em escritório, recepção, organização de arquivos e atendimento básico, sempre com foco no seu aprendizado profissional."
    }
  ];

  return (
    <div className="linktree-page fade-in">
      <div className="linktree-container">
        
        {/* Logo and Header */}
        <header className="linktree-header">
          <img 
            src="https://jovemaprendizbrasil.com.br/wp-content/uploads/2023/04/logo_jab_colorido.png" 
            alt="JAB Logo" 
            className="linktree-logo"
          />
          <h1 className="linktree-title">Jovem Aprendiz Brasil <span className="linktree-badge">✓</span></h1>
          <p className="linktree-subtitle">Conectando você ao seu primeiro emprego de forma segura e gratuita.</p>
        </header>

        {/* AdSense Top Slot */}
        <div className="linktree-ad-wrapper">
          <div style={{ textTransform: 'uppercase', fontSize: '9px', color: 'var(--color-gray-text)', marginBottom: '4px', letterSpacing: '0.05em' }}>
            links patrocinados
          </div>
          <AdBlock type="horizontal" />
        </div>

        {/* Main Links */}
        <section className="linktree-section">
          <h2 className="linktree-section-title">Encontre sua Vaga</h2>
          
          <button 
            className="linktree-btn btn-primary"
            onClick={() => {
              onNavigate('portal');
              if (onOpenAlertsModal) {
                setTimeout(() => onOpenAlertsModal(), 300);
              }
            }}
          >
            🚀 COMECE POR AQUI
          </button>

          <button 
            className="linktree-btn"
            onClick={() => {
              onNavigate('portal');
              setTimeout(() => {
                const element = document.getElementById('mural-vagas');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }, 300);
            }}
          >
            🔍 BUSCAR VAGAS
          </button>

          <button 
            className="linktree-btn"
            onClick={() => {
              onNavigate('portal');
              setTimeout(() => {
                const element = document.getElementById('search-input-company');
                if (element) {
                  element.focus();
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }, 300);
            }}
          >
            🏢 BUSCAR EMPRESAS
          </button>
        </section>

        {/* Institutional Links */}
        <section className="linktree-section">
          <h2 className="linktree-section-title">Canais de Ajuda</h2>
          
          <a 
            href="https://api.whatsapp.com/send?phone=+15412494779&text=Oi,%20tudo%20bem"
            target="_blank"
            rel="noopener noreferrer"
            className="linktree-btn btn-whatsapp"
          >
            🟢 ATENDIMENTO WHATSAPP
          </a>

          <button 
            className="linktree-btn btn-alert"
            onClick={() => onNavigate('profile')}
          >
            🔔 RECEBER VAGAS NO WHATSAPP
          </button>
        </section>

        {/* AdSense Middle Slot */}
        <div className="linktree-ad-wrapper">
          <AdBlock type="inline" />
        </div>

        {/* FAQ Accordion Section */}
        <section className="linktree-section">
          <h2 className="linktree-section-title">Perguntas Frequentes (FAQ)</h2>
          <div className="linktree-faq-accordion">
            {faqData.map((item, idx) => (
              <div 
                key={idx} 
                className={`faq-item ${openFaq === idx ? 'open' : ''}`}
                onClick={() => toggleFaq(idx)}
              >
                <div className="faq-question">
                  <span>{item.q}</span>
                  <span className="faq-arrow">{openFaq === idx ? '▲' : '▼'}</span>
                </div>
                {openFaq === idx && (
                  <div className="faq-answer fade-in">
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* AdSense Bottom Slot */}
        <div className="linktree-ad-wrapper">
          <AdBlock type="horizontal" />
        </div>

        {/* Social Media Footer */}
        <footer className="linktree-footer">
          <h3 className="linktree-section-title" style={{ marginBottom: '12px' }}>Acompanhe nossas redes sociais</h3>
          <div className="linktree-socials">
            <a href="http://www.facebook.com/jab.vagas" target="_blank" rel="noopener noreferrer" className="social-icon" title="Facebook">📘</a>
            <a href="https://www.instagram.com/jovemaprendizbrasiloficial/" target="_blank" rel="noopener noreferrer" className="social-icon" title="Instagram">📸</a>
            <a href="https://twitter.com/jovemaprendiz_" target="_blank" rel="noopener noreferrer" className="social-icon" title="Twitter/X">🐦</a>
            <a href="https://www.youtube.com/@jovemaprendizbrasiloficial" target="_blank" rel="noopener noreferrer" className="social-icon" title="YouTube">📺</a>
            <a href="https://www.tiktok.com/@jovemaprendizbrasill" target="_blank" rel="noopener noreferrer" className="social-icon" title="TikTok">🎵</a>
          </div>
          <div className="linktree-copyright">
            © {new Date().getFullYear()} JAB - Jovem Aprendiz Brasil. Todos os direitos reservados.
          </div>
        </footer>

      </div>
    </div>
  );
};
