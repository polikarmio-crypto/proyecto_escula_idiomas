'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Package,
  Search,
  AlertTriangle,
  CheckCircle2,
  Plus,
  RefreshCw,
  ShieldAlert,
  X,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  ArrowUpDown,
  Truck
} from 'lucide-react';
import { useAuthRole } from '@/context/AuthRoleContext';

const PER_PAGE = 7;
const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

export default function AlmacenPage() {
  const { esAlmacenero, esAdmin, rolConfig } = useAuthRole();
  const puedeOperarAlmacen = esAlmacenero || esAdmin;

  const [loading, setLoading] = useState(false);
  const [inventario, setInventario] = useState<any[]>([]);
  const [resumen, setResumen] = useState<any | null>(null);
  const [alertasRop, setAlertasRop] = useState<any[]>([]);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [alerta, setAlerta] = useState<{ tipo: 'ok' | 'error'; mensaje: string } | null>(null);

  const [tab, setTab] = useState<'stock' | 'alertas' | 'pedidos'>('stock');
  const [busqueda, setBusqueda] = useState('');
  const [pageStock, setPageStock] = useState(1);
  const [pagePedidos, setPagePedidos] = useState(1);
  const [pageAlertas, setPageAlertas] = useState(1);

  const [modalMovimiento, setModalMovimiento] = useState(false);
  const [modalPedido, setModalPedido] = useState(false);

  const [formMov, setFormMov] = useState({
    id_almacen_libro: 1,
    tipo: 'Salida' as 'Entrada' | 'Salida',
    cantidad: 10,
    motivo: 'Entrega para inicio de ciclo académico',
  });

  const [formPed, setFormPed] = useState({
    id_almacen_libro: 1,
    cantidad: 50,
  });

  const mostrarMensaje = (tipo: 'ok' | 'error', mensaje: string) => {
    setAlerta({ tipo, mensaje });
    setTimeout(() => setAlerta(null), 5000);
  };

  const cargarDatosAlmacen = async () => {
    setLoading(true);
    try {
      const [resStock, resRop, resPed] = await Promise.all([
        fetch(`${API_BASE}/almacen/stock`).catch(() => null),
        fetch(`${API_BASE}/almacen/alertas-rop`).catch(() => null),
        fetch(`${API_BASE}/almacen/pedidos`).catch(() => null),
      ]);

      if (resStock && resStock.ok) {
        const dataS = await resStock.json();
        const inv = dataS.inventario || [];
        setInventario(inv);
        setResumen(dataS.resumen);
        if (inv.length > 0 && formMov.id_almacen_libro === 1) {
          setFormMov((f) => ({ ...f, id_almacen_libro: inv[0].id_almacen_libro }));
          setFormPed((f) => ({ ...f, id_almacen_libro: inv[0].id_almacen_libro }));
        }
      }

      if (resRop && resRop.ok) {
        const dataR = await resRop.json();
        setAlertasRop(dataR.alertas || []);
      }

      if (resPed && resPed.ok) {
        const dataP = await resPed.json();
        const listaPedidos = Array.isArray(dataP) ? dataP : (dataP.data || []);
        setPedidos(listaPedidos);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatosAlmacen();
  }, []);

  const handleRegistrarMovimiento = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/almacen/movimiento`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formMov),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al registrar movimiento.');
      mostrarMensaje('ok', data.message || 'Movimiento registrado exitosamente.');
      setModalMovimiento(false);
      cargarDatosAlmacen();
    } catch (err: any) {
      mostrarMensaje('error', err.message);
    }
  };

  const handleCrearPedido = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/almacen/pedidos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formPed),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al emitir orden de reposición.');
      mostrarMensaje('ok', data.message || 'Orden emitida exitosamente.');
      setModalPedido(false);
      cargarDatosAlmacen();
    } catch (err: any) {
      mostrarMensaje('error', err.message);
    }
  };

  const handleRecibirPedido = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/almacen/pedidos/${id}/recibir`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al recepcionar pedido.');
      mostrarMensaje('ok', data.message || 'Lote recepcionado.');
      cargarDatosAlmacen();
    } catch (err: any) {
      mostrarMensaje('error', err.message);
    }
  };

  useEffect(() => {
    setPageStock(1);
  }, [busqueda]);

  const inventarioFiltrado = useMemo(() => {
    return inventario.filter((item) => {
      if (!busqueda.trim()) return true;
      const q = busqueda.toLowerCase().trim();
      return (
        item.libro?.toLowerCase().includes(q) ||
        item.idioma?.toLowerCase().includes(q) ||
        item.nivel?.toLowerCase().includes(q)
      );
    });
  }, [inventario, busqueda]);

  const totalPagesStock = Math.max(1, Math.ceil(inventarioFiltrado.length / PER_PAGE));
  const inventarioPaginado = useMemo(() => {
    const start = (pageStock - 1) * PER_PAGE;
    return inventarioFiltrado.slice(start, start + PER_PAGE);
  }, [inventarioFiltrado, pageStock]);

  const pedidosValidos = useMemo(() => Array.isArray(pedidos) ? pedidos : [], [pedidos]);
  const totalPagesPedidos = Math.max(1, Math.ceil(pedidosValidos.length / PER_PAGE));
  const pedidosPaginados = useMemo(() => {
    const start = (pagePedidos - 1) * PER_PAGE;
    return pedidosValidos.slice(start, start + PER_PAGE);
  }, [pedidosValidos, pagePedidos]);

  const totalPagesAlertas = Math.max(1, Math.ceil(alertasRop.length / PER_PAGE));
  const alertasPaginadas = useMemo(() => {
    const start = (pageAlertas - 1) * PER_PAGE;
    return alertasRop.slice(start, start + PER_PAGE);
  }, [alertasRop, pageAlertas]);

  if (!puedeOperarAlmacen) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-[var(--bg-card)] border border-red-500/40 rounded-[3px] p-8 text-center space-y-4 shadow-xs">
          <ShieldAlert className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto" />
          <h2 className="text-xl font-bold text-[var(--text-main)] font-sans">Acceso Restringido</h2>
          <p className="text-xs text-[var(--text-muted)] max-w-xl mx-auto">
            La administración de existencias de material bibliográfico corresponde al{' '}
            <strong className="text-[var(--color-accent)] font-mono">Encargado de Almacén</strong>.
            Rol actual: <span className="px-2 py-0.5 rounded bg-[var(--bg-surface)] text-[var(--color-accent)] font-mono font-bold">{rolConfig.titulo}</span>.
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
            <Package className="w-3.5 h-3.5" />
            <span>SACA / Almacén</span>
          </div>

          <div className="h-4 w-[1px] bg-[var(--border-fine)] shrink-0" />

          {/* Selector de Pestañas Inline */}
          <div className="flex items-center gap-1 bg-[var(--bg-surface)] p-0.5 rounded border border-[var(--border-fine)] shrink-0">
            <button
              onClick={() => setTab('stock')}
              className={`px-2.5 py-0.5 rounded text-[11px] font-bold transition font-mono ${
                tab === 'stock'
                  ? 'bg-[var(--military-green-primary)] text-white'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Inventario ({inventario.length})
            </button>
            <button
              onClick={() => setTab('alertas')}
              className={`px-2.5 py-0.5 rounded text-[11px] font-bold transition font-mono flex items-center gap-1 ${
                tab === 'alertas'
                  ? 'bg-amber-600 text-white'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <span>Alertas</span>
              {alertasRop.length > 0 && (
                <span className="px-1 py-0.1 rounded-full bg-red-600 text-white text-[9.5px]">
                  {alertasRop.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setTab('pedidos')}
              className={`px-2.5 py-0.5 rounded text-[11px] font-bold transition font-mono ${
                tab === 'pedidos'
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Órdenes ({pedidosValidos.length})
            </button>
          </div>

          {/* Micro-telemetría inline */}
          <div className="hidden xl:flex items-center gap-2 text-[10.5px] font-mono text-[var(--text-muted)] border-l border-[var(--border-fine)] pl-2">
            <span>Stock: <strong className="text-[var(--text-main)]">{resumen?.total_unidades || 0}</strong></span>
            <span>•</span>
            <span>Títulos: <strong className="text-[var(--text-main)]">{resumen?.total_titulos || 0}</strong></span>
            <span>•</span>
            <span className="text-amber-600 dark:text-amber-400">Reorden: <strong>{resumen?.bajo_rop || 0}</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {tab === 'stock' && (
            <div className="relative w-36 sm:w-52">
              <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Buscar libro, nivel..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-fine)] rounded pl-8 pr-2 py-1 text-xs text-[var(--text-main)] outline-none font-sans"
              />
            </div>
          )}

          <button
            onClick={() => setModalMovimiento(true)}
            className="btn btn-primary"
            style={{ padding: '0.2rem 0.65rem', fontSize: '0.72rem', height: '28px' }}
          >
            <ArrowUpDown className="w-3 h-3" />
            <span className="hidden sm:inline">Entrada / Salida</span>
          </button>

          <button
            onClick={cargarDatosAlmacen}
            disabled={loading}
            className="btn btn-secondary"
            style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem', height: '28px' }}
            title="Sincronizar Stock"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
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
          {alerta.tipo === 'ok' ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : <AlertTriangle className="w-3.5 h-3.5 shrink-0" />}
          <span>{alerta.mensaje}</span>
        </div>
      )}

      {/* 2. ÁREA DE TABLA COMPACTA PAGINADA */}
      <div className="workspace-main-panel flex-1 min-h-0 flex flex-col overflow-hidden m-2 border border-[var(--border-fine)] rounded-[2px] bg-[var(--bg-card)]">
        {tab === 'stock' && (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="workspace-table-container flex-1 min-h-0 overflow-y-auto">
              <table className="compact-table">
                <thead>
                  <tr>
                    <th>Título / Texto Guía</th>
                    <th>Idioma & Nivel</th>
                    <th className="text-center">Stock Físico</th>
                    <th className="text-center">Umbral ROP</th>
                    <th className="text-center">Mínimo</th>
                    <th className="text-center">Estado</th>
                    <th className="text-right">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {inventarioPaginado.map((item) => (
                    <tr key={item.id_almacen_libro}>
                      <td>
                        <div className="font-bold text-[var(--text-main)] truncate max-w-[280px]">
                          {item.libro}
                        </div>
                        <span className="text-[10px] text-[var(--text-muted)] font-mono">
                          ID: #{item.id_almacen_libro}
                        </span>
                      </td>
                      <td>
                        <span className="font-semibold text-xs text-[var(--text-main)]">{item.idioma}</span>
                        <p className="text-[10px] text-[var(--text-muted)] font-mono">{item.nivel} • {item.programa}</p>
                      </td>
                      <td className="text-center font-mono text-xs font-black text-[var(--text-main)] tabular-nums">
                        {item.stock_actual} unids.
                      </td>
                      <td className="text-center font-mono text-xs text-amber-600 dark:text-amber-400 font-bold tabular-nums">
                        {item.punto_reorden_rop} unids.
                      </td>
                      <td className="text-center font-mono text-xs text-[var(--text-muted)] tabular-nums">
                        {item.stock_minimo} unids.
                      </td>
                      <td className="text-center">
                        {item.alerta_critica ? (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-red-950/30 text-red-500 border border-red-500/30">
                            CRÍTICO
                          </span>
                        ) : item.requiere_reposicion ? (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950/30 text-amber-500 border border-amber-500/30">
                            POR REPONER
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950/30 text-emerald-500 border border-emerald-500/30">
                            ÓPTIMO
                          </span>
                        )}
                      </td>
                      <td className="text-right">
                        {item.requiere_reposicion ? (
                          <button
                            onClick={() => {
                              setFormPed({ id_almacen_libro: item.id_almacen_libro, cantidad: 50 });
                              setModalPedido(true);
                            }}
                            className="btn btn-secondary text-[10px] font-mono font-bold py-1 px-2"
                          >
                            + Reposición
                          </button>
                        ) : (
                          <span className="text-[10.5px] font-mono text-[var(--text-muted)]">Normal</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {inventarioFiltrado.length === 0 && !loading && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-[var(--text-muted)]">
                        No se encontraron libros en inventario.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Paginación Táctica Fija */}
            <div className="tactical-pagination">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[var(--military-gold-primary)] font-mono">TOTAL:</span>
                <span className="font-mono text-xs">{inventarioFiltrado.length} TÍTULOS EN DEPÓSITO</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPageStock((p) => Math.max(1, p - 1))}
                  disabled={pageStock <= 1}
                  className="btn btn-secondary text-xs px-2 py-0.5"
                >
                  <ChevronLeft className="w-3 h-3" />
                  <span className="hidden sm:inline">Anterior</span>
                </button>
                <span className="px-2 font-mono text-xs font-bold text-[var(--text-main)]">
                  {pageStock} / {totalPagesStock}
                </span>
                <button
                  onClick={() => setPageStock((p) => Math.min(totalPagesStock, p + 1))}
                  disabled={pageStock >= totalPagesStock}
                  className="btn btn-secondary text-xs px-2 py-0.5"
                >
                  <span className="hidden sm:inline">Siguiente</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        )}

        {tab === 'alertas' && (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="workspace-table-container flex-1 min-h-0 overflow-y-auto">
              <table className="compact-table">
                <thead>
                  <tr>
                    <th>Texto Guía</th>
                    <th>Idioma</th>
                    <th className="text-center">Stock Actual</th>
                    <th className="text-center">Umbral ROP</th>
                    <th className="text-center">Déficit</th>
                    <th className="text-center">Sugerencia Compra</th>
                    <th className="text-right">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {alertasPaginadas.map((a) => (
                    <tr key={a.id_almacen_libro}>
                      <td className="font-bold text-[var(--text-main)]">{a.libro}</td>
                      <td className="text-xs text-[var(--text-muted)] font-mono">{a.idioma}</td>
                      <td className="text-center font-mono font-bold text-red-500">{a.stock_actual}</td>
                      <td className="text-center font-mono text-amber-500">{a.punto_reorden}</td>
                      <td className="text-center font-mono text-[var(--text-main)]">{a.deficit_unidades} unids.</td>
                      <td className="text-center font-mono font-bold text-[var(--color-accent)]">{a.sugerencia_pedido} unids.</td>
                      <td className="text-right">
                        <button
                          onClick={() => {
                            setFormPed({ id_almacen_libro: a.id_almacen_libro, cantidad: a.sugerencia_pedido || 50 });
                            setModalPedido(true);
                          }}
                          className="btn btn-primary text-xs font-bold py-1 px-2.5"
                        >
                          Emitir Orden
                        </button>
                      </td>
                    </tr>
                  ))}
                  {alertasRop.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-[var(--text-muted)]">
                        Todos los títulos se encuentran con existencias suficientes.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="tactical-pagination">
              <span className="font-mono text-xs">{alertasRop.length} ALERTAS ACTIVAS</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPageAlertas((p) => Math.max(1, p - 1))}
                  disabled={pageAlertas <= 1}
                  className="btn btn-secondary text-xs px-2 py-0.5"
                >
                  <ChevronLeft className="w-3 h-3" />
                </button>
                <span className="px-2 font-mono text-xs font-bold">{pageAlertas} / {totalPagesAlertas}</span>
                <button
                  onClick={() => setPageAlertas((p) => Math.min(totalPagesAlertas, p + 1))}
                  disabled={pageAlertas >= totalPagesAlertas}
                  className="btn btn-secondary text-xs px-2 py-0.5"
                >
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        )}

        {tab === 'pedidos' && (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="workspace-table-container flex-1 min-h-0 overflow-y-auto">
              <table className="compact-table">
                <thead>
                  <tr>
                    <th>ID Orden</th>
                    <th>Texto Solicitado</th>
                    <th className="text-center">Cantidad</th>
                    <th>Fecha</th>
                    <th className="text-center">Estado</th>
                    <th className="text-right">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidosPaginados.map((p) => (
                    <tr key={p.id_pedido}>
                      <td className="font-mono font-bold text-[var(--color-accent)]">#{p.id_pedido}</td>
                      <td className="font-semibold text-[var(--text-main)] truncate max-w-[280px]">
                        {p.almacen_libro?.libro?.nombre_libro || `Libro N° ${p.id_almacen_libro}`}
                      </td>
                      <td className="text-center font-mono font-bold text-[var(--text-main)]">{p.cantidad_pedido} unids.</td>
                      <td className="font-mono text-xs text-[var(--text-muted)]">{p.fecha_pedido}</td>
                      <td className="text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          p.estado_pedido === 'Recibido'
                            ? 'bg-emerald-950/30 text-emerald-500 border border-emerald-500/30'
                            : 'bg-amber-950/30 text-amber-500 border border-amber-500/30'
                        }`}>
                          {p.estado_pedido}
                        </span>
                      </td>
                      <td className="text-right">
                        {p.estado_pedido === 'Pendiente' && (
                          <button
                            onClick={() => handleRecibirPedido(p.id_pedido)}
                            className="btn btn-primary text-xs font-bold py-1 px-2.5"
                          >
                            Confirmar Ingreso
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {pedidosValidos.length === 0 && !loading && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-[var(--text-muted)]">
                        No se han registrado órdenes de reposición.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="tactical-pagination">
              <span className="font-mono text-xs">{pedidosValidos.length} ÓRDENES REGISTRADAS</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPagePedidos((p) => Math.max(1, p - 1))}
                  disabled={pagePedidos <= 1}
                  className="btn btn-secondary text-xs px-2 py-0.5"
                >
                  <ChevronLeft className="w-3 h-3" />
                </button>
                <span className="px-2 font-mono text-xs font-bold">{pagePedidos} / {totalPagesPedidos}</span>
                <button
                  onClick={() => setPagePedidos((p) => Math.min(totalPagesPedidos, p + 1))}
                  disabled={pagePedidos >= totalPagesPedidos}
                  className="btn btn-secondary text-xs px-2 py-0.5"
                >
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL MOVIMIENTO (ENTRADA / SALIDA) */}
      {modalMovimiento && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border-fine)] rounded-[3px] w-full max-w-md p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-[var(--border-fine)] pb-2.5">
              <h3 className="text-sm font-bold text-[var(--text-main)] font-sans">
                Registrar Movimiento de Depósito
              </h3>
              <button onClick={() => setModalMovimiento(false)} className="text-[var(--text-muted)] hover:text-[var(--text-main)]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRegistrarMovimiento} className="space-y-3 text-xs">
              <div>
                <label className="text-[var(--text-muted)] block mb-1 font-mono text-[11px]">Texto Guía</label>
                <select
                  value={formMov.id_almacen_libro}
                  onChange={(e) => setFormMov({ ...formMov, id_almacen_libro: parseInt(e.target.value) || 1 })}
                  className="w-full bg-[var(--bg-surface)] border border-[var(--border-fine)] rounded px-2.5 py-1.5 text-xs text-[var(--text-main)] font-mono"
                >
                  {inventario.map((i) => (
                    <option key={i.id_almacen_libro} value={i.id_almacen_libro}>
                      {i.libro} ({i.idioma}) — Existencias: {i.stock_actual}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[var(--text-muted)] block mb-1 font-mono text-[11px]">Tipo de Operación</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormMov({ ...formMov, tipo: 'Salida' })}
                    className={`py-1.5 rounded font-bold border text-center transition font-mono text-xs ${
                      formMov.tipo === 'Salida'
                        ? 'bg-red-600 text-white border-red-500'
                        : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border-fine)]'
                    }`}
                  >
                    Salida (Entrega)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormMov({ ...formMov, tipo: 'Entrada' })}
                    className={`py-1.5 rounded font-bold border text-center transition font-mono text-xs ${
                      formMov.tipo === 'Entrada'
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border-fine)]'
                    }`}
                  >
                    Entrada (Ingreso)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[var(--text-muted)] block mb-1 font-mono text-[11px]">Cantidad de Ejemplares</label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={formMov.cantidad}
                  onChange={(e) => setFormMov({ ...formMov, cantidad: parseInt(e.target.value) || 1 })}
                  className="w-full bg-[var(--bg-surface)] border border-[var(--border-fine)] rounded px-2.5 py-1.5 text-xs text-[var(--text-main)] font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-[var(--text-muted)] block mb-1 font-mono text-[11px]">Motivo / Justificación</label>
                <input
                  type="text"
                  placeholder="Ej: Asignación a paralelo académico"
                  value={formMov.motivo}
                  onChange={(e) => setFormMov({ ...formMov, motivo: e.target.value })}
                  className="w-full bg-[var(--bg-surface)] border border-[var(--border-fine)] rounded px-2.5 py-1.5 text-xs text-[var(--text-main)]"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2.5 border-t border-[var(--border-fine)]">
                <button
                  type="button"
                  onClick={() => setModalMovimiento(false)}
                  className="btn btn-secondary text-xs px-3 py-1"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary text-xs font-bold px-4 py-1"
                >
                  Registrar Movimiento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PEDIDO / ORDEN */}
      {modalPedido && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border-fine)] rounded-[3px] w-full max-w-md p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-[var(--border-fine)] pb-2.5">
              <h3 className="text-sm font-bold text-[var(--text-main)] font-sans">
                Solicitud de Reposición Bibliográfica
              </h3>
              <button onClick={() => setModalPedido(false)} className="text-[var(--text-muted)] hover:text-[var(--text-main)]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCrearPedido} className="space-y-3 text-xs">
              <div>
                <label className="text-[var(--text-muted)] block mb-1 font-mono text-[11px]">Texto a Solicitar</label>
                <select
                  value={formPed.id_almacen_libro}
                  onChange={(e) => setFormPed({ ...formPed, id_almacen_libro: parseInt(e.target.value) || 1 })}
                  className="w-full bg-[var(--bg-surface)] border border-[var(--border-fine)] rounded px-2.5 py-1.5 text-xs text-[var(--text-main)] font-mono"
                >
                  {inventario.map((i) => (
                    <option key={i.id_almacen_libro} value={i.id_almacen_libro}>
                      {i.libro} — Stock: {i.stock_actual}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[var(--text-muted)] block mb-1 font-mono text-[11px]">Cantidad Requerida</label>
                <input
                  type="number"
                  min="10"
                  max="500"
                  step="10"
                  value={formPed.cantidad}
                  onChange={(e) => setFormPed({ ...formPed, cantidad: parseInt(e.target.value) || 10 })}
                  className="w-full bg-[var(--bg-surface)] border border-[var(--border-fine)] rounded px-2.5 py-1.5 text-xs text-[var(--text-main)] font-mono font-bold"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2.5 border-t border-[var(--border-fine)]">
                <button
                  type="button"
                  onClick={() => setModalPedido(false)}
                  className="btn btn-secondary text-xs px-3 py-1"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary text-xs font-bold px-4 py-1"
                >
                  Emitir Orden
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
