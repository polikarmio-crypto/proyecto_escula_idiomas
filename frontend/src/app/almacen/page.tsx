'use client';

import React, { useState, useMemo } from 'react';
import {
  Package,
  Shield,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Plus,
  ArrowDownRight,
  ArrowUpRight,
  BookOpen,
  DollarSign,
  FileText,
  Truck,
  UserCheck,
  X,
  Printer,
  Sparkles,
  TrendingDown
} from 'lucide-react';

interface LibroInventario {
  id: number;
  codigoIsbn: string;
  titulo: string;
  idioma: string;
  nivel: string;
  editorial: string;
  stockActual: number;
  puntoReorden: number; // ROP
  stockSeguridad: number;
  precioVentaBs: number;
  ubicacionEstante: string;
}

interface MovimientoKardex {
  id: string;
  fecha: string;
  tipo: 'ENTRADA' | 'SALIDA';
  libroTitulo: string;
  cantidad: number;
  referencia: string;
  responsable: string;
}

const LIBROS_INICIALES: LibroInventario[] = [
  {
    id: 1,
    codigoIsbn: 'LIB-ING-001',
    titulo: 'American Headway - Military Edition (Book 1)',
    idioma: 'Inglés Militar',
    nivel: 'Básico A1/A2',
    editorial: 'Oxford / EIE Press',
    stockActual: 14,
    puntoReorden: 25,
    stockSeguridad: 10,
    precioVentaBs: 180,
    ubicacionEstante: 'Estante A-01 / Nivel 2',
  },
  {
    id: 2,
    codigoIsbn: 'LIB-ING-002',
    titulo: 'American Headway - Military Edition (Book 2)',
    idioma: 'Inglés Militar',
    nivel: 'Intermedio B1',
    editorial: 'Oxford / EIE Press',
    stockActual: 38,
    puntoReorden: 20,
    stockSeguridad: 10,
    precioVentaBs: 180,
    ubicacionEstante: 'Estante A-02 / Nivel 2',
  },
  {
    id: 3,
    codigoIsbn: 'LIB-ING-003',
    titulo: 'Campaign: English for the Military (Student Book 3)',
    idioma: 'Inglés Militar',
    nivel: 'Avanzado B2/C1',
    editorial: 'Macmillan Military',
    stockActual: 8,
    puntoReorden: 20,
    stockSeguridad: 8,
    precioVentaBs: 220,
    ubicacionEstante: 'Estante A-03 / Nivel 3',
  },
  {
    id: 4,
    codigoIsbn: 'LIB-FRA-001',
    titulo: 'Nouveau Rond-Point 1 - Français Diplomatique',
    idioma: 'Francés',
    nivel: 'Básico A1/A2',
    editorial: 'Maison des Langues',
    stockActual: 45,
    puntoReorden: 20,
    stockSeguridad: 12,
    precioVentaBs: 190,
    ubicacionEstante: 'Estante B-01 / Nivel 1',
  },
  {
    id: 5,
    codigoIsbn: 'LIB-RUS-001',
    titulo: 'Ruso Técnico para Operaciones Combinadas',
    idioma: 'Ruso',
    nivel: 'Intermedio B1',
    editorial: 'Editorial Militar CEDMIL',
    stockActual: 30,
    puntoReorden: 15,
    stockSeguridad: 8,
    precioVentaBs: 160,
    ubicacionEstante: 'Estante C-01 / Nivel 2',
  },
  {
    id: 6,
    codigoIsbn: 'LIB-MAN-001',
    titulo: 'El Nuevo Libro de Chino Práctico (Vol. 1)',
    idioma: 'Mandarín',
    nivel: 'Básico A1',
    editorial: 'Beijing Language Press',
    stockActual: 34,
    puntoReorden: 15,
    stockSeguridad: 10,
    precioVentaBs: 210,
    ubicacionEstante: 'Estante D-01 / Nivel 1',
  },
  {
    id: 7,
    codigoIsbn: 'LIB-QUE-001',
    titulo: 'Yachay Quechua: Manual Institucional del Ejército',
    idioma: 'Quechua',
    nivel: 'Básico e Intermedio',
    editorial: 'Departamento V de Doctrina',
    stockActual: 62,
    puntoReorden: 25,
    stockSeguridad: 15,
    precioVentaBs: 120,
    ubicacionEstante: 'Estante E-01 / Nivel 1',
  },
];

const HISTORIAL_MOVIMIENTOS: MovimientoKardex[] = [
  {
    id: 'KDX-049',
    fecha: '14 Oct 2026 09:30',
    tipo: 'SALIDA',
    libroTitulo: 'American Headway - Military Edition (Book 1)',
    cantidad: 2,
    referencia: 'Matrícula Cap. Mamani y Subtte. Vargas',
    responsable: 'Sof. René Quisbert',
  },
  {
    id: 'KDX-048',
    fecha: '13 Oct 2026 15:45',
    tipo: 'ENTRADA',
    libroTitulo: 'Yachay Quechua: Manual Institucional',
    cantidad: 50,
    referencia: 'Orden de Compra FF.AA. #2026-118',
    responsable: 'Sgto. 1ro. Edgar Limachi',
  },
  {
    id: 'KDX-047',
    fecha: '12 Oct 2026 11:20',
    tipo: 'SALIDA',
    libroTitulo: 'Nouveau Rond-Point 1',
    cantidad: 3,
    referencia: 'Entrega a Curso Diplomático',
    responsable: 'Sof. René Quisbert',
  },
];

export default function AlmacenPage() {
  const [libros, setLibros] = useState<LibroInventario[]>(LIBROS_INICIALES);
  const [kardex, setKardex] = useState<MovimientoKardex[]>(HISTORIAL_MOVIMIENTOS);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filtroIdioma, setFiltroIdioma] = useState<string>('TODOS');
  const [soloBajoRop, setSoloBajoRop] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Modales
  const [modalIngresoLote, setModalIngresoLote] = useState<boolean>(false);
  const [modalSalidaLibro, setModalSalidaLibro] = useState<boolean>(false);
  const [modalKardex, setModalKardex] = useState<boolean>(false);

  // Form Ingreso Lote
  const [loteLibroId, setLoteLibroId] = useState<number>(1);
  const [loteCantidad, setLoteCantidad] = useState<number>(30);
  const [loteProveedor, setLoteProveedor] = useState<string>('Distribuidora Oxford Bolivia');
  const [loteOrden, setLoteOrden] = useState<string>('O.C. CEDMIL #2026-145');

  // Form Salida Libro
  const [salidaLibroId, setSalidaLibroId] = useState<number>(1);
  const [salidaCantidad, setSalidaCantidad] = useState<number>(1);
  const [salidaBeneficiario, setSalidaBeneficiario] = useState<string>('');
  const [salidaMatricula, setSalidaMatricula] = useState<string>('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const librosFiltrados = useMemo(() => {
    return libros.filter((l) => {
      const matchIdioma = filtroIdioma === 'TODOS' || l.idioma === filtroIdioma;
      const matchRop = !soloBajoRop || l.stockActual <= l.puntoReorden;
      const q = searchTerm.toLowerCase().trim();
      const matchSearch =
        !q ||
        l.titulo.toLowerCase().includes(q) ||
        l.codigoIsbn.toLowerCase().includes(q) ||
        l.idioma.toLowerCase().includes(q) ||
        l.editorial.toLowerCase().includes(q);

      return matchIdioma && matchRop && matchSearch;
    });
  }, [libros, filtroIdioma, soloBajoRop, searchTerm]);

  const librosBajoRop = libros.filter((l) => l.stockActual <= l.puntoReorden);
  const stockTotalUnidades = libros.reduce((acc, l) => acc + l.stockActual, 0);
  const valorTotalInventario = libros.reduce((acc, l) => acc + l.stockActual * l.precioVentaBs, 0);

  const handleGuardarIngresoLote = (e: React.FormEvent) => {
    e.preventDefault();
    const libroTarget = libros.find((l) => l.id === Number(loteLibroId));
    if (!libroTarget) return;

    setLibros((prev) =>
      prev.map((l) =>
        l.id === Number(loteLibroId) ? { ...l, stockActual: l.stockActual + Number(loteCantidad) } : l
      )
    );

    const nuevoMov: MovimientoKardex = {
      id: `KDX-0${kardex.length + 50}`,
      fecha: '14 Oct 2026 10:40',
      tipo: 'ENTRADA',
      libroTitulo: libroTarget.titulo,
      cantidad: Number(loteCantidad),
      referencia: `${loteProveedor} &bull; ${loteOrden}`,
      responsable: 'Oficial de Almacén CEDMIL',
    };

    setKardex([nuevoMov, ...kardex]);
    setModalIngresoLote(false);
    showToast(`Ingreso registrado: +${loteCantidad} unidades de ${libroTarget.titulo}.`);
  };

  const handleGuardarSalida = (e: React.FormEvent) => {
    e.preventDefault();
    if (!salidaBeneficiario) {
      alert('Por favor ingrese el beneficiario.');
      return;
    }

    const libroTarget = libros.find((l) => l.id === Number(salidaLibroId));
    if (!libroTarget) return;

    if (libroTarget.stockActual < Number(salidaCantidad)) {
      alert('Stock insuficiente para realizar esta entrega.');
      return;
    }

    setLibros((prev) =>
      prev.map((l) =>
        l.id === Number(salidaLibroId) ? { ...l, stockActual: l.stockActual - Number(salidaCantidad) } : l
      )
    );

    const nuevoMov: MovimientoKardex = {
      id: `KDX-0${kardex.length + 50}`,
      fecha: '14 Oct 2026 10:42',
      tipo: 'SALIDA',
      libroTitulo: libroTarget.titulo,
      cantidad: Number(salidaCantidad),
      referencia: `Entrega a ${salidaBeneficiario} (${salidaMatricula || 'S/M'})`,
      responsable: 'Sof. René Quisbert',
    };

    setKardex([nuevoMov, ...kardex]);
    setModalSalidaLibro(false);
    showToast(`Entrega registrada: ${salidaCantidad} unidad(es) de ${libroTarget.titulo} a ${salidaBeneficiario}.`);

    setSalidaBeneficiario('');
    setSalidaMatricula('');
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
              <Package size={12} /> Logística y Material Bibliográfico
            </span>
            <span className="badge badge-military">Control ROP</span>
          </div>
          <h1
            className="font-solemn"
            style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '0.02em' }}
          >
            Almacén de Libros y Textos de Idiomas
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Inventario general, reposición estratégica bajo Punto de Reorden (ROP) y kardex de entregas académicas.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setModalKardex(true)}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
          >
            <FileText size={15} />
            <span>Kardex de Movimientos</span>
          </button>

          <button
            onClick={() => setModalSalidaLibro(true)}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
          >
            <ArrowUpRight size={15} style={{ color: '#fbbf24' }} />
            <span>Entrega a Alumno</span>
          </button>

          <button
            onClick={() => setModalIngresoLote(true)}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
          >
            <Plus size={15} />
            <span>Ingreso de Lote</span>
          </button>
        </div>
      </div>

      {/* Alerta de Punto de Reorden ROP si existen libros críticos */}
      {librosBajoRop.length > 0 && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
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
                background: 'rgba(239, 68, 68, 0.2)',
                color: '#f87171',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AlertTriangle size={20} />
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: '0.92rem', color: '#f87171' }}>
                ALERTA INSTITUCIONAL DE STOCK CRÍTICO (ROP)
              </p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-main)', marginTop: '0.15rem' }}>
                Existen <strong>{librosBajoRop.length} títulos</strong> con stock igual o inferior al Punto de Reorden ({librosBajoRop.map((l) => l.titulo).join(', ')}).
              </p>
            </div>
          </div>

          <button
            onClick={() => setSoloBajoRop(!soloBajoRop)}
            className="btn btn-primary"
            style={{
              padding: '0.35rem 0.8rem',
              fontSize: '0.75rem',
              background: '#b91c1c',
              borderColor: '#b91c1c',
            }}
          >
            {soloBajoRop ? 'Ver Todo el Inventario' : 'Filtrar Solo Críticos'}
          </button>
        </div>
      )}

      {/* KPI Cards de Almacén */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
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
              Títulos en Catálogo
            </p>
            <p style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {libros.length} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>títulos</span>
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
            <Package size={22} />
          </div>
          <div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Unidades en Depósito
            </p>
            <p style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {stockTotalUnidades} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>libros</span>
            </p>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 6,
              background: 'rgba(239, 68, 68, 0.12)',
              color: '#f87171',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(239, 68, 68, 0.3)',
            }}
          >
            <TrendingDown size={22} />
          </div>
          <div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Títulos Bajo ROP
            </p>
            <p style={{ fontSize: '1.45rem', fontWeight: 800, color: '#f87171' }}>
              {librosBajoRop.length} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>críticos</span>
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
            <DollarSign size={22} />
          </div>
          <div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Valoración Depósito
            </p>
            <p style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--military-gold-primary)' }}>
              Bs. {valorTotalInventario.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Filtros y Tabla Principal de Inventario */}
      <div className="card" style={{ padding: '1.25rem' }}>
        
        {/* Barra de Filtros */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '360px' }}>
            <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Buscar por título, código ISBN o idioma..."
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
              <option value="Inglés Militar">Inglés Militar</option>
              <option value="Francés">Francés</option>
              <option value="Ruso">Ruso</option>
              <option value="Mandarín">Mandarín</option>
              <option value="Quechua">Quechua</option>
            </select>

            <button
              onClick={() => setSoloBajoRop(!soloBajoRop)}
              className={`btn ${soloBajoRop ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.78rem' }}
            >
              <AlertTriangle size={14} />
              <span>Solo Bajo ROP</span>
            </button>
          </div>
        </div>

        {/* Tabla de Material Bibliográfico */}
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Código & Título</th>
                <th>Idioma / Nivel</th>
                <th style={{ textAlign: 'center' }}>Stock Actual</th>
                <th style={{ textAlign: 'center' }}>Punto Reorden (ROP)</th>
                <th>Ubicación</th>
                <th style={{ textAlign: 'center' }}>Precio Oficial</th>
                <th style={{ textAlign: 'center' }}>Estado ROP</th>
                <th style={{ textAlign: 'right' }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {librosFiltrados.map((libro) => {
                const esCritico = libro.stockActual <= libro.puntoReorden;
                return (
                  <tr key={libro.id}>
                    <td>
                      <div>
                        <p style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.88rem' }}>
                          {libro.titulo}
                        </p>
                        <p style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: 'var(--military-gold-primary)' }}>
                          {libro.codigoIsbn} &bull; Editorial: {libro.editorial}
                        </p>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        {libro.idioma}
                      </span>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{libro.nivel}</p>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span
                        style={{
                          fontSize: '1.05rem',
                          fontWeight: 800,
                          color: esCritico ? '#f87171' : 'var(--text-main)',
                        }}
                      >
                        {libro.stockActual}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}> unids</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                        {libro.puntoReorden} unids
                      </span>
                      <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                        Seguridad: {libro.stockSeguridad}
                      </p>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {libro.ubicacionEstante}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--military-gold-primary)' }}>
                      Bs. {libro.precioVentaBs}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {esCritico ? (
                        <span className="badge badge-red" style={{ fontSize: '0.68rem' }}>
                          <AlertTriangle size={10} /> REORDEN
                        </span>
                      ) : (
                        <span className="badge badge-military" style={{ fontSize: '0.68rem' }}>
                          ÓPTIMO
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => {
                          setSalidaLibroId(libro.id);
                          setModalSalidaLibro(true);
                        }}
                        className="btn btn-secondary"
                        style={{ padding: '0.3rem 0.65rem', fontSize: '0.72rem' }}
                      >
                        Entregar
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
          MODAL DE INGRESO DE LOTE (KARDEX DE ENTRADA)
      ================================================================= */}
      {modalIngresoLote && (
        <div className="modal-overlay" onClick={() => setModalIngresoLote(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Truck size={18} style={{ color: 'var(--military-gold-primary)' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Registrar Ingreso de Lote Bibliográfico
                </h3>
              </div>
              <button onClick={() => setModalIngresoLote(false)} className="btn-icon btn-ghost">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleGuardarIngresoLote} style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="input-label">Texto / Material a Ingresar *</label>
                <select
                  value={loteLibroId}
                  onChange={(e) => setLoteLibroId(Number(e.target.value))}
                  className="input"
                >
                  {libros.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.titulo} (Stock actual: {l.stockActual})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label className="input-label">Cantidad Recibida (Unids) *</label>
                  <input
                    type="number"
                    min="1"
                    value={loteCantidad}
                    onChange={(e) => setLoteCantidad(Number(e.target.value))}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="input-label">N° Orden Militar / Factura *</label>
                  <input
                    type="text"
                    value={loteOrden}
                    onChange={(e) => setLoteOrden(e.target.value)}
                    className="input"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="input-label">Proveedor / Editorial *</label>
                <input
                  type="text"
                  value={loteProveedor}
                  onChange={(e) => setLoteProveedor(e.target.value)}
                  className="input"
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setModalIngresoLote(false)} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Plus size={15} />
                  <span>Confirmar Ingreso al Depósito</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================
          MODAL DE ENTREGA A ALUMNO (SALIDA DE ALMACÉN)
      ================================================================= */}
      {modalSalidaLibro && (
        <div className="modal-overlay" onClick={() => setModalSalidaLibro(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <ArrowUpRight size={18} style={{ color: 'var(--military-gold-primary)' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Entrega de Material a Estudiante
                </h3>
              </div>
              <button onClick={() => setModalSalidaLibro(false)} className="btn-icon btn-ghost">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleGuardarSalida} style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="input-label">Texto a Entregar</label>
                <select
                  value={salidaLibroId}
                  onChange={(e) => setSalidaLibroId(Number(e.target.value))}
                  className="input"
                >
                  {libros.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.titulo} — Disp: {l.stockActual} unids
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="input-label">Nombre del Beneficiario / Alumno *</label>
                <input
                  type="text"
                  value={salidaBeneficiario}
                  onChange={(e) => setSalidaBeneficiario(e.target.value)}
                  placeholder="Ej. Cap. Carlos Mamani / Sof. Limachi"
                  className="input"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label className="input-label">Código de Matrícula</label>
                  <input
                    type="text"
                    value={salidaMatricula}
                    onChange={(e) => setSalidaMatricula(e.target.value)}
                    placeholder="Ej. EIE-2026-0041"
                    className="input"
                  />
                </div>

                <div>
                  <label className="input-label">Cantidad a Entregar</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={salidaCantidad}
                    onChange={(e) => setSalidaCantidad(Number(e.target.value))}
                    className="input"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setModalSalidaLibro(false)} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <CheckCircle2 size={15} />
                  <span>Registrar Entrega</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================
          MODAL DE KARDEX Y MOVIMIENTOS
      ================================================================= */}
      {modalKardex && (
        <div className="modal-overlay" onClick={() => setModalKardex(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <FileText size={18} style={{ color: 'var(--military-gold-primary)' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Kardex Oficial de Movimientos de Depósito
                </h3>
              </div>
              <button onClick={() => setModalKardex(false)} className="btn-icon btn-ghost">
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '1.25rem' }}>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Código / Fecha</th>
                      <th>Tipo</th>
                      <th>Libro</th>
                      <th style={{ textAlign: 'center' }}>Cantidad</th>
                      <th>Referencia / Responsable</th>
                    </tr>
                  </thead>
                  <tbody>
                    {kardex.map((k) => (
                      <tr key={k.id}>
                        <td>
                          <div>
                            <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-main)' }}>
                              {k.id}
                            </span>
                            <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{k.fecha}</p>
                          </div>
                        </td>
                        <td>
                          <span
                            className={k.tipo === 'ENTRADA' ? 'badge badge-military' : 'badge badge-gold'}
                            style={{ fontSize: '0.68rem' }}
                          >
                            {k.tipo}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>
                            {k.libroTitulo}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center', fontWeight: 800, color: k.tipo === 'ENTRADA' ? 'var(--status-active)' : '#fbbf24' }}>
                          {k.tipo === 'ENTRADA' ? `+${k.cantidad}` : `-${k.cantidad}`}
                        </td>
                        <td>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-main)' }}>{k.referencia}</p>
                          <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Resp: {k.responsable}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button onClick={() => setModalKardex(false)} className="btn btn-secondary">
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
