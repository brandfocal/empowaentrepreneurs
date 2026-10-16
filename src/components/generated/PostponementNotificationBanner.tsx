import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

const PRIMARY_CORAL = '#DE322D';

export const PostponementNotificationBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    try {
      if (sessionStorage.getItem('ee_postpone_banner_closed') === 'true') {
        setDismissed(true);
      }
    } catch (e) {
      // ignore storage errors
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem('ee_postpone_banner_closed', 'true');
    } catch (e) {
      // ignore storage errors
    }
  };

  if (pathname === '/festival-moves-to-2027' || pathname === '/pitching-festival-update' || pathname === '/announcement/festival-moves-to-2027') {
    return null;
  }

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'relative',
            zIndex: 110,
            background: 'linear-gradient(90deg, #1c1514 0%, #291b1a 50%, #1c1514 100%)',
            borderBottom: '1px solid rgba(222,50,45,0.3)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
            overflow: 'hidden',
          }}
        >
          {/* Subtle top indicator bar */}
          <div
            style={{
              height: '2px',
              width: '100%',
              background: `linear-gradient(90deg, ${PRIMARY_CORAL}, #ff7a70, ${PRIMARY_CORAL})`,
            }}
          />

          <div
            style={{
              maxWidth: '1360px',
              margin: '0 auto',
              padding: '10px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                flexWrap: 'wrap',
                flex: 1,
              }}
            >
              {/* Badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(222,50,45,0.18)',
                  border: '1px solid rgba(222,50,45,0.35)',
                  borderRadius: '100px',
                  padding: '3px 10px',
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: PRIMARY_CORAL,
                    boxShadow: '0 0 6px rgba(222,50,45,0.8)',
                  }}
                />
                <span
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#fff',
                  }}
                >
                  Update
                </span>
              </div>

              {/* Banner Text */}
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '13px',
                  color: 'rgba(247,246,243,0.92)',
                  margin: 0,
                  lineHeight: 1.5,
                  fontWeight: 300,
                }}
              >
                <strong style={{ fontWeight: 600, color: '#fff' }}>
                  The EmpowaEntrepreneurs Pitching Festival is moving to 2027.
                </strong>{' '}
                New dates coming soon. In the meantime, join us at the{' '}
                <strong style={{ fontWeight: 500, color: '#fff' }}>
                  EmpowaHer™ Leadership Summit, 29–31 October 2026.
                </strong>
              </p>
            </div>

            {/* Action Buttons & Dismiss */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                flexShrink: 0,
                flexWrap: 'wrap',
              }}
            >
              <Link
                to="/festival-moves-to-2027"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(247,246,243,0.08)',
                  border: '1px solid rgba(247,246,243,0.16)',
                  borderRadius: '30px',
                  padding: '6px 14px',
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  color: '#fff',
                  textDecoration: 'none',
                  transition: 'background 0.2s ease, border-color 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(222,50,45,0.2)';
                  (e.currentTarget as HTMLElement).style.borderColor = PRIMARY_CORAL;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(247,246,243,0.08)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(247,246,243,0.16)';
                }}
              >
                <span>Read the update →</span>
              </Link>

              <span style={{ color: 'rgba(247,246,243,0.25)', fontSize: '12px' }}>|</span>

              <a
                href="https://www.empowaher.co.za"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'linear-gradient(135deg, #DE322D 0%, #c42823 100%)',
                  borderRadius: '30px',
                  padding: '6px 14px',
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  color: '#fff',
                  textDecoration: 'none',
                  boxShadow: '0 2px 10px rgba(222,50,45,0.3)',
                  whiteSpace: 'nowrap',
                }}
              >
                <span>Explore here →</span>
              </a>

              {/* Close Button */}
              <button
                onClick={handleDismiss}
                aria-label="Dismiss banner"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(247,246,243,0.5)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  marginLeft: '4px',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#fff')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'rgba(247,246,243,0.5)')}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M3 3L11 11M11 3L3 11"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
