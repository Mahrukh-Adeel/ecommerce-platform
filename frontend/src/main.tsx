import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from "react-router-dom";
import App from './App.tsx'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#FEEFE5', 
      paper: '#FFFFFF',
    },
    primary: {
      main: '#4E2A1E', 
    },
    secondary: {
      main: '#8A9A5B', 
    },
    text: {
      primary: '#4c525cff', 
      secondary: '#4E2A1E', 
    },
    error: {
      main: '#d32f2f',
      light: '#ffcdd2',
      dark: '#c62828',
      contrastText: '#fff',
    },
    warning: {
      main: '#D97706', 
    },
    info: {
      main: '#546a76', 
    },
    success: {
      main: '#2e7d32',
      light: '#c8e6c9',
      dark: '#1b5e20',
      contrastText: '#fff',
    },

  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#FEEFE5', 
        },
      },
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
