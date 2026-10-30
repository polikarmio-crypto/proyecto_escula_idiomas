'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  GraduationCap,
  Clock,
  Package,
  Layers,
  Award,
  Landmark,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  RefreshCw,
  Database,
  FolderTree,
  ClipboardEdit,
  LineChart,
  Home,
  ChevronRight,
  Calendar,
  FileText,
  TrendingUp,
  BarChart3,
  Wallet,
  AlertTriangle,
  ClipboardList,
  BookMarked,
  Timer,
  Star,
} from 'lucide-react';
import { useAuthRole, RolUsuario } from '@/context/AuthRoleContext';

interface KpiCard {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  color: string;
}

interface ModuloCard {
  href: string;
  titulo: string;
  desc: string;
  icon: React.ElementType;
}

function getDashboardConfig(rol: RolUsuario, data: any) {
  const kpis = data?.kpis;

  switch (rol) {
    case 'ADMIN':
      return {
        subtitulo: 'Panel general de control y gestión académica institucional.',
        kpiCards: [
          { label: 'Estudiantes', value: kpis?.estudiantes?.total || 0, sub: `${kpis?.estudiantes?.militares || 0} mil. • ${kpis?.estudiantes?.civiles || 0} civ.`, icon: Users, color: '#10b981' },
          { label: 'Docentes', value: kpis?.docentes?.activos || 0, sub: 'Cuerpo activo', icon: GraduationCap, color: '#3b82f6' },
          { label: 'Paralelos', value: kpis?.paralelos?.activos || 0, sub: 'Aperturados', icon: Layers, color: '#f59e0b' },
          { label: 'Inscripciones', value: kpis?.inscripciones?.activas || 0, sub: 'Matriculados', icon: ClipboardEdit, color: '#8b5cf6' },
          { label: 'Cola Cajas', value: kpis?.cajas_fifo?.en_espera || 0, sub: 'En espera', icon: Landmark, color: '#ef4444' },
          { label: 'Stock Textos', value: kpis?.almacen?.total_unidades || 0, sub: `${kpis?.almacen?.alertas_rop || 0} bajo ROP`, icon: Package, color: '#64748b' },
        ] as KpiCard[],
        modulos: [
          { href: '/catalogos', titulo: 'Catálogos Base', desc: 'Gestiones, idiomas, horarios, aulas y tipos de pago.', icon: Database },
          { href: '/estructura', titulo: 'Estructura Académica', desc: 'Programas, niveles y libros de texto asignados.', icon: FolderTree },
          { href: '/docentes', titulo: 'Gestión de Docentes', desc: 'Datos, competencias y rotación pedagógica.', icon: GraduationCap },
          { href: '/estudiantes', titulo: 'Gestión de Estudiantes', desc: 'Expedientes civiles y militares.', icon: Users },
          { href: '/paralelos', titulo: 'Paralelos', desc: 'Apertura sin cruces y asignación docente.', icon: Layers },
          { href: '/inscripciones', titulo: 'Inscripciones', desc: 'Matriculación y avance libro a libro.', icon: ClipboardEdit },
          { href: '/calificaciones', titulo: 'Calificaciones', desc: 'Fórmula 80/10/10 y promedio directo.', icon: Award },
          { href: '/cajas', titulo: 'Cajas y Recaudaciones', desc: 'Cola FIFO, cobros y comprobantes.', icon: Landmark },
          { href: '/almacen', titulo: 'Almacén de Libros', desc: 'Kardex, ROP y reposición.', icon: Package },
          { href: '/metodos-numericos', titulo: 'Analítica y Métodos', desc: 'EOQ, M/M/1, regresión lineal.', icon: LineChart },
        ] as ModuloCard[],
      };

    case 'JEFE_ACADEMICO':
      return {
        subtitulo: 'Supervisión académica: programas, docentes, inscripciones y calificaciones.',
        kpiCards: [
          { label: 'Estudiantes', value: kpis?.estudiantes?.total || 0, sub: 'Total inscritos', icon: Users, color: '#10b981' },
          { label: 'Docentes', value: kpis?.docentes?.activos || 0, sub: 'Activos en gestión', icon: GraduationCap, color: '#3b82f6' },
          { label: 'Paralelos', value: kpis?.paralelos?.activos || 0, sub: 'Cursos vigentes', icon: Layers, color: '#f59e0b' },
          { label: 'Inscripciones', value: kpis?.inscripciones?.activas || 0, sub: 'Matriculados', icon: ClipboardEdit, color: '#8b5cf6' },
        ] as KpiCard[],
        modulos: [
          { href: '/estructura', titulo: 'Estructura Académica', desc: 'Malla curricular, programas y niveles.', icon: FolderTree },
          { href: '/docentes', titulo: 'Gestión de Docentes', desc: 'Competencias y rotación pedagógica.', icon: GraduationCap },
          { href: '/estudiantes', titulo: 'Estudiantes', desc: 'Expedientes y filtros por curso.', icon: Users },
          { href: '/paralelos', titulo: 'Paralelos', desc: 'Apertura y asignación docente.', icon: Layers },
          { href: '/inscripciones', titulo: 'Inscripciones', desc: 'Matriculación formal y avance.', icon: ClipboardEdit },
          { href: '/calificaciones', titulo: 'Calificaciones', desc: 'Actas y supervisión de notas.', icon: Award },
          { href: '/metodos-numericos', titulo: 'Analítica', desc: 'Modelos de investigación operativa.', icon: LineChart },
        ] as ModuloCard[],
      };

    case 'DOCENTE':
      return {
        subtitulo: 'Mis paralelos, cronograma de rotación y registro de calificaciones.',
        kpiCards: [
          { label: 'Mis Paralelos', value: kpis?.paralelos?.activos || 2, sub: 'Asignados esta gestión', icon: Layers, color: '#10b981' },
          { label: 'Estudiantes', value: kpis?.estudiantes?.total || 45, sub: 'En mis cursos', icon: Users, color: '#3b82f6' },
          { label: 'Calificaciones', value: kpis?.calificaciones_pendientes || 0, sub: 'Pendientes de registro', icon: Award, color: '#f59e0b' },
        ] as KpiCard[],
        modulos: [
          { href: '/paralelos', titulo: 'Mis Paralelos', desc: 'Consulta tus cursos y horarios asignados.', icon: Layers },
          { href: '/calificaciones', titulo: 'Calificaciones', desc: 'Registra notas: Examen 80%, Oral 10%, Participación 10%.', icon: Award },
        ] as ModuloCard[],
      };

    case 'CAJERO':
      return {
        subtitulo: 'Cola de atención, cobros de matrículas y libros, emisión de comprobantes.',
        kpiCards: [
          { label: 'En Cola', value: kpis?.cajas_fifo?.en_espera || 0, sub: 'Esperando atención', icon: Timer, color: '#ef4444' },
          { label: 'Atendidos Hoy', value: kpis?.cajas_fifo?.atendidos_hoy || 0, sub: 'Turnos completados', icon: CheckCircle2, color: '#10b981' },
          { label: 'Recaudación', value: `Bs ${kpis?.cajas_fifo?.recaudacion_hoy || 0}`, sub: 'Cobrado hoy', icon: Wallet, color: '#f59e0b' },
        ] as KpiCard[],
        modulos: [
          { href: '/cajas', titulo: 'Cajas y Recaudaciones', desc: 'Cola FIFO, llamada a ventanilla, cobros y comprobantes.', icon: Landmark },
        ] as ModuloCard[],
      };

    case 'ALMACENERO':
      return {
        subtitulo: 'Stock de libros, kardex de entradas/salidas y alertas de reorden (ROP).',
        kpiCards: [
          { label: 'Stock Total', value: kpis?.almacen?.total_unidades || 0, sub: 'Unidades en almacén', icon: Package, color: '#3b82f6' },
          { label: 'Alertas ROP', value: kpis?.almacen?.alertas_rop || 0, sub: 'Textos bajo mínimo', icon: AlertTriangle, color: '#ef4444' },
          { label: 'Salidas Mes', value: kpis?.almacen?.salidas_mes || 0, sub: 'Entregas por paralelo', icon: BookMarked, color: '#10b981' },
        ] as KpiCard[],
        modulos: [
          { href: '/almacen', titulo: 'Almacén de Libros', desc: 'Kardex, salidas por paralelo, punto de reorden y reposición.', icon: Package },
        ] as ModuloCard[],
      };

    case 'ESTUDIANTE':
    default:
      return {
        subtitulo: 'Tu avance académico, cursos inscritos y turnos en caja.',
        kpiCards: [
          { label: 'Mis Cursos', value: kpis?.inscripciones?.activas || 1, sub: 'Inscritos actualmente', icon: BookOpen, color: '#3b82f6' },
          { label: 'Promedio', value: kpis?.promedio_general || '—', sub: 'General acumulado', icon: Star, color: '#f59e0b' },
          { label: 'Mi Turno', value: kpis?.cajas_fifo?.mi_turno || '—', sub: 'Estado de cola', icon: Timer, color: '#10b981' },
        ] as KpiCard[],
        modulos: [
          { href: '/inscripciones', titulo: 'Mis Inscripciones', desc: 'Consulta cursos inscritos y avance libro a libro.', icon: ClipboardEdit },
          { href: '/calificaciones', titulo: 'Mis Calificaciones', desc: 'Revisa tus notas y promedio acumulado.', icon: Award },
          { href: '/cajas', titulo: 'Turnos en Caja', desc: 'Solicita fichas de turno para trámites de pago.', icon: Landmark },
        ] as ModuloCard[],
      };
  }
}

export default function DashboardSacaPage() {
  const { rolActivo, rolConfig, usuario } = useAuthRole();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const cargarDashboard = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/dashboard');
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
  }, []);

  const config = getDashboardConfig(rolActivo, data);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="rounded-2xl border p-6 shadow-sm transition-all bg-white dark:bg-[#121d2b] border-slate-200 dark:border-[#24354a] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="tricolor-stripe absolute top-0 left-0 right-0" />
        <div className="flex items-start gap-4 pt-1">
          <div className="w-14 h-14 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-amber-400/50 flex items-center justify-center p-2 shrink-0 shadow-sm">
            <img
              src="/images/logos/logo-eie.png"
              alt="Logo Escuela de Idiomas del Ejército"
              className="w-full h-full object-contain filter drop-shadow"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="badge-bolivia-tricolor shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#dc2626]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#15803d]" />
                <span className="text-slate-800 dark:text-slate-200">SACA &bull; CEDMIL</span>
              </span>
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 font-mono">
                Gestión Académica {data?.gestion_activa || '2026'} • Escuela de Idiomas del Ejército
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Bienvenido, {usuario.nombre}
            </h1>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              {config.subtitulo}
            </p>
          </div>
        </div>

        <button
          onClick={cargarDashboard}
          disabled={loading}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl btn-bolivia-green text-white text-xs font-semibold transition shadow-sm shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Actualizar</span>
        </button>
      </div>

      <div className={`grid gap-4 ${
        config.kpiCards.length <= 3
          ? 'grid-cols-1 sm:grid-cols-3'
          : config.kpiCards.length === 4
          ? 'grid-cols-2 lg:grid-cols-4'
          : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6'
      }`}>
        {config.kpiCards.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div
              key={i}
              className="bg-white dark:bg-[#121d2b] border border-slate-200 dark:border-[#24354a] p-4 rounded-xl shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
                <span className="text-xs font-semibold">{kpi.label}</span>
                <Icon className="w-4 h-4" style={{ color: kpi.color }} />
              </div>
              <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                {kpi.value}
              </p>
              {kpi.sub && (
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  {kpi.sub}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <FolderTree className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            Accesos Rápidos
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            SACA • {rolConfig.titulo}
          </span>
        </div>

        <div className={`grid gap-4 ${
          config.modulos.length <= 2
            ? 'grid-cols-1 md:grid-cols-2'
            : config.modulos.length <= 4
            ? 'grid-cols-1 md:grid-cols-2'
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}>
          {config.modulos.map((m) => {
            const Icon = m.icon;
            return (
              <Link
                key={m.href}
                href={m.href}
                className="p-5 rounded-2xl border bg-white dark:bg-[#121d2b] border-slate-200 dark:border-[#24354a] hover:border-amber-500/50 hover:shadow-md transition flex flex-col justify-between space-y-3 group shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-slate-800 border border-amber-200/50 dark:border-slate-700 flex items-center justify-center text-amber-700 dark:text-amber-400">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-amber-600 dark:group-hover:text-amber-400 transition">
                    {m.titulo}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {m.desc}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Ingresar
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition group-hover:text-amber-600 dark:group-hover:text-amber-400" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
