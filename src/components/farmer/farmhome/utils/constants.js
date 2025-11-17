// farmhome/utils/constants.js

export const API_BASE_URL =     process.env.REACT_APP_API_BASE
export const REFRESH_INTERVAL = 300000; // 5 minutes
export const CACHE_KEY = 'farmerDashboardData';

export const COLORS = {
  aqua: {
    main: '#00bcd4',
    light: '#62efff',
    dark: '#008ba3',
  },
  green: {
    main: '#10b981',
    light: '#34d399',
    dark: '#059669',
  },
  red: {
    main: '#ef4444',
  },
  blue: {
    main: '#3b82f6',
  },
  orange: {
    main: '#f59e0b',
  },
  purple: {
    main: '#8b5cf6',
  },
};

export const APP_TEXT = {
  welcome: 'Welcome back',
  subtitle: 'Monitor your farm digitally, trade livestock, and grow smarter with MaziwaSmart.',
  services: {
    title: 'MaziwaSmart Services',
    subtitle: 'Farm Data & Analytics | Milk Tracking | Health Monitoring | Breeding | Smart Management',
  },
};