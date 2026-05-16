import { LogoBanner } from './AgencyComponents';
import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, useAnimationFrame, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { StrategicEnquiryModal } from './StrategicEnquiryModal';
import { NewsletterForm } from './NewsletterForm';

// ─── Constants ────────────────────────────────────────────────────────────────
const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`;
const HERO_BG = 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1800&q=80';
const CONTACT_IMG = 'https://images.unsplash.com/photo-1560439513-74b037a25d84?w=900&q=80';

// ─── Responsive hooks ──────────────────────────────────────────────────────────
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
const useIsTablet = () => {
  const [isTablet, setIsTablet] = useState(false);
  useEffect(() => {
    const check = () => setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1100);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isTablet;
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

// ─── SVG Helpers ──────────────────────────────────────────────────────────────
const PlusSquareIconLight = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M16.25 2.5H3.75C3.41848 2.5 3.10054 2.6317 2.86612 2.86612C2.6317 3.10054 2.5 3.41848 2.5 3.75V16.25C2.5 16.5815 2.6317 16.8995 2.86612 17.1339C3.10054 17.3683 3.41848 17.5 3.75 17.5H16.25C16.5815 17.5 16.8995 17.3683 17.1339 17.1339C17.3683 16.8995 17.5 16.5815 17.5 16.25V3.75C17.5 3.41848 17.3683 3.10054 17.1339 2.86612C16.8995 2.6317 16.5815 2.5 16.25 2.5ZM13.125 10.625H10.625V13.125C10.625 13.2908 10.5592 13.4497 10.4419 13.5669C10.3247 13.6842 10.1658 13.75 10 13.75C9.83424 13.75 9.67527 13.6842 9.55806 13.5669C9.44085 13.4497 9.375 13.2908 9.375 13.125V10.625H6.875C6.70924 10.625 6.55027 10.5592 6.43306 10.4419C6.31585 10.3247 6.25 10.1658 6.25 10C6.25 9.83424 6.31585 9.67527 6.43306 9.55806C6.55027 9.44085 6.70924 9.375 6.875 9.375H9.375V6.875C9.375 6.70924 9.44085 6.55027 9.55806 6.43306C9.67527 6.31585 9.83424 6.25 10 6.25C10.1658 6.25 10.3247 6.31585 10.4419 6.43306C10.5592 6.55027 10.625 6.70924 10.625 6.875V9.375H13.125C13.2908 9.375 13.4497 9.44085 13.5669 9.55806C13.6842 9.67527 13.75 9.83424 13.75 10C13.75 10.1658 13.6842 10.3247 13.5669 10.4419C13.4497 10.5592 13.2908 10.625 13.125 10.625Z" fill="rgba(247,246,243,0.35)" />
  </svg>;
const PlusSquareIcon = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M16.25 2.5H3.75C3.41848 2.5 3.10054 2.6317 2.86612 2.86612C2.6317 3.10054 2.5 3.41848 2.5 3.75V16.25C2.5 16.5815 2.6317 16.8995 2.86612 17.1339C3.10054 17.3683 3.41848 17.5 3.75 17.5H16.25C16.5815 17.5 16.8995 17.3683 17.1339 17.1339C17.3683 16.8995 17.5 16.5815 17.5 16.25V3.75C17.5 3.41848 17.3683 3.10054 17.1339 2.86612C16.8995 2.6317 16.5815 2.5 16.25 2.5ZM13.125 10.625H10.625V13.125C10.625 13.2908 10.5592 13.4497 10.4419 13.5669C10.3247 13.6842 10.1658 13.75 10 13.75C9.83424 13.75 9.67527 13.6842 9.55806 13.5669C9.44085 13.4497 9.375 13.2908 9.375 13.125V10.625H6.875C6.70924 10.625 6.55027 10.5592 6.43306 10.4419C6.31585 10.3247 6.25 10.1658 6.25 10C6.25 9.83424 6.31585 9.67527 6.43306 9.55806C6.55027 9.44085 6.70924 9.375 6.875 9.375H9.375V6.875C9.375 6.70924 9.44085 6.55027 9.55806 6.43306C9.67527 6.31585 9.83424 6.25 10 6.25C10.1658 6.25 10.3247 6.31585 10.4419 6.43306C10.5592 6.55027 10.625 6.70924 10.625 6.875V9.375H13.125C13.2908 9.375 13.4497 9.44085 13.5669 9.55806C13.6842 9.67527 13.75 9.83424 13.75 10C13.75 10.1658 13.6842 10.3247 13.5669 10.4419C13.4497 10.5592 13.2908 10.625 13.125 10.625Z" fill="#DE322D" />
  </svg>;
const ArrowIconDark = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 12L12 2M12 2H4M12 2V10" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
  id: 'contact',
  label: 'Contact'
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
      padding: isMobile ? scrolled ? '12px 20px' : '16px 20px' : scrolled ? '12px 32px' : '20px 32px',
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
          flexShrink: 0,
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
          fontSize: isMobile ? '11px' : '13px',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: scrolled ? '#141210' : '#F7F6F3',
          fontWeight: 700,
          transition: 'color 0.35s ease'
        }}>
            EmpowaSummit
          </span>
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
          color: item.id === 'contact' ? '#DE322D' : navLinkColor,
          fontWeight: item.id === 'contact' ? 600 : 400
        }} onMouseEnter={e => {
          (e.currentTarget as HTMLAnchorElement).style.color = navLinkHoverColor;
        }} onMouseLeave={e => {
          (e.currentTarget as HTMLAnchorElement).style.color = item.id === 'contact' ? '#DE322D' : navLinkColor;
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
        gap: '5px',
        flexShrink: 0
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
        padding: '24px 20px 28px'
      }}>
            {STICKY_NAV_ITEMS.map(item => <a key={item.id} href="#" onClick={e => { e.preventDefault(); setMobileMenuOpen(false); }} style={{
          display: 'block',
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '16px',
          color: item.id === 'contact' ? '#DE322D' : 'rgba(20,18,16,0.65)',
          textDecoration: 'none',
          padding: '12px 0',
          borderBottom: '0.8px solid rgba(20,18,16,0.06)',
          letterSpacing: '0.02em',
          fontWeight: item.id === 'contact' ? 600 : 400
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
          }}>
                Partner With Us
              </a>
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

// ─── Hero Grid Overlay ────────────────────────────────────────────────────────
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
const ContactHero = () => {
  const heroRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();
  const {
    scrollYProgress
  } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);
  const orbY = useTransform(scrollYProgress, [0, 1], ['0%', '28%']);
  return <section ref={heroRef} style={{
    minHeight: '100svh',
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
      backgroundPosition: 'center 40%',
      backgroundRepeat: 'no-repeat',
      pointerEvents: 'none',
      zIndex: 0,
      willChange: 'transform'
    }} />
      {/* Overlay */}
      <div aria-hidden="true" style={{
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(160deg, rgba(20,18,16,0.97) 0%, rgba(20,18,16,0.82) 45%, rgba(20,18,16,0.94) 100%)',
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
      {/* Red orb top-right - clamped to prevent overflow */}
      <motion.div aria-hidden="true" style={{
      y: orbY,
      position: 'absolute',
      top: '-10%',
      right: '-8%',
      width: 'min(55vw, 840px)',
      height: 'min(55vw, 840px)',
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
      width: 'min(400px, 60vw)',
      height: 'min(400px, 60vw)',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(222,50,45,0.09) 0%, transparent 65%)',
      pointerEvents: 'none',
      zIndex: 3
    }} />
      {/* Corner brackets - hidden on very small screens */}
      {!isMobile && <div aria-hidden="true" style={{
      position: 'absolute',
      top: '88px',
      left: '32px',
      width: '40px',
      height: '40px',
      borderLeft: '1px solid rgba(222,50,45,0.3)',
      borderTop: '1px solid rgba(222,50,45,0.3)',
      zIndex: 4
    }} />}
      {!isMobile && <div aria-hidden="true" style={{
      position: 'absolute',
      bottom: '72px',
      right: '32px',
      width: '40px',
      height: '40px',
      borderRight: '1px solid rgba(222,50,45,0.3)',
      borderBottom: '1px solid rgba(222,50,45,0.3)',
      zIndex: 4
    }} />}
      {/* Grid */}
      <div style={{
      position: 'relative',
      zIndex: 3
    }}>
        <HeroGrid />
      </div>
      {/* Nav spacer */}
      <div style={{
      height: isMobile ? '72px' : '88px',
      flexShrink: 0,
      position: 'relative',
      zIndex: 4
    }} />

      {/* Main content */}
      <motion.div style={{
      y: textY,
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      padding: isMobile ? '0 20px 0' : '0 64px 0',
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
        gap: '8px',
        marginBottom: '28px',
        flexWrap: 'wrap'
      }}>
          <PlusSquareIconLight />
          <span style={{
          fontFamily: 'Montserrat, sans-serif',
          color: 'rgba(247,246,243,0.38)',
          fontSize: isMobile ? '9px' : '11px',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
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
          }}>Contact Us</span>
          </span>
        </motion.div>

        {/* Main headline */}
        <h1 style={{
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: 200,
        margin: '0 0 28px',
        lineHeight: 0.91,
        letterSpacing: isMobile ? '-1.5px' : '-4px',
        maxWidth: '960px'
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
            duration: 0.95,
            delay: 0.2,
            ease: [0.22, 1, 0.36, 1]
          }} style={{
            display: 'inline-block',
            color: '#F7F6F3',
            marginRight: '0.2em',
            fontSize: isMobile ? 'clamp(34px, 10vw, 56px)' : 'clamp(56px, 7vw, 112px)'
          }}>
              Join the
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
            color: 'rgba(247,246,243,0.18)',
            fontSize: isMobile ? 'clamp(34px, 10vw, 56px)' : 'clamp(56px, 7vw, 112px)'
          }}>
              Capital
            </motion.span>
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
            duration: 0.95,
            delay: 0.44,
            ease: [0.22, 1, 0.36, 1]
          }} style={{
            display: 'inline-block',
            fontStyle: 'italic',
            fontWeight: 300,
            color: '#DE322D',
            fontSize: isMobile ? 'clamp(34px, 10vw, 56px)' : 'clamp(56px, 7vw, 112px)'
          }}>
              Conversation.
            </motion.em>
          </div>
        </h1>

        {/* Subtitle */}
        <motion.p custom={0.6} initial="hidden" animate="visible" variants={fadeUpVariants} style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: isMobile ? '14px' : 'clamp(15px, 1.3vw, 19px)',
        lineHeight: '1.78',
        color: 'rgba(247,246,243,0.6)',
        margin: '0 0 40px',
        fontWeight: 300,
        maxWidth: '520px'
      }}>
          Whether you're a founder seeking catalytic capital, an investor exploring Africa's growth frontier, or a brand looking to align with continental impact - we're ready to connect.
        </motion.p>

        {/* CTA row */}
        <motion.div custom={0.72} initial="hidden" animate="visible" variants={fadeUpVariants} style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        flexWrap: 'wrap',
        marginBottom: '44px'
      }}>
          <motion.a href="#inquiry-form"  whileHover={{
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
          padding: isMobile ? '13px 24px' : '18px 36px',
          fontSize: isMobile ? '12px' : '13px',
          letterSpacing: '0.05em',
          color: '#fff',
          textDecoration: 'none',
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: 600,
          boxShadow: '0 8px 36px rgba(222,50,45,0.55)'
        }}>
            <span>Send an Inquiry</span>
            <ArrowIconDark />
          </motion.a>
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
          padding: isMobile ? '13px 20px' : '18px 30px',
          fontSize: isMobile ? '12px' : '13px',
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
    </section>;
};

// ─── Engagement Pathway Data ──────────────────────────────────────────────────
type PathwayItem = {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  icon: string;
};
const PATHWAY_ITEMS: PathwayItem[] = [{
  id: 'pw-strategic',
  index: '01',
  title: 'Strategic Partnership',
  subtitle: 'Corporate & Brand Alignment',
  description: "Align your brand with Africa's most ambitious capital movement. Strategic partners gain direct access to 400+ founders, investors, and ecosystem builders - and the platform to shape the continent's enterprise narrative.",
  features: ['Exhibition & Branding Rights', 'Keynote & Panel Placement', 'Exclusive Networking Access', 'Co-Branding Opportunities', 'Post-Summit Report Inclusion'],
  icon: '◈'
}, {
  id: 'pw-investor',
  index: '02',
  title: 'Investor Relations',
  subtitle: 'Capital Deployment & Deal Flow',
  description: "Access verified deal flow from Africa's most investment-ready founders. Investor Relations pathways include curated pitch sessions, Power Seat roundtables, and a dedicated investor concierge service.",
  features: ['Curated Pitch Sessions', 'Power Seat Roundtables', 'Investor Concierge Service', 'Pre-Summit Deal Flow Preview', 'Portfolio Showcase'],
  icon: '◇'
}, {
  id: 'pw-founder',
  index: '03',
  title: 'Entrepreneurial Growth',
  subtitle: 'Founders & Enterprise Leaders',
  description: "Whether you're seeking seed capital or Series B, the EmpowaEntrepreneurs Summit connects you directly with the investors and networks that can accelerate your trajectory. Register, pitch, and connect.",
  features: ['Founder Registration', 'Pitch Application', 'Mentorship & Coaching', 'Procurement Connections', 'Exhibition Booth Access'],
  icon: '△'
}, {
  id: 'pw-media',
  index: '04',
  title: 'Media & Press',
  subtitle: 'Coverage & Editorial',
  description: "Accredited media partners and press receive full summit access, exclusive interview opportunities with headline speakers, and dedicated media resources to cover Africa's premier capital movement.",
  features: ['Press Accreditation', 'Media Room Access', 'Speaker Interview Requests', 'Press Kit & Assets', 'Live Coverage Support'],
  icon: '○'
}];

// ─── Strategic Engagement Section ────────────────────────────────────────────
const EngagementSection = () => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, {
    once: true,
    margin: '-60px 0px'
  });
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const [activeId, setActiveId] = useState<string>('pw-strategic');
  const activeItem = PATHWAY_ITEMS.find(p => p.id === activeId) ?? PATHWAY_ITEMS[0];
  return <section ref={ref} style={{
    background: '#141210',
    width: '100%',
    boxSizing: 'border-box',
    padding: isMobile ? '72px 20px' : isTablet ? '96px 40px' : '120px 64px',
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
      opacity: 0.55,
      zIndex: 0
    }} />
      <div aria-hidden="true" style={{
      position: 'absolute',
      top: '-5%',
      right: '-8%',
      width: 'min(50vw, 760px)',
      height: 'min(50vw, 760px)',
      borderRadius: '50%',
      background: 'radial-gradient(circle at 40% 40%, rgba(222,50,45,0.1) 0%, transparent 68%)',
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
        marginBottom: isMobile ? '40px' : '80px'
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
          }}>
              Strategic Engagement
            </span>
          </motion.div>
          <div style={{
          overflow: 'hidden'
        }}>
            <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.1} style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: isMobile ? 'clamp(28px, 9vw, 48px)' : isTablet ? 'clamp(36px, 6vw, 60px)' : 'clamp(40px, 5vw, 78px)',
            fontWeight: 200,
            letterSpacing: '-2px',
            lineHeight: 0.96,
            color: '#F7F6F3',
            margin: 0,
            maxWidth: '700px'
          }}>
              <span>Choose your </span>
              <em style={{
              fontStyle: 'italic',
              color: '#DE322D'
            }}>pathway</em>
              <span style={{
              color: 'rgba(247,246,243,0.2)'
            }}> to impact.</span>
            </motion.h2>
          </div>
        </div>

        {/* Desktop/tablet interactive layout */}
        {!isMobile ? <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUpVariants} custom={0.2} style={{
        display: 'grid',
        gridTemplateColumns: isTablet ? '300px 1fr' : '380px 1fr',
        gap: '16px',
        alignItems: 'stretch'
      }}>
            {/* Left: pathway selector */}
            <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
              {PATHWAY_ITEMS.map((item, i) => <motion.button key={item.id} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideFromLeft} custom={0.2 + i * 0.08} onClick={() => setActiveId(item.id)} style={{
            all: 'unset',
            cursor: 'pointer',
            borderRadius: '18px',
            padding: isTablet ? '18px 20px' : '24px 28px',
            background: activeId === item.id ? 'rgba(222,50,45,0.1)' : 'rgba(247,246,243,0.03)',
            border: `1px solid ${activeId === item.id ? 'rgba(222,50,45,0.3)' : 'rgba(247,246,243,0.06)'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            transition: 'background 0.35s cubic-bezier(0.22,1,0.36,1), border-color 0.35s ease',
            boxSizing: 'border-box',
            position: 'relative',
            overflow: 'hidden',
            textAlign: 'left'
          }} onMouseEnter={e => {
            if (activeId !== item.id) {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(247,246,243,0.06)';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(247,246,243,0.14)';
            }
          }} onMouseLeave={e => {
            if (activeId !== item.id) {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(247,246,243,0.03)';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(247,246,243,0.06)';
            }
          }}>
                  {activeId === item.id && <motion.div aria-hidden="true" initial={{
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
                  <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              flexShrink: 0,
              background: activeId === item.id ? 'rgba(222,50,45,0.18)' : 'rgba(247,246,243,0.06)',
              border: `1px solid ${activeId === item.id ? 'rgba(222,50,45,0.4)' : 'rgba(247,246,243,0.1)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.35s ease, border-color 0.35s ease',
              fontSize: '15px',
              color: activeId === item.id ? '#DE322D' : 'rgba(247,246,243,0.3)'
            }}>
                    <span style={{
                fontFamily: 'Inter, sans-serif'
              }}>{item.icon}</span>
                  </div>
                  <div style={{
              flex: 1,
              minWidth: 0
            }}>
                    <div style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: isTablet ? '13px' : '15px',
                fontWeight: 500,
                letterSpacing: '-0.3px',
                color: activeId === item.id ? '#F7F6F3' : 'rgba(247,246,243,0.4)',
                marginBottom: '3px',
                lineHeight: 1.2,
                transition: 'color 0.35s ease'
              }}>
                      {item.title}
                    </div>
                    <div style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '10px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: activeId === item.id ? 'rgba(222,50,45,0.9)' : 'rgba(247,246,243,0.2)',
                fontWeight: 500,
                transition: 'color 0.35s ease'
              }}>
                      {item.subtitle}
                    </div>
                  </div>
                  <span style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '10px',
              letterSpacing: '0.14em',
              color: activeId === item.id ? '#DE322D' : 'rgba(247,246,243,0.18)',
              fontWeight: 700,
              transition: 'color 0.35s ease',
              flexShrink: 0
            }}>
                    {item.index}
                  </span>
                </motion.button>)}
            </div>

            {/* Right: detail panel */}
            <div style={{
          borderRadius: '24px',
          background: 'rgba(247,246,243,0.025)',
          border: '1px solid rgba(247,246,243,0.07)',
          overflow: 'hidden',
          position: 'relative',
          minHeight: '460px',
          display: 'flex',
          flexDirection: 'column'
        }}>
              <div style={{
            height: '160px',
            position: 'relative',
            overflow: 'hidden',
            flexShrink: 0
          }}>
                <img src={CONTACT_IMG} alt={`${activeItem.title} engagement pathway`} style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              filter: 'brightness(0.3) saturate(0.5)'
            }} />
                <div aria-hidden="true" style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, transparent 30%, rgba(20,18,16,0.95) 100%)',
              pointerEvents: 'none'
            }} />
                <div style={{
              position: 'absolute',
              top: '16px',
              right: '24px',
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '72px',
              fontWeight: 700,
              color: 'rgba(222,50,45,0.12)',
              lineHeight: 1,
              letterSpacing: '-4px'
            }}>
                  <span>{activeItem.index}</span>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={activeItem.id + '-detail'} initial={{
              opacity: 0,
              y: 20,
              filter: 'blur(8px)'
            }} animate={{
              opacity: 1,
              y: 0,
              filter: 'blur(0px)'
            }} exit={{
              opacity: 0,
              y: -14,
              filter: 'blur(6px)'
            }} transition={{
              duration: 0.55,
              ease: [0.22, 1, 0.36, 1]
            }} style={{
              flex: 1,
              padding: isTablet ? '28px 32px 32px' : '36px 40px 40px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
                  <div>
                    <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(222,50,45,0.12)',
                  border: '1px solid rgba(222,50,45,0.28)',
                  borderRadius: '44px',
                  padding: '5px 14px',
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '10px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(247,246,243,0.7)',
                  fontWeight: 500,
                  marginBottom: '14px'
                }}>
                      <span style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: '#DE322D',
                    display: 'block',
                    flexShrink: 0
                  }} />
                      {activeItem.subtitle}
                    </div>
                    <h3 style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: isTablet ? 'clamp(20px, 3vw, 28px)' : 'clamp(24px, 2.5vw, 36px)',
                  fontWeight: 200,
                  letterSpacing: '-1px',
                  color: '#F7F6F3',
                  margin: 0,
                  lineHeight: 1.1
                }}>
                      {activeItem.title}
                    </h3>
                  </div>

                  <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: isTablet ? '13px' : '15px',
                lineHeight: '1.78',
                color: 'rgba(247,246,243,0.5)',
                margin: 0,
                fontWeight: 300
              }}>
                    {activeItem.description}
                  </p>

                  <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                    {activeItem.features.map((feat, idx) => <span key={`${activeItem.id}-feat-${idx}`} style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  background: 'rgba(247,246,243,0.04)',
                  border: '1px solid rgba(247,246,243,0.1)',
                  borderRadius: '44px',
                  padding: '7px 14px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '12px',
                  color: 'rgba(247,246,243,0.6)',
                  fontWeight: 300
                }}>
                        <span style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: '#DE322D',
                    display: 'block',
                    flexShrink: 0
                  }} />
                        {feat}
                      </span>)}
                  </div>

                  <motion.a href="#" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('openStrategicModal', { detail: { pathway: activeItem.title.toLowerCase().includes('strategic') ? 'strategic' : activeItem.title.toLowerCase().includes('investor') ? 'investor' : activeItem.title.toLowerCase().includes('growth') ? 'founder' : 'general' }})); }} whileHover={{
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
                boxShadow: '0 6px 28px rgba(222,50,45,0.4)',
                alignSelf: 'flex-start'
              }}>
                    <span>Explore This Pathway</span>
                    <ArrowIconDark />
                  </motion.a>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div> : (/* Mobile accordion */
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0'
      }}>
            {PATHWAY_ITEMS.map((item, i) => <motion.div key={item.id} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.15 + i * 0.08} style={{
          borderTop: i === 0 ? '1px solid rgba(247,246,243,0.1)' : 'none',
          borderBottom: '1px solid rgba(247,246,243,0.07)'
        }}>
                <button  style={{
            all: 'unset',
            cursor: 'pointer',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 0',
            boxSizing: 'border-box',
            gap: '12px'
          }}>
                  <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px'
            }}>
                    <span style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '11px',
                letterSpacing: '0.14em',
                color: activeId === item.id ? '#DE322D' : 'rgba(247,246,243,0.2)',
                fontWeight: 700,
                flexShrink: 0,
                transition: 'color 0.35s ease'
              }}>
                      {item.index}
                    </span>
                    <span style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: 'clamp(15px, 4.5vw, 22px)',
                fontWeight: 300,
                letterSpacing: '-0.5px',
                color: activeId === item.id ? '#F7F6F3' : 'rgba(247,246,243,0.5)',
                transition: 'color 0.35s ease',
                lineHeight: 1.1
              }}>
                      {item.title}
                    </span>
                  </div>
                  <motion.div animate={{
              rotate: activeId === item.id ? 45 : 0
            }} transition={{
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1]
            }} style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              flexShrink: 0,
              border: `1px solid ${activeId === item.id ? 'rgba(222,50,45,0.4)' : 'rgba(247,246,243,0.12)'}`,
              background: activeId === item.id ? 'rgba(222,50,45,0.1)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                      <path d="M7 2V12M2 7H12" stroke={activeId === item.id ? '#DE322D' : 'rgba(247,246,243,0.4)'} strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {activeId === item.id && <motion.div key={item.id + '-mob-body'} initial={{
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
                paddingBottom: '24px'
              }}>
                        <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  lineHeight: '1.78',
                  color: 'rgba(247,246,243,0.5)',
                  margin: '0 0 16px',
                  fontWeight: 300
                }}>
                          {item.description}
                        </p>
                        <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '7px',
                  marginBottom: '18px'
                }}>
                          {item.features.map((feat, idx) => <span key={`${item.id}-mob-feat-${idx}`} style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'rgba(247,246,243,0.04)',
                    border: '1px solid rgba(247,246,243,0.1)',
                    borderRadius: '44px',
                    padding: '6px 12px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '11px',
                    color: 'rgba(247,246,243,0.55)',
                    fontWeight: 300
                  }}>
                              <span style={{
                      width: '3px',
                      height: '3px',
                      borderRadius: '50%',
                      background: '#DE322D',
                      display: 'block',
                      flexShrink: 0
                    }} />
                              {feat}
                            </span>)}
                        </div>
                        <a href="#" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('openStrategicModal', { detail: { pathway: item.title.toLowerCase().includes('strategic') ? 'strategic' : item.title.toLowerCase().includes('investor') ? 'investor' : item.title.toLowerCase().includes('growth') ? 'founder' : 'general' }})); }} style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'linear-gradient(135deg, #DE322D, #c42823)',
                  borderRadius: '44px',
                  padding: '11px 22px',
                  fontSize: '12px',
                  letterSpacing: '0.05em',
                  color: '#fff',
                  textDecoration: 'none',
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 600
                }}>
                          <span>Explore Pathway</span>
                          <ArrowIconDark />
                        </a>
                      </div>
                    </motion.div>}
                </AnimatePresence>
              </motion.div>)}
          </div>)}
      </div>
    </section>;
};

// ─── Contact Details Section ──────────────────────────────────────────────────
const ContactDetailsSection = () => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, {
    once: true,
    margin: '-60px 0px'
  });
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const contactBlocks = [{
    id: 'cb-address',
    label: 'Summit Venue',
    title: 'EmpowaWorx House',
    lines: ['Johannesburg, South Africa', 'May 28, 2026'],
    accent: false,
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="rgba(247,246,243,0.4)" /></svg>
  }, {
    id: 'cb-strategic',
    label: 'Strategic Inquiries',
    title: 'Thulisa Nkosi',
    lines: ['info@empowaentrepreneurs.co.za', '+27(0) 11 482 7256/7257'],
    accent: false,
    tag: 'Partnerships & Investor Relations',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="rgba(247,246,243,0.4)" /></svg>
  }, {
    id: 'cb-ticketing',
    label: 'Ticketing Support',
    title: 'Registration Desk',
    lines: ['info@empowaentrepreneurs.co.za', 'Mon - Fri, 8:00 - 17:00 SAST'],
    accent: false,
    tag: 'General & Delegate Support',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20 12c0-1.1.9-2 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v4c1.1 0 2 .9 2 2s-.9 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2z" fill="rgba(247,246,243,0.4)" /></svg>
  }, {
    id: 'cb-media',
    label: 'Media & Press',
    title: 'Press Office',
    lines: ['info@empowaentrepreneurs.co.za', 'Accreditation Applications Open'],
    accent: true,
    tag: 'Media Accreditation',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="rgba(247,246,243,0.4)" /></svg>
  }];
  return <section ref={ref} style={{
    background: '#0d1117',
    width: '100%',
    boxSizing: 'border-box',
    padding: isMobile ? '72px 20px' : isTablet ? '96px 40px' : '120px 64px',
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
      opacity: 0.55,
      zIndex: 0
    }} />
      <div aria-hidden="true" style={{
      position: 'absolute',
      bottom: '-8%',
      right: '-6%',
      width: 'min(42vw, 640px)',
      height: 'min(42vw, 640px)',
      borderRadius: '50%',
      background: 'radial-gradient(circle at 45% 45%, rgba(222,50,45,0.08) 0%, transparent 65%)',
      pointerEvents: 'none',
      zIndex: 0
    }} />

      <div style={{
      maxWidth: '1280px',
      margin: '0 auto',
      position: 'relative',
      zIndex: 1
    }}>
        <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: isMobile ? '40px' : '80px',
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
            }}>
                Contact Details
              </span>
            </motion.div>
            <div style={{
            overflow: 'hidden'
          }}>
              <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.1} style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: isMobile ? 'clamp(28px, 8vw, 44px)' : isTablet ? 'clamp(32px, 5.5vw, 52px)' : 'clamp(38px, 4.5vw, 68px)',
              fontWeight: 200,
              letterSpacing: '-2px',
              lineHeight: 0.96,
              color: '#F7F6F3',
              margin: 0,
              maxWidth: '580px'
            }}>
                <span>Get in </span>
                <em style={{
                fontStyle: 'italic',
                color: '#DE322D'
              }}>touch</em>
                <span style={{
                color: 'rgba(247,246,243,0.2)'
              }}> with us.</span>
              </motion.h2>
            </div>
          </div>
        </div>

        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={staggerContainer} custom={0.09} style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: '12px'
      }}>
          {contactBlocks.map(block => <motion.div key={block.id} variants={staggerChild} whileHover={{
          y: -4,
          transition: {
            duration: 0.3,
            ease: [0.22, 1, 0.36, 1]
          }
        }} style={{
          background: block.accent ? 'linear-gradient(145deg, #DE322D 0%, #8B1A17 100%)' : 'rgba(247,246,243,0.03)',
          borderRadius: '20px',
          padding: isMobile ? '24px 20px' : '36px 36px',
          border: block.accent ? 'none' : '1px solid rgba(247,246,243,0.07)',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: block.accent ? '0 16px 60px rgba(222,50,45,0.28)' : 'none'
        }}>
              {block.accent && <div aria-hidden="true" style={{
            position: 'absolute',
            bottom: '-20%',
            right: '-10%',
            width: '220px',
            height: '220px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            pointerEvents: 'none'
          }} />}

              <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
                <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              flexShrink: 0,
              background: block.accent ? 'rgba(255,255,255,0.15)' : 'rgba(247,246,243,0.07)',
              border: `1px solid ${block.accent ? 'rgba(255,255,255,0.2)' : 'rgba(247,246,243,0.1)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
                  {block.icon}
                </div>
                <span style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '10px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: block.accent ? 'rgba(247,246,243,0.7)' : 'rgba(247,246,243,0.28)',
              fontWeight: 500
            }}>
                  {block.label}
                </span>
              </div>

              <div style={{
            height: '1px',
            background: block.accent ? 'rgba(255,255,255,0.12)' : 'rgba(247,246,243,0.07)'
          }} />

              <h3 style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: isMobile ? '18px' : '24px',
            fontWeight: 400,
            letterSpacing: '-0.5px',
            color: '#F7F6F3',
            margin: 0,
            lineHeight: 1.2,
            position: 'relative',
            zIndex: 1
          }}>
                {block.title}
              </h3>

              {block.tag && <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: block.accent ? 'rgba(255,255,255,0.12)' : 'rgba(222,50,45,0.1)',
            border: `1px solid ${block.accent ? 'rgba(255,255,255,0.2)' : 'rgba(222,50,45,0.25)'}`,
            borderRadius: '44px',
            padding: '5px 12px',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '10px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: block.accent ? 'rgba(247,246,243,0.85)' : 'rgba(247,246,243,0.55)',
            fontWeight: 500,
            alignSelf: 'flex-start',
            position: 'relative',
            zIndex: 1
          }}>
                  <span style={{
              width: '3px',
              height: '3px',
              borderRadius: '50%',
              background: block.accent ? 'rgba(255,255,255,0.7)' : '#DE322D',
              display: 'block',
              flexShrink: 0
            }} />
                  {block.tag}
                </div>}

              <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            position: 'relative',
            zIndex: 1
          }}>
                {block.lines.map((line, idx) => <span key={`${block.id}-line-${idx}`} style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              color: block.accent ? 'rgba(247,246,243,0.8)' : 'rgba(247,246,243,0.45)',
              lineHeight: 1.5,
              fontWeight: 300
            }}>
                    {line}
                  </span>)}
              </div>
            </motion.div>)}
        </motion.div>
      </div>
    </section>;
};

// ─── Inquiry Form Section ─────────────────────────────────────────────────────
type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
};
const RESPONSE_TIMES = [{
  id: 'rt-1',
  label: 'Strategic Partnership',
  time: '24 - 48h'
}, {
  id: 'rt-2',
  label: 'Investor Relations',
  time: '24 - 48h'
}, {
  id: 'rt-3',
  label: 'General Inquiry',
  time: '48 - 72h'
}, {
  id: 'rt-4',
  label: 'Media & Press',
  time: '24h'
}];
const InquiryFormSection = () => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, {
    once: true,
    margin: '-60px 0px'
  });
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const handleChange = (field: keyof FormData, value: string) => setFormData(prev => ({
    ...prev,
    [field]: value
  }));
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('https://forms.empowaentrepreneurs.co.za/wp-json/gf/v2/forms/1/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "input_3_3": formData.firstName,
          "input_3_6": formData.lastName,
          "input_5": formData.email,
          "input_23": formData.subject,
          "input_24": formData.message
        })
      });
      
      const data = await response.json();
      if (data.is_valid) {
        setSubmitted(true);
      } else {
        setError(data.validation_messages ? Object.values(data.validation_messages)[0] as string : 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('Gravity Forms submission error:', err);
      setError('A network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const inputStyle = (field: string): React.CSSProperties => ({
    width: '100%',
    background: focused === field ? 'rgba(247,246,243,0.05)' : 'rgba(247,246,243,0.025)',
    border: `1px solid ${focused === field ? 'rgba(222,50,45,0.5)' : 'rgba(247,246,243,0.1)'}`,
    borderRadius: '12px',
    padding: '15px 18px',
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    color: '#F7F6F3',
    outline: 'none',
    transition: 'background 0.25s ease, border-color 0.25s ease',
    boxSizing: 'border-box',
    fontWeight: 300,
    letterSpacing: '0.01em',
    WebkitAppearance: 'none'
  });
  const labelStyle: React.CSSProperties = {
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '10px',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'rgba(247,246,243,0.35)',
    fontWeight: 600,
    display: 'block',
    marginBottom: '8px'
  };
  return <section id="inquiry-form" ref={ref} style={{
    background: '#F7F6F3',
    width: '100%',
    boxSizing: 'border-box',
    padding: isMobile ? '72px 20px' : isTablet ? '96px 40px' : '120px 64px',
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
      opacity: 0.4,
      zIndex: 0
    }} />
      <div aria-hidden="true" style={{
      position: 'absolute',
      top: '-10%',
      right: '-8%',
      width: 'min(50vw, 720px)',
      height: 'min(50vw, 720px)',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(222,50,45,0.06) 0%, transparent 65%)',
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
        marginBottom: isMobile ? '36px' : '72px',
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
                Make an Inquiry
              </span>
            </motion.div>
            <div style={{
            overflow: 'hidden'
          }}>
              <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.1} style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: isMobile ? 'clamp(28px, 8vw, 44px)' : isTablet ? 'clamp(32px, 5.5vw, 52px)' : 'clamp(38px, 4.5vw, 68px)',
              fontWeight: 300,
              letterSpacing: '-2px',
              lineHeight: 0.96,
              color: '#141210',
              margin: 0,
              maxWidth: '560px'
            }}>
                <span>Tell us </span>
                <em style={{
                fontStyle: 'italic',
                color: '#DE322D'
              }}>how</em>
                <span style={{
                color: 'rgba(20,18,16,0.2)'
              }}> you want to engage.</span>
              </motion.h2>
            </div>
          </div>
          {!isMobile && <motion.p initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideFromRight} custom={0.25} style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '15px',
          color: 'rgba(20,18,16,0.4)',
          maxWidth: '300px',
          lineHeight: '1.75',
          margin: 0
        }}>
              Every message is reviewed by our team. We typically respond within 48 hours for strategic inquiries.
            </motion.p>}
        </div>

        {/* Form + aside */}
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUpVariants} custom={0.2} style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr' : '1fr 340px',
        gap: isMobile ? '40px' : isTablet ? '40px' : '56px',
        alignItems: 'start'
      }}>
          {/* Form card */}
          <div style={{
          background: '#141210',
          borderRadius: '24px',
          padding: isMobile ? '28px 20px' : isTablet ? '40px 40px' : '48px 48px',
          boxSizing: 'border-box',
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
            opacity: 0.5,
            zIndex: 0
          }} />
            <div aria-hidden="true" style={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '360px',
            height: '360px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(222,50,45,0.09) 0%, transparent 65%)',
            pointerEvents: 'none',
            zIndex: 0
          }} />

            {!submitted ? <form onSubmit={handleSubmit} style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
                <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: '14px'
            }}>
                  <div>
                    <label htmlFor="contact-firstname" style={labelStyle}>First Name</label>
                    <input id="contact-firstname" type="text" placeholder="Your first name" value={formData.firstName} onChange={e => handleChange('firstName', e.target.value)} onFocus={() => setFocused('firstName')} onBlur={() => setFocused(null)} required style={inputStyle('firstName')} />
                  </div>
                  <div>
                    <label htmlFor="contact-lastname" style={labelStyle}>Last Name</label>
                    <input id="contact-lastname" type="text" placeholder="Your last name" value={formData.lastName} onChange={e => handleChange('lastName', e.target.value)} onFocus={() => setFocused('lastName')} onBlur={() => setFocused(null)} required style={inputStyle('lastName')} />
                  </div>
                </div>

                <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: '14px'
            }}>
                  <div>
                    <label htmlFor="contact-email" style={labelStyle}>Email Address</label>
                    <input id="contact-email" type="email" placeholder="info@empowaentrepreneurs.co.za" value={formData.email} onChange={e => handleChange('email', e.target.value)} onFocus={() => setFocused('email')} onBlur={() => setFocused(null)} required style={inputStyle('email')} />
                  </div>
                  <div>
                    <label htmlFor="contact-subject" style={labelStyle}>Subject</label>
                    <input id="contact-subject" type="text" placeholder="e.g. Strategic Partnership, General Inquiry" value={formData.subject} onChange={e => handleChange('subject', e.target.value)} onFocus={() => setFocused('subject')} onBlur={() => setFocused(null)} required style={inputStyle('subject')} />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-message" style={labelStyle}>Message</label>
                  <textarea id="contact-message" placeholder="Tell us about your goals, interests, or how you'd like to engage..." value={formData.message} onChange={e => handleChange('message', e.target.value)} onFocus={() => setFocused('message')} onBlur={() => setFocused(null)} rows={5} style={{
                ...inputStyle('message'),
                resize: 'vertical',
                minHeight: '120px'
              }} />
                </div>

                <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              marginTop: '12px'
            }}>
                  {error && <div style={{ color: '#DE322D', fontSize: '13px', fontFamily: 'Inter, sans-serif' }}>{error}</div>}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    flexWrap: 'wrap'
                  }}>
                    <motion.button type="submit" disabled={isSubmitting} whileHover={{
                      scale: isSubmitting ? 1 : 1.04,
                      boxShadow: isSubmitting ? '0 6px 28px rgba(222,50,45,0.45)' : '0 12px 48px rgba(222,50,45,0.65)'
                    }} whileTap={{
                      scale: isSubmitting ? 1 : 0.97
                    }} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      background: 'linear-gradient(135deg, #DE322D 0%, #c42823 100%)',
                      borderRadius: '44px',
                      padding: isMobile ? '14px 28px' : '16px 36px',
                      fontSize: '13px',
                      letterSpacing: '0.05em',
                      color: '#fff',
                      fontFamily: 'Montserrat, sans-serif',
                      fontWeight: 600,
                      boxShadow: '0 6px 28px rgba(222,50,45,0.45)',
                      border: 'none',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      opacity: isSubmitting ? 0.7 : 1
                    }}>
                      <span>{isSubmitting ? 'Sending...' : 'Send Inquiry'}</span>
                      {!isSubmitting && <ArrowIconDark />}
                    </motion.button>
                  <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '11px',
                color: 'rgba(247,246,243,0.25)',
                margin: 0,
                letterSpacing: '0.02em',
                lineHeight: '1.6'
              }}>
                    We respond within 48 hours for strategic inquiries.
                  </p>
                  </div>
                </div>
              </form> : <motion.div initial={{
            opacity: 0,
            y: 24,
            filter: 'blur(10px)'
          }} animate={{
            opacity: 1,
            y: 0,
            filter: 'blur(0px)'
          }} transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1]
          }} style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 24px',
            gap: '24px',
            textAlign: 'center',
            minHeight: '320px'
          }}>
                <motion.div initial={{
              scale: 0,
              opacity: 0
            }} animate={{
              scale: 1,
              opacity: 1
            }} transition={{
              duration: 0.6,
              delay: 0.2,
              ease: [0.22, 1, 0.36, 1]
            }} style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'rgba(222,50,45,0.15)',
              border: '1px solid rgba(222,50,45,0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 40px rgba(222,50,45,0.2)'
            }}>
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M6 14L11 19L22 8" stroke="#DE322D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.div>
                <div>
                  <h3 style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: isMobile ? '24px' : '32px',
                fontWeight: 300,
                letterSpacing: '-1px',
                color: '#F7F6F3',
                margin: '0 0 12px',
                lineHeight: 1.1
              }}>
                    <span>Inquiry </span>
                    <em style={{
                  fontStyle: 'italic',
                  color: '#DE322D'
                }}>received.</em>
                  </h3>
                  <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '15px',
                color: 'rgba(247,246,243,0.5)',
                margin: 0,
                lineHeight: '1.75',
                fontWeight: 300,
                maxWidth: '380px'
              }}>
                    <span>Thank you, </span>
                    <strong style={{
                  color: 'rgba(247,246,243,0.75)',
                  fontWeight: 500
                }}>{formData.firstName || 'friend'}</strong>
                    <span>. Our team will review your submission and be in touch within 48 hours.</span>
                  </p>
                </div>
                <motion.button onClick={() => setSubmitted(false)} whileHover={{
              scale: 1.04
            }} whileTap={{
              scale: 0.97
            }} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              border: '1px solid rgba(247,246,243,0.2)',
              borderRadius: '44px',
              padding: '12px 24px',
              fontSize: '12px',
              letterSpacing: '0.04em',
              color: 'rgba(247,246,243,0.6)',
              fontFamily: 'Montserrat, sans-serif',
              background: 'transparent',
              cursor: 'pointer',
              marginTop: '8px'
            }}>
                  <span>Send Another Inquiry</span>
                </motion.button>
              </motion.div>}
          </div>

          {/* Aside - stacked on tablet/mobile, sidebar on desktop */}
          <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={isTablet || isMobile ? fadeUpVariants : slideFromRight} custom={0.3} style={{
          display: 'grid',
          gridTemplateColumns: isTablet ? 'repeat(3, 1fr)' : '1fr',
          gap: '14px'
        }}>
            {/* Summit card */}
            <div style={{
            background: '#141210',
            borderRadius: '20px',
            padding: '24px 24px',
            border: '1px solid rgba(247,246,243,0.06)',
            boxSizing: 'border-box',
            position: 'relative',
            overflow: 'hidden'
          }}>
              <div aria-hidden="true" style={{
              position: 'absolute',
              top: '-30%',
              right: '-20%',
              width: '240px',
              height: '240px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(222,50,45,0.1) 0%, transparent 65%)',
              pointerEvents: 'none'
            }} />
              <div style={{
              position: 'relative',
              zIndex: 1
            }}>
                <div style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: 'clamp(44px, 5vw, 64px)',
                fontWeight: 200,
                letterSpacing: '-3px',
                color: '#F7F6F3',
                lineHeight: 1,
                marginBottom: '10px'
              }}>
                  <span>2026</span>
                </div>
                <div style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '10px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'rgba(247,246,243,0.3)',
                marginBottom: '6px'
              }}>
                  <span>Summit Edition</span>
                </div>
                <div style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '15px',
                fontWeight: 600,
                color: '#F7F6F3',
                letterSpacing: '-0.3px',
                marginBottom: '4px'
              }}>
                  <span>May 28, 2026</span>
                </div>
                <div style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
                color: 'rgba(247,246,243,0.4)',
                fontWeight: 300
              }}>
                  <span>EmpowaWorx House, Johannesburg</span>
                </div>
              </div>
            </div>

            {/* Response times */}
            <div style={{
            background: '#141210',
            borderRadius: '20px',
            padding: '22px 24px',
            border: '1px solid rgba(247,246,243,0.06)',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
              <span style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '10px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(247,246,243,0.28)',
              fontWeight: 500
            }}>
                Response Times
              </span>
              {RESPONSE_TIMES.map(item => <div key={item.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid rgba(247,246,243,0.05)',
              paddingTop: '10px'
            }}>
                  <span style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '12px',
                color: 'rgba(247,246,243,0.4)',
                fontWeight: 300
              }}>{item.label}</span>
                  <span style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '12px',
                fontWeight: 600,
                color: '#DE322D',
                letterSpacing: '-0.2px'
              }}>
                    {item.time}
                  </span>
                </div>)}
            </div>

            {/* Stay Updated */}
            <div style={{
            background: 'linear-gradient(145deg, #DE322D 0%, #8B1A17 100%)',
            borderRadius: '20px',
            padding: '22px 24px',
            boxSizing: 'border-box',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 12px 48px rgba(222,50,45,0.25)'
          }}>
              <div aria-hidden="true" style={{
              position: 'absolute',
              bottom: '-20%',
              right: '-10%',
              width: '160px',
              height: '160px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.07)',
              pointerEvents: 'none'
            }} />
              <div style={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
                <span style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '10px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'rgba(247,246,243,0.6)',
                fontWeight: 500
              }}>
                  Stay Updated
                </span>
                <div style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '17px',
                fontWeight: 400,
                color: '#F7F6F3',
                letterSpacing: '-0.3px',
                lineHeight: 1.2
              }}>
                  <span>Follow the movement</span>
                </div>
                <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '12px',
                color: 'rgba(247,246,243,0.65)',
                margin: 0,
                lineHeight: '1.6',
                fontWeight: 300
              }}>
                  Get programme updates, speaker announcements, and exclusive pre-summit insights.
                </p>
                <NewsletterForm variant="pill" isMobile={isMobile} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>;
};

// ─── CTA Band ─────────────────────────────────────────────────────────────────
const CTA_ACTIONS = [{
  id: 'cta-register',
  label: 'Register Now',
  primary: true,
  href: '/summit'
}, {
  id: 'cta-pitch',
  label: 'Pitch for Funding',
  primary: false,
  href: '/pitching-festival'
}, {
  id: 'cta-partner',
  label: 'Become a Partner',
  primary: false,
  href: '/partnerships'
}];
const CTABand = () => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, {
    once: true,
    margin: '-60px 0px'
  });
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  return <section ref={ref} style={{
    background: '#141210',
    width: '100%',
    boxSizing: 'border-box',
    padding: isMobile ? '72px 20px' : isTablet ? '96px 40px' : '120px 64px',
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
      opacity: 0.55,
      zIndex: 0
    }} />
      <div aria-hidden="true" style={{
      position: 'absolute',
      top: '-10%',
      left: '-5%',
      width: 'min(50vw, 720px)',
      height: 'min(50vw, 720px)',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(222,50,45,0.14) 0%, transparent 68%)',
      pointerEvents: 'none',
      zIndex: 0
    }} />
      <div aria-hidden="true" style={{
      position: 'absolute',
      bottom: '-10%',
      right: '-8%',
      width: 'min(38vw, 560px)',
      height: 'min(38vw, 560px)',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(222,50,45,0.07) 0%, transparent 68%)',
      pointerEvents: 'none',
      zIndex: 0
    }} />
      <HeroGrid />

      <div style={{
      maxWidth: '1280px',
      margin: '0 auto',
      position: 'relative',
      zIndex: 1
    }}>
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={rotateFade} custom={0} style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '36px',
        justifyContent: 'center'
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
            Take Action
          </span>
        </motion.div>

        <div style={{
        overflow: 'hidden',
        textAlign: 'center',
        marginBottom: '20px'
      }}>
          <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.08} style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: isMobile ? 'clamp(32px, 10vw, 56px)' : isTablet ? 'clamp(44px, 8vw, 72px)' : 'clamp(52px, 6.5vw, 96px)',
          fontWeight: 200,
          letterSpacing: isMobile ? '-1.5px' : '-4px',
          lineHeight: 0.96,
          color: '#F7F6F3',
          margin: 0
        }}>
            <span>Lead Africa's </span>
            <em style={{
            fontStyle: 'italic',
            color: '#DE322D'
          }}>Next</em>
            <br />
            <span style={{
            color: 'rgba(247,246,243,0.2)'
          }}>Growth Story.</span>
          </motion.h2>
        </div>

        <motion.p initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUpVariants} custom={0.2} style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: isMobile ? '14px' : '17px',
        lineHeight: '1.75',
        color: 'rgba(247,246,243,0.45)',
        margin: '0 auto 52px',
        fontWeight: 300,
        maxWidth: '520px',
        textAlign: 'center'
      }}>
          Join Africa's most ambitious founders, institutional funders, and ecosystem builders at EmpowaWorx House, May 28, 2026.
        </motion.p>

        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={staggerContainer} custom={0.1} style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
        gap: '12px',
        marginBottom: '44px'
      }}>
          {CTA_ACTIONS.map((action, i) => <motion.a key={action.id} href={action.href}  variants={staggerChild} whileHover={{
          y: -6,
          boxShadow: action.primary ? '0 20px 64px rgba(222,50,45,0.55)' : '0 16px 48px rgba(20,18,16,0.55)',
          transition: {
            duration: 0.3,
            ease: [0.22, 1, 0.36, 1]
          }
        }} style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: isMobile ? '24px 20px' : '36px 36px',
          borderRadius: '20px',
          background: action.primary ? 'linear-gradient(145deg, #DE322D 0%, #9b1916 100%)' : 'rgba(247,246,243,0.04)',
          border: action.primary ? 'none' : '1px solid rgba(247,246,243,0.08)',
          boxSizing: 'border-box',
          textDecoration: 'none',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: action.primary ? '0 12px 48px rgba(222,50,45,0.35)' : 'none',
          gap: '28px'
        }}>
              {action.primary && <div aria-hidden="true" style={{
            position: 'absolute',
            bottom: '-20%',
            right: '-10%',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.07)',
            pointerEvents: 'none'
          }} />}
              <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            position: 'relative',
            zIndex: 1
          }}>
                <span style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '10px',
              letterSpacing: '0.14em',
              fontWeight: 700,
              color: action.primary ? 'rgba(247,246,243,0.5)' : 'rgba(247,246,243,0.2)'
            }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              flexShrink: 0,
              background: action.primary ? 'rgba(255,255,255,0.15)' : 'rgba(247,246,243,0.06)',
              border: `1px solid ${action.primary ? 'rgba(255,255,255,0.2)' : 'rgba(247,246,243,0.1)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
                  <ArrowIconDark />
                </div>
              </div>
              <div style={{
            position: 'relative',
            zIndex: 1
          }}>
                <div style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: isMobile ? '20px' : 'clamp(18px, 2vw, 26px)',
              fontWeight: 300,
              letterSpacing: '-0.8px',
              color: action.primary ? '#F7F6F3' : 'rgba(247,246,243,0.75)',
              lineHeight: 1.1
            }}>
                  <span>{action.label}</span>
                </div>
              </div>
            </motion.a>)}
        </motion.div>

        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUpVariants} custom={0.45} style={{
        textAlign: 'center',
        borderTop: '1px solid rgba(247,246,243,0.06)',
        paddingTop: '36px'
      }}>
          <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '12px',
          color: 'rgba(247,246,243,0.2)',
          margin: 0,
          letterSpacing: '0.02em',
          lineHeight: '1.7'
        }}>
            <span>EmpowaEntrepreneurs Funding Summit · EmpowaWorx House · May 28, 2026</span>
            <br />
            <span>Africa's Premier Capital Movement - Connecting Founders with Catalytic Capital</span>
          </p>
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
const FOOTER_BANNER_BG = 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=1800&q=80';
const LEGAL_LINKS = [{
  id: 'leg-priv',
  label: 'Privacy Policy'
}, {
  id: 'leg-terms',
  label: 'Terms of Service'
}, {
  id: 'leg-cookie',
  label: 'Cookie Settings'
}];
const SiteFooter = () => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
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
        width: 'min(55vw, 700px)',
        height: 'min(55vw, 700px)',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(222,50,45,0.2) 0%, transparent 65%)',
        pointerEvents: 'none'
      }} />

        <div style={{
        position: 'relative',
        zIndex: 2,
        width: '100%',
        padding: isMobile ? '0 20px 44px' : isTablet ? '0 40px 52px' : '0 80px 64px',
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
            fontSize: isMobile ? '10px' : '12px',
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
          gap: '32px'
        }}>
            <div style={{
            overflow: 'hidden',
            flex: 1
          }}>
              <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.08} style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: isMobile ? 'clamp(40px, 11vw, 64px)' : isTablet ? 'clamp(48px, 9vw, 72px)' : 'clamp(56px, 7vw, 96px)',
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

            <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={isMobile ? fadeUpVariants : slideFromRight} custom={0.22} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            width: isMobile ? '100%' : 'auto',
            minWidth: isMobile ? 'unset' : '220px'
          }}>
              <motion.a href="https://www.quicket.co.za/events/312690-empowaentrepreneurs-funding-summit/" whileHover={{
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
                <span>Register Now</span>
                <ArrowIconDark />
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
      background: 'rgba(247,246,243,0.06)'
    }} />

      <div style={{
      maxWidth: '1440px',
      margin: '0 auto',
      padding: isMobile ? '44px 20px 0' : isTablet ? '52px 40px 0' : '64px 80px 0',
      boxSizing: 'border-box'
    }}>
        <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '36px',
        paddingBottom: '48px',
        borderBottom: '1px solid rgba(247,246,243,0.07)'
      }}>
          <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
          maxWidth: isMobile ? '100%' : '280px'
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
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              flexShrink: 0,
              background: 'linear-gradient(135deg, #DE322D, #ff5a4f)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(222,50,45,0.4)'
            }}>
                <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
                  <path d="M6 1L7.5 4.5L11 5L8.5 7.5L9 11L6 9.5L3 11L3.5 7.5L1 5L4.5 4.5L6 1Z" fill="white" />
                </svg>
              </motion.div>
              <div>
                <div style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '12px',
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
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
          gap: isMobile ? '24px' : '0',
          flex: isMobile ? 'none' : 1,
          maxWidth: isMobile ? '100%' : '600px',
          width: isMobile ? '100%' : undefined
        }}>
            {FOOTER_NAV_COLS.map((col, colIdx) => <div key={col.id} style={{
            paddingLeft: !isMobile && colIdx > 0 ? '36px' : '0',
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
            }}>
                  {col.heading}
                </span>
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
                }}>
                        {link.label}
                      </a>
                    </li>)}
                </ul>
              </div>)}
          </div>
        </div>

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
          gap: '18px',
          flexWrap: 'wrap'
        }}>
            {LEGAL_LINKS.map(item => <a key={item.id} href="#" onClick={e => e.preventDefault()} style={{
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

// ─── ContactPage ──────────────────────────────────────────────────────────────
export const ContactPage = () => {
  return <div className="w-full min-h-screen" style={{
    background: '#141210'
  }}>
      <ContactHero />
      <LogoBanner />
      <EngagementSection />
      <ContactDetailsSection />
      <InquiryFormSection />
      <CTABand />
      <StrategicEnquiryModal />
    </div>;
};