import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const useBreakpoint = () => {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  useEffect(() => {
    const check = () => setWidth(window.innerWidth);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return { isMobile: width < 640 };
};

const ArrowIconDark = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 12L12 2M12 2H4M12 2V10" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const FIELD_LABEL_STYLE: React.CSSProperties = {
  display: 'block',
  fontFamily: 'Montserrat, sans-serif',
  fontSize: '11px',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: 'rgba(247,246,243,0.45)',
  marginBottom: '8px',
  fontWeight: 600
};

const FIELD_INPUT_STYLE: React.CSSProperties = {
  width: '100%',
  background: 'rgba(247,246,243,0.03)',
  border: '1px solid rgba(247,246,243,0.08)',
  borderRadius: '8px',
  padding: '14px 16px',
  color: '#F7F6F3',
  fontFamily: 'Inter, sans-serif',
  fontSize: '14px',
  boxSizing: 'border-box',
  outline: 'none',
  transition: 'border-color 0.2s'
};

const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
  e.target.style.borderColor = 'rgba(222,50,45,0.45)';
};

const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
  e.target.style.borderColor = 'rgba(247,246,243,0.08)';
};

export const PitchingFestivalModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { isMobile } = useBreakpoint();
  const modalRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState(1);
  const totalSteps = 6;
  const nextStep = () => {
    const form = document.getElementById('pitch-modal-form') as HTMLFormElement;
    if (form && !form.reportValidity()) return;
    setStep(s => Math.min(s + 1, totalSteps));
    if (modalRef.current) modalRef.current.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const prevStep = () => {
    setStep(s => Math.max(s - 1, 1));
    if (modalRef.current) modalRef.current.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingText, setLoadingText] = useState('Submitting...');

  useEffect(() => {
    if (status === 'loading') {
      const texts = ['Submitting...', 'Uploading files...', 'Processing data...', 'Securing application...', 'Almost there...'];
      let i = 0;
      setLoadingText(texts[0]);
      const interval = setInterval(() => {
        i = (i + 1) % texts.length;
        setLoadingText(texts[i]);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [status]);

  // Step 1: Business Details
  const [businessName, setBusinessName] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [physicalAddress, setPhysicalAddress] = useState('');
  const [postalAddress, setPostalAddress] = useState('');
  const [website, setWebsite] = useState('');
  const [industry, setIndustry] = useState('');
  const [bbbeeLevel, setBbbeeLevel] = useState('');
  const [ownership, setOwnership] = useState('');

  // Step 2: Contact & Founder
  const [contactFirst, setContactFirst] = useState('');
  const [contactLast, setContactLast] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [founderFirst, setFounderFirst] = useState('');
  const [founderLast, setFounderLast] = useState('');
  const [founderId, setFounderId] = useState('');
  const [race, setRace] = useState('');
  const [gender, setGender] = useState('');
  const [education, setEducation] = useState('');
  const [experience, setExperience] = useState('');

  // Step 3: Value Proposition
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [valueProp, setValueProp] = useState('');
  const [competitiveAdv, setCompetitiveAdv] = useState('');
  const [innovation, setInnovation] = useState('');
  const [impact, setImpact] = useState('');

  // Step 4: Market & Growth
  const [targetMarket, setTargetMarket] = useState('');
  const [tam, setTam] = useState('');
  const [sam, setSam] = useState('');
  const [marketShare, setMarketShare] = useState('');
  const [marketingStrat, setMarketingStrat] = useState('');
  const [growthStrat, setGrowthStrat] = useState('');
  const [capacity, setCapacity] = useState('');

  // Step 5: Financials & Team
  const [revY1, setRevY1] = useState('');
  const [revY2, setRevY2] = useState('');
  const [profitY1, setProfitY1] = useState('');
  const [profitY2, setProfitY2] = useState('');
  const [fundingReceived, setFundingReceived] = useState('');
  const [fundingRequest, setFundingRequest] = useState('');
  const [useOfFunds, setUseOfFunds] = useState('');
  const [keyTeam, setKeyTeam] = useState('');
  const [orgChart, setOrgChart] = useState<File | null>(null);

  // Step 6: Documents & Declaration
  const [bbbeeCompliance, setBbbeeCompliance] = useState('');
  const [supportingDocs, setSupportingDocs] = useState<FileList | null>(null);
  const [declaration, setDeclaration] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setTimeout(() => {
        setStatus('idle');
        setStep(1);
        setBusinessName(''); setRegNumber(''); setPhysicalAddress(''); setPostalAddress('');
        setWebsite(''); setIndustry(''); setBbbeeLevel(''); setOwnership('');
        setContactFirst(''); setContactLast(''); setContactEmail(''); setContactPhone('');
        setFounderFirst(''); setFounderLast(''); setFounderId(''); setRace('');
        setGender(''); setEducation(''); setExperience('');
        setProblem(''); setSolution(''); setValueProp(''); setCompetitiveAdv('');
        setInnovation(''); setImpact('');
        setTargetMarket(''); setTam(''); setSam(''); setMarketShare('');
        setMarketingStrat(''); setGrowthStrat(''); setCapacity('');
        setRevY1(''); setRevY2(''); setProfitY1(''); setProfitY2('');
        setFundingReceived(''); setFundingRequest(''); setUseOfFunds(''); setKeyTeam('');
        setOrgChart(null); setBbbeeCompliance(''); setSupportingDocs(null); setDeclaration(false);
      }, 500);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!declaration) {
      setErrorMessage('You must agree to the declaration to submit your application.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('input_1', businessName);
      formData.append('input_7', regNumber);
      formData.append('input_47', physicalAddress);
      formData.append('input_48', postalAddress);
      formData.append('input_3_3', contactFirst);
      formData.append('input_3_6', contactLast);
      formData.append('input_5', contactEmail);
      formData.append('input_4', contactPhone);
      formData.append('input_49', website);
      formData.append('input_33', industry);
      formData.append('input_39', bbbeeLevel);
      formData.append('input_17', ownership);
      formData.append('input_50_3', founderFirst);
      formData.append('input_50_6', founderLast);
      formData.append('input_52', founderId);
      formData.append('input_53', race);
      formData.append('input_54', gender);
      formData.append('input_55', education);
      formData.append('input_56', experience);
      formData.append('input_57', problem);
      formData.append('input_58', solution);
      formData.append('input_59', valueProp);
      formData.append('input_60', targetMarket);
      formData.append('input_61', competitiveAdv);
      formData.append('input_64', tam);
      formData.append('input_65', sam);
      formData.append('input_66', marketShare);
      formData.append('input_45', marketingStrat);
      formData.append('input_67', revY1);
      formData.append('input_68', revY2);
      formData.append('input_69', profitY1);
      formData.append('input_70', profitY2);
      formData.append('input_71', fundingReceived);
      formData.append('input_72', fundingRequest);
      formData.append('input_38', useOfFunds);
      formData.append('input_74', keyTeam);
      formData.append('input_78', capacity);
      formData.append('input_79', growthStrat);
      formData.append('input_81', innovation);
      formData.append('input_82', impact);
      formData.append('input_83', bbbeeCompliance);
      
      if (declaration) {
        formData.append('input_85_1', 'I hereby declare that the information provided in this application is true and accurate to the best of my knowledge. I understand that providing false or misleading information may disqualify my application.');
      }

      if (orgChart) {
        formData.append('input_76', orgChart);
      }
      
      if (supportingDocs && supportingDocs.length > 0) {
        // GF multi-file upload using REST API requires specific handling, 
        // usually input_86[] or input_86_1, input_86_2.
        // We will append as multiple files.
        for (let i = 0; i < supportingDocs.length; i++) {
          formData.append(`input_86[]`, supportingDocs[i]);
        }
      }

      const response = await fetch('https://forms.empowaentrepreneurs.co.za/wp-json/gf/v2/forms/5/submissions', {
        method: 'POST',
        body: formData,
      });

      let data;
      try {
        data = await response.json();
      } catch (e) {
        const text = await response.text();
        console.error('Failed to parse JSON:', text);
        throw new Error('Server returned invalid JSON. Check console.');
      }

      if (data.is_valid) {
        setStatus('success');
      } else {
        setStatus('error');
        const labels: Record<string, string> = { '1': 'Business Name', '7': 'Registration Number', '47': 'Physical Address', '48': 'Postal Address', '3.3': 'Contact First Name', '3.6': 'Contact Last Name', '5': 'Email Address', '4': 'Phone Number', '49': 'Website', '33': 'Industry Sector', '39': 'B-BBEE Level', '17': 'Ownership Structure', '50.3': 'Founder First Name', '50.6': 'Founder Last Name', '52': 'ID Number', '53': 'Race', '54': 'Gender', '55': 'Educational Background', '56': 'Relevant Experience', '57': 'Problem', '58': 'Solution', '59': 'Value Proposition', '60': 'Target Market', '61': 'Competitive Advantage', '64': 'TAM', '65': 'SAM', '66': 'Current Market Share', '45': 'Marketing Strategy', '67': 'Annual Rev Year 1', '68': 'Annual Rev Year 2', '69': 'Profit Year 1', '70': 'Profit Year 2', '71': 'Funding Received', '72': 'Funding Request', '38': 'Use of Funds', '74': 'Key Team', '76': 'Org Chart', '78': 'Operational Capacity', '79': 'Growth Strategy', '81': 'Innovation Factor', '82': 'Social Impact', '83': 'B-BBEE Compliance', '85.1': 'Declaration', '86': 'Supporting Docs' };
        setErrorMessage(data.validation_messages ? Object.entries(data.validation_messages).map(([k, v]) => `[${labels[k] || `Field ${k}`}] ${v}`).join(' | ') : 'An error occurred during submission.');
      }
    } catch (error: any) {
      console.error('Submission error:', error);
      setStatus('error');
      setErrorMessage(error.message || 'A network error occurred. Please try again.');
    }
  };

  const formGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
    gap: '16px',
    marginBottom: '24px'
  };

  return (
    <AnimatePresence>
      {isOpen && (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(10,9,8,0.85)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '12px' : '24px', boxSizing: 'border-box'
      }}>
        <style>{`
          @keyframes spin { 100% { transform: rotate(360deg); } }
          .pitch-modal-form select option { background-color: #141210; color: #F7F6F3; }
          .pitch-modal-form input[type="file"]::file-selector-button {
            background: rgba(247,246,243,0.1); border: 1px solid rgba(247,246,243,0.2); border-radius: 6px;
            color: #F7F6F3; padding: 8px 12px; margin-right: 12px; cursor: pointer; font-family: 'Inter', sans-serif;
            transition: background 0.2s;
          }
          .pitch-modal-form input[type="file"]::file-selector-button:hover { background: rgba(247,246,243,0.15); }
        `}</style>
        <motion.div ref={modalRef} initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: 0.97 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }} onClick={e => e.stopPropagation()} className="pitch-modal-form" style={{
          background: '#0f1c28', border: '1px solid rgba(247,246,243,0.1)', borderRadius: '24px',
          width: '100%', maxWidth: '840px', maxHeight: '90vh', overflowY: 'auto', boxSizing: 'border-box',
          position: 'relative', boxShadow: '0 40px 120px rgba(0,0,0,0.6)', margin: 'auto'
        }}>
          <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #DE322D, #ff4d48, transparent)' }} />
          
          <div style={{ padding: isMobile ? '24px 20px' : '40px 48px', position: 'relative' }}>
            <button onClick={onClose} style={{
              position: 'absolute', top: '24px', right: '24px', background: 'rgba(247,246,243,0.06)', border: '1px solid rgba(247,246,243,0.1)',
              borderRadius: '8px', width: '34px', height: '34px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6L18 18" stroke="rgba(247,246,243,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div key="modal-success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', textAlign: 'center', padding: '60px 0' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="32" height="24" viewBox="0 0 22 16" fill="none"><path d="M1 8L8 15L21 1" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '28px', fontWeight: 600, color: '#F7F6F3', margin: '0 0 16px' }}>Application Submitted</h3>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', color: 'rgba(247,246,243,0.5)', margin: 0, lineHeight: '1.7', maxWidth: '480px' }}>
                      Thank you for submitting your detailed pitch application. Our review committee will evaluate your submission and be in touch soon.
                    </p>
                  </div>
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={onClose} style={{ marginTop: '24px', background: 'rgba(247,246,243,0.06)', border: '1px solid rgba(247,246,243,0.12)', borderRadius: '44px', padding: '14px 40px', fontFamily: 'Montserrat, sans-serif', fontSize: '14px', fontWeight: 600, color: '#F7F6F3', cursor: 'pointer' }}>Close Window</motion.button>
                </motion.div>
              ) : (
                <motion.div key="modal-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <div style={{ marginBottom: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#DE322D', boxShadow: '0 0 8px rgba(222,50,45,0.5)' }} />
                      <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(247,246,243,0.4)', fontWeight: 600 }}>Pitch Power Application</span>
                    </div>
                    <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: isMobile ? '24px' : '32px', fontWeight: 300, letterSpacing: '-1px', color: '#F7F6F3', margin: '0 0 12px', lineHeight: 1.15 }}>
                      Pitching Festival <em style={{ fontStyle: 'italic', color: '#DE322D', fontWeight: 400 }}>Entry</em>
                    </h3>
                  </div>

                  <div style={{ marginBottom: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: 600, color: '#DE322D' }}>Step {step} of {totalSteps}</span>
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(247,246,243,0.4)' }}>
                        {step === 1 ? 'Business Details' : step === 2 ? 'Founder & Contact' : step === 3 ? 'Value Proposition' : step === 4 ? 'Market & Growth' : step === 5 ? 'Financials & Team' : 'Documents & Submit'}
                      </span>
                    </div>
                    <div style={{ width: '100%', height: '4px', background: 'rgba(247,246,243,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: `${(step / totalSteps) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #DE322D, #ff4d48)', transition: 'width 0.3s ease' }} />
                    </div>
                  </div>

                  {status === 'error' && (
                    <div style={{ marginBottom: '24px', padding: '16px', background: 'rgba(222,50,45,0.1)', border: '1px solid rgba(222,50,45,0.2)', borderRadius: '12px', color: '#DE322D', fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                      {errorMessage}
                    </div>
                  )}
                  
                  <form id="pitch-modal-form" onSubmit={handleSubmit}>
                    {step === 1 && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <h4 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '18px', color: '#F7F6F3', marginBottom: '24px', borderBottom: '1px solid rgba(247,246,243,0.1)', paddingBottom: '12px' }}>Business Details</h4>
                        <div style={formGridStyle}>
                          <div style={{ gridColumn: isMobile ? 'span 1' : 'span 2' }}>
                            <label style={FIELD_LABEL_STYLE}>Business Name</label>
                            <input type="text" value={businessName} onChange={e => setBusinessName(e.target.value)} required style={FIELD_INPUT_STYLE} onFocus={handleFocus} onBlur={handleBlur} />
                          </div>
                          <div>
                            <label style={FIELD_LABEL_STYLE}>Registration Number</label>
                            <input type="text" value={regNumber} onChange={e => setRegNumber(e.target.value)} required style={FIELD_INPUT_STYLE} onFocus={handleFocus} onBlur={handleBlur} />
                          </div>
                          <div>
                            <label style={FIELD_LABEL_STYLE}>Industry Sector</label>
                            <input type="text" value={industry} onChange={e => setIndustry(e.target.value)} required style={FIELD_INPUT_STYLE} onFocus={handleFocus} onBlur={handleBlur} />
                          </div>
                          <div style={{ gridColumn: isMobile ? 'span 1' : 'span 2' }}>
                            <label style={FIELD_LABEL_STYLE}>Physical Address</label>
                            <input type="text" value={physicalAddress} onChange={e => setPhysicalAddress(e.target.value)} required style={FIELD_INPUT_STYLE} onFocus={handleFocus} onBlur={handleBlur} />
                          </div>
                          <div style={{ gridColumn: isMobile ? 'span 1' : 'span 2' }}>
                            <label style={FIELD_LABEL_STYLE}>Postal Address</label>
                            <input type="text" value={postalAddress} onChange={e => setPostalAddress(e.target.value)} style={FIELD_INPUT_STYLE} onFocus={handleFocus} onBlur={handleBlur} />
                          </div>
                          <div>
                            <label style={FIELD_LABEL_STYLE}>B-BBEE Level</label>
                            <select value={bbbeeLevel} onChange={e => setBbbeeLevel(e.target.value)} style={FIELD_INPUT_STYLE} onFocus={handleFocus} onBlur={handleBlur}>
                              <option value="">Select an option</option>
                              {['LEVEL 1', 'LEVEL 2', 'LEVEL 3', 'LEVEL 4', 'LEVEL 5', 'LEVEL 6', 'LEVEL 7', 'LEVEL 8'].map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                          </div>
                          <div>
                            <label style={FIELD_LABEL_STYLE}>Ownership Structure</label>
                            <select value={ownership} onChange={e => setOwnership(e.target.value)} required style={FIELD_INPUT_STYLE} onFocus={handleFocus} onBlur={handleBlur}>
                              <option value="">Select an option</option>
                              {['Sole Prop', 'Partnership', 'Private Company', 'Consortium', 'JV', 'Special Purpose Vehicle'].map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                          </div>
                          <div style={{ gridColumn: isMobile ? 'span 1' : 'span 2' }}>
                            <label style={FIELD_LABEL_STYLE}>Website (if applicable)</label>
                            <input type="url" value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://" style={FIELD_INPUT_STYLE} onFocus={handleFocus} onBlur={handleBlur} />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <h4 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '18px', color: '#F7F6F3', marginBottom: '24px', borderBottom: '1px solid rgba(247,246,243,0.1)', paddingBottom: '12px' }}>Contact Person</h4>
                        <div style={formGridStyle}>
                          <div>
                            <label style={FIELD_LABEL_STYLE}>First Name</label>
                            <input type="text" value={contactFirst} onChange={e => setContactFirst(e.target.value)} required style={FIELD_INPUT_STYLE} onFocus={handleFocus} onBlur={handleBlur} />
                          </div>
                          <div>
                            <label style={FIELD_LABEL_STYLE}>Last Name</label>
                            <input type="text" value={contactLast} onChange={e => setContactLast(e.target.value)} required style={FIELD_INPUT_STYLE} onFocus={handleFocus} onBlur={handleBlur} />
                          </div>
                          <div>
                            <label style={FIELD_LABEL_STYLE}>Email Address (Direct / PA)</label>
                            <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} required style={FIELD_INPUT_STYLE} onFocus={handleFocus} onBlur={handleBlur} />
                          </div>
                          <div>
                            <label style={FIELD_LABEL_STYLE}>Phone Number</label>
                            <input type="tel" value={contactPhone} onChange={e => setContactPhone(e.target.value)} required style={FIELD_INPUT_STYLE} onFocus={handleFocus} onBlur={handleBlur} />
                          </div>
                        </div>

                        <h4 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '18px', color: '#F7F6F3', marginBottom: '24px', marginTop: '32px', borderBottom: '1px solid rgba(247,246,243,0.1)', paddingBottom: '12px' }}>Founder Profile</h4>
                        <div style={formGridStyle}>
                          <div>
                            <label style={FIELD_LABEL_STYLE}>First Name</label>
                            <input type="text" value={founderFirst} onChange={e => setFounderFirst(e.target.value)} required style={FIELD_INPUT_STYLE} onFocus={handleFocus} onBlur={handleBlur} />
                          </div>
                          <div>
                            <label style={FIELD_LABEL_STYLE}>Last Name</label>
                            <input type="text" value={founderLast} onChange={e => setFounderLast(e.target.value)} required style={FIELD_INPUT_STYLE} onFocus={handleFocus} onBlur={handleBlur} />
                          </div>
                          <div style={{ gridColumn: isMobile ? 'span 1' : 'span 2' }}>
                            <label style={FIELD_LABEL_STYLE}>ID Number</label>
                            <input type="text" value={founderId} onChange={e => setFounderId(e.target.value)} required style={FIELD_INPUT_STYLE} onFocus={handleFocus} onBlur={handleBlur} />
                          </div>
                          <div>
                            <label style={FIELD_LABEL_STYLE}>Race (Demographic reporting)</label>
                            <select value={race} onChange={e => setRace(e.target.value)} required style={FIELD_INPUT_STYLE} onFocus={handleFocus} onBlur={handleBlur}>
                              <option value="">Select an option</option>
                              {['African', 'Asian', 'Coloured', 'Indian', 'White'].map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                          </div>
                          <div>
                            <label style={FIELD_LABEL_STYLE}>Gender</label>
                            <select value={gender} onChange={e => setGender(e.target.value)} required style={FIELD_INPUT_STYLE} onFocus={handleFocus} onBlur={handleBlur}>
                              <option value="">Select an option</option>
                              {['Female', 'Male', 'Non-binary'].map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                          </div>
                          <div style={{ gridColumn: isMobile ? 'span 1' : 'span 2' }}>
                            <label style={FIELD_LABEL_STYLE}>Educational Background</label>
                            <input type="text" value={education} onChange={e => setEducation(e.target.value)} style={FIELD_INPUT_STYLE} onFocus={handleFocus} onBlur={handleBlur} />
                          </div>
                          <div style={{ gridColumn: isMobile ? 'span 1' : 'span 2' }}>
                            <label style={FIELD_LABEL_STYLE}>Relevant Experience</label>
                            <textarea value={experience} onChange={e => setExperience(e.target.value)} style={{...FIELD_INPUT_STYLE, minHeight: '80px', resize: 'vertical'}} onFocus={handleFocus} onBlur={handleBlur} />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {step === 3 && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <h4 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '18px', color: '#F7F6F3', marginBottom: '24px', borderBottom: '1px solid rgba(247,246,243,0.1)', paddingBottom: '12px' }}>Value Proposition</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                          <div>
                            <label style={FIELD_LABEL_STYLE}>Problem (150 words max)</label>
                            <p style={{fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'rgba(247,246,243,0.4)', marginTop: '-4px', marginBottom: '8px'}}>Clearly describe the problem your business is solving.</p>
                            <textarea value={problem} onChange={e => setProblem(e.target.value)} required style={{...FIELD_INPUT_STYLE, minHeight: '120px', resize: 'vertical'}} onFocus={handleFocus} onBlur={handleBlur} />
                          </div>
                          <div>
                            <label style={FIELD_LABEL_STYLE}>Solution (150 words max)</label>
                            <p style={{fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'rgba(247,246,243,0.4)', marginTop: '-4px', marginBottom: '8px'}}>Explain your product/service and how it solves the problem.</p>
                            <textarea value={solution} onChange={e => setSolution(e.target.value)} required style={{...FIELD_INPUT_STYLE, minHeight: '120px', resize: 'vertical'}} onFocus={handleFocus} onBlur={handleBlur} />
                          </div>
                          <div>
                            <label style={FIELD_LABEL_STYLE}>Value Proposition (100 words max)</label>
                            <p style={{fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'rgba(247,246,243,0.4)', marginTop: '-4px', marginBottom: '8px'}}>What unique value do you offer to your customers?</p>
                            <textarea value={valueProp} onChange={e => setValueProp(e.target.value)} required style={{...FIELD_INPUT_STYLE, minHeight: '100px', resize: 'vertical'}} onFocus={handleFocus} onBlur={handleBlur} />
                          </div>
                          <div>
                            <label style={FIELD_LABEL_STYLE}>Competitive Advantage (150 words max)</label>
                            <p style={{fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'rgba(247,246,243,0.4)', marginTop: '-4px', marginBottom: '8px'}}>What makes your business different and better than the competition?</p>
                            <textarea value={competitiveAdv} onChange={e => setCompetitiveAdv(e.target.value)} required style={{...FIELD_INPUT_STYLE, minHeight: '120px', resize: 'vertical'}} onFocus={handleFocus} onBlur={handleBlur} />
                          </div>
                          <div>
                            <label style={FIELD_LABEL_STYLE}>Innovation Factor</label>
                            <p style={{fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'rgba(247,246,243,0.4)', marginTop: '-4px', marginBottom: '8px'}}>Describe innovative aspects (e.g., tech, process, model).</p>
                            <textarea value={innovation} onChange={e => setInnovation(e.target.value)} style={{...FIELD_INPUT_STYLE, minHeight: '100px', resize: 'vertical'}} onFocus={handleFocus} onBlur={handleBlur} />
                          </div>
                          <div>
                            <label style={FIELD_LABEL_STYLE}>Social/Environmental Impact</label>
                            <textarea value={impact} onChange={e => setImpact(e.target.value)} style={{...FIELD_INPUT_STYLE, minHeight: '100px', resize: 'vertical'}} onFocus={handleFocus} onBlur={handleBlur} />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {step === 4 && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <h4 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '18px', color: '#F7F6F3', marginBottom: '24px', borderBottom: '1px solid rgba(247,246,243,0.1)', paddingBottom: '12px' }}>Market & Growth</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                          <div>
                            <label style={FIELD_LABEL_STYLE}>Target Market (150 words max)</label>
                            <p style={{fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'rgba(247,246,243,0.4)', marginTop: '-4px', marginBottom: '8px'}}>Describe your target market and its size.</p>
                            <textarea value={targetMarket} onChange={e => setTargetMarket(e.target.value)} required style={{...FIELD_INPUT_STYLE, minHeight: '100px', resize: 'vertical'}} onFocus={handleFocus} onBlur={handleBlur} />
                          </div>
                          <div style={formGridStyle}>
                            <div>
                              <label style={FIELD_LABEL_STYLE}>Total Addressable Market (TAM)</label>
                              <p style={{fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'rgba(247,246,243,0.4)', marginTop: '-4px', marginBottom: '8px'}}>Estimate market size in Rand value.</p>
                              <input type="text" value={tam} onChange={e => setTam(e.target.value)} required style={FIELD_INPUT_STYLE} onFocus={handleFocus} onBlur={handleBlur} />
                            </div>
                            <div>
                              <label style={FIELD_LABEL_STYLE}>Serviceable Available Market (SAM)</label>
                              <p style={{fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'rgba(247,246,243,0.4)', marginTop: '-4px', marginBottom: '8px'}}>Portion of TAM realistically reachable (Rand value).</p>
                              <input type="text" value={sam} onChange={e => setSam(e.target.value)} required style={FIELD_INPUT_STYLE} onFocus={handleFocus} onBlur={handleBlur} />
                            </div>
                            <div>
                              <label style={FIELD_LABEL_STYLE}>Current Market Share (%)</label>
                              <input type="text" value={marketShare} onChange={e => setMarketShare(e.target.value)} style={FIELD_INPUT_STYLE} onFocus={handleFocus} onBlur={handleBlur} />
                            </div>
                          </div>
                          <div>
                            <label style={FIELD_LABEL_STYLE}>Marketing and Sales Strategy</label>
                            <p style={{fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'rgba(247,246,243,0.4)', marginTop: '-4px', marginBottom: '8px'}}>Outline your strategy for reaching the market.</p>
                            <textarea value={marketingStrat} onChange={e => setMarketingStrat(e.target.value)} required style={{...FIELD_INPUT_STYLE, minHeight: '100px', resize: 'vertical'}} onFocus={handleFocus} onBlur={handleBlur} />
                          </div>
                          <div>
                            <label style={FIELD_LABEL_STYLE}>Growth Strategy</label>
                            <p style={{fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'rgba(247,246,243,0.4)', marginTop: '-4px', marginBottom: '8px'}}>Describe your plan for scaling your business.</p>
                            <textarea value={growthStrat} onChange={e => setGrowthStrat(e.target.value)} required style={{...FIELD_INPUT_STYLE, minHeight: '100px', resize: 'vertical'}} onFocus={handleFocus} onBlur={handleBlur} />
                          </div>
                          <div>
                            <label style={FIELD_LABEL_STYLE}>Operational Capacity</label>
                            <p style={{fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'rgba(247,246,243,0.4)', marginTop: '-4px', marginBottom: '8px'}}>Explain how you will handle increased demand.</p>
                            <textarea value={capacity} onChange={e => setCapacity(e.target.value)} required style={{...FIELD_INPUT_STYLE, minHeight: '100px', resize: 'vertical'}} onFocus={handleFocus} onBlur={handleBlur} />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {step === 5 && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <h4 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '18px', color: '#F7F6F3', marginBottom: '24px', borderBottom: '1px solid rgba(247,246,243,0.1)', paddingBottom: '12px' }}>Financials & Team</h4>
                        <div style={formGridStyle}>
                          <div>
                            <label style={FIELD_LABEL_STYLE}>Annual Revenue (Year 1)</label>
                            <input type="text" value={revY1} onChange={e => setRevY1(e.target.value)} required style={FIELD_INPUT_STYLE} onFocus={handleFocus} onBlur={handleBlur} />
                          </div>
                          <div>
                            <label style={FIELD_LABEL_STYLE}>Annual Revenue (Year 2)</label>
                            <input type="text" value={revY2} onChange={e => setRevY2(e.target.value)} required style={FIELD_INPUT_STYLE} onFocus={handleFocus} onBlur={handleBlur} />
                          </div>
                          <div>
                            <label style={FIELD_LABEL_STYLE}>Profit/Loss (Year 1)</label>
                            <input type="text" value={profitY1} onChange={e => setProfitY1(e.target.value)} required style={FIELD_INPUT_STYLE} onFocus={handleFocus} onBlur={handleBlur} />
                          </div>
                          <div>
                            <label style={FIELD_LABEL_STYLE}>Profit/Loss (Year 2)</label>
                            <input type="text" value={profitY2} onChange={e => setProfitY2(e.target.value)} required style={FIELD_INPUT_STYLE} onFocus={handleFocus} onBlur={handleBlur} />
                          </div>
                          <div>
                            <label style={FIELD_LABEL_STYLE}>Funding Received to Date</label>
                            <input type="text" value={fundingReceived} onChange={e => setFundingReceived(e.target.value)} style={FIELD_INPUT_STYLE} onFocus={handleFocus} onBlur={handleBlur} />
                          </div>
                          <div>
                            <label style={FIELD_LABEL_STYLE}>Funding Request</label>
                            <p style={{fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'rgba(247,246,243,0.4)', marginTop: '-4px', marginBottom: '8px'}}>Amount sought from Dragons.</p>
                            <input type="text" value={fundingRequest} onChange={e => setFundingRequest(e.target.value)} required style={FIELD_INPUT_STYLE} onFocus={handleFocus} onBlur={handleBlur} />
                          </div>
                        </div>
                        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                          <div>
                            <label style={FIELD_LABEL_STYLE}>Proposed Use of Funds</label>
                            <p style={{fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'rgba(247,246,243,0.4)', marginTop: '-4px', marginBottom: '8px'}}>Provide a detailed breakdown.</p>
                            <textarea value={useOfFunds} onChange={e => setUseOfFunds(e.target.value)} required style={{...FIELD_INPUT_STYLE, minHeight: '100px', resize: 'vertical'}} onFocus={handleFocus} onBlur={handleBlur} />
                          </div>
                          <div>
                            <label style={FIELD_LABEL_STYLE}>Key Team Members</label>
                            <p style={{fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'rgba(247,246,243,0.4)', marginTop: '-4px', marginBottom: '8px'}}>List members, roles, and experience.</p>
                            <textarea value={keyTeam} onChange={e => setKeyTeam(e.target.value)} required style={{...FIELD_INPUT_STYLE, minHeight: '100px', resize: 'vertical'}} onFocus={handleFocus} onBlur={handleBlur} />
                          </div>
                          <div>
                            <label style={FIELD_LABEL_STYLE}>Organizational Chart (Optional Upload)</label>
                            <input type="file" onChange={e => setOrgChart(e.target.files ? e.target.files[0] : null)} style={FIELD_INPUT_STYLE} />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {step === 6 && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <h4 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '18px', color: '#F7F6F3', marginBottom: '24px', borderBottom: '1px solid rgba(247,246,243,0.1)', paddingBottom: '12px' }}>Documents & Submit</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                          <div>
                            <label style={FIELD_LABEL_STYLE}>B-BBEE Compliance</label>
                            <p style={{fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'rgba(247,246,243,0.4)', marginTop: '-4px', marginBottom: '8px'}}>Outline current level and plans for improvement.</p>
                            <textarea value={bbbeeCompliance} onChange={e => setBbbeeCompliance(e.target.value)} style={{...FIELD_INPUT_STYLE, minHeight: '80px', resize: 'vertical'}} onFocus={handleFocus} onBlur={handleBlur} />
                          </div>
                          <div>
                            <label style={FIELD_LABEL_STYLE}>Supporting Documents Checklist (Multiple Upload)</label>
                            <p style={{fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(247,246,243,0.5)', marginTop: '-4px', marginBottom: '12px', lineHeight: 1.6}}>
                              Please include: Pitch Deck (Max 10 slides), Business Model Canvas, 3-Year Financial Projections (Excel), Executive Summary (Max 5 pages), Company Registration (CIPC), B-BBEE Certificate (if applicable).
                            </p>
                            <input type="file" multiple onChange={e => setSupportingDocs(e.target.files)} required style={FIELD_INPUT_STYLE} />
                          </div>

                          <div style={{ padding: '24px', background: 'rgba(222,50,45,0.05)', border: '1px solid rgba(222,50,45,0.15)', borderRadius: '12px', marginTop: '16px' }}>
                            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                              <input type="checkbox" required checked={declaration} onChange={e => setDeclaration(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: '#DE322D', marginTop: '2px', flexShrink: 0 }} />
                              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#F7F6F3', lineHeight: 1.6 }}>
                                <strong>DECLARATION:</strong> I hereby declare that the information provided in this application is true and accurate to the best of my knowledge. I understand that providing false or misleading information may disqualify my application.
                              </span>
                            </label>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '40px', paddingTop: '24px', borderTop: '1px solid rgba(247,246,243,0.08)' }}>
                      <button type="button" onClick={prevStep} style={{
                        visibility: step > 1 ? 'visible' : 'hidden', background: 'rgba(247,246,243,0.05)', color: '#F7F6F3',
                        border: '1px solid rgba(247,246,243,0.15)', borderRadius: '44px', padding: '12px 28px',
                        fontFamily: 'Montserrat, sans-serif', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s'
                      }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(247,246,243,0.1)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(247,246,243,0.05)'}>
                        Back
                      </button>

                      {step < totalSteps ? (
                        <button type="button" onClick={nextStep} style={{
                          background: '#F7F6F3', color: '#141210', border: 'none', borderRadius: '44px',
                          padding: '12px 28px', fontFamily: 'Montserrat, sans-serif', fontSize: '13px',
                          fontWeight: 600, cursor: 'pointer', transition: 'transform 0.2s'
                        }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                          Next Step
                        </button>
                      ) : (
                        <button type="submit" disabled={status === 'loading'} style={{
                          background: 'linear-gradient(135deg, #DE322D 0%, #c42823 100%)', color: '#fff', border: 'none',
                          borderRadius: '44px', padding: '12px 28px', fontFamily: 'Montserrat, sans-serif', fontSize: '13px',
                          fontWeight: 600, cursor: status === 'loading' ? 'not-allowed' : 'pointer', opacity: status === 'loading' ? 0.7 : 1,
                          boxShadow: '0 8px 36px rgba(222,50,45,0.55)', display: 'flex', alignItems: 'center', gap: '10px'
                        }}>
                          {status === 'loading' ? (
                            <>
                              <div style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                              <span>{loadingText}</span>
                            </>
                          ) : (
                            <span>Submit Application</span>
                          )}
                        </button>
                      )}
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
      )}
    </AnimatePresence>
  );
};
