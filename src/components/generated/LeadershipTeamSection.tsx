import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useInView, Variants } from 'framer-motion';

/**
 * UTILITIES & HOOKS
 */
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

/**
 * ASSETS
 */
const PlusSquareIconLight = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{
  flexShrink: 0
}}>
    <path d="M16.25 2.5H3.75C3.41848 2.5 3.10054 2.6317 2.86612 2.86612C2.6317 3.10054 2.5 3.41848 2.5 3.75V16.25C2.5 16.5815 2.6317 16.8995 2.86612 17.1339C3.10054 17.3683 3.41848 17.5 3.75 17.5H16.25C16.5815 17.5 16.8995 17.3683 17.1339 17.1339C17.3683 16.8995 17.5 16.5815 17.5 16.25V3.75C17.5 3.41848 17.3683 3.10054 17.1339 2.86612C16.8995 2.6317 16.5815 2.5 16.25 2.5ZM13.125 10.625H10.625V13.125C10.625 13.2908 10.5592 13.4497 10.4419 13.5669C10.3247 13.6842 10.1658 13.75 10 13.75C9.83424 13.75 9.67527 13.6842 9.55806 13.5669C9.44085 13.4497 9.375 13.2908 9.375 13.125V10.625H6.875C6.70924 10.625 6.55027 10.5592 6.43306 10.4419C6.31585 10.3247 6.25 10.1658 6.25 10C6.25 9.83424 6.31585 9.67527 6.43306 9.55806C6.55027 9.44085 6.70924 9.375 6.875 9.375H9.375V6.875C9.375 6.70924 9.44085 6.55027 9.55806 6.43306C9.67527 6.31585 9.83424 6.25 10 6.25C10.1658 6.25 10.3247 6.31585 10.4419 6.43306C10.5592 6.55027 10.625 6.70924 10.625 6.875V9.375H13.125C13.2908 9.375 13.4497 9.44085 13.5669 9.55806C13.6842 9.67527 13.75 9.83424 13.75 10C13.75 10.1658 13.6842 10.3247 13.5669 10.4419C13.4497 10.5592 13.2908 10.625 13.125 10.625Z" fill="rgba(247,246,243,0.35)" />
  </svg>;
const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`;

/**
 * ANIMATION VARIANTS
 */
const slideUpBlur: Variants = {
  hidden: {
    y: 80,
    opacity: 0,
    filter: 'blur(18px)',
    scale: 0.97
  },
  visible: (d = 0) => ({
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
    scale: 1,
    transition: {
      duration: 1.05,
      delay: d,
      ease: [0.16, 1, 0.3, 1]
    }
  })
};
const fadeUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 36,
    filter: 'blur(8px)'
  },
  visible: d => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.9,
      delay: d,
      ease: [0.22, 1, 0.36, 1]
    }
  })
};
const rotateFade: Variants = {
  hidden: {
    rotate: -12,
    opacity: 0,
    scale: 0.7
  },
  visible: (d = 0) => ({
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
const lineWipe: Variants = {
  hidden: {
    scaleX: 0,
    opacity: 0
  },
  visible: (d = 0) => ({
    scaleX: 1,
    opacity: 1,
    transition: {
      duration: 0.9,
      delay: d,
      ease: [0.76, 0, 0.24, 1]
    }
  })
};

/**
 * DATA
 */
const LEADERSHIP_TEAM = [{
  n: 1,
  name: 'Simphiwe Masiza',
  role: 'Founder & Executive Producer',
  org: 'EmpowaEntrepreneurs Funding Summit™',
  imageSrc: '/team/simphiwe-masiza.jpg'
}, {
  n: 2,
  name: 'Sechaba Motsieloa',
  role: 'Managing Executive: Special Projects & Strategic Communications',
  org: null,
  imageSrc: '/team/Sechaba-Motsieloa.jpeg'
}, {
  n: 3,
  name: 'Thulisa Bianca Sosibo',
  role: 'Managing Executive: EmpowaEntrepreneurs Funding & Ecosystem Development',
  org: null,
  imageSrc: '/team/Thulisa-Bianca-Sosibo.jpg'
}, {
  n: 4,
  name: 'Carshief Sissing',
  role: 'Digital, Social Media & Platform Experience Lead',
  org: 'EmpowaEntrepreneurs Funding Summit™',
  imageSrc: '/team/Carshiefa-Sissing.jpg'
}, {
  n: 5,
  name: 'Thabo Molefe',
  role: 'Strategic Partnerships & Stakeholder Relations Lead',
  org: 'EmpowaEntrepreneurs Funding Summit™',
  imageSrc: '/team/Thabo-Molefe.jpg'
}, {
  n: 6,
  name: 'Anita Tirkey',
  role: 'Executive Speaker Relations & Programme Talent Lead',
  org: 'EmpowaEntrepreneurs Funding Summit™',
  imageSrc: '/team/Anita-Tirkey.jpg'
}, {
  n: 7,
  name: 'Neo Mathebe',
  role: 'Commercial & Brand Experience Lead',
  org: 'EmpowaEntrepreneurs Funding Summit™',
  imageSrc: '/team/Neo-Mathebe.jpeg'
}, {
  n: 8,
  name: 'Bonnie Maponya',
  role: 'Chief of Staff & Integrated Programme Delivery Lead',
  org: null,
  imageSrc: '/team/Bonnie-Maponya.jpeg'
}];
const cardGap = 16;

/**
 * MAIN COMPONENT
 */
export const LeadershipTeamSection: React.FC = () => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const [hoveredTeam, setHoveredTeam] = useState<number | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const containerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, {
    once: true,
    margin: '-60px 0px'
  });
  const cardWidth = isMobile ? 260 : isTablet ? 300 : 340;

  // Drag-to-scroll
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragScrollLeft = useRef(0);
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    isDragging.current = true;
    dragStartX.current = e.pageX - (trackRef.current?.offsetLeft || 0);
    dragScrollLeft.current = trackRef.current?.scrollLeft || 0;
    if (trackRef.current) trackRef.current.style.cursor = 'grabbing';
  }, []);
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current || !trackRef.current) return;
    e.preventDefault();
    const x = e.pageX - (trackRef.current.offsetLeft || 0);
    const walk = (x - dragStartX.current) * 1.5;
    trackRef.current.scrollLeft = dragScrollLeft.current - walk;
  }, []);
  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    if (trackRef.current) trackRef.current.style.cursor = 'grab';
  }, []);
  const scrollToIdx = (idx: number) => {
    setActiveIdx(idx);
    trackRef.current?.scrollTo({
      left: idx * (cardWidth + cardGap),
      behavior: 'smooth'
    });
  };
  const handlePrev = () => scrollToIdx(Math.max(0, activeIdx - 1));
  const handleNext = () => scrollToIdx(Math.min(LEADERSHIP_TEAM.length - 1, activeIdx + 1));
  const hPad = isMobile ? '0 20px' : isTablet ? '0 40px' : '0 64px';
  const sectionBgFade = '#243040';
  return <section ref={containerRef} style={{
    position: 'relative',
    overflow: 'hidden',
    background: '#243040',
    paddingTop: isMobile ? '72px' : '110px',
    paddingBottom: isMobile ? '72px' : '110px',
    width: '100%',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  }}>
      {/* BACKGROUND LAYERS */}
      <div aria-hidden="true" style={{
      position: 'absolute',
      inset: 0,
      backgroundImage: NOISE_SVG,
      backgroundRepeat: 'repeat',
      backgroundSize: '128px 128px',
      zIndex: 0,
      opacity: 0.5,
      pointerEvents: 'none'
    }} />
      <div aria-hidden="true" style={{
      position: 'absolute',
      top: '-15%',
      right: '-10%',
      width: 'clamp(400px, 55vw, 800px)',
      height: 'clamp(400px, 55vw, 800px)',
      borderRadius: '50%',
      background: 'radial-gradient(circle at 40% 40%, rgba(222,50,45,0.18) 0%, rgba(222,50,45,0.06) 45%, transparent 70%)',
      zIndex: 0,
      pointerEvents: 'none'
    }} />

      {/* INNER CONTAINER */}
      <div style={{
      position: 'relative',
      zIndex: 1,
      maxWidth: '1200px',
      margin: '0 auto',
      padding: hPad,
      width: '100%',
      boxSizing: 'border-box'
    }}>
        {/* TOP ACCENT LINE */}
        <motion.div initial="hidden" animate={isInView ? 'visible' : 'hidden'} variants={lineWipe} custom={0} style={{
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(222,50,45,0.5), transparent)',
        marginBottom: '56px',
        width: '100%',
        originX: 0
      }} />

        {/* HEADER ROW */}
        <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        gap: '24px',
        marginBottom: '40px'
      }}>
          {/* LEFT SIDE */}
          <div>
            {/* SECTION LABEL */}
            <motion.div initial="hidden" animate={isInView ? 'visible' : 'hidden'} variants={rotateFade} custom={0.2} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px'
          }}>
              <PlusSquareIconLight />
              <span style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '11px',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: 'rgba(255,255,255,0.45)'
            }}>
                EXECUTIVE DELIVERY &amp; LEADERSHIP TEAM
              </span>
            </motion.div>

            {/* H2 HEADING */}
            <div style={{
            marginBottom: '20px'
          }}>
              <div style={{
              overflow: 'hidden'
            }}>
                <motion.h2 initial="hidden" animate={isInView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.3} style={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 200,
                lineHeight: 0.91,
                letterSpacing: isMobile ? '-2px' : '-3px',
                margin: 0,
                fontSize: 'clamp(36px, 5vw, 68px)',
                color: '#FFFFFF'
              }}>
                  The Team
                </motion.h2>
              </div>
              <div style={{
              overflow: 'hidden',
              marginTop: '4px'
            }}>
                <motion.h2 initial="hidden" animate={isInView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.4} style={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 300,
                fontStyle: 'italic',
                lineHeight: 0.91,
                letterSpacing: isMobile ? '-2px' : '-3px',
                margin: 0,
                fontSize: 'clamp(36px, 5vw, 68px)',
                color: '#DE322D'
              }}>
                  Behind the Summit.
                </motion.h2>
              </div>
            </div>

            {/* SUBTITLE */}
            <motion.p initial="hidden" animate={isInView ? 'visible' : 'hidden'} variants={fadeUpVariants} custom={0.5} style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 300,
            fontSize: isMobile ? '15px' : '16px',
            lineHeight: 1.75,
            color: 'rgba(255,255,255,0.6)',
            maxWidth: '540px',
            margin: 0
          }}>
              The executive team engineering every dimension of the EmpowaEntrepreneurs Funding
              Summit™ — from strategy and partnerships to speaker relations and brand experience.
            </motion.p>
          </div>

          {/* RIGHT SIDE — PREV / NEXT BUTTONS */}
          <motion.div initial="hidden" animate={isInView ? 'visible' : 'hidden'} variants={fadeUpVariants} custom={0.55} style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          flexShrink: 0
        }}>
            <motion.button onClick={handlePrev} whileHover={activeIdx === 0 ? {} : {
            scale: 1.08
          }} whileTap={activeIdx === 0 ? {} : {
            scale: 0.94
          }} style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.15)',
            background: activeIdx === 0 ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.1)',
            opacity: activeIdx === 0 ? 0.4 : 1,
            cursor: activeIdx === 0 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8L10 13" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.button>
            <motion.button onClick={handleNext} whileHover={activeIdx === LEADERSHIP_TEAM.length - 1 ? {} : {
            scale: 1.08
          }} whileTap={activeIdx === LEADERSHIP_TEAM.length - 1 ? {} : {
            scale: 0.94
          }} style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.15)',
            background: activeIdx === LEADERSHIP_TEAM.length - 1 ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.1)',
            opacity: activeIdx === LEADERSHIP_TEAM.length - 1 ? 0.4 : 1,
            cursor: activeIdx === LEADERSHIP_TEAM.length - 1 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 3L11 8L6 13" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* FULL-WIDTH CAROUSEL TRACK */}
      <motion.div initial="hidden" animate={isInView ? 'visible' : 'hidden'} variants={fadeUpVariants} custom={0.6} style={{
      width: '100vw',
      marginLeft: 'calc(-50vw + 50%)',
      position: 'relative'
    }}>
        {/* Left fade mask */}
        <div aria-hidden="true" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '80px',
        height: '100%',
        background: `linear-gradient(to right, ${sectionBgFade}, transparent)`,
        zIndex: 2,
        pointerEvents: 'none'
      }} />
        {/* Right fade mask */}
        <div aria-hidden="true" style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '80px',
        height: '100%',
        background: `linear-gradient(to left, ${sectionBgFade}, transparent)`,
        zIndex: 2,
        pointerEvents: 'none'
      }} />

        {/* Scrollable track */}
        <div ref={trackRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} style={{
        overflowX: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'],
        cursor: 'grab',
        userSelect: 'none',
        padding: '0 64px'
      }}>
          <div style={{
          display: 'flex',
          gap: `${cardGap}px`,
          width: 'max-content',
          padding: '16px 0 32px'
        }}>
            {LEADERSHIP_TEAM.map(member => <motion.div key={member.n} onMouseEnter={() => setHoveredTeam(member.n)} onMouseLeave={() => setHoveredTeam(null)} style={{
            flexShrink: 0,
            width: `${cardWidth}px`,
            borderRadius: '24px',
            overflow: 'hidden',
            background: hoveredTeam === member.n ? 'linear-gradient(160deg, rgba(222,50,45,0.15) 0%, rgba(255,255,255,0.06) 100%)' : 'linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)',
            border: '1px solid',
            borderColor: hoveredTeam === member.n ? 'rgba(222,50,45,0.4)' : 'rgba(255,255,255,0.12)',
            boxShadow: hoveredTeam === member.n ? '0 32px 80px rgba(0,0,0,0.45)' : '0 4px 20px rgba(0,0,0,0.2)',
            transform: hoveredTeam === member.n ? 'translateY(-10px)' : 'translateY(0)',
            transition: 'border-color 0.3s ease, box-shadow 0.4s ease, transform 0.4s ease, background 0.3s ease'
          }}>
                {/* Photo area */}
                <div style={{
              height: isMobile ? 240 : 280,
              overflow: 'hidden',
              position: 'relative'
            }}>
                  <img src={member.imageSrc} alt={member.name} style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center top',
                filter: 'brightness(0.85) saturate(0.8)',
                transform: hoveredTeam === member.n ? 'scale(1.07)' : 'scale(1)',
                transition: 'transform 0.8s cubic-bezier(0.22,1,0.36,1)',
                display: 'block'
              }} />
                  <div aria-hidden="true" style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(36,48,64,0.92) 0%, transparent 55%)',
                pointerEvents: 'none'
              }} />
                  <div aria-hidden="true" style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'linear-gradient(90deg, #DE322D, transparent)'
              }} />
                  {/* Number badge — top left */}
                  <div style={{
                position: 'absolute',
                top: '14px',
                left: '14px',
                background: 'rgba(222,50,45,0.2)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid rgba(222,50,45,0.3)',
                borderRadius: '100px',
                padding: '4px 12px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '10px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.9)',
                fontWeight: 600
              }}>
                    <span>{member.n < 10 ? `0${member.n}` : member.n}</span>
                  </div>
                </div>

                {/* Info area */}
                <div style={{
              padding: isMobile ? '18px 20px 20px' : '22px 26px 26px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
                  <div>
                    <h3 style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: isMobile ? '15px' : '17px',
                  fontWeight: 700,
                  letterSpacing: '-0.3px',
                  color: hoveredTeam === member.n ? '#DE322D' : '#FFFFFF',
                  margin: '0 0 5px',
                  lineHeight: 1.2,
                  transition: 'color 0.3s ease'
                }}>
                      {member.name}
                    </h3>
                    <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.5)',
                  margin: 0,
                  lineHeight: 1.55
                }}>
                      {member.role}
                    </p>
                  </div>

                  {/* Position box */}
                  <div style={{
                background: 'rgba(255,255,255,0.06)',
                borderRadius: '10px',
                padding: '10px 14px',
                border: '1px solid rgba(255,255,255,0.07)'
              }}>
                    <div style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '9px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.28)',
                  marginBottom: '4px',
                  fontWeight: 500
                }}>
                      Position
                    </div>
                    <div style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '11px',
                  color: 'rgba(255,255,255,0.6)',
                  lineHeight: 1.5,
                  fontWeight: 500
                }}>
                      {member.role}
                    </div>
                  </div>

                  {/* Bottom row */}
                  <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                    <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px'
                }}>
                      <div style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: '#DE322D'
                  }} />
                      <span style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '11px',
                    color: 'rgba(255,255,255,0.32)',
                    letterSpacing: '0.03em'
                  }}>
                        Summit 2026
                      </span>
                    </div>
                    <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                        <path d="M2 10L10 2M10 2H4M10 2V8" stroke="rgba(255,255,255,0.35)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.div>)}
          </div>
        </div>
      </motion.div>

      {/* CLOSING QUOTE ROW */}
      <div style={{
      position: 'relative',
      zIndex: 1,
      maxWidth: '1200px',
      margin: '0 auto',
      padding: hPad,
      width: '100%',
      boxSizing: 'border-box'
    }}>
        <div style={{
        marginTop: '40px',
        textAlign: 'center'
      }}>
          <motion.div initial="hidden" animate={isInView ? 'visible' : 'hidden'} variants={lineWipe} custom={0.8} style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(222,50,45,0.4), transparent)',
          marginBottom: '32px',
          width: '100%',
          originX: 0.5
        }} />
          <motion.p initial="hidden" animate={isInView ? 'visible' : 'hidden'} variants={fadeUpVariants} custom={0.9} style={{
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: 300,
          fontStyle: 'italic',
          fontSize: isMobile ? '16px' : '18px',
          color: 'rgba(255,255,255,0.4)',
          letterSpacing: '0.02em',
          margin: 0
        }}>
            &ldquo;Engineered for impact. Executed with precision.&rdquo;
          </motion.p>
          <motion.p initial="hidden" animate={isInView ? 'visible' : 'hidden'} variants={fadeUpVariants} custom={1.0} style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '11px',
          fontWeight: 600,
          textTransform: 'uppercase',
          color: '#DE322D',
          letterSpacing: '0.14em',
          marginTop: '10px',
          marginRight: 0,
          marginLeft: 0,
          marginBottom: 0
        }}>
            — EmpowaEntrepreneurs Funding Summit™ 2026
          </motion.p>
        </div>
      </div>
    </section>;
};