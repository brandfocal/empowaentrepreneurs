import { useMemo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Container, Theme } from './settings/types';
import { AgencyLandingPage } from './components/generated/AgencyLandingPage';
import { AboutUsPage } from './components/generated/AboutUsPage';
import { ProgrammePage } from './components/generated/ProgrammePage';
import { ExperienceZonesPage } from './components/generated/ExperienceZones';
import { PartnershipsPage } from './components/generated/PartnershipsPage';
import { ApplyToAttendPage } from './components/generated/ApplyToAttendPage';
import { ContactPage } from './components/generated/ContactPage';
import { PitchingFestivalPage } from './components/generated/PitchingFestivalPage';
import { StrategicAdvisoryPage } from './components/generated/StrategicAdvisoryPage';
import { FundingAwardsPage } from './components/generated/FundingAwardsPage';
import { FundingSummitPage } from './components/generated/FundingSummitPage';
import { DetailedRegistrationPage } from './components/generated/DetailedRegistrationPage';
import { UniversalLayout } from './components/layout/UniversalLayout';

let theme: Theme = 'light';
// only use 'centered' container for standalone components, never for full page apps or websites.
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
    // THIS IS WHERE THE TOP LEVEL GENRATED COMPONENT WILL BE RETURNED!
    return (
      <BrowserRouter>
        <UniversalLayout>
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