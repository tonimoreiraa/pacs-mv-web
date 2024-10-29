import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app.tsx'
import './globals.css'
import { ThemeProvider } from './contexts/theme-context.tsx'
import { QueryClientProvider } from 'react-query'
import { queryClient } from './contexts/query.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme='dark'>
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
)
