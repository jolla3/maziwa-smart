    // /src/pages/LandingPage/theme.js
    import { createTheme } from '@mui/material';

    const theme = createTheme({
      palette: {
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
          '@media (max-width:900px)': {
            fontSize: '2.5rem',
          },
        },
        h2: {
          fontSize: '2.75rem',
          fontWeight: 800,
          lineHeight: 1.2,
          '@media (max-width:900px)': {
            fontSize: '2rem',
          },
        },
        h4: {
          fontSize: '1.5rem',
          fontWeight: 700,
          lineHeight: 1.3,
          '@media (max-width:900px)': {
            fontSize: '1.25rem',
          },
        },
        h5: {
          fontSize: '1.25rem',
          fontWeight: 400,
          lineHeight: 1.7,
          '@media (max-width:900px)': {
            fontSize: '1.1rem',
          },
        },
        h6: {
          fontSize: '1rem',
          fontWeight: 400,
          lineHeight: 1.6,
        },
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: 'none',
              borderRadius: 8,
              fontWeight: 600,
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 16,
            },
          },
        },
      },
    });

    export default theme;