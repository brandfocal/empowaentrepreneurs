import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView, useAnimationFrame, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
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
    isMobile: width < 640,
    isTablet: width >= 640 && width < 1024,
    isDesktop: width >= 1024,
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
const CheckIcon = () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
  <path d="M2 6.5L5.5 10L11 3" stroke="#DE322D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
</svg>;
const DownloadIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
  <path d="M7 1v8M7 9l-3-3M7 9l3-3M2 12h10" stroke="#F7F6F3" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
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

// ─── Ticker ───────────────────────────────────────────────────────────────────
const TICKER_ITEMS = [{
  id: 'tk-1',
  label: 'Strategic Partnerships'
}, {
  id: 'tk-2',
  label: 'Ecosystem Ownership'
}, {
  id: 'tk-3',
  label: 'Capital Access'
}, {
  id: 'tk-4',
  label: "Africa's Growth Frontier"
}, {
  id: 'tk-5',
  label: 'Executive Influence'
}, {
  id: 'tk-6',
  label: 'Market Leadership'
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
  label: 'Funding Summit'
}, {
  id: 'partnerships',
  label: 'Partnerships',
  active: true
}, {
  id: 'apply',
  label: 'Apply to Attend'
}, {
  id: 'contact',
  label: 'Contact Us'
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
      padding: scrolled ? isMobile ? '10px 20px' : '12px 32px' : isMobile ? '14px 20px' : '20px 32px',
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
        }}>EmpowaEntrepreneurs</span>
      </a>
      {!showHamburger && <div style={{
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
          <motion.a href="#" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('openPartnershipModal')); }} whileHover={{
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
          }}><span>Become a Partner</span></motion.a>
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
            boxShadow: '0 4px 16px rgba(222,50,45,0.38)'
          }}><span>Register Now</span></motion.a>
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
        padding: isTablet ? '24px 32px 28px' : '20px 24px 24px'
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
          flexWrap: 'wrap'
        }}>
          <a href="#" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('openPartnershipModal')); }} style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '13px',
            border: '1px solid rgba(20,18,16,0.18)',
            borderRadius: '44px',
            padding: '10px 20px',
            color: 'rgba(20,18,16,0.65)',
            textDecoration: 'none'
          }}>Become a Partner</a>
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
  const heroFontSize = isMobile ? 'clamp(38px, 10vw, 60px)' : isTablet ? 'clamp(48px, 8vw, 80px)' : 'clamp(56px, 6.5vw, 104px)';
  const heroLetterSpacing = isMobile ? '-2px' : isTablet ? '-2.5px' : '-4px';
  const heroPadding = isMobile ? '32px 20px 32px' : isTablet ? '40px 40px 40px' : '48px 64px 48px';
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
      pointerEvents: 'none',
      zIndex: 0,
      willChange: 'transform'
    }} />
    <div aria-hidden="true" style={{
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(155deg, rgba(20,18,16,0.97) 0%, rgba(20,18,16,0.85) 50%, rgba(20,18,16,0.93) 100%)',
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
          <span> · Funding Summit</span>
        </span>
      </motion.div>
      <h1 style={{
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: 300,
        margin: `0 0 ${isMobile ? '32px' : '48px'}`,
        lineHeight: 0.94,
        letterSpacing: heroLetterSpacing
      }}>
        <div style={{
          overflow: 'hidden',
          display: 'block'
        }}>
          {['Strategic', 'Partnership'].map((word, i) => <motion.span key={`h-${word}`} initial={{
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
            fontSize: heroFontSize,
            color: '#DE322D',
            marginRight: '0.22em'
          }}>Packages</motion.em>
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
            delay: 0.56,
            ease: [0.22, 1, 0.36, 1]
          }} style={{
            display: 'inline-block',
            fontSize: 'clamp(14px, 2vw, 20px)',
            color: 'rgba(247,246,243,0.32)',
            fontWeight: 300,
            letterSpacing: isMobile ? '-0.3px' : '-0.5px',
            lineHeight: 1.5,
            maxWidth: isMobile ? '100%' : '680px'
          }}>Where Africa's Boldest Entrepreneurs, Investors, Institutions &amp; Market-Makers Converge to Shape the Future Economy</motion.span>
        </div>
      </h1>
      <motion.div custom={0.85} initial="hidden" animate="visible" variants={fadeUpVariants} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        maxWidth: isMobile ? '100%' : '580px'
      }}>
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 300,
          fontSize: isMobile ? '14px' : 'clamp(14px, 1.3vw, 16px)',
          lineHeight: '1.8',
          color: 'rgba(247,246,243,0.58)',
          margin: 0
        }}>
          The EmpowaEntrepreneurs Funding Summit is positioned as a premier entrepreneurial funding, innovation, investment, and economic activation platform engineered to unlock measurable commercial value, strategic partnerships, enterprise growth, investment pipelines, and ecosystem influence across Africa.
        </p>
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 400,
          fontStyle: 'italic',
          fontSize: isMobile ? '14px' : '15px',
          lineHeight: '1.75',
          color: '#DE322D',
          margin: 0,
          borderLeft: '2px solid rgba(222,50,45,0.4)',
          paddingLeft: '16px'
        }}>
          This is not visibility for visibility's sake. This is strategic positioning within Africa's next economic growth frontier.
        </p>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          <motion.a href="#" onClick={e => { e.preventDefault(); window.dispatchEvent(new CustomEvent('openPartnershipModal')); }} whileHover={{
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
            <span>Become a Partner</span><ArrowIconDark />
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
            <DownloadIcon /><span>Download Partnership Deck</span>
          </motion.a>
        </div>
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

// ─── Data: Partnership Tiers ──────────────────────────────────────────────────
type BenefitGroup = {
  heading: string;
  items: string[];
};
type PartnerTier = {
  id: string;
  tier: string;
  tabLabel: string;
  tabBadge?: string;
  tabBadgeStyle?: 'red' | 'slate';
  label: string;
  description: string;
  roiBullets: string[];
  benefitGroups: BenefitGroup[];
  idealFor: string[];
};
const PARTNER_TIERS: PartnerTier[] = [{
  id: 'pt-official',
  tier: 'Official Partner',
  tabLabel: 'Official Partner',
  label: 'Official Strategic Ecosystem Partner',
  description: "Designed for institutions seeking elevated ecosystem credibility, strategic alignment, executive visibility, and recognised positioning within Africa's entrepreneurial growth, innovation, and funding economy. This partnership positions your organisation as a recognised ecosystem enabler driving entrepreneurship, enterprise growth, innovation, investment access, and inclusive economic participation at scale.",
  roiBullets: ['Premium executive and stakeholder visibility', 'Strategic ecosystem positioning', 'Enhanced ESG, ESD & transformation credibility', 'Access to founders, investors, and innovation ecosystems', 'Executive networking and relationship capital', 'Increased commercial exposure and lead generation', 'Brand trust acceleration and market authority', 'Long-term ecosystem relevance and influence'],
  benefitGroups: [{
    heading: 'Official Status & Brand Integration',
    items: ['Official Partner designation', 'Premium logo placement', 'Priority visibility across digital and event platforms', 'Website and media integration', 'Main venue and stage branding visibility']
  }, {
    heading: 'Executive Access & Participation',
    items: ['12 Executive Delegate Passes', 'Premium Exhibition Pavilion', 'VIP Networking & Executive Lounge Access', 'Access to curated investor and founder engagements']
  }, {
    heading: 'Thought Leadership & Influence',
    items: ['Participation in strategic industry conversations', 'Featured executive interview opportunity', 'Integration into summit thought leadership ecosystem', 'Brand storytelling integration']
  }, {
    heading: 'Marketing & Amplification',
    items: ['Integrated digital campaign visibility', 'Featured partner spotlight campaigns', 'PR and media inclusion opportunities', 'Strategic social media amplification']
  }, {
    heading: 'Data, Insights & Reporting',
    items: ['Post-summit analytics summary', 'Audience engagement insights', 'Brand visibility performance reporting']
  }],
  idealFor: ['Banks', 'Telecommunications', 'Technology Companies', 'DFIs', 'Corporates', 'Professional Services Firms', 'Development Agencies', 'Innovation Ecosystems']
}, {
  id: 'pt-growth',
  tier: 'Growth Partner',
  tabLabel: 'Growth Partner',
  tabBadge: 'Recommended',
  tabBadgeStyle: 'red',
  label: 'Market Access & Executive Engagement Partner',
  description: "Designed for organisations seeking stronger commercial positioning, strategic stakeholder engagement, enhanced exhibition visibility, and integrated thought leadership opportunities within Africa's entrepreneurial ecosystem.",
  roiBullets: ['Executive relationship acceleration', 'High-value entrepreneurial engagement', 'Qualified lead generation opportunities', 'Increased market visibility and authority', 'Ecosystem influence positioning', 'Strategic networking access', 'Enhanced brand relevance and stakeholder trust'],
  benefitGroups: [{
    heading: 'Enhanced Brand Visibility',
    items: ['Premium logo positioning', 'Integrated marketing campaign exposure', 'Featured digital spotlight campaign', 'Inclusion across summit promotional ecosystem']
  }, {
    heading: 'Executive Access',
    items: ['8 Executive Delegate Passes', 'Premium Exhibition Pavilion', 'VIP Networking Access', 'Executive hospitality inclusion']
  }, {
    heading: 'Thought Leadership Rights',
    items: ['Participation in one strategic panel session', 'Industry expertise positioning', 'Brand representation within sector discussions']
  }, {
    heading: 'Commercial Engagement',
    items: ['Lead generation opportunities', 'QR-enabled delegate interaction', 'Product and service showcase integration']
  }, {
    heading: 'Media & Storytelling',
    items: ['Media interview opportunities', 'Inclusion in summit storytelling campaigns', 'Brand integration within summit content ecosystem']
  }],
  idealFor: ['Financial Institutions', 'Insurance Brands', 'Telecoms', 'Technology Companies', 'Consulting Firms', 'Corporate ESG Divisions']
}, {
  id: 'pt-strategic',
  tier: 'Strategic Partner',
  tabLabel: 'Strategic Partner',
  label: 'Ecosystem Leadership & Influence Partner',
  description: "Designed for institutions seeking category leadership, executive visibility, strategic influence, policy alignment, and deeper integration into Africa's entrepreneurial funding ecosystem.",
  roiBullets: ['Sector leadership positioning', 'Executive and investor access', 'Thought leadership authority', 'Commercial pipeline generation', 'Transformation and ESG credibility', 'Policy ecosystem influence', 'Brand trust acceleration', 'Strategic stakeholder integration'],
  benefitGroups: [{
    heading: 'Strategic Brand Ownership',
    items: ['Branded Experience Zone', 'Executive Lounge Branding', 'Premium Stage Integration', 'Sector category exclusivity opportunities']
  }, {
    heading: 'Executive Thought Leadership',
    items: ['Keynote speaking opportunity', 'Strategic fireside conversation participation', 'Agenda topic influence participation', 'Executive roundtable integration']
  }, {
    heading: 'Commercial Activation Rights',
    items: ['Curated B2B introductions', 'Investor and founder matchmaking', 'Product demonstration opportunities', 'Strategic networking integration']
  }, {
    heading: 'Data & Intelligence',
    items: ['Audience analytics and engagement reporting', 'Entrepreneurial ecosystem insights', 'Sector intelligence reporting', 'Strategic stakeholder engagement data']
  }, {
    heading: 'Brand Storytelling',
    items: ['Co-authored narrative positioning', 'Integrated PR and media visibility', 'Featured leadership content integration']
  }],
  idealFor: ['DFIs', 'Venture Capital Firms', 'Government Entities', 'Global Technology Companies', 'Development Agencies', 'Multinational Corporations', 'Investment Institutions']
}, {
  id: 'pt-title',
  tier: 'Title Partner',
  tabLabel: 'Title Partner',
  tabBadge: 'Exclusive',
  tabBadgeStyle: 'slate',
  label: 'Summit Naming Rights & Ecosystem Co-Ownership Partner',
  description: "The highest level of strategic partnership designed for visionary institutions seeking long-term ecosystem ownership, executive influence, national visibility, and category leadership within Africa's entrepreneurial funding economy.",
  roiBullets: ['Category ownership and dominance', 'Long-term ecosystem influence', 'National and continental visibility', 'Executive and policy access', 'Commercial and investment pipeline development', 'Market leadership authority', 'Enhanced transformation credibility', 'Strategic stakeholder integration'],
  benefitGroups: [{
    heading: 'Naming Rights & Ownership',
    items: ['Summit Naming Rights', 'Presented By ownership positioning', 'Co-branded summit identity integration', 'Dominant event branding visibility']
  }, {
    heading: 'Executive Influence & Access',
    items: ['Exclusive Power Seat Roundtable', 'Private investor and executive engagements', 'Government and ecosystem introductions', 'Strategic stakeholder access']
  }, {
    heading: 'Programme Co-Design Rights',
    items: ['Co-curation of summit programme', 'Strategic agenda collaboration', 'Sector narrative influence']
  }, {
    heading: 'Premium Multimedia Visibility',
    items: ['Full-scale integrated marketing visibility', 'Main stage ownership integration', 'National media and PR integration', 'Year-round platform association']
  }, {
    heading: 'Legacy Ecosystem Integration',
    items: ['Year-round ecosystem visibility', 'Strategic advisory participation opportunities', 'Long-term partnership integration', 'Leadership positioning across EmpowaWorx platforms']
  }],
  idealFor: ['Anchor Sponsors', 'Pan-African Institutions', 'Major Banks', 'Telecommunications Giants', 'Global Technology Brands', 'Government Agencies', 'Investment Institutions']
}];

// ─── Data: Specialised Packages ───────────────────────────────────────────────
type SpecialisedPackage = {
  id: string;
  tier: string;
  label: string;
  description: string;
  highlights: string[];
  idealFor: string[];
};
const SPECIALISED_PACKAGES: SpecialisedPackage[] = [{
  id: 'sp-media',
  tier: 'Official Media Partner',
  label: 'Strategic Media, Broadcasting & Amplification Partner',
  description: 'For broadcasters, media houses, business publications, digital platforms, podcasts, and streaming services. Gain exclusive executive content access, premium interview opportunities, multi-platform storytelling, and business sector authority.',
  highlights: ['Official Media Partner designation & co-branded media wall', 'Executive interview & speaker access rights', 'Live broadcasting & content capture access', 'Podcast and digital storytelling integration', 'Integrated amplification campaigns & social collaboration', 'VIP hospitality & full media accreditation'],
  idealFor: ['Television Networks', 'Radio Stations', 'Podcasts', 'Digital Media Platforms', 'Business Publications', 'Streaming Platforms']
}, {
  id: 'sp-experience',
  tier: 'Experience Partner',
  label: 'Premium Delegate Experience & Hospitality Partner',
  description: 'For hospitality, luxury, automotive, travel, wellness, beauty, lifestyle, and experiential brands seeking high-touch audience engagement, premium brand recall, and executive interaction opportunities.',
  highlights: ['Premium experiential activation zone', 'VIP lounge branding rights', 'Product sampling and curated hospitality integration', 'Interactive delegate engagement activations', 'Networking and lifestyle integration', 'Social amplification and experiential positioning'],
  idealFor: ['Hospitality Brands', 'Luxury & Automotive', 'Travel & Wellness', 'Lifestyle Brands', 'Experiential Agencies']
}, {
  id: 'sp-exhibition',
  tier: 'Premium Exhibition Partner',
  label: 'Executive Market Access Pavilion',
  description: "Position your organisation at the centre of Africa's entrepreneurial, investment, and innovation ecosystem with direct lead generation, commercial pipeline development, and investor ecosystem exposure.",
  highlights: ['Premium exhibition placement & branded activation', 'Lead capture integration', 'Investor and founder engagement access', 'Business matchmaking opportunities', 'Executive foot-traffic optimisation', 'Product showcase and service visibility'],
  idealFor: ['Financial Services', 'Technology Companies', 'Consulting Firms', 'Professional Services', 'Innovation Hubs']
}, {
  id: 'sp-panel',
  tier: 'Panel Sponsorship Partner',
  label: 'Industry Conversation Leadership Package',
  description: "Own and lead one of the summit's strategic high-impact industry conversations. Gain sector authority positioning, thought leadership visibility, and strategic narrative ownership.",
  highlights: ['Naming rights to panel session', 'Executive panel participation & stage branding', 'Moderator brand mention', 'Media interview opportunities', 'Themes: Funding | AI & Tech | VC & Investment | ESG | Digital Transformation | Township Enterprise | ESD | Women-Led Enterprise | Youth Entrepreneurship'],
  idealFor: ['Banks & DFIs', 'Technology Companies', 'Impact Investors', 'Government Agencies', 'Industry Bodies']
}, {
  id: 'sp-goodie',
  tier: 'Premium Goodie Bag Partner',
  label: 'Executive Brand Placement Package',
  description: 'Integrate your brand directly into the executive delegate experience with premium product placement, branded inserts, QR-enabled engagement, and high-value audience visibility.',
  highlights: ['Premium product placement within executive goodie bags', 'Branded inserts and catalogues', 'QR-enabled engagement opportunities', 'Exclusive promotional offers', 'Luxury sampling rights', 'Direct executive brand exposure'],
  idealFor: ['Consumer Brands', 'Luxury Products', 'Tech Accessories', 'Financial Products', 'FMCG Brands']
}];

// ─── Data: Why Partner ────────────────────────────────────────────────────────
const WHY_PARTNER_REASONS = [{
  id: 'wp-1',
  number: '01',
  title: "Access Africa's Funding & Innovation Ecosystem",
  description: "Connect directly with founders, investors, corporates, policymakers, innovators, DFIs, and high-growth entrepreneurs shaping Africa's economic future."
}, {
  id: 'wp-2',
  number: '02',
  title: 'Drive Measurable Commercial Outcomes',
  description: 'Generate strategic partnerships, qualified business leads, investment opportunities, ecosystem relationships, and measurable engagement outcomes.'
}, {
  id: 'wp-3',
  number: '03',
  title: 'Activate ESG, ESD & Transformation Capital',
  description: 'Align your organisation with inclusive economic growth, entrepreneurship development, innovation, and measurable impact priorities.'
}, {
  id: 'wp-4',
  number: '04',
  title: 'Shape Future Economy Conversations',
  description: "Position your organisation at the centre of strategic discussions influencing Africa's entrepreneurial, investment, innovation, and digital economy landscape."
}, {
  id: 'wp-5',
  number: '05',
  title: 'Build Long-Term Influence',
  description: 'Move beyond sponsorship into ecosystem leadership, influence capital, and sustained market positioning.'
}];

// ─── Partnership Tiers Section (Tabbed) ──────────────────────────────────────
const tabPanelVariants = {
  enter: {
    opacity: 0,
    y: 18,
    filter: 'blur(6px)'
  },
  center: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1] as const
    }
  },
  exit: {
    opacity: 0,
    y: -10,
    filter: 'blur(4px)',
    transition: {
      duration: 0.28,
      ease: [0.22, 1, 0.36, 1] as const
    }
  }
};
const benefitBreakdownVariants = {
  hidden: {
    opacity: 0,
    height: 0,
    overflow: 'hidden' as const
  },
  visible: {
    opacity: 1,
    height: 'auto',
    overflow: 'hidden' as const,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1] as const
    }
  },
  exit: {
    opacity: 0,
    height: 0,
    overflow: 'hidden' as const,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1] as const
    }
  }
};
const PartnershipTiersSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, {
    once: true,
    margin: '-80px 0px'
  });
  const [activeId, setActiveId] = useState('pt-official');
  const [benefitOpen, setBenefitOpen] = useState(false);
  const {
    isMobile,
    isTablet
  } = useBreakpoint();
  const hPad = isMobile ? '20px' : isTablet ? '40px' : '64px';
  // Heading style matching WhyPartner section
  const headingSize = isMobile ? 'clamp(28px, 8vw, 44px)' : isTablet ? 'clamp(32px, 5vw, 52px)' : 'clamp(36px, 4vw, 58px)';
  const activeTier = PARTNER_TIERS.find(t => t.id === activeId) ?? PARTNER_TIERS[0];
  const textSecondary = 'rgba(247,246,243,0.52)';
  const textMuted = 'rgba(247,246,243,0.28)';
  const tabColWidth = isMobile ? 0 : isTablet ? 180 : 240;
  const handleTabChange = (id: string) => {
    setActiveId(id);
    setBenefitOpen(false);
  };
  return <section ref={sectionRef} style={{
    background: '#141210',
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

    {/* Section Header */}
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: `${isMobile ? '80px' : isTablet ? '112px' : '144px'} ${hPad} ${isMobile ? '48px' : '72px'}`,
      position: 'relative',
      zIndex: 1,
      boxSizing: 'border-box'
    }}>
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
          textTransform: 'uppercase',
          color: 'rgba(247,246,243,0.35)',
          fontWeight: 500
        }}>Partnership Tiers</span>
      </motion.div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? '20px' : '80px',
        alignItems: 'flex-end'
      }}>
        <div>
          {/* h2 heading — matched to WhyPartner style: Inter / weight 200 / -2px tracking / 1.04 lh */}
          <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.1} style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: headingSize,
            fontWeight: 200,
            letterSpacing: '-2px',
            lineHeight: 1.04,
            color: '#F7F6F3',
            margin: 0
          }}>
            <span>{'Four tiers of '}</span>
            <em style={{
              fontStyle: 'italic',
              color: '#DE322D',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 300
            }}>{'strategic'}</em>
            <br />
            <span style={{
              color: 'rgba(247,246,243,0.18)',
              fontWeight: 300
            }}>{'ecosystem ownership.'}</span>
          </motion.h2>
        </div>
        <motion.p initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUpVariants} custom={0.28} style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: isMobile ? '14px' : '15px',
          lineHeight: '1.82',
          color: 'rgba(247,246,243,0.45)',
          margin: 0,
          fontWeight: 300
        }}>
          Designed in alignment with global best practices and leading international partnership architectures, these packages move beyond traditional sponsorship into strategic ecosystem ownership, executive influence, market access, and long-term brand relevance.
        </motion.p>
      </div>
    </div>

    {/* MOBILE: horizontal scrollable tab strip */}
    {isMobile && <div style={{
      position: 'relative',
      zIndex: 1
    }}>
        <div style={{
        padding: `0 ${hPad}`,
        boxSizing: 'border-box'
      }}>
          <div style={{
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          borderBottom: '1px solid rgba(247,246,243,0.1)'
        }}>
            <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '2px',
            minWidth: 'max-content',
            paddingBottom: '0'
          }}>
              {PARTNER_TIERS.map(tier => {
              const isActive = activeId === tier.id;
              return <button key={tier.id} onClick={() => handleTabChange(tier.id)} style={{
                position: 'relative',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '12px 14px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                flexShrink: 0,
                transition: 'opacity 0.2s ease'
              }}>
                  {isActive && <motion.div layoutId="tab-active-underline-mobile" style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: '#DE322D',
                  borderRadius: '1px'
                }} transition={{
                  duration: 0.35,
                  ease: [0.22, 1, 0.36, 1]
                }} />}
                  <span style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 600,
                  fontSize: '11px',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  color: isActive ? '#F7F6F3' : 'rgba(247,246,243,0.45)',
                  transition: 'color 0.25s ease',
                  whiteSpace: 'nowrap'
                }}>{tier.tabLabel}</span>
                  {tier.tabBadge && <span style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '8px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  padding: '3px 7px',
                  borderRadius: '4px',
                  background: tier.tabBadgeStyle === 'red' ? '#DE322D' : '#3c4d5d',
                  color: '#F7F6F3',
                  flexShrink: 0
                }}>{tier.tabBadge}</span>}
                </button>;
            })}
            </div>
          </div>
        </div>
      </div>}

    {/* DESKTOP/TABLET: vertical left tabs + right content */}
    {!isMobile && <div style={{
      position: 'relative',
      zIndex: 1,
      maxWidth: '1200px',
      margin: '0 auto',
      padding: `0 ${hPad}`,
      boxSizing: 'border-box'
    }}>
        <div style={{
        display: 'flex',
        gap: '0',
        alignItems: 'flex-start',
        borderTop: '1px solid rgba(247,246,243,0.08)'
      }}>
          {/* Left vertical tab column */}
          <div style={{
          width: `${tabColWidth}px`,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid rgba(247,246,243,0.08)',
          paddingTop: '8px',
          paddingBottom: '8px'
        }}>
            {PARTNER_TIERS.map(tier => {
            const isActive = activeId === tier.id;
            return <button key={tier.id} onClick={() => handleTabChange(tier.id)} style={{
              position: 'relative',
              background: isActive ? 'rgba(247,246,243,0.06)' : 'none',
              border: 'none',
              borderLeft: isActive ? '3px solid #DE322D' : '3px solid transparent',
              cursor: 'pointer',
              padding: isTablet ? '18px 20px 18px 17px' : '20px 28px 20px 21px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '7px',
              textAlign: 'left',
              transition: 'background 0.2s ease, border-color 0.2s ease',
              boxSizing: 'border-box',
              width: '100%'
            }} onMouseEnter={e => {
              if (!isActive) {
                const btn = e.currentTarget as HTMLButtonElement;
                btn.style.background = 'rgba(247,246,243,0.03)';
              }
            }} onMouseLeave={e => {
              if (!isActive) {
                const btn = e.currentTarget as HTMLButtonElement;
                btn.style.background = 'none';
              }
            }}>
                <span style={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 600,
                fontSize: '13px',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: isActive ? '#F7F6F3' : 'rgba(247,246,243,0.35)',
                transition: 'color 0.25s ease',
                lineHeight: 1.2
              }}>{tier.tabLabel}</span>
                {tier.tabBadge && <span style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '8px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: '3px 7px',
                borderRadius: '4px',
                background: tier.tabBadgeStyle === 'red' ? '#DE322D' : '#3c4d5d',
                color: '#F7F6F3',
                flexShrink: 0
              }}>{tier.tabBadge}</span>}
              </button>;
          })}
          </div>

          {/* Right content panel */}
          <div style={{
          flex: 1,
          minWidth: 0
        }}>
            <AnimatePresence mode="wait">
              <motion.div key={activeId} variants={tabPanelVariants} initial="enter" animate="center" exit="exit" style={{
              width: '100%'
            }}>
                <div style={{
                padding: `${isTablet ? '40px' : '56px'} ${isTablet ? '32px' : '48px'} ${isTablet ? '48px' : '72px'}`,
                boxSizing: 'border-box'
              }}>
                  {/* Top: tier meta + label + description */}
                  <div style={{
                  display: 'grid',
                  gridTemplateColumns: isTablet ? '1fr' : '1fr 1fr',
                  gap: isTablet ? '24px' : '64px',
                  marginBottom: isTablet ? '40px' : '56px'
                }}>
                    <div>
                      <div style={{
                      fontFamily: 'Montserrat, sans-serif',
                      fontSize: '10px',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: '#DE322D',
                      fontWeight: 600,
                      marginBottom: '12px'
                    }}>{activeTier.tier}</div>
                      <h3 style={{
                      fontFamily: 'Montserrat, sans-serif',
                      fontSize: isTablet ? '17px' : 'clamp(17px, 1.7vw, 22px)',
                      fontWeight: 600,
                      letterSpacing: '-0.4px',
                      lineHeight: 1.15,
                      color: '#F7F6F3',
                      margin: '0 0 18px'
                    }}>{activeTier.label}</h3>
                      <p style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                      lineHeight: '1.85',
                      color: textSecondary,
                      margin: 0,
                      fontWeight: 300
                    }}>{activeTier.description}</p>
                    </div>
                    <div>
                      <div style={{
                      fontFamily: 'Montserrat, sans-serif',
                      fontSize: '10px',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: '#DE322D',
                      fontWeight: 700,
                      marginBottom: '16px'
                    }}>Return on Partnership</div>
                      <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '7px 24px'
                    }}>
                        {activeTier.roiBullets.map((bullet, bi) => <div key={`roi-${activeTier.id}-${bi}`} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '8px'
                      }}>
                          <span style={{
                          marginTop: '3px',
                          flexShrink: 0
                        }}><CheckIcon /></span>
                          <span style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '13px',
                          lineHeight: '1.6',
                          color: textSecondary,
                          fontWeight: 300
                        }}>{bullet}</span>
                        </div>)}
                      </div>
                    </div>
                  </div>

                  {/* Benefit Breakdown — hidden by default */}
                  <div style={{
                  borderTop: '1px solid rgba(247,246,243,0.08)',
                  paddingTop: isTablet ? '32px' : '44px',
                  marginBottom: isTablet ? '32px' : '44px'
                }}>
                    <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: benefitOpen ? '24px' : '0'
                  }}>
                      <div style={{
                      fontFamily: 'Montserrat, sans-serif',
                      fontSize: '10px',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: 'rgba(247,246,243,0.28)',
                      fontWeight: 700
                    }}>Benefit Breakdown</div>
                      <button onClick={() => setBenefitOpen(v => !v)} style={{
                      background: 'none',
                      border: '1px solid rgba(247,246,243,0.2)',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      padding: '6px 14px',
                      fontFamily: 'Montserrat, sans-serif',
                      fontSize: '12px',
                      fontWeight: 600,
                      letterSpacing: '0.04em',
                      color: '#F7F6F3',
                      transition: 'border-color 0.2s ease, background 0.2s ease',
                      whiteSpace: 'nowrap'
                    }} onMouseEnter={e => {
                      const btn = e.currentTarget as HTMLButtonElement;
                      btn.style.borderColor = 'rgba(247,246,243,0.45)';
                      btn.style.background = 'rgba(247,246,243,0.06)';
                    }} onMouseLeave={e => {
                      const btn = e.currentTarget as HTMLButtonElement;
                      btn.style.borderColor = 'rgba(247,246,243,0.2)';
                      btn.style.background = 'none';
                    }}>
                        <span>{benefitOpen ? 'Hide Benefit Breakdown' : 'View Benefit Breakdown'}</span>
                      </button>
                    </div>
                    <AnimatePresence initial={false}>
                      {benefitOpen && <motion.div key="benefit-breakdown" variants={benefitBreakdownVariants} initial="hidden" animate="visible" exit="exit">
                          <div style={{
                        display: 'grid',
                        gridTemplateColumns: isTablet ? 'repeat(2, 1fr)' : 'repeat(5, 1fr)',
                        gap: isTablet ? '28px' : '20px'
                      }}>
                            {activeTier.benefitGroups.map((group, gi) => <div key={`bg-${activeTier.id}-${gi}`}>
                              <div style={{
                            fontFamily: 'Montserrat, sans-serif',
                            fontSize: '10px',
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            fontWeight: 700,
                            color: '#DE322D',
                            marginBottom: '14px',
                            paddingBottom: '10px',
                            borderBottom: '1px solid rgba(222,50,45,0.2)'
                          }}>{group.heading}</div>
                              <ul style={{
                            listStyle: 'none',
                            margin: 0,
                            padding: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px'
                          }}>
                                {group.items.map((item, ii) => <li key={`item-${activeTier.id}-${gi}-${ii}`} style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '8px'
                            }}>
                                  <span style={{
                                marginTop: '3px',
                                flexShrink: 0
                              }}><CheckIcon /></span>
                                  <span style={{
                                fontFamily: 'Inter, sans-serif',
                                fontSize: '12px',
                                lineHeight: '1.65',
                                color: textSecondary,
                                fontWeight: 300
                              }}>{item}</span>
                                </li>)}
                              </ul>
                            </div>)}
                          </div>
                        </motion.div>}
                    </AnimatePresence>
                  </div>

                  {/* Ideal For */}
                  <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flexWrap: 'wrap'
                }}>
                    <span style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '9px',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: textMuted,
                    fontWeight: 600,
                    flexShrink: 0
                  }}>Ideal for</span>
                    {activeTier.idealFor.map((org, oi) => <span key={`ideal-${activeTier.id}-${oi}`} style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '11px',
                    padding: '4px 12px',
                    background: 'rgba(60,77,93,0.7)',
                    borderRadius: '100px',
                    color: '#F7F6F3',
                    border: '1px solid rgba(247,246,243,0.12)',
                    letterSpacing: '0.01em'
                  }}>{org}</span>)}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>}

    {/* MOBILE: content panel below tabs */}
    {isMobile && <div style={{
      position: 'relative',
      zIndex: 1,
      minHeight: '520px'
    }}>
        <AnimatePresence mode="wait">
          <motion.div key={activeId} variants={tabPanelVariants} initial="enter" animate="center" exit="exit" style={{
          width: '100%'
        }}>
            <div style={{
            padding: `40px ${hPad} 48px`,
            boxSizing: 'border-box'
          }}>
              {/* Top: tier meta + label + description */}
              <div style={{
              marginBottom: '40px'
            }}>
                <div style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '10px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#DE322D',
                fontWeight: 600,
                marginBottom: '12px'
              }}>{activeTier.tier}</div>
                <h3 style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '17px',
                fontWeight: 600,
                letterSpacing: '-0.4px',
                lineHeight: 1.15,
                color: '#F7F6F3',
                margin: '0 0 18px'
              }}>{activeTier.label}</h3>
                <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                lineHeight: '1.85',
                color: textSecondary,
                margin: '0 0 28px',
                fontWeight: 300
              }}>{activeTier.description}</p>
                <div style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '10px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#DE322D',
                fontWeight: 700,
                marginBottom: '14px'
              }}>Return on Partnership</div>
                <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '7px'
              }}>
                  {activeTier.roiBullets.map((bullet, bi) => <div key={`roi-m-${activeTier.id}-${bi}`} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}>
                    <span style={{
                    marginTop: '3px',
                    flexShrink: 0
                  }}><CheckIcon /></span>
                    <span style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '13px',
                    lineHeight: '1.6',
                    color: textSecondary,
                    fontWeight: 300
                  }}>{bullet}</span>
                  </div>)}
                </div>
              </div>

              {/* Benefit Breakdown — hidden by default (mobile) */}
              <div style={{
              borderTop: '1px solid rgba(247,246,243,0.08)',
              paddingTop: '32px',
              marginBottom: '32px'
            }}>
                <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: benefitOpen ? '24px' : '0'
              }}>
                  <div style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '10px',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'rgba(247,246,243,0.28)',
                  fontWeight: 700
                }}>Benefit Breakdown</div>
                  <button onClick={() => setBenefitOpen(v => !v)} style={{
                  background: 'none',
                  border: '1px solid rgba(247,246,243,0.2)',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  padding: '6px 12px',
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  color: '#F7F6F3',
                  whiteSpace: 'nowrap'
                }}>
                    <span>{benefitOpen ? 'Hide Benefit Breakdown' : 'View Benefit Breakdown'}</span>
                  </button>
                </div>
                <AnimatePresence initial={false}>
                  {benefitOpen && <motion.div key="benefit-breakdown-mobile" variants={benefitBreakdownVariants} initial="hidden" animate="visible" exit="exit">
                      <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '28px'
                  }}>
                        {activeTier.benefitGroups.map((group, gi) => <div key={`bg-m-${activeTier.id}-${gi}`}>
                          <div style={{
                        fontFamily: 'Montserrat, sans-serif',
                        fontSize: '10px',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        fontWeight: 700,
                        color: '#DE322D',
                        marginBottom: '14px',
                        paddingBottom: '10px',
                        borderBottom: '1px solid rgba(222,50,45,0.2)'
                      }}>{group.heading}</div>
                          <ul style={{
                        listStyle: 'none',
                        margin: 0,
                        padding: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}>
                            {group.items.map((item, ii) => <li key={`item-m-${activeTier.id}-${gi}-${ii}`} style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '8px'
                        }}>
                              <span style={{
                            marginTop: '3px',
                            flexShrink: 0
                          }}><CheckIcon /></span>
                              <span style={{
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '12px',
                            lineHeight: '1.65',
                            color: textSecondary,
                            fontWeight: 300
                          }}>{item}</span>
                            </li>)}
                          </ul>
                        </div>)}
                      </div>
                    </motion.div>}
                </AnimatePresence>
              </div>

              {/* Ideal For */}
              <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flexWrap: 'wrap'
            }}>
                <span style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '9px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: textMuted,
                fontWeight: 600,
                flexShrink: 0
              }}>Ideal for</span>
                {activeTier.idealFor.map((org, oi) => <span key={`ideal-m-${activeTier.id}-${oi}`} style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '11px',
                padding: '4px 12px',
                background: 'rgba(60,77,93,0.7)',
                borderRadius: '100px',
                color: '#F7F6F3',
                border: '1px solid rgba(247,246,243,0.12)',
                letterSpacing: '0.01em'
              }}>{org}</span>)}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>}
  </section>;
};

// ─── Specialised Packages Section ────────────────────────────────────────────
const SP_ACCENT_COLS = ['#3c4d5d', '#DE322D', '#3c4d5d', '#DE322D', '#3c4d5d'];
const SP_ICONS_LIGHT = [<svg key="il-media" width="36" height="36" viewBox="0 0 36 36" fill="none">
    <circle cx="18" cy="18" r="13" stroke="#F7F6F3" strokeWidth="1.6" />
    <circle cx="18" cy="18" r="5" fill="#F7F6F3" opacity="0.2" />
    <path d="M10 18c0-4.4 3.6-8 8-8" stroke="#F7F6F3" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M26 18c0 4.4-3.6 8-8 8" stroke="#F7F6F3" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="18" cy="18" r="2" fill="#F7F6F3" />
  </svg>, <svg key="il-exp" width="36" height="36" viewBox="0 0 36 36" fill="none">
    <path d="M18 5L22 13L31 14.5L24.5 21L26 29L18 25L10 29L11.5 21L5 14.5L14 13L18 5Z" stroke="#F7F6F3" strokeWidth="1.6" strokeLinejoin="round" />
  </svg>, <svg key="il-exhibit" width="36" height="36" viewBox="0 0 36 36" fill="none">
    <rect x="5" y="16" width="10" height="14" rx="1.5" stroke="#F7F6F3" strokeWidth="1.6" />
    <rect x="21" y="10" width="10" height="20" rx="1.5" stroke="#F7F6F3" strokeWidth="1.6" />
    <path d="M5 30h26" stroke="#F7F6F3" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M13 16V10l5-5 5 5v6" stroke="#F7F6F3" strokeWidth="1.6" strokeLinejoin="round" />
  </svg>, <svg key="il-panel" width="36" height="36" viewBox="0 0 36 36" fill="none">
    <rect x="5" y="7" width="26" height="17" rx="2.5" stroke="#F7F6F3" strokeWidth="1.6" />
    <path d="M13 30l5-5 5 5" stroke="#F7F6F3" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11 15h14M11 11h7" stroke="#F7F6F3" strokeWidth="1.6" strokeLinecap="round" />
  </svg>, <svg key="il-goodie" width="36" height="36" viewBox="0 0 36 36" fill="none">
    <path d="M9 15h18l-2.5 15H11.5L9 15Z" stroke="#F7F6F3" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M6 15h24" stroke="#F7F6F3" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M14 15c0-4 8-4 8 0" stroke="#F7F6F3" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M18 20v5" stroke="#F7F6F3" strokeWidth="1.6" strokeLinecap="round" />
  </svg>];
const PANEL_THEMES = ['Funding', 'AI & Tech', 'VC & Investment', 'ESG', 'Digital Transformation', 'Township Enterprise', 'ESD', 'Women-Led Enterprise', 'Youth Entrepreneurship'];
const SpecialisedPackagesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, {
    once: true,
    margin: '-80px 0px'
  });
  const {
    isMobile,
    isTablet
  } = useBreakpoint();
  const hPad = isMobile ? '20px' : isTablet ? '40px' : '64px';
  // Heading style matching WhyPartner section
  const headingSize = isMobile ? 'clamp(28px, 8vw, 44px)' : isTablet ? 'clamp(32px, 5vw, 52px)' : 'clamp(36px, 4vw, 58px)';
  return <section ref={sectionRef} style={{
    background: '#F4F1EB',
    padding: isMobile ? '80px 0' : isTablet ? '112px 0' : '144px 0',
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
      opacity: 0.3
    }} />
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: `0 ${hPad}`,
      position: 'relative',
      zIndex: 1,
      boxSizing: 'border-box'
    }}>
      {/* Header */}
      <div style={{
        marginBottom: isMobile ? '52px' : '80px'
      }}>
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
          }}>Specialised Packages</span>
        </motion.div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? '20px' : '64px',
          alignItems: 'flex-end'
        }}>
          <div>
            {/* h2 heading — matched to WhyPartner style: Inter / weight 200 / -2px tracking / 1.04 lh */}
            <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.1} style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: headingSize,
              fontWeight: 200,
              letterSpacing: '-2px',
              lineHeight: 1.04,
              color: '#141210',
              margin: 0
            }}>
              <span>{'Five purpose-built '}</span>
              <em style={{
                fontStyle: 'italic',
                color: '#DE322D',
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 300
              }}>{'packages.'}</em>
              <br />
              <span style={{
                color: 'rgba(20,18,16,0.2)',
                fontWeight: 300
              }}>{'One summit.'}</span>
            </motion.h2>
          </div>
          <motion.p initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUpVariants} custom={0.28} style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: isMobile ? '14px' : '15px',
            lineHeight: '1.8',
            color: 'rgba(20,18,16,0.55)',
            margin: 0,
            fontWeight: 300
          }}>
            Targeted partnership opportunities beyond the main tiers — designed for specific brand objectives, commercial goals, and activation strategies.
          </motion.p>
        </div>
      </div>

      {/* Magazine Strip Cards */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {SPECIALISED_PACKAGES.map((pkg, i) => {
          const accentCol = SP_ACCENT_COLS[i];
          const isRedAccent = accentCol === '#DE322D';
          const isPanelPkg = pkg.id === 'sp-panel';
          return <motion.div key={pkg.id} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={clipReveal} custom={i * 0.1} style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : `${isTablet ? '160px' : '220px'} 1fr`,
            borderRadius: '18px',
            overflow: 'hidden',
            border: '1px solid rgba(20,18,16,0.1)',
            boxSizing: 'border-box',
            transition: 'box-shadow 0.3s ease, border-color 0.3s ease'
          }} onMouseEnter={e => {
            (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 40px rgba(60,77,93,0.22)';
            (e.currentTarget as HTMLDivElement).style.borderColor = '#3c4d5d';
          }} onMouseLeave={e => {
            (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
            (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(20,18,16,0.1)';
          }}>
            {/* LEFT accent column */}
            {!isMobile && <div style={{
              background: accentCol,
              padding: isTablet ? '36px 24px' : '44px 32px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
              minHeight: '220px'
            }}>
              <div aria-hidden="true" style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: NOISE_SVG,
                backgroundRepeat: 'repeat',
                backgroundSize: '128px 128px',
                pointerEvents: 'none',
                opacity: 0.55
              }} />
              <div aria-hidden="true" style={{
                position: 'absolute',
                bottom: '-16px',
                right: '-10px',
                fontFamily: 'Montserrat, sans-serif',
                fontSize: isTablet ? '100px' : '130px',
                fontWeight: 800,
                letterSpacing: '-6px',
                lineHeight: 1,
                color: 'rgba(255,255,255,0.06)',
                pointerEvents: 'none',
                userSelect: 'none'
              }}>{String(i + 1).padStart(2, '0')}</div>
              <div style={{
                position: 'relative',
                zIndex: 1
              }}>
                <div style={{
                  marginBottom: '20px'
                }}>{SP_ICONS_LIGHT[i]}</div>
                <span style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: isTablet ? '13px' : '15px',
                  fontWeight: 700,
                  color: '#F7F6F3',
                  letterSpacing: '-0.3px',
                  lineHeight: 1.2,
                  display: 'block'
                }}>{pkg.tier}</span>
              </div>
              <div style={{
                position: 'relative',
                zIndex: 1
              }}>
                <span style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: isTablet ? '28px' : '40px',
                  fontWeight: 800,
                  letterSpacing: '-3px',
                  color: 'rgba(247,246,243,0.12)',
                  lineHeight: 1
                }}>{String(i + 1).padStart(2, '0')}</span>
              </div>
            </div>}

            {/* RIGHT content area */}
            <div style={{
              background: '#FFFFFF',
              padding: isMobile ? '28px 24px' : isTablet ? '32px 28px' : '40px 44px',
              display: 'flex',
              flexDirection: 'column',
              gap: isMobile ? '16px' : '20px'
            }}>
              {isMobile && <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '4px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: accentCol,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {SP_ICONS_LIGHT[i]}
                </div>
                <span style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '10px',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: isRedAccent ? '#DE322D' : '#3c4d5d',
                  fontWeight: 600
                }}>{pkg.tier}</span>
              </div>}

              {!isMobile && <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '-4px'
              }}>
                <span style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '10px',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: isRedAccent ? '#DE322D' : '#3c4d5d',
                  fontWeight: 600
                }}>{pkg.tier}</span>
              </div>}

              {/* h3 label — matched to WhyPartner reason titles */}
              <h3 style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: isMobile ? '17px' : 'clamp(17px, 1.7vw, 22px)',
                fontWeight: 600,
                letterSpacing: '-0.4px',
                lineHeight: 1.15,
                color: '#141210',
                margin: 0
              }}>{pkg.label}</h3>

              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
                lineHeight: '1.78',
                color: 'rgba(20,18,16,0.6)',
                margin: 0,
                fontWeight: 300
              }}>{pkg.description}</p>

              {/* 2-column includes list */}
              <div>
                <div style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '9px',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'rgba(20,18,16,0.35)',
                  fontWeight: 700,
                  marginBottom: '10px'
                }}>Includes</div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                  gap: '6px 24px'
                }}>
                  {pkg.highlights.map((h, hi) => <div key={`h-${pkg.id}-${hi}`} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '7px'
                  }}>
                    <span style={{
                      marginTop: '2px',
                      flexShrink: 0
                    }}><CheckIcon /></span>
                    <span style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '12px',
                      lineHeight: '1.6',
                      color: 'rgba(20,18,16,0.55)',
                      fontWeight: 300
                    }}>{h}</span>
                  </div>)}
                </div>
              </div>

              {/* Panel themes tag cloud */}
              {isPanelPkg && <div>
                <div style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '9px',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'rgba(20,18,16,0.35)',
                  fontWeight: 700,
                  marginBottom: '8px'
                }}>Conversation Themes</div>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '6px'
                }}>
                  {PANEL_THEMES.map((theme, ti) => <span key={`pt-${ti}`} style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '11px',
                    padding: '4px 10px',
                    background: '#3c4d5d',
                    borderRadius: '100px',
                    color: '#F7F6F3',
                    letterSpacing: '0.01em',
                    fontWeight: 500
                  }}>{theme}</span>)}
                </div>
              </div>}

              {/* Ideal for */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                flexWrap: 'wrap',
                paddingTop: '14px',
                borderTop: '1px solid rgba(20,18,16,0.07)'
              }}>
                <span style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '9px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'rgba(20,18,16,0.3)',
                  fontWeight: 600,
                  flexShrink: 0
                }}>Ideal for</span>
                {pkg.idealFor.map((org, oi) => <span key={`io-${pkg.id}-${oi}`} style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '10px',
                  padding: '3px 10px',
                  background: '#3c4d5d',
                  borderRadius: '100px',
                  color: '#F7F6F3',
                  letterSpacing: '0.01em'
                }}>{org}</span>)}
              </div>
            </div>
          </motion.div>;
        })}
      </div>
    </div>
  </section>;
};

// ─── Why Partner Section ──────────────────────────────────────────────────────
const WhyPartnerSection = () => {
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
    background: '#F4F1EB',
    padding: isMobile ? '80px 0' : isTablet ? '112px 0' : '144px 0',
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
      padding: hPad,
      position: 'relative',
      zIndex: 1
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr' : '420px 1fr',
        gap: isMobile ? '48px' : '80px',
        alignItems: 'flex-start'
      }}>
        <div style={{
          position: isMobile || isTablet ? 'static' : 'sticky',
          top: '120px'
        }}>
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
            }}>Why Partner</span>
          </motion.div>
          <div style={{
            overflow: 'hidden'
          }}>
            <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.1} style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: headingSize,
              fontWeight: 200,
              letterSpacing: '-2px',
              lineHeight: 1.04,
              color: '#141210',
              margin: '0 0 24px'
            }}>
              <span>{'Why leading'}</span>
              <br />
              <em style={{
                fontStyle: 'italic',
                color: '#DE322D',
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 300
              }}>{'brands'}</em>
              <span style={{
                color: 'rgba(20,18,16,0.22)'
              }}>{' partner'}</span>
              <br />
              <span style={{
                color: 'rgba(20,18,16,0.22)'
              }}>{'with us.'}</span>
            </motion.h2>
          </div>
          <motion.p initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUpVariants} custom={0.28} style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: isMobile ? '14px' : '15px',
            lineHeight: '1.82',
            color: 'rgba(20,18,16,0.55)',
            margin: 0,
            fontWeight: 300
          }}>
            Five strategic reasons why the continent's most forward-thinking organisations choose EmpowaEntrepreneurs as their platform for ecosystem ownership.
          </motion.p>
        </div>
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideFromRight} custom={0.18} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0'
        }}>
          {WHY_PARTNER_REASONS.map((reason, i) => <motion.div key={reason.id} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUpVariants} custom={0.15 + i * 0.1} style={{
            display: 'grid',
            gridTemplateColumns: '64px 1fr',
            gap: '24px',
            alignItems: 'flex-start',
            padding: isMobile ? '28px 0' : '36px 0',
            borderBottom: i < WHY_PARTNER_REASONS.length - 1 ? '1px solid rgba(20,18,16,0.08)' : 'none'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '6px'
            }}>
              <span style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: 'clamp(28px, 3.5vw, 44px)',
                fontWeight: 200,
                letterSpacing: '-2px',
                color: 'rgba(20,18,16,0.12)',
                lineHeight: 1
              }}>{reason.number}</span>
            </div>
            <div>
              <h3 style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: isMobile ? '17px' : 'clamp(17px, 1.7vw, 22px)',
                fontWeight: 600,
                letterSpacing: '-0.4px',
                lineHeight: 1.15,
                color: '#141210',
                margin: '0 0 10px'
              }}>{reason.title}</h3>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                lineHeight: '1.8',
                color: 'rgba(20,18,16,0.58)',
                margin: 0,
                fontWeight: 300
              }}>{reason.description}</p>
            </div>
          </motion.div>)}
        </motion.div>
      </div>
    </div>
  </section>;
};

// ─── CTA Section ──────────────────────────────────────────────────────────────
const CtaSection = () => {
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
  const magneticBtn = useMagnetic(0.28);
  return <section ref={sectionRef} style={{
    background: '#141210',
    padding: isMobile ? '80px 0' : isTablet ? '120px 0' : '160px 0',
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
      fontSize: 'clamp(60px, 12vw, 200px)',
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
        }}>Partner with Us</span>
      </motion.div>
      <div style={{
        overflow: 'hidden',
        marginBottom: isMobile ? '16px' : '24px'
      }}>
        <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.1} style={{
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: 200,
          fontSize: isMobile ? 'clamp(44px, 12vw, 68px)' : 'clamp(52px, 7vw, 112px)',
          lineHeight: 0.91,
          letterSpacing: isMobile ? '-2px' : '-4px',
          color: '#F7F6F3',
          margin: 0
        }}>
          <span>{"Don't Just"}</span><br />
          <em style={{
            fontStyle: 'italic',
            color: '#DE322D',
            fontWeight: 300
          }}>{'Sponsor'}</em>
          <br />
          <span style={{
            color: 'rgba(247,246,243,0.18)',
            fontWeight: 300
          }}>{'The Future.'}</span>
        </motion.h2>
      </div>
      <motion.p initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUpVariants} custom={0.28} style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: isMobile ? '16px' : '22px',
        lineHeight: '1.55',
        color: 'rgba(247,246,243,0.65)',
        margin: '0 0 16px',
        fontWeight: 300,
        maxWidth: '540px'
      }}>
        Help Fund It. Build It. <em style={{
          color: '#DE322D',
          fontStyle: 'italic'
        }}>Lead It.</em>
      </motion.p>
      <motion.p initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUpVariants} custom={0.36} style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: isMobile ? '14px' : '15px',
        lineHeight: '1.8',
        color: 'rgba(247,246,243,0.42)',
        margin: '0 0 48px',
        fontWeight: 300,
        maxWidth: '480px'
      }}>
        Secure your partnership position at Africa's most consequential capital-access and entrepreneurial innovation summit. Limited strategic partnerships available.
      </motion.p>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <motion.div ref={magneticBtn.ref} onMouseMove={magneticBtn.handleMouseMove} onMouseLeave={magneticBtn.handleMouseLeave} style={{
          x: magneticBtn.springX,
          y: magneticBtn.springY,
          display: 'inline-flex'
        }}>
          <motion.a href="#" onClick={e => { e.preventDefault(); window.dispatchEvent(new CustomEvent('openPartnershipModal')); }} whileHover={{
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
            padding: isMobile ? '13px 22px' : '17px 34px',
            fontSize: '13px',
            letterSpacing: '0.05em',
            color: '#fff',
            textDecoration: 'none',
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 600,
            boxShadow: '0 8px 36px rgba(222,50,45,0.55)'
          }}>
            <span>Become a Partner</span><ArrowIconDark />
          </motion.a>
        </motion.div>
        <motion.a href="#" onClick={e => e.preventDefault()} whileHover={{
          scale: 1.04
        }} whileTap={{
          scale: 0.97
        }} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          border: '1px solid rgba(247,246,243,0.22)',
          borderRadius: '44px',
          padding: isMobile ? '13px 18px' : '17px 28px',
          fontSize: '13px',
          letterSpacing: '0.04em',
          color: 'rgba(247,246,243,0.72)',
          textDecoration: 'none',
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: 600,
          transition: 'border-color 0.3s ease, color 0.3s ease'
        }} onMouseEnter={e => {
          const el = e.currentTarget as HTMLAnchorElement;
          el.style.borderColor = 'rgba(247,246,243,0.5)';
          el.style.color = '#F7F6F3';
        }} onMouseLeave={e => {
          const el = e.currentTarget as HTMLAnchorElement;
          el.style.borderColor = 'rgba(247,246,243,0.22)';
          el.style.color = 'rgba(247,246,243,0.72)';
        }}>
          <DownloadIcon /><span>Download Partnership Deck</span>
        </motion.a>
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
        {[{
          id: 'ci-1',
          label: 'Summit Date',
          value: 'May 28, 2026',
          sub: 'EmpowaWorx House · Johannesburg'
        }, {
          id: 'ci-2',
          label: 'Partnership Enquiries',
          value: 'partnerships@empowa.co',
          sub: 'Direct partnership enquiries'
        }, {
          id: 'ci-3',
          label: 'Status',
          value: 'Now Open',
          sub: 'Limited strategic partnerships available'
        }].map((item, i) => <div key={item.id} style={{
          padding: isMobile ? '20px 0' : '28px 32px',
          borderLeft: !isMobile && i > 0 ? '0.8px solid rgba(247,246,243,0.07)' : 'none',
          borderTop: isMobile && i > 0 ? '0.8px solid rgba(247,246,243,0.07)' : 'none',
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
            fontSize: isMobile ? '14px' : '17px',
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
const FOOTER_BANNER_BG = 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=1800&q=80';
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
  const footerHeroFontSize = isMobile ? 'clamp(40px, 11vw, 60px)' : isTablet ? 'clamp(48px, 7.5vw, 80px)' : 'clamp(56px, 6.5vw, 96px)';
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
      minHeight: isMobile ? '360px' : isTablet ? '440px' : '520px',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'flex-end',
      background: '#0A0906'
    }}>
      {/* Background image */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${FOOTER_BANNER_BG})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        pointerEvents: 'none'
      }} />
      {/* Gradient overlay */}
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
          }}>Funding Summit 2026 · Africa's Capital Access Platform</span>
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
            minWidth: isMobile ? '100%' : isTablet ? '220px' : '240px',
            width: isMobile ? '100%' : 'auto'
          }}>
            <motion.a href="#" onClick={e => { e.preventDefault(); window.dispatchEvent(new CustomEvent('openPartnershipModal')); }} whileHover={{
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
              <span>Become a Partner</span><ArrowIconDark />
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
              <span>Download Partnership Deck</span>
            </motion.a>
          </motion.div>
        </div>
      </div>
    </div>
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
              <svg width="13" height="13" viewBox="0 0 12 12" fill="none"><path d="M6 1L7.5 4.5L11 5L8.5 7.5L9 11L6 9.5L3 11L3.5 7.5L1 5L4.5 4.5L6 1Z" fill="white" /></svg>
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
          }}>Africa's premier capital-access summit. Where vetted entrepreneurs meet high-impact funders.</p>
        </div>
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
        alignItems: isMobile ? 'flex-start' : 'center',
        gap: '16px',
        padding: '24px 0 40px'
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
          }}>{item.label}</a>)}
        </div>
      </div>
    </div>
  </footer>;
};

// ─── PartnershipsPage ─────────────────────────────────────────────────────────
export const PartnershipsPage = () => {
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
    <PartnershipTiersSection />
    <SpecialisedPackagesSection />
    <WhyPartnerSection />
    <CtaSection />
    {isModalOpen && <PartnershipEnquiryModal onClose={() => setIsModalOpen(false)} />}
  </div>;
};