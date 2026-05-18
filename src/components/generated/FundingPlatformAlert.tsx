import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// --- CONSTANTS ---
const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`;
const STAT_PILLS = [{
  id: 'pill-1',
  label: '400 Entrepreneurs'
}, {
  id: 'pill-2',
  label: '200+ Funders & Investors'
}, {
  id: 'pill-3',
  label: '50+ Ecosystem Builders'
}];
const GRID_COLUMNS = [{
  id: 'col-1',
  label: 'PITCHING CRITERIA',
  body1: 'Pitching opportunities are strictly limited and highly competitive. Only entrepreneurs who successfully meet the investment and funding criteria determined by participating funders will be selected.',
  body2: 'Attendance alone does not guarantee a pitching slot. Final selection decisions remain solely with participating funders and EmpowaWorx.'
}, {
  id: 'col-2',
  label: 'NO REGISTRATION. NO PITCH.',
  body1: 'Only officially registered entrepreneurs will be eligible for consideration. Final pitching decisions remain solely with participating funders and EmpowaWorx and are final.',
  body2: 'This platform extends far beyond pitching: expect direct access to funding conversations, investment intelligence, and growth masterclasses.'
}, {
  id: 'col-3',
  label: 'LIMITED SPACES AVAILABLE',
  body1: "Spaces are strictly limited. Secure your place now and position yourself at the epicentre of Africa's capital ecosystem.",
  body2: 'Powerful ecosystem networking is designed to accelerate scalable African businesses through strategic partnerships and market access opportunities.'
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
    scale: 0.93,
    opacity: 0,
    filter: 'blur(12px)'
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
const staggerChild = {
  hidden: {
    opacity: 0,
    y: 28,
    filter: 'blur(6px)'
  },
  visible: (d: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      delay: d,
      ease: [0.22, 1, 0.36, 1] as const
    }
  })
};

// --- HOOKS ---
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
};
const useIsTablet = () => {
  const [v, setV] = useState(false);
  useEffect(() => {
    const c = () => setV(window.innerWidth >= 768 && window.innerWidth < 1100);
    c();
    window.addEventListener('resize', c);
    return () => window.removeEventListener('resize', c);
  }, []);
  return v;
};

// --- ICONS ---
const PlusSquareIconLight = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M16.25 2.5H3.75C3.41848 2.5 3.10054 2.6317 2.86612 2.86612C2.6317 3.10054 2.5 3.41848 2.5 3.75V16.25C2.5 16.5815 2.6317 16.8995 2.86612 17.1339C3.10054 17.3683 3.41848 17.5 3.75 17.5H16.25C16.5815 17.5 16.8995 17.3683 17.1339 17.1339C17.3683 16.8995 17.5 16.5815 17.5 16.25V3.75C17.5 3.41848 17.3683 3.10054 17.1339 2.86612C16.8995 2.6317 16.5815 2.5 16.25 2.5ZM13.125 10.625H10.625V13.125C10.625 13.2908 10.5592 13.4497 10.4419 13.5669C10.3247 13.6842 10.1658 13.75 10 13.75C9.83424 13.75 9.67527 13.6842 9.55806 13.5669C9.44085 13.4497 9.375 13.2908 9.375 13.125V10.625H6.875C6.70924 10.625 6.55027 10.5592 6.43306 10.4419C6.31585 10.3247 6.25 10.1658 6.25 10C6.25 9.83424 6.31585 9.67527 6.43306 9.55806C6.55027 9.44085 6.70924 9.375 6.875 9.375H9.375V6.875C9.375 6.70924 9.44085 6.55027 9.55806 6.43306C9.67527 6.31585 9.83424 6.25 10 6.25C10.1658 6.25 10.3247 6.31585 10.4419 6.43306C10.5592 6.55027 10.625 6.70924 10.625 6.875V9.375H13.125C13.2908 9.375 13.4497 9.44085 13.5669 9.55806C13.6842 9.67527 13.75 9.83424 13.75 10C13.75 10.1658 13.6842 10.3247 13.5669 10.4419C13.4497 10.5592 13.2908 10.625 13.125 10.625Z" fill="rgba(247,246,243,0.35)" />
  </svg>;
interface WarningIconProps {
  size: number;
}
const WarningIcon = ({
  size
}: WarningIconProps) => <div style={{
  width: size,
  height: size,
  background: 'rgba(222,50,45,0.1)',
  borderRadius: '50%',
  border: '1px solid rgba(222,50,45,0.2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0
}}>
    <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none" stroke={PRIMARY_CORAL} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  </div>;

// --- COMPONENT ---
export const FundingPlatformAlert: React.FC = () => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const zone1Ref = useRef(null);
  const quoteRef = useRef(null);
  const zone3Ref = useRef(null);
  const isZone1InView = useInView(zone1Ref, {
    once: true,
    margin: '-60px 0px'
  });
  const isQuoteInView = useInView(quoteRef, {
    once: true,
    margin: '-60px 0px'
  });
  const isZone3InView = useInView(zone3Ref, {
    once: true,
    margin: '-60px 0px'
  });
  return <section style={{
    width: '100%',
    overflowX: 'hidden'
  }}>

      {/* ZONE 1: Platform Identity Band */}
      <div ref={zone1Ref} style={{
      background: `#0A0906`,
      backgroundImage: `${NOISE_SVG}, radial-gradient(ellipse 70% 60% at 20% 50%, rgba(222,50,45,0.14) 0%, transparent 70%)`,
      paddingTop: isMobile ? '56px' : isTablet ? '72px' : '96px',
      paddingBottom: isMobile ? '40px' : isTablet ? '52px' : '64px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      position: 'relative',
      boxSizing: 'border-box'
    }}>
        <div style={{
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        padding: isMobile ? '0 20px' : isTablet ? '0 40px' : '0 64px',
        boxSizing: 'border-box'
      }}>
          {/* Eyebrow */}
          <motion.div initial="hidden" animate={isZone1InView ? 'visible' : 'hidden'} variants={fadeUpVariants} custom={0} style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '24px',
          textAlign: 'center'
        }}>
            <PlusSquareIconLight />
            <span style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: isMobile ? '10px' : '11px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
            color: 'rgba(247,246,243,0.4)'
          }}>
              <span>AFRICA'S PREMIER FUNDING PLATFORM</span>
              <sup style={{
              color: PRIMARY_CORAL,
              marginLeft: '2px',
              top: '-0.2em'
            }}>™</sup>
            </span>
          </motion.div>

          {/* H2 */}
          <h2 style={{
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 200,
          lineHeight: isMobile ? 1.05 : 0.92,
          letterSpacing: isMobile ? '-1px' : isTablet ? '-2px' : '-3.5px',
          margin: isMobile ? '0 0 20px 0' : '0 0 28px 0'
        }}>
            <div style={{
            overflow: 'hidden',
            display: 'block'
          }}>
              <motion.span initial={{
              y: '110%'
            }} animate={isZone1InView ? {
              y: 0
            } : {
              y: '110%'
            }} transition={{
              duration: 1.05,
              delay: 0.15,
              ease: [0.16, 1, 0.3, 1] as const
            }} style={{
              display: 'block',
              fontSize: 'clamp(28px, 7vw, 72px)',
              color: '#F7F6F3'
            }}>
                Where Vetted Entrepreneurs
              </motion.span>
            </div>
            <div style={{
            overflow: 'hidden',
            display: 'block',
            marginTop: isMobile ? '8px' : '0'
          }}>
              <motion.em initial={{
              y: '110%'
            }} animate={isZone1InView ? {
              y: 0
            } : {
              y: '110%'
            }} transition={{
              duration: 1.05,
              delay: 0.28,
              ease: [0.16, 1, 0.3, 1] as const
            }} style={{
              display: 'block',
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: 'clamp(28px, 7vw, 72px)',
              color: PRIMARY_CORAL
            }}>
                Meet High-Impact Capital.
              </motion.em>
            </div>
          </h2>

          {/* Subtitle */}
          <motion.p initial="hidden" animate={isZone1InView ? 'visible' : 'hidden'} variants={fadeUpVariants} custom={0.3} style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 300,
          fontSize: isMobile ? '14px' : isTablet ? '15px' : 'clamp(15px, 1.2vw, 18px)',
          color: 'rgba(247,246,243,0.55)',
          lineHeight: 1.8,
          maxWidth: isMobile ? '100%' : isTablet ? '560px' : '680px',
          margin: isMobile ? '0 auto 32px' : '0 auto 48px'
        }}>
            EmpowaEntrepreneurs Funding Summit 2026 is a high-consequence platform convening
            Africa's most ambitious entrepreneurs, investors, DFIs, accelerators, innovation hubs,
            ecosystem builders, and capital partners shaping the continent's next growth economy.
          </motion.p>

          {/* Stat Pills */}
          <motion.div initial="hidden" animate={isZone1InView ? 'visible' : 'hidden'} variants={fadeUpVariants} custom={0.45} style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: isMobile ? '10px' : '12px'
        }}>
            {STAT_PILLS.map(pill => <div key={pill.id} style={{
            background: 'rgba(247,246,243,0.05)',
            border: '1px solid rgba(247,246,243,0.1)',
            borderRadius: '100px',
            padding: '10px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isMobile ? 'center' : 'flex-start',
            gap: '8px',
            width: isMobile ? '100%' : 'auto',
            maxWidth: isMobile ? '280px' : 'none',
            boxSizing: 'border-box'
          }}>
                <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: PRIMARY_CORAL,
              flexShrink: 0
            }} />
                <span style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 600,
              fontSize: '13px',
              color: '#F7F6F3'
            }}>
                  {pill.label}
                </span>
              </div>)}
          </motion.div>
        </div>
      </div>

      {/* ZONE 2: Full-Width Dark Callout Quote */}
      <div ref={quoteRef} style={{
      background: '#141210',
      backgroundImage: `${NOISE_SVG}, radial-gradient(ellipse 50% 80% at 80% 50%, rgba(222,50,45,0.08) 0%, transparent 65%)`,
      paddingTop: isMobile ? '56px' : '80px',
      paddingBottom: isMobile ? '56px' : '80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxSizing: 'border-box'
    }}>
        <div style={{
        maxWidth: '1100px',
        width: '100%',
        padding: isMobile ? '0 24px' : isTablet ? '0 40px' : '0 64px',
        boxSizing: 'border-box'
      }}>
          <motion.div initial="hidden" animate={isQuoteInView ? 'visible' : 'hidden'} variants={fadeUpVariants} custom={0} style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'center',
          gap: isMobile ? '20px' : '48px'
        }}>
            {/* Large decorative quotemark */}
            <div style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: isMobile ? '80px' : '120px',
            fontWeight: 700,
            lineHeight: 0.8,
            color: PRIMARY_CORAL,
            opacity: 0.35,
            flexShrink: 0,
            userSelect: 'none'
          }}>
              "
            </div>
            <div>
              <p style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 300,
              fontStyle: 'italic',
              fontSize: isMobile ? 'clamp(18px, 4vw, 22px)' : 'clamp(20px, 2.2vw, 30px)',
              color: 'rgba(247,246,243,0.88)',
              lineHeight: 1.55,
              letterSpacing: '-0.4px',
              margin: '0 0 16px'
            }}>
                Pitch or not: position yourself where capital is deployed, partnerships are
                activated, and high-growth businesses are discovered.
              </p>
              <div style={{
              width: '40px',
              height: '2px',
              background: PRIMARY_CORAL,
              borderRadius: '2px'
            }} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* ZONE 3: Notice Grid Section */}
      <div ref={zone3Ref} style={{
      background: '#F7F3EC',
      paddingTop: isMobile ? '36px' : isTablet ? '52px' : '64px',
      paddingBottom: isMobile ? '48px' : isTablet ? '64px' : '88px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxSizing: 'border-box'
    }}>
        <div style={{
        maxWidth: isMobile ? '100%' : isTablet ? '760px' : '900px',
        width: '100%',
        padding: isMobile ? '0 16px' : isTablet ? '0 32px' : '0 40px',
        boxSizing: 'border-box'
      }}>
          {/* Card */}
          <motion.div initial="hidden" animate={isZone3InView ? 'visible' : 'hidden'} variants={scaleReveal} custom={0.1} style={{
          background: '#FFFFFF',
          borderRadius: isMobile ? '16px' : '24px',
          border: '1px solid rgba(20,18,16,0.08)',
          overflow: 'hidden',
          boxShadow: '0 8px 48px rgba(20,18,16,0.07)',
          maxWidth: '100%'
        }}>
            {/* Top Bar */}
            <div style={{
            height: '4px',
            background: `linear-gradient(90deg, ${PRIMARY_CORAL}, #ff7a70)`,
            width: '100%'
          }} />

            {/* Card Header */}
            <div style={{
            padding: isMobile ? '16px 18px 14px' : isTablet ? '22px 28px 20px' : '28px 36px 24px',
            borderBottom: '1px solid rgba(20,18,16,0.07)',
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? '10px' : '14px',
            boxSizing: 'border-box'
          }}>
              <WarningIcon size={isMobile ? 34 : 40} />
              {!isMobile && <div style={{
              width: '1px',
              height: '28px',
              background: 'rgba(20,18,16,0.12)',
              flexShrink: 0
            }} />}
              <h3 style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 700,
              fontSize: isMobile ? '13px' : isTablet ? '15px' : '17px',
              color: '#141210',
              letterSpacing: '-0.2px',
              margin: 0
            }}>
                IMPORTANT NOTICE TO ENTREPRENEURS
              </h3>
            </div>

            {/* Card Body */}
            <div style={{
            padding: isMobile ? '18px 18px 24px' : isTablet ? '24px 28px 32px' : '28px 36px 36px',
            display: 'flex',
            flexDirection: 'column',
            gap: isMobile ? '20px' : '28px',
            boxSizing: 'border-box'
          }}>
              {/* Three-Column Grid */}
              <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
              gap: isMobile ? '16px' : '24px'
            }}>
                {GRID_COLUMNS.map((col, idx) => <motion.div key={col.id} initial="hidden" animate={isZone3InView ? 'visible' : 'hidden'} variants={staggerChild} custom={0.2 + idx * 0.12} style={{
                background: 'rgba(20,18,16,0.02)',
                border: '1px solid rgba(20,18,16,0.07)',
                borderTop: `3px solid ${idx === 0 ? PRIMARY_CORAL : 'rgba(20,18,16,0.12)'}`,
                borderRadius: isMobile ? '10px' : '14px',
                padding: isMobile ? '16px 18px' : '20px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                boxSizing: 'border-box'
              }}>
                    <div style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 700,
                  fontSize: '11px',
                  color: idx === 0 ? PRIMARY_CORAL : '#141210',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em'
                }}>
                      {col.label}
                    </div>
                    <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 300,
                  fontSize: isMobile ? '12px' : '13px',
                  color: 'rgba(20,18,16,0.68)',
                  lineHeight: 1.75,
                  margin: 0
                }}>
                      {col.body1}
                    </p>
                    <div style={{
                  height: '1px',
                  background: 'rgba(20,18,16,0.06)'
                }} />
                    <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 300,
                  fontSize: isMobile ? '12px' : '13px',
                  color: 'rgba(20,18,16,0.45)',
                  lineHeight: 1.75,
                  margin: 0
                }}>
                      {col.body2}
                    </p>
                  </motion.div>)}
              </div>

              {/* CTA Row */}
              <motion.div initial="hidden" animate={isZone3InView ? 'visible' : 'hidden'} variants={fadeUpVariants} custom={0.55} style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'flex-start' : 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: isMobile ? '20px' : '16px',
              paddingTop: '4px',
              borderTop: '1px solid rgba(20,18,16,0.06)'
            }}>
                <div style={{
                width: isMobile ? '100%' : 'auto'
              }}>
                  <div style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 700,
                  fontSize: '13px',
                  color: '#141210',
                  letterSpacing: '-0.2px'
                }}>
                    Partner. Register. Connect. Scale.
                  </div>
                  <div style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '12px',
                  color: 'rgba(20,18,16,0.45)',
                  marginTop: '3px'
                }}>
                    28 May 2026 · EmpowaWorx House, Randburg
                  </div>
                </div>

                <div style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? '8px' : '10px',
                width: isMobile ? '100%' : 'auto'
              }}>
                  <motion.button whileHover={{
                  scale: 1.04
                }} whileTap={{
                  scale: 0.97
                }} style={{
                  background: 'linear-gradient(135deg, #DE322D, #c42823)',
                  color: '#FFFFFF',
                  borderRadius: '40px',
                  padding: isMobile ? '13px 24px' : isTablet ? '13px 28px' : '14px 32px',
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 600,
                  fontSize: '13px',
                  boxShadow: '0 4px 20px rgba(222,50,45,0.4)',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: isMobile ? '100%' : 'auto'
                }} onClick={() => window.open("https://www.quicket.co.za/events/312690-empowaentrepreneurs-funding-summit/", "_blank")}>
                    <span>Summit 2026</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </motion.button>
                  <motion.button whileHover={{
                  scale: 1.04
                }} whileTap={{
                  scale: 0.97
                }} style={{
                  background: 'transparent',
                  border: '1px solid rgba(20,18,16,0.15)',
                  color: 'rgba(20,18,16,0.6)',
                  borderRadius: '40px',
                  padding: isMobile ? '13px 24px' : isTablet ? '13px 28px' : '14px 32px',
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                  width: isMobile ? '100%' : 'auto',
                  justifyContent: 'center'
                }}>
                    Learn More
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>;
};