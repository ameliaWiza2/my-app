import TaskCenter from './components/TaskCenter';
import { TaskCenterProvider } from './state/TaskCenterContext';

const App = () => (
  <TaskCenterProvider>
    <TaskCenter />
  </TaskCenterProvider>
);

export default App;
