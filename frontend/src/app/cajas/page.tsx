'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Landmark,
  Shield,
  Ticket,
  Clock,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  Users,
  Layers,
  Sparkles,
  RefreshCw,
  X,
  Play,
  Printer,
  TrendingUp,
  DollarSign,
  QrCode,
  ArrowRight
} from 'lucide-react';

interface Ventanilla {
  numero: number;
  nombre: string;
  operador: string;
  estado: 'ATENDIENDO' | 'DISPONIBLE' | 'EN_PAUSA';
  turnoActual?: string;
  clienteActual?: string;
  tipoTramite?: string;
}

interface TurnoEnCola {
  numero: string;
  cliente: string;
  ci: string;
  tipo: 'MILITAR' | 'CIVIL';
  tramite: string;
  horaLlegada: string;
}

interface TransaccionPago {
  id: string;
  hora: string;
  cliente: string;
  ci: string;
  concepto: string;
  monto: number;
  metodo: 'EFECTIVO' | 'QR' | 'BANCO_UNION' | 'EXENTO_MILITAR';
  ventanilla: number;
}

const VENTANILLAS_INICIALES: Ventanilla[] = [
  {
    numero: 1,
    nombre: 'Ventanilla 1 - Personal Militar',
    operador: 'Sgto. 1ro. Edgar Limachi',
    estado: 'ATENDIENDO',
    turnoActual: 'M-014',
    clienteActual: 'Cap. Carlos Mamani Quispe',
    tipoTramite: 'Beca Militar 100% / Asignación de Paralelo',
  },
  {
    numero: 2,
    nombre: 'Ventanilla 2 - Estudiantes Civiles',
    operador: 'Lic. Patricia Salinas',
    estado: 'ATENDIENDO',
    turnoActual: 'C-028',
    clienteActual: 'Valentina Sofía Rios',
    tipoTramite: 'Pago de Matrícula Regular Francés',
  },
  {
    numero: 3,
    nombre: 'Ventanilla 3 - Material & Certificaciones',
    operador: 'Sof. René Quisbert',
    estado: 'DISPONIBLE',
    turnoActual: '—',
    clienteActual: 'Disponible para llamada',
    tipoTramite: 'Venta de Textos / Emisión de Certificados',
  },
];

const TURNOS_EN_COLA_INICIALES: TurnoEnCola[] = [
  {
    numero: 'M-015',
    cliente: 'Subtte. Jorge Vargas',
    ci: '4920183 SC',
    tipo: 'MILITAR',
    tramite: 'Validación de Matrícula Militar',
    horaLlegada: '10:14',
  },
  {
    numero: 'C-029',
    cliente: 'Camila Andrea Montenegro',
    ci: '9120485 OR',
    tipo: 'CIVIL',
    tramite: 'Pago Matrícula Portugués Comercial',
    horaLlegada: '10:18',
  },
  {
    numero: 'M-016',
    cliente: 'Tte. Alejandro Gutiérrez',
    ci: '5829104 TJ',
    tipo: 'MILITAR',
    tramite: 'Adquisición de Libro Ruso Técnico',
    horaLlegada: '10:22',
  },
  {
    numero: 'C-030',
    cliente: 'Mariana Chávez Guzmán',
    ci: '7401928 CH',
    tipo: 'CIVIL',
    tramite: 'Examen de Suficiencia Alemán',
    horaLlegada: '10:25',
  },
];

const TRANSACCIONES_INICIALES: TransaccionPago[] = [
  {
    id: 'TRX-2026-891',
    hora: '10:10',
    cliente: 'Cap. Carlos Mamani',
    ci: '6849201 LP',
    concepto: 'Matrícula Militar Semestral',
    monto: 0,
    metodo: 'EXENTO_MILITAR',
    ventanilla: 1,
  },
  {
    id: 'TRX-2026-890',
    hora: '10:05',
    cliente: 'Valentina Rios',
    ci: '8392014 CB',
    concepto: 'Matrícula Civil Regular Francés',
    monto: 300,
    metodo: 'QR',
    ventanilla: 2,
  },
  {
    id: 'TRX-2026-889',
    hora: '09:52',
    cliente: 'Lic. Ana Blanco',
    ci: '4839201 LP',
    concepto: 'Texto American Headway Mil. Ed.',
    monto: 180,
    metodo: 'EFECTIVO',
    ventanilla: 3,
  },
  {
    id: 'TRX-2026-888',
    hora: '09:40',
    cliente: 'Subtte. Luis Mamani',
    ci: '7654321 LP',
    concepto: 'Certificado Oficial de Suficiencia',
    monto: 50,
    metodo: 'BANCO_UNION',
    ventanilla: 3,
  },
];

export default function CajasPage() {
  const [tabActiva, setTabActiva] = useState<'VENTANILLAS' | 'SIMULADOR'>('VENTANILLAS');
  const [ventanillas, setVentanillas] = useState<Ventanilla[]>(VENTANILLAS_INICIALES);
  const [colaTurnos, setColaTurnos] = useState<TurnoEnCola[]>(TURNOS_EN_COLA_INICIALES);
  const [transacciones, setTransacciones] = useState<TransaccionPago[]>(TRANSACCIONES_INICIALES);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Modales
  const [modalEmitirFicha, setModalEmitirFicha] = useState<boolean>(false);
  const [fichaGenerada, setFichaGenerada] = useState<TurnoEnCola | null>(null);
  const [formNombre, setFormNombre] = useState<string>('');
  const [formCi, setFormCi] = useState<string>('');
  const [formTipo, setFormTipo] = useState<'MILITAR' | 'CIVIL'>('MILITAR');
  const [formTramite, setFormTramite] = useState<string>('Matrícula Institucional');

  const [modalRegistrarPago, setModalRegistrarPago] = useState<boolean>(false);
  const [pagoCliente, setPagoCliente] = useState<string>('');
  const [pagoCi, setPagoCi] = useState<string>('');
  const [pagoConcepto, setPagoConcepto] = useState<string>('Matrícula Civil Regular');
  const [pagoMonto, setPagoMonto] = useState<number>(300);
  const [pagoMetodo, setPagoMetodo] = useState<'EFECTIVO' | 'QR' | 'BANCO_UNION' | 'EXENTO_MILITAR'>('QR');
  const [pagoVentanilla, setPagoVentanilla] = useState<number>(2);
  const [pagoFecha, setPagoFecha] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState<boolean>(true);

  // Parámetros de Simulación de Colas M/M/c (Quarkus)
  const [cServidores, setCServidores] = useState<number>(3); // c ventanillas
  const [lambdaTasaLlegada, setLambdaTasaLlegada] = useState<number>(36); // clientes/hora
  const [muTasaServicio, setMuTasaServicio] = useState<number>(18); // clientes/hora por ventanilla

  // Cálculos M/M/c
  const { rhoUtilizacion, wqTiempoEsperaMin, lqLongitudCola, estadoSistema } = useMemo(() => {
    const c = cServidores;
    const lambda = lambdaTasaLlegada;
    const mu = muTasaServicio;

    // Utilización rho = lambda / (c * mu)
    const rho = lambda / (c * mu);

    if (rho >= 1) {
      return {
        rhoUtilizacion: Math.round(rho * 100),
        wqTiempoEsperaMin: 99.9,
        lqLongitudCola: 99.9,
        estadoSistema: 'SATURADO_CRITICO',
      };
    }

    // Aproximación de tiempo medio en cola Wq (minutos)
    // Usando fórmula de colas multicanal Erlang-C aproximada
    const factorErlang = Math.pow(rho, Math.sqrt(2 * (c + 1)) - 1);
    const wqHoras = (factorErlang / (1 - rho)) * (1 / (c * mu));
    const wqMinutos = Math.max(Math.round(wqHoras * 60 * 10) / 10, 0.8);
    const lq = Math.round(lambda * wqHoras * 10) / 10;

    let estado = 'OPTIMO';
    if (rho > 0.8) estado = 'ALTA_DEMANDA';
    if (rho > 0.92) estado = 'SATURADO_CRITICO';

    return {
      rhoUtilizacion: Math.round(rho * 100),
      wqTiempoEsperaMin: wqMinutos,
      lqLongitudCola: lq,
      estadoSistema: estado,
    };
  }, [cServidores, lambdaTasaLlegada, muTasaServicio]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const cargarCajas = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/cajas');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const mapped: Ventanilla[] = data.map((c: any) => ({
          numero: c.numero_caja || c.id_caja,
          nombre: `Ventanilla ${c.numero_caja || c.id_caja} - ${c.nombre_caja || 'Caja CEDMIL'}`,
          operador: c.operador || 'Cajero Operativo',
          estado: (c.estado_caja === 'Abierta' ? 'DISPONIBLE' : 'EN_PAUSA') as any,
          turnoActual: '—',
          clienteActual: 'Disponible para llamada',
          tipoTramite: 'Atención general',
        }));
        setVentanillas(mapped);
      }
    } catch (err) {
      console.warn('Cajas cargadas en modo local:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCajas();
  }, []);

  const handleLlamarSiguienteTurno = (numeroVentanilla: number) => {
    if (colaTurnos.length === 0) {
      showToast('No hay más turnos en cola de espera.');
      return;
    }

    const siguiente = colaTurnos[0];
    const nuevaCola = colaTurnos.slice(1);
    setColaTurnos(nuevaCola);

    setVentanillas((prev) =>
      prev.map((v) =>
        v.numero === numeroVentanilla
          ? {
              ...v,
              estado: 'ATENDIENDO',
              turnoActual: siguiente.numero,
              clienteActual: siguiente.cliente,
              tipoTramite: siguiente.tramite,
            }
          : v
      )
    );

    showToast(`Ventanilla ${numeroVentanilla} llamó al turno ${siguiente.numero} (${siguiente.cliente}).`);
  };

  const handleLiberarVentanilla = (numeroVentanilla: number) => {
    setVentanillas((prev) =>
      prev.map((v) =>
        v.numero === numeroVentanilla
          ? {
              ...v,
              estado: 'DISPONIBLE',
              turnoActual: '—',
              clienteActual: 'Disponible para llamada',
              tipoTramite: 'Atención disponible',
            }
          : v
      )
    );
    showToast(`Ventanilla ${numeroVentanilla} quedó disponible.`);
  };

  const handleCrearFicha = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNombre || !formCi) {
      alert('Por favor complete nombre y carnet.');
      return;
    }

    const prefijo = formTipo === 'MILITAR' ? 'M' : 'C';
    const conteo = colaTurnos.filter((t) => t.tipo === formTipo).length + 15;
    const nuevoTurno: TurnoEnCola = {
      numero: `${prefijo}-0${conteo}`,
      cliente: formNombre,
      ci: formCi,
      tipo: formTipo,
      tramite: formTramite,
      horaLlegada: '10:32',
    };

    setColaTurnos([...colaTurnos, nuevoTurno]);
    setFichaGenerada(nuevoTurno);
    showToast(`Ficha de turno ${nuevoTurno.numero} emitida exitosamente.`);

    setFormNombre('');
    setFormCi('');
  };

  const handleRegistrarPago = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pagoCliente || !pagoCi) {
      alert('Por favor complete los campos obligatorios.');
      return;
    }

    const hoyStr = new Date().toISOString().split('T')[0];
    if (pagoFecha > hoyStr) {
      alert('Seguridad SACA: La fecha de cobro no puede ser futura (ej. 2028 no permitido).');
      return;
    }

    const nuevaTransaccion: TransaccionPago = {
      id: `TRX-2026-${Math.floor(Math.random() * 900) + 100}`,
      hora: '10:35',
      cliente: pagoCliente,
      ci: pagoCi,
      concepto: pagoConcepto,
      monto: pagoMonto,
      metodo: pagoMetodo,
      ventanilla: pagoVentanilla,
    };

    setTransacciones([nuevaTransaccion, ...transacciones]);
    setModalRegistrarPago(false);
    showToast(`Cobro registrado: ${pagoConcepto} por Bs. ${pagoMonto}.`);

    setPagoCliente('');
    setPagoCi('');
  };

  const totalRecaudadoHoy = transacciones.reduce((acc, t) => acc + t.monto, 0);

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

      {/* Header */}
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
              <Landmark size={12} /> Administración Financiera y Cajas
            </span>
            <span className="badge badge-blue">Motor M/M/c Quarkus</span>
          </div>
          <h1
            className="font-solemn"
            style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '0.02em' }}
          >
            Gestión de Cajas, Turnos y Colas M/M/c
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Atención al público en ventanillas de recaudación y modelado matemático de líneas de espera en tiempo real.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setModalEmitirFicha(true)}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
          >
            <Ticket size={15} style={{ color: 'var(--military-gold-primary)' }} />
            <span>Emitir Ficha de Turno</span>
          </button>

          <button
            onClick={() => setModalRegistrarPago(true)}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
          >
            <DollarSign size={15} />
            <span>Registrar Cobro</span>
          </button>
        </div>
      </div>

      {/* Selector de Pestaña Principal */}
      <div className="filter-tabs">
        <button
          onClick={() => setTabActiva('VENTANILLAS')}
          className={`filter-tab ${tabActiva === 'VENTANILLAS' ? 'active' : ''}`}
        >
          <Landmark size={14} />
          <span>Monitor de Ventanillas y Turnos en Vivo</span>
        </button>
        <button
          onClick={() => setTabActiva('SIMULADOR')}
          className={`filter-tab ${tabActiva === 'SIMULADOR' ? 'active' : ''}`}
        >
          <Sparkles size={14} />
          <span>Simulador Analítico de Colas M/M/c (Quarkus Engine)</span>
        </button>
      </div>

      {/* KPI Cards Globales */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 6,
              background: 'var(--military-blue-subtle)',
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <Clock size={22} />
          </div>
          <div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Tiempo Espera Actual
            </p>
            <p style={{ fontSize: '1.45rem', fontWeight: 800, color: '#38bdf8' }}>
              {wqTiempoEsperaMin} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>min</span>
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
            <Users size={22} />
          </div>
          <div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              En Fila de Espera
            </p>
            <p style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {colaTurnos.length} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>personas</span>
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
            <TrendingUp size={22} />
          </div>
          <div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Utilización ρ
            </p>
            <p style={{ fontSize: '1.45rem', fontWeight: 800, color: rhoUtilizacion > 80 ? '#f87171' : '#fbbf24' }}>
              {rhoUtilizacion}%
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
              Recaudación de Hoy
            </p>
            <p style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--military-gold-primary)' }}>
              Bs. {totalRecaudadoHoy}
            </p>
          </div>
        </div>
      </div>

      {/* =================================================================
          PESTAÑA 1: VENTANILLAS Y TURNOS EN VIVO
      ================================================================= */}
      {tabActiva === 'VENTANILLAS' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Tarjetas de Ventanillas */}
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.85rem' }}>
              Estado Operativo de Ventanillas de Atención
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.15rem' }}>
              {ventanillas.map((v) => {
                const enAtencion = v.estado === 'ATENDIENDO';
                return (
                  <div
                    key={v.numero}
                    className="card"
                    style={{
                      borderTop: enAtencion ? '3px solid var(--status-active)' : '3px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '1rem',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <div>
                          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                            {v.nombre}
                          </h3>
                          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Operador: {v.operador}</p>
                        </div>
                        <span className={enAtencion ? 'badge badge-military' : 'badge badge-gold'}>
                          {v.estado}
                        </span>
                      </div>

                      {/* Display del Turno Actual */}
                      <div
                        style={{
                          background: 'var(--bg-surface-elevated)',
                          borderRadius: '6px',
                          padding: '0.85rem',
                          textAlign: 'center',
                          border: '1px solid var(--border-subtle)',
                          marginTop: '0.5rem',
                        }}
                      >
                        <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          Turno en Atención
                        </p>
                        <p
                          className="font-solemn"
                          style={{
                            fontSize: '1.8rem',
                            fontWeight: 800,
                            color: enAtencion ? 'var(--military-gold-primary)' : 'var(--text-muted)',
                            margin: '0.2rem 0',
                          }}
                        >
                          {v.turnoActual}
                        </p>
                        <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>
                          {v.clienteActual}
                        </p>
                        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                          {v.tipoTramite}
                        </p>
                      </div>
                    </div>

                    {/* Acciones de la ventanilla */}
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleLlamarSiguienteTurno(v.numero)}
                        className="btn btn-primary"
                        style={{ flex: 1, padding: '0.45rem', fontSize: '0.78rem', justifyContent: 'center' }}
                      >
                        <Play size={13} /> Llamar Siguiente
                      </button>
                      {enAtencion && (
                        <button
                          onClick={() => handleLiberarVentanilla(v.numero)}
                          className="btn btn-secondary"
                          style={{ padding: '0.45rem 0.65rem', fontSize: '0.78rem' }}
                          title="Finalizar atención"
                        >
                          Liberar
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Fila de Espera y Transacciones */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem' }}>
            {/* Cola de Espera */}
            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Fila de Espera en Vivo
                  </h3>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Turnos aguardando llamada con prioridad institucional militar
                  </p>
                </div>
                <span className="badge badge-military">{colaTurnos.length} en espera</span>
              </div>

              {colaTurnos.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No hay usuarios en fila de espera.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {colaTurnos.map((turno, idx) => (
                    <div
                      key={turno.numero}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.65rem 0.85rem',
                        background: 'var(--bg-surface-elevated)',
                        borderRadius: '6px',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span
                          className="badge badge-gold"
                          style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '0.85rem', padding: '0.2rem 0.5rem' }}
                        >
                          {turno.numero}
                        </span>
                        <div>
                          <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                            {turno.cliente}
                          </p>
                          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                            {turno.ci} &bull; {turno.tramite}
                          </p>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span className={turno.tipo === 'MILITAR' ? 'badge badge-military' : 'badge badge-civil'} style={{ fontSize: '0.65rem' }}>
                          {turno.tipo === 'MILITAR' ? 'Prioridad Militar' : 'Civil'}
                        </span>
                        <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          Llegada: {turno.horaLlegada}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Transacciones de Recaudación del Día */}
            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Corte de Recaudación Diaria
                  </h3>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Aranceles de matrícula, certificados y libros cobrados hoy
                  </p>
                </div>
                <span className="badge badge-gold">Total: Bs. {totalRecaudadoHoy}</span>
              </div>

              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Hora / Código</th>
                      <th>Cliente</th>
                      <th>Concepto</th>
                      <th>Método</th>
                      <th style={{ textAlign: 'right' }}>Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transacciones.map((trx) => (
                      <tr key={trx.id}>
                        <td>
                          <div>
                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>{trx.hora}</span>
                            <p style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>{trx.id}</p>
                          </div>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>{trx.cliente}</span>
                          <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{trx.ci}</p>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-main)' }}>{trx.concepto}</span>
                        </td>
                        <td>
                          <span className="badge badge-military" style={{ fontSize: '0.65rem' }}>
                            {trx.metodo.replace('_', ' ')}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right', fontWeight: 700, color: trx.monto === 0 ? 'var(--status-active)' : 'var(--text-main)' }}>
                          {trx.monto === 0 ? 'Beca (Bs. 0)' : `Bs. ${trx.monto}`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================
          PESTAÑA 2: SIMULADOR ANALÍTICO DE COLAS M/M/c (QUARKUS)
      ================================================================= */}
      {tabActiva === 'SIMULADOR' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <Sparkles size={20} style={{ color: 'var(--military-gold-primary)' }} />
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Simulador del Microservicio Quarkus &bull; Teoría de Colas M/M/c
              </h2>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', maxWidth: '780px', marginBottom: '1.5rem' }}>
              Ajuste los parámetros del modelo estocástico de atención para evaluar el impacto en el tiempo de espera del personal militar y civil, dimensionando la cantidad óptima de ventanillas requeridas.
            </p>

            {/* Controles de Entrada */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
              
              {/* Servidores c */}
              <div style={{ background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Ventanillas Abiertas (c)
                  </label>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--military-gold-primary)' }}>
                    {cServidores} ventanillas
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="6"
                  step="1"
                  value={cServidores}
                  onChange={(e) => setCServidores(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--military-gold-primary)', cursor: 'pointer' }}
                />
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                  Capacidad simultánea de atención en cajas
                </p>
              </div>

              {/* Tasa Llegada Lambda */}
              <div style={{ background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Tasa de Llegada (&lambda;)
                  </label>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: '#38bdf8' }}>
                    {lambdaTasaLlegada} pers/hora
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="80"
                  step="2"
                  value={lambdaTasaLlegada}
                  onChange={(e) => setLambdaTasaLlegada(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#38bdf8', cursor: 'pointer' }}
                />
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                  Promedio de estudiantes que llegan a cajas por hora
                </p>
              </div>

              {/* Tasa Servicio Mu */}
              <div style={{ background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Tasa de Atención (&mu;)
                  </label>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--status-active)' }}>
                    {muTasaServicio} trámites/hora
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="35"
                  step="1"
                  value={muTasaServicio}
                  onChange={(e) => setMuTasaServicio(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--status-active)', cursor: 'pointer' }}
                />
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                  Velocidad media de procesamiento de cada cajero
                </p>
              </div>
            </div>

            {/* Presets Rápidos de Simulación */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '1.75rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Escenarios Institucionales:</span>
              <button
                onClick={() => {
                  setCServidores(3);
                  setLambdaTasaLlegada(36);
                  setMuTasaServicio(18);
                }}
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
              >
                Jornada Regular
              </button>
              <button
                onClick={() => {
                  setCServidores(4);
                  setLambdaTasaLlegada(65);
                  setMuTasaServicio(20);
                }}
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
              >
                Semana de Inscripciones Pico
              </button>
              <button
                onClick={() => {
                  setCServidores(2);
                  setLambdaTasaLlegada(20);
                  setMuTasaServicio(18);
                }}
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
              >
                Turno Tarde / Trámites Ligeros
              </button>
            </div>

            {/* Resultados Analíticos del Modelo */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.15rem', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Factor de Utilización (&rho;)
                </p>
                <p style={{ fontSize: '1.8rem', fontWeight: 800, color: rhoUtilizacion > 85 ? '#f87171' : 'var(--text-main)', margin: '0.2rem 0' }}>
                  {rhoUtilizacion}%
                </p>
                <p style={{ fontSize: '0.72rem', color: rhoUtilizacion > 85 ? '#f87171' : 'var(--status-active)' }}>
                  {rhoUtilizacion > 85 ? '⚠ Alto riesgo de cola infinita' : '✓ Capacidad balanceada'}
                </p>
              </div>

              <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.15rem', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Tiempo Medio en Cola (Wq)
                </p>
                <p style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8', margin: '0.2rem 0' }}>
                  {wqTiempoEsperaMin} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>min</span>
                </p>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Tiempo de espera antes de ser llamado
                </p>
              </div>

              <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.15rem', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Longitud Media de Fila (Lq)
                </p>
                <p style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fbbf24', margin: '0.2rem 0' }}>
                  {lqLongitudCola} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>personas</span>
                </p>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Personas estimadas esperando turno
                </p>
              </div>

              <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.15rem', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Dictamen Quarkus
                </p>
                <p style={{ fontSize: '1.25rem', fontWeight: 800, color: estadoSistema === 'OPTIMO' ? 'var(--status-active)' : '#fbbf24', margin: '0.4rem 0' }}>
                  {estadoSistema === 'OPTIMO' ? 'VENTANILLAS ÓPTIMAS' : estadoSistema === 'ALTA_DEMANDA' ? 'DEMANDA ELEVADA' : 'SATURACIÓN CRÍTICA'}
                </p>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {cServidores} servidores satisfacen la demanda
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================
          MODAL DE EMISIÓN DE FICHA DE TURNO
      ================================================================= */}
      {modalEmitirFicha && (
        <div className="modal-overlay" onClick={() => setModalEmitirFicha(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Ticket size={18} style={{ color: 'var(--military-gold-primary)' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Dispensador de Turnos Institucional
                </h3>
              </div>
              <button onClick={() => setModalEmitirFicha(false)} className="btn-icon btn-ghost">
                <X size={18} />
              </button>
            </div>

            {fichaGenerada ? (
              <div style={{ padding: '1.5rem', textAlign: 'center' }}>
                <div style={{ background: '#ffffff', color: '#0f172a', padding: '1.5rem', borderRadius: '6px', border: '2px dashed #334155', marginBottom: '1.25rem' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' }}>ESCUELA DE IDIOMAS DEL EJÉRCITO</p>
                  <p style={{ fontSize: '0.7rem', color: '#475569' }}>Comando de Educación y Doctrina Militar</p>
                  
                  <div style={{ margin: '1rem 0', borderTop: '1px solid #cbd5e1', borderBottom: '1px solid #cbd5e1', padding: '0.75rem 0' }}>
                    <p style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748b' }}>SU TURNO DE ATENCIÓN ES:</p>
                    <p className="font-solemn" style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1b4332', lineHeight: 1 }}>
                      {fichaGenerada.numero}
                    </p>
                    <p style={{ fontSize: '0.78rem', fontWeight: 700, marginTop: '0.25rem' }}>{fichaGenerada.cliente}</p>
                    <p style={{ fontSize: '0.72rem', color: '#475569' }}>{fichaGenerada.tramite}</p>
                  </div>

                  <p style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    Tiempo estimado de espera: <strong>{wqTiempoEsperaMin} min</strong>
                  </p>
                  <p style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                    Fecha: 14 Oct 2026 &bull; {fichaGenerada.horaLlegada}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.65rem', justifyContent: 'center' }}>
                  <button onClick={() => window.print()} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Printer size={15} /> Imprimir Ficha
                  </button>
                  <button onClick={() => { setFichaGenerada(null); setModalEmitirFicha(false); }} className="btn btn-primary">
                    Entendido
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCrearFicha} style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="input-label">Categoría del Usuario</label>
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
                      <Users size={14} /> Particular Civil
                    </button>
                  </div>
                </div>

                <div>
                  <label className="input-label">Nombres y Apellidos *</label>
                  <input
                    type="text"
                    value={formNombre}
                    onChange={(e) => setFormNombre(e.target.value)}
                    placeholder="Ej. Tte. Luis Morales / María Prado"
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="input-label">Cédula de Identidad *</label>
                  <input
                    type="text"
                    value={formCi}
                    onChange={(e) => setFormCi(e.target.value)}
                    placeholder="Ej. 6849201 LP"
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="input-label">Tipo de Trámite a Realizar</label>
                  <select
                    value={formTramite}
                    onChange={(e) => setFormTramite(e.target.value)}
                    className="input"
                  >
                    <option value="Matrícula Institucional Militar">Matrícula Institucional Militar (Beca 100%)</option>
                    <option value="Pago Matrícula Civil Regular">Pago Matrícula Civil Regular (Bs. 300)</option>
                    <option value="Adquisición de Texto de Idioma">Adquisición de Texto de Idioma (Bs. 180)</option>
                    <option value="Certificado de Calificaciones">Certificado de Calificaciones (Bs. 50)</option>
                    <option value="Examen de Nivelación">Examen de Nivelación (Bs. 120)</option>
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '0.5rem' }}>
                  <button type="button" onClick={() => setModalEmitirFicha(false)} className="btn btn-secondary">
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <Ticket size={15} />
                    <span>Generar Ficha</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* =================================================================
          MODAL DE REGISTRO DE PAGO / COBRO
      ================================================================= */}
      {modalRegistrarPago && (
        <div className="modal-overlay" onClick={() => setModalRegistrarPago(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <DollarSign size={18} style={{ color: 'var(--military-gold-primary)' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Registrar Cobro de Arancel
                </h3>
              </div>
              <button onClick={() => setModalRegistrarPago(false)} className="btn-icon btn-ghost">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRegistrarPago} style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="input-label">Nombre del Estudiante *</label>
                <input
                  type="text"
                  value={pagoCliente}
                  onChange={(e) => setPagoCliente(e.target.value)}
                  placeholder="Ej. Valentina Rios / Subtte. Vargas"
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="input-label">Cédula de Identidad *</label>
                <input
                  type="text"
                  value={pagoCi}
                  onChange={(e) => setPagoCi(e.target.value)}
                  placeholder="Ej. 8392014 CB"
                  className="input"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label className="input-label">Concepto de Arancel</label>
                  <select
                    value={pagoConcepto}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPagoConcepto(val);
                      if (val.includes('Matrícula Civil')) setPagoMonto(300);
                      else if (val.includes('Texto')) setPagoMonto(180);
                      else if (val.includes('Certificado')) setPagoMonto(50);
                      else if (val.includes('Examen')) setPagoMonto(120);
                      else if (val.includes('Militar')) setPagoMonto(0);
                    }}
                    className="input"
                  >
                    <option value="Matrícula Civil Regular">Matrícula Civil Regular</option>
                    <option value="Matrícula Militar (Beca 100%)">Matrícula Militar (Beca 100%)</option>
                    <option value="Texto Oficial de Idioma">Texto Oficial de Idioma</option>
                    <option value="Certificado de Suficiencia">Certificado de Suficiencia</option>
                    <option value="Examen de Nivelación">Examen de Nivelación</option>
                  </select>
                </div>

                <div>
                  <label className="input-label">Monto (Bs.)</label>
                  <input
                    type="number"
                    min="0"
                    value={pagoMonto}
                    onChange={(e) => setPagoMonto(Number(e.target.value))}
                    className="input"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label className="input-label">Forma de Pago</label>
                  <select
                    value={pagoMetodo}
                    onChange={(e) => setPagoMetodo(e.target.value as any)}
                    className="input"
                  >
                    <option value="QR">Pago QR Simple</option>
                    <option value="EFECTIVO">Efectivo en Ventanilla</option>
                    <option value="BANCO_UNION">Transferencia Banco Unión</option>
                    <option value="EXENTO_MILITAR">Exento por Beca Militar</option>
                  </select>
                </div>

                <div>
                  <label className="input-label">Ventanilla Receptora</label>
                  <select
                    value={pagoVentanilla}
                    onChange={(e) => setPagoVentanilla(Number(e.target.value))}
                    className="input"
                  >
                    <option value={1}>Ventanilla 1 (Militar)</option>
                    <option value={2}>Ventanilla 2 (Civiles)</option>
                    <option value={3}>Ventanilla 3 (Material)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="input-label">Fecha de Comprobante / Cobro * (Máx: Hoy)</label>
                <input
                  type="date"
                  value={pagoFecha}
                  max={new Date().toISOString().split('T')[0]}
                  min="2020-01-01"
                  onChange={(e) => {
                    const val = e.target.value;
                    const hoyStr = new Date().toISOString().split('T')[0];
                    if (val > hoyStr) {
                      alert('Seguridad SACA: No se permiten fechas de comprobante futuras (ej. 2028).');
                      setPagoFecha(hoyStr);
                    } else {
                      setPagoFecha(val);
                    }
                  }}
                  className="input"
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setModalRegistrarPago(false)} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <CheckCircle2 size={15} />
                  <span>Confirmar y Emitir Recibo</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
