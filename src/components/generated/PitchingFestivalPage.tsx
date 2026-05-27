import { LogoBanner } from './AgencyComponents';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView, useAnimationFrame, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { PitchingFestivalModal } from './PitchingFestivalModal';

const REGISTRATION_DEADLINE = new Date("2026-05-27T19:59:00+02:00");

// ─── Noise texture ─────────────────────────────────────────────────────────────
const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`;

// ─── Responsive hook: three breakpoints ──────────────────────────────────────
type Breakpoint = {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
};
const useBreakpoint = (): Breakpoint => {
  const [bp, setBp] = useState<Breakpoint>({
    isMobile: false,
    isTablet: false,
    isDesktop: true
  });
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setBp({
        isMobile: w < 768,
        isTablet: w >= 768 && w < 1200,
        isDesktop: w >= 1200
      });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return bp;
};

// Keep the old hook as an alias so existing usages compile
const useIsMobile = () => useBreakpoint().isMobile;

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

// ─── SVG Icons ─────────────────────────────────────────────────────────────────
const ArrowIconDark = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
  <path d="M2 12L12 2M12 2H4M12 2V10" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
</svg>;
const PlusSquareIconLight = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
  <path d="M16.25 2.5H3.75C3.41848 2.5 3.10054 2.6317 2.86612 2.86612C2.6317 3.10054 2.5 3.41848 2.5 3.75V16.25C2.5 16.5815 2.6317 16.8995 2.86612 17.1339C3.10054 17.3683 3.41848 17.5 3.75 17.5H16.25C16.5815 17.5 16.8995 17.3683 17.1339 17.1339C17.3683 16.8995 17.5 16.5815 17.5 16.25V3.75C17.5 3.41848 17.3683 3.10054 17.1339 2.86612C16.8995 2.6317 16.5815 2.5 16.25 2.5ZM13.125 10.625H10.625V13.125C10.625 13.2908 10.5592 13.4497 10.4419 13.5669C10.3247 13.6842 10.1658 13.75 10 13.75C9.83424 13.75 9.67527 13.6842 9.55806 13.5669C9.44085 13.4497 9.375 13.2908 9.375 13.125V10.625H6.875C6.70924 10.625 6.55027 10.5592 6.43306 10.4419C6.31585 10.3247 6.25 10.1658 6.25 10C6.25 9.83424 6.31585 9.67527 6.43306 9.55806C6.55027 9.44085 6.70924 9.375 6.875 9.375H9.375V6.875C9.375 6.70924 9.44085 6.55027 9.55806 6.43306C9.67527 6.31585 9.83424 6.25 10 6.25C10.1658 6.25 10.3247 6.31585 10.4419 6.43306C10.5592 6.55027 10.625 6.70924 10.625 6.875V9.375H13.125C13.2908 9.375 13.4497 9.44085 13.5669 9.55806C13.6842 9.67527 13.75 9.83424 13.75 10C13.75 10.1658 13.6842 10.3247 13.5669 10.4419C13.4497 10.5592 13.2908 10.625 13.125 10.625Z" fill="rgba(247,246,243,0.35)" />
</svg>;
const PlusSquareIcon = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
  <path d="M16.25 2.5H3.75C3.41848 2.5 3.10054 2.6317 2.86612 2.86612C2.6317 3.10054 2.5 3.41848 2.5 3.75V16.25C2.5 16.5815 2.6317 16.8995 2.86612 17.1339C3.10054 17.3683 3.41848 17.5 3.75 17.5H16.25C16.5815 17.5 16.8995 17.3683 17.1339 17.1339C17.3683 16.8995 17.5 16.5815 17.5 16.25V3.75C17.5 3.41848 17.3683 3.10054 17.1339 2.86612C16.8995 2.6317 16.5815 2.5 16.25 2.5ZM13.125 10.625H10.625V13.125C10.625 13.2908 10.5592 13.4497 10.4419 13.5669C10.3247 13.6842 10.1658 13.75 10 13.75C9.83424 13.75 9.67527 13.6842 9.55806 13.5669C9.44085 13.4497 9.375 13.2908 9.375 13.125V10.625H6.875C6.70924 10.625 6.55027 10.5592 6.43306 10.4419C6.31585 10.3247 6.25 10.1658 6.25 10C6.25 9.83424 6.31585 9.67527 6.43306 9.55806C6.55027 9.44085 6.70924 9.375 6.875 9.375H9.375V6.875C9.375 6.70924 9.44085 6.55027 9.55806 6.43306C9.67527 6.31585 9.83424 6.25 10 6.25C10.1658 6.25 10.3247 6.31585 10.4419 6.43306C10.5592 6.55027 10.625 6.70924 10.625 6.875V9.375H13.125C13.2908 9.375 13.4497 9.44085 13.5669 9.55806C13.6842 9.67527 13.75 9.83424 13.75 10C13.75 10.1658 13.6842 10.3247 13.5669 10.4419C13.4497 10.5592 13.2908 10.625 13.125 10.625Z" fill="#DE322D" />
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
  label: 'Dragons Den Format'
}, {
  id: 'tk-2',
  label: 'Real Capital · Real Deals'
}, {
  id: 'tk-3',
  label: "Africa's Premier Deal Arena"
}, {
  id: 'tk-4',
  label: 'Invitation-Led Selection'
}, {
  id: 'tk-5',
  label: 'Elite Investor Panel'
}, {
  id: 'tk-6',
  label: 'Continental Opportunity'
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
          }}>
            {item.label}
          </span>
        </div>)}
      </div>)}
    </div>
  </div>;
};

// ─── StickyNav ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [{
  id: 'overview',
  label: 'Overview'
}, {
  id: 'pillars',
  label: 'Why Apply'
}, {
  id: 'eligibility',
  label: 'Eligibility'
}, {
  id: 'experience',
  label: 'Experience'
}, {
  id: 'apply',
  label: 'Apply Now'
}];
const StickyNav = () => {
  const [isClosed, setIsClosed] = useState(false);
  useEffect(() => {
    const check = () => setIsClosed(new Date() > REGISTRATION_DEADLINE);
    check();
    const id = setInterval(check, 1000);
    return () => clearInterval(id);
  }, []);

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
      padding: scrolled ? isMobile ? '10px 20px' : '12px 32px' : isMobile ? '14px 20px' : '20px 32px',
      background: scrolled ? 'rgba(247,246,243,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(32px) saturate(2.5)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(32px) saturate(2.5)' : 'none',
      borderBottom: scrolled ? '0.8px solid rgba(20,18,16,0.07)' : '0.8px solid transparent',
      transition: 'padding 0.35s ease, background 0.35s ease, border-color 0.35s ease'
    }}>
      {/* Logo */}
      <a href="#" onClick={e => e.preventDefault()} style={{
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

      {/* Desktop nav links */}
      {!showHamburger && <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '28px'
      }}>
        {NAV_ITEMS.map(item => <a key={item.id} href="#" onClick={e => e.preventDefault()} style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '12px',
          textDecoration: 'none',
          letterSpacing: '0.04em',
          transition: 'color 0.2s',
          color: navLinkColor
        }} onMouseEnter={e => {
          (e.currentTarget as HTMLAnchorElement).style.color = navLinkHoverColor;
        }} onMouseLeave={e => {
          (e.currentTarget as HTMLAnchorElement).style.color = navLinkColor;
        }}>
          {item.label}
        </a>)}
        <div style={{
          display: 'flex',
          gap: '8px'
        }}>
          <motion.a href="#" onClick={e => e.preventDefault()} whileHover={{
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
          }}>
            <span>Become a Funder</span>
          </motion.a>
          <motion.a href="#" onClick={e => { e.preventDefault(); if (!isClosed) window.dispatchEvent(new Event('openPitchModal')); }} whileHover={!isClosed ? {
            scale: 1.04
          } : {}} whileTap={!isClosed ? {
            scale: 0.97
          } : {}} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: isClosed ? 'rgba(247,246,243,0.1)' : 'linear-gradient(135deg, #DE322D, #c42823)',
            borderRadius: '44px',
            padding: '8px 16px',
            fontSize: '12px',
            letterSpacing: '0.06em',
            color: isClosed ? 'rgba(247,246,243,0.4)' : '#fff',
            textDecoration: 'none',
            fontFamily: 'Montserrat, sans-serif',
            boxShadow: isClosed ? 'none' : '0 4px 16px rgba(222,50,45,0.38)',
            cursor: isClosed ? 'default' : 'pointer'
          }}>
            <span>{isClosed ? 'Applications Closed' : 'Apply to Pitch'}</span>
          </motion.a>
        </div>
      </div>}

      {/* Hamburger (mobile + tablet) */}
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

    {/* Mobile/tablet dropdown */}
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
        padding: isTablet ? '24px 32px 28px' : '20px 24px 24px'
      }}>
        {isTablet && <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px 24px',
          marginBottom: '20px',
          paddingBottom: '20px',
          borderBottom: '0.8px solid rgba(20,18,16,0.06)'
        }}>
          {NAV_ITEMS.map(item => <a key={item.id} href="#" onClick={e => {
            e.preventDefault();
            setMobileMenuOpen(false);
          }} style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '13px',
            color: 'rgba(20,18,16,0.65)',
            textDecoration: 'none',
            letterSpacing: '0.02em',
            padding: '4px 0'
          }}>
            {item.label}
          </a>)}
        </div>}
        {!isTablet && NAV_ITEMS.map(item => <a key={item.id} href="#" onClick={e => {
          e.preventDefault();
          setMobileMenuOpen(false);
        }} style={{
          display: 'block',
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '16px',
          color: 'rgba(20,18,16,0.65)',
          textDecoration: 'none',
          padding: '12px 0',
          borderBottom: '0.8px solid rgba(20,18,16,0.06)',
          letterSpacing: '0.02em'
        }}>
          {item.label}
        </a>)}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginTop: '20px',
          flexWrap: 'wrap'
        }}>
          <a href="/partnerships" style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '13px',
            border: '1px solid rgba(20,18,16,0.18)',
            borderRadius: '44px',
            padding: '10px 20px',
            color: 'rgba(20,18,16,0.65)',
            textDecoration: 'none'
          }}>
            Become a Funder
          </a>
          <a href="#" onClick={e => { e.preventDefault(); if (!isClosed) window.dispatchEvent(new Event('openPitchModal')); }} style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '13px',
            background: isClosed ? 'rgba(20,18,16,0.1)' : 'linear-gradient(135deg, #DE322D, #c42823)',
            borderRadius: '44px',
            padding: '10px 20px',
            color: isClosed ? 'rgba(20,18,16,0.4)' : '#fff',
            textDecoration: 'none',
            cursor: isClosed ? 'default' : 'pointer'
          }}>{isClosed ? 'Applications Closed' : 'Apply to Pitch'}</a>
        </div>
      </motion.div>}
    </AnimatePresence>
  </motion.nav>;
};

// ─── Magnetic Button ──────────────────────────────────────────────────────────
type MagneticButtonProps = {
  label: string;
  variant?: 'primary' | 'outline' | 'ghost';
  onClick?: () => void;
  disabled?: boolean;
};
const MagneticButton = ({
  label,
  variant = 'primary',
  onClick,
  disabled
}: MagneticButtonProps) => {
  const magnetic = useMagnetic(0.3);
  const {
    isMobile
  } = useBreakpoint();
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    borderRadius: '44px',
    padding: isMobile ? '13px 22px' : '17px 34px',
    fontSize: '13px',
    letterSpacing: '0.05em',
    textDecoration: 'none',
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: 600,
    cursor: disabled ? 'default' : 'pointer',
    border: 'none',
    outline: 'none',
    whiteSpace: 'nowrap',
    opacity: disabled ? 0.7 : 1
  };
  const variantStyles: Record<string, React.CSSProperties> = {
    primary: disabled ? {
      background: 'rgba(247,246,243,0.1)',
      color: 'rgba(247,246,243,0.4)',
      boxShadow: 'none'
    } : {
      background: 'linear-gradient(135deg, #DE322D 0%, #c42823 100%)',
      color: '#fff',
      boxShadow: '0 8px 36px rgba(222,50,45,0.55), 0 2px 8px rgba(222,50,45,0.3)'
    },
    outline: {
      background: 'transparent',
      color: '#F7F6F3',
      border: '1px solid rgba(247,246,243,0.28)'
    },
    ghost: {
      background: 'rgba(247,246,243,0.06)',
      color: 'rgba(247,246,243,0.75)',
      border: '1px solid rgba(247,246,243,0.12)'
    }
  };
  return <motion.div ref={magnetic.ref} onMouseMove={magnetic.handleMouseMove} onMouseLeave={magnetic.handleMouseLeave} style={{
    x: magnetic.springX,
    y: magnetic.springY,
    display: 'inline-flex'
  }}>
    <motion.button whileHover={{
      scale: 1.05
    }} whileTap={{
      scale: 0.97
    }} onClick={onClick} style={{
      ...baseStyle,
      ...variantStyles[variant]
    }}>
      <span>{label}</span>
      {variant === 'primary' && <ArrowIconDark />}
    </motion.button>
  </motion.div>;
};

// ─── Hero Section ─────────────────────────────────────────────────────────────
const HERO_BG = '/EmpowaEntrepreneur-banner11.jpg';
const HeroSection = () => {
  const [isClosed, setIsClosed] = useState(false);
  useEffect(() => {
    const check = () => setIsClosed(new Date() > REGISTRATION_DEADLINE);
    check();
    const id = setInterval(check, 1000);
    return () => clearInterval(id);
  }, []);

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

  // Fluid font sizing across breakpoints
  const heroFontSize = isMobile ? 'clamp(36px, 10.5vw, 60px)' : isTablet ? 'clamp(52px, 8.5vw, 82px)' : 'clamp(62px, 7.2vw, 114px)';
  const heroPadding = isMobile ? '32px 20px 32px' : isTablet ? '40px 40px 40px' : '48px 64px 48px';
  const heroLetterSpacing = isMobile ? '-1.5px' : isTablet ? '-2px' : '-3.5px';
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
    {/* BG image */}
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
    {/* Overlays */}
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
    {/* Radial accent */}
    <div aria-hidden="true" style={{
      position: 'absolute',
      top: '5%',
      right: '-5%',
      width: 'clamp(300px, 60vw, 920px)',
      height: 'clamp(300px, 60vw, 920px)',
      borderRadius: '50%',
      background: 'radial-gradient(circle at 40% 40%, rgba(222,50,45,0.28) 0%, rgba(222,50,45,0.08) 45%, transparent 70%)',
      pointerEvents: 'none',
      zIndex: 3
    }} />
    {/* Corner accents: hide on very small screens */}
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
      {/* Eyebrow */}
      <motion.div custom={0.05} initial="hidden" animate="visible" variants={fadeUpVariants} style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: isMobile ? '28px' : '40px',
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
          <span> · Pitch Perfect 2026 - </span>
          <span style={{
            color: '#DE322D',
            fontWeight: 600
          }}>Africa's Deal Arena</span>
        </span>
      </motion.div>

      {/* Headline */}
      <h1 style={{
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: 300,
        margin: `0 0 ${isMobile ? '32px' : '48px'}`,
        lineHeight: 0.92,
        letterSpacing: heroLetterSpacing
      }}>
        <div style={{
          overflow: 'hidden',
          display: 'block'
        }}>
          {['The', 'Pitching'].map((word, i) => <motion.span key={`l1-${word}`} initial={{
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
            fontSize: heroFontSize,
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
            fontSize: heroFontSize,
            color: '#DE322D',
            marginRight: '0.22em'
          }}>
            Festival
          </motion.em>
        </div>
        <div style={{
          overflow: 'hidden',
          display: 'block'
        }}>
          {["Africa's", 'Premier'].map((word, i) => <motion.span key={`l3-${word}`} initial={{
            y: '110%',
            opacity: 0
          }} animate={{
            y: '0%',
            opacity: 1
          }} transition={{
            duration: 0.9,
            delay: 0.58 + i * 0.1,
            ease: [0.22, 1, 0.36, 1]
          }} style={{
            display: 'inline-block',
            fontSize: heroFontSize,
            color: 'rgba(247,246,243,0.18)',
            marginRight: '0.22em'
          }}>
            {word}
          </motion.span>)}
          <motion.span initial={{
            y: '110%',
            opacity: 0
          }} animate={{
            y: '0%',
            opacity: 1
          }} transition={{
            duration: 0.9,
            delay: 0.78,
            ease: [0.22, 1, 0.36, 1]
          }} style={{
            display: 'inline-block',
            fontSize: heroFontSize,
            color: 'rgba(247,246,243,0.18)',
            marginRight: '0.22em'
          }}>
            Deal-Making Arena
          </motion.span>
        </div>
      </h1>

      <motion.div custom={0.85} initial="hidden" animate="visible" variants={fadeUpVariants} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        maxWidth: isMobile ? '100%' : isTablet ? '520px' : '520px'
      }}>
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: isMobile ? '14px' : isTablet ? '15px' : 'clamp(15px, 1.4vw, 17px)',
          lineHeight: '1.8',
          color: 'rgba(247,246,243,0.68)',
          margin: 0,
          fontWeight: 300
        }}>
          Where Africa's most investment-ready founders face off before a panel of elite funders in the continent's
          highest-stakes pitching environment. No presentations. No proposals. Just deals.
        </p>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          <MagneticButton label={isClosed ? "Applications Closed" : "Apply to Pitch"} variant="primary" disabled={isClosed} onClick={isClosed ? undefined : () => window.dispatchEvent(new Event('openPitchModal'))} />
          <MagneticButton label="Become a Funder" variant="outline" onClick={() => window.location.href = '/partnerships'} />
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(247,246,243,0.08)',
          flexWrap: 'wrap'
        }}>
          {[{
            id: 'hs-1',
            value: '60+',
            label: 'Elite Funders'
          }, {
            id: 'hs-2',
            value: '100',
            label: 'Pitch Slots'
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
            }}>
              {stat.value}
            </span>
            <span style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '10px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(247,246,243,0.28)',
              fontWeight: 500
            }}>
              {stat.label}
            </span>
          </div>)}
        </div>
      </motion.div>
    </motion.div>

    {/* Ticker strip */}
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
      position: 'relative'
    }}>
      <HeroTicker light />
    </motion.div>
  </section>;
};

// ─── Core Pillars ─────────────────────────────────────────────────────────────
type Pillar = {
  id: string;
  index: string;
  title: string;
  description: string;
  accentColor: string;
  imageSrc: string;
  imageAlt: string;
};
const PILLARS: Pillar[] = [{
  id: 'p-access',
  index: '01',
  title: 'Elite Access',
  accentColor: '#DE322D',
  description: 'The Pitching Festival assembles the most serious capital allocators on the continent: DFIs, institutional VCs, angel syndicates, and family offices who arrive with genuine deployment mandates.',
  imageSrc: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80',
  imageAlt: 'Elite access to serious capital allocators'
}, {
  id: 'p-dealflow',
  index: '02',
  title: 'Serious Deal Flow',
  accentColor: '#3c4d5d',
  description: 'No spectators. Every pitch is structured for deal-making. Founders present to committed funders in private breakout rooms engineered for the focused due-diligence conversations that close rounds.',
  imageSrc: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80',
  imageAlt: 'Serious deal flow sessions'
}, {
  id: 'p-exclusivity',
  index: '03',
  title: 'Investor Exclusivity',
  accentColor: '#6B5E4A',
  description: 'Funders at the Pitching Festival are vetted and exclusive. No casual observers: every investor participant commits to active deal engagement, ensuring founders receive undivided, actionable attention.',
  imageSrc: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&q=80',
  imageAlt: 'Exclusive investor panels'
}, {
  id: 'p-continental',
  index: '04',
  title: 'Continental Opportunity',
  accentColor: '#2D6A4F',
  description: "Africa's 54-market opportunity is too large to approach with a single-country lens. The Pitching Festival surfaces startups across 30+ markets, unlocking cross-border capital and multi-market expansion mandates.",
  imageSrc: 'https://images.unsplash.com/photo-1560439514-4e9645039924?w=800&q=80',
  imageAlt: 'Continental business opportunity'
}];
const PillarsSection = () => {
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
  const isNarrow = isMobile;
  const sectionPad = isMobile ? '80px 0' : isTablet ? '112px 0' : '144px 0';
  const innerPad = isMobile ? '0 20px' : isTablet ? '0 40px' : '0 64px';
  const headingSize = isMobile ? 'clamp(26px, 7vw, 40px)' : isTablet ? 'clamp(30px, 4.5vw, 52px)' : 'clamp(34px, 4.2vw, 62px)';
  const cardMinH = isMobile ? '300px' : isTablet ? '360px' : '400px';
  const cardPad = isMobile ? '24px 20px' : isTablet ? '28px 28px' : '36px 36px';
  const cardTitleSize = isMobile ? 'clamp(18px, 5vw, 24px)' : isTablet ? 'clamp(20px, 2.5vw, 26px)' : 'clamp(22px, 2vw, 30px)';
  return <section ref={sectionRef} style={{
    background: '#F7F6F3',
    padding: sectionPad,
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
      opacity: 0.4
    }} />
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: innerPad,
      position: 'relative',
      zIndex: 1
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: isMobile ? '44px' : isTablet ? '60px' : '80px',
        flexWrap: 'wrap',
        gap: '24px'
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
              fontSize: '12px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(20,18,16,0.45)',
              fontWeight: 600
            }}>
              Why the Pitching Festival?
            </span>
          </motion.div>
          <div style={{
            overflow: 'hidden'
          }}>
            <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.1} style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: headingSize,
              fontWeight: 300,
              letterSpacing: '-2px',
              lineHeight: 1.03,
              color: '#141210',
              margin: 0,
              maxWidth: '640px'
            }}>
              <span>Built for those who </span>
              <em style={{
                fontStyle: 'italic',
                color: '#DE322D'
              }}>close deals</em>
              <span style={{
                color: 'rgba(20,18,16,0.2)'
              }}>, not just make them.</span>
            </motion.h2>
          </div>
        </div>
        {!isNarrow && <motion.p initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideFromRight} custom={0.3} style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          color: 'rgba(20,18,16,0.4)',
          maxWidth: isTablet ? '240px' : '300px',
          lineHeight: '1.75',
          margin: 0
        }}>
          Four pillars that define the highest-stakes pitch environment on the African continent.
        </motion.p>}
      </div>

      {/* Cards grid - 1-col mobile, 2-col tablet+desktop */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isNarrow ? '1fr' : 'repeat(2, 1fr)',
        gap: isMobile ? '12px' : '16px'
      }}>
        {PILLARS.map((pillar, i) => <motion.div key={pillar.id} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={clipReveal} custom={i * 0.1} onMouseEnter={() => setHoveredId(pillar.id)} onMouseLeave={() => setHoveredId(null)} style={{
          borderRadius: '20px',
          overflow: 'hidden',
          background: '#e8e6e0',
          position: 'relative',
          minHeight: cardMinH,
          cursor: 'pointer'
        }}>
          <img src={pillar.imageSrc} alt={pillar.imageAlt} style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            filter: hoveredId === pillar.id ? 'brightness(0.5) saturate(0.7)' : 'brightness(0.55) saturate(0.65)',
            transform: hoveredId === pillar.id ? 'scale(1.04)' : 'scale(1)',
            transition: 'filter 0.7s ease, transform 0.8s cubic-bezier(0.22,1,0.36,1)'
          }} />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: hoveredId === pillar.id ? 'linear-gradient(to top, rgba(10,9,8,0.97) 0%, rgba(10,9,8,0.45) 60%, transparent 100%)' : 'linear-gradient(to top, rgba(10,9,8,0.72) 0%, rgba(10,9,8,0.18) 55%, rgba(232,230,224,0.12) 100%)',
            transition: 'opacity 0.6s ease',
            pointerEvents: 'none'
          }} />
          {hoveredId === pillar.id && <div aria-hidden="true" style={{
            position: 'absolute',
            bottom: '-15%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${pillar.accentColor}28 0%, transparent 70%)`,
            pointerEvents: 'none'
          }} />}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: cardPad
          }}>
            <div style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '11px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(247,246,243,0.35)',
              fontWeight: 500
            }}>
              {pillar.index}
            </div>
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '14px'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: pillar.accentColor,
                  flexShrink: 0
                }} />
                <h3 style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: cardTitleSize,
                  fontWeight: 400,
                  letterSpacing: '-0.6px',
                  color: '#F7F6F3',
                  margin: 0,
                  lineHeight: 1.1
                }}>
                  {pillar.title}
                </h3>
              </div>
              <AnimatePresence initial={false}>
                {(hoveredId === pillar.id || isNarrow) && <motion.p key={`desc-${pillar.id}`} initial={{
                  height: 0,
                  opacity: 0
                }} animate={{
                  height: 'auto',
                  opacity: 1
                }} exit={{
                  height: 0,
                  opacity: 0
                }} transition={{
                  duration: 0.45,
                  ease: [0.22, 1, 0.36, 1]
                }} style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '13px',
                  lineHeight: '1.75',
                  color: 'rgba(247,246,243,0.55)',
                  margin: 0,
                  fontWeight: 300,
                  overflow: 'hidden'
                }}>
                  {pillar.description}
                </motion.p>}
              </AnimatePresence>
              <div style={{
                height: '2px',
                background: `linear-gradient(90deg, ${pillar.accentColor}, transparent)`,
                marginTop: '20px',
                opacity: hoveredId === pillar.id ? 1 : 0,
                transition: 'opacity 0.4s ease',
                borderRadius: '2px'
              }} />
            </div>
          </div>
        </motion.div>)}
      </div>
    </div>
  </section>;
};

// ─── Eligibility & Selection Section ─────────────────────────────────────────
type EligCriterion = {
  id: string;
  category: string;
  title: string;
  description: string;
  status: 'required' | 'preferred' | 'notice';
};
const ELIGIBILITY_CRITERIA: EligCriterion[] = [{
  id: 'ec-stage',
  category: 'Stage',
  title: 'Proven Traction',
  status: 'required',
  description: 'Your business must demonstrate measurable market traction: revenue, users, or validated pilots. Pre-idea applicants will not be considered.'
}, {
  id: 'ec-invite',
  category: 'Selection Mode',
  title: 'Invitation-Led',
  status: 'required',
  description: 'Selection to the Pitching Festival is by invitation or through a rigorous screening process. Only the top 100 applicants across all submitted businesses are advanced to pitch.'
}, {
  id: 'ec-funding',
  category: 'Capital Readiness',
  title: 'Funding Readiness',
  status: 'required',
  description: 'Applicants must have a clear funding requirement, investment instrument defined, and use of proceeds articulated. Businesses without an active funding ask will not proceed.'
}, {
  id: 'ec-market',
  category: 'Geography',
  title: 'African-Market Nexus',
  status: 'preferred',
  description: 'Your business must operate in, serve, or be directly expanding into African markets. Diaspora-led businesses with active African operations are eligible.'
}, {
  id: 'ec-scalability',
  category: 'Growth',
  title: 'Scalability Thesis',
  status: 'preferred',
  description: 'Funders are looking for businesses capable of multi-market scale. Hyper-local businesses without a credible expansion thesis are unlikely to receive investment interest.'
}, {
  id: 'ec-notice',
  category: 'Notice',
  title: 'Application Window is Limited',
  status: 'notice',
  description: 'Only 100 pitching slots are available across the entire festival. Applications close 60 days before the event or upon capacity: whichever comes first. Early application is strongly advised.'
}];
const EligibilitySection = () => {
  const [isClosed, setIsClosed] = useState(false);
  useEffect(() => {
    const check = () => setIsClosed(new Date() > REGISTRATION_DEADLINE);
    check();
    const id = setInterval(check, 1000);
    return () => clearInterval(id);
  }, []);

  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, {
    once: true,
    margin: '-80px 0px'
  });
  const {
    isMobile,
    isTablet
  } = useBreakpoint();
  const requiredCriteria = ELIGIBILITY_CRITERIA.filter(c => c.status === 'required');
  const preferredCriteria = ELIGIBILITY_CRITERIA.filter(c => c.status === 'preferred');
  const noticeCriteria = ELIGIBILITY_CRITERIA.filter(c => c.status === 'notice');
  const sectionPad = isMobile ? '80px 0' : isTablet ? '112px 0' : '144px 0';
  const innerPad = isMobile ? '0 20px' : isTablet ? '0 40px' : '0 64px';
  const headingSize = isMobile ? 'clamp(30px, 9vw, 48px)' : isTablet ? 'clamp(34px, 5.5vw, 60px)' : 'clamp(38px, 4.8vw, 70px)';
  return <section ref={sectionRef} style={{
    background: '#F7F6F3',
    padding: sectionPad,
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
      opacity: 0.4
    }} />
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: innerPad,
      position: 'relative',
      zIndex: 1
    }}>

      {/* Header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr' : '5fr 4fr',
        gap: isMobile ? '24px' : isTablet ? '24px' : '80px',
        alignItems: 'end',
        marginBottom: isMobile ? '48px' : isTablet ? '64px' : '88px'
      }}>
        <div>
          <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={rotateFade} custom={0} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '24px'
          }}>
            <PlusSquareIcon />
            <span style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '12px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(20,18,16,0.45)',
              fontWeight: 600
            }}>
              Eligibility & Selection
            </span>
          </motion.div>
          <div style={{
            overflow: 'hidden'
          }}>
            <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.1} style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: headingSize,
              fontWeight: 300,
              letterSpacing: '-2px',
              lineHeight: 0.97,
              color: '#141210',
              margin: 0
            }}>
              <span>Entry </span>
              <em style={{
                fontStyle: 'italic',
                color: '#DE322D'
              }}>protocol</em>
              <span style={{
                color: 'rgba(20,18,16,0.18)'
              }}> for serious</span>
              <br />
              <span style={{
                color: 'rgba(20,18,16,0.18)'
              }}>founders only.</span>
            </motion.h2>
          </div>
        </div>
        <motion.p initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={isMobile ? fadeUpVariants : slideFromRight} custom={0.3} style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: isMobile ? '14px' : '15px',
          lineHeight: '1.8',
          color: 'rgba(20,18,16,0.48)',
          margin: 0,
          fontWeight: 300
        }}>
          Selection is deliberately restrictive to ensure every pitch meeting converts to a meaningful conversation.
          Here's exactly what it takes to qualify.
        </motion.p>
      </div>

      {/* Required cards - 1-col mobile, 2-col tablet, 3-col desktop */}
      <div style={{
        marginBottom: isMobile ? '20px' : '16px'
      }}>
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUpVariants} custom={0.15} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '16px'
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
            fontSize: '9px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#DE322D',
            fontWeight: 700
          }}>
            Required to qualify
          </span>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
          gap: '12px'
        }}>
          {requiredCriteria.map((crit, i) => <motion.div key={crit.id} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={clipReveal} custom={0.2 + i * 0.1} style={{
            background: '#3c4d5d',
            borderRadius: '20px',
            padding: isMobile ? '24px 20px' : isTablet ? '28px 24px' : '36px 32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: isMobile ? '180px' : isTablet ? '220px' : '260px',
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
            }}>
              {String(i + 1).padStart(2, '0')}
            </div>
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
              }}>
                {crit.category}
              </span>
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
              }}>
                Required
              </span>
            </div>
            <div>
              <h4 style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: isMobile ? '20px' : isTablet ? '21px' : 'clamp(20px, 2vw, 26px)',
                fontWeight: 500,
                letterSpacing: '-0.6px',
                color: '#F7F6F3',
                margin: '0 0 12px',
                lineHeight: 1.1
              }}>
                {crit.title}
              </h4>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
                lineHeight: '1.75',
                color: 'rgba(247,246,243,0.42)',
                margin: 0,
                fontWeight: 300
              }}>
                {crit.description}
              </p>
            </div>
          </motion.div>)}
        </div>
      </div>

      {/* Preferred cards - 1-col mobile, 2-col tablet+ */}
      <div style={{
        marginBottom: isMobile ? '20px' : '16px'
      }}>
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUpVariants} custom={0.38} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '16px',
          marginTop: isMobile ? '20px' : '0'
        }}>
          <div style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: 'rgba(20,18,16,0.3)',
            flexShrink: 0
          }} />
          <span style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '9px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(20,18,16,0.4)',
            fontWeight: 700
          }}>
            Strongly preferred
          </span>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
          gap: '12px'
        }}>
          {preferredCriteria.map((crit, i) => <motion.div key={crit.id} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideFromLeft} custom={0.42 + i * 0.1} style={{
            background: '#FFFFFF',
            border: '1px solid rgba(20,18,16,0.1)',
            borderRadius: '20px',
            padding: isMobile ? '22px 20px' : isTablet ? '26px 28px' : '32px 36px',
            display: 'flex',
            gap: isMobile ? '16px' : '28px',
            alignItems: 'flex-start'
          }}>
            <div style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: isMobile ? '32px' : '48px',
              fontWeight: 800,
              letterSpacing: '-3px',
              lineHeight: 1,
              color: 'rgba(20,18,16,0.07)',
              flexShrink: 0,
              width: isMobile ? '44px' : '60px',
              marginTop: '-4px'
            }}>
              {String(i + 4).padStart(2, '0')}
            </div>
            <div style={{
              flex: 1,
              minWidth: 0
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                marginBottom: '10px'
              }}>
                <span style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '9px',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'rgba(20,18,16,0.3)',
                  fontWeight: 600
                }}>
                  {crit.category}
                </span>
                <span style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '9px',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  borderRadius: '100px',
                  padding: '4px 10px',
                  background: 'rgba(20,18,16,0.05)',
                  border: '1px solid rgba(20,18,16,0.1)',
                  color: 'rgba(20,18,16,0.4)'
                }}>
                  Preferred
                </span>
              </div>
              <h4 style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: isMobile ? '17px' : isTablet ? '19px' : '21px',
                fontWeight: 500,
                letterSpacing: '-0.4px',
                color: '#141210',
                margin: '0 0 10px',
                lineHeight: 1.15
              }}>
                {crit.title}
              </h4>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
                lineHeight: '1.75',
                color: 'rgba(20,18,16,0.45)',
                margin: 0,
                fontWeight: 300
              }}>
                {crit.description}
              </p>
            </div>
          </motion.div>)}
        </div>
      </div>

      {/* Notice banner */}
      {noticeCriteria.map((crit, i) => <motion.div key={crit.id} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={scaleReveal} custom={0.55 + i * 0.05} style={{
        background: 'linear-gradient(135deg, #DE322D 0%, #c42823 100%)',
        borderRadius: '20px',
        padding: isMobile ? '24px 20px' : isTablet ? '28px 32px' : '36px 48px',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'flex-start' : 'center',
        justifyContent: 'space-between',
        gap: isMobile ? '20px' : '48px',
        marginBottom: '16px'
      }}>
        <div style={{
          flex: 1
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '10px'
          }}>
            <span style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '9px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontWeight: 700,
              color: 'rgba(255,255,255,0.6)',
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.25)',
              borderRadius: '100px',
              padding: '4px 10px'
            }}>
              ⚠ Important Notice
            </span>
          </div>
          <h4 style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: isMobile ? '18px' : isTablet ? '22px' : 'clamp(20px, 2.2vw, 28px)',
            fontWeight: 700,
            letterSpacing: '-0.5px',
            color: '#FFFFFF',
            margin: '0 0 10px',
            lineHeight: 1.15
          }}>
            {crit.title}
          </h4>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            lineHeight: '1.75',
            color: 'rgba(255,255,255,0.75)',
            margin: 0,
            fontWeight: 300
          }}>
            {crit.description}
          </p>
        </div>
        <div style={{
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: isMobile ? 'flex-start' : 'flex-end',
          gap: '6px'
        }}>
          <div style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: isMobile ? '36px' : isTablet ? '44px' : '56px',
            fontWeight: 800,
            letterSpacing: '-3px',
            lineHeight: 1,
            color: 'rgba(255,255,255,0.15)'
          }}>
            100
          </div>
          <div style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '11px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.5)',
            whiteSpace: 'nowrap'
          }}>
            Slots Total
          </div>
        </div>
      </motion.div>)}

      {/* CTA row */}
      <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUpVariants} custom={0.62} style={{
        display: 'flex',
        alignItems: isMobile ? 'flex-start' : 'center',
        justifyContent: isMobile ? 'flex-start' : 'space-between',
        flexDirection: isMobile ? 'column' : 'row',
        gap: '24px',
        marginTop: '32px',
        paddingTop: '32px',
        borderTop: '1px solid rgba(20,18,16,0.08)',
        flexWrap: 'wrap'
      }}>
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '13px',
          color: 'rgba(20,18,16,0.38)',
          margin: 0,
          maxWidth: '440px',
          lineHeight: '1.7'
        }}>
          Applications are reviewed on a rolling basis. Qualified applicants will receive an invitation confirmation
          and pitch briefing pack within 7 business days.
        </p>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          <motion.a href="#" onClick={e => { e.preventDefault(); if (!isClosed) window.dispatchEvent(new Event('openPitchModal')); }} whileHover={!isClosed ? {
            scale: 1.04
          } : {}} whileTap={!isClosed ? {
            scale: 0.97
          } : {}} style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: isClosed ? 'rgba(247,246,243,0.1)' : '#141210',
            borderRadius: '44px',
            padding: '14px 28px',
            fontSize: '13px',
            letterSpacing: '0.05em',
            color: isClosed ? 'rgba(247,246,243,0.4)' : '#F7F6F3',
            textDecoration: 'none',
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 600,
            cursor: isClosed ? 'default' : 'pointer'
          }}>
            <span>{isClosed ? 'Applications Closed' : 'Apply to Pitch'}</span>
            {!isClosed && <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M2 12L12 2M12 2H4M12 2V10" stroke="#F7F6F3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>}
          </motion.a>
        </div>
      </motion.div>
    </div>
  </section>;
};

// ─── Experience Section ───────────────────────────────────────────────────────
type ExperienceItem = {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  imageSrc: string;
  imageAlt: string;
};
const EXPERIENCE_ITEMS: ExperienceItem[] = [{
  id: 'exp-capital',
  index: '01',
  title: 'Real Capital',
  subtitle: 'No simulation. No feedback loops.',
  description: "Investors at the Pitching Festival arrive with active deployment mandates. This is not a practice round: founders who qualify face funders with the authority and appetite to wire funds. Every seat in the room represents a potential term sheet.",
  badge: 'Live Deployment',
  imageSrc: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&q=80',
  imageAlt: 'Real capital deployment at the Pitching Festival'
}, {
  id: 'exp-deals',
  index: '02',
  title: 'Real Deals',
  subtitle: 'Structured for conversion, not content.',
  description: "The festival's architecture is engineered for deal closure: not networking cocktails and panel opinions. Private pitch rooms, back-to-back investor rotations, and structured follow-up sessions mean that deal pipelines are built in real-time.",
  badge: 'Deal Infrastructure',
  imageSrc: 'https://images.unsplash.com/photo-1543269664-56d93c1b41a6?w=800&q=80',
  imageAlt: 'Real deals closing at the festival'
}, {
  id: 'exp-growth',
  index: '03',
  title: 'Real Growth',
  subtitle: 'Capital plus context.',
  description: "Founders leave with more than a cheque. Strategic partnerships, procurement introductions, co-investor relationships, and ecosystem access are all activated through one condensed, high-intensity festival experience.",
  badge: 'Transformation',
  imageSrc: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80',
  imageAlt: 'Real growth outcomes for founders'
}];
const ExperienceSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, {
    once: true,
    margin: '-80px 0px'
  });
  const {
    isMobile,
    isTablet
  } = useBreakpoint();
  const [activeIdx, setActiveIdx] = useState(0);
  const showImagePanel = !isMobile && !isTablet;
  const sectionPad = isMobile ? '80px 0' : isTablet ? '112px 0' : '144px 0';
  const innerPad = isMobile ? '0 20px' : isTablet ? '0 40px' : '0 64px';
  const headingSize = isMobile ? 'clamp(26px, 8vw, 42px)' : isTablet ? 'clamp(30px, 5vw, 52px)' : 'clamp(34px, 4.5vw, 66px)';
  return <section ref={sectionRef} style={{
    background: '#141210',
    padding: sectionPad,
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
      opacity: 0.45
    }} />
    <div aria-hidden="true" style={{
      position: 'absolute',
      bottom: '0%',
      right: '-8%',
      width: 'clamp(300px, 55vw, 820px)',
      height: 'clamp(300px, 55vw, 820px)',
      borderRadius: '50%',
      background: 'radial-gradient(circle at 40% 60%, rgba(222,50,45,0.12) 0%, rgba(222,50,45,0.03) 50%, transparent 70%)',
      pointerEvents: 'none'
    }} />
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: innerPad,
      position: 'relative',
      zIndex: 1
    }}>
      {/* Eyebrow */}
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
        }}>
          Experience the Movement
        </span>
      </motion.div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: isMobile ? '40px' : isTablet ? '52px' : '72px',
        flexWrap: 'wrap',
        gap: '24px'
      }}>
        <div style={{
          overflow: 'hidden',
          flex: 1
        }}>
          <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.1} style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: headingSize,
            fontWeight: 300,
            letterSpacing: '-2px',
            lineHeight: 1.03,
            color: '#F7F6F3',
            margin: 0,
            maxWidth: '680px'
          }}>
            <span>Real </span>
            <em style={{
              fontStyle: 'italic',
              color: '#DE322D'
            }}>everything</em>
            <span style={{
              color: 'rgba(247,246,243,0.18)'
            }}>. No exceptions.</span>
          </motion.h2>
        </div>
      </div>

      {/* Tab + image layout: stack on mobile/tablet, side-by-side on desktop */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: showImagePanel ? '1fr 1fr' : '1fr',
        gap: '16px',
        alignItems: 'start'
      }}>
        {/* Tab list */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {EXPERIENCE_ITEMS.map((item, i) => <motion.div key={item.id} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideFromLeft} custom={i * 0.1} onClick={() => setActiveIdx(i)} style={{
            cursor: 'pointer',
            padding: isMobile ? '20px 16px' : isTablet ? '24px 24px' : '32px 36px',
            borderRadius: '20px',
            background: activeIdx === i ? 'rgba(247,246,243,0.06)' : 'rgba(247,246,243,0.02)',
            border: `1px solid ${activeIdx === i ? 'rgba(247,246,243,0.12)' : 'rgba(247,246,243,0.05)'}`,
            transition: 'background 0.3s ease, border-color 0.3s ease',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {activeIdx === i && <div aria-hidden="true" style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              width: '3px',
              background: 'linear-gradient(180deg, #DE322D, #ff7a70)',
              borderRadius: '20px 0 0 20px'
            }} />}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '12px',
              marginBottom: activeIdx === i ? '16px' : '0'
            }}>
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '8px'
                }}>
                  <span style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '10px',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'rgba(247,246,243,0.22)',
                    fontWeight: 500
                  }}>
                    {item.index}
                  </span>
                  <span style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '9px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: activeIdx === i ? '#DE322D' : 'rgba(247,246,243,0.18)',
                    fontWeight: 700,
                    background: activeIdx === i ? 'rgba(222,50,45,0.12)' : 'transparent',
                    border: `1px solid ${activeIdx === i ? 'rgba(222,50,45,0.25)' : 'transparent'}`,
                    borderRadius: '100px',
                    padding: activeIdx === i ? '3px 10px' : '3px 0',
                    transition: 'all 0.3s ease'
                  }}>
                    {item.badge}
                  </span>
                </div>
                <h3 style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: isMobile ? '20px' : isTablet ? '22px' : 'clamp(20px, 2vw, 26px)',
                  fontWeight: 400,
                  letterSpacing: '-0.5px',
                  color: activeIdx === i ? '#F7F6F3' : 'rgba(247,246,243,0.45)',
                  margin: 0,
                  lineHeight: 1.15,
                  transition: 'color 0.3s ease'
                }}>
                  {item.title}
                </h3>
                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '12px',
                  color: activeIdx === i ? 'rgba(247,246,243,0.38)' : 'rgba(247,246,243,0.2)',
                  margin: '4px 0 0',
                  fontStyle: 'italic',
                  transition: 'color 0.3s ease'
                }}>
                  {item.subtitle}
                </p>
              </div>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                flexShrink: 0,
                border: `1px solid ${activeIdx === i ? 'rgba(222,50,45,0.4)' : 'rgba(247,246,243,0.1)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: activeIdx === i ? 'rgba(222,50,45,0.12)' : 'transparent',
                transition: 'all 0.3s ease'
              }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 12L12 2M12 2H4M12 2V10" stroke={activeIdx === i ? '#DE322D' : 'rgba(247,246,243,0.25)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            <AnimatePresence initial={false}>
              {activeIdx === i && <motion.p key={`exp-desc-${item.id}`} initial={{
                height: 0,
                opacity: 0
              }} animate={{
                height: 'auto',
                opacity: 1
              }} exit={{
                height: 0,
                opacity: 0
              }} transition={{
                duration: 0.45,
                ease: [0.22, 1, 0.36, 1]
              }} style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                lineHeight: '1.8',
                color: 'rgba(247,246,243,0.5)',
                margin: 0,
                fontWeight: 300,
                overflow: 'hidden'
              }}>
                {item.description}
              </motion.p>}
            </AnimatePresence>
          </motion.div>)}
        </div>

        {/* Image panel: desktop only */}
        {showImagePanel && <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={scaleReveal} custom={0.2} style={{
          borderRadius: '24px',
          overflow: 'hidden',
          position: 'relative',
          aspectRatio: '4/5'
        }}>
          <AnimatePresence mode="wait">
            <motion.img key={EXPERIENCE_ITEMS[activeIdx].id} src={EXPERIENCE_ITEMS[activeIdx].imageSrc} alt={EXPERIENCE_ITEMS[activeIdx].imageAlt} initial={{
              opacity: 0,
              scale: 1.04
            }} animate={{
              opacity: 1,
              scale: 1
            }} exit={{
              opacity: 0,
              scale: 0.97
            }} transition={{
              duration: 0.55,
              ease: [0.22, 1, 0.36, 1]
            }} style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              filter: 'brightness(0.72) saturate(0.75)'
            }} />
          </AnimatePresence>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(10,9,8,0.88) 0%, rgba(10,9,8,0.2) 50%, transparent 100%)',
            pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '28px',
            left: '28px',
            right: '28px'
          }}>
            <div style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '10px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(247,246,243,0.4)',
              marginBottom: '8px'
            }}>
              {EXPERIENCE_ITEMS[activeIdx].badge}
            </div>
            <div style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: 'clamp(22px, 2.4vw, 32px)',
              fontWeight: 300,
              letterSpacing: '-1px',
              color: '#F7F6F3',
              lineHeight: 1.1
            }}>
              {EXPERIENCE_ITEMS[activeIdx].title}
            </div>
          </div>
          <motion.div aria-hidden="true" animate={{
            x: ['-100%', '220%']
          }} transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: 'linear',
            repeatDelay: 2
          }} style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '45%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(222,50,45,0.5), transparent)',
            pointerEvents: 'none'
          }} />
        </motion.div>}
      </div>
    </div>
  </section>;
};

// ─── CTA Section ──────────────────────────────────────────────────────────────
const CTA_CARDS = [{
  id: 'cta-pitch',
  icon: '🎯',
  role: 'Founder',
  cta: 'Apply to Pitch',
  desc: '100 slots · Rolling selection · Dragons Den format',
  variant: 'primary' as const
}, {
  id: 'cta-funder',
  icon: '💼',
  role: 'Investor',
  cta: 'Become a Funder',
  desc: 'Vetted panel · Exclusive deal access · Pre-screened founders',
  variant: 'outline' as const
}];
const BOTTOM_STRIP_ITEMS = [{
  id: 'bs-1',
  label: 'Event Format',
  value: "Dragons' Den",
  sub: 'Live pitch sessions'
}, {
  id: 'bs-2',
  label: 'Pitch Slots',
  value: '100 Only',
  sub: 'Rolling admission'
}, {
  id: 'bs-3',
  label: 'Summit Date',
  value: 'May 28, 2026',
  sub: 'EmpowaWorx House'
}, {
  id: 'bs-4',
  label: 'Status',
  value: 'Applications Open',
  sub: 'Close 60 days before'
}];
const CtaSection = ({ onOpenModal }: { onOpenModal: () => void }) => {
  const [isClosed, setIsClosed] = useState(false);
  useEffect(() => {
    const check = () => setIsClosed(new Date() > REGISTRATION_DEADLINE);
    check();
    const id = setInterval(check, 1000);
    return () => clearInterval(id);
  }, []);

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
  const sectionPad = isMobile ? '96px 0' : isTablet ? '128px 0' : '168px 0';
  const innerPad = isMobile ? '0 20px' : isTablet ? '0 40px' : '0 64px';
  const heroFontSize = isMobile ? 'clamp(40px, 11vw, 62px)' : isTablet ? 'clamp(44px, 8vw, 76px)' : 'clamp(48px, 6.5vw, 100px)';
  const heroLetterSpacing = isMobile ? '-1.5px' : isTablet ? '-2.5px' : '-4px';
  return <section ref={sectionRef} onMouseMove={handleMouseMove} style={{
    background: '#0f1c28',
    padding: sectionPad,
    width: '100%',
    boxSizing: 'border-box',
    overflow: 'hidden',
    position: 'relative'
  }}>
    {/* Radial cursor glow */}
    <motion.div aria-hidden="true" style={{
      left: springX,
      top: springY,
      x: '-50%',
      y: '-50%',
      position: 'absolute',
      width: '800px',
      height: '800px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(222,50,45,0.13) 0%, transparent 65%)',
      pointerEvents: 'none',
      zIndex: 0
    }} />
    {/* Watermark */}
    {!isMobile && <div aria-hidden="true" style={{
      position: 'absolute',
      bottom: '-4%',
      left: '-2%',
      fontFamily: 'Montserrat, sans-serif',
      fontSize: 'clamp(60px, 12vw, 240px)',
      fontWeight: 800,
      letterSpacing: '-8px',
      lineHeight: 1,
      color: 'rgba(247,246,243,0.018)',
      pointerEvents: 'none',
      userSelect: 'none',
      whiteSpace: 'nowrap',
      zIndex: 0
    }}>
      PITCHINGFESTIVAL
    </div>}
    <div aria-hidden="true" style={{
      position: 'absolute',
      inset: 0,
      backgroundImage: NOISE_SVG,
      backgroundRepeat: 'repeat',
      backgroundSize: '128px 128px',
      pointerEvents: 'none',
      opacity: 0.55
    }} />

    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: innerPad,
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
          fontSize: '12px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'rgba(247,246,243,0.35)',
          fontWeight: 600
        }}>
          Secure Your Place
        </span>
      </motion.div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr' : '1fr 1fr',
        gap: isMobile ? '40px' : isTablet ? '40px' : '80px',
        alignItems: 'center',
        marginBottom: isMobile ? '48px' : '72px'
      }}>
        <div>
          <div style={{
            overflow: 'hidden'
          }}>
            <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.1} style={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 200,
              fontSize: heroFontSize,
              lineHeight: 0.91,
              letterSpacing: heroLetterSpacing,
              color: '#F7F6F3',
              margin: '0 0 32px'
            }}>
              <span>The Arena</span>
              <br />
              <em style={{
                fontStyle: 'italic',
                color: '#DE322D'
              }}>Awaits</em>
              <br />
              <span style={{
                color: 'rgba(247,246,243,0.16)'
              }}>Your Pitch.</span>
            </motion.h2>
          </div>
          <motion.p initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUpVariants} custom={0.3} style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: isMobile ? '14px' : '16px',
            lineHeight: '1.8',
            color: 'rgba(247,246,243,0.48)',
            margin: '0 0 40px',
            fontWeight: 300
          }}>
            Three distinct entry points into the Pitching Festival. Choose your role and claim your seat before
            capacity closes.
          </motion.p>
        </div>

        {/* Action cards */}
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={isMobile ? fadeUpVariants : slideFromRight} custom={0.25} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {CTA_CARDS.map((card, i) => {
            const cardDisabled = isClosed && card.id === 'cta-pitch';
            return (
              <motion.div 
                onClick={() => { 
                  if (card.id === 'cta-pitch') { 
                    if (!cardDisabled) onOpenModal(); 
                  } else if (card.id === 'cta-funder') { 
                    window.location.href = '/partnerships'; 
                  } 
                }} 
                key={card.id} 
                initial={{
                  opacity: 0,
                  x: isMobile ? 0 : 40
                }} animate={inView ? {
                  opacity: 1,
                  x: 0
                } : {
                  opacity: 0,
                  x: isMobile ? 0 : 40
                }} transition={{
                  duration: 0.7,
                  delay: 0.35 + i * 0.1,
                  ease: [0.22, 1, 0.36, 1]
                }} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  padding: isMobile ? '16px 16px' : isTablet ? '18px 22px' : '22px 28px',
                  background: cardDisabled ? 'rgba(247,246,243,0.01)' : card.variant === 'primary' ? 'rgba(222,50,45,0.08)' : card.variant === 'outline' ? 'rgba(247,246,243,0.04)' : 'rgba(247,246,243,0.02)',
                  border: `1px solid ${cardDisabled ? 'rgba(247,246,243,0.05)' : card.variant === 'primary' ? 'rgba(222,50,45,0.25)' : card.variant === 'outline' ? 'rgba(247,246,243,0.1)' : 'rgba(247,246,243,0.06)'}`,
                  borderRadius: '18px',
                  cursor: cardDisabled ? 'default' : 'pointer',
                  transition: 'background 0.3s ease, border-color 0.3s ease',
                  opacity: cardDisabled ? 0.6 : 1
                }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              flex: 1,
              minWidth: 0
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: card.variant === 'primary' ? 'rgba(222,50,45,0.18)' : 'rgba(247,246,243,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                flexShrink: 0
              }}>
                {card.icon}
              </div>
              <div style={{
                minWidth: 0
              }}>
                <div style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '9px',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'rgba(247,246,243,0.22)',
                  fontWeight: 600,
                  marginBottom: '3px'
                }}>
                  {card.role}
                </div>
                <div style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: card.variant === 'primary' ? '#F7F6F3' : 'rgba(247,246,243,0.65)',
                  letterSpacing: '-0.1px',
                  marginBottom: '2px'
                }}>
                  {cardDisabled ? 'Applications Closed' : card.cta}
                </div>
                <div style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '11px',
                  color: 'rgba(247,246,243,0.2)',
                  letterSpacing: '0.01em',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {card.desc}
                </div>
              </div>
            </div>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              flexShrink: 0,
              border: `1px solid ${card.variant === 'primary' ? 'rgba(222,50,45,0.4)' : 'rgba(247,246,243,0.12)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: card.variant === 'primary' ? 'linear-gradient(135deg, #DE322D, #c42823)' : 'transparent'
            }}>
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M2 12L12 2M12 2H4M12 2V10" stroke={card.variant === 'primary' ? '#fff' : 'rgba(247,246,243,0.35)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </motion.div>)}
        </motion.div>
      </div>

      {/* Bottom strip - 2-col mobile, 4-col tablet+ */}
      <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={lineWipe} custom={0.55} style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
        gap: '1px',
        paddingTop: '40px',
        borderTop: '0.8px solid rgba(247,246,243,0.07)',
        transformOrigin: 'left'
      }}>
        {BOTTOM_STRIP_ITEMS.map((item, i) => <div key={item.id} style={{
          padding: isMobile ? '20px 0' : isTablet ? '24px 20px' : '28px 32px',
          borderLeft: i > 0 && !isMobile ? '0.8px solid rgba(247,246,243,0.07)' : 'none',
          borderTop: isMobile && i > 1 ? '0.8px solid rgba(247,246,243,0.07)' : 'none',
          paddingLeft: i === 0 && !isMobile ? '0' : undefined
        }}>
          <div style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '9px',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'rgba(247,246,243,0.25)',
            fontWeight: 600,
            marginBottom: '8px'
          }}>
            {item.label}
          </div>
          <div style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: isMobile ? '13px' : isTablet ? '15px' : '17px',
            fontWeight: 300,
            letterSpacing: '-0.5px',
            color: '#F7F6F3',
            marginBottom: '4px'
          }}>
            {item.value}
          </div>
          <div style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '11px',
            color: 'rgba(247,246,243,0.25)',
            letterSpacing: '0.02em'
          }}>
            {item.sub}
          </div>
        </div>)}
      </motion.div>
    </div>
  </section>;
};

// ─── Site Footer ──────────────────────────────────────────────────────────────
const FOOTER_COLS = [{
  id: 'fcol-festival',
  heading: 'Festival',
  links: [{
    id: 'fl-about',
    label: 'About the Festival'
  }, {
    id: 'fl-format',
    label: 'Pitch Format'
  }, {
    id: 'fl-funders',
    label: 'Funder Panel'
  }, {
    id: 'fl-schedule',
    label: 'Schedule'
  }]
}, {
  id: 'fcol-apply',
  heading: 'Apply',
  links: [{
    id: 'fl-founder',
    label: 'Founder Application'
  }, {
    id: 'fl-funder',
    label: 'Become a Funder'
  }, {
    id: 'fl-powerseat',
    label: 'Power Seat'
  }, {
    id: 'fl-eligibility',
    label: 'Eligibility Guide'
  }]
}, {
  id: 'fcol-summit',
  heading: 'Summit',
  links: [{
    id: 'fl-main',
    label: 'Main Summit'
  }, {
    id: 'fl-speakers',
    label: 'Speakers'
  }, {
    id: 'fl-venue',
    label: 'Venue'
  }, {
    id: 'fl-register',
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
  const innerPad = isMobile ? '0 20px' : isTablet ? '0 40px' : '0 64px';
  const footerHeroMinH = isMobile ? '360px' : isTablet ? '440px' : '520px';
  const footerHeroFontSize = isMobile ? 'clamp(40px, 11vw, 60px)' : isTablet ? 'clamp(48px, 7.5vw, 80px)' : 'clamp(56px, 6.5vw, 96px)';
  const footerHeroLetterSpacing = isMobile ? '-1.5px' : isTablet ? '-2.5px' : '-3.5px';
  return <footer ref={footerRef} style={{
    background: '#0A0906',
    width: '100%',
    boxSizing: 'border-box',
    overflow: 'hidden',
    position: 'relative'
  }}>
    {/* Footer hero */}
    <div style={{
      position: 'relative',
      width: '100%',
      minHeight: footerHeroMinH,
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
        padding: isMobile ? '0 20px 44px' : isTablet ? '0 40px 56px' : '0 64px 72px',
        boxSizing: 'border-box',
        maxWidth: '1200px',
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
          }}>
            Pitching Festival 2026 · Africa's Deal Arena
          </span>
        </motion.div>

        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'flex-end',
          justifyContent: 'space-between',
          gap: isMobile ? '32px' : '40px'
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
              <span>Enter</span>
              <br />
              <em style={{
                fontStyle: 'italic',
                color: '#DE322D',
                fontWeight: 400
              }}>The Arena.</em>
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
            minWidth: isMobile ? '100%' : isTablet ? '220px' : '240px',
            width: isMobile ? '100%' : 'auto'
          }}>
            <motion.a href="#" onClick={e => { e.preventDefault(); window.dispatchEvent(new Event('openPitchModal')); }} whileHover={{
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
              <span>Apply to Pitch</span>
              <ArrowIconDark />
            </motion.a>
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
              <span>Become a Funder</span>
            </motion.a>
          </motion.div>
        </div>
      </div>
    </div>

    {/* Footer nav */}
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: isMobile ? '40px 20px 0' : isTablet ? '52px 40px 0' : '64px 64px 0',
      boxSizing: 'border-box'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        gap: '40px',
        paddingBottom: '48px',
        borderBottom: '1px solid rgba(247,246,243,0.07)'
      }}>
        {/* Brand blurb */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          maxWidth: isMobile ? '100%' : isTablet ? '220px' : '280px'
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
              }}>
                EmpowaSummit
              </div>
              <div style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '10px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'rgba(247,246,243,0.22)',
                marginTop: '2px'
              }}>
                Pitching Festival · 2026
              </div>
            </div>
          </div>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            lineHeight: '1.8',
            color: 'rgba(247,246,243,0.28)',
            margin: 0
          }}>
            Africa's premier deal-making arena. Where the continent's most investment-ready founders face off before
            elite funders.
          </p>
        </div>

        {/* Link columns - 2-col mobile, 3-col tablet+ */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
          gap: isMobile ? '28px 16px' : isTablet ? '28px 24px' : '0',
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
              marginBottom: '20px'
            }}>
              {col.heading}
            </span>
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

      {/* Legal row */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'flex-start' : 'center',
        gap: '16px',
        padding: '24px 0 40px'
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
          gap: '20px',
          flexWrap: 'wrap'
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
          }}>
            {item.label}
          </a>)}
        </div>
      </div>
    </div>
  </footer>;
};

// ─── Custom Package Modal ─────────────────────────────────────────────────────
export const PitchApplicationModal = ({
  onClose,
  initialTier = ''
}: {
  onClose: () => void;
  initialTier?: string;
}) => {
  const [name, setName] = useState('');
  const [org, setOrg] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [selectedTier, setSelectedTier] = useState(initialTier);
  const [submitted, setSubmitted] = useState(false);
  const {
    isMobile
  } = useBreakpoint();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) setSubmitted(true);
  };
  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(247,246,243,0.05)',
    border: '1px solid rgba(247,246,243,0.1)',
    borderRadius: '10px',
    padding: '13px 16px',
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    color: '#F7F6F3',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.25s ease'
  };
  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'Inter, sans-serif',
    fontSize: '10px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'rgba(247,246,243,0.35)',
    fontWeight: 500,
    marginBottom: '7px'
  };
  return <AnimatePresence>
    <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} exit={{
      opacity: 0
    }} onClick={onClose} style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(10,9,8,0.82)',
      backdropFilter: 'blur(18px)',
      WebkitBackdropFilter: 'blur(18px)',
      zIndex: 300,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isMobile ? '16px' : '32px',
      boxSizing: 'border-box',
      overflowY: 'auto'
    }}>
      <motion.div initial={{
        opacity: 0,
        y: 40,
        scale: 0.95
      }} animate={{
        opacity: 1,
        y: 0,
        scale: 1
      }} exit={{
        opacity: 0,
        y: 24,
        scale: 0.97
      }} transition={{
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1]
      }} onClick={e => e.stopPropagation()} style={{
        background: '#0f1c28',
        border: '1px solid rgba(247,246,243,0.1)',
        borderRadius: '28px',
        padding: isMobile ? '32px 20px' : '52px 52px',
        width: '100%',
        maxWidth: '560px',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 40px 120px rgba(0,0,0,0.6)',
        margin: 'auto'
      }}>
        <div aria-hidden="true" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, #DE322D, transparent)'
        }} />
        <motion.div aria-hidden="true" animate={{
          x: ['-100%', '220%']
        }} transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'linear',
          repeatDelay: 4
        }} style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '55%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(222,50,45,0.5), transparent)',
          pointerEvents: 'none',
          zIndex: 2
        }} />
        <div aria-hidden="true" style={{
          position: 'absolute',
          top: '-40%',
          right: '-20%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(222,50,45,0.1) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <button onClick={onClose} style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'rgba(247,246,243,0.06)',
          border: '1px solid rgba(247,246,243,0.1)',
          borderRadius: '8px',
          width: '34px',
          height: '34px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.2s ease'
        }} onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(247,246,243,0.12)';
        }} onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(247,246,243,0.06)';
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6L18 18" stroke="rgba(247,246,243,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <AnimatePresence mode="wait">
          {!submitted ? <motion.div key="modal-form" initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} exit={{
            opacity: 0
          }} transition={{
            duration: 0.3
          }}>
            <div style={{
              marginBottom: '32px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px'
              }}>
                <div style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  background: '#DE322D',
                  boxShadow: '0 0 8px rgba(222,50,45,0.5)'
                }} />
                <span style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '10px',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'rgba(247,246,243,0.35)',
                  fontWeight: 600
                }}>Pitch Application</span>
              </div>
              <h3 style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: isMobile ? '20px' : '26px',
                fontWeight: 300,
                letterSpacing: '-1px',
                color: '#F7F6F3',
                margin: '0 0 10px',
                lineHeight: 1.15
              }}>
                <span>Secure your </span>
                <em style={{
                  fontStyle: 'italic',
                  color: '#DE322D'
                }}>pitch</em>
                <span style={{
                  color: 'rgba(247,246,243,0.4)'
                }}> slot.</span>
              </h3>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
                color: 'rgba(247,246,243,0.38)',
                margin: 0,
                lineHeight: '1.65'
              }}>
                Submit your venture details. Our investment committee will review your application for the upcoming Pitching Festival sessions.
              </p>
            </div>
            <form onSubmit={handleSubmit} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '13px'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: '13px'
              }}>
                <div>
                  <label htmlFor="modal-name" style={labelStyle}>Full Name</label>
                  <input id="modal-name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" required style={inputStyle} onFocus={e => {
                    (e.target as HTMLInputElement).style.borderColor = 'rgba(222,50,45,0.45)';
                  }} onBlur={e => {
                    (e.target as HTMLInputElement).style.borderColor = 'rgba(247,246,243,0.1)';
                  }} />
                </div>
                <div>
                  <label htmlFor="modal-org" style={labelStyle}>Organisation</label>
                  <input id="modal-org" type="text" value={org} onChange={e => setOrg(e.target.value)} placeholder="Your company" style={inputStyle} onFocus={e => {
                    (e.target as HTMLInputElement).style.borderColor = 'rgba(222,50,45,0.45)';
                  }} onBlur={e => {
                    (e.target as HTMLInputElement).style.borderColor = 'rgba(247,246,243,0.1)';
                  }} />
                </div>
              </div>
              <div>
                <label htmlFor="modal-email" style={labelStyle}>Business Email</label>
                <input id="modal-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="info@empowaentrepreneurs.co.za" required style={inputStyle} onFocus={e => {
                  (e.target as HTMLInputElement).style.borderColor = 'rgba(222,50,45,0.45)';
                }} onBlur={e => {
                  (e.target as HTMLInputElement).style.borderColor = 'rgba(247,246,243,0.1)';
                }} />
              </div>
              <div>
                <label htmlFor="modal-tier" style={labelStyle}>Funding Stage</label>
                <div style={{
                  position: 'relative'
                }}>
                  <select id="modal-tier" value={selectedTier} onChange={e => setSelectedTier(e.target.value)} style={{
                    ...inputStyle,
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: 'pointer',
                    paddingRight: '40px',
                    color: selectedTier ? '#F7F6F3' : 'rgba(247,246,243,0.3)'
                  }} onFocus={e => {
                    (e.target as HTMLSelectElement).style.borderColor = 'rgba(222,50,45,0.45)';
                  }} onBlur={e => {
                    (e.target as HTMLSelectElement).style.borderColor = 'rgba(247,246,243,0.1)';
                  }}>
                    <option value="" style={{
                      background: '#0f1c28',
                      color: 'rgba(247,246,243,0.4)'
                    }}>Select your current funding stage</option>
                    <option value="pre-seed" style={{ background: '#0f1c28', color: '#F7F6F3' }}>Pre-Seed</option><option value="seed" style={{ background: '#0f1c28', color: '#F7F6F3' }}>Seed</option><option value="series-a" style={{ background: '#0f1c28', color: '#F7F6F3' }}>Series A</option><option value="series-b" style={{ background: '#0f1c28', color: '#F7F6F3' }}>Series B+</option></select>
                  <div style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none'
                  }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 4L6 8L10 4" stroke="rgba(247,246,243,0.4)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="modal-message" style={labelStyle}>Pitch Summary</label>
                <textarea id="modal-message" value={message} onChange={e => setMessage(e.target.value)} placeholder="Briefly describe your business model, traction, and what you are looking to raise..." rows={4} style={{
                  ...inputStyle,
                  resize: 'none',
                  lineHeight: '1.6'
                }} onFocus={e => {
                  (e.target as HTMLTextAreaElement).style.borderColor = 'rgba(222,50,45,0.45)';
                }} onBlur={e => {
                  (e.target as HTMLTextAreaElement).style.borderColor = 'rgba(247,246,243,0.1)';
                }} />
              </div>
              <motion.button type="submit" whileHover={{
                scale: 1.03,
                boxShadow: '0 12px 40px rgba(222,50,45,0.6)'
              }} whileTap={{
                scale: 0.97
              }} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                background: 'linear-gradient(135deg, #DE322D 0%, #c42823 100%)',
                border: 'none',
                borderRadius: '44px',
                padding: '16px 32px',
                fontSize: '13px',
                letterSpacing: '0.05em',
                color: '#fff',
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 600,
                cursor: 'pointer',
                marginTop: '4px',
                boxShadow: '0 8px 32px rgba(222,50,45,0.45)'
              }}>
                <span>Submit Application</span><ArrowIconDark />
              </motion.button>
            </form>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              color: 'rgba(247,246,243,0.2)',
              margin: '14px 0 0',
              letterSpacing: '0.02em'
            }}>By submitting, you agree to our privacy policy. We never share your information.</p>
          </motion.div> : <motion.div key="modal-success" initial={{
            opacity: 0,
            scale: 0.95
          }} animate={{
            opacity: 1,
            scale: 1
          }} exit={{
            opacity: 0
          }} transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1]
          }} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
            textAlign: 'center',
            padding: '24px 0 16px'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'rgba(34,197,94,0.1)',
              border: '1px solid rgba(34,197,94,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="22" height="16" viewBox="0 0 22 16" fill="none"><path d="M1 8L8 15L21 1" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <div>
              <h3 style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '22px',
                fontWeight: 400,
                letterSpacing: '-0.5px',
                color: '#F7F6F3',
                margin: '0 0 10px'
              }}>Application Received</h3>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                color: 'rgba(247,246,243,0.45)',
                margin: 0,
                lineHeight: '1.7',
                maxWidth: '340px'
              }}>
                <span>{'Thank you, '}</span>
                <strong style={{
                  color: 'rgba(247,246,243,0.75)'
                }}>{name}</strong>
                <span>{'. Our investment committee will review your application and get back to you shortly.'}</span>
              </p>
            </div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(34,197,94,0.07)',
              border: '1px solid rgba(34,197,94,0.18)',
              borderRadius: '100px',
              padding: '7px 16px'
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
                boxShadow: '0 0 8px rgba(34,197,94,0.5)'
              }} />
              <span style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '10px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(247,246,243,0.4)',
                fontWeight: 600
              }}>Response within 24h</span>
            </div>
            <motion.button whileHover={{
              scale: 1.04
            }} whileTap={{
              scale: 0.97
            }} onClick={onClose} style={{
              marginTop: '8px',
              background: 'rgba(247,246,243,0.06)',
              border: '1px solid rgba(247,246,243,0.12)',
              borderRadius: '44px',
              padding: '12px 28px',
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '12px',
              letterSpacing: '0.04em',
              color: 'rgba(247,246,243,0.55)',
              cursor: 'pointer'
            }}>Close</motion.button>
          </motion.div>}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  </AnimatePresence>;
};


// ─── PitchingFestivalPage ─────────────────────────────────────────────────────
export const PitchingFestivalPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsModalOpen(true);
    window.addEventListener('openPitchModal', handleOpen);
    return () => window.removeEventListener('openPitchModal', handleOpen);
  }, []);

  return <div className="w-full min-h-screen" style={{
    background: '#141210'
  }}>
    <HeroSection />
    <LogoBanner />
    <PillarsSection />
    <EligibilitySection />
    <ExperienceSection />
    <CtaSection onOpenModal={() => setIsModalOpen(true)} />
    <PitchingFestivalModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
  </div>;
};