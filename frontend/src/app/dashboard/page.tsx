'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Shield,
  GraduationCap,
  Clock,
  Package,
  Layers,
  Award,
  Landmark,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  BookOpen,
  RefreshCw,
  Database,
  FolderTree,
  ClipboardEdit,
  LineChart,
  Home,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useAuthRole } from '@/context/AuthRoleContext';
import {
  LocalStore,
  INITIAL_ESTUDIANTES,
  INITIAL_DOCENTES,
  INITIAL_PARALELOS,
  INITIAL_ALMACEN,
  INITIAL_FICHAS
} from '@/lib/mockData';

export default function DashboardSacaPage() {
  const { rolActivo, rolConfig, usuario, esAdmin } = useAuthRole();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const cargarDashboard = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/dashboard');
      if (res.ok) {
        const d = await res.json();
        setData(d);
        return;
      }
    } catch (e) {
      // Backend desconectado - Usar store local resiliente
    } finally {
      // Fallback a los datos locales
      const estudiantes = LocalStore.get('estudiantes', INITIAL_ESTUDIANTES);
      const docentes = LocalStore.get('docentes', INITIAL_DOCENTES);
      const paralelos = LocalStore.get('paralelos', INITIAL_PARALELOS);
      const almacen = LocalStore.get('almacen', INITIAL_ALMACEN);
      const fichas = LocalStore.get('fichas', INITIAL_FICHAS);

      const militaresCount = estudiantes.filter((e) => e.tipo_estudiante === 'Militar').length;
      const civilesCount = estudiantes.filter((e) => e.tipo_estudiante === 'Civil').length;
      const totalStock = almacen.reduce((acc, a) => acc + (a.stock_actual || 0), 0);
      const alertasRop = almacen.filter((a) => a.stock_actual <= a.punto_reorden).length;
      const enEsperaFifo = fichas.filter((f) => f.estado === 'En espera').length;

      setData({
        gestion_activa: 2026,
        kpis: {
          estudiantes: {
            total: estudiantes.length,
            militares: militaresCount,
            civiles: civilesCount,
          },
          docentes: {
            activos: docentes.filter((d) => d.estado_docente === 'Activo').length,
          },
          paralelos: {
            activos: paralelos.length,
          },
          inscripciones: {
            activas: estudiantes.length,
          },
          cajas_fifo: {
            en_espera: enEsperaFifo,
          },
          almacen: {
            total_unidades: totalStock,
            alertas_rop: alertasRop,
          },
        },
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDashboard();
  }, []);

  const kpis = data?.kpis;

  return (
    <div className="space-y-6">
      {/* Barra de acceso rápido entre Portal Público y Dashboard */}
      <div className="flex items-center justify-between bg-neutral-900/60 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs">
        <div className="flex items-center gap-2 text-neutral-400">
          <Shield className="w-4 h-4 text-amber-400" />
          <span>SISTEMA DE GESTIÓN ACADÉMICA (SACA) &bull; CEDMIL</span>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-semibold transition group"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Ver Portal Institucional Público</span>
          <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
        </Link>
      </div>

      {/* Bienvenida Institucional */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-neutral-950 border border-neutral-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-neutral-800 border border-amber-500/30 flex items-center justify-center p-1.5 shrink-0 shadow-lg">
            <img
              src="/logo-ejercito.png"
              alt="Logo Escuela de Idiomas del Ejército"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span
                className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider"
                style={{
                  backgroundColor: `${rolConfig.color}22`,
                  color: rolConfig.color,
                  border: `1px solid ${rolConfig.color}55`,
                }}
              >
                {rolConfig.badge}
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                Gestión Académica {data?.gestion_activa || '2026'} &bull; Estado: En Operación
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">
              Bienvenido, {usuario.nombre}
            </h1>
            <p className="text-xs md:text-sm text-neutral-400 mt-1 max-w-2xl">
              {rolConfig.descripcion}
            </p>
          </div>
        </div>

        <button
          onClick={cargarDashboard}
          disabled={loading}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold transition shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Actualizar Panel
        </button>
      </div>

      {/* Tarjetas de Indicadores Principales */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-neutral-900/60 border border-neutral-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-neutral-400 mb-1">
            <span className="text-xs">Estudiantes</span>
            <Users className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-white">{kpis?.estudiantes?.total || 0}</p>
          <span className="text-[10px] text-neutral-500">
            {kpis?.estudiantes?.militares || 0} militares &bull; {kpis?.estudiantes?.civiles || 0} civiles
          </span>
        </div>

        <div className="bg-neutral-900/60 border border-neutral-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-neutral-400 mb-1">
            <span className="text-xs">Docentes</span>
            <GraduationCap className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-white">{kpis?.docentes?.activos || 0}</p>
          <span className="text-[10px] text-emerald-400 font-semibold">Cuerpo docente activo</span>
        </div>

        <div className="bg-neutral-900/60 border border-neutral-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-neutral-400 mb-1">
            <span className="text-xs">Paralelos</span>
            <Layers className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-white">{kpis?.paralelos?.activos || 0}</p>
          <span className="text-[10px] text-neutral-500">Cursos aperturados</span>
        </div>

        <div className="bg-neutral-900/60 border border-neutral-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-neutral-400 mb-1">
            <span className="text-xs">Inscripciones</span>
            <ClipboardEdit className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-white">{kpis?.inscripciones?.activas || 0}</p>
          <span className="text-[10px] text-neutral-500">Alumnos matriculados</span>
        </div>

        <div className="bg-neutral-900/60 border border-neutral-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-neutral-400 mb-1">
            <span className="text-xs">Cola FIFO Cajas</span>
            <Landmark className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-amber-400">{kpis?.cajas_fifo?.en_espera || 0}</p>
          <span className="text-[10px] text-neutral-500">En espera de atención</span>
        </div>

        <div className="bg-neutral-900/60 border border-neutral-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-neutral-400 mb-1">
            <span className="text-xs">Stock Textos</span>
            <Package className="w-4 h-4 text-pink-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-pink-400">{kpis?.almacen?.total_unidades || 0}</p>
          <span className="text-[10px] text-neutral-500">{kpis?.almacen?.alertas_rop || 0} bajo ROP</span>
        </div>
      </div>

      {/* Módulos Institucionales según Casos de Uso (Módulos 1 al 9 + Analítica) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
            <FolderTree className="w-4 h-4 text-sky-400" />
            Módulos del Sistema según Diagrama de Casos de Uso
          </h2>
          <span className="text-xs text-neutral-500">
            Rol actual: <strong style={{ color: rolConfig.color }}>{rolConfig.titulo}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              href: '/catalogos',
              titulo: 'Módulo 1: Catálogos Base',
              desc: 'Gestiones anuales, idiomas ofertados, horarios, aulas y tipos de pago.',
              actor: 'Administrador del Sistema',
              icon: Database,
              color: 'text-amber-400',
              border: 'border-amber-500/20',
            },
            {
              href: '/estructura',
              titulo: 'Módulo 2: Estructura Académica',
              desc: 'Malla curricular: Programas, niveles secuenciales y libros de texto asignados.',
              actor: 'Jefe Académico',
              icon: FolderTree,
              color: 'text-sky-400',
              border: 'border-sky-500/20',
            },
            {
              href: '/docentes',
              titulo: 'Módulo 3: Gestión de Docentes',
              desc: 'Datos personales, competencias de idioma y ciclo de rotación obligatoria de 15 días.',
              actor: 'Jefe Académico',
              icon: GraduationCap,
              color: 'text-emerald-400',
              border: 'border-emerald-500/20',
            },
            {
              href: '/estudiantes',
              titulo: 'Módulo 4: Gestión de Estudiantes',
              desc: 'Expedientes de estudiantes civiles y militares con filtro por curso e idioma.',
              actor: 'Jefe Académico',
              icon: Users,
              color: 'text-blue-400',
              border: 'border-blue-500/20',
            },
            {
              href: '/paralelos',
              titulo: 'Módulo 5: Paralelos y Asignación',
              desc: 'Apertura de paralelos sin cruces de horario/aula y asignación de docentes.',
              actor: 'Jefe Académico / Docente',
              icon: Layers,
              color: 'text-purple-400',
              border: 'border-purple-500/20',
            },
            {
              href: '/inscripciones',
              titulo: 'Módulo 6: Inscripciones y Avance',
              desc: 'Matriculación formal e inicialización automática del avance libro a libro.',
              actor: 'Jefe Académico / Estudiante',
              icon: ClipboardEdit,
              color: 'text-indigo-400',
              border: 'border-indigo-500/20',
            },
            {
              href: '/calificaciones',
              titulo: 'Módulo 7: Calificaciones',
              desc: 'Fórmula oficial 80/10/10 (Examen 80%, Oral 10%, Participación 10%) o promedio directo.',
              actor: 'Docente / Jefe Académico',
              icon: Award,
              color: 'text-emerald-400',
              border: 'border-emerald-500/20',
            },
            {
              href: '/cajas',
              titulo: 'Módulo 8: Cajas y Recaudaciones',
              desc: 'Cola FIFO, llamada a ventanilla, cobro de matrículas/libros y comprobantes.',
              actor: 'Cajero / Estudiante',
              icon: Landmark,
              color: 'text-amber-400',
              border: 'border-amber-500/20',
            },
            {
              href: '/almacen',
              titulo: 'Módulo 9: Almacén de Libros',
              desc: 'Kardex físico, salidas por paralelo, punto de reorden (ROP) y reposición.',
              actor: 'Encargado de Almacén',
              icon: Package,
              color: 'text-pink-400',
              border: 'border-pink-500/20',
            },
            {
              href: '/metodos-numericos',
              titulo: 'Investigación Operativa & Métodos Numéricos',
              desc: 'Modelos EOQ (Inventario), M/M/1 (Colas en Cajas) y Regresión Lineal (Deserción Estudiantil).',
              actor: 'Analítica / Jefatura',
              icon: LineChart,
              color: 'text-cyan-400',
              border: 'border-cyan-500/30',
            },
          ].map((m) => {
            const Icon = m.icon;
            const tieneAcceso = esAdmin || rolConfig.rutasPermitidas.includes(m.href);
            return (
              <Link
                key={m.href}
                href={m.href}
                className={`p-5 rounded-2xl border bg-neutral-900/40 hover:bg-neutral-900/80 transition flex flex-col justify-between space-y-3 group ${
                  tieneAcceso ? m.border : 'opacity-50 grayscale hover:grayscale-0'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-5 h-5 ${m.color}`} />
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider font-semibold">
                      {m.actor}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-sm group-hover:text-amber-300 transition">
                    {m.titulo}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    {m.desc}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-neutral-800/60 text-xs">
                  <span className={tieneAcceso ? 'text-emerald-400 font-semibold' : 'text-neutral-500 font-medium'}>
                    {tieneAcceso ? 'Acceso habilitado' : 'Rol restringido'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-500 group-hover:translate-x-1 transition" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
