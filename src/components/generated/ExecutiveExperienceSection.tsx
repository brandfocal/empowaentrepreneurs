import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, Variants } from 'framer-motion';

// --- Local Hooks ---
const useIsMobile = () => {
  const [v, setV] = useState(false);
  useEffect(() => {
    const c = () => setV(window.innerWidth < 768);
    c();
    window.addEventListener('resize', c);
    return () => window.removeEventListener('resize', c);
  }, []);
  return v;
};

// --- Animation Variants ---
const fadeUp: Variants = {
  hidden: {
    y: 32,
    opacity: 0
  },
  visible: (d: number = 0) => ({
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.72,
      delay: d,
      ease: [0.16, 1, 0.3, 1]
    }
  })
};
const lineGrow: Variants = {
  hidden: {
    scaleY: 0,
    originY: 0
  },
  visible: {
    scaleY: 1,
    transition: {
      duration: 1.1,
      ease: [0.16, 1, 0.3, 1],
      delay: 0.2
    }
  }
};
const dotPop: Variants = {
  hidden: {
    scale: 0,
    opacity: 0
  },
  visible: (d: number = 0) => ({
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.45,
      delay: d,
      ease: [0.22, 1, 0.36, 1]
    }
  })
};
const rotateFade: Variants = {
  hidden: {
    rotate: -10,
    opacity: 0,
    scale: 0.8
  },
  visible: (d: number = 0) => ({
    rotate: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.7,
      delay: d,
      ease: [0.22, 1, 0.36, 1]
    }
  })
};

// --- Icons ---
const PlusSquareIcon = () => <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
    <path d="M16.25 2.5H3.75C3.41848 2.5 3.10054 2.6317 2.86612 2.86612C2.6317 3.10054 2.5 3.41848 2.5 3.75V16.25C2.5 16.5815 2.6317 16.8995 2.86612 17.1339C3.10054 17.3683 3.41848 17.5 3.75 17.5H16.25C16.5815 17.5 16.8995 17.3683 17.1339 17.1339C17.3683 16.8995 17.5 16.5815 17.5 16.25V3.75C17.5 3.41848 17.3683 3.10054 17.1339 2.86612C16.8995 2.6317 16.5815 2.5 16.25 2.5ZM13.125 10.625H10.625V13.125C10.625 13.2908 10.5592 13.4497 10.4419 13.5669C10.3247 13.6842 10.1658 13.75 10 13.75C9.83424 13.75 9.67527 13.6842 9.55806 13.5669C9.44085 13.4497 9.375 13.2908 9.375 13.125V10.625H6.875C6.70924 10.625 6.55027 10.5592 6.43306 10.4419C6.31585 10.3247 6.25 10.1658 6.25 10C6.25 9.83424 6.31585 9.67527 6.43306 9.55806C6.55027 9.44085 6.70924 9.375 6.875 9.375H9.375V6.875C9.375 6.70924 9.44085 6.55027 9.55806 6.43306C9.67527 6.31585 9.83424 6.25 10 6.25C10.1658 6.25 10.3247 6.31585 10.4419 6.43306C10.5592 6.55027 10.625 6.70924 10.625 6.875V9.375H13.125C13.2908 9.375 13.4497 9.44085 13.5669 9.55806C13.6842 9.67527 13.75 9.83424 13.75 10C13.75 10.1658 13.6842 10.3247 13.5669 10.4419C13.4497 10.5592 13.2908 10.625 13.125 10.625Z" fill="#DE322D" />
  </svg>;
const StarIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>;
const PeopleIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>;
const DiningIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
    <line x1="7" y1="2" x2="7" y2="11" />
    <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h4v6" />
    <path d="M21 21v-1" />
  </svg>;
const ChartIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>;
const TrophyIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="6" />
    <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
  </svg>;

// --- Data ---
interface ExperiencePillar {
  id: string;
  num: string;
  title: string;
  description: string;
  tag: string;
  featured: boolean;
  icon: React.ReactNode;
}
const EXPERIENCE_PILLARS: ExperiencePillar[] = [{
  id: 'ep-1',
  num: '01',
  title: 'Executive Red Carpet Arrival',
  description: 'An immersive grand entrance designed to set the tone: curated ambiance, personalized welcome, and white-glove service from the first step.',
  tag: 'Grand Entrance',
  featured: true,
  icon: <StarIcon />
}, {
  id: 'ep-2',
  num: '02',
  title: 'Investor & Founder Private Networking Lounge',
  description: 'Exclusive access to a curated circle of decision-makers and capital allocators in an intimate, invitation-only environment.',
  tag: 'Private Access',
  featured: false,
  icon: <PeopleIcon />
}, {
  id: 'ep-3',
  num: '03',
  title: 'Curated Culinary Experience',
  description: 'Chef-led tasting menus, rare vintages, and intimate dining designed for conversation and connection.',
  tag: 'Fine Dining',
  featured: false,
  icon: <DiningIcon />
}, {
  id: 'ep-4',
  num: '04',
  title: 'High-Level Capital & Investment Conversations',
  description: 'Structured forums for deal flow, co-investment, and strategic capital deployment among vetted participants.',
  tag: 'Capital Forum',
  featured: false,
  icon: <ChartIcon />
}, {
  id: 'ep-5',
  num: '05',
  title: 'Legacy Tribute Segment',
  description: 'A dedicated ceremony honoring those who have shaped industries and inspired generations of leaders.',
  tag: 'Ceremony',
  featured: false,
  icon: <TrophyIcon />
}];

// --- Main Section ---
export const ExecutiveExperienceSection: React.FC = () => {
  const isMobile = useIsMobile();
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, {
    once: true,
    margin: '-60px 0px'
  });
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  return <section ref={containerRef} style={{
    background: '#F7F6F3',
    paddingTop: isMobile ? '72px' : '100px',
    paddingBottom: isMobile ? '80px' : '120px',
    boxSizing: 'border-box',
    overflow: 'hidden',
    width: '100%'
  }}>
      <div style={{
      maxWidth: '860px',
      margin: '0 auto',
      padding: isMobile ? '0 20px' : '0 48px'
    }}>
        {/* Header Block */}
        <div style={{
        marginBottom: isMobile ? '52px' : '72px'
      }}>
          <motion.div variants={rotateFade} initial="hidden" animate={isInView ? 'visible' : 'hidden'} custom={0} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '18px'
        }}>
            <PlusSquareIcon />
            <span style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '11px',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'rgba(20, 18, 16, 0.4)',
            fontWeight: 500
          }}>
              Executive Experience Architecture
            </span>
          </motion.div>

          <motion.h2 variants={fadeUp} initial="hidden" animate={isInView ? 'visible' : 'hidden'} custom={0.08} style={{
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: 300,
          fontSize: isMobile ? 'clamp(26px, 7vw, 38px)' : 'clamp(30px, 3.8vw, 48px)',
          letterSpacing: '-1.5px',
          color: '#141210',
          margin: '0 0 16px 0',
          lineHeight: 1.08
        }}>
            A Curated Executive<br />Ecosystem Experience
          </motion.h2>

          <motion.p variants={fadeUp} initial="hidden" animate={isInView ? 'visible' : 'hidden'} custom={0.14} style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 400,
          fontSize: isMobile ? '14px' : '15px',
          color: 'rgba(20,18,16,0.48)',
          lineHeight: 1.7,
          margin: 0,
          maxWidth: '520px'
        }}>
            Five precisely orchestrated moments that define a summit unlike any other: built for those who lead, invest, and leave a mark.
          </motion.p>
        </div>

        {/* Timeline */}
        <div style={{
        position: 'relative'
      }}>
          {/* Vertical line */}
          <div style={{
          position: 'absolute',
          left: isMobile ? '20px' : '28px',
          top: '12px',
          bottom: '12px',
          width: '1px',
          background: 'rgba(20,18,16,0.10)',
          transformOrigin: 'top center'
        }}>
            <motion.div variants={lineGrow} initial="hidden" animate={isInView ? 'visible' : 'hidden'} style={{
            width: '100%',
            height: '100%',
            background: 'rgba(20,18,16,0.10)',
            transformOrigin: 'top center'
          }} />
          </div>

          {/* Timeline Items */}
          <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile ? '24px' : '20px'
        }}>
            {EXPERIENCE_PILLARS.map((pillar, i) => {
            const delay = 0.18 + i * 0.1;
            const isHovered = hoveredId === pillar.id;
            const isFeatured = pillar.featured;
            return <motion.div key={pillar.id} variants={fadeUp} initial="hidden" animate={isInView ? 'visible' : 'hidden'} custom={delay} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: isMobile ? '20px' : '32px'
            }}>
                  {/* Left: Number column */}
                  <div style={{
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: isMobile ? '40px' : '56px',
                paddingTop: '22px'
              }}>
                    {/* Timeline node */}
                    <motion.div variants={dotPop} initial="hidden" animate={isInView ? 'visible' : 'hidden'} custom={delay + 0.08} style={{
                  width: isMobile ? '40px' : '56px',
                  height: isMobile ? '40px' : '56px',
                  borderRadius: '50%',
                  background: isFeatured ? '#DE322D' : '#FFFFFF',
                  border: isFeatured ? 'none' : '1.5px solid rgba(20,18,16,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
                  boxShadow: isHovered && !isFeatured ? '0 4px 20px rgba(222,50,45,0.14)' : isFeatured ? '0 6px 24px rgba(222,50,45,0.28)' : '0 2px 8px rgba(0,0,0,0.06)',
                  zIndex: 1
                }}>
                      <span style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 700,
                    fontSize: isMobile ? '11px' : '12px',
                    letterSpacing: '0.04em',
                    color: isFeatured ? '#FFFFFF' : '#DE322D'
                  }}>
                        {pillar.num}
                      </span>
                    </motion.div>
                  </div>

                  {/* Right: Card */}
                  <article onMouseEnter={() => setHoveredId(pillar.id)} onMouseLeave={() => setHoveredId(null)} style={{
                flex: 1,
                borderRadius: '16px',
                padding: isMobile ? '24px 22px' : isFeatured ? '36px 40px' : '28px 32px',
                background: isFeatured ? '#141210' : '#FFFFFF',
                border: isFeatured ? 'none' : '1px solid rgba(20,18,16,0.07)',
                boxShadow: isHovered ? isFeatured ? '0 20px 56px rgba(0,0,0,0.22)' : '0 12px 40px rgba(0,0,0,0.09)' : isFeatured ? '0 6px 28px rgba(0,0,0,0.14)' : '0 2px 10px rgba(0,0,0,0.04)',
                transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
                transition: 'box-shadow 0.3s ease, transform 0.3s ease',
                marginBottom: i < EXPERIENCE_PILLARS.length - 1 ? '0' : '0',
                cursor: 'default',
                boxSizing: 'border-box'
              }}>
                    {/* Tag + Icon row */}
                    <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: isFeatured ? '20px' : '16px'
                }}>
                      <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 600,
                    fontSize: '10px',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: isFeatured ? 'rgba(255,255,255,0.4)' : 'rgba(20,18,16,0.38)',
                    padding: '4px 10px',
                    background: isFeatured ? 'rgba(255,255,255,0.07)' : 'rgba(20,18,16,0.05)',
                    borderRadius: '99px'
                  }}>
                        {pillar.tag}
                      </span>

                      <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: isFeatured ? 'rgba(255,255,255,0.08)' : 'rgba(222,50,45,0.07)',
                    color: isFeatured ? 'rgba(255,255,255,0.7)' : '#DE322D',
                    flexShrink: 0
                  }}>
                        {pillar.icon}
                      </div>
                    </div>

                    <h3 style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 700,
                  fontSize: isFeatured ? isMobile ? '18px' : '22px' : isMobile ? '14px' : '15px',
                  color: isFeatured ? '#FFFFFF' : '#141210',
                  letterSpacing: isFeatured ? '-0.5px' : '-0.2px',
                  margin: `0 0 ${isFeatured ? '12px' : '8px'} 0`,
                  lineHeight: 1.25
                }}>
                      {pillar.title}
                    </h3>

                    <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 400,
                  fontSize: isMobile ? '13px' : '13.5px',
                  color: isFeatured ? 'rgba(255,255,255,0.48)' : 'rgba(20,18,16,0.5)',
                  lineHeight: 1.7,
                  margin: 0
                }}>
                      {pillar.description}
                    </p>

                    {isFeatured && <div style={{
                  marginTop: '24px',
                  paddingTop: '20px',
                  borderTop: '1px solid rgba(255,255,255,0.07)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                        <div style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#DE322D',
                    flexShrink: 0
                  }} />
                        <span style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 600,
                    fontSize: '10px',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.3)'
                  }}>
                          Featured Opening Moment
                        </span>
                      </div>}
                  </article>
                </motion.div>;
          })}
          </div>
        </div>
      </div>
    </section>;
};