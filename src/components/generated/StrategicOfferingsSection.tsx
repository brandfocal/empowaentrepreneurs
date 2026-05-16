import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

// --- LOCAL HOOKS ---
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
const PlusSquareIcon = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="20" height="20" rx="4" fill="#DE322D" />
    <path d="M10 6V14M6 10H14" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
  </svg>;

// --- DATA ---
const OFFERINGS = [{
  id: '01',
  num: '01',
  title: 'Venture Finance and Capital Access Advisory',
  description: 'Enhances investment readiness and accelerates access to venture capital, grants, and blended finance structuring.'
}, {
  id: '02',
  num: '02',
  title: 'Venture Creation and Incubation',
  description: 'Custom-designed accelerator programmes focused on founder development and innovation commercialisation.'
}, {
  id: '03',
  num: '03',
  title: 'Enterprise and Supplier Development ESD Solutions',
  description: 'Moves ESD beyond compliance into measurable commercial impact and expanded supplier ecosystems.'
}, {
  id: '04',
  num: '04',
  title: 'Township Economy Activation',
  description: 'Focused on informal economy commercialisation and accelerating youth and women economic participation.'
}, {
  id: '05',
  num: '05',
  title: 'Innovation AI and Digital Economy Solutions',
  description: 'Strengthening digital competitiveness and positioning organisations for future economy leadership.'
}, {
  id: '06',
  num: '06',
  title: 'Entrepreneurial Masterclasses and Executive Learning',
  description: 'Capability development covering funding readiness AI leadership and procurement access.'
}, {
  id: '07',
  num: '07',
  title: 'Economic Activation Campaigns',
  description: 'National and regional mobilization designed to drive ecosystem participation and market visibility.'
}, {
  id: '08',
  num: '08',
  title: 'Keynotes and Executive Platforms',
  description: 'High-impact experiences driving entrepreneurial leadership and commercially relevant economic conversations.'
}];

// --- ANIMATION VARIANTS ---
const slideUpBlur = (delay: number) => ({
  hidden: {
    y: 80,
    filter: 'blur(18px)',
    opacity: 0
  },
  visible: {
    y: 0,
    filter: 'blur(0px)',
    opacity: 1,
    transition: {
      duration: 1.05,
      delay,
      ease: [0.16, 1, 0.3, 1] as const
    }
  }
});
const rotateFade = {
  hidden: {
    rotate: -12,
    scale: 0.7,
    opacity: 0
  },
  visible: {
    rotate: 0,
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as const
    }
  }
};
const lineWipe = (delay: number) => ({
  hidden: {
    scaleX: 0,
    opacity: 0
  },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: {
      duration: 0.9,
      delay,
      ease: [0.76, 0, 0.24, 1] as const
    }
  }
});

// --- COMPONENT ---
export const StrategicOfferingsSection = () => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, {
    once: true,
    margin: '-60px 0px'
  });
  const [showAll, setShowAll] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const visibleOfferings = showAll ? OFFERINGS : OFFERINGS.slice(0, 3);
  const handleToggle = () => {
    if (showAll) {
      setShowAll(false);
      setTimeout(() => {
        gridRef.current?.scrollIntoView({
          behavior: 'smooth'
        });
      }, 50);
    } else {
      setShowAll(true);
    }
  };
  return <section ref={sectionRef} style={{
    background: '#FFFFFF',
    paddingTop: isMobile ? '56px' : isTablet ? '80px' : '100px',
    paddingBottom: isMobile ? '56px' : isTablet ? '80px' : '100px',
    width: '100%',
    overflowX: 'hidden',
    boxSizing: 'border-box'
  }}>
      <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: isMobile ? '0 20px' : isTablet ? '0 40px' : '0 64px'
    }}>
        {/* HEADER */}
        <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        marginBottom: isMobile ? '36px' : isTablet ? '44px' : '60px'
      }}>
          <motion.div variants={rotateFade} initial="hidden" animate={isInView ? 'visible' : 'hidden'} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '20px'
        }}>
            <PlusSquareIcon />
            <span style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            color: 'rgba(20, 18, 16, 0.45)',
            fontWeight: 600
          }}>
              Strategic Offerings and ROI
            </span>
          </motion.div>

          <motion.h2 variants={slideUpBlur(0.1)} initial="hidden" animate={isInView ? 'visible' : 'hidden'} style={{
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: 300,
          fontSize: isMobile ? 'clamp(22px, 7vw, 32px)' : isTablet ? 'clamp(26px, 4vw, 38px)' : 'clamp(28px, 3.5vw, 48px)',
          letterSpacing: isMobile ? '-0.5px' : '-1.5px',
          lineHeight: 1.08,
          color: '#141210',
          maxWidth: '780px',
          margin: '0 0 20px'
        }}>
            Solutions designed for listed companies, government agencies, DFIs, banks, and high-growth entrepreneurs.
          </motion.h2>

          <motion.p variants={slideUpBlur(0.2)} initial="hidden" animate={isInView ? 'visible' : 'hidden'} style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 300,
          fontSize: isMobile ? '14px' : '15px',
          lineHeight: 1.78,
          color: 'rgba(20, 18, 16, 0.55)',
          maxWidth: '560px',
          margin: 0
        }}>
            Each solution is engineered to deliver measurable commercial outcomes connecting organisations to capital, markets, and enterprise growth ecosystems at the highest level.
          </motion.p>
        </div>

        {/* SEPARATOR */}
        <motion.div variants={lineWipe(0.25)} initial="hidden" animate={isInView ? 'visible' : 'hidden'} style={{
        height: '1px',
        background: '#DE322D',
        opacity: 0.4,
        transformOrigin: 'left',
        width: '100%',
        marginBottom: 0
      }} />

        {/* GRID */}
        <div ref={gridRef} style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
        gap: 0
      }}>
          <AnimatePresence mode="popLayout">
            {visibleOfferings.map((offering, i) => <motion.div key={offering.id} initial={{
            opacity: 0,
            y: 32,
            filter: 'blur(8px)'
          }} animate={{
            opacity: 1,
            y: 0,
            filter: 'blur(0px)'
          }} exit={{
            opacity: 0,
            y: -16,
            filter: 'blur(6px)'
          }} transition={{
            duration: 0.55,
            delay: i * 0.07,
            ease: [0.22, 1, 0.36, 1] as const
          }} onMouseEnter={() => setHoveredId(offering.id)} onMouseLeave={() => setHoveredId(null)} style={{
            padding: isMobile ? '24px 16px' : isTablet ? '28px 24px' : '40px 32px',
            borderBottom: '0.8px solid rgba(20, 18, 16, 0.08)',
            borderRight: isMobile ? 'none' : isTablet ? i % 2 !== 1 ? '0.8px solid rgba(20, 18, 16, 0.08)' : 'none' : i % 3 !== 2 ? '0.8px solid rgba(20, 18, 16, 0.08)' : 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            boxSizing: 'border-box',
            position: 'relative',
            overflow: 'hidden',
            transform: hoveredId === offering.id ? 'translateY(-2px)' : 'translateY(0)',
            transition: 'transform 0.3s ease'
          }}>
                {/* Ghost Number */}
                <div style={{
              position: 'absolute',
              top: '-12px',
              right: '20px',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 700,
              fontSize: '120px',
              color: 'rgba(222, 50, 45, 0.05)',
              letterSpacing: '-4px',
              userSelect: 'none',
              pointerEvents: 'none',
              lineHeight: 1
            }}>
                  <span>{offering.num}</span>
                </div>

                {/* Number Row */}
                <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
                  <PlusSquareIcon />
                  <span style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '11px',
                color: '#DE322D',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                    <span>{offering.num}</span>
                  </span>
                </div>

                <h3 style={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 700,
              fontSize: isMobile ? '14px' : isTablet ? '15px' : '16px',
              color: '#141210',
              letterSpacing: '-0.2px',
              lineHeight: 1.3,
              margin: 0
            }}>
                  <span>{offering.title}</span>
                </h3>

                <p style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 300,
              fontSize: isMobile ? '13px' : '14px',
              color: 'rgba(20, 18, 16, 0.55)',
              lineHeight: 1.7,
              margin: 0
            }}>
                  <span>{offering.description}</span>
                </p>

                <a href="#" onClick={e => e.preventDefault()} style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '12px',
              fontWeight: 500,
              color: '#DE322D',
              textDecoration: 'none',
              letterSpacing: '0.05em',
              cursor: 'pointer'
            }}>
                  <span>Learn More</span>
                </a>
              </motion.div>)}
          </AnimatePresence>
        </div>

        {/* TOGGLE WRAPPER */}
        <div style={{
        marginTop: isMobile ? '32px' : '48px',
        display: 'flex',
        justifyContent: 'center'
      }}>
          <motion.button onClick={handleToggle} whileHover={{
          scale: 1.04
        }} whileTap={{
          scale: 0.97
        }} style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          padding: isMobile ? '12px 24px' : '14px 36px',
          borderRadius: '40px',
          border: '1px solid rgba(20, 18, 16, 0.15)',
          background: showAll ? '#141210' : '#FFFFFF',
          color: showAll ? '#F7F6F3' : 'rgba(20, 18, 16, 0.7)',
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '13px',
          fontWeight: 600,
          letterSpacing: '0.04em',
          cursor: 'pointer',
          transition: 'all 0.25s ease',
          boxShadow: showAll ? '0 4px 20px rgba(20, 18, 16, 0.2)' : '0 2px 12px rgba(20, 18, 16, 0.08)',
          width: isMobile ? '80%' : 'auto',
          justifyContent: 'center'
        }}>
            <span>{showAll ? 'Show Less' : 'Show More Solutions'}</span>
            <motion.svg width="14" height="14" viewBox="0 0 14 14" fill="none" animate={{
            rotate: showAll ? 180 : 0
          }} transition={{
            duration: 0.35,
            ease: [0.22, 1, 0.36, 1] as const
          }}>
              <path d="M2.5 5L7 9.5L11.5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </motion.svg>
          </motion.button>
        </div>
      </div>
    </section>;
};
export default StrategicOfferingsSection;