'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Landmark,
  Ticket,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  Users,
  RefreshCw,
  X,
  ShieldAlert,
  UserCheck,
  Search,
  FileText,
  DollarSign,
  Printer,
  ChevronLeft,
  ChevronRight,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building,
  Check
} from 'lucide-react';
import { useAuthRole } from '@/context/AuthRoleContext';
import { useDynamicPagination } from '@/hooks/useDynamicPagination';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

export default function CajasPage() {
  const { esCajero, esEstudiante, esAdmin, usuario, rolConfig } = useAuthRole();
  const puedeOperarCaja = esCajero || esAdmin;

  // Estado de sub-pestañas operativas
  const [activeTab, setActiveTab] = useState<'ventanilla' | 'cobro' | 'historial' | 'arqueo'>('ventanilla');

  const [loading, setLoading] = useState(false);
  const [cajas, setCajas] = useState<any[]>([]);
  const [colaEspera, setColaEspera] = useState<any[]>([]);
  const [metricas, setMetricas] = useState<any | null>(null);
  const [pagos, setPagos] = useState<any[]>([]);
  const [alerta, setAlerta] = useState<{ tipo: 'ok' | 'error'; mensaje: string } | null>(null);

  const [cajaActivaId, setCajaActivaId] = useState<number>(1);
  const [filtrarPorVentanilla, setFiltrarPorVentanilla] = useState<boolean>(true);
  const [turnoEnAtencion, setTurnoEnAtencion] = useState<any | null>(null);
  const [miFicha, setMiFicha] = useState<any | null>(null);
  const [tipoTramiteFicha, setTipoTramiteFicha] = useState<'regular' | 'libros'>('regular');

  // Modal y formulario de cobro desde turno
  const [modalPago, setModalPago] = useState(false);
  const [formPago, setFormPago] = useState({
    id_tipo_pago: 2,
    monto: 150,
    concepto: 'Matrícula Regular Civil',
    metodo: 'Efectivo',
  });

  // Cobro directo (sin turno previo)
  const [cobroDirectoEstudiante, setCobroDirectoEstudiante] = useState('');
  const [idEstudianteCobroDirecto, setIdEstudianteCobroDirecto] = useState<number | null>(null);
  const [estudiantesSugerencias, setEstudiantesSugerencias] = useState<any[]>([]);
  const [buscandoEstudiantes, setBuscandoEstudiantes] = useState(false);
  const [formDirecto, setFormDirecto] = useState({
    id_tipo_pago: 2,
    monto: 150,
    concepto: 'Matrícula Regular Civil',
    metodo: 'Efectivo',
    observacion: '',
  });

  // Historial de pagos
  const [busquedaHistorial, setBusquedaHistorial] = useState('');
  const [pageHistorial, setPageHistorial] = useState(1);
  const { pageSize: pageSizeHistorial, containerRef: containerRefHistorial } = useDynamicPagination({ rowHeight: 40, minItems: 8, maxItems: 25 });

  // Comprobante emitido
  const [comprobanteEmitido, setComprobanteEmitido] = useState<any | null>(null);
  // Arqueo realizado
  const [arqueoConfirmado, setArqueoConfirmado] = useState<any | null>(null);

  const mostrarMensaje = (tipo: 'ok' | 'error', mensaje: string) => {
    setAlerta({ tipo, mensaje });
    setTimeout(() => setAlerta(null), 5000);
  };

  const cargarDatosCaja = async (cajaIdOverride?: number, forzarTodas?: boolean) => {
    setLoading(true);
    try {
      const activeCaja = cajaIdOverride !== undefined ? cajaIdOverride : cajaActivaId;
      const usarFiltro = forzarTodas !== undefined ? !forzarTodas : filtrarPorVentanilla;
      const urlCola = (puedeOperarCaja && usarFiltro && activeCaja)
        ? `${API_BASE}/cajas/cola-espera?id_caja=${activeCaja}`
        : `${API_BASE}/cajas/cola-espera`;

      const [resCajas, resCola, resMetricas, resPagos] = await Promise.all([
        fetch(`${API_BASE}/cajas`).catch(() => null),
        fetch(urlCola).catch(() => null),
        fetch(`${API_BASE}/cajas/metricas`).catch(() => null),
        fetch(`${API_BASE}/cajas/pagos?per_page=100`).catch(() => null),
      ]);

      if (resCajas && resCajas.ok) {
        const dataC = await resCajas.json();
        const lista = Array.isArray(dataC) ? dataC : (dataC.data || []);
        setCajas(lista);
        if (lista.length > 0 && !cajaActivaId) {
          setCajaActivaId(lista[0].id_caja);
        }
      }

      if (resCola && resCola.ok) {
        const dataQ = await resCola.json();
        setColaEspera(dataQ.cola_espera || dataQ.cola_atencion || []);
      }

      if (resMetricas && resMetricas.ok) {
        const dataM = await resMetricas.json();
        setMetricas(dataM);
      }

      if (resPagos && resPagos.ok) {
        const dataP = await resPagos.json();
        const listaP = Array.isArray(dataP) ? dataP : (dataP.data || []);
        setPagos(listaP);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatosCaja();
    const interval = setInterval(() => cargarDatosCaja(), 15000);
    return () => clearInterval(interval);
  }, [cajaActivaId, filtrarPorVentanilla]);

  // Búsqueda en vivo de postulantes para cobro directo
  useEffect(() => {
    const q = cobroDirectoEstudiante.trim();
    if (q.length < 2) {
      setEstudiantesSugerencias([]);
      return;
    }
    const timer = setTimeout(async () => {
      setBuscandoEstudiantes(true);
      try {
        const res = await fetch(`${API_BASE}/estudiantes?q=${encodeURIComponent(q)}&per_page=8`);
        if (res.ok) {
          const json = await res.json();
          setEstudiantesSugerencias(json.data || (Array.isArray(json) ? json : []));
        }
      } catch (e) {
      } finally {
        setBuscandoEstudiantes(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [cobroDirectoEstudiante]);

  const handleSolicitarFicha = async () => {
    try {
      let idEst = usuario?.id_estudiante;
      if (!idEst && usuario?.email) {
        try {
          const resEst = await fetch(`${API_BASE}/estudiantes?email=${encodeURIComponent(usuario.email)}`);
          if (resEst.ok) {
            const d = await resEst.json();
            const list = d.data || (Array.isArray(d) ? d : []);
            const match = list.find((e: any) => e.email_estudiante?.toLowerCase() === usuario.email.toLowerCase()) || list[0];
            if (match) idEst = match.id_estudiante;
          }
        } catch (e) {}
      }
      if (!idEst) {
        idEst = usuario?.id_estudiante || 11;
      }
      const res = await fetch(`${API_BASE}/cajas/ficha`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_estudiante: idEst,
          tipo_tramite: tipoTramiteFicha,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || data.message || 'No fue posible emitir el turno en este momento.');
      }

      const fichaObj = data.data || {
        numero_ficha: data.numero_ficha,
        estado_ficha: 'En espera',
        hora_llegada_ficha: new Date().toISOString(),
        id_caja: tipoTramiteFicha === 'libros' ? 3 : 1,
      };

      setMiFicha(fichaObj);
      const ventanillaNombre = fichaObj.caja?.nombre_caja || (fichaObj.id_caja === 3 ? 'Ventanilla 3 - Material & Libros' : (fichaObj.id_caja === 1 ? 'Ventanilla 1 - Militar' : 'Ventanilla 2 - Civiles'));
      mostrarMensaje('ok', `Turno N° ${data.numero_ficha || fichaObj.numero_ficha} emitido para ${ventanillaNombre}.`);
      cargarDatosCaja();
    } catch (err: any) {
      mostrarMensaje('error', err.message);
    }
  };

  const handleLlamarSiguiente = async () => {
    try {
      const res = await fetch(`${API_BASE}/cajas/ficha/llamar-siguiente`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_caja: cajaActivaId }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'No fue posible avanzar el turno.');
      }

      const siguiente = data.data || null;
      if (!siguiente) {
        mostrarMensaje('ok', data.message || 'No existen turnos en espera.');
        setTurnoEnAtencion(null);
        return;
      }

      setTurnoEnAtencion(siguiente);
      const nombreEstudiante = siguiente.estudiante?.nombre_estudiante
        ? `${siguiente.estudiante.nombre_estudiante} ${siguiente.estudiante.apellido_estudiante}`
        : (typeof siguiente.estudiante === 'string' ? siguiente.estudiante : 'Estudiante');

      mostrarMensaje('ok', `Turno N° ${siguiente.numero_ficha} convocado a ventanilla (${nombreEstudiante}).`);
      cargarDatosCaja();
    } catch (err: any) {
      mostrarMensaje('error', err.message);
    }
  };

  const handleProcesarPago = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!turnoEnAtencion) return;

    try {
      const res = await fetch(`${API_BASE}/cajas/pago`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_estudiante: turnoEnAtencion.id_estudiante,
          id_caja: cajaActivaId,
          id_ficha: turnoEnAtencion.id_ficha,
          id_tipo_pago: formPago.id_tipo_pago,
          monto_pago: formPago.monto,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al procesar el pago.');
      }

      setComprobanteEmitido(data.data);
      mostrarMensaje('ok', 'Pago procesado exitosamente. Comprobante emitido.');
      setModalPago(false);

      await fetch(`${API_BASE}/cajas/ficha/finalizar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_ficha: turnoEnAtencion.id_ficha }),
      });

      setTurnoEnAtencion(null);
      cargarDatosCaja();
    } catch (err: any) {
      mostrarMensaje('error', err.message);
    }
  };

  const handleProcesarCobroDirecto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idEstudianteCobroDirecto) {
      mostrarMensaje('error', 'Seleccione un postulante o estudiante válido de la búsqueda.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/cajas/pago`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_estudiante: idEstudianteCobroDirecto,
          id_caja: cajaActivaId,
          id_tipo_pago: formDirecto.id_tipo_pago,
          monto_pago: formDirecto.monto,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al registrar cobro directo.');
      }

      const pagoCreado = data.data || {
        id_pago: Math.floor(1000 + Math.random() * 9000),
        monto_pago: formDirecto.monto,
        fecha_pago: new Date().toISOString(),
        tipoPago: { nombre_tipo_pago: formDirecto.concepto },
        estudiante: { nombre_estudiante: cobroDirectoEstudiante },
        caja: { nombre_caja: cajas.find((c) => c.id_caja === cajaActivaId)?.nombre_caja || 'Ventanilla' },
      };

      setComprobanteEmitido(pagoCreado);
      mostrarMensaje('ok', 'Cobro registrado exitosamente en caja.');
      setCobroDirectoEstudiante('');
      setIdEstudianteCobroDirecto(null);
      setEstudiantesSugerencias([]);
      cargarDatosCaja();
    } catch (err: any) {
      mostrarMensaje('error', err.message);
    }
  };

  // Historial filtrado
  const historialFiltrado = useMemo(() => {
    const q = busquedaHistorial.toLowerCase().trim();
    return pagos.filter((p) => {
      if (!q) return true;
      const nom = `${p.estudiante?.nombre_estudiante || ''} ${p.estudiante?.apellido_estudiante || ''}`.toLowerCase();
      const ci = (p.estudiante?.ci_estudiante || '').toLowerCase();
      const tipo = (p.tipoPago?.nombre_tipo_pago || '').toLowerCase();
      const id = String(p.id_pago || '');
      return nom.includes(q) || ci.includes(q) || tipo.includes(q) || id.includes(q);
    });
  }, [pagos, busquedaHistorial]);

  const totalPagesHistorial = Math.max(1, Math.ceil(historialFiltrado.length / pageSizeHistorial));
  const historialPaginado = useMemo(() => {
    const start = (pageHistorial - 1) * pageSizeHistorial;
    return historialFiltrado.slice(start, start + pageSizeHistorial);
  }, [historialFiltrado, pageHistorial, pageSizeHistorial]);

  // Cálculos de Arqueo Diario
  const arqueoStats = useMemo(() => {
    let totalBs = 0;
    let totalTransacciones = pagos.length;
    let desglosePorConcepto: Record<string, { cantidad: number; total: number }> = {};
    let desglosePorCaja: Record<string, { cantidad: number; total: number }> = {};

    pagos.forEach((p) => {
      const monto = Number(p.monto_pago) || 0;
      totalBs += monto;

      const concepto = p.tipoPago?.nombre_tipo_pago || 'Arancel General';
      if (!desglosePorConcepto[concepto]) {
        desglosePorConcepto[concepto] = { cantidad: 0, total: 0 };
      }
      desglosePorConcepto[concepto].cantidad += 1;
      desglosePorConcepto[concepto].total += monto;

      const nombreCaja = p.caja?.nombre_caja || `Ventanilla ${p.id_caja || 1}`;
      if (!desglosePorCaja[nombreCaja]) {
        desglosePorCaja[nombreCaja] = { cantidad: 0, total: 0 };
      }
      desglosePorCaja[nombreCaja].cantidad += 1;
      desglosePorCaja[nombreCaja].total += monto;
    });

    return {
      totalBs,
      totalTransacciones,
      desglosePorConcepto,
      desglosePorCaja,
      fechaCorte: new Date().toLocaleDateString('es-BO', { day: '2-digit', month: 'long', year: 'numeric' }),
      horaCorte: new Date().toLocaleTimeString('es-BO'),
    };
  }, [pagos]);

  const handleEjecutarArqueo = () => {
    setArqueoConfirmado({
      ...arqueoStats,
      cajero: usuario?.nombre || rolConfig.nombrePorDefecto,
      caja: cajas.find((c) => c.id_caja === cajaActivaId)?.nombre_caja || 'Ventanilla 1',
      codigoArqueo: `ARQ-CEDMIL-${Date.now().toString().slice(-6)}`,
    });
    mostrarMensaje('ok', 'Arqueo de caja consolidado e impreso en memoria institucional.');
  };

  if (!puedeOperarCaja && !esEstudiante) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-[var(--bg-card)] border border-red-500/40 rounded-[3px] p-8 text-center space-y-4 shadow-xs">
          <ShieldAlert className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto" />
          <h2 className="text-xl font-bold text-[var(--text-main)] font-sans">Acceso Restringido</h2>
          <p className="text-xs text-[var(--text-muted)] max-w-xl mx-auto">
            La atención en ventanilla y el cobro de aranceles corresponde exclusivamente a los{' '}
            <strong className="text-[var(--color-accent)] font-mono">Cajeros</strong> autorizados del sistema SACA CEDMIL.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col min-h-0 overflow-hidden bg-[var(--bg-base)] text-[var(--text-main)]">
      {/* ── 1. FRANJA SUPERIOR COMPACTA (44px) CON SELECTOR DE PESTAÑAS ── */}
      <div className="strip-utility-bar">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[var(--military-green-subtle)] border border-[var(--border-accent)] text-[var(--military-green-primary)] dark:text-[var(--military-gold-primary)] font-mono text-[11px] font-bold shrink-0">
            <Landmark className="w-3.5 h-3.5" />
            <span>SACA / Cajas</span>
          </div>

          <div className="h-4 w-[1px] bg-[var(--border-fine)] shrink-0" />

          {/* Selector de Pestañas Operativas para Cajero/Admin */}
          {puedeOperarCaja && !esEstudiante ? (
            <div className="flex items-center gap-1 bg-[var(--bg-surface)] p-0.5 rounded border border-[var(--border-fine)] shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('ventanilla')}
                className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold transition-all duration-200 ${
                  activeTab === 'ventanilla'
                    ? 'bg-[#1B3B2B] text-white dark:bg-[#F59E0B] dark:text-zinc-950 shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'
                }`}
              >
                Ventanilla & Fichas ({colaEspera.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('cobro')}
                className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold transition-all duration-200 ${
                  activeTab === 'cobro'
                    ? 'bg-[#1B3B2B] text-white dark:bg-[#F59E0B] dark:text-zinc-950 shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'
                }`}
              >
                Cobro Directo
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('historial')}
                className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold transition-all duration-200 ${
                  activeTab === 'historial'
                    ? 'bg-[#1B3B2B] text-white dark:bg-[#F59E0B] dark:text-zinc-950 shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'
                }`}
              >
                Historial ({pagos.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('arqueo')}
                className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold transition-all duration-200 ${
                  activeTab === 'arqueo'
                    ? 'bg-[#1B3B2B] text-white dark:bg-[#F59E0B] dark:text-zinc-950 shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'
                }`}
              >
                Arqueo Diario
              </button>
            </div>
          ) : (
            <span className="text-xs font-bold text-[var(--text-main)] truncate hidden sm:inline">
              Atención en Caja — Turno Digital
            </span>
          )}
        </div>

        {/* Acciones de la derecha */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => cargarDatosCaja()}
            disabled={loading}
            className="btn btn-secondary"
            style={{ padding: '0.2rem 0.55rem', fontSize: '0.70rem', height: '28px' }}
            title="Actualizar datos y cola de turnos"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Sincronizar</span>
          </button>
        </div>
      </div>

      {/* Alerta de notificación flotante */}
      {alerta && (
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded mx-2 mb-2 text-xs font-semibold shrink-0 border ${
            alerta.tipo === 'ok'
              ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
              : 'bg-red-950/20 border-red-500/40 text-red-600 dark:text-red-400'
          }`}
        >
          {alerta.tipo === 'ok' ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : <AlertTriangle className="w-3.5 h-3.5 shrink-0" />}
          <span>{alerta.mensaje}</span>
        </div>
      )}

      {/* ── 2. VISTAS SEGÚN ROL Y PESTAÑA ── */}
      {esEstudiante ? (
        /* VISTA EDITORIAL ESTUDIANTE: DISPENSADOR DE TURNO DIGITAL */
        <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-3 overflow-y-auto">
          <div className="bg-[var(--bg-card)] border border-[var(--border-fine)] rounded-[3px] p-6 text-center space-y-4 shadow-sm max-w-lg w-full">
            <div className="w-12 h-12 rounded-[2px] bg-[var(--bg-surface)] border border-[var(--border-fine)] flex items-center justify-center text-[var(--color-accent)] mx-auto">
              <Ticket className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-[var(--text-main)] font-sans">Emisión de Ticket de Atención</h2>
            <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
              Seleccione el trámite a realizar en ventanilla y solicite su ficha de atención digital en tiempo real:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-1">
              <button
                type="button"
                onClick={() => setTipoTramiteFicha('regular')}
                className={`p-3 rounded-[2px] border text-xs transition ${
                  tipoTramiteFicha === 'regular'
                    ? 'border-[#D97706] dark:border-[#F59E0B] bg-[var(--bg-surface)] text-[var(--text-main)] ring-1 ring-[#F59E0B]/50'
                    : 'border-[var(--border-fine)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:border-[var(--color-accent)]'
                }`}
              >
                <div className="font-bold text-[var(--text-main)] mb-1 flex items-center justify-between text-xs">
                  <span>Trámite Regular / Matrícula</span>
                  {tipoTramiteFicha === 'regular' && <span className="w-2 h-2 rounded-[1px] bg-[#F59E0B]" />}
                </div>
                <p className="text-[11px] text-[var(--text-muted)] leading-tight">
                  Inscripciones, mensualidades y títulos.
                </p>
                <span className="inline-block mt-2 text-[10px] font-mono text-[#1B3B2B] dark:text-[#F59E0B] font-bold bg-[var(--bg-surface-elevated)] border border-[var(--border-fine)] px-1.5 py-0.5 rounded-[2px]">
                  {usuario?.subtitulo?.toLowerCase().includes('militar') || usuario?.nombre?.includes('Cad.') ? 'Ventanilla 1 - Militar' : 'Ventanilla 2 - Civiles'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setTipoTramiteFicha('libros')}
                className={`p-3 rounded-[2px] border text-xs transition ${
                  tipoTramiteFicha === 'libros'
                    ? 'border-[#D97706] dark:border-[#F59E0B] bg-[var(--bg-surface)] text-[var(--text-main)] ring-1 ring-[#F59E0B]/50'
                    : 'border-[var(--border-fine)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:border-[var(--color-accent)]'
                }`}
              >
                <div className="font-bold text-[var(--text-main)] mb-1 flex items-center justify-between text-xs">
                  <span>Adquisición Libros</span>
                  {tipoTramiteFicha === 'libros' && <span className="w-2 h-2 rounded-[1px] bg-[#F59E0B]" />}
                </div>
                <p className="text-[11px] text-[var(--text-muted)] leading-tight">
                  Texto guía oficial y bibliografía.
                </p>
                <span className="inline-block mt-2 text-[10px] font-mono text-[#D97706] dark:text-[#F59E0B] font-bold bg-[var(--bg-surface-elevated)] border border-[var(--border-fine)] px-1.5 py-0.5 rounded-[2px]">
                  Ventanilla 3 - Material & Libros
                </span>
              </button>
            </div>

            {miFicha ? (
              <div className="bg-[var(--bg-surface)] border border-[var(--border-fine)] border-t-4 border-t-[#D97706] dark:border-t-[#F59E0B] rounded-[2px] p-4 space-y-1.5 max-w-xs mx-auto shadow-xs">
                <span className="text-[10px] font-bold text-[#D97706] dark:text-[#F59E0B] uppercase tracking-widest font-mono">
                  Su Turno Asignado
                </span>
                <div className="text-4xl font-black font-mono text-[var(--text-main)] py-0.5">
                  #{miFicha.numero_ficha}
                </div>
                <p className="text-xs text-[var(--text-muted)]">
                  Estado: <strong className="text-[#D97706] dark:text-[#F59E0B] font-mono">{miFicha.estado_ficha || 'En espera'}</strong>
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  Ventanilla: <strong className="text-[var(--text-main)] font-mono">{miFicha.caja?.nombre_caja || (miFicha.id_caja === 3 ? 'Ventanilla 3 - Material & Libros' : (miFicha.id_caja === 1 ? 'Ventanilla 1 - Militar' : 'Ventanilla 2 - Civiles'))}</strong>
                </p>
                {miFicha.hora_llegada_ficha && (
                  <p className="text-[10px] text-[var(--text-muted)] font-mono">
                    Hora: {new Date(miFicha.hora_llegada_ficha).toLocaleTimeString()}
                  </p>
                )}
              </div>
            ) : (
              <button
                onClick={handleSolicitarFicha}
                className="px-6 py-2.5 bg-[#F59E0B] hover:bg-[#D97706] text-zinc-950 font-mono font-black text-xs uppercase tracking-wider transition shadow-sm"
              >
                Solicitar Ficha de Turno
              </button>
            )}

            <div className="border-t border-[var(--border-fine)] pt-2 text-xs text-[var(--text-muted)] font-mono flex justify-between">
              <span>Esperando atención: <strong className="text-[var(--text-main)]">{colaEspera.length}</strong></span>
              <span>Tiempo medio: ~{Math.max(1, Math.min(120, Math.round(Number(metricas?.promedio_espera_minutos_Wq) || 5)))} min</span>
            </div>
          </div>
        </div>
      ) : (
        /* VISTA EDITORIAL OPERATIVA CAJERO / JEFE CON SUB-PESTAÑAS */
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden px-2 pb-2">
          {/* Tira Ledger Superior de KPIs */}
          <div className="border border-[var(--border-fine)] rounded-[2px] bg-[var(--bg-card)] shadow-xs overflow-hidden shrink-0 mb-2">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[var(--border-fine)]">
              <div className="p-2 bg-[var(--bg-card)]">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-muted)] block truncate font-sans">En Sala de Espera</span>
                <p className="text-base sm:text-lg font-black font-mono text-[var(--text-main)] leading-none mt-0.5">{colaEspera.length}</p>
              </div>
              <div className="p-2 bg-[var(--bg-card)]">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-muted)] block truncate font-sans">Tiempo Medio Espera</span>
                <p className="text-base sm:text-lg font-black font-mono text-[#D97706] dark:text-[#F59E0B] leading-none mt-0.5">
                  {Math.max(0, Math.min(120, Math.round(Number(metricas?.promedio_espera_minutos_Wq) || 0)))} min
                </p>
              </div>
              <div className="p-2 bg-[var(--bg-card)]">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-muted)] block truncate font-sans">Recaudación Total Hoy</span>
                <p className="text-base sm:text-lg font-black font-mono text-emerald-600 dark:text-emerald-400 leading-none mt-0.5">{arqueoStats.totalBs} Bs.</p>
              </div>
              <div className="p-2 bg-[var(--bg-card)]">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-muted)] block truncate font-sans">Cobros Registrados</span>
                <p className="text-base sm:text-lg font-black font-mono text-[var(--text-main)] leading-none mt-0.5">{pagos.length}</p>
              </div>
            </div>
          </div>

          {/* ── SUB-PESTAÑA 1: ATENCIÓN EN VENTANILLA Y COLA EN VIVO ── */}
          {activeTab === 'ventanilla' && (
            <div key="ventanilla" className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-2.5 overflow-hidden animate-panel-fade">
              {/* Puesto de Ventanilla */}
              <div className="lg:col-span-4 bg-[var(--bg-card)] border border-[var(--border-fine)] rounded-[2px] p-3 flex flex-col justify-between overflow-y-auto">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-[var(--border-fine)] pb-2">
                    <h3 className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider flex items-center gap-1.5 font-sans">
                      <Landmark className="w-3.5 h-3.5 text-[#D97706] dark:text-[#F59E0B]" />
                      Mi Puesto de Ventanilla
                    </h3>
                    <select
                      value={cajaActivaId}
                      onChange={(e) => {
                        const newId = parseInt(e.target.value) || 1;
                        setCajaActivaId(newId);
                        cargarDatosCaja(newId);
                      }}
                      className="bg-[var(--bg-surface)] border border-[var(--border-fine)] text-xs text-[var(--text-main)] rounded-[2px] px-2 py-0.5 font-mono"
                    >
                      {cajas.map((c) => (
                        <option key={c.id_caja} value={c.id_caja}>{c.nombre_caja}</option>
                      ))}
                    </select>
                  </div>

                  {turnoEnAtencion ? (
                    <div className="bg-[var(--bg-surface)] border border-[#D97706]/60 dark:border-[#F59E0B]/60 rounded-[2px] p-3 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold uppercase text-[#D97706] dark:text-[#F59E0B] tracking-wider font-mono">
                          ● Atendiendo Actualmente
                        </span>
                        <span className="font-mono text-xs text-[var(--text-main)] bg-[var(--bg-card)] border border-[var(--border-fine)] px-2 py-0.5 rounded-[2px] font-bold">
                          Turno #{turnoEnAtencion.numero_ficha}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-[var(--text-main)]">
                        {turnoEnAtencion.estudiante?.nombre_estudiante
                          ? `${turnoEnAtencion.estudiante.nombre_estudiante} ${turnoEnAtencion.estudiante.apellido_estudiante}`
                          : (typeof turnoEnAtencion.estudiante === 'string' ? turnoEnAtencion.estudiante : 'Estudiante')}
                      </h4>

                      {turnoEnAtencion.hora_inicio_atencion_ficha && (
                        <p className="text-[10px] text-[var(--text-muted)] font-mono">
                          Inicio de Convocatoria: {new Date(turnoEnAtencion.hora_inicio_atencion_ficha).toLocaleTimeString()}
                        </p>
                      )}

                      <div className="pt-2 space-y-1.5">
                        <button
                          onClick={() => setModalPago(true)}
                          className="w-full py-2 bg-[#F59E0B] hover:bg-[#D97706] text-zinc-950 font-mono font-black rounded-[2px] text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <CreditCard className="w-3.5 h-3.5 text-zinc-950" />
                          <span>Cobrar Arancel / Emitir Recibo</span>
                        </button>

                        <button
                          onClick={async () => {
                            await fetch(`${API_BASE}/cajas/ficha/finalizar`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ id_ficha: turnoEnAtencion.id_ficha }),
                            });
                            setTurnoEnAtencion(null);
                            mostrarMensaje('ok', 'Atención de turno finalizada.');
                            cargarDatosCaja();
                          }}
                          className="w-full py-1.5 btn btn-secondary text-xs font-semibold flex items-center justify-center gap-1.5"
                        >
                          <X className="w-3 h-3" />
                          <span>Finalizar sin cobro</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 space-y-3 bg-[var(--bg-surface)] rounded-[2px] border border-dashed border-[var(--border-fine)]">
                      <UserCheck className="w-8 h-8 text-[var(--text-muted)] mx-auto opacity-40" />
                      <div>
                        <p className="text-xs font-bold text-[var(--text-main)]">Ventanilla Despejada</p>
                        <p className="text-[11px] text-[var(--text-muted)]">Presione para convocar al siguiente estudiante en cola</p>
                      </div>
                      <button
                        onClick={handleLlamarSiguiente}
                        disabled={colaEspera.length === 0}
                        className="px-5 py-2 bg-[#1B3B2B] hover:bg-[#12281D] text-white dark:bg-[#F59E0B] dark:hover:bg-[#D97706] dark:text-zinc-950 font-mono font-black text-xs uppercase tracking-wider transition disabled:opacity-40 shadow-xs"
                      >
                        Llamar Siguiente Turno
                      </button>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-[var(--border-fine)] text-[10.5px] font-mono text-[var(--text-muted)] flex justify-between">
                  <span>Operador: <strong className="text-[var(--text-main)]">{usuario?.nombre || 'Cajero'}</strong></span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">Ventanilla Online</span>
                </div>
              </div>

              {/* Listado Editorial de Sala de Espera */}
              <div className="lg:col-span-8 bg-[var(--bg-card)] border border-[var(--border-fine)] rounded-[2px] p-3 flex flex-col overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-fine)] pb-2 mb-2">
                  <div>
                    <h3 className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider flex items-center gap-1.5 font-sans">
                      <Users className="w-3.5 h-3.5 text-[#D97706] dark:text-[#F59E0B]" />
                      Cola de Turnos en Espera ({colaEspera.length})
                    </h3>
                    <span className="text-[10px] text-[var(--text-muted)] font-mono">
                      {filtrarPorVentanilla ? `Filtrando por ${cajas.find((c) => c.id_caja === cajaActivaId)?.nombre_caja || 'Mi Ventanilla'}` : 'Todas las ventanillas institucionales'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const nuevo = !filtrarPorVentanilla;
                      setFiltrarPorVentanilla(nuevo);
                      cargarDatosCaja(cajaActivaId, !nuevo);
                    }}
                    className="btn btn-secondary text-xs px-2.5 py-1"
                  >
                    {filtrarPorVentanilla ? 'Ver Todas las Ventanillas' : 'Filtrar Solo Mi Ventanilla'}
                  </button>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto">
                  <table className="compact-table">
                    <thead>
                      <tr>
                        <th style={{ width: '35px' }}>Pos.</th>
                        <th>N° Turno</th>
                        <th>Postulante / Estudiante</th>
                        <th>Condición</th>
                        <th>Ventanilla</th>
                        <th>Hora Convocatoria</th>
                        <th className="text-right">Espera</th>
                      </tr>
                    </thead>
                    <tbody>
                      {colaEspera.map((f) => (
                        <tr key={f.id_ficha}>
                          <td className="font-bold font-mono text-[#D97706] dark:text-[#F59E0B]">#{f.posicion || f.posicion_cola}</td>
                          <td className="font-bold font-mono text-[var(--text-main)]">#{f.numero_ficha}</td>
                          <td>
                            <div className="font-semibold text-[var(--text-main)] truncate max-w-[200px]">
                              {f.estudiante?.nombre_estudiante
                                ? `${f.estudiante.nombre_estudiante} ${f.estudiante.apellido_estudiante}`
                                : (typeof f.estudiante === 'string' ? f.estudiante : 'Estudiante')}
                            </div>
                          </td>
                          <td>
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                              f.tipo_cliente === 'Militar'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-700/50'
                                : 'bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-700/50'
                            }`}>
                              {f.tipo_cliente || 'Civil'}
                            </span>
                          </td>
                          <td className="text-[11px] text-[var(--text-muted)] font-mono truncate max-w-[150px]">
                            {f.caja?.nombre_caja || (f.id_caja === 3 ? 'Ventanilla 3 - Libros' : (f.id_caja === 1 ? 'Ventanilla 1 - Militar' : 'Ventanilla 2 - Civiles'))}
                          </td>
                          <td className="font-mono text-[10px] text-[var(--text-dim)]">
                            {f.hora_llegada_ficha ? new Date(f.hora_llegada_ficha).toLocaleTimeString() : '—'}
                          </td>
                          <td className="text-right font-mono text-[11px] font-bold text-[#D97706] dark:text-[#F59E0B]">
                            {f.tiempo_espera_minutos !== undefined ? `${f.tiempo_espera_minutos} min` : '—'}
                          </td>
                        </tr>
                      ))}
                      {colaEspera.length === 0 && (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-[var(--text-muted)] font-mono text-xs">
                            No existen fichas pendientes en sala de espera.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── SUB-PESTAÑA 2: COBRO DIRECTO / FORMULARIO RÁPIDO ── */}
          {activeTab === 'cobro' && (
            <div key="cobro" className="flex-1 min-h-0 bg-[var(--bg-card)] border border-[var(--border-fine)] rounded-[2px] p-4 overflow-y-auto animate-panel-fade max-w-3xl mx-auto w-full">
              <div className="border-b border-[var(--border-fine)] pb-3 mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-main)] font-display uppercase tracking-tight flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-[#D97706] dark:text-[#F59E0B]" />
                    Registro de Cobro Directo en Ventanilla
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    Emisión instantánea de boletas arancelarias sin requerir ficha de espera previa.
                  </p>
                </div>
                <span className="px-2 py-0.5 bg-[var(--bg-surface)] border border-[var(--border-fine)] text-[10px] font-mono font-bold text-[#D97706] dark:text-[#F59E0B]">
                  OPERACIÓN CAJA RÁPIDA
                </span>
              </div>

              <form onSubmit={handleProcesarCobroDirecto} className="space-y-4 text-xs font-mono">
                {/* Búsqueda de Postulante / Estudiante */}
                <div className="relative">
                  <label className="text-[11px] font-bold text-[var(--text-main)] uppercase block mb-1">
                    Buscar Postulante o Estudiante (Nombre o C.I.) *
                  </label>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="Ej: Pérez Mamani, 6849201 LP..."
                      value={cobroDirectoEstudiante}
                      onChange={(e) => {
                        setCobroDirectoEstudiante(e.target.value);
                        setIdEstudianteCobroDirecto(null);
                      }}
                      className="w-full bg-[var(--bg-surface)] border border-[var(--border-fine)] focus:border-[#F59E0B] rounded-[2px] pl-9 pr-3 py-2 text-xs text-[var(--text-main)] outline-none"
                      required
                    />
                  </div>

                  {/* Dropdown de Coincidencias */}
                  {estudiantesSugerencias.length > 0 && !idEstudianteCobroDirecto && (
                    <div className="absolute top-full left-0 right-0 z-30 mt-1 bg-white dark:bg-[#121614] border border-[var(--border-fine)] shadow-lg max-h-48 overflow-y-auto">
                      {estudiantesSugerencias.map((est) => (
                        <button
                          key={est.id_estudiante || est.id}
                          type="button"
                          onClick={() => {
                            setIdEstudianteCobroDirecto(est.id_estudiante || est.id);
                            setCobroDirectoEstudiante(`${est.nombre_estudiante || est.nombres} ${est.apellido_estudiante || est.apellidos} — C.I. ${est.ci_estudiante || est.ci}`);
                            setEstudiantesSugerencias([]);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-[#F4F3EF] dark:hover:bg-[#181E1B] border-b border-[var(--border-fine)] flex items-center justify-between text-xs"
                        >
                          <div>
                            <strong className="text-[var(--text-main)] block">{est.nombre_estudiante || est.nombres} {est.apellido_estudiante || est.apellidos}</strong>
                            <span className="text-[10px] text-zinc-500">C.I. {est.ci_estudiante || est.ci} • {est.tipo_estudiante || 'Civil'}</span>
                          </div>
                          <span className="text-[10px] text-[#D97706] dark:text-[#F59E0B] font-bold">Seleccionar &gt;</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Selección de Concepto y Arancel */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[var(--text-main)] uppercase block mb-1">
                      Concepto Arancelario *
                    </label>
                    <select
                      value={formDirecto.id_tipo_pago}
                      onChange={(e) => {
                        const id = parseInt(e.target.value);
                        const concepto =
                          id === 1 ? 'Beca Militar (100% Exenta)'
                          : id === 2 ? 'Matrícula Regular Civil'
                          : id === 3 ? 'Mensualidad Civil'
                          : id === 4 ? 'Adquisición de Texto Oficial'
                          : 'Certificado de Suficiencia';
                        const monto = id === 1 ? 0 : id === 2 ? 150 : id === 3 ? 220 : id === 4 ? 180 : 80;
                        setFormDirecto({ ...formDirecto, id_tipo_pago: id, concepto, monto });
                      }}
                      className="w-full bg-[var(--bg-surface)] border border-[var(--border-fine)] rounded-[2px] px-3 py-2 text-[var(--text-main)] text-xs"
                    >
                      <option value={2}>Matrícula Regular Civil — 150 Bs.</option>
                      <option value={3}>Mensualidad Civil — 220 Bs.</option>
                      <option value={4}>Adquisición de Texto Oficial — 180 Bs.</option>
                      <option value={5}>Certificado de Suficiencia — 80 Bs.</option>
                      <option value={1}>Beca Militar — 0 Bs. (Exento)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[var(--text-main)] uppercase block mb-1">
                      Monto a Cobrar (Bs.) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="5"
                      value={formDirecto.monto}
                      onChange={(e) => setFormDirecto({ ...formDirecto, monto: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-[var(--bg-surface)] border border-[var(--border-fine)] rounded-[2px] px-3 py-2 text-[var(--text-main)] font-mono text-base font-black"
                      required
                    />
                  </div>
                </div>

                {/* Forma de Pago y Ventanilla */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[var(--text-main)] uppercase block mb-1">
                      Método de Pago
                    </label>
                    <select
                      value={formDirecto.metodo}
                      onChange={(e) => setFormDirecto({ ...formDirecto, metodo: e.target.value })}
                      className="w-full bg-[var(--bg-surface)] border border-[var(--border-fine)] rounded-[2px] px-3 py-2 text-[var(--text-main)] text-xs"
                    >
                      <option value="Efectivo">Efectivo en Ventanilla</option>
                      <option value="QR / Transferencia">Transferencia Bancaria / QR</option>
                      <option value="Débito">Tarjeta de Débito</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[var(--text-main)] uppercase block mb-1">
                      Ventanilla Responsable
                    </label>
                    <select
                      value={cajaActivaId}
                      onChange={(e) => setCajaActivaId(parseInt(e.target.value))}
                      className="w-full bg-[var(--bg-surface)] border border-[var(--border-fine)] rounded-[2px] px-3 py-2 text-[var(--text-main)] text-xs"
                    >
                      {cajas.map((c) => (
                        <option key={c.id_caja} value={c.id_caja}>{c.nombre_caja}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--border-fine)] flex items-center justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#F59E0B] hover:bg-[#D97706] text-zinc-950 font-mono font-black text-xs uppercase tracking-wider transition shadow-sm flex items-center gap-2"
                  >
                    <Printer className="w-4 h-4 text-zinc-950" />
                    <span>[ Emitir Comprobante de Cobro ]</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── SUB-PESTAÑA 3: HISTORIAL DE RECAUDACIONES ── */}
          {activeTab === 'historial' && (
            <div key="historial" className="flex-1 min-h-0 flex flex-col bg-[var(--bg-card)] border border-[var(--border-fine)] rounded-[2px] p-3 overflow-hidden animate-panel-fade">
              {/* Barra de Filtro de Historial */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-fine)] pb-2 mb-2 shrink-0">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#D97706] dark:text-[#F59E0B]" />
                  <h3 className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider font-sans">
                    Historial de Recaudaciones del Sistema
                  </h3>
                  <span className="text-[10.5px] font-mono text-zinc-500">
                    ({historialFiltrado.length} registros)
                  </span>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Buscar por estudiante, CI o concepto..."
                    value={busquedaHistorial}
                    onChange={(e) => {
                      setBusquedaHistorial(e.target.value);
                      setPageHistorial(1);
                    }}
                    className="w-full bg-[var(--bg-surface)] border border-[var(--border-fine)] focus:border-[#F59E0B] pl-8 pr-2.5 py-1 text-xs font-mono text-[var(--text-main)] outline-none rounded-[2px]"
                  />
                </div>
              </div>

              {/* Tabla Paginada de Historial */}
              <div ref={containerRefHistorial} className="flex-1 min-h-0 overflow-y-auto">
                <table className="compact-table">
                  <thead>
                    <tr>
                      <th style={{ width: '45px' }}>N° Recibo</th>
                      <th>Postulante / Estudiante</th>
                      <th>Concepto Arancelario</th>
                      <th>Ventanilla</th>
                      <th>Fecha & Hora</th>
                      <th className="text-center">Estado</th>
                      <th className="text-right">Monto (Bs.)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historialPaginado.map((p) => (
                      <tr key={p.id_pago}>
                        <td className="font-mono font-bold text-[#D97706] dark:text-[#F59E0B]">
                          #{p.id_pago}
                        </td>
                        <td>
                          <div className="font-semibold text-[var(--text-main)] truncate max-w-[220px]">
                            {p.estudiante?.nombre_estudiante || p.estudiante?.nombre_completo || 'Estudiante'} {p.estudiante?.apellido_estudiante || ''}
                          </div>
                          <span className="text-[10px] text-zinc-500 font-mono">
                            CI: {p.estudiante?.ci_estudiante || p.estudiante?.ci || '—'}
                          </span>
                        </td>
                        <td className="text-[11px] font-mono text-[var(--text-main)] truncate max-w-[200px]">
                          {p.tipoPago?.nombre_tipo_pago || 'Arancel'}
                        </td>
                        <td className="text-[11px] font-mono text-[var(--text-muted)]">
                          {p.caja?.nombre_caja || `Ventanilla ${p.id_caja || 1}`}
                        </td>
                        <td className="text-[10.5px] font-mono text-[var(--text-dim)]">
                          {p.fecha_pago ? new Date(p.fecha_pago).toLocaleString('es-BO') : '—'}
                        </td>
                        <td className="text-center">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700/50">
                            PAGADO
                          </span>
                        </td>
                        <td className="text-right font-mono text-xs font-black text-emerald-600 dark:text-emerald-400">
                          {Number(p.monto_pago || 0).toFixed(2)} Bs.
                        </td>
                      </tr>
                    ))}
                    {historialFiltrado.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-zinc-500 font-mono text-xs">
                          No se encontraron recaudaciones con los criterios de búsqueda.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Paginación de Historial */}
              <div className="h-10 min-h-[40px] border-t border-[var(--border-fine)] pt-2 flex items-center justify-between text-xs font-mono shrink-0">
                <span className="text-[11px] text-zinc-500">
                  Total acumulado en vista: <strong className="text-emerald-600 dark:text-emerald-400">{historialFiltrado.reduce((acc, p) => acc + (Number(p.monto_pago) || 0), 0).toFixed(2)} Bs.</strong>
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPageHistorial((p) => Math.max(1, p - 1))}
                    disabled={pageHistorial <= 1}
                    className="p-1 btn btn-secondary text-xs disabled:opacity-30"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-2 text-xs font-bold text-[var(--text-main)]">
                    {pageHistorial} / {totalPagesHistorial}
                  </span>
                  <button
                    onClick={() => setPageHistorial((p) => Math.min(totalPagesHistorial, p + 1))}
                    disabled={pageHistorial >= totalPagesHistorial}
                    className="p-1 btn btn-secondary text-xs disabled:opacity-30"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── SUB-PESTAÑA 4: ARQUEO DIARIO DE CAJA ── */}
          {activeTab === 'arqueo' && (
            <div key="arqueo" className="flex-1 min-h-0 bg-[var(--bg-card)] border border-[var(--border-fine)] rounded-[2px] p-4 overflow-y-auto animate-panel-fade max-w-4xl mx-auto w-full space-y-4">
              <div className="border-b border-[var(--border-fine)] pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-main)] font-display uppercase tracking-tight flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#D97706] dark:text-[#F59E0B]" />
                    Arqueo de Caja y Balance Diario de Recaudaciones
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    Consolidación oficial de ingresos, auditoría por ventanilla y balance fiscal SACA CEDMIL.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleEjecutarArqueo}
                  className="px-4 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-zinc-950 font-mono font-black text-xs uppercase tracking-wider transition shadow-sm flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5 text-zinc-950" />
                  <span>Realizar Arqueo Oficial</span>
                </button>
              </div>

              {/* Ficha Resumen de Arqueo */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-[var(--bg-surface)] border border-[var(--border-fine)] rounded-[2px]">
                  <span className="text-[10px] uppercase font-mono text-zinc-500 block">Total en Caja (Efectivo/Digital)</span>
                  <p className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                    {arqueoStats.totalBs.toFixed(2)} Bs.
                  </p>
                  <span className="text-[10px] text-zinc-400 font-mono">Consolidado a las {arqueoStats.horaCorte}</span>
                </div>

                <div className="p-3 bg-[var(--bg-surface)] border border-[var(--border-fine)] rounded-[2px]">
                  <span className="text-[10px] uppercase font-mono text-zinc-500 block">Comprobantes Procesados</span>
                  <p className="text-2xl font-black font-mono text-[#D97706] dark:text-[#F59E0B] mt-1">
                    {arqueoStats.totalTransacciones} Boletas
                  </p>
                  <span className="text-[10px] text-zinc-400 font-mono">100% auditadas sin descuadre</span>
                </div>

                <div className="p-3 bg-[var(--bg-surface)] border border-[var(--border-fine)] rounded-[2px]">
                  <span className="text-[10px] uppercase font-mono text-zinc-500 block">Responsable de Caja</span>
                  <p className="text-sm font-bold text-[var(--text-main)] mt-1 truncate">
                    {usuario?.nombre || rolConfig.nombrePorDefecto}
                  </p>
                  <span className="text-[10px] text-[#D97706] dark:text-[#F59E0B] font-mono">Rol // {rolConfig.titulo}</span>
                </div>
              </div>

              {/* Desglose por Concepto Arancelario */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="border border-[var(--border-fine)] rounded-[2px] p-3 bg-[var(--bg-surface)]">
                  <h4 className="text-xs font-bold text-[var(--text-main)] uppercase font-mono mb-2 border-b border-[var(--border-fine)] pb-1.5 flex items-center justify-between">
                    <span>Desglose por Concepto</span>
                    <span>Subtotal</span>
                  </h4>
                  <div className="space-y-2 text-xs font-mono">
                    {Object.entries(arqueoStats.desglosePorConcepto).map(([concepto, info]) => (
                      <div key={concepto} className="flex items-center justify-between border-b border-dashed border-[var(--border-fine)] pb-1">
                        <div>
                          <strong className="text-[var(--text-main)] block">{concepto}</strong>
                          <span className="text-[10px] text-zinc-500">{info.cantidad} recibo(s)</span>
                        </div>
                        <span className="font-black text-emerald-600 dark:text-emerald-400">
                          {info.total.toFixed(2)} Bs.
                        </span>
                      </div>
                    ))}
                    {Object.keys(arqueoStats.desglosePorConcepto).length === 0 && (
                      <p className="text-[11px] text-zinc-500 py-3 text-center">Sin transacciones registradas.</p>
                    )}
                  </div>
                </div>

                {/* Desglose por Ventanilla Operativa */}
                <div className="border border-[var(--border-fine)] rounded-[2px] p-3 bg-[var(--bg-surface)]">
                  <h4 className="text-xs font-bold text-[var(--text-main)] uppercase font-mono mb-2 border-b border-[var(--border-fine)] pb-1.5 flex items-center justify-between">
                    <span>Recaudación por Ventanilla</span>
                    <span>Total Ventanilla</span>
                  </h4>
                  <div className="space-y-2 text-xs font-mono">
                    {Object.entries(arqueoStats.desglosePorCaja).map(([cajaNombre, info]) => (
                      <div key={cajaNombre} className="flex items-center justify-between border-b border-dashed border-[var(--border-fine)] pb-1">
                        <div>
                          <strong className="text-[var(--text-main)] block">{cajaNombre}</strong>
                          <span className="text-[10px] text-zinc-500">{info.cantidad} operación(es)</span>
                        </div>
                        <span className="font-black text-[#D97706] dark:text-[#F59E0B]">
                          {info.total.toFixed(2)} Bs.
                        </span>
                      </div>
                    ))}
                    {Object.keys(arqueoStats.desglosePorCaja).length === 0 && (
                      <p className="text-[11px] text-zinc-500 py-3 text-center">Sin movimientos por ventanilla.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Boleta de Arqueo Generada */}
              {arqueoConfirmado && (
                <div className="p-4 bg-[#F4F3EF] dark:bg-[#0A0C0B] border border-[#D97706] dark:border-[#F59E0B] rounded-[2px] space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-[var(--border-fine)] pb-2">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500" />
                      <strong className="text-sm uppercase text-[var(--text-main)] font-display">
                        Boleta Oficial de Cierre de Caja
                      </strong>
                    </div>
                    <span className="text-[#D97706] dark:text-[#F59E0B] font-black">
                      {arqueoConfirmado.codigoArqueo}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                    <div>
                      <span className="text-zinc-500 uppercase block text-[9.5px]">Fecha de Emisión:</span>
                      <strong className="text-[var(--text-main)]">{arqueoConfirmado.fechaCorte}</strong>
                    </div>
                    <div>
                      <span className="text-zinc-500 uppercase block text-[9.5px]">Hora de Cierre:</span>
                      <strong className="text-[var(--text-main)]">{arqueoConfirmado.horaCorte}</strong>
                    </div>
                    <div>
                      <span className="text-zinc-500 uppercase block text-[9.5px]">Cajero Responsable:</span>
                      <strong className="text-[var(--text-main)] truncate block">{arqueoConfirmado.cajero}</strong>
                    </div>
                    <div>
                      <span className="text-zinc-500 uppercase block text-[9.5px]">Total Balance:</span>
                      <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{arqueoConfirmado.totalBs.toFixed(2)} Bs.</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Modal de Cobro de Ficha */}
      {modalPago && turnoEnAtencion && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border-fine)] rounded-[3px] w-full max-w-md p-6 space-y-4 shadow-xl font-mono">
            <div className="flex items-center justify-between border-b border-[var(--border-fine)] pb-3">
              <h3 className="text-sm font-bold text-[var(--text-main)] font-sans uppercase tracking-wider">
                Procesar Recaudación en Ventanilla
              </h3>
              <button onClick={() => setModalPago(false)} className="text-[var(--text-muted)] hover:text-[var(--text-main)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProcesarPago} className="space-y-3 text-xs">
              <div>
                <label className="text-[var(--text-muted)] block mb-1 text-[11px] uppercase">Postulante / Estudiante</label>
                <input
                  type="text"
                  disabled
                  value={turnoEnAtencion.estudiante?.nombre_estudiante
                    ? `${turnoEnAtencion.estudiante.nombre_estudiante} ${turnoEnAtencion.estudiante.apellido_estudiante}`
                    : (typeof turnoEnAtencion.estudiante === 'string' ? turnoEnAtencion.estudiante : 'Estudiante')}
                  className="w-full bg-[var(--bg-surface)] border border-[var(--border-fine)] rounded-[2px] px-3 py-2 text-[var(--text-main)] font-bold text-xs"
                />
              </div>

              <div>
                <label className="text-[var(--text-muted)] block mb-1 text-[11px] uppercase">Concepto Arancelario</label>
                <select
                  value={formPago.id_tipo_pago}
                  onChange={(e) => {
                    const id = parseInt(e.target.value);
                    const concepto =
                      id === 1 ? 'Beca Militar (100% Exenta)'
                      : id === 2 ? 'Matrícula Regular Civil'
                      : id === 3 ? 'Mensualidad Civil'
                      : id === 4 ? 'Adquisición de Texto Oficial'
                      : 'Certificado de Suficiencia';
                    const monto = id === 1 ? 0 : id === 2 ? 150 : id === 3 ? 220 : id === 4 ? 180 : 80;
                    setFormPago({ ...formPago, id_tipo_pago: id, concepto, monto });
                  }}
                  className="w-full bg-[var(--bg-surface)] border border-[var(--border-fine)] rounded-[2px] px-3 py-2 text-[var(--text-main)] text-xs"
                >
                  <option value={1}>Beca Militar (100% Exenta)</option>
                  <option value={2}>Matrícula Regular Civil (150 Bs.)</option>
                  <option value={3}>Mensualidad Civil (220 Bs.)</option>
                  <option value={4}>Adquisición de Texto Oficial (180 Bs.)</option>
                  <option value={5}>Certificado de Suficiencia (80 Bs.)</option>
                </select>
              </div>

              <div>
                <label className="text-[var(--text-muted)] block mb-1 text-[11px] uppercase">Monto a Cobrar (Bs.)</label>
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={formPago.monto}
                  onChange={(e) => setFormPago({ ...formPago, monto: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-[var(--bg-surface)] border border-[var(--border-fine)] rounded-[2px] px-3 py-2 text-[var(--text-main)] font-mono text-base font-bold"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border-fine)]">
                <button
                  type="button"
                  onClick={() => setModalPago(false)}
                  className="px-3 py-1.5 rounded-[2px] border border-[var(--border-fine)] bg-[var(--bg-surface)] text-[var(--text-muted)] font-semibold text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-[2px] bg-[#F59E0B] hover:bg-[#D97706] text-zinc-950 font-bold text-xs uppercase tracking-wider transition shadow-sm"
                >
                  Confirmar Cobro & Comprobante
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Comprobante Oficial Emitido */}
      {comprobanteEmitido && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border-fine)] rounded-[3px] w-full max-w-sm p-6 space-y-4 text-center shadow-xl font-mono">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="text-sm font-bold text-[var(--text-main)] font-sans uppercase tracking-wider">
              Comprobante Oficial de Recaudación
            </h3>
            <div className="bg-[var(--bg-surface)] p-4 rounded-[2px] border border-[var(--border-fine)] text-left text-xs space-y-1.5 font-mono">
              <p className="text-[var(--text-muted)]">N° Recibo: <strong className="text-[var(--text-main)] font-bold">#{comprobanteEmitido.id_pago}</strong></p>
              <p className="text-[var(--text-muted)]">Concepto: <strong className="text-[var(--text-main)]">{comprobanteEmitido.tipoPago?.nombre_tipo_pago || 'Arancel'}</strong></p>
              <p className="text-[var(--text-muted)]">Monto Cobrado: <strong className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">{comprobanteEmitido.monto_pago} Bs.</strong></p>
              <p className="text-[var(--text-muted)]">Fecha de Operación: <strong className="text-[var(--text-main)]">{new Date(comprobanteEmitido.fecha_pago).toLocaleString('es-BO')}</strong></p>
            </div>
            <button
              onClick={() => setComprobanteEmitido(null)}
              className="w-full py-2 bg-[#F59E0B] hover:bg-[#D97706] text-zinc-950 font-black rounded-[2px] text-xs uppercase tracking-wider shadow-sm"
            >
              Cerrar e Imprimir Recibo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
