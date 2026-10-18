'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Layers,
  Plus,
  Calendar,
  Users,
  MapPin,
  Search,
  Filter,
  BookOpen,
  Shield,
  Clock,
  CheckCircle2,
  X,
  GraduationCap,
  Sparkles,
  Edit,
  Eye
} from 'lucide-react';

interface Paralelo {
  id: string;
  idioma: string;
  nivel: string;
  docente: string;
  horario: string;
  dias: string;
  aula: string;
  inscritos: number;
  capacidad: number;
  turno: 'MAÑANA' | 'TARDE' | 'NOCHE';
}

const PARALELOS_INICIALES: Paralelo[] = [
  {
    id: 'ING-101-A',
    idioma: 'Inglés Militar',
    nivel: 'Básico A1/A2',
    docente: 'Tte. Carlos Ramos',
    horario: '08:00 - 09:30',
    dias: 'Lun-Vie',
    aula: 'Aula 101 - Pabellón Alfa',
    inscritos: 28,
    capacidad: 30,
    turno: 'MAÑANA',
  },
  {
    id: 'ING-102-B',
    idioma: 'Inglés Militar',
    nivel: 'Intermedio B1',
    docente: 'Sgto. María Condori',
    horario: '10:00 - 11:30',
    dias: 'Lun-Vie',
    aula: 'Aula 102 - Pabellón Alfa',
    inscritos: 22,
    capacidad: 30,
    turno: 'MAÑANA',
  },
  {
    id: 'FRA-101-A',
    idioma: 'Francés',
    nivel: 'Diplomático Básico',
    docente: 'Cap. Fernando Ríos',
    horario: '08:00 - 09:30',
    dias: 'Mar-Jue',
    aula: 'Aula 201 - Pabellón Bravo',
    inscritos: 14,
    capacidad: 20,
    turno: 'MAÑANA',
  },
  {
    id: 'RUS-INT-01',
    idioma: 'Ruso Técnico',
    nivel: 'Intermedio B1',
    docente: 'My. Roberto Daza',
    horario: '14:00 - 15:30',
    dias: 'Lun-Mie-Vie',
    aula: 'Laboratorio de Idiomas 1',
    inscritos: 18,
    capacidad: 20,
    turno: 'TARDE',
  },
  {
    id: 'MAN-201-A',
    idioma: 'Mandarín',
    nivel: 'Avanzado B2',
    docente: 'Lic. Ana Blanco',
    horario: '16:00 - 18:00',
    dias: 'Lun-Mie-Vie',
    aula: 'Aula 205 - Pabellón Bravo',
    inscritos: 12,
    capacidad: 15,
    turno: 'TARDE',
  },
  {
    id: 'QUE-101-A',
    idioma: 'Quechua',
    nivel: 'Institucional Básico',
    docente: 'Sof. René Quisbert',
    horario: '18:30 - 20:00',
    dias: 'Lun-Mie-Vie',
    aula: 'Aula Magna CEDMIL',
    inscritos: 35,
    capacidad: 40,
    turno: 'NOCHE',
  },
];

export default function ParalelosPage() {
  const [paralelos, setParalelos] = useState<Paralelo[]>(PARALELOS_INICIALES);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filtroIdioma, setFiltroIdioma] = useState<string>('TODOS');
  const [filtroTurno, setFiltroTurno] = useState<string>('TODOS');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Modales
  const [modalNuevoParalelo, setModalNuevoParalelo] = useState<boolean>(false);
  const [modalGestionar, setModalGestionar] = useState<Paralelo | null>(null);

  // Form Nuevo Paralelo
  const [formCodigo, setFormCodigo] = useState<string>('');
  const [formIdioma, setFormIdioma] = useState<string>('Inglés Militar');
  const [formNivel, setFormNivel] = useState<string>('Básico A1');
  const [formDocente, setFormDocente] = useState<string>('Tte. Carlos Ramos');
  const [formAula, setFormAula] = useState<string>('Aula 103');
  const [formHorario, setFormHorario] = useState<string>('08:00 - 09:30');
  const [formDias, setFormDias] = useState<string>('Lun-Vie');
  const [formCapacidad, setFormCapacidad] = useState<number>(30);
  const [formTurno, setFormTurno] = useState<'MAÑANA' | 'TARDE' | 'NOCHE'>('MAÑANA');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const cargarParalelos = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/paralelos');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const mapped: Paralelo[] = data.map((p: any) => {
          let turno: 'MAÑANA' | 'TARDE' | 'NOCHE' = 'MAÑANA';
          const horaInicio = p.horario ? p.horario.split(' - ')[0] : '08:00';
          const horaNum = parseInt(horaInicio.split(':')[0], 10) || 8;
          if (horaNum >= 18) turno = 'NOCHE';
          else if (horaNum >= 12) turno = 'TARDE';

          return {
            id: p.codigo_paralelo || `PAR-${p.id_paralelo}`,
            idioma: p.idioma || 'Inglés Militar',
            nivel: p.nivel || 'Básico A1',
            docente: p.docente_actual || 'Docente Asignado',
            horario: p.horario || '08:00 - 09:30',
            dias: 'Lun-Vie',
            aula: p.aula || 'Aula Central CEDMIL',
            inscritos: p.inscritos || 0,
            capacidad: p.capacidad_maxima || 30,
            turno,
          };
        });
        setParalelos(mapped);
      }
    } catch (err) {
      console.warn('Cargando paralelos desde cache local / fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarParalelos();
  }, []);

  const paralelosFiltrados = useMemo(() => {
    return paralelos.filter((p) => {
      const matchIdioma = filtroIdioma === 'TODOS' || p.idioma.toLowerCase().includes(filtroIdioma.toLowerCase());
      const matchTurno = filtroTurno === 'TODOS' || p.turno === filtroTurno;
      const q = searchTerm.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.id.toLowerCase().includes(q) ||
        p.idioma.toLowerCase().includes(q) ||
        p.docente.toLowerCase().includes(q) ||
        p.aula.toLowerCase().includes(q);

      return matchIdioma && matchTurno && matchSearch;
    });
  }, [paralelos, filtroIdioma, filtroTurno, searchTerm]);

  const totalInscritos = paralelos.reduce((acc, p) => acc + p.inscritos, 0);
  const totalCapacidad = paralelos.reduce((acc, p) => acc + p.capacidad, 0);
  const tasaOcupacionGlobal = Math.round((totalInscritos / (totalCapacidad || 1)) * 100);

  const handleCrearParalelo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCodigo) {
      alert('Por favor ingrese el código del paralelo.');
      return;
    }

    const nuevo: Paralelo = {
      id: formCodigo.toUpperCase(),
      idioma: formIdioma,
      nivel: formNivel,
      docente: formDocente,
      aula: formAula,
      horario: formHorario,
      dias: formDias,
      inscritos: 0,
      capacidad: Number(formCapacidad),
      turno: formTurno,
    };

    setParalelos([nuevo, ...paralelos]);
    setModalNuevoParalelo(false);
    showToast(`Paralelo ${nuevo.id} (${nuevo.idioma}) habilitado en el sistema.`);

    setFormCodigo('');
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
              <Layers size={12} /> Programación Académica
            </span>
            <span className="badge badge-military">Gestión 2026</span>
          </div>
          <h1
            className="font-solemn"
            style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '0.02em' }}
          >
            Paralelos, Cursos y Asignación de Aulas
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Apertura de cursos de idiomas, control de aforos de aulas y laboratorios multimedia de la Escuela de Idiomas del Ejército.
          </p>
        </div>

        <button
          onClick={() => setModalNuevoParalelo(true)}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
        >
          <Plus size={16} />
          <span>Abrir Nuevo Paralelo</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
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
            <Layers size={22} />
          </div>
          <div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Paralelos Habilitados
            </p>
            <p style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {paralelos.length} Cursos
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
            <Users size={22} />
          </div>
          <div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Alumnos Asignados
            </p>
            <p style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--status-active)' }}>
              {totalInscritos} / {totalCapacidad}
            </p>
          </div>
        </div>

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
            <Sparkles size={22} />
          </div>
          <div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Ocupación de Cupos
            </p>
            <p style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--military-gold-primary)' }}>
              {tasaOcupacionGlobal}%
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
            <MapPin size={22} />
          </div>
          <div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Aulas en Uso
            </p>
            <p style={{ fontSize: '1.45rem', fontWeight: 800, color: '#38bdf8' }}>
              6 Aulas Activas
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="card" style={{ padding: '1.25rem' }}>
        
        {/* Barra de Filtros y Búsqueda */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '340px' }}>
            <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Buscar por código, docente o aula..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input"
              style={{ paddingLeft: '2.2rem', width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <select
              value={filtroIdioma}
              onChange={(e) => setFiltroIdioma(e.target.value)}
              className="input"
              style={{ padding: '0.45rem 1rem' }}
            >
              <option value="TODOS">Todos los Idiomas</option>
              <option value="Inglés">Inglés</option>
              <option value="Francés">Francés</option>
              <option value="Ruso">Ruso</option>
              <option value="Mandarín">Mandarín</option>
              <option value="Quechua">Quechua</option>
            </select>

            <select
              value={filtroTurno}
              onChange={(e) => setFiltroTurno(e.target.value)}
              className="input"
              style={{ padding: '0.45rem 1rem' }}
            >
              <option value="TODOS">Todos los Turnos</option>
              <option value="MAÑANA">Mañana</option>
              <option value="TARDE">Tarde</option>
              <option value="NOCHE">Noche</option>
            </select>
          </div>
        </div>

        {/* Tabla de Paralelos */}
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Código Paralelo</th>
                <th>Programa & Nivel</th>
                <th>Instructor Asignado</th>
                <th>Horario & Días</th>
                <th>Aula / Pabellón</th>
                <th>Ocupación de Cupos</th>
                <th style={{ textAlign: 'right' }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {paralelosFiltrados.map((par) => {
                const ratio = par.inscritos / par.capacidad;
                const estaLleno = ratio >= 0.9;
                return (
                  <tr key={par.id}>
                    <td>
                      <span
                        style={{
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          fontFamily: 'monospace',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                          background: 'var(--military-blue-subtle)',
                          color: 'var(--text-main)',
                          border: '1px solid var(--border-subtle)',
                        }}
                      >
                        {par.id}
                      </span>
                    </td>
                    <td>
                      <div>
                        <p style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.88rem' }}>
                          {par.idioma}
                        </p>
                        <p style={{ fontSize: '0.72rem', color: 'var(--military-gold-primary)' }}>
                          {par.nivel} &bull; Turno {par.turno}
                        </p>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        {par.docente}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: 'var(--text-main)' }}>
                        <Clock size={13} style={{ color: 'var(--text-muted)' }} />
                        <span>{par.horario}</span>
                      </div>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>{par.dias}</p>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        <MapPin size={13} style={{ color: 'var(--military-gold-primary)' }} />
                        <span>{par.aula}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ flex: 1, minWidth: '70px', height: '6px', background: 'var(--bg-surface-elevated)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${Math.min(ratio * 100, 100)}%`,
                              height: '100%',
                              background: estaLleno ? '#fbbf24' : 'var(--status-active)',
                            }}
                          />
                        </div>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)' }}>
                          {par.inscritos}/{par.capacidad}
                        </span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => setModalGestionar(par)}
                        className="btn btn-secondary"
                        style={{ padding: '0.3rem 0.65rem', fontSize: '0.72rem' }}
                      >
                        Gestionar
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
          MODAL DE APERTURA DE NUEVO PARALELO
      ================================================================= */}
      {modalNuevoParalelo && (
        <div className="modal-overlay" onClick={() => setModalNuevoParalelo(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Plus size={18} style={{ color: 'var(--military-gold-primary)' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Abrir Nuevo Paralelo de Idiomas
                </h3>
              </div>
              <button onClick={() => setModalNuevoParalelo(false)} className="btn-icon btn-ghost">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCrearParalelo} style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label className="input-label">Código del Paralelo *</label>
                  <input
                    type="text"
                    value={formCodigo}
                    onChange={(e) => setFormCodigo(e.target.value)}
                    placeholder="Ej. ING-103-C"
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="input-label">Idioma</label>
                  <select
                    value={formIdioma}
                    onChange={(e) => setFormIdioma(e.target.value)}
                    className="input"
                  >
                    <option value="Inglés Militar">Inglés Militar</option>
                    <option value="Francés">Francés</option>
                    <option value="Ruso">Ruso</option>
                    <option value="Mandarín">Mandarín</option>
                    <option value="Quechua">Quechua</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label className="input-label">Nivel Académico</label>
                  <select
                    value={formNivel}
                    onChange={(e) => setFormNivel(e.target.value)}
                    className="input"
                  >
                    <option value="Básico A1">Básico A1</option>
                    <option value="Básico A2">Básico A2</option>
                    <option value="Intermedio B1">Intermedio B1</option>
                    <option value="Intermedio B2">Intermedio B2</option>
                    <option value="Avanzado C1">Avanzado C1</option>
                  </select>
                </div>

                <div>
                  <label className="input-label">Turno</label>
                  <select
                    value={formTurno}
                    onChange={(e) => setFormTurno(e.target.value as any)}
                    className="input"
                  >
                    <option value="MAÑANA">Mañana</option>
                    <option value="TARDE">Tarde</option>
                    <option value="NOCHE">Noche</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="input-label">Instructor Responsable</label>
                <select
                  value={formDocente}
                  onChange={(e) => setFormDocente(e.target.value)}
                  className="input"
                >
                  <option value="Tte. Carlos Ramos">Tte. Carlos Ramos</option>
                  <option value="Sgto. María Condori">Sgto. María Condori</option>
                  <option value="Cap. Fernando Ríos">Cap. Fernando Ríos</option>
                  <option value="My. Roberto Daza">My. Roberto Daza</option>
                  <option value="Lic. Ana Blanco">Lic. Ana Blanco</option>
                  <option value="Sof. René Quisbert">Sof. René Quisbert</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label className="input-label">Aula Asignada</label>
                  <input
                    type="text"
                    value={formAula}
                    onChange={(e) => setFormAula(e.target.value)}
                    placeholder="Aula 103 - Alfa"
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="input-label">Capacidad Máxima</label>
                  <input
                    type="number"
                    min="5"
                    max="50"
                    value={formCapacidad}
                    onChange={(e) => setFormCapacidad(Number(e.target.value))}
                    className="input"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label className="input-label">Horario</label>
                  <input
                    type="text"
                    value={formHorario}
                    onChange={(e) => setFormHorario(e.target.value)}
                    placeholder="08:00 - 09:30"
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="input-label">Días de Clase</label>
                  <input
                    type="text"
                    value={formDias}
                    onChange={(e) => setFormDias(e.target.value)}
                    placeholder="Lun-Vie"
                    className="input"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setModalNuevoParalelo(false)} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Plus size={15} />
                  <span>Habilitar Curso</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================
          MODAL DE GESTIÓN DE PARALELO
      ================================================================= */}
      {modalGestionar && (
        <div className="modal-overlay" onClick={() => setModalGestionar(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Layers size={18} style={{ color: 'var(--military-gold-primary)' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Gestión del Curso {modalGestionar.id}
                </h3>
              </div>
              <button onClick={() => setModalGestionar(null)} className="btn-icon btn-ghost">
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {modalGestionar.idioma} ({modalGestionar.nivel})
                  </h4>
                  <span className="badge badge-gold">{modalGestionar.id}</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--military-gold-primary)', marginTop: '0.2rem' }}>
                  Instructor: {modalGestionar.docente}
                </p>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {modalGestionar.aula} &bull; {modalGestionar.horario} ({modalGestionar.dias})
                </p>
              </div>

              <div style={{ background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: '6px' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                  Aforo y Cupos del Curso
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0.4rem 0 0.2rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>Estudiantes Matriculados:</span>
                  <span style={{ fontWeight: 800, color: 'var(--status-active)' }}>
                    {modalGestionar.inscritos} de {modalGestionar.capacidad} cupos
                  </span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'var(--bg-surface)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${(modalGestionar.inscritos / modalGestionar.capacidad) * 100}%`,
                      height: '100%',
                      background: 'var(--status-active)',
                    }}
                  />
                </div>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                  Cupos disponibles restantes: <strong>{modalGestionar.capacidad - modalGestionar.inscritos} plazas</strong>
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem' }}>
                <button onClick={() => setModalGestionar(null)} className="btn btn-secondary">
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    showToast(`Sincronización de aula actualizada para ${modalGestionar.id}.`);
                    setModalGestionar(null);
                  }}
                  className="btn btn-primary"
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
