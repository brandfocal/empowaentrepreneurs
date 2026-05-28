import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Star, Download, RotateCcw, AlertTriangle, FileText, User } from 'lucide-react';

// --- CONSTANTS ---
const PRIMARY_CORAL = '#DE322D';
const DARK_BG = '#0A0D14';
const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`;

const SESSIONS = [
  'Session 1: Catalytic Capital Pitch Arena',
  'Session 2: Power Seat Investor Roundtables',
  'Session 3: Early-Stage VC Pitching Showcase',
  'Session 4: Seed & Growth Scaling Pitches'
];

const SECTORS = [
  'Agri-Tech & Agribusiness',
  'Fintech & Financial Services',
  'Green Energy & Sustainability (ESG)',
  'Automotive & Manufacturing',
  'E-Commerce & Retail',
  'Health-Tech & Biotech',
  'Ed-Tech & Education',
  'Logistics, Supply Chain & Transport',
  'Creative Economy & Media',
  'Public Sector & Growth Solutions'
];

interface Criterion {
  key: string;
  name: string;
  weight: number; // e.g. 0.20 for 20%
  description: string;
}

const CRITERIA: Criterion[] = [
  {
    key: 'marketOpportunity',
    name: 'Market opportunity',
    weight: 0.20,
    description: 'Size, growth size and accessible market share (TAM/SAM data, SA market context)'
  },
  {
    key: 'businessModel',
    name: 'Business model',
    weight: 0.20,
    description: 'Revenue mechanism, unit economics, margins, path to profitability and scalability'
  },
  {
    key: 'tractionValidation',
    name: 'Traction & validation',
    weight: 0.10,
    description: 'Customer base, growth rate, retention data, revenue evidence (ARR/MRR or R100k with 100%+ YOY)'
  },
  {
    key: 'teamCapability',
    name: 'Team capability',
    weight: 0.15,
    description: 'Founder experience, domain expertise, leadership depth and execution credibility'
  },
  {
    key: 'financialProjections',
    name: 'Financial projections',
    weight: 0.10,
    description: 'Realistic 5-year trajectory, assumptions, path to profitability and burn rate'
  },
  {
    key: 'competitiveAdvantage',
    name: 'Competitive advantage',
    weight: 0.10,
    description: 'Differentiation, barriers to entry, IP or operational moat'
  },
  {
    key: 'investmentTerms',
    name: 'Investment terms',
    weight: 0.10,
    description: 'Valuation reasonableness, equity structure, use of funds and exit pathway'
  },
  {
    key: 'socialImpact',
    name: 'Social impact',
    weight: 0.05,
    description: 'B-BBEE certification, job creation potential, socio-economic development alignment'
  }
];

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

export const DragonScoringPanel: React.FC = () => {
  const isMobile = useIsMobile();
  // General setup
  const [dragonName, setDragonName] = useState('');
  const [selectedSession, setSelectedSession] = useState('');
  
  // Applicant details
  const [businessName, setBusinessName] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [fundingSought, setFundingSought] = useState('');

  // Scores and notes
  // structure: { marketOpportunity: { score: number | null, notes: string } }
  const [scores, setScores] = useState<Record<string, { score: number | null; notes: string }>>(
    CRITERIA.reduce((acc, c) => ({ ...acc, [c.key]: { score: null, notes: '' } }), {})
  );

  // Summary fields
  const [overallComment, setOverallComment] = useState('');

  // App submission states
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingText, setLoadingText] = useState('Submitting scorecard...');
  const [savedCount, setSavedCount] = useState(0);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [scoringHistory, setScoringHistory] = useState<any[]>([]);

  // Load history from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('eef_dragon_scores');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setScoringHistory(parsed);
        setSavedCount(parsed.length);
      } catch (e) {
        console.error('Failed to load local storage scores', e);
      }
    }
  }, []);

  // Sync loading texts
  useEffect(() => {
    if (status === 'loading') {
      const texts = [
        'Submitting scorecard...',
        'Mapping criteria data...',
        'Sending scores to WordPress...',
        'Logging investment thesis...',
        'Securing submission...'
      ];
      let i = 0;
      setLoadingText(texts[0]);
      const interval = setInterval(() => {
        i = (i + 1) % texts.length;
        setLoadingText(texts[i]);
      }, 2200);
      return () => clearInterval(interval);
    }
  }, [status]);

  // Update a single score or note
  const handleScoreChange = (key: string, val: number | null) => {
    setScores(prev => ({
      ...prev,
      [key]: { ...prev[key], score: val }
    }));
  };

  const handleNotesChange = (key: string, val: string) => {
    setScores(prev => ({
      ...prev,
      [key]: { ...prev[key], notes: val }
    }));
  };

  // Calculations
  const scoredCriteria = CRITERIA.filter(c => scores[c.key].score !== null);
  const criteriaScoredCount = scoredCriteria.length;
  
  const calculateTotalScore = (): number | null => {
    if (criteriaScoredCount === 0) return null;
    let totalWeighted = 0;
    let totalWeightScored = 0;
    
    scoredCriteria.forEach(c => {
      const entry = scores[c.key];
      if (entry.score !== null) {
        totalWeighted += entry.score * c.weight;
        totalWeightScored += c.weight;
      }
    });

    if (totalWeightScored === 0) return null;
    // Scale out of 100
    const scaled = (totalWeighted / totalWeightScored) * 10;
    return Math.round(scaled * 10) / 10; // Round to 1 decimal place
  };

  const totalScore = calculateTotalScore();

  // Verdict logic
  const getVerdict = (score: number | null): { text: string; color: string } => {
    if (score === null) return { text: 'Complete all criteria to calculate verdict', color: '#8a99ad' };
    if (score >= 80) return { text: 'Strong Buy / Highly Investable', color: '#10b981' };
    if (score >= 60) return { text: 'Investable / Needs DD', color: '#3b8fde' };
    if (score >= 40) return { text: 'Review Later', color: '#f59e0b' };
    return { text: 'Pass / High Risk', color: PRIMARY_CORAL };
  };

  const verdict = getVerdict(totalScore);

  // Clear form helper
  const handleResetForm = () => {
    setBusinessName('');
    setSelectedSector('');
    setFundingSought('');
    setScores(
      CRITERIA.reduce((acc, c) => ({ ...acc, [c.key]: { score: null, notes: '' } }), {})
    );
    setOverallComment('');
    setStatus('idle');
    setErrorMessage('');
  };

  // Submit to Gravity Forms
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dragonName || !businessName) {
      setErrorMessage('Dragon name and Business name are required to submit a scorecard.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMessage('');
    try {
      const payload = {
        input_1: dragonName,
        input_3: selectedSession,
        input_4: businessName,
        input_5: selectedSector,
        input_6: fundingSought,
        
        // market opportunity
        input_7: scores.marketOpportunity.score,
        input_8: scores.marketOpportunity.notes,
        
        // business model
        input_9: scores.businessModel.score,
        input_10: scores.businessModel.notes,
        
        // traction & validation
        input_11: scores.tractionValidation.score,
        input_12: scores.tractionValidation.notes,
        
        // team capability
        input_13: scores.teamCapability.score,
        input_14: scores.teamCapability.notes,
        
        // financial projections
        input_15: scores.financialProjections.score,
        input_16: scores.financialProjections.notes,
        
        // competitive advantage
        input_17: scores.competitiveAdvantage.score,
        input_18: scores.competitiveAdvantage.notes,
        
        // investment terms
        input_19: scores.investmentTerms.score,
        input_20: scores.investmentTerms.notes,
        
        // social impact
        input_21: scores.socialImpact.score,
        input_22: scores.socialImpact.notes,
        
        // Calculations
        input_23: totalScore,
        input_24: overallComment
      };

      const response = await fetch('https://forms.empowaentrepreneurs.co.za/wp-json/gf/v2/forms/11/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      let data;
      try {
        data = await response.json();
      } catch (err) {
        console.error('Failed to parse JSON. Server returned text.');
        throw new Error('Server returned invalid response structure.');
      }

      // Add to local history & localstorage regardles of network success to act as robust backup!
      const newRecord = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        dragonName,
        session: selectedSession,
        businessName,
        sector: selectedSector,
        fundingSought,
        totalScore: totalScore || 0,
        verdict: verdict.text,
        comment: overallComment,
        apiSuccess: data?.is_valid ? true : false
      };

      const updatedHistory = [newRecord, ...scoringHistory];
      setScoringHistory(updatedHistory);
      localStorage.setItem('eef_dragon_scores', JSON.stringify(updatedHistory));
      setSavedCount(updatedHistory.length);

      if (data && data.is_valid) {
        setStatus('success');
      } else {
        // Fallback to error if invalid but save locally anyway
        setStatus('error');
        setErrorMessage(data.validation_messages ? Object.entries(data.validation_messages).map(([k, v]) => `[Field ${k}]: ${v}`).join(' | ') : 'Gravity Forms rejected submission. Checked local backup.');
      }
    } catch (err: any) {
      console.error('Submission error:', err);
      // Even if network fails, we've saved locally, so provide a recovery path!
      const failedRecord = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        dragonName,
        session: selectedSession,
        businessName,
        sector: selectedSector,
        fundingSought,
        totalScore: totalScore || 0,
        verdict: verdict.text,
        comment: overallComment,
        apiSuccess: false
      };
      const updatedHistory = [failedRecord, ...scoringHistory];
      setScoringHistory(updatedHistory);
      localStorage.setItem('eef_dragon_scores', JSON.stringify(updatedHistory));
      setSavedCount(updatedHistory.length);

      setStatus('error');
      setErrorMessage(`${err.message || 'Network offline.'} Scorecard is safely cached locally on your device!`);
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    if (scoringHistory.length === 0) return;
    
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Dragon Name,Session,Business Name,Sector,Funding Sought,Total Score,Verdict,Comments,API Status\n';
    
    scoringHistory.forEach(r => {
      const row = [
        `"${r.dragonName.replace(/"/g, '""')}"`,
        `"${r.session.replace(/"/g, '""')}"`,
        `"${r.businessName.replace(/"/g, '""')}"`,
        `"${r.sector.replace(/"/g, '""')}"`,
        `"${r.fundingSought.replace(/"/g, '""')}"`,
        r.totalScore,
        `"${r.verdict.replace(/"/g, '""')}"`,
        `"${r.comment.replace(/"/g, '""')}"`,
        r.apiSuccess ? 'Submitted Successfully' : 'Local Cache Only (Offline)'
      ];
      csvContent += row.join(',') + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EEF2026_Scoring_Report_${dragonName || 'Dragon'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Styling properties
  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: DARK_BG,
    backgroundImage: NOISE_SVG,
    backgroundRepeat: 'repeat',
    backgroundSize: '128px',
    color: '#F7F6F3',
    padding: '110px 16px 64px',
    boxSizing: 'border-box',
    fontFamily: 'Inter, sans-serif'
  };

  const cardStyle: React.CSSProperties = {
    background: '#121721',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '20px',
    boxSizing: 'border-box',
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '8px',
    padding: '12px 14px',
    color: '#fff',
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease'
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'rgba(255,255,255,0.4)',
    marginBottom: '8px'
  };

  return (
    <div style={containerStyle}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* --- HEADER --- */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          paddingBottom: '16px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ background: PRIMARY_CORAL, color: '#fff', fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.05em' }}>EEF2026</span>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', fontFamily: 'Montserrat, sans-serif' }}>28 MAY 2026 · EMPOWAWORX HOUSE</span>
            </div>
            <h1 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '20px', margin: 0, color: '#fff', letterSpacing: '-0.5px' }}>Dragon Scoring Panel</h1>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ color: PRIMARY_CORAL, fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>CONFIDENTIAL</span>
            <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '10px' }}>Dragons Only</span>
          </div>
        </header>

        {/* --- TOP SETTINGS BAR --- */}
        <div style={cardStyle}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>Your Name (Dragon)</label>
              <input type="text" value={dragonName} onChange={e => setDragonName(e.target.value)} placeholder="e.g. Thabo Ncobi" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Session Track</label>
              <select value={selectedSession} onChange={e => setSelectedSession(e.target.value)} style={inputStyle}>
                <option value="" style={{ background: '#121721', color: '#fff' }}>Select pitching session</option>
                {SESSIONS.map(s => <option key={s} value={s} style={{ background: '#121721', color: '#fff' }}>{s}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
            <button onClick={() => setShowHistoryModal(true)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '10px 20px', borderRadius: '40px', fontSize: '12px', fontWeight: 600, fontFamily: 'Montserrat, sans-serif', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={14} /> View History ({savedCount})
            </button>
            <button onClick={handleExportCSV} disabled={scoringHistory.length === 0} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: scoringHistory.length === 0 ? 'rgba(255,255,255,0.25)' : '#fff', padding: '10px 20px', borderRadius: '40px', fontSize: '12px', fontWeight: 600, fontFamily: 'Montserrat, sans-serif', cursor: scoringHistory.length === 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Download size={14} /> Export CSV
            </button>
          </div>
        </div>

        {/* --- MAIN INTERACTION SWITCHER --- */}
        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} style={{ ...cardStyle, textAlign: 'center', padding: '48px 32px' }}>
              <div style={{ width: '72px', height: '72px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <Check size={32} color="#10b981" strokeWidth={3} />
              </div>
              <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '24px', fontWeight: 700, margin: '0 0 8px', color: '#fff' }}>Scorecard Submitted!</h2>
              <p style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.5)', fontSize: '14px', margin: '0 auto 32px', maxWidth: '400px', lineHeight: 1.6 }}>
                The evaluation scores for <strong style={{ color: '#fff' }}>{businessName}</strong> have been successfully saved to the server and logged in your session history.
              </p>
              
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '18px', maxWidth: '320px', margin: '0 auto 36px' }}>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'Montserrat, sans-serif', marginBottom: '4px' }}>Weighted Assessment</div>
                <div style={{ fontSize: '32px', fontWeight: 700, color: '#10b981', fontFamily: 'Montserrat, sans-serif' }}>{totalScore}/100</div>
                <div style={{ fontSize: '13px', fontWeight: 500, color: verdict.color, marginTop: '4px' }}>{verdict.text}</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '280px', margin: '0 auto' }}>
                <button onClick={handleResetForm} style={{ width: '100%', background: `linear-gradient(135deg, ${PRIMARY_CORAL}, #b92723)`, color: '#fff', border: 'none', padding: '14px 28px', borderRadius: '40px', fontSize: '13px', fontWeight: 600, fontFamily: 'Montserrat, sans-serif', cursor: 'pointer', boxShadow: '0 4px 16px rgba(222,50,45,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  Score Next Pitching Business <Check size={16} />
                </button>
              </div>
            </motion.div>
          ) : status === 'loading' ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ ...cardStyle, textAlign: 'center', padding: '64px 32px', minHeight: '360px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  border: '3px solid rgba(222,50,45,0.1)',
                  borderTop: `3px solid ${PRIMARY_CORAL}`,
                  marginBottom: '24px'
                }}
              />
              <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: '18px', color: '#fff', margin: '0 0 8px' }}>{loadingText}</h3>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.4)', maxWidth: '260px', margin: 0, lineHeight: 1.5 }}>
                Please do not exit this window while the dragon panel is finalizing the assessment.
              </p>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              
              {/* --- APPLICANT INFO --- */}
              <div style={cardStyle}>
                <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#fff', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={16} color={PRIMARY_CORAL} /> Pitching Applicant Details
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>Business Name</label>
                    <input type="text" value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="e.g. AgriSmart Technologies" style={inputStyle} required />
                  </div>
                  <div>
                    <label style={labelStyle}>Sector Category</label>
                    <select value={selectedSector} onChange={e => setSelectedSector(e.target.value)} style={inputStyle}>
                      <option value="" style={{ background: '#121721', color: '#fff' }}>Select sector</option>
                      {SECTORS.map(s => <option key={s} value={s} style={{ background: '#121721', color: '#fff' }}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Funding Sought</label>
                    <input type="text" value={fundingSought} onChange={e => setFundingSought(e.target.value)} placeholder="e.g. R2M" style={inputStyle} />
                  </div>
                </div>
              </div>

              {/* --- ERRORS --- */}
              {status === 'error' && (
                <div style={{ background: 'rgba(222,50,45,0.08)', border: '1px solid rgba(222,50,45,0.2)', color: '#fff', borderRadius: '12px', padding: '14px 18px', marginBottom: '20px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <AlertTriangle size={18} color={PRIMARY_CORAL} style={{ flexShrink: 0 }} />
                  <div>
                    <strong style={{ color: PRIMARY_CORAL, display: 'block', marginBottom: '2px' }}>Submission Warning</strong>
                    <span style={{ color: 'rgba(255,255,255,0.85)' }}>{errorMessage}</span>
                  </div>
                </div>
              )}

              {/* --- CRITERIA CARDS --- */}
              {CRITERIA.map((criterion) => {
                const currentVal = scores[criterion.key].score;
                const currentNotes = scores[criterion.key].notes;
                
                return (
                  <div key={criterion.key} style={cardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '16px', fontWeight: 600, margin: 0, color: '#fff' }}>{criterion.name}</h3>
                      <span style={{ fontSize: '11px', fontFamily: 'Montserrat, sans-serif', fontWeight: 600, color: PRIMARY_CORAL, background: 'rgba(222,50,45,0.1)', padding: '3px 8px', borderRadius: '4px' }}>Weight: {criterion.weight * 100}%</span>
                    </div>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', margin: '0 0 16px', lineHeight: 1.5 }}>{criterion.description}</p>
                    
                    {/* Score Selector Boxes */}
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                      {Array.from({ length: 10 }).map((_, idx) => {
                        const num = idx + 1;
                        const isSelected = currentVal === num;
                        return (
                          <motion.button key={num} type="button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleScoreChange(criterion.key, num)} style={{
                            width: '38px', height: '38px', border: isSelected ? `1px solid ${PRIMARY_CORAL}` : '1px solid rgba(255,255,255,0.08)', borderRadius: '6px',
                            background: isSelected ? PRIMARY_CORAL : 'rgba(255,255,255,0.04)', color: isSelected ? '#fff' : 'rgba(255,255,255,0.6)', fontSize: '13px', fontWeight: 600,
                            fontFamily: 'Montserrat, sans-serif', cursor: 'pointer', transition: 'border-color 0.2s ease, background 0.2s ease, color 0.2s ease'
                          }}>
                            {num}
                          </motion.button>
                        );
                      })}
                      
                      {/* Not Scored button */}
                      <motion.button type="button" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => handleScoreChange(criterion.key, null)} style={{
                        padding: '0 12px', height: '38px', border: currentVal === null ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.08)', borderRadius: '6px',
                        background: currentVal === null ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)', color: currentVal === null ? '#fff' : 'rgba(255,255,255,0.4)', fontSize: '11px', fontWeight: 600,
                        fontFamily: 'Montserrat, sans-serif', cursor: 'pointer', transition: 'all 0.2s ease'
                      }}>
                        Not Scored
                      </motion.button>
                    </div>

                    {/* Criteria Notes */}
                    <textarea value={currentNotes} onChange={e => handleNotesChange(criterion.key, e.target.value)} placeholder={`Notes on ${criterion.name.toLowerCase()}...`} rows={2} style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }} />
                  </div>
                );
              })}

              {/* --- SUMMARY SECTION --- */}
              <div style={{ ...cardStyle, background: 'linear-gradient(180deg, #151c27 0%, #0d1219 100%)', border: '1px solid rgba(255,255,255,0.09)' }}>
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#fff', margin: '0 0 20px' }}>Score Summary</h3>
                
                {/* Visual score display */}
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: '16px', marginBottom: '24px', textAlign: 'center' }}>
                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '14px' }}>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: 'Montserrat, sans-serif' }}>Total Score</div>
                    <div style={{ fontSize: '26px', fontWeight: 700, color: totalScore === null ? 'rgba(255,255,255,0.15)' : '#10b981', marginTop: '4px', fontFamily: 'Montserrat, sans-serif' }}>{totalScore === null ? '—' : totalScore}</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '14px' }}>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: 'Montserrat, sans-serif' }}>Out Of</div>
                    <div style={{ fontSize: '26px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginTop: '4px', fontFamily: 'Montserrat, sans-serif' }}>100</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '14px' }}>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: 'Montserrat, sans-serif' }}>Criteria Scored</div>
                    <div style={{ fontSize: '26px', fontWeight: 700, color: '#fff', marginTop: '4px', fontFamily: 'Montserrat, sans-serif' }}>{criteriaScoredCount}/8</div>
                  </div>
                </div>

                {/* Verdict text */}
                <div style={{ textAlign: 'center', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '16px' }}>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontFamily: 'Inter, sans-serif' }}>{criteriaScoredCount} of 8 criteria scored</span>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: verdict.color, marginTop: '6px' }}>{verdict.text}</div>
                </div>

                {/* Score breakdown list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                  {CRITERIA.map(c => {
                    const rating = scores[c.key].score;
                    return (
                      <div key={c.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                        <span>{c.name} ({c.weight * 100}%)</span>
                        <span style={{ fontWeight: 600, color: rating === null ? 'rgba(255,255,255,0.15)' : '#fff' }}>{rating === null ? '—' : `${rating}/10`}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Overall thesis notes */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={labelStyle}>Overall Investment Comment (Visible on Report)</label>
                  <textarea value={overallComment} onChange={e => setOverallComment(e.target.value)} placeholder="Summarise your investment thesis or key concerns for this applicant..." rows={4} style={{ ...inputStyle, minHeight: '90px' }} />
                </div>

                {/* Final Form CTA buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', gap: '12px' }}>
                  <motion.button type="button" onClick={handleSubmit} disabled={!dragonName || !businessName} whileHover={(!dragonName || !businessName) ? {} : { scale: 1.02, boxShadow: `0 8px 24px ${PRIMARY_CORAL}44` }} whileTap={(!dragonName || !businessName) ? {} : { scale: 0.98 }} style={{
                    background: (!dragonName || !businessName) ? 'rgba(255,255,255,0.06)' : `linear-gradient(135deg, ${PRIMARY_CORAL} 0%, #b92723 100%)`,
                    border: 'none', borderRadius: '44px', color: (!dragonName || !businessName) ? 'rgba(255,255,255,0.2)' : '#fff', padding: '16px 20px',
                    fontFamily: 'Montserrat, sans-serif', fontSize: '13px', fontWeight: 600, letterSpacing: '0.04em', cursor: (!dragonName || !businessName) ? 'not-allowed' : 'pointer',
                    boxShadow: (!dragonName || !businessName) ? 'none' : '0 4px 16px rgba(222,50,45,0.25)', transition: 'all 0.2s ease', textAlign: 'center'
                  }}>
                    {businessName ? `Submit Scorecard for ${businessName}` : 'Submit Scorecard'}
                  </motion.button>
                  <motion.button type="button" onClick={handleResetForm} whileHover={{ scale: 1.03, background: 'rgba(255,255,255,0.08)' }} whileTap={{ scale: 0.97 }} style={{
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '44px', color: 'rgba(255,255,255,0.65)',
                    padding: '16px 20px', fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: 600, letterSpacing: '0.04em', cursor: 'pointer', transition: 'all 0.2s ease',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                  }}>
                    <RotateCcw size={14} /> Clear Form
                  </motion.button>
                </div>

              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* --- HISTORY SLIDE MODAL --- */}
      <AnimatePresence>
        {showHistoryModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowHistoryModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', zIndex: 200, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', boxSizing: 'border-box' }}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} onClick={e => e.stopPropagation()} style={{ background: '#121721', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto', boxSizing: 'border-box', position: 'relative' }}>
              <button onClick={() => setShowHistoryModal(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'rgba(255,255,255,0.5)', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
              
              <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '18px', fontWeight: 700, margin: '0 0 16px', color: '#fff' }}>Judge Scoring History</h3>
              
              {scoringHistory.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '36px 0', color: 'rgba(255,255,255,0.25)' }}>No applicant scores logged in this session yet.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {scoringHistory.map(r => (
                    <div key={r.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '10px', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ margin: '0 0 4px', fontSize: '14px', color: '#fff', fontWeight: 600 }}>{r.businessName}</h4>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.38)' }}>{r.sector} · {r.timestamp}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '16px', fontWeight: 700, color: '#10b981', fontFamily: 'Montserrat, sans-serif' }}>{r.totalScore}/100</div>
                        <div style={{ fontSize: '10px', color: r.apiSuccess ? '#10b981' : PRIMARY_CORAL, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                          <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: r.apiSuccess ? '#10b981' : PRIMARY_CORAL, display: 'inline-block' }} />
                          {r.apiSuccess ? 'Logged Live' : 'Cached Offline'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
                <button onClick={() => setShowHistoryModal(false)} style={{ background: PRIMARY_CORAL, color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '40px', fontSize: '12px', fontWeight: 600, fontFamily: 'Montserrat, sans-serif', cursor: 'pointer' }}>Close History</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
