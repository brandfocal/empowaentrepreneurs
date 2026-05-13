import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView, useAnimationFrame, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';

// ─── Constants ────────────────────────────────────────────────────────────────
const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`;
const HERO_BG = 'https://images.unsplash.com/photo-1560439513-74b037a25d84?w=1800&q=80';
const MISSION_IMG_1 = 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=900&q=80';
const MISSION_IMG_2 = 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=900&q=80';

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

// ─── SVG helpers ──────────────────────────────────────────────────────────────
const PlusSquareIconLight = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M16.25 2.5H3.75C3.41848 2.5 3.10054 2.6317 2.86612 2.86612C2.6317 3.10054 2.5 3.41848 2.5 3.75V16.25C2.5 16.5815 2.6317 16.8995 2.86612 17.1339C3.10054 17.3683 3.41848 17.5 3.75 17.5H16.25C16.5815 17.5 16.8995 17.3683 17.1339 17.1339C17.3683 16.8995 17.5 16.5815 17.5 16.25V3.75C17.5 3.41848 17.3683 3.10054 17.1339 2.86612C16.8995 2.6317 16.5815 2.5 16.25 2.5ZM13.125 10.625H10.625V13.125C10.625 13.2908 10.5592 13.4497 10.4419 13.5669C10.3247 13.6842 10.1658 13.75 10 13.75C9.83424 13.75 9.67527 13.6842 9.55806 13.5669C9.44085 13.4497 9.375 13.2908 9.375 13.125V10.625H6.875C6.70924 10.625 6.55027 10.5592 6.43306 10.4419C6.31585 10.3247 6.25 10.1658 6.25 10C6.25 9.83424 6.31585 9.67527 6.43306 9.55806C6.55027 9.44085 6.70924 9.375 6.875 9.375H9.375V6.875C9.375 6.70924 9.44085 6.55027 9.55806 6.43306C9.67527 6.31585 9.83424 6.25 10 6.25C10.1658 6.25 10.3247 6.31585 10.4419 6.43306C10.5592 6.55027 10.625 6.70924 10.625 6.875V9.375H13.125C13.2908 9.375 13.4497 9.44085 13.5669 9.55806C13.6842 9.67527 13.75 9.83424 13.75 10C13.75 10.1658 13.6842 10.3247 13.5669 10.4419C13.4497 10.5592 13.2908 10.625 13.125 10.625Z" fill="rgba(247,246,243,0.35)" />
  </svg>;
const PlusSquareIcon = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M16.25 2.5H3.75C3.41848 2.5 3.10054 2.6317 2.86612 2.86612C2.6317 3.10054 2.5 3.41848 2.5 3.75V16.25C2.5 16.5815 2.6317 16.8995 2.86612 17.1339C3.10054 17.3683 3.41848 17.5 3.75 17.5H16.25C16.5815 17.5 16.8995 17.3683 17.1339 17.1339C17.3683 16.8995 17.5 16.5815 17.5 16.25V3.75C17.5 3.41848 17.3683 3.10054 17.1339 2.86612C16.8995 2.6317 16.5815 2.5 16.25 2.5ZM13.125 10.625H10.625V13.125C10.625 13.2908 10.5592 13.4497 10.4419 13.5669C10.3247 13.6842 10.1658 13.75 10 13.75C9.83424 13.75 9.67527 13.6842 9.55806 13.5669C9.44085 13.4497 9.375 13.2908 9.375 13.125V10.625H6.875C6.70924 10.625 6.55027 10.5592 6.43306 10.4419C6.31585 10.3247 6.25 10.1658 6.25 10C6.25 9.83424 6.31585 9.67527 6.43306 9.55806C6.55027 9.44085 6.70924 9.375 6.875 9.375H9.375V6.875C9.375 6.70924 9.44085 6.55027 9.55806 6.43306C9.67527 6.31585 9.83424 6.25 10 6.25C10.1658 6.25 10.3247 6.31585 10.4419 6.43306C10.5592 6.55027 10.625 6.70924 10.625 6.875V9.375H13.125C13.2908 9.375 13.4497 9.44085 13.5669 9.55806C13.6842 9.67527 13.75 9.83424 13.75 10C13.75 10.1658 13.6842 10.3247 13.5669 10.4419C13.4497 10.5592 13.2908 10.625 13.125 10.625Z" fill="#DE322D" />
  </svg>;
const ArrowIconDark = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 12L12 2M12 2H4M12 2V10" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
// ─── Arrow icon for light sections (dark stroke) ──────────────────────────────
const ArrowIconLight = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 12L12 2M12 2H4M12 2V10" stroke="#141210" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
  label: '4,000+ Entrepreneurs & Investors'
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
          }}>
                  {item.label}
                </span>
              </div>)}
          </div>)}
      </div>
    </div>;
};

// ─── Sticky Nav ───────────────────────────────────────────────────────────────
const STICKY_NAV_ITEMS = [{
  id: 'home',
  label: 'Home',
  href: '/'
}, {
  id: 'about',
  label: 'About Us',
  href: '/about'
}, {
  id: 'programme',
  label: 'Programme',
  href: '/programme'
}, {
  id: 'experience',
  label: 'Experience Zones',
  href: '/experience-zones'
}, {
  id: 'partnerships',
  label: 'Partnerships',
  href: '#'
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
    boxSizing: 'border-box'
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
      <a href="#" onClick={e => e.preventDefault()} style={{
        display: 'flex',
        alignItems: 'center',
        gap: '9px',
        textDecoration: 'none'
      }}>
        <motion.img 
          src="/ee-logo.png" 
          alt="EmpowaSummit Logo"
          whileHover={{ scale: 1.05 }} 
          style={{ height: '30px', width: 'auto', objectFit: 'contain' }}
        />
      </a>
      {!isMobile && <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '32px'
      }}>
        {STICKY_NAV_ITEMS.map(item => <a key={item.id} href={item.href} style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '13px',
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
            boxShadow: '0 4px 16px rgba(222,50,45,0.38)',
            transition: 'box-shadow 0.3s ease'
          }}>
            <span>Register Now</span>
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
        {STICKY_NAV_ITEMS.map(item => <a key={item.id} href={item.href} onClick={() => setMobileMenuOpen(false)} style={{
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
          <a href="#" onClick={e => e.preventDefault()} style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '13px',
            border: '1px solid rgba(20,18,16,0.18)',
            borderRadius: '44px',
            padding: '10px 20px',
            color: 'rgba(20,18,16,0.65)',
            textDecoration: 'none'
          }}>Partner With Us</a>
          <a href="#" onClick={e => e.preventDefault()} style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '13px',
            background: 'linear-gradient(135deg, #DE322D, #c42823)',
            borderRadius: '44px',
            padding: '10px 20px',
            color: '#fff',
            textDecoration: 'none'
          }}>Register Now</a>
        </div>
      </motion.div>}
    </AnimatePresence>
  </motion.nav>;
};

// ─── Hero grid overlay ────────────────────────────────────────────────────────
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

// ─── Hero service strip items ─────────────────────────────────────────────────
const SERVICE_STRIP_ITEMS = [{
  id: 'ssi-1',
  label: 'Ambitious Founders'
}, {
  id: 'ssi-2',
  label: 'Institutional Funders'
}, {
  id: 'ssi-3',
  label: 'Venture Capital'
}, {
  id: 'ssi-4',
  label: 'DFIs & Corporates'
}, {
  id: 'ssi-5',
  label: 'Ecosystem Builders'
}];

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
      {/* Overlay gradient */}
      <div aria-hidden="true" style={{
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(160deg, rgba(20,18,16,0.96) 0%, rgba(20,18,16,0.8) 45%, rgba(20,18,16,0.92) 100%)',
      pointerEvents: 'none',
      zIndex: 1
    }} />
      {/* Noise texture */}
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
      {/* Red orb top-right — parallax */}
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

      {/* Grid */}
      <div style={{
      position: 'relative',
      zIndex: 3
    }}>
        <HeroGrid />
      </div>

      {/* Spacer for nav */}
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
        {/* Label */}
        <motion.div custom={0.05} initial="hidden" animate="visible" variants={fadeUpVariants} style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '36px',
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
            <span> Funding Summit — </span>
            <span style={{
            color: 'rgba(247,246,243,0.55)',
            fontWeight: 500
          }}>About Us</span>
          </span>
        </motion.div>

        {/* Main headline */}
        <h1 style={{
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: 200,
        margin: '0 0 32px',
        lineHeight: 0.91,
        letterSpacing: isMobile ? '-2px' : '-4px',
        maxWidth: '960px'
      }}>
          <div style={{
          overflow: 'hidden',
          display: 'block',
          whiteSpace: 'nowrap'
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
          }}>
              Africa's
            </motion.span>
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
            color: "#f7f6f3"
          }}>
              Premier
            </motion.span>
          </div>
          <div style={{
          overflow: 'hidden',
          display: 'block',
          whiteSpace: 'nowrap'
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
          }}>
              Capital
            </motion.span>
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
          }}>
              Movement.
            </motion.em>
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
          We exist to accelerate the meeting of ambitious African founders and the catalytic capital that unlocks their full potential — shaping economies, communities, and the continent's next chapter.
        </motion.p>

        {/* CTA buttons */}
        <motion.div custom={0.75} initial="hidden" animate="visible" variants={fadeUpVariants} style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap',
        marginBottom: '56px'
      }}>
          <motion.a href="#" onClick={e => e.preventDefault()} whileHover={{
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
          boxShadow: '0 8px 36px rgba(222,50,45,0.55), 0 2px 8px rgba(222,50,45,0.3)',
          transition: 'box-shadow 0.3s ease'
        }}>
            <span>Register Now</span>
            <ArrowIconDark />
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
      position: 'relative'
    }}>
        <HeroTicker light />
      </motion.div>

      {/* Service strip */}
      <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      duration: 0.6,
      delay: 1.1
    }} style={{
      display: 'flex',
      justifyContent: isMobile ? 'flex-start' : 'space-between',
      alignItems: 'center',
      padding: isMobile ? '16px 24px' : '18px 64px',
      borderTop: '0.8px solid rgba(247,246,243,0.07)',
      flexWrap: 'wrap',
      gap: isMobile ? '12px 20px' : '16px',
      zIndex: 4,
      position: 'relative'
    }}>
        {SERVICE_STRIP_ITEMS.map(svc => <div key={svc.id} style={{
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

// ─── Defining Mission Section ─────────────────────────────────────────────────
const MissionSection = () => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, {
    once: true,
    margin: '-60px 0px'
  });
  const isMobile = useIsMobile();
  return <section ref={ref} style={{
    background: '#F7F6F3',
    width: '100%',
    boxSizing: 'border-box',
    padding: isMobile ? '80px 24px' : '120px 64px',
    overflow: 'hidden',
    position: 'relative'
  }}>
      {/* Noise */}
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
      {/* Large radial gradient orb top-right */}
      <div aria-hidden="true" style={{
      position: 'absolute',
      top: '5%',
      right: '-12%',
      width: 'clamp(500px, 60vw, 900px)',
      height: 'clamp(500px, 60vw, 900px)',
      borderRadius: '50%',
      background: 'radial-gradient(circle at 40% 40%, rgba(222,50,45,0.07) 0%, rgba(222,50,45,0.02) 45%, transparent 70%)',
      pointerEvents: 'none',
      zIndex: 0
    }} />
      {/* Secondary accent orb bottom-left */}
      <div aria-hidden="true" style={{
      position: 'absolute',
      bottom: '-8%',
      left: '-6%',
      width: 'clamp(360px, 40vw, 600px)',
      height: 'clamp(360px, 40vw, 600px)',
      borderRadius: '50%',
      background: 'radial-gradient(circle at 55% 55%, rgba(222,50,45,0.05) 0%, transparent 65%)',
      pointerEvents: 'none',
      zIndex: 0
    }} />
      {/* Subtle vertical divider line */}
      <motion.div aria-hidden="true" initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={lineWipe} custom={0.3} style={{
      position: 'absolute',
      top: 0,
      left: '50%',
      bottom: 0,
      width: '1px',
      background: 'rgba(20,18,16,0.06)',
      pointerEvents: 'none',
      transformOrigin: 'top',
      zIndex: 0
    }} />

      <div style={{
      maxWidth: '1280px',
      margin: '0 auto',
      position: 'relative',
      zIndex: 1
    }}>
        {/* Section label */}
        <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '72px'
      }}>
          <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={rotateFade} custom={0.05}>
            <PlusSquareIcon />
          </motion.div>
          <motion.span initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUpVariants} custom={0.1} style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '12px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'rgba(20,18,16,0.45)',
          fontWeight: 600
        }}>
            Defining Mission
          </motion.span>
        </div>

        {/* Grid */}
        <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? '56px' : '96px',
        alignItems: 'start'
      }}>
          {/* Left column */}
          <div>
            <div style={{
            overflow: 'hidden',
            marginBottom: '40px'
          }}>
              <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.15} style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: isMobile ? 'clamp(30px, 9vw, 48px)' : 'clamp(36px, 4.5vw, 68px)',
              fontWeight: 300,
              letterSpacing: '-2px',
              lineHeight: 1.02,
              color: '#141210',
              margin: 0
            }}>
                <span>Where </span>
                <em style={{
                fontStyle: 'italic',
                color: '#DE322D'
              }}>scalable businesses</em>
                <span style={{
                color: 'rgba(20,18,16,0.2)'
              }}> meet catalytic capital.</span>
              </motion.h2>
            </div>

            <motion.p initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.28} style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: isMobile ? '15px' : '17px',
            lineHeight: '1.82',
            color: 'rgba(20,18,16,0.55)',
            margin: '0 0 40px',
            fontWeight: 300
          }}>
              The EmpowaEntrepreneurs Funding Summit was founded on a singular conviction: that Africa's next generation of transformative businesses deserves direct, frictionless access to the capital and networks that will allow them to scale, compete, and lead globally.
            </motion.p>

            <motion.p initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.38} style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: isMobile ? '15px' : '17px',
            lineHeight: '1.82',
            color: 'rgba(20,18,16,0.55)',
            margin: '0 0 48px',
            fontWeight: 300
          }}>
              We are not a conference. We are a capital movement — a high-conviction ecosystem where ambitious founders, institutional funders, DFIs, venture capital firms, and ecosystem builders converge with one shared mandate: unlock growth.
            </motion.p>

            {/* Stat row */}
            <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={lineWipe} custom={0.5} style={{
            display: 'flex',
            alignItems: 'center',
            borderTop: '1px solid rgba(20,18,16,0.08)',
            borderBottom: '1px solid rgba(20,18,16,0.08)',
            transformOrigin: 'left'
          }}>
              {[{
              id: 'ms-1',
              label: 'Summit Venue',
              value: 'EmpowaWorx House'
            }, {
              id: 'ms-2',
              label: 'Attendees',
              value: '4,000+'
            }, {
              id: 'ms-3',
              label: 'Edition',
              value: 'Summit 2026'
            }].map((stat, i) => <motion.div key={stat.id} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.55 + i * 0.1} style={{
              flex: 1,
              padding: '20px 0',
              borderRight: i < 2 ? '1px solid rgba(20,18,16,0.08)' : 'none',
              paddingLeft: i > 0 ? isMobile ? '12px' : '24px' : '0',
              paddingRight: isMobile ? '12px' : '24px'
            }}>
                  <div style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '9px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'rgba(20,18,16,0.35)',
                fontWeight: 500,
                marginBottom: '6px'
              }}>
                    {stat.label}
                  </div>
                  <div style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: isMobile ? '12px' : '15px',
                fontWeight: 600,
                color: '#141210',
                letterSpacing: '-0.3px'
              }}>
                    {stat.value}
                  </div>
                </motion.div>)}
            </motion.div>
          </div>

          {/* Right column — images */}
          <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
            <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={scaleReveal} custom={0.2} style={{
            borderRadius: '20px',
            overflow: 'hidden',
            height: isMobile ? '260px' : '320px',
            position: 'relative',
            boxShadow: '0 4px 24px rgba(20,18,16,0.1)'
          }}>
              <img src={MISSION_IMG_1} alt="Ambitious founders engaging at the EmpowaEntrepreneurs Funding Summit" style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              filter: 'brightness(0.82) saturate(0.85)'
            }} />
              <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(20,18,16,0.45) 0%, transparent 55%)',
              pointerEvents: 'none'
            }} />
              <div style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(247,246,243,0.75)'
            }}>
                <span>Founders &amp; Builders</span>
              </div>
            </motion.div>

            <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px'
          }}>
              <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={scaleReveal} custom={0.32} style={{
              borderRadius: '16px',
              overflow: 'hidden',
              height: '180px',
              position: 'relative',
              boxShadow: '0 4px 20px rgba(20,18,16,0.09)'
            }}>
                <img src={MISSION_IMG_2} alt="Institutional funders and venture capital leaders at the summit" style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                filter: 'brightness(0.75) saturate(0.75)'
              }} />
                <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(20,18,16,0.55) 0%, transparent 60%)',
                pointerEvents: 'none'
              }} />
                <div style={{
                position: 'absolute',
                bottom: '14px',
                left: '14px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '10px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(247,246,243,0.7)'
              }}>
                  <span>Institutional Capital</span>
                </div>
              </motion.div>

              <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={scaleReveal} custom={0.42} style={{
              borderRadius: '16px',
              overflow: 'hidden',
              height: '180px',
              background: 'linear-gradient(135deg, #DE322D 0%, #8B1A17 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '20px',
              boxSizing: 'border-box',
              position: 'relative',
              boxShadow: '0 8px 32px rgba(222,50,45,0.25)'
            }}>
                <div aria-hidden="true" style={{
                position: 'absolute',
                bottom: '-20px',
                right: '-20px',
                width: '140px',
                height: '140px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)',
                pointerEvents: 'none'
              }} />
                <div style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: 'clamp(36px, 4vw, 52px)',
                fontWeight: 200,
                letterSpacing: '-2px',
                color: '#F7F6F3',
                lineHeight: 1
              }}>
                  <span>2026</span>
                </div>
                <div>
                  <div style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '10px',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'rgba(247,246,243,0.55)',
                  marginBottom: '4px'
                }}>
                    <span>Summit Edition</span>
                  </div>
                  <div style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#F7F6F3',
                  letterSpacing: '-0.2px'
                }}>
                    <span>May 28, 2026</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};

// ─── Who We Convene — Founders ────────────────────────────────────────────────
type FounderCard = {
  id: string;
  index: string;
  title: string;
  description: string;
  tag: string;
  accent: string;
  img: string;
  imgAlt: string;
};
const FOUNDER_CARDS: FounderCard[] = [{
  id: 'fc-1',
  index: '01',
  title: 'Visionary Builders',
  description: 'Founders architecting the next generation of scalable African enterprises — from seed stage to market leaders who dominate continental markets.',
  tag: 'Pre-Seed to Series B',
  accent: 'Builders',
  img: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=900&q=80',
  imgAlt: 'Founders networking and building at the summit'
}, {
  id: 'fc-2',
  index: '02',
  title: 'Problem Solvers',
  description: "Entrepreneurs tackling Africa's most pressing challenges across fintech, agritech, health, and infrastructure — turning friction into opportunity.",
  tag: 'Cross-Industry',
  accent: 'Solvers',
  img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&q=80',
  imgAlt: 'Collaborative team solving industry challenges'
}, {
  id: 'fc-3',
  index: '03',
  title: 'Growth Accelerators',
  description: 'Scaling founders ready to access procurement pipelines, co-investment mandates, and the continental expansion capital needed to dominate new markets.',
  tag: 'Scale & Expansion',
  accent: 'Accelerators',
  img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900&q=80',
  imgAlt: 'Growth leaders discussing expansion strategy'
}, {
  id: 'fc-4',
  index: '04',
  title: 'Ecosystem Leaders',
  description: 'Founders who lead with purpose — building businesses that generate economic influence and lasting impact far beyond their own organisations.',
  tag: 'Continental Reach',
  accent: 'Leaders',
  img: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=900&q=80',
  imgAlt: 'Ecosystem leaders shaping the African economy'
}];

// ─── Count-up hook ────────────────────────────────────────────────────────────
const useCountUp = (target: number, duration = 1.8, inView = false, prefix = '', suffix = '') => {
  const [display, setDisplay] = useState(`${prefix}0${suffix}`);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);
  useEffect(() => {
    if (!inView) return;
    startRef.current = null;
    const animate = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const elapsed = (ts - startRef.current) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(ease * target);
      setDisplay(`${prefix}${current.toLocaleString()}${suffix}`);
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [inView, target, duration, prefix, suffix]);
  return display;
};
const FoundersSection = () => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, {
    once: true,
    margin: '-60px 0px'
  });
  const isMobile = useIsMobile();
  const [activeId, setActiveId] = useState<string>('fc-1');
  const activeCard = FOUNDER_CARDS.find(c => c.id === activeId) ?? FOUNDER_CARDS[0];
  return <section ref={ref} style={{
    background: '#0d1117',
    width: '100%',
    boxSizing: 'border-box',
    padding: isMobile ? '80px 0 0' : '120px 0 0',
    overflow: 'hidden',
    position: 'relative'
  }}>
      {/* Noise */}
      <div aria-hidden="true" style={{
      position: 'absolute',
      inset: 0,
      backgroundImage: NOISE_SVG,
      backgroundRepeat: 'repeat',
      backgroundSize: '128px 128px',
      pointerEvents: 'none',
      opacity: 0.55,
      zIndex: 0
    }} />
      {/* Orb top-right */}
      <div aria-hidden="true" style={{
      position: 'absolute',
      top: '-5%',
      right: '-8%',
      width: 'clamp(400px, 50vw, 760px)',
      height: 'clamp(400px, 50vw, 760px)',
      borderRadius: '50%',
      background: 'radial-gradient(circle at 40% 40%, rgba(222,50,45,0.1) 0%, transparent 68%)',
      pointerEvents: 'none',
      zIndex: 0
    }} />
      {/* Orb bottom-left */}
      <div aria-hidden="true" style={{
      position: 'absolute',
      bottom: '0',
      left: '-6%',
      width: 'clamp(300px, 35vw, 560px)',
      height: 'clamp(300px, 35vw, 560px)',
      borderRadius: '50%',
      background: 'radial-gradient(circle at 55% 55%, rgba(222,50,45,0.06) 0%, transparent 68%)',
      pointerEvents: 'none',
      zIndex: 0
    }} />

      <div style={{
      maxWidth: '1280px',
      margin: '0 auto',
      padding: isMobile ? '0 24px' : '0 64px',
      position: 'relative',
      zIndex: 1
    }}>
        {/* Section header */}
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
            }}>Who We Convene</span>
            </motion.div>
            <div style={{
            overflow: 'hidden'
          }}>
              <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.1} style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: isMobile ? 'clamp(32px, 9vw, 52px)' : 'clamp(40px, 5vw, 78px)',
              fontWeight: 200,
              letterSpacing: '-2px',
              lineHeight: 0.96,
              color: '#F7F6F3',
              margin: 0
            }}>
                <span>The people who </span>
                <em style={{
                fontStyle: 'italic',
                color: '#DE322D'
              }}>move</em>
                <span style={{
                color: 'rgba(247,246,243,0.2)'
              }}> Africa.</span>
              </motion.h2>
            </div>
          </div>
          {!isMobile && <motion.a href="#" onClick={e => e.preventDefault()} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideFromRight} custom={0.3} whileHover={{
          scale: 1.04
        }} whileTap={{
          scale: 0.97
        }} style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          border: '1px solid rgba(247,246,243,0.15)',
          borderRadius: '44px',
          padding: '12px 24px',
          fontSize: '12px',
          letterSpacing: '0.06em',
          color: 'rgba(247,246,243,0.5)',
          textDecoration: 'none',
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: 500,
          transition: 'border-color 0.3s ease, color 0.3s ease'
        }} onMouseEnter={e => {
          const el = e.currentTarget as HTMLAnchorElement;
          el.style.borderColor = 'rgba(247,246,243,0.4)';
          el.style.color = '#F7F6F3';
        }} onMouseLeave={e => {
          const el = e.currentTarget as HTMLAnchorElement;
          el.style.borderColor = 'rgba(247,246,243,0.15)';
          el.style.color = 'rgba(247,246,243,0.5)';
        }}>
              <span>Apply to Attend</span>
              <ArrowIconDark />
            </motion.a>}
        </div>

        {/* Main split layout */}
        {!isMobile ? <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUpVariants} custom={0.2} style={{
        display: 'grid',
        gridTemplateColumns: '1fr 420px',
        gap: '16px',
        alignItems: 'stretch'
      }}>

            {/* Left: Featured card — animated crossfade */}
            <div style={{
          borderRadius: '24px',
          overflow: 'hidden',
          position: 'relative',
          minHeight: '540px',
          background: '#141210'
        }}>
              <AnimatePresence mode="wait">
                <motion.img key={activeCard.id + '-img'} src={activeCard.img} alt={activeCard.imgAlt} initial={{
              opacity: 0,
              scale: 1.06
            }} animate={{
              opacity: 1,
              scale: 1
            }} exit={{
              opacity: 0,
              scale: 0.97
            }} transition={{
              duration: 0.65,
              ease: [0.22, 1, 0.36, 1]
            }} style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              filter: 'brightness(0.52) saturate(0.6)',
              position: 'absolute',
              inset: 0
            }} />
              </AnimatePresence>
              {/* Gradient overlay */}
              <div aria-hidden="true" style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(13,17,23,0.97) 0%, rgba(13,17,23,0.6) 45%, transparent 100%)',
            pointerEvents: 'none'
          }} />
              {/* Corner accent */}
              <div aria-hidden="true" style={{
            position: 'absolute',
            top: '24px',
            left: '24px',
            width: '36px',
            height: '36px',
            borderLeft: '1px solid rgba(222,50,45,0.4)',
            borderTop: '1px solid rgba(222,50,45,0.4)'
          }} />
              <div aria-hidden="true" style={{
            position: 'absolute',
            bottom: '24px',
            right: '24px',
            width: '36px',
            height: '36px',
            borderRight: '1px solid rgba(222,50,45,0.2)',
            borderBottom: '1px solid rgba(222,50,45,0.2)'
          }} />
              {/* Content overlay at bottom */}
              <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '40px'
          }}>
                <AnimatePresence mode="wait">
                  <motion.div key={activeCard.id + '-content'} initial={{
                opacity: 0,
                y: 24,
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
                ease: [0.22, 1, 0.36, 1]
              }}>
                    {/* Index + tag row */}
                    <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '16px'
                }}>
                      <span style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '11px',
                    letterSpacing: '0.14em',
                    color: '#DE322D',
                    fontWeight: 700
                  }}>{activeCard.index}</span>
                      <div style={{
                    width: '20px',
                    height: '1px',
                    background: 'rgba(247,246,243,0.2)'
                  }} />
                      <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'rgba(222,50,45,0.15)',
                    border: '1px solid rgba(222,50,45,0.3)',
                    borderRadius: '44px',
                    padding: '4px 12px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '10px',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'rgba(247,246,243,0.75)',
                    fontWeight: 500
                  }}>
                        <span style={{
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      background: '#DE322D',
                      display: 'block',
                      flexShrink: 0
                    }} />
                        {activeCard.tag}
                      </span>
                    </div>
                    <h3 style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: 'clamp(28px, 3.5vw, 46px)',
                  fontWeight: 200,
                  letterSpacing: '-1.5px',
                  color: '#F7F6F3',
                  margin: '0 0 16px',
                  lineHeight: 1.05
                }}>
                      {activeCard.title}
                    </h3>
                    <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '15px',
                  lineHeight: '1.78',
                  color: 'rgba(247,246,243,0.55)',
                  margin: 0,
                  fontWeight: 300,
                  maxWidth: '480px'
                }}>
                      {activeCard.description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Right: Vertical card stack */}
            <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
              {FOUNDER_CARDS.map((card, i) => <motion.button key={card.id} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideFromRight} custom={0.25 + i * 0.08} onClick={() => setActiveId(card.id)} style={{
            all: 'unset',
            cursor: 'pointer',
            borderRadius: '18px',
            padding: '24px 28px',
            background: activeId === card.id ? 'rgba(222,50,45,0.1)' : 'rgba(247,246,243,0.03)',
            border: `1px solid ${activeId === card.id ? 'rgba(222,50,45,0.3)' : 'rgba(247,246,243,0.06)'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            flex: 1,
            transition: 'background 0.35s cubic-bezier(0.22,1,0.36,1), border-color 0.35s ease',
            boxSizing: 'border-box',
            position: 'relative',
            overflow: 'hidden',
            textAlign: 'left'
          }} onMouseEnter={e => {
            if (activeId !== card.id) {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(247,246,243,0.06)';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(247,246,243,0.14)';
            }
          }} onMouseLeave={e => {
            if (activeId !== card.id) {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(247,246,243,0.03)';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(247,246,243,0.06)';
            }
          }}>
                  {/* Active left bar */}
                  {activeId === card.id && <motion.div aria-hidden="true" initial={{
              scaleY: 0
            }} animate={{
              scaleY: 1
            }} transition={{
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1]
            }} style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '3px',
              background: 'linear-gradient(to bottom, #DE322D, rgba(222,50,45,0.3))',
              transformOrigin: 'top',
              borderRadius: '18px 0 0 18px'
            }} />}
                  {/* Index circle */}
                  <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              flexShrink: 0,
              background: activeId === card.id ? 'rgba(222,50,45,0.18)' : 'rgba(247,246,243,0.06)',
              border: `1px solid ${activeId === card.id ? 'rgba(222,50,45,0.4)' : 'rgba(247,246,243,0.1)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.35s ease, border-color 0.35s ease'
            }}>
                    <span style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '10px',
                letterSpacing: '0.12em',
                fontWeight: 700,
                color: activeId === card.id ? '#DE322D' : 'rgba(247,246,243,0.3)',
                transition: 'color 0.35s ease'
              }}>{card.index}</span>
                  </div>
                  {/* Text */}
                  <div style={{
              flex: 1,
              minWidth: 0
            }}>
                    <div style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: 'clamp(14px, 1.4vw, 18px)',
                fontWeight: 400,
                letterSpacing: '-0.3px',
                color: activeId === card.id ? '#F7F6F3' : 'rgba(247,246,243,0.4)',
                marginBottom: '4px',
                lineHeight: 1.2,
                transition: 'color 0.35s ease'
              }}>
                      {card.title}
                    </div>
                    <div style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '11px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: activeId === card.id ? 'rgba(222,50,45,0.9)' : 'rgba(247,246,243,0.2)',
                fontWeight: 500,
                transition: 'color 0.35s ease'
              }}>
                      {card.tag}
                    </div>
                  </div>
                  {/* Arrow */}
                  <motion.div animate={{
              x: activeId === card.id ? 0 : -4,
              opacity: activeId === card.id ? 1 : 0
            }} transition={{
              duration: 0.3,
              ease: [0.22, 1, 0.36, 1]
            }}>
                    <ArrowIconDark />
                  </motion.div>
                </motion.button>)}
            </div>
          </motion.div> : (/* Mobile: stacked cards */
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
            {FOUNDER_CARDS.map((card, i) => <motion.div key={card.id} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.15 + i * 0.09} style={{
          borderRadius: '20px',
          overflow: 'hidden',
          position: 'relative',
          height: '240px',
          background: '#141210'
        }}>
                <img src={card.img} alt={card.imgAlt} style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            filter: 'brightness(0.45) saturate(0.6)'
          }} />
                <div aria-hidden="true" style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(13,17,23,0.97) 0%, transparent 65%)',
            pointerEvents: 'none'
          }} />
                <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '24px'
          }}>
                  <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '10px'
            }}>
                    <span style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '10px',
                letterSpacing: '0.14em',
                color: '#DE322D',
                fontWeight: 700
              }}>{card.index}</span>
                    <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: 'rgba(222,50,45,0.15)',
                border: '1px solid rgba(222,50,45,0.3)',
                borderRadius: '44px',
                padding: '3px 10px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '9px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(247,246,243,0.7)',
                fontWeight: 500
              }}>
                      <span style={{
                  width: '3px',
                  height: '3px',
                  borderRadius: '50%',
                  background: '#DE322D',
                  display: 'block'
                }} />
                      {card.tag}
                    </span>
                  </div>
                  <h3 style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: 'clamp(20px, 6vw, 28px)',
              fontWeight: 200,
              letterSpacing: '-1px',
              color: '#F7F6F3',
              margin: '0 0 8px',
              lineHeight: 1.1
            }}>{card.title}</h3>
                  <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              lineHeight: '1.7',
              color: 'rgba(247,246,243,0.5)',
              margin: 0,
              fontWeight: 300
            }}>{card.description}</p>
                </div>
              </motion.div>)}
          </div>)}
      </div>

      {/* Stat band — full width flush bottom */}
      <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUpVariants} custom={0.65} style={{
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
      gap: '1px',
      marginTop: isMobile ? '48px' : '72px',
      background: 'rgba(247,246,243,0.06)'
    }}>
        {[{
        id: 'fs-1',
        value: 2400,
        suffix: '+',
        label: 'Founders Expected'
      }, {
        id: 'fs-2',
        value: 120,
        suffix: '+',
        label: 'Verified Investors'
      }, {
        id: 'fs-3',
        value: 30,
        suffix: '+',
        label: 'African Markets'
      }, {
        id: 'fs-4',
        value: 48,
        suffix: 'h',
        label: 'Hours of Programming'
      }].map(stat => {
        const countDisplay = useCountUp(stat.value, 1.8, inView, '', stat.suffix);
        return <div key={stat.id} style={{
          background: '#0d1117',
          padding: isMobile ? '28px 20px' : '40px 40px',
          boxSizing: 'border-box'
        }}>
              <div style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: isMobile ? 'clamp(28px, 7vw, 40px)' : 'clamp(36px, 3.5vw, 52px)',
            fontWeight: 200,
            letterSpacing: '-1.5px',
            color: '#F7F6F3',
            lineHeight: 1,
            marginBottom: '8px'
          }}>
                <span>{inView ? countDisplay : `0${stat.suffix}`}</span>
              </div>
              <div style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '10px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(247,246,243,0.28)',
            fontWeight: 500
          }}>
                <span>{stat.label}</span>
              </div>
            </div>;
      })}
      </motion.div>
    </section>;
};

// ─── Capital Partners Section ─────────────────────────────────────────────────
type PartnerCategory = {
  id: string;
  name: string;
  description: string;
  items: string[];
};
const PARTNER_CATEGORIES: PartnerCategory[] = [{
  id: 'pc-vc',
  name: 'Venture Capital',
  description: 'High-conviction VC firms seeking Africa\'s most investable, scalable businesses at the intersection of technology, enterprise, and continental impact.',
  items: ['Early-Stage Funds', 'Growth Capital', 'Sector-Specific VCs', 'Pan-African Funds', 'Global VC with Africa Mandate']
}, {
  id: 'pc-dfi',
  name: 'Development Finance Institutions',
  description: 'Bilateral and multilateral DFIs deploying catalytic capital to accelerate private sector development and sustainable enterprise growth across the continent.',
  items: ['Bilateral Development Banks', 'Multilateral Agencies', 'Blended Finance Platforms', 'Concessional Capital Vehicles', 'Government-Backed Funds']
}, {
  id: 'pc-esd',
  name: 'ESD Funds',
  description: 'Enterprise and Supplier Development funds channelling corporate spend into transformative black-owned and emerging enterprise development initiatives.',
  items: ['Corporate ESD Programmes', 'B-BBEE Funded Vehicles', 'Skills & Enterprise Development', 'Supplier Development Mandates', 'SED Initiatives']
}, {
  id: 'pc-impact',
  name: 'Impact Funds',
  description: 'Mission-driven capital allocators measuring success across financial returns and measurable social, environmental, and economic outcomes for African communities.',
  items: ['Social Impact Funds', 'Climate Finance', 'Gender-Lens Investing', 'Agricultural Impact Capital', 'SDG-Aligned Vehicles']
}];
const CapitalPartnersSection = () => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, {
    once: true,
    margin: '-60px 0px'
  });
  const isMobile = useIsMobile();
  const [openId, setOpenId] = useState<string>('pc-vc');
  const [hoveredAccordionId, setHoveredAccordionId] = useState<string | null>(null);
  return <section ref={ref} style={{
    background: '#0f1c28',
    width: '100%',
    boxSizing: 'border-box',
    padding: isMobile ? '80px 24px' : '120px 64px',
    overflow: 'hidden',
    position: 'relative'
  }}>
      {/* Noise */}
      <div aria-hidden="true" style={{
      position: 'absolute',
      inset: 0,
      backgroundImage: NOISE_SVG,
      backgroundRepeat: 'repeat',
      backgroundSize: '128px 128px',
      pointerEvents: 'none',
      opacity: 0.55,
      zIndex: 0
    }} />
      {/* Orb */}
      <div aria-hidden="true" style={{
      position: 'absolute',
      top: '-5%',
      left: '-10%',
      width: 'clamp(500px, 55vw, 840px)',
      height: 'clamp(500px, 55vw, 840px)',
      borderRadius: '50%',
      background: 'radial-gradient(circle at 60% 40%, rgba(222,50,45,0.09) 0%, transparent 68%)',
      pointerEvents: 'none',
      zIndex: 0
    }} />

      <div style={{
      maxWidth: '1280px',
      margin: '0 auto',
      position: 'relative',
      zIndex: 1
    }}>
        {/* Header */}
        <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: isMobile ? '48px' : '80px',
        flexWrap: 'wrap',
        gap: '32px'
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
            }}>
                Capital Partners
              </span>
            </motion.div>
            <div style={{
            overflow: 'hidden'
          }}>
              <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.1} style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: isMobile ? 'clamp(32px, 9vw, 52px)' : 'clamp(40px, 5vw, 78px)',
              fontWeight: 200,
              letterSpacing: '-2px',
              lineHeight: 0.96,
              color: '#F7F6F3',
              margin: 0,
              maxWidth: '640px'
            }}>
                <span>The capital that </span>
                <em style={{
                fontStyle: 'italic',
                color: '#DE322D'
              }}>moves</em>
                <span style={{
                color: 'rgba(247,246,243,0.2)'
              }}> Africa.</span>
              </motion.h2>
            </div>
          </div>
          {!isMobile && <motion.p initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideFromRight} custom={0.25} style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '15px',
          color: 'rgba(247,246,243,0.3)',
          maxWidth: '300px',
          lineHeight: '1.75',
          margin: 0
        }}>
              Four categories of capital converge at the summit — each representing a distinct mandate to invest in Africa's future.
            </motion.p>}
        </div>

        {/* Accordion rows */}
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={staggerContainer} custom={0.08} style={{
        display: 'flex',
        flexDirection: 'column'
      }}>
          {PARTNER_CATEGORIES.map((cat, i) => <motion.div key={cat.id} variants={staggerChild} onMouseEnter={() => {
          if (openId !== cat.id) setHoveredAccordionId(cat.id);
        }} onMouseLeave={() => setHoveredAccordionId(null)} style={{
          borderTop: i === 0 ? '1px solid rgba(247,246,243,0.1)' : 'none',
          borderBottom: '1px solid',
          borderBottomColor: openId === cat.id ? 'rgba(222,50,45,0.25)' : hoveredAccordionId === cat.id ? 'rgba(247,246,243,0.18)' : 'rgba(247,246,243,0.07)',
          background: openId === cat.id ? 'transparent' : hoveredAccordionId === cat.id ? 'rgba(247,246,243,0.03)' : 'transparent',
          transition: 'background 0.35s cubic-bezier(0.22,1,0.36,1), border-bottom-color 0.35s ease',
          borderRadius: hoveredAccordionId === cat.id && openId !== cat.id ? '8px' : '0'
        }}>
              {/* Accordion header / trigger */}
              <button onClick={() => {
            setOpenId(openId === cat.id ? '' : cat.id);
            setHoveredAccordionId(null);
          }} style={{
            all: 'unset',
            cursor: 'pointer',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: isMobile ? '24px 16px' : '32px 20px',
            boxSizing: 'border-box',
            gap: '16px'
          }}>
                <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: isMobile ? '16px' : '32px',
              flex: 1,
              minWidth: 0
            }}>
                  {/* Number */}
                  <span style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '11px',
                letterSpacing: '0.14em',
                color: openId === cat.id ? '#DE322D' : hoveredAccordionId === cat.id ? 'rgba(247,246,243,0.45)' : 'rgba(247,246,243,0.2)',
                fontWeight: 600,
                transition: 'color 0.35s ease',
                flexShrink: 0
              }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {/* Name */}
                  <span style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: isMobile ? 'clamp(18px, 5vw, 26px)' : 'clamp(22px, 2.5vw, 34px)',
                fontWeight: 300,
                letterSpacing: '-0.5px',
                color: openId === cat.id ? '#F7F6F3' : hoveredAccordionId === cat.id ? 'rgba(247,246,243,0.75)' : 'rgba(247,246,243,0.5)',
                transition: 'color 0.35s ease',
                lineHeight: 1.1
              }}>
                    {cat.name}
                  </span>
                </div>
                {/* Toggle icon */}
                <motion.div animate={{
              rotate: openId === cat.id ? 45 : 0
            }} transition={{
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1]
            }} style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: `1px solid ${openId === cat.id ? 'rgba(222,50,45,0.4)' : hoveredAccordionId === cat.id ? 'rgba(247,246,243,0.25)' : 'rgba(247,246,243,0.1)'}`,
              background: openId === cat.id ? 'rgba(222,50,45,0.1)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'background 0.35s ease, border-color 0.35s ease'
            }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 2V12M2 7H12" stroke={openId === cat.id ? '#DE322D' : 'rgba(247,246,243,0.4)'} strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </motion.div>
              </button>

              {/* Accordion body */}
              <AnimatePresence initial={false}>
                {openId === cat.id && <motion.div key={cat.id + '-body'} initial={{
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
                    <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: isMobile ? '32px' : '80px',
                padding: isMobile ? '0 16px 40px' : '0 20px 40px',
                alignItems: 'start'
              }}>
                      {/* Left: description + CTA */}
                      <div>
                        <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: isMobile ? '15px' : '17px',
                    lineHeight: '1.8',
                    color: 'rgba(247,246,243,0.5)',
                    margin: '0 0 32px',
                    fontWeight: 300
                  }}>
                          {cat.description}
                        </p>
                        <motion.a href="#" onClick={e => e.preventDefault()} whileHover={{
                    scale: 1.04,
                    boxShadow: '0 12px 48px rgba(222,50,45,0.6)'
                  }} whileTap={{
                    scale: 0.97
                  }} style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'linear-gradient(135deg, #DE322D, #c42823)',
                    borderRadius: '44px',
                    padding: '13px 28px',
                    fontSize: '12px',
                    letterSpacing: '0.06em',
                    color: '#fff',
                    textDecoration: 'none',
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 600,
                    boxShadow: '0 6px 28px rgba(222,50,45,0.4)'
                  }}>
                          <span>Partner With Us</span>
                          <ArrowIconDark />
                        </motion.a>
                      </div>

                      {/* Right: items as pill grid */}
                      <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '10px',
                  alignContent: 'flex-start'
                }}>
                        {cat.items.map((item, idx) => <motion.span key={`${cat.id}-pill-${idx}`} initial={{
                    opacity: 0,
                    scale: 0.9
                  }} animate={{
                    opacity: 1,
                    scale: 1
                  }} transition={{
                    duration: 0.35,
                    delay: idx * 0.06,
                    ease: [0.22, 1, 0.36, 1]
                  }} style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'rgba(247,246,243,0.04)',
                    border: '1px solid rgba(247,246,243,0.1)',
                    borderRadius: '44px',
                    padding: '10px 18px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '13px',
                    color: 'rgba(247,246,243,0.65)',
                    fontWeight: 300,
                    letterSpacing: '-0.1px'
                  }}>
                            <span style={{
                      width: '5px',
                      height: '5px',
                      borderRadius: '50%',
                      background: '#DE322D',
                      display: 'block',
                      flexShrink: 0,
                      boxShadow: '0 0 6px rgba(222,50,45,0.5)'
                    }} />
                            {item}
                          </motion.span>)}
                      </div>
                    </div>
                  </motion.div>}
              </AnimatePresence>
            </motion.div>)}
        </motion.div>

        {/* Bottom stat strip */}
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.5} style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
        gap: '1px',
        marginTop: '64px',
        background: 'rgba(247,246,243,0.07)',
        borderRadius: '20px',
        overflow: 'hidden'
      }}>
          {[{
          id: 'cps-1',
          number: '120+',
          label: 'Verified Investors'
        }, {
          id: 'cps-2',
          number: '4',
          label: 'Capital Categories'
        }, {
          id: 'cps-3',
          number: '$2B+',
          label: 'Capital in the Room'
        }, {
          id: 'cps-4',
          number: '30+',
          label: 'African Markets'
        }].map(stat => <div key={stat.id} style={{
          background: '#0f1c28',
          padding: isMobile ? '28px 20px' : '36px 32px',
          boxSizing: 'border-box'
        }}>
              <div style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: isMobile ? 'clamp(28px, 7vw, 40px)' : 'clamp(32px, 3vw, 48px)',
            fontWeight: 200,
            letterSpacing: '-1.5px',
            color: '#F7F6F3',
            lineHeight: 1,
            marginBottom: '8px'
          }}>
                <span>{stat.number}</span>
              </div>
              <div style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '10px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(247,246,243,0.28)',
            fontWeight: 500
          }}>
                <span>{stat.label}</span>
              </div>
            </div>)}
        </motion.div>
      </div>
    </section>;
};

// ─── Impact Section ───────────────────────────────────────────────────────────
type ImpactCard = {
  id: string;
  number: string;
  rawNumber: number;
  suffix: string;
  prefix: string;
  label: string;
  description: string;
  accent: boolean;
};
const IMPACT_CARDS: ImpactCard[] = [{
  id: 'ic-1',
  number: '4,000+',
  rawNumber: 4000,
  suffix: '+',
  prefix: '',
  label: 'Unlocking Opportunity',
  description: 'Entrepreneurs, funders, DFIs and ecosystem builders converging with one shared mandate: deploy capital, generate growth.',
  accent: false
}, {
  id: 'ic-2',
  number: '120+',
  rawNumber: 120,
  suffix: '+',
  prefix: '',
  label: 'Economic Influence',
  description: 'Verified investors — VCs, angels, and institutional capital allocators — present and ready to commit to Africa\'s next wave.',
  accent: true
}, {
  id: 'ic-3',
  number: '30+',
  rawNumber: 30,
  suffix: '+',
  prefix: '',
  label: 'Ecosystem Collaboration',
  description: 'African markets represented, building a continental network of enterprise leaders, policy makers, and capital deployers.',
  accent: false
}, {
  id: 'ic-4',
  number: '48h',
  rawNumber: 48,
  suffix: 'h',
  prefix: '',
  label: 'Concentrated Momentum',
  description: 'Hours of curated programming — keynotes, pitch sessions, power seat roundtables, and strategic showcases.',
  accent: false
}];
const ImpactStatNumber = ({
  card,
  inView
}: {
  card: ImpactCard;
  inView: boolean;
}) => {
  const display = useCountUp(card.rawNumber, card.rawNumber >= 1000 ? 2.2 : 1.6, inView, card.prefix, card.suffix);
  return <span>{inView ? display : `0${card.suffix}`}</span>;
};
const ImpactSection = () => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, {
    once: true,
    margin: '-60px 0px'
  });
  const isMobile = useIsMobile();
  return <section ref={ref} style={{
    background: '#F7F6F3',
    width: '100%',
    boxSizing: 'border-box',
    padding: isMobile ? '80px 24px' : '120px 64px',
    overflow: 'hidden',
    position: 'relative'
  }}>
      {/* Noise */}
      <div aria-hidden="true" style={{
      position: 'absolute',
      inset: 0,
      backgroundImage: NOISE_SVG,
      backgroundRepeat: 'repeat',
      backgroundSize: '128px 128px',
      pointerEvents: 'none',
      opacity: 0.4
    }} />
      {/* Red orb bottom-left */}
      <div aria-hidden="true" style={{
      position: 'absolute',
      bottom: '-10%',
      left: '-8%',
      width: 'clamp(400px, 45vw, 680px)',
      height: 'clamp(400px, 45vw, 680px)',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(222,50,45,0.06) 0%, transparent 68%)',
      pointerEvents: 'none'
    }} />
      {/* Red orb top-right */}
      <div aria-hidden="true" style={{
      position: 'absolute',
      top: '-8%',
      right: '-6%',
      width: 'clamp(350px, 40vw, 620px)',
      height: 'clamp(350px, 40vw, 620px)',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(222,50,45,0.05) 0%, transparent 68%)',
      pointerEvents: 'none'
    }} />

      <div style={{
      maxWidth: '1280px',
      margin: '0 auto',
      position: 'relative',
      zIndex: 1
    }}>
        {/* Header */}
        <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: '72px',
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
                The Impact
              </span>
            </motion.div>
            <div style={{
            overflow: 'hidden'
          }}>
              <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.1} style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: isMobile ? 'clamp(32px, 9vw, 52px)' : 'clamp(40px, 5vw, 78px)',
              fontWeight: 300,
              letterSpacing: '-2px',
              lineHeight: 0.96,
              color: '#141210',
              margin: 0,
              maxWidth: '560px'
            }}>
                <span>Measurable </span>
                <em style={{
                fontStyle: 'italic',
                color: '#DE322D'
              }}>influence</em>
                <span style={{
                color: 'rgba(20,18,16,0.2)'
              }}> at scale.</span>
              </motion.h2>
            </div>
          </div>
          {!isMobile && <motion.p initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideFromRight} custom={0.28} style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '15px',
          color: 'rgba(20,18,16,0.4)',
          maxWidth: '280px',
          lineHeight: '1.75',
          margin: 0
        }}>
              Every number tells the story of a connection made, capital deployed, and a business transformed.
            </motion.p>}
        </div>

        {/* Cards */}
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={staggerContainer} custom={0.08} style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
        gap: '12px'
      }}>
          {IMPACT_CARDS.map(card => <motion.div key={card.id} variants={staggerChild} whileHover={{
          y: -4,
          transition: {
            duration: 0.3,
            ease: [0.22, 1, 0.36, 1]
          }
        }} style={{
          background: card.accent ? 'linear-gradient(145deg, #DE322D 0%, #9b1916 100%)' : '#FFFFFF',
          borderRadius: '20px',
          padding: isMobile ? '28px 20px' : '40px 32px',
          border: card.accent ? 'none' : '1px solid rgba(20,18,16,0.07)',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: card.accent ? '0 16px 60px rgba(222,50,45,0.3)' : '0 2px 16px rgba(20,18,16,0.05)',
          cursor: 'default'
        }}>
              {card.accent && <div aria-hidden="true" style={{
            position: 'absolute',
            bottom: '-20%',
            right: '-10%',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            pointerEvents: 'none'
          }} />}
              <div style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: isMobile ? 'clamp(36px, 9vw, 52px)' : 'clamp(44px, 4vw, 60px)',
            fontWeight: 200,
            letterSpacing: '-2.5px',
            lineHeight: 1,
            color: card.accent ? '#F7F6F3' : '#141210',
            position: 'relative',
            zIndex: 1
          }}>
                <ImpactStatNumber card={card} inView={inView} />
              </div>

              <div style={{
            height: '1px',
            background: card.accent ? 'rgba(247,246,243,0.18)' : 'rgba(20,18,16,0.08)',
            position: 'relative',
            zIndex: 1
          }} />

              <div style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: isMobile ? '13px' : '15px',
            fontWeight: 600,
            letterSpacing: '-0.2px',
            color: card.accent ? '#F7F6F3' : '#141210',
            position: 'relative',
            zIndex: 1
          }}>
                <span>{card.label}</span>
              </div>

              <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: isMobile ? '12px' : '13px',
            lineHeight: '1.7',
            color: card.accent ? 'rgba(247,246,243,0.65)' : 'rgba(20,18,16,0.45)',
            margin: 0,
            fontWeight: 300,
            position: 'relative',
            zIndex: 1
          }}>
                {card.description}
              </p>
            </motion.div>)}
        </motion.div>

        {/* Bottom CTA band */}
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.45} style={{
        marginTop: '48px',
        background: '#141210',
        borderRadius: '24px',
        padding: isMobile ? '36px 28px' : '48px 56px',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'flex-start' : 'center',
        justifyContent: 'space-between',
        gap: '28px',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box'
      }}>
          <div aria-hidden="true" style={{
          position: 'absolute',
          top: '-30%',
          right: '-8%',
          width: '380px',
          height: '380px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(222,50,45,0.14) 0%, transparent 65%)',
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
          zIndex: 1
        }}>
            <div style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: isMobile ? '22px' : 'clamp(24px, 2.8vw, 36px)',
            fontWeight: 300,
            letterSpacing: '-0.8px',
            color: '#F7F6F3',
            marginBottom: '10px',
            lineHeight: 1.15
          }}>
              <span>Ready to be part of the movement?</span>
            </div>
            <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            color: 'rgba(247,246,243,0.4)',
            margin: 0,
            maxWidth: '440px',
            lineHeight: '1.72'
          }}>
              Join Africa's most ambitious founders, funders, and ecosystem builders at EmpowaWorx House, May 2026.
            </p>
          </div>

          <div style={{
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          position: 'relative',
          zIndex: 1,
          flexShrink: 0
        }}>
            <motion.a href="#" onClick={e => e.preventDefault()} whileHover={{
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
            boxShadow: '0 6px 28px rgba(222,50,45,0.45)'
          }}>
              <span>Register Now</span>
              <ArrowIconDark />
            </motion.a>
            <motion.a href="#" onClick={e => e.preventDefault()} whileHover={{
            scale: 1.04
          }} whileTap={{
            scale: 0.97
          }} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            border: '1px solid rgba(247,246,243,0.2)',
            borderRadius: '44px',
            padding: '14px 24px',
            fontSize: '13px',
            letterSpacing: '0.04em',
            color: 'rgba(247,246,243,0.7)',
            textDecoration: 'none',
            fontFamily: 'Montserrat, sans-serif',
            transition: 'border-color 0.25s, color 0.25s'
          }} onMouseEnter={e => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.borderColor = 'rgba(247,246,243,0.5)';
            el.style.color = '#F7F6F3';
          }} onMouseLeave={e => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.borderColor = 'rgba(247,246,243,0.2)';
            el.style.color = 'rgba(247,246,243,0.7)';
          }}>
              <span>Learn More</span>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>;
};

// ─── Footer ───────────────────────────────────────────────────────────────────
const FOOTER_NAV_COLS = [{
  id: 'fcol-summit',
  heading: 'Summit',
  links: [{
    id: 'fl-about',
    label: 'About the Summit'
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
const FOOTER_BANNER_BG = 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=1800&q=80';
const SiteFooter = () => {
  const isMobile = useIsMobile();
  const footerRef = useRef<HTMLElement>(null);
  const inView = useInView(footerRef, {
    once: true,
    margin: '-80px 0px'
  });
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
      minHeight: isMobile ? '440px' : '520px',
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
        filter: 'brightness(0.22) saturate(0.5)'
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
        maxWidth: '700px',
        maxHeight: '700px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(222,50,45,0.2) 0%, transparent 65%)',
        pointerEvents: 'none'
      }} />

        <div style={{
        position: 'relative',
        zIndex: 2,
        width: '100%',
        padding: isMobile ? '0 24px 52px' : '0 80px 64px',
        boxSizing: 'border-box',
        maxWidth: '1440px',
        margin: '0 auto'
      }}>
          <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={rotateFade} custom={0} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '28px'
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
              Africa's Premier Capital Movement · 2026
            </span>
          </motion.div>

          <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'flex-end',
          justifyContent: 'space-between',
          gap: '40px'
        }}>
            <div style={{
            overflow: 'hidden',
            flex: 1
          }}>
              <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.08} style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: isMobile ? 'clamp(44px, 12vw, 72px)' : 'clamp(56px, 7vw, 96px)',
              fontWeight: 700,
              letterSpacing: isMobile ? '-2px' : '-3px',
              lineHeight: 0.9,
              color: '#F7F6F3',
              margin: 0,
              textTransform: 'uppercase'
            }}>
                <span>Secure</span>
                <br />
                <em style={{
                fontStyle: 'italic',
                color: '#DE322D',
                fontWeight: 400
              }}>Your Seat.</em>
                <br />
                <span style={{
                color: 'rgba(247,246,243,0.18)',
                fontWeight: 300
              }}>May 2026.</span>
              </motion.h2>
            </div>

            <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideFromRight} custom={0.22} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            minWidth: isMobile ? '100%' : '240px'
          }}>
              <motion.a href="#" onClick={e => e.preventDefault()} whileHover={{
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
              padding: '18px 36px',
              fontSize: '13px',
              letterSpacing: '0.05em',
              color: '#fff',
              textDecoration: 'none',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 600,
              boxShadow: '0 8px 40px rgba(222,50,45,0.5)'
            }}>
                <span>Register Now</span>
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
              padding: '18px 36px',
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
      background: 'rgba(247,246,243,0.06)'
    }} />

      <div style={{
      maxWidth: '1440px',
      margin: '0 auto',
      padding: isMobile ? '52px 24px 0' : '64px 80px 0',
      boxSizing: 'border-box'
    }}>
        <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '40px',
        paddingBottom: '52px',
        borderBottom: '1px solid rgba(247,246,243,0.07)'
      }}>
          <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          maxWidth: isMobile ? '100%' : '300px'
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
                <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
                  <path d="M6 1L7.5 4.5L11 5L8.5 7.5L9 11L6 9.5L3 11L3.5 7.5L1 5L4.5 4.5L6 1Z" fill="white" />
                </svg>
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
              }}>
                  EmpowaEntrepreneurs
                </div>
                <div style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '10px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'rgba(247,246,243,0.22)',
                fontWeight: 400,
                marginTop: '2px'
              }}>
                  Funding Summit · 2026
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
              Africa's premier capital movement connecting ambitious founders with catalytic capital and transformative growth.
            </p>
          </div>

          <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '36px' : '0',
          flex: isMobile ? 'none' : '1',
          maxWidth: isMobile ? '100%' : '640px',
          justifyContent: 'flex-end',
          width: isMobile ? '100%' : undefined
        }}>
            <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
            gap: isMobile ? '28px' : '0',
            flex: 1
          }}>
              {FOOTER_NAV_COLS.map((col, colIdx) => <div key={col.id} style={{
              paddingLeft: !isMobile && colIdx > 0 ? '40px' : '0',
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
        </div>

        <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'flex-start' : 'center',
        gap: '20px',
        padding: '28px 0 40px'
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
          }].map(item => <a key={item.id} href="#" style={{
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

// ─── Floating CTA Pill ────────────────────────────────────────────────────────
const FloatingCTAPill = () => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const isMobile = useIsMobile();
  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight;
      setVisible(window.scrollY > heroHeight * 0.85);
    };
    window.addEventListener('scroll', handleScroll, {
      passive: true
    });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return <AnimatePresence>
    {visible && !dismissed && <motion.div key="sticky-banner" initial={{
      y: 100,
      opacity: 0
    }} animate={{
      y: 0,
      opacity: 1
    }} exit={{
      y: 100,
      opacity: 0
    }} transition={{
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1]
    }} style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 150,
      padding: isMobile ? '0 16px 16px' : '0 24px 20px',
      pointerEvents: 'none'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        background: '#14202c',
        border: '1px solid rgba(247,246,243,0.1)',
        borderRadius: isMobile ? '20px' : '24px',
        padding: isMobile ? '16px 18px' : '18px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: isMobile ? '12px' : '20px',
        boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(222,50,45,0.1)',
        pointerEvents: 'all',
        flexWrap: isMobile ? 'wrap' : 'nowrap',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Left accent bar */}
        <div aria-hidden="true" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: '3px',
          background: 'linear-gradient(180deg, #DE322D, #ff7a70)',
          borderRadius: '24px 0 0 24px'
        }} />

        {/* Pulsing dot */}
        <div style={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          background: 'rgba(222,50,45,0.15)',
          border: '1px solid rgba(222,50,45,0.28)'
        }}>
          <motion.div animate={{
            opacity: [1, 0.35, 1],
            scale: [1, 1.18, 1]
          }} transition={{
            duration: 1.9,
            repeat: Infinity,
            ease: 'easeInOut'
          }} style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: '#DE322D',
            boxShadow: '0 0 10px rgba(222,50,45,0.7)'
          }} />
        </div>

        {/* Text content */}
        <div style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '2px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap'
          }}>
            <span style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: isMobile ? '13px' : '14px',
              fontWeight: 700,
              color: '#F7F6F3',
              letterSpacing: '-0.1px',
              whiteSpace: 'nowrap'
            }}>
              EmpowaEntrepreneurs Summit 2026
            </span>
          </div>
          <span style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '11px',
            color: 'rgba(247,246,243,0.5)',
            letterSpacing: '0.02em',
            whiteSpace: isMobile ? 'normal' : 'nowrap'
          }}>
            <span>May 28, 2026 · EmpowaWorx House</span>
            {!isMobile && <span style={{
              margin: '0 8px',
              color: 'rgba(247,246,243,0.2)'
            }}>·</span>}
            {!isMobile && <span>Secure your seat before registration closes</span>}
          </span>
        </div>

        {/* Divider */}
        {!isMobile && <div style={{
          width: '1px',
          height: '36px',
          background: 'rgba(247,246,243,0.12)',
          flexShrink: 0
        }} />}

        {/* CTAs */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexShrink: 0,
          flexWrap: 'nowrap'
        }}>
          <motion.a href="#" onClick={e => e.preventDefault()} whileHover={{
            scale: 1.04,
            boxShadow: '0 8px 32px rgba(222,50,45,0.55)'
          }} whileTap={{
            scale: 0.97
          }} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            background: 'linear-gradient(135deg, #DE322D 0%, #c42823 100%)',
            borderRadius: '44px',
            padding: isMobile ? '10px 18px' : '11px 22px',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.04em',
            color: '#fff',
            textDecoration: 'none',
            fontFamily: 'Montserrat, sans-serif',
            boxShadow: '0 4px 20px rgba(222,50,45,0.4)',
            whiteSpace: 'nowrap'
          }}>
            <span>Register Now</span>
            <ArrowIconDark />
          </motion.a>
          {!isMobile && <motion.a href="#" onClick={e => e.preventDefault()} whileHover={{
            scale: 1.04
          }} whileTap={{
            scale: 0.97
          }} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            border: '1px solid rgba(247,246,243,0.22)',
            borderRadius: '44px',
            padding: '11px 20px',
            fontSize: '12px',
            letterSpacing: '0.04em',
            color: 'rgba(247,246,243,0.75)',
            textDecoration: 'none',
            fontFamily: 'Montserrat, sans-serif',
            whiteSpace: 'nowrap',
            transition: 'border-color 0.25s ease, color 0.25s ease'
          }} onMouseEnter={e => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.borderColor = 'rgba(247,246,243,0.5)';
            el.style.color = '#F7F6F3';
          }} onMouseLeave={e => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.borderColor = 'rgba(247,246,243,0.22)';
            el.style.color = 'rgba(247,246,243,0.75)';
          }}>
            <span>Learn More</span>
          </motion.a>}
        </div>

        {/* Dismiss button */}
        <button onClick={() => setDismissed(true)} aria-label="Dismiss registration banner" style={{
          flexShrink: 0,
          background: 'rgba(247,246,243,0.08)',
          border: '1px solid rgba(247,246,243,0.1)',
          cursor: 'pointer',
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          transition: 'background 0.2s ease'
        }} onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(247,246,243,0.18)';
        }} onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(247,246,243,0.08)';
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1L11 11M11 1L1 11" stroke="rgba(247,246,243,0.9)" strokeWidth="1.5" strokeLinecap="round" /></svg>
        </button>
      </div>
    </motion.div>}
  </AnimatePresence>;
};

// ─── AboutUsPage ──────────────────────────────────────────────────────────────
export const AboutUsPage = () => {
  return <div className="w-full min-h-screen" style={{
    background: '#141210',
    overflowX: 'hidden'
  }}>
      
      <FloatingCTAPill />
      
      <HeroSection />
      <MissionSection />
      <FoundersSection />
      <CapitalPartnersSection />
      <ImpactSection />
      
    </div>;
};