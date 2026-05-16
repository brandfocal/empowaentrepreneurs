import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView, useAnimationFrame, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, useDragControls } from 'framer-motion';
import { VideoBanner, SpeakerCarousel, LogoBanner } from './AgencyComponents';
import { PartnershipEnquiryModal } from './PartnershipEnquiryModal';
import { SummitRegistrationModal } from './SummitRegistrationModal';
import { NewsletterForm } from './NewsletterForm';
import { LeadershipTeamSection } from './LeadershipTeamSection';

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
const ArrowIconInk = () => <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
  <path d="M1.5 10.5L10.5 1.5M10.5 1.5H3.5M10.5 1.5V8.5" stroke="rgba(20,18,16,0.4)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
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

// ─── Countdown Timer ─────────────────────────────────────────────────────────
const SUMMIT_DATE = new Date('2026-05-28T08:00:00');
const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  useEffect(() => {
    const calc = () => {
      const diff = SUMMIT_DATE.getTime() - Date.now();
      if (diff <= 0) return;
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor(diff / (1000 * 60 * 60) % 24),
        minutes: Math.floor(diff / (1000 * 60) % 60),
        seconds: Math.floor(diff / 1000 % 60)
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, []);
  const units = [{
    id: 'cd-d',
    value: timeLeft.days,
    label: 'Days'
  }, {
    id: 'cd-h',
    value: timeLeft.hours,
    label: 'Hours'
  }, {
    id: 'cd-m',
    value: timeLeft.minutes,
    label: 'Min'
  }, {
    id: 'cd-s',
    value: timeLeft.seconds,
    label: 'Sec'
  }];
  return <div style={{
    display: 'flex',
    alignItems: 'flex-end',
    gap: '0'
  }}>
    {units.map((u, i) => <div key={u.id} style={{
      display: 'flex',
      alignItems: 'flex-end',
      gap: '0'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minWidth: '52px'
      }}>
        <AnimatePresence mode="popLayout">
          <motion.div key={`${u.id}-${u.value}`} initial={{
            y: -14,
            opacity: 0
          }} animate={{
            y: 0,
            opacity: 1
          }} exit={{
            y: 14,
            opacity: 0
          }} transition={{
            duration: 0.3,
            ease: [0.22, 1, 0.36, 1]
          }} style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: 'clamp(22px, 2.8vw, 36px)',
            fontWeight: 300,
            color: '#F7F6F3',
            lineHeight: 1,
            letterSpacing: '-1.5px',
            fontVariantNumeric: 'tabular-nums'
          }}>
            {String(u.value).padStart(2, '0')}
          </motion.div>
        </AnimatePresence>
        <div style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '9px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'rgba(247,246,243,0.28)',
          marginTop: '5px',
          fontWeight: 500
        }}>
          {u.label}
        </div>
      </div>
      {i < 3 && <span style={{
        fontFamily: 'Montserrat, sans-serif',
        fontSize: 'clamp(18px, 2vw, 28px)',
        color: 'rgba(222,50,45,0.6)',
        fontWeight: 200,
        lineHeight: 1,
        padding: '0 3px',
        paddingBottom: '12px',
        letterSpacing: 0
      }}>:</span>}
    </div>)}
  </div>;
};

// ─── StickyNav ────────────────────────────────────────────────────────────────
const STICKY_NAV_ITEMS = [{
  id: 'home',
  label: 'Home',
  href: '/'
}, {
  id: 'about',
  label: 'About Us',
  href: '/about'
}, {
  id: 'ecosystem',
  label: 'The Ecosystem',
  href: '#',
  children: [{
    id: 'programme',
    label: 'Programme',
    href: '/programme'
  }, {
    id: 'experience',
    label: 'Experience Zones',
    href: '/experience-zones'
  }, {
    id: 'pitch-power',
    label: 'Pitching Festival',
    href: '/pitch-power'
  }, {
    id: 'awards',
    label: 'Funding Awards',
    href: '/awards'
  }]
}, {
  id: 'strategic-advisory',
  label: 'Strategic Advisory',
  href: '/strategic-advisory'
}, {
  id: 'partnerships',
  label: 'Partnerships',
  href: '/partnerships'
}];
// ─── DropdownNavItem ────────────────────────────────────────────────────────
const DropdownNavItem = ({ item, scrolled, navLinkColor, navLinkHoverColor, pathname }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const isActive = item.children.some((child: any) => pathname === child.href);

  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div style={{
        fontFamily: 'Montserrat, sans-serif',
        fontSize: '13px',
        letterSpacing: '0.04em',
        cursor: 'pointer',
        transition: 'color 0.2s',
        fontWeight: isActive ? 600 : 400,
        color: isActive ? (scrolled ? '#DE322D' : '#fff') : navLinkColor,
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}
      onMouseEnter={e => {
        if (!isActive) e.currentTarget.style.color = navLinkHoverColor;
      }}
      onMouseLeave={e => {
        if (!isActive) e.currentTarget.style.color = navLinkColor;
      }}>
        {item.label}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s ease'
        }}>
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              paddingTop: '20px',
              zIndex: 100
            }}
          >
            <div style={{
              background: scrolled ? 'rgba(255,255,255,0.98)' : 'rgba(20,18,16,0.98)',
              border: scrolled ? '1px solid rgba(20,18,16,0.08)' : '1px solid rgba(247,246,243,0.1)',
              borderRadius: '16px',
              padding: '12px',
              minWidth: '220px',
              boxShadow: scrolled ? '0 16px 40px rgba(0,0,0,0.08)' : '0 16px 40px rgba(0,0,0,0.4)',
              backdropFilter: 'blur(16px)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              {item.children.map((child: any) => {
                const isChildActive = pathname === child.href;
                return (
                  <a key={child.id} href={child.href} style={{
                    display: 'block',
                    padding: '10px 16px',
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '13px',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    fontWeight: isChildActive ? 500 : 400,
                    color: isChildActive ? (scrolled ? '#DE322D' : '#fff') : (scrolled ? 'rgba(20,18,16,0.65)' : 'rgba(247,246,243,0.7)'),
                    background: isChildActive ? (scrolled ? 'rgba(222,50,45,0.05)' : 'rgba(222,50,45,0.15)') : 'transparent',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={e => {
                    if (!isChildActive) {
                      e.currentTarget.style.background = scrolled ? 'rgba(20,18,16,0.04)' : 'rgba(247,246,243,0.08)';
                      e.currentTarget.style.color = scrolled ? '#141210' : '#F7F6F3';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isChildActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = scrolled ? 'rgba(20,18,16,0.65)' : 'rgba(247,246,243,0.7)';
                    }
                  }}
                  >
                    {child.label}
                  </a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StickyNav = () => {
  const pathname = window.location.pathname;
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
        <motion.img
          src={scrolled ? "/logos/ee-logo.png" : "/logos/ee-logo-wh.png"}
          alt="EmpowaSummit Logo"
          whileHover={{ scale: 1.05 }}
          style={{ 
            height: '48px', 
            width: 'auto', 
            objectFit: 'contain',
            mixBlendMode: scrolled ? 'multiply' : 'screen'
          }}
        />
      </a>
      {!isMobile && <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '32px'
      }}>
        {STICKY_NAV_ITEMS.map(item => {
          if ('children' in item) {
            return <DropdownNavItem key={item.id} item={item} scrolled={scrolled} navLinkColor={navLinkColor} navLinkHoverColor={navLinkHoverColor} pathname={pathname} />;
          }

          const isActive = pathname === item.href;
          return <a key={item.id} href={item.href} style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '13px',
            textDecoration: 'none',
            letterSpacing: '0.04em',
            transition: 'color 0.2s',
            fontWeight: isActive ? 600 : 400,
            color: isActive ? (scrolled ? '#DE322D' : '#fff') : navLinkColor
          }} onMouseEnter={e => {
            if (!isActive) (e.currentTarget as HTMLAnchorElement).style.color = navLinkHoverColor;
          }} onMouseLeave={e => {
            if (!isActive) (e.currentTarget as HTMLAnchorElement).style.color = navLinkColor;
          }}>
            {item.label}
          </a>;
        })}
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
        {STICKY_NAV_ITEMS.map(item => <a key={item.id} href={item.href}  style={{
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

// ─── Hero Ticker ──────────────────────────────────────────────────────────────
const TICKER_ITEMS = [{
  id: 'tk-1',
  label: '400+ Attendees'
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
  label: "AFRICA'S Premier Funding Platform"
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
          }}>
            {item.label}
          </span>
        </div>)}
      </div>)}
    </div>
  </div>;
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
const HERO_WORDS_LINE1 = ["AFRICA'S", 'PREMIER'];
const HERO_WORDS_LINE2 = ['FUNDING'];
const HERO_WORD_PLATFORM = 'PLATFORM™';
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
            <span> Funding Summit 2026 - </span>
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
              fontSize: isMobile ? 'clamp(43px, 12vw, 71px)' : 'clamp(53px, 7.5vw, 119px)',
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
              fontSize: isMobile ? 'clamp(43px, 12vw, 71px)' : 'clamp(53px, 7.5vw, 119px)',
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
              fontSize: isMobile ? 'clamp(43px, 12vw, 71px)' : 'clamp(53px, 7.5vw, 119px)',
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
            Where Vetted Entrepreneurs Meet High Impact Capital.
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
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '9px',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: '#DE322D',
                fontWeight: 600
              }}>Summit Countdown</div>
              <div style={{
                fontFamily: 'Montserrat, sans-serif',
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
            <CountdownTimer />
          </motion.div>
          <motion.div custom={0.75} initial="hidden" animate="visible" variants={fadeUpVariants} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            <motion.a href="/summit" whileHover={{
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
              <span>Partner With Us</span><ArrowIconDark />
            </motion.a>
          </motion.div>
        </div>
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
      borderTop: '0.8px solid rgba(247,246,243,0.07)',
      zIndex: 4,
      overflow: 'hidden',
      position: 'relative'
    }}>
      <HeroTicker light />
    </motion.div>
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

// ─── Mission Statement Band ───────────────────────────────────────────────────
const MissionBand = () => {
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
    padding: isMobile ? '72px 24px' : '112px 64px',
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
      position: 'relative',
      zIndex: 1
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? '40px' : '80px',
        alignItems: 'center'
      }}>
        <div>
          <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={rotateFade} custom={0.05} style={{
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
            }}>Our Mission</span>
          </motion.div>
          <div style={{
            overflow: 'hidden'
          }}>
            <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.15} style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: isMobile ? 'clamp(28px, 8vw, 42px)' : 'clamp(32px, 4vw, 58px)',
              fontWeight: 300,
              letterSpacing: '-2px',
              lineHeight: 1.04,
              color: '#141210',
              margin: 0
            }}>
              <span>Where Africa's next </span>
              <em style={{
                fontStyle: 'italic',
                color: '#DE322D'
              }}>scalable businesses</em>
              <span style={{
                color: 'rgba(20,18,16,0.25)'
              }}> meet serious capital.</span>
            </motion.h2>
          </div>
        </div>
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideFromRight} custom={0.3}>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: isMobile ? '15px' : '17px',
            lineHeight: '1.82',
            color: 'rgba(20,18,16,0.65)',
            margin: '0 0 36px',
            fontWeight: 300
          }}>
            The EmpowaEntrepreneurs Funding Summit 2026 is a high-impact ecosystem where ambitious founders, institutional funders, corporates, DFIs, venture capital firms, angel investors, procurement leaders, and ecosystem builders converge to unlock catalytic capital and shape the future of African enterprise.
          </p>
          <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={lineWipe} custom={0.5} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0',
            borderTop: '1px solid rgba(20,18,16,0.08)',
            borderBottom: '1px solid rgba(20,18,16,0.08)',
            padding: '0',
            transformOrigin: 'left'
          }}>
            {[{
              id: 'ms-1',
              label: 'Summit Venue',
              value: 'EmpowaWorx House'
            }, {
              id: 'ms-2',
              label: 'Attendees',
              value: '400+'
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
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '9px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'rgba(20,18,16,0.3)',
                fontWeight: 500,
                marginBottom: '6px'
              }}>{stat.label}</div>
              <div style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: isMobile ? '12px' : '15px',
                fontWeight: 600,
                color: '#141210',
                letterSpacing: '-0.3px'
              }}>{stat.value}</div>
            </motion.div>)}
          </motion.div>
        </motion.div>
      </div>
    </div>
  </section>;
};

// ─── Process Section ──────────────────────────────────────────────────────────
type ProcessStep = {
  id: string;
  number: string;
  title: string;
  description: string;
  icon: string;
  imageSrc: string;
};
const PROCESS_STEPS: ProcessStep[] = [{
  id: 'step-connect',
  number: '01',
  title: 'Connect',
  description: 'Vetted founders and ambitious entrepreneurs connect directly with institutional funders, DFIs, angel investors, and corporate procurement leaders.',
  icon: '',
  imageSrc: 'https://images.unsplash.com/photo-1543269664-56d93c1b41a6?w=800&q=80'
}, {
  id: 'step-pitch',
  number: '02',
  title: 'Pitch',
  description: 'Present your business to high-conviction capital allocators in structured pitch sessions engineered for deal-making and catalytic outcomes.',
  icon: '',
  imageSrc: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80'
}, {
  id: 'step-scale',
  number: '03',
  title: 'Scale',
  description: 'Access strategic partnerships, procurement opportunities, and the ecosystem support needed to accelerate growth across African markets.',
  icon: '',
  imageSrc: 'https://images.unsplash.com/photo-1560439514-4e9645039924?w=800&q=80'
}, {
  id: 'step-lead',
  number: '04',
  title: 'Lead',
  description: "Shape Africa's next generation of high-growth enterprises - leaving EmpowaEntrepreneurs Funding Summit 2026 with capital, networks, and the momentum to define your industry.",
  icon: '',
  imageSrc: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80'
}];
const ProcessSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, {
    once: true,
    margin: '-60px 0px'
  });
  const [hoveredStep, setHoveredStep] = useState<string | null>(null);
  const isMobile = useIsMobile();
  return <section ref={sectionRef} style={{
    background: '#14202c',
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
      width: 'clamp(500px, 60vw, 900px)',
      height: 'clamp(500px, 60vw, 900px)',
      borderRadius: '50%',
      background: 'radial-gradient(circle at 40% 40%, rgba(255,92,73,0.08) 0%, rgba(255,92,73,0.02) 45%, transparent 70%)',
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
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: '60px',
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
            }}>How it works</span>
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
              maxWidth: '560px'
            }}>
              <span>{"A summit built for "}</span>
              <em style={{
                fontStyle: 'italic',
                color: '#DE322D'
              }}>impact</em>
              <span style={{
                color: 'rgba(247,246,243,0.2)'
              }}>{" at every stage."}</span>
            </motion.h2>
          </div>
        </div>
        {!isMobile && <motion.p initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideFromRight} custom={0.3} style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          color: 'rgba(247,246,243,0.3)',
          maxWidth: '260px',
          lineHeight: '1.7',
          margin: 0
        }}>
          Four pillars. No friction. A direct path from idea to capital and growth.
        </motion.p>}
      </div>
      <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={staggerContainer} custom={0.08} style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: '10px',
        width: '100%'
      }}>
        {PROCESS_STEPS.map(step => <motion.div key={step.id} variants={scaleReveal} onMouseEnter={() => setHoveredStep(step.id)} onMouseLeave={() => setHoveredStep(null)} style={{
          flex: !isMobile && hoveredStep === step.id ? '1.45 1 0%' : '1 1 0%',
          minHeight: isMobile ? '220px' : '480px',
          borderRadius: '24px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          transition: 'flex 0.55s cubic-bezier(0.22, 1, 0.36, 1)'
        }}>
          <img src={step.imageSrc} alt={step.title} style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            filter: 'brightness(0.78) saturate(0.75)',
            transform: hoveredStep === step.id ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)'
          }} />
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(rgba(0,0,0,0) 20%, rgba(0,0,0,0.65) 65%, rgb(0,0,0))',
            pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute',
            top: '24px',
            left: '28px',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '11px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(247,246,243,0.35)',
            fontWeight: 500,
            zIndex: 1
          }}>
            {step.number}
          </div>
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            padding: isMobile ? '24px 20px' : '32px 28px',
            gap: '16px',
            zIndex: 1
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  flexShrink: 0,
                  backgroundColor: '#DE322D'
                }} />
                <span style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '10px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '1.4px',
                  color: '#fff'
                }}>
                  {step.description.split(' ').slice(0, 3).join(' ')}
                </span>
              </div>
              <h3 style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: isMobile ? 'clamp(20px, 5vw, 28px)' : 'clamp(22px, 2.4vw, 34px)',
                fontWeight: 600,
                letterSpacing: '-0.8px',
                color: '#F7F6F3',
                margin: 0,
                lineHeight: 1.1
              }}>
                {step.title}
              </h3>
            </div>
            <div style={{
              flexShrink: 0,
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              border: '1px solid rgba(247,246,243,0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <motion.div style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #DE322D, #c42823)'
              }} initial={{
                scale: 0
              }} animate={{
                scale: hoveredStep === step.id ? 1 : 0
              }} transition={{
                duration: 0.35,
                ease: [0.4, 0, 0.2, 1]
              }} />
              <div style={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M4 14L14 4M14 4H6M14 4V12" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>)}
      </motion.div>
    </div>
  </section>;
};

// ─── Accordion Services Section ───────────────────────────────────────────────
type ServiceItem = {
  id: string;
  index: string;
  name: string;
  description: string;
  tag: string;
  imageSrc: string;
  imageAlt: string;
  bgColor: string;
  tintColor: string;
};
const SERVICES: ServiceItem[] = [{
  id: 'svc-brand',
  index: '01',
  name: 'Founders & Entrepreneurs',
  description: 'Ambitious African founders and high-growth entrepreneurs gain direct access to serious capital, strategic mentorship, and a global network of ecosystem builders.',
  tag: 'Pitch · Capital · Mentorship',
  imageSrc: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&q=80',
  imageAlt: 'Founders and entrepreneurs at EmpowaEntrepreneurs Funding Summit 2026',
  bgColor: '#F7F6F3',
  tintColor: 'rgba(222,50,45,0.22)'
}, {
  id: 'svc-ui',
  index: '02',
  name: 'Institutional Funders & VCs',
  description: "Venture capital firms, angel investors, and institutional funders discover Africa's most vetted, investment-ready businesses across every high-growth sector.",
  tag: 'Deal Flow · Due Diligence · Portfolio',
  imageSrc: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80',
  imageAlt: 'Institutional funders and venture capital firms',
  bgColor: '#EEF2F7',
  tintColor: 'rgba(60,77,93,0.28)'
}, {
  id: 'svc-web',
  index: '03',
  name: 'Corporates & DFIs',
  description: 'Development Finance Institutions and corporate leaders unlock procurement opportunities, co-investment mandates, and enterprise partnerships that drive continental impact.',
  tag: 'Procurement · DFIs · Co-Investment',
  imageSrc: 'https://images.unsplash.com/photo-1560439514-4e9645039924?w=800&q=80',
  imageAlt: 'Corporate and DFI partners at EmpowaEntrepreneurs Funding Summit 2026',
  bgColor: '#F3F0EA',
  tintColor: 'rgba(107,94,74,0.30)'
}, {
  id: 'svc-mobile',
  index: '04',
  name: 'Ecosystem Builders',
  description: "Accelerators, incubators, policy makers, and support organizations converge to shape the frameworks and networks that power Africa's next wave of enterprise.",
  tag: 'Policy · Accelerators · Networks',
  imageSrc: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80',
  imageAlt: 'Ecosystem builders and innovation leaders',
  bgColor: '#EDF4F0',
  tintColor: 'rgba(45,106,79,0.26)'
}];
const AccordionSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, {
    once: true,
    margin: '-80px 0px'
  });
  const [activeId, setActiveId] = useState<string>('svc-brand');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSummitModalOpen, setIsSummitModalOpen] = useState(false);
  const isMobile = useIsMobile();
  return <section ref={sectionRef} style={{
    background: '#0f1c28',
    paddingTop: isMobile ? '96px' : '160px',
    paddingBottom: 0,
    width: '100%',
    boxSizing: 'border-box',
    overflow: 'hidden',
    position: 'relative'
  }}>
    <div style={{
      padding: isMobile ? '0 24px 60px' : '0 64px 80px',
      maxWidth: '1200px',
      margin: '0 auto',
      boxSizing: 'border-box',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
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
          }}>Who attends</span>
        </motion.div>
        <div style={{
          overflow: 'hidden'
        }}>
          <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.1} style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: isMobile ? 'clamp(32px, 9vw, 52px)' : 'clamp(48px, 5.5vw, 88px)',
            fontWeight: 200,
            letterSpacing: isMobile ? '-1.5px' : '-3px',
            lineHeight: 0.95,
            color: '#F7F6F3',
            margin: 0
          }}>
            <span>{'Built for those'}</span><br />
            <span style={{
              color: 'rgba(247,246,243,0.18)'
            }}>{'who '}</span>
            <em style={{
              fontStyle: 'italic',
              color: '#DE322D'
            }}>{'drive'}</em>
            <span style={{
              color: 'rgba(247,246,243,0.18)'
            }}>{' growth.'}</span>
          </motion.h2>
        </div>
      </div>
      {!isMobile && <motion.p initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideFromRight} custom={0.35} style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: '15px',
        color: 'rgba(247,246,243,0.3)',
        maxWidth: '320px',
        lineHeight: '1.75',
        margin: 0
      }}>
        Every pillar of the African enterprise ecosystem converges here.
      </motion.p>}
    </div>
    <div style={{
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
      width: '100%',
      minHeight: isMobile ? 'auto' : '680px'
    }}>
      {SERVICES.map((svc, i) => {
        const isOpen = activeId === svc.id;
        return <motion.div key={svc.id} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={clipReveal} custom={i * 0.12} onMouseEnter={() => !isMobile && setActiveId(svc.id)} onClick={() => isMobile && setActiveId(isOpen ? '' : svc.id)} style={{
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer',
          borderRight: !isMobile && i < SERVICES.length - 1 ? '1px solid rgba(247,246,243,0.06)' : 'none',
          borderTop: isMobile ? '1px solid rgba(247,246,243,0.06)' : 'none',
          minHeight: isMobile ? '320px' : 'auto',
          transition: 'flex 0.6s cubic-bezier(0.22,1,0.36,1)'
        }}>
          <img src={svc.imageSrc} alt={svc.imageAlt} style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            filter: isOpen ? 'brightness(0.45) saturate(0.7)' : 'brightness(0.2) saturate(0.4)',
            transition: 'filter 0.7s cubic-bezier(0.22,1,0.36,1)',
            transform: isOpen ? 'scale(1.04)' : 'scale(1)',
            transformOrigin: 'center'
          }} />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: isOpen ? 'linear-gradient(to top, rgba(10,9,8,0.95) 0%, rgba(10,9,8,0.4) 55%, transparent 100%)' : 'linear-gradient(to top, rgba(10,9,8,0.8) 0%, rgba(10,9,8,0.5) 100%)',
            transition: 'opacity 0.6s ease',
            pointerEvents: 'none'
          }} />
          {isOpen && <div aria-hidden="true" style={{
            position: 'absolute',
            bottom: '-20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(222,50,45,0.2) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: isMobile ? '28px 24px' : '48px 36px'
          }}>
            <div style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '11px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: isOpen ? 'rgba(247,246,243,0.5)' : 'rgba(247,246,243,0.25)',
              fontWeight: 500,
              marginBottom: '16px',
              transition: 'color 0.4s ease'
            }}>
              {svc.index}
            </div>
            <h3 style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: isMobile ? 'clamp(20px, 5vw, 28px)' : 'clamp(20px, 1.8vw, 30px)',
              fontWeight: isOpen ? 400 : 300,
              letterSpacing: '-0.5px',
              color: isOpen ? '#F7F6F3' : 'rgba(247,246,243,0.55)',
              margin: '0 0 0',
              lineHeight: 1.15,
              transition: 'color 0.4s ease, font-weight 0.4s ease'
            }}>
              {svc.name}
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && <motion.div key={`acc-${svc.id}`} initial={{
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
                  lineHeight: '1.75',
                  color: 'rgba(247,246,243,0.55)',
                  margin: '16px 0 20px',
                  fontWeight: 300
                }}>
                  {svc.description}
                </p>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '6px',
                  marginBottom: '24px'
                }}>
                  {svc.tag.split(' · ').map(t => <span key={t} style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '10px',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'rgba(247,246,243,0.4)',
                    border: '1px solid rgba(247,246,243,0.15)',
                    borderRadius: '100px',
                    padding: '4px 12px'
                  }}>
                    {t}
                  </span>)}
                </div>
                <motion.a 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (svc.id === 'svc-brand') {
                      setIsSummitModalOpen(true);
                    } else {
                      setIsModalOpen(true);
                    }
                  }}
                  whileHover={{
                    scale: 1.04
                  }} whileTap={{
                    scale: 0.97
                  }} style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'linear-gradient(135deg, #DE322D, #c42823)',
                  borderRadius: '44px',
                  padding: '10px 22px',
                  fontSize: '12px',
                  letterSpacing: '0.06em',
                  color: '#fff',
                  textDecoration: 'none',
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 600,
                  boxShadow: '0 6px 24px rgba(222,50,45,0.4)'
                }}>
                  <span>Reserve Your Seat</span><ArrowIconDark />
                </motion.a>
              </motion.div>}
            </AnimatePresence>
            <div style={{
              height: '2px',
              background: 'linear-gradient(90deg, #DE322D, transparent)',
              marginTop: '28px',
              opacity: isOpen ? 1 : 0,
              transition: 'opacity 0.4s ease',
              borderRadius: '2px'
            }} />
          </div>
        </motion.div>;
      })}
    </div>
    {isModalOpen && <PartnershipEnquiryModal onClose={() => setIsModalOpen(false)} />}
    {isSummitModalOpen && <SummitRegistrationModal onClose={() => setIsSummitModalOpen(false)} />}
  </section>;
};

// ─── Case Study types ─────────────────────────────────────────────────────────
type CaseStudy = {
  id: string;
  index: string;
  title: string;
  category: string;
  year: string;
  description: string;
  tags: string[];
  imageSrc: string;
  imageAlt: string;
  span: 'wide' | 'normal';
  outcome: string;
  duration: string;
  role: string;
  challenge: string;
};
const CASE_STUDIES: CaseStudy[] = [{
  id: 'cs-1',
  index: '01',
  title: 'Catalytic Capital Track',
  category: 'Funding & Investment',
  year: '2026',
  description: 'Direct pitch sessions connecting vetted African founders to institutional funders, DFIs, and venture capital firms ready to deploy catalytic capital.',
  tags: ['VC', 'DFI', 'Angel'],
  imageSrc: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=1200&q=80',
  imageAlt: 'Catalytic Capital Track - funding sessions at EmpowaWorx House',
  span: 'wide',
  outcome: '400+ Attendees',
  duration: 'EmpowaWorx House',
  role: 'Founders · Funders · DFIs',
  challenge: "Africa's next generation of high-growth businesses deserves direct access to serious capital. The Catalytic Capital Track is an engineered deal-making environment where vetted entrepreneurs pitch to institutional investors and leave with commitments, not just contacts."
}, {
  id: 'cs-2',
  index: '02',
  title: 'Enterprise Growth Stage',
  category: 'Scale & Expansion',
  year: '2026',
  description: 'Structured sessions for scaling founders to secure procurement deals, co-investment mandates, and continental distribution partnerships.',
  tags: ['Scale', 'Procurement', 'Partnerships'],
  imageSrc: 'https://images.unsplash.com/photo-1560439514-4e9645039924?w=800&q=80',
  imageAlt: 'Enterprise Growth Stage at the EmpowaEntrepreneurs Summit',
  span: 'normal',
  outcome: 'Continental Reach',
  duration: 'EmpowaWorx House',
  role: 'Corporates · Procurement · Growth',
  challenge: 'Scaling a business across African markets requires more than capital - it demands the right corporate relationships and procurement pipelines. This track connects growth-stage founders directly with corporate buyers and policy makers driving continental enterprise development.'
}, {
  id: 'cs-3',
  index: '03',
  title: 'Ecosystem Builder Forum',
  category: 'Policy & Innovation',
  year: '2026',
  description: "Accelerators, incubators, and policy leaders converge to shape the frameworks powering Africa's next enterprise generation.",
  tags: ['Policy', 'Accelerators', 'Ecosystem'],
  imageSrc: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80',
  imageAlt: 'Ecosystem Builder Forum at EmpowaEntrepreneurs Funding Summit 2026',
  span: 'normal',
  outcome: "Shape Africa's Future",
  duration: 'EmpowaWorx House',
  role: 'Policy · Accelerators · Networks',
  challenge: "Building a thriving entrepreneurship ecosystem requires aligned institutions. The Ecosystem Builder Forum brings together accelerators, incubators, government bodies, and support organizations to co-create the support infrastructure that Africa's next wave of businesses needs to succeed."
}, {
  id: 'cs-4',
  index: '04',
  title: 'Power Seat Roundtables',
  category: 'Strategic Dialogue',
  year: '2026',
  description: "Intimate, curated roundtables where Africa's most influential founders, funders, and thought leaders shape the future of African enterprise together.",
  tags: ['Executive', 'Strategy', 'Leadership'],
  imageSrc: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80',
  imageAlt: 'Power Seat Roundtables at EmpowaWorx House',
  span: 'wide',
  outcome: 'Elite Access',
  duration: 'Limited Seats',
  role: 'Founders · Funders · Leaders',
  challenge: "Africa's most transformative decisions happen in intimate rooms between the right people. Power Seat Roundtables are curated, high-trust sessions where Africa's top founders, institutional investors, and corporate leaders engage in the strategic dialogues that will define the continent's next decade of enterprise growth."
}];

// ─── Project Modal ─────────────────────────────────────────────────────────────
const ProjectModal = ({
  project,
  onClose
}: {
  project: CaseStudy;
  onClose: () => void;
}) => {
  const isMobile = useIsMobile();
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);
  return <motion.div initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} exit={{
    opacity: 0
  }} transition={{
    duration: 0.3
  }}  style={{
    position: 'fixed',
    inset: 0,
    zIndex: 300,
    background: 'rgba(10,9,8,0.88)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    display: 'flex',
    alignItems: isMobile ? 'flex-end' : 'center',
    justifyContent: 'center',
    padding: isMobile ? '0' : '24px'
  }}>
    <motion.div initial={{
      opacity: 0,
      y: 48,
      scale: isMobile ? 1 : 0.95
    }} animate={{
      opacity: 1,
      y: 0,
      scale: 1
    }} exit={{
      opacity: 0,
      y: 32,
      scale: isMobile ? 1 : 0.97
    }} transition={{
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }}  style={{
      background: '#F7F6F3',
      borderRadius: isMobile ? '28px 28px 0 0' : '28px',
      maxWidth: '960px',
      width: '100%',
      maxHeight: isMobile ? '92vh' : '90vh',
      overflowY: 'auto',
      boxShadow: '0 80px 160px rgba(10,9,8,0.6), 0 0 0 1px rgba(255,255,255,0.05)',
      border: '1px solid rgba(20,18,16,0.07)'
    }}>
      <div style={{
        width: '100%',
        height: isMobile ? '220px' : '380px',
        overflow: 'hidden',
        borderRadius: isMobile ? '28px 28px 0 0' : '28px 28px 0 0',
        position: 'relative',
        flexShrink: 0
      }}>
        <img src={project.imageSrc} alt={project.imageAlt} style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          filter: 'brightness(0.88) saturate(0.85)'
        }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(10,9,8,0.6) 0%, transparent 55%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          top: '24px',
          left: '28px',
          display: 'flex',
          gap: '10px',
          alignItems: 'center'
        }}>
          <span style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '10px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(247,246,243,0.7)',
            background: 'rgba(20,18,16,0.55)',
            backdropFilter: 'blur(8px)',
            borderRadius: '100px',
            padding: '5px 14px',
            fontWeight: 500
          }}>{project.index}</span>
          <span style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '10px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'rgba(247,246,243,0.7)',
            background: 'rgba(20,18,16,0.55)',
            backdropFilter: 'blur(8px)',
            borderRadius: '100px',
            padding: '5px 14px',
            fontWeight: 500
          }}>{project.category}</span>
        </div>
        <button  style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          background: 'rgba(20,18,16,0.55)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(247,246,243,0.15)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="rgba(247,246,243,0.85)" strokeWidth="1.6" strokeLinecap="round" /></svg>
        </button>
        <div style={{
          position: 'absolute',
          bottom: '28px',
          left: '28px',
          right: '28px'
        }}>
          <h2 style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: isMobile ? 'clamp(22px, 6vw, 32px)' : 'clamp(28px, 4vw, 46px)',
            fontWeight: 300,
            letterSpacing: '-1.5px',
            color: '#F7F6F3',
            margin: '0 0 6px',
            lineHeight: 1.05
          }}>{project.title}</h2>
          <span style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            color: 'rgba(247,246,243,0.5)',
            letterSpacing: '0.03em'
          }}>{project.year}</span>
        </div>
      </div>
      <div style={{
        padding: isMobile ? '28px 24px 36px' : '44px 48px 52px',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px'
      }}>
        <div style={{
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap'
        }}>
          {[{
            label: 'Outcome',
            value: project.outcome
          }, {
            label: 'Venue',
            value: project.duration
          }, {
            label: 'Role',
            value: project.role
          }].map(stat => <div key={stat.label} style={{
            background: '#FFFFFF',
            border: '1px solid rgba(20,18,16,0.08)',
            borderRadius: '14px',
            padding: isMobile ? '14px 16px' : '16px 22px',
            flex: 1,
            minWidth: isMobile ? '120px' : '140px'
          }}>
            <div style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '10px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(20,18,16,0.35)',
              marginBottom: '6px',
              fontWeight: 500
            }}>{stat.label}</div>
            <div style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: isMobile ? '12px' : '14px',
              fontWeight: 500,
              color: '#141210',
              letterSpacing: '-0.2px'
            }}>{stat.value}</div>
          </div>)}
        </div>
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '6px',
              background: '#DE322D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1 7L7 1M7 1H2M7 1V6" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <span style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '11px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(20,18,16,0.4)',
              fontWeight: 500
            }}>The Challenge</span>
          </div>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: isMobile ? '13px' : '14px',
            lineHeight: '1.8',
            color: 'rgba(20,18,16,0.6)',
            margin: 0
          }}>{project.challenge}</p>
        </div>
        <div style={{
          display: 'flex',
          alignItems: isMobile ? 'flex-start' : 'center',
          justifyContent: 'space-between',
          gap: '20px',
          flexWrap: 'wrap',
          paddingTop: '20px',
          borderTop: '0.8px solid rgba(20,18,16,0.08)',
          flexDirection: isMobile ? 'column' : 'row'
        }}>
          <div style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap'
          }}>
            {project.tags.map(tag => <span key={tag} style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(20,18,16,0.45)',
              border: '1px solid rgba(20,18,16,0.12)',
              borderRadius: '100px',
              padding: '6px 14px'
            }}>{tag}</span>)}
          </div>
          <motion.a href="#"  whileHover={{
            scale: 1.04
          }} whileTap={{
            scale: 0.97
          }} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#141210',
            borderRadius: '44px',
            padding: '13px 26px',
            fontSize: '13px',
            letterSpacing: '0.04em',
            color: '#fff',
            textDecoration: 'none',
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 600,
            transition: 'background-color 0.3s ease',
            flexShrink: 0,
            width: isMobile ? '100%' : 'auto',
            justifyContent: isMobile ? 'center' : 'flex-start'
          }} onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#DE322D';
          }} onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#141210';
          }}>
            <span>Full Case Study</span><ArrowIconDark />
          </motion.a>
        </div>
      </div>
    </motion.div>
  </motion.div>;
};
const CaseStudiesSection = (_props: {
  onOpenModal: (cs: CaseStudy) => void;
}) => null;
const ScrollGallery = () => null;

// ─── Animated Counter ─────────────────────────────────────────────────────────
const AnimatedNumber = ({
  target,
  suffix = '',
  color = '#F7F6F3'
}: {
  target: number;
  suffix?: string;
  color?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    once: true,
    margin: '-40px 0px'
  });
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = 16;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else setCount(Math.floor(start));
    }, step);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <div ref={ref} style={{
    fontFamily: 'Montserrat, sans-serif',
    fontSize: 'clamp(44px, 5vw, 72px)',
    fontWeight: 200,
    letterSpacing: '-3px',
    lineHeight: 1,
    color: color
  }}>
    {count.toLocaleString()}{suffix}
  </div>;
};

// ─── Stats Section ────────────────────────────────────────────────────────────
type StatMetric = {
  id: string;
  value: string;
  numericTarget: number;
  suffix: string;
  label: string;
  sublabel: string;
  barWidth: number;
};
type StatHighlight = {
  id: string;
  label: string;
  value: string;
};
const STAT_METRICS: StatMetric[] = [{
  id: 'sm-1',
  value: '400+',
  numericTarget: 400,
  suffix: '+',
  label: 'Summit Attendees',
  sublabel: 'Founders, funders, DFIs & ecosystem builders',
  barWidth: 88
}, {
  id: 'sm-2',
  value: '120+',
  numericTarget: 120,
  suffix: '+',
  label: 'Verified Investors',
  sublabel: 'VCs, angels, and institutional capital allocators',
  barWidth: 62
}, {
  id: 'sm-3',
  value: '48',
  numericTarget: 48,
  suffix: 'h',
  label: 'Hours of Programming',
  sublabel: 'Across keynotes, pitches, roundtables & showcases',
  barWidth: 76
}, {
  id: 'sm-4',
  value: '30+',
  numericTarget: 30,
  suffix: '+',
  label: 'African Markets',
  sublabel: 'Continental reach across high-growth sectors',
  barWidth: 54
}];
const STAT_HIGHLIGHTS: StatHighlight[] = [{
  id: 'sh-1',
  label: 'Venue',
  value: 'EmpowaWorx House'
}, {
  id: 'sh-2',
  label: 'Edition',
  value: '2026 · Summit'
}, {
  id: 'sh-3',
  label: 'Continent',
  value: 'Africa-wide'
}, {
  id: 'sh-4',
  label: 'Status',
  value: 'Registration Open'
}];
const AnimatedBar = ({
  targetWidth,
  delay
}: {
  targetWidth: number;
  delay: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    once: true,
    margin: '-40px 0px'
  });
  return <div ref={ref} style={{
    width: '100%',
    height: '2px',
    background: 'rgba(20,18,16,0.1)',
    borderRadius: '2px',
    overflow: 'hidden'
  }}>
    <motion.div initial={{
      width: '0%'
    }} animate={inView ? {
      width: `${targetWidth}%`
    } : {
      width: '0%'
    }} transition={{
      duration: 1.2,
      delay,
      ease: [0.22, 1, 0.36, 1]
    }} style={{
      height: '100%',
      background: 'linear-gradient(90deg, #DE322D, #ff7a70)',
      borderRadius: '2px'
    }} />
  </div>;
};
const StatsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, {
    once: true,
    margin: '-80px 0px'
  });
  const isMobile = useIsMobile();
  return <section ref={sectionRef} style={{
    background: '#F7F6F3',
    paddingTop: isMobile ? '96px' : '144px',
    paddingBottom: isMobile ? '96px' : '144px',
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
      top: '-15%',
      right: '-10%',
      width: 'clamp(500px, 55vw, 820px)',
      height: 'clamp(500px, 55vw, 820px)',
      borderRadius: '50%',
      background: 'radial-gradient(circle at 40% 40%, rgba(222,50,45,0.07) 0%, rgba(222,50,45,0.02) 50%, transparent 70%)',
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
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: '64px',
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
            }}>By the numbers</span>
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
              maxWidth: '560px'
            }}>
              <span>{"Scale that speaks "}</span>
              <em style={{
                fontStyle: 'italic',
                color: '#DE322D'
              }}>for itself</em>
              <span style={{
                color: 'rgba(20,18,16,0.2)'
              }}>{"."}</span>
            </motion.h2>
          </div>
        </div>
        {!isMobile && <motion.p initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideFromRight} custom={0.3} style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          color: 'rgba(20,18,16,0.4)',
          maxWidth: '260px',
          lineHeight: '1.7',
          margin: 0
        }}>
          Every number represents a connection made, a deal closed, and a business transformed.
        </motion.p>}
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: '20px',
        alignItems: 'start'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0'
        }}>
          {STAT_METRICS.map((metric, i) => <motion.div key={metric.id} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideFromLeft} custom={i * 0.12} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            padding: '24px 0',
            borderBottom: i < STAT_METRICS.length - 1 ? '0.8px solid rgba(20,18,16,0.08)' : 'none'
          }}>
            <div style={{
              minWidth: isMobile ? '100px' : '130px',
              flexShrink: 0
            }}>
              <AnimatedNumber target={metric.numericTarget} suffix={metric.suffix} color="#141210" />
            </div>
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div>
                <div style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#141210',
                  letterSpacing: '-0.1px',
                  marginBottom: '4px'
                }}>{metric.label}</div>
                <div style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '12px',
                  color: 'rgba(20,18,16,0.45)',
                  lineHeight: '1.5'
                }}>{metric.sublabel}</div>
              </div>
              <AnimatedBar targetWidth={metric.barWidth} delay={0.3 + i * 0.1} />
            </div>
            {!isMobile && <div style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              letterSpacing: '0.08em',
              color: 'rgba(20,18,16,0.3)',
              minWidth: '36px',
              textAlign: 'right',
              flexShrink: 0
            }}>
              {metric.barWidth}%
            </div>}
          </motion.div>)}
        </div>
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={scaleReveal} custom={0.2} style={{
          background: 'linear-gradient(160deg, #1a2a3a 0%, #0f1c28 100%)',
          borderRadius: '28px',
          border: '1px solid rgba(247,246,243,0.08)',
          padding: isMobile ? '36px 28px' : '52px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: isMobile ? 'auto' : '520px',
          position: 'relative',
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}>
          <div aria-hidden="true" style={{
            position: 'absolute',
            bottom: '-20%',
            left: '-10%',
            width: '380px',
            height: '380px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(20,32,44,0.6) 0%, transparent 65%)',
            pointerEvents: 'none'
          }} />
          <motion.div aria-hidden="true" animate={{
            x: ['-100%', '220%']
          }} transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'linear',
            repeatDelay: 2.5
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
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(222,50,45,0.14)',
              border: '1px solid rgba(222,50,45,0.28)',
              borderRadius: '100px',
              padding: '6px 14px 6px 10px',
              marginBottom: '36px'
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
                boxShadow: '0 0 8px rgba(222,50,45,0.7)'
              }} />
              <span style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '10px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(247,246,243,0.55)',
                fontWeight: 500
              }}>Africa's No. 1</span>
            </div>
            <div style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: isMobile ? 'clamp(60px, 16vw, 108px)' : 'clamp(68px, 8vw, 108px)',
              fontWeight: 200,
              letterSpacing: '-5px',
              lineHeight: 0.88,
              color: '#F7F6F3',
              marginBottom: '8px'
            }}>
              <span>No.</span><br />
              <span style={{
                color: '#DE322D'
              }}>1</span>
            </div>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '13px',
              lineHeight: '1.7',
              color: 'rgba(247,246,243,0.3)',
              margin: '20px 0 0',
              maxWidth: '240px'
            }}>
              Funding platform connecting vetted entrepreneurs with catalytic capital across the continent.
            </p>
          </div>
          <div style={{
            position: 'relative',
            zIndex: 1,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1px',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid rgba(247,246,243,0.06)',
            marginTop: '40px'
          }}>
            {STAT_HIGHLIGHTS.map(h => <div key={h.id} style={{
              padding: '16px 18px',
              background: 'rgba(247,246,243,0.03)'
            }}>
              <div style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '9px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'rgba(247,246,243,0.22)',
                fontWeight: 500,
                marginBottom: '5px'
              }}>{h.label}</div>
              <div style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: isMobile ? '11px' : '13px',
                fontWeight: 500,
                color: '#F7F6F3',
                letterSpacing: '-0.1px'
              }}>{h.value}</div>
            </div>)}
          </div>
        </motion.div>
      </div>
    </div>
  </section>;
};

// ─── Testimonials ──────────────────────────────────────────────────────────────
type Testimonial = {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  avatarInitials: string;
  imageSrc?: string;
  accentColor: string;
};
const TESTIMONIALS: Testimonial[] = [{
  id: 't-1',
  quote: "EmpowaEntrepreneurs Funding Summit is a high-impact catalyst for unlocking entrepreneurship, capital access, and inclusive economic growth. It convenes decision-makers and doers in one ecosystem where ideas are converted into investment pathways and scalable enterprise outcomes. This is a platform actively shaping the future of Africa’s entrepreneurial economy.",
  author: 'Elias Masilela',
  role: 'Independent Non-Executive Director of Sanlam and Former Chairman of Sanlam Investments',
  company: 'Sanlam',
  avatarInitials: 'EM',
  accentColor: '#DE322D'
}, {
  id: 't-2',
  quote: "EmpowaEntrepreneurs Funding Summit stands out as a powerful convergence point of knowledge, capital, and enterprise development. It equips entrepreneurs not only with insight, but with the networks and strategic exposure required to build competitive, scalable businesses. It is a meaningful contributor to shaping a more innovative and globally relevant entrepreneurial ecosystem.",
  author: 'Prof Maurice Radebe',
  role: 'Faculty Director: Commerce, Law and Management',
  company: 'University of the Witwatersrand (Wits University)',
  avatarInitials: 'MR',
  accentColor: '#3c4d5d'
}, {
  id: 't-3',
  quote: "EmpowaEntrepreneurs Funding Summit is a commercially focused ecosystem that translates ambition into opportunity. It provides entrepreneurs with direct access to funding conversations, strategic partnerships, and growth-enabling networks. It is a strong enabler of investment readiness, business resilience, and sustainable enterprise growth.",
  author: 'Anthony Govender',
  role: 'Founder and Group Chief Executive Officer',
  company: 'ASI Financial Services',
  avatarInitials: 'AG',
  accentColor: '#6B5E4A'
}, {
  id: 't-4',
  quote: "EmpowaEntrepreneurs Funding Summit is effectively bridging the gap between entrepreneurship and capital markets. It enables structured engagement between funders, corporates, and entrepreneurs focused on real growth outcomes. The platform is strengthening the foundation for inclusive enterprise development and long-term economic participation.",
  author: 'Stephen Seaka',
  role: 'Managing Executive: Public Sector and Growth Capital Solutions',
  company: 'Absa Corporate and Investment Banking (CIB)',
  avatarInitials: 'SS',
  accentColor: '#2D6A4F'
}, {
  id: 't-5',
  quote: "EmpowaEntrepreneurs Funding Summit is a strategic platform advancing investment readiness, entrepreneurial capability, and inclusive economic transformation. It creates a structured environment where entrepreneurs and capital providers can engage with purpose and clarity. It is an important contributor to building a more resilient and opportunity-driven entrepreneurial economy.",
  author: 'Dr Tryphosa Ramano',
  role: 'Independent Non-Executive Director',
  company: 'Public Investment Corporation SOC Ltd (PIC)',
  avatarInitials: 'TR',
  accentColor: '#7F0000'
}, {
  id: 't-6',
  quote: "EmpowaEntrepreneurs Funding Summit is a high-impact platform driving real enterprise development outcomes, connecting investment-ready entrepreneurs with capital, networks, and growth opportunities at scale. Our partnership has delivered tangible value through stronger deal flow, deeper ecosystem collaboration, and accelerated SME growth pathways aligned to inclusive economic development. Absa is proud to be associated with EmpowaEntrepreneurs Funding Summit as a strategic partner shaping the future of enterprise development and unlocking long-term economic value.",
  author: 'Kgalaletso Tlhoaele',
  role: 'Head: Enterprise Development, Retail and Business Banking',
  company: 'Absa Group',
  avatarInitials: 'KT',
  accentColor: '#DE322D'
}];
const STAR_KEYS = ['s1', 's2', 's3', 's4', 's5'];
const AUTO_SCROLL_INTERVAL = 4500;
const TestimonialsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, {
    once: true,
    margin: '-80px 0px'
  });
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const lastTickRef = useRef<number>(Date.now());
  const active = TESTIMONIALS[activeIdx];
  const isMobile = useIsMobile();
  useEffect(() => {
    if (isPaused) {
      lastTickRef.current = Date.now();
      return;
    }
    const tick = () => {
      const now = Date.now();
      const elapsed = now - lastTickRef.current;
      lastTickRef.current = now;
      progressRef.current += elapsed / AUTO_SCROLL_INTERVAL * 100;
      if (progressRef.current >= 100) {
        progressRef.current = 0;
        setActiveIdx(prev => (prev + 1) % TESTIMONIALS.length);
      }
      setProgress(progressRef.current);
    };
    const id = setInterval(tick, 50);
    return () => clearInterval(id);
  }, [isPaused]);
  const handleSelect = (i: number) => {
    setActiveIdx(i);
    progressRef.current = 0;
    setProgress(0);
    lastTickRef.current = Date.now();
  };
  return <section ref={sectionRef} style={{
    background: '#14202c',
    paddingTop: isMobile ? '96px' : '160px',
    paddingBottom: isMobile ? '96px' : '160px',
    width: '100%',
    boxSizing: 'border-box',
    overflow: 'hidden'
  }}>
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: isMobile ? '0 24px' : '0 64px'
    }}>
      <div style={{
        marginBottom: '56px'
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
          }}>Attendee Voices</span>
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
            margin: 0
          }}>
            <span>{"Words from those who "}</span>
            <em style={{
              fontStyle: 'italic',
              color: '#DE322D'
            }}>attended</em>
            <span style={{
              color: 'rgba(247,246,243,0.2)'
            }}>{" ."}</span>
          </motion.h2>
        </div>
      </div>
      <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={staggerContainer} custom={0.1} style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 300px',
        gap: '20px',
        alignItems: 'stretch'
      }}>
        <motion.div variants={slideFromLeft} onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => {
          setIsPaused(false);
          lastTickRef.current = Date.now();
        }} style={{
          background: '#0a1520',
          borderRadius: '28px',
          padding: isMobile ? '36px 28px' : '56px',
          border: `1px solid rgba(247,246,243,0.07)`,
          boxShadow: `0 24px 80px rgba(5,12,20,0.5)`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '40px',
          transition: 'border-color 0.5s ease',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'rgba(247,246,243,0.06)'
          }}>
            <motion.div style={{
              height: '100%',
              background: active.accentColor,
              width: `${progress}%`,
              borderRadius: '0 2px 2px 0'
            }} transition={{
              duration: 0
            }} />
          </div>
          <div>
            <div style={{
              display: 'flex',
              gap: '4px',
              marginBottom: '28px'
            }}>
              {STAR_KEYS.map(sk => <svg key={sk} width="16" height="16" viewBox="0 0 14 14" fill="none"><path d="M7 1.5L8.545 5.195L12.5 5.545L9.65 8.045L10.545 12L7 9.875L3.455 12L4.35 8.045L1.5 5.545L5.455 5.195L7 1.5Z" fill="#DE322D" /></svg>)}
            </div>
            <div aria-hidden="true" style={{
              fontFamily: 'Georgia, serif',
              fontSize: '120px',
              lineHeight: 0.7,
              color: active.accentColor,
              opacity: 0.12,
              marginBottom: '-12px',
              userSelect: 'none'
            }}>"</div>
            <AnimatePresence mode="wait">
              <motion.p key={active.id} initial={{
                opacity: 0,
                y: 16
              }} animate={{
                opacity: 1,
                y: 0
              }} exit={{
                opacity: 0,
                y: -16
              }} transition={{
                duration: 0.45,
                ease: [0.22, 1, 0.36, 1]
              }} style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: isMobile ? '13px' : 'clamp(14px, 1.2vw, 16px)',
                lineHeight: '1.65',
                color: 'rgba(247,246,243,0.88)',
                margin: 0,
                fontStyle: 'italic',
                fontWeight: 300,
                letterSpacing: '-0.3px'
              }}>
                {active.quote}
              </motion.p>
            </AnimatePresence>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={`footer-${active.id}`} initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }} exit={{
              opacity: 0
            }} transition={{
              duration: 0.35
            }} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${active.accentColor}, ${active.accentColor}cc)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: `0 4px 20px ${active.accentColor}55`,
                overflow: 'hidden'
              }}>
                {active.imageSrc ? (
                  <img src={active.imageSrc} alt={active.author} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#fff',
                    letterSpacing: '0.04em'
                  }}>{active.avatarInitials}</span>
                )}
              </div>
              <div>
                <cite style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#F7F6F3',
                  fontStyle: 'normal',
                  display: 'block',
                  letterSpacing: '-0.1px'
                }}>{active.author}</cite>
                <span style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '12px',
                  color: 'rgba(247,246,243,0.35)',
                  letterSpacing: '0.02em'
                }}>
                  {active.role},{' '}
                  <strong style={{
                    fontWeight: 600,
                    color: 'rgba(247,246,243,0.55)'
                  }}>{active.company}</strong>
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
        {!isMobile && <motion.div variants={slideFromRight} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {TESTIMONIALS.map((t, i) => <button key={t.id}  onClick={() => handleSelect(i)} onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => {
            setIsPaused(false);
            lastTickRef.current = Date.now();
          }} style={{
            all: 'unset',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            background: activeIdx === i ? '#0a1520' : 'rgba(247,246,243,0.04)',
            border: `1px solid ${activeIdx === i ? `rgba(247,246,243,0.1)` : 'rgba(247,246,243,0.06)'}`,
            borderRadius: '16px',
            padding: '16px 18px',
            transition: 'background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease',
            boxShadow: activeIdx === i ? '0 4px 24px rgba(5,12,20,0.4)' : 'none',
            flex: 1,
            position: 'relative',
            overflow: 'hidden'
          }}>
            {activeIdx === i && <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: `${t.accentColor}18`
            }}>
              <motion.div style={{
                height: '100%',
                background: t.accentColor,
                width: `${progress}%`
              }} transition={{
                duration: 0
              }} />
            </div>}
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${t.accentColor}, ${t.accentColor}cc)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              opacity: activeIdx === i ? 1 : 0.45,
              transition: 'opacity 0.35s ease',
              overflow: 'hidden'
            }}>
              {t.imageSrc ? (
                <img src={t.imageSrc} alt={t.author} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#fff'
                }}>{t.avatarInitials}</span>
              )}
            </div>
            <div style={{
              textAlign: 'left'
            }}>
              <div style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
                fontWeight: 500,
                color: activeIdx === i ? '#F7F6F3' : 'rgba(247,246,243,0.35)',
                letterSpacing: '-0.1px',
                transition: 'color 0.35s ease'
              }}>{t.author}</div>
              <div style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '11px',
                color: 'rgba(247,246,243,0.25)',
                marginTop: '2px'
              }}>{t.company}</div>
            </div>
            {activeIdx === i && <div style={{
              marginLeft: 'auto',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: t.accentColor,
              flexShrink: 0
            }} />}
          </button>)}
        </motion.div>}
        {isMobile && <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          marginTop: '8px'
        }}>
          {TESTIMONIALS.map((t, i) => <button key={t.id}  style={{
            all: 'unset',
            cursor: 'pointer',
            width: activeIdx === i ? '24px' : '8px',
            height: '8px',
            borderRadius: '4px',
            background: activeIdx === i ? '#DE322D' : 'rgba(247,246,243,0.2)',
            transition: 'width 0.3s ease, background 0.3s ease'
          }} />)}
        </div>}
      </motion.div>
    </div>
  </section>;
};

// ─── Dark CTA Section ──────────────────────────────────────────────────────────
const DarkCtaSection = () => {
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
      background: 'radial-gradient(circle, rgba(222,50,45,0.14) 0%, transparent 65%)',
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
      color: 'rgba(247,246,243,0.018)',
      pointerEvents: 'none',
      userSelect: 'none',
      whiteSpace: 'nowrap',
      zIndex: 0
    }}>
      EMPOWAENTREPRENEURS
    </div>
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
        }}>Ready to lead?</span>
      </motion.div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? '40px' : '80px',
        alignItems: 'center',
        marginBottom: '64px'
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
              <span>{"Lead Africa's"}</span><br />
              <em style={{
                fontStyle: 'italic',
                color: '#DE322D'
              }}>Next Growth</em><br />
              <span style={{
                color: 'rgba(247,246,243,0.16)'
              }}>{"Story."}</span>
            </motion.h2>
          </div>
        </div>
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideFromRight} custom={0.3}>
          <div style={{
            borderRadius: '24px',
            overflow: 'hidden',
            border: '1px solid rgba(247,246,243,0.09)',
            marginBottom: '32px',
            position: 'relative'
          }}>
            <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80" alt="Empowa Summit - Power Seat Roundtables in session" style={{
              width: '100%',
              height: isMobile ? '200px' : '240px',
              objectFit: 'cover',
              display: 'block',
              filter: 'brightness(0.75) saturate(0.7)'
            }} />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(10,9,8,0.7) 0%, transparent 55%)',
              pointerEvents: 'none'
            }} />
            <div style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              right: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '11px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'rgba(247,246,243,0.45)',
                  marginBottom: '4px'
                }}>Power Seat Roundtables</div>
                <div style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '15px',
                  fontWeight: 300,
                  color: '#F7F6F3',
                  letterSpacing: '-0.2px'
                }}>Reserve Your Seat</div>
              </div>
              <motion.div ref={magnetic.ref} onMouseMove={magnetic.handleMouseMove} onMouseLeave={magnetic.handleMouseLeave} style={{
                x: magnetic.springX,
                y: magnetic.springY,
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #DE322D, #c42823)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 4px 20px rgba(222,50,45,0.55)',
                cursor: 'pointer'
              }}>
                <ArrowIconDark />
              </motion.div>
            </div>
          </div>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: isMobile ? '15px' : '16px',
            lineHeight: '1.75',
            color: 'rgba(247,246,243,0.58)',
            margin: '0 0 28px'
          }}>
            {"Join over 400 attendees - serious capital, transformative partnerships, and Africa's most ambitious founders in one room."}
          </p>
          <div style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            <motion.a href="/partnerships"  whileHover={{
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
              boxShadow: '0 10px 40px rgba(222,50,45,0.55), 0 2px 8px rgba(222,50,45,0.3)',
              width: isMobile ? '100%' : 'auto',
              justifyContent: isMobile ? 'center' : 'flex-start'
            }}>
              <span>Reserve Your Power Seat</span><ArrowIconDark />
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
      <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={lineWipe} custom={0.55} style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
        gap: '1px',
        paddingTop: '40px',
        borderTop: '0.8px solid rgba(247,246,243,0.07)',
        transformOrigin: 'left'
      }}>
        {[{
          id: 'ts-1',
          label: 'Summit Date',
          value: 'May 28, 2026',
          sub: 'EmpowaWorx House'
        }, {
          id: 'ts-2',
          label: 'Attendees',
          value: '400+',
          sub: 'Founders · Funders · DFIs'
        }, {
          id: 'ts-3',
          label: 'Status',
          value: 'Registration Open',
          sub: 'Limited seats available'
        }].map((item, i) => <div key={item.id} style={{
          padding: isMobile ? '24px 0' : '28px 32px',
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
            fontSize: isMobile ? '16px' : '18px',
            fontWeight: 300,
            letterSpacing: '-0.5px',
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
  if (brand === 'instagram') return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069ZM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z" fill="rgba(247,246,243,0.55)" /></svg>;
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
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={lineWipe} custom={0.4} style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          borderTop: '1px solid rgba(247,246,243,0.1)',
          marginTop: isMobile ? '44px' : '60px',
          transformOrigin: 'left'
        }}>
          {[{
            id: 'fb-1',
            num: '400+',
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
            <motion.img
              src="/ee-logo.png"
              alt="EmpowaEntrepreneurs Logo"
              whileHover={{ scale: 1.05 }}
              style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
            />
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
                  <a href="#"  style={{
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
        <NewsletterForm variant="square" isMobile={isMobile} />
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
            {FOOTER_SOCIAL_LINKS.map(soc => <motion.a key={soc.id} href="#"  whileHover={{
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

// ─── Sticky Registration Banner ───────────────────────────────────────────────
const StickyRegistrationBanner = () => {
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
    {visible && !dismissed && <motion.div initial={{
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
        <div aria-hidden="true" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: '3px',
          background: 'linear-gradient(180deg, #DE322D, #ff7a70)',
          borderRadius: '24px 0 0 24px'
        }} />
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
        {!isMobile && <div style={{
          width: '1px',
          height: '36px',
          background: 'rgba(247,246,243,0.12)',
          flexShrink: 0
        }} />}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexShrink: 0,
          flexWrap: 'nowrap'
        }}>
          <motion.a href="/summit" whileHover={{
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
            <span>Register Now</span><ArrowIconDark />
          </motion.a>
        </div>
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

// ─── AgencyLandingPage ─────────────────────────────────────────────────────────
export const AgencyLandingPage = () => {
  return <div className="w-full min-h-screen" style={{
    background: '#141210',
    overflowX: 'hidden'
  }}>


    <HeroSection />
    <a href="/summit" style={{ display: 'block', width: '100%', cursor: 'pointer' }}>
      <img 
        src="/funding-summit-2026-banner.jpg" 
        alt="EmpowaEntrepreneurs Funding Summit 2026" 
        style={{ width: '100%', display: 'block', padding: 0, margin: 0 }} 
      />
    </a>
    <MissionBand />
    <LogoBanner />
    <ProcessSection />
    <AccordionSection />
    <VideoBanner />
    <SpeakerCarousel />
    <CaseStudiesSection onOpenModal={() => { }} />
    <ScrollGallery />
    <StatsSection />
    <LeadershipTeamSection />
    <TestimonialsSection />
    <DarkCtaSection />

    <StickyRegistrationBanner />
  </div>;
};