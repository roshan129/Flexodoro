import { createBrowserRouter } from 'react-router';
import { LandingPage } from './components/LandingPage';
import { AppLayout } from './components/AppLayout';
import { TimerScreen } from './components/TimerScreen';
import { StatsPage } from './components/StatsPage';

export const router = createBrowserRouter([
  { path: '/', Component: LandingPage },
  {
    path: '/app',
    Component: AppLayout,
    children: [
      { index: true, Component: TimerScreen },
      { path: 'stats', Component: StatsPage },
    ],
  },
]);
