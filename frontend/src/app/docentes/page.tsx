'use client';

import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  Shield,
  Search,
  Filter,
  UserPlus,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Phone,
  Mail,
  BookOpen,
  ChevronRight,
  Eye,
  RefreshCw,
  Sparkles,
  Award,
  Layers,
  X,
  Calendar,
  Building2,
  Check
} from 'lucide-react';

interface Docente {
  id: number;
  nombre: string;
  ci: string;
  tipo: 'MILITAR' | 'CIVIL';
  gradoMilitar?: string;
  unidadMilitar?: string;
  idiomasHabilitados: string[];
  paraleloActual?: string;
  diasEnAula: number; // Regla 15 días
  estado: 'EN_AULA' | 'RELEVO_URGENTE' | 'EN_RESERVA';
  telefono: string;
  correo: string;
  evaluacionPromedio: number;
}

const DOCENTES_INICIALES: Docente[] = [
  {
    id: 1,
    nombre: 'Cap. Fernando Ríos Torrico',
    ci: '5849201 LP',
    tipo: 'MILITAR',
    gradoMilitar: 'Capitán de Caballería',
    unidadMilitar: 'Regimiento Ingavi 4to de Caballería',
    idiomasHabilitados: ['Inglés Militar', 'Mandarín Táctico'],
    paraleloActual: 'ING-101-A',
    diasEnAula: 15,
    estado: 'RELEVO_URGENTE',
    telefono: '+591 76543210',
    correo: 'f.rios@ejercito.mil.bo',
    evaluacionPromedio: 94,
  },
  {
    id: 2,
    nombre: 'Sgto. María Condori Quispe',
    ci: '6920184 CB',
    tipo: 'MILITAR',
    gradoMilitar: 'Sargento 1ro. de Comunicaciones',
    unidadMilitar: 'Comando de Doctrina Militar',
    idiomasHabilitados: ['Francés Diplomático', 'Inglés Técnico'],
    paraleloActual: 'FRA-101-A',
    diasEnAula: 14,
    estado: 'RELEVO_URGENTE',
    telefono: '+591 78901234',
    correo: 'm.condori@ejercito.mil.bo',
    evaluacionPromedio: 91,
  },
  {
    id: 3,
    nombre: 'Tte. Carlos Ramos Siles',
    ci: '7120485 LP',
    tipo: 'MILITAR',
    gradoMilitar: 'Teniente de Infantería',
    unidadMilitar: 'Batallón de Policía Militar I',
    idiomasHabilitados: ['Inglés Militar', 'Portugués'],
    paraleloActual: undefined,
    diasEnAula: 0,
    estado: 'EN_RESERVA',
    telefono: '+591 71234567',
    correo: 'c.ramos@ejercito.mil.bo',
    evaluacionPromedio: 96,
  },
  {
    id: 4,
    nombre: 'My. Roberto Daza Miranda',
    ci: '4928103 SC',
    tipo: 'MILITAR',
    gradoMilitar: 'Mayor de Blindados',
    unidadMilitar: 'División Mecanizada 1',
    idiomasHabilitados: ['Ruso Técnico', 'Inglés Técnico'],
    paraleloActual: 'RUS-INT-01',
    diasEnAula: 7,
    estado: 'EN_AULA',
    telefono: '+591 73332211',
    correo: 'r.daza@ejercito.mil.bo',
    evaluacionPromedio: 89,
  },
  {
    id: 5,
    nombre: 'Lic. Ana Blanco Gutiérrez',
    ci: '8392019 LP',
    tipo: 'CIVIL',
    idiomasHabilitados: ['Quechua Institucional', 'Mandarín Táctico', 'Francés Diplomático'],
    paraleloActual: 'MAN-201-A',
    diasEnAula: 4,
    estado: 'EN_AULA',
    telefono: '+591 74445566',
    correo: 'ana.blanco@idiomas.edu.bo',
    evaluacionPromedio: 98,
  },
  {
    id: 6,
    nombre: 'Sof. René Quisbert Huanca',
    ci: '5019284 OR',
    tipo: 'MILITAR',
    gradoMilitar: 'Suboficial Inicial',
    unidadMilitar: 'Escuela de Idiomas del Ejército',
    idiomasHabilitados: ['Inglés Militar', 'Aymara Técnico'],
    paraleloActual: undefined,
    diasEnAula: 0,
    estado: 'EN_RESERVA',
    telefono: '+591 75556677',
    correo: 'r.quisbert@ejercito.mil.bo',
    evaluacionPromedio: 92,
  },
];

export default function DocentesPage() {
  const [docentes, setDocentes] = useState<Docente[]>(DOCENTES_INICIALES);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filtroEstado, setFiltroEstado] = useState<string>('TODOS');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Modales
  const [modalRegistro, setModalRegistro] = useState<boolean>(false);
  const [modalHojaVida, setModalHojaVida] = useState<Docente | null>(null);
  const [modalOptimizadorQuarkus, setModalOptimizadorQuarkus] = useState<boolean>(false);

  // Form Registro Docente
  const [formTipo, setFormTipo] = useState<'MILITAR' | 'CIVIL'>('MILITAR');
  const [formNombre, setFormNombre] = useState<string>('');
  const [formCi, setFormCi] = useState<string>('');
  const [formGrado, setFormGrado] = useState<string>('Teniente');
  const [formUnidad, setFormUnidad] = useState<string>('Comando General');
  const [formIdiomas, setFormIdiomas] = useState<string>('Inglés Militar, Francés');
  const [formTelefono, setFormTelefono] = useState<string>('');
  const [formCorreo, setFormCorreo] = useState<string>('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const docentesFiltrados = useMemo(() => {
    return docentes.filter((d) => {
      const matchEstado =
        filtroEstado === 'TODOS'
          ? true
          : filtroEstado === 'RELEVO'
          ? d.diasEnAula >= 14
          : filtroEstado === 'EN_AULA'
          ? d.paraleloActual !== undefined
          : d.estado === 'EN_RESERVA';

      const q = searchTerm.toLowerCase().trim();
      const matchSearch =
        !q ||
        d.nombre.toLowerCase().includes(q) ||
        d.ci.toLowerCase().includes(q) ||
        (d.gradoMilitar && d.gradoMilitar.toLowerCase().includes(q)) ||
        d.idiomasHabilitados.some((i) => i.toLowerCase().includes(q));

      return matchEstado && matchSearch;
    });
  }, [docentes, filtroEstado, searchTerm]);

  const relevosUrgentes = docentes.filter((d) => d.diasEnAula >= 14);
  const docentesEnAula = docentes.filter((d) => d.paraleloActual !== undefined);
  const docentesReserva = docentes.filter((d) => d.estado === 'EN_RESERVA');

  // Ejecución de relevo rápido
  const handleEjecutarRelevo = (idDocenteRelevado: number) => {
    const relevado = docentes.find((d) => d.id === idDocenteRelevado);
    if (!relevado || !relevado.paraleloActual) return;

    // Buscar sustituto en reserva con idioma compatible
    const idiomaRequerido = relevado.paraleloActual.startsWith('ING')
      ? 'Inglés Militar'
      : relevado.paraleloActual.startsWith('FRA')
      ? 'Francés Diplomático'
      : 'Ruso Técnico';

    const sustituto = docentes.find(
      (d) =>
        d.id !== idDocenteRelevado &&
        d.estado === 'EN_RESERVA' &&
        d.idiomasHabilitados.some((i) => i.toLowerCase().includes(idiomaRequerido.toLowerCase().slice(0, 4)))
    );

    if (!sustituto) {
      showToast(`Alerta: No se encontró docente en reserva compatible con ${idiomaRequerido}.`);
      return;
    }

    const paralelo = relevado.paraleloActual;

    setDocentes((prev) =>
      prev.map((d) => {
        if (d.id === idDocenteRelevado) {
          return {
            ...d,
            paraleloActual: undefined,
            diasEnAula: 0,
            estado: 'EN_RESERVA',
          };
        }
        if (d.id === sustituto.id) {
          return {
            ...d,
            paraleloActual: paralelo,
            diasEnAula: 1,
            estado: 'EN_AULA',
          };
        }
        return d;
      })
    );

    showToast(`Relevo completado: ${sustituto.nombre} asume el paralelo ${paralelo}.`);
  };

  const handleCrearDocente = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNombre || !formCi) {
      alert('Por favor complete los campos obligatorios.');
      return;
    }

    const nuevo: Docente = {
      id: Date.now(),
      nombre: formNombre,
      ci: formCi,
      tipo: formTipo,
      gradoMilitar: formTipo === 'MILITAR' ? formGrado : undefined,
      unidadMilitar: formTipo === 'MILITAR' ? formUnidad : undefined,
      idiomasHabilitados: formIdiomas.split(',').map((s) => s.trim()),
      paraleloActual: undefined,
      diasEnAula: 0,
      estado: 'EN_RESERVA',
      telefono: formTelefono || '+591 70000000',
      correo: formCorreo || `${formNombre.toLowerCase().replace(/\s+/g, '.')}@ejercito.mil.bo`,
      evaluacionPromedio: 90,
    };

    setDocentes([nuevo, ...docentes]);
    setModalRegistro(false);
    showToast(`Instructor ${nuevo.nombre} incorporado a la nómina del CEDMIL.`);

    setFormNombre('');
    setFormCi('');
    setFormUnidad('Comando General');
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
              <GraduationCap size={12} /> Estado Mayor Académico
            </span>
            <span className="badge badge-military">Rotación Quincenal</span>
          </div>
          <h1
            className="font-solemn"
            style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '0.02em' }}
          >
            Personal Docente y Ciclos de Rotación
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Regla de doctrina EIE: Rotación obligatoria de instructor militar al cumplir 15 días continuos en aula para preservar la calidad pedagógica.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setModalOptimizadorQuarkus(true)}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
          >
            <Sparkles size={15} style={{ color: 'var(--military-gold-primary)' }} />
            <span>Motor de Relevo Óptimo (Quarkus)</span>
          </button>

          <button
            onClick={() => setModalRegistro(true)}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
          >
            <UserPlus size={15} />
            <span>Registrar Docente</span>
          </button>
        </div>
      </div>

      {/* Alerta si hay docentes con ciclo cumplido */}
      {relevosUrgentes.length > 0 && (
        <div
          style={{
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            borderRadius: '8px',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: 'rgba(245, 158, 11, 0.2)',
                color: '#fbbf24',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Clock size={20} />
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: '0.92rem', color: '#fbbf24' }}>
                RELEVO QUINCENAL OBLIGATORIO PENDIENTE
              </p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-main)', marginTop: '0.15rem' }}>
                Hay <strong>{relevosUrgentes.length} instructores</strong> con 14 o 15 días en aula ({relevosUrgentes.map((d) => `${d.nombre} [${d.paraleloActual}]`).join(', ')}).
              </p>
            </div>
          </div>

          <button
            onClick={() => setModalOptimizadorQuarkus(true)}
            className="btn btn-primary"
            style={{
              padding: '0.35rem 0.8rem',
              fontSize: '0.75rem',
              background: '#b45309',
              borderColor: '#b45309',
            }}
          >
            Resolver Relevo Automático
          </button>
        </div>
      )}

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
            <Shield size={22} />
          </div>
          <div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Cuerpo de Instructores
            </p>
            <p style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {docentes.length} Docentes
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
            <BookOpen size={22} />
          </div>
          <div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              En Aula Activa
            </p>
            <p style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {docentesEnAula.length} Asignados
            </p>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 6,
              background: 'rgba(245, 158, 11, 0.12)',
              color: '#fbbf24',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(245, 158, 11, 0.3)',
            }}
          >
            <AlertTriangle size={22} />
          </div>
          <div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Relevos Inminentes
            </p>
            <p style={{ fontSize: '1.45rem', fontWeight: 800, color: '#fbbf24' }}>
              {relevosUrgentes.length} Pendientes
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
            <Clock size={22} />
          </div>
          <div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              En Reserva / Descanso
            </p>
            <p style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--military-gold-primary)' }}>
              {docentesReserva.length} Disponibles
            </p>
          </div>
        </div>
      </div>

      {/* Filtros y Lista de Docentes */}
      <div className="card" style={{ padding: '1.25rem' }}>
        
        {/* Barra de Filtros */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div className="filter-tabs">
            <button
              onClick={() => setFiltroEstado('TODOS')}
              className={`filter-tab ${filtroEstado === 'TODOS' ? 'active' : ''}`}
            >
              <span>Todos ({docentes.length})</span>
            </button>
            <button
              onClick={() => setFiltroEstado('RELEVO')}
              className={`filter-tab ${filtroEstado === 'RELEVO' ? 'active' : ''}`}
            >
              <AlertTriangle size={13} style={{ color: '#fbbf24' }} />
              <span>Relevos Urgentes ({relevosUrgentes.length})</span>
            </button>
            <button
              onClick={() => setFiltroEstado('EN_AULA')}
              className={`filter-tab ${filtroEstado === 'EN_AULA' ? 'active' : ''}`}
            >
              <BookOpen size={13} />
              <span>En Aula ({docentesEnAula.length})</span>
            </button>
            <button
              onClick={() => setFiltroEstado('EN_RESERVA')}
              className={`filter-tab ${filtroEstado === 'EN_RESERVA' ? 'active' : ''}`}
            >
              <Clock size={13} />
              <span>En Reserva ({docentesReserva.length})</span>
            </button>
          </div>

          <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
            <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Buscar por grado, nombre o idioma..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input"
              style={{ paddingLeft: '2.2rem', width: '100%' }}
            />
          </div>
        </div>

        {/* Cuadrícula de Instructores */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.15rem' }}>
          {docentesFiltrados.map((docente) => {
            const esRelevo = docente.diasEnAula >= 14;
            const enAula = docente.paraleloActual !== undefined;

            return (
              <div
                key={docente.id}
                style={{
                  border: esRelevo ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '1.25rem',
                  background: 'var(--bg-surface-elevated)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  transition: 'all 0.2s',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.65rem' }}>
                    <div>
                      <span className={docente.tipo === 'MILITAR' ? 'badge badge-military' : 'badge badge-civil'} style={{ fontSize: '0.65rem', marginBottom: '0.25rem' }}>
                        {docente.gradoMilitar || 'Docente Civil'}
                      </span>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        {docente.nombre}
                      </h3>
                      {docente.unidadMilitar && (
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{docente.unidadMilitar}</p>
                      )}
                    </div>

                    <span className={esRelevo ? 'badge badge-gold' : enAula ? 'badge badge-military' : 'badge badge-blue'} style={{ fontSize: '0.65rem' }}>
                      {esRelevo ? 'Relevo 15d' : enAula ? 'En Aula' : 'En Reserva'}
                    </span>
                  </div>

                  {/* Idiomas */}
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', margin: '0.5rem 0' }}>
                    {docente.idiomasHabilitados.map((idm) => (
                      <span key={idm} style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem', borderRadius: '4px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: 'var(--military-gold-primary)' }}>
                        {idm}
                      </span>
                    ))}
                  </div>

                  {/* Estado de Rotación y Aula */}
                  <div style={{ background: 'var(--bg-surface)', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-subtle)', marginTop: '0.5rem' }}>
                    {enAula ? (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.3rem' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Paralelo: <strong style={{ color: 'var(--text-main)' }}>{docente.paraleloActual}</strong></span>
                          <span style={{ fontWeight: 700, color: esRelevo ? '#fbbf24' : 'var(--status-active)' }}>
                            {docente.diasEnAula} / 15 días
                          </span>
                        </div>
                        <div style={{ width: '100%', height: '6px', background: 'var(--bg-surface-elevated)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${Math.min((docente.diasEnAula / 15) * 100, 100)}%`,
                              height: '100%',
                              background: esRelevo ? '#fbbf24' : 'var(--status-active)',
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Check size={14} style={{ color: 'var(--status-active)' }} />
                        <span>Disponible para nueva asignación quincenal</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Acciones */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <button
                    onClick={() => setModalHojaVida(docente)}
                    className="btn btn-secondary"
                    style={{ padding: '0.3rem 0.65rem', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    <Eye size={13} /> Hoja de Servicio
                  </button>

                  {esRelevo && (
                    <button
                      onClick={() => handleEjecutarRelevo(docente.id)}
                      className="btn btn-primary"
                      style={{ padding: '0.3rem 0.65rem', fontSize: '0.72rem' }}
                    >
                      Aprobar Relevo
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =================================================================
          MODAL DE HOJA DE VIDA Y SERVICIO DOCENTE
      ================================================================= */}
      {modalHojaVida && (
        <div className="modal-overlay" onClick={() => setModalHojaVida(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Shield size={18} style={{ color: 'var(--military-gold-primary)' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Hoja de Vida Académica Militar
                </h3>
              </div>
              <button onClick={() => setModalHojaVida(null)} className="btn-icon btn-ghost">
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    background: 'var(--military-green-primary)',
                    color: 'var(--military-gold-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.1rem',
                    border: '1px solid var(--border-accent)',
                  }}
                >
                  {modalHojaVida.nombre.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {modalHojaVida.nombre}
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--military-gold-primary)' }}>
                    {modalHojaVida.gradoMilitar || 'Civil'} &bull; CI: {modalHojaVida.ci}
                  </p>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {modalHojaVida.unidadMilitar || 'Escuela de Idiomas del Ejército'}
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', fontSize: '0.8rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Teléfono:</span>
                  <p style={{ fontWeight: 600, color: 'var(--text-main)' }}>{modalHojaVida.telefono}</p>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Correo Institucional:</span>
                  <p style={{ fontWeight: 600, color: 'var(--text-main)' }}>{modalHojaVida.correo}</p>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Evaluación de Cadetes:</span>
                  <p style={{ fontWeight: 700, color: 'var(--status-active)' }}>{modalHojaVida.evaluacionPromedio} / 100 pts</p>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Días en Aula Quincenal:</span>
                  <p style={{ fontWeight: 700, color: modalHojaVida.diasEnAula >= 14 ? '#fbbf24' : 'var(--text-main)' }}>
                    {modalHojaVida.diasEnAula} días
                  </p>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                  Idiomas y Competencias Habilitadas
                </span>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.35rem' }}>
                  {modalHojaVida.idiomasHabilitados.map((i) => (
                    <span key={i} className="badge badge-gold">
                      {i}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button onClick={() => setModalHojaVida(null)} className="btn btn-secondary">
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================
          MODAL DE REGISTRO DE NUEVO INSTRUCTOR
      ================================================================= */}
      {modalRegistro && (
        <div className="modal-overlay" onClick={() => setModalRegistro(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <UserPlus size={18} style={{ color: 'var(--military-gold-primary)' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Registrar Instructor en Nómina Militar
                </h3>
              </div>
              <button onClick={() => setModalRegistro(false)} className="btn-icon btn-ghost">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCrearDocente} style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="input-label">Categoría de Instructor</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setFormTipo('MILITAR')}
                    className={`btn ${formTipo === 'MILITAR' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '0.78rem', justifyContent: 'center' }}
                  >
                    <Shield size={14} /> Personal Militar
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormTipo('CIVIL')}
                    className={`btn ${formTipo === 'CIVIL' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '0.78rem', justifyContent: 'center' }}
                  >
                    <GraduationCap size={14} /> Instructor Civil
                  </button>
                </div>
              </div>

              <div>
                <label className="input-label">Nombres y Apellidos *</label>
                <input
                  type="text"
                  value={formNombre}
                  onChange={(e) => setFormNombre(e.target.value)}
                  placeholder="Ej. Tte. Carlos Siles"
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
                    placeholder="Ej. 7120485 LP"
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
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="input-label">Especialidad</label>
                    <input
                      type="text"
                      placeholder="Lic. en Lingüística"
                      className="input"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="input-label">Idiomas Habilitados (separados por coma) *</label>
                <input
                  type="text"
                  value={formIdiomas}
                  onChange={(e) => setFormIdiomas(e.target.value)}
                  placeholder="Inglés Militar, Francés Diplomático"
                  className="input"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label className="input-label">Teléfono</label>
                  <input
                    type="text"
                    value={formTelefono}
                    onChange={(e) => setFormTelefono(e.target.value)}
                    placeholder="+591 71234567"
                    className="input"
                  />
                </div>

                <div>
                  <label className="input-label">Correo</label>
                  <input
                    type="email"
                    value={formCorreo}
                    onChange={(e) => setFormCorreo(e.target.value)}
                    placeholder="correo@ejercito.mil.bo"
                    className="input"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setModalRegistro(false)} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <UserPlus size={15} />
                  <span>Registrar Instructor</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================
          MODAL DE MOTOR DE RELEVO ÓPTIMO (QUARKUS ALGORITHM)
      ================================================================= */}
      {modalOptimizadorQuarkus && (
        <div className="modal-overlay" onClick={() => setModalOptimizadorQuarkus(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Sparkles size={18} style={{ color: 'var(--military-gold-primary)' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Asignación y Relevo Óptimo &bull; Algoritmo Quarkus
                </h3>
              </div>
              <button onClick={() => setModalOptimizadorQuarkus(false)} className="btn-icon btn-ghost">
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '1.25rem' }}>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                El algoritmo de optimización del microservicio Quarkus evalúa los candidatos disponibles verificando la regla de rotación de 15 días, compatibilidad lingüística y descanso:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.9rem' }}>
                      Paralelo: ING-101-A (Inglés Militar)
                    </span>
                    <span className="badge badge-gold">Relevo Urgente (15d)</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Instructor saliente: <strong>Cap. Fernando Ríos</strong> (15 días en aula cumplidos)
                  </p>
                  <div style={{ marginTop: '0.5rem', padding: '0.65rem', background: 'var(--bg-surface)', borderRadius: '4px', border: '1px solid var(--border-accent)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontSize: '0.72rem', color: 'var(--military-gold-primary)', fontWeight: 700 }}>RELEVO ÓPTIMO ASIGNADO:</p>
                      <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>Tte. Carlos Ramos Siles</p>
                      <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>En reserva &bull; Habilitado en Inglés Militar</p>
                    </div>
                    <button
                      onClick={() => {
                        handleEjecutarRelevo(1);
                        setModalOptimizadorQuarkus(false);
                      }}
                      className="btn btn-primary"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                    >
                      Ejecutar Orden
                    </button>
                  </div>
                </div>

                <div style={{ background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.9rem' }}>
                      Paralelo: FRA-101-A (Francés Diplomático)
                    </span>
                    <span className="badge badge-gold">Relevo Próximo (14d)</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Instructor saliente: <strong>Sgto. María Condori</strong> (14 días en aula)
                  </p>
                  <div style={{ marginTop: '0.5rem', padding: '0.65rem', background: 'var(--bg-surface)', borderRadius: '4px', border: '1px solid var(--border-accent)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontSize: '0.72rem', color: 'var(--military-gold-primary)', fontWeight: 700 }}>RELEVO ÓPTIMO ASIGNADO:</p>
                      <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>Lic. Ana Blanco Gutiérrez</p>
                      <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Especialista en Francés Diplomático &bull; En rotación</p>
                    </div>
                    <button
                      onClick={() => {
                        handleEjecutarRelevo(2);
                        setModalOptimizadorQuarkus(false);
                      }}
                      className="btn btn-primary"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                    >
                      Ejecutar Orden
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                <button onClick={() => setModalOptimizadorQuarkus(false)} className="btn btn-secondary">
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
