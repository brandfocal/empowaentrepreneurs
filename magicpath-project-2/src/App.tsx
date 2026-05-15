import { Theme } from './settings/types';
import { StrategicAdvisoryPage } from './components/generated/StrategicAdvisoryPage';

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

  return <StrategicAdvisoryPage />;
}

export default App;
