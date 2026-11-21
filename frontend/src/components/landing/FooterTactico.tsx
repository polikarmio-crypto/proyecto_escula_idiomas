'use client';

import React from 'react';
import Link from 'next/link';
import {
  Shield,
  Compass,
  Lock,
  Phone,
  Mail,
  ExternalLink,
  ChevronRight,
  Terminal,
} from 'lucide-react';

export default function FooterTactico() {
  return (
    <footer id="contacto" className="relative bg-[#EAE8E1] dark:bg-[#070908] border-t border-[#D4D4D0] dark:border-[#242B27] pt-16 pb-12 font-mono text-xs">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Grilla Principal del Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Columna 1: Identidad Institucional */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white dark:bg-[#121614] border border-[#D4D4D0] dark:border-[#242B27] p-1.5 shrink-0 shadow-xs">
                <img
                  src="/images/logos/logo-eie.png"
                  alt="Escudo Oficial EIE"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="text-[10px] text-[#D97706] dark:text-[#F59E0B] font-bold block uppercase tracking-wider">
                  CEDMIL // BOLIVIA
                </span>
                <h4 className="text-sm font-bold text-[#111312] dark:text-white font-display uppercase tracking-tight">
                  Escuela de Idiomas del Ejército
                </h4>
              </div>
            </div>

            <p className="text-zinc-600 dark:text-zinc-400 text-[11px] leading-relaxed font-sans">
              Instituto de educación superior castrense dependiente del Comando de Educación y
              Doctrina Militar. Capacitación en idiomas bajo normas STANAG 6001.
            </p>

            <div className="p-3 bg-white dark:bg-[#121614] border border-[#D4D4D0] dark:border-[#242B27] space-y-1 text-[10px] shadow-xs">
              <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                <span>ESTADO DEL SISTEMA:</span>
                <span className="text-[#1B3B2B] dark:text-emerald-400 font-bold">OPERATIVO 99.9%</span>
              </div>
              <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                <span>CIFRADO DE DATOS:</span>
                <span className="text-[#D97706] dark:text-[#F59E0B] font-bold">SHA-256 TLS 1.3</span>
              </div>
            </div>
          </div>

          {/* Columna 2: Navegación Rápida */}
          <div className="space-y-3">
            <h5 className="text-[#111312] dark:text-white font-bold uppercase tracking-wider text-xs border-b border-[#D4D4D0] dark:border-[#242B27] pb-2">
              Índice de Telemetría
            </h5>
            <ul className="space-y-2 text-zinc-600 dark:text-zinc-400 text-[11px]">
              <li>
                <a href="#inicio" className="hover:text-[#D97706] dark:hover:text-[#F59E0B] transition flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-[#D97706] dark:text-[#F59E0B]" />
                  <span>00 // Inicio &amp; Centro de Mando</span>
                </a>
              </li>
              <li>
                <a href="#mision-vision" className="hover:text-[#D97706] dark:hover:text-[#F59E0B] transition flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-[#D97706] dark:text-[#F59E0B]" />
                  <span>01 // Misión y Visión Doctrinal</span>
                </a>
              </li>
              <li>
                <a href="#sedes" className="hover:text-[#D97706] dark:hover:text-[#F59E0B] transition flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-[#D97706] dark:text-[#F59E0B]" />
                  <span>02 // Red de 9 Sedes Nacionales</span>
                </a>
              </li>
              <li>
                <a href="#oferta-academica" className="hover:text-[#D97706] dark:hover:text-[#F59E0B] transition flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-[#D97706] dark:text-[#F59E0B]" />
                  <span>03 // Catálogo STANAG 6001</span>
                </a>
              </li>
              <li>
                <a href="#inscripciones" className="hover:text-[#D97706] dark:hover:text-[#F59E0B] transition flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-[#D97706] dark:text-[#F59E0B]" />
                  <span>04 // Pre-Inscripción Digital</span>
                </a>
              </li>
              <li>
                <a href="#correo-institucional" className="hover:text-[#D97706] dark:hover:text-[#F59E0B] transition flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-[#D97706] dark:text-[#F59E0B]" />
                  <span>05 // Correo Institucional</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 3: Contacto y Guarnición */}
          <div className="space-y-3">
            <h5 className="text-[#111312] dark:text-white font-bold uppercase tracking-wider text-xs border-b border-[#D4D4D0] dark:border-[#242B27] pb-2">
              Sede Central Miraflores
            </h5>
            <div className="space-y-2 text-zinc-600 dark:text-zinc-400 text-[11px]">
              <p className="flex items-start gap-2">
                <Compass className="w-4 h-4 text-[#D97706] dark:text-[#F59E0B] shrink-0 mt-0.5" />
                <span>Cuartel General del Ejército, Av. Saavedra Nro. 1420, Miraflores, La Paz - Bolivia</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#D97706] dark:text-[#F59E0B] shrink-0" />
                <span>Central: (+591) 2-2223401 • WhatsApp: 72005358</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#D97706] dark:text-[#F59E0B] shrink-0" />
                <span>info@idiomas.ejercito.mil.bo</span>
              </p>
            </div>
            <div className="pt-2">
              <span className="text-[10px] text-zinc-500 uppercase block">Horario de Atención en Ventanilla:</span>
              <p className="text-[#111312] dark:text-zinc-300 text-[11px]">Lunes a Viernes: 07:30 a 19:30 • Sábados: 08:00 a 13:00</p>
            </div>
          </div>

          {/* Columna 4: Enlaces del Sistema */}
          <div className="space-y-3">
            <h5 className="text-[#111312] dark:text-white font-bold uppercase tracking-wider text-xs border-b border-[#D4D4D0] dark:border-[#242B27] pb-2">
              Plataformas SACA
            </h5>
            <p className="text-zinc-600 dark:text-zinc-400 text-[11px] font-sans">
              Acceso exclusivo para personal docente, estudiantes matriculados, jefatura académica y administración.
            </p>
            <div className="space-y-2">
              <Link
                href="/login"
                className="w-full py-2.5 px-3 bg-[#1B3B2B] hover:bg-[#12281D] text-amber-300 dark:bg-[#F59E0B] dark:hover:bg-[#D97706] dark:text-black font-bold flex items-center justify-between transition uppercase tracking-wider text-[11px] shadow-sm"
              >
                <span>Acceder a SACA</span>
                <Terminal className="w-3.5 h-3.5" />
              </Link>

              <a
                href="https://accounts.google.com"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-3 bg-white dark:bg-[#121614] hover:bg-[#F4F3EF] dark:hover:bg-[#181F1A] border border-[#D4D4D0] dark:border-[#242B27] hover:border-zinc-500 text-zinc-800 dark:text-zinc-300 flex items-center justify-between transition text-[11px]"
              >
                <span>Google Workspace EIE</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#D97706] dark:text-[#F59E0B]" />
              </a>
            </div>
          </div>
        </div>

        {/* Barra Inferior de Derechos y Leyenda Castrense */}
        <div className="pt-8 border-t border-[#D4D4D0] dark:border-[#242B27] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[10px] text-zinc-500">
          <div className="flex items-center gap-3">
            <span className="text-zinc-600 dark:text-zinc-400">
              © {new Date().getFullYear()} COMANDO DE EDUCACIÓN Y DOCTRINA MILITAR (CEDMIL) • EJÉRCITO DE BOLIVIA
            </span>
          </div>

          <div className="flex items-center gap-4 text-zinc-500">
            <span>LEMA: &quot;THINK GLOBALLY, ACT LOCALLY&quot;</span>
            <span>SEGURIDAD Y SOBERANÍA</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
