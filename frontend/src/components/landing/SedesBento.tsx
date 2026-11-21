'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Compass,
  Building2,
  ExternalLink,
  Radio,
  Navigation,
} from 'lucide-react';

interface Sede {
  id: number;
  ciudad: string;
  departamento: string;
  recinto: string;
  direccion: string;
  telefono: string;
  coordenadas: string;
  estado: string;
  imagen?: string;
  isFeatured?: boolean;
}

const SEDES_BOLIVIA: Sede[] = [
  {
    id: 1,
    ciudad: 'La Paz (Sede Central)',
    departamento: 'La Paz',
    recinto: 'Cuartel General del Ejército',
    direccion: 'Av. Saavedra Nro. 1420, Miraflores',
    telefono: '2-2223401',
    coordenadas: '16°30\'08"S 68°07\'15"W',
    estado: 'EN OPERACIÓN CONTINUA',
    imagen: '/images/carousel/fachada-escuela.jpg',
    isFeatured: true,
  },
  {
    id: 2,
    ciudad: 'Cochabamba',
    departamento: 'Cochabamba',
    recinto: 'Guarnición Militar de Cochabamba',
    direccion: 'Av. Ramón Rivero y Calle Heroínas',
    telefono: '4-4259102',
    coordenadas: '17°23\'34"S 66°09\'14"W',
    estado: 'CONVOCATORIA ABIERTA',
    imagen: '/images/carousel/filial-cochabamba.jpg',
    isFeatured: true,
  },
  {
    id: 3,
    ciudad: 'El Alto',
    departamento: 'La Paz',
    recinto: 'Guarnición Militar El Alto',
    direccion: 'Ciudad Satélite, Plan 405',
    telefono: '2-2819034',
    coordenadas: '16°31\'12"S 68°10\'45"W',
    estado: 'AULAS MULTIMEDIA ACTIVAS',
  },
  {
    id: 4,
    ciudad: 'Santa Cruz de la Sierra',
    departamento: 'Santa Cruz',
    recinto: 'Colegio Militar de Aviación',
    direccion: 'Av. Ejército Nro. 520, Zona Trompillo',
    telefono: '3-3349102',
    coordenadas: '17°48\'22"S 63°10\'33"W',
    estado: 'CONVOCATORIA ABIERTA',
  },
  {
    id: 5,
    ciudad: 'Viacha',
    departamento: 'La Paz',
    recinto: 'Regimiento de Artillería 1 "Cnl. Max Toledo"',
    direccion: 'Av. Héroes del Chaco s/n',
    telefono: '2-2801944',
    coordenadas: '16°39\'05"S 68°18\'11"W',
    estado: 'CURSOS REGULARES',
  },
  {
    id: 6,
    ciudad: 'Tarija',
    departamento: 'Tarija',
    recinto: 'Guarnición Militar del Sur',
    direccion: 'Barrio El Tejar, Av. Las Américas',
    telefono: '4-6649102',
    coordenadas: '21°32\'02"S 64°44\'01"W',
    estado: 'CONVOCATORIA ABIERTA',
  },
  {
    id: 7,
    ciudad: 'Achacachi',
    departamento: 'La Paz',
    recinto: 'Regimiento de Infantería 8 "Ayacucho"',
    direccion: 'Pabellón Académico Militar',
    telefono: '2-2891044',
    coordenadas: '16°02\'45"S 68°41\'02"W',
    estado: 'CURSOS NATIVOS Y EXT.',
  },
  {
    id: 8,
    ciudad: 'Riberalta (Beni)',
    departamento: 'Beni',
    recinto: 'Guarnición Militar de la Amazonía',
    direccion: 'Av. Integración y Costanera',
    telefono: '3-8529104',
    coordenadas: '11°00\'22"S 66°03\'45"W',
    estado: 'ZONA ESTRATÉGICA',
  },
  {
    id: 9,
    ciudad: 'Uncía (Potosí)',
    departamento: 'Potosí',
    recinto: 'Regimiento de Caballería 7 "Chichas"',
    direccion: 'Recinto Castrense Uncía',
    telefono: '2-5810294',
    coordenadas: '18°28\'10"S 66°34\'12"W',
    estado: 'CURSOS DE GESTIÓN',
  },
];

export default function SedesBento() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section id="sedes" className="relative py-16 sm:py-24 border-t border-[#D4D4D0] dark:border-[#242B27]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Encabezado Técnico */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#D4D4D0] dark:border-[#242B27] pb-4">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold tracking-widest text-[#D97706] dark:text-[#F59E0B] uppercase">
              02 // PRESENCIA TERRITORIAL
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#111312] dark:text-white font-display uppercase tracking-tight">
              Red de 9 Sedes y Filiales en Bolivia
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#4B524E] dark:text-zinc-400 max-w-md font-sans">
            Despliegue operativo y laboratorios de idiomas equipados en guarniciones de todo el
            territorio nacional para personal militar y comunidad civil.
          </p>
        </div>

        {/* Bento Grid Interactivo con Hover y Opacity Shifting */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {SEDES_BOLIVIA.map((sede) => {
            const isHovered = hoveredId === sede.id;
            const isDimmed = hoveredId !== null && !isHovered;

            if (sede.isFeatured && sede.id === 1) {
              // Sede Central La Paz (Tarjeta Grande 2 Columnas)
              return (
                <div
                  key={sede.id}
                  onMouseEnter={() => setHoveredId(sede.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={`relative md:col-span-2 lg:col-span-2 bg-white dark:bg-[#121614] border transition-all duration-300 overflow-hidden flex flex-col justify-between p-6 sm:p-7 group shadow-sm ${
                    isHovered
                      ? 'border-[#D97706] dark:border-[#F59E0B] shadow-[0_0_25px_rgba(217,119,6,0.15)] dark:shadow-[0_0_25px_rgba(245,158,11,0.2)]'
                      : isDimmed
                      ? 'border-[#D4D4D0] dark:border-[#242B27] opacity-60'
                      : 'border-[#D4D4D0] dark:border-[#242B27]'
                  }`}
                >
                  <div className="hud-bracket-tl" />
                  <div className="hud-bracket-tr" />

                  {/* Imagen de fondo con overlay adaptable */}
                  <div className="absolute inset-0 z-0">
                    <img
                      src={sede.imagen}
                      alt={sede.ciudad}
                      className="w-full h-full object-cover opacity-20 dark:opacity-25 filter grayscale contrast-125 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-[#121614] dark:via-[#121614]/80 dark:to-transparent" />
                  </div>

                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="px-2.5 py-1 bg-[#1B3B2B] text-amber-300 dark:bg-[#F59E0B] dark:text-black font-bold uppercase tracking-wider">
                        ★ SEDE PRINCIPAL
                      </span>
                      <span className="text-[#D97706] dark:text-[#F59E0B] font-mono flex items-center gap-1 font-semibold">
                        <Compass className="w-3.5 h-3.5" />
                        {sede.coordenadas}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-2xl sm:text-3xl font-black text-[#111312] dark:text-white font-display uppercase tracking-tight">
                        {sede.ciudad}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#D97706] dark:text-[#F59E0B] font-mono font-medium">
                        {sede.recinto}
                      </p>
                      <p className="text-xs text-[#4B524E] dark:text-zinc-300 pt-1">
                        {sede.direccion}
                      </p>
                    </div>
                  </div>

                  <div className="relative z-10 mt-6 pt-4 border-t border-[#D4D4D0] dark:border-[#242B27] flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-600 dark:text-zinc-400">
                      Central Telefónica: <strong className="text-[#111312] dark:text-white font-mono">{sede.telefono}</strong>
                    </span>
                    <span className="text-[#1B3B2B] dark:text-emerald-400 font-bold bg-[#1B3B2B]/10 dark:bg-[#4D6B53]/20 px-2 py-0.5 border border-[#1B3B2B]/30 dark:border-[#4D6B53]/40">
                      {sede.estado}
                    </span>
                  </div>
                </div>
              );
            }

            if (sede.isFeatured && sede.id === 2) {
              // Filial Cochabamba (Tarjeta con Imagen)
              return (
                <div
                  key={sede.id}
                  onMouseEnter={() => setHoveredId(sede.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={`relative md:col-span-2 lg:col-span-2 bg-white dark:bg-[#121614] border transition-all duration-300 overflow-hidden flex flex-col justify-between p-6 sm:p-7 group shadow-sm ${
                    isHovered
                      ? 'border-[#D97706] dark:border-[#F59E0B] shadow-[0_0_25px_rgba(217,119,6,0.15)] dark:shadow-[0_0_25px_rgba(245,158,11,0.2)]'
                      : isDimmed
                      ? 'border-[#D4D4D0] dark:border-[#242B27] opacity-60'
                      : 'border-[#D4D4D0] dark:border-[#242B27]'
                  }`}
                >
                  <div className="hud-bracket-tl" />
                  <div className="hud-bracket-tr" />

                  {/* Imagen de fondo */}
                  <div className="absolute inset-0 z-0">
                    <img
                      src={sede.imagen}
                      alt={sede.ciudad}
                      className="w-full h-full object-cover opacity-20 dark:opacity-30 filter grayscale contrast-125 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-[#121614] dark:via-[#121614]/80 dark:to-transparent" />
                  </div>

                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="px-2.5 py-1 bg-[#1B3B2B] dark:bg-[#4D6B53] text-white font-bold uppercase tracking-wider">
                        FILIAL REGIONAL
                      </span>
                      <span className="text-zinc-600 dark:text-zinc-400 font-mono flex items-center gap-1">
                        <Compass className="w-3.5 h-3.5 text-[#D97706] dark:text-[#F59E0B]" />
                        {sede.coordenadas}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-2xl font-black text-[#111312] dark:text-white font-display uppercase tracking-tight">
                        {sede.ciudad}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#D97706] dark:text-[#F59E0B] font-mono font-medium">
                        {sede.recinto}
                      </p>
                      <p className="text-xs text-[#4B524E] dark:text-zinc-300 pt-1">
                        {sede.direccion}
                      </p>
                    </div>
                  </div>

                  <div className="relative z-10 mt-6 pt-4 border-t border-[#D4D4D0] dark:border-[#242B27] flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-600 dark:text-zinc-400">
                      Central: <strong className="text-[#111312] dark:text-white font-mono">{sede.telefono}</strong>
                    </span>
                    <span className="text-[#D97706] dark:text-[#F59E0B] font-bold bg-[#D97706]/10 dark:bg-[#F59E0B]/10 px-2 py-0.5 border border-[#D97706]/30 dark:border-[#F59E0B]/30">
                      {sede.estado}
                    </span>
                  </div>
                </div>
              );
            }

            // Sedes Estándar del Bento Grid
            return (
              <div
                key={sede.id}
                onMouseEnter={() => setHoveredId(sede.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`relative bg-white dark:bg-[#121614] border transition-all duration-300 p-5 flex flex-col justify-between group shadow-xs ${
                  isHovered
                    ? 'border-[#D97706] dark:border-[#F59E0B] shadow-[0_0_20px_rgba(217,119,6,0.15)] dark:shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                    : isDimmed
                    ? 'border-[#D4D4D0] dark:border-[#242B27] opacity-60'
                    : 'border-[#D4D4D0] dark:border-[#242B27]'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-zinc-500 dark:text-zinc-400 uppercase font-semibold">
                      FILIAL // {sede.departamento}
                    </span>
                    <span className="text-[10px] text-[#D97706] dark:text-[#F59E0B] font-mono font-medium">
                      {sede.coordenadas.split(' ')[0]}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-[#111312] dark:text-white font-display group-hover:text-[#D97706] dark:group-hover:text-[#F59E0B] transition">
                      {sede.ciudad}
                    </h4>
                    <p className="text-[11px] text-[#D97706]/90 dark:text-[#F59E0B]/90 font-mono mt-0.5">
                      {sede.recinto}
                    </p>
                    <p className="text-xs text-[#4B524E] dark:text-zinc-400 mt-1 line-clamp-2">
                      {sede.direccion}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#D4D4D0] dark:border-[#242B27] flex items-center justify-between text-[11px] font-mono">
                  <span className="text-zinc-600 dark:text-zinc-400 font-mono">
                    Tel: <strong className="text-zinc-900 dark:text-zinc-200">{sede.telefono}</strong>
                  </span>
                  <span className="text-zinc-500 text-[10px]">
                    {sede.estado}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
