import TaskCenter from './components/TaskCenter';
import { TaskCenterProvider } from './state/TaskCenterContext';
import { ThemeProvider } from './state/ThemeContext';

const App = () => (
  <ThemeProvider>
    <TaskCenterProvider>
      <TaskCenter />
    </TaskCenterProvider>
  </ThemeProvider>
);

export default App;
