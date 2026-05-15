import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const modalOverlay = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.3 } }
};

const modalContent = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 30 }
  },
  exit: { 
    opacity: 0, 
    y: 20, 
    scale: 0.95,
    transition: { duration: 0.2 }
  }
};

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ZoneExperienceModal = ({ isOpen, onClose, zoneName = "" }: { isOpen: boolean, onClose: () => void, zoneName?: string }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    zoneOfInterest: zoneName,
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setFormData(prev => ({ ...prev, zoneOfInterest: zoneName }));
    } else {
      document.body.style.overflow = '';
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ fullName: '', email: '', company: '', zoneOfInterest: '', message: '' });
      }, 500);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, zoneName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={modalOverlay}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            background: 'rgba(10, 9, 6, 0.85)',
            backdropFilter: 'blur(12px)',
          }}
          onClick={onClose}
        >
          <motion.div
            variants={modalContent}
            onClick={e => e.stopPropagation()}
            style={{
              background: '#F7F6F3',
              borderRadius: '24px',
              width: '100%',
              maxWidth: '560px',
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative',
              boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
            }}
          >
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '24px',
                right: '24px',
                background: 'rgba(20,18,16,0.05)',
                border: 'none',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#141210',
                zIndex: 10,
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(20,18,16,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(20,18,16,0.05)'}
            >
              <CloseIcon />
            </button>

            <div style={{ padding: '48px 40px' }}>
              {!isSubmitted ? (
                <>
                  <h2 style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '28px',
                    fontWeight: 600,
                    letterSpacing: '-0.5px',
                    color: '#141210',
                    margin: '0 0 12px'
                  }}>Zone Experience Enquiry</h2>
                  <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '15px',
                    color: 'rgba(20,18,16,0.6)',
                    lineHeight: 1.6,
                    margin: '0 0 32px'
                  }}>
                    Connect with our strategic team to secure access, explore participation, or discover opportunities within {zoneName ? `the ${zoneName}` : 'our specialized zones'}.
                  </p>

                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: 600, color: '#141210', marginBottom: '8px' }}>Full Name *</label>
                      <input 
                        type="text" 
                        required 
                        value={formData.fullName}
                        onChange={e => setFormData({...formData, fullName: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '14px 16px',
                          borderRadius: '12px',
                          border: '1px solid rgba(20,18,16,0.15)',
                          background: '#fff',
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '14px',
                          boxSizing: 'border-box',
                          outline: 'none'
                        }}
                      />
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: 600, color: '#141210', marginBottom: '8px' }}>Business Email *</label>
                        <input 
                          type="email" 
                          required 
                          value={formData.email}
                          placeholder="info@empowaentrepreneurs.co.za"
                          onChange={e => setFormData({...formData, email: e.target.value})}
                          style={{
                            width: '100%',
                            padding: '14px 16px',
                            borderRadius: '12px',
                            border: '1px solid rgba(20,18,16,0.15)',
                            background: '#fff',
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '14px',
                            boxSizing: 'border-box',
                            outline: 'none'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: 600, color: '#141210', marginBottom: '8px' }}>Company / Organization *</label>
                        <input 
                          type="text" 
                          required 
                          value={formData.company}
                          onChange={e => setFormData({...formData, company: e.target.value})}
                          style={{
                            width: '100%',
                            padding: '14px 16px',
                            borderRadius: '12px',
                            border: '1px solid rgba(20,18,16,0.15)',
                            background: '#fff',
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '14px',
                            boxSizing: 'border-box',
                            outline: 'none'
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: 600, color: '#141210', marginBottom: '8px' }}>Zone of Interest</label>
                      <input 
                        type="text" 
                        value={formData.zoneOfInterest}
                        onChange={e => setFormData({...formData, zoneOfInterest: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '14px 16px',
                          borderRadius: '12px',
                          border: '1px solid rgba(20,18,16,0.15)',
                          background: 'rgba(20,18,16,0.02)',
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '14px',
                          boxSizing: 'border-box',
                          outline: 'none',
                          color: 'rgba(20,18,16,0.6)'
                        }}
                        readOnly
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: 600, color: '#141210', marginBottom: '8px' }}>Additional Information</label>
                      <textarea 
                        rows={4}
                        value={formData.message}
                        onChange={e => setFormData({...formData, message: e.target.value})}
                        placeholder="Please tell us more about your interest in this zone..."
                        style={{
                          width: '100%',
                          padding: '14px 16px',
                          borderRadius: '12px',
                          border: '1px solid rgba(20,18,16,0.15)',
                          background: '#fff',
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '14px',
                          boxSizing: 'border-box',
                          resize: 'vertical',
                          outline: 'none'
                        }}
                      />
                    </div>

                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      style={{
                        marginTop: '12px',
                        background: isSubmitting ? '#a81e1a' : '#DE322D',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '44px',
                        padding: '16px',
                        fontFamily: 'Montserrat, sans-serif',
                        fontWeight: 600,
                        fontSize: '14px',
                        cursor: isSubmitting ? 'wait' : 'pointer',
                        transition: 'background 0.2s'
                      }}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Enquiry'}
                    </button>
                  </form>
                </>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ textAlign: 'center', padding: '40px 0' }}
                >
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'rgba(34, 197, 94, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px',
                    color: '#22c55e'
                  }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '24px', color: '#141210', margin: '0 0 16px' }}>
                    Enquiry Received
                  </h3>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', color: 'rgba(20,18,16,0.6)', margin: '0 0 32px' }}>
                    Thank you for your interest. Our strategic team will review your enquiry and connect with you shortly.
                  </p>
                  <button 
                    onClick={onClose}
                    style={{
                      background: '#141210',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '44px',
                      padding: '14px 32px',
                      fontFamily: 'Montserrat, sans-serif',
                      fontWeight: 600,
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    Close Window
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
