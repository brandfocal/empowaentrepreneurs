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

export const SummitRegistrationModal = ({ onClose }: { onClose: () => void }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [yearsInBusiness, setYearsInBusiness] = useState('');
  const [pitching, setPitching] = useState('');
  const [ticketQuantity, setTicketQuantity] = useState('1');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [absaContact, setAbsaContact] = useState('');
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const { isMobile } = useBreakpoint();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('https://forms.empowaentrepreneurs.co.za/wp-json/gf/v2/forms/4/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input_49_3: firstName,
          input_49_6: lastName,
          input_1: company,
          input_27: phone,
          input_25: email,
          input_6: yearsInBusiness,
          input_44: pitching,
          input_45_3: ticketQuantity,
          input_46: paymentMethod,
          input_47: absaContact
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (e) {
        const text = await response.text();
        console.error('Failed to parse JSON. Server returned:', text);
        throw new Error('Server returned invalid JSON. Check console.');
      }

      if (data.is_valid) {
        setStatus('success');
        if (paymentMethod === 'Credit Card') {
          setTimeout(() => {
            window.location.href = 'https://www.quicket.co.za/events/312690-empowaentrepreneurs-funding-summit/';
          }, 2500);
        }
      } else {
        setStatus('error');
        setErrorMessage(data.validation_messages ? Object.entries(data.validation_messages).map(([k, v]) => `[Field ${k}]: ${v}`).join(' | ') : 'An error occurred during submission.');
      }
    } catch (error: any) {
      console.error('Submission error:', error);
      setStatus('error');
      setErrorMessage(error.message || 'A network error occurred. Please try again.');
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
                    <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(247,246,243,0.35)', fontWeight: 600 }}>Summit 2026</span>
                  </div>
                  <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: isMobile ? '20px' : '26px', fontWeight: 300, letterSpacing: '-1px', color: '#F7F6F3', margin: '0 0 10px', lineHeight: 1.15 }}>
                    <span>Secure your </span><em style={{ fontStyle: 'italic', color: '#DE322D' }}>summit</em><span style={{ color: 'rgba(247,246,243,0.4)' }}> ticket.</span>
                  </h3>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'rgba(247,246,243,0.38)', margin: 0, lineHeight: '1.65' }}>
                    Register now for the EmpowaEntrepreneurs Funding Summit 2026 to secure your access to capital, mentorship, and growth.
                  </p>
                </div>
                
                {status === 'error' && (
                  <div style={{ marginBottom: '20px', padding: '12px', background: 'rgba(222,50,45,0.1)', border: '1px solid rgba(222,50,45,0.2)', borderRadius: '8px', color: '#DE322D', fontSize: '13px', fontFamily: 'Inter, sans-serif' }}>
                    {errorMessage}
                  </div>
                )}
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '13px' }}>
                    <div style={{ gridColumn: isMobile ? 'span 1' : 'span 2' }}>
                      <label style={{...labelStyle, marginBottom: '0'}}>Name of Owner</label>
                    </div>
                    <div>
                      <input id="modal-fname" type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First Name" required style={inputStyle} onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(222,50,45,0.45)'; }} onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(247,246,243,0.1)'; }} disabled={status === 'loading'} />
                    </div>
                    <div>
                      <input id="modal-lname" type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last Name" required style={inputStyle} onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(222,50,45,0.45)'; }} onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(247,246,243,0.1)'; }} disabled={status === 'loading'} />
                    </div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '13px' }}>
                    <div>
                      <label htmlFor="modal-email" style={labelStyle}>Email</label>
                      <input id="modal-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="info@empowaentrepreneurs.co.za" required style={inputStyle} onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(222,50,45,0.45)'; }} onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(247,246,243,0.1)'; }} disabled={status === 'loading'} />
                    </div>
                    <div>
                      <label htmlFor="modal-phone" style={labelStyle}>Cell Phone</label>
                      <input id="modal-phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="011 000 0000" required style={inputStyle} onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(222,50,45,0.45)'; }} onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(247,246,243,0.1)'; }} disabled={status === 'loading'} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '13px' }}>
                    <div>
                      <label htmlFor="modal-org" style={labelStyle}>Name of Company</label>
                      <input id="modal-org" type="text" value={company} onChange={e => setCompany(e.target.value)} placeholder="Your company name" style={inputStyle} required onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(222,50,45,0.45)'; }} onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(247,246,243,0.1)'; }} disabled={status === 'loading'} />
                    </div>
                    <div>
                      <label htmlFor="modal-tickets" style={labelStyle}>Number of Tickets (R1,250.00 each)</label>
                      <input id="modal-tickets" type="number" min="1" value={ticketQuantity} onChange={e => setTicketQuantity(e.target.value)} required style={inputStyle} onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(222,50,45,0.45)'; }} onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(247,246,243,0.1)'; }} disabled={status === 'loading'} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '20px', padding: '8px 0' }}>
                    <div>
                      <label style={{...labelStyle, marginBottom: '10px'}}>Years in Business</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {['1-5', '5-10', '10+'].map(option => (
                          <label key={option} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#F7F6F3', cursor: 'pointer' }}>
                            <input type="radio" name="yearsInBusiness" value={option} checked={yearsInBusiness === option} onChange={e => setYearsInBusiness(e.target.value)} disabled={status === 'loading'} style={{ accentColor: '#DE322D', width: '15px', height: '15px', cursor: 'pointer', margin: 0 }} />
                            {option}
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label style={{...labelStyle, marginBottom: '10px', textTransform: 'none', letterSpacing: '0.02em', fontSize: '11px', color: '#F7F6F3', fontWeight: 500}}>I would like to pitch at the EmpowaEntrepreneurs Pitching Festival</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {['Yes', 'No'].map(option => (
                          <label key={option} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#F7F6F3', cursor: 'pointer' }}>
                            <input type="radio" name="pitching" value={option} checked={pitching === option} onChange={e => setPitching(e.target.value)} disabled={status === 'loading'} style={{ accentColor: '#DE322D', width: '15px', height: '15px', cursor: 'pointer', margin: 0 }} />
                            {option}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label style={{...labelStyle, marginBottom: '10px'}}>Payment Method</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {['EFT (Generate Invoice)', 'Credit Card'].map(option => (
                          <label key={option} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#F7F6F3', cursor: 'pointer' }}>
                            <input type="radio" name="paymentMethod" value={option} checked={paymentMethod === option} onChange={e => setPaymentMethod(e.target.value)} disabled={status === 'loading'} style={{ accentColor: '#DE322D', width: '15px', height: '15px', cursor: 'pointer', margin: 0 }} />
                            {option}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label style={{...labelStyle, marginBottom: '10px', textTransform: 'none', letterSpacing: '0.02em', fontSize: '11px', color: '#F7F6F3', fontWeight: 500}}>Would you like ABSA to contact you concerning your Small Business Services?</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {['Yes', 'No'].map(option => (
                          <label key={option} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#F7F6F3', cursor: 'pointer' }}>
                            <input type="radio" name="absaContact" value={option} checked={absaContact === option} onChange={e => setAbsaContact(e.target.value)} disabled={status === 'loading'} style={{ accentColor: '#DE322D', width: '15px', height: '15px', cursor: 'pointer', margin: 0 }} />
                            {option}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <motion.button type="submit" disabled={status === 'loading'} whileHover={status !== 'loading' ? { scale: 1.03, boxShadow: '0 12px 40px rgba(222,50,45,0.6)' } : {}} whileTap={status !== 'loading' ? { scale: 0.97 } : {}} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: 'linear-gradient(135deg, #DE322D 0%, #c42823 100%)',
                    border: 'none', borderRadius: '44px', padding: '16px 32px', fontSize: '13px', letterSpacing: '0.05em', color: '#fff',
                    fontFamily: 'Montserrat, sans-serif', fontWeight: 600, cursor: status === 'loading' ? 'not-allowed' : 'pointer', marginTop: '4px', boxShadow: '0 8px 32px rgba(222,50,45,0.45)',
                    opacity: status === 'loading' ? 0.7 : 1
                  }}>
                    <span>{status === 'loading' ? 'Processing...' : 'Confirm Registration'}</span>{status !== 'loading' && <ArrowIconDark />}
                  </motion.button>
                </form>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'rgba(247,246,243,0.2)', margin: '14px 0 0', letterSpacing: '0.02em' }}>By registering, you agree to our terms and conditions. We process your data securely.</p>
              </motion.div>
            ) : (
              <motion.div key="modal-success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', textAlign: 'center', padding: '24px 0 16px' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="22" height="16" viewBox="0 0 22 16" fill="none"><path d="M1 8L8 15L21 1" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <div>
                  <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '22px', fontWeight: 600, letterSpacing: '-0.5px', color: '#F7F6F3', margin: '0 0 10px' }}>Registration Received</h3>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: 'rgba(247,246,243,0.45)', margin: 0, lineHeight: '1.7', maxWidth: '340px' }}>
                    <span>{'Thank you, '}</span><strong style={{ color: 'rgba(247,246,243,0.75)' }}>{firstName}</strong>
                    {paymentMethod === 'Credit Card' 
                      ? <span>{'. You are now being redirected to Quicket to complete your ticket purchase...'}</span>
                      : <span>{'. Your registration has been received. We will be in touch with your invoice and event details.'}</span>
                    }
                  </p>
                </div>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={onClose} style={{ marginTop: '8px', background: 'rgba(247,246,243,0.06)', border: '1px solid rgba(247,246,243,0.12)', borderRadius: '44px', padding: '12px 28px', fontFamily: 'Montserrat, sans-serif', fontSize: '12px', letterSpacing: '0.04em', color: 'rgba(247,246,243,0.55)', cursor: 'pointer' }}>Close</motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
