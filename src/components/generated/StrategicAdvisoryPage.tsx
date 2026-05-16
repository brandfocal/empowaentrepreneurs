import { LogoBanner } from './AgencyComponents';
import { AfricaExpansionRoadmap } from './AfricaExpansionRoadmap';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView, useAnimationFrame, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';

// ─── Constants ────────────────────────────────────────────────────────────────
const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`;
const HERO_BG = 'https://images.unsplash.com/photo-1560439513-74b037a25d84?w=1800&q=80';

// ─── Responsive hook ──────────────────────────────────────────────────────────
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

// ─── Magnetic hook ────────────────────────────────────────────────────────────
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

// ─── Animation variants ───────────────────────────────────────────────────────
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

// ─── SVG Helpers ─────────────────────────────────────────────────────────────
const PlusSquareIcon = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M16.25 2.5H3.75C3.41848 2.5 3.10054 2.6317 2.86612 2.86612C2.6317 3.10054 2.5 3.41848 2.5 3.75V16.25C2.5 16.5815 2.6317 16.8995 2.86612 17.1339C3.10054 17.3683 3.41848 17.5 3.75 17.5H16.25C16.5815 17.5 16.8995 17.3683 17.1339 17.1339C17.3683 16.8995 17.5 16.5815 17.5 16.25V3.75C17.5 3.41848 17.3683 3.10054 17.1339 2.86612C16.8995 2.6317 16.5815 2.5 16.25 2.5ZM13.125 10.625H10.625V13.125C10.625 13.2908 10.5592 13.4497 10.4419 13.5669C10.3247 13.6842 10.1658 13.75 10 13.75C9.83424 13.75 9.67527 13.6842 9.55806 13.5669C9.44085 13.4497 9.375 13.2908 9.375 13.125V10.625H6.875C6.70924 10.625 6.55027 10.5592 6.43306 10.4419C6.31585 10.3247 6.25 10.1658 6.25 10C6.25 9.83424 6.31585 9.67527 6.43306 9.55806C6.55027 9.44085 6.70924 9.375 6.875 9.375H9.375V6.875C9.375 6.70924 9.44085 6.55027 9.55806 6.43306C9.67527 6.31585 9.83424 6.25 10 6.25C10.1658 6.25 10.3247 6.31585 10.4419 6.43306C10.5592 6.55027 10.625 6.70924 10.625 6.875V9.375H13.125C13.2908 9.375 13.4497 9.44085 13.5669 9.55806C13.6842 9.67527 13.75 9.83424 13.75 10C13.75 10.1658 13.6842 10.3247 13.5669 10.4419C13.4497 10.5592 13.2908 10.625 13.125 10.625Z" fill="#DE322D" />
  </svg>;
const PlusSquareIconLight = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M16.25 2.5H3.75C3.41848 2.5 3.10054 2.6317 2.86612 2.86612C2.6317 3.10054 2.5 3.41848 2.5 3.75V16.25C2.5 16.5815 2.6317 16.8995 2.86612 17.1339C3.10054 17.3683 3.41848 17.5 3.75 17.5H16.25C16.5815 17.5 16.8995 17.3683 17.1339 17.1339C17.3683 16.8995 17.5 16.5815 17.5 16.25V3.75C17.5 3.41848 17.3683 3.10054 17.1339 2.86612C16.8995 2.6317 16.5815 2.5 16.25 2.5ZM13.125 10.625H10.625V13.125C10.625 13.2908 10.5592 13.4497 10.4419 13.5669C10.3247 13.6842 10.1658 13.75 10 13.75C9.83424 13.75 9.67527 13.6842 9.55806 13.5669C9.44085 13.4497 9.375 13.2908 9.375 13.125V10.625H6.875C6.70924 10.625 6.55027 10.5592 6.43306 10.4419C6.31585 10.3247 6.25 10.1658 6.25 10C6.25 9.83424 6.31585 9.67527 6.43306 9.55806C6.55027 9.44085 6.70924 9.375 6.875 9.375H9.375V6.875C9.375 6.70924 9.44085 6.55027 9.55806 6.43306C9.67527 6.31585 9.83424 6.25 10 6.25C10.1658 6.25 10.3247 6.31585 10.4419 6.43306C10.5592 6.55027 10.625 6.70924 10.625 6.875V9.375H13.125C13.2908 9.375 13.4497 9.44085 13.5669 9.55806C13.6842 9.67527 13.75 9.83424 13.75 10C13.75 10.1658 13.6842 10.3247 13.5669 10.4419C13.4497 10.5592 13.2908 10.625 13.125 10.625Z" fill="rgba(247,246,243,0.35)" />
  </svg>;
const ArrowIconDark = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 12L12 2M12 2H4M12 2V10" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
const ArrowIconInk = () => <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M1.5 10.5L10.5 1.5M10.5 1.5H3.5M10.5 1.5V8.5" stroke="rgba(20,18,16,0.4)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;

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

// ─── Ticker Strip ─────────────────────────────────────────────────────────────
const TICKER_ITEMS = [{
  id: 'tk-1',
  label: "Africa's Capital Movement"
}, {
  id: 'tk-2',
  label: 'Institutional Capital · DFIs · VCs'
}, {
  id: 'tk-3',
  label: 'EmpowaWorx House · 2026'
}, {
  id: 'tk-4',
  label: 'Founders · Funders · Impact'
}, {
  id: 'tk-5',
  label: 'Catalytic Capital · Enterprise Growth'
}, {
  id: 'tk-6',
  label: '400+ Entrepreneurs & Investors'
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
          borderRight: `0.8px solid ${light ? 'rgba(247,246,243,0.06)' : 'rgba(20,18,16,0.1)'}`,
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
            textTransform: 'uppercase' as const,
            color: light ? 'rgba(247,246,243,0.35)' : 'rgba(20,18,16,0.4)',
            fontWeight: 500
          }}>{item.label}</span>
              </div>)}
          </div>)}
      </div>
    </div>;
};

// ─── Sticky Nav ───────────────────────────────────────────────────────────────
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
  id: 'strategic',
  label: 'Strategic Advisory'
}, {
  id: 'partnerships',
  label: 'Partnerships'
}, {
  id: 'apply',
  label: 'Apply to Attend'
}];
const StickyNav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const isMobile = useIsMobile();
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
    boxSizing: 'border-box' as const
  }}>
      <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: scrolled ? '12px 32px' : '20px 32px',
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
          boxShadow: '0 4px 14px rgba(222,50,45,0.4)'
        }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1L7.5 4.5L11 5L8.5 7.5L9 11L6 9.5L3 11L3.5 7.5L1 5L4.5 4.5L6 1Z" fill="white" />
            </svg>
          </motion.div>
          <span style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '13px',
          letterSpacing: '0.08em',
          textTransform: 'uppercase' as const,
          color: scrolled ? '#141210' : '#F7F6F3',
          fontWeight: 700,
          transition: 'color 0.35s ease'
        }}>EmpowaSummit</span>
        </a>

        {!isMobile && <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '28px'
      }}>
            {NAV_ITEMS.map(item => <a key={item.id} href="#"  style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '13px',
          textDecoration: 'none',
          letterSpacing: '0.04em',
          transition: 'color 0.2s',
          color: item.id === 'strategic' ? '#DE322D' : navLinkColor,
          fontWeight: item.id === 'strategic' ? 600 : 400
        }} onMouseEnter={e => {
          (e.currentTarget as HTMLAnchorElement).style.color = item.id === 'strategic' ? '#DE322D' : navLinkHoverColor;
        }} onMouseLeave={e => {
          (e.currentTarget as HTMLAnchorElement).style.color = item.id === 'strategic' ? '#DE322D' : navLinkColor;
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
            padding: '8px 18px',
            fontSize: '12px',
            letterSpacing: '0.04em',
            color: scrolled ? '#3c4d5d' : 'rgba(247,246,243,0.8)',
            textDecoration: 'none',
            fontFamily: 'Montserrat, sans-serif',
            transition: 'border-color 0.25s ease, color 0.25s ease'
          }}>
                <span>Partner With Us</span>
              </motion.a>
              <motion.a href="/summit" whileHover={{
            scale: 1.04,
            boxShadow: '0 8px 32px rgba(222,50,45,0.55)'
          }} whileTap={{
            scale: 0.97
          }} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'linear-gradient(135deg, #DE322D, #c42823)',
            borderRadius: '44px',
            padding: '8px 18px',
            fontSize: '12px',
            letterSpacing: '0.06em',
            color: '#fff',
            textDecoration: 'none',
            fontFamily: 'Montserrat, sans-serif',
            boxShadow: '0 4px 16px rgba(222,50,45,0.38)',
            transition: 'box-shadow 0.3s ease'
          }}>
                <span>Summit 2026</span>
              </motion.a>
            </div>
          </div>}

        {isMobile && <button onClick={() => setMobileMenuOpen(v => !v)} style={{
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
        {isMobile && mobileMenuOpen && <motion.div initial={{
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
        padding: '24px 32px 28px'
      }}>
            {NAV_ITEMS.map(item => <a key={item.id} href="#" onClick={e => { e.preventDefault(); setMobileMenuOpen(false); }} style={{
          display: 'block',
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '16px',
          color: item.id === 'strategic' ? '#DE322D' : 'rgba(20,18,16,0.65)',
          textDecoration: 'none',
          padding: '12px 0',
          borderBottom: '0.8px solid rgba(20,18,16,0.06)',
          letterSpacing: '0.02em',
          fontWeight: item.id === 'strategic' ? 600 : 400
        }}>
                {item.label}
              </a>)}
            <div style={{
          display: 'flex',
          gap: '10px',
          marginTop: '20px',
          flexWrap: 'wrap' as const
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
            textDecoration: 'none'
          }}>Summit 2026</a>
            </div>
          </motion.div>}
      </AnimatePresence>
    </motion.nav>;
};

// ─── Hero Grid ────────────────────────────────────────────────────────────────
const HERO_GRID_VLINES = [16, 33, 50, 66, 83];
const HERO_GRID_HLINES = [25, 50, 75];
const HeroGrid = () => <div aria-hidden="true" style={{
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  zIndex: 0,
  overflow: 'hidden'
}}>
    {HERO_GRID_VLINES.map(pct => <div key={`vl-${pct}`} style={{
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: `${pct}%`,
    width: '1px',
    background: 'rgba(247,246,243,0.025)'
  }} />)}
    {HERO_GRID_HLINES.map(pct => <div key={`hl-${pct}`} style={{
    position: 'absolute',
    left: 0,
    right: 0,
    top: `${pct}%`,
    height: '1px',
    background: 'rgba(247,246,243,0.025)'
  }} />)}
  </div>;

// ─── Hero Section ─────────────────────────────────────────────────────────────
const HeroSection = () => {
  const heroRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();
  const {
    scrollYProgress
  } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });
  const orbY = useTransform(scrollYProgress, [0, 1], ['0%', '28%']);
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);
  const mag = useMagnetic();
  return <section ref={heroRef} style={{
    minHeight: '100vh',
    background: '#141210',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    width: '100%',
    boxSizing: 'border-box',
    overflow: 'hidden',
    position: 'relative'
  }}>
      {/* Parallax BG */}
      <motion.div aria-hidden="true" style={{
      y: imgY,
      position: 'absolute',
      inset: '-10% 0',
      backgroundImage: `url(${HERO_BG})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center 30%',
      backgroundRepeat: 'no-repeat',
      pointerEvents: 'none',
      zIndex: 0,
      willChange: 'transform'
    }} />
      {/* Gradient overlay */}
      <div aria-hidden="true" style={{
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(160deg, rgba(20,18,16,0.96) 0%, rgba(20,18,16,0.8) 45%, rgba(20,18,16,0.92) 100%)',
      pointerEvents: 'none',
      zIndex: 1
    }} />
      {/* Noise */}
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
      {/* Red orb top-right */}
      <motion.div aria-hidden="true" style={{
      y: orbY,
      position: 'absolute',
      top: '-10%',
      right: '-8%',
      width: 'clamp(500px, 55vw, 840px)',
      height: 'clamp(500px, 55vw, 840px)',
      borderRadius: '50%',
      background: 'radial-gradient(circle at 40% 40%, rgba(222,50,45,0.22) 0%, rgba(222,50,45,0.08) 45%, transparent 70%)',
      pointerEvents: 'none',
      zIndex: 3
    }} />
      {/* Red orb bottom-left */}
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
      {/* Corner brackets */}
      <div aria-hidden="true" style={{
      position: 'absolute',
      top: '88px',
      left: '32px',
      width: '40px',
      height: '40px',
      borderLeft: '1px solid rgba(222,50,45,0.3)',
      borderTop: '1px solid rgba(222,50,45,0.3)',
      zIndex: 4
    }} />
      <div aria-hidden="true" style={{
      position: 'absolute',
      bottom: '72px',
      right: '32px',
      width: '40px',
      height: '40px',
      borderRight: '1px solid rgba(222,50,45,0.3)',
      borderBottom: '1px solid rgba(222,50,45,0.3)',
      zIndex: 4
    }} />
      {/* Hero grid */}
      <div style={{
      position: 'relative',
      zIndex: 3
    }}><HeroGrid /></div>
      {/* Nav spacer */}
      <div style={{
      height: '88px',
      flexShrink: 0,
      position: 'relative',
      zIndex: 4
    }} />

      {/* Main text content */}
      <motion.div style={{
      y: textY,
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      padding: isMobile ? '0 24px 0' : '0 64px 0',
      width: '100%',
      boxSizing: 'border-box',
      zIndex: 4,
      position: 'relative',
      paddingBottom: 0
    }}>
        {/* Eyebrow */}
        <motion.div custom={0.05} initial="hidden" animate="visible" variants={fadeUpVariants} style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '36px',
        flexWrap: 'wrap' as const
      }}>
          <PlusSquareIconLight />
          <span style={{
          fontFamily: 'Montserrat, sans-serif',
          color: 'rgba(247,246,243,0.38)',
          fontSize: '11px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase' as const,
          fontWeight: 500
        }}>
            <span style={{
            color: '#DE322D',
            fontWeight: 600
          }}>EmpowaEntrepreneurs</span>
            <span> Funding Summit - </span>
            <span style={{
            color: 'rgba(247,246,243,0.55)',
            fontWeight: 500
          }}>Strategic Advisory</span>
          </span>
        </motion.div>

        {/* H1 */}
        <h1 style={{
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: 300,
        margin: '0 0 32px',
        lineHeight: 0.91,
        letterSpacing: isMobile ? '-2px' : '-4px',
        maxWidth: '960px'
      }}>
          <div style={{
          overflow: 'hidden',
          display: 'block',
          whiteSpace: 'nowrap' as const
        }}>
            <motion.span initial={{
            y: '110%',
            opacity: 0
          }} animate={{
            y: '0%',
            opacity: 1
          }} transition={{
            duration: 0.95,
            delay: 0.2,
            ease: [0.22, 1, 0.36, 1]
          }} style={{
            display: 'inline-block',
            fontSize: isMobile ? 'clamp(36px, 9.5vw, 64px)' : 'clamp(56px, 7vw, 112px)',
            color: '#F7F6F3',
            marginRight: '0.2em'
          }}>Strategic</motion.span>
            <motion.span initial={{
            y: '110%',
            opacity: 0
          }} animate={{
            y: '0%',
            opacity: 1
          }} transition={{
            duration: 0.95,
            delay: 0.32,
            ease: [0.22, 1, 0.36, 1]
          }} style={{
            display: 'inline-block',
            fontSize: isMobile ? 'clamp(36px, 9.5vw, 64px)' : 'clamp(56px, 7vw, 112px)',
            color: '#F7F6F3'
          }}>Advisory</motion.span>
          </div>
          <div style={{
          overflow: 'hidden',
          display: 'block',
          whiteSpace: 'nowrap' as const
        }}>
            <motion.span initial={{
            y: '110%',
            opacity: 0
          }} animate={{
            y: '0%',
            opacity: 1
          }} transition={{
            duration: 0.95,
            delay: 0.44,
            ease: [0.22, 1, 0.36, 1]
          }} style={{
            display: 'inline-block',
            fontSize: isMobile ? 'clamp(36px, 9.5vw, 64px)' : 'clamp(56px, 7vw, 112px)',
            color: 'rgba(247,246,243,0.18)',
            marginRight: '0.2em'
          }}>Africa</motion.span>
            <motion.em initial={{
            y: '110%',
            opacity: 0
          }} animate={{
            y: '0%',
            opacity: 1
          }} transition={{
            duration: 0.95,
            delay: 0.56,
            ease: [0.22, 1, 0.36, 1]
          }} style={{
            display: 'inline-block',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: isMobile ? 'clamp(36px, 9.5vw, 64px)' : 'clamp(56px, 7vw, 112px)',
            color: '#DE322D'
          }}>Expansion</motion.em>
          </div>
        </h1>

        {/* Sub paragraph */}
        <motion.p custom={0.68} initial="hidden" animate="visible" variants={fadeUpVariants} style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: isMobile ? '15px' : 'clamp(15px, 1.3vw, 19px)',
        lineHeight: '1.78',
        color: 'rgba(247,246,243,0.6)',
        margin: '0 0 56px',
        fontWeight: 300,
        maxWidth: '520px'
      }}>
          We move businesses from survival to scale and from ideas to investment-ready enterprises - combining global best practices in venture finance, incubation, and strategic growth advisory.
        </motion.p>

        {/* CTAs */}
        <motion.div custom={0.75} initial="hidden" animate="visible" variants={fadeUpVariants} style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap' as const,
        marginBottom: '32px'
      }}>
          <motion.div ref={mag.ref} onMouseMove={mag.handleMouseMove} onMouseLeave={mag.handleMouseLeave} style={{
          x: mag.springX,
          y: mag.springY
        }}>
            <motion.a href="#strategic-offerings"  whileHover={{
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
            padding: isMobile ? '14px 28px' : '18px 36px',
            fontSize: '13px',
            letterSpacing: '0.05em',
            color: '#fff',
            textDecoration: 'none',
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 600,
            boxShadow: '0 4px 16px rgba(222,50,45,0.38)',
            transition: 'box-shadow 0.3s ease'
          }}>
              <span>Explore Offerings</span>
              <ArrowIconDark />
            </motion.a>
          </motion.div>
          <motion.a href="/partnerships"  whileHover={{
          scale: 1.04
        }} whileTap={{
          scale: 0.97
        }} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          border: '1px solid rgba(247,246,243,0.25)',
          borderRadius: '44px',
          padding: isMobile ? '14px 24px' : '18px 30px',
          fontSize: '13px',
          letterSpacing: '0.04em',
          color: 'rgba(247,246,243,0.82)',
          textDecoration: 'none',
          fontFamily: 'Montserrat, sans-serif',
          transition: 'border-color 0.3s ease, color 0.3s ease'
        }} onMouseEnter={e => {
          const el = e.currentTarget as HTMLAnchorElement;
          el.style.borderColor = 'rgba(247,246,243,0.55)';
          el.style.color = '#F7F6F3';
        }} onMouseLeave={e => {
          const el = e.currentTarget as HTMLAnchorElement;
          el.style.borderColor = 'rgba(247,246,243,0.25)';
          el.style.color = 'rgba(247,246,243,0.82)';
        }}>
            <span>Partner With Us</span>
          </motion.a>
        </motion.div>

        {/* Location strip */}
        <motion.div custom={0.82} initial="hidden" animate="visible" variants={fadeUpVariants} style={{
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        marginBottom: '40px',
        flexWrap: 'wrap' as const
      }}>
          <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
            <span style={{
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            background: '#DE322D',
            flexShrink: 0,
            display: 'block'
          }} />
            <span style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '12px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase' as const,
            color: 'rgba(247,246,243,0.28)',
            fontWeight: 500
          }}>Africa's Capital Movement</span>
          </div>
          <div style={{
          width: '1px',
          height: '12px',
          background: 'rgba(247,246,243,0.12)'
        }} />
          <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
            <span style={{
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            background: '#DE322D',
            flexShrink: 0,
            display: 'block'
          }} />
            <span style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '12px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase' as const,
            color: 'rgba(247,246,243,0.28)',
            fontWeight: 500
          }}>Johannesburg 2026</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Ticker */}
      <motion.div initial={{
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
        position: 'relative',
        background: 'rgba(247,246,243,0.03)',
        borderBottom: '0.8px solid rgba(247,246,243,0.06)'
      }}>
        <HeroTicker light />
      </motion.div>
    </section>;
};

// ─── Section 2 - Intro Statement ──────────────────────────────────────────────
const INTRO_STATS = [{
  id: 'is-1',
  value: 'Investment-Grade',
  label: 'Our core output',
  sub: 'Businesses'
}, {
  id: 'is-2',
  value: 'Survival → Scale',
  label: 'The journey we facilitate',
  sub: ''
}, {
  id: 'is-3',
  value: 'Ideas → Capital',
  label: 'The transformation we deliver',
  sub: ''
}];
const IntroSection = () => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, {
    once: true,
    margin: '-60px 0px'
  });
  const isMobile = useIsMobile();
  return <section ref={ref} style={{
    background: '#0F0D0B',
    width: '100%',
    boxSizing: 'border-box',
    overflow: 'hidden',
    position: 'relative',
    paddingTop: isMobile ? '72px' : '100px',
    paddingBottom: isMobile ? '72px' : '100px'
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
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '70vw',
      height: '70vw',
      maxWidth: '900px',
      maxHeight: '900px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(222,50,45,0.07) 0%, transparent 65%)',
      pointerEvents: 'none',
      zIndex: 0
    }} />
      <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: isMobile ? '0 24px' : '0 64px',
      position: 'relative',
      zIndex: 1
    }}>
        {/* Label */}
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={rotateFade} custom={0} style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '28px'
      }}>
          <PlusSquareIconLight />
          <span style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '11px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase' as const,
          color: 'rgba(247,246,243,0.35)',
          fontWeight: 500
        }}>The Model</span>
        </motion.div>

        {/* Headline */}
        <div style={{
        overflow: 'hidden',
        marginBottom: '64px'
      }}>
          <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.1} style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: isMobile ? 'clamp(28px, 8vw, 42px)' : 'clamp(32px, 4vw, 58px)',
          fontWeight: 300,
          letterSpacing: '-1.8px',
          lineHeight: 1.04,
          color: '#F7F6F3',
          margin: 0
        }}>
            <span>We do not simply deliver programmes</span>
            <em style={{
            fontStyle: 'italic',
            color: '#DE322D'
          }}> we build commercially sustainable ecosystems</em>
            <span style={{
            color: 'rgba(247,246,243,0.2)'
          }}> engineered for measurable growth and long-term economic impact.</span>
          </motion.h2>
        </div>

        {/* Stat strip */}
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={staggerContainer} custom={0.1} style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)'
      }}>
          {INTRO_STATS.map((stat, i) => <motion.div key={stat.id} variants={staggerChild} style={{
          paddingTop: '28px',
          paddingBottom: '28px',
          paddingLeft: i > 0 && !isMobile ? '40px' : '0',
          paddingRight: i < 2 && !isMobile ? '40px' : '0',
          borderLeft: i > 0 && !isMobile ? '1px solid rgba(247,246,243,0.08)' : 'none',
          borderTop: i > 0 && isMobile ? '1px solid rgba(247,246,243,0.08)' : 'none'
        }}>
              <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={lineWipe} custom={0.3 + i * 0.1} style={{
            height: '2px',
            background: '#DE322D',
            marginBottom: '20px',
            transformOrigin: 'left',
            width: '32px'
          }} />
              <div style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: isMobile ? 'clamp(20px, 5vw, 28px)' : 'clamp(22px, 2.5vw, 32px)',
            fontWeight: 300,
            color: '#F7F6F3',
            letterSpacing: '-0.8px',
            marginBottom: '8px'
          }}>
                <span>{stat.value}</span>
                {stat.sub && <span style={{
              display: 'block',
              fontSize: isMobile ? '14px' : '16px'
            }}>{stat.sub}</span>}
              </div>
              <div style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '12px',
            color: 'rgba(247,246,243,0.35)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase' as const,
            fontWeight: 500
          }}>{stat.label}</div>
            </motion.div>)}
        </motion.div>
      </div>
    </section>;
};

// ─── Section 3 - Strategic Offerings ─────────────────────────────────────────
const OFFERINGS = [{
  id: 'of-1',
  num: '01',
  title: 'Venture Finance & Capital Access Advisory™',
  description: 'Enhances investment readiness and accelerates access to venture capital, grants, and blended finance structuring.'
}, {
  id: 'of-2',
  num: '02',
  title: 'Venture Creation & Incubation™',
  description: 'Custom-designed accelerator programmes focused on founder development and innovation commercialisation.'
}, {
  id: 'of-3',
  num: '03',
  title: 'Enterprise & Supplier Development (ESD) Solutions™',
  description: 'Moves ESD beyond compliance into measurable commercial impact and expanded supplier ecosystems.'
}, {
  id: 'of-4',
  num: '04',
  title: 'Township Economy Activation™',
  description: 'Focused on informal economy commercialisation and accelerating youth and women economic participation.'
}, {
  id: 'of-5',
  num: '05',
  title: 'Innovation, AI & Digital Economy Solutions™',
  description: 'Strengthening digital competitiveness and positioning organisations for future economy leadership.'
}, {
  id: 'of-6',
  num: '06',
  title: 'Entrepreneurial Masterclasses & Executive Learning™',
  description: 'Capability development covering funding readiness, AI, leadership, and procurement access.'
}, {
  id: 'of-7',
  num: '07',
  title: 'Economic Activation Campaigns™',
  description: 'National and regional mobilization designed to drive ecosystem participation and market visibility.'
}, {
  id: 'of-8',
  num: '08',
  title: 'Keynotes & Executive Platforms™',
  description: 'High-impact experiences driving entrepreneurial leadership and commercially relevant economic conversations.'
}];
const OfferingsSection = () => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, {
    once: true,
    margin: '-60px 0px'
  });
  const isMobile = useIsMobile();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  return <section id="strategic-offerings" ref={ref} style={{
    background: '#FFFFFF',
    width: '100%',
    boxSizing: 'border-box',
    overflow: 'hidden',
    position: 'relative',
    paddingTop: isMobile ? '72px' : '100px',
    paddingBottom: isMobile ? '72px' : '100px'
  }}>
      <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: isMobile ? '0 24px' : '0 64px',
      position: 'relative',
      zIndex: 1
    }}>
        {/* Header row */}
        <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? '32px' : '80px',
        alignItems: 'start',
        marginBottom: '48px'
      }}>
          <div>
            <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={rotateFade} custom={0} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '20px'
          }}>
              <PlusSquareIcon />
              <span style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '11px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase' as const,
              color: 'rgba(20,18,16,0.45)',
              fontWeight: 500
            }}>Strategic Offerings & ROI</span>
            </motion.div>
            <div style={{
            overflow: 'hidden'
          }}>
              <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.1} style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: isMobile ? 'clamp(28px, 8vw, 40px)' : 'clamp(32px, 3.5vw, 52px)',
              fontWeight: 300,
              letterSpacing: '-1.5px',
              lineHeight: 1.06,
              color: '#141210',
              margin: 0
            }}>
                Solutions designed for listed companies, government agencies, DFIs, banks, and high-growth entrepreneurs.
              </motion.h2>
            </div>
          </div>
          <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideFromRight} custom={0.2} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          justifyContent: 'flex-end'
        }}>
            <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '15px',
            lineHeight: '1.78',
            color: 'rgba(20,18,16,0.55)',
            margin: 0,
            fontWeight: 300
          }}>
              Each solution is engineered to deliver measurable commercial outcomes - connecting organisations to capital, markets, and enterprise growth ecosystems at the highest level.
            </p>
            <a href="#"  style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            color: 'rgba(20,18,16,0.55)',
            textDecoration: 'none',
            letterSpacing: '0.02em'
          }}>
              <span>View All Solutions</span>
              <ArrowIconInk />
            </a>
          </motion.div>
        </div>

        {/* Red separator */}
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={lineWipe} custom={0.25} style={{
        height: '1px',
        background: '#DE322D',
        marginBottom: '0',
        transformOrigin: 'left',
        width: '100%',
        opacity: 0.4
      }} />

        {/* 8-card grid */}
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={staggerContainer} custom={0.08} style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr) repeat(2, 1fr)',
        gap: '0'
      }}>
          {OFFERINGS.map((item, i) => <motion.div key={item.id} variants={staggerChild} onMouseEnter={() => setHoveredId(item.id)} onMouseLeave={() => setHoveredId(null)} style={{
          padding: '32px',
          borderBottom: '0.8px solid rgba(20,18,16,0.07)',
          borderRight: !isMobile && i % 4 !== 3 ? '0.8px solid rgba(20,18,16,0.07)' : 'none',
          transform: hoveredId === item.id ? 'translateY(-2px)' : 'translateY(0)',
          transition: 'transform 0.3s ease',
          boxSizing: 'border-box'
        }}>
              <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '16px'
          }}>
                <PlusSquareIcon />
                <span style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '11px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase' as const,
              color: '#DE322D',
              fontWeight: 500
            }}>{item.num}</span>
              </div>
              <h3 style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '17px',
            fontWeight: 700,
            color: '#141210',
            margin: '0 0 12px',
            letterSpacing: '-0.2px',
            lineHeight: 1.3
          }}>{item.title}</h3>
              <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            color: 'rgba(20,18,16,0.55)',
            margin: '0 0 20px',
            fontWeight: 300,
            lineHeight: 1.7
          }}>{item.description}</p>
              <a href="/about"  style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '12px',
            color: '#DE322D',
            textDecoration: 'none',
            letterSpacing: '0.04em',
            fontWeight: 500
          }}>
                Learn More →
              </a>
            </motion.div>)}
        </motion.div>
      </div>
    </section>;
};

// ─── Section 4 - Competitive Edge ────────────────────────────────────────────
const EDGE_ITEMS = [{
  id: 'ed-1',
  title: 'Venture Creation',
  body: 'Custom accelerators and founder development programmes engineered for commercialisation.'
}, {
  id: 'ed-2',
  title: 'Capital Access',
  body: 'Investment readiness, blended finance structuring, and venture capital facilitation.'
}, {
  id: 'ed-3',
  title: 'ESD Transformation',
  body: 'Moving enterprise development beyond compliance into measurable commercial impact.'
}, {
  id: 'ed-4',
  title: 'Ecosystem Mobilisation',
  body: 'National and Pan-African campaigns activating markets, investors, and founders.'
}];
const EdgeSection = () => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, {
    once: true,
    margin: '-60px 0px'
  });
  const isMobile = useIsMobile();
  return <section ref={ref} style={{
    background: '#141210',
    width: '100%',
    boxSizing: 'border-box',
    overflow: 'hidden',
    position: 'relative',
    paddingTop: isMobile ? '72px' : '100px',
    paddingBottom: isMobile ? '72px' : '100px'
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
      top: '-10%',
      right: '-8%',
      width: 'clamp(400px, 50vw, 700px)',
      height: 'clamp(400px, 50vw, 700px)',
      borderRadius: '50%',
      background: 'radial-gradient(circle at 40% 40%, rgba(222,50,45,0.15) 0%, transparent 65%)',
      pointerEvents: 'none',
      zIndex: 0
    }} />
      <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: isMobile ? '0 24px' : '0 64px',
      position: 'relative',
      zIndex: 1
    }}>
        {/* Label */}
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={rotateFade} custom={0} style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '28px'
      }}>
          <PlusSquareIconLight />
          <span style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '11px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase' as const,
          color: 'rgba(247,246,243,0.35)',
          fontWeight: 500
        }}>The Competitive Edge</span>
        </motion.div>

        {/* Headline */}
        <div style={{
        overflow: 'hidden',
        marginBottom: '64px'
      }}>
          <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.1} style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: isMobile ? 'clamp(28px, 8vw, 42px)' : 'clamp(32px, 4vw, 58px)',
          fontWeight: 300,
          letterSpacing: '-1.8px',
          lineHeight: 1.04,
          color: '#F7F6F3',
          margin: 0,
          maxWidth: '900px'
        }}>
            <span>The ability to integrate</span>
            <em style={{
            fontStyle: 'italic',
            color: '#DE322D'
          }}> venture creation, capital access, ESD transformation,</em>
            <span style={{
            color: 'rgba(247,246,243,0.2)'
          }}> and ecosystem mobilisation into a single commercially integrated growth platform.</span>
          </motion.h2>
        </div>

        {/* 4-column grid */}
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={staggerContainer} custom={0.1} style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)'
      }}>
          {EDGE_ITEMS.map((item, i) => <motion.div key={item.id} variants={staggerChild} style={{
          paddingTop: '28px',
          paddingBottom: '28px',
          paddingLeft: i > 0 && !isMobile ? '32px' : isMobile && i % 2 !== 0 ? '16px' : '0',
          paddingRight: i < 3 && !isMobile ? '32px' : '0',
          borderLeft: i > 0 && !isMobile ? '1px solid rgba(247,246,243,0.08)' : 'none',
          borderTop: isMobile && i > 1 ? '1px solid rgba(247,246,243,0.08)' : 'none'
        }}>
              <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={lineWipe} custom={0.3 + i * 0.08} style={{
            height: '2px',
            background: '#DE322D',
            marginBottom: '24px',
            transformOrigin: 'left',
            width: '100%'
          }} />
              <div style={{
            marginBottom: '12px'
          }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="8" stroke="#DE322D" strokeWidth="1.2" />
                  <path d="M10 6V10L13 12" stroke="#DE322D" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </div>
              <h3 style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '18px',
            fontWeight: 700,
            color: '#F7F6F3',
            margin: '0 0 10px',
            letterSpacing: '-0.2px'
          }}>{item.title}</h3>
              <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            color: 'rgba(247,246,243,0.55)',
            margin: 0,
            lineHeight: 1.7,
            fontWeight: 300
          }}>{item.body}</p>
            </motion.div>)}
        </motion.div>
      </div>
    </section>;
};

// ─── Section 6 - Strategic Value Proposition ──────────────────────────────────
const VALUE_PROPS = [{
  id: 'vp-1',
  title: "Africa's Leading Ecosystem",
  description: 'The continent\'s most integrated platform connecting founders, funders, enterprise developers, and ecosystem builders into a single commercially coordinated movement.'
}, {
  id: 'vp-2',
  title: 'Intra-African Trade',
  description: 'Facilitating meaningful Pan-African business connections and cross-border capital flows that accelerate intra-African trade and economic integration.'
}, {
  id: 'vp-3',
  title: 'Global Competitiveness',
  description: 'Positioning African enterprises to compete and win globally by combining world-class strategic advisory with locally anchored execution capabilities.'
}];
const ValueSection = () => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, {
    once: true,
    margin: '-60px 0px'
  });
  const isMobile = useIsMobile();
  return <section ref={ref} style={{
    background: '#141210',
    width: '100%',
    boxSizing: 'border-box',
    overflow: 'hidden',
    position: 'relative',
    paddingTop: isMobile ? '72px' : '100px',
    paddingBottom: isMobile ? '72px' : '100px'
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
      top: '-15%',
      left: '-8%',
      width: 'clamp(400px, 50vw, 700px)',
      height: 'clamp(400px, 50vw, 700px)',
      borderRadius: '50%',
      background: 'radial-gradient(circle at 40% 40%, rgba(222,50,45,0.15) 0%, transparent 65%)',
      pointerEvents: 'none',
      zIndex: 0
    }} />
      <div aria-hidden="true" style={{
      position: 'absolute',
      bottom: '-10%',
      right: '-5%',
      width: '400px',
      height: '400px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(222,50,45,0.08) 0%, transparent 65%)',
      pointerEvents: 'none',
      zIndex: 0
    }} />
      <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: isMobile ? '0 24px' : '0 64px',
      position: 'relative',
      zIndex: 1
    }}>
        {/* Label + headline */}
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={rotateFade} custom={0} style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '28px'
      }}>
          <PlusSquareIconLight />
          <span style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '11px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase' as const,
          color: 'rgba(247,246,243,0.35)',
          fontWeight: 500
        }}>Strategic Value Proposition</span>
        </motion.div>
        <div style={{
        overflow: 'hidden',
        marginBottom: '64px'
      }}>
          <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.1} style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: isMobile ? 'clamp(28px, 8vw, 42px)' : 'clamp(32px, 4vw, 58px)',
          fontWeight: 300,
          letterSpacing: '-1.8px',
          lineHeight: 1.04,
          color: '#F7F6F3',
          margin: 0
        }}>
            <span>Africa's leading</span>
            <em style={{
            fontStyle: 'italic',
            color: '#DE322D'
          }}> entrepreneurial funding</em>
            <span style={{
            color: 'rgba(247,246,243,0.2)'
          }}> ecosystem.</span>
          </motion.h2>
        </div>

        {/* 3-column value grid */}
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={staggerContainer} custom={0.1} style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
        marginBottom: '80px'
      }}>
          {VALUE_PROPS.map((item, i) => <motion.div key={item.id} variants={staggerChild} style={{
          paddingTop: '28px',
          paddingBottom: '28px',
          paddingLeft: i > 0 && !isMobile ? '40px' : '0',
          paddingRight: i < 2 && !isMobile ? '40px' : '0',
          borderLeft: i > 0 && !isMobile ? '1px solid rgba(247,246,243,0.08)' : 'none',
          borderTop: i > 0 && isMobile ? '1px solid rgba(247,246,243,0.08)' : 'none'
        }}>
              <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={lineWipe} custom={0.3 + i * 0.1} style={{
            height: '2px',
            background: '#DE322D',
            marginBottom: '24px',
            transformOrigin: 'left',
            width: '32px'
          }} />
              <h3 style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '18px',
            fontWeight: 700,
            color: '#F7F6F3',
            margin: '0 0 12px',
            letterSpacing: '-0.2px'
          }}>{item.title}</h3>
              <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            color: 'rgba(247,246,243,0.55)',
            margin: 0,
            lineHeight: 1.7,
            fontWeight: 300
          }}>{item.description}</p>
            </motion.div>)}
        </motion.div>

        {/* Closing statement */}
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={scaleReveal} custom={0.4} style={{
        textAlign: 'center',
        marginBottom: '52px'
      }}>
          <h2 style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: isMobile ? 'clamp(24px, 6vw, 36px)' : 'clamp(32px, 4vw, 52px)',
          fontWeight: 300,
          letterSpacing: '-3px',
          lineHeight: 1.04,
          margin: 0
        }}>
            <span style={{
            color: '#F7F6F3'
          }}>Creating Ventures.</span>
            <em style={{
            fontStyle: 'italic',
            color: '#DE322D'
          }}> Unlocking Capital.</em>
            <span style={{
            color: 'rgba(247,246,243,0.2)'
          }}> Powering Africa's Future.</span>
          </h2>
        </motion.div>

        {/* CTA buttons */}
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUpVariants} custom={0.5} style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap' as const
      }}>
          <motion.a href="/partnerships"  whileHover={{
          scale: 1.04
        }} whileTap={{
          scale: 0.97
        }} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          border: '1px solid rgba(247,246,243,0.25)',
          borderRadius: '44px',
          padding: '14px 28px',
          fontSize: '13px',
          letterSpacing: '0.04em',
          color: 'rgba(247,246,243,0.82)',
          textDecoration: 'none',
          fontFamily: 'Montserrat, sans-serif',
          transition: 'border-color 0.3s ease, color 0.3s ease'
        }} onMouseEnter={e => {
          const el = e.currentTarget as HTMLAnchorElement;
          el.style.borderColor = 'rgba(247,246,243,0.55)';
          el.style.color = '#F7F6F3';
        }} onMouseLeave={e => {
          const el = e.currentTarget as HTMLAnchorElement;
          el.style.borderColor = 'rgba(247,246,243,0.25)';
          el.style.color = 'rgba(247,246,243,0.82)';
        }}>
            <span>Partner With Us</span>
          </motion.a>
          <motion.a href="/summit" whileHover={{
          scale: 1.04,
          boxShadow: '0 12px 48px rgba(222,50,45,0.65)'
        }} whileTap={{
          scale: 0.97
        }} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'linear-gradient(135deg, #DE322D, #c42823)',
          borderRadius: '44px',
          padding: '14px 28px',
          fontSize: '13px',
          letterSpacing: '0.05em',
          color: '#fff',
          textDecoration: 'none',
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: 600,
          boxShadow: '0 4px 16px rgba(222,50,45,0.38)',
          transition: 'box-shadow 0.3s ease'
        }}>
            <span>Apply to Attend</span>
            <ArrowIconDark />
          </motion.a>
        </motion.div>
      </div>
    </section>;
};

// ─── Footer ───────────────────────────────────────────────────────────────────
const FOOTER_NAV_LINKS = [{
  id: 'fn-home',
  label: 'Home'
}, {
  id: 'fn-about',
  label: 'About Us'
}, {
  id: 'fn-programme',
  label: 'Programme'
}, {
  id: 'fn-experience',
  label: 'Experience Zones'
}, {
  id: 'fn-strategic',
  label: 'Strategic Advisory'
}, {
  id: 'fn-partnerships',
  label: 'Partnerships'
}, {
  id: 'fn-apply',
  label: 'Apply to Attend'
}, {
  id: 'fn-contact',
  label: 'Contact Us'
}];
const SiteFooter = () => {
  const isMobile = useIsMobile();
  return <footer style={{
    background: '#0F0D0B',
    width: '100%',
    boxSizing: 'border-box',
    overflow: 'hidden',
    position: 'relative',
    borderTop: '0.8px solid rgba(247,246,243,0.07)'
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
      {/* Top strip */}
      <div aria-hidden="true" style={{
      position: 'absolute',
      top: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '80%',
      height: '1px',
      background: 'linear-gradient(90deg, transparent, rgba(222,50,45,0.5), transparent)',
      pointerEvents: 'none',
      zIndex: 1
    }} />

      <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: isMobile ? '0 24px' : '0 64px',
      position: 'relative',
      zIndex: 2
    }}>
        {/* Logo row */}
        <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'flex-start' : 'center',
        gap: '24px',
        padding: '48px 0 28px',
        borderBottom: '0.8px solid rgba(247,246,243,0.07)'
      }}>
          {/* Logo */}
          <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
            <div style={{
            width: '32px',
            height: '32px',
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
            </div>
            <span style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '13px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase' as const,
            color: '#F7F6F3',
            fontWeight: 700
          }}>EmpowaSummit</span>
          </div>

          {/* Tagline */}
          {!isMobile && <span style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '12px',
          color: 'rgba(247,246,243,0.25)',
          letterSpacing: '0.08em',
          textAlign: 'center',
          fontStyle: 'italic'
        }}>
              Africa's Premier Capital Movement · Johannesburg 2026
            </span>}

          {/* Social links */}
          <div style={{
          display: 'flex',
          gap: '16px',
          alignItems: 'center'
        }}>
            {[{
            id: 'soc-x',
            label: 'X (Twitter)',
            path: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z'
          }, {
            id: 'soc-li',
            label: 'LinkedIn',
            path: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z'
          }, {
            id: 'soc-ig',
            label: 'Instagram',
            path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z'
          }].map(social => <a key={social.id} href="#" onClick={e => e.preventDefault()} aria-label={social.label} style={{
            color: 'rgba(247,246,243,0.28)',
            transition: 'color 0.2s',
            textDecoration: 'none'
          }} onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.color = '#F7F6F3';
          }} onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(247,246,243,0.28)';
          }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d={social.path} />
                </svg>
              </a>)}
          </div>
        </div>

        {/* Nav links row */}
        <div style={{
        display: 'flex',
        flexWrap: 'wrap' as const,
        gap: '8px 24px',
        padding: '24px 0',
        borderBottom: '0.8px solid rgba(247,246,243,0.07)',
        alignItems: 'center'
      }}>
          {FOOTER_NAV_LINKS.map(link => <a key={link.id} href="#" onClick={e => e.preventDefault()} style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '12px',
          color: 'rgba(247,246,243,0.4)',
          textDecoration: 'none',
          letterSpacing: '0.04em',
          transition: 'color 0.2s'
        }} onMouseEnter={e => {
          (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(247,246,243,0.9)';
        }} onMouseLeave={e => {
          (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(247,246,243,0.4)';
        }}>
              {link.label}
            </a>)}
        </div>

        {/* Bottom row */}
        <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'flex-start' : 'center',
        gap: '12px',
        padding: '24px 0 32px'
      }}>
          <span style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '11px',
          color: 'rgba(247,246,243,0.2)',
          letterSpacing: '0.04em'
        }}>
            © 2026 EmpowaEntrepreneurs™. All rights reserved.
          </span>
          <span style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '11px',
          color: 'rgba(247,246,243,0.28)',
          fontStyle: 'italic',
          letterSpacing: '0.02em'
        }}>
            Creating Ventures. Unlocking Capital. Powering Africa's Future.
          </span>
        </div>
      </div>
    </footer>;
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export const StrategicAdvisoryPage = () => {
  return <div style={{
    background: '#141210',
    overflowX: 'hidden',
    width: '100%',
    minHeight: '100vh'
  }}>
      <HeroSection />
      <LogoBanner />
      <IntroSection />
      <OfferingsSection />
      <EdgeSection />
      <AfricaExpansionRoadmap />
      <ValueSection />
    </div>;
};