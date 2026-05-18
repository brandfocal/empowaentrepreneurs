import React, { lazy, Suspense, useMemo } from 'react';

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }
  componentDidCatch(error: any, errorInfo: any) {
    console.error('Caught error:', error, errorInfo);
    if (error.name === 'ChunkLoadError' || (error.message && error.message.includes('dynamically imported module'))) {
      window.location.reload();
    }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center', color: '#fff', background: '#0A0906', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <h2>A new version of this page is available.</h2>
          <button onClick={() => window.location.reload()} style={{ padding: '10px 20px', background: '#DE322D', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer', marginTop: '20px' }}>Reload Page</button>
        </div>
      );
    }
    return this.props.children;
  }
}

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Container, Theme } from './settings/types';
import { UniversalLayout } from './components/layout/UniversalLayout';

const AgencyLandingPage = lazy(() => import('./components/generated/AgencyLandingPage').then(module => ({ default: module.AgencyLandingPage })));
const AboutUsPage = lazy(() => import('./components/generated/AboutUsPage').then(module => ({ default: module.AboutUsPage })));
const ProgrammePage = lazy(() => import('./components/generated/ProgrammePage').then(module => ({ default: module.ProgrammePage })));
const ExperienceZonesPage = lazy(() => import('./components/generated/ExperienceZones').then(module => ({ default: module.ExperienceZonesPage })));
const PartnershipsPage = lazy(() => import('./components/generated/PartnershipsPage').then(module => ({ default: module.PartnershipsPage })));
const ApplyToAttendPage = lazy(() => import('./components/generated/ApplyToAttendPage').then(module => ({ default: module.ApplyToAttendPage })));
const ContactPage = lazy(() => import('./components/generated/ContactPage').then(module => ({ default: module.ContactPage })));
const PitchingFestivalPage = lazy(() => import('./components/generated/PitchingFestivalPage').then(module => ({ default: module.PitchingFestivalPage })));
const StrategicAdvisoryPage = lazy(() => import('./components/generated/StrategicAdvisoryPage').then(module => ({ default: module.StrategicAdvisoryPage })));
const FundingAwardsPage = lazy(() => import('./components/generated/FundingAwardsPage').then(module => ({ default: module.FundingAwardsPage })));
const FundingSummitPage = lazy(() => import('./components/generated/FundingSummitPage').then(module => ({ default: module.FundingSummitPage })));
const DetailedRegistrationPage = lazy(() => import('./components/generated/DetailedRegistrationPage').then(module => ({ default: module.DetailedRegistrationPage })));

let theme: Theme = 'light';
let container: Container = 'none';

function App() {
  function setTheme(theme: Theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  setTheme(theme);

  const generatedComponent = useMemo(() => {
    return (
      <BrowserRouter>
        <UniversalLayout>
          <ErrorBoundary><Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0a1520', color: '#fff', fontFamily: 'Inter, sans-serif' }}>Loading...</div>}>
            <Routes>
              <Route path="/" element={<AgencyLandingPage />} />
              <Route path="/about" element={<AboutUsPage />} />
              <Route path="/programme" element={<ProgrammePage />} />
              <Route path="/experience-zones" element={<ExperienceZonesPage />} />
              <Route path="/partnerships" element={<PartnershipsPage />} />
              <Route path="/apply" element={<ApplyToAttendPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/pitch-power" element={<PitchingFestivalPage />} />
              <Route path="/strategic-advisory" element={<StrategicAdvisoryPage />} />
              <Route path="/awards" element={<FundingAwardsPage />} />
              <Route path="/summit" element={<FundingSummitPage />} />
              <Route path="/detailed-registration-2026" element={<DetailedRegistrationPage />} />
            </Routes>
          </Suspense></ErrorBoundary>
        </UniversalLayout>
      </BrowserRouter>
    ); // %EXPORT_STATEMENT%
  }, []);

  if (container === 'centered') {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center">
        {generatedComponent}
      </div>
    );
  } else {
    return generatedComponent;
  }
}

export default App;
