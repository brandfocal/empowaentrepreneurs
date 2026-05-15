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

export const ZoneExperienceModal = ({ isOpen, onClose, zoneName = "" }: { isOpen: boolean, onClose: () => void, zoneName?: string }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [selectedZone, setSelectedZone] = useState(zoneName || '');
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const { isMobile } = useBreakpoint();

  useEffect(() => {
    setSelectedZone(zoneName || '');
  }, [zoneName]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setTimeout(() => {
        setStatus('idle');
        setName('');
        setEmail('');
        setCompany('');
        setMessage('');
        setSelectedZone(zoneName || '');
      }, 500);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, zoneName]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('https://forms.empowaentrepreneurs.co.za/wp-json/gf/v2/forms/7/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input_1: name,
          input_3: company,
          input_4: email,
          input_7: selectedZone,
          input_6: message
        }),
      });

      const data = await response.json();

      if (data.is_valid) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage(data.validation_messages ? Object.values(data.validation_messages).join(', ') : 'An error occurred during submission.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setStatus('error');
      setErrorMessage('A network error occurred. Please try again.');
    }
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
            {status !== 'success' ? (
              <motion.div key="modal-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                <div style={{ marginBottom: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#DE322D', boxShadow: '0 0 8px rgba(222,50,45,0.5)' }} />
                    <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(247,246,243,0.35)', fontWeight: 600 }}>Zone Experience</span>
                  </div>
                  <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: isMobile ? '20px' : '26px', fontWeight: 300, letterSpacing: '-1px', color: '#F7F6F3', margin: '0 0 10px', lineHeight: 1.15 }}>
                    <span>Inquire about </span><em style={{ fontStyle: 'italic', color: '#DE322D' }}>{selectedZone || 'this zone'}</em><span style={{ color: 'rgba(247,246,243,0.4)' }}>.</span>
                  </h3>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'rgba(247,246,243,0.38)', margin: 0, lineHeight: '1.65' }}>
                    Connect with our strategic team to secure access, explore participation, or discover opportunities within {selectedZone ? `the ${selectedZone}` : 'our specialized zones'}.
                  </p>
                </div>
                
                {status === 'error' && (
                  <div style={{ marginBottom: '20px', padding: '12px', background: 'rgba(222,50,45,0.1)', border: '1px solid rgba(222,50,45,0.2)', borderRadius: '8px', color: '#DE322D', fontSize: '13px', fontFamily: 'Inter, sans-serif' }}>
                    {errorMessage}
                  </div>
                )}
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '13px' }}>
                    <div>
                      <label htmlFor="modal-name" style={labelStyle}>Full Name</label>
                      <input id="modal-name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" required style={inputStyle} onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(222,50,45,0.45)'; }} onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(247,246,243,0.1)'; }} disabled={status === 'loading'} />
                    </div>
                    <div>
                      <label htmlFor="modal-org" style={labelStyle}>Company / Organization</label>
                      <input id="modal-org" type="text" value={company} onChange={e => setCompany(e.target.value)} placeholder="Your company name" style={inputStyle} required onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(222,50,45,0.45)'; }} onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(247,246,243,0.1)'; }} disabled={status === 'loading'} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="modal-email" style={labelStyle}>Business Email</label>
                    <input id="modal-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="info@empowaentrepreneurs.co.za" required style={inputStyle} onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(222,50,45,0.45)'; }} onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(247,246,243,0.1)'; }} disabled={status === 'loading'} />
                  </div>

                  <div>
                    <label htmlFor="modal-zone" style={labelStyle}>Zone of Interest</label>
                    <div style={{ position: 'relative' }}>
                      <select id="modal-zone" value={selectedZone} onChange={e => setSelectedZone(e.target.value)} style={{ ...inputStyle, appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer', paddingRight: '40px', color: selectedZone ? '#F7F6F3' : 'rgba(247,246,243,0.3)' }} onFocus={e => { (e.target as HTMLSelectElement).style.borderColor = 'rgba(222,50,45,0.45)'; }} onBlur={e => { (e.target as HTMLSelectElement).style.borderColor = 'rgba(247,246,243,0.1)'; }} disabled={status === 'loading'}>
                        <option value="" style={{ background: '#ffffff', color: '#141210' }}>Select a Zone</option>
                        <option value="The Funding Corner" style={{background:'#ffffff',color:'#141210'}}>The Funding Corner</option>
                        <option value="Women Only Dealmaker Room" style={{background:'#ffffff',color:'#141210'}}>Women Only Dealmaker Room</option>
                        <option value="Dragons' Den Pitching Festival" style={{background:'#ffffff',color:'#141210'}}>Dragons' Den Pitching Festival</option>
                        <option value="Legal & Financial Intelligence Zone" style={{background:'#ffffff',color:'#141210'}}>Legal & Financial Intelligence Zone</option>
                        <option value="Funding Application Clinics" style={{background:'#ffffff',color:'#141210'}}>Funding Application Clinics</option>
                        <option value="Premium Industry Networking Exhibitions" style={{background:'#ffffff',color:'#141210'}}>Premium Industry Networking Exhibitions</option>
                        <option value="Masterclasses & Investor Engagements" style={{background:'#ffffff',color:'#141210'}}>Masterclasses & Investor Engagements</option>
                        <option value="Entrepreneurial Odyssey Sessions" style={{background:'#ffffff',color:'#141210'}}>Entrepreneurial Odyssey Sessions</option>
                      </select>
                      <div style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4L6 8L10 4" stroke="rgba(247,246,243,0.4)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="modal-requests" style={labelStyle}>Additional Information</label>
                    <textarea id="modal-requests" value={message} onChange={e => setMessage(e.target.value)} placeholder="Please tell us more about your interest in this zone..." rows={2} style={{ ...inputStyle, resize: 'none', lineHeight: '1.6' }} onFocus={e => { (e.target as HTMLTextAreaElement).style.borderColor = 'rgba(222,50,45,0.45)'; }} onBlur={e => { (e.target as HTMLTextAreaElement).style.borderColor = 'rgba(247,246,243,0.1)'; }} disabled={status === 'loading'} />
                  </div>
                  <motion.button type="submit" disabled={status === 'loading'} whileHover={status !== 'loading' ? { scale: 1.03, boxShadow: '0 12px 40px rgba(222,50,45,0.6)' } : {}} whileTap={status !== 'loading' ? { scale: 0.97 } : {}} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: 'linear-gradient(135deg, #DE322D 0%, #c42823 100%)',
                    border: 'none', borderRadius: '44px', padding: '16px 32px', fontSize: '13px', letterSpacing: '0.05em', color: '#fff',
                    fontFamily: 'Montserrat, sans-serif', fontWeight: 600, cursor: status === 'loading' ? 'not-allowed' : 'pointer', marginTop: '4px', boxShadow: '0 8px 32px rgba(222,50,45,0.45)',
                    opacity: status === 'loading' ? 0.7 : 1
                  }}>
                    <span>{status === 'loading' ? 'Submitting...' : 'Submit Enquiry'}</span>{status !== 'loading' && <ArrowIconDark />}
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
                  <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '22px', fontWeight: 600, letterSpacing: '-0.5px', color: '#F7F6F3', margin: '0 0 10px' }}>Enquiry Received</h3>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: 'rgba(247,246,243,0.45)', margin: 0, lineHeight: '1.7', maxWidth: '340px' }}>
                    <span>{'Thank you, '}</span><strong style={{ color: 'rgba(247,246,243,0.75)' }}>{name}</strong><span>{'. Your enquiry has been received. Our strategic team will review and connect with you shortly.'}</span>
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
