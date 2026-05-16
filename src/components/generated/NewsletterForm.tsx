import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface NewsletterFormProps {
  variant?: 'pill' | 'square';
  isMobile?: boolean;
}

export const NewsletterForm: React.FC<NewsletterFormProps> = ({ variant = 'pill', isMobile = false }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [loadingText, setLoadingText] = useState('Submitting...');

  useEffect(() => {
    if (status === 'loading') {
      const texts = ['Submitting...', 'Uploading data...', 'Processing details...', 'Securing submission...', 'Almost there...'];
      let i = 0;
      setLoadingText(texts[0]);
      const interval = setInterval(() => {
        i = (i + 1) % texts.length;
        setLoadingText(texts[i]);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [status]);

  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus('loading');
    setMessage('');
    
    try {
      const response = await fetch('https://forms.empowaentrepreneurs.co.za/wp-json/gf/v2/forms/2/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "input_5": email
        })
      });
      
      const data = await response.json();
      if (data.is_valid) {
        setStatus('success');
        setEmail('');
        setMessage('Successfully subscribed!');
      } else {
        setStatus('error');
        setMessage(data.validation_messages ? Object.values(data.validation_messages)[0] as string : 'Subscription failed. Please try again.');
      }
    } catch (err) {
      console.error('Gravity Forms submission error:', err);
      setStatus('error');
      setMessage('A network error occurred. Please try again.');
    }
  };

  const isPill = variant === 'pill';

  return (
    <form onSubmit={handleSubscribe} style={{ width: '100%', margin: 0 }}>
      <div style={{
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
        flexWrap: 'wrap',
        width: isPill ? '100%' : (isMobile ? '100%' : 'auto'),
        marginTop: isPill ? '4px' : '0'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: isPill ? 'rgba(255,255,255,0.1)' : 'rgba(247,246,243,0.04)',
          border: isPill ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(247,246,243,0.08)',
          borderRadius: isPill ? '44px' : '4px',
          padding: isPill ? '10px 16px' : '12px 18px',
          gap: '10px',
          flex: isPill ? '1' : (isMobile ? '1' : 'none'),
          minWidth: isPill ? '0' : (isMobile ? '0' : '240px')
        }}>
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
            <rect x="1" y="3" width="12" height="9" rx="1.5" stroke={isPill ? "rgba(247,246,243,0.5)" : "rgba(247,246,243,0.2)"} strokeWidth="1.2" />
            <path d="M1 5l6 4 6-4" stroke={isPill ? "rgba(247,246,243,0.5)" : "rgba(247,246,243,0.2)"} strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <input 
            type="email" 
            placeholder="Your email address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading' || status === 'success'}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              color: '#F7F6F3',
              width: '100%'
            }} 
            required
          />
        </div>
        <motion.button 
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          whileHover={{ scale: status === 'loading' || status === 'success' ? 1 : 1.04 }} 
          whileTap={{ scale: status === 'loading' || status === 'success' ? 1 : 0.97 }} 
          style={{
            background: isPill ? '#F7F6F3' : 'linear-gradient(135deg, #DE322D, #c42823)',
            border: 'none',
            borderRadius: isPill ? '44px' : '4px',
            padding: isPill ? '10px 20px' : '12px 24px',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '11px',
            letterSpacing: isPill ? '0.1em' : '0.12em',
            textTransform: 'uppercase',
            color: isPill ? '#DE322D' : '#fff',
            cursor: status === 'loading' || status === 'success' ? 'not-allowed' : 'pointer',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            boxShadow: isPill ? '0 4px 16px rgba(0,0,0,0.2)' : '0 4px 20px rgba(222,50,45,0.35)',
            width: !isPill && isMobile ? '100%' : 'auto',
            opacity: status === 'loading' ? 0.7 : 1
          }}
        >
          {status === 'loading' ? 'Subscribing...' : (status === 'success' ? 'Subscribed' : 'Subscribe')}
        </motion.button>
      </div>
      {message && (
        <div style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '11px',
          color: status === 'success' ? '#4CAF50' : '#DE322D',
          marginTop: '8px',
          paddingLeft: isPill ? '16px' : '4px'
        }}>
          {message}
        </div>
      )}
    </form>
  );
};
