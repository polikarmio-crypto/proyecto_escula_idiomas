'use client';

import React from 'react';
import NavbarTactico from '@/components/landing/NavbarTactico';
import HeroEIE from '@/components/landing/HeroEIE';
import MisionVision from '@/components/landing/MisionVision';
import SedesBento from '@/components/landing/SedesBento';
import OfertaModalidades from '@/components/landing/OfertaModalidades';
import PreInscripcionDigital from '@/components/landing/PreInscripcionDigital';
import CorreoInstitucional from '@/components/landing/CorreoInstitucional';
import FooterTactico from '@/components/landing/FooterTactico';

export default function IndexPage() {
  return (
    <div className="min-h-screen bg-[#F4F3EF] dark:bg-[#0A0C0B] text-[#111312] dark:text-zinc-100 font-sans selection:bg-[#D97706] selection:text-white dark:selection:bg-[#F59E0B] dark:selection:text-black overflow-x-hidden transition-colors duration-200">
      {/* Barra de Navegación Fija con Glassmorphism Táctico */}
      <NavbarTactico />

      {/* Contenido Modular de la Landing Page */}
      <main className="w-full">
        {/* 00 // Hero Principal + Carrusel Institucional */}
        <HeroEIE />

        {/* 01 // Misión y Visión Doctrinal */}
        <MisionVision />

        {/* 02 // Red de 9 Sedes y Filiales (Bento Grid) */}
        <SedesBento />

        {/* 03 // Catálogo de Idiomas y Modalidades */}
        <OfertaModalidades />

        {/* 04 // Pre-Inscripción Digital / Matrícula */}
        <PreInscripcionDigital />

        {/* 05 // Activación y Consulta de Correo Institucional */}
        <CorreoInstitucional />
      </main>

      {/* Pie de Página Táctico */}
      <FooterTactico />
    </div>
  );
}
