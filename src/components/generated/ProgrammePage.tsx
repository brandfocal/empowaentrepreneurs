import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView, useAnimationFrame, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { NewsletterForm } from './NewsletterForm';
// ─── Noise texture ─────────────────────────────────────────────────────────────
const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`;

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

// ─── Shared SVG helpers ────────────────────────────────────────────────────────
const PlusSquareIcon = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M16.25 2.5H3.75C3.41848 2.5 3.10054 2.6317 2.86612 2.86612C2.6317 3.10054 2.5 3.41848 2.5 3.75V16.25C2.5 16.5815 2.6317 16.8995 2.86612 17.1339C3.10054 17.3683 3.41848 17.5 3.75 17.5H16.25C16.5815 17.5 16.8995 17.3683 17.1339 17.1339C17.3683 16.8995 17.5 16.5815 17.5 16.25V3.75C17.5 3.41848 17.3683 3.10054 17.1339 2.86612C16.8995 2.6317 16.5815 2.5 16.25 2.5ZM13.125 10.625H10.625V13.125C10.625 13.2908 10.5592 13.4497 10.4419 13.5669C10.3247 13.6842 10.1658 13.75 10 13.75C9.83424 13.75 9.67527 13.6842 9.55806 13.5669C9.44085 13.4497 9.375 13.2908 9.375 13.125V10.625H6.875C6.70924 10.625 6.55027 10.5592 6.43306 10.4419C6.31585 10.3247 6.25 10.1658 6.25 10C6.25 9.83424 6.31585 9.67527 6.43306 9.55806C6.55027 9.44085 6.70924 9.375 6.875 9.375H9.375V6.875C9.375 6.70924 9.44085 6.55027 9.55806 6.43306C9.67527 6.31585 9.83424 6.25 10 6.25C10.1658 6.25 10.3247 6.31585 10.4419 6.43306C10.5592 6.55027 10.625 6.70924 10.625 6.875V9.375H13.125C13.2908 9.375 13.4497 9.44085 13.5669 9.55806C13.6842 9.67527 13.75 9.83424 13.75 10C13.75 10.1658 13.6842 10.3247 13.5669 10.4419C13.4497 10.5592 13.2908 10.625 13.125 10.625Z" fill="#DE322D" />
  </svg>;
const PlusSquareIconLight = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M16.25 2.5H3.75C3.41848 2.5 3.10054 2.6317 2.86612 2.86612C2.6317 3.10054 2.5 3.41848 2.5 3.75V16.25C2.5 16.5815 2.6317 16.8995 2.86612 17.1339C3.10054 17.3683 3.41848 17.5 3.75 17.5H16.25C16.5815 17.5 16.8995 17.3683 17.1339 17.1339C17.3683 16.8995 17.5 16.5815 17.5 16.25V3.75C17.5 3.41848 17.3683 3.10054 17.1339 2.86612C16.8995 2.6317 16.5815 2.5 16.25 2.5ZM13.125 10.625H10.625V13.125C10.625 13.2908 10.5592 13.4497 10.4419 13.5669C10.3247 13.6842 10.1658 13.75 10 13.75C9.83424 13.75 9.67527 13.6842 9.55806 13.5669C9.44085 13.4497 9.375 13.2908 9.375 13.125V10.625H6.875C6.70924 10.625 6.55027 10.5592 6.43306 10.4419C6.31585 10.3247 6.25 10.1658 6.25 10C6.25 9.83424 6.31585 9.67527 6.43306 9.55806C6.55027 9.44085 6.70924 9.375 6.875 9.375H9.375V6.875C9.375 6.70924 9.44085 6.55027 9.55806 6.43306C9.67527 6.31585 9.83424 6.25 10 6.25C10.1658 6.25 10.3247 6.31585 10.4419 6.43306C10.5592 6.55027 10.625 6.70924 10.625 6.875V9.375H13.125C13.2908 9.375 13.4497 9.44085 13.5669 9.55806C13.6842 9.67527 13.75 9.83424 13.75 10C13.75 10.1658 13.6842 10.3247 13.5669 10.4419C13.4497 10.5592 13.2908 10.625 13.125 10.625Z" fill="rgba(247,246,243,0.35)" />
  </svg>;
const ArrowIconDark = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 12L12 2M12 2H4M12 2V10" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;

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
  label: 'VC Stage'
}, {
  id: 'tk-2',
  label: 'ESD Stage'
}, {
  id: 'tk-3',
  label: 'Private Equity Stage'
}, {
  id: 'tk-4',
  label: 'DFI Stage'
}, {
  id: 'tk-5',
  label: 'Loan Financing Stage'
}, {
  id: 'tk-6',
  label: 'Impact Funds Stage'
}, {
  id: 'tk-7',
  label: "Women's Fund Room"
}, {
  id: 'tk-8',
  label: "Dragons' Den Pitching"
}, {
  id: 'tk-9',
  label: 'Masterclasses'
}];
const ProgrammeTicker = ({
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
    xRef.current -= delta / 1000 * 36;
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

// ─── StickyNav ────────────────────────────────────────────────────────────────
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
const ProgrammeNav = () => {
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
          textTransform: 'uppercase',
          color: scrolled ? '#141210' : '#F7F6F3',
          fontWeight: 700,
          transition: 'color 0.35s ease'
        }}>EmpowaSummit</span>
        </a>
        {!isMobile && <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '32px'
      }}>
            {STICKY_NAV_ITEMS.map(item => <a key={item.id} href="#"  style={{
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
            {STICKY_NAV_ITEMS.map(item => <a key={item.id} href="#" onClick={e => { e.preventDefault(); setMobileMenuOpen(false); }} style={{
          display: 'block',
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '16px',
          color: 'rgba(20,18,16,0.65)',
          textDecoration: 'none',
          padding: '12px 0',
          borderBottom: '0.8px solid rgba(20,18,16,0.06)',
          letterSpacing: '0.02em'
        }}>{item.label}</a>)}
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
            textDecoration: 'none'
          }}>Register Now</a>
            </div>
          </motion.div>}
      </AnimatePresence>
    </motion.nav>;
};

// ─── Programme Hero ────────────────────────────────────────────────────────────
const HERO_BG = 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1800&q=80';
const ProgrammeHero = () => {
  const heroRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();
  const {
    scrollYProgress
  } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);
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
      backgroundImage: `url(${HERO_BG})`,
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
      background: 'linear-gradient(160deg, rgba(20,18,16,0.94) 0%, rgba(20,18,16,0.78) 40%, rgba(20,18,16,0.9) 100%)',
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
      {/* Grid lines */}
      <div aria-hidden="true" style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 2,
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
      {/* Orbs */}
      <div aria-hidden="true" style={{
      position: 'absolute',
      top: '-5%',
      right: '-8%',
      width: 'clamp(400px, 50vw, 720px)',
      height: 'clamp(400px, 50vw, 720px)',
      borderRadius: '50%',
      background: 'radial-gradient(circle at 40% 40%, rgba(222,50,45,0.2) 0%, rgba(222,50,45,0.06) 45%, transparent 70%)',
      pointerEvents: 'none',
      zIndex: 3
    }} />
      <div style={{
      height: '88px',
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
      padding: isMobile ? '40px 24px 40px' : '60px 64px 60px',
      width: '100%',
      boxSizing: 'border-box',
      zIndex: 4,
      position: 'relative'
    }}>
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
          }}>Programme</span>
            <span> - EmpowaEntrepreneurs Funding Summit 2026</span>
          </span>
        </motion.div>
        <h1 style={{
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: 300,
        margin: '0 0 36px',
        lineHeight: 0.93,
        letterSpacing: isMobile ? '-2px' : '-3px'
      }}>
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
            delay: 0.15,
            ease: [0.22, 1, 0.36, 1]
          }} style={{
            display: 'inline-block',
            marginRight: '0.2em',
            fontSize: isMobile ? 'clamp(38px, 10vw, 60px)' : 'clamp(48px, 6.5vw, 104px)',
            color: "#f7f6f3"
          }}>Where</motion.span>
            <motion.span initial={{
            y: '110%',
            opacity: 0
          }} animate={{
            y: '0%',
            opacity: 1
          }} transition={{
            duration: 0.9,
            delay: 0.27,
            ease: [0.22, 1, 0.36, 1]
          }} style={{
            display: 'inline-block',
            marginRight: '0.2em',
            fontSize: isMobile ? 'clamp(38px, 10vw, 60px)' : 'clamp(48px, 6.5vw, 104px)',
            color: '#F7F6F3'
          }}>Africa's</motion.span>
            <motion.span initial={{
            y: '110%',
            opacity: 0
          }} animate={{
            y: '0%',
            opacity: 1
          }} transition={{
            duration: 0.9,
            delay: 0.39,
            ease: [0.22, 1, 0.36, 1]
          }} style={{
            display: 'inline-block',
            marginRight: '0.2em',
            fontSize: isMobile ? 'clamp(38px, 10vw, 60px)' : 'clamp(48px, 6.5vw, 104px)',
            color: "rgb(247 246 243 / 0.25)"
          }}>Capital</motion.span>
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
            delay: 0.51,
            ease: [0.22, 1, 0.36, 1]
          }} style={{
            display: 'inline-block',
            fontStyle: 'italic',
            fontWeight: 300,
            marginRight: '0.2em',
            fontSize: isMobile ? 'clamp(38px, 10vw, 60px)' : 'clamp(48px, 6.5vw, 104px)',
            color: '#DE322D'
          }}>Forces</motion.em>
            <motion.span initial={{
            y: '110%',
            opacity: 0
          }} animate={{
            y: '0%',
            opacity: 1
          }} transition={{
            duration: 0.9,
            delay: 0.63,
            ease: [0.22, 1, 0.36, 1]
          }} style={{
            display: 'inline-block',
            fontSize: isMobile ? 'clamp(38px, 10vw, 60px)' : 'clamp(48px, 6.5vw, 104px)',
            color: "#f7f6f3"
          }}>Converge.</motion.span>
          </div>
        </h1>
        {/* Core theme */}
        <motion.div custom={0.72} initial="hidden" animate="visible" variants={fadeUpVariants} style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0',
        marginBottom: '40px',
        border: '1px solid rgba(222,50,45,0.3)',
        borderRadius: '4px',
        overflow: 'hidden',
        width: 'fit-content'
      }}>
          {['REAL CAPITAL.', 'REAL DEALS.', 'REAL GROWTH.'].map((word, i) => <div key={word} style={{
          padding: isMobile ? '12px 16px' : '14px 24px',
          borderRight: i < 2 ? '1px solid rgba(222,50,45,0.3)' : 'none',
          fontFamily: 'Montserrat, sans-serif',
          fontSize: isMobile ? '10px' : '12px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: i === 0 ? '#DE322D' : i === 1 ? 'rgba(247,246,243,0.65)' : 'rgba(247,246,243,0.38)',
          fontWeight: 700,
          whiteSpace: 'nowrap'
        }}>{word}</div>)}
        </motion.div>
        <motion.div custom={0.82} initial="hidden" animate="visible" variants={fadeUpVariants} style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap'
      }}>
          <motion.a href="#stages"  whileHover={{
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
          boxShadow: '0 8px 36px rgba(222,50,45,0.55)',
          transition: 'box-shadow 0.3s ease'
        }}>
            <span>Explore Programme</span><ArrowIconDark />
          </motion.a>
          <motion.a href="/summit" whileHover={{
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
            <span>Register Now</span><ArrowIconDark />
          </motion.a>
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
        <ProgrammeTicker light />
      </motion.div>
    </section>;
};

// ─── Themed Stages Grid ────────────────────────────────────────────────────────
type Stage = {
  id: string;
  number: string;
  name: string;
  theme: string;
  focus: string;
  accentColor: string;
  imageSrc: string;
  imageAlt: string;
};
const STAGES: Stage[] = [{
  id: 'stage-vc',
  number: '01',
  name: 'VC Stage',
  theme: 'Venture Capital & Growth Equity',
  focus: 'Connecting high-growth African startups with early and growth-stage venture capital firms deploying catalytic capital across the continent.',
  accentColor: '#DE322D',
  imageSrc: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&q=80',
  imageAlt: 'VC Stage - Venture Capital sessions at EmpowaEntrepreneurs Funding Summit 2026'
}, {
  id: 'stage-esd',
  number: '02',
  name: 'ESD Stage',
  theme: 'Enterprise & Supplier Development',
  focus: "Bridging the gap between corporates and township enterprises. Facilitating supplier development mandates, mentorship pipelines, and procurement opportunities that drive Africa's informal economy forward.",
  accentColor: '#3c6d9a',
  imageSrc: 'https://images.unsplash.com/photo-1560439514-4e9645039924?w=800&q=80',
  imageAlt: 'ESD Stage - Enterprise Supplier Development sessions'
}, {
  id: 'stage-pe',
  number: '03',
  name: 'Private Equity Stage',
  theme: 'Private Equity & Buyouts',
  focus: 'A dedicated arena for PE firms, family offices, and growth-equity investors to source, diligence, and deploy capital into Africa\'s most promising mid-market businesses.',
  accentColor: '#5a4a8a',
  imageSrc: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80',
  imageAlt: 'Private Equity Stage at EmpowaWorx House'
}, {
  id: 'stage-dfi',
  number: '04',
  name: 'DFI Stage',
  theme: 'Development Finance Institutions',
  focus: 'Development Finance Institutions unlock co-investment mandates, blended finance structures, and concessional funding pipelines for enterprises delivering measurable development impact.',
  accentColor: '#2D6A4F',
  imageSrc: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80',
  imageAlt: 'DFI Stage - Development Finance sessions'
}, {
  id: 'stage-loan',
  number: '05',
  name: 'Loan Financing Stage',
  theme: 'Structured Debt & Loan Finance',
  focus: 'For businesses beyond the equity curve - connecting revenue-generating SMEs with structured lenders, mezzanine financiers, and alternative credit providers offering bespoke debt solutions.',
  accentColor: '#8a5a2a',
  imageSrc: 'https://images.unsplash.com/photo-1543269664-56d93c1b41a6?w=800&q=80',
  imageAlt: 'Loan Financing Stage at EmpowaEntrepreneurs Funding Summit 2026'
}, {
  id: 'stage-impact',
  number: '06',
  name: 'Impact Funds Stage',
  theme: 'Impact Investing & Blended Finance',
  focus: 'Where purpose meets profit. Impact fund managers and ESG-driven investors source enterprises delivering environmental and social returns alongside financial performance.',
  accentColor: '#4a7a5a',
  imageSrc: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&q=80',
  imageAlt: 'Impact Funds Stage - sustainable investing sessions'
}];
const StagesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, {
    once: true,
    margin: '-60px 0px'
  });
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const isMobile = useIsMobile();
  return <section id="stages" ref={sectionRef} style={{
    background: '#0f1c28',
    paddingTop: isMobile ? '96px' : '144px',
    paddingBottom: isMobile ? '80px' : '120px',
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
      width: 'clamp(400px, 55vw, 760px)',
      height: 'clamp(400px, 55vw, 760px)',
      borderRadius: '50%',
      background: 'radial-gradient(circle at 40% 40%, rgba(222,50,45,0.07) 0%, transparent 70%)',
      pointerEvents: 'none',
      zIndex: 0
    }} />
      {/* Heading - stays constrained */}
      <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: isMobile ? '0 24px' : '0 64px',
      position: 'relative',
      zIndex: 1,
      marginBottom: '64px'
    }}>
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
        }}>Programme Stages</span>
        </motion.div>
        <div style={{
        overflow: 'hidden'
      }}>
          <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.1} style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: isMobile ? 'clamp(28px, 8vw, 42px)' : 'clamp(32px, 4vw, 58px)',
          fontWeight: 300,
          letterSpacing: '-1.8px',
          lineHeight: 1.04,
          color: '#F7F6F3',
          margin: 0,
          maxWidth: '680px'
        }}>
            <span>{'Six stages. '}</span>
            <em style={{
            fontStyle: 'italic',
            color: '#DE322D'
          }}>Six capital</em>
            <span style={{
            color: 'rgba(247,246,243,0.2)'
          }}>{' mandates.'}</span>
          </motion.h2>
        </div>
      </div>
      {/* Cards grid - full viewport width, no max-width */}
      <div style={{
      width: '100%',
      padding: isMobile ? '0 24px' : '0 32px',
      boxSizing: 'border-box',
      position: 'relative',
      zIndex: 1
    }}>
        <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(6, 1fr)',
        gap: '10px'
      }}>
          {STAGES.map((stage, i) => <motion.div key={stage.id} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={clipReveal} custom={i * 0.1} onMouseEnter={() => setHoveredId(stage.id)} onMouseLeave={() => setHoveredId(null)} style={{
          borderRadius: '20px',
          overflow: 'hidden',
          position: 'relative',
          minHeight: isMobile ? '280px' : '560px'
        }}>
              <img src={stage.imageSrc} alt={stage.imageAlt} style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            filter: hoveredId === stage.id ? 'brightness(0.6) saturate(0.8)' : 'brightness(0.72) saturate(0.8)',
            transform: hoveredId === stage.id ? 'scale(1.04)' : 'scale(1)',
            transition: 'filter 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.8s cubic-bezier(0.22,1,0.36,1)'
          }} />
              <div style={{
            position: 'absolute',
            inset: 0,
            background: hoveredId === stage.id ? 'linear-gradient(to top, rgba(10,9,8,0.94) 0%, rgba(10,9,8,0.38) 55%, rgba(10,9,8,0.12) 100%)' : 'linear-gradient(to top, rgba(10,9,8,0.65) 0%, rgba(10,9,8,0.18) 60%, rgba(10,9,8,0.04) 100%)',
            transition: 'background 0.6s ease',
            pointerEvents: 'none'
          }} />
              {hoveredId === stage.id && <div aria-hidden="true" style={{
            position: 'absolute',
            bottom: '-20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${stage.accentColor}33 0%, transparent 70%)`,
            pointerEvents: 'none'
          }} />}
              <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: isMobile ? '24px 20px' : '32px 28px'
          }}>
                <div style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '10px',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: hoveredId === stage.id ? `${stage.accentColor}` : 'rgba(247,246,243,0.55)',
              fontWeight: 600,
              marginBottom: '12px',
              transition: 'color 0.4s ease'
            }}>{stage.number}</div>
                <h3 style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: isMobile ? 'clamp(18px, 5vw, 24px)' : 'clamp(16px, 1.4vw, 22px)',
              fontWeight: hoveredId === stage.id ? 400 : 300,
              letterSpacing: '-0.5px',
              color: '#F7F6F3',
              margin: '0 0 0',
              lineHeight: 1.15,
              transition: 'font-weight 0.3s ease'
            }}>{stage.name}</h3>
                <AnimatePresence initial={false}>
                  {hoveredId === stage.id && <motion.div key={`s-${stage.id}`} initial={{
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
                overflow: 'hidden'
              }}>
                      <div style={{
                  width: '32px',
                  height: '1px',
                  background: stage.accentColor,
                  marginTop: '16px',
                  marginBottom: '12px',
                  borderRadius: '1px'
                }} />
                      <p style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  color: stage.accentColor,
                  margin: '0 0 8px'
                }}>{stage.theme}</p>
                      <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '12px',
                  lineHeight: '1.7',
                  color: 'rgba(247,246,243,0.55)',
                  margin: 0,
                  fontWeight: 300
                }}>{stage.focus}</p>
                    </motion.div>}
                </AnimatePresence>
                <div style={{
              height: '2px',
              background: `linear-gradient(90deg, ${stage.accentColor}, transparent)`,
              marginTop: '24px',
              opacity: hoveredId === stage.id ? 1 : 0,
              transition: 'opacity 0.4s ease',
              borderRadius: '2px'
            }} />
              </div>
            </motion.div>)}
        </div>
      </div>
    </section>;
};

// ─── Signature Experiences ────────────────────────────────────────────────────
type Experience = {
  id: string;
  label: string;
  title: string;
  subtitle: string;
  description: string;
  detail: string;
  imageSrc: string;
  imageAlt: string;
  tag1: string;
  tag2: string;
  tag3: string;
  reverse: boolean;
};
const EXPERIENCES: Experience[] = [{
  id: 'exp-women',
  label: 'Signature Experience · 01',
  title: "The Women's Fund Room",
  subtitle: 'Where Women-Led Capital Meets Ambition',
  description: "A dedicated, curated space where women-led ventures and female founders access specialized funding pipelines, gender-lens investment mandates, and mentorship from Africa's most powerful women in capital.",
  detail: "The Women's Fund Room is not a sidebar - it is a command center. With dedicated DFI mandates, gender-lens VC panelists, and structured pitch sessions specifically designed for women founders, it represents EmpowaEntrepreneurs' most intentional investment in parity capital.",
  imageSrc: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=1200&q=80',
  imageAlt: "The Women's Fund Room - women founders and investors at EmpowaEntrepreneurs Funding Summit 2026",
  tag1: 'Gender-Lens Investing',
  tag2: 'Women Founders',
  tag3: 'DFI Mandates',
  reverse: false
}, {
  id: 'exp-dragons',
  label: "Signature Experience · 02",
  title: "Dragons' Den Pitching Festival",
  subtitle: 'High-Stakes. High-Impact. Real Capital.',
  description: "Africa's most electrifying pitch format - vetted founders step into the arena and present before a panel of seasoned investors ready to deploy real capital. No theatrics. No formality. Just honest conviction meeting serious money.",
  detail: "Inspired by the global format but forged for Africa - the Dragons' Den Pitching Festival features six rounds of structured pitches across all capital tracks. Founders who enter leave with either a term sheet, a warm introduction, or the most valuable feedback of their entrepreneurial journey.",
  imageSrc: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80',
  imageAlt: "Dragons' Den Pitching Festival at EmpowaWorx House",
  tag1: "Live Pitching",
  tag2: 'Investor Panel',
  tag3: 'Term Sheets',
  reverse: true
}, {
  id: 'exp-master',
  label: 'Signature Experience · 03',
  title: 'Executive Masterclasses',
  subtitle: 'Knowledge That Moves Capital',
  description: 'Intimate, high-density sessions led by Africa\'s foremost capital allocators, legal architects, and business scaling veterans. No generic panels - every masterclass delivers frameworks you can action within 72 hours of leaving the room.',
  detail: 'From term sheet negotiation masterclasses to scaling-across-borders operational playbooks, from ESG compliance frameworks to blended finance structuring - these sessions are the intellectual capital behind the financial capital.',
  imageSrc: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1200&q=80',
  imageAlt: 'Executive Masterclasses at EmpowaEntrepreneurs Summit',
  tag1: 'Capital Structuring',
  tag2: 'Scaling Playbooks',
  tag3: 'Term Sheet Mastery',
  reverse: false
}];
const SignatureExperiencesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, {
    once: true,
    margin: '-60px 0px'
  });
  const isMobile = useIsMobile();
  return <section ref={sectionRef} style={{
    background: '#F7F6F3',
    paddingTop: isMobile ? '96px' : '144px',
    paddingBottom: isMobile ? '80px' : '120px',
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
      padding: isMobile ? '0 24px' : '0 64px',
      position: 'relative',
      zIndex: 1
    }}>
        <div style={{
        marginBottom: isMobile ? '60px' : '96px'
      }}>
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
          }}>Signature Experiences</span>
          </motion.div>
          <div style={{
          overflow: 'hidden'
        }}>
            <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.1} style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: isMobile ? 'clamp(28px, 8vw, 42px)' : 'clamp(32px, 4vw, 58px)',
            fontWeight: 300,
            letterSpacing: '-1.8px',
            lineHeight: 1.04,
            color: '#141210',
            margin: 0,
            maxWidth: '680px'
          }}>
              <span>{'Moments that '}</span>
              <em style={{
              fontStyle: 'italic',
              color: '#DE322D'
            }}>define</em>
              <span style={{
              color: 'rgba(20,18,16,0.2)'
            }}>{' EmpowaEntrepreneurs Funding Summit 2026.'}</span>
            </motion.h2>
          </div>
        </div>
        <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? '80px' : '120px'
      }}>
          {EXPERIENCES.map((exp, idx) => <ExperienceBlock key={exp.id} exp={exp} idx={idx} isMobile={isMobile} inView={inView} />)}
        </div>
      </div>
    </section>;
};
const ExperienceBlock = ({
  exp,
  idx,
  isMobile,
  inView
}: {
  exp: Experience;
  idx: number;
  isMobile: boolean;
  inView: boolean;
}) => {
  const blockRef = useRef<HTMLDivElement>(null);
  const blockInView = useInView(blockRef, {
    once: true,
    margin: '-80px 0px'
  });
  return <div ref={blockRef} style={{
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
    gap: isMobile ? '40px' : '72px',
    alignItems: 'center',
    direction: !isMobile && exp.reverse ? 'rtl' : 'ltr'
  }}>
      <motion.div initial="hidden" animate={blockInView ? 'visible' : 'hidden'} variants={clipReveal} custom={0} style={{
      direction: 'ltr'
    }}>
        <div style={{
        borderRadius: '28px',
        overflow: 'hidden',
        position: 'relative',
        height: isMobile ? '280px' : '520px'
      }}>
          <img src={exp.imageSrc} alt={exp.imageAlt} style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          filter: 'brightness(0.82) saturate(0.85)'
        }} />
          <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(20,18,16,0.6) 0%, rgba(20,18,16,0.1) 55%, transparent 100%)',
          pointerEvents: 'none'
        }} />
          <div style={{
          position: 'absolute',
          bottom: '24px',
          left: '24px',
          right: '24px'
        }}>
            <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(20,18,16,0.6)',
            backdropFilter: 'blur(8px)',
            borderRadius: '100px',
            padding: '6px 14px'
          }}>
              <span style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '10px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(247,246,243,0.7)',
              fontWeight: 500
            }}>{exp.label}</span>
            </div>
          </div>
        </div>
      </motion.div>
      <motion.div initial="hidden" animate={blockInView ? 'visible' : 'hidden'} variants={exp.reverse ? slideFromLeft : slideFromRight} custom={0.18} style={{
      direction: 'ltr'
    }}>
        <div style={{
        marginBottom: '24px'
      }}>
          <div style={{
          display: 'inline-block',
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '10px',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: '#DE322D',
          fontWeight: 600,
          marginBottom: '16px'
        }}>{exp.label}</div>
          <h3 style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: isMobile ? 'clamp(24px, 7vw, 36px)' : 'clamp(26px, 3vw, 46px)',
          fontWeight: 300,
          letterSpacing: '-1.2px',
          color: '#141210',
          margin: '0 0 8px',
          lineHeight: 1.1
        }}>{exp.title}</h3>
          <p style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '13px',
          fontWeight: 600,
          color: 'rgba(20,18,16,0.45)',
          margin: 0,
          textTransform: 'uppercase' as const,
          letterSpacing: '0.08em'
        }}>{exp.subtitle}</p>
        </div>
        <div style={{
        width: '40px',
        height: '1px',
        background: '#DE322D',
        marginBottom: '24px',
        borderRadius: '1px'
      }} />
        <p style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: isMobile ? '15px' : '17px',
        lineHeight: '1.78',
        color: 'rgba(20,18,16,0.65)',
        margin: '0 0 20px',
        fontWeight: 300
      }}>{exp.description}</p>
        <p style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: isMobile ? '13px' : '14px',
        lineHeight: '1.75',
        color: 'rgba(20,18,16,0.4)',
        margin: '0 0 32px',
        fontWeight: 300
      }}>{exp.detail}</p>
        <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        marginBottom: '32px'
      }}>
          {[exp.tag1, exp.tag2, exp.tag3].map(tag => <span key={tag} style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '10px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'rgba(20,18,16,0.45)',
          border: '1px solid rgba(20,18,16,0.12)',
          borderRadius: '100px',
          padding: '6px 14px'
        }}>{tag}</span>)}
        </div>
        {idx === 1 && (
        <motion.a href="/summit"  whileHover={{
        scale: 1.04
      }} whileTap={{
        scale: 0.97
      }} style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        background: 'linear-gradient(135deg, #DE322D, #c42823)',
        borderRadius: '44px',
        padding: '14px 28px',
        fontSize: '12px',
        letterSpacing: '0.06em',
        color: '#fff',
        textDecoration: 'none',
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: 600,
        boxShadow: '0 6px 24px rgba(222,50,45,0.35)'
      }}>
          <span>Reserve Your Seat</span><ArrowIconDark />
        </motion.a>
        )}
      </motion.div>
    </div>;
};

// ─── Summit Journey Zones ──────────────────────────────────────────────────────
type Zone = {
  id: string;
  number: string;
  name: string;
  description: string;
  services: string[];
  accent: string;
  icon: string;
};
const ZONES: Zone[] = [{
  id: 'zone-legal',
  number: '01',
  name: 'Legal & Financial Advisory Zone',
  description: 'Dedicated legal and financial advisory booths staffed by leading law firms, auditors, and financial structuring specialists. Get your deal structures, shareholder agreements, and compliance frameworks right - on the spot.',
  services: ['Term Sheet Review', 'Share Structuring', 'Compliance Frameworks', 'Financial Modeling'],
  accent: '#DE322D',
  icon: '⚖'
}, {
  id: 'zone-funding',
  number: '02',
  name: 'Funding Clinics',
  description: 'One-on-one sessions between vetted founders and capital allocators. Structured 20-minute clinics designed for laser-focused deal conversations - not presentations, not panels. Pure deal dialogue.',
  services: ['1-on-1 Investor Meetings', 'Pitch Coaching', 'Capital Matching', 'Due Diligence Prep'],
  accent: '#3c6d9a',
  icon: '💼'
}, {
  id: 'zone-network',
  number: '03',
  name: 'Strategic Networking Lounge',
  description: "Africa's most curated networking environment. Every conversation is intentional. Seating arranged for optimal deal-flow. Introductions facilitated by our Capital Connectors - specialists in matching the right founder with the right funder.",
  services: ['Capital Connectors', 'Curated Introductions', 'Deal-Flow Facilitation', 'Partnership Matching'],
  accent: '#5a4a8a',
  icon: '🤝'
}, {
  id: 'zone-showcase',
  number: '04',
  name: 'Innovation Showcase Pavilion',
  description: 'A physical exhibition space for growth-stage businesses to display their solutions, technologies, and products to investors, corporate buyers, and procurement decision-makers moving through EmpowaEntrepreneurs Funding Summit 2026.',
  services: ['Product Demos', 'Investor Walkthroughs', 'Corporate Buyer Access', 'Media Coverage'],
  accent: '#2D6A4F',
  icon: '🏛'
}];
const ZonesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, {
    once: true,
    margin: '-60px 0px'
  });
  const [activeZone, setActiveZone] = useState<string>('zone-legal');
  const isMobile = useIsMobile();
  const activeZoneData = ZONES.find(z => z.id === activeZone) || ZONES[0];
  return <section ref={sectionRef} style={{
    background: '#141210',
    paddingTop: isMobile ? '96px' : '144px',
    paddingBottom: isMobile ? '80px' : '144px',
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
      top: '20%',
      left: '-8%',
      width: 'clamp(400px, 50vw, 700px)',
      height: 'clamp(400px, 50vw, 700px)',
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
        <div style={{
        marginBottom: isMobile ? '56px' : '80px'
      }}>
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
          }}>Summit Journey Zones</span>
          </motion.div>
          <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: '40px',
          alignItems: 'end'
        }}>
            <div style={{
            overflow: 'hidden'
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
                <span>{'Your strategic '}</span>
                <em style={{
                fontStyle: 'italic',
                color: '#DE322D'
              }}>engine</em>
                <span style={{
                color: 'rgba(247,246,243,0.18)'
              }}>{' on the ground.'}</span>
              </motion.h2>
            </div>
            {!isMobile && <motion.p initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideFromRight} custom={0.3} style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '15px',
            color: 'rgba(247,246,243,0.35)',
            lineHeight: '1.75',
            margin: 0
          }}>
                Four purpose-built zones engineered to move you from conversation to commitment - every zone is a strategic instrument in your summit journey.
              </motion.p>}
          </div>
        </div>
        <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '280px 1fr',
        gap: '20px',
        alignItems: 'stretch'
      }}>
          {/* Zone selector */}
          <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'row' : 'column',
          gap: '10px',
          flexWrap: isMobile ? 'wrap' : 'nowrap'
        }}>
            {ZONES.map((zone, i) => <motion.button key={zone.id} onClick={() => setActiveZone(zone.id)} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideFromLeft} custom={i * 0.1}  style={{
            all: 'unset',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? '10px' : '14px',
            background: activeZone === zone.id ? 'rgba(222,50,45,0.12)' : 'rgba(247,246,243,0.04)',
            border: `1px solid ${activeZone === zone.id ? 'rgba(222,50,45,0.4)' : 'rgba(247,246,243,0.07)'}`,
            borderRadius: '16px',
            padding: isMobile ? '12px 16px' : '18px 20px',
            transition: 'background 0.35s ease, border-color 0.35s ease',
            flex: isMobile ? '1 0 calc(50% - 5px)' : 'none'
          }}>
                <div style={{
              width: isMobile ? '28px' : '36px',
              height: isMobile ? '28px' : '36px',
              borderRadius: '10px',
              flexShrink: 0,
              background: activeZone === zone.id ? zone.accent : 'rgba(247,246,243,0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: isMobile ? '14px' : '18px',
              transition: 'background 0.35s ease'
            }}>
                  <span>{zone.icon}</span>
                </div>
                <div style={{
              textAlign: 'left'
            }}>
                  <div style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '10px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: activeZone === zone.id ? zone.accent : 'rgba(247,246,243,0.25)',
                fontWeight: 600,
                marginBottom: '3px',
                transition: 'color 0.35s ease'
              }}>Zone {zone.number}</div>
                  <div style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: isMobile ? '11px' : '13px',
                fontWeight: 500,
                letterSpacing: '-0.2px',
                color: activeZone === zone.id ? '#F7F6F3' : 'rgba(247,246,243,0.35)',
                lineHeight: 1.3,
                transition: 'color 0.35s ease'
              }}>{zone.name.split(' ').slice(0, 3).join(' ')}</div>
                </div>
              </motion.button>)}
          </div>
          {/* Zone detail */}
          <AnimatePresence mode="wait">
            <motion.div key={activeZone} initial={{
            opacity: 0,
            y: 24,
            filter: 'blur(8px)'
          }} animate={{
            opacity: 1,
            y: 0,
            filter: 'blur(0px)'
          }} exit={{
            opacity: 0,
            y: -12,
            filter: 'blur(4px)'
          }} transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1]
          }} style={{
            background: 'linear-gradient(160deg, #1a2a3a 0%, #0f1c28 100%)',
            borderRadius: '28px',
            border: '1px solid rgba(247,246,243,0.08)',
            padding: isMobile ? '32px 24px' : '52px',
            position: 'relative',
            overflow: 'hidden'
          }}>
              <div aria-hidden="true" style={{
              position: 'absolute',
              top: '-30%',
              right: '-15%',
              width: '360px',
              height: '360px',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${activeZoneData.accent}22 0%, transparent 65%)`,
              pointerEvents: 'none'
            }} />
              <motion.div aria-hidden="true" animate={{
              x: ['-100%', '220%']
            }} transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: 'linear',
              repeatDelay: 3
            }} style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '50%',
              height: '1px',
              background: `linear-gradient(90deg, transparent, ${activeZoneData.accent}80, transparent)`,
              pointerEvents: 'none',
              zIndex: 2
            }} />
              <div style={{
              position: 'relative',
              zIndex: 1
            }}>
                <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '28px'
              }}>
                  <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: `${activeZoneData.accent}22`,
                  border: `1px solid ${activeZoneData.accent}55`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px'
                }}>
                    <span>{activeZoneData.icon}</span>
                  </div>
                  <div>
                    <div style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '10px',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: activeZoneData.accent,
                    fontWeight: 600,
                    marginBottom: '4px'
                  }}>Zone {activeZoneData.number}</div>
                    <h3 style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: isMobile ? 'clamp(16px, 4vw, 20px)' : 'clamp(18px, 1.8vw, 26px)',
                    fontWeight: 400,
                    letterSpacing: '-0.5px',
                    color: '#F7F6F3',
                    margin: 0,
                    lineHeight: 1.2
                  }}>{activeZoneData.name}</h3>
                  </div>
                </div>
                <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: isMobile ? '14px' : '16px',
                lineHeight: '1.82',
                color: 'rgba(247,246,243,0.6)',
                margin: '0 0 36px',
                fontWeight: 300
              }}>{activeZoneData.description}</p>
                <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(2, 1fr)',
                gap: '10px',
                marginBottom: '36px'
              }}>
                  {activeZoneData.services.map(service => <div key={service} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'rgba(247,246,243,0.04)',
                  border: '1px solid rgba(247,246,243,0.07)',
                  borderRadius: '12px',
                  padding: '14px 16px'
                }}>
                      <div style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: activeZoneData.accent,
                    flexShrink: 0
                  }} />
                      <span style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                    color: 'rgba(247,246,243,0.55)',
                    fontWeight: 400
                  }}>{service}</span>
                    </div>)}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>;
};

// ─── Programme CTA Section ─────────────────────────────────────────────────────
const ProgrammeCtaSection = () => {
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
  const isMobile = useIsMobile();
  const magnetic = useMagnetic(0.28);
  return <section ref={sectionRef} onMouseMove={handleMouseMove} style={{
    background: '#0f1c28',
    width: '100%',
    boxSizing: 'border-box',
    overflow: 'hidden',
    paddingTop: isMobile ? '112px' : '168px',
    paddingBottom: isMobile ? '112px' : '168px',
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
      background: 'radial-gradient(circle, rgba(222,50,45,0.12) 0%, transparent 65%)',
      pointerEvents: 'none',
      zIndex: 0
    }} />
      <div aria-hidden="true" style={{
      position: 'absolute',
      bottom: '-4%',
      left: '-2%',
      fontFamily: 'Montserrat, sans-serif',
      fontSize: 'clamp(60px, 12vw, 240px)',
      fontWeight: 800,
      letterSpacing: '-8px',
      lineHeight: 1,
      color: 'rgba(247,246,243,0.015)',
      pointerEvents: 'none',
      userSelect: 'none',
      whiteSpace: 'nowrap',
      zIndex: 0
    }}>PROGRAMME</div>
      <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: isMobile ? '0 24px' : '0 64px',
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
        }}>Secure Your Place</span>
        </motion.div>
        <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? '40px' : '80px',
        alignItems: 'center',
        marginBottom: '72px'
      }}>
          <div>
            <div style={{
            overflow: 'hidden'
          }}>
              <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.1} style={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 200,
              fontSize: isMobile ? 'clamp(44px, 12vw, 72px)' : 'clamp(48px, 7vw, 108px)',
              lineHeight: 0.91,
              letterSpacing: isMobile ? '-2px' : '-4px',
              color: '#F7F6F3',
              margin: '0 0 0'
            }}>
                <span>{"Join Africa's"}</span><br />
                <em style={{
                fontStyle: 'italic',
                color: '#DE322D'
              }}>Capital Summit</em><br />
                <span style={{
                color: 'rgba(247,246,243,0.16)'
              }}>{"2026."}</span>
              </motion.h2>
            </div>
          </div>
          <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideFromRight} custom={0.3}>
            <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: isMobile ? '15px' : '17px',
            lineHeight: '1.78',
            color: 'rgba(247,246,243,0.55)',
            margin: '0 0 36px',
            fontWeight: 300
          }}>
              Six funded stages. Three signature experiences. Four strategic zones. One summit that defines the trajectory of African enterprise for the decade ahead.
            </p>
            <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '40px'
          }}>
              {[{
              id: 'pd-1',
              label: 'Summit Date',
              value: 'May 28, 2026'
            }, {
              id: 'pd-2',
              label: 'Venue',
              value: 'EmpowaWorx House'
            }, {
              id: 'pd-3',
              label: 'Stages',
              value: '6 Capital Stages'
            }, {
              id: 'pd-4',
              label: 'Status',
              value: 'Registration Open'
            }].map(detail => <div key={detail.id} style={{
              background: 'rgba(247,246,243,0.04)',
              border: '1px solid rgba(247,246,243,0.08)',
              borderRadius: '14px',
              padding: '16px 18px'
            }}>
                  <div style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '9px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'rgba(247,246,243,0.25)',
                fontWeight: 500,
                marginBottom: '6px'
              }}>{detail.label}</div>
                  <div style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '14px',
                fontWeight: 500,
                color: '#F7F6F3',
                letterSpacing: '-0.2px'
              }}>{detail.value}</div>
                </div>)}
            </div>
            <div style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
              <motion.a href="/summit" whileHover={{
              scale: 1.04
            }} whileTap={{
              scale: 0.97
            }} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #DE322D 0%, #c42823 100%)',
              borderRadius: '44px',
              padding: isMobile ? '14px 24px' : '16px 30px',
              fontSize: '13px',
              letterSpacing: '0.05em',
              color: '#fff',
              textDecoration: 'none',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 600,
              boxShadow: '0 10px 40px rgba(222,50,45,0.55)',
              width: isMobile ? '100%' : 'auto',
              justifyContent: isMobile ? 'center' : 'flex-start'
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
              gap: '8px',
              backgroundColor: 'transparent',
              borderRadius: '44px',
              padding: isMobile ? '14px 24px' : '16px 30px',
              fontSize: '13px',
              letterSpacing: '0.04em',
              color: 'rgba(247,246,243,0.75)',
              textDecoration: 'none',
              fontFamily: 'Montserrat, sans-serif',
              border: '1px solid rgba(247,246,243,0.18)',
              transition: 'border-color 0.3s ease, color 0.3s ease',
              width: isMobile ? '100%' : 'auto',
              justifyContent: isMobile ? 'center' : 'flex-start'
            }} onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.borderColor = 'rgba(247,246,243,0.45)';
              el.style.color = '#F7F6F3';
            }} onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.borderColor = 'rgba(247,246,243,0.18)';
              el.style.color = 'rgba(247,246,243,0.75)';
            }}>
                <span>Partner With Us</span>
              </motion.a>
            </div>
          </motion.div>
        </div>
        {/* Bottom stats strip */}
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={lineWipe} custom={0.55} style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
        gap: '1px',
        paddingTop: '40px',
        borderTop: '0.8px solid rgba(247,246,243,0.07)',
        transformOrigin: 'left'
      }}>
          {[{
          id: 'ps-1',
          label: 'Funding Stages',
          value: '6',
          sub: 'VC · ESD · PE · DFI · Loan · Impact'
        }, {
          id: 'ps-2',
          label: 'Signature Experiences',
          value: '3+',
          sub: "Women's Room · Dragons' Den · Masterclasses"
        }, {
          id: 'ps-3',
          label: 'Journey Zones',
          value: '4',
          sub: 'Legal · Clinics · Network · Showcase'
        }, {
          id: 'ps-4',
          label: 'Attendees',
          value: '4,000+',
          sub: 'Founders · Funders · DFIs · Builders'
        }].map((item, i) => <div key={item.id} style={{
          padding: isMobile ? '24px 0' : '28px 0',
          paddingRight: !isMobile && i < 3 ? '32px' : '0',
          paddingLeft: !isMobile && i > 0 ? '32px' : '0',
          borderLeft: !isMobile && i > 0 ? '0.8px solid rgba(247,246,243,0.07)' : 'none',
          borderTop: isMobile && i > 1 ? '0.8px solid rgba(247,246,243,0.07)' : 'none'
        }}>
              <div style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: isMobile ? '28px' : 'clamp(32px, 3.5vw, 48px)',
            fontWeight: 200,
            letterSpacing: '-2px',
            color: '#F7F6F3',
            lineHeight: 1,
            marginBottom: '6px'
          }}>{item.value}</div>
              <div style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '11px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'rgba(247,246,243,0.35)',
            fontWeight: 500,
            marginBottom: '4px'
          }}>{item.label}</div>
              <div style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '10px',
            color: 'rgba(247,246,243,0.18)',
            letterSpacing: '0.02em'
          }}>{item.sub}</div>
            </div>)}
        </motion.div>
      </div>
    </section>;
};

// ─── Programme Footer ──────────────────────────────────────────────────────────
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
const SocialIcon = ({
  brand
}: {
  brand: string;
}) => {
  if (brand === 'x') return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" fill="rgba(247,246,243,0.55)" /></svg>;
  if (brand === 'linkedin') return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" fill="rgba(247,246,243,0.55)" /></svg>;
  if (brand === 'youtube') return <svg width="15" height="11" viewBox="0 0 24 17" fill="none" aria-hidden="true"><path d="M23.498 2.683A3.009 3.009 0 0 0 21.38.549C19.505 0 12 0 12 0S4.495 0 2.62.549A3.009 3.009 0 0 0 .502 2.683C0 4.566 0 8.5 0 8.5s0 3.934.502 5.817a3.009 3.009 0 0 0 2.118 2.134C4.495 17 12 17 12 17s7.505 0 9.38-.549a3.009 3.009 0 0 0 2.118-2.134C24 12.434 24 8.5 24 8.5s0-3.934-.502-5.817ZM9.545 12.068V4.932L15.818 8.5l-6.273 3.568Z" fill="rgba(247,246,243,0.55)" /></svg>;
  if (brand === 'instagram') return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069ZM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.98-6.98C23.986 15.668 24 15.259 24 12c0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z" fill="rgba(247,246,243,0.55)" /></svg>;
  return null;
};
const ProgrammeFooter = () => {
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
      {/* Banner hero area */}
      <div style={{
      position: 'relative',
      width: '100%',
      minHeight: isMobile ? '480px' : '580px',
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
        <motion.div aria-hidden="true" animate={{
        x: ['-120%', '220%']
      }} transition={{
        duration: 6,
        repeat: Infinity,
        ease: 'linear',
        repeatDelay: 4
      }} style={{
        position: 'absolute',
        top: '0',
        left: '0',
        width: '40%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(222,50,45,0.5), transparent)',
        pointerEvents: 'none',
        zIndex: 2
      }} />
        <div style={{
        position: 'relative',
        zIndex: 2,
        width: '100%',
        padding: isMobile ? '0 24px 52px' : '0 80px 72px',
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
          }}>Africa's Premier Funding Platform · 2026</span>
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
              fontSize: isMobile ? 'clamp(44px, 12vw, 72px)' : 'clamp(60px, 7vw, 104px)',
              fontWeight: 700,
              letterSpacing: isMobile ? '-2px' : '-3.5px',
              lineHeight: 0.9,
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
            <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideFromRight} custom={0.22} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            minWidth: isMobile ? '100%' : '260px'
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
              padding: '18px 36px',
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
          {/* Stats strip */}
          <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={lineWipe} custom={0.4} style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          borderTop: '1px solid rgba(247,246,243,0.1)',
          marginTop: isMobile ? '44px' : '60px',
          transformOrigin: 'left'
        }}>
            {[{
            id: 'fb-1',
            num: '4,000+',
            label: 'Attendees'
          }, {
            id: 'fb-2',
            num: '120+',
            label: 'Investors'
          }, {
            id: 'fb-3',
            num: '30+',
            label: 'African Markets'
          }, {
            id: 'fb-4',
            num: 'May 28',
            label: '2026 Summit Date'
          }].map((s, i) => <div key={s.id} style={{
            padding: isMobile ? '20px 0 0' : '28px 0 0',
            paddingRight: !isMobile && i < 3 ? '40px' : '0',
            paddingLeft: !isMobile && i > 0 ? '40px' : '0',
            borderRight: !isMobile && i < 3 ? '1px solid rgba(247,246,243,0.08)' : 'none',
            borderTop: isMobile && i > 1 ? '1px solid rgba(247,246,243,0.08)' : 'none'
          }}>
                <div style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: isMobile ? '22px' : 'clamp(28px, 3vw, 40px)',
              fontWeight: 700,
              letterSpacing: '-1px',
              color: '#F7F6F3',
              lineHeight: 1,
              marginBottom: '6px'
            }}>{s.num}</div>
                <div style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(247,246,243,0.28)',
              fontWeight: 400
            }}>{s.label}</div>
              </div>)}
          </motion.div>
        </div>
      </div>

      {/* Divider */}
      <div style={{
      height: '1px',
      background: 'rgba(247,246,243,0.06)',
      margin: '0'
    }} />

      {/* Main footer body */}
      <div style={{
      maxWidth: '1440px',
      margin: '0 auto',
      padding: isMobile ? '52px 24px 0' : '72px 80px 0',
      boxSizing: 'border-box'
    }}>
        {/* Top row: brand + nav cols */}
        <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '40px',
        paddingBottom: '52px',
        borderBottom: '1px solid rgba(247,246,243,0.07)'
      }}>
          {/* Brand column */}
          <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          maxWidth: isMobile ? '100%' : '320px'
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
            <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(34,197,94,0.07)',
            border: '1px solid rgba(34,197,94,0.18)',
            borderRadius: '4px',
            padding: '7px 14px',
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
              fontSize: '10px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(247,246,243,0.4)',
              fontWeight: 600
            }}>Registration Open</span>
            </div>
          </div>
          {/* Nav columns */}
          <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '36px' : '0',
          flex: isMobile ? 'none' : '1',
          maxWidth: isMobile ? '100%' : '680px',
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
        </div>

        {/* Newsletter row */}
        <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'flex-start' : 'center',
        justifyContent: 'space-between',
        gap: '24px',
        padding: '36px 0',
        borderBottom: '1px solid rgba(247,246,243,0.07)'
      }}>
          <div>
            <div style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '13px',
            fontWeight: 700,
            color: 'rgba(247,246,243,0.65)',
            letterSpacing: '-0.1px',
            marginBottom: '4px'
          }}>Stay in the loop.</div>
            <div style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '12px',
            color: 'rgba(247,246,243,0.22)',
            letterSpacing: '0.02em'
          }}>Summit updates, speaker reveals, and registration news.</div>
          </div>
          <NewsletterForm variant="square" isMobile={isMobile} />
        </div>

        {/* Bottom bar */}
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
        }}>© 2026 EmpowaEntrepreneurs. All rights reserved.</span>
          <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? '12px' : '20px',
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

// ─── ProgrammePage ─────────────────────────────────────────────────────────────
export const ProgrammePage = () => {
  return <div className="w-full min-h-screen" style={{
    background: '#141210',
    overflowX: 'hidden'
  }}>
      
      <ProgrammeHero />
      <StagesSection />
      <SignatureExperiencesSection />
      <ZonesSection />
      <ProgrammeCtaSection />
      
    </div>;
};