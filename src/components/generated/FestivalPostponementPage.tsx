import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PartnershipEnquiryModal } from './PartnershipEnquiryModal';
import { NewsletterForm } from './NewsletterForm';

const PRIMARY_CORAL = '#DE322D';
const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`;

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(6px)' },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.85,
      delay,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

interface FaqItem {
  id: string;
  question: string;
  answer: React.ReactNode;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Why has the festival moved?',
    answer:
      'To deliver a stronger platform with greater scale and investor reach for the entrepreneurs we serve.',
  },
  {
    id: 'faq-2',
    question: 'When will it take place?',
    answer:
      'In 2027. Dates will be announced on this page and to everyone who registers interest.',
  },
  {
    id: 'faq-3',
    question: "I've already applied. What happens now?",
    answer:
      "You don't need to take any action now. We will keep you informed as plans develop.",
  },
  {
    id: 'faq-4',
    question: 'How can my organisation partner with you?',
    answer: (
      <span>
        Contact{' '}
        <a
          href="mailto:bonnie@empowaworx.co.za?subject=EmpowaHer%20Funding%20Track%20%2F%202027%20Festival%20Partnership"
          style={{ color: '#DE322D', textDecoration: 'underline', fontWeight: 500 }}
        >
          bonnie@empowaworx.co.za
        </a>{' '}
        to discuss the EmpowaHer™ funding track or the 2027 festival.
      </span>
    ),
  },
];

export const FestivalPostponementPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<string | null>('faq-1');
  const [partnerModalOpen, setPartnerModalOpen] = useState(false);

  useEffect(() => {
    document.title = 'EmpowaEntrepreneurs Pitching Festival Week Moves to 2027 | EmpowaEntrepreneurs';
  }, []);

  return (
    <div
      style={{
        background: '#141210',
        color: '#F7F6F3',
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        overflowX: 'hidden',
        paddingTop: '120px',
        paddingBottom: '120px',
      }}
    >
      {/* Noise background */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: NOISE_SVG,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Subtle top ambient glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '1000px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(222,50,45,0.12) 0%, rgba(20,18,16,0) 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '0 24px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Breadcrumb / Back Link */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
          custom={0}
          style={{ marginBottom: '32px' }}
        >
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '11px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(247,246,243,0.5)',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = PRIMARY_CORAL)}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'rgba(247,246,243,0.5)')}
          >
            <span>← Return to Home</span>
          </Link>
        </motion.div>

        {/* ─── Hero Section ─── */}
        <header style={{ marginBottom: '56px' }}>
          {/* Eyebrow Pill */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
            custom={0.08}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(222,50,45,0.12)',
              border: '1px solid rgba(222,50,45,0.3)',
              borderRadius: '100px',
              padding: '8px 20px',
              marginBottom: '28px',
            }}
          >
            <div
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: PRIMARY_CORAL,
                boxShadow: '0 0 10px rgba(222,50,45,0.7)',
              }}
            />
            <span
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#fff',
              }}
            >
              Official Website Comms · Moving to 2027
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
            custom={0.16}
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 400,
              letterSpacing: '-1.5px',
              lineHeight: 1.12,
              margin: '0 0 24px',
              color: '#FFFFFF',
            }}
          >
            EmpowaEntrepreneurs Pitching Festival Week{' '}
            <span style={{ fontStyle: 'italic', fontWeight: 300, color: PRIMARY_CORAL }}>
              Moves to 2027
            </span>
          </motion.h1>

          {/* Standfirst */}
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
            custom={0.24}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 'clamp(17px, 1.6vw, 22px)',
              fontWeight: 300,
              lineHeight: 1.6,
              color: 'rgba(247,246,243,0.85)',
              maxWidth: '860px',
              margin: 0,
            }}
          >
            A bigger platform for Africa's most investable businesses, and an opportunity to start
            building investment readiness this October.
          </motion.p>
        </header>

        {/* ─── Announcement Artwork ─── */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
          custom={0.3}
          style={{
            marginBottom: '64px',
            borderRadius: '20px',
            overflow: 'hidden',
            border: '1px solid rgba(247,246,243,0.12)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
            background: 'rgba(247,246,243,0.02)',
          }}
        >
          <picture>
            <source media="(max-width: 768px)" srcSet="/postponement-artwork-mobile.jpg" />
            <img
              src="/postponement-artwork.jpg"
              alt="EmpowaEntrepreneurs Pitching Festival Moves to 2027"
              style={{
                width: '100%',
                display: 'block',
                maxHeight: '520px',
                objectFit: 'cover',
              }}
            />
          </picture>
        </motion.div>

        {/* ─── Core Statement & Content Grid ─── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '40px',
            marginBottom: '64px',
          }}
        >
          {/* Main Announcement Statement */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariants}
            custom={0.1}
            style={{
              background: 'linear-gradient(145deg, rgba(247,246,243,0.04) 0%, rgba(247,246,243,0.01) 100%)',
              border: '1px solid rgba(247,246,243,0.08)',
              borderRadius: '20px',
              padding: '40px 36px',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '2px',
                  background: PRIMARY_CORAL,
                }}
              />
              <span
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: PRIMARY_CORAL,
                }}
              >
                The Update
              </span>
            </div>

            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '16px',
                lineHeight: 1.85,
                color: 'rgba(247,246,243,0.85)',
                margin: 0,
                fontWeight: 300,
              }}
            >
              The EmpowaEntrepreneurs Pitching Festival, originally scheduled for November 2026,
              will now take place in <strong>2027</strong>.
            </p>

            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '15px',
                lineHeight: 1.8,
                color: 'rgba(247,246,243,0.7)',
                margin: 0,
                fontWeight: 300,
              }}
            >
              Our purpose is to connect scalable African businesses with the capital and growth
              opportunities they need to thrive. Moving the PITCHFEST to 2027 allows us to deliver it at
              the scale, depth and investor reach our entrepreneurs deserve. Revised dates will be
              announced once confirmed.
            </p>
          </motion.div>

          {/* What This Means for Entrepreneurs */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariants}
            custom={0.2}
            style={{
              background: 'linear-gradient(145deg, #3c4d5d 0%, #2f3f4e 60%, #243040 100%)',
              border: '1px solid rgba(247,246,243,0.1)',
              borderRadius: '20px',
              padding: '40px 36px',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              boxShadow: '0 16px 40px rgba(0,0,0,0.35)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Top Coral accent line */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: `linear-gradient(90deg, ${PRIMARY_CORAL}, #ff7a70)`,
              }}
            />

            <div>
              <span
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'rgba(247,246,243,0.7)',
                  display: 'block',
                  marginBottom: '10px',
                }}
              >
                Guidance for Applicants
              </span>
              <h2
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '22px',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  margin: 0,
                  lineHeight: 1.3,
                }}
              >
                What this means for entrepreneurs
              </h2>
            </div>

            <div
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderLeft: `3px solid ${PRIMARY_CORAL}`,
                borderRadius: '12px',
                padding: '20px',
              }}
            >
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '15px',
                  lineHeight: 1.8,
                  color: '#FFFFFF',
                  margin: 0,
                  fontWeight: 400,
                }}
              >
                If you have applied, you don't need to take any action now. We will keep you informed as plans develop.
              </p>
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <a
                href="#register-interest"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(247,246,243,0.1)',
                  border: '1px solid rgba(247,246,243,0.2)',
                  borderRadius: '44px',
                  padding: '12px 24px',
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(247,246,243,0.2)')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(247,246,243,0.1)')}
              >
                <span>Stay Informed for 2027 ↓</span>
              </a>
            </div>
          </motion.div>
        </div>

        {/* ─── EmpowaHer Leadership Summit Feature Card ─── */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpVariants}
          custom={0.15}
          style={{
            background: 'linear-gradient(135deg, rgba(222,50,45,0.08) 0%, rgba(20,18,16,0.6) 100%)',
            border: '1px solid rgba(222,50,45,0.25)',
            borderRadius: '24px',
            padding: '48px 40px',
            marginBottom: '64px',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <span
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: PRIMARY_CORAL,
              }}
            >
              Start your journey now
            </span>
          </div>

          <h2
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 'clamp(24px, 3.2vw, 36px)',
              fontWeight: 400,
              color: '#FFFFFF',
              letterSpacing: '-0.5px',
              margin: '0 0 16px',
            }}
          >
            Start your journey now:{' '}
            <span style={{ fontStyle: 'italic', fontWeight: 300, color: PRIMARY_CORAL }}>
              EmpowaHer™ Leadership Summit
            </span>
          </h2>

          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '16px',
              lineHeight: 1.85,
              color: 'rgba(247,246,243,0.85)',
              margin: '0 0 20px',
              fontWeight: 300,
              maxWidth: '900px',
            }}
          >
            Our immediate focus is the <strong>EmpowaHer™ Leadership Summit</strong>, taking place from{' '}
            <strong>29–31 October 2026</strong> under the theme{' '}
            <em style={{ color: '#fff', fontStyle: 'italic', fontWeight: 400 }}>The Future Is Female™</em>.
          </p>

          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '15px',
              lineHeight: 1.85,
              color: 'rgba(247,246,243,0.72)',
              margin: '0 0 36px',
              fontWeight: 300,
              maxWidth: '900px',
            }}
          >
            The summit opens with a dedicated <strong>Entrepreneurship, Innovation & Funding track</strong>. It
            is designed to advance investment readiness, share practical funding insights, and connect
            emerging women entrepreneurs with the expertise, networks and opportunities needed to build
            commercially sustainable businesses. In short, it is a practical first step from entrepreneurial
            ambition to fundable enterprise.
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            <a
              href="https://www.empowaher.co.za"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                background: 'linear-gradient(135deg, #DE322D 0%, #c42823 100%)',
                color: '#FFFFFF',
                borderRadius: '44px',
                padding: '14px 32px',
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textDecoration: 'none',
                boxShadow: '0 6px 24px rgba(222,50,45,0.45)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 32px rgba(222,50,45,0.6)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 24px rgba(222,50,45,0.45)';
              }}
            >
              <span>Explore the Summit at www.empowaher.co.za →</span>
            </a>

            <a
              href="https://www.empowaher.co.za"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(247,246,243,0.06)',
                border: '1px solid rgba(247,246,243,0.18)',
                color: '#FFFFFF',
                borderRadius: '44px',
                padding: '14px 28px',
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.04em',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(247,246,243,0.12)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(247,246,243,0.06)')}
            >
              <span>Explore here →</span>
            </a>
          </div>
        </motion.section>

        {/* ─── Two Column: Partner With Us & Stay Informed ─── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '40px',
            marginBottom: '64px',
          }}
        >
          {/* Partner With Us */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariants}
            custom={0.1}
            style={{
              background: 'rgba(247,246,243,0.03)',
              border: '1px solid rgba(247,246,243,0.09)',
              borderRadius: '20px',
              padding: '36px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <span
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: PRIMARY_CORAL,
              }}
            >
              Enterprise Development & Capital
            </span>
            <h2
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '24px',
                fontWeight: 500,
                color: '#FFFFFF',
                margin: 0,
              }}
            >
              Partner with us
            </h2>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '15px',
                lineHeight: 1.8,
                color: 'rgba(247,246,243,0.7)',
                margin: 0,
                fontWeight: 300,
              }}
            >
              We welcome conversations with organisations committed to enterprise development, from the
              Summit's funding track to shaping the 2027 Pitching Festival.
            </p>

            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <a
                href="mailto:bonnie@empowaworx.co.za?subject=Partnership%20Enquiry%20-%20EmpowaHer%20%26%202027%20Pitching%20Festival"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: 'linear-gradient(135deg, #DE322D 0%, #c42823 100%)',
                  borderRadius: '44px',
                  padding: '13px 24px',
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 18px rgba(222,50,45,0.35)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(222,50,45,0.55)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 18px rgba(222,50,45,0.35)';
                }}
              >
                <span>Contact our partnerships team →</span>
              </a>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '13px',
                  color: 'rgba(247,246,243,0.7)',
                  textAlign: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <span>Bonnie (</span>
                <a
                  href="mailto:bonnie@empowaworx.co.za?subject=Partnership%20Enquiry%20-%20EmpowaHer%20%26%202027%20Pitching%20Festival"
                  style={{
                    color: PRIMARY_CORAL,
                    textDecoration: 'underline',
                    fontWeight: 500,
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#ff7a70')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = PRIMARY_CORAL)}
                >
                  bonnie@empowaworx.co.za
                </a>
                <span>)</span>
              </div>
            </div>
          </motion.div>

          {/* Stay Informed Form */}
          <motion.div
            id="register-interest"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariants}
            custom={0.2}
            style={{
              background: 'rgba(247,246,243,0.03)',
              border: '1px solid rgba(247,246,243,0.09)',
              borderRadius: '20px',
              padding: '36px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <span
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: PRIMARY_CORAL,
              }}
            >
              Get Notified
            </span>
            <h2
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '24px',
                fontWeight: 500,
                color: '#FFFFFF',
                margin: 0,
              }}
            >
              Stay informed
            </h2>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '15px',
                lineHeight: 1.8,
                color: 'rgba(247,246,243,0.7)',
                margin: 0,
                fontWeight: 300,
              }}
            >
              Be the first to hear the 2027 dates and application details.
            </p>

            <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
              <NewsletterForm
                variant="square"
                placeholder="Enter your email to stay informed"
                buttonText="Register your interest →"
              />
            </div>
          </motion.div>
        </div>

        {/* ─── Section 3: Frequently Asked Questions (FAQ) ─── */}
        <section style={{ marginTop: '80px' }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariants}
            custom={0.1}
            style={{ marginBottom: '40px', textAlign: 'center' }}
          >
            <span
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: PRIMARY_CORAL,
                display: 'block',
                marginBottom: '10px',
              }}
            >
              Clear Answers
            </span>
            <h2
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 'clamp(28px, 4vw, 42px)',
                fontWeight: 400,
                color: '#FFFFFF',
                letterSpacing: '-1px',
                margin: 0,
              }}
            >
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div
            style={{
              maxWidth: '860px',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaq === item.id;
              return (
                <motion.div
                  key={item.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUpVariants}
                  custom={0.15 + idx * 0.05}
                  style={{
                    background: isOpen ? 'rgba(247,246,243,0.05)' : 'rgba(247,246,243,0.02)',
                    border: isOpen ? '1px solid rgba(222,50,45,0.35)' : '1px solid rgba(247,246,243,0.08)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    transition: 'all 0.25s ease',
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : item.id)}
                    style={{
                      width: '100%',
                      background: 'none',
                      border: 'none',
                      padding: '24px 28px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      textAlign: 'left',
                      gap: '16px',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: '16px',
                        fontWeight: 600,
                        color: isOpen ? '#FFFFFF' : 'rgba(247,246,243,0.88)',
                        letterSpacing: '-0.2px',
                      }}
                    >
                      {item.question}
                    </span>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: isOpen ? 'rgba(222,50,45,0.2)' : 'rgba(247,246,243,0.06)',
                        border: isOpen ? '1px solid rgba(222,50,45,0.4)' : '1px solid rgba(247,246,243,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isOpen ? PRIMARY_CORAL : 'rgba(247,246,243,0.6)',
                        flexShrink: 0,
                        transition: 'all 0.25s ease',
                        transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                      }}
                    >
                      +
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div
                          style={{
                            padding: '0 28px 24px',
                            borderTop: '1px solid rgba(247,246,243,0.06)',
                            marginTop: '4px',
                            paddingTop: '16px',
                          }}
                        >
                          <p
                            style={{
                              fontFamily: "'Inter', sans-serif",
                              fontSize: '15px',
                              lineHeight: 1.8,
                              color: 'rgba(247,246,243,0.72)',
                              margin: 0,
                              fontWeight: 300,
                            }}
                          >
                            {item.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </section>
      </div>

      {partnerModalOpen && <PartnershipEnquiryModal onClose={() => setPartnerModalOpen(false)} />}
    </div>
  );
};
