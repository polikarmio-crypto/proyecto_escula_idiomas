'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export default function ThemeToggle({ className = '', showLabel = false }: ThemeToggleProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const getCurrentTheme = (): 'light' | 'dark' => {
      try {
        const saved = localStorage.getItem('eie_theme');
        if (saved === 'light' || saved === 'dark') {
          return saved;
        }
        if (document.documentElement.classList.contains('dark')) {
          return 'dark';
        }
        const dataTheme = document.documentElement.getAttribute('data-theme');
        if (dataTheme === 'light' || dataTheme === 'dark') {
          return dataTheme;
        }
      } catch (e) {}
      return 'dark';
    };

    setTheme(getCurrentTheme());

    const handleThemeSync = () => {
      setTheme(getCurrentTheme());
    };

    window.addEventListener('eie_theme_change', handleThemeSync);
    window.addEventListener('storage', handleThemeSync);
    return () => {
      window.removeEventListener('eie_theme_change', handleThemeSync);
      window.removeEventListener('storage', handleThemeSync);
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);

    try {
      localStorage.setItem('eie_theme', nextTheme);
      document.documentElement.setAttribute('data-theme', nextTheme);
      if (nextTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      window.dispatchEvent(new CustomEvent('eie_theme_change', { detail: nextTheme }));
    } catch (e) {}
  };

  if (!mounted) {
    return (
      <button
        type="button"
        className={`inline-flex items-center justify-center p-1.5 border border-[#242B27] bg-[#121614] text-zinc-400 opacity-60 ${className}`}
        aria-label="Cargando tema..."
      >
        <Moon className="w-3.5 h-3.5" />
      </button>
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-mono font-bold transition-all border ${
        isDark
          ? 'bg-[#121614] hover:bg-[#181E1B] text-[#F59E0B] border-[#242B27] hover:border-[#F59E0B]/60 shadow-[0_0_10px_rgba(245,158,11,0.1)]'
          : 'bg-[#FFFFFF] hover:bg-[#EAE8E1] text-[#D97706] border-[#D4D4D0] hover:border-[#D97706]/70 shadow-xs'
      } ${className}`}
      title={isDark ? 'Cambiar a Modo Claro (Archivo Técnico)' : 'Cambiar a Modo Oscuro (Consola Táctica)'}
      aria-label="Alternar modo claro u oscuro"
    >
      {isDark ? (
        <Sun className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
      ) : (
        <Moon className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
      )}
      {showLabel && (
        <span className="uppercase text-[10px] tracking-wider">
          {isDark ? 'MODO CLARO' : 'MODO OSCURO'}
        </span>
      )}
    </button>
  );
}
