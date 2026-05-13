import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView, useAnimationFrame, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';

// ─── Noise texture ──────────────────────────────────────────────────────────────
const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`;

// ─── Responsive hook ────────────────────────────────────────────────────────────
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

// ─── Magnetic hover hook ────────────────────────────────────────────────────────
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

// ─── Shared SVG helpers ─────────────────────────────────────────────────────────
const PlusSquareIconLight = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M16.25 2.5H3.75C3.41848 2.5 3.10054 2.6317 2.86612 2.86612C2.6317 3.10054 2.5 3.41848 2.5 3.75V16.25C2.5 16.5815 2.6317 16.8995 2.86612 17.1339C3.10054 17.3683 3.41848 17.5 3.75 17.5H16.25C16.5815 17.5 16.8995 17.3683 17.1339 17.1339C17.3683 16.8995 17.5 16.5815 17.5 16.25V3.75C17.5 3.41848 17.3683 3.10054 17.1339 2.86612C16.8995 2.6317 16.5815 2.5 16.25 2.5ZM13.125 10.625H10.625V13.125C10.625 13.2908 10.5592 13.4497 10.4419 13.5669C10.3247 13.6842 10.1658 13.75 10 13.75C9.83424 13.75 9.67527 13.6842 9.55806 13.5669C9.44085 13.4497 9.375 13.2908 9.375 13.125V10.625H6.875C6.70924 10.625 6.55027 10.5592 6.43306 10.4419C6.31585 10.3247 6.25 10.1658 6.25 10C6.25 9.83424 6.31585 9.67527 6.43306 9.55806C6.55027 9.44085 6.70924 9.375 6.875 9.375H9.375V6.875C9.375 6.70924 9.44085 6.55027 9.55806 6.43306C9.67527 6.31585 9.83424 6.25 10 6.25C10.1658 6.25 10.3247 6.31585 10.4419 6.43306C10.5592 6.55027 10.625 6.70924 10.625 6.875V9.375H13.125C13.2908 9.375 13.4497 9.44085 13.5669 9.55806C13.6842 9.67527 13.75 9.83424 13.75 10C13.75 10.1658 13.6842 10.3247 13.5669 10.4419C13.4497 10.5592 13.2908 10.625 13.125 10.625Z" fill="rgba(247,246,243,0.35)" />
  </svg>;
const PlusSquareIcon = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M16.25 2.5H3.75C3.41848 2.5 3.10054 2.6317 2.86612 2.86612C2.6317 3.10054 2.5 3.41848 2.5 3.75V16.25C2.5 16.5815 2.6317 16.8995 2.86612 17.1339C3.10054 17.3683 3.41848 17.5 3.75 17.5H16.25C16.5815 17.5 16.8995 17.3683 17.1339 17.1339C17.3683 16.8995 17.5 16.5815 17.5 16.25V3.75C17.5 3.41848 17.3683 3.10054 17.1339 2.86612C16.8995 2.6317 16.5815 2.5 16.25 2.5ZM13.125 10.625H10.625V13.125C10.625 13.2908 10.5592 13.4497 10.4419 13.5669C10.3247 13.6842 10.1658 13.75 10 13.75C9.83424 13.75 9.67527 13.6842 9.55806 13.5669C9.44085 13.4497 9.375 13.2908 9.375 13.125V10.625H6.875C6.70924 10.625 6.55027 10.5592 6.43306 10.4419C6.31585 10.3247 6.25 10.1658 6.25 10C6.25 9.83424 6.31585 9.67527 6.43306 9.55806C6.55027 9.44085 6.70924 9.375 6.875 9.375H9.375V6.875C9.375 6.70924 9.44085 6.55027 9.55806 6.43306C9.67527 6.31585 9.83424 6.25 10 6.25C10.1658 6.25 10.3247 6.31585 10.4419 6.43306C10.5592 6.55027 10.625 6.70924 10.625 6.875V9.375H13.125C13.2908 9.375 13.4497 9.44085 13.5669 9.55806C13.6842 9.67527 13.75 9.83424 13.75 10C13.75 10.1658 13.6842 10.3247 13.5669 10.4419C13.4497 10.5592 13.2908 10.625 13.125 10.625Z" fill="#DE322D" />
  </svg>;
const ArrowIconDark = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 12L12 2M12 2H4M12 2V10" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;

// ─── Animation variants ──────────────────────────────────────────────────────────
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

// ─── Scroll Progress Bar ─────────────────────────────────────────────────────────
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

// ─── Ticker ──────────────────────────────────────────────────────────────────────
const TICKER_ITEMS = [{
  id: 'tk-1',
  label: 'The Funding Corner'
}, {
  id: 'tk-2',
  label: 'Women Only Dealmaker Room'
}, {
  id: 'tk-3',
  label: "Dragons' Den Pitching Festival"
}, {
  id: 'tk-4',
  label: 'Legal & Financial Intelligence Zone'
}, {
  id: 'tk-5',
  label: 'Funding Application Clinics'
}, {
  id: 'tk-6',
  label: 'Premium Industry Networking'
}, {
  id: 'tk-7',
  label: 'Masterclasses & Investor Engagements'
}, {
  id: 'tk-8',
  label: 'Entrepreneurial Odyssey Sessions'
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

// ─── StickyNav ────────────────────────────────────────────────────────────────────
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

// ─── Hero Section ─────────────────────────────────────────────────────────────
const SERVICE_STRIP_ITEMS = [{
  id: 'founders',
  label: 'Ambitious Founders'
}, {
  id: 'funders',
  label: 'Institutional Funders'
}, {
  id: 'vc',
  label: 'Venture Capital'
}, {
  id: 'dfi',
  label: 'DFIs & Corporates'
}, {
  id: 'ecosystem',
  label: 'Ecosystem Builders'
}];
const HERO_WORDS_LINE1 = ["Africa's", 'Premier'];
const HERO_WORDS_LINE2 = ['Funding'];
const HERO_WORD_PLATFORM = 'Platform';
const HERO_BG_IMAGE = 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=1800&q=80';
const HeroGrid = () => <div aria-hidden="true" style={{
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
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '8%']);
  return <section ref={heroRef} style={{
    height: '100vh',
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
      background: 'linear-gradient(160deg, rgba(20,18,16,0.92) 0%, rgba(20,18,16,0.78) 40%, rgba(20,18,16,0.88) 100%)',
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
    }}><HeroGrid /></div>
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
      height: '88px',
      flexShrink: 0,
      position: 'relative',
      zIndex: 4
    }} />
    <motion.div style={{
      y: textY,
      flex: 1,
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: isMobile ? '40px' : '48px',
      alignItems: 'center',
      padding: isMobile ? '32px 24px 32px' : '40px 64px 40px',
      width: '100%',
      boxSizing: 'border-box',
      zIndex: 4,
      position: 'relative'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column'
      }}>
        <motion.div custom={0.05} initial="hidden" animate="visible" variants={fadeUpVariants} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '40px',
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
            }}>EmpowaWorx House</span>
          </span>
        </motion.div>
        <h1 style={{
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: 300,
          margin: '0 0 48px',
          lineHeight: 0.93,
          letterSpacing: isMobile ? '-2px' : '-3px'
        }}>
          <div style={{
            overflow: 'hidden',
            display: 'block'
          }}>
            {HERO_WORDS_LINE1.map((word, i) => <motion.span key={`l1-${word}`} initial={{
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
              fontSize: isMobile ? 'clamp(44px, 12vw, 72px)' : 'clamp(54px, 7.5vw, 120px)',
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
            {HERO_WORDS_LINE2.map((word, i) => <motion.span key={`l2-${word}`} initial={{
              y: '110%',
              opacity: 0
            }} animate={{
              y: '0%',
              opacity: 1
            }} transition={{
              duration: 0.9,
              delay: 0.44 + i * 0.12,
              ease: [0.22, 1, 0.36, 1]
            }} style={{
              display: 'inline-block',
              fontSize: isMobile ? 'clamp(44px, 12vw, 72px)' : 'clamp(54px, 7.5vw, 120px)',
              color: 'rgba(247,246,243,0.18)',
              marginRight: '0.22em'
            }}>
              {word}
            </motion.span>)}
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
              fontSize: isMobile ? 'clamp(44px, 12vw, 72px)' : 'clamp(54px, 7.5vw, 120px)',
              color: '#DE322D'
            }}>
              {HERO_WORD_PLATFORM}
            </motion.em>
          </div>
        </h1>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '28px',
          maxWidth: '480px'
        }}>
          <motion.p custom={0.62} initial="hidden" animate="visible" variants={fadeUpVariants} style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: isMobile ? '15px' : 'clamp(15px, 1.4vw, 18px)',
            lineHeight: '1.75',
            color: 'rgba(247,246,243,0.72)',
            margin: 0,
            fontWeight: 300
          }}>
            Where Africa's next generation of scalable businesses meets serious capital, strategic opportunity, and transformative growth.
          </motion.p>
          <motion.div custom={0.68} initial="hidden" animate="visible" variants={fadeUpVariants} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            padding: '16px 20px',
            background: 'rgba(247,246,243,0.04)',
            border: '1px solid rgba(247,246,243,0.1)',
            borderRadius: '16px',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            width: 'fit-content'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2px'
            }}>
              <div style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '9px',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: '#DE322D',
                fontWeight: 600
              }}>Summit Countdown</div>
              <div style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '9px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(247,246,243,0.3)',
                fontWeight: 500
              }}>May 28 · 2026</div>
            </div>
            <div style={{
              width: '1px',
              height: '36px',
              background: 'rgba(247,246,243,0.1)'
            }} />
            <div />
          </motion.div>
          <motion.div custom={0.75} initial="hidden" animate="visible" variants={fadeUpVariants} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap'
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
              <span>Register Now</span><ArrowIconDark />
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
              <span>Partner With Us</span><ArrowIconDark />
            </motion.a>
        </motion.div>
      </div>
    </div>
    </motion.div>
    </section>;
};

// ─── Mini Zone Navigator ──────────────────────────────────────────────────────────────
const ZONES = [{id: "z1", variant: "prestige", index: "01", name: "Zone 1", theme: "Theme 1"}];
const ZoneNavigator = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    once: true,
    margin: '-60px 0px'
  });
  const isMobile = useIsMobile();
  return <div ref={ref} style={{
    background: '#14202c',
    borderTop: '1px solid rgba(247,246,243,0.07)',
    borderBottom: '1px solid rgba(247,246,243,0.07)',
    padding: isMobile ? '52px 24px' : '72px 64px',
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
      <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      position: 'relative',
      zIndex: 1
    }}>
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={rotateFade} custom={0} style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '36px'
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
            All Eight Zones at a Glance
          </span>
        </motion.div>
        <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
        gap: '1px',
        background: 'rgba(247,246,243,0.06)',
        borderRadius: '20px',
        overflow: 'hidden'
      }}>
          {ZONES.map((zone, i) => <motion.a key={zone.id} href="#" onClick={e => e.preventDefault()} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={scaleReveal} custom={i * 0.06} whileHover={{
          scale: 1.02
        }} style={{
          background: zone.variant === 'prestige' ? 'rgba(20,8,8,0.85)' : zone.variant === 'premium' ? 'rgba(12,10,22,0.85)' : 'rgba(15,28,40,0.85)',
          padding: isMobile ? '20px 16px' : '28px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          textDecoration: 'none',
          cursor: 'pointer',
          transition: 'background 0.3s ease',
          borderRight: zone.variant === 'prestige' ? '2px solid rgba(222,50,45,0.2)' : undefined
        }} onMouseEnter={e => {
          (e.currentTarget as HTMLAnchorElement).style.background = zone.variant === 'prestige' ? 'rgba(40,10,10,0.95)' : zone.variant === 'premium' ? 'rgba(20,15,35,0.95)' : 'rgba(20,36,52,0.95)';
        }} onMouseLeave={e => {
          (e.currentTarget as HTMLAnchorElement).style.background = zone.variant === 'prestige' ? 'rgba(20,8,8,0.85)' : zone.variant === 'premium' ? 'rgba(12,10,22,0.85)' : 'rgba(15,28,40,0.85)';
        }}>
              <div style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '9px',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: zone.variant === 'prestige' ? 'rgba(222,50,45,0.7)' : zone.variant === 'premium' ? 'rgba(180,160,255,0.5)' : 'rgba(247,246,243,0.2)',
            fontWeight: 600
          }}>
                Zone {zone.index}
              </div>
              <div style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: isMobile ? '12px' : '14px',
            fontWeight: zone.variant === 'prestige' ? 600 : 400,
            color: zone.variant === 'prestige' ? '#F7F6F3' : zone.variant === 'premium' ? 'rgba(247,246,243,0.88)' : 'rgba(247,246,243,0.65)',
            lineHeight: 1.3,
            letterSpacing: '-0.2px'
          }}>
                {zone.name}
              </div>
              <div style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '10px',
            color: 'rgba(247,246,243,0.22)',
            letterSpacing: '0.04em',
            lineHeight: 1.4
          }}>
                {zone.theme}
              </div>
            </motion.a>)}
        </div>
      </div>
    </div>;
};

// ─── Footer ─────────────────────────────────────────────────────────────────────────
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
const FOOTER_STATS = [{
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
}];
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
              <span>Register Now</span><ArrowIconDark />
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
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={lineWipe} custom={0.4} style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          borderTop: '1px solid rgba(247,246,243,0.1)',
          marginTop: isMobile ? '44px' : '60px',
          transformOrigin: 'left'
        }}>
          {FOOTER_STATS.map((s, i) => <div key={s.id} style={{
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
    <div style={{
      height: '1px',
      background: 'rgba(247,246,243,0.06)',
      margin: '0'
    }} />
    <div style={{
      maxWidth: '1440px',
      margin: '0 auto',
      padding: isMobile ? '52px 24px 0' : '72px 80px 0',
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
        <div style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          flexWrap: 'wrap',
          width: isMobile ? '100%' : 'auto'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(247,246,243,0.04)',
            border: '1px solid rgba(247,246,243,0.08)',
            borderRadius: '4px',
            padding: '12px 18px',
            gap: '10px',
            flex: isMobile ? '1' : 'none',
            minWidth: isMobile ? '0' : '240px'
          }}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="3" width="12" height="9" rx="1.5" stroke="rgba(247,246,243,0.2)" strokeWidth="1.2" />
              <path d="M1 5l6 4 6-4" stroke="rgba(247,246,243,0.2)" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <span style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              color: 'rgba(247,246,243,0.15)',
              letterSpacing: '0.02em'
            }}>Your email address</span>
          </div>
          <motion.button whileHover={{
            scale: 1.04
          }} whileTap={{
            scale: 0.97
          }} style={{
            background: 'linear-gradient(135deg, #DE322D, #c42823)',
            border: 'none',
            borderRadius: '4px',
            padding: '12px 24px',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '11px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 20px rgba(222,50,45,0.35)',
            width: isMobile ? '100%' : 'auto'
          }}>
            Subscribe
          </motion.button>
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
          {FOOTER_LEGAL.map(item => <a key={item.id} href="#" style={{
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

// ─── ExperienceZonesPage ──────────────────────────────────────────────────────────────
export const ExperienceZonesPage = () => {
  return <div className="w-full min-h-screen" style={{
    background: '#0f1c28',
    overflowX: 'hidden'
  }}>
      <ScrollProgressBar />
      <StickyNav />
      <HeroSection />
      <ZoneNavigator />
      
      
      <SiteFooter />
    </div>;
};