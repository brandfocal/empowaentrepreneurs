import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

// --- Types ---

interface SATimelineItem {
  id: string;
  province: string;
  date: string;
  city: string;
  theme: string;
}
interface CityData {
  id: string;
  name: string;
  country: string;
  tagline: string;
  region: string;
  launchDate: string;
  description: string;
  opportunities: string[];
  valueROI: string[];
}
interface ValuePropItem {
  id: string;
  text: string;
}

// --- Data ---

const SA_TIMELINE: SATimelineItem[] = [{
  id: 'sa-1',
  province: 'KwaZulu-Natal',
  date: '12–13 Nov 2026',
  city: 'Durban',
  theme: 'Port Economy, Logistics, Manufacturing, Township Economy & Tourism'
}, {
  id: 'sa-2',
  province: 'Western Cape',
  date: '18–19 Mar 2027',
  city: 'Cape Town',
  theme: 'Innovation, Venture Capital, Creative Economy & Tech Start-Ups'
}, {
  id: 'sa-3',
  province: 'Free State',
  date: '15–16 Apr 2027',
  city: 'Bloemfontein',
  theme: 'Agriculture, Manufacturing, Township Enterprise & Youth Economy'
}, {
  id: 'sa-4',
  province: 'Gauteng',
  date: '20–21 May 2027',
  city: 'Johannesburg',
  theme: 'Venture Finance, AI, Digital Economy, ESD & High-Growth Enterprise'
}, {
  id: 'sa-5',
  province: 'Eastern Cape',
  date: '17–18 Jun 2027',
  city: 'East London',
  theme: 'Automotive Sector, Manufacturing & Youth Entrepreneurship'
}, {
  id: 'sa-6',
  province: 'Limpopo',
  date: '15–16 Jul 2027',
  city: 'Polokwane',
  theme: 'Agriculture, Mining Supply Chains & Rural Enterprise Development'
}, {
  id: 'sa-7',
  province: 'North West',
  date: '19–20 Aug 2027',
  city: 'Rustenburg',
  theme: 'Mining Economy, Supplier Development & Industrial Enterprise'
}, {
  id: 'sa-8',
  province: 'Mpumalanga',
  date: '16–17 Sep 2027',
  city: 'Mbombela',
  theme: 'Green Economy, Agro-Processing & Tourism Enterprise'
}];
const CITIES: CityData[] = [{
  id: 'nairobi',
  name: 'Nairobi',
  country: 'Kenya',
  tagline: 'Silicon Savannah',
  region: 'East Africa',
  launchDate: 'September 2027',
  description: 'Known as the "Silicon Savannah," Kenya has emerged as one of Africa\'s leading innovation and start-up ecosystems. Its mature venture capital environment, strong government support for innovation, and growing digital economy make it an ideal strategic gateway for East African entrepreneurial expansion.',
  opportunities: ['Strong venture capital and angel investment ecosystem', 'Established innovation and technology infrastructure', 'Government-backed entrepreneurship initiatives', 'Rapidly growing fintech and digital economy'],
  valueROI: ['Direct access to East African regional markets', 'High concentration of skilled tech talent', 'Pro-business regulatory framework for startups']
}, {
  id: 'lagos',
  name: 'Lagos',
  country: 'Nigeria',
  tagline: 'The African Tech Giant',
  region: 'West Africa',
  launchDate: 'November 2027',
  description: 'Lagos is the beating heart of African entrepreneurship, boasting the continent\'s largest population and a massive consumer market. It is the primary destination for venture capital in Africa, particularly in the fintech and e-commerce sectors.',
  opportunities: ['Unrivaled market scale and population density', 'Vibrant financial services and payment infrastructure', 'Dynamic creative and entertainment industries', 'Deep pool of entrepreneurial experience'],
  valueROI: ['Highest potential for consumer-scale returns', 'Strategic hub for West African maritime trade', 'First-mover advantage in high-growth sectors']
}, {
  id: 'dakar',
  name: 'Dakar',
  country: 'Senegal',
  tagline: 'Francophone Tech Beacon',
  region: 'West Africa',
  launchDate: 'December 2027',
  description: 'Dakar has positioned itself as the leading tech and innovation hub for Francophone Africa. With a stable political environment and significant investments in infrastructure like Diamniadio Lake City, it offers a unique entry point into the UEMOA region.',
  opportunities: ['Gateway to the Francophone African market', 'Stable currency (CFA Franc) and economy', 'Rapidly developing digital infrastructure', 'Strong regional logistics and port connections'],
  valueROI: ['Strategic location for trans-Atlantic trade', 'Supportive ecosystem for French-speaking founders', 'Access to regional WAEMU financial markets']
}, {
  id: 'kigali',
  name: 'Kigali',
  country: 'Rwanda',
  tagline: 'The Innovation Laboratory',
  region: 'East Africa',
  launchDate: 'October 2027',
  description: 'Rwanda has built a reputation as Africa\'s testing ground for new technologies. Its ease of doing business, world-class governance, and \'Proof of Concept\' friendly environment make Kigali a strategic destination for pioneering entrepreneurs.',
  opportunities: ['Top-ranked ease of doing business in Africa', 'Government as a lead adopter of new tech', 'Bilingual environment (English/French)', 'Centralized regional administrative hub'],
  valueROI: ['Safe and highly efficient operating environment', 'Access to the East African Community (EAC) market', 'Predictable regulatory and tax landscape']
}, {
  id: 'accra',
  name: 'Accra',
  country: 'Ghana',
  tagline: 'The Golden Gateway',
  region: 'West Africa',
  launchDate: 'August 2027',
  description: 'Accra is recognized as one of the most stable and peaceful business environments in Africa. As the host of the AfCFTA Secretariat, Ghana is strategically positioned as the center for intra-African trade and investment.',
  opportunities: ['Home to the AfCFTA Secretariat', 'Stable democratic governance and rule of law', 'Growing tech and agribusiness sectors', 'Strong diaspora engagement and investment'],
  valueROI: ['Gateway to Pan-African trade integration', 'Robust legal protection for foreign investment', 'Thriving middle-class consumer market']
}];
const VALUE_PROPS: ValuePropItem[] = [{
  id: 'vp-1',
  text: "Build Africa's leading entrepreneurial funding and growth ecosystem"
}, {
  id: 'vp-2',
  text: 'Strengthen intra-African trade, investment, and ecosystem collaboration'
}, {
  id: 'vp-3',
  text: 'Accelerate venture creation, incubation, and enterprise sustainability'
}, {
  id: 'vp-4',
  text: 'Expand access to funding, procurement, and market opportunities'
}, {
  id: 'vp-5',
  text: 'Strengthen township and inclusive economy participation'
}, {
  id: 'vp-6',
  text: 'Drive measurable youth, women, and SME economic participation'
}, {
  id: 'vp-7',
  text: 'Position African entrepreneurs for regional and global competitiveness'
}, {
  id: 'vp-8',
  text: 'Create commercially sustainable entrepreneurial ecosystems across Africa'
}];

// --- Sub-components ---

const NoiseOverlay = () => <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'repeat',
  backgroundSize: '128px 128px'
}} />;
const AccordionItem = ({
  title,
  children,
  isOpen,
  onToggle
}: {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}) => <div className="border-t border-[#141210]/10 pt-4 mt-4">
    <button onClick={onToggle} className="flex items-center justify-between w-full text-left group cursor-pointer pb-2">
      <span className="font-['Montserrat'] text-[10px] font-semibold tracking-[1px] uppercase text-[#141210]/40 group-hover:text-[#DE322D] transition-colors">
        {title}
      </span>
      <ChevronDown className={cn('w-3.5 h-3.5 text-[#141210]/45 transition-transform duration-300', isOpen && 'rotate-180')} />
    </button>
    <motion.div initial={false} animate={{
    height: isOpen ? 'auto' : 0,
    opacity: isOpen ? 1 : 0
  }} className="overflow-hidden">
      <div className="py-2">{children}</div>
    </motion.div>
  </div>;

// --- Main Component ---

export const AfricaExpansionRoadmap = () => {
  const [activeProvince, setActiveProvince] = useState(0);
  const [activeCityId, setActiveCityId] = useState('nairobi');
  const [openAccordions, setOpenAccordions] = useState<string[]>(['strategic-opportunities']);
  const isMobile = useIsMobile();
  const activeCity = CITIES.find(c => c.id === activeCityId) || CITIES[0];
  const toggleAccordion = (id: string) => {
    setOpenAccordions(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };
  return <section className="relative w-full min-h-screen bg-[#F7F6F3] py-24 px-6 md:px-12 overflow-x-hidden">
      <NoiseOverlay />

      <div className="max-w-[1100px] mx-auto relative z-10">

        {/* Hero Section */}
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-5 h-5 flex-shrink-0 bg-[#DE322D] flex items-center justify-center rounded-[2px]">
              <Plus className="text-white w-3.5 h-3.5" />
            </div>
            <span className="font-['Montserrat'] text-[11px] font-medium tracking-[1.6px] uppercase text-[#141210]/45">
              Africa Expansion Roadmap 2026–2027
            </span>
          </div>

          <h1 className="font-['Montserrat'] text-[38px] md:text-[52px] font-light leading-[1.05] tracking-[-1.6px] text-[#141210] mb-6">
            <span className="block">EmpowaEntrepreneurs</span>
            <span className="block">
              <em className="not-italic text-[#DE322D]">Funding Summit™</em>
            </span>
            <span className="block text-[#141210]/22">Africa Expansion 2026–2027</span>
          </h1>

          <p className="font-['Montserrat'] text-[14px] md:text-[16px] font-semibold tracking-[-0.2px] text-[#141210]/70 mb-4 max-w-[780px]">
            Building Africa's Most Connected Entrepreneurial Funding &amp; Economic Activation Ecosystem
          </p>

          <p className="font-['Inter'] text-[14px] md:text-[15px] font-light text-[#141210]/55 leading-[1.75] max-w-[820px]">
            EmpowaEntrepreneurs Funding Summit is strategically positioned to evolve into a Pan-African
            entrepreneurial funding, venture creation, and economic activation platform connecting
            entrepreneurs, investors, DFIs, governments, corporates, and innovation ecosystems across
            the continent. Driven by global best practices in entrepreneurial ecosystem development,
            venture finance, innovation acceleration, and inclusive economic participation, the expansion
            strategy is designed to unlock scalable enterprise growth, strengthen intra-African
            collaboration, accelerate investment flows, and position African entrepreneurs for global
            competitiveness.
          </p>
        </div>

        {/* SA National Expansion — Horizontal Tab Interface */}
        <div className="mb-20">
          <h3 className="font-['Montserrat'] text-[13px] font-semibold tracking-[1.4px] uppercase text-[#DE322D] mb-9">
            South Africa National Expansion
          </h3>

          {/* Horizontally scrollable tab row */}
          <div style={{
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          marginBottom: '28px'
        }}>
            <div style={{
            display: 'flex',
            gap: '8px',
            width: 'max-content',
            padding: '4px 2px 8px'
          }}>
              {SA_TIMELINE.map((item, i) => <motion.button key={item.id} onClick={() => setActiveProvince(i)} whileHover={{
              scale: 1.03
            }} whileTap={{
              scale: 0.97
            }} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '40px',
              border: activeProvince === i ? 'none' : '1px solid rgba(20,18,16,0.12)',
              background: activeProvince === i ? 'linear-gradient(135deg, #DE322D, #c42823)' : 'transparent',
              color: activeProvince === i ? '#FFFFFF' : 'rgba(20,18,16,0.55)',
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '12px',
              fontWeight: activeProvince === i ? 600 : 500,
              letterSpacing: '0.02em',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.25s ease',
              boxShadow: activeProvince === i ? '0 4px 16px rgba(222,50,45,0.35)' : 'none'
            }}>
                  {activeProvince === i && <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.7)',
                flexShrink: 0
              }} />}
                  <span>{item.province}</span>
                </motion.button>)}
            </div>
          </div>

          {/* Active province detail panel */}
          <AnimatePresence mode="wait">
            <motion.div key={activeProvince} initial={{
            opacity: 0,
            y: 16,
            filter: 'blur(8px)'
          }} animate={{
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: {
              duration: 0.45,
              ease: [0.22, 1, 0.36, 1]
            }
          }} exit={{
            opacity: 0,
            y: -10,
            filter: 'blur(6px)',
            transition: {
              duration: 0.25
            }
          }} style={{
            background: '#FDFCFA',
            borderRadius: '16px',
            border: '1px solid rgba(20,18,16,0.08)',
            padding: isMobile ? '20px 20px' : '28px 32px',
            position: 'relative',
            overflow: 'hidden'
          }}>
              {/* Top coral accent bar */}
              <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, #DE322D, transparent)'
            }} />

              {/* Province number badge */}
              <div style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(222,50,45,0.1)',
              border: '1px solid rgba(222,50,45,0.2)',
              borderRadius: '100px',
              padding: '3px 10px',
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '10px',
              color: '#DE322D',
              fontWeight: 600,
              letterSpacing: '0.1em'
            }}>
                <span>{String(activeProvince + 1).padStart(2, '0')}</span>
                <span>{' / 08'}</span>
              </div>

              {/* Date badge + city */}
              <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '14px',
              flexWrap: 'wrap'
            }}>
                <span style={{
                display: 'inline-flex',
                background: 'rgba(222,50,45,0.1)',
                color: '#DE322D',
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.06em',
                padding: '4px 12px',
                borderRadius: '100px'
              }}>
                  {SA_TIMELINE[activeProvince].date}
                </span>
                <span style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '12px',
                color: 'rgba(20,18,16,0.45)',
                fontStyle: 'italic'
              }}>
                  {SA_TIMELINE[activeProvince].city}
                </span>
              </div>

              {/* Province name */}
              <h3 style={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 700,
              fontSize: isMobile ? '18px' : '22px',
              color: '#141210',
              letterSpacing: '-0.4px',
              margin: '0 0 10px',
              lineHeight: 1.2
            }}>
                {SA_TIMELINE[activeProvince].province}
              </h3>

              {/* Focus label + theme */}
              <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px'
            }}>
                <span style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#DE322D',
                flexShrink: 0,
                marginTop: '2px'
              }}>
                  Focus:
                </span>
                <span style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: isMobile ? '13px' : '14px',
                color: 'rgba(20,18,16,0.65)',
                lineHeight: 1.65,
                fontWeight: 300
              }}>
                  {SA_TIMELINE[activeProvince].theme}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div className="h-[0.8px] bg-[#141210]/10 mb-16" />

        {/* Pan-African Section */}
        <div className="mb-16">
          <h3 className="font-['Montserrat'] text-[13px] font-semibold tracking-[1.4px] uppercase text-[#DE322D] mb-7">
            Pan-African Gateway Cities 2027
          </h3>

          {/* City Tabs */}
          <div className="flex flex-wrap gap-1 md:gap-2 mb-7">
            {CITIES.map(city => <button key={city.id} onClick={() => setActiveCityId(city.id)} className={cn("px-4 py-2 rounded-lg font-['Montserrat'] text-[12px] font-semibold transition-all duration-300", activeCityId === city.id ? 'bg-[#DE322D] text-white' : 'bg-[#141210]/5 text-[#141210]/50 hover:bg-[#141210]/10')}>
                {city.name}
              </button>)}
          </div>

          {/* City Details Card */}
          <motion.div layout className="bg-white border border-[#141210]/7 rounded-2xl p-8 min-h-[300px] shadow-[0_4px_20px_rgba(20,18,16,0.02)]">
            <AnimatePresence mode="wait">
              <motion.div key={activeCityId} initial={{
              opacity: 0,
              x: 10
            }} animate={{
              opacity: 1,
              x: 0
            }} exit={{
              opacity: 0,
              x: -10
            }} transition={{
              duration: 0.3
            }}>
                <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                  <div>
                    <h4 className="font-['Montserrat'] text-[24px] font-bold text-[#141210] tracking-[-0.4px] mb-1">
                      <span>{activeCity.name}</span>
                      <span className="font-light text-[#141210]/40 text-[18px] ml-2">
                        {activeCity.country}
                      </span>
                    </h4>
                    <p className="font-['Inter'] text-[12px] text-[#141210]/40 italic">
                      {activeCity.tagline}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-[#DE322D]/10 text-[#DE322D] font-['Montserrat'] text-[10px] font-semibold tracking-[0.6px] uppercase px-2.5 py-1 rounded-full">
                      {activeCity.region}
                    </span>
                    <span className="bg-[#141210]/5 text-[#141210]/50 font-['Montserrat'] text-[10px] font-semibold tracking-[0.4px] px-2.5 py-1 rounded-full">
                      {activeCity.launchDate}
                    </span>
                  </div>
                </div>

                <p className="font-['Inter'] text-[14px] md:text-[15px] font-light text-[#141210]/65 leading-[1.7] mb-6 max-w-[850px]">
                  {activeCity.description}
                </p>

                <AccordionItem title="Strategic Opportunities" isOpen={openAccordions.includes('strategic-opportunities')} onToggle={() => toggleAccordion('strategic-opportunities')}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 mt-1">
                    {activeCity.opportunities.map(opt => <div key={opt} className="flex items-start gap-3">
                        <div className="w-5 h-5 flex-shrink-0 bg-[#DE322D] flex items-center justify-center rounded-[2px] mt-0.5">
                          <Plus className="text-white w-3 h-3" strokeWidth={3} />
                        </div>
                        <span className="font-['Inter'] text-[13px] text-[#141210]/60 font-light leading-snug">
                          {opt}
                        </span>
                      </div>)}
                  </div>
                </AccordionItem>

                <AccordionItem title="Strategic Value & ROI" isOpen={openAccordions.includes('roi')} onToggle={() => toggleAccordion('roi')}>
                  <div className="flex flex-col gap-3 mt-1">
                    {activeCity.valueROI.map(roi => <div key={roi} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-[#DE322D] rounded-full flex-shrink-0" />
                        <span className="font-['Inter'] text-[13px] text-[#141210]/60 font-light">
                          {roi}
                        </span>
                      </div>)}
                  </div>
                </AccordionItem>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-[0.8px] bg-[#141210]/10 mb-16" />

        {/* Strategic Expansion Value Proposition */}
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-5 h-5 flex-shrink-0 bg-[#DE322D] flex items-center justify-center rounded-[2px]">
              <Plus className="text-white w-3.5 h-3.5" />
            </div>
            <span className="font-['Montserrat'] text-[11px] font-medium tracking-[1.6px] uppercase text-[#141210]/45">
              Strategic Expansion Value Proposition
            </span>
          </div>

          <h2 className="font-['Montserrat'] text-[26px] md:text-[32px] font-light leading-[1.15] tracking-[-0.8px] text-[#141210] mb-10 max-w-[700px]">
            <span>The EmpowaEntrepreneurs™ Pan-African Expansion Strategy is </span>
            <em className="not-italic text-[#DE322D]">Designed To:</em>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {VALUE_PROPS.map(item => <div key={item.id} className="flex items-start gap-4 bg-white border border-[#141210]/7 rounded-xl p-5 shadow-[0_2px_12px_rgba(20,18,16,0.02)]">
                <div className="w-6 h-6 flex-shrink-0 bg-[#DE322D] flex items-center justify-center rounded-[3px] mt-0.5">
                  <Plus className="text-white w-3.5 h-3.5" strokeWidth={3} />
                </div>
                <span className="font-['Inter'] text-[13px] md:text-[14px] text-[#141210]/65 font-light leading-[1.6]">
                  {item.text}
                </span>
              </div>)}
          </div>
        </div>

        {/* Closing Tagline */}
        <div className="mt-16 pb-4 text-center">
          <p className="font-['Montserrat'] text-[15px] md:text-[17px] font-bold tracking-[-0.2px] text-[#141210] mb-2">
            EmpowaEntrepreneurs Funding Summit™ Africa
          </p>
          <p className="font-['Montserrat'] text-[13px] md:text-[14px] font-light italic text-[#DE322D]">
            Connecting Capital. Creating Ventures. Powering Africa's Entrepreneurial Future.
          </p>
        </div>

      </div>
    </section>;
};