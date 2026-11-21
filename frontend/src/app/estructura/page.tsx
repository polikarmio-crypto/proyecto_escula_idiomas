'use client';

import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Layers,
  BookOpen,
  Plus,
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
  ChevronRight,
  FolderTree,
  RefreshCw
} from 'lucide-react';
import { useAuthRole } from '@/context/AuthRoleContext';

export default function EstructuraAcademicaPage() {
  const { esJefeAcademico, esAdmin, rolConfig } = useAuthRole();
  const puedeGestionar = esJefeAcademico || esAdmin;

  const [loading, setLoading] = useState(false);
  const [programas, setProgramas] = useState<any[]>([]);
  const [idiomas, setIdiomas] = useState<any[]>([]);
  const [tiposPrograma, setTiposPrograma] = useState<any[]>([]);
  const [alerta, setAlerta] = useState<{ tipo: 'ok' | 'error'; mensaje: string } | null>(null);

  const [programaSeleccionado, setProgramaSeleccionado] = useState<any | null>(null);
  const [nivelSeleccionado, setNivelSeleccionado] = useState<any | null>(null);

  const [formProg, setFormProg] = useState({
    nombre: '',
    id_idioma: '',
    id_tipo_programa: '',
    duracion: 1,
  });
  const [formNivel, setFormNivel] = useState({
    numero: 1,
    nombre: '',
    cantidad_libros: 6,
  });
  const [formLibro, setFormLibro] = useState({
    numero: 1,
    nombre: '',
  });

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [resProg, resCat] = await Promise.all([
        fetch('/api/v1/estructura/programas'),
        fetch('/api/v1/catalogos'),
      ]);
      if (resProg.ok) {
        const dataProg = await resProg.json();
        setProgramas(dataProg || []);
        if (dataProg.length > 0 && !programaSeleccionado) {
          setProgramaSeleccionado(dataProg[0]);
          if (dataProg[0].niveles?.length > 0) {
            setNivelSeleccionado(dataProg[0].niveles[0]);
          }
        }
      }
      if (resCat.ok) {
        const dataCat = await resCat.json();
        setIdiomas(dataCat.idiomas || []);
        setTiposPrograma(dataCat.tipos_programa || []);
        if (dataCat.idiomas?.length > 0) setFormProg((f) => ({ ...f, id_idioma: dataCat.idiomas[0].id_idioma }));
        if (dataCat.tipos_programa?.length > 0) setFormProg((f) => ({ ...f, id_tipo_programa: dataCat.tipos_programa[0].id_tipo_programa }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const mostrarMensaje = (tipo: 'ok' | 'error', mensaje: string) => {
    setAlerta({ tipo, mensaje });
    setTimeout(() => setAlerta(null), 6000);
  };

  const handleCrearPrograma = async (e: React.FormEvent) => {
    e.preventDefault();
    const nombreTrimmed = formProg.nombre.trim();
    if (nombreTrimmed.length < 3) {
      mostrarMensaje('error', 'El nombre del programa debe tener al menos 3 caracteres significativos.');
      return;
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s\-\.]+$/.test(nombreTrimmed)) {
      mostrarMensaje('error', 'El nombre del programa solo puede contener letras, números, espacios y guiones.');
      return;
    }
    try {
      const res = await fetch('/api/v1/estructura/programas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre_programa: nombreTrimmed,
          id_idioma: formProg.id_idioma,
          id_tipo_programa: formProg.id_tipo_programa,
          duracion_anios_programa: formProg.duracion,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al crear programa');
      mostrarMensaje('ok', data.message);
      setFormProg({ ...formProg, nombre: '' });
      cargarDatos();
    } catch (err: any) {
      mostrarMensaje('error', err.message);
    }
  };

  const handleCrearNivel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!programaSeleccionado) return;
    const nombreNivelTrimmed = formNivel.nombre.trim();
    if (nombreNivelTrimmed.length < 3) {
      mostrarMensaje('error', 'El nombre del nivel debe tener al menos 3 caracteres.');
      return;
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s\/\-\.]+$/.test(nombreNivelTrimmed)) {
      mostrarMensaje('error', 'El nombre del nivel solo puede contener letras, números, barras y guiones.');
      return;
    }
    try {
      const res = await fetch('/api/v1/estructura/niveles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_programa: programaSeleccionado.id_programa,
          numero_nivel: formNivel.numero,
          nombre_nivel: nombreNivelTrimmed,
          cantidad_libros_nivel: formNivel.cantidad_libros,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al crear nivel');
      mostrarMensaje('ok', data.message);
      setFormNivel({ numero: formNivel.numero + 1, nombre: '', cantidad_libros: 6 });
      cargarDatos();
    } catch (err: any) {
      mostrarMensaje('error', err.message);
    }
  };

  const handleCrearLibro = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nivelSeleccionado) return;
    const nombreLibroTrimmed = formLibro.nombre.trim();
    if (nombreLibroTrimmed.length < 3) {
      mostrarMensaje('error', 'El título del libro debe tener al menos 3 caracteres.');
      return;
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s\/\-\.\(\)]+$/.test(nombreLibroTrimmed)) {
      mostrarMensaje('error', 'El título del libro contiene caracteres inválidos.');
      return;
    }
    try {
      const res = await fetch('/api/v1/estructura/libros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_nivel: nivelSeleccionado.id_nivel,
          numero_libro: formLibro.numero,
          nombre_libro: nombreLibroTrimmed,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al asignar libro');
      mostrarMensaje('ok', data.message);
      setFormLibro({ numero: formLibro.numero + 1, nombre: '' });
      cargarDatos();
    } catch (err: any) {
      mostrarMensaje('error', err.message);
    }
  };

  if (!puedeGestionar) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-[var(--bg-card)] border border-red-500/40 rounded-[3px] p-8 text-center space-y-4 shadow-xs">
          <ShieldAlert className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto" />
          <h2 className="text-xl font-bold text-[var(--text-main)] font-sans">Acceso Restringido</h2>
          <p className="text-xs text-[var(--text-muted)] max-w-xl mx-auto">
            La creación de la malla curricular, niveles y asignación de libros corresponde exclusivamente al{' '}
            <strong className="text-[var(--color-accent)] font-mono">Jefe Académico</strong>.
            Rol activo: <span className="px-2 py-0.5 rounded bg-[var(--bg-surface)] text-[var(--color-accent)] font-mono font-bold">{rolConfig.titulo}</span>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col min-h-0 overflow-hidden bg-[var(--bg-base)] text-[var(--text-main)]">
      {/* 1. FRANJA SUPERIOR COMPACTA (44px) */}
      <div className="strip-utility-bar">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[var(--military-green-subtle)] border border-[var(--border-accent)] text-[var(--military-green-primary)] dark:text-[var(--military-gold-primary)] font-mono text-[11px] font-bold shrink-0">
            <FolderTree className="w-3.5 h-3.5" />
            <span>SACA / Estructura Curricular</span>
          </div>

          <div className="h-4 w-[1px] bg-[var(--border-fine)] shrink-0" />

          <span className="text-xs font-bold text-[var(--text-main)] truncate hidden sm:inline">
            Planes de Estudio • Niveles • Libros de Texto
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={cargarDatos}
            disabled={loading}
            className="btn btn-secondary"
            style={{ padding: '0.2rem 0.55rem', fontSize: '0.70rem', height: '28px' }}
            title="Sincronizar Malla"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Sincronizar</span>
          </button>
        </div>
      </div>

      {alerta && (
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded mb-2 text-xs font-semibold shrink-0 border ${
            alerta.tipo === 'ok'
              ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
              : 'bg-red-950/20 border-red-500/40 text-red-600 dark:text-red-400'
          }`}
        >
          {alerta.tipo === 'ok' ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 shrink-0" />}
          <span>{alerta.mensaje}</span>
        </div>
      )}

      {/* 2. ÁREA DE 3 COLUMNAS EN CASCADA (100% CERO SCROLL EXTERNO) */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-2.5 p-2 overflow-hidden">
        {/* Columna 1: Programas de Idioma */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-fine)] rounded-[2px] p-3 flex flex-col justify-between shadow-xs overflow-hidden">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border-fine)] shrink-0">
            <h3 className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider flex items-center gap-1.5 font-sans">
              <GraduationCap className="w-3.5 h-3.5 text-[var(--color-accent)]" />
              1. Programas ({programas.length})
            </h3>
            <span className="text-[10px] font-mono text-[var(--text-muted)]">Paso 1</span>
          </div>

          <form onSubmit={handleCrearPrograma} className="my-2 p-2 rounded-[2px] bg-[var(--bg-surface)] border border-[var(--border-fine)] space-y-1.5 text-xs shrink-0">
            <input
              type="text"
              placeholder="Nombre programa (ej: Inglés Militar)"
              value={formProg.nombre}
              onChange={(e) => setFormProg({ ...formProg, nombre: e.target.value })}
              className="w-full bg-[var(--bg-card)] border border-[var(--border-fine)] rounded px-2 py-1 text-xs text-[var(--text-main)] outline-none"
              required
              minLength={3}
            />
            <div className="grid grid-cols-2 gap-1.5">
              <select
                value={formProg.id_idioma}
                onChange={(e) => setFormProg({ ...formProg, id_idioma: e.target.value })}
                className="bg-[var(--bg-card)] border border-[var(--border-fine)] rounded px-1.5 py-1 text-xs text-[var(--text-main)] outline-none"
              >
                {idiomas.map((i) => (
                  <option key={i.id_idioma} value={i.id_idioma}>{i.nombre_idioma}</option>
                ))}
              </select>
              <select
                value={formProg.id_tipo_programa}
                onChange={(e) => setFormProg({ ...formProg, id_tipo_programa: e.target.value })}
                className="bg-[var(--bg-card)] border border-[var(--border-fine)] rounded px-1.5 py-1 text-xs text-[var(--text-main)] outline-none"
              >
                {tiposPrograma.map((tp) => (
                  <option key={tp.id_tipo_programa} value={tp.id_tipo_programa}>{tp.nombre_tipo_programa}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="w-full py-1 btn btn-primary rounded text-xs font-bold"
            >
              + Crear Programa
            </button>
          </form>

          <div className="flex-1 min-h-0 overflow-y-auto space-y-1.5 pr-1">
            {programas.map((p) => {
              const selected = programaSeleccionado?.id_programa === p.id_programa;
              return (
                <div
                  key={p.id_programa}
                  onClick={() => {
                    setProgramaSeleccionado(p);
                    setNivelSeleccionado(p.niveles?.[0] || null);
                  }}
                  className={`p-2 rounded-[2px] border cursor-pointer transition flex items-center justify-between text-xs ${
                    selected
                      ? 'bg-[var(--bg-surface)] border-[var(--color-accent)] ring-1 ring-[var(--color-accent)]/50'
                      : 'bg-[var(--bg-card)] border-[var(--border-fine)] hover:border-[var(--color-accent)]'
                  }`}
                >
                  <div className="min-w-0 pr-1">
                    <h4 className="font-bold text-[var(--text-main)] truncate">{p.nombre_programa}</h4>
                    <p className="text-[10.5px] text-[var(--text-muted)] truncate">
                      {p.idioma?.nombre_idioma} • {p.tipo_programa?.nombre_tipo_programa || p.tipoPrograma?.nombre_tipo_programa}
                    </p>
                    <span className="text-[10px] text-[var(--color-accent)] font-mono font-bold">
                      {p.niveles?.length || 0} niveles configurados
                    </span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${selected ? 'text-[var(--color-accent)]' : 'text-[var(--text-muted)]'}`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Columna 2: Niveles Curriculares */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-fine)] rounded-[2px] p-3 flex flex-col justify-between shadow-xs overflow-hidden">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border-fine)] shrink-0">
            <h3 className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider flex items-center gap-1.5 font-sans truncate">
              <Layers className="w-3.5 h-3.5 text-emerald-500" />
              2. Niveles: <span className="text-[var(--color-accent)] truncate max-w-[120px]">{programaSeleccionado?.nombre_programa || '—'}</span>
            </h3>
            <span className="text-[10px] font-mono text-[var(--text-muted)]">Paso 2</span>
          </div>

          {programaSeleccionado ? (
            <>
              <form onSubmit={handleCrearNivel} className="my-2 p-2 rounded-[2px] bg-[var(--bg-surface)] border border-[var(--border-fine)] space-y-1.5 text-xs shrink-0">
                <div className="grid grid-cols-2 gap-1.5">
                  <input
                    type="number"
                    min="1"
                    placeholder="N° Nivel"
                    value={formNivel.numero}
                    onChange={(e) => setFormNivel({ ...formNivel, numero: parseInt(e.target.value) || 1 })}
                    className="bg-[var(--bg-card)] border border-[var(--border-fine)] rounded px-2 py-1 text-xs text-[var(--text-main)] font-mono"
                    required
                  />
                  <input
                    type="number"
                    min="1"
                    placeholder="Cant. Libros"
                    value={formNivel.cantidad_libros}
                    onChange={(e) => setFormNivel({ ...formNivel, cantidad_libros: parseInt(e.target.value) || 6 })}
                    className="bg-[var(--bg-card)] border border-[var(--border-fine)] rounded px-2 py-1 text-xs text-[var(--text-main)] font-mono"
                    required
                  />
                </div>
                <input
                  type="text"
                  placeholder="Nombre nivel (ej: Básico 1 / Nivel 1)"
                  value={formNivel.nombre}
                  onChange={(e) => setFormNivel({ ...formNivel, nombre: e.target.value })}
                  className="w-full bg-[var(--bg-card)] border border-[var(--border-fine)] rounded px-2 py-1 text-xs text-[var(--text-main)] outline-none"
                  required
                  minLength={3}
                />
                <button
                  type="submit"
                  className="w-full py-1 btn btn-primary rounded text-xs font-bold"
                >
                  + Añadir Nivel Secuencial
                </button>
              </form>

              <div className="flex-1 min-h-0 overflow-y-auto space-y-1.5 pr-1">
                {(programaSeleccionado.niveles || []).map((n: any) => {
                  const selected = nivelSeleccionado?.id_nivel === n.id_nivel;
                  return (
                    <div
                      key={n.id_nivel}
                      onClick={() => setNivelSeleccionado(n)}
                      className={`p-2 rounded-[2px] border cursor-pointer transition flex items-center justify-between text-xs ${
                        selected
                          ? 'bg-[var(--bg-surface)] border-emerald-500 ring-1 ring-emerald-500/50'
                          : 'bg-[var(--bg-card)] border-[var(--border-fine)] hover:border-emerald-500/50'
                      }`}
                    >
                      <div className="min-w-0 pr-1">
                        <h4 className="font-bold text-[var(--text-main)] truncate">
                          Nivel {n.numero_nivel}: {n.nombre_nivel}
                        </h4>
                        <p className="text-[10.5px] text-[var(--text-muted)] font-mono truncate">
                          {n.libros?.length || 0} de {n.cantidad_libros_nivel} libros asignados
                        </p>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${selected ? 'text-emerald-500' : 'text-[var(--text-muted)]'}`} />
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-[var(--text-muted)] font-mono">
              Seleccione un programa a la izquierda.
            </div>
          )}
        </div>

        {/* Columna 3: Libros de Texto Asignados */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-fine)] rounded-[2px] p-3 flex flex-col justify-between shadow-xs overflow-hidden">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border-fine)] shrink-0">
            <h3 className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider flex items-center gap-1.5 font-sans truncate">
              <BookOpen className="w-3.5 h-3.5 text-purple-500" />
              3. Libros: <span className="text-emerald-600 dark:text-emerald-400 truncate max-w-[120px]">{nivelSeleccionado?.nombre_nivel || '—'}</span>
            </h3>
            <span className="text-[10px] font-mono text-[var(--text-muted)]">Paso 3</span>
          </div>

          {nivelSeleccionado ? (
            <>
              <form onSubmit={handleCrearLibro} className="my-2 p-2 rounded-[2px] bg-[var(--bg-surface)] border border-[var(--border-fine)] space-y-1.5 text-xs shrink-0">
                <div className="grid grid-cols-3 gap-1.5">
                  <input
                    type="number"
                    min="1"
                    placeholder="N°"
                    value={formLibro.numero}
                    onChange={(e) => setFormLibro({ ...formLibro, numero: parseInt(e.target.value) || 1 })}
                    className="bg-[var(--bg-card)] border border-[var(--border-fine)] rounded px-2 py-1 text-xs text-[var(--text-main)] font-mono"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Título (ej: Book 1)"
                    value={formLibro.nombre}
                    onChange={(e) => setFormLibro({ ...formLibro, nombre: e.target.value })}
                    className="col-span-2 bg-[var(--bg-card)] border border-[var(--border-fine)] rounded px-2 py-1 text-xs text-[var(--text-main)] outline-none"
                    required
                    minLength={3}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-1 btn btn-primary rounded text-xs font-bold"
                >
                  + Asignar Libro al Nivel
                </button>
              </form>

              <div className="flex-1 min-h-0 overflow-y-auto space-y-1.5 pr-1">
                {(nivelSeleccionado.libros || []).map((lib: any) => (
                  <div
                    key={lib.id_libro}
                    className="p-2 rounded-[2px] border border-[var(--border-fine)] bg-[var(--bg-surface)] flex items-center justify-between text-xs font-mono"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-4 h-4 rounded-[1px] bg-purple-950/40 text-purple-400 border border-purple-500/30 flex items-center justify-center font-mono text-[9.5px] font-bold shrink-0">
                        {lib.numero_libro}
                      </span>
                      <span className="font-semibold text-[var(--text-main)] font-sans truncate">{lib.nombre_libro}</span>
                    </div>
                  </div>
                ))}
                {(nivelSeleccionado.libros || []).length === 0 && (
                  <p className="text-xs text-[var(--text-muted)] p-4 text-center font-mono">
                    No hay libros asignados aún a este nivel.
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-[var(--text-muted)] font-mono">
              Seleccione un nivel al medio.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
