import { Theme } from './settings/types';
import { FundingSummitSurvey } from './components/generated/FundingSummitSurvey';

let theme: Theme = 'light';

function App() {
  function setTheme(theme: Theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  setTheme(theme);

  return <FundingSummitSurvey />;
}

export default App;
