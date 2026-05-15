import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const useBreakpoint = () => {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  useEffect(() => {
    const check = () => setWidth(window.innerWidth);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return { isMobile: width < 640 };
};

const ArrowIconDark = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 12L12 2M12 2H4M12 2V10" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PitchingFestivalModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [startup, setStartup] = useState('');
  const [stage, setStage] = useState('');
  const [deckUrl, setDeckUrl] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const { isMobile } = useBreakpoint();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setTimeout(() => {
        setSubmitted(false);
        setName('');
        setEmail('');
        setStartup('');
        setStage('');
        setDeckUrl('');
      }, 500);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) setSubmitted(true);
  };
  
  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(247,246,243,0.05)',
    border: '1px solid rgba(247,246,243,0.1)',
    borderRadius: '10px',
    padding: '13px 16px',
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    color: '#F7F6F3',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.25s ease'
  };
  
  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '10px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'rgba(247,246,243,0.35)',
    fontWeight: 600,
    marginBottom: '7px'
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(10,9,8,0.82)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        zIndex: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? '16px' : '32px',
        boxSizing: 'border-box',
        overflowY: 'auto'
      }}>
        <motion.div initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: 0.97 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }} onClick={e => e.stopPropagation()} style={{
          background: '#0f1c28',
          border: '1px solid rgba(247,246,243,0.1)',
          borderRadius: '28px',
          padding: isMobile ? '32px 20px' : '52px 52px',
          width: '100%',
          maxWidth: '560px',
          boxSizing: 'border-box',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 40px 120px rgba(0,0,0,0.6)',
          margin: 'auto'
        }}>
          <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #DE322D, transparent)' }} />
          <button onClick={onClose} style={{
            position: 'absolute', top: '20px', right: '20px',
            background: 'rgba(247,246,243,0.06)', border: '1px solid rgba(247,246,243,0.1)',
            borderRadius: '8px', width: '34px', height: '34px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s ease'
          }} onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(247,246,243,0.12)'; }} onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(247,246,243,0.06)'; }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6L18 18" stroke="rgba(247,246,243,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div key="modal-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                <div style={{ marginBottom: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#DE322D', boxShadow: '0 0 8px rgba(222,50,45,0.5)' }} />
                    <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(247,246,243,0.35)', fontWeight: 600 }}>Pitch Power</span>
                  </div>
                  <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: isMobile ? '20px' : '26px', fontWeight: 300, letterSpacing: '-1px', color: '#F7F6F3', margin: '0 0 10px', lineHeight: 1.15 }}>
                    <span>Apply to </span><em style={{ fontStyle: 'italic', color: '#DE322D' }}>Pitch</em><span style={{ color: 'rgba(247,246,243,0.4)' }}>.</span>
                  </h3>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'rgba(247,246,243,0.38)', margin: 0, lineHeight: '1.65' }}>
                    Submit your details to pitch at the EmpowaEntrepreneurs Pitching Festival. Connect with top-tier VCs, DFIs, and institutional investors.
                  </p>
                </div>
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '13px' }}>
                    <div>
                      <label htmlFor="modal-name" style={labelStyle}>Full Name</label>
                      <input id="modal-name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" required style={inputStyle} onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(222,50,45,0.45)'; }} onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(247,246,243,0.1)'; }} />
                    </div>
                    <div>
                      <label htmlFor="modal-startup" style={labelStyle}>Startup Name</label>
                      <input id="modal-startup" type="text" value={startup} onChange={e => setStartup(e.target.value)} placeholder="Your startup name" style={inputStyle} required onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(222,50,45,0.45)'; }} onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(247,246,243,0.1)'; }} />
                    </div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '13px' }}>
                    <div>
                      <label htmlFor="modal-email" style={labelStyle}>Business Email</label>
                      <input id="modal-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="founder@startup.com" required style={inputStyle} onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(222,50,45,0.45)'; }} onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(247,246,243,0.1)'; }} />
                    </div>
                    <div>
                      <label htmlFor="modal-stage" style={labelStyle}>Funding Stage</label>
                      <input id="modal-stage" type="text" value={stage} onChange={e => setStage(e.target.value)} placeholder="e.g. Pre-Seed, Series A" required style={inputStyle} onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(222,50,45,0.45)'; }} onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(247,246,243,0.1)'; }} />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="modal-deck" style={labelStyle}>Pitch Deck URL (Optional)</label>
                    <input id="modal-deck" type="url" value={deckUrl} onChange={e => setDeckUrl(e.target.value)} placeholder="https://link-to-your-deck.com" style={inputStyle} onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(222,50,45,0.45)'; }} onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(247,246,243,0.1)'; }} />
                  </div>

                  <motion.button type="submit" whileHover={{ scale: 1.03, boxShadow: '0 12px 40px rgba(222,50,45,0.6)' }} whileTap={{ scale: 0.97 }} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: 'linear-gradient(135deg, #DE322D 0%, #c42823 100%)',
                    border: 'none', borderRadius: '44px', padding: '16px 32px', fontSize: '13px', letterSpacing: '0.05em', color: '#fff',
                    fontFamily: 'Montserrat, sans-serif', fontWeight: 600, cursor: 'pointer', marginTop: '4px', boxShadow: '0 8px 32px rgba(222,50,45,0.45)'
                  }}>
                    <span>Submit Application</span><ArrowIconDark />
                  </motion.button>
                </form>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'rgba(247,246,243,0.2)', margin: '14px 0 0', letterSpacing: '0.02em' }}>By submitting, you agree to our terms and conditions. We process your data securely.</p>
              </motion.div>
            ) : (
              <motion.div key="modal-success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', textAlign: 'center', padding: '24px 0 16px' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="22" height="16" viewBox="0 0 22 16" fill="none"><path d="M1 8L8 15L21 1" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <div>
                  <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '22px', fontWeight: 600, letterSpacing: '-0.5px', color: '#F7F6F3', margin: '0 0 10px' }}>Application Received</h3>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: 'rgba(247,246,243,0.45)', margin: 0, lineHeight: '1.7', maxWidth: '340px' }}>
                    <span>{'Thank you, '}</span><strong style={{ color: 'rgba(247,246,243,0.75)' }}>{name}</strong><span>{'. Your application to pitch has been received. Our review committee will be in touch soon.'}</span>
                  </p>
                </div>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={onClose} style={{ marginTop: '8px', background: 'rgba(247,246,243,0.06)', border: '1px solid rgba(247,246,243,0.12)', borderRadius: '44px', padding: '12px 28px', fontFamily: 'Montserrat, sans-serif', fontSize: '12px', letterSpacing: '0.04em', color: 'rgba(247,246,243,0.55)', cursor: 'pointer' }}>Close</motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
      )}
    </AnimatePresence>
  );
};
