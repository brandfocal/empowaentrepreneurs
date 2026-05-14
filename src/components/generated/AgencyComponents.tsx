import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`;
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
const PlusSquareIcon = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
  <path d="M16.25 2.5H3.75C3.41848 2.5 3.10054 2.6317 2.86612 2.86612C2.6317 3.10054 2.5 3.41848 2.5 3.75V16.25C2.5 16.5815 2.6317 16.8995 2.86612 17.1339C3.10054 17.3683 3.41848 17.5 3.75 17.5H16.25C16.5815 17.5 16.8995 17.3683 17.1339 17.1339C17.3683 16.8995 17.5 16.5815 17.5 16.25V3.75C17.5 3.41848 17.3683 3.10054 17.1339 2.86612C16.8995 2.6317 16.5815 2.5 16.25 2.5ZM13.125 10.625H10.625V13.125C10.625 13.2908 10.5592 13.4497 10.4419 13.5669C10.3247 13.6842 10.1658 13.75 10 13.75C9.83424 13.75 9.67527 13.6842 9.55806 13.5669C9.44085 13.4497 9.375 13.2908 9.375 13.125V10.625H6.875C6.70924 10.625 6.55027 10.5592 6.43306 10.4419C6.31585 10.3247 6.25 10.1658 6.25 10C6.25 9.83424 6.31585 9.67527 6.43306 9.55806C6.55027 9.44085 6.70924 9.375 6.875 9.375H9.375V6.875C9.375 6.70924 9.44085 6.55027 9.55806 6.43306C9.67527 6.31585 9.83424 6.25 10 6.25C10.1658 6.25 10.3247 6.31585 10.4419 6.43306C10.5592 6.55027 10.625 6.70924 10.625 6.875V9.375H13.125C13.2908 9.375 13.4497 9.44085 13.5669 9.55806C13.6842 9.67527 13.75 9.83424 13.75 10C13.75 10.1658 13.6842 10.3247 13.5669 10.4419C13.4497 10.5592 13.2908 10.625 13.125 10.625Z" fill="#DE322D" />
</svg>;
const PlusSquareIconLight = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
  <path d="M16.25 2.5H3.75C3.41848 2.5 3.10054 2.6317 2.86612 2.86612C2.6317 3.10054 2.5 3.41848 2.5 3.75V16.25C2.5 16.5815 2.6317 16.8995 2.86612 17.1339C3.10054 17.3683 3.41848 17.5 3.75 17.5H16.25C16.5815 17.5 16.8995 17.3683 17.1339 17.1339C17.3683 16.8995 17.5 16.5815 17.5 16.25V3.75C17.5 3.41848 17.3683 3.10054 17.1339 2.86612C16.8995 2.6317 16.5815 2.5 16.25 2.5ZM13.125 10.625H10.625V13.125C10.625 13.2908 10.5592 13.4497 10.4419 13.5669C10.3247 13.6842 10.1658 13.75 10 13.75C9.83424 13.75 9.67527 13.6842 9.55806 13.5669C9.44085 13.4497 9.375 13.2908 9.375 13.125V10.625H6.875C6.70924 10.625 6.55027 10.5592 6.43306 10.4419C6.31585 10.3247 6.25 10.1658 6.25 10C6.25 9.83424 6.31585 9.67527 6.43306 9.55806C6.55027 9.44085 6.70924 9.375 6.875 9.375H9.375V6.875C9.375 6.70924 9.44085 6.55027 9.55806 6.43306C9.67527 6.31585 9.83424 6.25 10 6.25C10.1658 6.25 10.3247 6.31585 10.4419 6.43306C10.5592 6.55027 10.625 6.70924 10.625 6.875V9.375H13.125C13.2908 9.375 13.4497 9.44085 13.5669 9.55806C13.6842 9.67527 13.75 9.83424 13.75 10C13.75 10.1658 13.6842 10.3247 13.5669 10.4419C13.4497 10.5592 13.2908 10.625 13.125 10.625Z" fill="rgba(247,246,243,0.35)" />
</svg>;
const ArrowIconInk = () => <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
  <path d="M1.5 10.5L10.5 1.5M10.5 1.5H3.5M10.5 1.5V8.5" stroke="rgba(20,18,16,0.4)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
</svg>;

// ─── Video Banner ─────────────────────────────────────────────────────────────
const VIDEO_BANNER_STATS = [{
  id: 'vb-s1',
  value: '4,000+',
  label: 'Attendees'
}, {
  id: 'vb-s2',
  value: '120+',
  label: 'Investors'
}, {
  id: 'vb-s3',
  value: '30+',
  label: 'Markets'
}, {
  id: 'vb-s4',
  value: '48h',
  label: 'Programming'
}];
export const VideoBanner = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, {
    once: true,
    margin: '-60px 0px'
  });
  const isMobile = useIsMobile();
  const VIDEOS = [
    { id: '6b4FokdWOpE', title: 'EmpowaEntrepreneurs Summit Reel 1' },
    { id: 'MMMLydb2MY4', title: 'EmpowaEntrepreneurs Summit Reel 2' }
  ];
  const [activeMainId, setActiveMainId] = useState(VIDEOS[0].id);
  const [isPlaying, setIsPlaying] = useState(false);
  return <section ref={sectionRef} style={{
    background: '#0F0D0B',
    width: '100%',
    boxSizing: 'border-box',
    overflow: 'hidden',
    position: 'relative',
    paddingTop: isMobile ? '72px' : '100px',
    paddingBottom: isMobile ? '72px' : '100px'
  }}>
      <div aria-hidden="true" style={{
      position: 'absolute',
      top: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '80%',
      height: '1px',
      background: 'linear-gradient(90deg, transparent, rgba(222,50,45,0.5), transparent)',
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
        marginBottom: '48px'
      }}>
          <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={rotateFade} custom={0} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '20px'
        }}>
            <PlusSquareIconLight />
            <span style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '12px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(247,246,243,0.35)',
            fontWeight: 500
          }}>Summit Experience</span>
          </motion.div>
          <div style={{
          overflow: 'hidden'
        }}>
            <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.1} style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: isMobile ? 'clamp(28px, 8vw, 42px)' : 'clamp(32px, 4vw, 58px)',
            fontWeight: 300,
            letterSpacing: '-1.8px',
            lineHeight: 1.04,
            color: '#F7F6F3',
            margin: 0
          }}>
              <span>{'Feel the '}</span>
              <em style={{
              fontStyle: 'italic',
              color: '#DE322D'
            }}>energy</em>
              <span style={{
              color: 'rgba(247,246,243,0.2)'
            }}>{' of the summit.'}</span>
            </motion.h2>
          </div>
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          marginBottom: '40px'
        }}>
          {/* Main Area */}
          <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={scaleReveal} custom={0.2} style={{
            borderRadius: isMobile ? '20px' : '28px',
            overflow: 'hidden',
            position: 'relative',
            background: '#141210',
            border: '1px solid rgba(247,246,243,0.07)',
            boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
            aspectRatio: '16/9',
            width: '100%'
          }}>
            {!isPlaying ? (
              <motion.div style={{ position: 'absolute', inset: 0, cursor: 'pointer' }} onClick={() => setIsPlaying(true)} whileHover={{ scale: 1.02 }} transition={{ duration: 0.4 }}>
                <img src={`https://img.youtube.com/vi/${activeMainId}/maxresdefault.jpg`} alt="Main Video" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'brightness(0.65) saturate(0.8)' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,9,8,0.85) 0%, rgba(10,9,8,0.2) 55%, transparent 100%)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ width: isMobile ? '64px' : '84px', height: isMobile ? '64px' : '84px', borderRadius: '50%', background: 'linear-gradient(135deg, #DE322D, #c42823)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 16px rgba(222,50,45,0.12), 0 12px 40px rgba(222,50,45,0.5)', flexShrink: 0 }}>
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M10 7L22 14L10 21V7Z" fill="white" /></svg>
                  </div>
                </div>
                <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px' }}>
                   <span style={{ fontFamily: 'Inter, sans-serif', fontSize: isMobile ? '16px' : '20px', fontWeight: 300, color: '#F7F6F3', letterSpacing: '-0.3px', display: 'block' }}>
                     {VIDEOS.find(v => v.id === activeMainId)?.title}
                   </span>
                </div>
              </motion.div>
            ) : (
              <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${activeMainId}?autoplay=1&mute=0&controls=1&rel=0`} title="Main Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ display: 'block', border: 'none', width: '100%', height: '100%' }} />
            )}
          </motion.div>

          {/* Side Playlist Area */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            {VIDEOS.map((video, index) => {
              const isActive = activeMainId === video.id;
              return (
              <motion.div key={video.id} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={scaleReveal} custom={0.3 + index * 0.1} onClick={() => { setActiveMainId(video.id); setIsPlaying(true); }} style={{
                width: isMobile ? 'calc(50% - 8px)' : '240px',
                borderRadius: isMobile ? '12px' : '16px',
                overflow: 'hidden',
                position: 'relative',
                background: '#141210',
                border: isActive ? '2px solid #DE322D' : '1px solid rgba(247,246,243,0.07)',
                boxShadow: isActive ? '0 0 20px rgba(222,50,45,0.3)' : '0 12px 30px rgba(0,0,0,0.3)',
                aspectRatio: '16/9',
                cursor: 'pointer',
                opacity: isActive ? 1 : 0.6,
                transition: 'all 0.3s ease'
              }}>
                <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }} style={{ position: 'absolute', inset: 0 }}>
                  <img src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`} alt={video.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'brightness(0.6) saturate(0.8)' }} />
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isActive ? (
                      <div style={{ background: 'rgba(222,50,45,0.9)', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', color: '#fff', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>PLAYING</div>
                    ) : (
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(20,18,16,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(247,246,243,0.2)' }}>
                        <svg width="14" height="14" viewBox="0 0 28 28" fill="none"><path d="M10 7L22 14L10 21V7Z" fill="white" /></svg>
                      </div>
                    )}
                  </div>
                  <div style={{ position: 'absolute', bottom: '8px', left: '12px', right: '12px' }}>
                     <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 400, color: '#F7F6F3', letterSpacing: '-0.2px', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{video.title}</span>
                  </div>
                </motion.div>
              </motion.div>
            )})}
          </div>
        </div>
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={staggerContainer} custom={0.08} style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
        gap: '1px',
        background: 'rgba(247,246,243,0.06)',
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1px solid rgba(247,246,243,0.06)'
      }}>
          {VIDEO_BANNER_STATS.map((stat, i) => <motion.div key={stat.id} variants={staggerChild} style={{
          background: '#141210',
          padding: isMobile ? '24px 20px' : '32px 36px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          borderRight: !isMobile && i < VIDEO_BANNER_STATS.length - 1 ? '1px solid rgba(247,246,243,0.06)' : 'none'
        }}>
              <div style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: isMobile ? '28px' : 'clamp(32px, 3.5vw, 48px)',
            fontWeight: 200,
            letterSpacing: '-2px',
            color: '#F7F6F3',
            lineHeight: 1
          }}>{stat.value}</div>
              <div style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '11px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'rgba(247,246,243,0.3)',
            fontWeight: 500
          }}>{stat.label}</div>
            </motion.div>)}
        </motion.div>
      </div>
    </section>;
};

// ─── Speaker Carousel ─────────────────────────────────────────────────────────
type Speaker = {
  id: string;
  name: string;
  role: string;
  company: string;
  imageSrc: string;
  topic: string;
  accentColor: string;
  tag: string;
};
const SPEAKERS: Speaker[] = [{
  id: 'sp-1',
  name: 'Dr. Amara Diallo',
  role: 'Managing Partner',
  company: 'Sahel Capital',
  imageSrc: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80',
  topic: 'Catalytic Capital for African SMEs',
  accentColor: '#DE322D',
  tag: 'Keynote'
}, {
  id: 'sp-2',
  name: 'Kwame Asante',
  role: 'Investment Director',
  company: 'Pan-African Dev Fund',
  imageSrc: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80',
  topic: 'DFI Mandates & the Funding Gap',
  accentColor: '#3B4E5F',
  tag: 'Panel'
}, {
  id: 'sp-3',
  name: 'Fatima El-Rashid',
  role: 'Founder & CEO',
  company: 'Zenith Agritech',
  imageSrc: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80',
  topic: 'Scaling Agri-Tech Across 10 Markets',
  accentColor: '#2D6A4F',
  tag: 'Fireside'
}, {
  id: 'sp-4',
  name: 'Tobenna Okafor',
  role: 'Venture Partner',
  company: 'Lagos Ventures',
  imageSrc: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
  topic: 'VC Thesis for Frontier Markets',
  accentColor: '#6B5E4A',
  tag: 'Workshop'
}, {
  id: 'sp-5',
  name: 'Nadia Mwangi',
  role: 'Chief Strategy Officer',
  company: 'AfriTech Holdings',
  imageSrc: 'https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=600&q=80',
  topic: 'Building Billion-Dollar African Brands',
  accentColor: '#7B3F8A',
  tag: 'Keynote'
}, {
  id: 'sp-6',
  name: 'Samuel Adeyemi',
  role: 'Co-Founder',
  company: 'HealthStack Africa',
  imageSrc: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80',
  topic: 'Health-Tech Infrastructure at Scale',
  accentColor: '#C47F17',
  tag: 'Panel'
}];
const SPEAKER_TAG_COLORS: Record<string, string> = {
  Keynote: 'rgba(222,50,45,0.18)',
  Panel: 'rgba(59,78,95,0.22)',
  Fireside: 'rgba(45,106,79,0.22)',
  Workshop: 'rgba(107,94,74,0.22)'
};
const SPEAKER_TAB_ACCENT: Record<string, string> = {
  All: '#DE322D',
  Keynote: '#DE322D',
  Panel: '#3B4E5F',
  Fireside: '#2D6A4F',
  Workshop: '#6B5E4A'
};
const SPEAKER_TABS = [{
  id: 'tab-all',
  label: 'All'
}, {
  id: 'tab-keynote',
  label: 'Keynote'
}, {
  id: 'tab-panel',
  label: 'Panel'
}, {
  id: 'tab-fireside',
  label: 'Fireside'
}, {
  id: 'tab-workshop',
  label: 'Workshop'
}];
export const SpeakerCarousel = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, {
    once: true,
    margin: '-60px 0px'
  });
  const [activeIdx, setActiveIdx] = useState(0);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('All');
  const isMobile = useIsMobile();
  const trackRef = useRef<HTMLDivElement>(null);
  const cardWidth = isMobile ? 280 : 380;
  const cardGap = 16;
  const filteredSpeakers = activeTab === 'All' ? SPEAKERS : SPEAKERS.filter(sp => sp.tag === activeTab);
  const scrollToIdx = (idx: number) => {
    if (trackRef.current) {
      trackRef.current.scrollTo({
        left: idx * (cardWidth + cardGap),
        behavior: 'smooth'
      });
    }
    setActiveIdx(idx);
  };
  const handleTabChange = (label: string) => {
    setActiveTab(label);
    setActiveIdx(0);
    if (trackRef.current) {
      trackRef.current.scrollTo({
        left: 0,
        behavior: 'smooth'
      });
    }
  };
  const handlePrev = () => scrollToIdx(Math.max(0, activeIdx - 1));
  const handleNext = () => scrollToIdx(Math.min(filteredSpeakers.length - 1, activeIdx + 1));
  const accentColor = SPEAKER_TAB_ACCENT[activeTab] ?? '#DE322D';
  return <section ref={sectionRef} style={{
    background: '#F4F1EB',
    paddingTop: isMobile ? '80px' : '140px',
    paddingBottom: isMobile ? '80px' : '140px',
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
      opacity: 0.5
    }} />
      <div aria-hidden="true" style={{
      position: 'absolute',
      top: '-10%',
      right: '-5%',
      width: '700px',
      height: '700px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(222,50,45,0.07) 0%, transparent 65%)',
      pointerEvents: 'none',
      zIndex: 0
    }} />

      {/* ── Header row ── */}
      <div style={{
      padding: isMobile ? '0 24px 48px' : '0 80px 56px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      flexWrap: 'wrap',
      gap: '24px',
      position: 'relative',
      zIndex: 1
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
            fontFamily: 'Inter, sans-serif',
            fontSize: '12px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(20,18,16,0.45)',
            fontWeight: 500
          }}>Featured Speakers</span>
          </motion.div>
          <div style={{
          overflow: 'hidden'
        }}>
            <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.1} style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: isMobile ? 'clamp(32px, 9vw, 52px)' : 'clamp(48px, 5.5vw, 88px)',
            fontWeight: 200,
            letterSpacing: isMobile ? '-1.5px' : '-3px',
            lineHeight: 0.95,
            color: '#141210',
            margin: 0
          }}>
              <span>{'Voices that '}</span>
              <em style={{
              fontStyle: 'italic',
              color: '#DE322D'
            }}>{'define'}</em>
              <br />
              <span style={{
              color: 'rgba(20,18,16,0.2)'
            }}>{'the continent.'}</span>
            </motion.h2>
          </div>
        </div>
        {!isMobile && <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideFromRight} custom={0.3} style={{
        display: 'flex',
        gap: '10px',
        alignItems: 'center'
      }}>
            <motion.button whileHover={{
          scale: 1.08
        }} whileTap={{
          scale: 0.94
        }} onClick={handlePrev} disabled={activeIdx === 0} style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          border: '1px solid rgba(20,18,16,0.14)',
          background: activeIdx === 0 ? 'rgba(20,18,16,0.03)' : 'rgba(20,18,16,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: activeIdx === 0 ? 'not-allowed' : 'pointer',
          opacity: activeIdx === 0 ? 0.4 : 1
        }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8L10 13" stroke="rgba(20,18,16,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </motion.button>
            <motion.button whileHover={{
          scale: 1.08
        }} whileTap={{
          scale: 0.94
        }} onClick={handleNext} disabled={activeIdx === filteredSpeakers.length - 1} style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          border: '1px solid rgba(20,18,16,0.14)',
          background: activeIdx === filteredSpeakers.length - 1 ? 'rgba(20,18,16,0.03)' : 'rgba(20,18,16,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: activeIdx === filteredSpeakers.length - 1 ? 'not-allowed' : 'pointer',
          opacity: activeIdx === filteredSpeakers.length - 1 ? 0.4 : 1
        }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="rgba(20,18,16,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </motion.button>
          </motion.div>}
      </div>

      {/* ── Tab switcher ── */}
      <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.18} style={{
      padding: isMobile ? '0 24px 40px' : '0 80px 52px',
      position: 'relative',
      zIndex: 1
    }}>
        <div style={{
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap'
      }}>
          {SPEAKER_TABS.map(tab => {
          const isActive = activeTab === tab.label;
          const tabAccent = SPEAKER_TAB_ACCENT[tab.label] ?? '#DE322D';
          return <motion.button key={tab.id} onClick={() => handleTabChange(tab.label)} whileHover={{
            scale: 1.04
          }} whileTap={{
            scale: 0.97
          }} style={{
            all: 'unset',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            padding: isMobile ? '8px 16px' : '9px 20px',
            borderRadius: '100px',
            border: '1px solid',
            borderColor: isActive ? tabAccent : 'rgba(20,18,16,0.14)',
            background: isActive ? tabAccent : 'rgba(255,255,255,0.6)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            transition: 'background 0.25s ease, border-color 0.25s ease, color 0.25s ease',
            fontFamily: 'Inter, sans-serif',
            fontSize: '12px',
            fontWeight: isActive ? 600 : 400,
            letterSpacing: '0.04em',
            color: isActive ? '#fff' : 'rgba(20,18,16,0.55)'
          }}>
              {tab.label !== 'All' && <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: isActive ? 'rgba(255,255,255,0.6)' : tabAccent,
              flexShrink: 0,
              display: 'block'
            }} />}
              <span>{tab.label}</span>
              {tab.label === 'All' && <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              background: isActive ? 'rgba(255,255,255,0.22)' : 'rgba(20,18,16,0.08)',
              fontFamily: 'Inter, sans-serif',
              fontSize: '10px',
              fontWeight: 700,
              color: isActive ? '#fff' : 'rgba(20,18,16,0.45)'
            }}>{SPEAKERS.length}</span>}
              {tab.label !== 'All' && <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              background: isActive ? 'rgba(255,255,255,0.22)' : 'rgba(20,18,16,0.08)',
              fontFamily: 'Inter, sans-serif',
              fontSize: '10px',
              fontWeight: 700,
              color: isActive ? '#fff' : 'rgba(20,18,16,0.45)'
            }}>{SPEAKERS.filter(sp => sp.tag === tab.label).length}</span>}
            </motion.button>;
        })}
        </div>
      </motion.div>

      {/* ── Card track ── */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{
        opacity: 0,
        y: 18,
        filter: 'blur(8px)'
      }} animate={{
        opacity: 1,
        y: 0,
        filter: 'blur(0px)'
      }} exit={{
        opacity: 0,
        y: -12,
        filter: 'blur(6px)'
      }} transition={{
        duration: 0.42,
        ease: [0.22, 1, 0.36, 1]
      }} style={{
        position: 'relative',
        zIndex: 1
      }}>
          <div ref={trackRef} style={{
          display: 'flex',
          gap: `${cardGap}px`,
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          paddingLeft: isMobile ? '24px' : '80px',
          paddingRight: isMobile ? '24px' : '80px',
          paddingBottom: '8px',
          cursor: 'grab',
          userSelect: 'none'
        }}>
            {filteredSpeakers.length === 0 ? <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            minHeight: '320px',
            flexDirection: 'column',
            gap: '12px',
            paddingRight: isMobile ? '24px' : '80px'
          }}>
                  <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(20,18,16,0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="7" r="4" stroke="rgba(20,18,16,0.3)" strokeWidth="1.4" /><path d="M3 17c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke="rgba(20,18,16,0.3)" strokeWidth="1.4" strokeLinecap="round" /></svg>
                  </div>
                  <span style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              color: 'rgba(20,18,16,0.35)',
              letterSpacing: '-0.1px'
            }}>No speakers in this session type</span>
                </div> : filteredSpeakers.map((speaker, i) => <motion.article key={speaker.id} variants={scaleReveal} custom={i * 0.07} onMouseEnter={() => setHoveredId(speaker.id)} onMouseLeave={() => setHoveredId(null)} style={{
            flexShrink: 0,
            width: `${cardWidth}px`,
            borderRadius: '24px',
            overflow: 'hidden',
            background: '#FFFFFF',
            border: '1px solid',
            borderColor: hoveredId === speaker.id ? 'rgba(20,18,16,0.14)' : 'rgba(20,18,16,0.07)',
            transition: 'border-color 0.3s ease, box-shadow 0.4s ease, transform 0.4s ease',
            boxShadow: hoveredId === speaker.id ? '0 32px 80px rgba(20,18,16,0.18)' : '0 4px 20px rgba(20,18,16,0.07)',
            transform: hoveredId === speaker.id ? 'translateY(-10px)' : 'translateY(0)'
          }}>
                  <div style={{
              height: isMobile ? '260px' : '320px',
              overflow: 'hidden',
              position: 'relative'
            }}>
                    <img src={speaker.imageSrc} alt={`${speaker.name} — ${speaker.role} at ${speaker.company}`} style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                filter: 'brightness(0.82) saturate(0.8)',
                transform: hoveredId === speaker.id ? 'scale(1.07)' : 'scale(1)',
                transition: 'transform 0.8s cubic-bezier(0.22,1,0.36,1)'
              }} />
                    <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(10,9,8,0.5) 0%, transparent 55%)',
                pointerEvents: 'none'
              }} />
                    <div style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                background: SPEAKER_TAG_COLORS[speaker.tag] ?? 'rgba(20,18,16,0.1)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: `1px solid ${speaker.accentColor}44`,
                borderRadius: '100px',
                padding: '4px 12px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '10px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(20,18,16,0.65)',
                fontWeight: 500
              }}>{speaker.tag}</div>
                    <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: `linear-gradient(90deg, ${speaker.accentColor}, transparent)`,
                opacity: hoveredId === speaker.id ? 1 : 0.4,
                transition: 'opacity 0.3s ease'
              }} />
                  </div>
                  <div style={{
              padding: '28px 28px 32px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              background: '#FFFFFF'
            }}>
                    <div>
                      <h3 style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '19px',
                  fontWeight: 500,
                  letterSpacing: '-0.4px',
                  color: '#141210',
                  margin: '0 0 5px',
                  lineHeight: 1.2
                }}>{speaker.name}</h3>
                      <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '12px',
                  color: 'rgba(20,18,16,0.45)',
                  margin: 0,
                  letterSpacing: '0.02em'
                }}>
                        <span>{speaker.role}</span><span style={{
                    color: 'rgba(20,18,16,0.2)',
                    margin: '0 6px'
                  }}>·</span><span>{speaker.company}</span>
                      </p>
                    </div>
                    <div style={{
                background: '#F7F6F3',
                borderRadius: '12px',
                padding: '14px 16px'
              }}>
                      <div style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '10px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'rgba(20,18,16,0.3)',
                  marginBottom: '6px',
                  fontWeight: 500
                }}>Speaking On</div>
                      <div style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  color: 'rgba(20,18,16,0.72)',
                  lineHeight: 1.5,
                  letterSpacing: '-0.1px'
                }}>{speaker.topic}</div>
                    </div>
                    <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                      <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                        <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: speaker.accentColor,
                    flexShrink: 0
                  }} />
                        <span style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '11px',
                    color: 'rgba(20,18,16,0.35)',
                    letterSpacing: '0.04em'
                  }}>Summit 2026</span>
                      </div>
                      <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '1px solid rgba(20,18,16,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: hoveredId === speaker.id ? speaker.accentColor : 'transparent',
                  borderColor: hoveredId === speaker.id ? speaker.accentColor : 'rgba(20,18,16,0.1)',
                  transition: 'background 0.3s ease, border-color 0.3s ease'
                }}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1.5 10.5L10.5 1.5M10.5 1.5H3.5M10.5 1.5V8.5" stroke={hoveredId === speaker.id ? '#fff' : 'rgba(20,18,16,0.4)'} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </div>
                    </div>
                  </div>
                </motion.article>)}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── Dot pagination + CTA ── */}
      <div style={{
      padding: isMobile ? '36px 24px 0' : '48px 80px 0',
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '24px',
      position: 'relative',
      zIndex: 1
    }}>
        <div style={{
        display: 'flex',
        gap: '8px'
      }}>
          {filteredSpeakers.map((sp, i) => <button key={sp.id} onClick={() => scrollToIdx(i)} style={{
          all: 'unset',
          cursor: 'pointer',
          width: activeIdx === i ? '28px' : '8px',
          height: '8px',
          borderRadius: '4px',
          background: activeIdx === i ? accentColor : 'rgba(20,18,16,0.15)',
          transition: 'width 0.3s ease, background 0.3s ease'
        }} />)}
        </div>
        <motion.a href="#" onClick={e => e.preventDefault()} whileHover={{
        scale: 1.04
      }} whileTap={{
        scale: 0.97
      }} style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        border: '1px solid rgba(20,18,16,0.16)',
        borderRadius: '44px',
        padding: '13px 28px',
        fontFamily: 'Inter, sans-serif',
        fontSize: '13px',
        letterSpacing: '0.04em',
        color: 'rgba(20,18,16,0.65)',
        textDecoration: 'none',
        transition: 'border-color 0.25s ease, color 0.25s ease'
      }} onMouseEnter={e => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.borderColor = 'rgba(20,18,16,0.4)';
        el.style.color = '#141210';
      }} onMouseLeave={e => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.borderColor = 'rgba(20,18,16,0.16)';
        el.style.color = 'rgba(20,18,16,0.65)';
      }}>
          <span>View All Speakers</span>
          <ArrowIconInk />
        </motion.a>
      </div>
    </section>;
};

// ─── Agenda Timeline ──────────────────────────────────────────────────────────
type AgendaSession = {
  id: string;
  dayId: string;
  time: string;
  duration: string;
  title: string;
  description: string;
  type: 'keynote' | 'panel' | 'workshop' | 'networking' | 'pitch' | 'break';
  speaker?: string;
  speakerRole?: string;
  location: string;
  featured?: boolean;
};
const AGENDA_SESSIONS: AgendaSession[] = [{
  id: 'ag-1',
  dayId: 'day-1',
  time: '08:00',
  duration: '60 min',
  title: 'Registration & Welcome Coffee',
  description: 'Attendee check-in, networking, and morning refreshments at EmpowaWorx House.',
  type: 'networking',
  location: 'Main Atrium',
  featured: false
}, {
  id: 'ag-2',
  dayId: 'day-1',
  time: '09:00',
  duration: '90 min',
  title: "Opening Keynote — Africa's Capital Imperative",
  description: 'A bold address on the trillion-dollar funding gap and the path to catalytic capital deployment across African markets.',
  type: 'keynote',
  speaker: 'Dr. Amara Diallo',
  speakerRole: 'Managing Partner, Sahel Capital',
  location: 'Main Stage',
  featured: true
}, {
  id: 'ag-3',
  dayId: 'day-1',
  time: '11:00',
  duration: '60 min',
  title: 'DFI Roundtable — Deploying at Scale',
  description: 'Development Finance Institutions discuss mandate alignment, co-investment, and frontier market deployment strategies.',
  type: 'panel',
  speaker: 'Kwame Asante',
  speakerRole: 'Investment Director, Pan-African Dev Fund',
  location: 'Boardroom A',
  featured: false
}, {
  id: 'ag-4',
  dayId: 'day-1',
  time: '12:30',
  duration: '90 min',
  title: 'Catalytic Capital Pitch Sessions',
  description: 'Vetted founders present to institutional investors in structured, high-conviction pitch environments.',
  type: 'pitch',
  location: 'Pitch Arena',
  featured: true
}, {
  id: 'ag-5',
  dayId: 'day-1',
  time: '14:30',
  duration: '30 min',
  title: 'Networking Break',
  description: 'Curated introductions, refreshments, and informal deal conversations.',
  type: 'break',
  location: 'Rooftop Terrace',
  featured: false
}, {
  id: 'ag-6',
  dayId: 'day-1',
  time: '15:00',
  duration: '75 min',
  title: 'Fireside — Scaling Agri-Tech Across 10 Markets',
  description: 'An intimate conversation on navigating regulatory complexity, supply-chain infrastructure, and continental distribution.',
  type: 'panel',
  speaker: 'Fatima El-Rashid',
  speakerRole: 'Founder & CEO, Zenith Agritech',
  location: 'Fireside Lounge',
  featured: false
}, {
  id: 'ag-7',
  dayId: 'day-1',
  time: '16:30',
  duration: '90 min',
  title: 'Power Seat Roundtables',
  description: "Intimate, curated sessions with Africa's most influential founders, funders, and corporate leaders.",
  type: 'keynote',
  location: 'VIP Suites',
  featured: true
}, {
  id: 'ag-8',
  dayId: 'day-1',
  time: '18:30',
  duration: '120 min',
  title: 'Gala Dinner & Celebration',
  description: "An elegant closing dinner honoring Africa's most ambitious founders, strategic partners, and ecosystem builders.",
  type: 'networking',
  location: 'Grand Ballroom',
  featured: false
}];
const SESSION_TYPE_CONFIG: Record<AgendaSession['type'], {
  color: string;
  bg: string;
  label: string;
}> = {
  keynote: {
    color: '#DE322D',
    bg: 'rgba(222,50,45,0.14)',
    label: 'Keynote'
  },
  panel: {
    color: '#3B8FDE',
    bg: 'rgba(59,143,222,0.14)',
    label: 'Panel'
  },
  workshop: {
    color: '#2D9B6A',
    bg: 'rgba(45,155,106,0.14)',
    label: 'Workshop'
  },
  networking: {
    color: '#C47F17',
    bg: 'rgba(196,127,23,0.14)',
    label: 'Networking'
  },
  pitch: {
    color: '#9B5DEA',
    bg: 'rgba(155,93,234,0.14)',
    label: 'Pitch Session'
  },
  break: {
    color: 'rgba(20,18,16,0.4)',
    bg: 'rgba(20,18,16,0.06)',
    label: 'Break'
  }
};
export const AgendaTimeline = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, {
    once: true,
    margin: '-60px 0px'
  });
  const [expandedId, setExpandedId] = useState<string | null>('ag-2');
  const isMobile = useIsMobile();
  const filteredSessions = AGENDA_SESSIONS.filter(s => s.dayId === 'day-1');
  return <section ref={sectionRef} style={{
    background: '#F0EDE6',
    paddingTop: isMobile ? '80px' : '120px',
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
      opacity: 0.5
    }} />
      <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: isMobile ? '0 24px' : '0 64px',
      position: 'relative',
      zIndex: 1
    }}>
        <div style={{
        marginBottom: '52px'
      }}>
          <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={rotateFade} custom={0} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '20px'
        }}>
            <PlusSquareIcon />
            <span style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '12px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(20,18,16,0.45)',
            fontWeight: 500
          }}>Agenda · Summit 2026</span>
          </motion.div>
          <div style={{
          overflow: 'hidden'
        }}>
            <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideUpBlur} custom={0.1} style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: isMobile ? 'clamp(28px, 8vw, 42px)' : 'clamp(32px, 4vw, 58px)',
            fontWeight: 300,
            letterSpacing: '-1.8px',
            lineHeight: 1.04,
            color: '#141210',
            margin: 0
          }}>
              <span>{'One day of '}</span>
              <em style={{
              fontStyle: 'italic',
              color: '#DE322D'
            }}>curated</em>
              <span style={{
              color: 'rgba(20,18,16,0.25)'
            }}>{' programming.'}</span>
            </motion.h2>
          </div>
        </div>
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={staggerContainer} custom={0.12} style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '48px'
      }}>
          <motion.div variants={staggerChild} style={{
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          padding: isMobile ? '16px 18px' : '20px 28px',
          borderRadius: '16px',
          border: '1px solid rgba(20,18,16,0.18)',
          background: '#141210',
          boxShadow: '0 8px 32px rgba(20,18,16,0.14)'
        }}>
            <span style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '11px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            fontWeight: 500,
            color: 'rgba(247,246,243,0.45)'
          }}>Day 01</span>
            <span style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: isMobile ? '13px' : '15px',
            fontWeight: 500,
            letterSpacing: '-0.2px',
            color: '#F7F6F3'
          }}>June 1, 2026</span>
            <span style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '11px',
            color: '#DE322D',
            letterSpacing: '0.02em'
          }}>Capital & Connection</span>
          </motion.div>
        </motion.div>
        <AnimatePresence mode="wait">
          <motion.div key="day-1" initial={{
          opacity: 0,
          y: 24
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
          display: 'flex',
          flexDirection: 'column',
          gap: '0'
        }}>
            {filteredSessions.map((session, i) => {
            const typeConfig = SESSION_TYPE_CONFIG[session.type];
            const isExpanded = expandedId === session.id;
            const isLast = i === filteredSessions.length - 1;
            return <div key={session.id} style={{
              display: 'flex',
              gap: isMobile ? '16px' : '28px',
              position: 'relative'
            }}>
                  <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flexShrink: 0,
                width: isMobile ? '36px' : '56px',
                paddingTop: '18px'
              }}>
                    <motion.div initial={{
                  scale: 0
                }} animate={inView ? {
                  scale: 1
                } : {
                  scale: 0
                }} transition={{
                  duration: 0.4,
                  delay: 0.1 + i * 0.07
                }} style={{
                  width: session.featured ? '14px' : '10px',
                  height: session.featured ? '14px' : '10px',
                  borderRadius: '50%',
                  background: session.featured ? typeConfig.color : 'rgba(20,18,16,0.2)',
                  border: session.featured ? `2px solid ${typeConfig.color}44` : '2px solid transparent',
                  boxShadow: session.featured ? `0 0 12px ${typeConfig.color}55` : 'none',
                  flexShrink: 0,
                  zIndex: 1
                }} />
                    {!isLast && <div style={{
                  flex: 1,
                  width: '1px',
                  background: 'rgba(20,18,16,0.1)',
                  minHeight: '40px',
                  marginTop: '4px'
                }} />}
                  </div>
                  <motion.div initial={{
                opacity: 0,
                x: -16
              }} animate={inView ? {
                opacity: 1,
                x: 0
              } : {
                opacity: 0,
                x: -16
              }} transition={{
                duration: 0.5,
                delay: 0.08 + i * 0.06,
                ease: [0.22, 1, 0.36, 1]
              }} style={{
                flex: 1,
                marginBottom: isLast ? '0' : isMobile ? '20px' : '16px'
              }}>
                    <div onClick={() => setExpandedId(isExpanded ? null : session.id)} style={{
                  background: isExpanded ? '#FFFFFF' : session.featured ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.45)',
                  border: '1px solid',
                  borderColor: isExpanded ? 'rgba(20,18,16,0.12)' : 'rgba(20,18,16,0.07)',
                  borderRadius: '18px',
                  padding: isMobile ? '18px 20px' : '22px 28px',
                  cursor: 'pointer',
                  transition: 'background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                  boxShadow: isExpanded ? '0 8px 40px rgba(20,18,16,0.1)' : '0 2px 8px rgba(20,18,16,0.04)'
                }}>
                      <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '10px',
                    gap: '12px',
                    flexWrap: 'wrap'
                  }}>
                        <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      flexWrap: 'wrap'
                    }}>
                          <span style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#141210',
                        letterSpacing: '0.02em'
                      }}>{session.time}</span>
                          <span style={{
                        width: '3px',
                        height: '3px',
                        borderRadius: '50%',
                        background: 'rgba(20,18,16,0.2)',
                        display: 'block',
                        flexShrink: 0
                      }} />
                          <span style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '11px',
                        color: 'rgba(20,18,16,0.4)',
                        letterSpacing: '0.02em'
                      }}>{session.duration}</span>
                          <div style={{
                        background: typeConfig.bg,
                        border: `1px solid ${typeConfig.color}33`,
                        borderRadius: '100px',
                        padding: '3px 10px',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '10px',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: typeConfig.color,
                        fontWeight: 500
                      }}>{typeConfig.label}</div>
                          {session.featured && <div style={{
                        background: 'rgba(222,50,45,0.08)',
                        border: '1px solid rgba(222,50,45,0.18)',
                        borderRadius: '100px',
                        padding: '3px 10px',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '10px',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: '#DE322D',
                        fontWeight: 600
                      }}>Featured</div>}
                        </div>
                        <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      border: '1px solid rgba(20,18,16,0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      background: isExpanded ? '#141210' : 'transparent',
                      transition: 'background 0.3s ease'
                    }}>
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{
                        transform: isExpanded ? 'rotate(45deg)' : 'rotate(0)',
                        transition: 'transform 0.3s ease'
                      }}><path d="M5 1V9M1 5H9" stroke={isExpanded ? '#fff' : 'rgba(20,18,16,0.4)'} strokeWidth="1.5" strokeLinecap="round" /></svg>
                        </div>
                      </div>
                      <h3 style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: isMobile ? '16px' : session.featured ? '20px' : '17px',
                    fontWeight: session.featured ? 500 : 400,
                    letterSpacing: '-0.3px',
                    color: '#141210',
                    margin: '0 0 8px',
                    lineHeight: 1.25
                  }}>{session.title}</h3>
                      <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                        <svg width="10" height="12" viewBox="0 0 10 12" fill="none"><path d="M5 1C3.067 1 1.5 2.567 1.5 4.5C1.5 7 5 11 5 11C5 11 8.5 7 8.5 4.5C8.5 2.567 6.933 1 5 1ZM5 6C4.172 6 3.5 5.328 3.5 4.5C3.5 3.672 4.172 3 5 3C5.828 3 6.5 3.672 6.5 4.5C6.5 5.328 5.828 6 5 6Z" fill="rgba(20,18,16,0.3)" /></svg>
                        <span style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '11px',
                      color: 'rgba(20,18,16,0.38)',
                      letterSpacing: '0.04em'
                    }}>{session.location}</span>
                      </div>
                      <AnimatePresence initial={false}>
                        {isExpanded && <motion.div initial={{
                      height: 0,
                      opacity: 0
                    }} animate={{
                      height: 'auto',
                      opacity: 1
                    }} exit={{
                      height: 0,
                      opacity: 0
                    }} transition={{
                      duration: 0.4,
                      ease: [0.22, 1, 0.36, 1]
                    }} style={{
                      overflow: 'hidden'
                    }}>
                            <div style={{
                        paddingTop: '20px',
                        borderTop: '1px solid rgba(20,18,16,0.07)',
                        marginTop: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px'
                      }}>
                              <p style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '14px',
                          lineHeight: '1.75',
                          color: 'rgba(20,18,16,0.55)',
                          margin: 0
                        }}>{session.description}</p>
                              {session.speaker && <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px'
                        }}>
                                  <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${typeConfig.color}, ${typeConfig.color}99)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                                    <span style={{
                              fontFamily: 'Inter, sans-serif',
                              fontSize: '11px',
                              fontWeight: 700,
                              color: '#fff'
                            }}>{session.speaker.split(' ').map(w => w[0]).join('').slice(0, 2)}</span>
                                  </div>
                                  <div>
                                    <div style={{
                              fontFamily: 'Inter, sans-serif',
                              fontSize: '13px',
                              fontWeight: 600,
                              color: '#141210',
                              letterSpacing: '-0.1px'
                            }}>{session.speaker}</div>
                                    <div style={{
                              fontFamily: 'Inter, sans-serif',
                              fontSize: '11px',
                              color: 'rgba(20,18,16,0.45)',
                              marginTop: '2px'
                            }}>{session.speakerRole}</div>
                                  </div>
                                </div>}
                              <motion.a href="#" onClick={e => e.preventDefault()} whileHover={{
                          scale: 1.03
                        }} whileTap={{
                          scale: 0.97
                        }} style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '12px',
                          color: typeConfig.color,
                          textDecoration: 'none',
                          letterSpacing: '0.04em',
                          fontWeight: 500,
                          alignSelf: 'flex-start'
                        }}>
                                <span>Add to My Agenda</span>
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 8.5L8.5 1.5M8.5 1.5H3M8.5 1.5V7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                              </motion.a>
                            </div>
                          </motion.div>}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                </div>;
          })}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>;
};