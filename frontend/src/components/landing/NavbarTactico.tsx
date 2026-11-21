'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';
import {
  Shield,
  Menu,
  X,
  ChevronRight,
  Terminal,
  Activity,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export default function NavbarTactico() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [horaBolivia, setHoraBolivia] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const actualizarReloj = () => {
      const ahora = new Date();
      setHoraBolivia(
        ahora.toLocaleTimeString('es-BO', {
          timeZone: 'America/La_Paz',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    actualizarReloj();
    const interval = setInterval(actualizarReloj, 1000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { href: '#mision-vision', label: '01 // MISIÓN', text: 'Misión & Visión' },
    { href: '#sedes', label: '02 // SEDES', text: 'Sedes y Filiales' },
    { href: '#oferta-academica', label: '03 // IDIOMAS', text: 'Oferta Académica' },
    { href: '#inscripciones', label: '04 // MATRÍCULA', text: 'Inscripción Digital' },
    { href: '#correo-institucional', label: '05 // CORREO', text: 'Correo Oficial' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-[#F4F3EF]/95 dark:bg-[#0A0C0B]/95 backdrop-blur-md border-b border-[#D4D4D0] dark:border-[#242B27] shadow-md dark:shadow-xl'
          : 'bg-[#F4F3EF]/85 dark:bg-[#0A0C0B]/80 backdrop-blur-sm border-b border-[#D4D4D0]/80 dark:border-[#242B27]/70'
      }`}
    >
      {/* Franja Tricolor Institucional */}
      <div className="h-[2px] w-full bg-gradient-to-r from-[#dc2626] via-[#f59e0b] to-[#15803d]" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo e Identidad */}
          <Link href="#inicio" className="flex items-center gap-3 group shrink-0">
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 bg-white dark:bg-[#121614] border border-[#D4D4D0] dark:border-[#242B27] group-hover:border-[#D97706] dark:group-hover:border-[#F59E0B]/60 p-1.5 transition-all">
              <div className="absolute -top-0.5 -left-0.5 w-1.5 h-1.5 border-t border-l border-[#D97706] dark:border-[#F59E0B]" />
              <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 border-b border-r border-[#D97706] dark:border-[#F59E0B]" />
              <img
                src="/images/logos/logo-eie.png"
                alt="Escudo Oficial EIE"
                className="w-full h-full object-contain filter drop-shadow"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-[#D97706] dark:text-[#F59E0B] font-semibold uppercase">
                  CEDMIL • EJÉRCITO DE BOLIVIA
                </span>
                <span className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.2 bg-[#1B3B2B]/10 dark:bg-[#4D6B53]/20 border border-[#1B3B2B]/30 dark:border-[#4D6B53]/40 text-[#1B3B2B] dark:text-[#74c69d] text-[9px] font-mono font-bold">
                  STANAG 6001
                </span>
              </div>
              <span className="text-xs sm:text-sm lg:text-base font-black tracking-tight text-zinc-950 dark:text-white font-display uppercase">
                Escuela de Idiomas del Ejército
              </span>
              <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono font-medium hidden sm:block">
                Sede Central Miraflores • La Paz, Bolivia
              </span>
            </div>
          </Link>

          {/* Menú de Navegación Táctico (Desktop) */}
          <nav className="hidden xl:flex items-center gap-1 2xl:gap-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-2.5 py-1.5 text-[11px] font-mono font-medium text-zinc-800 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-[#EAE8E1] dark:hover:bg-[#121614] border border-transparent hover:border-[#D4D4D0] dark:hover:border-[#242B27] transition-all flex flex-col items-start group"
              >
                <span className="text-[9px] text-[#D97706] dark:text-[#F59E0B] group-hover:text-[#B45309] dark:group-hover:text-[#F59E0B] tracking-wider font-bold">
                  {link.label.split(' // ')[0]}
                </span>
                <span className="tracking-tight text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-950 dark:group-hover:text-white font-bold">
                  {link.text}
                </span>
              </a>
            ))}
          </nav>

          {/* Telemetría, Toggle de Tema y Botón de Acceso */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Ticker de Telemetría */}
            <div className="hidden lg:flex flex-col items-end px-3 py-1 bg-white dark:bg-[#121614] border border-[#D4D4D0] dark:border-[#242B27] font-mono text-[10px]">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider">SYS: ONLINE</span>
              </div>
              <span className="text-zinc-700 dark:text-zinc-400 tabular-nums font-semibold">BOT: {horaBolivia || '12:00:00'}</span>
            </div>

            {/* Componente ThemeToggle */}
            <ThemeToggle showLabel={false} />

            {/* Botón de Acceso al Login */}
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 bg-[#F59E0B] hover:bg-[#D97706] text-zinc-950 font-mono font-black text-xs uppercase tracking-wider transition-all shadow-xs dark:shadow-[0_0_15px_rgba(245,158,11,0.25)] hover:shadow dark:hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]"
            >
              <Terminal className="w-3.5 h-3.5 text-zinc-950" />
              <span className="text-zinc-950 font-black">Acceso SACA</span>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-950" />
            </Link>

            {/* Toggle Menú Móvil */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 bg-white dark:bg-[#121614] border border-[#D4D4D0] dark:border-[#242B27] text-zinc-800 dark:text-white hover:border-[#D97706] dark:hover:border-[#F59E0B]/50 transition"
              aria-label="Abrir Menú"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#D97706] dark:text-[#F59E0B]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú Móvil Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-[#D4D4D0] dark:border-[#242B27] bg-[#F4F3EF]/98 dark:bg-[#0A0C0B]/98 px-4 py-4 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#D4D4D0] dark:border-[#242B27] text-zinc-500 dark:text-zinc-400 text-[11px]">
            <span className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              SISTEMA OPERATIVO II-2026
            </span>
            <span className="text-[#D97706] dark:text-[#F59E0B]">{horaBolivia}</span>
          </div>

          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 bg-white dark:bg-[#121614] border border-[#D4D4D0] dark:border-[#242B27] hover:border-[#D97706] dark:hover:border-[#F59E0B] text-zinc-900 dark:text-zinc-100 hover:text-black dark:hover:text-white flex items-center justify-between transition"
              >
                <div>
                  <span className="text-[10px] text-[#D97706] dark:text-[#F59E0B] font-bold block">{link.label}</span>
                  <span className="font-sans font-bold text-sm text-zinc-950 dark:text-white">{link.text}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />
              </a>
            ))}
          </div>

          <div className="pt-2 flex items-center gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 py-3 bg-[#F59E0B] hover:bg-[#D97706] text-zinc-950 font-black text-center block uppercase tracking-wider"
            >
              Iniciar Sesión en SACA
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}