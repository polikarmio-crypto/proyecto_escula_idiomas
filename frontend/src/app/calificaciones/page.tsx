'use client';

import React, { useState, useMemo } from 'react';
import {
  Award,
  Shield,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  FileText,
  Printer,
  Edit,
  Save,
  X,
  ChevronDown,
  Layers,
  GraduationCap,
  Sparkles,
  TrendingUp,
  Download
} from 'lucide-react';

interface CalificacionEstudiante {
  id: number;
  matricula: string;
  nombres: string;
  apellidos: string;
  ci: string;
  tipo: 'MILITAR' | 'CIVIL';
  grado?: string;
  listening: number; // Max 20
  speaking: number;  // Max 30
  reading: number;   // Max 20
  exam: number;      // Max 30
}

interface ParaleloInfo {
  codigo: string;
  idioma: string;
  nivel: string;
  docente: string;
  aula: string;
  periodo: string;
  estudiantes: CalificacionEstudiante[];
}

const PARALELOS_CALIFICACIONES: ParaleloInfo[] = [
  {
    codigo: 'ING-101-A',
    idioma: 'Inglés Militar',
    nivel: 'Básico A1/A2',
    docente: 'Tte. Carlos Ramos',
    aula: 'Aula 101 - Pabellón Alfa',
    periodo: 'Ciclo Regular Octubre 2026',
    estudiantes: [
      {
        id: 1,
        matricula: 'EIE-2026-0041',
        nombres: 'Carlos Fernando',
        apellidos: 'Mamani Quispe',
        ci: '6849201 LP',
        tipo: 'MILITAR',
        grado: 'Capitán de Infantería',
        listening: 19,
        speaking: 28,
        reading: 18,
        exam: 27,
      },
      {
        id: 2,
        matricula: 'EIE-2026-0042',
        nombres: 'Valentina Sofía',
        apellidos: 'Rios Torrico',
        ci: '8392014 CB',
        tipo: 'CIVIL',
        listening: 20,
        speaking: 29,
        reading: 20,
        exam: 29,
      },
      {
        id: 3,
        matricula: 'EIE-2026-0043',
        nombres: 'Jorge Luis',
        apellidos: 'Vargas Peñaranda',
        ci: '4920183 SC',
        tipo: 'MILITAR',
        grado: 'Subteniente de Artillería',
        listening: 17,
        speaking: 25,
        reading: 16,
        exam: 25,
      },
      {
        id: 4,
        matricula: 'EIE-2026-0044',
        nombres: 'Camila Andrea',
        apellidos: 'Montenegro Siles',
        ci: '9120485 OR',
        tipo: 'CIVIL',
        listening: 14,
        speaking: 20,
        reading: 15,
        exam: 19,
      },
      {
        id: 5,
        matricula: 'EIE-2026-0045',
        nombres: 'Alejandro Rene',
        apellidos: 'Gutiérrez Dorado',
        ci: '5829104 TJ',
        tipo: 'MILITAR',
        grado: 'Teniente de Comunicaciones',
        listening: 20,
        speaking: 29,
        reading: 19,
        exam: 29,
      },
    ],
  },
  {
    codigo: 'FRA-101-A',
    idioma: 'Francés Diplomático',
    nivel: 'Intermedio B1',
    docente: 'Cap. Fernando Ríos',
    aula: 'Aula 201 - Pabellón Bravo',
    periodo: 'Ciclo Regular Octubre 2026',
    estudiantes: [
      {
        id: 6,
        matricula: 'EIE-2026-0051',
        nombres: 'Marcelo Javier',
        apellidos: 'Peñafiel Castro',
        ci: '5019284 LP',
        tipo: 'MILITAR',
        grado: 'Mayor de Caballería',
        listening: 18,
        speaking: 27,
        reading: 18,
        exam: 26,
      },
      {
        id: 7,
        matricula: 'EIE-2026-0052',
        nombres: 'Luciana Belén',
        apellidos: 'Salazar Arce',
        ci: '7102938 SC',
        tipo: 'CIVIL',
        listening: 19,
        speaking: 28,
        reading: 19,
        exam: 28,
      },
    ],
  },
  {
    codigo: 'RUS-INT-01',
    idioma: 'Ruso Técnico Militar',
    nivel: 'Intermedio B1',
    docente: 'My. Roberto Daza',
    aula: 'Lab Idiomas 2',
    periodo: 'Ciclo Especial Octubre 2026',
    estudiantes: [
      {
        id: 8,
        matricula: 'EIE-2026-0061',
        nombres: 'Raúl Gonzalo',
        apellidos: 'Crespo Morales',
        ci: '4839201 LP',
        tipo: 'MILITAR',
        grado: 'Capitán de Blindados',
        listening: 19,
        speaking: 27,
        reading: 17,
        exam: 28,
      },
      {
        id: 9,
        matricula: 'EIE-2026-0062',
        nombres: 'Daniela Andrea',
        apellidos: 'Zalles Pinto',
        ci: '6392019 CB',
        tipo: 'CIVIL',
        listening: 16,
        speaking: 24,
        reading: 16,
        exam: 24,
      },
    ],
  },
];

export default function CalificacionesPage() {
  const [paralelosData, setParalelosData] = useState<ParaleloInfo[]>(PARALELOS_CALIFICACIONES);
  const [paraleloSeleccionado, setParaleloSeleccionado] = useState<string>('ING-101-A');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Modales
  const [modalEditarEstudiante, setModalEditarEstudiante] = useState<CalificacionEstudiante | null>(null);
  const [editListening, setEditListening] = useState<number>(0);
  const [editSpeaking, setEditSpeaking] = useState<number>(0);
  const [editReading, setEditReading] = useState<number>(0);
  const [editExam, setEditExam] = useState<number>(0);

  const [modalActaAbierto, setModalActaAbierto] = useState<boolean>(false);

  const cursoActual = useMemo(() => {
    return paralelosData.find((p) => p.codigo === paraleloSeleccionado) || paralelosData[0];
  }, [paralelosData, paraleloSeleccionado]);

  const estudiantesFiltrados = useMemo(() => {
    if (!searchTerm) return cursoActual.estudiantes;
    const q = searchTerm.toLowerCase().trim();
    return cursoActual.estudiantes.filter(
      (e) =>
        e.nombres.toLowerCase().includes(q) ||
        e.apellidos.toLowerCase().includes(q) ||
        e.ci.toLowerCase().includes(q) ||
        e.matricula.toLowerCase().includes(q) ||
        (e.grado && e.grado.toLowerCase().includes(q))
    );
  }, [cursoActual, searchTerm]);

  // Cálculos estadísticos
  const promedioCurso = useMemo(() => {
    if (cursoActual.estudiantes.length === 0) return 0;
    const total = cursoActual.estudiantes.reduce(
      (acc, e) => acc + (e.listening + e.speaking + e.reading + e.exam),
      0
    );
    return Math.round((total / cursoActual.estudiantes.length) * 10) / 10;
  }, [cursoActual]);

  const aprobadosCount = useMemo(() => {
    return cursoActual.estudiantes.filter(
      (e) => e.listening + e.speaking + e.reading + e.exam >= 71
    ).length;
  }, [cursoActual]);

  const tasaAprobacion = useMemo(() => {
    if (cursoActual.estudiantes.length === 0) return 0;
    return Math.round((aprobadosCount / cursoActual.estudiantes.length) * 100);
  }, [aprobadosCount, cursoActual]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleAbrirEdicion = (est: CalificacionEstudiante) => {
    setModalEditarEstudiante(est);
    setEditListening(est.listening);
    setEditSpeaking(est.speaking);
    setEditReading(est.reading);
    setEditExam(est.exam);
  };

  const handleGuardarCalificacion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalEditarEstudiante) return;

    setParalelosData((prev) =>
      prev.map((curso) => {
        if (curso.codigo !== paraleloSeleccionado) return curso;
        return {
          ...curso,
          estudiantes: curso.estudiantes.map((est) => {
            if (est.id !== modalEditarEstudiante.id) return est;
            return {
              ...est,
              listening: Math.min(Math.max(Number(editListening), 0), 20),
              speaking: Math.min(Math.max(Number(editSpeaking), 0), 30),
              reading: Math.min(Math.max(Number(editReading), 0), 20),
              exam: Math.min(Math.max(Number(editExam), 0), 30),
            };
          }),
        };
      })
    );

    showToast(`Calificaciones actualizadas para ${modalEditarEstudiante.nombres} ${modalEditarEstudiante.apellidos}.`);
    setModalEditarEstudiante(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Toast */}
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

      {/* Header Militar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1rem',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '1.25rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span className="badge badge-gold">
              <Shield size={12} /> Jefatura de Estudios
            </span>
            <span className="badge badge-military">Evaluación Continua</span>
          </div>
          <h1
            className="font-solemn"
            style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '0.02em' }}
          >
            Registro y Control de Calificaciones
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Ponderación institucional: Listening (20%), Military Briefing (30%), Reading (20%), Examen Final (30%). Nota mínima: 71 pts.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setModalActaAbierto(true)}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
          >
            <Printer size={15} />
            <span>Generar Acta Oficial CEDMIL</span>
          </button>
        </div>
      </div>

      {/* Selector de Paralelo y Resumen del Curso */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>
              Seleccione el Paralelo / Curso Activo:
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {paralelosData.map((par) => (
                <button
                  key={par.codigo}
                  onClick={() => setParaleloSeleccionado(par.codigo)}
                  className={`btn ${paraleloSeleccionado === par.codigo ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.82rem', padding: '0.45rem 0.85rem' }}
                >
                  <span style={{ fontWeight: 700 }}>{par.codigo}</span>
                  <span style={{ opacity: 0.8, fontSize: '0.75rem' }}>({par.idioma})</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ textAlign: 'right', minWidth: '220px' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Instructor Asignado:</p>
            <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>{cursoActual.docente}</p>
            <p style={{ fontSize: '0.72rem', color: 'var(--military-gold-primary)' }}>{cursoActual.aula} &bull; {cursoActual.periodo}</p>
          </div>
        </div>
      </div>

      {/* KPI Cards del Curso Seleccionado */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 6,
              background: 'var(--military-gold-subtle)',
              color: 'var(--military-gold-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--border-gold)',
            }}
          >
            <Award size={22} />
          </div>
          <div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Promedio General
            </p>
            <p style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {promedioCurso} <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>/ 100</span>
            </p>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 6,
              background: 'var(--military-green-subtle)',
              color: 'var(--status-active)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--border-accent)',
            }}
          >
            <TrendingUp size={22} />
          </div>
          <div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Tasa de Aprobación
            </p>
            <p style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--status-active)' }}>
              {tasaAprobacion}%
            </p>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 6,
              background: 'var(--military-blue-subtle)',
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <GraduationCap size={22} />
          </div>
          <div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Efectivo Evaluado
            </p>
            <p style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {cursoActual.estudiantes.length} Alumnos
            </p>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 6,
              background: 'var(--bg-surface-elevated)',
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <Shield size={22} />
          </div>
          <div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Aprobados / Mín. 71
            </p>
            <p style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {aprobadosCount} de {cursoActual.estudiantes.length}
            </p>
          </div>
        </div>
      </div>

      {/* Tabla Matriz de Calificaciones */}
      <div className="card" style={{ padding: '1.25rem' }}>
        
        {/* Barra de búsqueda */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '360px' }}>
            <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Buscar estudiante en este curso..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input"
              style={{ paddingLeft: '2.2rem', width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span className="badge badge-military">Listening 20p</span>
            <span className="badge badge-military">Speaking 30p</span>
            <span className="badge badge-military">Reading 20p</span>
            <span className="badge badge-military">Exam 30p</span>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Estudiante</th>
                <th>Cédula / Tipo</th>
                <th style={{ textAlign: 'center' }}>Listening (20)</th>
                <th style={{ textAlign: 'center' }}>Speaking (30)</th>
                <th style={{ textAlign: 'center' }}>Reading (20)</th>
                <th style={{ textAlign: 'center' }}>Examen (30)</th>
                <th style={{ textAlign: 'center' }}>Nota Final</th>
                <th style={{ textAlign: 'center' }}>Estado</th>
                <th style={{ textAlign: 'right' }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {estudiantesFiltrados.map((est) => {
                const total = est.listening + est.speaking + est.reading + est.exam;
                const aprobado = total >= 71;
                const excelencia = total >= 90;

                return (
                  <tr key={est.id}>
                    <td>
                      <div>
                        <p style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.88rem' }}>
                          {est.apellidos}, {est.nombres}
                        </p>
                        <p style={{ fontSize: '0.72rem', color: 'var(--military-gold-primary)' }}>
                          {est.grado ? est.grado : 'Particular Civil'} &bull; {est.matricula}
                        </p>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--text-main)' }}>
                        {est.ci}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 600, color: 'var(--text-main)' }}>
                      {est.listening}
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 600, color: 'var(--text-main)' }}>
                      {est.speaking}
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 600, color: 'var(--text-main)' }}>
                      {est.reading}
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 600, color: 'var(--text-main)' }}>
                      {est.exam}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span
                        style={{
                          fontSize: '1rem',
                          fontWeight: 800,
                          color: excelencia ? '#fbbf24' : aprobado ? '#10b981' : '#f87171',
                        }}
                      >
                        {total}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span
                        className={excelencia ? 'badge badge-gold' : aprobado ? 'badge badge-military' : 'badge badge-red'}
                        style={{ fontSize: '0.68rem' }}
                      >
                        {excelencia ? 'Excelencia' : aprobado ? 'Aprobado' : 'Reprobado'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => handleAbrirEdicion(est)}
                        className="btn btn-secondary btn-icon"
                        title="Modificar calificaciones"
                      >
                        <Edit size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* =================================================================
          MODAL DE EDICIÓN DE CALIFICACIONES
      ================================================================= */}
      {modalEditarEstudiante && (
        <div className="modal-overlay" onClick={() => setModalEditarEstudiante(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Award size={18} style={{ color: 'var(--military-gold-primary)' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Calificar Estudiante
                </h3>
              </div>
              <button onClick={() => setModalEditarEstudiante(null)} className="btn-icon btn-ghost">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleGuardarCalificacion} style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ padding: '0.75rem', background: 'var(--bg-surface-elevated)', borderRadius: '6px' }}>
                <p style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.9rem' }}>
                  {modalEditarEstudiante.nombres} {modalEditarEstudiante.apellidos}
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--military-gold-primary)' }}>
                  {modalEditarEstudiante.grado || 'Estudiante Civil'} &bull; {modalEditarEstudiante.matricula}
                </p>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Paralelo: {cursoActual.codigo} - {cursoActual.idioma}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label className="input-label">Listening (Máx. 20 pts)</label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={editListening}
                    onChange={(e) => setEditListening(Number(e.target.value))}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="input-label">Speaking (Máx. 30 pts)</label>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={editSpeaking}
                    onChange={(e) => setEditSpeaking(Number(e.target.value))}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="input-label">Reading (Máx. 20 pts)</label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={editReading}
                    onChange={(e) => setEditReading(Number(e.target.value))}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="input-label">Examen Final (Máx. 30 pts)</label>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={editExam}
                    onChange={(e) => setEditExam(Number(e.target.value))}
                    className="input"
                    required
                  />
                </div>
              </div>

              {/* Total en tiempo real */}
              <div
                style={{
                  padding: '0.75rem',
                  background: 'var(--bg-surface-elevated)',
                  borderRadius: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Nota Final Calculada:</span>
                <span
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: editListening + editSpeaking + editReading + editExam >= 71 ? '#10b981' : '#f87171',
                  }}
                >
                  {editListening + editSpeaking + editReading + editExam} / 100
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setModalEditarEstudiante(null)} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Save size={15} />
                  <span>Guardar Notas</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================
          MODAL DE ACTA OFICIAL MILITAR DEL CEDMIL
      ================================================================= */}
      {modalActaAbierto && (
        <div className="modal-overlay" onClick={() => setModalActaAbierto(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '780px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <FileText size={18} style={{ color: 'var(--military-gold-primary)' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Acta Oficial de Calificaciones &bull; CEDMIL
                </h3>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button onClick={() => window.print()} className="btn btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Printer size={13} /> Imprimir Acta
                </button>
                <button onClick={() => setModalActaAbierto(false)} className="btn-icon btn-ghost">
                  <X size={18} />
                </button>
              </div>
            </div>

            <div style={{ padding: '2rem', background: '#ffffff', color: '#0f172a', fontFamily: 'serif' }}>
              {/* Membrete Militar Oficial */}
              <div style={{ textAlign: 'center', borderBottom: '2px solid #0f172a', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  EJÉRCITO DE BOLIVIA
                </p>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em' }}>
                  COMANDO DE EDUCACIÓN Y DOCTRINA MILITAR (CEDMIL)
                </p>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1b4332' }}>
                  ESCUELA DE IDIOMAS DEL EJÉRCITO (EIE)
                </p>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '0.65rem', letterSpacing: '0.04em' }}>
                  ACTA OFICIAL DE EVALUACIÓN ACADÉMICA
                </h2>
                <p style={{ fontSize: '0.8rem', fontStyle: 'italic', marginTop: '0.2rem' }}>
                  Gestión 2026 &bull; Paralelo: {cursoActual.codigo} &bull; Idioma: {cursoActual.idioma} ({cursoActual.nivel})
                </p>
              </div>

              {/* Datos del Acta */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.82rem', marginBottom: '1.25rem' }}>
                <div><strong>Instructor Responsable:</strong> {cursoActual.docente}</div>
                <div><strong>Aula Asignada:</strong> {cursoActual.aula}</div>
                <div><strong>Fecha de Emisión:</strong> 14 de Octubre de 2026</div>
                <div><strong>Promedio General del Curso:</strong> {promedioCurso} / 100 pts</div>
              </div>

              {/* Tabla de notas formato oficial impreso */}
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', marginBottom: '2rem' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', borderTop: '1px solid #0f172a', borderBottom: '1px solid #0f172a' }}>
                    <th style={{ padding: '6px', textAlign: 'left' }}>N°</th>
                    <th style={{ padding: '6px', textAlign: 'left' }}>Matrícula</th>
                    <th style={{ padding: '6px', textAlign: 'left' }}>Apellidos y Nombres</th>
                    <th style={{ padding: '6px', textAlign: 'left' }}>Grado / Cat.</th>
                    <th style={{ padding: '6px', textAlign: 'center' }}>Total</th>
                    <th style={{ padding: '6px', textAlign: 'center' }}>Resultado</th>
                  </tr>
                </thead>
                <tbody>
                  {cursoActual.estudiantes.map((est, idx) => {
                    const total = est.listening + est.speaking + est.reading + est.exam;
                    return (
                      <tr key={est.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '6px' }}>{idx + 1}</td>
                        <td style={{ padding: '6px', fontFamily: 'monospace' }}>{est.matricula}</td>
                        <td style={{ padding: '6px', fontWeight: 600 }}>{est.apellidos}, {est.nombres}</td>
                        <td style={{ padding: '6px' }}>{est.grado || 'Civil'}</td>
                        <td style={{ padding: '6px', textAlign: 'center', fontWeight: 700 }}>{total}</td>
                        <td style={{ padding: '6px', textAlign: 'center', fontWeight: 600, color: total >= 71 ? '#166534' : '#991b1b' }}>
                          {total >= 71 ? 'APROBADO' : 'REPROBADO'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Firmas solemnes */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginTop: '3.5rem', textAlign: 'center', fontSize: '0.8rem' }}>
                <div style={{ borderTop: '1px solid #0f172a', paddingTop: '0.5rem' }}>
                  <p style={{ fontWeight: 700 }}>{cursoActual.docente}</p>
                  <p style={{ fontSize: '0.72rem', color: '#475569' }}>Instructor Militar de Idiomas &bull; EIE</p>
                </div>
                <div style={{ borderTop: '1px solid #0f172a', paddingTop: '0.5rem' }}>
                  <p style={{ fontWeight: 700 }}>Cnl. DAEN Marco A. Soria</p>
                  <p style={{ fontSize: '0.72rem', color: '#475569' }}>Director General &bull; Escuela de Idiomas del Ejército</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
