import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView, useAnimationFrame, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { FundingAwardsModal } from './FundingAwardsModal';

// ─── Constants ────────────────────────────────────────────────────────────────
const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`;
const HERO_BG = 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=1800&q=80';

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

// ─── SVG Icons ────────────────────────────────────────────────────────────────
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

// ─── Social icons ─────────────────────────────────────────────────────────────
const SocialIcon = ({
  brand
}: {
  brand: string;
}) => {
  if (brand === 'x') return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" fill="rgba(247,246,243,0.55)" /></svg>;
  if (brand === 'linkedin') return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" fill="rgba(247,246,243,0.55)" /></svg>;
  if (brand === 'youtube') return <svg width="15" height="11" viewBox="0 0 24 17" fill="none" aria-hidden="true"><path d="M23.498 2.683A3.009 3.009 0 0 0 21.38.549C19.505 0 12 0 12 0S4.495 0 2.62.549A3.009 3.009 0 0 0 .502 2.683C0 4.566 0 8.5 0 8.5s0 3.934.502 5.817a3.009 3.009 0 0 0 2.118 2.134C4.495 17 12 17 12 17s7.505 0 9.38-.549a3.009 3.009 0 0 0 2.118-2.134C24 12.434 24 8.5 24 8.5s0-3.934-.502-5.817ZM9.545 12.068V4.932L15.818 8.5l-6.273 3.568Z" fill="rgba(247,246,243,0.55)" /></svg>;
  if (brand === 'instagram') return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069ZM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.98-6.98.058-1.28.072-1.689.072-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z" fill="rgba(247,246,243,0.55)" /></svg>;
  return null;
};

// ─── Data ─────────────────────────────────────────────────────────────────────
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
}, {
  id: 'awards',
  label: 'Funding Awards',
  active: true
}];
const EVENT_OVERVIEW_ITEMS = [{
  id: 'eo-1',
  label: 'DATE',
  value: 'Thursday, 19 November 2026'
}, {
  id: 'eo-2',
  label: 'VENUE',
  value: 'EmpowaWorx House | Ferndale, Randburg'
}, {
  id: 'eo-3',
  label: 'FORMAT',
  value: 'Exclusive Invitation-Only Gala · 150 Guests'
}, {
  id: 'eo-4',
  label: 'OCCASION',
  value: 'Global Entrepreneurship Week 2026'
}];
const AWARD_CATEGORIES = [{
  id: 'ac-1',
  num: '01',
  title: 'Venture Capital Excellence',
  description: 'For firms scaling high-growth startups and disruptive technologies'
}, {
  id: 'ac-2',
  num: '02',
  title: 'Development Finance Impact',
  description: 'Honouring DFIs deploying catalytic capital for infrastructure and SME growth'
}, {
  id: 'ac-3',
  num: '03',
  title: "Women's Economic Empowerment Fund",
  description: 'Celebrating institutions advancing gender equity and financial inclusion'
}, {
  id: 'ac-4',
  num: '04',
  title: 'Enterprise & Supplier Development (ESD) Impact',
  description: 'Recognizing sustainable supplier ecosystems and procurement inclusion'
}, {
  id: 'ac-5',
  num: '05',
  title: 'Impact Investment Excellence',
  description: 'Measurable social and environmental returns alongside financial sustainability'
}, {
  id: 'ac-6',
  num: '06',
  title: 'Fintech & Digital Financial Inclusion',
  description: 'Innovators expanding digital commerce and payment access'
}, {
  id: 'ac-7',
  num: '07',
  title: 'Entrepreneurship Education & Training Excellence',
  description: 'Platforms driving world-class business training and innovation readiness'
}, {
  id: 'ac-8',
  num: '08',
  title: 'Township & Rural Economic Impact',
  description: 'Intentional capital deployment into underserved rural economies'
}];
const EXPERIENCE_PILLARS = [{
  id: 'ep-1',
  num: '01',
  title: 'Executive Red Carpet Arrival',
  icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
}, {
  id: 'ep-2',
  num: '02',
  title: 'Investor & Founder Private Networking Lounge',
  icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
}, {
  id: 'ep-3',
  num: '03',
  title: 'Curated Culinary Experience',
  icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><line x1="7" y1="2" x2="7" y2="11" /><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h4v6" /><path d="M21 21v-1" /></svg>
}, {
  id: 'ep-4',
  num: '04',
  title: 'High-Level Capital & Investment Conversations',
  icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
}, {
  id: 'ep-5',
  num: '05',
  title: 'Legacy Tribute Segment',
  icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" /></svg>
}];
const PROTOCOL_ITEMS = [{
  id: 'pr-1',
  key: 'ACCESS',
  value: 'By Confirmed Invitation Only',
  detail: 'Strictly by confirmed invitation and personalized accreditation only. No walk-in access permitted.'
}, {
  id: 'pr-2',
  key: 'ACCREDITATION',
  value: 'Digital Accreditation Pass Required',
  detail: 'Digital Accreditation Pass + Executive QR Access Code required for entry into all zones.'
}, {
  id: 'pr-3',
  key: 'CHECK-IN',
  value: 'Desk Opens 17:00 · Gala 18:45',
  detail: 'Desk opens 17:00; Gala commences 18:45 sharp. No late entry permitted after doors close.'
}, {
  id: 'pr-4',
  key: 'DRESS CODE',
  value: 'Executive Black Tie',
  detail: 'Executive Black Tie | Contemporary African Elegance. Smart casual is not permitted.'
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
const FOOTER_NAV_COLS = [{
  id: 'fnc-awards',
  heading: 'Awards',
  links: [{
    id: 'fl-a1',
    label: 'About the Awards'
  }, {
    id: 'fl-a2',
    label: 'Award Categories'
  }, {
    id: 'fl-a3',
    label: 'Legacy Award'
  }, {
    id: 'fl-a4',
    label: 'Registration'
  }]
}, {
  id: 'fnc-exp',
  heading: 'Experience',
  links: [{
    id: 'fl-e1',
    label: 'Red Carpet'
  }, {
    id: 'fl-e2',
    label: 'Networking Lounge'
  }, {
    id: 'fl-e3',
    label: 'Culinary Experience'
  }, {
    id: 'fl-e4',
    label: 'Investment Conversations'
  }]
}, {
  id: 'fnc-attend',
  heading: 'Attend',
  links: [{
    id: 'fl-at1',
    label: 'Apply to Attend'
  }, {
    id: 'fl-at2',
    label: 'Accreditation'
  }, {
    id: 'fl-at3',
    label: 'Dress Code'
  }, {
    id: 'fl-at4',
    label: 'Check-In'
  }]
}, {
  id: 'fnc-ee',
  heading: 'EmpowaEntrepreneurs',
  links: [{
    id: 'fl-ee1',
    label: 'Home'
  }, {
    id: 'fl-ee2',
    label: 'About Us'
  }, {
    id: 'fl-ee3',
    label: 'Programme'
  }, {
    id: 'fl-ee4',
    label: 'Partnerships'
  }]
}];
const FOOTER_LEGAL = [{
  id: 'leg-priv',
  label: 'Privacy Policy'
}, {
  id: 'leg-terms',
  label: 'Terms of Service'
}];
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
const SERVICE_STRIP_ITEMS = [{
  id: 'ssi-1',
  label: 'Venture Capital'
}, {
  id: 'ssi-2',
  label: 'DFIs & Development Finance'
}, {
  id: 'ssi-3',
  label: 'Impact Investment'
}, {
  id: 'ssi-4',
  label: 'Gender-Lens Funding'
}, {
  id: 'ssi-5',
  label: 'Enterprise Development'
}];

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

// ─── Ticker ────────────────────────────────────────────────────────────────────
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
            textTransform: 'uppercase' as const,
            color: light ? 'rgba(247,246,243,0.35)' : 'rgba(20,18,16,0.4)',
            fontWeight: 500
          }}>{item.label}</span>
              </div>)}
          </div>)}
      </div>
    </div>;
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

// ─── StickyNav ────────────────────────────────────────────────────────────────
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
        }}>
            EmpowaEntrepreneurs
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
          color: item.active ? '#DE322D' : navLinkColor,
          fontWeight: item.active ? 600 : 400,
          borderBottom: item.active ? '1px solid #DE322D' : '1px solid transparent',
          paddingBottom: '2px'
        }} onMouseEnter={e => {
          if (!item.active) (e.currentTarget as HTMLAnchorElement).style.color = navLinkHoverColor;
        }} onMouseLeave={e => {
          if (!item.active) (e.currentTarget as HTMLAnchorElement).style.color = navLinkColor;
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
              <motion.a href="#"  whileHover={{
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
                <span>Apply Now</span>
              </motion.a>
            </div>
          </div>}

        {isMobile && <button  style={{
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
          color: item.active ? '#DE322D' : 'rgba(20,18,16,0.65)',
          textDecoration: 'none',
          padding: '12px 0',
          borderBottom: '0.8px solid rgba(20,18,16,0.06)',
          letterSpacing: '0.02em',
          fontWeight: item.active ? 600 : 400
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
              <a href="#"  style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '13px',
            background: 'linear-gradient(135deg, #DE322D, #c42823)',
            borderRadius: '44px',
            padding: '10px 20px',
            color: '#fff',
            textDecoration: 'none'
          }}>Apply Now</a>
            </div>
          </motion.div>}
      </AnimatePresence>
    </motion.nav>;
};

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
      {/* Parallax BG image */}
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
      {/* Red orb top-right - parallax */}
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
            <span> Funding Awards™ - </span>
            <span style={{
            color: 'rgba(247,246,243,0.55)',
            fontWeight: 500
          }}>2026</span>
          </span>
        </motion.div>

        {/* Main headline - word clip animation */}
        <h1 style={{
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: 200,
        margin: '0 0 32px',
        lineHeight: 0.91,
        letterSpacing: isMobile ? '-2px' : '-4px',
        maxWidth: '960px'
      }}>
          {/* Line 1: "Funding Awards™" */}
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
              Funding
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
            color: '#F7F6F3'
          }}>
              Awards™
            </motion.span>
          </div>

          {/* Line 2: "2026" faded + italic "Africa." in coral */}
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
              2026
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
              Africa.
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
          Africa's Premier Capital, Investment &amp; Entrepreneurial Impact Honours™ - honouring institutions, investors, funders, and ecosystem builders shaping the future of enterprise growth across Africa.
        </motion.p>

        {/* CTA buttons */}
        <motion.div custom={0.75} initial="hidden" animate="visible" variants={fadeUpVariants} style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap',
        marginBottom: '56px'
      }}>
          <motion.a href="#" onClick={e => { e.preventDefault(); window.dispatchEvent(new Event('openFundingModal')); }} whileHover={{
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
            <span>Apply Now</span>
            <ArrowIconDark />
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
        letterSpacing: '0.13em',
        textTransform: 'uppercase',
        color: 'rgba(247,246,243,0.28)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
            <span style={{
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          background: '#DE322D',
          display: 'inline-block',
          flexShrink: 0
        }} />
            <span>{svc.label}</span>
          </div>)}
      </motion.div>
    </section>;
};

// ─── Event Overview Band ──────────────────────────────────────────────────────
const EventOverviewBand = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, {
    once: true,
    margin: '-60px 0px'
  });
  const isMobile = useIsMobile();
  return <div ref={sectionRef} style={{
    background: '#141210',
    position: 'relative',
    boxSizing: 'border-box',
    overflow: 'hidden'
  }}>
      <div aria-hidden="true" style={{
      position: 'absolute',
      inset: 0,
      backgroundImage: NOISE_SVG,
      backgroundRepeat: 'repeat',
      backgroundSize: '128px 128px',
      pointerEvents: 'none'
    }} />
      {/* Top accent line */}
      <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={lineWipe} custom={0} style={{
      height: '1px',
      background: 'linear-gradient(90deg, transparent, rgba(222,50,45,0.5), transparent)',
      transformOrigin: 'left',
      width: '100%'
    }} />
      <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: isMobile ? '0 24px' : '0 64px',
      position: 'relative',
      zIndex: 1
    }}>
        <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
        gap: '0'
      }}>
          {EVENT_OVERVIEW_ITEMS.map((item, i) => <motion.div key={item.id} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUpVariants} custom={i * 0.08} style={{
          padding: isMobile ? '28px 20px' : '36px 32px',
          borderRight: !isMobile && i < EVENT_OVERVIEW_ITEMS.length - 1 ? '1px solid rgba(247,246,243,0.08)' : isMobile && i % 2 === 0 ? '1px solid rgba(247,246,243,0.08)' : 'none',
          borderBottom: isMobile && i < 2 ? '1px solid rgba(247,246,243,0.08)' : 'none',
          boxSizing: 'border-box'
        }}>
              <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '10px'
          }}>
                <PlusSquareIconLight />
                <span style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '11px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(247,246,243,0.35)',
              fontWeight: 500
            }}>{item.label}</span>
              </div>
              <div style={{
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 700,
            fontSize: '15px',
            color: '#F7F6F3',
            lineHeight: 1.3
          }}>
                {item.value}
              </div>
            </motion.div>)}
        </div>
      </div>
      {/* Bottom accent line */}
      <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={lineWipe} custom={0.3} style={{
      height: '1px',
      background: 'linear-gradient(90deg, transparent, rgba(222,50,45,0.5), transparent)',
      transformOrigin: 'left',
      width: '100%'
    }} />
    </div>;
};

// ─── About the Awards ─────────────────────────────────────────────────────────
const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, {
    once: true,
    margin: '-60px 0px'
  });
  const isMobile = useIsMobile();
  return <section ref={sectionRef} style={{
    background: '#F7F6F3',
    paddingTop: isMobile ? '72px' : '100px',
    paddingBottom: isMobile ? '72px' : '100px',
    boxSizing: 'border-box',
    overflow: 'hidden'
  }}>
      <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: isMobile ? '0 24px' : '0 64px'
    }}>
        <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '60% 1fr',
        gap: isMobile ? '48px' : '64px',
        alignItems: 'center'
      }}>
          {/* Left */}
          <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideFromLeft} custom={0}>
            <div style={{
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
              fontWeight: 500
            }}>About the Awards</span>
            </div>
            <h2 style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: isMobile ? 'clamp(28px, 8vw, 44px)' : 'clamp(32px, 4vw, 52px)',
            fontWeight: 300,
            letterSpacing: '-2px',
            lineHeight: 1.05,
            color: '#141210',
            margin: '0 0 28px'
          }}>
              Africa's Premier Capital &amp; <em style={{
              fontStyle: 'italic',
              color: '#141210'
            }}>Investment Honours</em>
            </h2>
            <p style={{
            fontFamily: 'Lato, sans-serif',
            fontSize: '16px',
            color: 'rgba(20,18,16,0.65)',
            lineHeight: 1.75,
            margin: '0 0 28px'
          }}>
              The EmpowaEntrepreneurs Funding Awards™ is the inaugural platform specifically designed to honour the institutions, investors, funders, and ecosystem builders driving Africa's economic resurgence. We recognize those deploying funding not just as capital, but as a force for economic transformation, innovation, inclusion, and scalable impact. This is where the bold visionaries of the financial world meet the impact builders of the real economy.
            </p>
            <a href="#"  style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '14px',
            color: '#3c4d5d',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            letterSpacing: '0.02em',
            fontWeight: 500,
            transition: 'opacity 0.2s'
          }} onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.opacity = '0.75'} onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.opacity = '1'}>
              <span>View Awards Architecture</span>
              <ArrowIconInk />
            </a>
          </motion.div>

          {/* Right quote card */}
          <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideFromRight} custom={0.1}>
            <div style={{
            background: '#141210',
            borderRadius: '20px',
            padding: '40px',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid rgba(247,246,243,0.07)'
          }}>
              {/* Top accent bar */}
              <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, #DE322D, #ff7a70)'
            }} />
              <p style={{
              fontFamily: 'Montserrat, sans-serif',
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: '18px',
              color: 'rgba(247,246,243,0.85)',
              lineHeight: 1.65,
              margin: '0 0 20px'
            }}>
                "Where capital meets consequence - recognizing those deploying not just money, but possibility. Honouring institutions that are funding the future architecture of Africa's entrepreneurial economy."
              </p>
              <div style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: '#DE322D',
              fontWeight: 500
            }}>
                - EmpowaEntrepreneurs Funding Awards™ 2026
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>;
};

// ─── Awards Architecture ──────────────────────────────────────────────────────
const AwardsArchitectureSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, {
    once: true,
    margin: '-60px 0px'
  });
  const isMobile = useIsMobile();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  return <section ref={sectionRef} style={{
    background: '#0F0D0B',
    paddingTop: isMobile ? '72px' : '100px',
    paddingBottom: isMobile ? '72px' : '100px',
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
      pointerEvents: 'none'
    }} />
      <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: isMobile ? '0 24px' : '0 64px',
      position: 'relative',
      zIndex: 1
    }}>
        <div style={{
        marginBottom: isMobile ? '48px' : '64px'
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
            fontWeight: 500
          }}>
              Premium Categories
            </span>
          </motion.div>
          <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.08} style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: isMobile ? 'clamp(32px, 9vw, 52px)' : 'clamp(36px, 5vw, 64px)',
          fontWeight: 200,
          letterSpacing: '-3px',
          color: '#F7F6F3',
          lineHeight: 1.05,
          margin: 0
        }}>
            <span>Awards </span>
            <motion.em style={{
            fontStyle: 'italic',
            color: '#F7F6F3'
          }}>Architecture</motion.em>
          </motion.h2>
        </div>
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={staggerContainer} custom={0.09} style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: '16px'
      }}>
          {AWARD_CATEGORIES.map(cat => <motion.div key={cat.id} variants={staggerChild} onMouseEnter={() => setHoveredId(cat.id)} onMouseLeave={() => setHoveredId(null)} style={{
          background: hoveredId === cat.id ? 'rgba(247,246,243,0.07)' : 'rgba(247,246,243,0.04)',
          border: hoveredId === cat.id ? '1px solid rgba(222,50,45,0.3)' : '1px solid rgba(247,246,243,0.08)',
          borderRadius: '16px',
          padding: '28px',
          transition: 'background 0.25s ease, border-color 0.25s ease',
          cursor: 'default'
        }}>
              <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '16px'
          }}>
                <PlusSquareIconLight />
                <span style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '11px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#DE322D',
              fontWeight: 500
            }}>{cat.num}</span>
              </div>
              <h3 style={{
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 700,
            fontSize: '17px',
            color: '#F7F6F3',
            letterSpacing: '-0.3px',
            margin: '0 0 10px',
            lineHeight: 1.3
          }}>{cat.title}</h3>
              <p style={{
            fontFamily: 'Lato, sans-serif',
            fontSize: '14px',
            color: 'rgba(247,246,243,0.5)',
            lineHeight: 1.6,
            margin: 0
          }}>
                {cat.description}
              </p>
            </motion.div>)}
        </motion.div>
      </div>
    </section>;
};

// ─── Lifetime Legacy Award ────────────────────────────────────────────────────
const LifetimeLegacySection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, {
    once: true,
    margin: '-60px 0px'
  });
  const isMobile = useIsMobile();
  return <section ref={sectionRef} style={{
    background: '#0A0906',
    paddingTop: isMobile ? '72px' : '100px',
    paddingBottom: isMobile ? '72px' : '100px',
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
      pointerEvents: 'none'
    }} />
      {/* Decorative large background text */}
      <div aria-hidden="true" style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      fontFamily: 'Montserrat, sans-serif',
      fontSize: 'clamp(120px, 20vw, 280px)',
      fontWeight: 900,
      color: 'rgba(247,246,243,0.03)',
      letterSpacing: '-8px',
      whiteSpace: 'nowrap',
      pointerEvents: 'none',
      userSelect: 'none',
      lineHeight: 1
    }}>
        LEGACY
      </div>
      {/* Top coral accent line */}
      <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={lineWipe} custom={0} style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '1px',
      background: 'linear-gradient(90deg, transparent, rgba(222,50,45,0.5), transparent)',
      transformOrigin: 'left'
    }} />
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
        marginBottom: '20px'
      }}>
          <PlusSquareIconLight />
          <span style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '12px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'rgba(247,246,243,0.35)',
          fontWeight: 500
        }}>
            The Highest Honour
          </span>
        </motion.div>
        <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.08} style={{
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: 300,
        fontSize: isMobile ? 'clamp(28px, 8vw, 44px)' : 'clamp(32px, 4.5vw, 58px)',
        letterSpacing: '-1.8px',
        color: '#F7F6F3',
        lineHeight: 1.05,
        margin: '0 0 48px'
      }}>
          Lifetime Entrepreneurial Legacy Award
        </motion.h2>
        {/* Awardee card */}
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={scaleReveal} custom={0.15} style={{
        background: '#141210',
        border: '1px solid rgba(247,246,243,0.07)',
        borderRadius: '24px',
        padding: isMobile ? '36px 28px' : '56px',
        position: 'relative',
        overflow: 'hidden'
      }}>
          <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, #DE322D, rgba(222,50,45,0.1))'
        }} />
          <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr auto',
          gap: isMobile ? '36px' : '64px',
          alignItems: 'start'
        }}>
            <div>
              <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              marginBottom: '28px',
              flexWrap: 'wrap'
            }}>
                <div style={{
                width: isMobile ? '56px' : '72px',
                height: isMobile ? '56px' : '72px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #DE322D, #c42823)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 0 0 4px rgba(222,50,45,0.15)'
              }}>
                  <span style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 700,
                  fontSize: isMobile ? '20px' : '26px',
                  color: '#fff',
                  letterSpacing: '-1px'
                }}>JJ</span>
                </div>
                <div>
                  <h3 style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 700,
                  fontSize: isMobile ? '24px' : '36px',
                  color: '#F7F6F3',
                  letterSpacing: '-1px',
                  margin: '0 0 6px',
                  lineHeight: 1.1
                }}>Johnson (JJ) Njeke</h3>
                  <span style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  color: '#DE322D',
                  fontWeight: 500
                }}>
                    Lifetime Entrepreneurial Legacy Award · 2026
                  </span>
                </div>
              </div>
              <div style={{
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(222,50,45,0.5), transparent)',
              margin: '0 0 28px'
            }} />
              <p style={{
              fontFamily: 'Lato, sans-serif',
              fontSize: '16px',
              color: 'rgba(247,246,243,0.65)',
              lineHeight: 1.75,
              margin: '0 0 24px'
            }}>
                More than three decades of transformative leadership and foundational belief in the EmpowaEntrepreneurs vision when it was only an idea. Johnson Njeke's legacy is measured not merely in transactions, but in the dreams, ecosystems, and generations he has helped unlock through principled capital deployment and unwavering mentorship of Africa's next generation of leaders.
              </p>
              <div style={{
              borderLeft: '2px solid #DE322D',
              paddingLeft: '20px'
            }}>
                <p style={{
                fontFamily: 'Montserrat, sans-serif',
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: '16px',
                color: 'rgba(247,246,243,0.75)',
                margin: 0,
                lineHeight: 1.6
              }}>
                  "His life's work is a testament to what happens when capital is wielded with conscience, courage, and community at its core."
                </p>
              </div>
            </div>
            {!isMobile && <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px'
          }}>
                <div style={{
              position: 'relative',
              width: '140px',
              height: '140px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
                  <svg width="140" height="140" viewBox="0 0 140 140" fill="none" aria-hidden="true">
                    <path d="M70 10L84 46L122 50L96 76L104 112L70 96L36 112L44 76L18 50L56 46L70 10Z" stroke="#DE322D" strokeWidth="2" fill="none" opacity="0.15" />
                    <path d="M70 24L81 52L111 55L90 76L96 106L70 93L44 106L50 76L29 55L59 52L70 24Z" stroke="#DE322D" strokeWidth="1.5" fill="none" opacity="0.12" />
                  </svg>
                  <span style={{
                position: 'absolute',
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 900,
                fontSize: '48px',
                color: 'rgba(222,50,45,0.15)',
                letterSpacing: '-3px'
              }}>★</span>
                </div>
                <span style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '10px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(247,246,243,0.2)',
              textAlign: 'center'
            }}>
                  Legacy Laureate<br />2026
                </span>
              </div>}
          </div>
        </motion.div>
      </div>
    </section>;
};

// ─── Executive Experience ─────────────────────────────────────────────────────
const ExecutiveExperienceSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, {
    once: true,
    margin: '-60px 0px'
  });
  const isMobile = useIsMobile();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  return <section ref={sectionRef} style={{
    background: '#F7F6F3',
    paddingTop: isMobile ? '72px' : '100px',
    paddingBottom: isMobile ? '72px' : '100px',
    boxSizing: 'border-box',
    overflow: 'hidden'
  }}>
      <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: isMobile ? '0 24px' : '0 64px'
    }}>
        <div style={{
        marginBottom: isMobile ? '40px' : '56px'
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
            fontWeight: 500
          }}>
              Executive Experience
            </span>
          </motion.div>
          <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.08} style={{
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: 300,
          fontSize: isMobile ? 'clamp(24px, 7vw, 36px)' : 'clamp(28px, 3.5vw, 44px)',
          letterSpacing: '-1.5px',
          color: '#141210',
          margin: 0,
          lineHeight: 1.1
        }}>
            A Curated Executive Ecosystem Experience
          </motion.h2>
        </div>
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={staggerContainer} custom={0.09} style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(5, 1fr)',
        gap: '16px'
      }}>
          {EXPERIENCE_PILLARS.map(pillar => <motion.div key={pillar.id} variants={staggerChild} onMouseEnter={() => setHoveredId(pillar.id)} onMouseLeave={() => setHoveredId(null)} style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '28px 24px',
          border: '1px solid rgba(20,18,16,0.06)',
          boxShadow: hoveredId === pillar.id ? '0 12px 40px rgba(0,0,0,0.1)' : '0 2px 8px rgba(0,0,0,0.04)',
          transition: 'box-shadow 0.3s ease, transform 0.3s ease',
          transform: hoveredId === pillar.id ? 'translateY(-4px)' : 'translateY(0)',
          position: 'relative',
          cursor: 'default'
        }}>
              <div style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: '#DE322D',
            borderRadius: '44px',
            padding: '3px 10px',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '10px',
            color: '#fff',
            fontWeight: 700
          }}>{pillar.num}</div>
              <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #DE322D, #c42823)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}>
                {pillar.icon}
              </div>
              <h3 style={{
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 700,
            fontSize: '15px',
            color: '#3c4d5d',
            letterSpacing: '-0.2px',
            margin: 0,
            lineHeight: 1.4
          }}>{pillar.title}</h3>
            </motion.div>)}
        </motion.div>
      </div>
    </section>;
};

// ─── Registration & Attendance ────────────────────────────────────────────────
const RegistrationSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, {
    once: true,
    margin: '-60px 0px'
  });
  const isMobile = useIsMobile();
  return <section ref={sectionRef} style={{
    background: '#0F0D0B',
    paddingTop: isMobile ? '72px' : '100px',
    paddingBottom: isMobile ? '72px' : '100px',
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
      pointerEvents: 'none'
    }} />
      <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: isMobile ? '0 24px' : '0 64px',
      position: 'relative',
      zIndex: 1
    }}>
        <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '55% 1fr',
        gap: isMobile ? '48px' : '64px',
        alignItems: 'start'
      }}>
          {/* Left protocol list */}
          <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideFromLeft} custom={0}>
            <div style={{
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
              fontWeight: 500
            }}>
                Registration &amp; Attendance
              </span>
            </div>
            <h2 style={{
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 300,
            fontSize: isMobile ? 'clamp(24px, 7vw, 36px)' : 'clamp(28px, 3.5vw, 44px)',
            letterSpacing: '-1.5px',
            color: '#F7F6F3',
            margin: '0 0 44px',
            lineHeight: 1.1
          }}>
              Attendance Protocol
            </h2>
            <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0'
          }}>
              {PROTOCOL_ITEMS.map(item => <div key={item.id} style={{
              paddingBottom: '28px',
              marginBottom: '28px',
              borderBottom: '1px solid rgba(247,246,243,0.06)'
            }}>
                  <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px'
              }}>
                    <PlusSquareIconLight />
                    <span style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '11px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(247,246,243,0.35)',
                  fontWeight: 500
                }}>
                      {item.key}
                    </span>
                  </div>
                  <div style={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 700,
                fontSize: '15px',
                color: '#F7F6F3',
                marginBottom: '6px',
                letterSpacing: '-0.2px'
              }}>
                    {item.value}
                  </div>
                  <div style={{
                fontFamily: 'Lato, sans-serif',
                fontSize: '14px',
                color: 'rgba(247,246,243,0.55)',
                lineHeight: 1.6
              }}>
                    {item.detail}
                  </div>
                </div>)}
            </div>
          </motion.div>

          {/* Right CTA card */}
          <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideFromRight} custom={0.1}>
            <div style={{
            background: '#141210',
            borderRadius: '20px',
            padding: '40px',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid rgba(247,246,243,0.07)'
          }}>
              <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              width: '3px',
              background: 'linear-gradient(180deg, #DE322D, #c42823)',
              borderRadius: '20px 0 0 20px'
            }} />
              <h3 style={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 700,
              fontSize: '24px',
              color: '#F7F6F3',
              letterSpacing: '-0.5px',
              margin: '0 0 16px'
            }}>
                Secure Your Place
              </h3>
              <p style={{
              fontFamily: 'Lato, sans-serif',
              fontSize: '15px',
              color: 'rgba(247,246,243,0.65)',
              lineHeight: 1.7,
              margin: '0 0 32px'
            }}>
                Attendance is strictly by confirmed invitation and accreditation only. Due to the exclusive nature of the gala, space is limited to 150 distinguished guests.
              </p>
              <motion.a href="#" onClick={e => { e.preventDefault(); window.dispatchEvent(new Event('openFundingModal')); }} whileHover={{
              scale: 1.04,
              boxShadow: '0 12px 52px rgba(222,50,45,0.6)'
            }} whileTap={{
              scale: 0.97
            }} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #DE322D, #c42823)',
              borderRadius: '44px',
              padding: '16px 28px',
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '0.06em',
              color: '#fff',
              textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(222,50,45,0.4)',
              marginBottom: '12px'
            }}>
                <span>Apply Now</span>
                <ArrowIconDark />
              </motion.a>

            </div>
          </motion.div>
        </div>
      </div>
    </section>;
};

// ─── Closing Quote ────────────────────────────────────────────────────────────
const ClosingQuoteSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, {
    once: true,
    margin: '-60px 0px'
  });
  const isMobile = useIsMobile();
  return <section ref={sectionRef} style={{
    background: '#0A0906',
    paddingTop: isMobile ? '72px' : '100px',
    paddingBottom: isMobile ? '72px' : '100px',
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
      pointerEvents: 'none'
    }} />
      <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={lineWipe} custom={0} style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '1px',
      background: 'linear-gradient(90deg, transparent, rgba(222,50,45,0.5), transparent)',
      transformOrigin: 'left'
    }} />
      <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: isMobile ? '0 24px' : '0 64px',
      position: 'relative',
      zIndex: 1
    }}>
        <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
          <motion.blockquote initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUpVariants} custom={0.1} style={{
          fontFamily: 'Montserrat, sans-serif',
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: isMobile ? 'clamp(16px, 4vw, 22px)' : 'clamp(18px, 2.5vw, 28px)',
          color: 'rgba(247,246,243,0.75)',
          lineHeight: 1.65,
          margin: '0 0 36px'
        }}>
            "The EmpowaEntrepreneurs Funding Awards™ is where capital meets consequence, where visionary institutions are recognised not merely for deploying money, but for funding possibility, unlocking human potential, and shaping the future architecture of Africa's entrepreneurial economy."
          </motion.blockquote>
          <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={lineWipe} custom={0.25} style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(222,50,45,0.5), transparent)',
          transformOrigin: 'left',
          maxWidth: '200px',
          margin: '0 auto 20px'
        }} />
          <motion.p initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUpVariants} custom={0.35} style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '0.14em',
          color: '#DE322D',
          fontWeight: 500,
          margin: 0
        }}>
            - EmpowaEntrepreneurs Funding Awards™ 2026
          </motion.p>
        </div>
      </div>
    </section>;
};

// ─── Site Footer ──────────────────────────────────────────────────────────────
const SiteFooter = () => {
  const footerRef = useRef<HTMLElement>(null);
  const inView = useInView(footerRef, {
    once: true,
    margin: '-80px 0px'
  });
  const isMobile = useIsMobile();
  return <footer ref={footerRef} style={{
    background: '#0A0906',
    width: '100%',
    boxSizing: 'border-box',
    overflow: 'hidden',
    position: 'relative'
  }}>
      {/* Banner image section */}
      <div style={{
      position: 'relative',
      width: '100%',
      minHeight: isMobile ? '480px' : '580px',
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
          }}>
              Africa's Premier Funding Platform · 2026
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
              fontSize: isMobile ? 'clamp(32px, 9vw, 52px)' : 'clamp(32px, 5vw, 64px)',
              fontWeight: 200,
              letterSpacing: isMobile ? '-1.5px' : '-2px',
              lineHeight: 1.05,
              color: '#F7F6F3',
              margin: 0
            }}>
                Join Us at the<br />
                <em style={{
                fontStyle: 'italic',
                color: '#DE322D',
                fontWeight: 200
              }}>Funding Awards™</em><br />
                <span style={{
                color: 'rgba(247,246,243,0.3)',
                fontWeight: 200
              }}>Gala · 2026</span>
              </motion.h2>
            </div>
            <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideFromRight} custom={0.22} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            minWidth: isMobile ? '100%' : '260px'
          }}>
              <motion.a href="#" onClick={e => { e.preventDefault(); window.dispatchEvent(new Event('openFundingModal')); }} whileHover={{
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
                <span>Apply Now</span>
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

      {/* Footer nav + bottom bar */}
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
          {/* Brand */}
          <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
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
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '10px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'rgba(247,246,243,0.22)',
                fontWeight: 400,
                marginTop: '2px'
              }}>Funding Awards™ · 2026</div>
              </div>
            </div>
            <p style={{
            fontFamily: 'Lato, sans-serif',
            fontSize: '13px',
            lineHeight: '1.8',
            color: 'rgba(247,246,243,0.28)',
            margin: 0
          }}>
              Africa's premier capital and investment honours - recognizing those funding the future architecture of Africa's entrepreneurial economy.
            </p>
          </div>

          {/* Nav columns */}
          <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '36px' : '0',
          flex: isMobile ? 'none' : '1',
          maxWidth: isMobile ? '100%' : '700px',
          justifyContent: 'flex-end',
          width: isMobile ? '100%' : undefined
        }}>
            <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: isMobile ? '28px' : '0',
            flex: 1
          }}>
              {FOOTER_NAV_COLS.map((col, colIdx) => <div key={col.id} style={{
              paddingLeft: !isMobile && colIdx > 0 ? '32px' : '0',
              borderLeft: !isMobile && colIdx > 0 ? '1px solid rgba(247,246,243,0.06)' : 'none'
            }}>
                  <span style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '9px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(60,77,93,0.6)',
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
                    fontFamily: 'Lato, sans-serif',
                    fontSize: '13px',
                    color: 'rgba(247,246,243,0.3)',
                    textDecoration: 'none',
                    letterSpacing: '0.01em',
                    transition: 'color 0.2s ease',
                    display: 'block'
                  }} onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = '#F7F6F3'} onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(247,246,243,0.3)'}>
                          {link.label}
                        </a>
                      </li>)}
                  </ul>
                </div>)}
            </div>
          </div>
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
          fontFamily: 'Lato, sans-serif',
          fontSize: '11px',
          color: 'rgba(247,246,243,0.1)',
          letterSpacing: '0.04em'
        }}>
            © 2026 EmpowaEntrepreneurs. All Rights Reserved.
          </span>
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
            fontFamily: 'Lato, sans-serif',
            fontSize: '11px',
            color: 'rgba(247,246,243,0.12)',
            textDecoration: 'none',
            letterSpacing: '0.04em',
            transition: 'color 0.2s'
          }} onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(247,246,243,0.45)'} onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(247,246,243,0.12)'}>
                {item.label}
              </a>)}
          </div>
        </div>
      </div>
    </footer>;
};

// ─── StickyRegistrationBanner ─────────────────────────────────────────────────
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
              <span style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: isMobile ? '13px' : '14px',
            fontWeight: 700,
            color: '#F7F6F3',
            letterSpacing: '-0.1px',
            whiteSpace: 'nowrap'
          }}>
                EmpowaEntrepreneurs Funding Awards™ 2026
              </span>
              <span style={{
            fontFamily: 'Lato, sans-serif',
            fontSize: '11px',
            color: 'rgba(247,246,243,0.5)',
            letterSpacing: '0.02em',
            whiteSpace: isMobile ? 'normal' : 'nowrap'
          }}>
                <span>Thursday, 19 November 2026 · EmpowaWorx House</span>
                {!isMobile && <span style={{
              margin: '0 8px',
              color: 'rgba(247,246,243,0.2)'
            }}>·</span>}
                {!isMobile && <span>Secure your accreditation before registration closes</span>}
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
              <motion.a href="#" onClick={e => { e.preventDefault(); window.dispatchEvent(new Event('openFundingModal')); }} whileHover={{
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
                <span>Apply Now</span>
                <ArrowIconDark />
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
        }} onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(247,246,243,0.18)'} onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(247,246,243,0.08)'}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1L11 11M11 1L1 11" stroke="rgba(247,246,243,0.9)" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </button>
          </div>
        </motion.div>}
    </AnimatePresence>;
};

// ─── FundingAwardsPage ────────────────────────────────────────────────────────
export const FundingAwardsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsModalOpen(true);
    window.addEventListener('openFundingModal', handleOpen);
    return () => window.removeEventListener('openFundingModal', handleOpen);
  }, []);

  return <div style={{
    width: '100%',
    minHeight: '100vh',
    background: '#141210',
    overflowX: 'hidden'
  }}>
      <HeroSection />
      <EventOverviewBand />
      <AboutSection />
      <AwardsArchitectureSection />
      <LifetimeLegacySection />
      <ExecutiveExperienceSection />
      <RegistrationSection />
      <ClosingQuoteSection />
      <StickyRegistrationBanner />
      <FundingAwardsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>;
};