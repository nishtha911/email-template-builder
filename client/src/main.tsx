import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { CustomThemeProvider, useCustomTheme } from './context/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});

// Inner component so we can read ThemeContext to build MUI theme dynamically
function ThemedApp() {
  const { mode } = useCustomTheme();

  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: '#4f46e5',
        light: '#818cf8',
        dark: '#3730a3',
      },
      secondary: {
        main: '#6366f1',
      },
      background: {
        default: mode === 'dark' ? '#0f172a' : '#f8fafc',
        paper: mode === 'dark' ? '#1e293b' : '#ffffff',
      },
      text: {
        primary: mode === 'dark' ? '#f1f5f9' : '#1a1a2e',
        secondary: mode === 'dark' ? '#94a3b8' : '#64748b',
      },
      divider: mode === 'dark' ? 'rgba(148,163,184,0.12)' : 'rgba(79,70,229,0.1)',
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundImage: 'none',
            backgroundColor: mode === 'dark' ? '#1e293b' : '#ffffff',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: mode === 'dark' ? 'rgba(148,163,184,0.2)' : 'rgba(79,70,229,0.15)',
              },
              '&:hover fieldset': {
                borderColor: mode === 'dark' ? 'rgba(148,163,184,0.4)' : 'rgba(79,70,229,0.3)',
              },
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <CustomThemeProvider>
      <ThemedApp />
    </CustomThemeProvider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
)