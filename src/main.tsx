import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { router } from './routes/index.tsx'
import './index.css'
import { ThemeProvider } from './providers/theme.provider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* defaultTheme="dark" storageKey="vite-ui-theme" */}
    <ThemeProvider defaultTheme='system' storageKey='vite-ui-theme'>
      <RouterProvider router={router}>
      </RouterProvider>
    </ThemeProvider>
  </StrictMode>,
)
