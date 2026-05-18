import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

// --- DATA ---

const SA_TIMELINE = [{
  id: 'sa-1',
  province: 'KwaZulu-Natal',
  date: 'Nov 2026',
  theme: 'Port Economy, Logistics & Manufacturing',
  step: 1
}, {
  id: 'sa-2',
  province: 'Western Cape',
  date: 'Mar 2027',
  theme: 'Innovation, Venture Capital & Tech Start-Ups',
  step: 2
}, {
  id: 'sa-3',
  province: 'Gauteng',
  date: 'May 2027',
  theme: 'Venture Finance, AI & Digital Economy',
  step: 3
}, {
  id: 'sa-4',
  province: 'Mpumalanga',
  date: 'Sept 2027',
  theme: 'Green Economy, Agro-Processing & Tourism',
  step: 4
}];
const PAN_AFRICA_CITIES = [{
  id: 'pac-1',
  city: 'Nairobi',
  country: 'Kenya',
  month: 'September 2027',
  tagline: 'Silicon Savannah',
  description: "Known as the \"Silicon Savannah,\" Kenya has emerged as one of Africa's leading innovation and start-up ecosystems. Its mature venture capital environment, strong government support for innovation, and growing digital economy make it an ideal strategic gateway for East African entrepreneurial expansion.",
  opportunities: ['Strong venture capital and angel investment ecosystem', 'Established innovation and technology infrastructure', 'Government-backed entrepreneurship initiatives', 'Rapidly growing fintech and digital economy'],
  strategicValue: ['Expands investor and venture capital connectivity', 'Strengthens East African ecosystem partnerships', 'Accelerates innovation-led enterprise participation', 'Positions entrepreneurs within global funding conversations'],
  region: 'East Africa'
}, {
  id: 'pac-2',
  city: 'Lagos',
  country: 'Nigeria',
  month: 'October 2027',
  tagline: "Africa's Largest Economy",
  description: "Nigeria remains Africa's largest economy and one of the continent's most dynamic entrepreneurial and technology markets. Lagos continues to emerge as a dominant innovation and venture capital hub attracting significant global investor interest.",
  opportunities: ["Africa's largest entrepreneurial market", 'Rapidly growing start-up and technology ecosystem', 'Strong accelerator and incubator infrastructure', 'Expanding foreign investment participation'],
  strategicValue: ["Unlocks access to one of Africa's largest growth markets", 'Enhances investor and market connectivity', 'Expands cross-border entrepreneurial collaboration', 'Accelerates venture scale opportunities across West Africa'],
  region: 'West Africa'
}, {
  id: 'pac-3',
  city: 'Dakar',
  country: 'Senegal',
  month: 'November 2027',
  tagline: 'Francophone Innovation Hub',
  description: "Senegal continues to strengthen its position as one of West Africa's emerging innovation and entrepreneurship ecosystems, supported by progressive government policies and innovation-focused infrastructure development.",
  opportunities: ['Strong entrepreneurial culture and start-up activity', 'Government-backed entrepreneurship support mechanisms', 'Diamniadio Technopolis innovation ecosystem', 'Growing technology and innovation economy'],
  strategicValue: ['Strengthens Francophone African ecosystem integration', 'Expands innovation and entrepreneurial collaboration', 'Supports inclusive growth and regional investment participation', 'Enhances cross-border economic partnerships'],
  region: 'West Africa'
}, {
  id: 'pac-4',
  city: 'Kigali',
  country: 'Rwanda',
  month: 'October 2027',
  tagline: "Africa's Most Business-Friendly Economy",
  description: "Rwanda has positioned itself as one of Africa's most business-friendly and innovation-driven economies, with strong government commitment to entrepreneurship, technology, and investment facilitation.",
  opportunities: ['Streamlined business environment and policy support', 'Strong innovation and technology focus', 'Government-backed entrepreneurial incentives', 'Rapidly growing start-up ecosystem'],
  strategicValue: ['Accelerates innovation ecosystem partnerships', 'Expands technology and digital economy participation', 'Strengthens regional entrepreneurial integration', 'Positions entrepreneurs within high-growth innovation networks'],
  region: 'East Africa'
}, {
  id: 'pac-5',
  city: 'Accra',
  country: 'Ghana',
  month: 'November 2027',
  tagline: "West Africa's Stable Growth Market",
  description: "Ghana continues to attract growing investor confidence due to its stable political climate, expanding entrepreneurial ecosystem, and strong youth-driven innovation economy.",
  opportunities: ['Stable and business-friendly economic environment', 'Emerging innovation and entrepreneurial ecosystem', 'Strong youth and digital economy participation', 'Increasing regional and international investment interest'],
  strategicValue: ['Expands entrepreneurial and investor participation across West Africa', 'Strengthens regional collaboration and ecosystem integration', 'Accelerates innovation and youth entrepreneurship participation', 'Enhances long-term Pan-African economic connectivity'],
  region: 'West Africa'
}];
const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`;

// --- HOOKS ---

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

// --- ICONS ---

const PlusSquareIcon = ({
  size = 20
}: {
  size?: number;
}) => <svg width={size} height={size} viewBox="0 0 20 20" fill="none" style={{
  flexShrink: 0
}}>
    <path d="M16.25 2.5H3.75C3.41848 2.5 3.10054 2.6317 2.86612 2.86612C2.6317 3.10054 2.5 3.41848 2.5 3.75V16.25C2.5 16.5815 2.6317 16.8995 2.86612 17.1339C3.10054 17.3683 3.41848 17.5 3.75 17.5H16.25C16.5815 17.5 16.8995 17.3683 17.1339 17.1339C17.3683 16.8995 17.5 16.5815 17.5 16.25V3.75C17.5 3.41848 17.3683 3.10054 17.1339 2.86612C16.8995 2.6317 16.5815 2.5 16.25 2.5ZM13.125 10.625H10.625V13.125C10.625 13.2908 10.5592 13.4497 10.4419 13.5669C10.3247 13.6842 10.1658 13.75 10 13.75C9.83424 13.75 9.67527 13.6842 9.55806 13.5669C9.44085 13.4497 9.375 13.2908 9.375 13.125V10.625H6.875C6.70924 10.625 6.55027 10.5592 6.43306 10.4419C6.31585 10.3247 6.25 10.1658 6.25 10C6.25 9.83424 6.31585 9.67527 6.43306 9.55806C6.55027 9.44085 6.70924 9.375 6.875 9.375H9.375V6.875C9.375 6.70924 9.44085 6.55027 9.55806 6.43306C9.67527 6.31585 9.83424 6.25 10 6.25C10.1658 6.25 10.3247 6.31585 10.4419 6.43306C10.5592 6.55027 10.625 6.70924 10.625 6.875V9.375H13.125C13.2908 9.375 13.4497 9.44085 13.5669 9.55806C13.6842 9.67527 13.75 9.83424 13.75 10C13.75 10.1658 13.6842 10.3247 13.5669 10.4419C13.4497 10.5592 13.2908 10.625 13.125 10.625Z" fill="#DE322D" />
  </svg>;
const ChevronIcon = ({
  open
}: {
  open: boolean;
}) => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{
  transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
  transition: 'transform 0.3s ease',
  flexShrink: 0
}}>
    <path d="M2.5 5L7 9.5L11.5 5" stroke="rgba(20,18,16,0.45)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;

// --- ANIMATION VARIANTS ---

const slideUpBlur = {
  hidden: {
    y: 80,
    opacity: 0,
    filter: 'blur(18px)',
    scale: 0.97
  },
  visible: (d = 0) => ({
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
    scale: 1,
    transition: {
      duration: 1.05,
      delay: d,
      ease: [0.16, 1, 0.3, 1] as const
    }
  })
};
const rotateFade = {
  hidden: {
    rotate: -12,
    opacity: 0,
    scale: 0.7
  },
  visible: (d = 0) => ({
    rotate: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.7,
      delay: d,
      ease: [0.22, 1, 0.36, 1] as const
    }
  })
};
const fadeUp = {
  hidden: {
    y: 24,
    opacity: 0
  },
  visible: (d = 0) => ({
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      delay: d,
      ease: [0.22, 1, 0.36, 1] as const
    }
  })
};

// --- COLLAPSIBLE SECTION ---

interface CollapsibleSectionProps {
  title: string;
  items: string[];
  defaultOpen?: boolean;
}
const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  items,
  defaultOpen = false
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return <div style={{
    borderTop: '0.8px solid rgba(20,18,16,0.08)',
    paddingTop: '12px',
    marginTop: '12px'
  }}>
      <button onClick={() => setOpen(o => !o)} style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      background: 'none',
      border: 'none',
      padding: '0 0 10px',
      cursor: 'pointer',
      textAlign: 'left',
      gap: '8px'
    }}>
        <span style={{
        fontFamily: "'Montserrat', sans-serif",
        fontSize: '10px',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'rgba(20,18,16,0.4)',
        fontWeight: 600
      }}>
          {title}
        </span>
        <ChevronIcon open={open} />
      </button>

      <AnimatePresence initial={false}>
        {open && <motion.div key="content" initial={{
        height: 0,
        opacity: 0
      }} animate={{
        height: 'auto',
        opacity: 1
      }} exit={{
        height: 0,
        opacity: 0
      }} transition={{
        duration: 0.35,
        ease: [0.22, 1, 0.36, 1] as const
      }} style={{
        overflow: 'hidden'
      }}>
            <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          paddingBottom: '4px'
        }}>
              {items.map((item, idx) => <div key={`item-${idx}`} style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px'
          }}>
                  <PlusSquareIcon size={12} />
                  <span style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '12.5px',
              color: 'rgba(20,18,16,0.6)',
              lineHeight: 1.6,
              fontWeight: 300
            }}>
                    {item}
                  </span>
                </div>)}
            </div>
          </motion.div>}
      </AnimatePresence>
    </div>;
};

// --- HORIZONTAL STEPPER ---

interface HorizontalStepperProps {
  items: typeof SA_TIMELINE;
  activeStep: number;
  onStepClick: (step: number) => void;
  isInView: boolean;
  isMobile: boolean;
}
const HorizontalStepper: React.FC<HorizontalStepperProps> = ({
  items,
  activeStep,
  onStepClick,
  isInView,
  isMobile
}) => {
  return <div style={{
    width: '100%'
  }}>
      {/* Step track */}
      <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      position: 'relative',
      overflowX: isMobile ? 'auto' : 'visible',
      paddingBottom: '4px'
    }}>
        {items.map((item, i) => <div key={item.id} style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        minWidth: isMobile ? '120px' : 'auto'
      }}>
            {/* Connector line */}
            {i < items.length - 1 && <div style={{
          position: 'absolute',
          top: '14px',
          left: '50%',
          width: '100%',
          height: '1.5px',
          background: 'rgba(20,18,16,0.1)',
          zIndex: 0
        }}>
                <motion.div initial={{
            scaleX: 0
          }} animate={isInView ? {
            scaleX: activeStep > i + 1 ? 1 : 0
          } : {
            scaleX: 0
          }} transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1] as const
          }} style={{
            height: '100%',
            background: '#DE322D',
            transformOrigin: 'left'
          }} />
              </div>}

            {/* Step dot */}
            <motion.button onClick={() => onStepClick(item.step)} variants={fadeUp} initial="hidden" animate={isInView ? 'visible' : 'hidden'} custom={0.3 + i * 0.1} style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          border: activeStep === item.step ? '2px solid #DE322D' : '1.5px solid rgba(20,18,16,0.15)',
          background: activeStep === item.step ? '#DE322D' : '#F7F6F3',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 1,
          position: 'relative',
          flexShrink: 0,
          marginBottom: '14px',
          boxShadow: activeStep === item.step ? '0 0 0 4px rgba(222,50,45,0.12)' : 'none',
          transition: 'all 0.3s ease'
        }}>
              <span style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '11px',
            fontWeight: 700,
            color: activeStep === item.step ? '#fff' : 'rgba(20,18,16,0.35)',
            lineHeight: 1
          }}>
                {item.step}
              </span>
            </motion.button>

            {/* Label */}
            <motion.div variants={fadeUp} initial="hidden" animate={isInView ? 'visible' : 'hidden'} custom={0.35 + i * 0.1} style={{
          textAlign: 'center',
          padding: '0 4px'
        }}>
              <span style={{
            display: 'inline-flex',
            background: 'rgba(222,50,45,0.08)',
            color: '#DE322D',
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '9px',
            fontWeight: 600,
            letterSpacing: '0.05em',
            padding: '2px 7px',
            borderRadius: '100px',
            marginBottom: '5px',
            textTransform: 'uppercase'
          }}>
                {item.date}
              </span>
              <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: isMobile ? '11px' : '12px',
            fontWeight: activeStep === item.step ? 700 : 500,
            color: activeStep === item.step ? '#141210' : 'rgba(20,18,16,0.5)',
            margin: '0 0 3px',
            letterSpacing: '-0.1px',
            transition: 'all 0.3s ease'
          }}>
                {item.province}
              </p>
            </motion.div>
          </div>)}
      </div>

      {/* Active step detail card */}
      <AnimatePresence mode="wait">
        {items.map(item => item.step === activeStep && <motion.div key={item.id} initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} exit={{
        opacity: 0,
        y: -6
      }} transition={{
        duration: 0.35,
        ease: [0.22, 1, 0.36, 1] as const
      }} style={{
        background: 'rgba(222,50,45,0.04)',
        border: '0.8px solid rgba(222,50,45,0.18)',
        borderRadius: '10px',
        padding: '18px 22px',
        marginTop: '16px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '14px'
      }}>
                <span style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: '#DE322D',
          flexShrink: 0,
          marginTop: '6px'
        }} />
                <div>
                  <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '13px',
            fontWeight: 600,
            color: '#141210',
            margin: '0 0 4px'
          }}>
                    {item.province}
                    <span style={{
              fontWeight: 400,
              color: 'rgba(20,18,16,0.35)',
              marginLeft: '8px'
            }}>
                      {item.date}
                    </span>
                  </p>
                  <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '13px',
            color: 'rgba(20,18,16,0.55)',
            fontStyle: 'italic',
            lineHeight: 1.6,
            margin: 0
          }}>
                    {item.theme}
                  </p>
                </div>
              </motion.div>)}
      </AnimatePresence>
    </div>;
};

// --- CITY TAB PANEL ---

interface CityTabPanelProps {
  city: (typeof PAN_AFRICA_CITIES)[number];
}
const CityTabPanel: React.FC<CityTabPanelProps> = ({
  city
}) => {
  return <motion.div key={city.id} initial={{
    opacity: 0,
    y: 14
  }} animate={{
    opacity: 1,
    y: 0
  }} exit={{
    opacity: 0,
    y: -8
  }} transition={{
    duration: 0.38,
    ease: [0.22, 1, 0.36, 1] as const
  }}>
      {/* City header */}
      <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '10px',
      marginBottom: '16px'
    }}>
        <div>
          <h4 style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '20px',
          fontWeight: 700,
          color: '#141210',
          margin: '0 0 4px',
          letterSpacing: '-0.4px'
        }}>
            {city.city}
            <span style={{
            fontWeight: 300,
            color: 'rgba(20,18,16,0.4)',
            fontSize: '16px',
            marginLeft: '8px'
          }}>
              {city.country}
            </span>
          </h4>
          <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '12px',
          color: 'rgba(20,18,16,0.4)',
          fontStyle: 'italic',
          margin: 0
        }}>
            {city.tagline}
          </p>
        </div>
        <div style={{
        display: 'flex',
        gap: '6px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
          <span style={{
          display: 'inline-flex',
          background: 'rgba(222,50,45,0.1)',
          color: '#DE322D',
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '10px',
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          padding: '3px 9px',
          borderRadius: '100px'
        }}>
            {city.region}
          </span>
          <span style={{
          display: 'inline-flex',
          background: 'rgba(20,18,16,0.05)',
          color: 'rgba(20,18,16,0.5)',
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '10px',
          fontWeight: 600,
          letterSpacing: '0.04em',
          padding: '3px 9px',
          borderRadius: '100px'
        }}>
            {city.month}
          </span>
        </div>
      </div>

      {/* Description */}
      <p style={{
      fontFamily: "'Inter', sans-serif",
      fontSize: '13.5px',
      color: 'rgba(20,18,16,0.6)',
      lineHeight: 1.72,
      margin: '0 0 4px',
      fontWeight: 300
    }}>
        {city.description}
      </p>

      {/* Collapsible sections */}
      <CollapsibleSection title="Strategic Opportunities" items={city.opportunities} defaultOpen={true} />
      <CollapsibleSection title="Strategic Value & ROI" items={city.strategicValue} defaultOpen={false} />
    </motion.div>;
};

// --- MAIN COMPONENT ---

export const AfricaExpansionRoadmap: React.FC = () => {
  const isMobile = useIsMobile();
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: '-60px 0px'
  });
  const [activeStep, setActiveStep] = useState(1);
  const [activeCity, setActiveCity] = useState(PAN_AFRICA_CITIES[0].id);
  const selectedCity = PAN_AFRICA_CITIES.find(c => c.id === activeCity) ?? PAN_AFRICA_CITIES[0];
  return <section ref={ref} style={{
    background: '#F7F6F3',
    width: '100%',
    boxSizing: 'border-box',
    overflow: 'hidden',
    position: 'relative',
    paddingTop: isMobile ? '72px' : '100px',
    paddingBottom: isMobile ? '72px' : '100px',
    fontFamily: "'Inter', sans-serif"
  }}>
      {/* Noise Overlay */}
      <div style={{
      position: 'absolute',
      inset: 0,
      backgroundImage: NOISE_SVG,
      backgroundRepeat: 'repeat',
      backgroundSize: '128px 128px',
      pointerEvents: 'none',
      zIndex: 0,
      opacity: 0.4
    }} />

      {/* Inner Container */}
      <div style={{
      maxWidth: '1100px',
      margin: '0 auto',
      padding: isMobile ? '0 24px' : '0 64px',
      position: 'relative',
      zIndex: 1
    }}>
        {/* Section Label */}
        <motion.div variants={rotateFade} initial="hidden" animate={isInView ? 'visible' : 'hidden'} custom={0} style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '20px'
      }}>
          <PlusSquareIcon />
          <span style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '11px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'rgba(20,18,16,0.45)',
          fontWeight: 500
        }}>
            Africa Expansion Roadmap 2026–2027
          </span>
        </motion.div>

        {/* H2 Title */}
        <div style={{
        overflow: 'hidden',
        marginBottom: '64px'
      }}>
          <motion.h2 variants={slideUpBlur} initial="hidden" animate={isInView ? 'visible' : 'hidden'} custom={0.1} style={{
          fontSize: isMobile ? 'clamp(26px, 8vw, 40px)' : 'clamp(30px, 3.8vw, 50px)',
          fontWeight: 300,
          letterSpacing: '-1.5px',
          lineHeight: 1.05,
          color: '#141210',
          margin: 0,
          fontFamily: "'Montserrat', sans-serif"
        }}>
            <span>{"Building Africa's "}</span>
            <em style={{
            fontStyle: 'italic',
            color: '#DE322D'
          }}>most connected</em>
            <span style={{
            color: 'rgba(20,18,16,0.2)'
          }}>{' entrepreneurial funding ecosystem.'}</span>
          </motion.h2>
        </div>

        {/* ─── SECTION 1: SA National Expansion: Horizontal Stepper ─── */}
        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? 'visible' : 'hidden'} custom={0.2} style={{
        marginBottom: isMobile ? '64px' : '80px'
      }}>
          <h3 style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '13px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#DE322D',
          fontWeight: 600,
          margin: '0 0 36px'
        }}>
            South Africa National Expansion
          </h3>

          <HorizontalStepper items={SA_TIMELINE} activeStep={activeStep} onStepClick={setActiveStep} isInView={isInView} isMobile={isMobile} />
        </motion.div>

        {/* Divider */}
        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? 'visible' : 'hidden'} custom={0.35} style={{
        height: '0.8px',
        background: 'rgba(20,18,16,0.08)',
        marginBottom: isMobile ? '52px' : '72px'
      }} />

        {/* ─── SECTION 2: Pan-African Cities: Tabs ─── */}
        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? 'visible' : 'hidden'} custom={0.4}>
          <h3 style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '13px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#DE322D',
          fontWeight: 600,
          margin: '0 0 28px'
        }}>
            Pan-African Gateway Cities 2027
          </h3>

          {/* Tab bar */}
          <div style={{
          display: 'flex',
          gap: '4px',
          overflowX: 'auto',
          paddingBottom: '2px',
          marginBottom: '28px',
          scrollbarWidth: 'none'
        }}>
            {PAN_AFRICA_CITIES.map(city => <button key={city.id} onClick={() => setActiveCity(city.id)} style={{
            flexShrink: 0,
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '-0.1px',
            background: activeCity === city.id ? '#DE322D' : 'rgba(20,18,16,0.05)',
            color: activeCity === city.id ? '#fff' : 'rgba(20,18,16,0.5)',
            transition: 'all 0.25s ease',
            whiteSpace: 'nowrap'
          }}>
                {city.city}
              </button>)}
          </div>

          {/* Tab panel */}
          <div style={{
          background: '#fff',
          borderRadius: '14px',
          padding: isMobile ? '24px' : '32px',
          border: '0.8px solid rgba(20,18,16,0.07)',
          minHeight: '280px'
        }}>
            <AnimatePresence mode="wait">
              <CityTabPanel key={selectedCity.id} city={selectedCity} />
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Font loading */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Inter:ital,wght@0,300;0,400;0,500;1,400&display=swap');
      `}</style>
    </section>;
};
