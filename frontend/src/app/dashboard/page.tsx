'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  GraduationCap,
  Layers,
  ClipboardEdit,
  Landmark,
  Package,
  LineChart,
  Database,
  FolderTree,
  Award,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Timer,
  Wallet,
  BookOpen,
  Star,
  BookMarked,
  UserCheck,
  ShieldCheck,
  Sparkles,
  Building2,
  Clock,
  Activity,
  Shield,
  FileText,
  AlertCircle,
  Bell,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useAuthRole, RolUsuario } from '@/context/AuthRoleContext';
import { DonutChart, BarTrendChart } from '@/components/workspace/TacticalCharts';

interface KpiCard {
  label: string;
  value: string | number;
  sub?: string;
  icon: any;
  color: string;
}

interface ModuloCard {
  href: string;
  titulo: string;
  desc: string;
  icon: any;
}

const PLANES_OFICIALES = [
  { nombre: 'Plan Idioma Inglés', codigo: 'ING', niveles: '6 Niveles • STANAG 6001', estado: 'Vigente', cupo: '88% Ocup.' },
  { nombre: 'Plan Idioma Francés', codigo: 'FRA', niveles: '4 Niveles • Cooperación', estado: 'Vigente', cupo: '72% Ocup.' },
  { nombre: 'Plan Idioma Ruso', codigo: 'RUS', niveles: '4 Niveles • Técnico Táctico', estado: 'Vigente', cupo: '65% Ocup.' },
  { nombre: 'Plan Idioma Mandarín', codigo: 'MAN', niveles: '3 Niveles • HSK Acreditado', estado: 'Vigente', cupo: '80% Ocup.' },
  { nombre: 'Plan Idioma Quechua', codigo: 'QUE', niveles: '2 Niveles • Intercultural', estado: 'Vigente', cupo: '90% Ocup.' },
  { nombre: 'Plan Idioma Alemán', codigo: 'ALE', niveles: '3 Niveles • Académico', estado: 'Vigente', cupo: '60% Ocup.' },
  { nombre: 'Plan Idioma Portugués', codigo: 'POR', niveles: '2 Niveles • Mercosur', estado: 'Vigente', cupo: '55% Ocup.' },
];

const ACTIVIDAD_RECIENTE = [
  { id: 1, hora: '10:42', usuario: 'Sgto. 1ro. Mamani', accion: 'Calificaciones registradas en ING-101-A', tipo: 'calif' },
  { id: 2, hora: '10:35', usuario: 'Ventanilla 1 (Caja)', accion: 'Cobro matrícula regular B2 - Recibo #4092', tipo: 'caja' },
  { id: 3, hora: '10:18', usuario: 'Jefatura Académica', accion: 'Relevo pedagógico programado (Doc. Laura Pérez)', tipo: 'docente' },
  { id: 4, hora: '09:55', usuario: 'Almacén Central', accion: 'Alerta stock crítico: English File Intermediate (8 un.)', tipo: 'almacen' },
  { id: 5, hora: '09:30', usuario: 'Cap. Vargas M.', accion: 'Parte de asistencia 100% verificado en RUS-201', tipo: 'asistencia' },
  { id: 6, hora: '08:45', usuario: 'Sistema SACA', accion: 'Sincronización de nómina y expediente con CEDMIL', tipo: 'sistema' },
];

function getDashboardConfig(rol: RolUsuario, kpis: any) {
  switch (rol) {
    case 'ADMIN':
      return {
        subtitulo: 'Centro de comando institucional: control académico, financiero y telemetría operativa.',
        kpiCards: [
          { label: 'Estudiantes', value: kpis?.estudiantes?.total || 450, sub: `${kpis?.estudiantes?.militares || 280} mil. • ${kpis?.estudiantes?.civiles || 170} civ.`, icon: Users, color: '#10b981' },
          { label: 'Docentes', value: kpis?.docentes?.activos || 22, sub: 'Cuerpo activo', icon: GraduationCap, color: '#3b82f6' },
          { label: 'Paralelos', value: kpis?.paralelos?.activos || 26, sub: 'Aperturados', icon: Layers, color: '#f59e0b' },
          { label: 'Inscripciones', value: kpis?.inscripciones?.activas || 450, sub: 'Matriculados activos', icon: ClipboardEdit, color: '#8b5cf6' },
          { label: 'En Espera Cajas', value: kpis?.cajas?.en_espera || 0, sub: 'En sala de espera', icon: Landmark, color: '#ef4444' },
          { label: 'Stock Textos', value: kpis?.almacen?.total_unidades || 673, sub: `${kpis?.almacen?.alertas_reorden || 12} por reponer`, icon: Package, color: '#64748b' },
        ] as KpiCard[],
        modulos: [
          { href: '/estudiantes', titulo: 'Estudiantes', desc: 'Expedientes civiles y militares.', icon: Users },
          { href: '/paralelos', titulo: 'Paralelos', desc: 'Apertura y asignación de cátedra.', icon: Layers },
          { href: '/inscripciones', titulo: 'Inscripciones', desc: 'Matriculación formal y avance.', icon: ClipboardEdit },
          { href: '/calificaciones', titulo: 'Calificaciones', desc: 'Actas de evaluación y promedio.', icon: Award },
          { href: '/asistencia', titulo: 'Asistencia', desc: 'Partes diarios y previsualización.', icon: UserCheck },
          { href: '/cajas', titulo: 'Cajas', desc: 'Ventanillas, turnos y recaudación.', icon: Landmark },
          { href: '/almacen', titulo: 'Almacén', desc: 'Inventario de textos y reposición.', icon: Package },
          { href: '/docentes', titulo: 'Docentes', desc: 'Rotación pedagógica cada 15 días.', icon: GraduationCap },
        ] as ModuloCard[],
      };

    case 'JEFE_ACADEMICO':
      return {
        subtitulo: 'Supervisión académica: planes de idiomas, docentes, inscripciones y calificaciones.',
        kpiCards: [
          { label: 'Estudiantes', value: kpis?.estudiantes?.total || 450, sub: `${kpis?.estudiantes?.militares || 280} mil. • ${kpis?.estudiantes?.civiles || 170} civ.`, icon: Users, color: '#10b981' },
          { label: 'Docentes', value: kpis?.docentes?.activos || 22, sub: 'Activos en gestión', icon: GraduationCap, color: '#3b82f6' },
          { label: 'Paralelos', value: kpis?.paralelos?.activos || 26, sub: 'Cursos vigentes', icon: Layers, color: '#f59e0b' },
          { label: 'Inscripciones', value: kpis?.inscripciones?.activas || 450, sub: 'Matriculados activos', icon: ClipboardEdit, color: '#8b5cf6' },
          { label: 'Rotaciones', value: kpis?.docentes?.alertas_rotacion_15d || 1, sub: 'Límite 15 días alcanzado', icon: Clock, color: '#ef4444' },
          { label: 'Evaluación', value: '84.2%', sub: 'Aprobación institucional', icon: Award, color: '#10b981' },
        ] as KpiCard[],
        modulos: [
          { href: '/estructura', titulo: 'Estructura Académica', desc: 'Planes de idioma y niveles.', icon: FolderTree },
          { href: '/docentes', titulo: 'Docentes', desc: 'Competencias y rotación.', icon: GraduationCap },
          { href: '/estudiantes', titulo: 'Estudiantes', desc: 'Expedientes por curso.', icon: Users },
          { href: '/paralelos', titulo: 'Paralelos', desc: 'Cursos y asignación aula.', icon: Layers },
          { href: '/calificaciones', titulo: 'Calificaciones', desc: 'Supervisión de notas y actas.', icon: Award },
          { href: '/asistencia', titulo: 'Asistencia', desc: 'Partes oficiales de aula.', icon: UserCheck },
        ] as ModuloCard[],
      };

    case 'DOCENTE':
      const misParalelosVal = kpis?.docente_personal?.mis_paralelos_count ?? 1;
      const alumnosEnAulaVal = kpis?.docente_personal?.estudiantes_en_aula ?? 18;
      const califPendientesVal = kpis?.docente_personal?.calificaciones_pendientes ?? 0;
      return {
        subtitulo: 'Mis paralelos asignados, control de asistencia y calificaciones.',
        kpiCards: [
          { label: 'Mis Paralelos', value: misParalelosVal, sub: 'Asignados esta gestión', icon: Layers, color: '#10b981' },
          { label: 'Estudiantes en Aula', value: alumnosEnAulaVal, sub: 'En mis cursos asignados', icon: Users, color: '#3b82f6' },
          { label: 'Calificaciones', value: califPendientesVal, sub: 'Pendientes de registro', icon: Award, color: '#f59e0b' },
          { label: 'Rotación Restante', value: '9 días', sub: 'Próximo cambio pedagógico', icon: Clock, color: '#3b82f6' },
        ] as KpiCard[],
        modulos: [
          { href: '/paralelos', titulo: 'Mis Paralelos', desc: 'Cursos y horarios asignados.', icon: Layers },
          { href: '/calificaciones', titulo: 'Calificaciones', desc: 'Evaluaciones y notas.', icon: Award },
          { href: '/asistencia', titulo: 'Control Asistencia', desc: 'Parte diario de asistencia.', icon: UserCheck },
        ] as ModuloCard[],
      };

    case 'CAJERO':
      return {
        subtitulo: 'Atención en ventanilla, cobros de aranceles y comprobantes oficiales.',
        kpiCards: [
          { label: 'En Sala de Espera', value: kpis?.cajas?.en_espera || 0, sub: 'Esperando atención', icon: Timer, color: '#ef4444' },
          { label: 'Atendidos Hoy', value: kpis?.cajas?.atendidas_hoy || 0, sub: 'Turnos completados', icon: CheckCircle2, color: '#10b981' },
          { label: 'Recaudación Periodo', value: `Bs ${kpis?.financiero?.ingresos_mes_bs || 375}`, sub: 'Registrado en el periodo', icon: Wallet, color: '#f59e0b' },
          { label: 'Ventanillas', value: '3 Operativas', sub: 'Militares / Civiles / Libros', icon: Landmark, color: '#3b82f6' },
        ] as KpiCard[],
        modulos: [
          { href: '/cajas', titulo: 'Cajas y Recaudaciones', desc: 'Llamada a ventanilla y cobros.', icon: Landmark },
        ] as ModuloCard[],
      };

    case 'ALMACENERO':
      return {
        subtitulo: 'Existencias de textos, control de movimientos y órdenes de reposición.',
        kpiCards: [
          { label: 'Stock Total', value: kpis?.almacen?.total_unidades || 673, sub: 'Unidades en depósito', icon: Package, color: '#3b82f6' },
          { label: 'Por Reponer', value: kpis?.almacen?.alertas_reorden || 12, sub: 'Títulos bajo umbral', icon: AlertTriangle, color: '#ef4444' },
          { label: 'Salidas Mes', value: kpis?.almacen?.salidas_mes || 0, sub: 'Entregas por paralelo', icon: BookMarked, color: '#10b981' },
          { label: 'Títulos Activos', value: '24', sub: 'Catálogo de textos oficiales', icon: BookOpen, color: '#f59e0b' },
        ] as KpiCard[],
        modulos: [
          { href: '/almacen', titulo: 'Almacén de Libros', desc: 'Inventario y reposición.', icon: Package },
        ] as ModuloCard[],
      };

    case 'ESTUDIANTE':
    default:
      const misCursosVal = kpis?.estudiante_personal?.mis_cursos_count ?? 0;
      const promedioRaw = kpis?.estudiante_personal?.promedio_general;
      const promedioVal = (promedioRaw !== null && promedioRaw !== undefined && promedioRaw !== '')
        ? promedioRaw
        : '--';
      const asistenciaRaw = kpis?.estudiante_personal?.asistencia_porcentaje;
      const asistenciaVal = (asistenciaRaw !== null && asistenciaRaw !== undefined && misCursosVal > 0)
        ? `${asistenciaRaw}%`
        : '--';
      return {
        subtitulo: 'Tu avance académico, asignaturas cursadas y estado de matrícula.',
        kpiCards: [
          { label: 'Mis Cursos', value: misCursosVal, sub: 'Inscritos actualmente', icon: BookOpen, color: '#3b82f6' },
          { label: 'Promedio', value: promedioVal, sub: (promedioRaw !== null && promedioRaw !== undefined && promedioRaw !== '') ? 'General acumulado' : 'Sin materias evaluadas', icon: Star, color: '#f59e0b' },
          { label: 'Asistencia', value: asistenciaVal, sub: misCursosVal > 0 ? 'Asistencia regular' : 'Sin cursos activos', icon: CheckCircle2, color: '#10b981' },
          { label: 'Estado Matrícula', value: misCursosVal > 0 ? 'Regular' : 'Pendiente', sub: 'Gestión 2026', icon: ShieldCheck, color: '#10b981' },
        ] as KpiCard[],
        modulos: [
          { href: '/inscripciones', titulo: 'Mis Inscripciones', desc: 'Cursos inscritos y avance.', icon: ClipboardEdit },
          { href: '/calificaciones', titulo: 'Mis Calificaciones', desc: 'Calificaciones y actas.', icon: Award },
          { href: '/cajas', titulo: 'Turnos en Caja', desc: 'Ficha digital para trámites.', icon: Landmark },
        ] as ModuloCard[],
      };
  }
}

export default function DashboardSacaPage() {
  const { rolActivo, usuario, esAdmin, esJefeAcademico } = useAuthRole();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const cargarDashboard = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (rolActivo === 'ESTUDIANTE') {
        if (usuario.id_estudiante) {
          params.set('id_estudiante', usuario.id_estudiante.toString());
        }
        if (usuario.email) params.set('email', usuario.email);
        if (usuario.ci) params.set('ci', usuario.ci);
      } else if (rolActivo === 'DOCENTE') {
        const idDoc = usuario.id_docente || 1;
        params.set('id_docente', idDoc.toString());
        if (usuario.email) params.set('email', usuario.email);
      }
      params.set('rol', rolActivo);
      const url = `/api/v1/dashboard?${params.toString()}`;
      const res = await fetch(url);
      if (res.ok) {
        const d = await res.json();
        setData(d);
      }
    } catch (e) {
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDashboard();
  }, [rolActivo, usuario.id_estudiante, usuario.id_docente, usuario.email]);

  const kpisData = { ...(data?.kpis || {}), estudiante_personal: data?.estudiante_personal, docente_personal: data?.docente_personal };
  const config = getDashboardConfig(rolActivo, kpisData);

  // Datos para Gráfico Donut (Distribución Estudiantil)
  const donutEstudiantes = [
    { label: 'Militares', value: kpisData?.estudiantes?.militares || 280, color: '#15803d' },
    { label: 'Civiles', value: kpisData?.estudiantes?.civiles || 170, color: '#3b82f6' },
    { label: 'Becarios FFAA', value: 25, color: '#f59e0b' },
  ];

  // Datos para Gráfico de Barras (Matrícula por Idioma)
  const barIdiomas = [
    { label: 'ING', value: 210, highlight: true },
    { label: 'FRA', value: 75 },
    { label: 'RUS', value: 45 },
    { label: 'MAN', value: 38 },
    { label: 'QUE', value: 52 },
    { label: 'ALE', value: 30 },
    { label: 'POR', value: 25 },
  ];

  return (
    <div className="h-full w-full flex flex-col gap-2 p-2.5 overflow-hidden bg-[var(--bg-base)] text-[var(--text-main)] select-none">
      {/* 1. FRANJA SUPERIOR DE CONTROL Y ESTADO (36px) */}
      <div className="h-9 shrink-0 flex items-center justify-between px-3 bg-[var(--bg-surface)] border border-[var(--border-fine)] rounded-[2px]">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] bg-[var(--military-green-subtle)] border border-[var(--border-accent)] text-[var(--military-green-primary)] dark:text-[var(--military-gold-primary)] font-mono text-[10.5px] font-bold shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>SACA // COCKPIT EJECUTIVO</span>
          </div>

          <div className="h-3.5 w-[1px] bg-[var(--border-fine)] shrink-0" />

          <div className="flex items-center gap-1.5 text-xs truncate">
            <span className="font-bold text-[var(--text-main)] truncate font-sans">
              {usuario.nombre || 'Comandante de Sistema'}
            </span>
            <span className="text-[10px] text-[var(--text-muted)] font-mono hidden md:inline">
              [{rolActivo} • GESTIÓN {data?.gestion_activa || '2026'}]
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-mono text-[var(--text-muted)] hidden sm:inline">
            ESCUELA DE IDIOMAS DEL EJÉRCITO &bull; LA PAZ
          </span>
          <button
            onClick={cargarDashboard}
            disabled={loading}
            className="btn btn-secondary flex items-center gap-1.5 text-[10.5px] px-2.5 py-1 rounded-[2px]"
            title="Refrescar telemetría"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Sincronizar</span>
          </button>
        </div>
      </div>

      {/* 2. TIRA DE TELEMETRÍA CONTINUA (LEDGER RIBBON - 64px) */}
      <div className="h-16 shrink-0 border border-[var(--border-fine)] rounded-[2px] bg-[var(--bg-card)] shadow-xs overflow-hidden">
        <div className={`grid h-full divide-x divide-[var(--border-fine)] ${
          config.kpiCards.length <= 4
            ? 'grid-cols-2 sm:grid-cols-4'
            : 'grid-cols-3 sm:grid-cols-6'
        }`}>
          {config.kpiCards.map((kpi, i) => {
            const Icon = kpi.icon;
            return (
              <div
                key={i}
                className="px-3 py-1.5 flex flex-col justify-between bg-[var(--bg-card)] hover:bg-[var(--bg-surface)]/60 transition-colors"
              >
                <div className="flex items-center justify-between text-[var(--text-muted)]">
                  <span className="text-[9.5px] font-bold uppercase tracking-wider truncate font-sans">
                    {kpi.label}
                  </span>
                  <Icon className="w-3 h-3 text-[var(--color-accent)] shrink-0" />
                </div>
                <div className="flex items-baseline justify-between gap-1">
                  <p className="text-xl font-black font-mono text-[var(--text-main)] leading-none tabular-nums">
                    {kpi.value}
                  </p>
                  {kpi.sub && (
                    <span className="text-[9.5px] text-[var(--text-muted)] font-mono truncate text-right">
                      {kpi.sub}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. ÁREA CENTRAL ANALÍTICA Y OPERATIVA (FLEX-1 GRID) */}
      <div className="flex-1 min-h-0 grid grid-cols-12 gap-2.5 overflow-hidden">
        {/* Panel Izquierdo: Gráfico Donut de Composición Estudiantil */}
        <div className="col-span-12 lg:col-span-4 bg-[var(--bg-card)] border border-[var(--border-fine)] rounded-[2px] p-3 flex flex-col justify-between shadow-xs overflow-hidden">
          <div className="flex items-center justify-between pb-1.5 border-b border-[var(--border-fine)]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-main)] flex items-center gap-1.5 font-sans">
              <Users className="w-3.5 h-3.5 text-[var(--color-accent)]" />
              Efectivo Estudiantil
            </span>
            <span className="text-[10px] font-mono text-[var(--color-accent)] font-bold">
              ESTADO MAYOR
            </span>
          </div>

          <div className="flex-1 min-h-0 py-2 flex items-center justify-center">
            <DonutChart
              data={donutEstudiantes}
              centerLabel="ALUMNOS"
              centerValue={kpisData?.estudiantes?.total || 475}
              size={120}
              className="w-full"
            />
          </div>

          <div className="pt-2 border-t border-[var(--border-fine)] flex items-center justify-between text-[10.5px] font-mono text-[var(--text-muted)]">
            <span>Régimen: Presencial/Vespertino</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">● OPERATIVO</span>
          </div>
        </div>

        {/* Panel Central: Gráfico de Tendencia de Matrícula por Idioma */}
        <div className="col-span-12 lg:col-span-5 bg-[var(--bg-card)] border border-[var(--border-fine)] rounded-[2px] p-3 flex flex-col justify-between shadow-xs overflow-hidden">
          <div className="flex items-center justify-between pb-1.5 border-b border-[var(--border-fine)]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-main)] flex items-center gap-1.5 font-sans">
              <LineChart className="w-3.5 h-3.5 text-[var(--color-accent)]" />
              Matrícula por Idioma
            </span>
            <span className="text-[10px] font-mono text-[var(--text-muted)]">
              Cursos Activos (N=26)
            </span>
          </div>

          <div className="flex-1 min-h-0 py-1">
            <BarTrendChart
              data={barIdiomas}
              unit="est."
              height="100%"
              className="w-full h-full"
            />
          </div>

          <div className="pt-2 border-t border-[var(--border-fine)] flex items-center justify-between text-[10.5px] font-mono text-[var(--text-muted)]">
            <span>Líder: Idioma Inglés (STANAG)</span>
            <span className="text-[var(--color-accent)] font-bold">Capacidad: 84%</span>
          </div>
        </div>

        {/* Panel Derecho: Alertas Operativas y Acciones Tácticas */}
        <div className="col-span-12 lg:col-span-3 bg-[var(--bg-card)] border border-[var(--border-fine)] rounded-[2px] p-3 flex flex-col justify-between shadow-xs overflow-hidden">
          <div className="flex items-center justify-between pb-1.5 border-b border-[var(--border-fine)]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-main)] flex items-center gap-1.5 font-sans">
              <Bell className="w-3.5 h-3.5 text-[var(--color-accent)]" />
              Alertas y Acciones
            </span>
            <span className="text-[9.5px] px-1.5 py-0.2 rounded-[2px] bg-red-950/30 text-red-500 font-mono font-bold border border-red-500/30">
              3 EVENTOS
            </span>
          </div>

          {/* Lista Compacta de Alertas */}
          <div className="space-y-1.5 py-1.5 text-xs overflow-y-auto pr-0.5">
            <div className="p-1.5 rounded-[2px] bg-[var(--bg-surface)] border border-amber-500/30 flex items-start gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="font-bold text-[11px] text-[var(--text-main)] truncate">Rotación Pedagógica</p>
                <p className="text-[10px] text-[var(--text-muted)] leading-tight">1 docente completó 15 días en aula.</p>
              </div>
            </div>

            <div className="p-1.5 rounded-[2px] bg-[var(--bg-surface)] border border-red-500/30 flex items-start gap-2">
              <Package className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="font-bold text-[11px] text-[var(--text-main)] truncate">Stock de Textos</p>
                <p className="text-[10px] text-[var(--text-muted)] leading-tight">12 títulos bajo umbral de reposición.</p>
              </div>
            </div>

            <div className="p-1.5 rounded-[2px] bg-[var(--bg-surface)] border border-emerald-500/30 flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="font-bold text-[11px] text-[var(--text-main)] truncate">Ventanillas de Caja</p>
                <p className="text-[10px] text-[var(--text-muted)] leading-tight">0 en espera • Atención inmediata.</p>
              </div>
            </div>
          </div>

          {/* Acciones Rápidas de 1 Clic */}
          <div className="pt-2 border-t border-[var(--border-fine)] space-y-1">
            <div className="grid grid-cols-2 gap-1.5">
              <Link
                href="/estudiantes"
                className="btn btn-secondary text-[10px] font-bold py-1 px-1.5 flex items-center justify-center gap-1 truncate"
              >
                <Users className="w-3 h-3 text-[var(--color-accent)]" /> Estudiantes
              </Link>
              <Link
                href="/paralelos"
                className="btn btn-secondary text-[10px] font-bold py-1 px-1.5 flex items-center justify-center gap-1 truncate"
              >
                <Layers className="w-3 h-3 text-[var(--color-accent)]" /> Paralelos
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <Link
                href="/calificaciones"
                className="btn btn-secondary text-[10px] font-bold py-1 px-1.5 flex items-center justify-center gap-1 truncate"
              >
                <Award className="w-3 h-3 text-[var(--color-accent)]" /> Calificaciones
              </Link>
              <Link
                href="/cajas"
                className="btn btn-secondary text-[10px] font-bold py-1 px-1.5 flex items-center justify-center gap-1 truncate"
              >
                <Landmark className="w-3 h-3 text-[var(--color-accent)]" /> Cajas
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 4. FRANJA INFERIOR DUAL: PLANES INSTITUCIONALES Y BITÁCORA EN VIVO (200px) */}
      <div className="h-48 shrink-0 grid grid-cols-12 gap-2.5 overflow-hidden">
        {/* Subpanel Izquierdo (7 cols): Planes Oficiales & Estado Curricular */}
        <div className="col-span-12 lg:col-span-7 bg-[var(--bg-card)] border border-[var(--border-fine)] rounded-[2px] p-2.5 flex flex-col justify-between shadow-xs overflow-hidden">
          <div className="flex items-center justify-between pb-1.5 border-b border-[var(--border-fine)]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-main)] flex items-center gap-1.5 font-sans">
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-accent)]" />
              Programas de Idiomas Oficiales (CEDMIL)
            </span>
            <span className="text-[10px] font-mono text-[var(--text-muted)]">
              7 Planes Activos • Régimen 2026
            </span>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[var(--border-fine)] text-[10px] font-mono text-[var(--text-muted)] uppercase">
                  <th className="py-1 px-2">Código</th>
                  <th className="py-1 px-2">Programa</th>
                  <th className="py-1 px-2">Estructura</th>
                  <th className="py-1 px-2">Cupos</th>
                  <th className="py-1 px-2 text-right">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-fine)] font-mono text-[11px]">
                {PLANES_OFICIALES.map((plan, idx) => (
                  <tr key={idx} className="hover:bg-[var(--bg-surface)]/60 transition-colors">
                    <td className="py-1 px-2 font-bold text-[var(--color-accent)]">{plan.codigo}</td>
                    <td className="py-1 px-2 font-sans font-semibold text-[var(--text-main)] truncate max-w-[160px]">
                      {plan.nombre}
                    </td>
                    <td className="py-1 px-2 text-[var(--text-muted)] text-[10px]">{plan.niveles}</td>
                    <td className="py-1 px-2 text-[10.5px] text-emerald-600 dark:text-emerald-400 font-bold">{plan.cupo}</td>
                    <td className="py-1 px-2 text-right">
                      <span className="text-[9.5px] px-1.5 py-0.5 rounded-[2px] bg-[var(--bg-surface)] border border-[var(--border-fine)] text-[var(--text-main)] font-bold">
                        {plan.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-1.5 border-t border-[var(--border-fine)] flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)]">
            <span>Certificación Oficial bajo Normativa STANAG 6001</span>
            <Link href="/estructura" className="text-[var(--color-accent)] hover:underline flex items-center gap-1 font-bold">
              Ver Estructura Curricular &rarr;
            </Link>
          </div>
        </div>

        {/* Subpanel Derecho (5 cols): Telemetría en Vivo & Bitácora Operativa */}
        <div className="col-span-12 lg:col-span-5 bg-[var(--bg-card)] border border-[var(--border-fine)] rounded-[2px] p-2.5 flex flex-col justify-between shadow-xs overflow-hidden">
          <div className="flex items-center justify-between pb-1.5 border-b border-[var(--border-fine)]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-main)] flex items-center gap-1.5 font-sans">
              <Activity className="w-3.5 h-3.5 text-[var(--color-accent)]" />
              Telemetría en Vivo // Bitácora
            </span>
            <span className="text-[10px] font-mono text-emerald-500 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              ONLINE
            </span>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto space-y-1.5 pr-1 py-1">
            {ACTIVIDAD_RECIENTE.map((act) => (
              <div
                key={act.id}
                className="p-1.5 rounded-[2px] bg-[var(--bg-surface)] border border-[var(--border-fine)] flex items-center justify-between text-xs font-mono"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[10px] text-[var(--color-accent)] font-bold shrink-0">
                    {act.hora}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10.5px] text-[var(--text-main)] truncate font-sans font-medium">
                      {act.accion}
                    </p>
                    <p className="text-[9.5px] text-[var(--text-muted)] truncate">
                      {act.usuario}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-3 h-3 text-[var(--text-muted)] shrink-0 ml-1" />
              </div>
            ))}
          </div>

          <div className="pt-1.5 border-t border-[var(--border-fine)] flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)]">
            <span>Sincronización en tiempo real</span>
            <Link href="/logs" className="text-[var(--color-accent)] hover:underline flex items-center gap-1 font-bold">
              Auditoría Completa &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
