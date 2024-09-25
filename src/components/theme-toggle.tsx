// src/components/ThemeToggle.tsx
'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid' // Correct import path for Heroicons v2

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => typeof window !== 'undefined' ? (localStorage.theme || 'light') : 'light')

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <Button onClick={toggleTheme} className="p-2">
      {theme === 'light' ? (
        <MoonIcon className="h-5 w-5" /> // Black icon for light mode
      ) : (
        <SunIcon className="h-5 w-5" /> // Yellow icon for dark mode
      )}
    </Button>
  )
}
