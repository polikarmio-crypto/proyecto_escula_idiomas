'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Shield,
  UserCheck,
  GraduationCap,
  Search,
  Plus,
  RefreshCw,
  Download,
  Eye,
  Edit,
  CheckCircle2,
  AlertCircle,
  X,
  FileText,
  Phone,
  Mail,
  Building2,
  ChevronLeft,
  ChevronRight,
  Award,
} from 'lucide-react';

type TipoEstudiante = 'TODOS' | 'MILITAR' | 'CIVIL';
type EstadoEstudiante = 'ACTIVO' | 'INACTIVO' | 'PENDIENTE';

interface Estudiante {
  id: number;
  codigoMatricula: string;
  nombres: string;
  apellidos: string;
  ci: string;
  expedido: string;
  tipo: 'MILITAR' | 'CIVIL';
  gradoMilitar?: string;
  unidadMilitar?: string;
  idiomaActual: string;
  nivelActual: string;
  paralelo: string;
  telefono: string;
  correo: string;
  estado: EstadoEstudiante;
  asistencia: number;
  promedio: number;
}

const ESTUDIANTES_INICIALES: Estudiante[] = [
  {
    id: 1,
    codigoMatricula: 'EIE-2026-0041',
    nombres: 'Carlos Fernando',
    apellidos: 'Mamani Quispe',
    ci: '6849201',
    expedido: 'LP',
    tipo: 'MILITAR',
    gradoMilitar: 'Capitán de Infantería',
    unidadMilitar: 'Regimiento Colorados de Bolivia',
    idiomaActual: 'Inglés Militar Avanzado',
    nivelActual: 'Avanzado B2',
    paralelo: 'ING-AV-01',
    telefono: '+591 71548920',
    correo: 'c.mamani@ejercito.mil.bo',
    estado: 'ACTIVO',
    asistencia: 96,
    promedio: 88,
  },
  {
    id: 2,
    codigoMatricula: 'EIE-2026-0042',
    nombres: 'Valentina Sofía',
    apellidos: 'Rios Torrico',
    ci: '8392014',
    expedido: 'CB',
    tipo: 'CIVIL',
    idiomaActual: 'Francés Diplomático',
    nivelActual: 'Intermedio B1',
    paralelo: 'FR-INT-02',
    telefono: '+591 76420198',
    correo: 'valentina.rios@gmail.com',
    estado: 'ACTIVO',
    asistencia: 92,
    promedio: 94,
  },
  {
    id: 3,
    codigoMatricula: 'EIE-2026-0043',
    nombres: 'Jorge Luis',
    apellidos: 'Vargas Peñaranda',
    ci: '4920183',
    expedido: 'SC',
    tipo: 'MILITAR',
    gradoMilitar: 'Subteniente de Artillería',
    unidadMilitar: 'Batallón Logístico I',
    idiomaActual: 'Inglés Técnico Militar',
    nivelActual: 'Básico A2',
    paralelo: 'ING-BAS-03',
    telefono: '+591 78912340',
    correo: 'j.vargas@ejercito.mil.bo',
    estado: 'ACTIVO',
    asistencia: 88,
    promedio: 81,
  },
  {
    id: 4,
    codigoMatricula: 'EIE-2026-0044',
    nombres: 'Camila Andrea',
    apellidos: 'Montenegro Siles',
    ci: '9120485',
    expedido: 'OR',
    tipo: 'CIVIL',
    idiomaActual: 'Portugués Comercial',
    nivelActual: 'Básico A1',
    paralelo: 'POR-BAS-01',
    telefono: '+591 69401283',
    correo: 'camila.montenegro@ucb.edu.bo',
    estado: 'PENDIENTE',
    asistencia: 74,
    promedio: 65,
  },
  {
    id: 5,
    codigoMatricula: 'EIE-2026-0045',
    nombres: 'Alejandro Rene',
    apellidos: 'Gutiérrez Dorado',
    ci: '5829104',
    expedido: 'TJ',
    tipo: 'MILITAR',
    gradoMilitar: 'Teniente de Comunicaciones',
    unidadMilitar: 'Comando de Transmisiones',
    idiomaActual: 'Ruso Técnico',
    nivelActual: 'Intermedio B1',
    paralelo: 'RUS-INT-01',
    telefono: '+591 73294810',
    correo: 'a.gutierrez@ejercito.mil.bo',
    estado: 'ACTIVO',
    asistencia: 100,
    promedio: 96,
  },
  {
    id: 6,
    codigoMatricula: 'EIE-2026-0046',
    nombres: 'Mariana Lucía',
    apellidos: 'Chávez Guzmán',
    ci: '7401928',
    expedido: 'CH',
    tipo: 'CIVIL',
    idiomaActual: 'Alemán Académico',
    nivelActual: 'Básico A2',
    paralelo: 'ALM-BAS-02',
    telefono: '+591 75839201',
    correo: 'marianachavez@outlook.com',
    estado: 'ACTIVO',
    asistencia: 90,
    promedio: 85,
  },
];

export default function EstudiantesPage() {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>(ESTUDIANTES_INICIALES);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filtroTipo, setFiltroTipo] = useState<TipoEstudiante>('TODOS');
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState<Estudiante | null>(null);
  const [modalRegistroAbierto, setModalRegistroAbierto] = useState<boolean>(false);
  const [toastMensaje, setToastMensaje] = useState<string | null>(null);

  // Formulario de registro
  const [formTipo, setFormTipo] = useState<'CIVIL' | 'MILITAR'>('MILITAR');
  const [formNombres, setFormNombres] = useState('');
  const [formApellidos, setFormApellidos] = useState('');
  const [formCi, setFormCi] = useState('');
  const [formExpedido, setFormExpedido] = useState('LP');
  const [formGrado, setFormGrado] = useState('Subteniente');
  const [formUnidad, setFormUnidad] = useState('');
  const [formIdioma, setFormIdioma] = useState('Inglés');
  const [formNivel, setFormNivel] = useState('Básico A1');
  const [formTelefono, setFormTelefono] = useState('');
  const [formCorreo, setFormCorreo] = useState('');

  // Simulación de carga sobria inicial
  useEffect(() => {
    triggerReload();
  }, []);

  const triggerReload = () => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  };

  const showToast = (msg: string) => {
    setToastMensaje(msg);
    setTimeout(() => setToastMensaje(null), 3500);
  };

  const estudiantesFiltrados = useMemo(() => {
    return estudiantes.filter((est) => {
      const matchTipo = filtroTipo === 'TODOS' ? true : est.tipo === filtroTipo;
      const q = searchTerm.toLowerCase().trim();
      const matchSearch =
        !q ||
        est.nombres.toLowerCase().includes(q) ||
        est.apellidos.toLowerCase().includes(q) ||
        est.ci.toLowerCase().includes(q) ||
        est.codigoMatricula.toLowerCase().includes(q) ||
        (est.gradoMilitar && est.gradoMilitar.toLowerCase().includes(q)) ||
        est.idiomaActual.toLowerCase().includes(q);

      return matchTipo && matchSearch;
    });
  }, [estudiantes, filtroTipo, searchTerm]);

  const conteoMilitar = estudiantes.filter((e) => e.tipo === 'MILITAR').length;
  const conteoCivil = estudiantes.filter((e) => e.tipo === 'CIVIL').length;
  const promedioGeneral = Math.round(
    estudiantes.reduce((acc, curr) => acc + curr.promedio, 0) / (estudiantes.length || 1)
  );

  const handleCrearEstudiante = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNombres || !formApellidos || !formCi) {
      alert('Por favor complete los campos obligatorios.');
      return;
    }

    const nuevo: Estudiante = {
      id: Date.now(),
      codigoMatricula: `EIE-2026-00${estudiantes.length + 41}`,
      nombres: formNombres,
      apellidos: formApellidos,
      ci: formCi,
      expedido: formExpedido,
      tipo: formTipo,
      gradoMilitar: formTipo === 'MILITAR' ? formGrado : undefined,
      unidadMilitar: formTipo === 'MILITAR' ? (formUnidad || 'Comando General') : undefined,
      idiomaActual: formIdioma,
      nivelActual: formNivel,
      paralelo: `${formIdioma.substring(0, 3).toUpperCase()}-01`,
      telefono: formTelefono || '+591 70000000',
      correo: formCorreo || `${formNombres.toLowerCase()}.${formApellidos.toLowerCase()}@ejercito.mil.bo`,
      estado: 'ACTIVO',
      asistencia: 100,
      promedio: 90,
    };

    setEstudiantes([nuevo, ...estudiantes]);
    setModalRegistroAbierto(false);
    showToast(`Estudiante ${nuevo.nombres} registrado en nómina.`);

    setFormNombres('');
    setFormApellidos('');
    setFormCi('');
    setFormUnidad('');
    setFormTelefono('');
    setFormCorreo('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Toast sobrio */}
      {toastMensaje && (
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
          <CheckCircle2 size={18} />
          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{toastMensaje}</span>
        </div>
      )}

      {/* Encabezado Formal Militar */}
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
              <Shield size={12} /> Estado Mayor Académico
            </span>
            <span className="badge badge-military">Gestión 2026</span>
          </div>
          <h1 className="font-solemn" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '0.02em' }}>
            Registro y Control de Estudiantes
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '680px' }}>
            Nómina oficial de personal militar en armas y estudiantes civiles matriculados en la Escuela de Idiomas del Ejército.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button
            onClick={triggerReload}
            disabled={loading}
            className="btn btn-secondary"
            title="Recargar datos y observar la animación militar de carga"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            <span>{loading ? 'Consultando...' : 'Recargar'}</span>
          </button>

          <button
            onClick={() => setModalRegistroAbierto(true)}
            className="btn btn-primary"
          >
            <Plus size={16} />
            <span>Nuevo Registro</span>
          </button>
        </div>
      </div>

      {/* Tarjetas de Resumen KPI Institucional */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '1rem',
        }}
      >
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
              Efectivo Total
            </p>
            <p style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {loading ? <span className="skeleton" style={{ display: 'inline-block', width: 40, height: 24 }} /> : estudiantes.length}
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
              Personal Militar
            </p>
            <p style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {loading ? <span className="skeleton" style={{ display: 'inline-block', width: 35, height: 24 }} /> : conteoMilitar}
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
            <GraduationCap size={22} />
          </div>
          <div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Civiles Matriculados
            </p>
            <p style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {loading ? <span className="skeleton" style={{ display: 'inline-block', width: 35, height: 24 }} /> : conteoCivil}
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
              color: 'var(--military-gold-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <Award size={22} />
          </div>
          <div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Promedio Académico
            </p>
            <p style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {loading ? <span className="skeleton" style={{ display: 'inline-block', width: 50, height: 24 }} /> : `${promedioGeneral} / 100`}
            </p>
          </div>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="card" style={{ padding: '0.9rem 1.15rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div className="filter-tabs">
            <button
              onClick={() => setFiltroTipo('TODOS')}
              className={`filter-tab ${filtroTipo === 'TODOS' ? 'active' : ''}`}
            >
              <span>Todos los Efectivos</span>
              <span style={{ fontSize: '0.7rem' }}>({estudiantes.length})</span>
            </button>
            <button
              onClick={() => setFiltroTipo('MILITAR')}
              className={`filter-tab ${filtroTipo === 'MILITAR' ? 'active' : ''}`}
            >
              <Shield size={13} />
              <span>Personal Militar</span>
              <span style={{ fontSize: '0.7rem' }}>({conteoMilitar})</span>
            </button>
            <button
              onClick={() => setFiltroTipo('CIVIL')}
              className={`filter-tab ${filtroTipo === 'CIVIL' ? 'active' : ''}`}
            >
              <UserCheck size={13} />
              <span>Particulares</span>
              <span style={{ fontSize: '0.7rem' }}>({conteoCivil})</span>
            </button>
          </div>

          <div style={{ flex: '1 1 260px', maxWidth: '380px', position: 'relative' }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por CI, Apellidos, Matrícula o Grado..."
              className="input"
              style={{ paddingLeft: '2.3rem' }}
            />
            <Search
              size={15}
              style={{
                position: 'absolute',
                left: '0.8rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Contenedor de la Tabla o Animación de Carga Militar */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          /* ===================================================================
             ANIMACIÓN DE CARGA MILITAR SOBRIA Y DETALLADA
          =================================================================== */
          <div>
            <div className="military-loader">
              <div className="military-crest-spinner">
                <div className="spinner-outer-ring" />
                <div className="spinner-inner-ring" />
                <div className="spinner-center-symbol">
                  <Shield size={20} />
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                  Consultando Registro del CEDMIL...
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--military-gold-primary)' }}>
                  Sincronizando nómina académica oficial del Ejército
                </p>
              </div>
            </div>

            {/* Skeleton Shimmer sobrio */}
            <div className="table-responsive" style={{ borderTop: '1px solid var(--border-subtle)' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Estudiante</th>
                    <th>Categoría</th>
                    <th>Cédula de Identidad</th>
                    <th>Programa & Nivel</th>
                    <th>Promedio</th>
                    <th style={{ textAlign: 'right' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map((idx) => (
                    <tr key={idx}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div className="skeleton" style={{ width: 34, height: 34, borderRadius: 4 }} />
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <div className="skeleton" style={{ width: 140, height: 13 }} />
                            <div className="skeleton" style={{ width: 85, height: 9 }} />
                          </div>
                        </div>
                      </td>
                      <td><div className="skeleton" style={{ width: 100, height: 20 }} /></td>
                      <td><div className="skeleton" style={{ width: 80, height: 14 }} /></td>
                      <td><div className="skeleton" style={{ width: 120, height: 14 }} /></td>
                      <td><div className="skeleton" style={{ width: 50, height: 16 }} /></td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                          <div className="skeleton" style={{ width: 30, height: 30 }} />
                          <div className="skeleton" style={{ width: 30, height: 30 }} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : estudiantesFiltrados.length === 0 ? (
          <div style={{ padding: '3.5rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <AlertCircle size={40} style={{ color: 'var(--military-gold-primary)', margin: '0 auto 0.75rem' }} />
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', fontWeight: 700, marginBottom: '0.35rem' }}>
              Sin registros coincidentes
            </h3>
            <p style={{ fontSize: '0.85rem', maxWidth: '380px', margin: '0 auto 1.25rem' }}>
              No se hallaron estudiantes que coincidan con la búsqueda o el filtro actual.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFiltroTipo('TODOS');
              }}
              className="btn btn-secondary"
            >
              Restablecer Criterios
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Estudiante</th>
                  <th>Categoría</th>
                  <th>Cédula de Identidad</th>
                  <th>Programa & Nivel</th>
                  <th>Promedio</th>
                  <th style={{ textAlign: 'right' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {estudiantesFiltrados.map((est) => {
                  const esMilitar = est.tipo === 'MILITAR';
                  return (
                    <tr key={est.id}>
                      {/* Nombre y Matrícula */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 4,
                              background: esMilitar ? 'var(--military-green-primary)' : 'var(--military-navy)',
                              color: esMilitar ? 'var(--military-gold-primary)' : '#ffffff',
                              border: '1px solid var(--border-subtle)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              fontSize: '0.8rem',
                              flexShrink: 0,
                            }}
                          >
                            {est.nombres.charAt(0)}{est.apellidos.charAt(0)}
                          </div>
                          <div>
                            <p style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.88rem' }}>
                              {est.apellidos}, {est.nombres}
                            </p>
                            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
                              {est.codigoMatricula}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Tipo / Categoría */}
                      <td>
                        {esMilitar ? (
                          <div>
                            <span className="badge badge-military">
                              <Shield size={10} /> {est.gradoMilitar}
                            </span>
                            <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                              {est.unidadMilitar}
                            </p>
                          </div>
                        ) : (
                          <span className="badge badge-civil">
                            <UserCheck size={10} /> Particular / Civil
                          </span>
                        )}
                      </td>

                      {/* Documento CI */}
                      <td>
                        <span
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: '0.82rem',
                            color: 'var(--text-main)',
                            padding: '0.2rem 0.45rem',
                            background: 'var(--bg-surface-elevated)',
                            borderRadius: '4px',
                            border: '1px solid var(--border-subtle)',
                          }}
                        >
                          {est.ci} {est.expedido}
                        </span>
                      </td>

                      {/* Idioma y Nivel */}
                      <td>
                        <div>
                          <p style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.85rem' }}>
                            {est.idiomaActual}
                          </p>
                          <p style={{ fontSize: '0.72rem', color: 'var(--military-gold-primary)' }}>
                            {est.nivelActual} &bull; Par. {est.paralelo}
                          </p>
                        </div>
                      </td>

                      {/* Calificación Promedio */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)' }}>
                            {est.promedio} pts
                          </span>
                          <span
                            className={est.promedio >= 80 ? 'badge badge-military' : 'badge badge-gold'}
                            style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem' }}
                          >
                            {est.promedio >= 80 ? 'Aprobado' : 'Regular'}
                          </span>
                        </div>
                      </td>

                      {/* Acciones */}
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                          <button
                            onClick={() => setEstudianteSeleccionado(est)}
                            className="btn btn-secondary btn-icon"
                            title="Ver Hoja de Vida Académica"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => showToast(`Editando datos de ${est.nombres}...`)}
                            className="btn btn-secondary btn-icon"
                            title="Modificar Datos"
                          >
                            <Edit size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginación */}
        <div
          style={{
            padding: '0.85rem 1.25rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
            background: 'var(--bg-surface-elevated)',
          }}
        >
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Total registrados: <strong>{estudiantesFiltrados.length}</strong> de {estudiantes.length}
          </span>

          <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
            <button className="btn btn-secondary btn-icon" disabled style={{ opacity: 0.5 }}>
              <ChevronLeft size={15} />
            </button>
            <span
              style={{
                padding: '0.25rem 0.65rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                background: 'var(--bg-surface)',
                borderRadius: '4px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              1
            </span>
            <button className="btn btn-secondary btn-icon" disabled style={{ opacity: 0.5 }}>
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* ===================================================================
         MODAL DE REGISTRO FORMAL
      =================================================================== */}
      {modalRegistroAbierto && (
        <div className="modal-overlay" onClick={() => setModalRegistroAbierto(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Shield size={18} style={{ color: 'var(--military-gold-primary)' }} />
                <div>
                  <h3 className="font-solemn" style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    Formulario de Admisión Académica
                  </h3>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    Escuela de Idiomas del Ejército &bull; Gestión 2026
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalRegistroAbierto(false)}
                className="btn-icon btn-ghost"
                aria-label="Cerrar formulario"
              >
                <X size={17} />
              </button>
            </div>

            <form onSubmit={handleCrearEstudiante}>
              <div className="modal-body">
                <div>
                  <label>Condición del Postulante</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                    <button
                      type="button"
                      onClick={() => setFormTipo('MILITAR')}
                      style={{
                        padding: '0.65rem',
                        borderRadius: 4,
                        border: formTipo === 'MILITAR' ? '2px solid var(--border-accent)' : '1px solid var(--border-subtle)',
                        background: formTipo === 'MILITAR' ? 'var(--military-green-subtle)' : 'var(--bg-surface-elevated)',
                        color: formTipo === 'MILITAR' ? 'var(--status-active)' : 'var(--text-muted)',
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                      }}
                    >
                      <Shield size={16} /> Personal Militar (FF.AA.)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormTipo('CIVIL')}
                      style={{
                        padding: '0.65rem',
                        borderRadius: 4,
                        border: formTipo === 'CIVIL' ? '2px solid var(--border-subtle)' : '1px solid var(--border-subtle)',
                        background: formTipo === 'CIVIL' ? 'var(--military-blue-subtle)' : 'var(--bg-surface-elevated)',
                        color: formTipo === 'CIVIL' ? 'var(--text-main)' : 'var(--text-muted)',
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                      }}
                    >
                      <UserCheck size={16} /> Postulante Civil
                    </button>
                  </div>
                </div>

                {formTipo === 'MILITAR' && (
                  <div
                    style={{
                      background: 'var(--military-green-subtle)',
                      padding: '0.85rem',
                      borderRadius: 4,
                      border: '1px solid var(--border-accent)',
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '0.75rem',
                    }}
                  >
                    <div>
                      <label>Grado Militar *</label>
                      <select
                        value={formGrado}
                        onChange={(e) => setFormGrado(e.target.value)}
                        className="input"
                      >
                        <option value="Subteniente">Subteniente</option>
                        <option value="Teniente">Teniente</option>
                        <option value="Capitán">Capitán</option>
                        <option value="Mayor">Mayor</option>
                        <option value="Teniente Coronel">Teniente Coronel</option>
                        <option value="Coronel">Coronel</option>
                        <option value="Sargento Inicial">Sargento Inicial</option>
                        <option value="Sargento Segundo">Sargento Segundo</option>
                        <option value="Sargento Primero">Sargento Primero</option>
                        <option value="Suboficial">Suboficial</option>
                      </select>
                    </div>
                    <div>
                      <label>Unidad de Destino *</label>
                      <input
                        type="text"
                        value={formUnidad}
                        onChange={(e) => setFormUnidad(e.target.value)}
                        placeholder="Ej: Reg. Colorados, EMIE..."
                        className="input"
                      />
                    </div>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label>Nombres *</label>
                    <input
                      type="text"
                      required
                      value={formNombres}
                      onChange={(e) => setFormNombres(e.target.value)}
                      className="input"
                    />
                  </div>
                  <div>
                    <label>Apellidos *</label>
                    <input
                      type="text"
                      required
                      value={formApellidos}
                      onChange={(e) => setFormApellidos(e.target.value)}
                      className="input"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label>Cédula de Identidad (CI) *</label>
                    <input
                      type="text"
                      required
                      value={formCi}
                      onChange={(e) => setFormCi(e.target.value)}
                      placeholder="Ej: 6849201"
                      className="input"
                    />
                  </div>
                  <div>
                    <label>Expedido *</label>
                    <select
                      value={formExpedido}
                      onChange={(e) => setFormExpedido(e.target.value)}
                      className="input"
                    >
                      <option value="LP">LP (La Paz)</option>
                      <option value="SC">SC (Santa Cruz)</option>
                      <option value="CB">CB (Cochabamba)</option>
                      <option value="OR">OR (Oruro)</option>
                      <option value="PT">PT (Potosí)</option>
                      <option value="TJ">TJ (Tarija)</option>
                      <option value="CH">CH (Chuquisaca)</option>
                      <option value="BN">BN (Beni)</option>
                      <option value="PD">PD (Pando)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label>Idioma a Cursar</label>
                    <select
                      value={formIdioma}
                      onChange={(e) => setFormIdioma(e.target.value)}
                      className="input"
                    >
                      <option value="Inglés">Inglés</option>
                      <option value="Francés">Francés</option>
                      <option value="Portugués">Portugués</option>
                      <option value="Alemán">Alemán</option>
                      <option value="Ruso">Ruso</option>
                      <option value="Chino Mandarín">Chino Mandarín</option>
                    </select>
                  </div>
                  <div>
                    <label>Nivel de Ingreso</label>
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
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setModalRegistroAbierto(false)}
                  className="btn btn-ghost"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle2 size={16} />
                  <span>Registrar en Nómina</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================
         MODAL / EXPEDIENTE ACADÉMICO DEL ESTUDIANTE
      =================================================================== */}
      {estudianteSeleccionado && (
        <div className="modal-overlay" onClick={() => setEstudianteSeleccionado(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <FileText size={18} style={{ color: 'var(--military-gold-primary)' }} />
                <div>
                  <h3 className="font-solemn" style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    Hoja de Registro Académico
                  </h3>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Matrícula: {estudianteSeleccionado.codigoMatricula}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEstudianteSeleccionado(null)}
                className="btn-icon btn-ghost"
                aria-label="Cerrar expediente"
              >
                <X size={17} />
              </button>
            </div>

            <div className="modal-body">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.85rem 1rem',
                  background: 'var(--bg-surface-elevated)',
                  borderRadius: 6,
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 4,
                    background: 'var(--military-green-primary)',
                    color: 'var(--military-gold-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1rem',
                  }}
                >
                  {estudianteSeleccionado.nombres.charAt(0)}{estudianteSeleccionado.apellidos.charAt(0)}
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {estudianteSeleccionado.apellidos}, {estudianteSeleccionado.nombres}
                  </h4>
                  <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.2rem' }}>
                    <span className="badge badge-military">{estudianteSeleccionado.estado}</span>
                    {estudianteSeleccionado.tipo === 'MILITAR' ? (
                      <span className="badge badge-gold">{estudianteSeleccionado.gradoMilitar}</span>
                    ) : (
                      <span className="badge badge-civil">Civil</span>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                <div style={{ background: 'var(--bg-surface-elevated)', padding: '0.75rem', borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
                  <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>CI y Expedido</p>
                  <p style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.85rem' }}>
                    {estudianteSeleccionado.ci} {estudianteSeleccionado.expedido}
                  </p>
                </div>
                <div style={{ background: 'var(--bg-surface-elevated)', padding: '0.75rem', borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
                  <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Curso Actual</p>
                  <p style={{ fontWeight: 600, color: 'var(--military-gold-primary)', fontSize: '0.85rem' }}>
                    {estudianteSeleccionado.idiomaActual}
                  </p>
                </div>
                <div style={{ background: 'var(--bg-surface-elevated)', padding: '0.75rem', borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
                  <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Nivel / Paralelo</p>
                  <p style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.85rem' }}>
                    {estudianteSeleccionado.nivelActual} ({estudianteSeleccionado.paralelo})
                  </p>
                </div>
                <div style={{ background: 'var(--bg-surface-elevated)', padding: '0.75rem', borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
                  <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Promedio</p>
                  <p style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.85rem' }}>
                    {estudianteSeleccionado.promedio} / 100
                  </p>
                </div>
              </div>

              <div
                style={{
                  background: 'var(--bg-surface-elevated)',
                  padding: '0.85rem',
                  borderRadius: 6,
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem',
                  fontSize: '0.82rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                  <Phone size={14} style={{ color: 'var(--military-gold-primary)' }} />
                  <span>{estudianteSeleccionado.telefono}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                  <Mail size={14} style={{ color: 'var(--military-gold-primary)' }} />
                  <span>{estudianteSeleccionado.correo}</span>
                </div>
                {estudianteSeleccionado.unidadMilitar && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                    <Building2 size={14} style={{ color: 'var(--military-gold-primary)' }} />
                    <span>Unidad: {estudianteSeleccionado.unidadMilitar}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button
                onClick={() => setEstudianteSeleccionado(null)}
                className="btn btn-secondary"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  showToast(`Emitiendo certificado académico para ${estudianteSeleccionado.nombres}...`);
                }}
                className="btn btn-gold"
              >
                <Download size={15} />
                <span>Emitir Certificado</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
