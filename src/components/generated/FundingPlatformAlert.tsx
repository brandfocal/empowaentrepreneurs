import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// --- CONSTANTS ---
const STAT_PILLS = [{
  id: 'pill-1',
  label: '800+ Entrepreneurs'
}, {
  id: 'pill-2',
  label: '200+ Funders & Investors'
}, {
  id: 'pill-3',
  label: '50+ Ecosystem Builders'
}];
const PRIMARY_CORAL = '#DE322D';

// --- ANIMATION VARIANTS ---
const fadeUpVariants = {
  hidden: {
    opacity: 0,
    y: 36,
    filter: 'blur(8px)'
  },
  visible: (d: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.9,
      delay: d,
      ease: [0.22, 1, 0.36, 1] as const
    }
  })
};
const scaleReveal = {
  hidden: {
    scale: 0.92,
    opacity: 0,
    filter: 'blur(14px)'
  },
  visible: (d: number) => ({
    scale: 1,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 1.0,
      delay: d,
      ease: [0.22, 1, 0.36, 1] as const
    }
  })
};

// --- HOOKS ---
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
};

// --- ICONS ---
const PlusSquareIconLight = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M16.25 2.5H3.75C3.41848 2.5 3.10054 2.6317 2.86612 2.86612C2.6317 3.10054 2.5 3.41848 2.5 3.75V16.25C2.5 16.5815 2.6317 16.8995 2.86612 17.1339C3.10054 17.3683 3.41848 17.5 3.75 17.5H16.25C16.5815 17.5 16.8995 17.3683 17.1339 17.1339C17.3683 16.8995 17.5 16.5815 17.5 16.25V3.75C17.5 3.41848 17.3683 3.10054 17.1339 2.86612C16.8995 2.6317 16.5815 2.5 16.25 2.5ZM13.125 10.625H10.625V13.125C10.625 13.2908 10.5592 13.4497 10.4419 13.5669C10.3247 13.6842 10.1658 13.75 10 13.75C9.83424 13.75 9.67527 13.6842 9.55806 13.5669C9.44085 13.4497 9.375 13.2908 9.375 13.125V10.625H6.875C6.70924 10.625 6.55027 10.5592 6.43306 10.4419C6.31585 10.3247 6.25 10.1658 6.25 10C6.25 9.83424 6.31585 9.67527 6.43306 9.55806C6.55027 9.44085 6.70924 9.375 6.875 9.375H9.375V6.875C9.375 6.70924 9.44085 6.55027 9.55806 6.43306C9.67527 6.31585 9.83424 6.25 10 6.25C10.1658 6.25 10.3247 6.31585 10.4419 6.43306C10.5592 6.55027 10.625 6.70924 10.625 6.875V9.375H13.125C13.2908 9.375 13.4497 9.44085 13.5669 9.55806C13.6842 9.67527 13.75 9.83424 13.75 10C13.75 10.1658 13.6842 10.3247 13.5669 10.4419C13.4497 10.5592 13.2908 10.625 13.125 10.625Z" fill="rgba(20,18,16,0.35)" />
  </svg>;
const WarningIcon = () => <div style={{
  width: 40,
  height: 40,
  background: 'rgba(222,50,45,0.15)',
  borderRadius: '50%',
  border: '1px solid rgba(222,50,45,0.25)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0
}}>
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={PRIMARY_CORAL} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  </div>;

// --- COMPONENT ---
export const FundingPlatformAlert: React.FC = () => {
  const isMobile = useIsMobile();
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, {
    once: true,
    margin: '-40px 0px'
  });
  return <section style={{
    width: '100%',
    minHeight: '100vh',
    background: `#F7F3EC`,
    display: 'flex',
    alignItems: 'stretch',
    overflow: 'hidden'
  }} ref={heroRef}>
      <div style={{
      maxWidth: '1400px',
      width: '100%',
      margin: '0 auto',
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      alignItems: isMobile ? 'flex-start' : 'stretch',
      padding: isMobile ? '64px 20px 72px' : '0 48px',
      gap: isMobile ? '48px' : '0',
      minHeight: isMobile ? 'unset' : '100vh'
    }}>
        {/* ── LEFT PANEL — Platform Identity ── */}
        <div style={{
        flex: isMobile ? 'unset' : '0 0 48%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingRight: isMobile ? '0' : '56px',
        paddingTop: isMobile ? '0' : '80px',
        paddingBottom: isMobile ? '0' : '80px'
      }}>
          {/* Eyebrow */}
          <motion.div initial="hidden" animate={isHeroInView ? 'visible' : 'hidden'} variants={fadeUpVariants} custom={0} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '32px'
        }}>
            <PlusSquareIconLight />
            <span style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '10px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: 'rgba(20,18,16,0.45)'
          }}>
              <span>AFRICA'S PREMIER FUNDING PLATFORM</span>
              <sup style={{
              color: PRIMARY_CORAL,
              marginLeft: '2px'
            }}>™</sup>
            </span>
          </motion.div>

          {/* Headline */}
          <h1 style={{
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 200,
          lineHeight: 0.93,
          letterSpacing: isMobile ? '-2px' : '-3px',
          margin: '0 0 28px 0'
        }}>
            <div style={{
            overflow: 'hidden',
            display: 'block'
          }}>
              <motion.span initial={{
              y: '110%'
            }} animate={isHeroInView ? {
              y: 0
            } : {
              y: '110%'
            }} transition={{
              duration: 1.05,
              delay: 0.12,
              ease: [0.16, 1, 0.3, 1] as const
            }} style={{
              display: 'block',
              fontSize: 'clamp(30px, 3.8vw, 64px)',
              color: '#141210'
            }}>
                Where Vetted
              </motion.span>
            </div>
            <div style={{
            overflow: 'hidden',
            display: 'block',
            marginTop: isMobile ? '4px' : '2px'
          }}>
              <motion.span initial={{
              y: '110%'
            }} animate={isHeroInView ? {
              y: 0
            } : {
              y: '110%'
            }} transition={{
              duration: 1.05,
              delay: 0.22,
              ease: [0.16, 1, 0.3, 1] as const
            }} style={{
              display: 'block',
              fontSize: 'clamp(30px, 3.8vw, 64px)',
              color: '#141210'
            }}>
                Entrepreneurs
              </motion.span>
            </div>
            <div style={{
            overflow: 'hidden',
            display: 'block',
            marginTop: isMobile ? '4px' : '2px'
          }}>
              <motion.em initial={{
              y: '110%'
            }} animate={isHeroInView ? {
              y: 0
            } : {
              y: '110%'
            }} transition={{
              duration: 1.05,
              delay: 0.34,
              ease: [0.16, 1, 0.3, 1] as const
            }} style={{
              display: 'block',
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: 'clamp(30px, 3.8vw, 64px)',
              color: PRIMARY_CORAL
            }}>
                Meet High-Impact Capital.
              </motion.em>
            </div>
          </h1>

          {/* Subtitle */}
          <motion.p initial="hidden" animate={isHeroInView ? 'visible' : 'hidden'} variants={fadeUpVariants} custom={0.42} style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 300,
          fontSize: 'clamp(14px, 1.1vw, 16px)',
          color: 'rgba(20,18,16,0.65)',
          lineHeight: 1.85,
          maxWidth: '520px',
          margin: '0 0 40px'
        }}>
            EmpowaEntrepreneurs Funding Summit 2026 is a high-consequence platform convening Africa's
            most ambitious entrepreneurs, investors, DFIs, accelerators, ecosystem builders, and capital
            partners shaping the continent's next growth economy.
          </motion.p>

          {/* Stat Pills */}
          <motion.div initial="hidden" animate={isHeroInView ? 'visible' : 'hidden'} variants={fadeUpVariants} custom={0.54} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          alignItems: 'flex-start'
        }}>
            {STAT_PILLS.map(pill => <div key={pill.id} style={{
            background: 'rgba(20,18,16,0.05)',
            border: '1px solid rgba(20,18,16,0.1)',
            borderRadius: '100px',
            padding: '9px 22px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
                <div style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: PRIMARY_CORAL,
              flexShrink: 0
            }} />
                <span style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 600,
              fontSize: '12px',
              color: '#141210'
            }}>
                  {pill.label}
                </span>
              </div>)}
          </motion.div>

          {/* Date badge */}
          <motion.div initial="hidden" animate={isHeroInView ? 'visible' : 'hidden'} variants={fadeUpVariants} custom={0.64} style={{
          marginTop: '40px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
            <div style={{
            width: '24px',
            height: '1px',
            background: 'rgba(20,18,16,0.2)'
          }} />
            <span style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '12px',
            color: 'rgba(20,18,16,0.45)',
            letterSpacing: '0.05em'
          }}>
              28 May 2026 · EmpowaWorx House, Randburg
            </span>
          </motion.div>
        </div>

        {/* ── DIVIDER ── */}
        {!isMobile && <div style={{
        width: '1px',
        background: 'linear-gradient(to bottom, transparent, rgba(20,18,16,0.1) 20%, rgba(20,18,16,0.1) 80%, transparent)',
        flexShrink: 0,
        alignSelf: 'stretch'
      }} />}

        {/* ── RIGHT PANEL — Important Notice Card ── */}
        <div style={{
        flex: isMobile ? 'unset' : '0 0 52%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: isMobile ? '0' : '56px',
        paddingTop: isMobile ? '0' : '72px',
        paddingBottom: isMobile ? '0' : '72px',
        width: isMobile ? '100%' : 'unset'
      }}>
          <motion.div initial="hidden" animate={isHeroInView ? 'visible' : 'hidden'} variants={scaleReveal} custom={0.28} style={{
          background: 'linear-gradient(145deg, #3c4d5d 0%, #2f3f4e 55%, #243040 100%)',
          borderRadius: '20px',
          border: '1px solid rgba(247,246,243,0.08)',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 24px 80px rgba(0,0,0,0.45), 0 4px 20px rgba(0,0,0,0.25)',
          width: '100%',
          maxWidth: isMobile ? '100%' : '560px'
        }}>
            {/* Decorative radial glow */}
            <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 65%)',
            pointerEvents: 'none',
            zIndex: 0
          }} />

            {/* Top accent bar */}
            <div style={{
            height: '3px',
            background: `linear-gradient(90deg, ${PRIMARY_CORAL}, #ff7a70)`,
            width: '100%',
            position: 'relative',
            zIndex: 1
          }} />

            {/* Card Header */}
            <div style={{
            padding: isMobile ? '18px 20px 14px' : '22px 28px 18px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            position: 'relative',
            zIndex: 1
          }}>
              <div style={{
              width: 40,
              height: 40,
              background: 'rgba(222,50,45,0.18)',
              borderRadius: '50%',
              border: '1px solid rgba(222,50,45,0.28)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={PRIMARY_CORAL} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div style={{
              width: '1px',
              height: '26px',
              background: 'rgba(255,255,255,0.12)',
              flexShrink: 0
            }} />
              <h2 style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 700,
              fontSize: isMobile ? '13px' : '14px',
              color: '#FFFFFF',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              margin: 0,
              lineHeight: 1.3
            }}>
                Important Notice to Entrepreneurs
              </h2>
            </div>

            {/* Card Body */}
            <div style={{
            padding: isMobile ? '18px 20px 24px' : '24px 28px 30px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            position: 'relative',
            zIndex: 1
          }}>
              {/* Main Notice */}
              <div style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderLeft: `3px solid ${PRIMARY_CORAL}`,
              borderRadius: '12px',
              padding: isMobile ? '16px 18px' : '20px 22px'
            }}>
                <p style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
                fontSize: isMobile ? '13px' : '14px',
                color: 'rgba(255,255,255,0.72)',
                lineHeight: 1.8,
                margin: 0
              }}>
                  Pitching opportunities are strictly limited and highly competitive. Only entrepreneurs
                  who successfully meet the investment and funding criteria determined by participating
                  funders and strategic partners will be selected. Attendance alone does not guarantee
                  a pitching slot.
                </p>
                <div style={{
                height: '1px',
                background: 'rgba(255,255,255,0.1)',
                margin: '14px 0'
              }} />
                <p style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
                fontSize: isMobile ? '13px' : '14px',
                color: 'rgba(255,255,255,0.72)',
                lineHeight: 1.8,
                margin: 0
              }}>
                  This platform extends far beyond pitching. Expect direct access to high-level funding
                  conversations, investment intelligence, growth masterclasses, strategic partnerships,
                  and powerful ecosystem networking.
                </p>
              </div>

              {/* Dark callout */}
              <div style={{
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '12px',
              padding: isMobile ? '16px 18px' : '20px 22px'
            }}>
                <p style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 300,
                fontStyle: 'italic',
                fontSize: isMobile ? '14px' : '15px',
                color: 'rgba(255,255,255,0.85)',
                lineHeight: 1.65,
                letterSpacing: '-0.2px',
                margin: 0
              }}>
                  "Pitch or not — position yourself where capital is deployed, partnerships are activated,
                  and high-growth businesses are discovered."
                </p>
              </div>

              {/* Two-column grid */}
              <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px'
            }}>
                <div style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: '12px',
                padding: '16px 18px'
              }}>
                  <div style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 700,
                  fontSize: '10px',
                  color: PRIMARY_CORAL,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '7px'
                }}>
                    NO REGISTRATION. NO PITCH.
                  </div>
                  <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 300,
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.62)',
                  lineHeight: 1.7,
                  margin: 0
                }}>
                    Only officially registered entrepreneurs will be eligible. Final pitching decisions
                    remain solely with participating funders and EmpowaWorx.
                  </p>
                </div>
                <div style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: '12px',
                padding: '16px 18px'
              }}>
                  <div style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 700,
                  fontSize: '10px',
                  color: PRIMARY_CORAL,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '7px'
                }}>
                    LIMITED SPACES AVAILABLE
                  </div>
                  <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 300,
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.62)',
                  lineHeight: 1.7,
                  margin: 0
                }}>
                    Spaces are strictly limited. Secure your place now and position yourself at the
                    epicentre of Africa's capital ecosystem.
                  </p>
                </div>
              </div>

              {/* CTA Row */}
              <div style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              gap: '10px',
              paddingTop: '4px'
            }}>
                <motion.button whileHover={{
                scale: 1.03
              }} whileTap={{
                scale: 0.97
              }} style={{
                background: `linear-gradient(135deg, ${PRIMARY_CORAL}, #c42823)`,
                color: '#F7F6F3',
                borderRadius: '40px',
                padding: '13px 28px',
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 600,
                fontSize: '13px',
                boxShadow: '0 4px 18px rgba(222,50,45,0.4)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                flex: isMobile ? 'unset' : 1
              }}>
                  <span>Register Now</span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </motion.button>
                <motion.button whileHover={{
                scale: 1.03
              }} whileTap={{
                scale: 0.97
              }} style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.22)',
                color: 'rgba(255,255,255,0.72)',
                borderRadius: '40px',
                padding: '13px 28px',
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                flex: isMobile ? 'unset' : 1
              }}>
                  Learn More
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>;
};