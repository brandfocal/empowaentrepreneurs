import React, { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence, Variants } from 'framer-motion';

// --- Data ---

const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`;
const PANEL_THEMES = ['Funding', 'AI & Tech', 'VC & Investment', 'ESG', 'Digital Transformation', 'Township Enterprise', 'ESD', 'Women-Led Enterprise', 'Youth Entrepreneurship'];
const TAB_ACCENTS = ['rgba(59,78,95,0.25)', 'rgba(222,50,45,0.18)', 'rgba(59,78,95,0.25)', 'rgba(222,50,45,0.18)', 'rgba(59,78,95,0.25)'];
const PANEL_BG = ['linear-gradient(135deg, #1e2b38 0%, #141210 100%)', 'linear-gradient(135deg, #2a0e0c 0%, #141210 100%)', 'linear-gradient(135deg, #1e2b38 0%, #141210 100%)', 'linear-gradient(135deg, #2a0e0c 0%, #141210 100%)', 'linear-gradient(135deg, #1e2b38 0%, #141210 100%)'];
const SPECIALISED_PACKAGES = [{
  id: 'sp-media',
  index: 1,
  tier: 'Official Media Partner',
  shortLabel: 'Media Partner',
  label: 'Strategic Media, Broadcasting & Amplification Partner',
  description: 'For broadcasters, media houses, business publications, digital platforms, podcasts, and streaming services. Gain exclusive executive content access, premium interview opportunities, multi-platform storytelling, and business sector authority.',
  highlights: ['Official Media Partner designation & co-branded media wall', 'Executive interview & speaker access rights', 'Live broadcasting & content capture access', 'Podcast and digital storytelling integration', 'Integrated amplification campaigns & social collaboration', 'VIP hospitality & full media accreditation'],
  idealFor: ['Television Networks', 'Radio Stations', 'Podcasts', 'Digital Media Platforms', 'Business Publications', 'Streaming Platforms'],
  isPanelPackage: false
}, {
  id: 'sp-experience',
  index: 2,
  tier: 'Experience Partner',
  shortLabel: 'Experience Partner',
  label: 'Premium Delegate Experience & Hospitality Partner',
  description: 'For hospitality, luxury, automotive, travel, wellness, beauty, lifestyle, and experiential brands seeking high-touch audience engagement, premium brand recall, and executive interaction opportunities.',
  highlights: ['Premium experiential activation zone', 'VIP lounge branding rights', 'Product sampling and curated hospitality integration', 'Interactive delegate engagement activations', 'Networking and lifestyle integration', 'Social amplification and experiential positioning'],
  idealFor: ['Hospitality Brands', 'Luxury & Automotive', 'Travel & Wellness', 'Lifestyle Brands', 'Experiential Agencies'],
  isPanelPackage: false
}, {
  id: 'sp-exhibition',
  index: 3,
  tier: 'Premium Exhibition Partner',
  shortLabel: 'Exhibition Partner',
  label: 'Executive Market Access Pavilion',
  description: "Position your organisation at the centre of Africa's entrepreneurial, investment, and innovation ecosystem with direct lead generation, commercial pipeline development, and investor ecosystem exposure.",
  highlights: ['Premium exhibition placement & branded activation', 'Lead capture integration', 'Investor and founder engagement access', 'Business matchmaking opportunities', 'Executive foot-traffic optimisation', 'Product showcase and service visibility'],
  idealFor: ['Financial Services', 'Technology Companies', 'Consulting Firms', 'Professional Services', 'Innovation Hubs'],
  isPanelPackage: false
}, {
  id: 'sp-panel',
  index: 4,
  tier: 'Panel Sponsorship Partner',
  shortLabel: 'Panel Sponsor',
  label: 'Industry Conversation Leadership Package',
  description: "Own and lead one of the summit's strategic high-impact industry conversations. Gain sector authority positioning, thought leadership visibility, and strategic narrative ownership.",
  highlights: ['Naming rights to panel session', 'Executive panel participation & stage branding', 'Moderator brand mention', 'Media interview opportunities', 'Themes: Funding | AI & Tech | VC & Investment | ESG | Digital Transformation | Township Enterprise | ESD | Women-Led Enterprise | Youth Entrepreneurship'],
  idealFor: ['Banks & DFIs', 'Technology Companies', 'Impact Investors', 'Government Agencies', 'Industry Bodies'],
  isPanelPackage: true
}, {
  id: 'sp-goodie',
  index: 5,
  tier: 'Premium Goodie Bag Partner',
  shortLabel: 'Goodie Bag Partner',
  label: 'Executive Brand Placement Package',
  description: 'Integrate your brand directly into the executive delegate experience with premium product placement, branded inserts, QR-enabled engagement, and high-value audience visibility.',
  highlights: ['Premium product placement within executive goodie bags', 'Branded inserts and catalogues', 'QR-enabled engagement opportunities', 'Exclusive promotional offers', 'Luxury sampling rights', 'Direct executive brand exposure'],
  idealFor: ['Consumer Brands', 'Luxury Products', 'Tech Accessories', 'Financial Products', 'FMCG Brands'],
  isPanelPackage: false
}];

// --- Variants ---

const contentVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
    filter: 'blur(8px)'
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1] as const
    }
  },
  exit: {
    opacity: 0,
    y: -16,
    filter: 'blur(6px)',
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1] as const
    }
  }
};
const headerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    filter: 'blur(12px)'
  },
  visible: (d: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.9,
      delay: d,
      ease: [0.16, 1, 0.3, 1] as const
    }
  })
};
const highlightVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -12
  },
  visible: (d: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      delay: d,
      ease: [0.22, 1, 0.36, 1] as const
    }
  })
};

// --- Nav Item ---

interface NavItemProps {
  pkg: typeof SPECIALISED_PACKAGES[0];
  isActive: boolean;
  onClick: () => void;
}
const NavItem: React.FC<NavItemProps> = ({
  pkg,
  isActive,
  onClick
}) => {
  const [hovered, setHovered] = React.useState(false);
  const accentBg = TAB_ACCENTS[pkg.index - 1];
  return <div>
      <button onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: '0',
      padding: '0',
      border: 'none',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden',
      transition: 'background 0.25s ease',
      background: isActive ? `linear-gradient(90deg, ${accentBg} 0%, rgba(222,50,45,0.04) 100%)` : hovered ? 'rgba(247,246,243,0.04)' : 'transparent'
    }}>
        {/* Left active indicator bar */}
        <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: '3px',
        background: isActive ? 'linear-gradient(180deg, #DE322D, #c42823)' : 'transparent',
        borderRadius: '0 2px 2px 0',
        transition: 'background 0.25s ease'
      }} />
        {/* Inner content row */}
        <div style={{
        padding: '18px 28px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        width: '100%'
      }}>
          <span style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.1em',
          color: isActive ? '#DE322D' : 'rgba(247,246,243,0.2)',
          minWidth: '24px',
          transition: 'color 0.25s ease'
        }}>
            {`0${pkg.index}`}
          </span>
          <span style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '13px',
          fontWeight: isActive ? 600 : 300,
          color: isActive ? '#F7F6F3' : 'rgba(247,246,243,0.4)',
          letterSpacing: '-0.2px',
          lineHeight: 1.3,
          transition: 'all 0.25s ease'
        }}>
            {pkg.shortLabel}
          </span>
          {isActive && <motion.div layoutId="nav-indicator" style={{
          marginLeft: 'auto',
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: '#DE322D',
          flexShrink: 0
        }} transition={{
          duration: 0.3,
          ease: [0.22, 1, 0.36, 1] as const
        }} />}
        </div>
      </button>
      {/* Tab divider */}
      <div style={{
      height: '1px',
      background: 'rgba(247,246,243,0.05)',
      margin: '0 28px'
    }} />
    </div>;
};

// --- Detail Panel ---

interface DetailPanelProps {
  pkg: typeof SPECIALISED_PACKAGES[0];
}
const DetailPanel: React.FC<DetailPanelProps> = ({
  pkg
}) => <AnimatePresence mode="wait">
    <motion.div key={pkg.id} variants={contentVariants} initial="hidden" animate="visible" exit="exit" style={{
    width: '100%',
    background: PANEL_BG[pkg.index - 1],
    borderRadius: '20px',
    border: '1px solid rgba(247,246,243,0.07)',
    padding: '52px 56px',
    position: 'relative',
    overflow: 'hidden',
    minHeight: '520px',
    transition: 'background 0.5s ease',
    boxSizing: 'border-box'
  }}>
      {/* Noise overlay inside panel */}
      <div style={{
      position: 'absolute',
      inset: 0,
      backgroundImage: NOISE_SVG,
      backgroundRepeat: 'repeat',
      backgroundSize: '128px 128px',
      opacity: 0.4,
      pointerEvents: 'none',
      zIndex: 0
    }} aria-hidden="true" />

      {/* Top-left coral accent bar */}
      <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '2px',
      background: 'linear-gradient(90deg, #DE322D 0%, transparent 60%)'
    }} aria-hidden="true" />

      {/* Ghost number top-right */}
      <div style={{
      position: 'absolute',
      top: '-20px',
      right: '-10px',
      fontFamily: 'Montserrat, sans-serif',
      fontSize: '160px',
      fontWeight: 800,
      letterSpacing: '-8px',
      color: 'rgba(247,246,243,0.03)',
      userSelect: 'none',
      pointerEvents: 'none',
      lineHeight: 1
    }} aria-hidden="true">
        {`0${pkg.index}`}
      </div>

      {/* Actual content — sits above overlays */}
      <div style={{
      position: 'relative',
      zIndex: 1
    }}>

        {/* Package index + tier */}
        <div style={{
        marginBottom: '40px'
      }}>
          <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          marginBottom: '28px'
        }}>
            <span style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#DE322D'
          }}>
              {`0${pkg.index} / 05`}
            </span>
            <span style={{
            width: '40px',
            height: '1px',
            background: 'rgba(222,50,45,0.35)',
            display: 'inline-block'
          }} />
            <span style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '11px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(247,246,243,0.38)',
            fontWeight: 500
          }}>
              {pkg.tier}
            </span>
          </div>

          {/* Big editorial headline */}
          <h2 style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 200,
          fontSize: 'clamp(34px, 4.5vw, 58px)',
          letterSpacing: '-2.5px',
          lineHeight: 1.02,
          color: '#F7F6F3',
          margin: '0 0 28px 0'
        }}>
            {pkg.label}
          </h2>

          {/* Description */}
          <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '15px',
          lineHeight: 1.85,
          color: 'rgba(247,246,243,0.55)',
          fontWeight: 300,
          margin: 0,
          maxWidth: '600px'
        }}>
            {pkg.description}
          </p>
        </div>

        {/* Divider */}
        <div style={{
        width: '100%',
        height: '1px',
        background: 'rgba(247,246,243,0.08)',
        marginBottom: '40px'
      }} />

        {/* Highlights */}
        <div style={{
        marginBottom: '48px'
      }}>
          <h5 style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '0.14em',
          color: 'rgba(247,246,243,0.35)',
          fontWeight: 500,
          margin: '0 0 24px 0'
        }}>
            {"What's Included"}
          </h5>
          <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '0'
        }}>
            {pkg.highlights.map((item, i) => <motion.div key={`${pkg.id}-h-${i}`} variants={highlightVariants} initial="hidden" animate="visible" custom={i * 0.06} style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '16px',
            padding: '14px 0',
            borderBottom: '1px solid rgba(247,246,243,0.06)'
          }}>
                <span style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '10px',
              fontWeight: 700,
              color: '#DE322D',
              marginTop: '3px',
              flexShrink: 0,
              letterSpacing: '0.05em'
            }}>
                  {'—'}
                </span>
                <span style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '13px',
              color: 'rgba(247,246,243,0.65)',
              lineHeight: 1.6,
              fontWeight: 300
            }}>
                  {item}
                </span>
              </motion.div>)}
          </div>

          {pkg.isPanelPackage && <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          marginTop: '20px'
        }}>
              {PANEL_THEMES.map(panelTheme => <span key={panelTheme} style={{
            background: 'rgba(222,50,45,0.15)',
            border: '1px solid rgba(222,50,45,0.25)',
            borderRadius: '100px',
            padding: '4px 12px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '11px',
            color: '#DE322D',
            fontWeight: 500,
            letterSpacing: '0.02em'
          }}>
                  {panelTheme}
                </span>)}
            </div>}
        </div>

        {/* Ideal For */}
        <div>
          <h5 style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '0.14em',
          color: 'rgba(247,246,243,0.35)',
          fontWeight: 500,
          margin: '0 0 16px 0'
        }}>
            Ideal For
          </h5>
          <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
            {pkg.idealFor.map(tag => <span key={tag} style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            color: 'rgba(247,246,243,0.55)',
            fontWeight: 400,
            padding: '6px 14px',
            background: 'rgba(247,246,243,0.07)',
            border: '1px solid rgba(247,246,243,0.1)',
            borderRadius: '100px'
          }}>
                {tag}
              </span>)}
          </div>
        </div>

      </div>
    </motion.div>
  </AnimatePresence>;

// --- Main Component ---

export const SpecialisedPackagesSection: React.FC = () => {
  const [activeId, setActiveId] = useState(SPECIALISED_PACKAGES[0].id);
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, {
    once: true,
    margin: '-60px 0px'
  });
  const activePkg = SPECIALISED_PACKAGES.find(p => p.id === activeId) ?? SPECIALISED_PACKAGES[0];
  return <section style={{
    background: '#0F0D0B',
    width: '100%',
    boxSizing: 'border-box',
    overflow: 'hidden',
    position: 'relative',
    minHeight: '100vh'
  }}>
      {/* Section-level noise overlay */}
      <div style={{
      position: 'absolute',
      inset: 0,
      backgroundImage: NOISE_SVG,
      backgroundRepeat: 'repeat',
      backgroundSize: '128px 128px',
      pointerEvents: 'none',
      opacity: 0.35,
      zIndex: 0
    }} aria-hidden="true" />

      {/* ── Section header ── */}
      <div ref={headerRef} style={{
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '96px 64px 64px',
      boxSizing: 'border-box',
      position: 'relative',
      zIndex: 1
    }}>
        <motion.div variants={headerVariants} initial="hidden" animate={isHeaderInView ? 'visible' : 'hidden'} custom={0} style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '32px'
      }}>
          <span style={{
          display: 'inline-block',
          width: '32px',
          height: '1px',
          background: 'rgba(247,246,243,0.3)'
        }} />
          <span style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '11px',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'rgba(247,246,243,0.35)',
          fontWeight: 500
        }}>
            Specialised Packages
          </span>
        </motion.div>

        <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '64px',
        alignItems: 'flex-end'
      }}>
          <motion.h1 variants={headerVariants} initial="hidden" animate={isHeaderInView ? 'visible' : 'hidden'} custom={0.1} style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 200,
          fontSize: 'clamp(44px, 5.5vw, 72px)',
          letterSpacing: '-3px',
          lineHeight: 0.98,
          color: '#F7F6F3',
          margin: 0
        }}>
            <span style={{
            display: 'inline-block'
          }}>{'Five purpose-built '}</span>
            <em style={{
            fontStyle: 'italic',
            color: '#DE322D',
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 300
          }}>
              {'packages.'}
            </em>
            <br />
            <span style={{
            color: 'rgba(247,246,243,0.12)',
            fontWeight: 300
          }}>{'One summit.'}</span>
          </motion.h1>

          <motion.p variants={headerVariants} initial="hidden" animate={isHeaderInView ? 'visible' : 'hidden'} custom={0.22} style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '15px',
          lineHeight: 1.85,
          color: 'rgba(247,246,243,0.5)',
          fontWeight: 300,
          margin: 0
        }}>
            Targeted partnership opportunities beyond the main tiers — designed for specific brand
            objectives, commercial goals, and activation strategies.
          </motion.p>
        </div>
      </div>

      {/* ── Split pane ── */}
      <div style={{
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '0 64px 120px',
      boxSizing: 'border-box',
      position: 'relative',
      zIndex: 1,
      display: 'grid',
      gridTemplateColumns: '280px 1fr',
      gap: '32px',
      alignItems: 'start'
    }}>
        {/* LEFT: Sticky nav panel */}
        <nav aria-label="Package navigation" style={{
        position: 'sticky',
        top: '88px'
      }}>
          <div style={{
          background: '#1a1412',
          borderRadius: '20px',
          border: '1px solid rgba(247,246,243,0.07)',
          overflow: 'hidden',
          position: 'relative'
        }}>
            {/* Left panel header */}
            <div style={{
            padding: '28px 28px 24px',
            borderBottom: '1px solid rgba(247,246,243,0.07)'
          }}>
              <span style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.16em',
              color: 'rgba(247,246,243,0.3)',
              display: 'block'
            }}>
                Select Package
              </span>
              <div style={{
              height: '2px',
              width: '32px',
              background: '#DE322D',
              marginTop: '10px',
              borderRadius: '2px'
            }} />
            </div>

            {/* Nav items */}
            <div>
              {SPECIALISED_PACKAGES.map(pkg => <NavItem key={pkg.id} pkg={pkg} isActive={pkg.id === activeId} onClick={() => setActiveId(pkg.id)} />)}
            </div>
          </div>
        </nav>

        {/* RIGHT: Detail panel */}
        <div style={{
        paddingTop: '4px'
      }}>
          <DetailPanel pkg={activePkg} />
        </div>
      </div>
    </section>;
};