'use client';

import React from 'react';
import { Shield, Target, Compass, Award, FileText, CheckCircle2 } from 'lucide-react';

export default function MisionVision() {
  return (
    <section id="mision-vision" className="relative py-16 sm:py-24 border-t border-[#D4D4D0] dark:border-[#242B27]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Encabezado Técnico de Sección */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#D4D4D0] dark:border-[#242B27] pb-4">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold tracking-widest text-[#D97706] dark:text-[#F59E0B] uppercase">
              01 // DOCTRINA INSTITUCIONAL
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#111312] dark:text-white font-display uppercase tracking-tight">
              Misión y Visión Estratégica
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#4B524E] dark:text-zinc-400 max-w-md font-sans">
            Pilares estratégicos que fundamentan el liderazgo académico, la disciplina militar y la
            excelencia lingüística de la Escuela de Idiomas del Ejército.
          </p>
        </div>

        {/* Grid Asimétrico de 2 Columnas Tácticas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Tarjeta 1: MISIÓN */}
          <div className="relative bg-white dark:bg-[#121614] border border-[#D4D4D0] dark:border-[#242B27] hover:border-[#1B3B2B] dark:hover:border-[#4D6B53] transition-all p-6 sm:p-8 flex flex-col justify-between group shadow-sm dark:shadow-none">
            <div className="hud-bracket-tl" />
            <div className="hud-bracket-tr" />

            <div className="space-y-5">
              {/* Header de la Tarjeta */}
              <div className="flex items-center justify-between border-b border-[#D4D4D0] dark:border-[#242B27] pb-3 text-xs font-mono">
                <span className="px-2 py-0.5 bg-[#1B3B2B]/10 dark:bg-[#4D6B53]/20 border border-[#1B3B2B]/30 dark:border-[#4D6B53]/40 text-[#1B3B2B] dark:text-[#74c69d] font-bold">
                  COMETIDO INSTITUCIONAL
                </span>
                <span className="text-zinc-500 uppercase">CPE ART. 244 // 245</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#F4F3EF] dark:bg-[#0A0C0B] border border-[#D4D4D0] dark:border-[#242B27] flex items-center justify-center text-[#D97706] dark:text-[#F59E0B]">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-widest block">
                      DECRETO DOCTRINARIO
                    </span>
                    <h3 className="text-2xl font-black text-[#111312] dark:text-white font-display uppercase">
                      Misión Oficial
                    </h3>
                  </div>
                </div>

                <p className="text-sm text-[#4B524E] dark:text-zinc-300 leading-relaxed font-sans text-justify pt-2">
                  La Escuela de Idiomas del Ejército planifica, coordina y desarrolla de forma permanente
                  el sistema de enseñanza y aprendizaje de idiomas extranjeros y originarios en sus
                  distintas filiales en todo el territorio nacional. Su objetivo es capacitar al recurso
                  humano del Ejército y al personal civil con un elevado nivel de dominio lingüístico para
                  satisfacer sus requerimientos operativos, académicos e institucionales, dando estricto
                  cumplimiento a la misión formativa del Comando de Institutos Militares y su función constitucional.
                </p>
              </div>

              {/* Puntos Clave de Misión */}
              <div className="space-y-2 pt-2 border-t border-[#D4D4D0]/60 dark:border-[#242B27]/60 text-xs font-mono text-[#4B524E] dark:text-zinc-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Capacitación en 8 idiomas bajo estándar STANAG 6001</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Rotación metodológica continua de catedráticos cada 15 días</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Cobertura simultánea para personal militar y población civil</span>
                </div>
              </div>
            </div>

            {/* Footer de la Tarjeta */}
            <div className="mt-6 pt-4 border-t border-[#D4D4D0] dark:border-[#242B27] flex items-center justify-between text-[11px] font-mono text-zinc-500">
              <span>CEDMIL • COMANDO GENERAL</span>
              <span className="text-[#1B3B2B] dark:text-[#74c69d] font-bold">FUNCIÓN CONSTITUCIONAL</span>
            </div>
          </div>

          {/* Tarjeta 2: VISIÓN */}
          <div className="relative bg-white dark:bg-[#121614] border border-[#D4D4D0] dark:border-[#242B27] hover:border-[#D97706] dark:hover:border-[#F59E0B]/60 transition-all p-6 sm:p-8 flex flex-col justify-between group shadow-sm dark:shadow-none">
            <div className="hud-bracket-tl" />
            <div className="hud-bracket-tr" />

            <div className="space-y-5">
              {/* Header de la Tarjeta */}
              <div className="flex items-center justify-between border-b border-[#D4D4D0] dark:border-[#242B27] pb-3 text-xs font-mono">
                <span className="px-2 py-0.5 bg-[#D97706]/10 dark:bg-[#F59E0B]/15 border border-[#D97706]/30 dark:border-[#F59E0B]/30 text-[#D97706] dark:text-[#F59E0B] font-bold">
                  HORIZONTE ESTRATÉGICO
                </span>
                <span className="text-zinc-500 uppercase">PROYECCIÓN DOCTRINARIA 2030</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#F4F3EF] dark:bg-[#0A0C0B] border border-[#D4D4D0] dark:border-[#242B27] flex items-center justify-center text-[#D97706] dark:text-[#F59E0B]">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-widest block">
                      VISIÓN MILITAR
                    </span>
                    <h3 className="text-2xl font-black text-[#111312] dark:text-white font-display uppercase">
                      Visión Estratégica
                    </h3>
                  </div>
                </div>

                <p className="text-sm text-[#4B524E] dark:text-zinc-300 leading-relaxed font-sans text-justify pt-2">
                  Constituirse en una institución académica líder y altamente competitiva a nivel
                  nacional e internacional en la enseñanza de idiomas originarios y extranjeros,
                  sustentada en la excelencia curricular, tecnología multimedia de punta y valores cívico-patrióticos.
                  Formar talento humano especializado capaz de responder con éxito a los desafíos geopolíticos,
                  operaciones de paz multinacionales de las Naciones Unidas y la integración intercultural del Estado Plurinacional.
                </p>
              </div>

              {/* Puntos Clave de Visión */}
              <div className="space-y-2 pt-2 border-t border-[#D4D4D0]/60 dark:border-[#242B27]/60 text-xs font-mono text-[#4B524E] dark:text-zinc-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D97706] dark:text-[#F59E0B] shrink-0" />
                  <span>Acreditación curricular de validez militar y universitaria</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D97706] dark:text-[#F59E0B] shrink-0" />
                  <span>Laboratorios de audio digital y plataformas e-learning de última generación</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D97706] dark:text-[#F59E0B] shrink-0" />
                  <span>Liderazgo en misiones de paz de cascos azules y diplomacia militar</span>
                </div>
              </div>
            </div>

            {/* Footer de la Tarjeta */}
            <div className="mt-6 pt-4 border-t border-[#D4D4D0] dark:border-[#242B27] flex items-center justify-between text-[11px] font-mono text-zinc-500">
              <span>LIDERAZGO &bull; COMPETITIVIDAD</span>
              <span className="text-[#D97706] dark:text-[#F59E0B] font-bold">EXCELENCIA GLOBAL</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
