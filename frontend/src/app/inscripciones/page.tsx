'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  UserPlus,
  Search,
  Filter,
  Shield,
  Calendar,
  CreditCard,
  CheckCircle2,
  Clock,
  Printer,
  X,
  FileText,
  DollarSign,
  Award,
  Users,
  Sparkles,
  QrCode
} from 'lucide-react';

interface Inscripcion {
  id: string;
  estudiante: string;
  ci: string;
  tipo: 'MILITAR' | 'CIVIL';
  grado?: string;
  idioma: string;
  nivel: string;
  paralelo: string;
  fecha: string;
  estadoPago: 'PAGADO' | 'PENDIENTE' | 'BECA_MILITAR';
  montoBs: number;
}

const INSCRIPCIONES_INICIALES: Inscripcion[] = [
  {
    id: 'INS-26-001',
    estudiante: 'Cap. Carlos Mamani Quispe',
    ci: '6849201 LP',
    tipo: 'MILITAR',
    grado: 'Capitán de Infantería',
    idioma: 'Inglés Militar',
    nivel: 'Avanzado B2',
    paralelo: 'ING-AV-01',
    fecha: '14 Oct 2026',
    estadoPago: 'BECA_MILITAR',
    montoBs: 0,
  },
  {
    id: 'INS-26-002',
    estudiante: 'Valentina Sofía Rios',
    ci: '8392014 CB',
    tipo: 'CIVIL',
    idioma: 'Francés',
    nivel: 'Intermedio B1',
    paralelo: 'FR-INT-02',
    fecha: '13 Oct 2026',
    estadoPago: 'PAGADO',
    montoBs: 300,
  },
  {
    id: 'INS-26-003',
    estudiante: 'Subtte. Jorge Vargas Peñaranda',
    ci: '4920183 SC',
    tipo: 'MILITAR',
    grado: 'Subteniente de Artillería',
    idioma: 'Inglés Militar',
    nivel: 'Básico A2',
    paralelo: 'ING-BAS-03',
    fecha: '12 Oct 2026',
    estadoPago: 'BECA_MILITAR',
    montoBs: 0,
  },
  {
    id: 'INS-26-004',
    estudiante: 'Camila Andrea Montenegro',
    ci: '9120485 OR',
    tipo: 'CIVIL',
    idioma: 'Portugués Comercial',
    nivel: 'Básico A1',
    paralelo: 'POR-BAS-01',
    fecha: '11 Oct 2026',
    estadoPago: 'PENDIENTE',
    montoBs: 300,
  },
  {
    id: 'INS-26-005',
    estudiante: 'My. Roberto Daza Miranda',
    ci: '4928103 SC',
    tipo: 'MILITAR',
    grado: 'Mayor de Blindados',
    idioma: 'Ruso Técnico',
    nivel: 'Intermedio B1',
    paralelo: 'RUS-INT-01',
    fecha: '10 Oct 2026',
    estadoPago: 'BECA_MILITAR',
    montoBs: 0,
  },
];

export default function InscripcionesPage() {
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>(INSCRIPCIONES_INICIALES);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filtroTipo, setFiltroTipo] = useState<string>('TODOS');
  const [filtroEstado, setFiltroEstado] = useState<string>('TODOS');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Modales
  const [modalNuevaInscripcion, setModalNuevaInscripcion] = useState<boolean>(false);
  const [modalBoleta, setModalBoleta] = useState<Inscripcion | null>(null);

  // Form Nueva Inscripción
  const [formEstudiante, setFormEstudiante] = useState<string>('');
  const [formCi, setFormCi] = useState<string>('');
  const [formTipo, setFormTipo] = useState<'MILITAR' | 'CIVIL'>('MILITAR');
  const [formGrado, setFormGrado] = useState<string>('Subteniente');
  const [formIdioma, setFormIdioma] = useState<string>('Inglés Militar');
  const [formNivel, setFormNivel] = useState<string>('Básico A1');
  const [formParalelo, setFormParalelo] = useState<string>('ING-101-A');
  const [formFecha, setFormFecha] = useState<string>(() => new Date().toISOString().split('T')[0]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const cargarInscripciones = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/inscripciones');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const list = json.data || (Array.isArray(json) ? json : []);
      if (list.length > 0) {
        const mapped: Inscripcion[] = list.map((ins: any) => {
          const est = ins.estudiante || {};
          const mil = est.militar;
          const par = ins.paralelo || {};
          const niv = par.nivel || {};
          const prog = niv.programa || {};
          const idm = prog.idioma || {};
          const esMil = (est.tipo_estudiante || '').toLowerCase() === 'militar';

          return {
            id: `INS-26-00${ins.id_inscripcion}`,
            estudiante: esMil ? `${mil?.grado_militar || 'Oficial'} ${est.nombre_estudiante || ''} ${est.apellido_estudiante || ''}`.trim() : `${est.nombre_estudiante || ''} ${est.apellido_estudiante || ''}`.trim(),
            ci: est.ci_estudiante || '—',
            tipo: esMil ? 'MILITAR' : 'CIVIL',
            grado: mil?.grado_militar,
            idioma: idm.nombre_idioma || 'Inglés Militar',
            nivel: niv.nombre_nivel || 'Básico A1',
            paralelo: par.codigo_paralelo || 'ING-101-A',
            fecha: ins.fecha_inscripcion ? new Date(ins.fecha_inscripcion).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : '14 Oct 2026',
            estadoPago: esMil ? 'BECA_MILITAR' : 'PAGADO',
            montoBs: esMil ? 0 : 300,
          };
        });
        setInscripciones(mapped);
      }
    } catch (err) {
      console.warn('Inscripciones en modo fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarInscripciones();
  }, []);

  const inscripcionesFiltradas = useMemo(() => {
    return inscripciones.filter((ins) => {
      const matchTipo = filtroTipo === 'TODOS' || ins.tipo === filtroTipo;
      const matchEstado = filtroEstado === 'TODOS' || ins.estadoPago === filtroEstado;
      const q = searchTerm.toLowerCase().trim();
      const matchSearch =
        !q ||
        ins.estudiante.toLowerCase().includes(q) ||
        ins.ci.toLowerCase().includes(q) ||
        ins.id.toLowerCase().includes(q) ||
        ins.idioma.toLowerCase().includes(q) ||
        (ins.grado && ins.grado.toLowerCase().includes(q));

      return matchTipo && matchEstado && matchSearch;
    });
  }, [inscripciones, filtroTipo, filtroEstado, searchTerm]);

  const militaresBecados = inscripciones.filter((i) => i.tipo === 'MILITAR');
  const civilesInscritos = inscripciones.filter((i) => i.tipo === 'CIVIL');
  const totalRecaudadoBs = inscripciones.reduce((acc, i) => acc + (i.estadoPago === 'PAGADO' ? i.montoBs : 0), 0);

  const handleCrearInscripcion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formEstudiante || !formCi) {
      alert('Por favor complete los campos obligatorios.');
      return;
    }

    const hoyStr = new Date().toISOString().split('T')[0];
    if (formFecha > hoyStr) {
      alert('Seguridad SACA: La fecha de matrícula no puede ser futura (ej. 2028 no permitido).');
      return;
    }

    const nueva: Inscripcion = {
      id: `INS-26-00${inscripciones.length + 1}`,
      estudiante: formTipo === 'MILITAR' ? `${formGrado} ${formEstudiante}` : formEstudiante,
      ci: formCi,
      tipo: formTipo,
      grado: formTipo === 'MILITAR' ? formGrado : undefined,
      idioma: formIdioma,
      nivel: formNivel,
      paralelo: formParalelo,
      fecha: new Date(formFecha + 'T00:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
      estadoPago: formTipo === 'MILITAR' ? 'BECA_MILITAR' : 'PAGADO',
      montoBs: formTipo === 'MILITAR' ? 0 : 300,
    };

    setInscripciones([nueva, ...inscripciones]);
    setModalNuevaInscripcion(false);
    showToast(`Matrícula ${nueva.id} confirmada para ${nueva.estudiante}.`);

    setFormEstudiante('');
    setFormCi('');
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
              <CreditCard size={12} /> Secretaría y Matriculación
            </span>
            <span className="badge badge-military">Periodo Octubre 2026</span>
          </div>
          <h1
            className="font-solemn"
            style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '0.02em' }}
          >
            Registro de Inscripciones y Matrícula
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Personal militar con beneficio de Beca Institucional del 100% y estudiantes particulares civiles con pago de arancel regular.
          </p>
        </div>

        <button
          onClick={() => setModalNuevaInscripcion(true)}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
        >
          <UserPlus size={16} />
          <span>Nueva Inscripción</span>
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
            <Users size={22} />
          </div>
          <div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Total Matriculados
            </p>
            <p style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {inscripciones.length} Alumnos
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
            <Shield size={22} />
          </div>
          <div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Militares Becados (100%)
            </p>
            <p style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--status-active)' }}>
              {militaresBecados.length} Efectivos
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
            <Users size={22} />
          </div>
          <div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Particulares Civiles
            </p>
            <p style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--military-gold-primary)' }}>
              {civilesInscritos.length} Alumnos
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
              color: 'var(--status-active)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <DollarSign size={22} />
          </div>
          <div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Recaudación Matrículas
            </p>
            <p style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--status-active)' }}>
              Bs. {totalRecaudadoBs}
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
              placeholder="Buscar por código, estudiante o CI..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input"
              style={{ paddingLeft: '2.2rem', width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="input"
              style={{ padding: '0.45rem 1rem' }}
            >
              <option value="TODOS">Todos los Tipos</option>
              <option value="MILITAR">Personal Militar (Beca 100%)</option>
              <option value="CIVIL">Particulares Civiles</option>
            </select>

            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="input"
              style={{ padding: '0.45rem 1rem' }}
            >
              <option value="TODOS">Todos los Estados</option>
              <option value="BECA_MILITAR">Beca Militar Exenta</option>
              <option value="PAGADO">Pagado</option>
              <option value="PENDIENTE">Pendiente</option>
            </select>
          </div>
        </div>

        {/* Tabla de Inscripciones */}
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Estudiante</th>
                <th>C.I. / Tipo</th>
                <th>Programa & Nivel</th>
                <th>Paralelo</th>
                <th>Fecha</th>
                <th>Estado & Arancel</th>
                <th style={{ textAlign: 'right' }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {inscripcionesFiltradas.map((ins) => {
                const esMilitar = ins.tipo === 'MILITAR';
                const pagado = ins.estadoPago === 'PAGADO' || ins.estadoPago === 'BECA_MILITAR';

                return (
                  <tr key={ins.id}>
                    <td>
                      <span
                        style={{
                          fontSize: '0.78rem',
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          color: 'var(--text-muted)',
                        }}
                      >
                        {ins.id}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            background: esMilitar ? 'var(--military-green-primary)' : 'var(--military-navy)',
                            color: esMilitar ? 'var(--military-gold-primary)' : '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                          }}
                        >
                          {esMilitar ? <Shield size={14} /> : <Users size={14} />}
                        </div>
                        <div>
                          <p style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.88rem' }}>
                            {ins.estudiante}
                          </p>
                          <p style={{ fontSize: '0.7rem', color: 'var(--military-gold-primary)' }}>
                            {ins.grado || 'Civil'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--text-main)' }}>
                        {ins.ci}
                      </span>
                    </td>
                    <td>
                      <div>
                        <p style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.85rem' }}>
                          {ins.idioma}
                        </p>
                        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{ins.nivel}</p>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-military" style={{ fontSize: '0.72rem' }}>
                        {ins.paralelo}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{ins.fecha}</span>
                    </td>
                    <td>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          {pagado ? (
                            <CheckCircle2 size={13} style={{ color: 'var(--status-active)' }} />
                          ) : (
                            <Clock size={13} style={{ color: '#fbbf24' }} />
                          )}
                          <span
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              color: pagado ? 'var(--status-active)' : '#fbbf24',
                            }}
                          >
                            {ins.estadoPago === 'BECA_MILITAR' ? 'Beca 100%' : ins.estadoPago}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {ins.montoBs === 0 ? 'Bs. 0 (Subvencionado)' : `Bs. ${ins.montoBs}`}
                        </p>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => setModalBoleta(ins)}
                        className="btn btn-secondary"
                        style={{ padding: '0.3rem 0.65rem', fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                      >
                        <Printer size={13} /> Boleta
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
          MODAL DE NUEVA MATRÍCULA / INSCRIPCIÓN
      ================================================================= */}
      {modalNuevaInscripcion && (
        <div className="modal-overlay" onClick={() => setModalNuevaInscripcion(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <UserPlus size={18} style={{ color: 'var(--military-gold-primary)' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Matricular Nuevo Estudiante
                </h3>
              </div>
              <button onClick={() => setModalNuevaInscripcion(false)} className="btn-icon btn-ghost">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCrearInscripcion} style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="input-label">Categoría del Estudiante</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setFormTipo('MILITAR')}
                    className={`btn ${formTipo === 'MILITAR' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '0.78rem', justifyContent: 'center' }}
                  >
                    <Shield size={14} /> Efectivo Militar (Beca 100%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormTipo('CIVIL')}
                    className={`btn ${formTipo === 'CIVIL' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '0.78rem', justifyContent: 'center' }}
                  >
                    <Users size={14} /> Particular Civil (Bs. 300)
                  </button>
                </div>
              </div>

              <div>
                <label className="input-label">Nombres y Apellidos *</label>
                <input
                  type="text"
                  value={formEstudiante}
                  onChange={(e) => setFormEstudiante(e.target.value)}
                  placeholder="Ej. Juan Pérez / Carlos Mamani"
                  className="input"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label className="input-label">Cédula de Identidad *</label>
                  <input
                    type="text"
                    value={formCi}
                    onChange={(e) => setFormCi(e.target.value)}
                    placeholder="Ej. 6849201 LP"
                    className="input"
                    required
                  />
                </div>

                {formTipo === 'MILITAR' ? (
                  <div>
                    <label className="input-label">Grado Militar</label>
                    <select
                      value={formGrado}
                      onChange={(e) => setFormGrado(e.target.value)}
                      className="input"
                    >
                      <option value="Subteniente">Subteniente</option>
                      <option value="Teniente">Teniente</option>
                      <option value="Capitán">Capitán</option>
                      <option value="Mayor">Mayor</option>
                      <option value="Suboficial">Suboficial</option>
                      <option value="Sargento">Sargento</option>
                      <option value="Cadete Militar">Cadete Militar</option>
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="input-label">Ocupación / Institución</label>
                    <input
                      type="text"
                      placeholder="Universidad / Particular"
                      className="input"
                    />
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
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

                <div>
                  <label className="input-label">Nivel</label>
                  <select
                    value={formNivel}
                    onChange={(e) => setFormNivel(e.target.value)}
                    className="input"
                  >
                    <option value="Básico A1">Básico A1</option>
                    <option value="Básico A2">Básico A2</option>
                    <option value="Intermedio B1">Intermedio B1</option>
                    <option value="Avanzado B2">Avanzado B2</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label className="input-label">Paralelo Asignado</label>
                  <select
                    value={formParalelo}
                    onChange={(e) => setFormParalelo(e.target.value)}
                    className="input"
                  >
                    <option value="ING-101-A">ING-101-A (Lun-Vie 08:00 - Tte. Ramos)</option>
                    <option value="ING-102-B">ING-102-B (Lun-Vie 10:00 - Sgto. Condori)</option>
                    <option value="FRA-101-A">FRA-101-A (Mar-Jue 08:00 - Cap. Ríos)</option>
                    <option value="RUS-INT-01">RUS-INT-01 (Lun-Mie-Vie 14:00 - My. Daza)</option>
                    <option value="MAN-201-A">MAN-201-A (Lun-Mie-Vie 16:00 - Lic. Blanco)</option>
                  </select>
                </div>
                <div>
                  <label className="input-label">Fecha de Matrícula * (Máx: Hoy)</label>
                  <input
                    type="date"
                    value={formFecha}
                    max={new Date().toISOString().split('T')[0]}
                    min="2020-01-01"
                    onChange={(e) => {
                      const val = e.target.value;
                      const hoyStr = new Date().toISOString().split('T')[0];
                      if (val > hoyStr) {
                        alert('Seguridad SACA: No se permiten fechas de matrícula futuras (ej. 2028).');
                        setFormFecha(hoyStr);
                      } else {
                        setFormFecha(val);
                      }
                    }}
                    className="input"
                    required
                  />
                </div>
              </div>

              {/* Resumen arancel */}
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
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Arancel Aplicable:</span>
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: formTipo === 'MILITAR' ? 'var(--status-active)' : 'var(--text-main)' }}>
                  {formTipo === 'MILITAR' ? 'Bs. 0 (Beca 100% Subvencionada)' : 'Bs. 300 (Matrícula Regular)'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setModalNuevaInscripcion(false)} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <CheckCircle2 size={15} />
                  <span>Confirmar Matrícula</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================
          MODAL DE BOLETA OFICIAL DE MATRÍCULA CEDMIL
      ================================================================= */}
      {modalBoleta && (
        <div className="modal-overlay" onClick={() => setModalBoleta(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <FileText size={18} style={{ color: 'var(--military-gold-primary)' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Boleta Oficial de Matrícula &bull; CEDMIL
                </h3>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button onClick={() => window.print()} className="btn btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Printer size={13} /> Imprimir
                </button>
                <button onClick={() => setModalBoleta(null)} className="btn-icon btn-ghost">
                  <X size={18} />
                </button>
              </div>
            </div>

            <div style={{ padding: '1.75rem', background: '#ffffff', color: '#0f172a', fontFamily: 'sans-serif' }}>
              {/* Encabezado */}
              <div style={{ textAlign: 'center', borderBottom: '2px solid #1e293b', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  COMANDO GENERAL DEL EJÉRCITO &bull; CEDMIL
                </p>
                <p style={{ fontSize: '0.72rem', color: '#1b4332', fontWeight: 700 }}>
                  ESCUELA DE IDIOMAS DEL EJÉRCITO (EIE)
                </p>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: '0.4rem', letterSpacing: '0.02em' }}>
                  BOLETA OFICIAL DE MATRICULACIÓN ACADÉMICA
                </h3>
                <p style={{ fontSize: '0.75rem', color: '#475569' }}>
                  Gestión 2026 &bull; Comprobante de Acreditación N° <strong>{modalBoleta.id}</strong>
                </p>
              </div>

              {/* Datos */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.8rem', marginBottom: '1.25rem', background: '#f8fafc', padding: '0.85rem', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                <div><strong>Estudiante:</strong> {modalBoleta.estudiante}</div>
                <div><strong>C.I.:</strong> {modalBoleta.ci}</div>
                <div><strong>Categoría:</strong> {modalBoleta.tipo === 'MILITAR' ? 'Personal Militar (Beca 100%)' : 'Civil Particular'}</div>
                <div><strong>Fecha de Emisión:</strong> {modalBoleta.fecha}</div>
                <div><strong>Programa:</strong> {modalBoleta.idioma} ({modalBoleta.nivel})</div>
                <div><strong>Paralelo Asignado:</strong> {modalBoleta.paralelo}</div>
                <div><strong>Estado de Arancel:</strong> {modalBoleta.estadoPago}</div>
                <div><strong>Monto Acreditado:</strong> {modalBoleta.montoBs === 0 ? 'Bs. 0 (Subvención EIE)' : `Bs. ${modalBoleta.montoBs}`}</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px dashed #cbd5e1' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                  <p>Código Verificador: SACA-2026-VAL-9842</p>
                  <p>Subordinación y Constancia &bull; ¡Viva Bolivia hacia el mar!</p>
                </div>
                <div style={{ textAlign: 'center', width: '160px', borderTop: '1px solid #0f172a', paddingTop: '0.35rem' }}>
                  <p style={{ fontSize: '0.72rem', fontWeight: 700 }}>Oficial de Registro</p>
                  <p style={{ fontSize: '0.65rem', color: '#64748b' }}>EIE &bull; CEDMIL</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
