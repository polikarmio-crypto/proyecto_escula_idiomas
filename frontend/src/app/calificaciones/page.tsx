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
  Download,
  ChevronLeft,
  ChevronRight,
  Sliders
} from 'lucide-react';

interface CalificacionEstudiante {
  id: number;
  matricula: string;
  nombres: string;
  apellidos: string;
  ci: string;
  tipo: 'MILITAR' | 'CIVIL';
  grado?: string;
  paralelo: string;
  idioma: string;
  listening: number | null; // Max 20
  speaking: number | null;  // Max 30
  reading: number | null;   // Max 20
  exam: number | null;      // Max 30
  promedioDirecto: number | null; // Si se cargó directamente el promedio
}

interface ParaleloInfo {
  codigo: string;
  idioma: string;
  nivel: string;
  docente: string;
  aula: string;
  periodo: string;
}

const PARALELOS_DISPONIBLES: ParaleloInfo[] = [
  { codigo: 'ING-101-A', idioma: 'Inglés Militar', nivel: 'Básico A1/A2', docente: 'Tte. Carlos Ramos', aula: 'Aula 101 - Pabellón Alfa', periodo: 'Ciclo Regular Octubre 2026' },
  { codigo: 'FRA-101-A', idioma: 'Francés Diplomático', nivel: 'Intermedio B1', docente: 'Cap. Fernando Ríos', aula: 'Aula 201 - Pabellón Bravo', periodo: 'Ciclo Regular Octubre 2026' },
  { codigo: 'RUS-INT-01', idioma: 'Ruso Técnico', nivel: 'Intermedio B1', docente: 'My. Roberto Daza', aula: 'Lab Idiomas 2', periodo: 'Ciclo Especial Octubre 2026' },
  { codigo: 'MAN-201-A', idioma: 'Mandarín Táctico', nivel: 'Básico A1', docente: 'Lic. Ana Blanco', aula: 'Aula 304 - Pabellón Charlie', periodo: 'Ciclo Regular Octubre 2026' },
  { codigo: 'ALM-101-B', idioma: 'Alemán Académico', nivel: 'Básico A2', docente: 'Lic. Javier Morales', aula: 'Aula 105 - Pabellón Alfa', periodo: 'Ciclo Regular Octubre 2026' },
  { codigo: 'POR-101-A', idioma: 'Portugués Comercial', nivel: 'Básico A1', docente: 'Cap. Rodrigo Soliz', aula: 'Aula 202 - Pabellón Bravo', periodo: 'Ciclo Regular Octubre 2026' },
];

const ESTUDIANTES_CALIFICACIONES_INICIALES: CalificacionEstudiante[] = [
  {
    id: 1,
    matricula: 'EIE-2026-0041',
    nombres: 'Carlos Fernando',
    apellidos: 'Mamani Quispe',
    ci: '6849201 LP',
    tipo: 'MILITAR',
    grado: 'Capitán de Infantería',
    paralelo: 'ING-101-A',
    idioma: 'Inglés Militar',
    listening: 19,
    speaking: 28,
    reading: 18,
    exam: 27,
    promedioDirecto: null,
  },
  {
    id: 2,
    matricula: 'EIE-2026-0042',
    nombres: 'Valentina Sofía',
    apellidos: 'Rios Torrico',
    ci: '8392014 CB',
    tipo: 'CIVIL',
    paralelo: 'ING-101-A',
    idioma: 'Inglés Militar',
    listening: 20,
    speaking: 29,
    reading: 20,
    exam: 29,
    promedioDirecto: null,
  },
  {
    id: 3,
    matricula: 'EIE-2026-0043',
    nombres: 'Jorge Luis',
    apellidos: 'Vargas Peñaranda',
    ci: '4920183 SC',
    tipo: 'MILITAR',
    grado: 'Subteniente de Artillería',
    paralelo: 'ING-101-A',
    idioma: 'Inglés Militar',
    listening: null,
    speaking: null,
    reading: null,
    exam: null,
    promedioDirecto: null, // Sin calificar aún
  },
  {
    id: 4,
    matricula: 'EIE-2026-0044',
    nombres: 'Camila Andrea',
    apellidos: 'Montenegro Siles',
    ci: '9120485 OR',
    tipo: 'CIVIL',
    paralelo: 'ING-101-A',
    idioma: 'Inglés Militar',
    listening: 14,
    speaking: 20,
    reading: 15,
    exam: 19,
    promedioDirecto: null,
  },
  {
    id: 5,
    matricula: 'EIE-2026-0045',
    nombres: 'Alejandro Rene',
    apellidos: 'Gutiérrez Dorado',
    ci: '5829104 TJ',
    tipo: 'MILITAR',
    grado: 'Teniente de Comunicaciones',
    paralelo: 'ING-101-A',
    idioma: 'Inglés Militar',
    listening: 20,
    speaking: 29,
    reading: 19,
    exam: 29,
    promedioDirecto: null,
  },
  {
    id: 6,
    matricula: 'EIE-2026-0051',
    nombres: 'Marcelo Javier',
    apellidos: 'Peñafiel Castro',
    ci: '5019284 LP',
    tipo: 'MILITAR',
    grado: 'Mayor de Caballería',
    paralelo: 'FRA-101-A',
    idioma: 'Francés Diplomático',
    listening: 18,
    speaking: 27,
    reading: 18,
    exam: 26,
    promedioDirecto: null,
  },
  {
    id: 7,
    matricula: 'EIE-2026-0052',
    nombres: 'Luciana Belén',
    apellidos: 'Salazar Arce',
    ci: '7102938 SC',
    tipo: 'CIVIL',
    paralelo: 'FRA-101-A',
    idioma: 'Francés Diplomático',
    listening: 19,
    speaking: 28,
    reading: 19,
    exam: 28,
    promedioDirecto: null,
  },
  {
    id: 8,
    matricula: 'EIE-2026-0053',
    nombres: 'Paola Andrea',
    apellidos: 'Serrano Peñaloza',
    ci: '8392015 CB',
    tipo: 'CIVIL',
    paralelo: 'FRA-101-A',
    idioma: 'Francés Diplomático',
    listening: null,
    speaking: null,
    reading: null,
    exam: null,
    promedioDirecto: null, // Nuevo sin calificar
  },
  {
    id: 9,
    matricula: 'EIE-2026-0061',
    nombres: 'Raúl Gonzalo',
    apellidos: 'Crespo Morales',
    ci: '4839201 LP',
    tipo: 'MILITAR',
    grado: 'Capitán de Blindados',
    paralelo: 'RUS-INT-01',
    idioma: 'Ruso Técnico',
    listening: 19,
    speaking: 27,
    reading: 17,
    exam: 28,
    promedioDirecto: null,
  },
  {
    id: 10,
    matricula: 'EIE-2026-0062',
    nombres: 'Daniela Andrea',
    apellidos: 'Zalles Pinto',
    ci: '6392019 CB',
    tipo: 'CIVIL',
    paralelo: 'RUS-INT-01',
    idioma: 'Ruso Técnico',
    listening: 16,
    speaking: 24,
    reading: 16,
    exam: 24,
    promedioDirecto: null,
  },
  {
    id: 11,
    matricula: 'EIE-2026-0071',
    nombres: 'Gonzalo Andrés',
    apellidos: 'Mercado Vargas',
    ci: '6102938 LP',
    tipo: 'MILITAR',
    grado: 'Capitán de Caballería',
    paralelo: 'MAN-201-A',
    idioma: 'Mandarín Táctico',
    listening: null,
    speaking: null,
    reading: null,
    exam: null,
    promedioDirecto: null, // Sin calificar
  },
  {
    id: 12,
    matricula: 'EIE-2026-0081',
    nombres: 'Mariana Lucía',
    apellidos: 'Chávez Guzmán',
    ci: '7401928 CH',
    tipo: 'CIVIL',
    paralelo: 'ALM-101-B',
    idioma: 'Alemán Académico',
    listening: 17,
    speaking: 26,
    reading: 18,
    exam: 24,
    promedioDirecto: null,
  },
];

export default function CalificacionesPage() {
  const [estudiantes, setEstudiantes] = useState<CalificacionEstudiante[]>(ESTUDIANTES_CALIFICACIONES_INICIALES);
  const [filtroIdioma, setFiltroIdioma] = useState<string>('TODOS');
  const [filtroParalelo, setFiltroParalelo] = useState<string>('TODOS');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Paginación compacta: 8 vistas por pantalla
  const [paginaActual, setPaginaActual] = useState<number>(1);
  const ITEMS_PER_PAGE = 8;

  // Modales
  const [modalEditar, setModalEditar] = useState<CalificacionEstudiante | null>(null);
  const [modoCarga, setModoCarga] = useState<'DESGLOSE' | 'DIRECTO'>('DESGLOSE');
  const [editListening, setEditListening] = useState<number>(0);
  const [editSpeaking, setEditSpeaking] = useState<number>(0);
  const [editReading, setEditReading] = useState<number>(0);
  const [editExam, setEditExam] = useState<number>(0);
  const [editPromedioDirecto, setEditPromedioDirecto] = useState<number>(85);

  const [modalActaAbierto, setModalActaAbierto] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Cálculo de promedio ponderado institucional
  const calcularNotaTotal = (est: CalificacionEstudiante): number | null => {
    if (est.promedioDirecto !== null && est.promedioDirecto !== undefined) {
      return est.promedioDirecto;
    }
    if (
      est.listening === null &&
      est.speaking === null &&
      est.reading === null &&
      est.exam === null
    ) {
      return null;
    }
    const l = est.listening || 0;
    const s = est.speaking || 0;
    const r = est.reading || 0;
    const e = est.exam || 0;
    return Math.round(l + s + r + e);
  };

  // Filtrado reactivo por Curso (Paralelo), Idioma y Búsqueda
  const estudiantesFiltrados = useMemo(() => {
    return estudiantes.filter((est) => {
      const matchIdioma = filtroIdioma === 'TODOS' || est.idioma.toLowerCase().includes(filtroIdioma.toLowerCase());
      const matchParalelo = filtroParalelo === 'TODOS' || est.paralelo === filtroParalelo;

      const q = searchTerm.toLowerCase().trim();
      const matchSearch =
        !q ||
        est.nombres.toLowerCase().includes(q) ||
        est.apellidos.toLowerCase().includes(q) ||
        est.ci.toLowerCase().includes(q) ||
        est.matricula.toLowerCase().includes(q) ||
        (est.grado && est.grado.toLowerCase().includes(q));

      return matchIdioma && matchParalelo && matchSearch;
    });
  }, [estudiantes, filtroIdioma, filtroParalelo, searchTerm]);

  // Paginación compacta (8 por página)
  const totalPaginas = Math.max(1, Math.ceil(estudiantesFiltrados.length / ITEMS_PER_PAGE));
  const estudiantesPaginados = useMemo(() => {
    const inicio = (paginaActual - 1) * ITEMS_PER_PAGE;
    return estudiantesFiltrados.slice(inicio, inicio + ITEMS_PER_PAGE);
  }, [estudiantesFiltrados, paginaActual]);

  // Estadísticas del filtro actual
  const evaluados = estudiantesFiltrados.filter((e) => calcularNotaTotal(e) !== null);
  const sinCalificar = estudiantesFiltrados.filter((e) => calcularNotaTotal(e) === null);
  const promedioGeneral = evaluados.length > 0
    ? Math.round((evaluados.reduce((acc, curr) => acc + (calcularNotaTotal(curr) || 0), 0) / evaluados.length) * 10) / 10
    : 0;

  const aprobadosCount = evaluados.filter((e) => (calcularNotaTotal(e) || 0) >= 71).length;

  // Abrir Modal de Calificación
  const handleAbrirEdicion = (est: CalificacionEstudiante) => {
    setModalEditar(est);
    if (est.promedioDirecto !== null) {
      setModoCarga('DIRECTO');
      setEditPromedioDirecto(est.promedioDirecto);
      setEditListening(Math.round(est.promedioDirecto * 0.2));
      setEditSpeaking(Math.round(est.promedioDirecto * 0.3));
      setEditReading(Math.round(est.promedioDirecto * 0.2));
      setEditExam(Math.round(est.promedioDirecto * 0.3));
    } else if (est.listening !== null) {
      setModoCarga('DESGLOSE');
      setEditListening(est.listening || 0);
      setEditSpeaking(est.speaking || 0);
      setEditReading(est.reading || 0);
      setEditExam(est.exam || 0);
      setEditPromedioDirecto(Math.round((est.listening || 0) + (est.speaking || 0) + (est.reading || 0) + (est.exam || 0)));
    } else {
      // Nuevo sin calificar
      setModoCarga('DIRECTO');
      setEditPromedioDirecto(85);
      setEditListening(17);
      setEditSpeaking(26);
      setEditReading(17);
      setEditExam(25);
    }
  };

  // Guardar Calificación (Soporta desglose 80/10/10 o carga directa de promedio)
  const handleGuardarCalificacion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalEditar) return;

    const id = modalEditar.id;

    setEstudiantes((prev) =>
      prev.map((est) => {
        if (est.id !== id) return est;

        if (modoCarga === 'DIRECTO') {
          const direct = Math.min(Math.max(Number(editPromedioDirecto), 0), 100);
          return {
            ...est,
            promedioDirecto: direct,
            listening: Math.round(direct * 0.2),
            speaking: Math.round(direct * 0.3),
            reading: Math.round(direct * 0.2),
            exam: Math.round(direct * 0.3),
          };
        } else {
          const l = Math.min(Math.max(Number(editListening), 0), 20);
          const s = Math.min(Math.max(Number(editSpeaking), 0), 30);
          const r = Math.min(Math.max(Number(editReading), 0), 20);
          const ex = Math.min(Math.max(Number(editExam), 0), 30);
          return {
            ...est,
            promedioDirecto: null,
            listening: l,
            speaking: s,
            reading: r,
            exam: ex,
          };
        }
      })
    );

    showToast(`Calificación procesada exitosamente para ${modalEditar.nombres} ${modalEditar.apellidos}.`);
    setModalEditar(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
              <Shield size={12} /> Jefatura de Estudios
            </span>
            <span className="badge badge-military">Evaluación Continua CEDMIL</span>
          </div>
          <h1
            className="font-solemn"
            style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '0.02em', margin: 0 }}
          >
            Registro y Control de Calificaciones
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: '0.2rem 0 0' }}>
            Filtre por curso o idioma para asentar notas. Admite desglose por competencias o carga directa del promedio. Vista compacta de 8 registros.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.55rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setModalActaAbierto(true)}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem' }}
          >
            <Printer size={15} />
            <span>Emitir Acta Oficial</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Compactas */}
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
            <Award size={18} />
          </div>
          <div>
            <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, margin: 0 }}>
              Promedio General
            </p>
            <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              {promedioGeneral} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/ 100</span>
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
            <CheckCircle2 size={18} />
          </div>
          <div>
            <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, margin: 0 }}>
              Aprobados (&ge; 71 pts)
            </p>
            <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--military-gold-primary)', margin: 0 }}>
              {aprobadosCount} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>de {evaluados.length}</span>
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
            <AlertCircle size={18} />
          </div>
          <div>
            <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, margin: 0 }}>
              Pendientes de Calificar
            </p>
            <p style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fbbf24', margin: 0 }}>
              {sinCalificar.length} Efectivos
            </p>
          </div>
        </div>
      </div>

      {/* Contenedor Principal: Filtros y Tabla Compacta con 8 filas */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Barra de Filtros: Idioma, Paralelo y Búsqueda */}
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
          <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Filtro Idioma */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Idioma:</span>
              <select
                value={filtroIdioma}
                onChange={(e) => { setFiltroIdioma(e.target.value); setPaginaActual(1); }}
                className="input"
                style={{ fontSize: '0.78rem', height: '32px', padding: '0.2rem 0.6rem', width: 'auto' }}
              >
                <option value="TODOS">Todos los Idiomas</option>
                <option value="Inglés">Inglés Militar</option>
                <option value="Francés">Francés Diplomático</option>
                <option value="Ruso">Ruso Técnico</option>
                <option value="Mandarín">Mandarín Táctico</option>
                <option value="Alemán">Alemán Académico</option>
                <option value="Portugués">Portugués</option>
              </select>
            </div>

            {/* Filtro Paralelo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Curso / Paralelo:</span>
              <select
                value={filtroParalelo}
                onChange={(e) => { setFiltroParalelo(e.target.value); setPaginaActual(1); }}
                className="input"
                style={{ fontSize: '0.78rem', height: '32px', padding: '0.2rem 0.6rem', width: 'auto' }}
              >
                <option value="TODOS">Todos los Cursos</option>
                {PARALELOS_DISPONIBLES.map((p) => (
                  <option key={p.codigo} value={p.codigo}>
                    {p.codigo} - {p.idioma}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Búsqueda rápida */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '260px' }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPaginaActual(1); }}
              placeholder="Buscar por CI, Apellido o Grado..."
              className="input"
              style={{ paddingLeft: '1.9rem', fontSize: '0.78rem', height: '32px' }}
            />
            <Search
              size={14}
              style={{
                position: 'absolute',
                left: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            />
          </div>
        </div>

        {/* Tabla Compacta: 8 Vistas por Pantalla */}
        <div className="table-responsive">
          <table className="table" style={{ margin: 0 }}>
            <thead>
              <tr>
                <th style={{ width: '28%' }}>Estudiante / Grado</th>
                <th style={{ width: '16%' }}>Curso & Idioma</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Listening (20%)</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Speaking (30%)</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Reading (20%)</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Examen (30%)</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Nota Final</th>
                <th style={{ width: '6%', textAlign: 'right' }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {estudiantesPaginados.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                    No se encontraron estudiantes para los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                estudiantesPaginados.map((est) => {
                  const esMilitar = est.tipo === 'MILITAR';
                  const notaTotal = calcularNotaTotal(est);
                  const tieneNota = notaTotal !== null;

                  return (
                    <tr
                      key={est.id}
                      style={{
                        background: !tieneNota ? 'rgba(245, 158, 11, 0.03)' : undefined,
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
                            <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', margin: 0 }}>
                              {est.grado ? `${est.grado} • ` : 'Civil • '}CI: {est.ci}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* 2. Curso & Idioma */}
                      <td>
                        <span className="badge badge-military" style={{ fontSize: '0.65rem' }}>
                          {est.paralelo}
                        </span>
                        <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', margin: '0.15rem 0 0' }}>
                          {est.idioma}
                        </p>
                      </td>

                      {/* 3. Listening */}
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ fontSize: '0.8rem', color: tieneNota ? 'var(--text-main)' : 'var(--text-muted)' }}>
                          {est.listening !== null ? `${est.listening}/20` : '-'}
                        </span>
                      </td>

                      {/* 4. Speaking */}
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ fontSize: '0.8rem', color: tieneNota ? 'var(--text-main)' : 'var(--text-muted)' }}>
                          {est.speaking !== null ? `${est.speaking}/30` : '-'}
                        </span>
                      </td>

                      {/* 5. Reading */}
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ fontSize: '0.8rem', color: tieneNota ? 'var(--text-main)' : 'var(--text-muted)' }}>
                          {est.reading !== null ? `${est.reading}/20` : '-'}
                        </span>
                      </td>

                      {/* 6. Examen */}
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ fontSize: '0.8rem', color: tieneNota ? 'var(--text-main)' : 'var(--text-muted)' }}>
                          {est.exam !== null ? `${est.exam}/30` : '-'}
                        </span>
                      </td>

                      {/* 7. Nota Final */}
                      <td style={{ textAlign: 'center' }}>
                        {tieneNota ? (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                            <strong style={{ fontSize: '0.88rem', color: 'var(--text-main)' }}>
                              {notaTotal}
                            </strong>
                            <span
                              className={notaTotal! >= 71 ? 'badge badge-military' : 'badge badge-gold'}
                              style={{ fontSize: '0.6rem', padding: '0.1rem 0.3rem' }}
                            >
                              {notaTotal! >= 71 ? 'Aprobado' : 'Regular'}
                            </span>
                          </div>
                        ) : (
                          <span className="badge badge-gold" style={{ fontSize: '0.62rem' }}>
                            Sin calificar
                          </span>
                        )}
                      </td>

                      {/* 8. Acción */}
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => handleAbrirEdicion(est)}
                          className="btn btn-secondary btn-icon"
                          style={{ width: '28px', height: '28px', padding: 0 }}
                          title={tieneNota ? 'Modificar Calificación' : 'Asentar Nota'}
                        >
                          <Edit size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación Activa de 8 Vistas */}
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
            Mostrando <strong>{estudiantesPaginados.length}</strong> de <strong>{estudiantesFiltrados.length}</strong> estudiantes (8 vistas por página)
          </span>

          <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
            <button
              onClick={() => setPaginaActual((p) => Math.max(1, p - 1))}
              disabled={paginaActual <= 1}
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
              onClick={() => setPaginaActual((p) => Math.min(totalPaginas, p + 1))}
              disabled={paginaActual >= totalPaginas}
              className="btn btn-secondary btn-icon"
              style={{ width: '30px', height: '30px', padding: 0, opacity: paginaActual >= totalPaginas ? 0.4 : 1 }}
              title="Página siguiente"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* =================================================================
          MODAL: CARGA Y ASENTAMIENTO DE NOTAS (DESGLOSE O PROMEDIO DIRECTO)
      ================================================================= */}
      {modalEditar && (
        <div className="modal-overlay" onClick={() => setModalEditar(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={16} style={{ color: 'var(--military-gold-primary)' }} />
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                    Asignar Calificación Académica
                  </h3>
                  <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', margin: 0 }}>
                    {modalEditar.nombres} {modalEditar.apellidos} &bull; {modalEditar.paralelo}
                  </p>
                </div>
              </div>
              <button onClick={() => setModalEditar(null)} className="btn-icon btn-ghost">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleGuardarCalificacion} style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {/* Selector de modo de carga: Desglose o Carga Directa */}
              <div>
                <label className="input-label" style={{ fontSize: '0.75rem' }}>Método de Evaluación</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setModoCarga('DIRECTO')}
                    className={`btn ${modoCarga === 'DIRECTO' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '0.75rem', padding: '0.4rem', justifyContent: 'center' }}
                  >
                    <Sliders size={13} /> Carga Directa (Promedio)
                  </button>
                  <button
                    type="button"
                    onClick={() => setModoCarga('DESGLOSE')}
                    className={`btn ${modoCarga === 'DESGLOSE' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '0.75rem', padding: '0.4rem', justifyContent: 'center' }}
                  >
                    <Award size={13} /> Desglose Competencias
                  </button>
                </div>
              </div>

              {modoCarga === 'DIRECTO' ? (
                /* Opción 1: El docente coloca su nota promedio directamente */
                <div style={{ background: 'var(--bg-surface-elevated)', padding: '0.85rem', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                  <label className="input-label" style={{ fontSize: '0.78rem', color: 'var(--military-gold-primary)' }}>
                    Nota Promedio Final Asignada por el Docente (0 - 100 pts) *
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.35rem' }}>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={editPromedioDirecto}
                      onChange={(e) => setEditPromedioDirecto(Number(e.target.value))}
                      className="input"
                      style={{ fontSize: '1.25rem', fontWeight: 800, textAlign: 'center', width: '100px' }}
                      required
                    />
                    <div>
                      <p style={{ fontSize: '0.75rem', fontWeight: 700, color: editPromedioDirecto >= 71 ? 'var(--status-active)' : '#fbbf24', margin: 0 }}>
                        {editPromedioDirecto >= 71 ? 'Condición: Aprobado EIE' : 'Condición: Regular / En observación'}
                      </p>
                      <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', margin: '0.15rem 0 0' }}>
                        El sistema distribuye la ponderación proporcionalmente a Listening, Speaking, Reading y Examen.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* Opción 2: Desglose por las 4 competencias institucionales */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                    <div>
                      <label className="input-label" style={{ fontSize: '0.72rem' }}>Listening (Máx. 20 pts)</label>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={editListening}
                        onChange={(e) => setEditListening(Number(e.target.value))}
                        className="input"
                        style={{ fontSize: '0.85rem' }}
                        required
                      />
                    </div>
                    <div>
                      <label className="input-label" style={{ fontSize: '0.72rem' }}>Speaking / Briefing (Máx. 30 pts)</label>
                      <input
                        type="number"
                        min="0"
                        max="30"
                        value={editSpeaking}
                        onChange={(e) => setEditSpeaking(Number(e.target.value))}
                        className="input"
                        style={{ fontSize: '0.85rem' }}
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                    <div>
                      <label className="input-label" style={{ fontSize: '0.72rem' }}>Reading (Máx. 20 pts)</label>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={editReading}
                        onChange={(e) => setEditReading(Number(e.target.value))}
                        className="input"
                        style={{ fontSize: '0.85rem' }}
                        required
                      />
                    </div>
                    <div>
                      <label className="input-label" style={{ fontSize: '0.72rem' }}>Examen Final (Máx. 30 pts)</label>
                      <input
                        type="number"
                        min="0"
                        max="30"
                        value={editExam}
                        onChange={(e) => setEditExam(Number(e.target.value))}
                        className="input"
                        style={{ fontSize: '0.85rem' }}
                        required
                      />
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-surface-elevated)', padding: '0.65rem 0.85rem', borderRadius: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Total Calculado Automáticamente:</span>
                    <strong style={{ fontSize: '1rem', color: 'var(--text-main)' }}>
                      {Number(editListening) + Number(editSpeaking) + Number(editReading) + Number(editExam)} / 100 pts
                    </strong>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.35rem' }}>
                <button type="button" onClick={() => setModalEditar(null)} className="btn btn-secondary" style={{ fontSize: '0.78rem' }}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Save size={14} /> Asentar Nota Oficial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================
          MODAL: ACTA OFICIAL DE CALIFICACIONES CEDMIL (IMPRESIÓN)
      ================================================================= */}
      {modalActaAbierto && (
        <div className="modal-overlay" onClick={() => setModalActaAbierto(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Printer size={16} style={{ color: 'var(--military-gold-primary)' }} />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  Acta Oficial de Calificaciones &bull; CEDMIL
                </h3>
              </div>
              <button onClick={() => setModalActaAbierto(false)} className="btn-icon btn-ghost">
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ textAlign: 'center', borderBottom: '2px solid var(--military-gold-primary)', paddingBottom: '0.75rem' }}>
                <p style={{ fontSize: '0.72rem', letterSpacing: '0.15em', fontWeight: 800, margin: 0 }}>
                  COMANDO GENERAL DEL EJÉRCITO &bull; ESTADO MAYOR ACADÉMICO
                </p>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-main)', margin: '0.2rem 0' }}>
                  ESCUELA DE IDIOMAS DEL EJÉRCITO
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--military-gold-primary)', margin: 0 }}>
                  ACTA DE EVALUACIÓN FINAL - GESTIÓN 2026
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', fontSize: '0.78rem', background: 'var(--bg-surface-elevated)', padding: '0.75rem', borderRadius: 4 }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Curso / Paralelo:</span>
                  <p style={{ fontWeight: 700, margin: 0 }}>{filtroParalelo !== 'TODOS' ? filtroParalelo : 'Consolidado General'}</p>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Idioma:</span>
                  <p style={{ fontWeight: 700, margin: 0 }}>{filtroIdioma !== 'TODOS' ? filtroIdioma : 'Todos los Idiomas'}</p>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Efectivo Evaluado:</span>
                  <p style={{ fontWeight: 700, margin: 0 }}>{evaluados.length} Estudiantes</p>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Promedio General:</span>
                  <p style={{ fontWeight: 700, color: 'var(--status-active)', margin: 0 }}>{promedioGeneral} / 100</p>
                </div>
              </div>

              <div style={{ maxHeight: '180px', overflowY: 'auto', border: '1px solid var(--border-subtle)', borderRadius: 4 }}>
                <table className="table" style={{ margin: 0, fontSize: '0.75rem' }}>
                  <thead>
                    <tr>
                      <th>Estudiante</th>
                      <th>Curso</th>
                      <th style={{ textAlign: 'center' }}>Nota Final</th>
                      <th style={{ textAlign: 'right' }}>Resultado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {evaluados.slice(0, 10).map((est) => {
                      const total = calcularNotaTotal(est) || 0;
                      return (
                        <tr key={est.id}>
                          <td>{est.apellidos}, {est.nombres}</td>
                          <td>{est.paralelo}</td>
                          <td style={{ textAlign: 'center', fontWeight: 700 }}>{total}</td>
                          <td style={{ textAlign: 'right' }}>
                            <span style={{ color: total >= 71 ? 'var(--status-active)' : '#fbbf24', fontWeight: 700 }}>
                              {total >= 71 ? 'APROBADO' : 'REGULAR'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button onClick={() => setModalActaAbierto(false)} className="btn btn-secondary" style={{ fontSize: '0.78rem' }}>
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    showToast('Generando documento PDF oficial para firma del Director EIE...');
                    setModalActaAbierto(false);
                  }}
                  className="btn btn-gold"
                  style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Download size={14} /> Imprimir / Exportar Acta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
