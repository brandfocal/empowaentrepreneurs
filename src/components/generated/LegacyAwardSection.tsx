import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// --- Local hooks ---

const useIsMobile = () => {
  const [v, setV] = useState(false);
  useEffect(() => {
    const c = () => setV(window.innerWidth < 768);
    c();
    window.addEventListener('resize', c);
    return () => window.removeEventListener('resize', c);
  }, []);
  return v;
};
const useIsTablet = () => {
  const [v, setV] = useState(false);
  useEffect(() => {
    const c = () => setV(window.innerWidth >= 768 && window.innerWidth < 1100);
    c();
    window.addEventListener('resize', c);
    return () => window.removeEventListener('resize', c);
  }, []);
  return v;
};

// --- Data ---

interface LaureateData {
  name: string;
  awardTitle: string;
  year: string;
  description: string;
  quote: string;
  imageUrl: string;
}
const LAUREATE_DATA: LaureateData = {
  name: "Johnson (JJ) Njeke",
  awardTitle: "Lifetime Entrepreneurial Legacy Award",
  year: "2026",
  description: "More than three decades of transformative leadership and foundational belief in the EmpowaEntrepreneurs vision when it was only an idea. Johnson Njeke's legacy is measured not merely in transactions, but in the dreams, ecosystems, and generations he has helped unlock through principled capital deployment and unwavering mentorship of Africa's next generation of leaders.",
  quote: "His life's work is a testament to what happens when capital is wielded with conscience, courage, and community at its core.",
  imageUrl: "https://www.empowaentrepreneurs.co.za/team/Johnson-JJ-Njeke.jpg"
};

// --- Icons ---

const PlusSquareIconLight = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M16.25 2.5H3.75C3.41848 2.5 3.10054 2.6317 2.86612 2.86612C2.6317 3.10054 2.5 3.41848 2.5 3.75V16.25C2.5 16.5815 2.6317 16.8995 2.86612 17.1339C3.10054 17.3683 3.41848 17.5 3.75 17.5H16.25C16.5815 17.5 16.8995 17.3683 17.1339 17.1339C17.3683 16.8995 17.5 16.5815 17.5 16.25V3.75C17.5 3.41848 17.3683 3.10054 17.1339 2.86612C16.8995 2.6317 16.5815 2.5 16.25 2.5ZM13.125 10.625H10.625V13.125C10.625 13.2908 10.5592 13.4497 10.4419 13.5669C10.3247 13.6842 10.1658 13.75 10 13.75C9.83424 13.75 9.67527 13.6842 9.55806 13.5669C9.44085 13.4497 9.375 13.2908 9.375 13.125V10.625H6.875C6.70924 10.625 6.55027 10.5592 6.43306 10.4419C6.31585 10.3247 6.25 10.1658 6.25 10C6.25 9.83424 6.31585 9.67527 6.43306 9.55806C6.55027 9.44085 6.70924 9.375 6.875 9.375H9.375V6.875C9.375 6.70924 9.44085 6.55027 9.55806 6.43306C9.67527 6.31585 9.83424 6.25 10 6.25C10.1658 6.25 10.3247 6.31585 10.4419 6.43306C10.5592 6.55027 10.625 6.70924 10.625 6.875V9.375H13.125C13.2908 9.375 13.4497 9.44085 13.5669 9.55806C13.6842 9.67527 13.75 9.83424 13.75 10C13.75 10.1658 13.6842 10.3247 13.5669 10.4419C13.4497 10.5592 13.2908 10.625 13.125 10.625Z" fill="rgba(247,246,243,0.35)" />
  </svg>;
const STAR_PATH = "M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z";

// --- Sub-components ---

const NoiseOverlay: React.FC = () => <div className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay" style={{
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
  backgroundSize: '128px 128px'
}} aria-hidden="true" />;
const StarPattern: React.FC = () => <div className="absolute inset-0 pointer-events-none select-none" style={{
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cpath d='M40 8L44.5 25.5L62 27.5L49.5 39.5L53 57L40 49.5L27 57L30.5 39.5L18 27.5L35.5 25.5Z' stroke='%23DE322D' stroke-width='0.8' fill='none' opacity='0.07'/%3E%3C/svg%3E")`,
  backgroundSize: '80px 80px',
  backgroundRepeat: 'repeat'
}} aria-hidden="true" />;
const GradientTopBorder: React.FC = () => <div className="absolute top-0 left-0 right-0 h-[1px] opacity-50" style={{
  backgroundImage: 'linear-gradient(90deg, transparent, #DE322D, transparent)'
}} />;
interface BadgeProps {
  year: string;
}
const Badge: React.FC<BadgeProps> = ({
  year
}) => <div className="flex flex-col items-center justify-center gap-2 rounded-2xl px-5 py-4" style={{
  background: 'rgba(10,9,6,0.85)',
  border: '1px solid rgba(222,50,45,0.25)',
  backdropFilter: 'blur(12px)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(247,246,243,0.05)'
}}>
    <div className="relative w-14 h-14 flex items-center justify-center">
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none" className="absolute" style={{
      animation: 'spin 20s linear infinite'
    }} aria-hidden="true">
        <path d="M30 4L36 22L55 24L41 37L45 55L30 47L15 55L19 37L5 24L24 22Z" stroke="#DE322D" strokeWidth="1" fill="none" opacity="0.5" />
        <path d="M30 10L35 24L50 26L39 37L42 52L30 45.5L18 52L21 37L10 26L25 24Z" stroke="#DE322D" strokeWidth="0.5" fill="none" opacity="0.25" />
      </svg>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d={STAR_PATH} stroke="#DE322D" strokeWidth="1.5" fill="rgba(222,50,45,0.3)" strokeLinejoin="round" />
      </svg>
    </div>
    <div className="text-center">
      <span style={{
      display: 'block',
      fontFamily: 'Montserrat, sans-serif',
      fontSize: '9px',
      fontWeight: 700,
      letterSpacing: '0.16em',
      textTransform: 'uppercase' as const,
      color: 'rgba(247,246,243,0.55)'
    }}>
        Legacy Laureate
      </span>
      <span style={{
      display: 'block',
      fontFamily: 'Montserrat, sans-serif',
      fontSize: '18px',
      fontWeight: 800,
      letterSpacing: '-0.03em',
      color: '#DE322D',
      lineHeight: 1.1,
      marginTop: '2px'
    }}>
        {year}
      </span>
    </div>
  </div>;

// --- Image Column ---

interface ImageColumnProps {
  isMobile: boolean;
  isTablet: boolean;
}
const ImageColumn: React.FC<ImageColumnProps> = ({
  isMobile,
  isTablet
}) => <motion.div initial={{
  opacity: 0,
  x: -24
}} whileInView={{
  opacity: 1,
  x: 0
}} transition={{
  duration: 0.9
}} viewport={{
  once: true
}} className="relative flex-shrink-0" style={{
  width: '100%',
  boxSizing: 'border-box'
}}>
    {/* Full-height image */}
    <div className="relative w-full overflow-hidden" style={{
    aspectRatio: isMobile ? '3/4' : isTablet ? '3/4' : '2/3',
    minHeight: isMobile ? 'auto' : isTablet ? 'auto' : '620px',
    borderRadius: isMobile ? '16px' : '20px',
    maxWidth: '100%',
    boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(247,246,243,0.05)'
  }}>
      <img src={LAUREATE_DATA.imageUrl} alt={LAUREATE_DATA.name} style={{
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      maxWidth: '100%',
      display: 'block',
      filter: 'grayscale(15%) contrast(1.05)'
    }} />
      {/* Gradient overlay bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 pointer-events-none" style={{
      background: 'linear-gradient(to top, rgba(10,9,6,0.7) 0%, transparent 100%)'
    }} />
      {/* Subtle red tint overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
      background: 'linear-gradient(135deg, rgba(222,50,45,0.06) 0%, transparent 60%)'
    }} />
    </div>

    {/* Badge overlapping top-right corner of image */}
    <div className="absolute" style={{
    top: '-16px',
    right: '-16px',
    zIndex: 20
  }}>
      <Badge year={LAUREATE_DATA.year} />
    </div>

    {/* Name label at bottom of image */}
    <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 pointer-events-none">
      <span style={{
      display: 'block',
      fontFamily: 'Montserrat, sans-serif',
      fontSize: '11px',
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase' as const,
      color: '#DE322D',
      marginBottom: '6px'
    }}>
        Legacy Award Laureate · {LAUREATE_DATA.year}
      </span>
      <h3 style={{
      fontFamily: 'Montserrat, sans-serif',
      fontWeight: 700,
      fontSize: isMobile ? 'clamp(22px,6vw,32px)' : isTablet ? 'clamp(24px,4vw,36px)' : 'clamp(28px,3vw,42px)',
      letterSpacing: isMobile ? '-0.5px' : '-0.8px',
      color: '#F7F6F3',
      lineHeight: 1.15,
      margin: 0
    }}>
        {LAUREATE_DATA.name}
      </h3>
    </div>
  </motion.div>;

// --- Content Card ---

interface ContentCardProps {
  isMobile: boolean;
  isTablet: boolean;
}
const ContentCard: React.FC<ContentCardProps> = ({
  isMobile,
  isTablet
}) => <motion.div initial={{
  opacity: 0,
  x: 24
}} whileInView={{
  opacity: 1,
  x: 0
}} transition={{
  duration: 0.9,
  delay: 0.15
}} viewport={{
  once: true
}} style={{
  flex: 1,
  minWidth: 0,
  boxSizing: 'border-box'
}}>
    <div className="relative flex flex-col justify-between" style={{
    background: 'rgba(20,18,16,0.9)',
    border: '1px solid rgba(247,246,243,0.08)',
    backdropFilter: 'blur(20px)',
    boxShadow: '0 24px 64px rgba(0,0,0,0.45), inset 0 1px 0 rgba(247,246,243,0.05)',
    borderRadius: isMobile ? '16px' : '20px',
    padding: isMobile ? '28px 24px' : isTablet ? '36px 32px' : '52px 56px',
    height: '100%',
    boxSizing: 'border-box'
  }}>
      {/* Card top accent */}
      <div className="absolute top-0 left-8 right-8 h-[1px]" style={{
      background: 'linear-gradient(90deg, transparent, rgba(222,50,45,0.6), transparent)'
    }} />

      {/* Header */}
      <div style={{
      marginBottom: isMobile ? '24px' : '32px'
    }}>
        <div style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '8px',
        marginBottom: '20px'
      }}>
          <PlusSquareIconLight />
          <span style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '11px',
          fontWeight: 500,
          letterSpacing: '0.14em',
          textTransform: 'uppercase' as const,
          color: 'rgba(247,246,243,0.35)'
        }}>
            The Highest Honour
          </span>
        </div>

        <h2 style={{
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: 200,
        fontSize: 'clamp(28px,6vw,72px)',
        letterSpacing: isMobile ? '-1.5px' : '-2.5px',
        color: '#F7F6F3',
        lineHeight: isMobile ? 1.05 : 0.95,
        margin: 0
      }}>
          Lifetime Entrepreneurial<br />Legacy Award
        </h2>
      </div>

      {/* Divider */}
      <div style={{
      width: '100%',
      height: '1px',
      background: 'linear-gradient(90deg, rgba(222,50,45,0.5), rgba(222,50,45,0.1), transparent)',
      marginBottom: isMobile ? '24px' : '32px'
    }} />

      {/* Description */}
      <p style={{
      fontFamily: 'Inter, sans-serif',
      fontWeight: 300,
      fontSize: isMobile ? '14px' : isTablet ? '15px' : '16px',
      lineHeight: 1.75,
      color: 'rgba(247,246,243,0.6)',
      margin: '0 0 36px'
    }}>
        {LAUREATE_DATA.description}
      </p>

      {/* Quote */}
      <div className="pl-5 mt-auto" style={{
      borderLeft: '2px solid #DE322D',
      padding: isMobile ? '20px 20px' : '24px 28px',
      paddingLeft: '20px'
    }}>
        <p style={{
        fontFamily: 'Montserrat, sans-serif',
        fontStyle: 'italic',
        fontWeight: 300,
        fontSize: isMobile ? '15px' : isTablet ? '17px' : 'clamp(18px,2vw,24px)',
        lineHeight: 1.65,
        color: 'rgba(247,246,243,0.78)',
        margin: 0
      }}>
          <span>"{LAUREATE_DATA.quote}"</span>
        </p>
      </div>

      {/* Bottom decoration — hidden on mobile to prevent overflow */}
      {!isMobile && <div className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none overflow-hidden" aria-hidden="true" style={{
      opacity: 0.04,
      borderBottomRightRadius: '20px'
    }}>
          <svg viewBox="0 0 128 128" fill="none" width="128" height="128">
            <path d={STAR_PATH} transform="translate(40, 40) scale(2)" stroke="#DE322D" strokeWidth="1" fill="none" />
          </svg>
        </div>}
    </div>
  </motion.div>;

// --- Main Component ---

export const LegacyAwardSection: React.FC = () => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isStacked = isMobile || isTablet;
  return <section className="relative w-full bg-[#0A0906] flex items-center justify-center" style={{
    minHeight: '100vh',
    overflowX: 'hidden',
    paddingTop: isMobile ? '64px' : isTablet ? '88px' : '110px',
    paddingBottom: isMobile ? '64px' : isTablet ? '88px' : '110px',
    boxSizing: 'border-box'
  }}>
      <NoiseOverlay />
      <StarPattern />
      <GradientTopBorder />

      <div className="relative z-10 w-full" style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: isMobile ? '0 20px' : isTablet ? '0 40px' : '0 64px',
      boxSizing: 'border-box'
    }}>
        {/* Asymmetric side-by-side layout */}
        <div style={{
        display: 'flex',
        flexDirection: isStacked ? 'column' : 'row',
        alignItems: isStacked ? 'stretch' : 'flex-start',
        gap: isMobile ? '32px' : isTablet ? '40px' : '56px',
        boxSizing: 'border-box'
      }}>
          <div style={{
          flexShrink: 0,
          width: isStacked ? '100%' : '40%',
          boxSizing: 'border-box'
        }}>
            <ImageColumn isMobile={isMobile} isTablet={isTablet} />
          </div>
          <div style={{
          flex: 1,
          minWidth: 0,
          boxSizing: 'border-box'
        }}>
            <ContentCard isMobile={isMobile} isTablet={isTablet} />
          </div>
        </div>
      </div>

      {/* Decorative blur objects */}
      <div className="absolute rounded-full pointer-events-none bg-[#DE322D]/10" style={{
      bottom: isMobile ? '-48px' : '-96px',
      left: isMobile ? '-48px' : '-96px',
      width: isMobile ? '192px' : '384px',
      height: isMobile ? '192px' : '384px',
      filter: isMobile ? 'blur(60px)' : 'blur(120px)'
    }} />
      {!isMobile && <div className="absolute rounded-full pointer-events-none bg-[#DE322D]/5" style={{
      top: '-96px',
      right: '-96px',
      width: '256px',
      height: '256px',
      filter: 'blur(80px)'
    }} />}
    </section>;
};