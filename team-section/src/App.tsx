import { Theme } from './settings/types';
import { LeadershipTeamSection } from './components/generated/LeadershipTeamSection';

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

  return <LeadershipTeamSection />;
}

export default App;
