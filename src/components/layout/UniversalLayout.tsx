
import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, useSpring, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '../../hooks/use-mobile';
import { Link, useLocation } from 'react-router-dom';
import { NewsletterForm } from '../generated/NewsletterForm';
const FOOTER_BANNER_BG = 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=1800&q=80';
const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`;

// ─── Responsive hook ──────────────────────────────────────────────────────────
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

// ─── Scroll Progress Bar ──────────────────────────────────────────────────────
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


const PlusSquareIcon = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M16.25 2.5H3.75C3.41848 2.5 3.10054 2.6317 2.86612 2.86612C2.6317 3.10054 2.5 3.41848 2.5 3.75V16.25C2.5 16.5815 2.6317 16.8995 2.86612 17.1339C3.10054 17.3683 3.41848 17.5 3.75 17.5H16.25C16.5815 17.5 16.8995 17.3683 17.1339 17.1339C17.3683 16.8995 17.5 16.5815 17.5 16.25V3.75C17.5 3.41848 17.3683 3.10054 17.1339 2.86612C16.8995 2.6317 16.5815 2.5 16.25 2.5ZM13.125 10.625H10.625V13.125C10.625 13.2908 10.5592 13.4497 10.4419 13.5669C10.3247 13.6842 10.1658 13.75 10 13.75C9.83424 13.75 9.67527 13.6842 9.55806 13.5669C9.44085 13.4497 9.375 13.2908 9.375 13.125V10.625H6.875C6.70924 10.625 6.55027 10.5592 6.43306 10.4419C6.31585 10.3247 6.25 10.1658 6.25 10C6.25 9.83424 6.31585 9.67527 6.43306 9.55806C6.55027 9.44085 6.70924 9.375 6.875 9.375H9.375V6.875C9.375 6.70924 9.44085 6.55027 9.55806 6.43306C9.67527 6.31585 9.83424 6.25 10 6.25C10.1658 6.25 10.3247 6.31585 10.4419 6.43306C10.5592 6.55027 10.625 6.70924 10.625 6.875V9.375H13.125C13.2908 9.375 13.4497 9.44085 13.5669 9.55806C13.6842 9.67527 13.75 9.83424 13.75 10C13.75 10.1658 13.6842 10.3247 13.5669 10.4419C13.4497 10.5592 13.2908 10.625 13.125 10.625Z" fill="#DE322D" />
  </svg>;
const PlusSquareIconLight = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M16.25 2.5H3.75C3.41848 2.5 3.10054 2.6317 2.86612 2.86612C2.6317 3.10054 2.5 3.41848 2.5 3.75V16.25C2.5 16.5815 2.6317 16.8995 2.86612 17.1339C3.10054 17.3683 3.41848 17.5 3.75 17.5H16.25C16.5815 17.5 16.8995 17.3683 17.1339 17.1339C17.3683 16.8995 17.5 16.5815 17.5 16.25V3.75C17.5 3.41848 17.3683 3.10054 17.1339 2.86612C16.8995 2.6317 16.5815 2.5 16.25 2.5ZM13.125 10.625H10.625V13.125C10.625 13.2908 10.5592 13.4497 10.4419 13.5669C10.3247 13.6842 10.1658 13.75 10 13.75C9.83424 13.75 9.67527 13.6842 9.55806 13.5669C9.44085 13.4497 9.375 13.2908 9.375 13.125V10.625H6.875C6.70924 10.625 6.55027 10.5592 6.43306 10.4419C6.31585 10.3247 6.25 10.1658 6.25 10C6.25 9.83424 6.31585 9.67527 6.43306 9.55806C6.55027 9.44085 6.70924 9.375 6.875 9.375H9.375V6.875C9.375 6.70924 9.44085 6.55027 9.55806 6.43306C9.67527 6.31585 9.83424 6.25 10 6.25C10.1658 6.25 10.3247 6.31585 10.4419 6.43306C10.5592 6.55027 10.625 6.70924 10.625 6.875V9.375H13.125C13.2908 9.375 13.4497 9.44085 13.5669 9.55806C13.6842 9.67527 13.75 9.83424 13.75 10C13.75 10.1658 13.6842 10.3247 13.5669 10.4419C13.4497 10.5592 13.2908 10.625 13.125 10.625Z" fill="rgba(247,246,243,0.35)" />
  </svg>;
const ArrowIconDark = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 12L12 2M12 2H4M12 2V10" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;

const STICKY_NAV_ITEMS = [{
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
  id: 'contact',
  label: 'Contact Us',
  href: '/contact'
}];

const FOOTER_NAV_COLS = [{
  id: 'fcol-summit',
  heading: 'Summit',
  links: [{
    id: 'fl-about',
    label: 'About Us',
    href: '/about'
  }, {
    id: 'fl-summit',
    label: 'Summit Registration',
    href: '/summit'
  }, {
    id: 'fl-programme',
    label: 'Programme',
    href: '/programme'
  }, {
    id: 'fl-contact',
    label: 'Contact Us',
    href: '/contact'
  }]
}, {
  id: 'fcol-ecosystem',
  heading: 'Ecosystem',
  links: [{
    id: 'fl-experience',
    label: 'Experience Zones',
    href: '/experience-zones'
  }, {
    id: 'fl-pitch',
    label: 'Pitching Festival',
    href: '/pitch-power'
  }, {
    id: 'fl-awards',
    label: 'Funding Awards',
    href: '/awards'
  }, {
    id: 'fl-strategic',
    label: 'Strategic Advisory',
    href: '/strategic-advisory'
  }]
}, {
  id: 'fcol-attend',
  heading: 'Attend & Partner',
  links: [{
    id: 'fl-apply',
    label: 'Apply to Attend',
    href: '/apply'
  }, {
    id: 'fl-partner',
    label: 'Partner With Us',
    href: '/partnerships'
  }]
}];
const FOOTER_LEGAL: any[] = [];

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
                  <Link key={child.id} to={child.href} style={{
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
                  </Link>
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
  const { pathname } = useLocation();
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
      <Link to="/" style={{
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
      </Link>
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
          return <Link key={item.id} to={item.href} style={{
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
          </Link>;
        })}
        <div style={{
          display: 'flex',
          gap: '8px'
        }}>
          <Link to="/partnerships" style={{ textDecoration: 'none' }}>
            <motion.div whileHover={{
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
            </motion.div>
          </Link>
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
        {STICKY_NAV_ITEMS.map(item => {
          if ('children' in item && item.children) {
            return (
              <div key={item.id} style={{ padding: '12px 0', borderBottom: '0.8px solid rgba(20,18,16,0.06)' }}>
                <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '16px', color: 'rgba(20,18,16,0.65)', fontWeight: 600, marginBottom: '8px' }}>
                  {item.label}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '16px' }}>
                  {item.children.map((child: any) => {
                    const isChildActive = pathname === child.href;
                    return (
                      <Link key={child.id} to={child.href} onClick={() => setMobileMenuOpen(false)} style={{
                        display: 'block',
                        fontFamily: 'Montserrat, sans-serif',
                        fontSize: '14px',
                        color: isChildActive ? '#DE322D' : 'rgba(20,18,16,0.55)',
                        fontWeight: isChildActive ? 600 : 400,
                        textDecoration: 'none',
                      }}>
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          }

          const isActive = pathname === item.href;
          return <Link key={item.id} to={item.href} onClick={() => setMobileMenuOpen(false)} style={{
            display: 'block',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '16px',
            color: isActive ? '#DE322D' : 'rgba(20,18,16,0.65)',
            fontWeight: isActive ? 600 : 400,
            textDecoration: 'none',
            padding: '12px 0',
            borderBottom: '0.8px solid rgba(20,18,16,0.06)',
            letterSpacing: '0.02em'
          }}>
            {item.label}
          </Link>;
        })}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginTop: '20px',
          flexWrap: 'wrap'
        }}>
          <Link to="/partnerships" onClick={() => setMobileMenuOpen(false)} style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '13px',
            border: '1px solid rgba(20,18,16,0.18)',
            borderRadius: '44px',
            padding: '10px 20px',
            color: 'rgba(20,18,16,0.65)',
            textDecoration: 'none'
          }}>Partner With Us</Link>
          <Link to="/summit" onClick={() => setMobileMenuOpen(false)} style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '13px',
            background: 'linear-gradient(135deg, #DE322D, #c42823)',
            borderRadius: '44px',
            padding: '10px 20px',
            color: '#fff',
            textDecoration: 'none'
          }}>Register Now</Link>
        </div>
      </motion.div>}
    </AnimatePresence>
  </motion.nav>;
};

// ─── Hero Ticker ──────────────────────────────────────────────────────────────

const SocialIcon = ({
  brand
}: {
  brand: string;
}) => {
  if (brand === 'x') return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" fill="rgba(247,246,243,0.55)" /></svg>;
  if (brand === 'linkedin') return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" fill="rgba(247,246,243,0.55)" /></svg>;
  if (brand === 'youtube') return <svg width="15" height="11" viewBox="0 0 24 17" fill="none" aria-hidden="true"><path d="M23.498 2.683A3.009 3.009 0 0 0 21.38.549C19.505 0 12 0 12 0S4.495 0 2.62.549A3.009 3.009 0 0 0 .502 2.683C0 4.566 0 8.5 0 8.5s0 3.934.502 5.817a3.009 3.009 0 0 0 2.118 2.134C4.495 17 12 17 12 17s7.505 0 9.38-.549a3.009 3.009 0 0 0 2.118-2.134C24 12.434 24 8.5 24 8.5s0-3.934-.502-5.817ZM9.545 12.068V4.932L15.818 8.5l-6.273 3.568Z" fill="rgba(247,246,243,0.55)" /></svg>;
  if (brand === 'instagram') return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(247,246,243,0.55)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>;
  return null;
};

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
            <Link to="/partnerships" style={{ textDecoration: 'none' }}>
              <motion.div whileHover={{
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
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = 'rgba(247,246,243,0.5)';
                el.style.color = '#F7F6F3';
              }} onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = 'rgba(247,246,243,0.22)';
                el.style.color = 'rgba(247,246,243,0.65)';
              }}>
                <span>Partner With Us</span>
              </motion.div>
            </Link>
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
            num: '400',
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
          <Link to="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none'
          }}>
            <motion.img 
              src="/ee-logo.png" 
              alt="EmpowaEntrepreneurs Logo"
              whileHover={{ scale: 1.05 }} 
              style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
            />
          </Link>
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
            background: 'rgba(222,50,45,0.07)',
            border: '1px solid rgba(222,50,45,0.22)',
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
              background: '#DE322D',
              boxShadow: '0 0 8px rgba(222,50,45,0.5)',
              flexShrink: 0
            }} />
            <span style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '10px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(247,246,243,0.4)',
              fontWeight: 600
            }}>Registration Closed</span>
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
                {col.links.map((link: any) => <li key={link.id}>
                  <Link to={link.href} style={{
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
                  </Link>
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

// ─── Sticky Registration Banner ───────────────────────────────────────────────


const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};


export const UniversalLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
      <ScrollToTop />
      <ScrollProgressBar />
      <StickyNav />
      <main style={{ flex: 1, width: '100%' }}>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
};
