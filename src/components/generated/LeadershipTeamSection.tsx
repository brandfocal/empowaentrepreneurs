import React, { useState, useEffect, useRef } from 'react';
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
const staggerContainer: Variants = {
  hidden: {},
  visible: (s = 0.1) => ({
    transition: {
      staggerChildren: s
    }
  })
};
const staggerChild: Variants = {
  hidden: {
    y: 48,
    opacity: 0,
    filter: 'blur(10px)'
  },
  visible: {
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

/**
 * DATA
 */
const LEADERSHIP_TEAM = [{
  n: 1,
  name: 'Simphiwe Masiza',
  role: 'Founder & Executive Producer',
  org: 'EmpowaEntrepreneurs Funding Summit™',
  imageSrc: 'https://empowaentrepreneurs.co.za/wp-content/uploads/2025/05/simphiwe-masiza-2.jpg'
}, {
  n: 2,
  name: 'Sechaba Motsieloa',
  role: 'Managing Executive: Special Projects & Strategic Communications',
  org: null,
  imageSrc: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80'
}, {
  n: 3,
  name: 'Thulisa Bianca Sosibo',
  role: 'Managing Executive: EmpowaEntrepreneurs Funding & Ecosystem Development',
  org: null,
  imageSrc: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80'
}, {
  n: 4,
  name: 'Carshief Sissing',
  role: 'Digital, Social Media & Platform Experience Lead',
  org: 'EmpowaEntrepreneurs Funding Summit™',
  imageSrc: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80'
}, {
  n: 5,
  name: 'Thabo Molefe',
  role: 'Strategic Partnerships & Stakeholder Relations Lead',
  org: 'EmpowaEntrepreneurs Funding Summit™',
  imageSrc: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80'
}, {
  n: 6,
  name: 'Anita Tirkey',
  role: 'Executive Speaker Relations & Programme Talent Lead',
  org: 'EmpowaEntrepreneurs Funding Summit™',
  imageSrc: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80'
}, {
  n: 7,
  name: 'Neo Mathebe',
  role: 'Commercial & Brand Experience Lead',
  org: 'EmpowaEntrepreneurs Funding Summit™',
  imageSrc: 'https://images.unsplash.com/photo-1614644147798-f8c0fc9da7f6?w=400&q=80'
}, {
  n: 8,
  name: 'Bonnie Maponya',
  role: 'Chief of Staff & Integrated Programme Delivery Lead',
  org: null,
  imageSrc: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80'
}];

/**
 * COMPONENT: LEADERSHIP TEAM CARD
 */
const TeamCard = ({
  member,
  index,
  hoveredTeam,
  setHoveredTeam,
  isMobile,
  isTablet
}: any) => {
  const hovered = hoveredTeam === member.n;
  return <motion.div variants={staggerChild} onMouseEnter={() => setHoveredTeam(member.n)} onMouseLeave={() => setHoveredTeam(null)} whileHover={{
    y: -4
  }} transition={{
    duration: 0.3,
    ease: [0.22, 1, 0.36, 1]
  }} style={{
    position: 'relative',
    borderRadius: '20px',
    overflow: 'hidden',
    cursor: 'default',
    transition: 'all 0.3s ease',
    background: hovered ? 'linear-gradient(160deg, rgba(222,50,45,0.15) 0%, rgba(255,255,255,0.05) 100%)' : 'linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)',
    border: hovered ? '1px solid rgba(222,50,45,0.4)' : '1px solid rgba(255,255,255,0.12)',
    boxShadow: hovered ? '0 20px 60px rgba(0,0,0,0.35)' : 'none',
    display: 'flex',
    flexDirection: 'column'
  }}>
      {/* PHOTO AREA */}
      <div style={{
      height: '200px',
      position: 'relative',
      overflow: 'hidden'
    }}>
        <img src={member.imageSrc} alt={member.name} style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: 'center top',
        filter: 'brightness(0.88) saturate(0.85)',
        transform: hovered ? 'scale(1.07)' : 'scale(1)',
        transition: 'transform 0.6s cubic-bezier(0.22,1,0.36,1)'
      }} />
        <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(36,48,64,0.9) 0%, transparent 55%)',
        pointerEvents: 'none'
      }} />
        <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: 'linear-gradient(90deg, #DE322D, transparent)'
      }} />
        <div style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        background: 'rgba(222,50,45,0.15)',
        border: '1px solid rgba(222,50,45,0.2)',
        borderRadius: '100px',
        padding: '3px 10px',
        fontFamily: 'Inter, sans-serif',
        fontSize: '10px',
        color: '#DE322D',
        fontWeight: 600,
        letterSpacing: '0.1em'
      }}>
          {member.n < 10 ? `0${member.n}` : member.n}
        </div>
      </div>

      {/* INFO AREA */}
      <div style={{
      padding: isMobile ? '18px 20px 20px' : '20px 24px 24px',
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column'
    }}>
        <span style={{
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: 700,
        fontSize: isMobile ? '15px' : '16px',
        color: hovered ? '#DE322D' : '#FFFFFF',
        letterSpacing: '-0.3px',
        lineHeight: 1.25,
        marginBottom: '6px',
        transition: 'color 0.3s',
        display: 'block'
      }}>
          {member.name}
        </span>
        <span style={{
        fontFamily: 'Inter, sans-serif',
        fontWeight: 300,
        fontSize: isMobile ? '11px' : '12px',
        color: 'rgba(255,255,255,0.65)',
        lineHeight: 1.55,
        marginBottom: member.org ? '10px' : '0',
        display: 'block'
      }}>
          {member.role}
        </span>
        {member.org && <div style={{
        display: 'inline-block',
        background: 'rgba(255,255,255,0.1)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '100px',
        padding: '3px 10px',
        fontFamily: 'Inter, sans-serif',
        fontSize: '10px',
        color: 'rgba(255,255,255,0.55)',
        letterSpacing: '0.07em',
        textTransform: 'uppercase',
        width: 'fit-content'
      }}>
            {member.org}
          </div>}
      </div>
    </motion.div>;
};

/**
 * MAIN COMPONENT
 */
export const LeadershipTeamSection: React.FC = () => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const [hoveredTeam, setHoveredTeam] = useState<number | null>(null);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, {
    once: true,
    margin: '-60px 0px'
  });
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
      <div style={{
      position: 'absolute',
      inset: 0,
      backgroundImage: NOISE_SVG,
      backgroundRepeat: 'repeat',
      backgroundSize: '128px 128px',
      zIndex: 0,
      opacity: 0.5,
      pointerEvents: 'none'
    }} />
      <div style={{
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
      padding: isMobile ? '0 20px' : isTablet ? '0 40px' : '0 64px',
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

        {/* SECTION LABEL ROW */}
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
            EXECUTIVE DELIVERY & LEADERSHIP TEAM
          </span>
        </motion.div>

        {/* H2 HEADING */}
        <div style={{
        marginBottom: '24px'
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
        maxWidth: '640px',
        marginBottom: '56px',
        marginRight: 0,
        marginLeft: 0
      }}>
          The executive team engineering every dimension of the EmpowaEntrepreneurs Funding Summit™ — from strategy and partnerships to speaker relations and brand experience.
        </motion.p>

        {/* TEAM CARDS GRID */}
        <motion.div initial="hidden" animate={isInView ? 'visible' : 'hidden'} variants={staggerContainer} custom={0.1} style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
        gap: isMobile ? '16px' : '20px'
      }}>
          {LEADERSHIP_TEAM.map((member, idx) => <TeamCard key={member.n} member={member} index={idx} hoveredTeam={hoveredTeam} setHoveredTeam={setHoveredTeam} isMobile={isMobile} isTablet={isTablet} />)}
        </motion.div>

        {/* CLOSING QUOTE ROW */}
        <div style={{
        marginTop: '56px',
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
            "Engineered for impact. Executed with precision."
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