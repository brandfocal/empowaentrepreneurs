import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusSquare, Check, ArrowRight, Star } from 'lucide-react';

// --- CONSTANTS ---
const PRIMARY_CORAL = '#DE322D';
const WARM_PARCHMENT = '#F7F3EC';
const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`;
const SECTIONS = ['Overall Experience', 'Audience Questions', 'Content Evaluation', 'Networking & Clinics', 'Future Engagement'];

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

// --- COMPONENTS ---

const StarRating = ({
  value,
  onChange,
  count = 5,
  isMobile
}: {
  value: number;
  onChange: (v: number) => void;
  count?: number;
  isMobile: boolean;
}) => {
  const starSize = isMobile ? 24 : 28;
  return <div style={{
    display: 'flex',
    gap: isMobile ? '4px' : '6px',
    flexWrap: 'wrap'
  }}>
      {Array.from({
      length: count
    }).map((_, i) => {
      const starValue = i + 1;
      return <motion.div key={i} whileHover={{
        scale: 1.15
      }} whileTap={{
        scale: 0.9
      }} onClick={() => onChange(starValue)} style={{
        cursor: 'pointer'
      }}>
            <Star size={starSize} fill={starValue <= value ? PRIMARY_CORAL : 'transparent'} stroke={starValue <= value ? PRIMARY_CORAL : 'rgba(255,255,255,0.2)'} />
          </motion.div>;
    })}
    </div>;
};
const RatingBoxes = ({
  value,
  onChange,
  range,
  isMobile
}: {
  value: number;
  onChange: (v: number) => void;
  range: number[];
  isMobile: boolean;
}) => {
  const boxSize = isMobile ? 30 : 36;
  return <div style={{
    display: 'flex',
    gap: isMobile ? '4px' : '6px',
    flexWrap: 'wrap'
  }}>
      {range.map(num => <motion.div key={num} whileHover={{
      scale: 1.05,
      borderColor: 'rgba(222,50,45,0.4)'
    }} whileTap={{
      scale: 0.95
    }} onClick={() => onChange(num)} style={{
      width: `${boxSize}px`,
      height: `${boxSize}px`,
      borderRadius: isMobile ? '6px' : '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontFamily: 'Montserrat, sans-serif',
      fontSize: isMobile ? '12px' : '14px',
      fontWeight: 600,
      boxSizing: 'border-box',
      background: value === num ? PRIMARY_CORAL : 'rgba(255,255,255,0.07)',
      border: value === num ? `1px solid ${PRIMARY_CORAL}` : '1px solid rgba(255,255,255,0.12)',
      color: value === num ? '#fff' : 'rgba(255,255,255,0.55)'
    }}>
          {num}
        </motion.div>)}
    </div>;
};
const PillOptions = ({
  options,
  value,
  onChange,
  isMobile
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  isMobile: boolean;
}) => {
  return <div style={{
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  }}>
      {options.map(opt => <motion.div key={opt} whileHover={{
      scale: 1.02
    }} whileTap={{
      scale: 0.98
    }} onClick={() => onChange(opt)} style={{
      padding: isMobile ? '8px 16px' : '10px 20px',
      borderRadius: '100px',
      cursor: 'pointer',
      fontFamily: 'Montserrat, sans-serif',
      fontSize: isMobile ? '12px' : '13px',
      fontWeight: 600,
      transition: 'all 0.2s ease',
      boxSizing: 'border-box',
      background: value === opt ? PRIMARY_CORAL : 'transparent',
      border: value === opt ? 'none' : '1px solid rgba(255,255,255,0.2)',
      color: value === opt ? '#fff' : 'rgba(255,255,255,0.6)'
    }}>
          {opt.toUpperCase()}
        </motion.div>)}
    </div>;
};
export const FundingSummitSurvey: React.FC = () => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [respondentType, setRespondentType] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingText, setLoadingText] = useState('Submitting survey...');

  useEffect(() => {
    if (status === 'loading') {
      const texts = ['Submitting survey...', 'Mapping answers...', 'Saving experience data...', 'Powering entrepreneurial futures...', 'Almost done...'];
      let i = 0;
      setLoadingText(texts[0]);
      const interval = setInterval(() => {
        i = (i + 1) % texts.length;
        setLoadingText(texts[i]);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [status]);

  const updateAnswer = (key: string, val: any) => {
    setAnswers(prev => ({
      ...prev,
      [key]: val
    }));
  };
  const handleSubmit = async () => {
    setStatus('loading');
    setErrorMessage('');
    try {
      const payload = {
        input_1: answers.overallRating,
        input_3: answers.metGoals,
        input_6: respondentType,
        input_8: respondentType === 'Founder / Entrepreneur' ? answers.founderNetworkingRating : undefined,
        input_9: respondentType === 'Founder / Entrepreneur' ? answers.founderMeetings : undefined,
        input_10: respondentType === 'Investor / Funder' ? answers.investorAlignment : undefined,
        input_11: respondentType === 'Investor / Funder' ? answers.investorDealFlow : undefined,
        input_12: answers.contentRelevance,
        input_13: answers.mostImpactful,
        input_14: answers.topicsForNext,
        input_15: answers.networkingTime,
        input_16: answers.platformRating,
        input_17: answers.npsScore,
        input_18: answers.wouldReturn,
        input_19: answers.finalComments
      };
      const response = await fetch('https://forms.empowaentrepreneurs.co.za/wp-json/gf/v2/forms/10/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      let data;
      try {
        data = await response.json();
      } catch (e) {
        const text = await response.text();
        console.error('Failed to parse JSON. Server returned:', text);
        throw new Error('Server returned invalid response structure.');
      }
      if (data.is_valid) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage(data.validation_messages ? Object.entries(data.validation_messages).map(([k, v]) => `[Field ${k}]: ${v}`).join(' | ') : 'An error occurred during submission.');
      }
    } catch (error: any) {
      console.error('Survey submission error:', error);
      setStatus('error');
      setErrorMessage(error.message || 'A network error occurred. Please try again.');
    }
  };
  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };
  const questionLabelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: isMobile ? '10px' : '12px',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 300,
    fontSize: isMobile ? '13px' : '14px',
    color: 'rgba(255,255,255,0.75)'
  };
  const fieldGroupStyle: React.CSSProperties = {
    marginBottom: isMobile ? '20px' : '24px',
    boxSizing: 'border-box'
  };
  const textareaStyleDynamic: React.CSSProperties = {
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '12px',
    padding: isMobile ? '10px 14px' : '12px 16px',
    color: '#F7F6F3',
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    width: '100%',
    boxSizing: 'border-box',
    resize: 'vertical',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    minHeight: isMobile ? '80px' : '96px'
  };
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <motion.div initial={{
          opacity: 0,
          x: 20
        }} animate={{
          opacity: 1,
          x: 0
        }} exit={{
          opacity: 0,
          x: -20
        }}>
            <div style={fieldGroupStyle}>
              <span style={questionLabelStyle}>
                On a scale of 1–10, how would you rate your overall experience at the summit?
              </span>
              <RatingBoxes value={answers.overallRating} onChange={v => updateAnswer('overallRating', v)} range={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} isMobile={isMobile} />
            </div>
            <div style={{
            ...fieldGroupStyle,
            marginBottom: 0
          }}>
              <span style={questionLabelStyle}>
                Did the summit meet your goals in attending?
              </span>
              <PillOptions options={['Yes', 'No']} value={answers.metGoals} onChange={v => updateAnswer('metGoals', v)} isMobile={isMobile} />
            </div>
          </motion.div>;
      case 1:
        return <motion.div initial={{
          opacity: 0,
          x: 20
        }} animate={{
          opacity: 1,
          x: 0
        }} exit={{
          opacity: 0,
          x: -20
        }}>
            <div style={{
            ...fieldGroupStyle,
            marginBottom: isMobile ? '24px' : '32px'
          }}>
              <span style={questionLabelStyle}>I am attending as:</span>
              <PillOptions options={['Founder / Entrepreneur', 'Investor / Funder', 'Ecosystem Partner']} value={respondentType} onChange={v => {
              setRespondentType(v);
              updateAnswer('respondentType', v);
            }} isMobile={isMobile} />
            </div>

            {(respondentType === 'Founder / Entrepreneur' || respondentType === '') && <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: isMobile ? '20px' : '24px',
            marginBottom: respondentType === '' ? isMobile ? '20px' : '24px' : '0'
          }}>
                <div style={{
              boxSizing: 'border-box'
            }}>
                  <span style={questionLabelStyle}>
                    How would you rate the quality of the investor-founder networking sessions?
                  </span>
                  <StarRating value={answers.founderNetworkingRating} onChange={v => updateAnswer('founderNetworkingRating', v)} isMobile={isMobile} />
                </div>
                <div style={{
              boxSizing: 'border-box'
            }}>
                  <span style={questionLabelStyle}>
                    Has this summit resulted in any confirmed follow-up meetings or term sheets?
                  </span>
                  <PillOptions options={['Yes', 'No']} value={answers.founderMeetings} onChange={v => updateAnswer('founderMeetings', v)} isMobile={isMobile} />
                </div>
              </div>}

            {(respondentType === 'Investor / Funder' || respondentType === '') && <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: isMobile ? '20px' : '24px'
          }}>
                <div style={{
              boxSizing: 'border-box'
            }}>
                  <span style={questionLabelStyle}>
                    Did the entrepreneurs/companies align with your fund's sector focus and investment stage?
                  </span>
                  <PillOptions options={['Yes', 'Partially', 'No']} value={answers.investorAlignment} onChange={v => updateAnswer('investorAlignment', v)} isMobile={isMobile} />
                </div>
                <div style={{
              boxSizing: 'border-box'
            }}>
                  <span style={questionLabelStyle}>
                    How would you rate the quality of deal flow presented at the summit?
                  </span>
                  <StarRating value={answers.investorDealFlow} onChange={v => updateAnswer('investorDealFlow', v)} isMobile={isMobile} />
                </div>
              </div>}
          </motion.div>;
      case 2:
        return <motion.div initial={{
          opacity: 0,
          x: 20
        }} animate={{
          opacity: 1,
          x: 0
        }} exit={{
          opacity: 0,
          x: -20
        }}>
            <div style={fieldGroupStyle}>
              <span style={questionLabelStyle}>
                How would you rate the relevance of panel discussions and workshops to current market funding trends?
              </span>
              <StarRating value={answers.contentRelevance} onChange={v => updateAnswer('contentRelevance', v)} isMobile={isMobile} />
            </div>
            <div style={fieldGroupStyle}>
              <span style={questionLabelStyle}>
                Which keynote, panel, or pitch presentation did you find most impactful?
              </span>
              <textarea placeholder="Share the session name and why it stood out to you..." rows={3} value={answers.mostImpactful || ''} onChange={e => updateAnswer('mostImpactful', e.target.value)} style={textareaStyleDynamic} />
            </div>
            <div style={{
            ...fieldGroupStyle,
            marginBottom: 0
          }}>
              <span style={questionLabelStyle}>
                What topics would you like to see covered at next year's Funding Summit?
              </span>
              <textarea placeholder="Suggest themes, sectors, or speakers you'd like to see..." rows={3} value={answers.topicsForNext || ''} onChange={e => updateAnswer('topicsForNext', e.target.value)} style={textareaStyleDynamic} />
            </div>
          </motion.div>;
      case 3:
        return <motion.div initial={{
          opacity: 0,
          x: 20
        }} animate={{
          opacity: 1,
          x: 0
        }} exit={{
          opacity: 0,
          x: -20
        }}>
            <div style={fieldGroupStyle}>
              <span style={questionLabelStyle}>
                Did the summit provide enough dedicated time for one-on-one networking and investor-founder discussions?
              </span>
              <PillOptions options={['Yes', 'Partially', 'No']} value={answers.networkingTime} onChange={v => updateAnswer('networkingTime', v)} isMobile={isMobile} />
            </div>
            <div style={{
            ...fieldGroupStyle,
            marginBottom: 0
          }}>
              <span style={questionLabelStyle}>
                How would you rate the efficiency of the event platform or app used to facilitate investor meetings? (1 = Not effective, 5 = Highly effective)
              </span>
              <RatingBoxes value={answers.platformRating} onChange={v => updateAnswer('platformRating', v)} range={[1, 2, 3, 4, 5]} isMobile={isMobile} />
            </div>
          </motion.div>;
      case 4:
        return <motion.div initial={{
          opacity: 0,
          x: 20
        }} animate={{
          opacity: 1,
          x: 0
        }} exit={{
          opacity: 0,
          x: -20
        }}>
            <div style={fieldGroupStyle}>
              <span style={questionLabelStyle}>
                On a scale of 0–5, how likely are you to recommend this Funding Summit to a peer or colleague? (0 = Not likely, 5 = Highly likely)
              </span>
              <RatingBoxes value={answers.npsScore} onChange={v => updateAnswer('npsScore', v)} range={[0, 1, 2, 3, 4, 5]} isMobile={isMobile} />
            </div>
            <div style={fieldGroupStyle}>
              <span style={questionLabelStyle}>
                Would you attend or participate in this summit again next year?
              </span>
              <PillOptions options={['Yes', 'No']} value={answers.wouldReturn} onChange={v => updateAnswer('wouldReturn', v)} isMobile={isMobile} />
            </div>
            <div style={{
            ...fieldGroupStyle,
            marginBottom: 0
          }}>
              <span style={questionLabelStyle}>
                Any final comments or suggestions for the EmpowaEntrepreneurs Funding Summit team?
              </span>
              <textarea placeholder="Share your thoughts, suggestions, or words of encouragement..." rows={4} value={answers.finalComments || ''} onChange={e => updateAnswer('finalComments', e.target.value)} style={textareaStyleDynamic} />
            </div>
          </motion.div>;
      default:
        return null;
    }
  };
  const cardPadding = isMobile ? '24px 18px 28px' : isTablet ? '28px 28px 32px' : '36px 36px 36px';
  const cardMaxWidth = isMobile ? '100%' : isTablet ? '560px' : '520px';
  const cardBorderRadius = isMobile ? '16px' : '24px';
  const formCardStyleDynamic: React.CSSProperties = {
    background: 'linear-gradient(145deg, #3c4d5d 0%, #2f3f4e 55%, #243040 100%)',
    borderRadius: cardBorderRadius,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
    maxWidth: cardMaxWidth,
    margin: '0 auto',
    boxSizing: 'border-box',
    boxShadow: '0 32px 80px rgba(0,0,0,0.3)'
  };
  const cardContentPaddingDynamic: React.CSSProperties = {
    position: 'relative',
    zIndex: 1,
    padding: cardPadding,
    boxSizing: 'border-box'
  };
  const h2StyleDynamic: React.CSSProperties = {
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: 700,
    fontSize: isMobile ? '16px' : isTablet ? '18px' : '22px',
    color: '#FFFFFF',
    letterSpacing: '-0.4px',
    lineHeight: 1.2,
    margin: '0 0 6px'
  };
  const navButtonsRowStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: isMobile ? 'column-reverse' : 'row',
    gap: isMobile ? '8px' : '12px',
    justifyContent: 'space-between',
    marginTop: isMobile ? '24px' : '28px',
    boxSizing: 'border-box'
  };
  const backBtnStyle: React.CSSProperties = {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.2)',
    color: 'rgba(255,255,255,0.65)',
    padding: isMobile ? '12px 20px' : '12px 24px',
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '13px',
    fontWeight: 500,
    borderRadius: '40px',
    cursor: 'pointer',
    width: isMobile ? '100%' : 'auto',
    justifyContent: 'center',
    boxSizing: 'border-box'
  };
  const nextBtnStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #DE322D, #c42823)',
    color: '#fff',
    padding: isMobile ? '12px 24px' : '12px 32px',
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '13px',
    fontWeight: 600,
    borderRadius: '40px',
    boxShadow: '0 4px 16px rgba(222,50,45,0.4)',
    border: 'none',
    cursor: 'pointer',
    width: isMobile ? '100%' : 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box'
  };
  const cardHeaderMarginBottom = isMobile ? '20px' : '28px';
  if (status === 'success') {
    const checkCircleSize = isMobile ? 64 : 80;
    return <div style={rootWrapperStyle(isMobile, isTablet)}>
        <LeftPanel currentStep={4} isMobile={isMobile} isTablet={isTablet} />
        <div style={rightPanelStyle(isMobile, isTablet)}>
          <motion.div initial={{
          scale: 0.9,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} style={formCardStyleDynamic}>
            <div style={cardAccentBar} />
            <div style={cardRadialGlow} />
            <div style={cardNoise} />
            <div style={{
            ...cardContentPaddingDynamic,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
              <motion.div initial={{
              scale: 0
            }} animate={{
              scale: 1
            }} transition={{
              type: 'spring',
              damping: 12
            }} style={{
              width: `${checkCircleSize}px`,
              height: `${checkCircleSize}px`,
              background: `linear-gradient(135deg, ${PRIMARY_CORAL}, #c42823)`,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px',
              boxShadow: '0 8px 32px rgba(222,50,45,0.3)',
              flexShrink: 0
            }}>
                <Check size={isMobile ? 28 : 36} color="#fff" strokeWidth={3} />
              </motion.div>
              <h2 style={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 700,
              fontSize: isMobile ? '18px' : '22px',
              color: '#FFFFFF',
              margin: '0 0 12px'
            }}>
                Thank You!
              </h2>
              <p style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 300,
              fontSize: isMobile ? '13px' : '14px',
              color: 'rgba(255,255,255,0.65)',
              lineHeight: 1.7,
              maxWidth: '380px',
              boxSizing: 'border-box'
            }}>
                Your feedback has been submitted. It will help us build a stronger, more impactful EmpowaEntrepreneurs Funding Summit in 2027.
              </p>
              <p style={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 300,
              fontStyle: 'italic',
              fontSize: '14px',
              color: PRIMARY_CORAL,
              marginTop: '24px'
            }}>
                Connecting Capital. Creating Ventures. Powering Africa's Entrepreneurial Future.
              </p>
            </div>
          </motion.div>
        </div>
      </div>;
  }
  return <div style={rootWrapperStyle(isMobile, isTablet)}>
      <LeftPanel currentStep={currentStep} isMobile={isMobile} isTablet={isTablet} onStepClick={setCurrentStep} />
      <div style={rightPanelStyle(isMobile, isTablet)}>
        <motion.div layout style={formCardStyleDynamic} initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }}>
          <div style={cardAccentBar} />
          <div style={cardRadialGlow} />
          <div style={cardNoise} />
          <div style={cardContentPaddingDynamic}>
            {status === 'loading' ? (
              <div style={{
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: isMobile ? '32px 12px' : '48px 24px',
                minHeight: '280px',
                boxSizing: 'border-box'
              }}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                  style={{
                    width: isMobile ? 48 : 60,
                    height: isMobile ? 48 : 60,
                    borderRadius: '50%',
                    border: '3px solid rgba(222,50,45,0.1)',
                    borderTop: `3px solid ${PRIMARY_CORAL}`,
                    marginBottom: '28px'
                  }}
                />
                <h3 style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 600,
                  fontSize: isMobile ? '16px' : '18px',
                  color: '#FFFFFF',
                  margin: '0 0 10px',
                  lineHeight: 1.3
                }}>
                  {loadingText}
                </h3>
                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 300,
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.45)',
                  lineHeight: 1.6,
                  maxWidth: '280px',
                  margin: 0
                }}>
                  Please do not close this window while we secure your feedback.
                </p>
              </div>
            ) : (
              <>
                <div style={{
                marginBottom: cardHeaderMarginBottom
              }}>
                  <div style={sectionBadge}>
                    0{currentStep + 1} / 05
                  </div>
                  <h2 style={h2StyleDynamic}>
                    {currentStep === 0 && 'Overall Summit Experience'}
                    {currentStep === 1 && 'About You'}
                    {currentStep === 2 && 'Pitch Sessions & Content'}
                    {currentStep === 3 && 'Networking & Funding Clinics'}
                    {currentStep === 4 && 'Future Engagement'}
                  </h2>
                  <p style={subHeaderStyle}>
                    {currentStep === 0 && 'Share your overall impression of the summit'}
                    {currentStep === 1 && 'Help us tailor the next summit to your profile'}
                    {currentStep === 2 && 'Help us evaluate the quality and relevance of summit content'}
                    {currentStep === 3 && 'Rate the networking and hands-on clinic experience'}
                    {currentStep === 4 && 'Your advocacy helps us grow Africa\'s capital ecosystem'}
                  </p>
                </div>

                {status === 'error' && (
                  <div style={{
                    marginBottom: '20px',
                    padding: '12px 16px',
                    background: 'rgba(222,50,45,0.1)',
                    border: '1px solid rgba(222,50,45,0.2)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '13px',
                    fontFamily: 'Inter, sans-serif',
                    lineHeight: 1.5,
                    boxSizing: 'border-box'
                  }}>
                    <span style={{ color: PRIMARY_CORAL, fontWeight: 700, display: 'block', marginBottom: '4px' }}>Submission Error</span>
                    <span style={{ color: 'rgba(255,255,255,0.8)' }}>{errorMessage}</span>
                  </div>
                )}

                <AnimatePresence mode="wait">
                  <div key={currentStep}>
                    {renderStepContent()}
                  </div>
                </AnimatePresence>

                <div style={navButtonsRowStyle}>
                  {currentStep > 0 && <motion.button whileHover={{
                  scale: 1.04
                }} whileTap={{
                  scale: 0.96
                }} onClick={handleBack} style={backBtnStyle}>
                      BACK
                    </motion.button>}
                  <div style={{
                  flex: isMobile ? 0 : 1
                }} />
                  <motion.button whileHover={{
                  scale: 1.04
                }} whileTap={{
                  scale: 0.97
                }} onClick={handleNext} style={nextBtnStyle}>
                    {currentStep === 4 ? <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                        SUBMIT SURVEY <Check size={16} />
                      </span> : <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                        NEXT SECTION <ArrowRight size={16} />
                      </span>}
                  </motion.button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>;
};
const LeftPanel = ({
  currentStep,
  isMobile,
  isTablet,
  onStepClick
}: {
  currentStep: number;
  isMobile: boolean;
  isTablet: boolean;
  onStepClick?: (idx: number) => void;
}) => {
  return <div style={leftPanelStyle(isMobile, isTablet)}>
      <div style={noiseOverlay} />
      <div style={{
      position: 'relative',
      zIndex: 1,
      width: '100%',
      maxWidth: '480px',
      boxSizing: 'border-box'
    }}>
        <motion.div initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0
      }} style={eyebrowStyle}>
          <PlusSquare size={14} color={PRIMARY_CORAL} />
          <span style={eyebrowTextStyle}>EmpowaEntrepreneurs Funding Summit™</span>
        </motion.div>

        <motion.h1 initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.1
      }} style={h1Style(isMobile, isTablet)}>
          Summit<br />
          <em style={{
          fontStyle: 'italic',
          color: PRIMARY_CORAL,
          fontWeight: 300
        }}>Experience</em><br />
          <span style={{
          color: 'rgba(20,18,16,0.2)',
          fontWeight: 300
        }}>Survey.</span>
        </motion.h1>

        <motion.p initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.2
      }} style={subtitleStyle(isMobile)}>
          Help us measure impact, elevate future editions, and build a stronger capital ecosystem for Africa's entrepreneurs.
        </motion.p>

        <motion.div initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.3
      }} style={{
        marginTop: '40px'
      }}>
          <div style={progressLabelStyle}>SECTION {currentStep + 1} OF 5</div>
          <div style={progressBarOuter(isMobile)}>
            <div style={progressBarInner((currentStep + 1) / 5)} />
          </div>
          <div style={stepDotsRow}>
            {Array.from({
            length: 5
          }).map((_, i) => <div key={i} style={stepDotStyle(i === currentStep, i < currentStep)} />)}
          </div>
        </motion.div>

        <div style={sectionsListStyle}>
          {SECTIONS.map((name, i) => <motion.div key={name} whileHover={{
          scale: 1.02
        }} whileTap={{
          scale: 0.98
        }} onClick={() => onStepClick?.(i)} style={sectionPillStyle(i === currentStep, i < currentStep, isMobile)}>
              {name.toUpperCase()}
            </motion.div>)}
        </div>
      </div>
    </div>;
};

// --- STYLES ---

const rootWrapperStyle = (isMobile: boolean, isTablet: boolean): React.CSSProperties => ({
  display: isMobile || isTablet ? 'block' : 'flex',
  flexDirection: 'row',
  alignItems: 'stretch',
  minHeight: isMobile || isTablet ? 'auto' : 'calc(100vh - 88px)',
  paddingTop: '88px', // Spacer for StickyNav
  width: '100%',
  overflowX: 'hidden',
  background: WARM_PARCHMENT,
  boxSizing: 'border-box'
});
const leftPanelStyle = (isMobile: boolean, isTablet: boolean): React.CSSProperties => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  padding: isMobile ? '48px 20px 32px' : isTablet ? '64px 40px 48px' : '80px 64px',
  background: WARM_PARCHMENT,
  position: 'relative',
  overflow: 'hidden',
  boxSizing: 'border-box'
});
const noiseOverlay: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  backgroundImage: NOISE_SVG,
  backgroundRepeat: 'repeat',
  backgroundSize: '128px',
  opacity: 0.4,
  pointerEvents: 'none'
};
const eyebrowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  marginBottom: '20px'
};
const eyebrowTextStyle: React.CSSProperties = {
  fontFamily: 'Montserrat, sans-serif',
  fontSize: '11px',
  textTransform: 'uppercase',
  letterSpacing: '0.18em',
  color: 'rgba(20,18,16,0.4)'
};
const h1Style = (isMobile: boolean, isTablet: boolean): React.CSSProperties => ({
  fontFamily: 'Montserrat, sans-serif',
  fontWeight: 200,
  fontSize: isMobile ? 'clamp(28px, 8vw, 40px)' : isTablet ? 'clamp(30px, 5vw, 48px)' : 'clamp(32px, 5vw, 64px)',
  letterSpacing: isMobile ? '-1px' : isTablet ? '-2px' : '-3px',
  lineHeight: 0.93,
  color: '#141210',
  margin: '0 0 24px'
});
const subtitleStyle = (isMobile: boolean): React.CSSProperties => ({
  fontFamily: 'Inter, sans-serif',
  fontWeight: 300,
  fontSize: isMobile ? '14px' : '15px',
  lineHeight: 1.78,
  color: 'rgba(20,18,16,0.55)',
  maxWidth: isMobile ? '100%' : '320px',
  margin: '0 auto 40px'
});
const progressLabelStyle: React.CSSProperties = {
  fontFamily: 'Montserrat, sans-serif',
  fontSize: '11px',
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  color: 'rgba(20,18,16,0.35)',
  marginBottom: '12px'
};
const progressBarOuter = (isMobile: boolean): React.CSSProperties => ({
  width: isMobile ? '100%' : '180px',
  height: '4px',
  background: 'rgba(20,18,16,0.1)',
  borderRadius: '100px',
  margin: '0 auto 8px',
  overflow: 'hidden',
  boxSizing: 'border-box'
});
const progressBarInner = (progress: number): React.CSSProperties => ({
  width: `${progress * 100}%`,
  height: '100%',
  background: 'linear-gradient(90deg, #DE322D, #ff7a70)',
  borderRadius: '100px',
  transition: 'width 0.4s ease'
});
const stepDotsRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  gap: '6px',
  marginTop: '16px',
  alignItems: 'center'
};
const stepDotStyle = (active: boolean, completed: boolean): React.CSSProperties => {
  if (completed) {
    return {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      background: '#DE322D',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    };
  }
  return {
    width: active ? '8px' : '6px',
    height: active ? '8px' : '6px',
    borderRadius: '50%',
    background: active ? PRIMARY_CORAL : 'rgba(20,18,16,0.2)',
    transition: 'all 0.3s ease',
    flexShrink: 0
  };
};
const sectionsListStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: '8px',
  marginTop: '32px',
  alignItems: 'center',
  justifyContent: 'center'
};
const sectionPillStyle = (active: boolean, completed: boolean, isMobile: boolean): React.CSSProperties => ({
  padding: '6px 16px',
  borderRadius: '100px',
  fontFamily: 'Montserrat, sans-serif',
  fontSize: isMobile ? '10px' : '11px',
  fontWeight: 600,
  letterSpacing: '0.04em',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  background: active ? '#DE322D' : completed ? 'rgba(222,50,45,0.1)' : 'rgba(20,18,16,0.06)',
  color: active ? '#fff' : completed ? '#DE322D' : 'rgba(20,18,16,0.4)',
  boxSizing: 'border-box'
});
const rightPanelStyle = (isMobile: boolean, isTablet: boolean): React.CSSProperties => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: isMobile ? '0 16px 48px' : isTablet ? '40px 32px 64px' : '80px 56px',
  background: 'transparent',
  boxSizing: 'border-box'
});
const cardAccentBar: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: '3px',
  background: 'linear-gradient(90deg, #DE322D, transparent)',
  zIndex: 1
};
const cardRadialGlow: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '300px',
  height: '300px',
  borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 65%)',
  pointerEvents: 'none',
  zIndex: 0
};
const cardNoise: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  backgroundImage: NOISE_SVG,
  opacity: 0.3,
  pointerEvents: 'none',
  zIndex: 0
};
const sectionBadge: React.CSSProperties = {
  display: 'inline-flex',
  background: 'rgba(222,50,45,0.2)',
  border: '1px solid rgba(222,50,45,0.3)',
  borderRadius: '100px',
  padding: '3px 12px',
  fontFamily: 'Montserrat, sans-serif',
  fontSize: '10px',
  color: '#DE322D',
  fontWeight: 700,
  letterSpacing: '0.1em',
  marginBottom: '12px'
};
const subHeaderStyle: React.CSSProperties = {
  fontFamily: 'Inter, sans-serif',
  fontWeight: 300,
  fontSize: '13px',
  color: 'rgba(255,255,255,0.5)',
  lineHeight: 1.6,
  margin: 0
};
