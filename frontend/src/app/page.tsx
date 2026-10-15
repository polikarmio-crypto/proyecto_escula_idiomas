'use client';

import React, { useState } from 'react';
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
  Sparkles,
  BookOpen,
  RefreshCw,
  FileText,
  UserCheck
} from 'lucide-react';

interface AsignacionRotacion {
  paralelo: string;
  idioma: string;
  docenteActual: string;
  diasEnAula: number;
  relevoSugerido: string;
  estado: 'RELEVO_REQUERIDO' | 'EN_CURSO' | 'OPTIMO';
}

const ASIGNACIONES_INICIALES: AsignacionRotacion[] = [
  {
    paralelo: 'ING-101-A',
    idioma: 'Inglés Militar',
    docenteActual: 'Cap. Fernando Ríos',
    diasEnAula: 15,
    relevoSugerido: 'Tte. Carlos Ramos',
    estado: 'RELEVO_REQUERIDO',
  },
  {
    paralelo: 'FRA-101-A',
    idioma: 'Francés Diplomático',
    docenteActual: 'Sgto. María Condori',
    diasEnAula: 14,
    relevoSugerido: 'Lic. Ana Blanco',
    estado: 'RELEVO_REQUERIDO',
  },
  {
    paralelo: 'RUS-INT-01',
    idioma: 'Ruso Técnico',
    docenteActual: 'My. Roberto Daza',
    diasEnAula: 7,
    relevoSugerido: 'En periodo regular',
    estado: 'EN_CURSO',
  },
  {
    paralelo: 'MAN-201-A',
    idioma: 'Mandarín Operativo',
    docenteActual: 'Lic. Ana Blanco',
    diasEnAula: 4,
    relevoSugerido: 'En periodo regular',
    estado: 'OPTIMO',
  },
];

export default function DashboardPage() {
  const [asignaciones, setAsignaciones] = useState<AsignacionRotacion[]>(ASIGNACIONES_INICIALES);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleAprobarRelevo = (paralelo: string, docenteNuevo: string) => {
    setAsignaciones((prev) =>
      prev.map((item) =>
        item.paralelo === paralelo
          ? {
              ...item,
              docenteActual: docenteNuevo,
              diasEnAula: 1,
              relevoSugerido: 'Relevo efectuado con éxito',
              estado: 'OPTIMO',
            }
          : item
      )
    );
    triggerToast(`Orden de relevo ejecutada: ${docenteNuevo} asumió el paralelo ${paralelo}.`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Toast de acción */}
      {toastMsg && (
        <div
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            background: 'var(--military-green-primary)',
            color: '#ffffff',
            padding: '0.85rem 1.35rem',
            borderRadius: '6px',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            zIndex: 2000,
            border: '1px solid var(--border-accent)',
          }}
        >
          <CheckCircle2 size={18} style={{ color: 'var(--military-gold-primary)' }} />
          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{toastMsg}</span>
        </div>
      )}

      {/* Encabezado Principal Institucional */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1.25rem',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '1.25rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <span className="badge badge-gold">
              <Shield size={12} /> Estado Mayor Académico
            </span>
            <span className="badge badge-military">Gestión Operativa 2026</span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.72rem',
                color: 'var(--status-active)',
                fontWeight: 600,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: 'var(--status-active)',
                  display: 'inline-block',
                }}
              />
              SACA Core v2.4 Activo
            </span>
          </div>

          <h1
            className="font-solemn"
            style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '0.02em' }}
          >
            Panel de Control y Mando Académico
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Escuela de Idiomas del Ejército (EIE) &bull; Comando de Educación y Doctrina Militar (CEDMIL)
          </p>
        </div>

        {/* Acciones Rápidas del Estado Mayor */}
        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
          <Link href="/estudiantes" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Users size={15} />
            <span>Padrón Alumnos</span>
          </Link>
          <Link href="/docentes" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <GraduationCap size={15} />
            <span>Ciclos de Rotación</span>
          </Link>
          <Link href="/cajas" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Landmark size={15} />
            <span>Simulador Quarkus</span>
          </Link>
        </div>
      </div>

      {/* ── KPI CARDS PRINCIPALES ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.25rem' }}>
        {/* KPI 1: Estudiantes */}
        <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                Efectivo de Estudiantes
              </p>
              <p style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--text-main)', margin: '0.35rem 0 0.5rem', lineHeight: 1 }}>
                1,280
              </p>
            </div>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: '8px',
                background: 'var(--military-green-subtle)',
                color: 'var(--status-active)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--border-accent)',
              }}
            >
              <Users size={20} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
            <span className="badge badge-military">
              <Shield size={10} /> 947 Militares (74%)
            </span>
            <span className="badge badge-civil">
              <UserCheck size={10} /> 333 Civiles (26%)
            </span>
          </div>
          <div style={{ marginTop: '0.85rem', paddingTop: '0.65rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--status-active)', display: 'flex', alignItems: 'center', gap: '0.2rem', fontWeight: 600 }}>
              <TrendingUp size={13} /> +12.4% este semestre
            </span>
            <Link href="/estudiantes" style={{ fontSize: '0.72rem', color: 'var(--military-gold-primary)', textDecoration: 'none', fontWeight: 600 }}>
              Ver lista &rarr;
            </Link>
          </div>
        </div>

        {/* KPI 2: Rotación Docente */}
        <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                Rotación Docente (15 Días)
              </p>
              <p style={{ fontSize: '2.1rem', fontWeight: 800, color: '#fbbf24', margin: '0.35rem 0 0.5rem', lineHeight: 1 }}>
                2 <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Relevos Urgentes</span>
              </p>
            </div>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: '8px',
                background: 'rgba(245, 158, 11, 0.12)',
                color: '#fbbf24',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(245, 158, 11, 0.3)',
              }}
            >
              <Clock size={20} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
            <span className="badge badge-gold">Ciclo institucional 15d</span>
            <span className="badge badge-military">24 Docentes Activos</span>
          </div>
          <div style={{ marginTop: '0.85rem', paddingTop: '0.65rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.2rem', fontWeight: 600 }}>
              <AlertTriangle size={13} /> 2 cumplen ciclo hoy
            </span>
            <Link href="/docentes" style={{ fontSize: '0.72rem', color: 'var(--military-gold-primary)', textDecoration: 'none', fontWeight: 600 }}>
              Gestionar &rarr;
            </Link>
          </div>
        </div>

        {/* KPI 3: Tiempo Espera Cajas */}
        <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                Tiempo Espera Cajas
              </p>
              <p style={{ fontSize: '2.1rem', fontWeight: 800, color: '#38bdf8', margin: '0.35rem 0 0.5rem', lineHeight: 1 }}>
                4.2 <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>minutos</span>
              </p>
            </div>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: '8px',
                background: 'rgba(56, 189, 248, 0.12)',
                color: '#38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(56, 189, 248, 0.3)',
              }}
            >
              <Landmark size={20} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
            <span className="badge badge-blue">Quarkus M/M/c</span>
            <span className="badge badge-military">3 Ventanillas</span>
          </div>
          <div style={{ marginTop: '0.85rem', paddingTop: '0.65rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 600 }}>
              Utilización ρ = 0.64 (Óptimo)
            </span>
            <Link href="/cajas" style={{ fontSize: '0.72rem', color: 'var(--military-gold-primary)', textDecoration: 'none', fontWeight: 600 }}>
              Ver colas &rarr;
            </Link>
          </div>
        </div>

        {/* KPI 4: Alertas de Inventario ROP */}
        <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                Almacén Textos Militares
              </p>
              <p style={{ fontSize: '2.1rem', fontWeight: 800, color: '#f87171', margin: '0.35rem 0 0.5rem', lineHeight: 1 }}>
                2 <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Bajo ROP</span>
              </p>
            </div>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.12)',
                color: '#f87171',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(239, 68, 68, 0.3)',
              }}
            >
              <Package size={20} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
            <span className="badge badge-red">Punto Reorden Superado</span>
            <span className="badge badge-gold">1,420 En Depósito</span>
          </div>
          <div style={{ marginTop: '0.85rem', paddingTop: '0.65rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', color: '#f87171', fontWeight: 600 }}>
              Solicitud de compra generada
            </span>
            <Link href="/almacen" style={{ fontSize: '0.72rem', color: 'var(--military-gold-primary)', textDecoration: 'none', fontWeight: 600 }}>
              Ver inventario &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* ── SECCIÓN CENTRAL: MATRIZ DE RELEVOS Y DISTRIBUCIÓN OPERATIVA ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '1.5rem' }}>
        
        {/* TABLA 1: RELEVO Y ROTACIÓN DOCENTE (REGLA INSTITUCIONAL 15 DÍAS) */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '0.85rem',
              marginBottom: '1rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={16} style={{ color: 'var(--military-gold-primary)' }} />
                <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Ciclos de Asignación Docente Activos
                </h2>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                Regla EIE: Rotación obligatoria de instructor militar al cumplir 15 días en aula
              </p>
            </div>
            <Link href="/docentes" className="badge badge-gold" style={{ textDecoration: 'none' }}>
              Motor Quarkus &rarr;
            </Link>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Paralelo & Idioma</th>
                  <th>Docente Actual</th>
                  <th>Días Aula</th>
                  <th>Relevo Sugerido</th>
                  <th style={{ textAlign: 'right' }}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {asignaciones.map((asig) => {
                  const esUrgente = asig.diasEnAula >= 14;
                  return (
                    <tr key={asig.paralelo}>
                      <td>
                        <div>
                          <span style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.85rem' }}>
                            {asig.paralelo}
                          </span>
                          <p style={{ fontSize: '0.72rem', color: 'var(--military-gold-primary)' }}>
                            {asig.idioma}
                          </p>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>
                          {asig.docenteActual}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                          <span
                            style={{
                              fontWeight: 700,
                              fontSize: '0.82rem',
                              color: esUrgente ? '#f87171' : 'var(--text-main)',
                            }}
                          >
                            {asig.diasEnAula} / 15d
                          </span>
                          <div
                            style={{
                              width: '50px',
                              height: '6px',
                              background: 'var(--bg-surface-elevated)',
                              borderRadius: '3px',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                width: `${Math.min((asig.diasEnAula / 15) * 100, 100)}%`,
                                height: '100%',
                                background: esUrgente ? '#f87171' : 'var(--status-active)',
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.78rem', color: asig.estado === 'RELEVO_REQUERIDO' ? '#fbbf24' : 'var(--text-muted)' }}>
                          {asig.relevoSugerido}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {asig.estado === 'RELEVO_REQUERIDO' ? (
                          <button
                            onClick={() => handleAprobarRelevo(asig.paralelo, asig.relevoSugerido)}
                            className="btn btn-primary"
                            style={{ padding: '0.3rem 0.65rem', fontSize: '0.72rem' }}
                            title="Aprobar orden de relevo"
                          >
                            Relevar
                          </button>
                        ) : (
                          <span className="badge badge-military" style={{ fontSize: '0.65rem' }}>
                            Normal
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* TABLA 2: DISTRIBUCIÓN LINGÜÍSTICA Y DEMANDA DE PROGRAMAS */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '0.85rem',
              marginBottom: '1rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookOpen size={16} style={{ color: 'var(--military-gold-primary)' }} />
                <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Matrícula por Idioma y Especialidad
                </h2>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                Desglose de cursos impartidos en la Escuela de Idiomas
              </p>
            </div>
            <Link href="/paralelos" className="badge badge-military" style={{ textDecoration: 'none' }}>
              Ver Paralelos &rarr;
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Inglés */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Inglés Militar y Operativo (Headway Mil. Ed.)</span>
                <span style={{ color: 'var(--military-gold-primary)', fontWeight: 700 }}>691 alumnos (54%)</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--bg-surface-elevated)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '54%', height: '100%', background: 'var(--military-green-light)', borderRadius: '4px' }} />
              </div>
            </div>

            {/* Francés */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Francés Diplomático y de Enlace</span>
                <span style={{ color: 'var(--military-gold-primary)', fontWeight: 700 }}>230 alumnos (18%)</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--bg-surface-elevated)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '18%', height: '100%', background: '#38bdf8', borderRadius: '4px' }} />
              </div>
            </div>

            {/* Ruso Técnico */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Ruso Técnico Militar y Blindados</span>
                <span style={{ color: 'var(--military-gold-primary)', fontWeight: 700 }}>154 alumnos (12%)</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--bg-surface-elevated)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '12%', height: '100%', background: '#a855f7', borderRadius: '4px' }} />
              </div>
            </div>

            {/* Mandarín */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Mandarín Comercial y Táctico</span>
                <span style={{ color: 'var(--military-gold-primary)', fontWeight: 700 }}>128 alumnos (10%)</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--bg-surface-elevated)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '10%', height: '100%', background: '#fbbf24', borderRadius: '4px' }} />
              </div>
            </div>

            {/* Quechua */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Quechua Institucional Originario</span>
                <span style={{ color: 'var(--military-gold-primary)', fontWeight: 700 }}>77 alumnos (6%)</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--bg-surface-elevated)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '6%', height: '100%', background: '#34d399', borderRadius: '4px' }} />
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: '1.25rem',
              padding: '0.75rem',
              background: 'var(--bg-surface-elevated)',
              borderRadius: '6px',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={16} style={{ color: 'var(--military-gold-primary)' }} />
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Tasa de ocupación de aulas: <strong style={{ color: 'var(--text-main)' }}>86.5%</strong>
              </span>
            </div>
            <Link href="/calificaciones" className="btn btn-secondary" style={{ padding: '0.25rem 0.6rem', fontSize: '0.72rem' }}>
              Ver Calificaciones
            </Link>
          </div>
        </div>

      </div>

      {/* ── ACCESOS DIRECTOS A MÓDULOS DEL SISTEMA ── */}
      <div>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.85rem' }}>
          Módulos Académicos Integrados
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          
          <Link href="/estudiantes" className="card" style={{ textDecoration: 'none', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--military-gold-primary)' }}>
              <Users size={18} />
              <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>Estudiantes</strong>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Control de padrón militar y civil, hojas de vida y matrícula oficial.
            </p>
          </Link>

          <Link href="/docentes" className="card" style={{ textDecoration: 'none', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fbbf24' }}>
              <GraduationCap size={18} />
              <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>Personal Docente</strong>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Ciclos quincenales, compatibilidad lingüística y relevos óptimos.
            </p>
          </Link>

          <Link href="/paralelos" className="card" style={{ textDecoration: 'none', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8' }}>
              <Layers size={18} />
              <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>Paralelos y Cursos</strong>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Programación de aulas, niveles, cupos y horarios de clases.
            </p>
          </Link>

          <Link href="/inscripciones" className="card" style={{ textDecoration: 'none', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981' }}>
              <FileText size={18} />
              <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>Inscripciones</strong>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Matriculación con beca 100% militar o arancel regular civil.
            </p>
          </Link>

          <Link href="/calificaciones" className="card" style={{ textDecoration: 'none', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f43f5e' }}>
              <Award size={18} />
              <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>Calificaciones</strong>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Evaluación por competencias, exámenes de libro y actas solemnes.
            </p>
          </Link>

          <Link href="/cajas" className="card" style={{ textDecoration: 'none', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a855f7' }}>
              <Landmark size={18} />
              <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>Cajas y Colas M/M/c</strong>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Turnos en ventanilla y simulador de teoría de colas de Quarkus.
            </p>
          </Link>

          <Link href="/almacen" className="card" style={{ textDecoration: 'none', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f97316' }}>
              <Package size={18} />
              <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>Almacén y Libros</strong>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Control de inventario bibliográfico y alertas de punto de reorden (ROP).
            </p>
          </Link>
        </div>
      </div>

      {/* ── BANNER INSTITUCIONAL DEL EJÉRCITO DE BOLIVIA ── */}
      <div
        style={{
          background: 'linear-gradient(90deg, var(--military-navy), var(--bg-surface-elevated))',
          border: '1px solid var(--border-accent)',
          borderRadius: '8px',
          padding: '1.1rem 1.35rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: '50%',
              background: 'var(--military-green-primary)',
              border: '1px solid var(--military-gold-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--military-gold-primary)',
            }}
          >
            <Shield size={22} />
          </div>
          <div>
            <h4 className="font-solemn" style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Escuela de Idiomas del Ejército &bull; &ldquo;La excelencia en la instrucción lingüística&rdquo;
            </h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--military-gold-primary)' }}>
              Comando General del Ejército &bull; Departamento V de Doctrina Militar &bull; Estado Plurinacional de Bolivia
            </p>
          </div>
        </div>

        <span className="badge badge-gold" style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}>
          Gestión Militar 2026
        </span>
      </div>
    </div>
  );
}
