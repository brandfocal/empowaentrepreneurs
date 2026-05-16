import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView, useAnimationFrame, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';

import { LeadershipTeamSection } from './LeadershipTeamSection';
import { PartnershipEnquiryModal } from './PartnershipEnquiryModal';
// ─── Noise texture ─────────────────────────────────────────────────────────────
const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`;

// ─── Breakpoint hook ──────────────────────────────────────────────────────────
const useBreakpoint = () => {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  useEffect(() => {
    const check = () => setWidth(window.innerWidth);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return {
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1100,
    isDesktop: width >= 1100,
    width
  };
};

// ─── Magnetic hover hook ───────────────────────────────────────────────────────
const useMagnetic = (strength = 0.35) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, {
    stiffness: 200,
    damping: 22
  });
  const springY = useSpring(y, {
    stiffness: 200,
    damping: 22
  });
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  }, [x, y, strength]);
  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);
  return {
    ref,
    springX,
    springY,
    handleMouseMove,
    handleMouseLeave
  };
};

// ─── Icons ────────────────────────────────────────────────────────────────────
const PlusSquareIconLight = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M16.25 2.5H3.75C3.41848 2.5 3.10054 2.6317 2.86612 2.86612C2.6317 3.10054 2.5 3.41848 2.5 3.75V16.25C2.5 16.5815 2.6317 16.8995 2.86612 17.1339C3.10054 17.3683 3.41848 17.5 3.75 17.5H16.25C16.5815 17.5 16.8995 17.3683 17.1339 17.1339C17.3683 16.8995 17.5 16.5815 17.5 16.25V3.75C17.5 3.41848 17.3683 3.10054 17.1339 2.86612C16.8995 2.6317 16.5815 2.5 16.25 2.5ZM13.125 10.625H10.625V13.125C10.625 13.2908 10.5592 13.4497 10.4419 13.5669C10.3247 13.6842 10.1658 13.75 10 13.75C9.83424 13.75 9.67527 13.6842 9.55806 13.5669C9.44085 13.4497 9.375 13.2908 9.375 13.125V10.625H6.875C6.70924 10.625 6.55027 10.5592 6.43306 10.4419C6.31585 10.3247 6.25 10.1658 6.25 10C6.25 9.83424 6.31585 9.67527 6.43306 9.55806C6.55027 9.44085 6.70924 9.375 6.875 9.375H9.375V6.875C9.375 6.70924 9.44085 6.55027 9.55806 6.43306C9.67527 6.31585 9.83424 6.25 10 6.25C10.1658 6.25 10.3247 6.31585 10.4419 6.43306C10.5592 6.55027 10.625 6.70924 10.625 6.875V9.375H13.125C13.2908 9.375 13.4497 9.44085 13.5669 9.55806C13.6842 9.67527 13.75 9.83424 13.75 10C13.75 10.1658 13.6842 10.3247 13.5669 10.4419C13.4497 10.5592 13.2908 10.625 13.125 10.625Z" fill="rgba(247,246,243,0.35)" />
  </svg>;
const PlusSquareIconDark = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M16.25 2.5H3.75C3.41848 2.5 3.10054 2.6317 2.86612 2.86612C2.6317 3.10054 2.5 3.41848 2.5 3.75V16.25C2.5 16.5815 2.6317 16.8995 2.86612 17.1339C3.10054 17.3683 3.41848 17.5 3.75 17.5H16.25C16.5815 17.5 16.8995 17.3683 17.1339 17.1339C17.3683 16.8995 17.5 16.5815 17.5 16.25V3.75C17.5 3.41848 17.3683 3.10054 17.1339 2.86612C16.8995 2.6317 16.5815 2.5 16.25 2.5ZM13.125 10.625H10.625V13.125C10.625 13.2908 10.5592 13.4497 10.4419 13.5669C10.3247 13.6842 10.1658 13.75 10 13.75C9.83424 13.75 9.67527 13.6842 9.55806 13.5669C9.44085 13.4497 9.375 13.2908 9.375 13.125V10.625H6.875C6.70924 10.625 6.55027 10.5592 6.43306 10.4419C6.31585 10.3247 6.25 10.1658 6.25 10C6.25 9.83424 6.31585 9.67527 6.43306 9.55806C6.55027 9.44085 6.70924 9.375 6.875 9.375H9.375V6.875C9.375 6.70924 9.44085 6.55027 9.55806 6.43306C9.67527 6.31585 9.83424 6.25 10 6.25C10.1658 6.25 10.3247 6.31585 10.4419 6.43306C10.5592 6.55027 10.625 6.70924 10.625 6.875V9.375H13.125C13.2908 9.375 13.4497 9.44085 13.5669 9.55806C13.6842 9.67527 13.75 9.83424 13.75 10C13.75 10.1658 13.6842 10.3247 13.5669 10.4419C13.4497 10.5592 13.2908 10.625 13.125 10.625Z" fill="#DE322D" />
  </svg>;
const ArrowIconDark = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 12L12 2M12 2H4M12 2V10" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;

// ─── Animation variants ───────────────────────────────────────────────────────
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
const lineWipe = {
  hidden: {
    scaleX: 0,
    opacity: 0
  },
  visible: (delay = 0) => ({
    scaleX: 1,
    opacity: 1,
    transition: {
      duration: 0.9,
      delay,
      ease: [0.76, 0, 0.24, 1] as const
    }
  })
};
const clipReveal = {
  hidden: {
    clipPath: 'inset(100% 0% 0% 0%)',
    opacity: 0
  },
  visible: (delay = 0) => ({
    clipPath: 'inset(0% 0% 0% 0%)',
    opacity: 1,
    transition: {
      duration: 0.9,
      delay,
      ease: [0.76, 0, 0.24, 1] as const
    }
  })
};
const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07
    }
  }
};
const staggerChild = {
  hidden: {
    opacity: 0,
    y: 32,
    filter: 'blur(8px)'
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1] as const
    }
  }
};

// ─── Scroll Progress Bar ──────────────────────────────────────────────────────
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

// ─── Ticker ───────────────────────────────────────────────────────────────────
const TICKER_ITEMS = [{
  id: 'tk-1',
  label: 'Real Capital'
}, {
  id: 'tk-2',
  label: 'Real Deals'
}, {
  id: 'tk-3',
  label: 'Real Growth'
}, {
  id: 'tk-4',
  label: "Africa's Next Generation"
}, {
  id: 'tk-5',
  label: 'High-Impact Capital'
}, {
  id: 'tk-6',
  label: 'Scalable Ventures'
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

// ─── Sticky Nav ───────────────────────────────────────────────────────────────
const STICKY_NAV_ITEMS = [{
  id: 'home',
  label: 'Home'
}, {
  id: 'about',
  label: 'About'
}, {
  id: 'programme',
  label: 'Programme'
}, {
  id: 'experience',
  label: 'Experience Zones'
}, {
  id: 'funding-summit',
  label: 'Funding Summit',
  active: true
}, {
  id: 'partnerships',
  label: 'Partnerships'
}, {
  id: 'contact',
  label: 'Contact Us'
}];

// Nav items shown on tablet (first 4 only)
const TABLET_NAV_ITEMS = STICKY_NAV_ITEMS.slice(0, 4);
const StickyNav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const {
    isMobile,
    isTablet
  } = useBreakpoint();
  const showHamburger = isMobile;
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
      padding: scrolled ? isMobile ? '10px 20px' : isTablet ? '10px 28px' : '12px 32px' : isMobile ? '14px 20px' : isTablet ? '16px 28px' : '20px 32px',
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
        {!isMobile && <span style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: isTablet ? '11px' : '13px',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: scrolled ? '#141210' : '#F7F6F3',
          fontWeight: 700,
          transition: 'color 0.35s ease'
        }}>EmpowaEntrepreneurs</span>}
      </a>

      {/* Tablet: show 4 nav links, no ghost button */}
      {isTablet && !showHamburger && <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        {TABLET_NAV_ITEMS.map(item => <a key={item.id} href="#"  style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '11px',
          textDecoration: 'none',
          letterSpacing: '0.04em',
          transition: 'color 0.2s',
          color: item.active ? '#DE322D' : navLinkColor,
          fontWeight: item.active ? 600 : 400
        }} onMouseEnter={e => {
          (e.currentTarget as HTMLAnchorElement).style.color = item.active ? '#DE322D' : navLinkHoverColor;
        }} onMouseLeave={e => {
          (e.currentTarget as HTMLAnchorElement).style.color = item.active ? '#DE322D' : navLinkColor;
        }}>{item.label}</a>)}
        <motion.a href="#"  whileHover={{
          scale: 1.04
        }} whileTap={{
          scale: 0.97
        }} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'linear-gradient(135deg, #DE322D, #c42823)',
          borderRadius: '44px',
          padding: '7px 14px',
          fontSize: '11px',
          letterSpacing: '0.06em',
          color: '#fff',
          textDecoration: 'none',
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: 600,
          boxShadow: '0 4px 16px rgba(222,50,45,0.38)'
        }}><span>Apply Now</span></motion.a>
      </div>}

      {/* Desktop: full nav */}
      {!isTablet && !showHamburger && <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '22px'
      }}>
        {STICKY_NAV_ITEMS.map(item => <a key={item.id} href="#"  style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '12px',
          textDecoration: 'none',
          letterSpacing: '0.04em',
          transition: 'color 0.2s',
          color: item.active ? '#DE322D' : navLinkColor,
          fontWeight: item.active ? 600 : 400
        }} onMouseEnter={e => {
          (e.currentTarget as HTMLAnchorElement).style.color = item.active ? '#DE322D' : navLinkHoverColor;
        }} onMouseLeave={e => {
          (e.currentTarget as HTMLAnchorElement).style.color = item.active ? '#DE322D' : navLinkColor;
        }}>{item.label}</a>)}
        <div style={{
          display: 'flex',
          gap: '8px'
        }}>
          <motion.a href="#"  whileHover={{
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
            transition: 'border-color 0.25s ease, color 0.25s ease'
          }}><span>Become a Funder</span></motion.a>
          <motion.a href="#registration-form" whileHover={{
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
            boxShadow: '0 4px 16px rgba(222,50,45,0.38)'
          }}><span>Register Now</span></motion.a>
        </div>
      </div>}

      {/* Mobile: hamburger */}
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
        padding: '20px 20px 24px',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {STICKY_NAV_ITEMS.map(item => <a key={item.id} href="#" onClick={e => { e.preventDefault(); setMobileMenuOpen(false); }} style={{
          display: 'block',
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '16px',
          color: item.active ? '#DE322D' : 'rgba(20,18,16,0.65)',
          textDecoration: 'none',
          padding: '12px 0',
          borderBottom: '0.8px solid rgba(20,18,16,0.06)',
          letterSpacing: '0.02em',
          fontWeight: item.active ? 600 : 400
        }}>{item.label}</a>)}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginTop: '20px',
          flexDirection: 'column'
        }}>
          <a href="#"  style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '13px',
            border: '1px solid rgba(20,18,16,0.18)',
            borderRadius: '44px',
            padding: '12px 20px',
            color: 'rgba(20,18,16,0.65)',
            textDecoration: 'none',
            textAlign: 'center'
          }}>Become a Funder</a>
          <a href="#registration-form"  style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '13px',
            background: 'linear-gradient(135deg, #DE322D, #c42823)',
            borderRadius: '44px',
            padding: '12px 20px',
            color: '#fff',
            textDecoration: 'none',
            fontWeight: 600,
            textAlign: 'center'
          }}>Register Now</a>
        </div>
      </motion.div>}
    </AnimatePresence>
  </motion.nav>;
};

// ─── Hero Section ─────────────────────────────────────────────────────────────
const HERO_BG = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1800&q=80';
const HeroSection = () => {
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
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '8%']);
  const heroLetterSpacing = isMobile ? '-1.5px' : isTablet ? '-2.5px' : '-4px';
  const heroPadding = isMobile ? '0 20px 32px' : isTablet ? '0 40px 40px' : '0 64px 48px';
  const magneticReg = useMagnetic(0.3);
  return <section ref={heroRef} style={{
    minHeight: isMobile ? '100svh' : '100vh',
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
      backgroundImage: `url(${HERO_BG})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center top',
      pointerEvents: 'none',
      zIndex: 0,
      willChange: 'transform'
    }} />
    <div aria-hidden="true" style={{
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(155deg, rgba(20,18,16,0.96) 0%, rgba(20,18,16,0.82) 50%, rgba(20,18,16,0.92) 100%)',
      zIndex: 1,
      pointerEvents: 'none'
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
    {/* Parallax orb: hide on mobile */}
    {!isMobile && <div aria-hidden="true" style={{
      position: 'absolute',
      top: '5%',
      right: '-5%',
      width: 'clamp(300px, 60vw, 920px)',
      height: 'clamp(300px, 60vw, 920px)',
      borderRadius: '50%',
      background: 'radial-gradient(circle at 40% 40%, rgba(222,50,45,0.28) 0%, rgba(222,50,45,0.08) 45%, transparent 70%)',
      pointerEvents: 'none',
      zIndex: 3
    }} />}
    {/* Corner brackets: hide on mobile */}
    {!isMobile && <div aria-hidden="true" style={{
      position: 'absolute',
      top: '88px',
      left: '32px',
      width: '40px',
      height: '40px',
      borderLeft: '1px solid rgba(222,50,45,0.3)',
      borderTop: '1px solid rgba(222,50,45,0.3)',
      zIndex: 4,
      pointerEvents: 'none'
    }} />}
    {!isMobile && <div aria-hidden="true" style={{
      position: 'absolute',
      bottom: '80px',
      right: '32px',
      width: '40px',
      height: '40px',
      borderRight: '1px solid rgba(222,50,45,0.3)',
      borderBottom: '1px solid rgba(222,50,45,0.3)',
      zIndex: 4,
      pointerEvents: 'none'
    }} />}
    <div style={{
      height: isMobile ? '70px' : '88px',
      flexShrink: 0,
      position: 'relative',
      zIndex: 4
    }} />
    <motion.div style={{
      y: textY,
      flex: 1,
      padding: heroPadding,
      width: '100%',
      boxSizing: 'border-box',
      zIndex: 4,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>
      <motion.div custom={0.05} initial="hidden" animate="visible" variants={fadeUpVariants} style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: isMobile ? '24px' : '40px',
        flexWrap: 'wrap'
      }}>
        <PlusSquareIconLight />
        <span style={{
          fontFamily: 'Montserrat, sans-serif',
          color: 'rgba(247,246,243,0.38)',
          fontSize: isMobile ? '10px' : '11px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          fontWeight: 500
        }}>
          <span style={{
            color: '#DE322D',
            fontWeight: 600
          }}>EmpowaEntrepreneurs</span>
          <span> · Funding Summit 2026</span>
        </span>
      </motion.div>
      <h1 style={{
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: 300,
        margin: `0 0 ${isMobile ? '28px' : '48px'}`,
        lineHeight: 0.92,
        letterSpacing: heroLetterSpacing,
        maxWidth: '100%',
        wordBreak: 'break-word'
      }}>
        <div style={{
          overflow: 'hidden',
          display: 'block'
        }}>
          {["Africa's", 'Premier'].map((word, i) => <motion.span key={`l1-${word}`} initial={{
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
            fontSize: 'clamp(36px, 9vw, 112px)',
            color: '#F7F6F3',
            marginRight: '0.22em'
          }}>{word}</motion.span>)}
        </div>
        <div style={{
          overflow: 'hidden',
          display: 'block'
        }}>
          <motion.em initial={{
            y: '110%',
            opacity: 0
          }} animate={{
            y: '0%',
            opacity: 1
          }} transition={{
            duration: 0.9,
            delay: 0.42,
            ease: [0.22, 1, 0.36, 1]
          }} style={{
            display: 'inline-block',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 'clamp(36px, 9vw, 112px)',
            color: '#DE322D',
            marginRight: '0.22em'
          }}>Funding</motion.em>
          <motion.span initial={{
            y: '110%',
            opacity: 0
          }} animate={{
            y: '0%',
            opacity: 1
          }} transition={{
            duration: 0.9,
            delay: 0.54,
            ease: [0.22, 1, 0.36, 1]
          }} style={{
            display: 'inline-block',
            fontSize: 'clamp(36px, 9vw, 112px)',
            color: '#F7F6F3',
            marginRight: '0.22em'
          }}>Summit</motion.span>
        </div>
        <div style={{
          overflow: 'hidden',
          display: 'block'
        }}>
          <motion.span initial={{
            y: '110%',
            opacity: 0
          }} animate={{
            y: '0%',
            opacity: 1
          }} transition={{
            duration: 0.9,
            delay: 0.68,
            ease: [0.22, 1, 0.36, 1]
          }} style={{
            display: 'inline-block',
            fontSize: 'clamp(36px, 9vw, 112px)',
            color: 'rgba(247,246,243,0.1)'
          }}>2026.</motion.span>
        </div>
      </h1>
      <motion.div custom={0.85} initial="hidden" animate="visible" variants={fadeUpVariants} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        maxWidth: isMobile ? '100%' : '540px'
      }}>
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 300,
          fontSize: isMobile ? '15px' : isTablet ? '17px' : 'clamp(15px, 1.3vw, 19px)',
          lineHeight: '1.65',
          color: '#F7F6F3',
          margin: 0
        }}>
          Where Vetted Entrepreneurs Meet High-Impact Capital
        </p>
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 300,
          fontSize: isMobile ? '14px' : 'clamp(14px, 1.3vw, 16px)',
          lineHeight: '1.75',
          color: 'rgba(247,246,243,0.7)',
          margin: 0
        }}>
          Africa's most ambitious entrepreneurs come face-to-face with the continent's most active funders - DFIs, VCs, ESD funds, and impact investors deploying real capital into Africa's next generation.
        </p>
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 300,
          fontSize: '13px',
          lineHeight: '1.7',
          color: 'rgba(247,246,243,0.4)',
          margin: 0
        }}>
          May 28, 2026 · EmpowaWorx House · Johannesburg
        </p>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flexDirection: isMobile ? 'column' : 'row',
          flexWrap: 'wrap'
        }}>
          <motion.div ref={magneticReg.ref} onMouseMove={magneticReg.handleMouseMove} onMouseLeave={magneticReg.handleMouseLeave} style={{
            x: magneticReg.springX,
            y: magneticReg.springY,
            display: 'inline-flex',
            width: isMobile ? '100%' : 'auto'
          }}>
            <motion.a href="#registration-form" whileHover={{
              scale: 1.04,
              boxShadow: '0 16px 52px rgba(222,50,45,0.7)'
            }} whileTap={{
              scale: 0.97
            }} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              background: 'linear-gradient(135deg, #DE322D 0%, #c42823 100%)',
              borderRadius: '44px',
              padding: isMobile ? '14px 22px' : '16px 34px',
              fontSize: '13px',
              letterSpacing: '0.05em',
              color: '#fff',
              textDecoration: 'none',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 600,
              boxShadow: '0 8px 36px rgba(222,50,45,0.55)',
              width: isMobile ? '100%' : 'auto',
              boxSizing: 'border-box'
            }}><span>Register Now</span><ArrowIconDark /></motion.a>
          </motion.div>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(247,246,243,0.08)',
          flexWrap: 'wrap',
          rowGap: '8px'
        }}>
          {[{
            id: 'hs-1',
            value: '4,000+',
            label: 'Attendees'
          }, {
            id: 'hs-2',
            value: '120+',
            label: 'Active Funders'
          }, {
            id: 'hs-3',
            value: '30+',
            label: 'African Markets'
          }].map((stat, i) => <div key={stat.id} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            paddingRight: i < 2 ? '20px' : '0',
            borderRight: i < 2 ? '1px solid rgba(247,246,243,0.1)' : 'none'
          }}>
            <span style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: isMobile ? '20px' : 'clamp(20px, 2.5vw, 28px)',
              fontWeight: 200,
              letterSpacing: '-1px',
              color: '#F7F6F3',
              lineHeight: 1
            }}>{stat.value}</span>
            <span style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '10px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(247,246,243,0.28)',
              fontWeight: 500
            }}>{stat.label}</span>
          </div>)}
        </div>
      </motion.div>
    </motion.div>
    {/* Hero ticker: hidden on mobile */}
    {!isMobile && <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      duration: 0.6,
      delay: 1.0
    }} style={{
      borderTop: '0.8px solid rgba(247,246,243,0.07)',
      zIndex: 4,
      overflow: 'hidden',
      position: 'relative'
    }}>
      <HeroTicker light />
    </motion.div>}
  </section>;
};

// ─── Event Logistics Section ──────────────────────────────────────────────────
const EventLogisticsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, {
    once: true,
    margin: '-80px 0px'
  });
  const {
    isMobile,
    isTablet
  } = useBreakpoint();
  const hPad = isMobile ? '0 20px' : isTablet ? '0 40px' : '0 64px';
  const headingSize = isMobile ? 'clamp(28px, 8vw, 44px)' : isTablet ? 'clamp(32px, 5vw, 52px)' : 'clamp(36px, 4vw, 58px)';
  const logisticsItems = [{
    id: 'ld-1',
    label: 'Date',
    value: 'May 28, 2026',
    sub: 'Full day summit programme'
  }, {
    id: 'ld-2',
    label: 'Venue',
    value: 'EmpowaWorx House',
    sub: 'Johannesburg, South Africa'
  }, {
    id: 'ld-3',
    label: 'Format',
    value: 'In-Person Summit',
    sub: 'Curated attendee experience'
  }, {
    id: 'ld-4',
    label: 'Attendance',
    value: '4,000+ Attendees',
    sub: 'Entrepreneurs · Funders · Ecosystem builders'
  }];
  return <section ref={sectionRef} style={{
    background: 'linear-gradient(155deg, #F4F1EB 0%, #EDE8E0 50%, #F0EBE3 100%)',
    padding: isMobile ? '72px 0' : isTablet ? '88px 0' : '144px 0',
    width: '100%',
    boxSizing: 'border-box',
    overflow: 'hidden',
    position: 'relative'
  }}>
    <div aria-hidden="true" style={{
      position: 'absolute',
      top: '-10%',
      right: '-8%',
      width: 'clamp(300px, 55vw, 800px)',
      height: 'clamp(300px, 55vw, 800px)',
      borderRadius: '50%',
      background: 'radial-gradient(circle at 40% 40%, rgba(222,50,45,0.07) 0%, rgba(222,50,45,0.02) 45%, transparent 70%)',
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
      opacity: 0.4,
      zIndex: 0
    }} />
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: hPad,
      position: 'relative',
      zIndex: 1
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? '48px' : '80px',
        alignItems: 'flex-start'
      }}>
        <div>
          <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={rotateFade} custom={0} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '24px'
          }}>
            <PlusSquareIconDark />
            <span style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '11px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(20,18,16,0.45)',
              fontWeight: 500
            }}>Event Details</span>
          </motion.div>
          <div style={{
            overflow: 'hidden'
          }}>
            <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.1} style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: headingSize,
              fontWeight: 200,
              letterSpacing: isMobile ? '-1.5px' : '-2px',
              lineHeight: 1.04,
              color: '#141210',
              margin: '0 0 28px'
            }}>
              <span>{'The summit '}</span>
              <em style={{
                fontStyle: 'italic',
                color: '#DE322D',
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 300
              }}>{'that connects'}</em>
              <span style={{
                color: 'rgba(20,18,16,0.22)'
              }}>{' capital'}</span>
              <br />
              <span style={{
                color: 'rgba(20,18,16,0.22)'
              }}>{'to ambition.'}</span>
            </motion.h2>
          </div>
          <motion.p initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUpVariants} custom={0.28} style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: isMobile ? '14px' : '16px',
            lineHeight: '1.82',
            color: 'rgba(20,18,16,0.6)',
            margin: 0,
            fontWeight: 300
          }}>
            The EmpowaEntrepreneurs Funding Summit is South Africa's most focused capital-access event for high-growth entrepreneurs. Designed to bridge the gap between investment-ready ventures and the funders who deploy real capital.
          </motion.p>
        </div>
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideFromRight} custom={0.2} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {logisticsItems.map((item, i) => <motion.div key={item.id} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUpVariants} custom={0.2 + i * 0.08} style={{
            display: 'flex',
            gap: '20px',
            alignItems: 'flex-start',
            paddingBottom: '20px',
            borderBottom: '1px solid rgba(20,18,16,0.08)'
          }}>
            <div style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '10px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(20,18,16,0.35)',
              fontWeight: 500,
              minWidth: '70px',
              paddingTop: '2px'
            }}>{item.label}</div>
            <div>
              <div style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: isMobile ? '15px' : '17px',
                fontWeight: 600,
                color: '#141210',
                letterSpacing: '-0.3px',
                marginBottom: '3px',
                lineHeight: 1.15
              }}>{item.value}</div>
              <div style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '12px',
                color: 'rgba(20,18,16,0.45)',
                lineHeight: '1.5'
              }}>{item.sub}</div>
            </div>
          </motion.div>)}
        </motion.div>
      </div>
    </div>
  </section>;
};

// ─── Experience Zones Section ─────────────────────────────────────────────────
type ZoneCard = {
  id: string;
  index: string;
  title: string;
  description: string;
};
const EXPERIENCE_ZONES: ZoneCard[] = [{
  id: 'ez-1',
  index: '01',
  title: 'The Funding Corner',
  description: 'One-on-one sessions between entrepreneurs and active funders. Structured, time-bound, and results-focused - this is where real funding conversations happen.'
}, {
  id: 'ez-2',
  index: '02',
  title: "The Women's Fund Room",
  description: 'A dedicated space for women-led businesses to access gender-lens investors, ESD funds, and development finance institutions committed to closing the gender capital gap.'
}, {
  id: 'ez-3',
  index: '03',
  title: 'Legal & Financial Intelligence Zone',
  description: 'Expert-led sessions on investment structuring, term sheets, due diligence preparation, and the legal frameworks entrepreneurs need to close funding rounds with confidence.'
}, {
  id: 'ez-4',
  index: '04',
  title: "Dragon's Den Pitching Festival",
  description: "Africa's most high-stakes pitch format. Selected founders present before a panel of elite funders in live, competitive pitch sessions. Only the most investment-ready are invited."
}, {
  id: 'ez-5',
  index: '05',
  title: 'Funding Application Clinics',
  description: 'Hands-on guidance for completing funding applications, building investor decks, and navigating the application requirements of DFIs, VCs, and ESD programmes.'
}, {
  id: 'ez-6',
  index: '06',
  title: 'Masterclasses',
  description: 'Deep-dive learning sessions delivered by sector-leading investors, operators, and advisors on scaling, capital strategy, market entry, and the art of building investor-grade businesses.'
}];
const ExperienceZonesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, {
    once: true,
    margin: '-80px 0px'
  });
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const {
    isMobile,
    isTablet
  } = useBreakpoint();
  const hPad = isMobile ? '0 20px' : isTablet ? '0 40px' : '0 64px';
  const headingSize = isMobile ? 'clamp(28px, 8vw, 44px)' : isTablet ? 'clamp(32px, 5vw, 52px)' : 'clamp(36px, 4vw, 58px)';
  const gridCols = isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)';
  return <section ref={sectionRef} style={{
    background: '#141210',
    padding: isMobile ? '72px 0' : isTablet ? '88px 0' : '144px 0',
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
      opacity: 0.5
    }} />
    <div aria-hidden="true" style={{
      position: 'absolute',
      top: '-10%',
      right: '-8%',
      width: 'clamp(300px, 55vw, 840px)',
      height: 'clamp(300px, 55vw, 840px)',
      borderRadius: '50%',
      background: 'radial-gradient(circle at 40% 40%, rgba(222,50,45,0.18) 0%, rgba(222,50,45,0.05) 45%, transparent 70%)',
      pointerEvents: 'none',
      zIndex: 0
    }} />
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: hPad,
      position: 'relative',
      zIndex: 1
    }}>
      <div style={{
        marginBottom: isMobile ? '40px' : '72px'
      }}>
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={rotateFade} custom={0} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '24px'
        }}>
          <PlusSquareIconLight />
          <span style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '11px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(247,246,243,0.35)',
            fontWeight: 500
          }}>Experience Zones</span>
        </motion.div>
        <div style={{
          overflow: 'hidden'
        }}>
          <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.1} style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: headingSize,
            fontWeight: 200,
            letterSpacing: isMobile ? '-1.5px' : '-2.5px',
            lineHeight: 1.04,
            color: '#F7F6F3',
            margin: '0 0 20px',
            maxWidth: '640px'
          }}>
            <span>{'Six zones. '}</span>
            <em style={{
              fontStyle: 'italic',
              color: '#DE322D',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 300
            }}>{'One mission.'}</em>
            <span style={{
              color: 'rgba(247,246,243,0.18)'
            }}>{' Capital access'}</span>
            <br />
            <span style={{
              color: 'rgba(247,246,243,0.18)'
            }}>{"for Africa's builders."}</span>
          </motion.h2>
        </div>
        <motion.p initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUpVariants} custom={0.28} style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: isMobile ? '14px' : '15px',
          lineHeight: '1.8',
          color: 'rgba(247,246,243,0.45)',
          margin: 0,
          fontWeight: 300,
          maxWidth: '560px'
        }}>
          The Funding Summit is architected as six purpose-built zones, each designed to deliver a specific capital-access outcome for entrepreneurs at every stage of their funding journey.
        </motion.p>
      </div>
      <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={staggerContainer} custom={0.08} style={{
        display: 'grid',
        gridTemplateColumns: gridCols,
        gap: '12px'
      }}>
        {EXPERIENCE_ZONES.map((zone, i) => {
          const isHov = hoveredId === zone.id;
          return <motion.div key={zone.id} variants={clipReveal} custom={i * 0.1} whileHover={{
            y: -4
          }} transition={{
            duration: 0.3,
            ease: [0.22, 1, 0.36, 1]
          }} onMouseEnter={() => setHoveredId(zone.id)} onMouseLeave={() => setHoveredId(null)} style={{
            background: isHov ? 'linear-gradient(160deg, rgba(222,50,45,0.2) 0%, rgba(247,246,243,0.06) 100%)' : 'linear-gradient(160deg, rgba(222,50,45,0.10) 0%, rgba(247,246,243,0.04) 100%)',
            border: isHov ? '1px solid rgba(222,50,45,0.45)' : '1px solid rgba(222,50,45,0.22)',
            borderRadius: '20px',
            padding: isMobile ? '24px 20px' : '36px 32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            cursor: 'default',
            transition: 'background 0.45s ease, border-color 0.4s ease, box-shadow 0.45s ease',
            boxShadow: isHov ? '0 28px 80px rgba(222,50,45,0.22), 0 4px 20px rgba(20,18,16,0.5)' : '0 8px 32px rgba(20,18,16,0.35)',
            position: 'relative',
            overflow: 'hidden',
            boxSizing: 'border-box'
          }}>
            <div aria-hidden="true" style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, #DE322D, transparent)'
            }} />
            <div aria-hidden="true" style={{
              position: 'absolute',
              top: '-20px',
              right: '-12px',
              fontFamily: 'Montserrat, sans-serif',
              fontSize: isMobile ? '64px' : 'clamp(80px, 10vw, 120px)',
              fontWeight: 800,
              letterSpacing: '-4px',
              lineHeight: 1,
              color: isHov ? 'rgba(222,50,45,0.13)' : 'rgba(222,50,45,0.07)',
              pointerEvents: 'none',
              userSelect: 'none',
              transition: 'color 0.4s ease'
            }}>{zone.index}</div>
            <div>
              <span style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '10px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: isHov ? '#ff6b5a' : '#DE322D',
                fontWeight: 500,
                transition: 'color 0.35s ease',
                display: 'block',
                marginBottom: '12px'
              }}>{zone.index}</span>
              <h3 style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: isMobile ? '17px' : 'clamp(17px, 1.6vw, 22px)',
                fontWeight: 600,
                letterSpacing: '-0.4px',
                color: isHov ? '#FFFFFF' : '#F7F6F3',
                margin: 0,
                lineHeight: 1.15
              }}>{zone.title}</h3>
            </div>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '13px',
              lineHeight: '1.78',
              color: isHov ? 'rgba(247,246,243,0.82)' : 'rgba(247,246,243,0.6)',
              margin: 0,
              fontWeight: 300,
              transition: 'color 0.35s ease',
              flex: 1
            }}>{zone.description}</p>
          </motion.div>;
        })}
      </motion.div>
    </div>
  </section>;
};

// ─── Capital Force Section ────────────────────────────────────────────────────
type FundType = {
  id: string;
  index: string;
  title: string;
  description: string;
};
const FUND_TYPES: FundType[] = [{
  id: 'ft-1',
  index: '01',
  title: 'Venture Capital Funds',
  description: 'Early to growth-stage equity investors looking for scalable, tech-enabled ventures with continental market potential.'
}, {
  id: 'ft-2',
  index: '02',
  title: 'Development Finance Institutions',
  description: 'DFIs deploying public capital to catalyse private investment, infrastructure, and enterprise development across African markets.'
}, {
  id: 'ft-3',
  index: '03',
  title: 'ESD Funds',
  description: 'Enterprise and Supplier Development funds from South African corporates committed to building inclusive supply chains and creating formal employment.'
}, {
  id: 'ft-4',
  index: '04',
  title: 'Impact Investment Funds',
  description: 'Funds seeking measurable social and environmental returns alongside financial performance, targeting SDG-aligned ventures in underserved sectors.'
}, {
  id: 'ft-5',
  index: '05',
  title: 'Private Equity & Loan Financing',
  description: 'PE funds and debt providers deploying structured capital into established businesses seeking expansion, acquisition, or working capital.'
}];
const CapitalForceSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, {
    once: true,
    margin: '-80px 0px'
  });
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const {
    isMobile,
    isTablet
  } = useBreakpoint();
  const hPad = isMobile ? '0 20px' : isTablet ? '0 40px' : '0 64px';
  const headingSize = isMobile ? 'clamp(28px, 8vw, 44px)' : isTablet ? 'clamp(32px, 5vw, 52px)' : 'clamp(36px, 4vw, 58px)';
  return <section ref={sectionRef} style={{
    background: 'linear-gradient(155deg, #F4F1EB 0%, #EDE8E0 50%, #F0EBE3 100%)',
    padding: isMobile ? '72px 0' : isTablet ? '88px 0' : '144px 0',
    width: '100%',
    boxSizing: 'border-box',
    overflow: 'hidden',
    position: 'relative'
  }}>
    <div aria-hidden="true" style={{
      position: 'absolute',
      top: '-10%',
      right: '-8%',
      width: 'clamp(300px, 55vw, 800px)',
      height: 'clamp(300px, 55vw, 800px)',
      borderRadius: '50%',
      background: 'radial-gradient(circle at 40% 40%, rgba(222,50,45,0.07) 0%, rgba(222,50,45,0.02) 45%, transparent 70%)',
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
      opacity: 0.4,
      zIndex: 0
    }} />
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: hPad,
      position: 'relative',
      zIndex: 1
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        gap: '40px',
        flexWrap: 'wrap',
        marginBottom: isMobile ? '40px' : '72px'
      }}>
        <div>
          <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={rotateFade} custom={0} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '24px'
          }}>
            <PlusSquareIconDark />
            <span style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '11px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(20,18,16,0.45)',
              fontWeight: 500
            }}>The Capital Force</span>
          </motion.div>
          <div style={{
            overflow: 'hidden'
          }}>
            <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.1} style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: headingSize,
              fontWeight: 200,
              letterSpacing: isMobile ? '-1.5px' : '-2px',
              lineHeight: 1.04,
              color: '#141210',
              margin: 0,
              maxWidth: '560px'
            }}>
              <span>{'Five categories of '}</span>
              <em style={{
                fontStyle: 'italic',
                color: '#DE322D',
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 300
              }}>{'real capital'}</em>
              <span style={{
                color: 'rgba(20,18,16,0.22)'
              }}>{' under'}</span>
              <br />
              <span style={{
                color: 'rgba(20,18,16,0.22)'
              }}>{'one roof.'}</span>
            </motion.h2>
          </div>
        </div>
        {!isMobile && <motion.p initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideFromRight} custom={0.3} style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          color: 'rgba(20,18,16,0.48)',
          maxWidth: '280px',
          lineHeight: '1.75',
          margin: 0,
          fontWeight: 300
        }}>
          Every funder present at the Summit arrives with a genuine mandate to deploy capital into Africa's next generation of entrepreneurs.
        </motion.p>}
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
        gap: '12px'
      }}>
        {FUND_TYPES.map((fund, i) => {
          const isHov = hoveredId === fund.id;
          return <motion.div key={fund.id} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={scaleReveal} custom={0.1 + i * 0.08} onMouseEnter={() => setHoveredId(fund.id)} onMouseLeave={() => setHoveredId(null)} style={{
            background: isHov ? '#141210' : '#FDFCFA',
            border: `1px solid ${isHov ? 'rgba(222,50,45,0.22)' : 'rgba(20,18,16,0.08)'}`,
            borderRadius: '20px',
            padding: isMobile ? '24px 20px' : '40px 36px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            cursor: 'default',
            position: 'relative',
            overflow: 'hidden',
            boxSizing: 'border-box',
            transition: 'background 0.55s cubic-bezier(0.22,1,0.36,1), border-color 0.45s ease, box-shadow 0.55s ease',
            boxShadow: isHov ? '0 24px 80px rgba(20,18,16,0.18)' : '0 2px 12px rgba(20,18,16,0.04)'
          }}>
            <div aria-hidden="true" style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: isHov ? 'linear-gradient(90deg, #DE322D, rgba(222,50,45,0.4))' : i < 2 ? 'linear-gradient(90deg, #DE322D, transparent)' : 'linear-gradient(90deg, rgba(20,18,16,0.1), transparent)',
              transition: 'background 0.45s ease'
            }} />
            <div style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '10px',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              fontWeight: 500,
              color: isHov ? 'rgba(247,246,243,0.35)' : 'rgba(20,18,16,0.3)',
              transition: 'color 0.4s ease'
            }}>{fund.index}</div>
            <h3 style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: isMobile ? '17px' : 'clamp(17px, 1.5vw, 21px)',
              fontWeight: 600,
              letterSpacing: '-0.4px',
              lineHeight: 1.15,
              color: isHov ? '#F7F6F3' : '#141210',
              margin: 0,
              transition: 'color 0.4s ease'
            }}>{fund.title}</h3>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '13px',
              lineHeight: '1.78',
              color: isHov ? 'rgba(247,246,243,0.52)' : 'rgba(20,18,16,0.55)',
              margin: 0,
              fontWeight: 300,
              transition: 'color 0.4s ease'
            }}>{fund.description}</p>
          </motion.div>;
        })}
      </div>
    </div>
  </section>;
};

// ─── Eligibility Section ──────────────────────────────────────────────────────
type EligCriteria = {
  id: string;
  category: string;
  title: string;
  description: string;
};
const ELIGIBILITY_CRITERIA: EligCriteria[] = [{
  id: 'el-1',
  category: 'Financial Readiness',
  title: 'Funding Readiness',
  description: 'Your business is investment-ready - you have a clear funding ask, can articulate your use of funds, and have financial records that withstand funder scrutiny. Minimum 12 months of trading history required.'
}, {
  id: 'el-2',
  category: 'Presentation Quality',
  title: 'Pitching Criteria',
  description: 'You have a compelling pitch deck, a coachable approach, and the ability to present your business clearly to a panel of active investors. All applicants undergo pre-summit pitch coaching.'
}, {
  id: 'el-3',
  category: 'Selection Process',
  title: 'Final Selection',
  description: 'Shortlisted applicants are reviewed by the EmpowaEntrepreneurs selection panel. Final selection is based on fundability, sector fit, team strength, and the depth of your growth ambition.'
}];
const EligibilitySection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, {
    once: true,
    margin: '-80px 0px'
  });
  const {
    isMobile,
    isTablet
  } = useBreakpoint();
  const hPad = isMobile ? '0 20px' : isTablet ? '0 40px' : '0 64px';
  const headingSize = isMobile ? 'clamp(28px, 8vw, 44px)' : isTablet ? 'clamp(32px, 5vw, 52px)' : 'clamp(36px, 4vw, 58px)';
  return <section ref={sectionRef} style={{
    background: '#141210',
    padding: isMobile ? '72px 0' : isTablet ? '88px 0' : '144px 0',
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
      opacity: 0.5
    }} />
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: hPad,
      position: 'relative',
      zIndex: 1
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: isMobile ? '40px' : '72px',
        flexWrap: 'wrap',
        gap: '24px'
      }}>
        <div>
          <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={rotateFade} custom={0} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '24px'
          }}>
            <PlusSquareIconLight />
            <span style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '11px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(247,246,243,0.35)',
              fontWeight: 500
            }}>Eligibility & Selection</span>
          </motion.div>
          <div style={{
            overflow: 'hidden'
          }}>
            <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.1} style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: headingSize,
              fontWeight: 200,
              letterSpacing: isMobile ? '-1.5px' : '-2.5px',
              lineHeight: 0.97,
              color: '#F7F6F3',
              margin: 0
            }}>
              <span>{'Built for '}</span>
              <em style={{
                fontStyle: 'italic',
                color: '#DE322D',
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 300
              }}>{'serious'}</em>
              <span style={{
                color: 'rgba(247,246,243,0.18)'
              }}>{' founders'}</span>
              <br />
              <span style={{
                color: 'rgba(247,246,243,0.18)'
              }}>{'only.'}</span>
            </motion.h2>
          </div>
        </div>
        <motion.p initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={isMobile ? fadeUpVariants : slideFromRight} custom={0.3} style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: isMobile ? '14px' : '15px',
          lineHeight: '1.8',
          color: 'rgba(247,246,243,0.38)',
          margin: 0,
          fontWeight: 300,
          maxWidth: '360px'
        }}>
          Selection is deliberately restrictive. Every approved entrepreneur at the Summit is there because a funder genuinely wants to meet them.
        </motion.p>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
        gap: '12px'
      }}>
        {ELIGIBILITY_CRITERIA.map((crit, i) => <motion.div key={crit.id} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={clipReveal} custom={0.2 + i * 0.1} style={{
          background: '#3c4d5d',
          borderRadius: '20px',
          padding: isMobile ? '24px 20px' : '40px 36px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: isMobile ? '200px' : '280px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div aria-hidden="true" style={{
            position: 'absolute',
            top: '-20px',
            right: '-12px',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: 'clamp(80px, 10vw, 120px)',
            fontWeight: 800,
            letterSpacing: '-4px',
            lineHeight: 1,
            color: 'rgba(247,246,243,0.04)',
            pointerEvents: 'none',
            userSelect: 'none'
          }}>{String(i + 1).padStart(2, '0')}</div>
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px'
            }}>
              <span style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '9px',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'rgba(247,246,243,0.22)',
                fontWeight: 600
              }}>{crit.category}</span>
              <span style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '9px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                fontWeight: 700,
                borderRadius: '100px',
                padding: '4px 10px',
                background: 'rgba(222,50,45,0.15)',
                border: '1px solid rgba(222,50,45,0.3)',
                color: '#DE322D'
              }}>Required</span>
            </div>
          </div>
          <div>
            <h4 style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: isMobile ? '20px' : 'clamp(20px, 2vw, 26px)',
              fontWeight: 600,
              letterSpacing: '-0.6px',
              color: '#F7F6F3',
              margin: '0 0 12px',
              lineHeight: 1.1
            }}>{crit.title}</h4>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '13px',
              lineHeight: '1.75',
              color: 'rgba(247,246,243,0.48)',
              margin: 0,
              fontWeight: 300
            }}>{crit.description}</p>
          </div>
        </motion.div>)}
      </div>
    </div>
  </section>;
};

// ─── CTA Banner Section ───────────────────────────────────────────────────────
const CTA_BUTTONS = [{
  id: 'cta-b1',
  label: 'Register Now',
  variant: 'primary' as const
}, {
  id: 'cta-b3',
  label: 'Become a Partner',
  variant: 'outline' as const
}];
const FIELD_INPUT_STYLE: React.CSSProperties = {
  width: '100%',
  background: 'rgba(247,246,243,0.06)',
  border: '1px solid rgba(247,246,243,0.12)',
  borderRadius: '10px',
  padding: '11px 16px',
  color: '#F7F6F3',
  fontFamily: 'Inter, sans-serif',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.25s ease'
};
const FIELD_LABEL_STYLE: React.CSSProperties = {
  fontFamily: 'Inter, sans-serif',
  fontSize: '11px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.12em',
  color: 'rgba(247,246,243,0.45)',
  fontWeight: 500,
  display: 'block',
  marginBottom: '6px'
};
const SUBMIT_BTN_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  background: 'linear-gradient(135deg, #DE322D 0%, #c42823 100%)',
  borderRadius: '44px',
  padding: '14px 28px',
  fontSize: '13px',
  letterSpacing: '0.05em',
  color: '#fff',
  fontFamily: 'Montserrat, sans-serif',
  fontWeight: 600,
  boxShadow: '0 8px 32px rgba(222,50,45,0.5)',
  border: 'none',
  cursor: 'pointer',
  marginTop: '8px',
  gridColumn: '1 / -1',
  width: 'fit-content'
};
const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
  e.currentTarget.style.borderColor = 'rgba(222,50,45,0.5)';
};
const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
  e.currentTarget.style.borderColor = 'rgba(247,246,243,0.12)';
};
const CtaBannerSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, {
    once: true,
    margin: '-80px 0px'
  });
  const {
    isMobile,
    isTablet
  } = useBreakpoint();
  const hPad = isMobile ? '0 20px' : isTablet ? '0 40px' : '0 64px';
  const magneticReg = useMagnetic(0.28);
  const [activeForm, setActiveForm] = useState<string | null>('cta-b1');
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [yearsInBusiness, setYearsInBusiness] = useState('');
  const [pitching, setPitching] = useState('');
  const [ticketQuantity, setTicketQuantity] = useState('1');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [absaContact, setAbsaContact] = useState('');
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('https://forms.empowaentrepreneurs.co.za/wp-json/gf/v2/forms/4/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input_49_3: firstName,
          input_49_6: lastName,
          input_1: company,
          input_27: phone,
          input_25: email,
          input_6: yearsInBusiness,
          input_44: pitching,
          input_45_3: ticketQuantity,
          input_46: paymentMethod,
          input_47: absaContact
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (e) {
        const text = await response.text();
        console.error('Failed to parse JSON. Server returned:', text);
        throw new Error('Server returned invalid JSON. Check console.');
      }

      if (data.is_valid) {
        setStatus('success');
        if (paymentMethod === 'Credit Card') {
          setTimeout(() => {
            window.location.href = 'https://www.quicket.co.za/events/312690-empowaentrepreneurs-funding-summit/';
          }, 2500);
        }
      } else {
        setStatus('error');
        setErrorMessage(data.validation_messages ? Object.entries(data.validation_messages).map(([k, v]) => `[Field ${k}]: ${v}`).join(' | ') : 'An error occurred during submission.');
      }
    } catch (error: any) {
      console.error('Submission error:', error);
      setStatus('error');
      setErrorMessage(error.message || 'A network error occurred. Please try again.');
    }
  };
  const CTA_STATS = [{
    id: 'cs-1',
    label: 'Summit Date',
    value: 'May 28, 2026',
    sub: 'EmpowaWorx House · Johannesburg'
  }, {
    id: 'cs-2',
    label: 'Registration',
    value: 'Now Open',
    sub: 'Limited seats available'
  }, {
    id: 'cs-3',
    label: 'Contact',
    value: 'summit@empowa.co',
    sub: 'Direct summit enquiries'
  }];
  const formGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
    gap: '16px',
    marginTop: '24px'
  };
  const dismissBtn = <button  style={{
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'rgba(247,246,243,0.08)',
    borderRadius: '50%',
    width: '28px',
    height: '28px',
    color: 'rgba(247,246,243,0.6)',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    lineHeight: 1,
    flexShrink: 0
  }} onMouseEnter={e => {
    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(247,246,243,0.14)';
  }} onMouseLeave={e => {
    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(247,246,243,0.08)';
  }}>
    <span>✕</span>
  </button>;
  const formWrapStyle: React.CSSProperties = {
    background: 'rgba(247,246,243,0.04)',
    border: '1px solid rgba(247,246,243,0.1)',
    borderRadius: '20px',
    padding: isMobile ? '28px 20px' : '40px 48px',
    marginTop: '24px',
    marginBottom: '8px',
    position: 'relative'
  };
  const accentBar = <div aria-hidden="true" style={{
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '3px',
    background: 'linear-gradient(180deg, #DE322D, #c42823)',
    borderRadius: '20px 0 0 20px'
  }} />;
  return <section id="registration-form" ref={sectionRef} style={{
    background: '#141210',
    padding: isMobile ? '72px 0' : isTablet ? '100px 0' : '160px 0',
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
      opacity: 0.5
    }} />
    <div aria-hidden="true" style={{
      position: 'absolute',
      top: '-20%',
      right: '-10%',
      width: 'clamp(400px, 65vw, 1000px)',
      height: 'clamp(400px, 65vw, 1000px)',
      borderRadius: '50%',
      background: 'radial-gradient(circle at 40% 40%, rgba(222,50,45,0.22) 0%, rgba(222,50,45,0.06) 45%, transparent 70%)',
      pointerEvents: 'none',
      zIndex: 0
    }} />
    <div aria-hidden="true" style={{
      position: 'absolute',
      bottom: '-4%',
      left: '-2%',
      fontFamily: 'Montserrat, sans-serif',
      fontSize: 'clamp(60px, 12vw, 220px)',
      fontWeight: 800,
      letterSpacing: '-8px',
      lineHeight: 1,
      color: 'rgba(247,246,243,0.015)',
      pointerEvents: 'none',
      userSelect: 'none',
      whiteSpace: 'nowrap',
      zIndex: 0
    }}>FUNDING SUMMIT</div>
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: hPad,
      position: 'relative',
      zIndex: 1
    }}>
      <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={rotateFade} custom={0} style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '40px'
      }}>
        <PlusSquareIconLight />
        <span style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '11px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'rgba(247,246,243,0.35)',
          fontWeight: 500
        }}>Join the Movement</span>
      </motion.div>
      <div style={{
        overflow: 'hidden',
        marginBottom: isMobile ? '20px' : '36px'
      }}>
        <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.1} style={{
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: 200,
          fontSize: 'clamp(28px, 5vw, 112px)',
          lineHeight: 0.91,
          letterSpacing: isMobile ? '-1.5px' : '-4px',
          color: '#F7F6F3',
          margin: 0
        }}>
          <span>{'Join the Capital'}</span><br />
          <em style={{
            fontStyle: 'italic',
            color: '#DE322D',
            fontWeight: 300
          }}>{'Conversation.'}</em>
        </motion.h2>
      </div>
      <motion.p initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUpVariants} custom={0.28} style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: isMobile ? '15px' : '17px',
        lineHeight: '1.8',
        color: 'rgba(247,246,243,0.5)',
        margin: '0 0 40px',
        fontWeight: 300,
        maxWidth: '520px'
      }}>
        Powering Africa's Next Generation of Entrepreneurs. Register now to secure your place at the continent's most consequential capital-access summit.
      </motion.p>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        flexDirection: isMobile ? 'column' : 'row'
      }}>
        <motion.div ref={magneticReg.ref} onMouseMove={magneticReg.handleMouseMove} onMouseLeave={magneticReg.handleMouseLeave} style={{
          x: magneticReg.springX,
          y: magneticReg.springY,
          display: 'inline-flex',
          width: isMobile ? '100%' : 'auto'
        }}>
          <motion.a href="#registration-form" onClick={e => {
            e.preventDefault();
            setActiveForm(prev => prev === 'cta-b1' ? null : 'cta-b1');
          }} whileHover={{
            scale: 1.04,
            boxShadow: '0 16px 52px rgba(222,50,45,0.8)'
          }} whileTap={{
            scale: 0.97
          }} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            background: 'linear-gradient(135deg, #DE322D 0%, #c42823 100%)',
            borderRadius: '44px',
            padding: isMobile ? '14px 22px' : '17px 34px',
            fontSize: '13px',
            letterSpacing: '0.05em',
            color: '#fff',
            textDecoration: 'none',
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 600,
            boxShadow: activeForm === 'cta-b1' ? '0 8px 36px rgba(222,50,45,0.7), 0 2px 8px rgba(222,50,45,0.4)' : '0 8px 36px rgba(222,50,45,0.55)',
            opacity: 1,
            transition: 'box-shadow 0.25s ease',
            width: isMobile ? '100%' : 'auto',
            boxSizing: 'border-box'
          }}>
            {activeForm === 'cta-b1' && <span style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: '11px',
              marginRight: '6px'
            }}>✓</span>}
            <span>Register Now</span>
            <ArrowIconDark />
          </motion.a>
        </motion.div>
        {CTA_BUTTONS.slice(1).map(btn => <motion.a key={btn.id} href="#" onClick={e => {
          e.preventDefault();
          if (btn.id === 'cta-b3') {
            window.dispatchEvent(new CustomEvent('openPartnershipModal'));
          } else {
            setActiveForm(prev => prev === btn.id ? null : btn.id);
          }
        }} whileHover={{
          scale: 1.04
        }} whileTap={{
          scale: 0.97
        }} style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          background: activeForm === btn.id ? 'linear-gradient(135deg, rgba(222,50,45,0.18) 0%, rgba(222,50,45,0.08) 100%)' : 'transparent',
          border: activeForm === btn.id ? '1px solid rgba(222,50,45,0.55)' : '1px solid rgba(247,246,243,0.22)',
          borderRadius: '44px',
          padding: isMobile ? '14px 18px' : '17px 28px',
          fontSize: '13px',
          letterSpacing: '0.04em',
          color: activeForm === btn.id ? '#F7F6F3' : 'rgba(247,246,243,0.72)',
          textDecoration: 'none',
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: 600,
          boxShadow: activeForm === btn.id ? '0 4px 20px rgba(222,50,45,0.2)' : 'none',
          transition: 'background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease, color 0.25s ease',
          width: isMobile ? '100%' : 'auto',
          boxSizing: 'border-box'
        }} onMouseEnter={e => {
          const el = e.currentTarget as HTMLAnchorElement;
          if (activeForm !== btn.id) {
            el.style.borderColor = 'rgba(247,246,243,0.5)';
            el.style.color = '#F7F6F3';
          }
        }} onMouseLeave={e => {
          const el = e.currentTarget as HTMLAnchorElement;
          if (activeForm !== btn.id) {
            el.style.borderColor = 'rgba(247,246,243,0.22)';
            el.style.color = 'rgba(247,246,243,0.72)';
          }
        }}><span>{btn.label}</span></motion.a>)}
      </div>

      <AnimatePresence mode="wait">
        {activeForm === 'cta-b1' && <motion.div key="form-cta-b1" initial={{
          opacity: 0,
          y: -16,
          filter: 'blur(8px)'
        }} animate={{
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          transition: {
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1]
          }
        }} exit={{
          opacity: 0,
          y: -10,
          filter: 'blur(6px)',
          transition: {
            duration: 0.3
          }
        }} style={formWrapStyle}>
          {accentBar}
          {dismissBtn}
          <h3 style={{
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 700,
            fontSize: '18px',
            color: '#F7F6F3',
            margin: '0 0 8px'
          }}>Register for the Summit</h3>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            color: 'rgba(247,246,243,0.5)',
            margin: '0 0 20px'
          }}>Secure your seat at EmpowaEntrepreneurs Funding Summit 2026</p>

          {status === 'success' ? (
            <div style={{ padding: '24px 0', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <svg width="18" height="13" viewBox="0 0 22 16" fill="none"><path d="M1 8L8 15L21 1" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <h4 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '18px', fontWeight: 600, color: '#F7F6F3', margin: '0 0 8px' }}>Registration Received</h4>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'rgba(247,246,243,0.5)', margin: 0 }}>
                {paymentMethod === 'Credit Card' 
                  ? 'Thank you! Redirecting you to Quicket to complete your ticket purchase...'
                  : 'Thank you! We will be in touch with your invoice and event details.'}
              </p>
            </div>
          ) : (
            <>
              {status === 'error' && (
                <div style={{ marginBottom: '20px', padding: '12px', background: 'rgba(222,50,45,0.1)', border: '1px solid rgba(222,50,45,0.2)', borderRadius: '8px', color: '#DE322D', fontSize: '13px', fontFamily: 'Inter, sans-serif' }}>
                  {errorMessage}
                </div>
              )}
              <form onSubmit={handleSubmit} style={formGridStyle}>
                <div style={{ gridColumn: isMobile ? 'span 1' : 'span 2' }}>
                  <label style={{...FIELD_LABEL_STYLE, marginBottom: '0'}}>Name of Owner</label>
                </div>
                <div>
                  <input type="text" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} required style={FIELD_INPUT_STYLE} onFocus={handleFocus} onBlur={handleBlur} disabled={status === 'loading'} />
                </div>
                <div>
                  <input type="text" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} required style={FIELD_INPUT_STYLE} onFocus={handleFocus} onBlur={handleBlur} disabled={status === 'loading'} />
                </div>

                <div>
                  <label style={FIELD_LABEL_STYLE}>Email</label>
                  <input type="email" placeholder="info@empowaentrepreneurs.co.za" value={email} onChange={e => setEmail(e.target.value)} required style={FIELD_INPUT_STYLE} onFocus={handleFocus} onBlur={handleBlur} disabled={status === 'loading'} />
                </div>
                <div>
                  <label style={FIELD_LABEL_STYLE}>Cell Phone</label>
                  <input type="tel" placeholder="+27 00 000 0000" value={phone} onChange={e => setPhone(e.target.value)} required style={FIELD_INPUT_STYLE} onFocus={handleFocus} onBlur={handleBlur} disabled={status === 'loading'} />
                </div>

                <div>
                  <label style={FIELD_LABEL_STYLE}>Name of Company</label>
                  <input type="text" placeholder="Your company name" value={company} onChange={e => setCompany(e.target.value)} required style={FIELD_INPUT_STYLE} onFocus={handleFocus} onBlur={handleBlur} disabled={status === 'loading'} />
                </div>
                <div>
                  <label style={FIELD_LABEL_STYLE}>Number of Tickets (R1,250.00 each)</label>
                  <input type="number" min="1" placeholder="e.g. 2" value={ticketQuantity} onChange={e => setTicketQuantity(e.target.value)} required style={FIELD_INPUT_STYLE} onFocus={handleFocus} onBlur={handleBlur} disabled={status === 'loading'} />
                </div>

                <div style={{ gridColumn: isMobile ? 'span 1' : 'span 2', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', paddingTop: '8px' }}>
                  <div>
                    <label style={{...FIELD_LABEL_STYLE, marginBottom: '10px'}}>Years in Business</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {['1-5', '5-10', '10+'].map(option => (
                        <label key={option} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#F7F6F3', cursor: 'pointer' }}>
                          <input type="radio" name="yearsInBusiness-cta" value={option} checked={yearsInBusiness === option} onChange={e => setYearsInBusiness(e.target.value)} disabled={status === 'loading'} style={{ accentColor: '#DE322D', width: '15px', height: '15px', cursor: 'pointer', margin: 0 }} />
                          {option}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={{...FIELD_LABEL_STYLE, marginBottom: '10px', textTransform: 'none', letterSpacing: '0.02em', fontSize: '11px', color: '#F7F6F3', fontWeight: 500}}>I would like to pitch at the EmpowaEntrepreneurs Pitching Festival</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {['Yes', 'No'].map(option => (
                        <label key={option} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#F7F6F3', cursor: 'pointer' }}>
                          <input type="radio" name="pitching-cta" value={option} checked={pitching === option} onChange={e => setPitching(e.target.value)} disabled={status === 'loading'} style={{ accentColor: '#DE322D', width: '15px', height: '15px', cursor: 'pointer', margin: 0 }} />
                          {option}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={{...FIELD_LABEL_STYLE, marginBottom: '10px'}}>Payment Method</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {['EFT (Generate Invoice)', 'Credit Card'].map(option => (
                        <label key={option} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#F7F6F3', cursor: 'pointer' }}>
                          <input type="radio" name="paymentMethod-cta" value={option} checked={paymentMethod === option} onChange={e => setPaymentMethod(e.target.value)} disabled={status === 'loading'} style={{ accentColor: '#DE322D', width: '15px', height: '15px', cursor: 'pointer', margin: 0 }} />
                          {option}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={{...FIELD_LABEL_STYLE, marginBottom: '10px', textTransform: 'none', letterSpacing: '0.02em', fontSize: '11px', color: '#F7F6F3', fontWeight: 500}}>Would you like ABSA to contact you concerning your Small Business Services?</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {['Yes', 'No'].map(option => (
                        <label key={option} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#F7F6F3', cursor: 'pointer' }}>
                          <input type="radio" name="absaContact-cta" value={option} checked={absaContact === option} onChange={e => setAbsaContact(e.target.value)} disabled={status === 'loading'} style={{ accentColor: '#DE322D', width: '15px', height: '15px', cursor: 'pointer', margin: 0 }} />
                          {option}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={status === 'loading'} style={{...SUBMIT_BTN_STYLE, opacity: status === 'loading' ? 0.7 : 1, cursor: status === 'loading' ? 'not-allowed' : 'pointer'}}>
                  <span>{status === 'loading' ? 'Processing...' : 'Complete Registration'}</span>
                </button>
              </form>
            </>
          )}
        </motion.div>}
      </AnimatePresence>

      <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={lineWipe} custom={0.55} style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
        gap: '1px',
        paddingTop: '40px',
        marginTop: '64px',
        borderTop: '0.8px solid rgba(247,246,243,0.07)',
        transformOrigin: 'left'
      }}>
        {CTA_STATS.map((item, i) => <div key={item.id} style={{
          padding: isMobile ? '16px 12px' : '28px 32px',
          borderLeft: !isMobile && i > 0 ? '0.8px solid rgba(247,246,243,0.07)' : isMobile && i === 1 ? '0.8px solid rgba(247,246,243,0.07)' : 'none',
          borderTop: isMobile && i >= 2 ? '0.8px solid rgba(247,246,243,0.07)' : 'none',
          paddingLeft: !isMobile && i === 0 ? '0' : undefined
        }}>
          <div style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '9px',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'rgba(247,246,243,0.25)',
            fontWeight: 600,
            marginBottom: '8px'
          }}>{item.label}</div>
          <div style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: isMobile ? '13px' : '17px',
            fontWeight: 300,
            letterSpacing: '-0.4px',
            color: '#F7F6F3',
            marginBottom: '4px'
          }}>{item.value}</div>
          <div style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '11px',
            color: 'rgba(247,246,243,0.28)',
            letterSpacing: '0.02em'
          }}>{item.sub}</div>
        </div>)}
      </motion.div>
    </div>
  </section>;
};

// ─── Site Footer ──────────────────────────────────────────────────────────────
const FOOTER_COLS = [{
  id: 'fc-1',
  heading: 'Summit',
  links: [{
    id: 'fl-1',
    label: 'About'
  }, {
    id: 'fl-2',
    label: 'Programme'
  }, {
    id: 'fl-3',
    label: 'Experience Zones'
  }, {
    id: 'fl-4',
    label: 'Funding Summit'
  }]
}, {
  id: 'fc-2',
  heading: 'Participate',
  links: [{
    id: 'fl-5',
    label: 'Apply to Attend'
  }, {
    id: 'fl-6',
    label: 'Apply to Pitch'
  }, {
    id: 'fl-7',
    label: 'Become a Funder'
  }, {
    id: 'fl-8',
    label: 'Partnerships'
  }]
}, {
  id: 'fc-3',
  heading: 'Company',
  links: [{
    id: 'fl-9',
    label: 'Contact Us'
  }, {
    id: 'fl-10',
    label: 'Media Kit'
  }, {
    id: 'fl-11',
    label: 'FAQs'
  }, {
    id: 'fl-12',
    label: 'Register Now'
  }]
}];
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
  const footerHeroFontSize = isMobile ? 'clamp(28px, 9vw, 56px)' : isTablet ? 'clamp(40px, 7vw, 72px)' : 'clamp(56px, 6.5vw, 96px)';
  const footerHeroLetterSpacing = isMobile ? '-1.5px' : isTablet ? '-2.5px' : '-3.5px';
  return <footer ref={footerRef} style={{
    background: '#0A0906',
    width: '100%',
    boxSizing: 'border-box',
    overflow: 'hidden',
    position: 'relative'
  }}>
    <div style={{
      position: 'relative',
      width: '100%',
      minHeight: isMobile ? '280px' : isTablet ? '380px' : '520px',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'flex-end',
      background: '#141210'
    }}>
      <div aria-hidden="true" style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, #0A0906 0%, rgba(10,9,6,0.7) 50%, rgba(10,9,6,0.1) 100%)',
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
        background: 'radial-gradient(circle, rgba(222,50,45,0.25) 0%, transparent 65%)',
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
      <div style={{
        position: 'relative',
        zIndex: 2,
        width: '100%',
        padding: isMobile ? '0 20px 36px' : isTablet ? '0 40px 48px' : '0 64px 72px',
        boxSizing: 'border-box',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={rotateFade} custom={0} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <PlusSquareIconLight />
          <span style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: isMobile ? '10px' : '12px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(247,246,243,0.4)',
            fontWeight: 600
          }}>Funding Summit 2026 · Africa's Capital Access Platform</span>
        </motion.div>
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'flex-end',
          justifyContent: 'space-between',
          gap: isMobile ? '24px' : '40px'
        }}>
          <div style={{
            overflow: 'hidden',
            flex: 1
          }}>
            <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.08} style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: footerHeroFontSize,
              fontWeight: 700,
              letterSpacing: footerHeroLetterSpacing,
              lineHeight: 0.9,
              color: '#F7F6F3',
              margin: 0,
              textTransform: 'uppercase'
            }}>
              <span>Join</span><br />
              <em style={{
                fontStyle: 'italic',
                color: '#DE322D',
                fontWeight: 400
              }}>The Summit.</em>
              <br />
              <span style={{
                color: 'rgba(247,246,243,0.18)',
                fontWeight: 300
              }}>May 2026.</span>
            </motion.h2>
          </div>
          <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={isMobile ? fadeUpVariants : slideFromRight} custom={0.22} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            width: isMobile ? '100%' : isTablet ? '200px' : '240px'
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
              boxShadow: '0 8px 40px rgba(222,50,45,0.5)',
              width: '100%',
              boxSizing: 'border-box'
            }}><span>Register Now</span><ArrowIconDark /></motion.a>
            <motion.a href="#" onClick={e => e.preventDefault()} whileHover={{
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
              transition: 'border-color 0.3s ease, color 0.3s ease',
              width: '100%',
              boxSizing: 'border-box'
            }} onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.borderColor = 'rgba(247,246,243,0.5)';
              el.style.color = '#F7F6F3';
            }} onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.borderColor = 'rgba(247,246,243,0.22)';
              el.style.color = 'rgba(247,246,243,0.65)';
            }}>
              <span>Apply to Attend</span>
            </motion.a>
          </motion.div>
        </div>
      </div>
    </div>

    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: isMobile ? '32px 20px 0' : isTablet ? '44px 40px 0' : '64px 64px 0',
      boxSizing: 'border-box'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        gap: '40px',
        paddingBottom: '40px',
        borderBottom: '1px solid rgba(247,246,243,0.07)'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          maxWidth: isMobile ? '100%' : isTablet ? '200px' : '280px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #DE322D, #ff5a4f)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(222,50,45,0.4)',
              flexShrink: 0
            }}>
              <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
                <path d="M6 1L7.5 4.5L11 5L8.5 7.5L9 11L6 9.5L3 11L3.5 7.5L1 5L4.5 4.5L6 1Z" fill="white" />
              </svg>
            </div>
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
            Africa's premier capital-access summit. Where vetted entrepreneurs meet high-impact funders.
          </p>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
          gap: isMobile ? '24px 16px' : isTablet ? '24px 20px' : '0',
          flex: 1,
          maxWidth: isMobile ? '100%' : isTablet ? '100%' : '600px'
        }}>
          {FOOTER_COLS.map((col, colIdx) => <div key={col.id} style={{
            paddingLeft: !isMobile && !isTablet && colIdx > 0 ? '40px' : '0',
            borderLeft: !isMobile && !isTablet && colIdx > 0 ? '1px solid rgba(247,246,243,0.06)' : 'none'
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
              gap: '10px'
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
                }}>{link.label}</a>
              </li>)}
            </ul>
          </div>)}
        </div>
      </div>
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'center' : 'center',
        gap: '12px',
        padding: '20px 0 32px',
        textAlign: isMobile ? 'center' : 'left'
      }}>
        <span style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '11px',
          color: 'rgba(247,246,243,0.1)',
          letterSpacing: '0.04em'
        }}>© 2026 EmpowaEntrepreneurs. All rights reserved.</span>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          flexWrap: 'wrap',
          justifyContent: isMobile ? 'center' : 'flex-end'
        }}>
          {[{
            id: 'leg-priv',
            label: 'Privacy Policy'
          }, {
            id: 'leg-terms',
            label: 'Terms of Service'
          }, {
            id: 'leg-cookie',
            label: 'Cookie Settings'
          }].map(item => <a key={item.id} href="#" onClick={e => e.preventDefault()} style={{
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
          }}>{item.label}</a>)}
        </div>
      </div>
    </div>
  </footer>;
};

// ─── Past Speakers Section ────────────────────────────────────────────────────
type SummitSpeaker = {
  id: string;
  name: string;
  role: string;
  company: string;
  topic: string;
  tag: string;
  accentColor: string;
  imageSrc: string;
  year: string;
};
const SPEAKER_TAG_COLORS: Record<string, string> = {
  'Keynote': 'rgba(222,50,45,0.18)',
  'Panel': 'rgba(59,78,95,0.22)',
  'Fire Chat': 'rgba(45,106,79,0.22)',
  'Masterclass': 'rgba(107,94,74,0.22)'
};
const SPEAKER_TAB_ACCENT: Record<string, string> = {
  'All': '#DE322D',
  'Keynote': '#DE322D',
  'Panel': '#3B4E5F',
  'Fire Chat': '#2D6A4F',
  'Masterclass': '#6B5E4A'
};
const SUMMIT_SPEAKERS: SummitSpeaker[] = [{
  id: 'sp-1',
  name: 'Gregg Barrett',
  role: 'CEO',
  company: 'Cirrus',
  topic: 'Digital Innovation & Business Growth',
  tag: 'Keynote',
  accentColor: '#DE322D',
  imageSrc: '/speakers/Greg-Barrett.jpg',
  year: '2025'
}, {
  id: 'sp-2',
  name: 'Hlengiwe Makhathini',
  role: 'Group CIO',
  company: 'IDF Capital',
  topic: 'Development Finance & Capital Deployment',
  tag: 'Fire Chat',
  accentColor: '#2D6A4F',
  imageSrc: '/speakers/Hlengiwe-Makhathini.jpg',
  year: '2025'
}, {
  id: 'sp-3',
  name: 'Ian Fuhr',
  role: 'Founder',
  company: 'Sorbet Group',
  topic: 'Entrepreneurship, Franchising & Scale',
  tag: 'Keynote',
  accentColor: '#DE322D',
  imageSrc: '/speakers/Ian-Fuhr.jpg',
  year: '2025'
}, {
  id: 'sp-4',
  name: 'Simphiwe Masiza',
  role: 'CEO & Founder',
  company: 'EmpowaWorx',
  topic: 'EmpowaEntrepreneurs Vision & Capital Access Mission',
  tag: 'Keynote',
  accentColor: '#DE322D',
  imageSrc: '/speakers/Simphiwe-Masiza.jpg',
  year: '2025'
}, {
  id: 'sp-5',
  name: 'Niall Gahan',
  role: 'Head of Enterprisefund',
  company: 'Enterpriseroom',
  topic: 'Enterprise Development & Supply Chain Capital',
  tag: 'Masterclass',
  accentColor: '#6B5E4A',
  imageSrc: '/speakers/Niall-Gahan.jpg',
  year: '2025'
}, {
  id: 'sp-6',
  name: 'Bongani Ntombela',
  role: 'Executive: Programmes',
  company: '22 On Sloane',
  topic: 'ESD & Supplier Development Capital',
  tag: 'Panel',
  accentColor: '#3B4E5F',
  imageSrc: '/speakers/Bongani-Ntombela.jpg',
  year: '2025'
}, {
  id: 'sp-7',
  name: 'Mitchan Adams',
  role: 'Partner & Venture Advisor',
  company: 'Savant',
  topic: 'Venture Capital & Startup Funding',
  tag: 'Panel',
  accentColor: '#3B4E5F',
  imageSrc: '/speakers/Mitchan-Adams.png',
  year: '2025'
}, {
  id: 'sp-8',
  name: 'Sihle Gumede',
  role: 'Investment Director',
  company: 'Sanari Capital',
  topic: 'Venture Capital & Impact Investment',
  tag: 'Panel',
  accentColor: '#3B4E5F',
  imageSrc: '/speakers/Sihle-Gumede.jpg',
  year: '2025'
}, {
  id: 'sp-9',
  name: 'Milton Nkosi',
  role: 'Programme Director',
  company: 'EmpowaEntrepreneurs',
  topic: 'Loan Finance & Programme Direction',
  tag: 'Panel',
  accentColor: '#3B4E5F',
  imageSrc: '/speakers/Milton-Nkosi.jpg',
  year: '2025'
}, {
  id: 'sp-10',
  name: 'Khanyi Mlambo',
  role: 'Programme Director',
  company: 'EmpowaEntrepreneurs',
  topic: 'Impact Fund & Private Equity Conversations',
  tag: 'Panel',
  accentColor: '#3B4E5F',
  imageSrc: '/speakers/Khanyi-Mlambo.jpg',
  year: '2025'
}];
const SPEAKER_TABS = [{
  id: 'tab-all',
  label: 'All'
}, {
  id: 'tab-keynote',
  label: 'Keynote'
}, {
  id: 'tab-panel',
  label: 'Panel'
}, {
  id: 'tab-fc',
  label: 'Fire Chat'
}, {
  id: 'tab-mc',
  label: 'Masterclass'
}];
export const PastSpeakersSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const {
    isMobile,
    isTablet
  } = useBreakpoint();
  const [activeTab, setActiveTab] = useState('All');
  const [activeIdx, setActiveIdx] = useState(0);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const cardWidth = isMobile ? 240 : isTablet ? 280 : 300;
  const photoHeight = isMobile ? 180 : isTablet ? 200 : 220;
  const cardGap = 16;
  const filteredSpeakers = activeTab === 'All' ? SUMMIT_SPEAKERS : SUMMIT_SPEAKERS.filter(s => s.tag === activeTab);
  const scrollToIdx = (idx: number) => {
    setActiveIdx(idx);
    if (trackRef.current) {
      trackRef.current.scrollTo({
        left: idx * (cardWidth + cardGap),
        behavior: 'smooth'
      });
    }
  };
  const handlePrev = () => scrollToIdx(Math.max(0, activeIdx - 1));
  const handleNext = () => scrollToIdx(Math.min(filteredSpeakers.length - 1, activeIdx + 1));
  const hPad = isMobile ? '0 20px' : isTablet ? '0 40px' : '0 64px';
  const sectionBgFade = '#EDE8E0';
  return <section ref={sectionRef} style={{
    background: 'linear-gradient(155deg, #F4F1EB 0%, #EDE8E0 50%, #F0EBE3 100%)',
    paddingTop: isMobile ? '72px' : isTablet ? '88px' : '110px',
    paddingBottom: isMobile ? '72px' : isTablet ? '88px' : '110px',
    width: '100%',
    boxSizing: 'border-box',
    overflow: 'hidden',
    position: 'relative'
  }}>
    <div aria-hidden="true" style={{
      position: 'absolute',
      top: '-10%',
      right: '-8%',
      width: 'clamp(300px, 55vw, 800px)',
      height: 'clamp(300px, 55vw, 800px)',
      borderRadius: '50%',
      background: 'radial-gradient(circle at 40% 40%, rgba(222,50,45,0.07) 0%, rgba(222,50,45,0.02) 45%, transparent 70%)',
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
      opacity: 0.4,
      zIndex: 0
    }} />

    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: hPad,
      position: 'relative',
      zIndex: 1
    }}>
      {/* Header Row - stack on mobile */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'flex-start' : 'flex-end',
        marginBottom: '32px',
        gap: isMobile ? '20px' : '24px'
      }}>
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '16px'
          }}>
            <PlusSquareIconDark />
            <span style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '11px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(20,18,16,0.4)',
              fontWeight: 500
            }}>
              Featured Speakers
            </span>
          </div>
          <h2 style={{
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 200,
            fontSize: isMobile ? 'clamp(32px, 8vw, 52px)' : 'clamp(36px, 5vw, 64px)',
            letterSpacing: isMobile ? '-2px' : '-3px',
            color: '#141210',
            lineHeight: 1.0,
            margin: '0 0 14px'
          }}>
            <span>{'Voices Shaping '}</span>
            <em style={{
              fontStyle: 'italic',
              color: '#DE322D',
              fontWeight: 300
            }}>
              {'the Future.'}
            </em>
          </h2>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 300,
            fontSize: '14px',
            color: 'rgba(20,18,16,0.5)',
            lineHeight: 1.7,
            maxWidth: '520px',
            margin: 0
          }}>
            An elite lineup of investors, funders, founders and ecosystem builders who have taken the stage at EmpowaEntrepreneurs Funding Summits past.
          </p>
        </div>

        {/* Prev / Next buttons - shown below heading on mobile */}
        <div style={{
          display: 'flex',
          gap: '8px',
          flexShrink: 0
        }}>
          <motion.button onClick={handlePrev} disabled={activeIdx === 0} whileHover={activeIdx === 0 ? {} : {
            scale: 1.08
          }} whileTap={activeIdx === 0 ? {} : {
            scale: 0.94
          }} style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            border: '1px solid rgba(20,18,16,0.14)',
            background: activeIdx === 0 ? 'rgba(20,18,16,0.03)' : 'rgba(20,18,16,0.06)',
            opacity: activeIdx === 0 ? 0.4 : 1,
            cursor: activeIdx === 0 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="rgba(20,18,16,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.button>
          <motion.button onClick={handleNext} disabled={activeIdx === filteredSpeakers.length - 1} whileHover={activeIdx === filteredSpeakers.length - 1 ? {} : {
            scale: 1.08
          }} whileTap={activeIdx === filteredSpeakers.length - 1 ? {} : {
            scale: 0.94
          }} style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            border: '1px solid rgba(20,18,16,0.14)',
            background: activeIdx === filteredSpeakers.length - 1 ? 'rgba(20,18,16,0.03)' : 'rgba(20,18,16,0.06)',
            opacity: activeIdx === filteredSpeakers.length - 1 ? 0.4 : 1,
            cursor: activeIdx === filteredSpeakers.length - 1 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 3L11 8L6 13" stroke="rgba(20,18,16,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Filter Tabs Row - horizontal scroll on mobile */}
      <div ref={tabsRef} style={{
        display: 'flex',
        gap: '8px',
        flexWrap: isMobile ? 'nowrap' : 'wrap',
        overflowX: isMobile ? 'auto' : 'visible',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'],
        marginBottom: '28px',
        paddingBottom: isMobile ? '4px' : '0'
      }}>
        {SPEAKER_TABS.map(tab => {
          const isActive = activeTab === tab.label;
          const tabAccent = SPEAKER_TAB_ACCENT[tab.label] || '#DE322D';
          const tabCount = tab.label === 'All' ? SUMMIT_SPEAKERS.length : SUMMIT_SPEAKERS.filter(s => s.tag === tab.label).length;
          return <motion.button key={tab.id} onClick={() => {
            setActiveTab(tab.label);
            setActiveIdx(0);
            if (trackRef.current) {
              trackRef.current.scrollLeft = 0;
            }
          }} whileHover={{
            scale: 1.03
          }} whileTap={{
            scale: 0.97
          }} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: isActive ? tabAccent : 'rgba(20,18,16,0.04)',
            color: isActive ? '#fff' : 'rgba(20,18,16,0.55)',
            border: isActive ? 'none' : '1px solid rgba(20,18,16,0.1)',
            borderRadius: '100px',
            padding: '8px 14px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            fontWeight: isActive ? 600 : 500,
            cursor: 'pointer',
            flexShrink: 0,
            whiteSpace: 'nowrap'
          }}>
            <span>{tab.label}</span>
            <span style={{
              borderRadius: '100px',
              padding: '1px 7px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              fontSize: '10px',
              background: isActive ? 'rgba(255,255,255,0.25)' : 'rgba(20,18,16,0.08)',
              color: isActive ? '#fff' : 'rgba(20,18,16,0.45)'
            }}>
              {tabCount}
            </span>
          </motion.button>;
        })}
      </div>
    </div>

    {/* Full-width scrollable track */}
    <div style={{
      width: '100vw',
      marginLeft: 'calc(-50vw + 50%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Left fade mask */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '60px',
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
        width: '60px',
        height: '100%',
        background: `linear-gradient(to left, ${sectionBgFade}, transparent)`,
        zIndex: 2,
        pointerEvents: 'none'
      }} />
      {/* Scrollable track */}
      <div ref={trackRef} style={{
        overflowX: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'],
        cursor: 'grab',
        userSelect: 'none',
        padding: isMobile ? '0 20px' : '0 64px'
      }}>
        <div style={{
          display: 'flex',
          gap: '16px',
          width: 'max-content',
          padding: '16px 0 32px'
        }}>
          {filteredSpeakers.map(speaker => {
            const isHov = hoveredId === speaker.id;
            return <motion.article key={speaker.id} onMouseEnter={() => setHoveredId(speaker.id)} onMouseLeave={() => setHoveredId(null)} style={{
              flexShrink: 0,
              width: `${cardWidth}px`,
              borderRadius: '20px',
              overflow: 'hidden',
              background: '#FFFFFF',
              border: `1px solid ${isHov ? 'rgba(20,18,16,0.14)' : 'rgba(20,18,16,0.07)'}`,
              transition: 'border-color 0.3s ease, box-shadow 0.4s ease, transform 0.4s ease',
              boxShadow: isHov ? '0 32px 80px rgba(20,18,16,0.18)' : '0 4px 20px rgba(20,18,16,0.07)',
              transform: isHov ? 'translateY(-10px)' : 'translateY(0)'
            }}>
              {/* Photo Area */}
              <div style={{
                height: `${photoHeight}px`,
                overflow: 'hidden',
                position: 'relative'
              }}>
                <img src={speaker.imageSrc} alt={speaker.name} style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'brightness(0.82) saturate(0.8)',
                  transform: isHov ? 'scale(1.07)' : 'scale(1)',
                  transition: 'transform 0.8s cubic-bezier(0.22,1,0.36,1)',
                  display: 'block'
                }} />
                {/* Bottom gradient overlay */}
                <div aria-hidden="true" style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(10,9,8,0.5) 0%, transparent 55%)',
                  pointerEvents: 'none'
                }} />
                {/* Tag badge */}
                <div style={{
                  position: 'absolute',
                  top: '14px',
                  left: '14px',
                  background: SPEAKER_TAG_COLORS[speaker.tag] || 'rgba(20,18,16,0.15)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  border: `1px solid ${speaker.accentColor}44`,
                  borderRadius: '100px',
                  padding: '4px 10px',
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '10px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'rgba(20,18,16,0.65)',
                  fontWeight: 500
                }}>
                  {speaker.tag}
                </div>
                {/* Year badge */}
                <div style={{
                  position: 'absolute',
                  bottom: '14px',
                  right: '14px',
                  background: 'rgba(0,0,0,0.5)',
                  backdropFilter: 'blur(6px)',
                  WebkitBackdropFilter: 'blur(6px)',
                  borderRadius: '100px',
                  padding: '3px 10px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '10px',
                  color: '#fff',
                  fontWeight: 500,
                  letterSpacing: '0.06em'
                }}>
                  {speaker.year}
                </div>
                {/* Bottom accent line */}
                <div aria-hidden="true" style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: `linear-gradient(90deg, ${speaker.accentColor}, transparent)`,
                  opacity: isHov ? 1 : 0.4,
                  transition: 'opacity 0.3s ease'
                }} />
              </div>

              {/* Info Area */}
              <div style={{
                padding: '20px 20px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                background: '#FFFFFF'
              }}>
                <div>
                  <h3 style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: isMobile ? '16px' : '19px',
                    fontWeight: 500,
                    letterSpacing: '-0.4px',
                    color: '#141210',
                    margin: '0 0 5px',
                    lineHeight: 1.2
                  }}>
                    {speaker.name}
                  </h3>
                  <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                    color: 'rgba(20,18,16,0.45)',
                    margin: 0,
                    letterSpacing: '0.02em'
                  }}>
                    <span>{speaker.role}</span>
                    <span style={{
                      color: 'rgba(20,18,16,0.2)',
                      margin: '0 6px'
                    }}>·</span>
                    <span>{speaker.company}</span>
                  </p>
                </div>

                {/* Speaking On box */}
                <div style={{
                  background: '#F7F6F3',
                  borderRadius: '10px',
                  padding: '10px 14px'
                }}>
                  <div style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '10px',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'rgba(20,18,16,0.3)',
                    marginBottom: '5px',
                    fontWeight: 500
                  }}>
                    Speaking On
                  </div>
                  <div style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: isMobile ? '13px' : '14px',
                    color: 'rgba(20,18,16,0.72)',
                    lineHeight: 1.5,
                    letterSpacing: '-0.1px'
                  }}>
                    {speaker.topic}
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
                    gap: '8px'
                  }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: speaker.accentColor,
                      flexShrink: 0
                    }} />
                    <span style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '12px',
                      color: 'rgba(20,18,16,0.45)',
                      letterSpacing: '0.02em'
                    }}>
                      Summit {speaker.year}
                    </span>
                  </div>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    background: 'rgba(20,18,16,0.05)',
                    border: '1px solid rgba(20,18,16,0.08)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 10L10 2M10 2H4M10 2V8" stroke="rgba(20,18,16,0.4)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.article>;
          })}
        </div>
      </div>
    </div>
  </section>;
};

// ─── Event Programme Section ──────────────────────────────────────────────────
type ProgrammeSession = {
  time: string;
  session: string;
  speakers: string[];
  role: string;
  topic: string;
  isBreak: boolean;
};
const ARENA_TABS: string[] = ['Opening & Keynotes', 'Equity & Growth Capital', 'Debt & Structured Finance', 'Impact, Inclusion & Women\'s Capital', 'Enterprise & Ecosystem Development'];
const ARENA_SESSIONS: ProgrammeSession[][] = [[{
  time: '07:30–08:30',
  session: 'Arrival, Registration & Networking Experience',
  speakers: ['All Delegates'],
  role: '',
  topic: 'Registration · Networking · Exhibition Engagement',
  isBreak: true
}, {
  time: '08:30–08:45',
  session: 'Exhibition Preview & Deal Desk Walkthrough',
  speakers: ['Investment & Ecosystem Teams'],
  role: '',
  topic: 'Exhibition Preview · Investor Networking · Deal Rooms',
  isBreak: true
}, {
  time: '08:45–09:00',
  session: 'Welcoming Remarks & Housekeeping',
  speakers: ['Programme Director'],
  role: '',
  topic: 'Event Flow · Housekeeping · Delegate Experience',
  isBreak: false
}, {
  time: '09:00–09:10',
  session: 'Official Welcome Address',
  speakers: ['Mr Simphiwe Masiza'],
  role: 'CEO & Founder, EmpowaWorx',
  topic: 'EmpowaWorx Vision · Capital Access Mission · 2026 Summit Purpose',
  isBreak: false
}, {
  time: '09:10–09:20',
  session: 'Strategic Partner Opening Address',
  speakers: ['ABSA Representative'],
  role: '',
  topic: '',
  isBreak: false
}, {
  time: '09:20–09:25',
  session: 'Strategic Partner Address',
  speakers: ['WR&SETA Representative'],
  role: '',
  topic: '',
  isBreak: false
}, {
  time: '09:25–09:30',
  session: 'Partner Address',
  speakers: ['Ndumiso Zulu'],
  role: 'CEO, Masisizane Fund: Old Mutual',
  topic: '',
  isBreak: false
}, {
  time: '09:30–10:00',
  session: 'Executive Fire Chat',
  speakers: ['Allon Raiz', 'Raj Dass'],
  role: 'CEO, Raizcorp · Founder/Managing Partner, Dass Capital',
  topic: 'The Full Equity Spectrum: From Seed to Buyout',
  isBreak: false
}], [{
  time: '10:00–10:20',
  session: 'Comfort Break, Exhibition & Investor Networking',
  speakers: [''],
  role: '',
  topic: 'Investor Matchmaking · Exhibition · Networking',
  isBreak: true
}, {
  time: '10:20–11:05',
  session: 'Executive Panel Discussion',
  speakers: ['Thabelo Ratshihule', 'Tyrone Moodley', 'Francisco Da Silva', 'Sherwin Sampson', 'Sihle Gumede'],
  role: 'CEO Savant Foundry · Principal HAVAIC · CEO Sizoba Group · Group CEO Samfield Capital · Investment Director Sanari Capital',
  topic: 'Venture Vision to Equity Evolution: What VCs & PE Funds Actually Back in 2026',
  isBreak: false
}, {
  time: '11:05–11:30',
  session: 'Strategic Workshop',
  speakers: ['Dion Mhlaba'],
  role: 'Executive Director, Energy Venture Capital',
  topic: 'Capital Crossroads: What Unlocks Equity & What Kills the Deal',
  isBreak: false
}, {
  time: '11:30–11:50',
  session: 'Networking & Deal-Making Sessions',
  speakers: ['Delegates & Investors'],
  role: '',
  topic: 'Investor Matchmaking · Exhibition · Networking',
  isBreak: true
}], [{
  time: '11:50–12:10',
  session: 'Executive Fire Chat',
  speakers: ['Hlengiwe Makhathini', 'ABSA Representative'],
  role: 'Group CIO, IDF Capital',
  topic: 'The DFI Mandate: Development Capital & Commercial Lending',
  isBreak: false
}, {
  time: '12:10–12:55',
  session: 'Executive Panel Discussion',
  speakers: ['Mokgome Mogoba', 'TBC (GEP CEO)', 'ABSA Representative', 'Mr. Mziwabantu Dayimani', 'Rajiv Daya'],
  role: 'Founder Kholo Capital · CEO GEP · CEO NEF · Head of Investments Keyo Ventures',
  topic: 'The Full Debt Stack: From DFI Facilities to Commercial Loans',
  isBreak: false
}, {
  time: '12:55–13:20',
  session: 'Strategic Masterclass',
  speakers: ['Brian Moyo'],
  role: 'Director of Investments-SSA, Strategix Capital',
  topic: 'Structuring Capital for Growth: How Project Finance, Debt Markets & Infrastructure Finance Unlock Large-Scale African Investment',
  isBreak: false
}, {
  time: '13:20–14:20',
  session: 'Executive Networking Lunch',
  speakers: ['Delegates, Funders & Partners'],
  role: '',
  topic: 'Lunch · Capital Conversations · Investor Networking',
  isBreak: true
}], [{
  time: '14:20–14:45',
  session: 'Executive Panel Discussion',
  speakers: ['Sifiso Skenjana (Facilitator)', 'ABSA Representative', 'Zandi Kogo', 'Futhi Mtoba', 'Joanna Govender'],
  role: 'Founder ESG Now News · Exec Director Rebosis · Co-Convenor Women Economic Assembly · CEO EPF Tech Fund',
  topic: 'Impact Capital, Gender-Lens Mandates & ESG Sectors: Where Smart Money Is Flowing in 2026',
  isBreak: false
}, {
  time: '14:45–15:00',
  session: 'Strategic Industry Keynote',
  speakers: ['Darlene Menzies'],
  role: 'CEO, FinFind',
  topic: 'AI, Digital Readiness & Funding Access: How SMEs Can Use Technology to Become Investment-Ready',
  isBreak: false
}, {
  time: '15:00–15:20',
  session: 'Networking & Funding Clinics',
  speakers: ['Delegates & Investors'],
  role: '',
  topic: 'Investor Matchmaking · Funding Clinics · Exhibition',
  isBreak: true
}], [{
  time: '15:20–15:45',
  session: 'Executive Panel',
  speakers: ['Amukelani Kweyama', 'Mr Bongani Ntombela', 'Ms Nandisile Khoza', 'Niall Gahan', 'Cleola Kunene'],
  role: 'Group ESD Tiger Brands · Exec 22 On Sloane · Procurement Unilever · Head Enterpriseroom · Head of SME JSE',
  topic: 'How Corporates Deploy Supply Chain Capital & How SMEs Capture It',
  isBreak: false
}, {
  time: '15:45–16:10',
  session: 'Industry Strategic Workshop',
  speakers: ['ABSA Representative'],
  role: '',
  topic: '',
  isBreak: false
}, {
  time: '16:10–16:15',
  session: 'Vote of Thanks',
  speakers: ['Mr Simphiwe Masiza'],
  role: 'CEO, Empowaworx',
  topic: '',
  isBreak: false
}, {
  time: '16:15',
  session: 'Closing Networking Experience',
  speakers: ['Delegates, Partners & Investors'],
  role: '',
  topic: 'Closing Networking · Deal Rooms · Partner Activations',
  isBreak: true
}]];
const EventProgrammeSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, {
    once: true,
    margin: '-80px 0px'
  });
  const [activeArena, setActiveArena] = useState(0);
  const {
    isMobile,
    isTablet
  } = useBreakpoint();
  const hPad = isMobile ? '0 20px' : isTablet ? '0 40px' : '0 64px';
  const sessions = ARENA_SESSIONS[activeArena];
  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) return;
    const allArenas = ARENA_TABS.map((tabName, arenaIdx) => {
      const arenaSessions = ARENA_SESSIONS[arenaIdx];
      return `
        <div class="arena-block" style="margin-bottom:40px; page-break-inside:avoid;">
          <div class="arena-title" style="background:#DE322D;color:#fff;padding:10px 18px;border-radius:8px;font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:16px;display:inline-block;">${tabName}</div>
          <table style="width:100%;border-collapse:collapse;font-family:Inter,sans-serif;font-size:13px;">
            <thead>
              <tr style="background:#f0ede6;">
                <th style="padding:10px 14px;text-align:left;color:#DE322D;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;border-bottom:2px solid #DE322D;width:110px;">Time</th>
                <th style="padding:10px 14px;text-align:left;color:#DE322D;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;border-bottom:2px solid #DE322D;">Session</th>
                <th style="padding:10px 14px;text-align:left;color:#DE322D;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;border-bottom:2px solid #DE322D;">Speaker</th>
                <th style="padding:10px 14px;text-align:left;color:#DE322D;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;border-bottom:2px solid #DE322D;">Topic</th>
              </tr>
            </thead>
            <tbody>
              ${arenaSessions.map((row, i) => `
                <tr style="background:${row.isBreak ? 'rgba(222,50,45,0.06)' : i % 2 === 0 ? '#fff' : '#faf9f6'};border-bottom:1px solid #e8e4dc;">
                  <td style="padding:12px 14px;font-weight:700;color:#DE322D;white-space:nowrap;vertical-align:top;">${row.time}</td>
                  <td style="padding:12px 14px;font-style:${row.isBreak ? 'italic' : 'normal'};color:${row.isBreak ? 'rgba(20,18,16,0.45)' : '#3B4E5F'};font-weight:500;vertical-align:top;">${row.session}</td>
                  <td style="padding:12px 14px;color:#141210;font-weight:${row.isBreak ? '400' : '600'};vertical-align:top;">${Array.isArray(row.speakers) ? row.speakers.filter(Boolean).join('<br>') : ''}</td>
                  <td style="padding:12px 14px;color:rgba(20,18,16,0.6);font-style:italic;vertical-align:top;">${row.topic || ''}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }).join('');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>EmpowaEntrepreneurs Funding Summit 2026 - Programme</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: Inter, sans-serif; background: #fff; color: #141210; padding: 40px; max-width: 1000px; margin: 0 auto; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; padding-bottom: 24px; border-bottom: 3px solid #DE322D; }
          .logo-block h1 { font-family: Montserrat, sans-serif; font-size: 28px; font-weight: 800; letter-spacing: -1px; color: #141210; }
          .logo-block h2 { font-family: Montserrat, sans-serif; font-size: 16px; font-weight: 600; color: #DE322D; margin-top: 4px; letter-spacing: 0.04em; }
          .meta { text-align: right; font-size: 12px; color: rgba(20,18,16,0.5); line-height: 1.7; }
          .meta strong { color: #141210; display: block; font-size: 13px; margin-bottom: 2px; }
          table { width: 100%; border-collapse: collapse; }
          @media print {
            body { padding: 20px; }
            .arena-block { page-break-inside: avoid; }
            @page { margin: 15mm; size: A4 landscape; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo-block">
            <h1>EmpowaEntrepreneurs</h1>
            <h2>FUNDING SUMMIT 2026 - OFFICIAL PROGRAMME</h2>
          </div>
          <div class="meta">
            <strong>Thursday, 28 May 2026</strong>
            EmpowaWorx House<br>
            364 Pine Avenue, Ferndale<br>
            Randburg, 2196
          </div>
        </div>
        ${allArenas}
        <div style="margin-top:40px;padding-top:20px;border-top:1px solid #e8e4dc;text-align:center;font-size:11px;color:rgba(20,18,16,0.4);font-family:Inter,sans-serif;">
          www.empowaentrepreneurs.co.za &nbsp;|&nbsp; GET CONNECTED. GET FUNDED.
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
  };
  const showSidebarSelector = !isMobile && !isTablet;
  return <section id="programme" ref={sectionRef} style={{
    background: 'linear-gradient(155deg, #F4F1EB 0%, #EDE8E0 50%, #F0EBE3 100%)',
    paddingTop: isMobile ? '72px' : isTablet ? '88px' : '110px',
    paddingBottom: isMobile ? '72px' : isTablet ? '88px' : '110px',
    width: '100%',
    boxSizing: 'border-box',
    overflow: 'hidden',
    position: 'relative'
  }}>
    <div aria-hidden="true" style={{
      position: 'absolute',
      top: '-10%',
      right: '-8%',
      width: 'clamp(300px, 55vw, 800px)',
      height: 'clamp(300px, 55vw, 800px)',
      borderRadius: '50%',
      background: 'radial-gradient(circle at 40% 40%, rgba(222,50,45,0.07) 0%, rgba(222,50,45,0.02) 45%, transparent 70%)',
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
      opacity: 0.4,
      zIndex: 0
    }} />

    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: hPad,
      position: 'relative',
      zIndex: 1
    }}>
      {/* Section Header */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'flex-start' : 'flex-start',
        flexWrap: 'wrap',
        gap: '24px',
        marginBottom: '40px'
      }}>
        <div style={{
          flex: 1
        }}>
          <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={rotateFade} custom={0} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '16px'
          }}>
            <PlusSquareIconDark />
            <span style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '11px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(20,18,16,0.4)',
              fontWeight: 500
            }}>Event Programme</span>
          </motion.div>
          <div style={{
            overflow: 'hidden'
          }}>
            <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.08} style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: isMobile ? 'clamp(28px, 8vw, 48px)' : 'clamp(36px, 5vw, 64px)',
              fontWeight: 200,
              letterSpacing: isMobile ? '-2px' : '-3px',
              lineHeight: 0.91,
              color: '#141210',
              margin: 0
            }}>
              <span>{'Summit Programme '}</span>
              <em style={{
                fontStyle: 'italic',
                fontWeight: 300,
                color: '#DE322D',
                fontFamily: 'Montserrat, sans-serif'
              }}>{'2026'}</em>
            </motion.h2>
          </div>
          <motion.p initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUpVariants} custom={0.18} style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            color: 'rgba(20,18,16,0.5)',
            marginTop: '12px',
            marginBottom: '0'
          }}>
            Thursday, 28 May 2026 · EmpowaWorx House, Randburg
          </motion.p>
        </div>

        {/* Action Buttons */}
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUpVariants} custom={0.22} style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          flexWrap: 'wrap',
          flexDirection: isMobile ? 'column' : 'row',
          width: isMobile ? '100%' : 'auto'
        }}>
          <motion.button onClick={handlePrint} whileHover={{
            scale: 1.04
          }} whileTap={{
            scale: 0.97
          }} style={{
            background: 'linear-gradient(135deg, #DE322D, #c42823)',
            color: '#fff',
            borderRadius: '40px',
            padding: '12px 24px',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '13px',
            fontWeight: 600,
            letterSpacing: '0.03em',
            cursor: 'pointer',
            border: 'none',
            boxShadow: '0 4px 20px rgba(222,50,45,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: isMobile ? '100%' : 'auto'
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            <span>Print Programme</span>
          </motion.button>
          <motion.button onClick={handlePrint} whileHover={{
            scale: 1.04
          }} whileTap={{
            scale: 0.97
          }} style={{
            background: 'transparent',
            color: 'rgba(20,18,16,0.65)',
            borderRadius: '40px',
            padding: '12px 24px',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '13px',
            fontWeight: 600,
            letterSpacing: '0.03em',
            cursor: 'pointer',
            border: '1px solid rgba(20,18,16,0.18)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: isMobile ? '100%' : 'auto'
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Download PDF</span>
          </motion.button>
        </motion.div>
      </div>

      {/* Mobile/Tablet: horizontal pill tabs */}
      {(isMobile || isTablet) && <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUpVariants} custom={0.28} style={{
        display: 'flex',
        gap: '8px',
        flexWrap: 'nowrap',
        overflowX: 'auto',
        paddingBottom: '4px',
        marginBottom: '24px',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling']
      }}>
        {ARENA_TABS.map((tab, i) => <button key={`tab-mob-${i}`} onClick={() => setActiveArena(i)} style={{
          background: activeArena === i ? 'linear-gradient(135deg, #DE322D, #c42823)' : 'transparent',
          color: activeArena === i ? '#fff' : 'rgba(20,18,16,0.55)',
          border: activeArena === i ? 'none' : '1px solid rgba(20,18,16,0.12)',
          borderRadius: '40px',
          padding: '10px 16px',
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '12px',
          fontWeight: 600,
          letterSpacing: '0.03em',
          cursor: 'pointer',
          transition: 'all 0.25s ease',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          boxShadow: activeArena === i ? '0 4px 16px rgba(222,50,45,0.4)' : 'none'
        }}>
          {tab}
        </button>)}
      </motion.div>}

      {/* Main content: sidebar + timeline */}
      <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUpVariants} custom={0.32} style={{
        display: 'grid',
        gridTemplateColumns: showSidebarSelector ? '220px 1fr' : '1fr',
        gap: '32px',
        alignItems: 'flex-start'
      }}>
        {/* Left: vertical arena selector (desktop only) */}
        {showSidebarSelector && <div style={{
          background: '#FDFCFA',
          borderRadius: '20px',
          border: '1px solid rgba(20,18,16,0.07)',
          padding: '8px',
          position: 'sticky',
          top: '100px'
        }}>
          <div style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'rgba(20,18,16,0.35)',
            fontWeight: 600,
            padding: '12px 16px 8px'
          }}>Arenas</div>
          {ARENA_TABS.map((tab, i) => {
            const isActive = activeArena === i;
            const sessionCount = ARENA_SESSIONS[i].length;
            return <button key={`arena-btn-${i}`} onClick={() => setActiveArena(i)} style={{
              width: '100%',
              textAlign: 'left',
              padding: '12px 16px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.02em',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
              background: isActive ? 'linear-gradient(135deg, #DE322D, #c42823)' : 'transparent',
              color: isActive ? '#fff' : 'rgba(20,18,16,0.55)',
              boxShadow: isActive ? '0 4px 12px rgba(222,50,45,0.35)' : 'none',
              marginBottom: '2px'
            }} onMouseEnter={e => {
              if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(20,18,16,0.04)';
            }} onMouseLeave={e => {
              if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            }}>
              <span style={{
                lineHeight: 1.3
              }}>{tab}</span>
              <span style={{
                background: isActive ? 'rgba(255,255,255,0.25)' : 'rgba(20,18,16,0.07)',
                borderRadius: '100px',
                padding: '1px 8px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '10px',
                fontWeight: 600,
                flexShrink: 0
              }}>{sessionCount}</span>
            </button>;
          })}
        </div>}

        {/* Right: timeline panel */}
        <div style={{
          background: '#FDFCFA',
          borderRadius: '20px',
          border: '1px solid rgba(20,18,16,0.07)',
          overflow: 'hidden'
        }}>
          {/* Arena header bar */}
          <div style={{
            background: 'linear-gradient(135deg, #DE322D, #c42823)',
            padding: isMobile ? '12px 16px' : '16px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span style={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 700,
              fontSize: isMobile ? '12px' : '14px',
              color: '#fff',
              letterSpacing: '0.04em',
              textTransform: 'uppercase'
            }}>{ARENA_TABS[activeArena]}</span>
            <span style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              color: 'rgba(255,255,255,0.7)'
            }}>{sessions.length} sessions</span>
          </div>

          {/* Timeline rows */}
          <AnimatePresence mode="wait">
            <motion.div key={`arena-timeline-${activeArena}`} initial={{
              opacity: 0,
              y: 16,
              filter: 'blur(6px)'
            }} animate={{
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              transition: {
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1] as const
              }
            }} exit={{
              opacity: 0,
              y: -10,
              filter: 'blur(4px)',
              transition: {
                duration: 0.25
              }
            }}>
              {sessions.map((row, ri) => <div key={`timeline-row-${ri}`} style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '75px 1fr' : '110px 1fr',
                borderBottom: ri < sessions.length - 1 ? '1px solid rgba(20,18,16,0.06)' : 'none',
                position: 'relative',
                background: row.isBreak ? 'rgba(222,50,45,0.035)' : ri % 2 === 0 ? '#FDFCFA' : 'rgba(20,18,16,0.015)'
              }}>
                {/* Time column */}
                <div style={{
                  padding: isMobile ? '14px 8px 14px 12px' : '18px 16px 18px 28px',
                  borderRight: '1px solid rgba(20,18,16,0.06)',
                  position: 'relative'
                }}>
                  <span style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 700,
                    fontSize: isMobile ? '10px' : '13px',
                    color: '#DE322D',
                    whiteSpace: 'nowrap',
                    display: 'block',
                    lineHeight: 1.2
                  }}>{row.time}</span>
                  {/* Timeline dot */}
                  <div aria-hidden="true" style={{
                    position: 'absolute',
                    right: '-6px',
                    top: '22px',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: row.isBreak ? 'rgba(222,50,45,0.3)' : '#DE322D',
                    border: '2px solid #F4F1EB',
                    zIndex: 1
                  }} />
                </div>
                {/* Content column */}
                <div style={{
                  padding: isMobile ? '14px 14px 14px 16px' : '18px 28px'
                }}>
                  <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                    fontSize: isMobile ? '13px' : '14px',
                    color: row.isBreak ? 'rgba(20,18,16,0.45)' : '#3B4E5F',
                    fontStyle: row.isBreak ? 'italic' : 'normal',
                    margin: '0 0 4px'
                  }}>{row.session}</p>
                  {row.speakers.filter(s => s.trim()).length > 0 && !row.isBreak && <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 700,
                    fontSize: isMobile ? '12px' : '14px',
                    color: '#141210',
                    margin: '0 0 2px'
                  }}>{row.speakers.filter(s => s.trim()).join(' · ')}</p>}
                  {row.role && <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: isMobile ? '11px' : '13px',
                    color: 'rgba(20,18,16,0.45)',
                    margin: '2px 0 0'
                  }}>{row.role}</p>}
                  {row.topic && <span style={{
                    display: 'inline-block',
                    background: 'rgba(20,18,16,0.05)',
                    borderRadius: '100px',
                    padding: '3px 10px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '11px',
                    color: 'rgba(20,18,16,0.5)',
                    fontStyle: 'italic',
                    marginTop: '8px'
                  }}>{row.topic}</span>}
                </div>
              </div>)}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  </section>;
};

// ─── FundingSummitPage ─────────────────────────────────────────────────────────
export const FundingSummitPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    const handleOpen = () => setIsModalOpen(true);
    window.addEventListener('openPartnershipModal', handleOpen);
    return () => window.removeEventListener('openPartnershipModal', handleOpen);
  }, []);

  return <div className="w-full min-h-screen" style={{
    background: '#141210',
    overflowX: 'hidden'
  }}>
    <HeroSection />
    <EventLogisticsSection />
    <ExperienceZonesSection />
    <PastSpeakersSection />
    <CapitalForceSection />
    <EventProgrammeSection />
    <LeadershipTeamSection />
    <EligibilitySection />
    <CtaBannerSection />
    {isModalOpen && <PartnershipEnquiryModal onClose={() => setIsModalOpen(false)} />}
  </div>;
};