import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView, useAnimationFrame, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';

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
    isMobile: width < 640,
    isTablet: width >= 640 && width < 1024,
    isDesktop: width >= 1024,
    width
  };
};

// ─── Animated counter hook ─────────────────────────────────────────────────────
const useCountUp = (target: number, duration = 1600, inView = false) => {
  const [count, setCount] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target, duration]);
  return count;
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
const CloseIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
  <path d="M12 4L4 12M4 4L12 12" stroke="rgba(247,246,243,0.55)" strokeWidth="1.5" strokeLinecap="round" />
</svg>;
const CheckIcon = ({
  color = '#DE322D'
}: {
  color?: string;
}) => <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
  <path d="M1 5L4.5 8.5L11 1" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
</svg>;
const ChevronIcon = ({
  open
}: {
  open: boolean;
}) => <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{
  transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
  transition: 'transform 0.4s ease'
}}>
  <path d="M3 6L8 11L13 6" stroke="rgba(247,246,243,0.45)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
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

// ─── Back To Top Button ────────────────────────────────────────────────────────
const BackToTopButton = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll, {
      passive: true
    });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const scrollToTop = () => window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
  return <AnimatePresence>
    {visible && <motion.button initial={{
      opacity: 0,
      y: 20,
      scale: 0.85
    }} animate={{
      opacity: 1,
      y: 0,
      scale: 1
    }} exit={{
      opacity: 0,
      y: 20,
      scale: 0.85
    }} transition={{
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1]
    }} onClick={scrollToTop} whileHover={{
      scale: 1.08,
      boxShadow: '0 12px 40px rgba(222,50,45,0.6)'
    }} whileTap={{
      scale: 0.93
    }} aria-label="Back to top" style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 150,
      width: '44px',
      height: '44px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #DE322D, #c42823)',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 6px 28px rgba(222,50,45,0.5)'
    }}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 13V3M3 8L8 3L13 8" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.button>}
  </AnimatePresence>;
};

// ─── Animated Stat ─────────────────────────────────────────────────────────────
const AnimatedStat = ({
  value,
  label,
  color = '#F7F6F3',
  fontSize,
  inView
}: {
  value: string;
  label: string;
  color?: string;
  fontSize: string;
  inView: boolean;
}) => {
  const match = value.replace(/,/g, '').match(/^([0-9]+)(.*)$/);
  const numericTarget = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : '';
  const isNumeric = !!match;
  const counted = useCountUp(numericTarget, 1800, inView);
  const display = isNumeric ? numericTarget >= 1000 ? counted.toLocaleString() + suffix : counted + suffix : value;
  return <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  }}>
    <div style={{
      fontFamily: 'Montserrat, sans-serif',
      fontSize,
      fontWeight: 200,
      letterSpacing: '-1.5px',
      color,
      fontVariantNumeric: 'tabular-nums',
      lineHeight: 1
    }}>{display}</div>
    <div style={{
      fontFamily: 'Inter, sans-serif',
      fontSize: '10px',
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'rgba(247,246,243,0.3)',
      fontWeight: 500
    }}>{label}</div>
  </div>;
};

// ─── Animated Stat Card ───────────────────────────────────────────────────────
const AnimatedStatCard = ({
  value,
  label,
  inView
}: {
  value: string;
  label: string;
  inView: boolean;
}) => {
  const match = value.replace(/,/g, '').match(/^([0-9]+)(.*)$/);
  const numericTarget = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : '';
  const isNumeric = !!match;
  const counted = useCountUp(numericTarget, 1800, inView);
  const display = isNumeric ? numericTarget >= 1000 ? counted.toLocaleString() + suffix : counted + suffix : value;
  return <div style={{
    background: 'rgba(247,246,243,0.04)',
    border: '1px solid rgba(247,246,243,0.07)',
    borderRadius: '14px',
    padding: '18px 20px'
  }}>
    <div style={{
      fontFamily: 'Montserrat, sans-serif',
      fontSize: 'clamp(22px, 2.4vw, 32px)',
      fontWeight: 200,
      letterSpacing: '-1.2px',
      color: '#F7F6F3',
      lineHeight: 1,
      fontVariantNumeric: 'tabular-nums',
      marginBottom: '4px'
    }}>{display}</div>
    <div style={{
      fontFamily: 'Inter, sans-serif',
      fontSize: '10px',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: 'rgba(247,246,243,0.28)',
      fontWeight: 500
    }}>{label}</div>
  </div>;
};

// ─── Ticker ───────────────────────────────────────────────────────────────────
const TICKER_ITEMS = [{
  id: 'tk-1',
  label: 'Strategic Brand Positioning'
}, {
  id: 'tk-2',
  label: 'High-Impact Access'
}, {
  id: 'tk-3',
  label: 'Thought Leadership'
}, {
  id: 'tk-4',
  label: 'Authentic Engagement'
}, {
  id: 'tk-5',
  label: "Africa's Growth Economy"
}, {
  id: 'tk-6',
  label: 'Partner · Fund · Connect'
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
            fontFamily: 'Inter, sans-serif',
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
  label: 'About Us'
}, {
  id: 'programme',
  label: 'Programme'
}, {
  id: 'experience',
  label: 'Experience Zones'
}, {
  id: 'partnerships',
  label: 'Partnerships'
}];
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
      padding: scrolled ? '10px 20px' : isMobile ? '16px 20px' : '20px 32px',
      background: scrolled ? 'rgba(247,246,243,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(32px) saturate(2.5)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(32px) saturate(2.5)' : 'none',
      borderBottom: scrolled ? '0.8px solid rgba(20,18,16,0.07)' : '0.8px solid transparent',
      transition: 'padding 0.35s ease, background 0.35s ease, border-color 0.35s ease'
    }}>
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
          boxShadow: '0 4px 14px rgba(222,50,45,0.4)'
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1L7.5 4.5L11 5L8.5 7.5L9 11L6 9.5L3 11L3.5 7.5L1 5L4.5 4.5L6 1Z" fill="white" /></svg>
        </motion.div>
        <span style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '13px',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: scrolled ? '#141210' : '#F7F6F3',
          fontWeight: 700,
          transition: 'color 0.35s ease'
        }}>EmpowaSummit</span>
      </a>
      {!showHamburger && <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '28px'
      }}>
        {STICKY_NAV_ITEMS.map(item => <a key={item.id} href="#" onClick={e => e.preventDefault()} style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '13px',
          textDecoration: 'none',
          letterSpacing: '0.04em',
          transition: 'color 0.2s',
          color: item.id === 'partnerships' ? '#DE322D' : navLinkColor,
          fontWeight: item.id === 'partnerships' ? 600 : 400
        }} onMouseEnter={e => {
          (e.currentTarget as HTMLAnchorElement).style.color = navLinkHoverColor;
        }} onMouseLeave={e => {
          (e.currentTarget as HTMLAnchorElement).style.color = item.id === 'partnerships' ? '#DE322D' : navLinkColor;
        }}>
          {item.label}
        </a>)}
        <motion.a href="#" onClick={e => e.preventDefault()} whileHover={{
          scale: 1.04
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
          boxShadow: '0 4px 16px rgba(222,50,45,0.38)'
        }}>
          <span>Partner Now</span>
        </motion.a>
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
        padding: '20px 24px 28px'
      }}>
        {STICKY_NAV_ITEMS.map(item => <a key={item.id} href="#" onClick={e => {
          e.preventDefault();
          setMobileMenuOpen(false);
        }} style={{
          display: 'block',
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '16px',
          color: item.id === 'partnerships' ? '#DE322D' : 'rgba(20,18,16,0.65)',
          textDecoration: 'none',
          padding: '12px 0',
          borderBottom: '0.8px solid rgba(20,18,16,0.06)',
          letterSpacing: '0.02em',
          fontWeight: item.id === 'partnerships' ? 600 : 400
        }}>{item.label}</a>)}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginTop: '20px'
        }}>
          <a href="#" onClick={e => e.preventDefault()} style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '13px',
            background: 'linear-gradient(135deg, #DE322D, #c42823)',
            borderRadius: '44px',
            padding: '10px 20px',
            color: '#fff',
            textDecoration: 'none'
          }}>Partner Now</a>
        </div>
      </motion.div>}
    </AnimatePresence>
  </motion.nav>;
};

// ─── Hero Section ──────────────────────────────────────────────────────────────
const HERO_BG_IMAGE = 'https://images.unsplash.com/photo-1543269664-56d93c1b41a6?w=1800&q=80';
const HERO_STATS = [{
  id: 'hs-1',
  value: '4,000+',
  label: 'Attendees',
  highlight: true
}, {
  id: 'hs-2',
  value: '120+',
  label: 'Investors',
  highlight: false
}, {
  id: 'hs-3',
  value: '30+',
  label: 'Markets',
  highlight: false
}, {
  id: 'hs-4',
  value: 'May 28',
  label: 'Summit Date 2026',
  highlight: false
}];
const HeroSection = () => {
  const heroRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const {
    isMobile,
    isTablet
  } = useBreakpoint();
  const statsInView = useInView(statsRef, {
    once: true,
    margin: '-40px 0px'
  });
  const {
    scrollYProgress
  } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '8%']);
  const orbY = useTransform(scrollYProgress, [0, 1], ['0%', '28%']);
  const hPad = isMobile ? '24px' : isTablet ? '40px' : '64px';
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
      backgroundImage: `url(${HERO_BG_IMAGE})`,
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
    <div aria-hidden="true" style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 2
    }}>
      {[16, 33, 50, 66, 83].map(pct => <div key={`vl-${pct}`} style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: `${pct}%`,
        width: '1px',
        background: 'rgba(247,246,243,0.022)'
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
    </div>
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
      padding: isMobile ? '32px 24px 36px' : isTablet ? '48px 40px 40px' : '60px 64px 40px',
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
          <span> Funding Summit 2026 — </span>
          <span style={{
            color: '#DE322D',
            fontWeight: 600
          }}>Partnerships</span>
        </span>
      </motion.div>
      <h1 style={{
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: 300,
        margin: '0 0 32px',
        lineHeight: 0.92,
        letterSpacing: isMobile ? '-2px' : '-3px'
      }}>
        <div style={{
          overflow: 'hidden',
          display: 'block'
        }}>
          {['Shape', "Africa's"].map((word, i) => <motion.span key={`l1-${word}`} initial={{
            y: '110%',
            opacity: 0
          }} animate={{
            y: '0%',
            opacity: 1
          }} transition={{
            duration: 0.9,
            delay: 0.2 + i * 0.12,
            ease: [0.22, 1, 0.36, 1]
          }} style={{
            display: 'inline-block',
            fontSize: isMobile ? 'clamp(38px, 11vw, 64px)' : isTablet ? 'clamp(44px, 8vw, 80px)' : 'clamp(52px, 7.2vw, 116px)',
            color: '#F7F6F3',
            marginRight: '0.22em'
          }}>{word}</motion.span>)}
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
            delay: 0.44,
            ease: [0.22, 1, 0.36, 1]
          }} style={{
            display: 'inline-block',
            fontSize: isMobile ? 'clamp(38px, 11vw, 64px)' : isTablet ? 'clamp(44px, 8vw, 80px)' : 'clamp(52px, 7.2vw, 116px)',
            color: 'rgba(247,246,243,0.18)',
            marginRight: '0.22em'
          }}>Next</motion.span>
          <motion.em initial={{
            y: '110%',
            opacity: 0
          }} animate={{
            y: '0%',
            opacity: 1
          }} transition={{
            duration: 0.9,
            delay: 0.56,
            ease: [0.22, 1, 0.36, 1]
          }} style={{
            display: 'inline-block',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: isMobile ? 'clamp(38px, 11vw, 64px)' : isTablet ? 'clamp(44px, 8vw, 80px)' : 'clamp(52px, 7.2vw, 116px)',
            color: '#DE322D'
          }}>Growth</motion.em>
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
            fontSize: isMobile ? 'clamp(38px, 11vw, 64px)' : isTablet ? 'clamp(44px, 8vw, 80px)' : 'clamp(52px, 7.2vw, 116px)',
            color: 'rgba(247,246,243,0.1)'
          }}>Economy.</motion.span>
        </div>
      </h1>
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'flex-start' : 'center',
        gap: isMobile ? '20px' : '32px',
        maxWidth: '800px'
      }}>
        <motion.p custom={0.72} initial="hidden" animate="visible" variants={fadeUpVariants} style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: isMobile ? '14px' : 'clamp(14px, 1.3vw, 18px)',
          lineHeight: '1.75',
          color: 'rgba(247,246,243,0.65)',
          margin: 0,
          fontWeight: 300,
          maxWidth: '440px'
        }}>
          Align your brand with the continent's most ambitious entrepreneurship platform. Partner. Fund. Connect.
        </motion.p>
        <motion.div custom={0.82} initial="hidden" animate="visible" variants={fadeUpVariants} style={{
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
          flexShrink: 0
        }}>
          <motion.a href="#" onClick={e => e.preventDefault()} whileHover={{
            scale: 1.04,
            boxShadow: '0 16px 52px rgba(222,50,45,0.7)'
          }} whileTap={{
            scale: 0.97
          }} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'linear-gradient(135deg, #DE322D 0%, #c42823 100%)',
            borderRadius: '44px',
            padding: isMobile ? '13px 22px' : '16px 34px',
            fontSize: '13px',
            letterSpacing: '0.05em',
            color: '#fff',
            textDecoration: 'none',
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 600,
            boxShadow: '0 8px 36px rgba(222,50,45,0.55)'
          }}>
            <span>Partner With Us</span><ArrowIconDark />
          </motion.a>
          <motion.a href="#" onClick={e => e.preventDefault()} whileHover={{
            scale: 1.04
          }} whileTap={{
            scale: 0.97
          }} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            border: '1px solid rgba(247,246,243,0.25)',
            borderRadius: '44px',
            padding: isMobile ? '13px 18px' : '16px 28px',
            fontSize: '13px',
            letterSpacing: '0.04em',
            color: 'rgba(247,246,243,0.75)',
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
            el.style.color = 'rgba(247,246,243,0.75)';
          }}>
            <span>Download Deck</span><ArrowIconDark />
          </motion.a>
        </motion.div>
      </div>
      <motion.div ref={statsRef} custom={0.92} initial="hidden" animate="visible" variants={fadeUpVariants} style={{
        display: 'flex',
        gap: isMobile ? '20px' : '48px',
        marginTop: isMobile ? '36px' : '64px',
        flexWrap: 'wrap'
      }}>
        {HERO_STATS.map((stat, i) => <AnimatedStat key={stat.id} value={stat.value} label={stat.label} color={i === 0 ? '#DE322D' : '#F7F6F3'} fontSize={isMobile ? '20px' : 'clamp(22px, 2.4vw, 36px)'} inView={statsInView} />)}
      </motion.div>
    </motion.div>
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

// ─── Partnership Benefits ─────────────────────────────────────────────────────
type Benefit = {
  id: string;
  index: string;
  title: string;
  description: string;
  tags: string[];
  imageSrc: string;
  imageAlt: string;
};
const BENEFITS: Benefit[] = [{
  id: 'ben-brand',
  index: '01',
  title: 'Strategic Brand Positioning',
  description: "Anchor your brand at the heart of Africa's premier entrepreneurship and funding platform. Your identity becomes synonymous with continental growth, catalytic capital, and high-impact enterprise.",
  tags: ['Brand Equity', 'Visibility', 'Credibility'],
  imageSrc: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=1400&q=80',
  imageAlt: 'Strategic brand positioning at Empowa Summit'
}, {
  id: 'ben-access',
  index: '02',
  title: 'High-Impact Access',
  description: 'Connect directly with 4,000+ decision-makers — founders, institutional funders, DFIs, VCs, and ecosystem builders — in structured, high-value networking environments engineered for deal-making.',
  tags: ['Deal Flow', 'Networking', 'Decision-Makers'],
  imageSrc: 'https://images.unsplash.com/photo-1560439514-4e9645039924?w=1400&q=80',
  imageAlt: 'High-impact access and networking at the summit'
}, {
  id: 'ben-thought',
  index: '03',
  title: 'Thought Leadership',
  description: "Secure speaking slots, panel moderation, and keynote opportunities that establish your organisation as a defining voice in Africa's enterprise growth narrative.",
  tags: ['Speaking Rights', 'Keynotes', 'Panels'],
  imageSrc: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1400&q=80',
  imageAlt: 'Thought leadership and speaking at Empowa Summit'
}, {
  id: 'ben-engage',
  index: '04',
  title: 'Authentic Engagement',
  description: 'Move beyond logos. Co-create curated activations, demonstration zones, and immersive brand experiences that generate genuine connection with the entrepreneurs and investors shaping Africa.',
  tags: ['Activations', 'Co-creation', 'Immersive'],
  imageSrc: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1400&q=80',
  imageAlt: 'Authentic engagement and brand activation at the summit'
}];
const BenefitsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, {
    once: true,
    margin: '-60px 0px'
  });
  const {
    isMobile,
    isTablet
  } = useBreakpoint();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  // Mobile: stacked | Tablet: 2-col grid | Desktop: 4-col full-width row
  const gridCols = isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)';
  const cardMinHeight = isMobile ? '300px' : isTablet ? '380px' : '520px';
  return <section ref={sectionRef} style={{
    background: '#14202c',
    paddingTop: isMobile ? '72px' : '152px',
    paddingBottom: isMobile ? '0' : '0',
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
      opacity: 0.6
    }} />
    <div aria-hidden="true" style={{
      position: 'absolute',
      top: '5%',
      right: '-12%',
      width: 'clamp(400px, 60vw, 900px)',
      height: 'clamp(400px, 60vw, 900px)',
      borderRadius: '50%',
      background: 'radial-gradient(circle at 40% 40%, rgba(222,50,45,0.07) 0%, rgba(222,50,45,0.02) 45%, transparent 70%)',
      pointerEvents: 'none',
      zIndex: 0
    }} />
    {/* Header */}
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: isMobile ? '0 24px' : isTablet ? '0 40px' : '0 64px',
      position: 'relative',
      zIndex: 1,
      paddingBottom: isMobile ? '40px' : '64px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        gap: '40px',
        flexWrap: 'wrap'
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
            }}>Partnership Benefits</span>
          </motion.div>
          <div style={{
            overflow: 'hidden'
          }}>
            <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.1} style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: isMobile ? 'clamp(28px, 8vw, 44px)' : 'clamp(32px, 4vw, 60px)',
              fontWeight: 300,
              letterSpacing: '-1.8px',
              lineHeight: 1.04,
              color: '#F7F6F3',
              margin: 0,
              maxWidth: '560px'
            }}>
              <span>{'Why brands '}</span>
              <em style={{
                fontStyle: 'italic',
                color: '#DE322D'
              }}>{'choose'}</em>
              <span style={{
                color: 'rgba(247,246,243,0.2)'
              }}>{' Empowa.'}</span>
            </motion.h2>
          </div>
        </div>
        {!isMobile && <motion.p initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideFromRight} custom={0.3} style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          color: 'rgba(247,246,243,0.3)',
          maxWidth: '280px',
          lineHeight: '1.7',
          margin: 0
        }}>
          Four pillars of value that position partners as architects of Africa's economic future.
        </motion.p>}
      </div>
    </div>
    {/* Cards — full viewport width on desktop, contained grid on mobile/tablet */}
    {isMobile || isTablet ? <div style={{
      padding: isMobile ? '0 24px 72px' : '0 40px 80px',
      boxSizing: 'border-box'
    }}>
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={staggerContainer} custom={0.07} style={{
        display: 'grid',
        gridTemplateColumns: gridCols,
        gap: '3px',
        width: '100%'
      }}>
          {BENEFITS.map((benefit, i) => {
          const isHovered = hoveredId === benefit.id;
          return <motion.div key={benefit.id} variants={clipReveal} custom={i * 0.08} onMouseEnter={() => setHoveredId(benefit.id)} onMouseLeave={() => setHoveredId(null)} style={{
            position: 'relative',
            minHeight: cardMinHeight,
            overflow: 'hidden',
            cursor: 'default',
            borderRadius: '4px'
          }}>
              <img src={benefit.imageSrc} alt={benefit.imageAlt} style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              filter: isHovered ? 'brightness(0.6) saturate(0.9)' : 'brightness(0.5) saturate(0.7)',
              transform: isHovered ? 'scale(1.06)' : 'scale(1)',
              transition: 'filter 0.7s ease, transform 0.9s cubic-bezier(0.22,1,0.36,1)'
            }} />
              <div style={{
              position: 'absolute',
              inset: 0,
              background: isHovered ? 'linear-gradient(to top, rgba(10,9,8,0.98) 0%, rgba(10,9,8,0.65) 50%, rgba(10,9,8,0.2) 100%)' : 'linear-gradient(to top, rgba(10,9,8,0.85) 0%, rgba(10,9,8,0.5) 55%, rgba(10,9,8,0.15) 100%)',
              transition: 'background 0.6s ease',
              pointerEvents: 'none'
            }} />
              <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: isHovered ? 'linear-gradient(90deg, #DE322D, rgba(222,50,45,0.3))' : 'linear-gradient(90deg, rgba(222,50,45,0.35), transparent)',
              transition: 'background 0.5s ease'
            }} />
              <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: '28px 24px'
            }}>
                <div style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '10px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'rgba(247,246,243,0.35)',
                fontWeight: 500,
                marginBottom: '10px'
              }}>{benefit.index}</div>
                <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '10px'
              }}>
                  <div style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  background: '#DE322D',
                  flexShrink: 0,
                  transition: 'transform 0.3s ease',
                  transform: isHovered ? 'scale(1.6)' : 'scale(1)'
                }} />
                  <h3 style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: 'clamp(16px, 4vw, 22px)',
                  fontWeight: isHovered ? 500 : 300,
                  letterSpacing: '-0.5px',
                  color: '#F7F6F3',
                  margin: 0,
                  lineHeight: 1.15,
                  transition: 'font-weight 0.3s ease'
                }}>{benefit.title}</h3>
                </div>
                <AnimatePresence initial={false}>
                  {isHovered && <motion.div key={`desc-${benefit.id}`} initial={{
                  opacity: 0,
                  y: 16
                }} animate={{
                  opacity: 1,
                  y: 0
                }} exit={{
                  opacity: 0,
                  y: 8
                }} transition={{
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1]
                }}>
                    <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '13px',
                    lineHeight: '1.72',
                    color: 'rgba(247,246,243,0.6)',
                    margin: '0 0 12px',
                    fontWeight: 300
                  }}>{benefit.description}</p>
                    <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '5px'
                  }}>
                      {benefit.tags.map(tag => <span key={tag} style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '9px',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'rgba(247,246,243,0.45)',
                      border: '1px solid rgba(247,246,243,0.18)',
                      borderRadius: '100px',
                      padding: '3px 10px'
                    }}>{tag}</span>)}
                    </div>
                  </motion.div>}
                </AnimatePresence>
              </div>
            </motion.div>;
        })}
        </motion.div>
      </div> : <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={staggerContainer} custom={0.07} style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '3px',
      width: '100%'
    }}>
        {BENEFITS.map((benefit, i) => {
        const isHovered = hoveredId === benefit.id;
        return <motion.div key={benefit.id} variants={clipReveal} custom={i * 0.08} onMouseEnter={() => setHoveredId(benefit.id)} onMouseLeave={() => setHoveredId(null)} style={{
          position: 'relative',
          minHeight: cardMinHeight,
          overflow: 'hidden',
          cursor: 'default'
        }}>
            <img src={benefit.imageSrc} alt={benefit.imageAlt} style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            filter: isHovered ? 'brightness(0.6) saturate(0.9)' : 'brightness(0.5) saturate(0.7)',
            transform: isHovered ? 'scale(1.06)' : 'scale(1)',
            transition: 'filter 0.7s ease, transform 0.9s cubic-bezier(0.22,1,0.36,1)'
          }} />
            <div style={{
            position: 'absolute',
            inset: 0,
            background: isHovered ? 'linear-gradient(to top, rgba(10,9,8,0.98) 0%, rgba(10,9,8,0.65) 50%, rgba(10,9,8,0.2) 100%)' : 'linear-gradient(to top, rgba(10,9,8,0.85) 0%, rgba(10,9,8,0.5) 55%, rgba(10,9,8,0.15) 100%)',
            transition: 'background 0.6s ease',
            pointerEvents: 'none'
          }} />
            <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: isHovered ? 'linear-gradient(90deg, #DE322D, rgba(222,50,45,0.3))' : 'linear-gradient(90deg, rgba(222,50,45,0.35), transparent)',
            transition: 'background 0.5s ease'
          }} />
            {isHovered && <div aria-hidden="true" style={{
            position: 'absolute',
            bottom: '-10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(222,50,45,0.18) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />}
            <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '32px 28px'
          }}>
              <div style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '10px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(247,246,243,0.35)',
              fontWeight: 500,
              marginBottom: '10px'
            }}>{benefit.index}</div>
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
                flexShrink: 0,
                transition: 'transform 0.3s ease',
                transform: isHovered ? 'scale(1.6)' : 'scale(1)'
              }} />
                <h3 style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: 'clamp(16px, 1.5vw, 22px)',
                fontWeight: isHovered ? 500 : 300,
                letterSpacing: '-0.5px',
                color: '#F7F6F3',
                margin: 0,
                lineHeight: 1.15,
                transition: 'font-weight 0.3s ease'
              }}>{benefit.title}</h3>
              </div>
              <AnimatePresence initial={false}>
                {isHovered && <motion.div key={`desc-${benefit.id}`} initial={{
                opacity: 0,
                y: 16
              }} animate={{
                opacity: 1,
                y: 0
              }} exit={{
                opacity: 0,
                y: 8
              }} transition={{
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1]
              }}>
                  <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '13px',
                  lineHeight: '1.72',
                  color: 'rgba(247,246,243,0.6)',
                  margin: '0 0 14px',
                  fontWeight: 300
                }}>{benefit.description}</p>
                  <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '5px'
                }}>
                    {benefit.tags.map(tag => <span key={tag} style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '9px',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'rgba(247,246,243,0.45)',
                    border: '1px solid rgba(247,246,243,0.18)',
                    borderRadius: '100px',
                    padding: '3px 10px'
                  }}>{tag}</span>)}
                  </div>
                </motion.div>}
              </AnimatePresence>
            </div>
            <div aria-hidden="true" style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '80px',
            fontWeight: 800,
            color: isHovered ? 'rgba(222,50,45,0.08)' : 'rgba(247,246,243,0.04)',
            lineHeight: 1,
            letterSpacing: '-4px',
            userSelect: 'none',
            transition: 'color 0.6s ease'
          }}>{benefit.index}</div>
          </motion.div>;
      })}
      </motion.div>}
  </section>;
};

// ─── Strategic Value Layer ─────────────────────────────────────────────────────
type ValuePillar = {
  id: string;
  index: string;
  title: string;
  description: string;
  metric: string;
  metricLabel: string;
};
const VALUE_PILLARS: ValuePillar[] = [{
  id: 'vp-narrative',
  index: '01',
  title: 'Marketing Narrative Rights',
  description: "Co-author the official summit narrative. Your brand integrates into pre-summit communications, on-stage references, and post-event media reaching Africa's most influential business circles.",
  metric: '1.2M+',
  metricLabel: 'Media Impressions'
}, {
  id: 'vp-agenda',
  index: '02',
  title: 'Agenda Influence',
  description: 'Shape the conversation that defines African enterprise for the year ahead. Senior partners influence track themes, panel compositions, and the keynote topics that drive the summit agenda.',
  metric: '48h',
  metricLabel: 'Programme Hours'
}, {
  id: 'vp-codesign',
  index: '03',
  title: 'Co-Design Rights',
  description: 'Collaborate with the EmpowaEntrepreneurs curatorial team to design proprietary summit experiences, exclusive roundtables, and branded innovation zones that embody your strategic objectives.',
  metric: '8+',
  metricLabel: 'Co-Design Slots'
}, {
  id: 'vp-data',
  index: '04',
  title: 'Data Insights',
  description: 'Gain exclusive access to post-summit analytics: attendee engagement data, investment activity reports, sector-level insights, and detailed outcome metrics — the intelligence that informs your next move.',
  metric: '100%',
  metricLabel: 'Verified Data Access'
}];
const StrategicValueSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, {
    once: true,
    margin: '-60px 0px'
  });
  const {
    isMobile,
    isTablet
  } = useBreakpoint();
  const [hoveredPillarId, setHoveredPillarId] = useState<string | null>(null);
  const hPad = isMobile ? '0 24px' : isTablet ? '0 40px' : '0 64px';
  return <section ref={sectionRef} style={{
    background: '#F7F6F3',
    paddingTop: isMobile ? '72px' : '152px',
    paddingBottom: isMobile ? '72px' : '120px',
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
      opacity: 0.4
    }} />
    <div aria-hidden="true" style={{
      position: 'absolute',
      top: '-10%',
      right: '-8%',
      width: 'clamp(300px, 52vw, 820px)',
      height: 'clamp(300px, 52vw, 820px)',
      borderRadius: '50%',
      background: 'radial-gradient(circle at 40% 40%, rgba(222,50,45,0.06) 0%, rgba(222,50,45,0.02) 50%, transparent 70%)',
      pointerEvents: 'none',
      zIndex: 0
    }} />
    <motion.div aria-hidden="true" initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={lineWipe} custom={0.4} style={{
      position: 'absolute',
      top: 0,
      left: '50%',
      bottom: 0,
      width: '1px',
      background: 'rgba(20,18,16,0.04)',
      pointerEvents: 'none',
      transformOrigin: 'top'
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
        gap: isMobile ? '36px' : '80px',
        alignItems: 'flex-start',
        marginBottom: isMobile ? '48px' : '72px'
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
              fontSize: '12px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(20,18,16,0.45)',
              fontWeight: 600
            }}>The Strategic Value Layer</span>
          </motion.div>
          <div style={{
            overflow: 'hidden'
          }}>
            <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.12} style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: isMobile ? 'clamp(26px, 8vw, 44px)' : 'clamp(32px, 4vw, 58px)',
              fontWeight: 300,
              letterSpacing: '-2px',
              lineHeight: 1.04,
              color: '#141210',
              margin: 0
            }}>
              <span>{'Senior partner '}</span>
              <em style={{
                fontStyle: 'italic',
                color: '#DE322D'
              }}>{'advantages'}</em>
              <span style={{
                color: 'rgba(20,18,16,0.22)'
              }}>{' that redefine'}</span>
              <br /><span style={{
                color: 'rgba(20,18,16,0.22)'
              }}>{' your presence.'}</span>
            </motion.h2>
          </div>
        </div>
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideFromRight} custom={0.28} style={{
          paddingTop: isMobile ? '0' : '12px'
        }}>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: isMobile ? '15px' : '17px',
            lineHeight: '1.82',
            color: 'rgba(20,18,16,0.58)',
            margin: '0 0 28px',
            fontWeight: 300
          }}>
            Our senior partnership tiers unlock an exclusive layer of strategic influence. Beyond visibility — these advantages place your organisation at the table where Africa's most consequential business decisions are shaped.
          </p>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(222,50,45,0.07)',
            border: '1px solid rgba(222,50,45,0.2)',
            borderRadius: '100px',
            padding: '8px 16px 8px 12px'
          }}>
            <motion.div animate={{
              opacity: [1, 0.3, 1]
            }} transition={{
              duration: 1.8,
              repeat: Infinity
            }} style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#DE322D',
              boxShadow: '0 0 8px rgba(222,50,45,0.6)'
            }} />
            <span style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(20,18,16,0.55)',
              fontWeight: 600
            }}>Senior Tier Access Only</span>
          </div>
        </motion.div>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: '12px'
      }}>
        {VALUE_PILLARS.map((pillar, i) => {
          const isHov = hoveredPillarId === pillar.id;
          return <motion.div key={pillar.id} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={scaleReveal} custom={0.2 + i * 0.1} onMouseEnter={() => setHoveredPillarId(pillar.id)} onMouseLeave={() => setHoveredPillarId(null)} style={{
            background: isHov ? '#141210' : '#ffffff',
            border: `1px solid ${isHov ? 'rgba(222,50,45,0.22)' : 'rgba(20,18,16,0.08)'}`,
            borderRadius: '24px',
            padding: isMobile ? '28px 24px' : '44px 40px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            position: 'relative',
            overflow: 'hidden',
            boxSizing: 'border-box',
            cursor: 'default',
            transition: 'background 0.55s cubic-bezier(0.22,1,0.36,1), border-color 0.55s ease, box-shadow 0.55s ease',
            boxShadow: isHov ? '0 24px 80px rgba(20,18,16,0.18), 0 0 0 1px rgba(222,50,45,0.1)' : '0 2px 12px rgba(20,18,16,0.04)'
          }}>
            <div aria-hidden="true" style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: isHov ? 'linear-gradient(90deg, #DE322D, rgba(222,50,45,0.4))' : i < 2 ? 'linear-gradient(90deg, #DE322D, transparent)' : 'linear-gradient(90deg, rgba(20,18,16,0.1), transparent)',
              transition: 'background 0.5s ease'
            }} />
            {isHov && <div aria-hidden="true" style={{
              position: 'absolute',
              top: '-30%',
              right: '-20%',
              width: '380px',
              height: '380px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(222,50,45,0.12) 0%, transparent 70%)',
              pointerEvents: 'none'
            }} />}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}>
              <div>
                <div style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '10px',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: isHov ? 'rgba(247,246,243,0.3)' : 'rgba(20,18,16,0.3)',
                  fontWeight: 500,
                  marginBottom: '12px',
                  transition: 'color 0.4s ease'
                }}>{pillar.index}</div>
                <h3 style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: isMobile ? '18px' : 'clamp(18px, 1.6vw, 24px)',
                  fontWeight: isHov ? 500 : 400,
                  letterSpacing: '-0.5px',
                  color: isHov ? '#F7F6F3' : '#141210',
                  margin: 0,
                  lineHeight: 1.2,
                  transition: 'color 0.4s ease, font-weight 0.3s ease'
                }}>{pillar.title}</h3>
              </div>
              <div style={{
                flexShrink: 0,
                textAlign: 'right',
                paddingLeft: '16px'
              }}>
                <div style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: 'clamp(24px, 2.8vw, 40px)',
                  fontWeight: 200,
                  letterSpacing: '-1.5px',
                  color: '#DE322D',
                  lineHeight: 1,
                  fontVariantNumeric: 'tabular-nums'
                }}>{pillar.metric}</div>
                <div style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '9px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: isHov ? 'rgba(247,246,243,0.35)' : 'rgba(20,18,16,0.35)',
                  fontWeight: 500,
                  marginTop: '4px',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.4s ease'
                }}>{pillar.metricLabel}</div>
              </div>
            </div>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              lineHeight: '1.78',
              color: isHov ? 'rgba(247,246,243,0.55)' : 'rgba(20,18,16,0.55)',
              margin: 0,
              fontWeight: 300,
              transition: 'color 0.4s ease'
            }}>{pillar.description}</p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '4px'
            }}>
              <div style={{
                flex: 1,
                height: '1px',
                background: isHov ? 'rgba(247,246,243,0.1)' : 'rgba(20,18,16,0.07)',
                transition: 'background 0.4s ease'
              }} />
              {isHov ? <PlusSquareIconLight /> : <PlusSquareIconDark />}
            </div>
          </motion.div>;
        })}
      </div>
    </div>
  </section>;
};

// ─── Custom Package Modal ─────────────────────────────────────────────────────
const CustomPackageModal = ({
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
          <CloseIcon />
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
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '10px',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'rgba(247,246,243,0.35)',
                  fontWeight: 600
                }}>Partnership Enquiry</span>
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
                <span>Build your </span>
                <em style={{
                  fontStyle: 'italic',
                  color: '#DE322D'
                }}>ideal</em>
                <span style={{
                  color: 'rgba(247,246,243,0.4)'
                }}> partnership.</span>
              </h3>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
                color: 'rgba(247,246,243,0.38)',
                margin: 0,
                lineHeight: '1.65'
              }}>
                Tell us about your brand objectives. We'll craft a bespoke engagement strategy around your goals.
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
                <input id="modal-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@company.com" required style={inputStyle} onFocus={e => {
                  (e.target as HTMLInputElement).style.borderColor = 'rgba(222,50,45,0.45)';
                }} onBlur={e => {
                  (e.target as HTMLInputElement).style.borderColor = 'rgba(247,246,243,0.1)';
                }} />
              </div>
              <div>
                <label htmlFor="modal-tier" style={labelStyle}>Partnership Tier</label>
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
                    }}>Select a partnership tier</option>
                    {TIERS.map(tier => <option key={tier.id} value={tier.id} style={{
                      background: '#0f1c28',
                      color: '#F7F6F3'
                    }}>
                        {tier.name} — {tier.tagline}
                      </option>)}
                    <option value="custom" style={{
                      background: '#0f1c28',
                      color: '#F7F6F3'
                    }}>Custom Package</option>
                  </select>
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
                <label htmlFor="modal-message" style={labelStyle}>Partnership Objectives</label>
                <textarea id="modal-message" value={message} onChange={e => setMessage(e.target.value)} placeholder="Describe your brand objectives, target audience, and any specific requirements..." rows={4} style={{
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
                <span>Submit Enquiry</span><ArrowIconDark />
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
              }}>Enquiry Received</h3>
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
                <span>{'. Our partnerships team will reach out within 24 hours to design your custom package.'}</span>
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

// ─── Partnership Tiers ─────────────────────────────────────────────────────────
type Tier = {
  id: string;
  name: string;
  tagline: string;
  investment: string;
  highlight: boolean;
  perks: string[];
  badge: string;
};
const TIERS: Tier[] = [{
  id: 'tier-ecosystem',
  name: 'Ecosystem Partner',
  tagline: 'Brand presence & visibility',
  investment: 'Entry',
  highlight: false,
  badge: 'Foundation',
  perks: ['Logo placement on summit materials', 'Delegate passes (4)', 'Exhibition booth (standard)', 'Social media mention', 'Post-summit report']
}, {
  id: 'tier-growth',
  name: 'Growth Partner',
  tagline: 'Access & networking rights',
  investment: 'Growth',
  highlight: false,
  badge: 'Standard',
  perks: ['All Ecosystem benefits', 'Delegate passes (8)', 'Exhibition booth (premium)', 'Speaking slot (1 panel)', 'Brand integration in marketing', 'VIP networking access']
}, {
  id: 'tier-strategic',
  name: 'Strategic Partner',
  tagline: 'Influence & co-design rights',
  investment: 'Premium',
  highlight: true,
  badge: 'Recommended',
  perks: ['All Growth benefits', 'Delegate passes (16)', 'Branded experience zone', 'Keynote speaking opportunity', 'Marketing narrative co-authorship', 'Agenda topic influence', 'Post-summit data insights']
}, {
  id: 'tier-title',
  name: 'Title Partner',
  tagline: 'Summit co-ownership rights',
  investment: 'Anchor',
  highlight: false,
  badge: 'Exclusive',
  perks: ['All Strategic benefits', 'Unlimited delegate passes', 'Summit naming rights', 'Exclusive Power Seat roundtable', 'Co-design of summit programme', 'Full data & analytics access', 'Year-round brand integration']
}];
type CompareRow = {
  id: string;
  feature: string;
  values: (boolean | string)[];
};
const COMPARE_ROWS: CompareRow[] = [{
  id: 'cr-logo',
  feature: 'Logo Placement',
  values: [true, true, true, true]
}, {
  id: 'cr-booth',
  feature: 'Exhibition Booth',
  values: ['Standard', 'Premium', 'Branded Zone', 'Exclusive Zone']
}, {
  id: 'cr-passes',
  feature: 'Delegate Passes',
  values: ['4', '8', '16', 'Unlimited']
}, {
  id: 'cr-social',
  feature: 'Social Media Feature',
  values: [true, true, true, true]
}, {
  id: 'cr-speaking',
  feature: 'Speaking Opportunity',
  values: [false, '1 Panel', 'Keynote', 'Keynote + MC']
}, {
  id: 'cr-vip',
  feature: 'VIP Networking Access',
  values: [false, true, true, true]
}, {
  id: 'cr-narrative',
  feature: 'Marketing Narrative Rights',
  values: [false, false, true, true]
}, {
  id: 'cr-agenda',
  feature: 'Agenda Influence',
  values: [false, false, true, true]
}, {
  id: 'cr-roundtable',
  feature: 'Power Seat Roundtable',
  values: [false, false, false, true]
}, {
  id: 'cr-naming',
  feature: 'Summit Naming Rights',
  values: [false, false, false, true]
}, {
  id: 'cr-data',
  feature: 'Full Data & Analytics',
  values: [false, false, 'Partial', 'Full']
}, {
  id: 'cr-yearround',
  feature: 'Year-Round Integration',
  values: [false, false, false, true]
}];
const TiersSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, {
    once: true,
    margin: '-60px 0px'
  });
  const {
    isMobile,
    isTablet
  } = useBreakpoint();
  const [activeTier, setActiveTier] = useState<string>('tier-strategic');
  const [hoveredTier, setHoveredTier] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTier, setModalTier] = useState('');
  const [tableOpen, setTableOpen] = useState(false);
  const hPad = isMobile ? '0 24px' : isTablet ? '0 40px' : '0 64px';
  // Tiers grid: 1 col mobile, 2 col tablet, 4 col desktop
  const tiersGridCols = isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)';
  return <section ref={sectionRef} style={{
    background: '#0f1c28',
    paddingTop: isMobile ? '72px' : '152px',
    paddingBottom: isMobile ? '72px' : '120px',
    width: '100%',
    boxSizing: 'border-box',
    overflow: 'hidden',
    position: 'relative'
  }}>
    {modalOpen && <CustomPackageModal initialTier={modalTier} onClose={() => setModalOpen(false)} />}
    <div aria-hidden="true" style={{
      position: 'absolute',
      inset: 0,
      backgroundImage: NOISE_SVG,
      backgroundRepeat: 'repeat',
      backgroundSize: '128px 128px',
      pointerEvents: 'none',
      zIndex: 0,
      opacity: 0.6
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
        marginBottom: isMobile ? '40px' : '64px',
        gap: '40px',
        flexWrap: 'wrap'
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
            }}>Partnership Tiers</span>
          </motion.div>
          <div style={{
            overflow: 'hidden'
          }}>
            <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.1} style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: isMobile ? 'clamp(28px, 8vw, 44px)' : 'clamp(32px, 4vw, 60px)',
              fontWeight: 300,
              letterSpacing: '-1.8px',
              lineHeight: 1.04,
              color: '#F7F6F3',
              margin: 0,
              maxWidth: '560px'
            }}>
              <span>{'How brands '}</span>
              <em style={{
                fontStyle: 'italic',
                color: '#DE322D'
              }}>{'engage.'}</em>
            </motion.h2>
          </div>
        </div>
        {!isMobile && <motion.p initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideFromRight} custom={0.3} style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          color: 'rgba(247,246,243,0.3)',
          maxWidth: '280px',
          lineHeight: '1.7',
          margin: 0
        }}>
          Choose the tier that aligns with your strategic ambitions. Custom packages available.
        </motion.p>}
      </div>
      <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={staggerContainer} custom={0.08} style={{
        display: 'grid',
        gridTemplateColumns: tiersGridCols,
        gap: '10px'
      }}>
        {TIERS.map((tier, i) => {
          const isActive = activeTier === tier.id;
          const isHov = hoveredTier === tier.id;
          const showActiveStyle = isActive || isHov;
          return <motion.div key={tier.id} variants={clipReveal} custom={i * 0.1} onClick={() => setActiveTier(tier.id)} onMouseEnter={() => setHoveredTier(tier.id)} onMouseLeave={() => setHoveredTier(null)} style={{
            background: showActiveStyle ? 'linear-gradient(160deg, #1a2a3a 0%, #0f1c28 100%)' : 'rgba(247,246,243,0.03)',
            border: showActiveStyle ? '1px solid rgba(222,50,45,0.25)' : '1px solid rgba(247,246,243,0.07)',
            borderRadius: '20px',
            padding: isMobile ? '24px 20px' : '36px 28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            cursor: 'pointer',
            transition: 'background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease',
            boxShadow: showActiveStyle ? '0 24px 80px rgba(5,12,20,0.5), 0 0 0 1px rgba(222,50,45,0.1)' : 'none',
            position: 'relative',
            overflow: 'hidden',
            boxSizing: 'border-box'
          }}>
            {showActiveStyle && <div aria-hidden="true" style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, #DE322D, transparent)'
            }} />}
            {isHov && !isActive && <div aria-hidden="true" style={{
              position: 'absolute',
              bottom: '-30%',
              right: '-20%',
              width: '280px',
              height: '280px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(222,50,45,0.1) 0%, transparent 70%)',
              pointerEvents: 'none'
            }} />}
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: showActiveStyle ? 'rgba(222,50,45,0.14)' : 'rgba(247,246,243,0.06)',
                border: `1px solid ${showActiveStyle ? 'rgba(222,50,45,0.28)' : 'rgba(247,246,243,0.1)'}`,
                borderRadius: '100px',
                padding: '4px 10px',
                marginBottom: '16px',
                transition: 'background 0.35s ease, border-color 0.35s ease'
              }}>
                {showActiveStyle && <motion.div animate={{
                  opacity: [1, 0.3, 1]
                }} transition={{
                  duration: 1.8,
                  repeat: Infinity
                }} style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  background: '#DE322D',
                  boxShadow: '0 0 6px rgba(222,50,45,0.6)',
                  flexShrink: 0
                }} />}
                <span style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '9px',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: showActiveStyle ? 'rgba(247,246,243,0.65)' : 'rgba(247,246,243,0.28)',
                  fontWeight: 600,
                  transition: 'color 0.35s ease'
                }}>{tier.badge}</span>
              </div>
              <h3 style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: isMobile ? '18px' : 'clamp(16px, 1.4vw, 22px)',
                fontWeight: showActiveStyle ? 500 : 300,
                letterSpacing: '-0.4px',
                color: showActiveStyle ? '#F7F6F3' : 'rgba(247,246,243,0.55)',
                margin: '0 0 6px',
                lineHeight: 1.2,
                transition: 'color 0.35s ease, font-weight 0.35s ease'
              }}>{tier.name}</h3>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '12px',
                color: showActiveStyle ? 'rgba(247,246,243,0.4)' : 'rgba(247,246,243,0.2)',
                margin: 0,
                letterSpacing: '0.02em',
                transition: 'color 0.35s ease'
              }}>{tier.tagline}</p>
            </div>
            <div style={{
              height: '1px',
              background: showActiveStyle ? 'rgba(247,246,243,0.1)' : 'rgba(247,246,243,0.05)',
              transition: 'background 0.35s ease'
            }} />
            <ul style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              flex: 1
            }}>
              {tier.perks.map(perk => <li key={perk} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <span style={{
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: showActiveStyle ? '#DE322D' : 'rgba(247,246,243,0.2)',
                  flexShrink: 0,
                  marginTop: '7px',
                  transition: 'background 0.35s ease'
                }} />
                <span style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '12px',
                  lineHeight: '1.6',
                  color: showActiveStyle ? 'rgba(247,246,243,0.65)' : 'rgba(247,246,243,0.28)',
                  transition: 'color 0.35s ease'
                }}>{perk}</span>
              </li>)}
            </ul>
            <motion.button onClick={e => {
              e.stopPropagation();
              setModalTier(tier.id);
              setModalOpen(true);
            }} whileHover={{
              scale: 1.04
            }} whileTap={{
              scale: 0.97
            }} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: showActiveStyle ? 'linear-gradient(135deg, #DE322D, #c42823)' : 'rgba(247,246,243,0.06)',
              border: showActiveStyle ? 'none' : '1px solid rgba(247,246,243,0.1)',
              borderRadius: '44px',
              padding: '12px 20px',
              fontSize: '12px',
              letterSpacing: '0.05em',
              color: showActiveStyle ? '#fff' : 'rgba(247,246,243,0.45)',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 600,
              boxShadow: showActiveStyle ? '0 6px 24px rgba(222,50,45,0.4)' : 'none',
              cursor: 'pointer',
              transition: 'background 0.35s ease, color 0.35s ease, box-shadow 0.35s ease'
            }}>
              <span>Enquire</span>
              {showActiveStyle && <ArrowIconDark />}
            </motion.button>
          </motion.div>;
        })}
      </motion.div>

      {/* Comparison Table Toggle */}
      <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.45} style={{
        marginTop: '20px'
      }}>
        <button onClick={() => setTableOpen(v => !v)} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(247,246,243,0.04)',
          border: '1px solid rgba(247,246,243,0.1)',
          borderRadius: '12px',
          padding: '14px 22px',
          cursor: 'pointer',
          width: '100%',
          fontFamily: 'Montserrat, sans-serif',
          fontSize: isMobile ? '12px' : '13px',
          letterSpacing: '0.04em',
          color: 'rgba(247,246,243,0.6)',
          transition: 'background 0.25s ease, border-color 0.25s ease',
          boxSizing: 'border-box',
          justifyContent: 'space-between'
        }} onMouseEnter={e => {
          const el = e.currentTarget as HTMLButtonElement;
          el.style.background = 'rgba(247,246,243,0.07)';
          el.style.borderColor = 'rgba(247,246,243,0.18)';
        }} onMouseLeave={e => {
          const el = e.currentTarget as HTMLButtonElement;
          el.style.background = 'rgba(247,246,243,0.04)';
          el.style.borderColor = 'rgba(247,246,243,0.1)';
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: 'rgba(222,50,45,0.12)',
              border: '1px solid rgba(222,50,45,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <rect x="1" y="1" width="4" height="4" rx="0.5" stroke="#DE322D" strokeWidth="1.2" />
                <rect x="7" y="1" width="4" height="4" rx="0.5" stroke="#DE322D" strokeWidth="1.2" />
                <rect x="1" y="7" width="4" height="4" rx="0.5" stroke="#DE322D" strokeWidth="1.2" />
                <rect x="7" y="7" width="4" height="4" rx="0.5" stroke="#DE322D" strokeWidth="1.2" />
              </svg>
            </div>
            <span>Compare all tiers side by side</span>
          </div>
          <ChevronIcon open={tableOpen} />
        </button>
        <AnimatePresence initial={false}>
          {tableOpen && <motion.div key="compare-table" initial={{
            height: 0,
            opacity: 0
          }} animate={{
            height: 'auto',
            opacity: 1
          }} exit={{
            height: 0,
            opacity: 0
          }} transition={{
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1]
          }} style={{
            overflow: 'hidden'
          }}>
            {/* On mobile/tablet: horizontally scrollable */}
            <div style={{
              marginTop: '3px',
              background: 'rgba(247,246,243,0.02)',
              border: '1px solid rgba(247,246,243,0.08)',
              borderRadius: '16px',
              overflow: isMobile ? 'auto' : 'hidden',
              boxSizing: 'border-box',
              WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling']
            }}>
              <div style={{
                minWidth: isMobile ? '560px' : 'auto'
              }}>
                {/* Table header */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr repeat(4, minmax(80px, 1fr))',
                  borderBottom: '1px solid rgba(247,246,243,0.07)',
                  background: 'rgba(247,246,243,0.03)'
                }}>
                  <div style={{
                    padding: '16px 16px'
                  }}>
                    <span style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '10px',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'rgba(247,246,243,0.25)',
                      fontWeight: 600
                    }}>Feature</span>
                  </div>
                  {TIERS.map(tier => <div key={tier.id} style={{
                    padding: '16px 12px',
                    textAlign: 'center',
                    borderLeft: '1px solid rgba(247,246,243,0.06)',
                    background: tier.id === activeTier ? 'rgba(222,50,45,0.06)' : 'transparent'
                  }}>
                    <div style={{
                      fontFamily: 'Montserrat, sans-serif',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: tier.id === activeTier ? '#DE322D' : 'rgba(247,246,243,0.5)',
                      letterSpacing: '-0.2px'
                    }}>{tier.name.replace(' Partner', '')}</div>
                    <div style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '10px',
                      color: 'rgba(247,246,243,0.25)',
                      marginTop: '2px'
                    }}>{tier.investment}</div>
                  </div>)}
                </div>
                {/* Rows */}
                {COMPARE_ROWS.map((row, ri) => <div key={row.id} style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr repeat(4, minmax(80px, 1fr))',
                  borderBottom: ri < COMPARE_ROWS.length - 1 ? '1px solid rgba(247,246,243,0.04)' : 'none',
                  background: ri % 2 === 0 ? 'rgba(247,246,243,0.01)' : 'transparent'
                }}>
                  <div style={{
                    padding: '13px 16px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <span style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '12px',
                      color: 'rgba(247,246,243,0.55)',
                      fontWeight: 300
                    }}>{row.feature}</span>
                  </div>
                  {row.values.map((val, vi) => {
                    const tierId = TIERS[vi].id;
                    const isColActive = tierId === activeTier;
                    return <div key={`${row.id}-${vi}`} style={{
                      padding: '13px 12px',
                      textAlign: 'center',
                      borderLeft: '1px solid rgba(247,246,243,0.04)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: isColActive ? 'rgba(222,50,45,0.03)' : 'transparent'
                    }}>
                      {val === true ? <CheckIcon color={isColActive ? '#DE322D' : 'rgba(247,246,243,0.45)'} /> : val === false ? <span style={{
                        width: '8px',
                        height: '1.5px',
                        background: 'rgba(247,246,243,0.12)',
                        display: 'block',
                        borderRadius: '1px'
                      }} /> : <span style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '11px',
                        color: isColActive ? '#DE322D' : 'rgba(247,246,243,0.5)',
                        fontWeight: isColActive ? 600 : 400,
                        letterSpacing: '-0.1px'
                      }}>{val}</span>}
                    </div>;
                  })}
                </div>)}
              </div>
            </div>
            {isMobile && <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '10px',
              color: 'rgba(247,246,243,0.25)',
              margin: '8px 0 0',
              letterSpacing: '0.04em',
              textAlign: 'center'
            }}>← Scroll to compare all tiers →</p>}
          </motion.div>}
        </AnimatePresence>
      </motion.div>

      {/* Custom package banner */}
      <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.5} style={{
        marginTop: '12px',
        background: 'rgba(247,246,243,0.03)',
        border: '1px solid rgba(247,246,243,0.07)',
        borderRadius: '16px',
        padding: isMobile ? '20px' : '28px 36px',
        display: 'flex',
        alignItems: isMobile ? 'flex-start' : 'center',
        gap: '20px',
        flexDirection: isMobile ? 'column' : 'row',
        boxSizing: 'border-box'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flex: 1
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'rgba(222,50,45,0.12)',
            border: '1px solid rgba(222,50,45,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L8.5 5L12.5 5L9.25 7.75L10.5 12L7 9.5L3.5 12L4.75 7.75L1.5 5L5.5 5L7 1Z" fill="#DE322D" /></svg>
          </div>
          <div>
            <div style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '13px',
              fontWeight: 600,
              color: '#F7F6F3',
              letterSpacing: '-0.1px',
              marginBottom: '3px'
            }}>Custom Partnership Packages Available</div>
            <div style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              color: 'rgba(247,246,243,0.35)',
              letterSpacing: '0.01em'
            }}>We work closely with partners to design bespoke engagement strategies tailored to your brand objectives.</div>
          </div>
        </div>
        <motion.button onClick={() => {
          setModalTier('custom');
          setModalOpen(true);
        }} whileHover={{
          scale: 1.04
        }} whileTap={{
          scale: 0.97
        }} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          border: '1px solid rgba(247,246,243,0.2)',
          borderRadius: '44px',
          padding: isMobile ? '11px 18px' : '12px 22px',
          fontSize: '12px',
          letterSpacing: '0.04em',
          color: 'rgba(247,246,243,0.7)',
          background: 'transparent',
          fontFamily: 'Montserrat, sans-serif',
          flexShrink: 0,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          transition: 'border-color 0.3s ease, color 0.3s ease',
          width: isMobile ? '100%' : 'auto',
          justifyContent: isMobile ? 'center' : 'flex-start'
        }} onMouseEnter={e => {
          const el = e.currentTarget as HTMLButtonElement;
          el.style.borderColor = 'rgba(247,246,243,0.45)';
          el.style.color = '#F7F6F3';
        }} onMouseLeave={e => {
          const el = e.currentTarget as HTMLButtonElement;
          el.style.borderColor = 'rgba(247,246,243,0.2)';
          el.style.color = 'rgba(247,246,243,0.7)';
        }}>
          <span>Discuss Custom Package</span>
          <ArrowIconDark />
        </motion.button>
      </motion.div>
    </div>
  </section>;
};

// ─── CTA Section ──────────────────────────────────────────────────────────────
const CTA_STATS = [{
  id: 'cta-s1',
  value: '4,000+',
  label: 'Attendees'
}, {
  id: 'cta-s2',
  value: '120+',
  label: 'Verified Investors'
}, {
  id: 'cta-s3',
  value: '30+',
  label: 'African Markets'
}, {
  id: 'cta-s4',
  value: '48h',
  label: 'Programming'
}];
const CTA_INFO_ITEMS = [{
  id: 'cs-1',
  label: 'Summit Date',
  value: 'May 28, 2026',
  sub: 'EmpowaWorx House'
}, {
  id: 'cs-2',
  label: 'Deadline',
  value: 'Applications Open',
  sub: 'Limited senior tier slots'
}, {
  id: 'cs-3',
  label: 'Contact',
  value: 'partnerships@empowa.co',
  sub: 'Direct partnership enquiries'
}];
const CtaSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, {
    once: true,
    margin: '-60px 0px'
  });
  const statsInView = useInView(statsRef, {
    once: true,
    margin: '-40px 0px'
  });
  const {
    isMobile,
    isTablet
  } = useBreakpoint();
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
  const magnetic = useMagnetic(0.28);
  const [formEmail, setFormEmail] = useState('');
  const [formName, setFormName] = useState('');
  const [formOrg, setFormOrg] = useState('');
  const [formTier, setFormTier] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formEmail && formName) setSubmitted(true);
  };
  const hPad = isMobile ? '0 24px' : isTablet ? '0 40px' : '0 64px';
  const inputBase: React.CSSProperties = {
    width: '100%',
    background: 'rgba(247,246,243,0.05)',
    border: '1px solid rgba(247,246,243,0.1)',
    borderRadius: '10px',
    padding: '14px 16px',
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    color: '#F7F6F3',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.25s ease'
  };
  const labelBase: React.CSSProperties = {
    display: 'block',
    fontFamily: 'Inter, sans-serif',
    fontSize: '10px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'rgba(247,246,243,0.35)',
    fontWeight: 500,
    marginBottom: '8px'
  };
  return <section id="partner-form" ref={sectionRef} onMouseMove={handleMouseMove} style={{
    background: '#0f1c28',
    width: '100%',
    boxSizing: 'border-box',
    overflow: 'hidden',
    paddingTop: isMobile ? '80px' : '168px',
    paddingBottom: isMobile ? '80px' : '168px',
    position: 'relative'
  }}>
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
    }}>PARTNERSHIPS</div>
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
        marginBottom: '48px'
      }}>
        <PlusSquareIconLight />
        <span style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '12px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'rgba(247,246,243,0.35)',
          fontWeight: 600
        }}>Join the Movement</span>
      </motion.div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile || isTablet ? '1fr' : '1fr 1fr',
        gap: isMobile ? '40px' : '80px',
        alignItems: 'center'
      }}>
        <div>
          <div style={{
            overflow: 'hidden'
          }}>
            <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.1} style={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 200,
              fontSize: isMobile ? 'clamp(40px, 11vw, 64px)' : 'clamp(44px, 6vw, 96px)',
              lineHeight: 0.91,
              letterSpacing: isMobile ? '-2px' : '-4px',
              color: '#F7F6F3',
              margin: '0 0 36px'
            }}>
              <span>{'Partner.'}</span><br />
              <em style={{
                fontStyle: 'italic',
                color: '#DE322D'
              }}>{'Fund.'}</em><br />
              <span style={{
                color: 'rgba(247,246,243,0.18)'
              }}>{'Connect.'}</span>
            </motion.h2>
          </div>
          <motion.p initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideFromLeft} custom={0.28} style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: isMobile ? '15px' : '16px',
            lineHeight: '1.8',
            color: 'rgba(247,246,243,0.55)',
            margin: '0 0 36px',
            fontWeight: 300
          }}>
            Align your organisation with the summit that is reshaping African enterprise. Together, we build the infrastructure of the continent's next growth economy.
          </motion.p>
          <motion.div ref={statsRef} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideFromLeft} custom={0.36} style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '36px'
          }}>
            {CTA_STATS.map(stat => <AnimatedStatCard key={stat.id} value={stat.value} label={stat.label} inView={statsInView} />)}
          </motion.div>
          <motion.div ref={magnetic.ref} onMouseMove={magnetic.handleMouseMove} onMouseLeave={magnetic.handleMouseLeave} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideFromLeft} custom={0.42} style={{
            x: magnetic.springX,
            y: magnetic.springY,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <motion.a href="#" onClick={e => e.preventDefault()} whileHover={{
              scale: 1.04,
              boxShadow: '0 16px 52px rgba(222,50,45,0.7)'
            }} whileTap={{
              scale: 0.97
            }} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'linear-gradient(135deg, #DE322D 0%, #c42823 100%)',
              borderRadius: '44px',
              padding: isMobile ? '14px 24px' : '18px 36px',
              fontSize: '13px',
              letterSpacing: '0.05em',
              color: '#fff',
              textDecoration: 'none',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 600,
              boxShadow: '0 10px 40px rgba(222,50,45,0.55)'
            }}>
              <span>Download Partner Deck</span><ArrowIconDark />
            </motion.a>
          </motion.div>
        </div>
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideFromRight} custom={0.25}>
          <AnimatePresence mode="wait">
            {!submitted ? <motion.div key="form" initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} exit={{
              opacity: 0,
              y: -20
            }} transition={{
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1]
            }} style={{
              background: 'rgba(247,246,243,0.04)',
              border: '1px solid rgba(247,246,243,0.1)',
              borderRadius: '28px',
              padding: isMobile ? '28px 20px' : '52px 44px',
              boxSizing: 'border-box',
              position: 'relative',
              overflow: 'hidden'
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
                repeatDelay: 3
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
              <div style={{
                marginBottom: '28px'
              }}>
                <h3 style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: isMobile ? '18px' : '22px',
                  fontWeight: 400,
                  letterSpacing: '-0.5px',
                  color: '#F7F6F3',
                  margin: '0 0 8px',
                  lineHeight: 1.2
                }}>Start the Conversation</h3>
                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '13px',
                  color: 'rgba(247,246,243,0.4)',
                  margin: 0,
                  lineHeight: '1.6'
                }}>Our partnerships team will respond within 24 hours.</p>
              </div>
              <form onSubmit={handleSubmit} style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}>
                <div>
                  <label htmlFor="cta-name" style={labelBase}>Full Name</label>
                  <input id="cta-name" type="text" value={formName} onChange={e => setFormName(e.target.value)} placeholder="Your full name" required style={inputBase} onFocus={e => {
                    (e.target as HTMLInputElement).style.borderColor = 'rgba(222,50,45,0.4)';
                  }} onBlur={e => {
                    (e.target as HTMLInputElement).style.borderColor = 'rgba(247,246,243,0.1)';
                  }} />
                </div>
                <div>
                  <label htmlFor="cta-org" style={labelBase}>Organisation</label>
                  <input id="cta-org" type="text" value={formOrg} onChange={e => setFormOrg(e.target.value)} placeholder="Your company or organisation" style={inputBase} onFocus={e => {
                    (e.target as HTMLInputElement).style.borderColor = 'rgba(222,50,45,0.4)';
                  }} onBlur={e => {
                    (e.target as HTMLInputElement).style.borderColor = 'rgba(247,246,243,0.1)';
                  }} />
                </div>
                <div>
                  <label htmlFor="cta-email" style={labelBase}>Business Email</label>
                  <input id="cta-email" type="email" value={formEmail} onChange={e => setFormEmail(e.target.value)} placeholder="your@company.com" required style={inputBase} onFocus={e => {
                    (e.target as HTMLInputElement).style.borderColor = 'rgba(222,50,45,0.4)';
                  }} onBlur={e => {
                    (e.target as HTMLInputElement).style.borderColor = 'rgba(247,246,243,0.1)';
                  }} />
                </div>
                <div>
                  <label htmlFor="cta-tier" style={labelBase}>Partnership Tier</label>
                  <div style={{
                    position: 'relative'
                  }}>
                    <select id="cta-tier" value={formTier} onChange={e => setFormTier(e.target.value)} style={{
                      ...inputBase,
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      cursor: 'pointer',
                      paddingRight: '40px',
                      color: formTier ? '#F7F6F3' : 'rgba(247,246,243,0.3)'
                    }} onFocus={e => {
                      (e.target as HTMLSelectElement).style.borderColor = 'rgba(222,50,45,0.4)';
                    }} onBlur={e => {
                      (e.target as HTMLSelectElement).style.borderColor = 'rgba(247,246,243,0.1)';
                    }}>
                      <option value="" style={{
                        background: '#0f1c28',
                        color: 'rgba(247,246,243,0.4)'
                      }}>Select a partnership tier</option>
                      {TIERS.map(tier => <option key={tier.id} value={tier.id} style={{
                        background: '#0f1c28',
                        color: '#F7F6F3'
                      }}>
                          {tier.name} — {tier.tagline}
                        </option>)}
                      <option value="custom" style={{
                        background: '#0f1c28',
                        color: '#F7F6F3'
                      }}>Custom Package</option>
                    </select>
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
                  marginTop: '8px',
                  boxShadow: '0 8px 32px rgba(222,50,45,0.45)'
                }}>
                  <span>Submit Partnership Enquiry</span><ArrowIconDark />
                </motion.button>
              </form>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '11px',
                color: 'rgba(247,246,243,0.22)',
                margin: '16px 0 0',
                letterSpacing: '0.02em'
              }}>By submitting, you agree to our privacy policy. We never share your information.</p>
            </motion.div> : <motion.div key="success" initial={{
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
              background: 'rgba(247,246,243,0.04)',
              border: '1px solid rgba(34,197,94,0.25)',
              borderRadius: '28px',
              padding: isMobile ? '44px 20px' : '64px 44px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
              textAlign: 'center'
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
                  fontSize: '20px',
                  fontWeight: 400,
                  letterSpacing: '-0.5px',
                  color: '#F7F6F3',
                  margin: '0 0 10px'
                }}>Enquiry Received</h3>
                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  color: 'rgba(247,246,243,0.45)',
                  margin: 0,
                  lineHeight: '1.7',
                  maxWidth: '320px'
                }}>
                  <span>{'Thank you, '}</span>
                  <strong style={{
                    color: 'rgba(247,246,243,0.75)'
                  }}>{formName}</strong>
                  <span>{'. Our partnerships team will reach out within 24 hours to discuss how we can work together.'}</span>
                </p>
              </div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(34,197,94,0.07)',
                border: '1px solid rgba(34,197,94,0.18)',
                borderRadius: '100px',
                padding: '7px 16px',
                marginTop: '8px'
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
            </motion.div>}
          </AnimatePresence>
        </motion.div>
      </div>
      <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={lineWipe} custom={0.55} style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
        gap: '1px',
        paddingTop: '40px',
        marginTop: '64px',
        borderTop: '0.8px solid rgba(247,246,243,0.07)',
        transformOrigin: 'left'
      }}>
        {CTA_INFO_ITEMS.map((item, i) => <div key={item.id} style={{
          padding: isMobile ? '20px 0' : '28px 32px',
          borderLeft: !isMobile && i > 0 ? '0.8px solid rgba(247,246,243,0.07)' : 'none',
          borderTop: isMobile && i > 0 ? '0.8px solid rgba(247,246,243,0.07)' : 'none',
          paddingLeft: !isMobile && i === 0 ? '0' : undefined
        }}>
          <div style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '9px',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'rgba(247,246,243,0.25)',
            fontWeight: 600,
            marginBottom: '8px'
          }}>{item.label}</div>
          <div style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: isMobile ? '14px' : '17px',
            fontWeight: 300,
            letterSpacing: '-0.4px',
            color: '#F7F6F3',
            marginBottom: '4px',
            wordBreak: 'break-all'
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

// ─── Footer ───────────────────────────────────────────────────────────────────
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
const FOOTER_LEGAL_LINKS = [{
  id: 'leg-priv',
  label: 'Privacy Policy'
}, {
  id: 'leg-terms',
  label: 'Terms'
}];
const SocialIcon = ({
  brand
}: {
  brand: string;
}) => {
  if (brand === 'x') return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" fill="rgba(247,246,243,0.55)" /></svg>;
  if (brand === 'linkedin') return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" fill="rgba(247,246,243,0.55)" /></svg>;
  if (brand === 'youtube') return <svg width="15" height="11" viewBox="0 0 24 17" fill="none" aria-hidden="true"><path d="M23.498 2.683A3.009 3.009 0 0 0 21.38.549C19.505 0 12 0 12 0S4.495 0 2.62.549A3.009 3.009 0 0 0 .502 2.683C0 4.566 0 8.5 0 8.5s0 3.934.502 5.817a3.009 3.009 0 0 0 2.118 2.134C4.495 17 12 17 12 17s7.505 0 9.38-.549a3.009 3.009 0 0 0 2.118-2.134C24 12.434 24 8.5 24 8.5s0-3.934-.502-5.817ZM9.545 12.068V4.932L15.818 8.5l-6.273 3.568Z" fill="rgba(247,246,243,0.55)" /></svg>;
  if (brand === 'instagram') return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069Z" fill="rgba(247,246,243,0.55)" /></svg>;
  return null;
};
const PartnershipsFooter = () => {
  const {
    isMobile,
    isTablet
  } = useBreakpoint();
  const footerRef = useRef<HTMLElement>(null);
  const inView = useInView(footerRef, {
    once: true,
    margin: '-80px 0px'
  });
  const hPad = isMobile ? '0 24px 48px' : isTablet ? '0 40px 56px' : '0 80px 64px';
  const scrollToForm = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('partner-form');
    if (el) {
      el.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };
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
      minHeight: isMobile ? '380px' : '520px',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'flex-end'
    }}>
      <img src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=1800&q=80" alt="" aria-hidden="true" style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: 'center 30%',
        display: 'block',
        filter: 'brightness(0.22) saturate(0.55)'
      }} />
      <div aria-hidden="true" style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, #0A0906 0%, rgba(10,9,6,0.7) 55%, rgba(10,9,6,0.08) 100%)',
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
        background: 'radial-gradient(circle, rgba(222,50,45,0.2) 0%, transparent 65%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'relative',
        zIndex: 2,
        width: '100%',
        padding: hPad,
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
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'flex-end',
          justifyContent: 'space-between',
          gap: isMobile ? '28px' : '40px'
        }}>
          <div style={{
            overflow: 'hidden',
            flex: 1
          }}>
            <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.08} style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: isMobile ? 'clamp(36px, 11vw, 64px)' : 'clamp(56px, 6.5vw, 96px)',
              fontWeight: 700,
              letterSpacing: isMobile ? '-2px' : '-3px',
              lineHeight: 0.9,
              color: '#F7F6F3',
              margin: 0,
              textTransform: 'uppercase'
            }}>
              <span>Partner</span><br />
              <em style={{
                fontStyle: 'italic',
                color: '#DE322D',
                fontWeight: 400
              }}>With Us.</em><br />
              <span style={{
                color: 'rgba(247,246,243,0.18)',
                fontWeight: 300
              }}>May 2026.</span>
            </motion.h2>
          </div>
          <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideFromRight} custom={0.22} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            minWidth: isMobile ? '100%' : '240px'
          }}>
            <motion.a href="#partner-form" onClick={scrollToForm} whileHover={{
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
              <span>Partner With Us</span><ArrowIconDark />
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
              <span>Download Deck</span>
            </motion.a>
          </motion.div>
        </div>
      </div>
    </div>
    <div style={{
      height: '1px',
      background: 'rgba(247,246,243,0.06)'
    }} />
    <div style={{
      maxWidth: '1440px',
      margin: '0 auto',
      padding: isMobile ? '32px 24px 28px' : '52px 80px 36px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'flex-start' : 'center',
        gap: '20px'
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
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #DE322D, #ff5a4f)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 16px rgba(222,50,45,0.4)'
          }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1L7.5 4.5L11 5L8.5 7.5L9 11L6 9.5L3 11L3.5 7.5L1 5L4.5 4.5L6 1Z" fill="white" /></svg>
          </motion.div>
          <span style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '11px',
            color: 'rgba(247,246,243,0.1)',
            letterSpacing: '0.04em'
          }}>© 2026 EmpowaEntrepreneurs. All rights reserved.</span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
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
              width: '34px',
              height: '34px',
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
          {FOOTER_LEGAL_LINKS.map(item => <a key={item.id} href="#" onClick={e => e.preventDefault()} style={{
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

// ─── PartnershipsPage ──────────────────────────────────────────────────────────
export const PartnershipsPage = () => {
  return <div className="w-full min-h-screen" style={{
    background: '#141210'
  }}>
    <HeroSection />
    <BenefitsSection />
    <StrategicValueSection />
    <TiersSection />
    <CtaSection />
  </div>;
};