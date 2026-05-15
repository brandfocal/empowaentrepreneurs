import { Theme } from './settings/types';
import { FundingSummitPage } from './components/generated/FundingSummitPage';

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

  return <FundingSummitPage />;
}

export default App;
