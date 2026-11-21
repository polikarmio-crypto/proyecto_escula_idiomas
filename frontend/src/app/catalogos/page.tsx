'use client';

import React, { useState, useEffect } from 'react';
import {
  Database,
  Calendar,
  Languages,
  DoorOpen,
  Clock,
  Layers,
  CreditCard,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
  Edit,
  Save,
  X,
  RefreshCw,
  Power
} from 'lucide-react';
import { useAuthRole } from '@/context/AuthRoleContext';

type TabCat = 'gestiones' | 'idiomas' | 'aulas' | 'horarios' | 'tipos_programa' | 'tipos_pago';

export default function CatalogosPage() {
  const { esAdmin, rolConfig } = useAuthRole();
  const [tab, setTab] = useState<TabCat>('gestiones');
  const [loading, setLoading] = useState(false);
  const [alerta, setAlerta] = useState<{ tipo: 'ok' | 'error'; mensaje: string } | null>(null);

  const [gestiones, setGestiones] = useState<any[]>([]);
  const [idiomas, setIdiomas] = useState<any[]>([]);
  const [aulas, setAulas] = useState<any[]>([]);
  const [horarios, setHorarios] = useState<any[]>([]);
  const [tiposPrograma, setTiposPrograma] = useState<any[]>([]);
  const [modalidades, setModalidades] = useState<any[]>([]);
  const [tiposPago, setTiposPago] = useState<any[]>([]);

  const [formGestion, setFormGestion] = useState({ anio: new Date().getFullYear(), estado: 'Activa' });
  const [formIdioma, setFormIdioma] = useState({ nombre: '' });
  const [formAula, setFormAula] = useState({ nombre: '', capacidad: 30 });
  const [formHorario, setFormHorario] = useState({ inicio: '08:00', fin: '09:30' });
  const [formTipoProg, setFormTipoProg] = useState({ nombre: '' });
  const [formTipoPago, setFormTipoPago] = useState({ nombre: '' });

  // Modal de confirmación de baja lógica
  const [modalConfirmar, setModalConfirmar] = useState<{ ruta: string; id: number; nombre: string } | null>(null);
  // Modal de edición inline
  const [modalEditar, setModalEditar] = useState<{ ruta: string; id: number; datos: any } | null>(null);
  const [formEditar, setFormEditar] = useState<any>({});
  const [errValidacion, setErrValidacion] = useState('');

  const cargarCatalogos = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/catalogos');
      if (res.ok) {
        const data = await res.json();
        setGestiones(data.gestiones || []);
        setIdiomas(data.idiomas || []);
        setAulas(data.aulas || []);
        setHorarios(data.horarios || []);
        setTiposPrograma(data.tipos_programa || []);
        setModalidades(data.modalidades || []);
        setTiposPago(data.tipos_pago || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCatalogos();
  }, []);

  const mostrarMensaje = (tipo: 'ok' | 'error', mensaje: string) => {
    setAlerta({ tipo, mensaje });
    setTimeout(() => setAlerta(null), 5000);
  };

  const handleCrearGestion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/catalogos/gestiones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ anio_gestion: formGestion.anio, estado_gestion: formGestion.estado }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al crear gestión');
      mostrarMensaje('ok', data.message);
      cargarCatalogos();
    } catch (err: any) {
      mostrarMensaje('error', err.message);
    }
  };

  const handleCrearIdioma = async (e: React.FormEvent) => {
    e.preventDefault();
    const nombre = formIdioma.nombre.trim();
    if (nombre.length < 3 || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(nombre)) {
      mostrarMensaje('error', 'El nombre del idioma debe tener al menos 3 letras y solo contener caracteres alfabéticos.');
      return;
    }
    try {
      const res = await fetch('/api/v1/catalogos/idiomas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre_idioma: formIdioma.nombre }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error.');
      mostrarMensaje('ok', data.message);
      setFormIdioma({ nombre: '' });
      cargarCatalogos();
    } catch (err: any) {
      mostrarMensaje('error', err.message);
    }
  };

  const handleCrearAula = async (e: React.FormEvent) => {
    e.preventDefault();
    const nombre = formAula.nombre.trim();
    if (nombre.length < 2) {
      mostrarMensaje('error', 'El nombre del aula debe tener al menos 2 caracteres.');
      return;
    }
    try {
      const res = await fetch('/api/v1/catalogos/aulas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre_aula: formAula.nombre, capacidad_aula: formAula.capacidad }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al crear aula.');
      mostrarMensaje('ok', data.message || 'Aula registrada.');
      setFormAula({ nombre: '', capacidad: 30 });
      cargarCatalogos();
    } catch (err: any) {
      mostrarMensaje('error', err.message);
    }
  };

  const handleCrearHorario = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/catalogos/horarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hora_inicio_horario: formHorario.inicio, hora_fin_horario: formHorario.fin }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al registrar franja horaria.');
      mostrarMensaje('ok', data.message || 'Horario registrado.');
      cargarCatalogos();
    } catch (err: any) {
      mostrarMensaje('error', err.message);
    }
  };

  const handleCrearTipoPrograma = async (e: React.FormEvent) => {
    e.preventDefault();
    const nombre = formTipoProg.nombre.trim();
    if (nombre.length < 3 || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(nombre)) {
      mostrarMensaje('error', 'El tipo de programa debe tener al menos 3 letras.');
      return;
    }
    try {
      const res = await fetch('/api/v1/catalogos/tipos-programa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre_tipo_programa: formTipoProg.nombre }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error.');
      mostrarMensaje('ok', data.message);
      setFormTipoProg({ nombre: '' });
      cargarCatalogos();
    } catch (err: any) {
      mostrarMensaje('error', err.message);
    }
  };

  const handleCrearTipoPago = async (e: React.FormEvent) => {
    e.preventDefault();
    const nombre = formTipoPago.nombre.trim();
    if (nombre.length < 3) {
      mostrarMensaje('error', 'El concepto de pago debe tener al menos 3 caracteres.');
      return;
    }
    try {
      const res = await fetch('/api/v1/catalogos/tipos-pago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre_tipo_pago: formTipoPago.nombre }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error.');
      mostrarMensaje('ok', data.message);
      setFormTipoPago({ nombre: '' });
      cargarCatalogos();
    } catch (err: any) {
      mostrarMensaje('error', err.message);
    }
  };

  const abrirConfirmarBaja = (ruta: string, id: number, nombre: string) => {
    setModalConfirmar({ ruta, id, nombre });
  };

  const confirmarBajaLogica = async () => {
    if (!modalConfirmar) return;
    try {
      const res = await fetch(`/api/v1/catalogos/${modalConfirmar.ruta}/${modalConfirmar.id}/baja-logica`, {
        method: 'PATCH',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al cambiar estado.');
      mostrarMensaje('ok', data.message || 'Estado actualizado.');
      cargarCatalogos();
    } catch (err: any) {
      mostrarMensaje('error', err.message);
    } finally {
      setModalConfirmar(null);
    }
  };

  const abrirEditar = (ruta: string, id: number, datos: any) => {
    setModalEditar({ ruta, id, datos });
    setFormEditar({ ...datos });
    setErrValidacion('');
  };

  const guardarEdicion = async () => {
    if (!modalEditar) return;
    const nombre = formEditar.nombre_idioma || formEditar.nombre_aula || formEditar.nombre_tipo_programa || formEditar.nombre_tipo_pago || '';
    if (nombre && nombre.trim().length < 3) {
      setErrValidacion('El nombre debe tener al menos 3 caracteres.');
      return;
    }
    try {
      const res = await fetch(`/api/v1/catalogos/${modalEditar.ruta}/${modalEditar.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formEditar),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al actualizar registro.');
      mostrarMensaje('ok', data.message || 'Registro actualizado.');
      setModalEditar(null);
      cargarCatalogos();
    } catch (err: any) {
      setErrValidacion(err.message);
    }
  };

  if (!esAdmin) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-[var(--bg-card)] border border-red-500/40 rounded-[3px] p-8 text-center space-y-4 shadow-xs">
          <ShieldAlert className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto" />
          <h2 className="text-xl font-bold text-[var(--text-main)] font-sans">Acceso Restringido</h2>
          <p className="text-xs text-[var(--text-muted)] max-w-xl mx-auto">
            La parametrización y configuración de catálogos base corresponde a la <strong className="text-[var(--color-accent)] font-mono">Administración General</strong>.
          </p>
        </div>
      </div>
    );
  }

  const tabsInfo = [
    { id: 'gestiones', label: 'Gestiones', icon: Calendar, count: gestiones.length, ruta: 'gestiones' },
    { id: 'idiomas', label: 'Idiomas', icon: Languages, count: idiomas.length, ruta: 'idiomas' },
    { id: 'aulas', label: 'Aulas', icon: DoorOpen, count: aulas.length, ruta: 'aulas' },
    { id: 'horarios', label: 'Horarios', icon: Clock, count: horarios.length, ruta: 'horarios' },
    { id: 'tipos_programa', label: 'Programas', icon: Layers, count: tiposPrograma.length, ruta: 'tipos-programa' },
    { id: 'tipos_pago', label: 'Aranceles', icon: CreditCard, count: tiposPago.length, ruta: 'tipos-pago' },
  ];

  return (
    <div className="h-full flex flex-col min-h-0 overflow-hidden bg-[var(--bg-base)] text-[var(--text-main)]">
      {/* 1. FRANJA SUPERIOR COMPACTA (44px) */}
      <div className="strip-utility-bar">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[var(--military-green-subtle)] border border-[var(--border-accent)] text-[var(--military-green-primary)] dark:text-[var(--military-gold-primary)] font-mono text-[11px] font-bold shrink-0">
            <Database className="w-3.5 h-3.5" />
            <span>SACA / Catálogos</span>
          </div>

          <div className="h-4 w-[1px] bg-[var(--border-fine)] shrink-0" />

          {/* Selector de Catálogo Inline */}
          <div className="flex items-center gap-1 bg-[var(--bg-surface)] p-0.5 rounded border border-[var(--border-fine)] overflow-x-auto">
            {tabsInfo.map((t) => {
              const active = tab === t.id;
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id as TabCat)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono transition flex items-center gap-1 shrink-0 ${
                    active
                      ? 'bg-[#1B3B2B] text-white dark:bg-[#F59E0B] dark:text-zinc-950 font-bold shadow-xs'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{t.label}</span>
                  <span className="text-[9.5px] px-1 rounded bg-[var(--bg-card)] border border-[var(--border-fine)]">
                    {t.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={cargarCatalogos}
            disabled={loading}
            className="btn btn-secondary"
            style={{ padding: '0.2rem 0.55rem', fontSize: '0.70rem', height: '28px' }}
            title="Sincronizar Catálogos"
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

      {/* 2. ÁREA DE TRABAJO DIVIDIDA (SPLIT-WORKSPACE) */}
      <div className="split-workspace flex-1 min-h-0">
        {/* PANEL PRINCIPAL: TABLA DE REGISTROS (8 COLS) */}
        <div className="workspace-main-panel">
          <div className="workspace-table-container">
            {tab === 'gestiones' && (
              <table className="compact-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Año Gestión</th>
                    <th>Estado Operativo</th>
                    <th className="text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {gestiones.map((g) => (
                    <tr key={g.id_gestion}>
                      <td className="font-mono text-[11px] text-[var(--color-accent)] font-bold">#{g.id_gestion}</td>
                      <td className="font-bold text-[var(--text-main)] font-mono">{g.anio_gestion}</td>
                      <td>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          g.estado_gestion === 'Activa'
                            ? 'bg-emerald-950/30 text-emerald-500 border border-emerald-500/30'
                            : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                        }`}>
                          {g.estado_gestion}
                        </span>
                      </td>
                      <td className="text-right">
                        <button
                          onClick={() => abrirEditar('gestiones', g.id_gestion, { anio_gestion: g.anio_gestion, estado_gestion: g.estado_gestion })}
                          className="btn btn-secondary text-xs px-2 py-0.5 mr-1"
                        >
                          <Edit className="w-3 h-3 text-[var(--color-accent)]" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {tab === 'idiomas' && (
              <table className="compact-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre de Idioma</th>
                    <th>Estado</th>
                    <th className="text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {idiomas.map((i) => (
                    <tr key={i.id_idioma}>
                      <td className="font-mono text-[11px] text-[var(--color-accent)] font-bold">#{i.id_idioma}</td>
                      <td className="font-bold text-[var(--text-main)]">{i.nombre_idioma}</td>
                      <td>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          i.estado_idioma === 'Activo'
                            ? 'bg-emerald-950/30 text-emerald-500 border border-emerald-500/30'
                            : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                        }`}>
                          {i.estado_idioma}
                        </span>
                      </td>
                      <td className="text-right">
                        <button
                          onClick={() => abrirEditar('idiomas', i.id_idioma, { nombre_idioma: i.nombre_idioma, estado_idioma: i.estado_idioma })}
                          className="btn btn-secondary text-xs px-2 py-0.5 mr-1"
                          title="Editar"
                        >
                          <Edit className="w-3 h-3 text-[var(--color-accent)]" />
                        </button>
                        <button
                          onClick={() => abrirConfirmarBaja('idiomas', i.id_idioma, i.nombre_idioma)}
                          className="btn btn-secondary text-xs px-2 py-0.5 text-amber-500"
                          title="Alternar Estado"
                        >
                          <Power className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {tab === 'aulas' && (
              <table className="compact-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre / Código</th>
                    <th className="text-center">Capacidad (Aforo)</th>
                    <th>Estado</th>
                    <th className="text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {aulas.map((a) => (
                    <tr key={a.id_aula}>
                      <td className="font-mono text-[11px] text-[var(--color-accent)] font-bold">#{a.id_aula}</td>
                      <td className="font-bold text-[var(--text-main)]">{a.nombre_aula}</td>
                      <td className="text-center font-mono font-bold text-sky-500">{a.capacidad_aula} plazas</td>
                      <td>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          a.estado_aula === 'Activo'
                            ? 'bg-emerald-950/30 text-emerald-500 border border-emerald-500/30'
                            : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                        }`}>
                          {a.estado_aula}
                        </span>
                      </td>
                      <td className="text-right">
                        <button
                          onClick={() => abrirEditar('aulas', a.id_aula, { nombre_aula: a.nombre_aula, capacidad_aula: a.capacidad_aula, estado_aula: a.estado_aula })}
                          className="btn btn-secondary text-xs px-2 py-0.5 mr-1"
                        >
                          <Edit className="w-3 h-3 text-[var(--color-accent)]" />
                        </button>
                        <button
                          onClick={() => abrirConfirmarBaja('aulas', a.id_aula, a.nombre_aula)}
                          className="btn btn-secondary text-xs px-2 py-0.5 text-amber-500"
                        >
                          <Power className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {tab === 'horarios' && (
              <table className="compact-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Franja Horaria</th>
                    <th>Estado</th>
                    <th className="text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {horarios.map((h) => (
                    <tr key={h.id_horario}>
                      <td className="font-mono text-[11px] text-[var(--color-accent)] font-bold">#{h.id_horario}</td>
                      <td className="font-mono font-bold text-[var(--text-main)] text-xs">
                        {h.hora_inicio_horario} — {h.hora_fin_horario}
                      </td>
                      <td>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          h.estado_horario === 'Activo'
                            ? 'bg-emerald-950/30 text-emerald-500 border border-emerald-500/30'
                            : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                        }`}>
                          {h.estado_horario}
                        </span>
                      </td>
                      <td className="text-right">
                        <button
                          onClick={() => abrirConfirmarBaja('horarios', h.id_horario, `${h.hora_inicio_horario} - ${h.hora_fin_horario}`)}
                          className="btn btn-secondary text-xs px-2 py-0.5 text-amber-500"
                        >
                          <Power className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {tab === 'tipos_programa' && (
              <table className="compact-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tipo de Programa</th>
                    <th>Estado</th>
                    <th className="text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {tiposPrograma.map((tp) => (
                    <tr key={tp.id_tipo_programa}>
                      <td className="font-mono text-[11px] text-[var(--color-accent)] font-bold">#{tp.id_tipo_programa}</td>
                      <td className="font-bold text-[var(--text-main)]">{tp.nombre_tipo_programa}</td>
                      <td>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          tp.estado_tipo_programa === 'Activo'
                            ? 'bg-emerald-950/30 text-emerald-500 border border-emerald-500/30'
                            : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                        }`}>
                          {tp.estado_tipo_programa}
                        </span>
                      </td>
                      <td className="text-right">
                        <button
                          onClick={() => abrirEditar('tipos-programa', tp.id_tipo_programa, { nombre_tipo_programa: tp.nombre_tipo_programa, estado_tipo_programa: tp.estado_tipo_programa })}
                          className="btn btn-secondary text-xs px-2 py-0.5 mr-1"
                        >
                          <Edit className="w-3 h-3 text-[var(--color-accent)]" />
                        </button>
                        <button
                          onClick={() => abrirConfirmarBaja('tipos-programa', tp.id_tipo_programa, tp.nombre_tipo_programa)}
                          className="btn btn-secondary text-xs px-2 py-0.5 text-amber-500"
                        >
                          <Power className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {tab === 'tipos_pago' && (
              <table className="compact-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Concepto Arancelario</th>
                    <th>Estado</th>
                    <th className="text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {tiposPago.map((tp) => (
                    <tr key={tp.id_tipo_pago}>
                      <td className="font-mono text-[11px] text-[var(--color-accent)] font-bold">#{tp.id_tipo_pago}</td>
                      <td className="font-bold text-[var(--text-main)]">{tp.nombre_tipo_pago}</td>
                      <td>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          tp.estado_tipo_pago === 'Activo'
                            ? 'bg-emerald-950/30 text-emerald-500 border border-emerald-500/30'
                            : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                        }`}>
                          {tp.estado_tipo_pago}
                        </span>
                      </td>
                      <td className="text-right">
                        <button
                          onClick={() => abrirEditar('tipos-pago', tp.id_tipo_pago, { nombre_tipo_pago: tp.nombre_tipo_pago, estado_tipo_pago: tp.estado_tipo_pago })}
                          className="btn btn-secondary text-xs px-2 py-0.5 mr-1"
                        >
                          <Edit className="w-3 h-3 text-[var(--color-accent)]" />
                        </button>
                        <button
                          onClick={() => abrirConfirmarBaja('tipos-pago', tp.id_tipo_pago, tp.nombre_tipo_pago)}
                          className="btn btn-secondary text-xs px-2 py-0.5 text-amber-500"
                        >
                          <Power className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="tactical-pagination">
            <span className="font-mono text-xs text-[var(--text-muted)]">
              CATEGORÍA SELECCIONADA: <strong className="text-[var(--text-main)]">{tab.toUpperCase()}</strong>
            </span>
            <span className="font-mono text-xs text-[var(--color-accent)]">SACA CEDMIL</span>
          </div>
        </div>

        {/* PANEL LATERAL: FORMULARIO DE ACCIÓN RÁPIDA (4 COLS) */}
        <div className="workspace-inspector-panel">
          <div className="workspace-inspector-header">
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-[var(--color-accent)]" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-[var(--text-main)] font-sans">
                Registrar Nuevo {tab.replace('_', ' ')}
              </h3>
            </div>
            <span className="badge badge-gold">ALTA RÁPIDA</span>
          </div>

          <div className="workspace-inspector-body">
            {tab === 'gestiones' && (
              <form onSubmit={handleCrearGestion} className="space-y-3">
                <div>
                  <label className="text-[11px] font-mono text-[var(--text-muted)] block mb-1">Año de Gestión</label>
                  <input
                    type="number"
                    min="2020"
                    max="2040"
                    value={formGestion.anio}
                    onChange={(e) => setFormGestion({ ...formGestion, anio: parseInt(e.target.value) || 2026 })}
                    className="w-full bg-[var(--bg-surface)] border border-[var(--border-fine)] rounded px-2.5 py-1.5 text-xs text-[var(--text-main)] font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-[var(--text-muted)] block mb-1">Estado</label>
                  <select
                    value={formGestion.estado}
                    onChange={(e) => setFormGestion({ ...formGestion, estado: e.target.value })}
                    className="w-full bg-[var(--bg-surface)] border border-[var(--border-fine)] rounded px-2.5 py-1.5 text-xs text-[var(--text-main)] font-mono"
                  >
                    <option value="Activa">Activa</option>
                    <option value="Cerrada">Cerrada</option>
                  </select>
                </div>
                <button type="submit" className="w-full btn btn-primary text-xs font-bold py-2 mt-2">
                  + Guardar Gestión
                </button>
              </form>
            )}

            {tab === 'idiomas' && (
              <form onSubmit={handleCrearIdioma} className="space-y-3">
                <div>
                  <label className="text-[11px] font-mono text-[var(--text-muted)] block mb-1">Nombre del Idioma</label>
                  <input
                    type="text"
                    placeholder="Ej: Italiano, Ruso..."
                    value={formIdioma.nombre}
                    onChange={(e) => setFormIdioma({ nombre: e.target.value })}
                    className="w-full bg-[var(--bg-surface)] border border-[var(--border-fine)] rounded px-2.5 py-1.5 text-xs text-[var(--text-main)]"
                    required
                  />
                </div>
                <button type="submit" className="w-full btn btn-primary text-xs font-bold py-2 mt-2">
                  + Guardar Idioma
                </button>
              </form>
            )}

            {tab === 'aulas' && (
              <form onSubmit={handleCrearAula} className="space-y-3">
                <div>
                  <label className="text-[11px] font-mono text-[var(--text-muted)] block mb-1">Nombre / Código de Aula</label>
                  <input
                    type="text"
                    placeholder="Ej: Aula 104 - Pabellón A"
                    value={formAula.nombre}
                    onChange={(e) => setFormAula({ ...formAula, nombre: e.target.value })}
                    className="w-full bg-[var(--bg-surface)] border border-[var(--border-fine)] rounded px-2.5 py-1.5 text-xs text-[var(--text-main)]"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-[var(--text-muted)] block mb-1">Capacidad Máxima (Plazas)</label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={formAula.capacidad}
                    onChange={(e) => setFormAula({ ...formAula, capacidad: parseInt(e.target.value) || 30 })}
                    className="w-full bg-[var(--bg-surface)] border border-[var(--border-fine)] rounded px-2.5 py-1.5 text-xs text-[var(--text-main)] font-mono font-bold"
                    required
                  />
                </div>
                <button type="submit" className="w-full btn btn-primary text-xs font-bold py-2 mt-2">
                  + Guardar Aula
                </button>
              </form>
            )}

            {tab === 'horarios' && (
              <form onSubmit={handleCrearHorario} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-mono text-[var(--text-muted)] block mb-1">Hora Inicio</label>
                    <input
                      type="time"
                      value={formHorario.inicio}
                      onChange={(e) => setFormHorario({ ...formHorario, inicio: e.target.value })}
                      className="w-full bg-[var(--bg-surface)] border border-[var(--border-fine)] rounded px-2 py-1.5 text-xs text-[var(--text-main)] font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-[var(--text-muted)] block mb-1">Hora Fin</label>
                    <input
                      type="time"
                      value={formHorario.fin}
                      onChange={(e) => setFormHorario({ ...formHorario, fin: e.target.value })}
                      className="w-full bg-[var(--bg-surface)] border border-[var(--border-fine)] rounded px-2 py-1.5 text-xs text-[var(--text-main)] font-mono"
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="w-full btn btn-primary text-xs font-bold py-2 mt-2">
                  + Guardar Franja Horaria
                </button>
              </form>
            )}

            {tab === 'tipos_programa' && (
              <form onSubmit={handleCrearTipoPrograma} className="space-y-3">
                <div>
                  <label className="text-[11px] font-mono text-[var(--text-muted)] block mb-1">Nombre Tipo Programa</label>
                  <input
                    type="text"
                    placeholder="Ej: Regular, Niños, Intensivo"
                    value={formTipoProg.nombre}
                    onChange={(e) => setFormTipoProg({ nombre: e.target.value })}
                    className="w-full bg-[var(--bg-surface)] border border-[var(--border-fine)] rounded px-2.5 py-1.5 text-xs text-[var(--text-main)]"
                    required
                  />
                </div>
                <button type="submit" className="w-full btn btn-primary text-xs font-bold py-2 mt-2">
                  + Guardar Tipo Programa
                </button>
              </form>
            )}

            {tab === 'tipos_pago' && (
              <form onSubmit={handleCrearTipoPago} className="space-y-3">
                <div>
                  <label className="text-[11px] font-mono text-[var(--text-muted)] block mb-1">Concepto Arancelario</label>
                  <input
                    type="text"
                    placeholder="Ej: Matrícula Regular, Mensualidad"
                    value={formTipoPago.nombre}
                    onChange={(e) => setFormTipoPago({ nombre: e.target.value })}
                    className="w-full bg-[var(--bg-surface)] border border-[var(--border-fine)] rounded px-2.5 py-1.5 text-xs text-[var(--text-main)]"
                    required
                  />
                </div>
                <button type="submit" className="w-full btn btn-primary text-xs font-bold py-2 mt-2">
                  + Guardar Concepto
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* MODAL DE CONFIRMACIÓN DE BAJA */}
      {modalConfirmar && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border-fine)] rounded-[3px] p-5 max-w-sm w-full space-y-3 shadow-xl">
            <h3 className="text-sm font-bold text-[var(--text-main)]">Cambiar Estado de Registro</h3>
            <p className="text-xs text-[var(--text-muted)]">
              ¿Desea cambiar el estado operativo de <strong className="text-[var(--text-main)]">{modalConfirmar.nombre}</strong>?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--border-fine)]">
              <button onClick={() => setModalConfirmar(null)} className="btn btn-secondary text-xs px-3 py-1">
                Cancelar
              </button>
              <button onClick={confirmarBajaLogica} className="btn btn-primary text-xs px-3 py-1">
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE EDICIÓN */}
      {modalEditar && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border-fine)] rounded-[3px] p-5 max-w-md w-full space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-[var(--border-fine)] pb-2">
              <h3 className="text-sm font-bold text-[var(--text-main)]">Editar {modalEditar.ruta}</h3>
              <button onClick={() => setModalEditar(null)} className="text-[var(--text-muted)] hover:text-[var(--text-main)]">
                <X className="w-4 h-4" />
              </button>
            </div>

            {errValidacion && (
              <p className="text-xs text-red-500 font-semibold">{errValidacion}</p>
            )}

            <div className="space-y-3 text-xs">
              {Object.keys(formEditar).map((key) => {
                if (key.startsWith('id_') || key.startsWith('created_') || key.startsWith('updated_')) return null;
                return (
                  <div key={key}>
                    <label className="text-[11px] font-mono text-[var(--text-muted)] block mb-1 uppercase">
                      {key.replace(/_/g, ' ')}
                    </label>
                    <input
                      type="text"
                      value={formEditar[key] || ''}
                      onChange={(e) => setFormEditar({ ...formEditar, [key]: e.target.value })}
                      className="w-full bg-[var(--bg-surface)] border border-[var(--border-fine)] rounded px-2.5 py-1.5 text-xs text-[var(--text-main)]"
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--border-fine)]">
              <button onClick={() => setModalEditar(null)} className="btn btn-secondary text-xs px-3 py-1">
                Cancelar
              </button>
              <button onClick={guardarEdicion} className="btn btn-primary text-xs px-3 py-1">
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
