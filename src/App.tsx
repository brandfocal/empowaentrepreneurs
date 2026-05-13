import { useMemo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Container, Theme } from './settings/types';
import { AgencyLandingPage } from './components/generated/AgencyLandingPage';
import { AboutUsPage } from './components/generated/AboutUsPage';
import { ProgrammePage } from './components/generated/ProgrammePage';
import { ExperienceZonesPage } from './components/generated/ExperienceZones';

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
        <Routes>
          <Route path="/" element={<AgencyLandingPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/programme" element={<ProgrammePage />} />
          <Route path="/experience-zones" element={<ExperienceZonesPage />} />
        </Routes>
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