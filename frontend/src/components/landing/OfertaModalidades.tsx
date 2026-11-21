'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  Award,
  Clock,
  Layers,
  CheckCircle2,
  ChevronRight,
  Shield,
  FileCheck,
} from 'lucide-react';

interface ProgramaIdioma {
  codigo: string;
  nombre: string;
  estandar: string;
  niveles: string;
  libros: string;
  duracion: string;
  enfoque: string;
  modalidades: string[];
  destacado?: boolean;
}

const PROGRAMAS_INGLES: ProgramaIdioma[] = [
  {
    codigo: 'ALC-B1-B6',
    nombre: 'Nivel 1: Elemental (Libros 1 al 6)',
    estandar: 'STANAG 6001 Nivel 1 (Supervivencia)',
    niveles: 'Libros 1 al 6',
    libros: '6 Textos Oficiales ALC',
    duracion: '180 Horas Académicas',
    enfoque: 'Fonética, vocabulario operativo básico, órdenes de guarnición y estructuras primarias.',
    modalidades: ['Presencial Regular', 'Intensivo Táctico', 'Sabatino'],
    destacado: true,
  },
  {
    codigo: 'ALC-B7-B12',
    nombre: 'Nivel 2: Básico Intermedio (Libros 7 al 12)',
    estandar: 'STANAG 6001 Nivel 1+',
    niveles: 'Libros 7 al 12',
    libros: '6 Textos Oficiales ALC',
    duracion: '180 Horas Académicas',
    enfoque: 'Comprensión auditiva acelerada, diálogos técnicos y redacción de partes institucionales.',
    modalidades: ['Presencial Regular', 'Intensivo Táctico', 'Virtual'],
  },
  {
    codigo: 'ALC-B13-B18',
    nombre: 'Nivel 3: Intermedio Operativo (Libros 13 al 18)',
    estandar: 'STANAG 6001 Nivel 2 (Funcional)',
    niveles: 'Libros 13 al 18',
    libros: '6 Textos Oficiales ALC',
    duracion: '180 Horas Académicas',
    enfoque: 'Comunicaciones en operaciones combinadas, cartografía y léxico castrense.',
    modalidades: ['Presencial Regular', 'Intensivo Táctico', 'Virtual'],
  },
  {
    codigo: 'ALC-B19-B24',
    nombre: 'Nivel 4: Intermedio Alto (Libros 19 al 24)',
    estandar: 'STANAG 6001 Nivel 2+',
    niveles: 'Libros 19 al 24',
    libros: '6 Textos Oficiales ALC',
    duracion: '180 Horas Académicas',
    enfoque: 'Exposiciones tácticas, análisis geopolítico y debate fluido sin asistencia.',
    modalidades: ['Presencial Regular', 'Virtual Sincrónico'],
  },
  {
    codigo: 'ALC-B25-B30',
    nombre: 'Nivel 5: Avanzado Profesional (Libros 25 al 30)',
    estandar: 'STANAG 6001 Nivel 3 (Profesional)',
    niveles: 'Libros 25 al 30',
    libros: '6 Textos Oficiales ALC',
    duracion: '180 Horas Académicas',
    enfoque: 'Negociación internacional, misiones de paz ONU y conferencias multilaterales.',
    modalidades: ['Presencial Regular', 'Virtual Sincrónico'],
  },
  {
    codigo: 'ALC-B31-B36',
    nombre: 'Nivel 6: Superior y Certificación (Libros 31 al 36)',
    estandar: 'STANAG 6001 Nivel 4 (Bilingüe Pleno)',
    niveles: 'Libros 31 al 36',
    libros: '6 Textos Oficiales ALC',
    duracion: '180 Horas Académicas',
    enfoque: 'Peritaje lingüístico, traducción simultánea y graduación con Provisión Nacional.',
    modalidades: ['Presencial Regular'],
    destacado: true,
  },
];

const PROGRAMAS_EXTRANJEROS: ProgramaIdioma[] = [
  {
    codigo: 'FRA-COOP-DELF',
    nombre: 'Idioma Francés — Alianza y Cooperación Militar',
    estandar: 'DELF / DALF B2 Internacional',
    niveles: '4 Niveles (A1 a B2)',
    libros: 'Textos Oficiales de Cooperación',
    duracion: '360 Horas Académicas',
    enfoque: 'Convenios bilaterales, doctrina de defensa francófona y misiones diplomáticas.',
    modalidades: ['Regular (Tardes y Noches)', 'Sabatino'],
    destacado: true,
  },
  {
    codigo: 'RUS-TAC-MIL',
    nombre: 'Idioma Ruso — Especialidad Técnico-Táctica',
    estandar: 'TORFL I / Nivel Intermedio',
    niveles: '4 Niveles Continuos',
    libros: 'Manuales de Lingüística Técnica',
    duracion: '360 Horas Académicas',
    enfoque: 'Traducción técnica, balística, manuales de armamento y terminología científica.',
    modalidades: ['Regular Noches (18:00 - 19:30)'],
  },
  {
    codigo: 'POR-MERCOSUR',
    nombre: 'Idioma Portugués — Frontera e Integración Regional',
    estandar: 'Celpe-Bras / Avanzado',
    niveles: '3 Niveles Continuos',
    libros: 'Textos de Inmersión Rápida',
    duracion: '240 Horas Académicas',
    enfoque: 'Operaciones conjuntas de frontera, patrullaje fluvial y diplomacia en Mercosur.',
    modalidades: ['Regular Mañanas y Noches', 'Intensivo'],
  },
  {
    codigo: 'CHI-HSK-DIP',
    nombre: 'Idioma Mandarín — Cooperación Estratégica',
    estandar: 'HSK 3 - HSK 4 Acreditado',
    niveles: '3 Niveles Progresivos',
    libros: 'Textos HSK Estándar',
    duracion: '300 Horas Académicas',
    enfoque: 'Escritura de caracteres, fonética Pinyin, protocolo y cooperación comercial-militar.',
    modalidades: ['Regular Tardes y Sabatinos'],
  },
  {
    codigo: 'ALE-ACAD-DEF',
    nombre: 'Idioma Alemán — Escuela Técnica',
    estandar: 'Goethe-Zertifikat B1/B2',
    niveles: '3 Niveles',
    libros: 'Material Universitario',
    duracion: '240 Horas Académicas',
    enfoque: 'Ingeniería, lectura técnica especializada e intercambio académico internacional.',
    modalidades: ['Sabatino Intensivo'],
  },
];

const PROGRAMAS_NATIVOS: ProgramaIdioma[] = [
  {
    codigo: 'AYM-INTERCULT',
    nombre: 'Idioma Aymara — Descolonización e Interculturalidad',
    estandar: 'Certificación Oficial CEDMIL / Ley 269',
    niveles: '2 Niveles (Básico y Avanzado)',
    libros: 'Gramática y Vocabulario Andino',
    duracion: '160 Horas Académicas',
    enfoque: 'Interacción comunitaria con la población altiplánica, servicio civil y defensa civil.',
    modalidades: ['Presencial (Mañanas y Tardes)', 'Virtual'],
    destacado: true,
  },
  {
    codigo: 'QUE-INTERCULT',
    nombre: 'Idioma Quechua — Integración de Valles y Salares',
    estandar: 'Certificación Oficial CEDMIL / Ley 269',
    niveles: '2 Niveles (Básico y Avanzado)',
    libros: 'Gramática Runasimi EIE',
    duracion: '160 Horas Académicas',
    enfoque: 'Diálogo intercultural, apoyo a comunidades de valles y cumplimiento de la CPE.',
    modalidades: ['Presencial Noches', 'Virtual'],
    destacado: true,
  },
  {
    codigo: 'GUA-CHACO-OR',
    nombre: 'Idioma Guaraní — Región del Chaco',
    estandar: 'Certificación Oficial CEDMIL / Ley 269',
    niveles: '2 Niveles (Básico y Avanzado)',
    libros: 'Guía Fonética Guaraní',
    duracion: '160 Horas Académicas',
    enfoque: 'Conservación territorial, soberanía en el Chaco boliviano y convivencia comunitaria.',
    modalidades: ['Sabatino / Virtual'],
  },
];

export default function OfertaModalidades() {
  const [tabActiva, setTabActiva] = useState<'INGLES' | 'EXTRANJEROS' | 'NATIVOS'>('INGLES');

  const programas =
    tabActiva === 'INGLES'
      ? PROGRAMAS_INGLES
      : tabActiva === 'EXTRANJEROS'
      ? PROGRAMAS_EXTRANJEROS
      : PROGRAMAS_NATIVOS;

  return (
    <section id="oferta-academica" className="relative py-16 sm:py-24 border-t border-[#D4D4D0] dark:border-[#242B27]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Encabezado Técnico */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#D4D4D0] dark:border-[#242B27] pb-4">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold tracking-widest text-[#D97706] dark:text-[#F59E0B] uppercase">
              03 // OFERTA FORMATIVA Y MODALIDADES
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#111312] dark:text-white font-display uppercase tracking-tight">
              Especificaciones Curriculares
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#4B524E] dark:text-zinc-400 max-w-md font-sans">
            Hoja de especificaciones de los programas académicos vigentes para la Gestión II-2026,
            con validez curricular y certificación avalada por CEDMIL.
          </p>
        </div>

        {/* Selector de Pestañas Tipo Ficha Técnica */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#EAE8E1]/60 dark:bg-[#121614] border border-[#D4D4D0] dark:border-[#242B27]">
          <button
            onClick={() => setTabActiva('INGLES')}
            className={`px-4 sm:px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-wider transition-all ${
              tabActiva === 'INGLES'
                ? 'bg-[#1B3B2B] text-amber-300 dark:bg-[#F59E0B] dark:text-black shadow'
                : 'text-zinc-700 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-white dark:hover:bg-[#181F1A]'
            }`}
          >
            [ INGLÉS ALC / STANAG 6001 ]
          </button>
          <button
            onClick={() => setTabActiva('EXTRANJEROS')}
            className={`px-4 sm:px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-wider transition-all ${
              tabActiva === 'EXTRANJEROS'
                ? 'bg-[#1B3B2B] text-amber-300 dark:bg-[#F59E0B] dark:text-black shadow'
                : 'text-zinc-700 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-white dark:hover:bg-[#181F1A]'
            }`}
          >
            [ IDIOMAS EXTRANJEROS ]
          </button>
          <button
            onClick={() => setTabActiva('NATIVOS')}
            className={`px-4 sm:px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-wider transition-all ${
              tabActiva === 'NATIVOS'
                ? 'bg-[#1B3B2B] text-amber-300 dark:bg-[#F59E0B] dark:text-black shadow'
                : 'text-zinc-700 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-white dark:hover:bg-[#181F1A]'
            }`}
          >
            [ IDIOMAS ORIGINARIOS ]
          </button>
        </div>

        {/* Tabla / Hoja de Especificaciones Militares */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {programas.map((prog) => (
            <div
              key={prog.codigo}
              className={`relative bg-white dark:bg-[#121614] border transition-all p-5 flex flex-col justify-between group shadow-xs ${
                prog.destacado
                  ? 'border-[#D97706]/70 dark:border-[#F59E0B]/60 hover:border-[#D97706] dark:hover:border-[#F59E0B]'
                  : 'border-[#D4D4D0] dark:border-[#242B27] hover:border-zinc-500'
              }`}
            >
              <div className="space-y-4">
                {/* Header del Programa */}
                <div className="flex items-center justify-between border-b border-[#D4D4D0] dark:border-[#242B27] pb-2 text-xs font-mono">
                  <span className="text-[#D97706] dark:text-[#F59E0B] font-bold">
                    CODE: {prog.codigo}
                  </span>
                  <span className="text-zinc-500 text-[10px]">
                    CEDMIL // II-2026
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-black text-[#111312] dark:text-white font-display uppercase group-hover:text-[#D97706] dark:group-hover:text-[#F59E0B] transition">
                    {prog.nombre}
                  </h3>
                  <span className="text-xs font-mono font-medium text-[#1B3B2B] dark:text-emerald-400 block mt-1">
                    {prog.estandar}
                  </span>
                  <p className="text-xs text-[#4B524E] dark:text-zinc-300 mt-2 line-clamp-3 leading-relaxed">
                    {prog.enfoque}
                  </p>
                </div>

                {/* Grid de Especificaciones */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#D4D4D0] dark:border-[#242B27] text-[11px] font-mono text-zinc-600 dark:text-zinc-400">
                  <div className="p-2 bg-[#F4F3EF] dark:bg-[#0A0C0B] border border-[#D4D4D0] dark:border-[#242B27]">
                    <span className="text-[9px] text-zinc-500 uppercase block">Carga Horaria</span>
                    <span className="text-[#111312] dark:text-white font-bold">{prog.duracion}</span>
                  </div>
                  <div className="p-2 bg-[#F4F3EF] dark:bg-[#0A0C0B] border border-[#D4D4D0] dark:border-[#242B27]">
                    <span className="text-[9px] text-zinc-500 uppercase block">Material Oficial</span>
                    <span className="text-[#111312] dark:text-white font-bold truncate block">{prog.libros}</span>
                  </div>
                </div>

                {/* Modalidades Disponibles */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase text-zinc-500 block">
                    Turnos y Modalidades:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {prog.modalidades.map((mod, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-[#F4F3EF] dark:bg-[#0A0C0B] border border-[#D4D4D0] dark:border-[#242B27] text-zinc-700 dark:text-zinc-300 text-[10px] font-mono"
                      >
                        {mod}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Botón de Enlace a Inscripción */}
              <div className="mt-5 pt-3 border-t border-[#D4D4D0] dark:border-[#242B27]">
                <a
                  href="#inscripciones"
                  className="w-full py-2 bg-[#F4F3EF] hover:bg-[#1B3B2B] text-zinc-800 hover:text-amber-300 dark:bg-[#181F1A] dark:hover:bg-[#F59E0B] dark:text-zinc-200 dark:hover:text-black font-mono font-bold text-xs uppercase text-center block transition border border-[#D4D4D0] dark:border-[#242B27] hover:border-[#1B3B2B] dark:hover:border-[#F59E0B]"
                >
                  Postular a este Programa &rarr;
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
