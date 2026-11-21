'use client';

import React from 'react';
import {
  Search,
  Plus,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  SlidersHorizontal,
  X,
  FileText,
  Eye,
  CheckCircle2,
} from 'lucide-react';

export interface MetricItem {
  label: string;
  value: string | number;
  color?: string;
  sub?: string;
}

export interface PaginationConfig {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export interface WorkspaceSplitLayoutProps {
  // Toolbar Superior
  title: string;
  subtitle?: string;
  metrics?: MetricItem[];
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  searchPlaceholder?: string;
  filterControls?: React.ReactNode;
  onNew?: () => void;
  newLabel?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  extraActions?: React.ReactNode;

  // Panel Izquierdo: Tabla y Paginación
  tableContent: React.ReactNode;
  pagination?: PaginationConfig;

  // Panel Derecho: Inspector Contextual
  inspectorTitle?: string;
  inspectorSubtitle?: string;
  inspectorContent?: React.ReactNode;
  inspectorActions?: React.ReactNode;
  onCloseInspector?: () => void;
  hasSelection?: boolean;
  emptyInspectorMessage?: string;
  isEditing?: boolean;
}

export default function WorkspaceSplitLayout({
  title,
  subtitle,
  metrics = [],
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Buscar registro...',
  filterControls,
  onNew,
  newLabel = 'Nuevo Registro',
  onRefresh,
  isRefreshing = false,
  extraActions,
  tableContent,
  pagination,
  inspectorTitle = 'EXPEDIENTE // DETALLE',
  inspectorSubtitle,
  inspectorContent,
  inspectorActions,
  onCloseInspector,
  hasSelection = false,
  emptyInspectorMessage = 'Seleccione un registro de la tabla para inspeccionar su ficha técnica o pulse [+ Nuevo].',
  isEditing = false,
}: WorkspaceSplitLayoutProps) {
  // Cálculo de rango de elementos en la página actual
  const startItem = pagination
    ? Math.min((pagination.currentPage - 1) * pagination.pageSize + 1, pagination.totalItems)
    : 0;
  const endItem = pagination
    ? Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)
    : 0;

  return (
    <div className="h-full w-full flex flex-col min-h-0 overflow-hidden bg-[var(--bg-base)] text-[var(--text-main)] font-sans">
      {/* ── Toolbar Superior Compacta (48px) ────────────────────────── */}
      <header className="h-12 min-h-[48px] max-h-[48px] bg-white dark:bg-[#121614] border-b border-[#D4D4D0] dark:border-[#242B27] px-3 sm:px-4 flex items-center justify-between gap-3 shrink-0 z-10 shadow-xs">
        {/* Título y Métricas Clave en Línea */}
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2 h-2 rounded-none bg-[#D97706] dark:bg-[#F59E0B]" />
            <h1 className="text-xs sm:text-sm font-black font-display uppercase tracking-tight truncate text-[#111312] dark:text-white">
              {title}
            </h1>
          </div>

          {/* Métricas Compactas en Línea (Sin cajas gigantes) */}
          {metrics.length > 0 && (
            <div className="hidden md:flex items-center gap-3 pl-3 border-l border-[#D4D4D0] dark:border-[#242B27] text-xs font-mono">
              {metrics.map((m, idx) => (
                <div key={idx} className="flex items-center gap-1.5 whitespace-nowrap">
                  <span className="text-[10px] text-zinc-500 uppercase">{m.label}:</span>
                  <span
                    className="font-bold tabular-nums"
                    style={{ color: m.color || 'inherit' }}
                  >
                    {m.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Buscador Rápido, Filtros y Acciones */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Input de Búsqueda Instantánea */}
          {onSearchChange !== undefined && (
            <div className="relative w-36 sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery ?? ''}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full bg-[#F4F3EF] dark:bg-[#0A0C0B] border border-[#D4D4D0] dark:border-[#242B27] focus:border-[#D97706] dark:focus:border-[#F59E0B] pl-8 pr-2.5 py-1 text-xs font-mono text-[#111312] dark:text-white outline-none rounded-none"
              />
            </div>
          )}

          {/* Filtros Personalizados del Módulo */}
          {filterControls && (
            <div className="hidden sm:flex items-center gap-1.5">{filterControls}</div>
          )}

          {/* Botón de Recarga / Refresco */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-1.5 bg-[#F4F3EF] dark:bg-[#0A0C0B] border border-[#D4D4D0] dark:border-[#242B27] hover:border-zinc-400 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition disabled:opacity-50"
              title="Actualizar datos"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          )}

          {/* Acciones Adicionales */}
          {extraActions}

          {/* Botón Principal + Nuevo */}
          {onNew && (
            <button
              onClick={onNew}
              className="px-3 py-1.5 bg-[#1B3B2B] hover:bg-[#12281D] text-amber-300 dark:bg-[#F59E0B] dark:hover:bg-[#D97706] dark:text-black font-mono font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5 shadow-xs shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{newLabel}</span>
              <span className="sm:hidden">Nuevo</span>
            </button>
          )}
        </div>
      </header>

      {/* ── Cuerpo Dividido (Master-Detail Grid 12 Columnas) ───────── */}
      <div className="flex-1 grid grid-cols-12 min-h-0 overflow-hidden">
        {/* Panel Izquierdo — Tabla Paginada (8 Columnas en Desktop) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col justify-between min-h-0 border-r border-[#D4D4D0] dark:border-[#242B27] bg-[var(--bg-base)]">
          {/* Contenedor de la Tabla con Scroll Vertical Propio */}
          <div className="flex-1 min-h-0 overflow-y-auto">{tableContent}</div>

          {/* Barra de Paginación Fija al Fondo (44px) */}
          {pagination && (
            <div className="h-11 min-h-[44px] max-h-[44px] bg-white dark:bg-[#121614] border-t border-[#D4D4D0] dark:border-[#242B27] px-3 sm:px-4 flex items-center justify-between text-xs font-mono shrink-0">
              {/* Contador de Registros */}
              <div className="text-zinc-600 dark:text-zinc-400 text-[11px] tabular-nums">
                Mostrando{' '}
                <strong className="text-[#111312] dark:text-white">
                  {pagination.totalItems === 0 ? 0 : `${startItem}–${endItem}`}
                </strong>{' '}
                de <strong className="text-[#111312] dark:text-white">{pagination.totalItems}</strong>
              </div>

              {/* Botones de Navegación de Página */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => pagination.onPageChange(1)}
                  disabled={pagination.currentPage <= 1}
                  className="p-1 bg-[#F4F3EF] dark:bg-[#0A0C0B] border border-[#D4D4D0] dark:border-[#242B27] text-zinc-700 dark:text-zinc-300 disabled:opacity-30 disabled:pointer-events-none hover:border-[#D97706] dark:hover:border-[#F59E0B] transition"
                  title="Primera página"
                >
                  <ChevronsLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage <= 1}
                  className="p-1 bg-[#F4F3EF] dark:bg-[#0A0C0B] border border-[#D4D4D0] dark:border-[#242B27] text-zinc-700 dark:text-zinc-300 disabled:opacity-30 disabled:pointer-events-none hover:border-[#D97706] dark:hover:border-[#F59E0B] transition"
                  title="Página anterior"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                <span className="px-2.5 py-0.5 bg-[#EAE8E1] dark:bg-[#181E1B] border border-[#D4D4D0] dark:border-[#242B27] text-[11px] font-bold text-[#D97706] dark:text-[#F59E0B] tabular-nums">
                  {pagination.currentPage} / {Math.max(pagination.totalPages, 1)}
                </span>

                <button
                  onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage >= pagination.totalPages}
                  className="p-1 bg-[#F4F3EF] dark:bg-[#0A0C0B] border border-[#D4D4D0] dark:border-[#242B27] text-zinc-700 dark:text-zinc-300 disabled:opacity-30 disabled:pointer-events-none hover:border-[#D97706] dark:hover:border-[#F59E0B] transition"
                  title="Siguiente página"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => pagination.onPageChange(pagination.totalPages)}
                  disabled={pagination.currentPage >= pagination.totalPages}
                  className="p-1 bg-[#F4F3EF] dark:bg-[#0A0C0B] border border-[#D4D4D0] dark:border-[#242B27] text-zinc-700 dark:text-zinc-300 disabled:opacity-30 disabled:pointer-events-none hover:border-[#D97706] dark:hover:border-[#F59E0B] transition"
                  title="Última página"
                >
                  <ChevronsRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Panel Derecho — Inspector Contextual (4 Columnas en Desktop) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col min-h-0 overflow-y-auto bg-white dark:bg-[#121614] border-t lg:border-t-0 border-[#D4D4D0] dark:border-[#242B27]">
          {/* Header del Inspector */}
          <div className="p-3 border-b border-[#D4D4D0] dark:border-[#242B27] flex items-center justify-between shrink-0 bg-[#F4F3EF]/60 dark:bg-[#0D100F]">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-1.5 h-1.5 bg-[#D97706] dark:bg-[#F59E0B]" />
              <div className="min-w-0">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#111312] dark:text-white block truncate">
                  {isEditing ? 'MODO EDICIÓN // FORMULARIO' : inspectorTitle}
                </span>
                {inspectorSubtitle && (
                  <span className="text-[10px] font-mono text-zinc-500 block truncate">
                    {inspectorSubtitle}
                  </span>
                )}
              </div>
            </div>

            {onCloseInspector && hasSelection && (
              <button
                onClick={onCloseInspector}
                className="p-1 text-zinc-400 hover:text-black dark:hover:text-white transition"
                title="Cerrar ficha"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Cuerpo del Inspector */}
          <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4">
            {hasSelection || isEditing ? (
              inspectorContent
            ) : (
              /* Estado Vacío Táctico */
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 text-zinc-500">
                <div className="w-12 h-12 bg-[#F4F3EF] dark:bg-[#0A0C0B] border border-[#D4D4D0] dark:border-[#242B27] flex items-center justify-center text-zinc-400">
                  <FileText className="w-6 h-6 stroke-[1.5]" />
                </div>
                <div className="space-y-1 max-w-xs">
                  <p className="text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300 uppercase">
                    Consola de Inspección
                  </p>
                  <p className="text-[11px] font-mono leading-relaxed text-zinc-500">
                    {emptyInspectorMessage}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Barra de Acciones del Inspector (Fija abajo) */}
          {(hasSelection || isEditing) && inspectorActions && (
            <div className="p-3 border-t border-[#D4D4D0] dark:border-[#242B27] bg-[#F4F3EF]/50 dark:bg-[#0D100F] shrink-0">
              {inspectorActions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
