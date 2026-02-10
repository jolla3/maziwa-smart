import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',  // Added for light/dark mode support (ties into Topbar toggle)
    primary: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    secondary: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
    },
    background: {
      default: '#ffffff',
      paper: '#fafafa',
    },
    text: {
      primary: '#0f172a',
      secondary: '#64748b',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3.75rem',
      fontWeight: 800,
      lineHeight: 1.1,
      '@media (max-width:900px)': {  // Use media queries to avoid self-reference
        fontSize: '2.5rem',
      },
      '@media (max-width:600px)': {
        fontSize: '2rem',
      },
    },
    h2: {
      fontSize: '2.75rem',
      fontWeight: 800,
      lineHeight: 1.2,
      '@media (max-width:900px)': {
        fontSize: '2rem',
      },
      '@media (max-width:600px)': {
        fontSize: '1.75rem',
      },
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 700,
      lineHeight: 1.3,
      '@media (max-width:900px)': {
        fontSize: '1.25rem',
      },
      '@media (max-width:600px)': {
        fontSize: '1.1rem',
      },
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 400,
      lineHeight: 1.7,
      '@media (max-width:900px)': {
        fontSize: '1.1rem',
      },
      '@media (max-width:600px)': {
        fontSize: '1rem',
      },
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.6,
      '@media (max-width:600px)': {
        fontSize: '0.9rem',
      },
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({  // Use theme parameter to safely access breakpoints
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600,
          [theme.breakpoints.down('sm')]: {
            borderRadius: 6,
            fontSize: '0.9rem',
          },
        }),
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 16,
          [theme.breakpoints.down('sm')]: {
            borderRadius: 12,
          },
        }),
      },
    },
    MuiGrid: {
      styleOverrides: {
        root: {
          // Ensures Grid items are responsive without deprecated props
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

export default theme;