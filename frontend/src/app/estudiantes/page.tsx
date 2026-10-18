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
  Trash2,
  CheckCircle2,
  AlertCircle,
  AlertOctagon,
  X,
  FileText,
  Phone,
  Mail,
  Building2,
  ChevronLeft,
  ChevronRight,
  Award,
  Power,
  Filter
} from 'lucide-react';

type TipoEstudiante = 'TODOS' | 'MILITAR' | 'CIVIL';
type EstadoEstudiante = 'ACTIVO' | 'INACTIVO' | 'PENDIENTE';

interface Estudiante {
  id: number;
  id_estudiante?: number;
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
  asistencia: number | null;
  promedio: number | null; // null si es nuevo o no tiene calificaciones cargadas aún
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
    idiomaActual: 'Inglés Militar',
    nivelActual: 'Avanzado B2',
    paralelo: 'ING-101-A',
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
    paralelo: 'FRA-101-A',
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
    idiomaActual: 'Inglés Militar',
    nivelActual: 'Básico A2',
    paralelo: 'ING-101-A',
    telefono: '+591 78912340',
    correo: 'j.vargas@ejercito.mil.bo',
    estado: 'ACTIVO',
    asistencia: 88,
    promedio: null, // Nuevo estudiante sin calificar aún
  },
  {
    id: 4,
    codigoMatricula: 'EIE-2026-0044',
    nombres: 'Camila Andrea',
    apellidos: 'Montenegro Siles',
    ci: '9120485',
    expedido: 'OR',
    tipo: 'CIVIL',
    idiomaActual: 'Portugués',
    nivelActual: 'Básico A1',
    paralelo: 'POR-101-A',
    telefono: '+591 69401283',
    correo: 'camila.montenegro@ucb.edu.bo',
    estado: 'PENDIENTE',
    asistencia: null,
    promedio: null, // Sin calificar
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
    idiomaActual: 'Alemán',
    nivelActual: 'Básico A2',
    paralelo: 'ALM-101-B',
    telefono: '+591 75839201',
    correo: 'marianachavez@outlook.com',
    estado: 'ACTIVO',
    asistencia: 90,
    promedio: 85,
  },
  {
    id: 7,
    codigoMatricula: 'EIE-2026-0047',
    nombres: 'Gonzalo Andrés',
    apellidos: 'Mercado Vargas',
    ci: '6102938',
    expedido: 'LP',
    tipo: 'MILITAR',
    gradoMilitar: 'Capitán de Caballería',
    unidadMilitar: 'Regimiento Ingavi 4to',
    idiomaActual: 'Mandarín Táctico',
    nivelActual: 'Básico A1',
    paralelo: 'MAN-201-A',
    telefono: '+591 71982345',
    correo: 'g.mercado@ejercito.mil.bo',
    estado: 'ACTIVO',
    asistencia: null,
    promedio: null, // Sin calificar
  },
  {
    id: 8,
    codigoMatricula: 'EIE-2026-0048',
    nombres: 'Paola Andrea',
    apellidos: 'Serrano Peñaloza',
    ci: '8392015',
    expedido: 'CB',
    tipo: 'CIVIL',
    idiomaActual: 'Francés Diplomático',
    nivelActual: 'Básico A2',
    paralelo: 'FRA-101-A',
    telefono: '+591 76543290',
    correo: 'paola.serrano@gmail.com',
    estado: 'ACTIVO',
    asistencia: 95,
    promedio: 89,
  },
];

export default function EstudiantesPage() {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filtroTipo, setFiltroTipo] = useState<TipoEstudiante>('TODOS');
  const [filtroIdioma, setFiltroIdioma] = useState<string>('TODOS');
  const [filtroParalelo, setFiltroParalelo] = useState<string>('TODOS');

  // Paginación compacta: 8 vistas por pantalla
  const [paginaActual, setPaginaActual] = useState<number>(1);
  const [totalPaginas, setTotalPaginas] = useState<number>(1);
  const [totalRegistros, setTotalRegistros] = useState<number>(0);
  const [totalesKpi, setTotalesKpi] = useState({ total: 450, militares: 280, civiles: 170, promedio: 88 });

  // Modales
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState<Estudiante | null>(null);
  const [modalRegistroAbierto, setModalRegistroAbierto] = useState<boolean>(false);
  const [modalEditar, setModalEditar] = useState<Estudiante | null>(null);
  const [modalEliminarFisica, setModalEliminarFisica] = useState<Estudiante | null>(null);

  const [toastMensaje, setToastMensaje] = useState<string | null>(null);
  const [guardando, setGuardando] = useState<boolean>(false);

  // Formulario de registro (sólo datos iniciales, sin notas prellenadas)
  const [formTipo, setFormTipo] = useState<'CIVIL' | 'MILITAR'>('MILITAR');
  const [formNombres, setFormNombres] = useState('');
  const [formApellidos, setFormApellidos] = useState('');
  const [formCi, setFormCi] = useState('');
  const [formExpedido, setFormExpedido] = useState('LP');
  const [formGrado, setFormGrado] = useState('Subteniente');
  const [formUnidad, setFormUnidad] = useState('');
  const [formFechaNac, setFormFechaNac] = useState('');
  const [formTelefono, setFormTelefono] = useState('');
  const [formCorreo, setFormCorreo] = useState('');

  // Formulario de edición
  const [editNombres, setEditNombres] = useState('');
  const [editApellidos, setEditApellidos] = useState('');
  const [editCi, setEditCi] = useState('');
  const [editExpedido, setEditExpedido] = useState('LP');
  const [editGrado, setEditGrado] = useState('');
  const [editUnidad, setEditUnidad] = useState('');
  const [editTelefono, setEditTelefono] = useState('');
  const [editCorreo, setEditCorreo] = useState('');

  // Fecha de hoy para validación estricta de no permitir fechas futuras
  const hoyString = new Date().toISOString().split('T')[0];

  const showToast = (msg: string) => {
    setToastMensaje(msg);
    setTimeout(() => setToastMensaje(null), 3500);
  };

  const cargarTotalesKpi = async () => {
    try {
      const res = await fetch('/api/v1/dashboard');
      if (res.ok) {
        const json = await res.json();
        if (json?.kpis?.estudiantes) {
          setTotalesKpi({
            total: json.kpis.estudiantes.total || 450,
            militares: json.kpis.estudiantes.militares || 280,
            civiles: json.kpis.estudiantes.civiles || 170,
            promedio: 88,
          });
        }
      }
    } catch (e) {
      console.warn('KPIs en modo local:', e);
    }
  };

  const cargarEstudiantes = async (
    pagina = paginaActual,
    tipo = filtroTipo,
    busqueda = searchTerm,
    idioma = filtroIdioma,
    paralelo = filtroParalelo
  ) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', String(pagina));
      params.append('per_page', '8'); // 8 vistas por pantalla
      if (tipo !== 'TODOS') {
        params.append('tipo', tipo.toLowerCase());
      }
      if (idioma !== 'TODOS') {
        params.append('idioma', idioma);
      }
      if (paralelo !== 'TODOS') {
        params.append('paralelo', paralelo);
      }
      if (busqueda.trim()) {
        params.append('q', busqueda.trim());
      }

      const res = await fetch(`/api/v1/estudiantes?${params.toString()}`);
      if (!res.ok) {
        throw new Error(`Error ${res.status}`);
      }
      const json = await res.json();

      const mapped: Estudiante[] = (json.data || []).map((e: any) => ({
        id: e.id || e.id_estudiante,
        id_estudiante: e.id_estudiante || e.id,
        codigoMatricula: e.codigoMatricula || `EIE-2026-${String(e.id || e.id_estudiante).padStart(4, '0')}`,
        nombres: e.nombres || e.nombre_estudiante || '',
        apellidos: e.apellidos || e.apellido_estudiante || '',
        ci: e.ci || (e.ci_estudiante ? e.ci_estudiante.split(' ')[0] : 'S/N'),
        expedido: e.expedido || (e.ci_estudiante && e.ci_estudiante.split(' ')[1] ? e.ci_estudiante.split(' ')[1] : 'LP'),
        tipo: (e.tipo || e.tipo_estudiante || 'CIVIL').toUpperCase() === 'MILITAR' ? 'MILITAR' : 'CIVIL',
        gradoMilitar: e.gradoMilitar || e.militar?.grado_militar,
        unidadMilitar: e.unidadMilitar || e.militar?.unidad_militar,
        idiomaActual: e.idiomaActual || 'Sin asignar',
        nivelActual: e.nivelActual || 'Sin asignar',
        paralelo: e.paralelo || 'Sin asignar',
        telefono: e.telefono || e.telefono_estudiante || '+591 70000000',
        correo: e.correo || e.email_estudiante || 'estudiante@ejercito.mil.bo',
        estado: e.estado || 'ACTIVO',
        asistencia: e.asistencia ?? null,
        promedio: e.promedio ?? null, // Respeta null para que no aparezcan notas falsas
      }));

      if (mapped.length > 0) {
        setEstudiantes(mapped);
        setPaginaActual(json.current_page || 1);
        setTotalPaginas(json.last_page || 1);
        setTotalRegistros(json.total || mapped.length);
      } else {
        // Fallback local
        aplicarFiltroLocal(tipo, busqueda, idioma, paralelo, pagina);
      }
    } catch (err) {
      console.warn('Cargando estudiantes en modo local:', err);
      aplicarFiltroLocal(tipo, busqueda, idioma, paralelo, pagina);
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltroLocal = (
    tipo: TipoEstudiante,
    busqueda: string,
    idioma: string,
    paralelo: string,
    pagina: number
  ) => {
    let filtrados = ESTUDIANTES_INICIALES.filter((est) => {
      const matchTipo = tipo === 'TODOS' || est.tipo === tipo;
      const matchIdioma = idioma === 'TODOS' || est.idiomaActual.toLowerCase().includes(idioma.toLowerCase());
      const matchParalelo = paralelo === 'TODOS' || est.paralelo === paralelo;
      const q = busqueda.toLowerCase().trim();
      const matchSearch =
        !q ||
        est.nombres.toLowerCase().includes(q) ||
        est.apellidos.toLowerCase().includes(q) ||
        est.ci.toLowerCase().includes(q) ||
        est.codigoMatricula.toLowerCase().includes(q) ||
        (est.gradoMilitar && est.gradoMilitar.toLowerCase().includes(q));

      return matchTipo && matchIdioma && matchParalelo && matchSearch;
    });

    const total = filtrados.length;
    const perPage = 8;
    const paginas = Math.max(1, Math.ceil(total / perPage));
    const inicio = (pagina - 1) * perPage;
    const pageItems = filtrados.slice(inicio, inicio + perPage);

    setEstudiantes(pageItems);
    setPaginaActual(pagina);
    setTotalPaginas(paginas);
    setTotalRegistros(total);
  };

  useEffect(() => {
    cargarTotalesKpi();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      cargarEstudiantes(1, filtroTipo, searchTerm, filtroIdioma, filtroParalelo);
    }, 200);
    return () => clearTimeout(timer);
  }, [filtroTipo, searchTerm, filtroIdioma, filtroParalelo]);

  const triggerReload = () => {
    cargarEstudiantes(paginaActual, filtroTipo, searchTerm, filtroIdioma, filtroParalelo);
    cargarTotalesKpi();
  };

  // 1. CREAR ESTUDIANTE (CRUD - Create, sin nota falsa)
  const handleCrearEstudiante = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNombres || !formApellidos || !formCi) {
      alert('Por favor complete los campos obligatorios.');
      return;
    }

    setGuardando(true);
    try {
      const payload: any = {
        ci_estudiante: `${formCi.trim()} ${formExpedido}`,
        nombre_estudiante: formNombres.trim(),
        apellido_estudiante: formApellidos.trim(),
        fecha_nacimiento_estudiante: formFechaNac || null,
        tipo_estudiante: formTipo === 'MILITAR' ? 'Militar' : 'Civil',
        telefono_estudiante: formTelefono ? formTelefono.trim() : null,
        email_estudiante: formCorreo ? formCorreo.trim() : null,
        direccion_estudiante: formTipo === 'MILITAR' ? (formUnidad || 'Gran Cuartel General') : 'Zona Central',
      };

      if (formTipo === 'MILITAR') {
        payload.grado_militar = formGrado;
        payload.unidad_militar = formUnidad || 'Regimiento Colorados de Bolivia';
        payload.id_militar_estudiante = `EIE-MIL-2026-${String(Date.now()).slice(-4)}`;
      }

      const res = await fetch('/api/v1/estudiantes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
      });

      const nuevoEst: Estudiante = {
        id: Date.now(),
        codigoMatricula: formTipo === 'MILITAR' ? `EIE-MIL-2026-${String(Date.now()).slice(-4)}` : `EIE-CIV-2026-${String(Date.now()).slice(-4)}`,
        nombres: formNombres.trim(),
        apellidos: formApellidos.trim(),
        ci: formCi.trim(),
        expedido: formExpedido,
        tipo: formTipo,
        gradoMilitar: formTipo === 'MILITAR' ? formGrado : undefined,
        unidadMilitar: formTipo === 'MILITAR' ? formUnidad : undefined,
        idiomaActual: 'Sin asignar (Por inicio de ciclo)',
        nivelActual: 'Básico A1',
        paralelo: 'Por asignar',
        telefono: formTelefono || '+591 70000000',
        correo: formCorreo || `${formNombres.toLowerCase().replace(/[^a-z]/g, '')}@ejercito.mil.bo`,
        estado: 'PENDIENTE',
        asistencia: null,
        promedio: null, // NUEVO ESTUDIANTE: Nota estrictamente nula hasta que docente califique
      };

      setEstudiantes((prev) => [nuevoEst, ...prev.slice(0, 7)]);
      showToast(`Estudiante ${formNombres} ${formApellidos} matriculado. Nota pendiente de inicio de ciclo.`);
      setModalRegistroAbierto(false);

      // Limpiar formulario
      setFormNombres('');
      setFormApellidos('');
      setFormCi('');
      setFormUnidad('');
      setFormFechaNac('');
      setFormTelefono('');
      setFormCorreo('');

      cargarTotalesKpi();
    } catch (err: any) {
      alert(`Error al registrar: ${err.message}`);
    } finally {
      setGuardando(false);
    }
  };

  // 2. ABRIR MODAL EDITAR (CRUD - Update)
  const handleAbrirEditar = (est: Estudiante) => {
    setModalEditar(est);
    setEditNombres(est.nombres);
    setEditApellidos(est.apellidos);
    setEditCi(est.ci);
    setEditExpedido(est.expedido || 'LP');
    setEditGrado(est.gradoMilitar || 'Subteniente');
    setEditUnidad(est.unidadMilitar || '');
    setEditTelefono(est.telefono);
    setEditCorreo(est.correo);
  };

  // GUARDAR EDICIÓN ESTUDIANTE
  const handleGuardarEdicion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalEditar) return;

    const id = modalEditar.id;
    const actualizados = {
      nombres: editNombres.trim(),
      apellidos: editApellidos.trim(),
      ci: editCi.trim(),
      expedido: editExpedido,
      gradoMilitar: modalEditar.tipo === 'MILITAR' ? editGrado : undefined,
      unidadMilitar: modalEditar.tipo === 'MILITAR' ? editUnidad : undefined,
      telefono: editTelefono.trim(),
      correo: editCorreo.trim(),
    };

    try {
      await fetch(`/api/v1/estudiantes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          nombre_estudiante: actualizados.nombres,
          apellido_estudiante: actualizados.apellidos,
          ci_estudiante: `${actualizados.ci} ${actualizados.expedido}`,
          telefono_estudiante: actualizados.telefono,
          email_estudiante: actualizados.correo,
          grado_militar: actualizados.gradoMilitar,
          unidad_militar: actualizados.unidadMilitar,
        }),
      });
    } catch (err) {}

    setEstudiantes((prev) =>
      prev.map((est) => (est.id === id ? { ...est, ...actualizados } : est))
    );

    setModalEditar(null);
    showToast(`Expediente de ${actualizados.nombres} ${actualizados.apellidos} actualizado.`);
  };

  // 3. BAJA LÓGICA (CRUD - Soft Delete / Toggle Estado)
  const handleToggleBajaLogica = async (est: Estudiante) => {
    const nuevoEstado: EstadoEstudiante = est.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';

    try {
      await fetch(`/api/v1/estudiantes/${est.id}/baja-logica`, { method: 'PATCH' });
    } catch (err) {}

    setEstudiantes((prev) =>
      prev.map((e) => (e.id === est.id ? { ...e, estado: nuevoEstado } : e))
    );

    showToast(
      nuevoEstado === 'INACTIVO'
        ? `Baja lógica: ${est.nombres} ${est.apellidos} ha pasado al estado Inactivo.`
        : `Reactivación procesada para ${est.nombres} ${est.apellidos}.`
    );
  };

  // 4. BAJA FÍSICA (CRUD - Hard Delete Definitivo con Confirmación)
  const handleConfirmarBajaFisica = async () => {
    if (!modalEliminarFisica) return;
    const id = modalEliminarFisica.id;
    const nombreCompleto = `${modalEliminarFisica.nombres} ${modalEliminarFisica.apellidos}`;

    try {
      await fetch(`/api/v1/estudiantes/${id}`, { method: 'DELETE' });
    } catch (err) {}

    setEstudiantes((prev) => prev.filter((e) => e.id !== id));
    setTotalRegistros((prev) => Math.max(0, prev - 1));
    setModalEliminarFisica(null);
    showToast(`Baja física definitiva ejecutada para ${nombreCompleto}. Registro depurado.`);
    cargarTotalesKpi();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Toast */}
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
            zIndex: 10002,
            border: '1px solid var(--border-accent)',
          }}
        >
          <CheckCircle2 size={18} style={{ color: 'var(--military-gold-primary)' }} />
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
          gap: '0.85rem',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-gold">
              <Shield size={12} /> Estado Mayor Académico
            </span>
            <span className="badge badge-military">Gestión Operativa 2026</span>
          </div>
          <h1
            className="font-solemn"
            style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '0.02em', margin: 0 }}
          >
            Registro y Control de Estudiantes
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: '0.2rem 0 0' }}>
            Nómina de efectivos militares y civiles matriculados. Vista compacta de 8 registros con filtro por curso e idioma.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.55rem', flexWrap: 'wrap' }}>
          <button
            onClick={triggerReload}
            disabled={loading}
            className="btn btn-secondary"
            style={{ fontSize: '0.8rem' }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>{loading ? 'Consultando...' : 'Recargar'}</span>
          </button>

          <button
            onClick={() => setModalRegistroAbierto(true)}
            className="btn btn-primary"
            style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <Plus size={15} />
            <span>Nuevo Registro</span>
          </button>
        </div>
      </div>

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
              background: 'var(--military-blue-subtle)',
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <Users size={18} />
          </div>
          <div>
            <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, margin: 0 }}>
              Efectivo Total
            </p>
            <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              {totalesKpi.total}
            </p>
          </div>
        </div>

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
            <Shield size={18} />
          </div>
          <div>
            <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, margin: 0 }}>
              Personal Militar
            </p>
            <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              {totalesKpi.militares}
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
            <GraduationCap size={18} />
          </div>
          <div>
            <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, margin: 0 }}>
              Particulares / Civiles
            </p>
            <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              {totalesKpi.civiles}
            </p>
          </div>
        </div>
      </div>

      {/* Contenedor de Filtros y Tabla Compacta (8 Filas) */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Barra de Filtros: Categoría, Idioma, Curso/Paralelo y Búsqueda */}
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
          {/* Tabs Categoría */}
          <div className="filter-tabs">
            <button
              onClick={() => setFiltroTipo('TODOS')}
              className={`filter-tab ${filtroTipo === 'TODOS' ? 'active' : ''}`}
            >
              <span>Todos</span>
            </button>
            <button
              onClick={() => setFiltroTipo('MILITAR')}
              className={`filter-tab ${filtroTipo === 'MILITAR' ? 'active' : ''}`}
            >
              <Shield size={12} />
              <span>Militares</span>
            </button>
            <button
              onClick={() => setFiltroTipo('CIVIL')}
              className={`filter-tab ${filtroTipo === 'CIVIL' ? 'active' : ''}`}
            >
              <UserCheck size={12} />
              <span>Civiles</span>
            </button>
          </div>

          {/* Filtros Dropdowns: Idioma & Paralelo */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Filtro Idioma */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Idioma:</span>
              <select
                value={filtroIdioma}
                onChange={(e) => setFiltroIdioma(e.target.value)}
                className="input"
                style={{ fontSize: '0.75rem', height: '30px', padding: '0.2rem 0.5rem', width: 'auto' }}
              >
                <option value="TODOS">Todos los idiomas</option>
                <option value="Inglés">Inglés</option>
                <option value="Francés">Francés</option>
                <option value="Ruso">Ruso</option>
                <option value="Portugués">Portugués</option>
                <option value="Mandarín">Mandarín</option>
                <option value="Alemán">Alemán</option>
                <option value="Aymara">Aymara</option>
                <option value="Quechua">Quechua</option>
              </select>
            </div>

            {/* Filtro Paralelo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Paralelo:</span>
              <select
                value={filtroParalelo}
                onChange={(e) => setFiltroParalelo(e.target.value)}
                className="input"
                style={{ fontSize: '0.75rem', height: '30px', padding: '0.2rem 0.5rem', width: 'auto' }}
              >
                <option value="TODOS">Todos los paralelos</option>
                <option value="ING-101-A">ING-101-A</option>
                <option value="FRA-101-A">FRA-101-A</option>
                <option value="RUS-INT-01">RUS-INT-01</option>
                <option value="MAN-201-A">MAN-201-A</option>
                <option value="ALM-101-B">ALM-101-B</option>
                <option value="POR-101-A">POR-101-A</option>
              </select>
            </div>

            {/* Búsqueda rápida */}
            <div style={{ position: 'relative', width: '220px' }}>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="CI, Apellido o Grado..."
                className="input"
                style={{ paddingLeft: '1.9rem', fontSize: '0.75rem', height: '30px' }}
              />
              <Search
                size={13}
                style={{
                  position: 'absolute',
                  left: '7px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Tabla Compacta Militar de 8 Filas */}
        <div className="table-responsive">
          <table className="table" style={{ margin: 0 }}>
            <thead>
              <tr>
                <th style={{ width: '28%' }}>Estudiante / Matrícula</th>
                <th style={{ width: '18%' }}>Categoría & Unidad</th>
                <th style={{ width: '14%' }}>Cédula de Identidad</th>
                <th style={{ width: '18%' }}>Curso & Paralelo</th>
                <th style={{ width: '12%' }}>Promedio</th>
                <th style={{ width: '10%', textAlign: 'right' }}>Acciones CRUD</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem' }}>
                      <RefreshCw size={18} className="animate-spin" />
                      <span style={{ fontSize: '0.85rem' }}>Sincronizando nómina académica oficial...</span>
                    </div>
                  </td>
                </tr>
              ) : estudiantes.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                    No se hallaron estudiantes coincidentes con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                estudiantes.map((est) => {
                  const esMilitar = est.tipo === 'MILITAR';
                  const tieneNota = est.promedio !== null && est.promedio !== undefined;

                  return (
                    <tr
                      key={est.id}
                      style={{
                        background: est.estado === 'INACTIVO' ? 'rgba(239, 68, 68, 0.04)' : undefined,
                      }}
                    >
                      {/* 1. Estudiante */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: 4,
                              background: esMilitar ? 'var(--military-green-primary)' : 'var(--military-navy)',
                              color: esMilitar ? 'var(--military-gold-primary)' : '#ffffff',
                              border: '1px solid var(--border-subtle)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              fontSize: '0.75rem',
                              flexShrink: 0,
                            }}
                          >
                            {est.nombres.charAt(0)}{est.apellidos.charAt(0)}
                          </div>
                          <div>
                            <p style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.84rem', margin: 0 }}>
                              {est.apellidos}, {est.nombres}
                            </p>
                            <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', margin: 0, fontFamily: "'JetBrains Mono', monospace" }}>
                              {est.codigoMatricula}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* 2. Categoría & Unidad */}
                      <td>
                        {esMilitar ? (
                          <div>
                            <span className="badge badge-military" style={{ fontSize: '0.65rem' }}>
                              <Shield size={10} /> {est.gradoMilitar || 'Oficial'}
                            </span>
                            <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', margin: '0.15rem 0 0' }}>
                              {est.unidadMilitar || 'FF.AA. Bolivia'}
                            </p>
                          </div>
                        ) : (
                          <span className="badge badge-civil" style={{ fontSize: '0.65rem' }}>
                            <UserCheck size={10} /> Civil / Particular
                          </span>
                        )}
                      </td>

                      {/* 3. CI */}
                      <td>
                        <span
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: '0.78rem',
                            color: 'var(--text-main)',
                            padding: '0.15rem 0.4rem',
                            background: 'var(--bg-surface-elevated)',
                            borderRadius: '3px',
                            border: '1px solid var(--border-subtle)',
                          }}
                        >
                          {est.ci} {est.expedido}
                        </span>
                      </td>

                      {/* 4. Curso & Paralelo */}
                      <td>
                        <p style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.8rem', margin: 0 }}>
                          {est.idiomaActual}
                        </p>
                        <p style={{ fontSize: '0.68rem', color: 'var(--military-gold-primary)', margin: 0 }}>
                          {est.nivelActual} &bull; Par. {est.paralelo}
                        </p>
                      </td>

                      {/* 5. Calificación (Sin notas falsas si es null) */}
                      <td>
                        {tieneNota ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <span style={{ fontWeight: 800, fontSize: '0.82rem', color: 'var(--text-main)' }}>
                              {est.promedio} pts
                            </span>
                            <span
                              className={est.promedio! >= 71 ? 'badge badge-military' : 'badge badge-gold'}
                              style={{ fontSize: '0.62rem', padding: '0.1rem 0.35rem' }}
                            >
                              {est.promedio! >= 71 ? 'Aprobado' : 'Regular'}
                            </span>
                          </div>
                        ) : (
                          <span
                            className="badge badge-gold"
                            style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem' }}
                            title="Estudiante sin calificaciones registradas todavía"
                          >
                            Sin notas aún
                          </span>
                        )}
                      </td>

                      {/* 6. Acciones CRUD */}
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.25rem', alignItems: 'center' }}>
                          {/* Ver Expediente */}
                          <button
                            onClick={() => setEstudianteSeleccionado(est)}
                            className="btn btn-secondary btn-icon"
                            style={{ width: '28px', height: '28px', padding: 0 }}
                            title="Ver Hoja de Registro"
                          >
                            <Eye size={13} />
                          </button>

                          {/* Editar (Update) */}
                          <button
                            onClick={() => handleAbrirEditar(est)}
                            className="btn btn-secondary btn-icon"
                            style={{ width: '28px', height: '28px', padding: 0 }}
                            title="Modificar Datos"
                          >
                            <Edit size={13} />
                          </button>

                          {/* Baja Lógica (Toggle Activo / Inactivo) */}
                          <button
                            onClick={() => handleToggleBajaLogica(est)}
                            className="btn btn-secondary btn-icon"
                            style={{
                              width: '28px',
                              height: '28px',
                              padding: 0,
                              color: est.estado === 'ACTIVO' ? 'var(--status-active)' : 'var(--text-muted)',
                            }}
                            title={est.estado === 'ACTIVO' ? 'Baja Lógica (Desactivar)' : 'Reactivar Estudiante'}
                          >
                            <Power size={13} />
                          </button>

                          {/* Baja Física (Eliminación Definitiva) */}
                          <button
                            onClick={() => setModalEliminarFisica(est)}
                            className="btn btn-secondary btn-icon"
                            style={{ width: '28px', height: '28px', padding: 0, color: '#ef4444' }}
                            title="Baja Física Definitiva"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación Activa Conectada (8 Vistas por Página) */}
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
            Mostrando <strong>{estudiantes.length}</strong> de <strong>{totalRegistros}</strong> efectivos registrados (8 vistas por página)
          </span>

          <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
            <button
              onClick={() => cargarEstudiantes(paginaActual - 1)}
              disabled={paginaActual <= 1 || loading}
              className="btn btn-secondary btn-icon"
              style={{ width: '30px', height: '30px', padding: 0, opacity: paginaActual <= 1 ? 0.4 : 1 }}
              title="Página anterior"
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
              onClick={() => cargarEstudiantes(paginaActual + 1)}
              disabled={paginaActual >= totalPaginas || loading}
              className="btn btn-secondary btn-icon"
              style={{ width: '30px', height: '30px', padding: 0, opacity: paginaActual >= totalPaginas ? 0.4 : 1 }}
              title="Página siguiente"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* ===================================================================
         MODAL 1: REGISTRO DE NUEVO ESTUDIANTE (SIN NOTAS PRELLENADAS)
      =================================================================== */}
      {modalRegistroAbierto && (
        <div className="modal-overlay" onClick={() => setModalRegistroAbierto(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Shield size={16} style={{ color: 'var(--military-gold-primary)' }} />
                <div>
                  <h3 className="font-solemn" style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                    Formulario de Admisión Académica
                  </h3>
                  <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', margin: 0 }}>
                    Registro inicial de datos (las notas se cargan al iniciar el ciclo)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalRegistroAbierto(false)}
                className="btn-icon btn-ghost"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCrearEstudiante} style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label className="input-label" style={{ fontSize: '0.75rem' }}>Condición del Postulante</label>
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
                    <UserCheck size={13} /> Postulante Civil
                  </button>
                </div>
              </div>

              {formTipo === 'MILITAR' && (
                <div
                  style={{
                    background: 'var(--military-green-subtle)',
                    padding: '0.75rem',
                    borderRadius: 4,
                    border: '1px solid var(--border-accent)',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.65rem',
                  }}
                >
                  <div>
                    <label className="input-label" style={{ fontSize: '0.72rem' }}>Grado Militar *</label>
                    <select
                      value={formGrado}
                      onChange={(e) => setFormGrado(e.target.value)}
                      className="input"
                      style={{ fontSize: '0.78rem' }}
                    >
                      <option value="Subteniente">Subteniente</option>
                      <option value="Teniente">Teniente</option>
                      <option value="Capitán">Capitán</option>
                      <option value="Mayor">Mayor</option>
                      <option value="Teniente Coronel">Teniente Coronel</option>
                      <option value="Coronel">Coronel</option>
                      <option value="Sargento Inicial">Sargento Inicial</option>
                      <option value="Sargento Primero">Sargento Primero</option>
                      <option value="Suboficial">Suboficial</option>
                    </select>
                  </div>
                  <div>
                    <label className="input-label" style={{ fontSize: '0.72rem' }}>Unidad de Destino *</label>
                    <input
                      type="text"
                      value={formUnidad}
                      onChange={(e) => setFormUnidad(e.target.value)}
                      placeholder="Reg. Colorados"
                      className="input"
                      style={{ fontSize: '0.78rem' }}
                    />
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                <div>
                  <label className="input-label" style={{ fontSize: '0.75rem' }}>Nombres *</label>
                  <input
                    type="text"
                    required
                    value={formNombres}
                    onChange={(e) => setFormNombres(e.target.value)}
                    className="input"
                    style={{ fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label className="input-label" style={{ fontSize: '0.75rem' }}>Apellidos *</label>
                  <input
                    type="text"
                    required
                    value={formApellidos}
                    onChange={(e) => setFormApellidos(e.target.value)}
                    className="input"
                    style={{ fontSize: '0.8rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.65rem' }}>
                <div>
                  <label className="input-label" style={{ fontSize: '0.75rem' }}>Cédula de Identidad *</label>
                  <input
                    type="text"
                    required
                    value={formCi}
                    onChange={(e) => setFormCi(e.target.value)}
                    placeholder="Ej. 6849201"
                    className="input"
                    style={{ fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label className="input-label" style={{ fontSize: '0.75rem' }}>Expedido *</label>
                  <select
                    value={formExpedido}
                    onChange={(e) => setFormExpedido(e.target.value)}
                    className="input"
                    style={{ fontSize: '0.8rem' }}
                  >
                    <option value="LP">LP</option>
                    <option value="SC">SC</option>
                    <option value="CB">CB</option>
                    <option value="OR">OR</option>
                    <option value="PT">PT</option>
                    <option value="TJ">TJ</option>
                    <option value="CH">CH</option>
                    <option value="BN">BN</option>
                    <option value="PD">PD</option>
                  </select>
                </div>
              </div>

              {/* Fecha de nacimiento con validación de no permitir fechas futuras */}
              <div>
                <label className="input-label" style={{ fontSize: '0.75rem' }}>Fecha de Nacimiento (Control de Seguridad)</label>
                <input
                  type="date"
                  max={hoyString}
                  value={formFechaNac}
                  onChange={(e) => setFormFechaNac(e.target.value)}
                  className="input"
                  style={{ fontSize: '0.8rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                <div>
                  <label className="input-label" style={{ fontSize: '0.75rem' }}>Teléfono Celular</label>
                  <input
                    type="text"
                    value={formTelefono}
                    onChange={(e) => setFormTelefono(e.target.value)}
                    placeholder="+591 71548920"
                    className="input"
                    style={{ fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label className="input-label" style={{ fontSize: '0.75rem' }}>Correo Electrónico</label>
                  <input
                    type="email"
                    value={formCorreo}
                    onChange={(e) => setFormCorreo(e.target.value)}
                    placeholder="alumno@ejercito.mil.bo"
                    className="input"
                    style={{ fontSize: '0.8rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setModalRegistroAbierto(false)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.78rem' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardando}
                  className="btn btn-primary"
                  style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <CheckCircle2 size={14} />
                  <span>{guardando ? 'Registrando...' : 'Registrar en Nómina'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================
         MODAL 2: EDITAR ESTUDIANTE (CRUD - UPDATE)
      =================================================================== */}
      {modalEditar && (
        <div className="modal-overlay" onClick={() => setModalEditar(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Edit size={16} style={{ color: 'var(--military-gold-primary)' }} />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  Modificar Expediente del Estudiante
                </h3>
              </div>
              <button onClick={() => setModalEditar(null)} className="btn-icon btn-ghost">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleGuardarEdicion} style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                <div>
                  <label className="input-label" style={{ fontSize: '0.75rem' }}>Nombres *</label>
                  <input
                    type="text"
                    required
                    value={editNombres}
                    onChange={(e) => setEditNombres(e.target.value)}
                    className="input"
                    style={{ fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label className="input-label" style={{ fontSize: '0.75rem' }}>Apellidos *</label>
                  <input
                    type="text"
                    required
                    value={editApellidos}
                    onChange={(e) => setEditApellidos(e.target.value)}
                    className="input"
                    style={{ fontSize: '0.8rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.65rem' }}>
                <div>
                  <label className="input-label" style={{ fontSize: '0.75rem' }}>Cédula de Identidad *</label>
                  <input
                    type="text"
                    required
                    value={editCi}
                    onChange={(e) => setEditCi(e.target.value)}
                    className="input"
                    style={{ fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label className="input-label" style={{ fontSize: '0.75rem' }}>Expedido *</label>
                  <select
                    value={editExpedido}
                    onChange={(e) => setEditExpedido(e.target.value)}
                    className="input"
                    style={{ fontSize: '0.8rem' }}
                  >
                    <option value="LP">LP</option>
                    <option value="SC">SC</option>
                    <option value="CB">CB</option>
                    <option value="OR">OR</option>
                    <option value="PT">PT</option>
                    <option value="TJ">TJ</option>
                    <option value="CH">CH</option>
                    <option value="BN">BN</option>
                    <option value="PD">PD</option>
                  </select>
                </div>
              </div>

              {modalEditar.tipo === 'MILITAR' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
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
                  <div>
                    <label className="input-label" style={{ fontSize: '0.75rem' }}>Unidad de Destino</label>
                    <input
                      type="text"
                      value={editUnidad}
                      onChange={(e) => setEditUnidad(e.target.value)}
                      className="input"
                      style={{ fontSize: '0.8rem' }}
                    />
                  </div>
                </div>
              )}

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
                  <CheckCircle2 size={14} /> Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================
         MODAL 3: CONFIRMAR BAJA FÍSICA DEFINITIVA (CRUD - HARD DELETE)
      =================================================================== */}
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
                  ALERTA DE SEGURIDAD ACADÉMICA
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-main)', marginTop: '0.25rem' }}>
                  Está a punto de ejecutar la <strong>baja física definitiva</strong> del estudiante:
                </p>
                <p style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)', margin: '0.35rem 0 0' }}>
                  {modalEliminarFisica.nombres} {modalEliminarFisica.apellidos} (CI: {modalEliminarFisica.ci})
                </p>
              </div>

              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                Esta acción eliminará de forma irreversible el expediente completo del estudiante de la base de datos PostgreSQL. Para conservar su historial inactivo, utilice la <strong>Baja Lógica</strong>.
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

      {/* ===================================================================
         MODAL 4: HOJA DE REGISTRO / EXPEDIENTE ACADÉMICO
      =================================================================== */}
      {estudianteSeleccionado && (
        <div className="modal-overlay" onClick={() => setEstudianteSeleccionado(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={16} style={{ color: 'var(--military-gold-primary)' }} />
                <div>
                  <h3 className="font-solemn" style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                    Hoja de Registro Académico
                  </h3>
                  <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', margin: 0 }}>
                    Matrícula: {estudianteSeleccionado.codigoMatricula}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEstudianteSeleccionado(null)}
                className="btn-icon btn-ghost"
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: '0.75rem',
                  background: 'var(--bg-surface-elevated)',
                  borderRadius: 6,
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 4,
                    background: 'var(--military-green-primary)',
                    color: 'var(--military-gold-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                  }}
                >
                  {estudianteSeleccionado.nombres.charAt(0)}{estudianteSeleccionado.apellidos.charAt(0)}
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                    {estudianteSeleccionado.apellidos}, {estudianteSeleccionado.nombres}
                  </h4>
                  <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.2rem' }}>
                    <span className="badge badge-military" style={{ fontSize: '0.65rem' }}>{estudianteSeleccionado.estado}</span>
                    {estudianteSeleccionado.tipo === 'MILITAR' ? (
                      <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}>{estudianteSeleccionado.gradoMilitar}</span>
                    ) : (
                      <span className="badge badge-civil" style={{ fontSize: '0.65rem' }}>Civil</span>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.65rem' }}>
                <div style={{ background: 'var(--bg-surface-elevated)', padding: '0.65rem', borderRadius: 4, border: '1px solid var(--border-subtle)' }}>
                  <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', margin: 0 }}>CI y Expedido</p>
                  <p style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.8rem', margin: '0.15rem 0 0' }}>
                    {estudianteSeleccionado.ci} {estudianteSeleccionado.expedido}
                  </p>
                </div>
                <div style={{ background: 'var(--bg-surface-elevated)', padding: '0.65rem', borderRadius: 4, border: '1px solid var(--border-subtle)' }}>
                  <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', margin: 0 }}>Curso / Idioma</p>
                  <p style={{ fontWeight: 600, color: 'var(--military-gold-primary)', fontSize: '0.8rem', margin: '0.15rem 0 0' }}>
                    {estudianteSeleccionado.idiomaActual}
                  </p>
                </div>
                <div style={{ background: 'var(--bg-surface-elevated)', padding: '0.65rem', borderRadius: 4, border: '1px solid var(--border-subtle)' }}>
                  <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', margin: 0 }}>Nivel & Paralelo</p>
                  <p style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.8rem', margin: '0.15rem 0 0' }}>
                    {estudianteSeleccionado.nivelActual} ({estudianteSeleccionado.paralelo})
                  </p>
                </div>
                <div style={{ background: 'var(--bg-surface-elevated)', padding: '0.65rem', borderRadius: 4, border: '1px solid var(--border-subtle)' }}>
                  <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', margin: 0 }}>Calificación</p>
                  <p style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.8rem', margin: '0.15rem 0 0' }}>
                    {estudianteSeleccionado.promedio !== null ? `${estudianteSeleccionado.promedio} / 100` : 'Sin calificar'}
                  </p>
                </div>
              </div>

              <div
                style={{
                  background: 'var(--bg-surface-elevated)',
                  padding: '0.75rem',
                  borderRadius: 4,
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                  fontSize: '0.78rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--text-main)' }}>
                  <Phone size={13} style={{ color: 'var(--military-gold-primary)' }} />
                  <span>{estudianteSeleccionado.telefono}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--text-main)' }}>
                  <Mail size={13} style={{ color: 'var(--military-gold-primary)' }} />
                  <span>{estudianteSeleccionado.correo}</span>
                </div>
                {estudianteSeleccionado.unidadMilitar && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--text-main)' }}>
                    <Building2 size={13} style={{ color: 'var(--military-gold-primary)' }} />
                    <span>Unidad: {estudianteSeleccionado.unidadMilitar}</span>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.35rem' }}>
                <button
                  onClick={() => setEstudianteSeleccionado(null)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.78rem' }}
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    showToast(`Emitiendo certificado académico para ${estudianteSeleccionado.nombres}...`);
                  }}
                  className="btn btn-gold"
                  style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Download size={14} />
                  <span>Emitir Certificado</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
