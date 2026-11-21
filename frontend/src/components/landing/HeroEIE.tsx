'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  Shield,
  Award,
  Terminal,
  MapPin,
  Clock,
  Compass,
  ArrowRight,
  Sparkles,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';

interface Slide {
  id: number;
  codigo: string;
  titulo: string;
  subtitulo: string;
  imagen: string;
  categoria: string;
  metrica: string;
  metricaLabel: string;
  ctaText: string;
  ctaHref: string;
}

const CAROUSEL_SLIDES: Slide[] = [
  {
    id: 1,
    codigo: 'ALC-STANAG-6001',
    categoria: '01 // PROGRAMA DE PRECISIÓN',
    titulo: 'American Language Course (ALC) — Inglés Militar y Técnico',
    subtitulo:
      'Capacitación integral bajo normas internacionales STANAG 6001. Formación especializada de 36 libros secuenciales con laboratorios de audio y catedráticos certificados.',
    imagen: '/images/carousel/inscripciones-banner.jpg',
    metrica: '36 LIBROS',
    metricaLabel: 'Currícula Continua',
    ctaText: 'Pre-Inscripción Digital',
    ctaHref: '#inscripciones',
  },
  {
    id: 2,
    codigo: 'ROTPED-15D-CEDMIL',
    categoria: '02 // DOCTRINA PEDAGÓGICA',
    titulo: 'Cuerpo Docente de Élite con Rotación Cada 15 Días',
    subtitulo:
      'Sistema de relevo metodológico periódico que garantiza rápida adaptación a acentos internacionales y desarrollo de fluidez auditiva táctica en operaciones multilaterales.',
    imagen: '/images/carousel/docentes-calificados.jpg',
    metrica: '15 DÍAS',
    metricaLabel: 'Ciclo de Relevo',
    ctaText: 'Ver Doctrina Académica',
    ctaHref: '#mision-vision',
  },
  {
    id: 3,
    codigo: 'SEDE-CENTRAL-LPZ',
    categoria: '03 // INFRAESTRUCTURA TÁCTICA',
    titulo: 'Sede Central Miraflores — Cuartel General del Ejército',
    subtitulo:
      'Aulas climatizadas, laboratorios fonéticos multimedia y biblioteca de consulta lingüística en el corazón administrativo de las Fuerzas Armadas en La Paz.',
    imagen: '/images/carousel/fachada-escuela.jpg',
    metrica: '9 SEDES',
    metricaLabel: 'Cobertura Nacional',
    ctaText: 'Explorar Red de Sedes',
    ctaHref: '#sedes',
  },
  {
    id: 4,
    codigo: 'GRAD-TSUP-DIPLOMA',
    categoria: '04 // ACREDITACIÓN OFICIAL',
    titulo: 'Titulaciones de Técnico Superior en Provisión Nacional',
    subtitulo:
      'Certificación ministerial y militar con reconocimiento en misiones de paz de la ONU, comisiones diplomáticas y ejercicio profesional de alto nivel.',
    imagen: '/images/carousel/ceremonia-academica.jpg',
    metrica: 'STANAG 4',
    metricaLabel: 'Nivel Máximo',
    ctaText: 'Consultar Credencial',
    ctaHref: '#correo-institucional',
  },
  {
    id: 5,
    codigo: 'FILIAL-CBB-DESPLIEGUE',
    categoria: '05 // DESPLIEGUE TERRITORIAL',
    titulo: 'Filial Cochabamba y Presencia en los 9 Departamentos',
    subtitulo:
      'Desde la cordillera hasta la Amazonía: Guarniciones militares de La Paz, El Alto, Viacha, Achacachi, Cochabamba, Santa Cruz, Tarija, Uncía y Riberalta.',
    imagen: '/images/carousel/filial-cochabamba.jpg',
    metrica: '100% ACTIVO',
    metricaLabel: 'Régimen Operativo',
    ctaText: 'Ver Filiales del País',
    ctaHref: '#sedes',
  },
];

const GLYPHS = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789//--_#';

export default function HeroEIE() {
  const [current, setCurrent] = useState(0);
  const [scrambledCode, setScrambledCode] = useState('EIE-CEDMIL-STANAG6001');
  const [scrambledDivision, setScrambledDivision] = useState('EIE-LPZ // DIVISIÓN ACADÉMICA');
  const [ctaText, setCtaText] = useState('[ Pre-Inscripción Digital ]');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const divisionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const ctaTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Decodificación de caracteres para código del slide
  const scramble = (targetText: string) => {
    let iteration = 0;
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setScrambledCode(
        targetText
          .split('')
          .map((char, index) => {
            if (index < iteration) return targetText[index];
            if (char === '-' || char === '/' || char === ' ') return char;
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join('')
      );

      if (iteration >= targetText.length) {
        if (timerRef.current) clearInterval(timerRef.current);
      }
      iteration += 1 / 2;
    }, 28);
  };

  // Scramble en badge de División Académica
  const scrambleDivision = () => {
    const target = 'EIE-LPZ // DIVISIÓN ACADÉMICA';
    let iteration = 0;
    if (divisionTimerRef.current) clearInterval(divisionTimerRef.current);

    divisionTimerRef.current = setInterval(() => {
      setScrambledDivision(
        target
          .split('')
          .map((char, index) => {
            if (index < iteration) return target[index];
            if (char === '-' || char === '/' || char === ' ') return char;
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join('')
      );

      if (iteration >= target.length) {
        if (divisionTimerRef.current) clearInterval(divisionTimerRef.current);
      }
      iteration += 1 / 2;
    }, 25);
  };

  // Scramble en botón CTA
  const scrambleCta = () => {
    const target = '[ Pre-Inscripción Digital ]';
    let iteration = 0;
    if (ctaTimerRef.current) clearInterval(ctaTimerRef.current);

    ctaTimerRef.current = setInterval(() => {
      setCtaText(
        target
          .split('')
          .map((char, index) => {
            if (index < iteration) return target[index];
            if (char === '[' || char === ']' || char === '-' || char === ' ') return char;
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join('')
      );

      if (iteration >= target.length) {
        if (ctaTimerRef.current) clearInterval(ctaTimerRef.current);
      }
      iteration += 1 / 2;
    }, 22);
  };

  useEffect(() => {
    scramble(CAROUSEL_SLIDES[current].codigo);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [current]);

  useEffect(() => {
    scrambleDivision();
    return () => {
      if (divisionTimerRef.current) clearInterval(divisionTimerRef.current);
      if (ctaTimerRef.current) clearInterval(ctaTimerRef.current);
    };
  }, []);

  // Rotación automática cada 7.5 segundos
  useEffect(() => {
    const autoPlay = setInterval(() => {
      setCurrent((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
    }, 7500);
    return () => clearInterval(autoPlay);
  }, []);

  const slide = CAROUSEL_SLIDES[current];

  return (
    <section id="inicio" className="relative pt-24 sm:pt-28 pb-12 sm:pb-20 overflow-hidden">
      {/* Retícula técnica de fondo adaptable */}
      <div className="absolute inset-0 bg-tactical-grid opacity-70 pointer-events-none" />

      {/* Glow institucional en esquinas */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#D97706]/10 dark:bg-[#F59E0B]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-[#1B3B2B]/15 dark:bg-[#4D6B53]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        {/* Cabecera de Telemetría Superior */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D4D4D0] dark:border-[#242B27] pb-3 text-[11px] font-mono text-[#4B524E] dark:text-zinc-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-[#D97706] dark:text-[#F59E0B] font-bold tracking-wider">
              <Compass className="w-3.5 h-3.5" />
              COORD: 16°30&apos;08&quot;S 68°07&apos;15&quot;W
            </span>
            <span className="hidden md:inline text-zinc-400 dark:text-zinc-600">|</span>
            <span className="hidden md:inline text-zinc-600 dark:text-zinc-400">
              CUARTEL GENERAL MIRAFLORES • LA PAZ
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span
              onMouseEnter={() => scramble(slide.codigo)}
              className="cursor-pointer text-zinc-700 dark:text-zinc-300 hover:text-[#D97706] dark:hover:text-[#F59E0B] transition tabular-nums font-bold"
              title="Pasa el cursor para decodificar"
            >
              ID: [{scrambledCode}]
            </span>
            <span className="text-[#1B3B2B] dark:text-emerald-400 bg-[#1B3B2B]/10 dark:bg-[#4D6B53]/20 px-2 py-0.5 border border-[#1B3B2B]/30 dark:border-[#4D6B53]/40 text-[10px] font-bold">
              CONVOCATORIA II-2026
            </span>
          </div>
        </div>

        {/* Bloque Principal del Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Lado Izquierdo: Titular y Mensaje Institucional */}
          <div className="lg:col-span-7 space-y-6">
            <div
              onMouseEnter={scrambleDivision}
              className="inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-[#121614] border border-[#D4D4D0] dark:border-[#242B27] shadow-xs cursor-pointer group"
              title="Pasa el cursor para recodificar"
            >
              <span className="w-2 h-2 rounded-none bg-[#D97706] dark:bg-[#F59E0B]" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#111312] dark:text-zinc-200 group-hover:text-[#D97706] dark:group-hover:text-[#F59E0B] transition">
                {scrambledDivision}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#111312] dark:text-white font-display uppercase leading-[1.08]">
              Excelencia Lingüística Para la{' '}
              <span className="text-[#D97706] dark:text-[#F59E0B]">Soberanía</span> y el Futuro
            </h1>

            <p className="text-sm sm:text-base text-[#4B524E] dark:text-zinc-300 leading-relaxed max-w-2xl font-sans">
              La Escuela de Idiomas del Ejército forma a militares y civiles con el más alto rigor
              técnico en <strong className="text-[#111312] dark:text-white">idiomas extranjeros y originarios</strong>.
              Programas certificados con metodología de precisión, rotación pedagógica cada 15 días y
              preparación internacional STANAG 6001.
            </p>

            {/* Ficha Rápida de Métricas */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-2">
              <div className="p-3 sm:p-4 bg-white dark:bg-[#121614] border border-[#D4D4D0] dark:border-[#242B27] hover:border-[#D97706] dark:hover:border-[#F59E0B]/50 transition shadow-xs">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">Currícula</span>
                <span className="text-xl sm:text-2xl font-black font-mono text-[#D97706] dark:text-[#F59E0B] tabular-nums">
                  36 Libros
                </span>
                <span className="text-[11px] text-zinc-600 dark:text-zinc-400 block mt-0.5">American Language Course</span>
              </div>
              <div className="p-3 sm:p-4 bg-white dark:bg-[#121614] border border-[#D4D4D0] dark:border-[#242B27] hover:border-[#1B3B2B] dark:hover:border-[#4D6B53]/80 transition shadow-xs">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">Rotación</span>
                <span className="text-xl sm:text-2xl font-black font-mono text-[#111312] dark:text-white tabular-nums">
                  15 Días
                </span>
                <span className="text-[11px] text-zinc-600 dark:text-zinc-400 block mt-0.5">Adaptación de Acentos</span>
              </div>
              <div className="p-3 sm:p-4 bg-white dark:bg-[#121614] border border-[#D4D4D0] dark:border-[#242B27] hover:border-emerald-600 dark:hover:border-emerald-500/50 transition shadow-xs">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">Cobertura</span>
                <span className="text-xl sm:text-2xl font-black font-mono text-[#1B3B2B] dark:text-emerald-400 tabular-nums">
                  9 Sedes
                </span>
                <span className="text-[11px] text-zinc-600 dark:text-zinc-400 block mt-0.5">Todo el Territorio Nacional</span>
              </div>
            </div>

            {/* Acciones Tácticas */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#inscripciones"
                onMouseEnter={scrambleCta}
                className="px-6 py-3.5 bg-[#1B3B2B] hover:bg-[#12281D] text-amber-300 dark:bg-[#F59E0B] dark:hover:bg-[#D97706] dark:text-black font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-md dark:shadow-[0_0_20px_rgba(245,158,11,0.25)]"
              >
                <span>{ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#oferta-academica"
                className="px-5 py-3.5 bg-white dark:bg-[#121614] hover:bg-[#F4F3EF] dark:hover:bg-[#181F1A] border border-[#D4D4D0] dark:border-[#242B27] hover:border-zinc-500 text-zinc-800 dark:text-zinc-200 font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-[#D97706] dark:text-[#F59E0B]" />
                <span>Ver Catálogo de Idiomas</span>
              </a>

              <Link
                href="/login"
                className="px-4 py-3.5 bg-transparent hover:bg-white/60 dark:hover:bg-[#121614] text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white font-mono text-xs uppercase tracking-wider transition flex items-center gap-1.5"
              >
                <Terminal className="w-3.5 h-3.5 text-zinc-500" />
                <span>Acceso SACA &rarr;</span>
              </Link>
            </div>
          </div>

          {/* Lado Derecho: Marco Táctico del Carrusel */}
          <div className="lg:col-span-5">
            <div className="relative bg-white dark:bg-[#121614] border border-[#D4D4D0] dark:border-[#242B27] p-2 sm:p-3 shadow-xl dark:shadow-2xl group">
              {/* Marcas de Visor Técnico HUD en las 4 esquinas ┌ ┐ └ ┘ */}
              <span className="absolute -top-1 -left-1 font-mono text-base font-bold text-[#D97706] dark:text-[#F59E0B] leading-none select-none">
                ┌
              </span>
              <span className="absolute -top-1 -right-1 font-mono text-base font-bold text-[#D97706] dark:text-[#F59E0B] leading-none select-none">
                ┐
              </span>
              <span className="absolute -bottom-1 -left-1 font-mono text-base font-bold text-[#D97706] dark:text-[#F59E0B] leading-none select-none">
                └
              </span>
              <span className="absolute -bottom-1 -right-1 font-mono text-base font-bold text-[#D97706] dark:text-[#F59E0B] leading-none select-none">
                ┘
              </span>

              {/* HUD Brackets CSS fallback */}
              <div className="hud-bracket-tl" />
              <div className="hud-bracket-tr" />
              <div className="hud-bracket-bl" />
              <div className="hud-bracket-br" />

              {/* Barra de Telemetría del Carrusel */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#D4D4D0] dark:border-[#242B27] text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
                <span className="text-[#D97706] dark:text-[#F59E0B] font-bold">{slide.categoria}</span>
                <span className="tabular-nums">SLIDE // [{current + 1} DE {CAROUSEL_SLIDES.length}]</span>
              </div>

              {/* Imagen del Slide con Frame Técnico */}
              <div className="relative aspect-[16/10] overflow-hidden bg-black border border-[#D4D4D0] dark:border-[#242B27]">
                <img
                  key={slide.imagen}
                  src={slide.imagen}
                  alt={slide.titulo}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

                {/* Badge Flotante de Métrica */}
                <div className="absolute top-3 right-3 bg-black/90 border border-[#D97706] dark:border-[#F59E0B]/50 px-2.5 py-1 text-right">
                  <span className="text-xs font-black font-mono text-amber-300 dark:text-[#F59E0B] block leading-none">
                    {slide.metrica}
                  </span>
                  <span className="text-[9px] font-mono text-zinc-300 uppercase">
                    {slide.metricaLabel}
                  </span>
                </div>

                {/* Texto Superpuesto */}
                <div className="absolute bottom-3 left-3 right-3 space-y-1">
                  <h3 className="text-base sm:text-lg font-bold text-white font-display leading-snug drop-shadow-md">
                    {slide.titulo}
                  </h3>
                  <p className="text-xs text-zinc-200 line-clamp-2 font-sans drop-shadow-sm">
                    {slide.subtitulo}
                  </p>
                </div>
              </div>

              {/* Controles Minimalistas de Navegación */}
              <div className="flex items-center justify-between pt-3 mt-1 text-xs font-mono">
                {/* Thumbnails / Puntos Tácticos */}
                <div className="flex items-center gap-1.5">
                  {CAROUSEL_SLIDES.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrent(idx)}
                      className={`h-2 transition-all ${
                        idx === current
                          ? 'w-7 bg-[#D97706] dark:bg-[#F59E0B]'
                          : 'w-2 bg-[#D4D4D0] dark:bg-[#242B27] hover:bg-zinc-500'
                      }`}
                      aria-label={`Ir al slide ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Botones Prev / Next */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrent((prev) => (prev - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length)}
                    className="p-1.5 bg-[#F4F3EF] dark:bg-[#0A0C0B] border border-[#D4D4D0] dark:border-[#242B27] hover:border-[#D97706] dark:hover:border-[#F59E0B] text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition"
                    aria-label="Slide anterior"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrent((prev) => (prev + 1) % CAROUSEL_SLIDES.length)}
                    className="p-1.5 bg-[#F4F3EF] dark:bg-[#0A0C0B] border border-[#D4D4D0] dark:border-[#242B27] hover:border-[#D97706] dark:hover:border-[#F59E0B] text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition"
                    aria-label="Siguiente slide"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
