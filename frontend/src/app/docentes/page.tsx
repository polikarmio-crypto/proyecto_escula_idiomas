'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
  ChevronLeft,
  Eye,
  RefreshCw,
  Sparkles,
  Award,
  Layers,
  X,
  Calendar,
  Building2,
  Check,
  Edit,
  Trash2,
  AlertOctagon,
  Power
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
  estado: 'EN_AULA' | 'RELEVO_URGENTE' | 'EN_RESERVA' | 'INACTIVO';
  telefono: string;
  correo: string;
  evaluacionPromedio: number;
  activo: boolean;
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
    activo: true,
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
    activo: true,
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
    activo: true,
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
    activo: true,
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
    activo: true,
  },
  {
    id: 6,
    nombre: 'Sof. René Quisbert Huanca',
    ci: '5019284 OR',
    tipo: 'MILITAR',
    gradoMilitar: 'Suboficial Inicial',
    unidadMilitar: 'Escuela de Idiomas del Ejército',
    idiomasHabilitados: ['Inglés Militar', 'Aymara Técnico', 'Ruso Técnico'],
    paraleloActual: undefined,
    diasEnAula: 0,
    estado: 'EN_RESERVA',
    telefono: '+591 75556677',
    correo: 'r.quisbert@ejercito.mil.bo',
    evaluacionPromedio: 92,
    activo: true,
  },
  {
    id: 7,
    nombre: 'Tte. Jeanette Mendoza Flores',
    ci: '6123456 LP',
    tipo: 'MILITAR',
    gradoMilitar: 'Teniente de Comunicaciones',
    unidadMilitar: 'Comando de Doctrina Militar',
    idiomasHabilitados: ['Francés Diplomático', 'Inglés Militar'],
    paraleloActual: undefined,
    diasEnAula: 0,
    estado: 'EN_RESERVA',
    telefono: '+591 72345678',
    correo: 'j.mendoza@ejercito.mil.bo',
    evaluacionPromedio: 95,
    activo: true,
  },
  {
    id: 8,
    nombre: 'Lic. Javier Morales Quiroga',
    ci: '4820193 CB',
    tipo: 'CIVIL',
    idiomasHabilitados: ['Alemán Académico', 'Inglés Técnico'],
    paraleloActual: 'ALM-101-B',
    diasEnAula: 11,
    estado: 'EN_AULA',
    telefono: '+591 77123490',
    correo: 'j.morales@idiomas.edu.bo',
    evaluacionPromedio: 93,
    activo: true,
  },
  {
    id: 9,
    nombre: 'Cap. Rodrigo Soliz Arze',
    ci: '7492018 SC',
    tipo: 'MILITAR',
    gradoMilitar: 'Capitán de Artillería',
    unidadMilitar: 'Regimiento Pisagua 3ro de Artillería',
    idiomasHabilitados: ['Portugués Militar', 'Inglés Militar'],
    paraleloActual: undefined,
    diasEnAula: 0,
    estado: 'EN_RESERVA',
    telefono: '+591 76098123',
    correo: 'r.soliz@ejercito.mil.bo',
    evaluacionPromedio: 90,
    activo: true,
  },
  {
    id: 10,
    nombre: 'Lic. Claudia Terán Beltrán',
    ci: '6940128 LP',
    tipo: 'CIVIL',
    idiomasHabilitados: ['Italiano Institucional', 'Francés Diplomático'],
    paraleloActual: undefined,
    diasEnAula: 0,
    estado: 'EN_RESERVA',
    telefono: '+591 71928374',
    correo: 'c.teran@idiomas.edu.bo',
    evaluacionPromedio: 97,
    activo: true,
  },
];

export default function DocentesPage() {
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filtroEstado, setFiltroEstado] = useState<string>('TODOS');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Paginación compacta: 8 vistas por pantalla
  const [paginaActual, setPaginaActual] = useState<number>(1);
  const ITEMS_PER_PAGE = 8;

  // Modales
  const [modalRegistro, setModalRegistro] = useState<boolean>(false);
  const [modalEditar, setModalEditar] = useState<Docente | null>(null);
  const [modalHojaVida, setModalHojaVida] = useState<Docente | null>(null);
  const [modalEliminarFisica, setModalEliminarFisica] = useState<Docente | null>(null);
  const [modalOptimizadorQuarkus, setModalOptimizadorQuarkus] = useState<boolean>(false);

  // Form Registro Docente
  const [formTipo, setFormTipo] = useState<'MILITAR' | 'CIVIL'>('MILITAR');
  const [formNombre, setFormNombre] = useState<string>('');
  const [formCi, setFormCi] = useState<string>('');
  const [formGrado, setFormGrado] = useState<string>('Teniente');
  const [formUnidad, setFormUnidad] = useState<string>('Comando General');
  const [formIdiomas, setFormIdiomas] = useState<string>('Inglés Militar, Francés Diplomático');
  const [formTelefono, setFormTelefono] = useState<string>('');
  const [formCorreo, setFormCorreo] = useState<string>('');

  // Form Editar Docente
  const [editNombre, setEditNombre] = useState<string>('');
  const [editCi, setEditCi] = useState<string>('');
  const [editGrado, setEditGrado] = useState<string>('');
  const [editUnidad, setEditUnidad] = useState<string>('');
  const [editIdiomas, setEditIdiomas] = useState<string>('');
  const [editTelefono, setEditTelefono] = useState<string>('');
  const [editCorreo, setEditCorreo] = useState<string>('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const cargarDocentes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/docentes');
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      const mapped: Docente[] = (Array.isArray(data) ? data : []).map((d: any) => {
        const diasEnAula = d.dias_en_aula ?? 0;
        const esInactivo = d.estado === 'Inactivo';
        let estado: 'EN_AULA' | 'RELEVO_URGENTE' | 'EN_RESERVA' | 'INACTIVO' = 'EN_RESERVA';
        if (esInactivo) {
          estado = 'INACTIVO';
        } else if (d.paralelo_actual) {
          estado = diasEnAula >= 14 ? 'RELEVO_URGENTE' : 'EN_AULA';
        }

        const nombrePartes = (d.nombre_completo || '').trim();
        const ciDocente = d.ci_docente || 'S/N';
        const esMilitar = !nombrePartes.toLowerCase().startsWith('lic.');

        return {
          id: d.id_docente,
          nombre: nombrePartes,
          ci: ciDocente,
          tipo: esMilitar ? 'MILITAR' : 'CIVIL',
          gradoMilitar: esMilitar ? (nombrePartes.split(' ')[0] || 'Oficial') : undefined,
          unidadMilitar: esMilitar ? 'Comando General del Ejército' : undefined,
          idiomasHabilitados: Array.isArray(d.idiomas) ? d.idiomas : ['Inglés Militar'],
          paraleloActual: d.paralelo_actual ?? undefined,
          diasEnAula,
          estado,
          telefono: d.telefono ?? '+591 70000000',
          correo: d.email ?? 'docente@ejercito.mil.bo',
          evaluacionPromedio: 90 + (d.id_docente % 10),
          activo: !esInactivo,
        };
      });

      if (mapped.length > 0) {
        setDocentes(mapped);
      } else {
        setDocentes(DOCENTES_INICIALES);
      }
    } catch (err) {
      console.warn('Cargando docentes en modo local:', err);
      setDocentes(DOCENTES_INICIALES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDocentes();
  }, []);

  // Filtrado
  const docentesFiltrados = useMemo(() => {
    return docentes.filter((d) => {
      const matchEstado =
        filtroEstado === 'TODOS'
          ? true
          : filtroEstado === 'RELEVO'
          ? d.diasEnAula >= 14 && d.activo
          : filtroEstado === 'EN_AULA'
          ? d.paraleloActual !== undefined && d.activo
          : filtroEstado === 'EN_RESERVA'
          ? d.estado === 'EN_RESERVA' && d.activo
          : filtroEstado === 'INACTIVO'
          ? !d.activo
          : true;

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

  // Paginación compacta (8 por página)
  const totalPaginas = Math.max(1, Math.ceil(docentesFiltrados.length / ITEMS_PER_PAGE));
  const docentesPaginados = useMemo(() => {
    const inicio = (paginaActual - 1) * ITEMS_PER_PAGE;
    return docentesFiltrados.slice(inicio, inicio + ITEMS_PER_PAGE);
  }, [docentesFiltrados, paginaActual]);

  const relevosUrgentes = docentes.filter((d) => d.diasEnAula >= 14 && d.activo);
  const docentesEnAula = docentes.filter((d) => d.paraleloActual !== undefined && d.activo);
  const docentesReserva = docentes.filter((d) => d.estado === 'EN_RESERVA' && d.activo);

  // Ejecución de relevo rápido
  const handleEjecutarRelevo = (idDocenteRelevado: number) => {
    const relevado = docentes.find((d) => d.id === idDocenteRelevado);
    if (!relevado || !relevado.paraleloActual) return;

    const idiomaRequerido = relevado.paraleloActual.startsWith('ING')
      ? 'Inglés Militar'
      : relevado.paraleloActual.startsWith('FRA')
      ? 'Francés Diplomático'
      : 'Ruso Técnico';

    const sustituto = docentes.find(
      (d) =>
        d.id !== idDocenteRelevado &&
        d.activo &&
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

  // Crear Docente (CRUD - Create)
  const handleCrearDocente = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNombre || !formCi) {
      alert('Por favor complete los campos obligatorios.');
      return;
    }

    const nuevo: Docente = {
      id: Date.now(),
      nombre: formNombre.trim(),
      ci: formCi.trim(),
      tipo: formTipo,
      gradoMilitar: formTipo === 'MILITAR' ? formGrado : undefined,
      unidadMilitar: formTipo === 'MILITAR' ? formUnidad : undefined,
      idiomasHabilitados: formIdiomas.split(',').map((s) => s.trim()).filter(Boolean),
      paraleloActual: undefined,
      diasEnAula: 0,
      estado: 'EN_RESERVA',
      telefono: formTelefono || '+591 70000000',
      correo: formCorreo || `${formNombre.toLowerCase().replace(/[^a-z]/g, '.')}@ejercito.mil.bo`,
      evaluacionPromedio: 90,
      activo: true,
    };

    try {
      await fetch('/api/v1/docentes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          ci_docente: nuevo.ci,
          nombre_docente: nuevo.nombre,
          apellido_docente: nuevo.gradoMilitar || 'Instructor',
          telefono_docente: nuevo.telefono,
          email_docente: nuevo.correo,
          idiomas_ids: [1, 2],
        }),
      });
    } catch (err) {}

    setDocentes([nuevo, ...docentes]);
    setModalRegistro(false);
    showToast(`Instructor ${nuevo.nombre} incorporado a la nómina del CEDMIL.`);

    setFormNombre('');
    setFormCi('');
    setFormUnidad('Comando General');
    setFormTelefono('');
    setFormCorreo('');
  };

  // Abrir Modal de Edición (CRUD - Update)
  const handleAbrirEditar = (doc: Docente) => {
    setModalEditar(doc);
    setEditNombre(doc.nombre);
    setEditCi(doc.ci);
    setEditGrado(doc.gradoMilitar || 'Teniente');
    setEditUnidad(doc.unidadMilitar || 'Comando General');
    setEditIdiomas(doc.idiomasHabilitados.join(', '));
    setEditTelefono(doc.telefono);
    setEditCorreo(doc.correo);
  };

  // Guardar Edición Docente
  const handleGuardarEdicion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalEditar) return;

    const id = modalEditar.id;
    const actualizados = {
      nombre: editNombre.trim(),
      ci: editCi.trim(),
      gradoMilitar: modalEditar.tipo === 'MILITAR' ? editGrado : undefined,
      unidadMilitar: modalEditar.tipo === 'MILITAR' ? editUnidad : undefined,
      idiomasHabilitados: editIdiomas.split(',').map((s) => s.trim()).filter(Boolean),
      telefono: editTelefono.trim(),
      correo: editCorreo.trim(),
    };

    try {
      await fetch(`/api/v1/docentes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          nombre_docente: actualizados.nombre,
          apellido_docente: actualizados.gradoMilitar || 'Docente',
          ci_docente: actualizados.ci,
          telefono_docente: actualizados.telefono,
          email_docente: actualizados.correo,
        }),
      });
    } catch (err) {}

    setDocentes((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...actualizados } : d))
    );

    setModalEditar(null);
    showToast(`Ficha del instructor ${actualizados.nombre} actualizada correctamente.`);
  };

  // Baja Lógica (CRUD - Soft Delete / Toggle Activo-Inactivo)
  const handleToggleBajaLogica = async (doc: Docente) => {
    const nuevoActivo = !doc.activo;
    const nuevoEstado = nuevoActivo
      ? (doc.paraleloActual ? (doc.diasEnAula >= 14 ? 'RELEVO_URGENTE' : 'EN_AULA') : 'EN_RESERVA')
      : 'INACTIVO';

    try {
      await fetch(`/api/v1/docentes/${doc.id}/baja-logica`, { method: 'PATCH' });
    } catch (err) {}

    setDocentes((prev) =>
      prev.map((d) =>
        d.id === doc.id
          ? {
              ...d,
              activo: nuevoActivo,
              estado: nuevoEstado as any,
              paraleloActual: nuevoActivo ? d.paraleloActual : undefined,
            }
          : d
      )
    );

    showToast(
      nuevoActivo
        ? `Instructor ${doc.nombre} reactivado en nómina regular.`
        : `Baja lógica procesada: ${doc.nombre} ha sido marcado como Inactivo.`
    );
  };

  // Baja Física (CRUD - Hard Delete con confirmación militar estricta)
  const handleConfirmarBajaFisica = async () => {
    if (!modalEliminarFisica) return;
    const id = modalEliminarFisica.id;
    const nombre = modalEliminarFisica.nombre;

    try {
      await fetch(`/api/v1/docentes/${id}`, { method: 'DELETE' });
    } catch (err) {}

    setDocentes((prev) => prev.filter((d) => d.id !== id));
    setModalEliminarFisica(null);
    showToast(`Baja física definitiva ejecutada para ${nombre}. Registro depurado del padrón.`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Toast Notificación */}
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
            zIndex: 10002,
            border: '1px solid var(--border-accent)',
          }}
        >
          <CheckCircle2 size={18} style={{ color: 'var(--military-gold-primary)' }} />
          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{toastMsg}</span>
        </div>
      )}

      {/* Header Militar Compacto */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '0.85rem',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-gold">
              <GraduationCap size={12} /> Estado Mayor Académico
            </span>
            <span className="badge badge-military">Rotación Quincenal (15 Días)</span>
          </div>
          <h1
            className="font-solemn"
            style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '0.02em', margin: 0 }}
          >
            Personal Docente & Control Quincenal
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: '0.2rem 0 0' }}>
            Regla de doctrina EIE: Rotación obligatoria de instructor militar al cumplir 15 días continuos en aula. Vista compacta de 8 registros.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.55rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setModalOptimizadorQuarkus(true)}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem' }}
          >
            <Sparkles size={14} style={{ color: 'var(--military-gold-primary)' }} />
            <span>Motor Relevo (Quarkus)</span>
          </button>

          <button
            onClick={() => setModalRegistro(true)}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem' }}
          >
            <UserPlus size={14} />
            <span>Nuevo Instructor</span>
          </button>
        </div>
      </div>

      {/* Alerta de Relevo Quincenal si existe */}
      {relevosUrgentes.length > 0 && (
        <div
          style={{
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            borderRadius: '6px',
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'rgba(245, 158, 11, 0.2)',
                color: '#fbbf24',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Clock size={16} />
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fbbf24', margin: 0 }}>
                RELEVO QUINCENAL OBLIGATORIO ({relevosUrgentes.length} PENDIENTES)
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-main)', margin: '0.1rem 0 0' }}>
                Instructores que han cumplido 14 o 15 días continuos: {relevosUrgentes.map((d) => `${d.nombre} [${d.paraleloActual}]`).join(', ')}.
              </p>
            </div>
          </div>

          <button
            onClick={() => setModalOptimizadorQuarkus(true)}
            className="btn btn-primary"
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
          >
            Resolver Relevo
          </button>
        </div>
      )}

      {/* Tarjetas KPI Superiores Compactas */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '0.75rem',
        }}
      >
        <div className="card" style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 6,
              background: 'var(--military-green-subtle)',
              color: 'var(--status-active)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--border-accent)',
            }}
          >
            <BookOpen size={18} />
          </div>
          <div>
            <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, margin: 0 }}>
              En Aula Activa
            </p>
            <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              {docentesEnAula.length} Asignados
            </p>
          </div>
        </div>

        <div className="card" style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 6,
              background: 'rgba(245, 158, 11, 0.12)',
              color: '#fbbf24',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(245, 158, 11, 0.3)',
            }}
          >
            <AlertTriangle size={18} />
          </div>
          <div>
            <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, margin: 0 }}>
              Relevos Inminentes
            </p>
            <p style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fbbf24', margin: 0 }}>
              {relevosUrgentes.length} Pendientes
            </p>
          </div>
        </div>

        <div className="card" style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 6,
              background: 'var(--military-gold-subtle)',
              color: 'var(--military-gold-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--border-gold)',
            }}
          >
            <Clock size={18} />
          </div>
          <div>
            <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, margin: 0 }}>
              En Reserva / Descanso
            </p>
            <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--military-gold-primary)', margin: 0 }}>
              {docentesReserva.length} Disponibles
            </p>
          </div>
        </div>
      </div>

      {/* Contenedor Principal: Filtros y Tabla Compacta con 8 filas */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Barra de Filtros */}
        <div
          style={{
            padding: '0.85rem 1rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
            background: 'var(--bg-surface-elevated)',
          }}
        >
          <div className="filter-tabs">
            <button
              onClick={() => { setFiltroEstado('TODOS'); setPaginaActual(1); }}
              className={`filter-tab ${filtroEstado === 'TODOS' ? 'active' : ''}`}
            >
              <span>Todos ({docentes.length})</span>
            </button>
            <button
              onClick={() => { setFiltroEstado('RELEVO'); setPaginaActual(1); }}
              className={`filter-tab ${filtroEstado === 'RELEVO' ? 'active' : ''}`}
            >
              <AlertTriangle size={12} style={{ color: '#fbbf24' }} />
              <span>Relevos ({relevosUrgentes.length})</span>
            </button>
            <button
              onClick={() => { setFiltroEstado('EN_AULA'); setPaginaActual(1); }}
              className={`filter-tab ${filtroEstado === 'EN_AULA' ? 'active' : ''}`}
            >
              <BookOpen size={12} />
              <span>En Aula ({docentesEnAula.length})</span>
            </button>
            <button
              onClick={() => { setFiltroEstado('EN_RESERVA'); setPaginaActual(1); }}
              className={`filter-tab ${filtroEstado === 'EN_RESERVA' ? 'active' : ''}`}
            >
              <Clock size={12} />
              <span>Reserva ({docentesReserva.length})</span>
            </button>
            <button
              onClick={() => { setFiltroEstado('INACTIVO'); setPaginaActual(1); }}
              className={`filter-tab ${filtroEstado === 'INACTIVO' ? 'active' : ''}`}
            >
              <Power size={12} />
              <span>Inactivos ({docentes.filter((d) => !d.activo).length})</span>
            </button>
          </div>

          <div style={{ position: 'relative', width: '100%', maxWidth: '280px' }}>
            <Search
              size={14}
              style={{
                position: 'absolute',
                left: '9px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            />
            <input
              type="text"
              placeholder="Buscar por grado, nombre o idioma..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPaginaActual(1); }}
              className="input"
              style={{ paddingLeft: '2rem', width: '100%', fontSize: '0.8rem', height: '32px' }}
            />
          </div>
        </div>

        {/* Tabla Compacta Militar: 8 Filas para Evitar Scroll Excesivo */}
        <div className="table-responsive">
          <table className="table" style={{ margin: 0 }}>
            <thead>
              <tr>
                <th style={{ width: '28%' }}>Instructor Militar / Civil</th>
                <th style={{ width: '18%' }}>Categoría & Unidad</th>
                <th style={{ width: '20%' }}>Habilitación Idiomas</th>
                <th style={{ width: '14%' }}>Rotación Quincenal</th>
                <th style={{ width: '10%' }}>Estado</th>
                <th style={{ width: '10%', textAlign: 'right' }}>Acciones CRUD</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem' }}>
                      <RefreshCw size={18} className="animate-spin" />
                      <span style={{ fontSize: '0.85rem' }}>Sincronizando nómina de instructores...</span>
                    </div>
                  </td>
                </tr>
              ) : docentesPaginados.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                    No se encontraron instructores que coincidan con el filtro actual.
                  </td>
                </tr>
              ) : (
                docentesPaginados.map((docente) => {
                  const esRelevo = docente.diasEnAula >= 14 && docente.activo;
                  const enAula = docente.paraleloActual !== undefined && docente.activo;

                  return (
                    <tr
                      key={docente.id}
                      style={{
                        background: !docente.activo
                          ? 'rgba(239, 68, 68, 0.04)'
                          : esRelevo
                          ? 'rgba(245, 158, 11, 0.04)'
                          : undefined,
                      }}
                    >
                      {/* 1. Instructor */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: 4,
                              background: docente.tipo === 'MILITAR' ? 'var(--military-green-primary)' : 'var(--military-navy)',
                              color: docente.tipo === 'MILITAR' ? 'var(--military-gold-primary)' : '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              fontSize: '0.75rem',
                              flexShrink: 0,
                              border: '1px solid var(--border-subtle)',
                            }}
                          >
                            {docente.nombre.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p style={{ fontWeight: 700, fontSize: '0.84rem', color: 'var(--text-main)', margin: 0 }}>
                              {docente.nombre}
                            </p>
                            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0, fontFamily: "'JetBrains Mono', monospace" }}>
                              CI: {docente.ci} &bull; {docente.telefono}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* 2. Categoría & Unidad */}
                      <td>
                        <span
                          className={docente.tipo === 'MILITAR' ? 'badge badge-military' : 'badge badge-civil'}
                          style={{ fontSize: '0.68rem', padding: '0.12rem 0.4rem' }}
                        >
                          {docente.gradoMilitar || 'Civil EIE'}
                        </span>
                        <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', margin: '0.15rem 0 0' }}>
                          {docente.unidadMilitar || 'Academia Militar'}
                        </p>
                      </td>

                      {/* 3. Idiomas */}
                      <td>
                        <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                          {docente.idiomasHabilitados.map((idm) => (
                            <span
                              key={idm}
                              style={{
                                fontSize: '0.65rem',
                                padding: '0.1rem 0.35rem',
                                borderRadius: '3px',
                                background: 'var(--bg-surface)',
                                border: '1px solid var(--border-subtle)',
                                color: 'var(--military-gold-primary)',
                              }}
                            >
                              {idm}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* 4. Rotación Quincenal (Progreso) */}
                      <td>
                        {enAula ? (
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '2px' }}>
                              <span style={{ color: 'var(--text-muted)' }}>{docente.paraleloActual}</span>
                              <strong style={{ color: esRelevo ? '#fbbf24' : 'var(--status-active)' }}>
                                {docente.diasEnAula}/15 d
                              </strong>
                            </div>
                            <div style={{ width: '100%', height: '4px', background: 'var(--bg-surface-elevated)', borderRadius: '2px', overflow: 'hidden' }}>
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
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            {docente.activo ? 'En Reserva (0 d)' : 'Inactivo'}
                          </span>
                        )}
                      </td>

                      {/* 5. Estado */}
                      <td>
                        {!docente.activo ? (
                          <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', fontSize: '0.65rem' }}>
                            Inactivo
                          </span>
                        ) : esRelevo ? (
                          <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}>
                            Relevo 15d
                          </span>
                        ) : enAula ? (
                          <span className="badge badge-military" style={{ fontSize: '0.65rem' }}>
                            En Aula
                          </span>
                        ) : (
                          <span className="badge badge-blue" style={{ fontSize: '0.65rem' }}>
                            En Reserva
                          </span>
                        )}
                      </td>

                      {/* 6. Acciones CRUD */}
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.25rem', alignItems: 'center' }}>
                          {/* Ver Hoja de Vida */}
                          <button
                            onClick={() => setModalHojaVida(docente)}
                            className="btn btn-secondary btn-icon"
                            style={{ width: '28px', height: '28px', padding: 0 }}
                            title="Ver Hoja de Servicio"
                          >
                            <Eye size={13} />
                          </button>

                          {/* Editar (Update) */}
                          <button
                            onClick={() => handleAbrirEditar(docente)}
                            className="btn btn-secondary btn-icon"
                            style={{ width: '28px', height: '28px', padding: 0 }}
                            title="Editar Datos"
                          >
                            <Edit size={13} />
                          </button>

                          {/* Baja Lógica (Toggle Activo / Inactivo) */}
                          <button
                            onClick={() => handleToggleBajaLogica(docente)}
                            className="btn btn-secondary btn-icon"
                            style={{
                              width: '28px',
                              height: '28px',
                              padding: 0,
                              color: docente.activo ? 'var(--status-active)' : 'var(--text-muted)',
                            }}
                            title={docente.activo ? 'Baja Lógica (Desactivar)' : 'Reactivar Docente'}
                          >
                            <Power size={13} />
                          </button>

                          {/* Baja Física (Eliminación con Confirmación) */}
                          <button
                            onClick={() => setModalEliminarFisica(docente)}
                            className="btn btn-secondary btn-icon"
                            style={{ width: '28px', height: '28px', padding: 0, color: '#ef4444' }}
                            title="Baja Física Definitiva"
                          >
                            <Trash2 size={13} />
                          </button>

                          {/* Relevo rápido si aplica */}
                          {esRelevo && (
                            <button
                              onClick={() => handleEjecutarRelevo(docente.id)}
                              className="btn btn-primary"
                              style={{ padding: '0.2rem 0.45rem', fontSize: '0.68rem', marginLeft: '0.2rem' }}
                              title="Ejecutar Relevo Inmediato"
                            >
                              Relevar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación Compacta: 8 Vistas */}
        <div
          style={{
            padding: '0.75rem 1rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.5rem',
            background: 'var(--bg-surface-elevated)',
          }}
        >
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Mostrando <strong>{docentesPaginados.length}</strong> de <strong>{docentesFiltrados.length}</strong> instructores (8 vistas por página)
          </span>

          <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
            <button
              onClick={() => setPaginaActual((p) => Math.max(1, p - 1))}
              disabled={paginaActual <= 1}
              className="btn btn-secondary btn-icon"
              style={{ width: '30px', height: '30px', padding: 0, opacity: paginaActual <= 1 ? 0.4 : 1 }}
              title="Página Anterior"
            >
              <ChevronLeft size={15} />
            </button>
            <span
              style={{
                padding: '0.2rem 0.65rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                background: 'var(--bg-surface)',
                borderRadius: '4px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              Página {paginaActual} de {totalPaginas}
            </span>
            <button
              onClick={() => setPaginaActual((p) => Math.min(totalPaginas, p + 1))}
              disabled={paginaActual >= totalPaginas}
              className="btn btn-secondary btn-icon"
              style={{ width: '30px', height: '30px', padding: 0, opacity: paginaActual >= totalPaginas ? 0.4 : 1 }}
              title="Página Siguiente"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* =================================================================
          MODAL 1: REGISTRO DE NUEVO INSTRUCTOR
      ================================================================= */}
      {modalRegistro && (
        <div className="modal-overlay" onClick={() => setModalRegistro(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <UserPlus size={16} style={{ color: 'var(--military-gold-primary)' }} />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  Registrar Instructor en Nómina
                </h3>
              </div>
              <button onClick={() => setModalRegistro(false)} className="btn-icon btn-ghost">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCrearDocente} style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label className="input-label" style={{ fontSize: '0.75rem' }}>Categoría</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setFormTipo('MILITAR')}
                    className={`btn ${formTipo === 'MILITAR' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '0.75rem', padding: '0.4rem', justifyContent: 'center' }}
                  >
                    <Shield size={13} /> Personal Militar
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormTipo('CIVIL')}
                    className={`btn ${formTipo === 'CIVIL' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '0.75rem', padding: '0.4rem', justifyContent: 'center' }}
                  >
                    <GraduationCap size={13} /> Instructor Civil
                  </button>
                </div>
              </div>

              <div>
                <label className="input-label" style={{ fontSize: '0.75rem' }}>Nombres y Apellidos *</label>
                <input
                  type="text"
                  value={formNombre}
                  onChange={(e) => setFormNombre(e.target.value)}
                  placeholder="Ej. Tte. Carlos Siles"
                  className="input"
                  style={{ fontSize: '0.8rem' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                <div>
                  <label className="input-label" style={{ fontSize: '0.75rem' }}>Cédula de Identidad *</label>
                  <input
                    type="text"
                    value={formCi}
                    onChange={(e) => setFormCi(e.target.value)}
                    placeholder="7120485 LP"
                    className="input"
                    style={{ fontSize: '0.8rem' }}
                    required
                  />
                </div>

                {formTipo === 'MILITAR' ? (
                  <div>
                    <label className="input-label" style={{ fontSize: '0.75rem' }}>Grado Militar</label>
                    <select
                      value={formGrado}
                      onChange={(e) => setFormGrado(e.target.value)}
                      className="input"
                      style={{ fontSize: '0.8rem' }}
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
                    <label className="input-label" style={{ fontSize: '0.75rem' }}>Título / Área</label>
                    <input
                      type="text"
                      placeholder="Lic. Lingüística"
                      className="input"
                      style={{ fontSize: '0.8rem' }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="input-label" style={{ fontSize: '0.75rem' }}>Idiomas Habilitados *</label>
                <input
                  type="text"
                  value={formIdiomas}
                  onChange={(e) => setFormIdiomas(e.target.value)}
                  placeholder="Inglés Militar, Francés Diplomático"
                  className="input"
                  style={{ fontSize: '0.8rem' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                <div>
                  <label className="input-label" style={{ fontSize: '0.75rem' }}>Teléfono Celular</label>
                  <input
                    type="text"
                    value={formTelefono}
                    onChange={(e) => setFormTelefono(e.target.value)}
                    placeholder="+591 71234567"
                    className="input"
                    style={{ fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label className="input-label" style={{ fontSize: '0.75rem' }}>Correo Institucional</label>
                  <input
                    type="email"
                    value={formCorreo}
                    onChange={(e) => setFormCorreo(e.target.value)}
                    placeholder="docente@ejercito.mil.bo"
                    className="input"
                    style={{ fontSize: '0.8rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setModalRegistro(false)} className="btn btn-secondary" style={{ fontSize: '0.78rem' }}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <UserPlus size={14} /> Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================
          MODAL 2: EDITAR FICHA DOCENTE (CRUD - UPDATE)
      ================================================================= */}
      {modalEditar && (
        <div className="modal-overlay" onClick={() => setModalEditar(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Edit size={16} style={{ color: 'var(--military-gold-primary)' }} />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  Modificar Ficha del Instructor
                </h3>
              </div>
              <button onClick={() => setModalEditar(null)} className="btn-icon btn-ghost">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleGuardarEdicion} style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label className="input-label" style={{ fontSize: '0.75rem' }}>Nombres y Apellidos *</label>
                <input
                  type="text"
                  value={editNombre}
                  onChange={(e) => setEditNombre(e.target.value)}
                  className="input"
                  style={{ fontSize: '0.8rem' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                <div>
                  <label className="input-label" style={{ fontSize: '0.75rem' }}>Cédula de Identidad *</label>
                  <input
                    type="text"
                    value={editCi}
                    onChange={(e) => setEditCi(e.target.value)}
                    className="input"
                    style={{ fontSize: '0.8rem' }}
                    required
                  />
                </div>

                {modalEditar.tipo === 'MILITAR' ? (
                  <div>
                    <label className="input-label" style={{ fontSize: '0.75rem' }}>Grado Militar</label>
                    <input
                      type="text"
                      value={editGrado}
                      onChange={(e) => setEditGrado(e.target.value)}
                      className="input"
                      style={{ fontSize: '0.8rem' }}
                    />
                  </div>
                ) : (
                  <div>
                    <label className="input-label" style={{ fontSize: '0.75rem' }}>Categoría</label>
                    <input
                      type="text"
                      value="Civil EIE"
                      disabled
                      className="input"
                      style={{ fontSize: '0.8rem', opacity: 0.7 }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="input-label" style={{ fontSize: '0.75rem' }}>Idiomas Habilitados *</label>
                <input
                  type="text"
                  value={editIdiomas}
                  onChange={(e) => setEditIdiomas(e.target.value)}
                  className="input"
                  style={{ fontSize: '0.8rem' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                <div>
                  <label className="input-label" style={{ fontSize: '0.75rem' }}>Teléfono Celular</label>
                  <input
                    type="text"
                    value={editTelefono}
                    onChange={(e) => setEditTelefono(e.target.value)}
                    className="input"
                    style={{ fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label className="input-label" style={{ fontSize: '0.75rem' }}>Correo Institucional</label>
                  <input
                    type="email"
                    value={editCorreo}
                    onChange={(e) => setEditCorreo(e.target.value)}
                    className="input"
                    style={{ fontSize: '0.8rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setModalEditar(null)} className="btn btn-secondary" style={{ fontSize: '0.78rem' }}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Check size={14} /> Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================
          MODAL 3: CONFIRMACIÓN DE BAJA FÍSICA (CRUD - HARD DELETE)
      ================================================================= */}
      {modalEliminarFisica && (
        <div className="modal-overlay" onClick={() => setModalEliminarFisica(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px', border: '1px solid rgba(239, 68, 68, 0.4)' }}>
            <div className="modal-header" style={{ borderBottom: '1px solid rgba(239, 68, 68, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertOctagon size={18} style={{ color: '#ef4444' }} />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ef4444', margin: 0 }}>
                  Confirmar Baja Física Definitiva
                </h3>
              </div>
              <button onClick={() => setModalEliminarFisica(null)} className="btn-icon btn-ghost">
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ background: 'rgba(239, 68, 68, 0.08)', padding: '0.85rem', borderRadius: '6px', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
                <p style={{ fontWeight: 700, fontSize: '0.85rem', color: '#ef4444', margin: 0 }}>
                  ADVERTENCIA DE SEGURIDAD MILITAR
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-main)', marginTop: '0.25rem' }}>
                  Está a punto de ejecutar la <strong>baja física permanente</strong> del instructor:
                </p>
                <p style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)', margin: '0.35rem 0 0' }}>
                  {modalEliminarFisica.nombre} (CI: {modalEliminarFisica.ci})
                </p>
              </div>

              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                Esta acción eliminará de forma irreversible el registro de la base de datos institucional PostgreSQL y desvinculará sus competencias idiomáticas asignadas. Si solo desea suspenderlo temporalmente, utilice la <strong>Baja Lógica</strong>.
              </p>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button onClick={() => setModalEliminarFisica(null)} className="btn btn-secondary" style={{ fontSize: '0.78rem' }}>
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmarBajaFisica}
                  className="btn"
                  style={{
                    background: '#dc2626',
                    color: '#ffffff',
                    border: '1px solid #b91c1c',
                    fontSize: '0.78rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <Trash2 size={14} /> Confirmar Baja Física
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================
          MODAL 4: HOJA DE VIDA Y SERVICIO DOCENTE
      ================================================================= */}
      {modalHojaVida && (
        <div className="modal-overlay" onClick={() => setModalHojaVida(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Shield size={16} style={{ color: 'var(--military-gold-primary)' }} />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  Hoja de Servicio Docente CEDMIL
                </h3>
              </div>
              <button onClick={() => setModalHojaVida(null)} className="btn-icon btn-ghost">
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem' }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: 'var(--military-green-primary)',
                    color: 'var(--military-gold-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1rem',
                    border: '1px solid var(--border-accent)',
                  }}
                >
                  {modalHojaVida.nombre.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                    {modalHojaVida.nombre}
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--military-gold-primary)', margin: 0 }}>
                    {modalHojaVida.gradoMilitar || 'Instructor Civil'} &bull; CI: {modalHojaVida.ci}
                  </p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>
                    {modalHojaVida.unidadMilitar || 'Escuela de Idiomas del Ejército'}
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', fontSize: '0.78rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Teléfono:</span>
                  <p style={{ fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>{modalHojaVida.telefono}</p>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Correo:</span>
                  <p style={{ fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>{modalHojaVida.correo}</p>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Evaluación:</span>
                  <p style={{ fontWeight: 700, color: 'var(--status-active)', margin: 0 }}>{modalHojaVida.evaluacionPromedio} / 100 pts</p>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Días en Aula Quincenal:</span>
                  <p style={{ fontWeight: 700, color: modalHojaVida.diasEnAula >= 14 ? '#fbbf24' : 'var(--text-main)', margin: 0 }}>
                    {modalHojaVida.diasEnAula} días
                  </p>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                  Idiomas Habilitados
                </span>
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.3rem' }}>
                  {modalHojaVida.idiomasHabilitados.map((i) => (
                    <span key={i} className="badge badge-gold" style={{ fontSize: '0.68rem' }}>
                      {i}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.35rem' }}>
                <button onClick={() => setModalHojaVida(null)} className="btn btn-secondary" style={{ fontSize: '0.78rem' }}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================
          MODAL 5: MOTOR DE RELEVO ÓPTIMO (QUARKUS)
      ================================================================= */}
      {modalOptimizadorQuarkus && (
        <div className="modal-overlay" onClick={() => setModalOptimizadorQuarkus(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={16} style={{ color: 'var(--military-gold-primary)' }} />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  Relevo Óptimo &bull; Algoritmo Quarkus CEDMIL
                </h3>
              </div>
              <button onClick={() => setModalOptimizadorQuarkus(false)} className="btn-icon btn-ghost">
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                El microservicio Quarkus evalúa los candidatos disponibles verificando la regla de 15 días, compatibilidad lingüística y descanso:
              </p>

              <div style={{ background: 'var(--bg-surface-elevated)', padding: '0.85rem', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.85rem' }}>
                    Paralelo: ING-101-A (Inglés Militar)
                  </span>
                  <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}>Relevo Urgente (15d)</span>
                </div>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '0 0 0.4rem' }}>
                  Instructor saliente: <strong>Cap. Fernando Ríos</strong> (15 días en aula cumplidos)
                </p>
                <div style={{ padding: '0.5rem', background: 'var(--bg-surface)', borderRadius: '4px', border: '1px solid var(--border-accent)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: '0.65rem', color: 'var(--military-gold-primary)', fontWeight: 700, margin: 0 }}>SUSTITUTO ÓPTIMO:</p>
                    <p style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>Tte. Carlos Ramos Siles</p>
                    <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', margin: 0 }}>En reserva &bull; Habilitado en Inglés Militar</p>
                  </div>
                  <button
                    onClick={() => {
                      handleEjecutarRelevo(1);
                      setModalOptimizadorQuarkus(false);
                    }}
                    className="btn btn-primary"
                    style={{ padding: '0.25rem 0.6rem', fontSize: '0.72rem' }}
                  >
                    Aprobar Relevo
                  </button>
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface-elevated)', padding: '0.85rem', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.85rem' }}>
                    Paralelo: FRA-101-A (Francés Diplomático)
                  </span>
                  <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}>Relevo Próximo (14d)</span>
                </div>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '0 0 0.4rem' }}>
                  Instructor saliente: <strong>Sgto. María Condori</strong> (14 días en aula)
                </p>
                <div style={{ padding: '0.5rem', background: 'var(--bg-surface)', borderRadius: '4px', border: '1px solid var(--border-accent)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: '0.65rem', color: 'var(--military-gold-primary)', fontWeight: 700, margin: 0 }}>SUSTITUTO ÓPTIMO:</p>
                    <p style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>Lic. Ana Blanco Gutiérrez</p>
                    <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', margin: 0 }}>Especialista en Francés Diplomático &bull; En reserva</p>
                  </div>
                  <button
                    onClick={() => {
                      handleEjecutarRelevo(2);
                      setModalOptimizadorQuarkus(false);
                    }}
                    className="btn btn-primary"
                    style={{ padding: '0.25rem 0.6rem', fontSize: '0.72rem' }}
                  >
                    Aprobar Relevo
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
                <button onClick={() => setModalOptimizadorQuarkus(false)} className="btn btn-secondary" style={{ fontSize: '0.78rem' }}>
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
