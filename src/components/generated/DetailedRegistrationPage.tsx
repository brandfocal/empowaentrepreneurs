import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView, useAnimationFrame, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';

// ─── Noise texture ─────────────────────────────────────────────────────────────
const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`;

// ─── Responsive hooks ──────────────────────────────────────────────────────────
const useBreakpoint = () => {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  useEffect(() => {
    const check = () => setWidth(window.innerWidth);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return {
    isMobile: width < 640,
    isTablet: width >= 640 && width < 1024,
    isDesktop: width >= 1024,
    width
  };
};

// Keep legacy hook for compatibility
const useIsMobile = () => {
  const {
    isMobile
  } = useBreakpoint();
  return isMobile;
};

// ─── SVG Helpers ───────────────────────────────────────────────────────────────
const PlusSquareIcon = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M16.25 2.5H3.75C3.41848 2.5 3.10054 2.6317 2.86612 2.86612C2.6317 3.10054 2.5 3.41848 2.5 3.75V16.25C2.5 16.5815 2.6317 16.8995 2.86612 17.1339C3.10054 17.3683 3.41848 17.5 3.75 17.5H16.25C16.5815 17.5 16.8995 17.3683 17.1339 17.1339C17.3683 16.8995 17.5 16.5815 17.5 16.25V3.75C17.5 3.41848 17.3683 3.10054 17.1339 2.86612C16.8995 2.6317 16.5815 2.5 16.25 2.5ZM13.125 10.625H10.625V13.125C10.625 13.2908 10.5592 13.4497 10.4419 13.5669C10.3247 13.6842 10.1658 13.75 10 13.75C9.83424 13.75 9.67527 13.6842 9.55806 13.5669C9.44085 13.4497 9.375 13.2908 9.375 13.125V10.625H6.875C6.70924 10.625 6.55027 10.5592 6.43306 10.4419C6.31585 10.3247 6.25 10.1658 6.25 10C6.25 9.83424 6.31585 9.67527 6.43306 9.55806C6.55027 9.44085 6.70924 9.375 6.875 9.375H9.375V6.875C9.375 6.70924 9.44085 6.55027 9.55806 6.43306C9.67527 6.31585 9.83424 6.25 10 6.25C10.1658 6.25 10.3247 6.31585 10.4419 6.43306C10.5592 6.55027 10.625 6.70924 10.625 6.875V9.375H13.125C13.2908 9.375 13.4497 9.44085 13.5669 9.55806C13.6842 9.67527 13.75 9.83424 13.75 10C13.75 10.1658 13.6842 10.3247 13.5669 10.4419C13.4497 10.5592 13.2908 10.625 13.125 10.625Z" fill="#DE322D" />
  </svg>;
const PlusSquareIconLight = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M16.25 2.5H3.75C3.41848 2.5 3.10054 2.6317 2.86612 2.86612C2.6317 3.10054 2.5 3.41848 2.5 3.75V16.25C2.5 16.5815 2.6317 16.8995 2.86612 17.1339C3.10054 17.3683 3.41848 17.5 3.75 17.5H16.25C16.5815 17.5 16.8995 17.3683 17.1339 17.1339C17.3683 16.8995 17.5 16.5815 17.5 16.25V3.75C17.5 3.41848 17.3683 3.10054 17.1339 2.86612C16.8995 2.6317 16.5815 2.5 16.25 2.5ZM13.125 10.625H10.625V13.125C10.625 13.2908 10.5592 13.4497 10.4419 13.5669C10.3247 13.6842 10.1658 13.75 10 13.75C9.83424 13.75 9.67527 13.6842 9.55806 13.5669C9.44085 13.4497 9.375 13.2908 9.375 13.125V10.625H6.875C6.70924 10.625 6.55027 10.5592 6.43306 10.4419C6.31585 10.3247 6.25 10.1658 6.25 10C6.25 9.83424 6.31585 9.67527 6.43306 9.55806C6.55027 9.44085 6.70924 9.375 6.875 9.375H9.375V6.875C9.375 6.70924 9.44085 6.55027 9.55806 6.43306C9.67527 6.31585 9.83424 6.25 10 6.25C10.1658 6.25 10.3247 6.31585 10.4419 6.43306C10.5592 6.55027 10.625 6.70924 10.625 6.875V9.375H13.125C13.2908 9.375 13.4497 9.44085 13.5669 9.55806C13.6842 9.67527 13.75 9.83424 13.75 10C13.75 10.1658 13.6842 10.3247 13.5669 10.4419C13.4497 10.5592 13.2908 10.625 13.125 10.625Z" fill="rgba(247,246,243,0.35)" />
  </svg>;
const ArrowIconDark = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 12L12 2M12 2H4M12 2V10" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
const CheckIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 7L5.5 10.5L12 3" stroke="#DE322D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
const AlertIcon = () => <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M9 1.5L16.5 15H1.5L9 1.5Z" stroke="#DE322D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 7V10" stroke="#DE322D" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="9" cy="12.5" r="0.75" fill="#DE322D" />
  </svg>;

// ─── Animation Variants ────────────────────────────────────────────────────────
const fadeUpVariants = {
  hidden: {
    opacity: 0,
    y: 36,
    filter: 'blur(8px)'
  },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.9,
      delay,
      ease: [0.22, 1, 0.36, 1] as const
    }
  })
};
const slideUpBlur = {
  hidden: {
    y: 80,
    opacity: 0,
    filter: 'blur(18px)',
    scale: 0.97
  },
  visible: (delay = 0) => ({
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
    scale: 1,
    transition: {
      duration: 1.05,
      delay,
      ease: [0.16, 1, 0.3, 1] as const
    }
  })
};
const slideFromLeft = {
  hidden: {
    x: -72,
    opacity: 0,
    filter: 'blur(12px)'
  },
  visible: (delay = 0) => ({
    x: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.9,
      delay,
      ease: [0.22, 1, 0.36, 1] as const
    }
  })
};
const slideFromRight = {
  hidden: {
    x: 72,
    opacity: 0,
    filter: 'blur(12px)'
  },
  visible: (delay = 0) => ({
    x: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.9,
      delay,
      ease: [0.22, 1, 0.36, 1] as const
    }
  })
};
const scaleReveal = {
  hidden: {
    scale: 0.88,
    opacity: 0,
    filter: 'blur(14px)'
  },
  visible: (delay = 0) => ({
    scale: 1,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 1.0,
      delay,
      ease: [0.22, 1, 0.36, 1] as const
    }
  })
};
const rotateFade = {
  hidden: {
    rotate: -12,
    opacity: 0,
    scale: 0.7
  },
  visible: (delay = 0) => ({
    rotate: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.7,
      delay,
      ease: [0.22, 1, 0.36, 1] as const
    }
  })
};
const staggerContainer = {
  hidden: {},
  visible: (staggerDelay = 0.1) => ({
    transition: {
      staggerChildren: staggerDelay
    }
  })
};
const staggerChild = {
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
      ease: [0.22, 1, 0.36, 1] as const
    }
  }
};

// ─── Scroll Progress Bar ────────────────────────────────────────────────────────
const ScrollProgressBar = () => {
  const {
    scrollYProgress
  } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001
  });
  return <motion.div aria-hidden="true" style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: 'linear-gradient(90deg, #DE322D, #ff7a70)',
    transformOrigin: '0%',
    scaleX,
    zIndex: 200
  }} />;
};

// ─── Nav Items ─────────────────────────────────────────────────────────────────
const NAV_ITEMS = [{
  id: 'home',
  label: 'Home'
}, {
  id: 'about',
  label: 'About Us'
}, {
  id: 'programme',
  label: 'Programme'
}, {
  id: 'experience',
  label: 'Experience Zones'
}, {
  id: 'apply',
  label: 'Apply to Attend'
}];

// ─── StickyNav ─────────────────────────────────────────────────────────────────
const StickyNav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const {
    isMobile,
    isTablet
  } = useBreakpoint();
  const showHamburger = isMobile || isTablet;
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 60);
      setVisible(currentY < lastScrollY.current || currentY < 80);
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, {
      passive: true
    });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const navLinkColor = scrolled ? 'rgba(20,18,16,0.55)' : 'rgba(247,246,243,0.72)';
  const navLinkHoverColor = scrolled ? '#141210' : '#F7F6F3';
  return <motion.nav initial={{
    y: -80,
    opacity: 0
  }} animate={{
    y: visible ? 0 : -90,
    opacity: visible ? 1 : 0
  }} transition={{
    duration: 0.4,
    ease: [0.22, 1, 0.36, 1]
  }} style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    boxSizing: 'border-box'
  }}>
      <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: scrolled ? isMobile ? '10px 20px' : '12px 32px' : isMobile ? '16px 20px' : '20px 32px',
      background: scrolled ? 'rgba(247,246,243,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(32px) saturate(2.5)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(32px) saturate(2.5)' : 'none',
      borderBottom: scrolled ? '0.8px solid rgba(20,18,16,0.07)' : '0.8px solid transparent',
      transition: 'padding 0.35s ease, background 0.35s ease, border-color 0.35s ease'
    }}>
        <a href="#"  style={{
        display: 'flex',
        alignItems: 'center',
        gap: '9px',
        textDecoration: 'none'
      }}>
          <motion.div whileHover={{
          scale: 1.08,
          rotate: 5
        }} style={{
          width: '30px',
          height: '30px',
          borderRadius: '9px',
          background: 'linear-gradient(135deg, #DE322D, #ff5a4f)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(222,50,45,0.4)',
          flexShrink: 0
        }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1L7.5 4.5L11 5L8.5 7.5L9 11L6 9.5L3 11L3.5 7.5L1 5L4.5 4.5L6 1Z" fill="white" />
            </svg>
          </motion.div>
          <span style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '13px',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: scrolled ? '#141210' : '#F7F6F3',
          fontWeight: 700,
          transition: 'color 0.35s ease'
        }}>
            EmpowaSummit
          </span>
        </a>

        {!showHamburger && <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '28px'
      }}>
            {NAV_ITEMS.map(item => <a key={item.id} href="#"  style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '12px',
          textDecoration: 'none',
          letterSpacing: '0.04em',
          transition: 'color 0.2s',
          color: item.id === 'apply' ? '#DE322D' : navLinkColor,
          fontWeight: item.id === 'apply' ? 600 : 400,
          whiteSpace: 'nowrap'
        }} onMouseEnter={e => {
          (e.currentTarget as HTMLAnchorElement).style.color = item.id === 'apply' ? '#ff5a4f' : navLinkHoverColor;
        }} onMouseLeave={e => {
          (e.currentTarget as HTMLAnchorElement).style.color = item.id === 'apply' ? '#DE322D' : navLinkColor;
        }}>
                {item.label}
              </a>)}
            <div style={{
          display: 'flex',
          gap: '8px'
        }}>
              <motion.a href="/partnerships"  whileHover={{
            scale: 1.04
          }} whileTap={{
            scale: 0.97
          }} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            border: scrolled ? '1px solid rgba(60,77,93,0.35)' : '1px solid rgba(247,246,243,0.25)',
            borderRadius: '44px',
            padding: '8px 16px',
            fontSize: '12px',
            letterSpacing: '0.04em',
            color: scrolled ? '#3c4d5d' : 'rgba(247,246,243,0.8)',
            textDecoration: 'none',
            fontFamily: 'Montserrat, sans-serif',
            whiteSpace: 'nowrap',
            transition: 'border-color 0.25s ease, color 0.25s ease'
          }}>
                <span>Partner With Us</span>
              </motion.a>
              <motion.a href="/summit" whileHover={{
            scale: 1.04
          }} whileTap={{
            scale: 0.97
          }} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'linear-gradient(135deg, #DE322D, #c42823)',
            borderRadius: '44px',
            padding: '8px 16px',
            fontSize: '12px',
            letterSpacing: '0.06em',
            color: '#fff',
            textDecoration: 'none',
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 600,
            boxShadow: '0 4px 16px rgba(222,50,45,0.38)',
            whiteSpace: 'nowrap',
            transition: 'box-shadow 0.3s ease'
          }}>
                <span>Register Now</span>
              </motion.a>
            </div>
          </div>}

        {showHamburger && <button onClick={() => setMobileMenuOpen(v => !v)} style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '5px'
      }}>
            {[0, 1, 2].map(i => <span key={i} style={{
          display: 'block',
          width: '22px',
          height: '1.5px',
          background: scrolled ? '#141210' : '#F7F6F3',
          borderRadius: '2px',
          transition: 'background 0.35s ease'
        }} />)}
          </button>}
      </div>

      <AnimatePresence>
        {showHamburger && mobileMenuOpen && <motion.div initial={{
        opacity: 0,
        y: -12
      }} animate={{
        opacity: 1,
        y: 0
      }} exit={{
        opacity: 0,
        y: -12
      }} transition={{
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1]
      }} style={{
        background: 'rgba(247,246,243,0.97)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '0.8px solid rgba(20,18,16,0.08)',
        padding: isMobile ? '20px 20px 24px' : '24px 32px 28px'
      }}>
            {NAV_ITEMS.map(item => <a key={item.id} href="#" onClick={e => { e.preventDefault(); setMobileMenuOpen(false); }} style={{
          display: 'block',
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '16px',
          color: item.id === 'apply' ? '#DE322D' : 'rgba(20,18,16,0.65)',
          textDecoration: 'none',
          padding: '12px 0',
          borderBottom: '0.8px solid rgba(20,18,16,0.06)',
          letterSpacing: '0.02em',
          fontWeight: item.id === 'apply' ? 600 : 400
        }}>
                {item.label}
              </a>)}
            <div style={{
          display: 'flex',
          gap: '10px',
          marginTop: '20px',
          flexWrap: 'wrap'
        }}>
              <a href="/partnerships"  style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '13px',
            border: '1px solid rgba(20,18,16,0.18)',
            borderRadius: '44px',
            padding: '10px 20px',
            color: 'rgba(20,18,16,0.65)',
            textDecoration: 'none'
          }}>Partner With Us</a>
              <a href="/summit"  style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '13px',
            background: 'linear-gradient(135deg, #DE322D, #c42823)',
            borderRadius: '44px',
            padding: '10px 20px',
            color: '#fff',
            textDecoration: 'none',
            fontWeight: 600
          }}>Register Now</a>
            </div>
          </motion.div>}
      </AnimatePresence>
    </motion.nav>;
};

// ─── Hero Section ───────────────────────────────────────────────────────────────
const APPLY_HERO_BG = 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=1800&q=80';
const HeroGridLines = () => <div aria-hidden="true" style={{
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  zIndex: 0,
  overflow: 'hidden'
}}>
    {[16, 33, 50, 66, 83].map(pct => <div key={`vl-${pct}`} style={{
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: `${pct}%`,
    width: '1px',
    background: 'rgba(247,246,243,0.025)'
  }} />)}
    {[25, 50, 75].map(pct => <div key={`hl-${pct}`} style={{
    position: 'absolute',
    left: 0,
    right: 0,
    top: `${pct}%`,
    height: '1px',
    background: 'rgba(247,246,243,0.025)'
  }} />)}
    <div style={{
    position: 'absolute',
    top: '88px',
    left: '32px',
    width: '40px',
    height: '40px',
    borderLeft: '1px solid rgba(222,50,45,0.3)',
    borderTop: '1px solid rgba(222,50,45,0.3)'
  }} />
    <div style={{
    position: 'absolute',
    bottom: '52px',
    right: '32px',
    width: '40px',
    height: '40px',
    borderRight: '1px solid rgba(222,50,45,0.3)',
    borderBottom: '1px solid rgba(222,50,45,0.3)'
  }} />
  </div>;
const ApplyHeroSection = () => {
  const heroRef = useRef<HTMLElement>(null);
  const {
    isMobile,
    isTablet
  } = useBreakpoint();
  const {
    scrollYProgress
  } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });
  const orbY = useTransform(scrollYProgress, [0, 1], ['0%', '28%']);
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '8%']);
  const hPad = isMobile ? '20px' : isTablet ? '40px' : '64px';
  const vPad = isMobile ? '36px' : isTablet ? '48px' : '60px';
  return <section ref={heroRef} style={{
    minHeight: '100vh',
    background: '#141210',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    boxSizing: 'border-box',
    overflow: 'hidden',
    position: 'relative'
  }}>
      <motion.div aria-hidden="true" style={{
      y: imgY,
      position: 'absolute',
      inset: '-10% 0',
      backgroundImage: `url(${APPLY_HERO_BG})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center top',
      backgroundRepeat: 'no-repeat',
      pointerEvents: 'none',
      zIndex: 0,
      willChange: 'transform'
    }} />
      <div aria-hidden="true" style={{
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(160deg, rgba(20,18,16,0.93) 0%, rgba(20,18,16,0.78) 40%, rgba(20,18,16,0.9) 100%)',
      pointerEvents: 'none',
      zIndex: 1
    }} />
      <div aria-hidden="true" style={{
      position: 'absolute',
      inset: 0,
      backgroundImage: NOISE_SVG,
      backgroundRepeat: 'repeat',
      backgroundSize: '128px 128px',
      pointerEvents: 'none',
      zIndex: 2,
      opacity: 0.5
    }} />
      <div style={{
      position: 'relative',
      zIndex: 3
    }}><HeroGridLines /></div>
      <motion.div aria-hidden="true" style={{
      y: orbY,
      position: 'absolute',
      top: '-10%',
      right: '-8%',
      width: 'clamp(300px, 55vw, 840px)',
      height: 'clamp(300px, 55vw, 840px)',
      borderRadius: '50%',
      background: 'radial-gradient(circle at 40% 40%, rgba(222,50,45,0.22) 0%, rgba(222,50,45,0.08) 45%, transparent 70%)',
      pointerEvents: 'none',
      zIndex: 3
    }} />
      <div aria-hidden="true" style={{
      position: 'absolute',
      bottom: '10%',
      left: '-5%',
      width: '400px',
      height: '400px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(222,50,45,0.09) 0%, transparent 65%)',
      pointerEvents: 'none',
      zIndex: 3
    }} />

      <div style={{
      height: '80px',
      flexShrink: 0,
      position: 'relative',
      zIndex: 4
    }} />

      <motion.div style={{
      y: textY,
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: `${vPad} ${hPad}`,
      width: '100%',
      boxSizing: 'border-box',
      zIndex: 4,
      position: 'relative'
    }}>
        <motion.div custom={0.05} initial="hidden" animate="visible" variants={fadeUpVariants} style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: isMobile ? '24px' : '36px',
        flexWrap: 'wrap'
      }}>
          <PlusSquareIconLight />
          <span style={{
          fontFamily: 'Montserrat, sans-serif',
          color: 'rgba(247,246,243,0.38)',
          fontSize: '11px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          fontWeight: 500
        }}>
            <span style={{
            color: '#DE322D',
            fontWeight: 600
          }}>EmpowaEntrepreneurs</span>
            <span> Funding Summit 2026 - </span>
            <span style={{
            color: '#DE322D',
            fontWeight: 600
          }}>Detailed Registration</span>
          </span>
        </motion.div>

        <h1 style={{
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: 300,
        margin: '0 0 32px',
        lineHeight: 0.93,
        letterSpacing: isMobile ? '-1.5px' : isTablet ? '-2px' : '-3px'
      }}>
          <div style={{
          overflow: 'hidden',
          display: 'block'
        }}>
            {["Detailed", "Summit"].map((word, i) => <motion.span key={`l1-${word}`} initial={{
            y: '110%',
            opacity: 0
          }} animate={{
            y: '0%',
            opacity: 1
          }} transition={{
            duration: 0.9,
            delay: 0.2 + i * 0.1,
            ease: [0.22, 1, 0.36, 1]
          }} style={{
            display: 'inline-block',
            fontSize: isMobile ? 'clamp(34px, 9vw, 52px)' : isTablet ? 'clamp(44px, 8vw, 72px)' : 'clamp(48px, 6.5vw, 100px)',
            color: '#F7F6F3',
            marginRight: '0.22em'
          }}>
                {word}
              </motion.span>)}
          </div>
          <div style={{
          overflow: 'hidden',
          display: 'block'
        }}>
            {['Registration', 'Portal'].map((word, i) => <motion.span key={`l2-${word}`} initial={{
            y: '110%',
            opacity: 0
          }} animate={{
            y: '0%',
            opacity: 1
          }} transition={{
            duration: 0.9,
            delay: 0.42 + i * 0.1,
            ease: [0.22, 1, 0.36, 1]
          }} style={{
            display: 'inline-block',
            fontSize: isMobile ? 'clamp(34px, 9vw, 52px)' : isTablet ? 'clamp(44px, 8vw, 72px)' : 'clamp(48px, 6.5vw, 100px)',
            color: 'rgba(247,246,243,0.18)',
            marginRight: '0.22em'
          }}>
                {word}
              </motion.span>)}
          </div>
        </h1>

        <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        maxWidth: isMobile ? '100%' : '540px'
      }}>
          <motion.p custom={0.65} initial="hidden" animate="visible" variants={fadeUpVariants} style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: isMobile ? '14px' : isTablet ? '15px' : 'clamp(15px, 1.3vw, 18px)',
          lineHeight: '1.78',
          color: 'rgba(247,246,243,0.72)',
          margin: 0,
          fontWeight: 300
        }}>
            Complete your detailed registration below to finalise your participation in Africa's most high-impact capital summit. Provide the required information to ensure you get the most out of your experience.
          </motion.p>

          <motion.div custom={0.75} initial="hidden" animate="visible" variants={fadeUpVariants} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flexWrap: 'wrap'
        }}>
            <motion.a href="#registration-form" onClick={(e) => {
              e.preventDefault();
              document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' });
            }} whileHover={{
            scale: 1.04,
            boxShadow: '0 16px 52px rgba(222,50,45,0.72), 0 4px 16px rgba(222,50,45,0.4)'
          }} whileTap={{
            scale: 0.97
          }} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'linear-gradient(135deg, #DE322D 0%, #c42823 100%)',
            borderRadius: '44px',
            padding: isMobile ? '13px 24px' : '16px 32px',
            fontSize: '13px',
            letterSpacing: '0.05em',
            color: '#fff',
            textDecoration: 'none',
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 600,
            boxShadow: '0 8px 36px rgba(222,50,45,0.55)',
            transition: 'box-shadow 0.3s ease'
          }}>
              <span>Start Registration</span><ArrowIconDark />
            </motion.a>
          </motion.div>
        </div>
      </motion.div>

      <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      duration: 0.6,
      delay: 1.0
    }} style={{
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      padding: isMobile ? '16px 20px' : isTablet ? '18px 40px' : '20px 64px',
      borderTop: '0.8px solid rgba(247,246,243,0.07)',
      flexWrap: 'wrap',
      gap: isMobile ? '12px 20px' : '16px',
      zIndex: 4,
      position: 'relative',
      overflowX: 'hidden'
    }}>
        {[{
        id: 'strip-1',
        label: 'May 28, 2026'
      }, {
        id: 'strip-2',
        label: 'EmpowaWorx House'
      }, {
        id: 'strip-3',
        label: '4,000+ Attendees'
      }, {
        id: 'strip-4',
        label: 'Application Pathways Open'
      }, {
        id: 'strip-5',
        label: 'Pitching Festival · Exhibition · Masterclass'
      }].map(svc => <div key={svc.id} style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: '11px',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'rgba(247,246,243,0.22)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
            <span style={{
          color: '#DE322D',
          fontSize: '13px'
        }}>+</span>
            <span>{svc.label}</span>
          </div>)}
      </motion.div>
    </section>;
};

// ─── Eligibility Section ────────────────────────────────────────────────────────
type EligibilityCard = {
  id: string;
  number: string;
  title: string;
  description: string;
  checks: string[];
};
const ELIGIBILITY_CARDS: EligibilityCard[] = [{
  id: 'elig-1',
  number: '01',
  title: 'Funding Readiness',
  description: 'Your business should be past the ideation phase and actively seeking capital to scale.',
  checks: ['Have a proven revenue model or traction', 'Seeking seed to Series B funding', 'Investment-ready financials & pitch deck', 'Registered & operational business entity']
}, {
  id: 'elig-2',
  number: '02',
  title: 'Strategic Clarity',
  description: 'Clarity of vision and market positioning is essential for serious investor engagement at EmpowaEntrepreneurs Funding Summit 2026.',
  checks: ['Defined target market & customer segment', 'Clear competitive advantage & moat', 'Scalable business model across markets', 'Articulated 3–5 year growth roadmap']
}, {
  id: 'elig-3',
  number: '03',
  title: 'Commercial Quality',
  description: 'We curate only the highest quality entrepreneur profiles to ensure the most impactful experience for all.',
  checks: ['Demonstrated commercial traction or pilot', 'Strong founding team with domain expertise', 'African market focus or expansion strategy', 'Commitment to attend all selected sessions']
}];
const EligibilitySection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, {
    once: true,
    margin: '-60px 0px'
  });
  const {
    isMobile,
    isTablet
  } = useBreakpoint();
  const hPad = isMobile ? '20px' : isTablet ? '40px' : '64px';
  const vPad = isMobile ? '72px' : isTablet ? '96px' : '128px';
  return <section ref={sectionRef} style={{
    background: '#F7F6F3',
    width: '100%',
    boxSizing: 'border-box',
    padding: `${vPad} ${hPad}`,
    overflow: 'hidden',
    position: 'relative'
  }}>
      <div aria-hidden="true" style={{
      position: 'absolute',
      inset: 0,
      backgroundImage: NOISE_SVG,
      backgroundRepeat: 'repeat',
      backgroundSize: '128px 128px',
      pointerEvents: 'none',
      opacity: 0.45
    }} />
      <div aria-hidden="true" style={{
      position: 'absolute',
      top: '-10%',
      right: '-8%',
      width: 'clamp(300px, 45vw, 700px)',
      height: 'clamp(300px, 45vw, 700px)',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(222,50,45,0.05) 0%, transparent 65%)',
      pointerEvents: 'none'
    }} />

      <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      position: 'relative',
      zIndex: 1
    }}>
        <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: isMobile ? '48px' : '72px',
        flexWrap: 'wrap',
        gap: '24px'
      }}>
          <div>
            <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={rotateFade} custom={0} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '22px'
          }}>
              <PlusSquareIcon />
              <span style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '12px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(20,18,16,0.45)',
              fontWeight: 600
            }}>Eligibility & Positioning</span>
            </motion.div>
            <div style={{
            overflow: 'hidden'
          }}>
              <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.12} style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: isMobile ? 'clamp(26px, 7vw, 40px)' : isTablet ? 'clamp(28px, 5vw, 48px)' : 'clamp(32px, 4vw, 60px)',
              fontWeight: 300,
              letterSpacing: '-2px',
              lineHeight: 1.04,
              color: '#141210',
              margin: 0
            }}>
                <span>Entrepreneur </span>
                <em style={{
                fontStyle: 'italic',
                color: '#DE322D'
              }}>Eligibility</em>
                <span style={{
                color: 'rgba(20,18,16,0.22)'
              }}> & Positioning</span>
              </motion.h2>
            </div>
          </div>
          {!isMobile && <motion.p initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideFromRight} custom={0.28} style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '15px',
          lineHeight: '1.78',
          color: 'rgba(20,18,16,0.5)',
          maxWidth: '340px',
          margin: 0
        }}>
              We carefully vet every founder and entrepreneur who attends to ensure the highest quality of conversations, connections, and capital deployment.
            </motion.p>}
        </div>

        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={staggerContainer} custom={0.1} style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
        gap: '20px'
      }}>
          {ELIGIBILITY_CARDS.map(card => <motion.div key={card.id} variants={staggerChild} style={{
          background: '#FFFFFF',
          border: '1px solid rgba(20,18,16,0.07)',
          borderRadius: '24px',
          padding: isMobile ? '28px 24px' : '44px 40px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 2px 20px rgba(20,18,16,0.04)'
        }}>
              <div aria-hidden="true" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #DE322D, transparent)',
            borderRadius: '24px 24px 0 0'
          }} />
              <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
                <div>
                  <span style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '11px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'rgba(20,18,16,0.3)',
                fontWeight: 500
              }}>{card.number}</span>
                  <h3 style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: isMobile ? '20px' : '24px',
                fontWeight: 500,
                letterSpacing: '-0.6px',
                color: '#141210',
                margin: '10px 0 0',
                lineHeight: 1.15
              }}>{card.title}</h3>
                </div>
                <div style={{
              flexShrink: 0,
              marginTop: '4px'
            }}><PlusSquareIcon /></div>
              </div>
              <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            lineHeight: '1.72',
            color: 'rgba(20,18,16,0.55)',
            margin: 0
          }}>
                {card.description}
              </p>
              <ul style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
                {card.checks.map(check => <li key={check} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px'
            }}>
                    <div style={{
                flexShrink: 0,
                marginTop: '1px'
              }}><CheckIcon /></div>
                    <span style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
                lineHeight: '1.55',
                color: 'rgba(20,18,16,0.65)',
                letterSpacing: '-0.05px'
              }}>
                      {check}
                    </span>
                  </li>)}
              </ul>
            </motion.div>)}
        </motion.div>
      </div>
    </section>;
};

// ─── Application Pathways ───────────────────────────────────────────────────────
type PathwayItem = {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  description: string;
  tag: string;
  cta: string;
  imageSrc: string;
  imageAlt: string;
  accent: string;
  restTint: string;
};
const PATHWAY_ITEMS: PathwayItem[] = [{
  id: 'path-delegate',
  index: '01',
  title: 'General Delegate',
  subtitle: 'Full Summit Access',
  description: 'Gain complete access to all summit programming - keynotes, panel discussions, networking sessions, the pitching festival audience, and the exhibition floor. Connect with 4,000+ founders, funders, DFIs, and ecosystem builders.',
  tag: 'All-Access · Networking · Ecosystem',
  cta: 'Register as Delegate',
  imageSrc: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=900&q=80',
  imageAlt: 'General delegate access at the EmpowaEntrepreneurs Summit',
  accent: '#3c4d5d',
  restTint: 'linear-gradient(to top, rgba(30,44,58,0.72) 0%, rgba(30,44,58,0.18) 55%, transparent 100%)'
}, {
  id: 'path-pitch',
  index: '02',
  title: 'Pitching Festival',
  subtitle: 'Entrepreneurs Only',
  description: 'Apply to pitch your business directly to a curated panel of institutional investors, VCs, and DFIs in a structured, high-stakes pitching environment. Selected founders receive premium exposure and dedicated investor matchmaking.',
  tag: 'Pitch · Capital · Investors',
  cta: 'Apply for the Pitching Festival',
  imageSrc: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=900&q=80',
  imageAlt: 'Pitching festival at the EmpowaEntrepreneurs Funding Summit',
  accent: '#DE322D',
  restTint: 'linear-gradient(to top, rgba(180,30,26,0.72) 0%, rgba(180,30,26,0.18) 55%, transparent 100%)'
}, {
  id: 'path-exhibition',
  index: '03',
  title: 'Exhibition Booking',
  subtitle: 'Showcase Your Brand',
  description: 'Secure your branded exhibition space on EmpowaEntrepreneurs Funding Summit 2026 floor. Showcase your product, technology, or service to thousands of qualified attendees, investors, and corporate procurement leaders across two days.',
  tag: 'Exhibition · Brand · Showcase',
  cta: 'Book Exhibition Space',
  imageSrc: 'https://images.unsplash.com/photo-1560439514-4e9645039924?w=900&q=80',
  imageAlt: 'Exhibition showcase floor at EmpowaWorx House summit',
  accent: '#6B5E4A',
  restTint: 'linear-gradient(to top, rgba(80,66,48,0.72) 0%, rgba(80,66,48,0.18) 55%, transparent 100%)'
}, {
  id: 'path-masterclass',
  index: '04',
  title: 'Masterclass Enrollment',
  subtitle: 'Deep-Skill Sessions',
  description: 'Enroll in intensive masterclasses led by Africa\'s most experienced founders, investors, and enterprise strategists. Topics span fundraising strategy, scaling across markets, ESG for African enterprises, and procurement readiness.',
  tag: 'Learning · Skills · Strategy',
  cta: 'Enroll in Masterclass',
  imageSrc: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900&q=80',
  imageAlt: 'Masterclass enrollment at the EmpowaEntrepreneurs Summit 2026',
  accent: '#2D6A4F',
  restTint: 'linear-gradient(to top, rgba(28,80,56,0.72) 0%, rgba(28,80,56,0.18) 55%, transparent 100%)'
}];
const PathwaysSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, {
    once: true,
    margin: '-60px 0px'
  });
  const [activeId, setActiveId] = useState<string>('path-pitch');
  const {
    isMobile,
    isTablet
  } = useBreakpoint();
  const hPad = isMobile ? '20px' : isTablet ? '40px' : '64px';

  // On mobile/tablet cards stack vertically, on desktop they're horizontal panels
  const gridCols = isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)';
  return <section ref={sectionRef} style={{
    background: '#0f1c28',
    paddingTop: isMobile ? '80px' : isTablet ? '112px' : '160px',
    paddingBottom: 0,
    width: '100%',
    boxSizing: 'border-box',
    overflow: 'hidden',
    position: 'relative'
  }}>
      <div aria-hidden="true" style={{
      position: 'absolute',
      inset: 0,
      backgroundImage: NOISE_SVG,
      backgroundRepeat: 'repeat',
      backgroundSize: '128px 128px',
      pointerEvents: 'none',
      zIndex: 0,
      opacity: 0.55
    }} />
      <div aria-hidden="true" style={{
      position: 'absolute',
      top: '5%',
      right: '-10%',
      width: 'clamp(300px, 55vw, 800px)',
      height: 'clamp(300px, 55vw, 800px)',
      borderRadius: '50%',
      background: 'radial-gradient(circle at 40% 40%, rgba(222,50,45,0.09) 0%, transparent 70%)',
      pointerEvents: 'none',
      zIndex: 0
    }} />

      <div style={{
      padding: `0 ${hPad} ${isMobile ? '48px' : '80px'}`,
      maxWidth: '1200px',
      margin: '0 auto',
      boxSizing: 'border-box',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      flexWrap: 'wrap',
      gap: '24px',
      position: 'relative',
      zIndex: 1
    }}>
        <div>
          <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={rotateFade} custom={0} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '20px'
        }}>
            <PlusSquareIconLight />
            <span style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '12px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(247,246,243,0.35)',
            fontWeight: 600
          }}>Application Pathways</span>
          </motion.div>
          <div style={{
          overflow: 'hidden'
        }}>
            <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.1} style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: isMobile ? 'clamp(28px, 8vw, 44px)' : isTablet ? 'clamp(36px, 6vw, 56px)' : 'clamp(44px, 5.5vw, 80px)',
            fontWeight: 200,
            letterSpacing: isMobile ? '-1.5px' : '-2.5px',
            lineHeight: 0.96,
            color: '#F7F6F3',
            margin: 0
          }}>
              <span>{'Choose your '}</span>
              <em style={{
              fontStyle: 'italic',
              color: '#DE322D'
            }}>{'pathway'}</em>
              <span style={{
              color: 'rgba(247,246,243,0.18)'
            }}>{' in.'}</span>
            </motion.h2>
          </div>
        </div>
        {!isMobile && <motion.p initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideFromRight} custom={0.32} style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: '15px',
        color: 'rgba(247,246,243,0.3)',
        maxWidth: '320px',
        lineHeight: '1.75',
        margin: 0
      }}>
            Four distinct application pathways to ensure you attend in the most impactful way for your goals.
          </motion.p>}
      </div>

      <div style={{
      display: 'grid',
      gridTemplateColumns: gridCols,
      width: '100%',
      minHeight: isMobile ? 'auto' : isTablet ? 'auto' : '660px',
      position: 'relative',
      zIndex: 1
    }}>
        {PATHWAY_ITEMS.map((item, i) => {
        const isOpen = activeId === item.id;
        return <motion.div key={item.id} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={scaleReveal} custom={i * 0.1} onMouseEnter={() => !isMobile && !isTablet && setActiveId(item.id)}  style={{
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer',
          borderRight: !isMobile && !isTablet && i < PATHWAY_ITEMS.length - 1 ? '1px solid rgba(247,246,243,0.06)' : 'none',
          borderTop: isMobile || isTablet ? '1px solid rgba(247,246,243,0.06)' : 'none',
          borderBottom: isTablet && i < 2 ? '1px solid rgba(247,246,243,0.06)' : 'none',
          minHeight: isMobile ? '300px' : isTablet ? '400px' : 'auto',
          transition: 'flex 0.6s cubic-bezier(0.22,1,0.36,1)'
        }}>
              <img src={item.imageSrc} alt={item.imageAlt} style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            filter: isOpen ? 'brightness(0.45) saturate(0.7)' : 'brightness(0.38) saturate(0.65)',
            transition: 'filter 0.7s cubic-bezier(0.22,1,0.36,1)',
            transform: isOpen ? 'scale(1.04)' : 'scale(1)',
            transformOrigin: 'center'
          }} />
              <div aria-hidden="true" style={{
            position: 'absolute',
            inset: 0,
            background: item.restTint,
            opacity: isOpen ? 0 : 1,
            transition: 'opacity 0.65s cubic-bezier(0.22,1,0.36,1)',
            pointerEvents: 'none'
          }} />
              <div style={{
            position: 'absolute',
            inset: 0,
            background: isOpen ? 'linear-gradient(to top, rgba(10,9,8,0.95) 0%, rgba(10,9,8,0.4) 55%, transparent 100%)' : 'linear-gradient(to top, rgba(10,9,8,0.52) 0%, rgba(10,9,8,0.12) 100%)',
            transition: 'background 0.6s ease',
            pointerEvents: 'none'
          }} />
              <div aria-hidden="true" style={{
            position: 'absolute',
            bottom: '-20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${item.accent}55 0%, transparent 70%)`,
            pointerEvents: 'none',
            opacity: isOpen ? 1 : 0.55,
            transition: 'opacity 0.6s ease'
          }} />
              <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: isMobile ? '24px 20px' : '40px 32px'
          }}>
                <div style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '11px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: isOpen ? 'rgba(247,246,243,0.5)' : `${item.accent}cc`,
              fontWeight: 500,
              marginBottom: '12px',
              transition: 'color 0.4s ease'
            }}>{item.index}</div>
                <h3 style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: isMobile ? 'clamp(18px, 5vw, 26px)' : isTablet ? '22px' : 'clamp(20px, 1.8vw, 30px)',
              fontWeight: isOpen ? 400 : 300,
              letterSpacing: '-0.5px',
              color: isOpen ? '#F7F6F3' : 'rgba(247,246,243,0.82)',
              margin: '0 0 4px',
              lineHeight: 1.15,
              transition: 'color 0.4s ease, font-weight 0.4s ease'
            }}>{item.title}</h3>
                <div style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: isOpen ? item.accent === '#DE322D' ? '#ff7a70' : 'rgba(247,246,243,0.4)' : `${item.accent}99`,
              marginBottom: '0',
              transition: 'color 0.4s ease'
            }}>{item.subtitle}</div>

                <AnimatePresence initial={false}>
                  {isOpen && <motion.div key={`path-${item.id}`} initial={{
                height: 0,
                opacity: 0
              }} animate={{
                height: 'auto',
                opacity: 1
              }} exit={{
                height: 0,
                opacity: 0
              }} transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1]
              }} style={{
                overflow: 'hidden'
              }}>
                      <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  lineHeight: '1.72',
                  color: 'rgba(247,246,243,0.55)',
                  margin: '16px 0 14px',
                  fontWeight: 300
                }}>{item.description}</p>
                      <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '6px',
                  marginBottom: '18px'
                }}>
                        {item.tag.split(' · ').map(t => <span key={t} style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '10px',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'rgba(247,246,243,0.4)',
                    border: '1px solid rgba(247,246,243,0.15)',
                    borderRadius: '100px',
                    padding: '4px 12px'
                  }}>{t}</span>)}
                      </div>
                      <motion.a href="/partnerships"  whileHover={{
                  scale: 1.04
                }} whileTap={{
                  scale: 0.97
                }} style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: item.id === 'path-pitch' ? 'linear-gradient(135deg, #DE322D, #c42823)' : 'rgba(247,246,243,0.1)',
                  border: item.id === 'path-pitch' ? 'none' : '1px solid rgba(247,246,243,0.2)',
                  borderRadius: '44px',
                  padding: '11px 22px',
                  fontSize: '12px',
                  letterSpacing: '0.06em',
                  color: '#fff',
                  textDecoration: 'none',
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 600,
                  boxShadow: item.id === 'path-pitch' ? '0 6px 24px rgba(222,50,45,0.4)' : 'none',
                  backdropFilter: 'blur(8px)'
                }}>
                        <span>{item.cta}</span><ArrowIconDark />
                      </motion.a>
                    </motion.div>}
                </AnimatePresence>

                <div style={{
              height: '2px',
              background: `linear-gradient(90deg, ${item.accent}, transparent)`,
              marginTop: '20px',
              opacity: isOpen ? 1 : 0,
              transition: 'opacity 0.4s ease',
              borderRadius: '2px'
            }} />
              </div>
            </motion.div>;
      })}
      </div>
    </section>;
};

// ─── Important Notice ───────────────────────────────────────────────────────────
const NOTICE_ITEMS = [{
  id: 'n-1',
  label: "Dragons' Den Criteria Applied",
  desc: 'Panelists may question, challenge, and decline - just like the show.'
}, {
  id: 'n-2',
  label: 'Early Application Advantage',
  desc: 'Earlier applicants have higher selection probability for premium slots.'
}, {
  id: 'n-3',
  label: 'Documentation Required',
  desc: 'A valid pitch deck, financials summary, and business profile are required.'
}, {
  id: 'n-4',
  label: 'Investor-Ready Businesses Only',
  desc: 'Pre-revenue or concept-stage ventures are not eligible for the pitching track.'
}];
const ImportantNotice = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, {
    once: true,
    margin: '-60px 0px'
  });
  const {
    isMobile,
    isTablet
  } = useBreakpoint();
  const hPad = isMobile ? '20px' : isTablet ? '40px' : '64px';
  const vPad = isMobile ? '72px' : '128px';
  return <section ref={sectionRef} style={{
    background: '#141210',
    paddingTop: vPad,
    paddingBottom: vPad,
    width: '100%',
    boxSizing: 'border-box',
    overflow: 'hidden',
    position: 'relative'
  }}>
      <div aria-hidden="true" style={{
      position: 'absolute',
      inset: 0,
      backgroundImage: NOISE_SVG,
      backgroundRepeat: 'repeat',
      backgroundSize: '128px 128px',
      pointerEvents: 'none',
      zIndex: 0,
      opacity: 0.5
    }} />
      <div aria-hidden="true" style={{
      position: 'absolute',
      bottom: '-15%',
      right: '-8%',
      width: 'clamp(300px, 50vw, 750px)',
      height: 'clamp(300px, 50vw, 750px)',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(222,50,45,0.07) 0%, transparent 65%)',
      pointerEvents: 'none',
      zIndex: 0
    }} />

      <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: `0 ${hPad}`,
      position: 'relative',
      zIndex: 1
    }}>
        <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile || isTablet ? '1fr' : '1fr 1fr',
        gap: isMobile ? '40px' : isTablet ? '48px' : '80px',
        alignItems: 'center'
      }}>
          <div>
            <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={rotateFade} custom={0} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '22px'
          }}>
              <PlusSquareIconLight />
              <span style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '12px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(247,246,243,0.35)',
              fontWeight: 600
            }}>Important Notice</span>
            </motion.div>
            <div style={{
            overflow: 'hidden'
          }}>
              <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.12} style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: isMobile ? 'clamp(26px, 7vw, 40px)' : isTablet ? 'clamp(28px, 5vw, 48px)' : 'clamp(30px, 4vw, 56px)',
              fontWeight: 300,
              letterSpacing: '-1.8px',
              lineHeight: 1.05,
              color: '#F7F6F3',
              margin: '0 0 24px'
            }}>
                <span>Pitching Festival </span>
                <em style={{
                fontStyle: 'italic',
                color: '#DE322D'
              }}>criteria</em>
                <span style={{
                color: 'rgba(247,246,243,0.2)'
              }}> & slots.</span>
              </motion.h2>
            </div>
            <motion.p initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUpVariants} custom={0.28} style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: isMobile ? '15px' : '17px',
            lineHeight: '1.78',
            color: 'rgba(247,246,243,0.5)',
            margin: 0
          }}>
              The Pitching Festival is a curated, high-stakes environment. It is not an open mic. Every entrepreneur who enters the pitching arena has been vetted for business quality, pitch readiness, and strategic fit with the investors attending.
            </motion.p>
          </div>

          <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={isMobile || isTablet ? fadeUpVariants : slideFromRight} custom={0.22}>
            <div style={{
            background: 'rgba(222,50,45,0.06)',
            border: '1px solid rgba(222,50,45,0.22)',
            borderRadius: '20px',
            padding: isMobile ? '28px 24px' : '40px 36px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            position: 'relative',
            overflow: 'hidden'
          }}>
              <div aria-hidden="true" style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, #DE322D, rgba(222,50,45,0.3), transparent)',
              borderRadius: '20px 20px 0 0'
            }} />
              <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '14px'
            }}>
                <div style={{
                flexShrink: 0,
                marginTop: '2px'
              }}><AlertIcon /></div>
                <div>
                  <div style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '15px',
                  fontWeight: 600,
                  letterSpacing: '-0.2px',
                  color: '#F7F6F3',
                  marginBottom: '8px'
                }}>Pitching Slots Are Strictly Limited</div>
                  <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  lineHeight: '1.7',
                  color: 'rgba(247,246,243,0.5)',
                  margin: 0
                }}>
                    Only a limited number of pitching slots are available per session. Applications are reviewed on a rolling basis and the panel reserves the right to apply Dragons' Den-style criteria - meaning not all applicants will be accepted.
                  </p>
                </div>
              </div>
              <div style={{
              height: '1px',
              background: 'rgba(247,246,243,0.08)'
            }} />
              <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}>
                {NOTICE_ITEMS.map(item => <div key={item.id} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}>
                    <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#DE322D',
                  flexShrink: 0,
                  marginTop: '6px'
                }} />
                    <div>
                      <div style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'rgba(247,246,243,0.75)',
                    letterSpacing: '-0.05px',
                    marginBottom: '2px'
                  }}>{item.label}</div>
                      <div style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                    color: 'rgba(247,246,243,0.35)',
                    lineHeight: '1.55'
                  }}>
                        {item.desc}
                      </div>
                    </div>
                  </div>)}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>;
};

// ─── Final CTA Hub ──────────────────────────────────────────────────────────────
const CTA_BUTTONS = [{
  id: 'cta-1',
  label: 'Register Now',
  primary: true,
  icon: true
}, {
  id: 'cta-2',
  label: 'Apply for the Pitching Festival',
  primary: false,
  icon: true
}, {
  id: 'cta-3',
  label: 'Reserve Your Power Seat',
  primary: false,
  icon: true
}];
const DIFF_STATS = [{
  id: 'diff-1',
  stat: '4,000+',
  label: 'Summit Attendees',
  sub: 'Founders, Funders, DFIs, Corporates'
}, {
  id: 'diff-2',
  stat: '120+',
  label: 'Verified Investors',
  sub: 'VCs, Angels, Institutional Funds'
}, {
  id: 'diff-3',
  stat: '48h',
  label: 'Programming Hours',
  sub: 'Keynotes, Pitches, Roundtables, Classes'
}, {
  id: 'diff-4',
  stat: '30+',
  label: 'African Markets',
  sub: 'Continental scale and reach'
}];
const FinalCtaSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, {
    once: true,
    margin: '-60px 0px'
  });
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, {
    stiffness: 160,
    damping: 28
  });
  const springY = useSpring(mouseY, {
    stiffness: 160,
    damping: 28
  });
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }, [mouseX, mouseY]);
  const {
    isMobile,
    isTablet
  } = useBreakpoint();
  const hPad = isMobile ? '20px' : isTablet ? '40px' : '64px';
  return <section ref={sectionRef} onMouseMove={handleMouseMove} style={{
    background: '#0f1c28',
    paddingTop: isMobile ? '96px' : isTablet ? '120px' : '160px',
    paddingBottom: isMobile ? '96px' : isTablet ? '120px' : '160px',
    width: '100%',
    boxSizing: 'border-box',
    overflow: 'hidden',
    position: 'relative'
  }}>
      <motion.div aria-hidden="true" style={{
      left: springX,
      top: springY,
      x: '-50%',
      y: '-50%',
      position: 'absolute',
      width: '700px',
      height: '700px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(222,50,45,0.15) 0%, transparent 65%)',
      pointerEvents: 'none',
      zIndex: 0
    }} />
      <div aria-hidden="true" style={{
      position: 'absolute',
      inset: 0,
      backgroundImage: NOISE_SVG,
      backgroundRepeat: 'repeat',
      backgroundSize: '128px 128px',
      pointerEvents: 'none',
      zIndex: 0,
      opacity: 0.55
    }} />
      <div aria-hidden="true" style={{
      position: 'absolute',
      bottom: '-4%',
      left: '-2%',
      fontFamily: 'Montserrat, sans-serif',
      fontSize: 'clamp(40px, 10vw, 200px)',
      fontWeight: 800,
      letterSpacing: '-8px',
      lineHeight: 1,
      color: 'rgba(247,246,243,0.016)',
      pointerEvents: 'none',
      userSelect: 'none',
      whiteSpace: 'nowrap',
      zIndex: 0
    }}>APPLY TO ATTEND</div>

      <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: `0 ${hPad}`,
      position: 'relative',
      zIndex: 1
    }}>
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={rotateFade} custom={0} style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: isMobile ? '36px' : '52px'
      }}>
          <PlusSquareIconLight />
          <span style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '12px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'rgba(247,246,243,0.35)',
          fontWeight: 600
        }}>Secure Your Place</span>
        </motion.div>

        <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile || isTablet ? '1fr' : '1fr 1fr',
        gap: isMobile ? '40px' : isTablet ? '48px' : '80px',
        alignItems: 'center'
      }}>
          <div>
            <div style={{
            overflow: 'hidden'
          }}>
              <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.1} style={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 200,
              fontSize: isMobile ? 'clamp(36px, 10vw, 60px)' : isTablet ? 'clamp(40px, 8vw, 72px)' : 'clamp(44px, 6vw, 96px)',
              lineHeight: 0.92,
              letterSpacing: isMobile ? '-2px' : '-3.5px',
              color: '#F7F6F3',
              margin: '0 0 28px'
            }}>
                <span>{'Your seat at'}</span><br />
                <em style={{
                fontStyle: 'italic',
                color: '#DE322D'
              }}>Africa's table</em><br />
                <span style={{
                color: 'rgba(247,246,243,0.16)'
              }}>{'awaits.'}</span>
              </motion.h2>
            </div>
            <motion.p initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUpVariants} custom={0.28} style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: isMobile ? '15px' : '17px',
            lineHeight: '1.78',
            color: 'rgba(247,246,243,0.5)',
            margin: '0 0 36px'
          }}>
              Every serious African entrepreneur needs to be in this room. Capital, partnership, procurement, and continental growth - it all starts here. Registration is open, but space is limited.
            </motion.p>

            <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={staggerContainer} custom={0.12} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
              {CTA_BUTTONS.map(btn => <motion.a key={btn.id} href="#"  variants={staggerChild} whileHover={{
              scale: 1.02,
              x: 4
            }} whileTap={{
              scale: 0.98
            }} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              padding: isMobile ? '15px 20px' : '18px 28px',
              borderRadius: '14px',
              textDecoration: 'none',
              fontFamily: 'Montserrat, sans-serif',
              fontSize: isMobile ? '13px' : '14px',
              fontWeight: 600,
              letterSpacing: '0.02em',
              background: btn.primary ? 'linear-gradient(135deg, #DE322D 0%, #c42823 100%)' : 'rgba(247,246,243,0.05)',
              border: btn.primary ? 'none' : '1px solid rgba(247,246,243,0.12)',
              color: btn.primary ? '#fff' : 'rgba(247,246,243,0.78)',
              boxShadow: btn.primary ? '0 8px 36px rgba(222,50,45,0.45)' : 'none',
              transition: 'background 0.3s ease, border-color 0.3s ease, color 0.3s ease'
            }} onMouseEnter={e => {
              if (!btn.primary) {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = 'rgba(247,246,243,0.1)';
                el.style.borderColor = 'rgba(247,246,243,0.25)';
                el.style.color = '#F7F6F3';
              }
            }} onMouseLeave={e => {
              if (!btn.primary) {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = 'rgba(247,246,243,0.05)';
                el.style.borderColor = 'rgba(247,246,243,0.12)';
                el.style.color = 'rgba(247,246,243,0.78)';
              }
            }}>
                  <span>{btn.label}</span>
                  <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: btn.primary ? 'rgba(255,255,255,0.18)' : 'rgba(247,246,243,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}><ArrowIconDark /></div>
                </motion.a>)}
            </motion.div>
          </div>

          <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={isMobile || isTablet ? fadeUpVariants : slideFromRight} custom={0.3}>
            <div style={{
            background: 'rgba(247,246,243,0.03)',
            border: '1px solid rgba(247,246,243,0.08)',
            borderRadius: '28px',
            padding: isMobile ? '28px 20px' : '52px 44px',
            display: 'flex',
            flexDirection: 'column',
            gap: '32px',
            position: 'relative',
            overflow: 'hidden'
          }}>
              <div aria-hidden="true" style={{
              position: 'absolute',
              top: 0,
              left: '20%',
              right: '20%',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(247,246,243,0.12), transparent)'
            }} />
              <div>
                <div style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: isMobile ? '17px' : '22px',
                fontWeight: 500,
                letterSpacing: '-0.5px',
                color: '#F7F6F3',
                marginBottom: '8px'
              }}>Why this summit is different</div>
                <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                lineHeight: '1.72',
                color: 'rgba(247,246,243,0.4)',
                margin: 0
              }}>
                  This is not a networking cocktail. Every session, every matchmaking, every pitch slot is engineered for one outcome - capital and commercial growth for Africa's next enterprise generation.
                </p>
              </div>
              <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0'
            }}>
                {DIFF_STATS.map((item, i) => <div key={item.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                padding: '16px 0',
                borderBottom: i < 3 ? '1px solid rgba(247,246,243,0.07)' : 'none'
              }}>
                    <div style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: isMobile ? '20px' : '28px',
                  fontWeight: 200,
                  letterSpacing: '-1.5px',
                  color: '#F7F6F3',
                  minWidth: isMobile ? '64px' : '88px',
                  flexShrink: 0
                }}>{item.stat}</div>
                    <div>
                      <div style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: 'rgba(247,246,243,0.7)',
                    letterSpacing: '-0.1px',
                    marginBottom: '2px'
                  }}>{item.label}</div>
                      <div style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '11px',
                    color: 'rgba(247,246,243,0.3)',
                    letterSpacing: '0.01em'
                  }}>{item.sub}</div>
                    </div>
                  </div>)}
              </div>
              <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(34,197,94,0.07)',
              border: '1px solid rgba(34,197,94,0.18)',
              borderRadius: '8px',
              padding: '10px 16px',
              width: 'fit-content'
            }}>
                <motion.div animate={{
                opacity: [1, 0.3, 1]
              }} transition={{
                duration: 2,
                repeat: Infinity
              }} style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#22c55e',
                boxShadow: '0 0 8px rgba(34,197,94,0.5)',
                flexShrink: 0
              }} />
                <span style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '11px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(247,246,243,0.45)',
                fontWeight: 600
              }}>Registration Open · May 28, 2026</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>;
};

// ─── Location Footer Band ───────────────────────────────────────────────────────
const LOCATION_DETAILS = [{
  id: 'loc-1',
  label: 'Venue',
  value: 'EmpowaWorx House'
}, {
  id: 'loc-2',
  label: 'Summit Date',
  value: 'May 28, 2026'
}, {
  id: 'loc-3',
  label: 'City',
  value: 'Johannesburg, South Africa'
}, {
  id: 'loc-4',
  label: 'Status',
  value: 'Applications Open'
}];
const LocationFooterBand = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, {
    once: true,
    margin: '-60px 0px'
  });
  const {
    isMobile,
    isTablet
  } = useBreakpoint();
  const hPad = isMobile ? '20px' : isTablet ? '40px' : '64px';
  const vPad = isMobile ? '64px' : isTablet ? '80px' : '96px';
  return <section ref={sectionRef} style={{
    background: '#F7F6F3',
    width: '100%',
    boxSizing: 'border-box',
    padding: `${vPad} ${hPad}`,
    overflow: 'hidden',
    position: 'relative',
    borderTop: '1px solid rgba(20,18,16,0.07)'
  }}>
      <div aria-hidden="true" style={{
      position: 'absolute',
      inset: 0,
      backgroundImage: NOISE_SVG,
      backgroundRepeat: 'repeat',
      backgroundSize: '128px 128px',
      pointerEvents: 'none',
      opacity: 0.4
    }} />
      <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      position: 'relative',
      zIndex: 1
    }}>
        <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile || isTablet ? '1fr' : '1fr 1fr',
        gap: isMobile ? '48px' : isTablet ? '52px' : '80px',
        alignItems: 'center'
      }}>
          <div>
            <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={rotateFade} custom={0} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '22px'
          }}>
              <PlusSquareIcon />
              <span style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '12px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(20,18,16,0.45)',
              fontWeight: 600
            }}>Location & Venue</span>
            </motion.div>
            <div style={{
            overflow: 'hidden'
          }}>
              <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.1} style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: isMobile ? 'clamp(22px, 6vw, 36px)' : isTablet ? 'clamp(26px, 5vw, 44px)' : 'clamp(30px, 3.5vw, 52px)',
              fontWeight: 300,
              letterSpacing: '-1.8px',
              lineHeight: 1.05,
              color: '#141210',
              margin: '0 0 20px'
            }}>
                <span>EmpowaWorx House - </span>
                <em style={{
                fontStyle: 'italic',
                color: '#DE322D'
              }}>The Centre</em>
                <span style={{
                color: 'rgba(20,18,16,0.2)'
              }}>{' of the Movement.'}</span>
              </motion.h2>
            </div>
            <motion.p initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUpVariants} custom={0.25} style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: isMobile ? '14px' : '16px',
            lineHeight: '1.78',
            color: 'rgba(20,18,16,0.55)',
            margin: '0 0 28px'
          }}>
              EmpowaWorx House is Africa's purpose-built hub for entrepreneurship and enterprise growth. Home to the EmpowaEntrepreneurs Funding Summit 2026, it is the continent's most prestigious address for capital, innovation, and transformative business connections.
            </motion.p>
            <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideFromLeft} custom={0.35} style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '14px',
            padding: '18px 20px',
            background: '#FFFFFF',
            border: '1px solid rgba(20,18,16,0.08)',
            borderRadius: '14px',
            width: 'fit-content',
            maxWidth: '100%'
          }}>
              <div style={{
              flexShrink: 0,
              marginTop: '3px'
            }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 1.5C6.51472 1.5 4.5 3.51472 4.5 6C4.5 9.75 9 16.5 9 16.5C9 16.5 13.5 9.75 13.5 6C13.5 3.51472 11.4853 1.5 9 1.5Z" stroke="#DE322D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="9" cy="6" r="1.5" stroke="#DE322D" strokeWidth="1.5" />
                </svg>
              </div>
              <div>
                <div style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '14px',
                fontWeight: 600,
                color: '#141210',
                letterSpacing: '-0.1px',
                marginBottom: '4px'
              }}>EmpowaWorx House</div>
                <div style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
                color: 'rgba(20,18,16,0.5)',
                lineHeight: '1.6'
              }}>
                  <span>Johannesburg, South Africa</span><br />
                  <span>Summit Date: May 28, 2026</span>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={isMobile || isTablet ? fadeUpVariants : slideFromRight} custom={0.22}>
            <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
            marginBottom: '24px'
          }}>
              {LOCATION_DETAILS.map(d => <div key={d.id} style={{
              background: '#FFFFFF',
              border: '1px solid rgba(20,18,16,0.07)',
              borderRadius: '14px',
              padding: '18px 20px',
              boxShadow: '0 2px 12px rgba(20,18,16,0.04)'
            }}>
                  <div style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '9px',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'rgba(20,18,16,0.3)',
                fontWeight: 500,
                marginBottom: '8px'
              }}>{d.label}</div>
                  <div style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: isMobile ? '12px' : '14px',
                fontWeight: 600,
                color: '#141210',
                letterSpacing: '-0.2px'
              }}>{d.value}</div>
                </div>)}
            </div>
            <div style={{
            background: 'linear-gradient(135deg, #141210 0%, #1e2c3a 100%)',
            borderRadius: '20px',
            padding: isMobile ? '24px 20px' : '32px 28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            position: 'relative',
            overflow: 'hidden'
          }}>
              <div aria-hidden="true" style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: NOISE_SVG,
              backgroundRepeat: 'repeat',
              backgroundSize: '128px 128px',
              pointerEvents: 'none',
              opacity: 0.5
            }} />
              <div aria-hidden="true" style={{
              position: 'absolute',
              top: '-30%',
              right: '-10%',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(222,50,45,0.15) 0%, transparent 65%)',
              pointerEvents: 'none'
            }} />
              <div style={{
              position: 'relative',
              zIndex: 1
            }}>
                <div style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '12px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'rgba(247,246,243,0.35)',
                fontWeight: 600,
                marginBottom: '12px'
              }}>Brand Positioning</div>
                <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: isMobile ? '14px' : '16px',
                lineHeight: '1.7',
                color: 'rgba(247,246,243,0.72)',
                margin: 0,
                fontStyle: 'italic',
                fontWeight: 300
              }}>
                  "Where Africa's next generation of scalable businesses meets serious capital, strategic opportunity, and transformative growth."
                </p>
                <div style={{
                marginTop: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                  <div style={{
                  width: '28px',
                  height: '2px',
                  background: '#DE322D',
                  borderRadius: '2px'
                }} />
                  <span style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '11px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(247,246,243,0.35)',
                  fontWeight: 600
                }}>EmpowaEntrepreneurs · 2026</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>;
};

// ─── Ticker ─────────────────────────────────────────────────────────────────────
const TICKER_ITEMS = [{
  id: 'tk-1',
  label: '4,000+ Attendees'
}, {
  id: 'tk-2',
  label: 'High-Impact Capital'
}, {
  id: 'tk-3',
  label: 'EmpowaWorx House · 2026'
}, {
  id: 'tk-4',
  label: 'Founders · Funders · DFIs · VCs'
}, {
  id: 'tk-5',
  label: "Africa's Premier Funding Platform"
}, {
  id: 'tk-6',
  label: 'Catalytic Capital · Enterprise Growth'
}];
const HeroTicker = ({
  light = false
}: {
  light?: boolean;
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const xRef = useRef(0);
  const [trackWidth, setTrackWidth] = useState(0);
  useEffect(() => {
    if (trackRef.current) {
      const row = trackRef.current.querySelector('.ticker-row') as HTMLElement | null;
      if (row) setTrackWidth(row.scrollWidth);
    }
  }, []);
  useAnimationFrame((_, delta) => {
    if (trackWidth === 0) return;
    xRef.current -= delta / 1000 * 38;
    if (Math.abs(xRef.current) >= trackWidth) xRef.current = 0;
    if (trackRef.current) trackRef.current.style.transform = `translateX(${xRef.current}px)`;
  });
  return <div style={{
    overflow: 'hidden',
    width: '100%'
  }}>
      <div ref={trackRef} style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0',
      willChange: 'transform'
    }}>
        {[0, 1, 2].map(r => <div key={r} className="ticker-row" style={{
        display: 'flex',
        alignItems: 'center',
        flexShrink: 0
      }}>
            {TICKER_ITEMS.map(item => <div key={item.id} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '0 28px',
          borderRight: `0.8px solid ${light ? 'rgba(247,246,243,0.1)' : 'rgba(20,18,16,0.1)'}`,
          height: '52px',
          whiteSpace: 'nowrap'
        }}>
                <span style={{
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: '#DE322D',
            flexShrink: 0,
            display: 'block'
          }} />
                <span style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '11px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: light ? 'rgba(247,246,243,0.35)' : 'rgba(20,18,16,0.4)',
            fontWeight: 500
          }}>{item.label}</span>
              </div>)}
          </div>)}
      </div>
    </div>;
};

// ─── Site Footer ───────────────────────────────────────────────────────────────
const FOOTER_NAV_COLS = [{
  id: 'fcol-summit',
  heading: 'Summit',
  links: [{
    id: 'fl-about',
    label: 'About EmpowaEntrepreneurs Funding Summit 2026'
  }, {
    id: 'fl-tracks',
    label: 'Summit Tracks'
  }, {
    id: 'fl-speakers',
    label: 'Speakers'
  }, {
    id: 'fl-agenda',
    label: 'Agenda'
  }, {
    id: 'fl-venue',
    label: 'Venue'
  }]
}, {
  id: 'fcol-attend',
  heading: 'Attend',
  links: [{
    id: 'fl-register',
    label: 'Register Now'
  }, {
    id: 'fl-apply',
    label: 'Apply to Attend'
  }, {
    id: 'fl-powerseat',
    label: 'Power Seat'
  }, {
    id: 'fl-groups',
    label: 'Group Bookings'
  }]
}, {
  id: 'fcol-partner',
  heading: 'Partner',
  links: [{
    id: 'fl-sponsor',
    label: 'Become a Sponsor'
  }, {
    id: 'fl-exhibitor',
    label: 'Exhibitor Info'
  }, {
    id: 'fl-media',
    label: 'Media Partners'
  }, {
    id: 'fl-dfi',
    label: 'DFI & Corporate'
  }]
}];
const FOOTER_SOCIAL_LINKS = [{
  id: 'fsl-tw',
  label: 'Twitter / X',
  brand: 'x'
}, {
  id: 'fsl-li',
  label: 'LinkedIn',
  brand: 'linkedin'
}, {
  id: 'fsl-yt',
  label: 'YouTube',
  brand: 'youtube'
}, {
  id: 'fsl-ig',
  label: 'Instagram',
  brand: 'instagram'
}];
const SocialIcon = ({
  brand
}: {
  brand: string;
}) => {
  if (brand === 'x') return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" fill="rgba(247,246,243,0.55)" /></svg>;
  if (brand === 'linkedin') return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" fill="rgba(247,246,243,0.55)" /></svg>;
  if (brand === 'youtube') return <svg width="15" height="11" viewBox="0 0 24 17" fill="none" aria-hidden="true"><path d="M23.498 2.683A3.009 3.009 0 0 0 21.38.549C19.505 0 12 0 12 0S4.495 0 2.62.549A3.009 3.009 0 0 0 .502 2.683C0 4.566 0 8.5 0 8.5s0 3.934.502 5.817a3.009 3.009 0 0 0 2.118 2.134C4.495 17 12 17 12 17s7.505 0 9.38-.549a3.009 3.009 0 0 0 2.118-2.134C24 12.434 24 8.5 24 8.5s0-3.934-.502-5.817ZM9.545 12.068V4.932L15.818 8.5l-6.273 3.568Z" fill="rgba(247,246,243,0.55)" /></svg>;
  if (brand === 'instagram') return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069ZM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.98-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z" fill="rgba(247,246,243,0.55)" /></svg>;
  return null;
};
const FOOTER_LEGAL = [{
  id: 'leg-priv',
  label: 'Privacy Policy'
}, {
  id: 'leg-terms',
  label: 'Terms of Service'
}, {
  id: 'leg-cookie',
  label: 'Cookie Settings'
}];
const FOOTER_BANNER_BG = 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=1800&q=80';
const SiteFooter = () => {
  const {
    isMobile,
    isTablet
  } = useBreakpoint();
  const footerRef = useRef<HTMLElement>(null);
  const inView = useInView(footerRef, {
    once: true,
    margin: '-80px 0px'
  });
  const hPad = isMobile ? '20px' : isTablet ? '40px' : '80px';
  return <footer ref={footerRef} style={{
    background: '#0A0906',
    width: '100%',
    boxSizing: 'border-box',
    overflow: 'hidden',
    position: 'relative'
  }}>
      {/* Banner Hero */}
      <div style={{
      position: 'relative',
      width: '100%',
      minHeight: isMobile ? '380px' : isTablet ? '460px' : '520px',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'flex-end'
    }}>
        <img src={FOOTER_BANNER_BG} alt="" aria-hidden="true" style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: 'center 30%',
        display: 'block',
        filter: 'brightness(0.28) saturate(0.6)'
      }} />
        <div aria-hidden="true" style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, #0A0906 0%, rgba(10,9,6,0.7) 50%, rgba(10,9,6,0.1) 100%)',
        pointerEvents: 'none'
      }} />
        <div aria-hidden="true" style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: NOISE_SVG,
        backgroundRepeat: 'repeat',
        backgroundSize: '128px 128px',
        opacity: 0.5,
        pointerEvents: 'none'
      }} />
        <div aria-hidden="true" style={{
        position: 'absolute',
        top: '-15%',
        right: '-5%',
        width: '55vw',
        height: '55vw',
        maxWidth: '720px',
        maxHeight: '720px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(222,50,45,0.22) 0%, transparent 65%)',
        pointerEvents: 'none'
      }} />

        <div style={{
        position: 'relative',
        zIndex: 2,
        width: '100%',
        padding: `0 ${hPad} ${isMobile ? '44px' : '64px'}`,
        boxSizing: 'border-box',
        maxWidth: '1440px',
        margin: '0 auto'
      }}>
          <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={rotateFade} custom={0} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '24px'
        }}>
            <PlusSquareIconLight />
            <span style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '12px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(247,246,243,0.4)',
            fontWeight: 600
          }}>Africa's Premier Funding Platform · 2026</span>
          </motion.div>

          <div style={{
          display: 'flex',
          flexDirection: isMobile || isTablet ? 'column' : 'row',
          alignItems: isMobile || isTablet ? 'flex-start' : 'flex-end',
          justifyContent: 'space-between',
          gap: '32px'
        }}>
            <div style={{
            overflow: 'hidden',
            flex: 1
          }}>
              <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.08} style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: isMobile ? 'clamp(36px, 10vw, 60px)' : isTablet ? 'clamp(44px, 9vw, 76px)' : 'clamp(56px, 7vw, 96px)',
              fontWeight: 700,
              letterSpacing: isMobile ? '-2px' : '-3px',
              lineHeight: 0.92,
              color: '#F7F6F3',
              margin: 0,
              textTransform: 'uppercase'
            }}>
                <span>Secure</span><br />
                <em style={{
                fontStyle: 'italic',
                color: '#DE322D',
                fontWeight: 400
              }}>Your Seat.</em><br />
                <span style={{
                color: 'rgba(247,246,243,0.18)',
                fontWeight: 300
              }}>May 2026.</span>
              </motion.h2>
            </div>

            <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={isMobile || isTablet ? fadeUpVariants : slideFromRight} custom={0.22} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            width: isMobile || isTablet ? '100%' : '260px',
            flexShrink: 0
          }}>
              <motion.a href="/summit" whileHover={{
              scale: 1.04,
              boxShadow: '0 12px 52px rgba(222,50,45,0.7)'
            }} whileTap={{
              scale: 0.97
            }} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              background: 'linear-gradient(135deg, #DE322D 0%, #c42823 100%)',
              borderRadius: '44px',
              padding: '16px 32px',
              fontSize: '13px',
              letterSpacing: '0.05em',
              color: '#fff',
              textDecoration: 'none',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 600,
              boxShadow: '0 8px 40px rgba(222,50,45,0.5)'
            }}>
                <span>Register Now</span><ArrowIconDark />
              </motion.a>
              <motion.a href="/partnerships"  whileHover={{
              scale: 1.04
            }} whileTap={{
              scale: 0.97
            }} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              border: '1px solid rgba(247,246,243,0.22)',
              borderRadius: '44px',
              padding: '16px 32px',
              fontSize: '13px',
              letterSpacing: '0.04em',
              color: 'rgba(247,246,243,0.65)',
              textDecoration: 'none',
              fontFamily: 'Montserrat, sans-serif',
              transition: 'border-color 0.3s ease, color 0.3s ease'
            }} onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.borderColor = 'rgba(247,246,243,0.5)';
              el.style.color = '#F7F6F3';
            }} onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.borderColor = 'rgba(247,246,243,0.22)';
              el.style.color = 'rgba(247,246,243,0.65)';
            }}>
                <span>Partner With Us</span>
              </motion.a>
            </motion.div>
          </div>
        </div>
      </div>

      <div style={{
      height: '1px',
      background: 'rgba(247,246,243,0.06)',
      margin: '0'
    }} />

      <div style={{
      maxWidth: '1440px',
      margin: '0 auto',
      padding: `${isMobile ? '44px' : '64px'} ${hPad} 0`,
      boxSizing: 'border-box'
    }}>
        <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '36px',
        paddingBottom: '44px',
        borderBottom: '1px solid rgba(247,246,243,0.07)'
      }}>
          {/* Brand block */}
          <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          maxWidth: isMobile ? '100%' : '280px',
          flexShrink: 0
        }}>
            <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
              <motion.div whileHover={{
              scale: 1.1,
              rotate: 8
            }} style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #DE322D, #ff5a4f)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 4px 20px rgba(222,50,45,0.4)'
            }}>
                <svg width="13" height="13" viewBox="0 0 12 12" fill="none"><path d="M6 1L7.5 4.5L11 5L8.5 7.5L9 11L6 9.5L3 11L3.5 7.5L1 5L4.5 4.5L6 1Z" fill="white" /></svg>
              </motion.div>
              <div>
                <div style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '13px',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: '#F7F6F3',
                fontWeight: 700,
                lineHeight: 1.1
              }}>EmpowaEntrepreneurs</div>
                <div style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '10px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'rgba(247,246,243,0.22)',
                fontWeight: 400,
                marginTop: '2px'
              }}>Funding Summit · 2026</div>
              </div>
            </div>
            <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            lineHeight: '1.8',
            color: 'rgba(247,246,243,0.28)',
            margin: 0
          }}>
              Where Africa's next generation of scalable businesses meets serious capital and transformative growth.
            </p>
          </div>

          {/* Nav columns */}
          <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
          gap: isMobile ? '28px' : isTablet ? '20px' : '0',
          flex: 1,
          maxWidth: isMobile ? '100%' : '560px'
        }}>
            {FOOTER_NAV_COLS.map((col, colIdx) => <div key={col.id} style={{
            paddingLeft: !isMobile && colIdx > 0 ? '32px' : '0',
            borderLeft: !isMobile && colIdx > 0 ? '1px solid rgba(247,246,243,0.06)' : 'none'
          }}>
                <span style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '9px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(247,246,243,0.15)',
              fontWeight: 700,
              display: 'block',
              marginBottom: '16px'
            }}>{col.heading}</span>
                <ul style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
                  {col.links.map(link => <li key={link.id}>
                      <a href="#" onClick={e => e.preventDefault()} style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '13px',
                  color: 'rgba(247,246,243,0.3)',
                  textDecoration: 'none',
                  letterSpacing: '0.01em',
                  transition: 'color 0.2s ease',
                  display: 'block'
                }} onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.color = '#F7F6F3';
                }} onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(247,246,243,0.3)';
                }}>
                        {link.label}
                      </a>
                    </li>)}
                </ul>
              </div>)}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'flex-start' : 'center',
        gap: '16px',
        padding: '24px 0 36px'
      }}>
          <span style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '11px',
          color: 'rgba(247,246,243,0.1)',
          letterSpacing: '0.04em'
        }}>
            © 2026 EmpowaEntrepreneurs. All rights reserved.
          </span>
          <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? '10px' : '16px',
          flexWrap: 'wrap'
        }}>
            <div style={{
            display: 'flex',
            gap: '8px'
          }}>
              {FOOTER_SOCIAL_LINKS.map(soc => <motion.a key={soc.id} href="#" onClick={e => e.preventDefault()} whileHover={{
              scale: 1.1,
              y: -2
            }} whileTap={{
              scale: 0.92
            }} title={soc.label} style={{
              width: '36px',
              height: '36px',
              borderRadius: '4px',
              border: '1px solid rgba(247,246,243,0.08)',
              background: 'rgba(247,246,243,0.03)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              transition: 'border-color 0.2s ease, background 0.2s ease'
            }} onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.borderColor = 'rgba(247,246,243,0.28)';
              el.style.background = 'rgba(247,246,243,0.08)';
            }} onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.borderColor = 'rgba(247,246,243,0.08)';
              el.style.background = 'rgba(247,246,243,0.03)';
            }}>
                  <SocialIcon brand={soc.brand} />
                </motion.a>)}
            </div>
            {!isMobile && <div style={{
            width: '1px',
            height: '20px',
            background: 'rgba(247,246,243,0.08)'
          }} />}
            {FOOTER_LEGAL.map(item => <a key={item.id} href="#" onClick={e => e.preventDefault()} style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '11px',
            color: 'rgba(247,246,243,0.12)',
            textDecoration: 'none',
            letterSpacing: '0.04em',
            transition: 'color 0.2s'
          }} onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(247,246,243,0.45)';
          }} onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(247,246,243,0.12)';
          }}>
                {item.label}
              </a>)}
          </div>
        </div>
      </div>
    </footer>;
};

// ─── ApplyToAttendPage ─────────────────────────────────────────────────────────
export const DetailedRegistrationPage = () => {
  return (
    <div className="w-full min-h-screen" style={{ background: '#141210' }}>
      <ApplyHeroSection />
      
      <section id="registration-form" style={{ padding: '80px 20px', background: '#141210' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', background: 'rgba(247,246,243,0.03)', border: '1px solid rgba(247,246,243,0.08)', padding: '40px', borderRadius: '20px' }}>
          <h2 style={{ fontFamily: 'Montserrat, sans-serif', color: '#F7F6F3', fontSize: '24px', marginBottom: '16px' }}>Detailed Registration Form</h2>
          <p style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(247,246,243,0.5)', fontSize: '14px' }}>Form fields loading...</p>
          {/* Form will go here once fields are provided */}
        </div>
      </section>
    </div>
  );
};