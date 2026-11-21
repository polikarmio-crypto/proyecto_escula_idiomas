'use client';

import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Activity,
  Sliders,
  Users,
  GraduationCap,
  AlertTriangle,
  Server,
  RotateCcw,
  RefreshCw,
  LineChart
} from 'lucide-react';

interface PuntoDato {
  id: number;
  x: number;
  y: number;
  etiqueta?: string;
}

interface CalificacionRegistro {
  libro: number;
  nota: number;
}

export default function MetodosNumericosPage() {
  const [tabActiva, setTabActiva] = useState<'PROYECCION' | 'CAPACIDAD' | 'VENTANILLAS' | 'MONITOREO'>('PROYECCION');

  const SERIE_DEMANDA: PuntoDato[] = [
    { id: 1, x: 1, y: 45, etiqueta: 'Enero' },
    { id: 2, x: 2, y: 52, etiqueta: 'Febrero' },
    { id: 3, x: 3, y: 68, etiqueta: 'Marzo' },
    { id: 4, x: 4, y: 74, etiqueta: 'Abril' },
    { id: 5, x: 5, y: 88, etiqueta: 'Mayo' },
    { id: 6, x: 6, y: 95, etiqueta: 'Junio' },
  ];

  const [puntos, setPuntos] = useState<PuntoDato[]>(SERIE_DEMANDA);
  const [horizonteEstimacion, setHorizonteEstimacion] = useState<number>(7);

  const resultadoTendencia = useMemo(() => {
    const n = puntos.length;
    if (n < 2) return null;

    let sumX = 0, sumY = 0, sumX2 = 0, sumXY = 0;
    for (const p of puntos) {
      sumX += p.x;
      sumY += p.y;
      sumX2 += (p.x * p.x);
      sumXY += (p.x * p.y);
    }

    const mediaX = sumX / n;
    const mediaY = sumY / n;
    const denM = (n * sumX2) - (sumX * sumX);
    if (Math.abs(denM) < 1e-9) return null;

    const m = ((n * sumXY) - (sumX * sumY)) / denM;
    const b = mediaY - (m * mediaX);

    let varianzaError = 0;
    let varianzaTotal = 0;

    const filasDetalle = puntos.map((p) => {
      const estimado = m * p.x + b;
      const diferencia = p.y - estimado;
      varianzaError += (diferencia * diferencia);
      varianzaTotal += Math.pow(p.y - mediaY, 2);

      return {
        id: p.id,
        etiqueta: p.etiqueta || `Punto ${p.x}`,
        entrada: p.x,
        observado: p.y,
        estimado: Math.round(estimado * 10) / 10,
        diferencia: Math.round(diferencia * 10) / 10,
      };
    });

    const confiabilidad = varianzaTotal > 0 ? Math.max(0, Math.min(1, 1 - (varianzaError / varianzaTotal))) : 1;
    const pronostico = Math.max(0, Math.round((m * horizonteEstimacion + b) * 10) / 10);

    return {
      confiabilidad: Math.round(confiabilidad * 100),
      pronostico,
      promedio: Math.round(mediaY * 10) / 10,
      variabilidad: Math.round(Math.sqrt(varianzaError / Math.max(1, n - 2)) * 10) / 10,
      filas: filasDetalle,
    };
  }, [puntos, horizonteEstimacion]);

  const [tasaEntrada, setTasaEntrada] = useState<number>(24);
  const [capacidadAtencion, setCapacidadAtencion] = useState<number>(30);
  const [numVentanillas, setNumVentanillas] = useState<number>(2);

  const flujoAtencion = useMemo(() => {
    const servidores = Math.max(1, numVentanillas);
    const lambda = Math.max(1, tasaEntrada);
    const mu = Math.max(1, capacidadAtencion);
    const capacidadTotal = servidores * mu;
    const ocupacion = Math.min(100, Math.round((lambda / capacidadTotal) * 100));

    const tiempoEsperaMin = ocupacion > 90 ? 12 : (ocupacion > 70 ? 6 : 3);
    const personasEnEspera = Math.round((lambda * (tiempoEsperaMin / 60)) * 10) / 10;

    return {
      ocupacion,
      tiempoEsperaMin,
      personasEnEspera,
      capacidadTotal,
      balance: ocupacion < 80 ? 'FLUIDO' : (ocupacion < 95 ? 'ALTO FLUJO' : 'SATURADO'),
    };
  }, [tasaEntrada, capacidadAtencion, numVentanillas]);

  const [calificacionesEstudiante, setCalificacionesEstudiante] = useState<CalificacionRegistro[]>([
    { libro: 1, nota: 78 },
    { libro: 2, nota: 74 },
    { libro: 3, nota: 75 },
    { libro: 4, nota: 68 },
    { libro: 5, nota: 66 },
    { libro: 6, nota: 61 },
  ]);

  const monitoreoEstudiante = useMemo(() => {
    const n = calificacionesEstudiante.length;
    if (n < 2) return null;

    let sX = 0, sY = 0, sXX = 0, sXY = 0;
    for (const c of calificacionesEstudiante) {
      sX += c.libro;
      sY += c.nota;
      sXX += (c.libro * c.libro);
      sXY += (c.libro * c.nota);
    }

    const den = (n * sXX) - (sX * sX);
    if (Math.abs(den) < 1e-9) return null;

    const pend = ((n * sXY) - (sX * sY)) / den;
    const inter = (sY - (pend * sX)) / n;

    const proyeccionExamenNivel = Math.max(0, Math.min(100, Math.round((pend * 12 + inter) * 10) / 10));
    const estado = proyeccionExamenNivel < 51 ? 'ATENCIÓN CRÍTICA' : (proyeccionExamenNivel < 65 ? 'SEGUIMIENTO PREVENTIVO' : 'REGULAR');

    return {
      promedioActual: Math.round((sY / n) * 10) / 10,
      proyeccionExamenNivel,
      tendencia: pend < 0 ? 'Descendente' : 'Favorable',
      estado,
    };
  }, [calificacionesEstudiante]);

  return (
    <div className="h-full flex flex-col min-h-0 overflow-hidden bg-[var(--bg-base)] text-[var(--text-main)]">
      {/* 1. FRANJA SUPERIOR COMPACTA (44px) */}
      <div className="strip-utility-bar">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[var(--military-green-subtle)] border border-[var(--border-accent)] text-[var(--military-green-primary)] dark:text-[var(--military-gold-primary)] font-mono text-[11px] font-bold shrink-0">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>SACA / Modelos y Proyecciones</span>
          </div>

          <div className="h-4 w-[1px] bg-[var(--border-fine)] shrink-0" />

          {/* Selector de Pestañas Inline */}
          <div className="flex items-center gap-1 bg-[var(--bg-surface)] p-0.5 rounded border border-[var(--border-fine)] shrink-0">
            {[
              { id: 'PROYECCION', label: 'Demanda (Regresión)' },
              { id: 'CAPACIDAD', label: 'Capacidad Aulas' },
              { id: 'VENTANILLAS', label: 'Colas & Ventanillas' },
              { id: 'MONITOREO', label: 'Monitoreo Preventivo' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTabActiva(t.id as any)}
                className={`px-2.5 py-0.5 rounded text-[11px] font-bold font-mono transition ${
                  tabActiva === t.id
                    ? 'bg-[#1B3B2B] text-white dark:bg-[#F59E0B] dark:text-zinc-950 font-bold shadow-xs'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-mono text-[var(--text-muted)] hidden md:inline">
            CEDMIL • MODELOS MATEMÁTICOS APLICADOS
          </span>
        </div>
      </div>

      {/* 2. ÁREA DE TRABAJO PRINCIPAL (CERO SCROLL GENERAL) */}
      <div className="flex-1 min-h-0 p-2.5 overflow-hidden flex flex-col gap-2.5">
        {tabActiva === 'PROYECCION' && resultadoTendencia && (
          <div className="flex-1 min-h-0 flex flex-col gap-2.5 overflow-hidden">
            {/* Tira Ledger de KPIs */}
            <div className="h-14 shrink-0 border border-[var(--border-fine)] rounded-[2px] bg-[var(--bg-card)] shadow-xs overflow-hidden">
              <div className="grid grid-cols-2 md:grid-cols-4 h-full divide-x divide-[var(--border-fine)]">
                <div className="px-3 py-1 flex flex-col justify-between">
                  <span className="text-[9.5px] font-bold uppercase tracking-wider text-[var(--text-muted)] font-mono">Pronóstico Periodo {horizonteEstimacion}</span>
                  <p className="text-xl font-black font-mono text-[var(--text-main)] tabular-nums">{resultadoTendencia.pronostico} unids.</p>
                </div>
                <div className="px-3 py-1 flex flex-col justify-between">
                  <span className="text-[9.5px] font-bold uppercase tracking-wider text-[var(--text-muted)] font-mono">Confiabilidad (R²)</span>
                  <p className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">{resultadoTendencia.confiabilidad}%</p>
                </div>
                <div className="px-3 py-1 flex flex-col justify-between">
                  <span className="text-[9.5px] font-bold uppercase tracking-wider text-[var(--text-muted)] font-mono">Variabilidad (σ)</span>
                  <p className="text-xl font-black font-mono text-purple-600 dark:text-purple-400 tabular-nums">±{resultadoTendencia.variabilidad}</p>
                </div>
                <div className="px-3 py-1 flex flex-col justify-between">
                  <span className="text-[9.5px] font-bold uppercase tracking-wider text-[var(--text-muted)] font-mono">Promedio Base</span>
                  <p className="text-xl font-black font-mono text-sky-600 dark:text-sky-400 tabular-nums">{resultadoTendencia.promedio}</p>
                </div>
              </div>
            </div>

            {/* Split Panel: Parámetros + Tabla */}
            <div className="flex-1 min-h-0 grid grid-cols-12 gap-2.5 overflow-hidden">
              <div className="col-span-12 lg:col-span-4 bg-[var(--bg-card)] border border-[var(--border-fine)] rounded-[2px] p-3 flex flex-col justify-between shadow-xs">
                <div>
                  <h3 className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider pb-2 border-b border-[var(--border-fine)] font-sans">
                    Parámetros de Simulación
                  </h3>
                  <div className="space-y-3 pt-3 text-xs">
                    <div>
                      <label className="text-[11px] font-mono text-[var(--text-muted)] block mb-1">
                        Horizonte a Estimar (Periodo X)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="24"
                        value={horizonteEstimacion}
                        onChange={(e) => setHorizonteEstimacion(parseInt(e.target.value) || 1)}
                        className="w-full bg-[var(--bg-surface)] border border-[var(--border-fine)] rounded px-2.5 py-1.5 text-xs text-[var(--text-main)] font-mono font-bold"
                      />
                    </div>
                    <div className="p-2.5 rounded-[2px] bg-[var(--bg-surface)] border border-[var(--border-fine)] space-y-1 font-mono text-[11px] text-[var(--text-muted)]">
                      <p className="font-bold text-[var(--text-main)]">Algoritmo: Mínimos Cuadrados</p>
                      <p>Ajuste lineal continuo sobre la serie histórica semestral institucional.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[var(--border-fine)] text-[10px] font-mono text-[var(--text-muted)]">
                  Simulación de demanda CEDMIL
                </div>
              </div>

              <div className="col-span-12 lg:col-span-8 bg-[var(--bg-card)] border border-[var(--border-fine)] rounded-[2px] p-3 flex flex-col justify-between shadow-xs overflow-hidden">
                <div className="flex items-center justify-between pb-2 border-b border-[var(--border-fine)] shrink-0">
                  <h3 className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider font-sans">
                    Serie Temporal y Ajuste
                  </h3>
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">N={resultadoTendencia.filas.length} Muestras</span>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto my-1">
                  <table className="compact-table">
                    <thead>
                      <tr>
                        <th>Periodo / Etiqueta</th>
                        <th className="text-center">Valor Observado</th>
                        <th className="text-center">Ajuste Lineal</th>
                        <th className="text-right">Residuo (Error)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resultadoTendencia.filas.map((f) => (
                        <tr key={f.id}>
                          <td className="font-bold text-[var(--text-main)]">{f.etiqueta}</td>
                          <td className="text-center font-mono font-bold text-sky-600 dark:text-sky-400">{f.observado}</td>
                          <td className="text-center font-mono text-[var(--text-main)]">{f.estimado}</td>
                          <td className="text-right font-mono text-[var(--text-muted)]">{f.diferencia}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="tactical-pagination shrink-0">
                  <span className="font-mono text-xs">MODELO ACTIVO</span>
                  <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 font-bold">R² = {resultadoTendencia.confiabilidad}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {tabActiva === 'CAPACIDAD' && (
          <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-3 gap-2.5 overflow-hidden">
            <div className="bg-[var(--bg-card)] border border-[var(--border-fine)] rounded-[2px] p-4 flex flex-col justify-between shadow-xs">
              <div>
                <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase">Aforo Normativo</span>
                <p className="text-3xl font-black font-mono text-[var(--text-main)] mt-1">30 Plazas</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">Capacidad máxima establecida por aula física.</p>
              </div>
              <span className="badge badge-gold">NORMATIVA MILITAR</span>
            </div>
            <div className="bg-[var(--bg-card)] border border-[var(--border-fine)] rounded-[2px] p-4 flex flex-col justify-between shadow-xs">
              <div>
                <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase">Umbral Mínimo Viable</span>
                <p className="text-3xl font-black font-mono text-amber-500 mt-1">10 Plazas</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">Punto de equilibrio para apertura de paralelo.</p>
              </div>
              <span className="badge badge-civil">PUNTO EQUILIBRIO</span>
            </div>
            <div className="bg-[var(--bg-card)] border border-[var(--border-fine)] rounded-[2px] p-4 flex flex-col justify-between shadow-xs">
              <div>
                <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase">Aprovechamiento Global</span>
                <p className="text-3xl font-black font-mono text-emerald-500 mt-1">85%</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">Índice institucional de ocupación de aulas.</p>
              </div>
              <span className="text-[10px] font-mono text-emerald-500 font-bold">● EFICIENTE</span>
            </div>
          </div>
        )}

        {tabActiva === 'VENTANILLAS' && (
          <div className="flex-1 min-h-0 flex flex-col gap-2.5 overflow-hidden">
            <div className="h-14 shrink-0 border border-[var(--border-fine)] rounded-[2px] bg-[var(--bg-card)] shadow-xs overflow-hidden">
              <div className="grid grid-cols-2 md:grid-cols-4 h-full divide-x divide-[var(--border-fine)]">
                <div className="px-3 py-1 flex flex-col justify-between">
                  <span className="text-[9.5px] font-bold uppercase tracking-wider text-[var(--text-muted)] font-mono">Nivel Ocupación</span>
                  <p className="text-xl font-black font-mono text-amber-500 tabular-nums">{flujoAtencion.ocupacion}%</p>
                </div>
                <div className="px-3 py-1 flex flex-col justify-between">
                  <span className="text-[9.5px] font-bold uppercase tracking-wider text-[var(--text-muted)] font-mono">Tiempo en Sala</span>
                  <p className="text-xl font-black font-mono text-sky-500 tabular-nums">{flujoAtencion.tiempoEsperaMin} min</p>
                </div>
                <div className="px-3 py-1 flex flex-col justify-between">
                  <span className="text-[9.5px] font-bold uppercase tracking-wider text-[var(--text-muted)] font-mono">Cola Promedio</span>
                  <p className="text-xl font-black font-mono text-purple-500 tabular-nums">{flujoAtencion.personasEnEspera} pers.</p>
                </div>
                <div className="px-3 py-1 flex flex-col justify-between">
                  <span className="text-[9.5px] font-bold uppercase tracking-wider text-[var(--text-muted)] font-mono">Capacidad Atención</span>
                  <p className="text-xl font-black font-mono text-emerald-500 tabular-nums">{flujoAtencion.capacidadTotal}/h</p>
                </div>
              </div>
            </div>

            <div className="flex-1 min-h-0 bg-[var(--bg-card)] border border-[var(--border-fine)] rounded-[2px] p-4 flex flex-col justify-between shadow-xs">
              <h3 className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider pb-2 border-b border-[var(--border-fine)] font-sans">
                Simulación M/M/s de Atención en Ventanilla
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs my-3">
                <div>
                  <label className="text-[11px] font-mono text-[var(--text-muted)] block mb-1">
                    Afluencia Estimada (solicitudes/hora)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="200"
                    value={tasaEntrada}
                    onChange={(e) => setTasaEntrada(parseInt(e.target.value) || 5)}
                    className="w-full bg-[var(--bg-surface)] border border-[var(--border-fine)] rounded px-2.5 py-1.5 text-xs text-[var(--text-main)] font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-[var(--text-muted)] block mb-1">
                    Velocidad por Ventanilla (atenciones/hora)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={capacidadAtencion}
                    onChange={(e) => setCapacidadAtencion(parseInt(e.target.value) || 5)}
                    className="w-full bg-[var(--bg-surface)] border border-[var(--border-fine)] rounded px-2.5 py-1.5 text-xs text-[var(--text-main)] font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-[var(--text-muted)] block mb-1">
                    Ventanillas Habilitadas
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={numVentanillas}
                    onChange={(e) => setNumVentanillas(parseInt(e.target.value) || 1)}
                    className="w-full bg-[var(--bg-surface)] border border-[var(--border-fine)] rounded px-2.5 py-1.5 text-xs text-[var(--text-main)] font-mono font-bold"
                  />
                </div>
              </div>

              <div className="p-3 rounded-[2px] bg-[var(--bg-surface)] border border-[var(--border-fine)] text-xs font-mono">
                Estado del Sistema: <strong className="text-[var(--color-accent)]">{flujoAtencion.balance}</strong> • Régimen de colas estable.
              </div>
            </div>
          </div>
        )}

        {tabActiva === 'MONITOREO' && monitoreoEstudiante && (
          <div className="flex-1 min-h-0 flex flex-col gap-2.5 overflow-hidden">
            <div className="h-16 shrink-0 border border-[var(--border-fine)] rounded-[2px] bg-[var(--bg-card)] shadow-xs overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3 h-full divide-x divide-[var(--border-fine)]">
                <div className="px-3 py-1 flex flex-col justify-between">
                  <span className="text-[9.5px] font-bold uppercase tracking-wider text-[var(--text-muted)] font-mono">Promedio Parcial Actual</span>
                  <p className="text-2xl font-black font-mono text-[var(--text-main)] tabular-nums">{monitoreoEstudiante.promedioActual}</p>
                </div>
                <div className="px-3 py-1 flex flex-col justify-between">
                  <span className="text-[9.5px] font-bold uppercase tracking-wider text-[var(--text-muted)] font-mono">Proyección Examen de Nivel</span>
                  <p className="text-2xl font-black font-mono text-emerald-500 tabular-nums">{monitoreoEstudiante.proyeccionExamenNivel}</p>
                </div>
                <div className="px-3 py-1 flex flex-col justify-between">
                  <span className="text-[9.5px] font-bold uppercase tracking-wider text-[var(--text-muted)] font-mono">Diagnóstico Preventivo</span>
                  <p className="text-xs font-bold text-[var(--color-accent)] font-mono">{monitoreoEstudiante.estado}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 min-h-0 bg-[var(--bg-card)] border border-[var(--border-fine)] rounded-[2px] p-3 flex flex-col justify-between shadow-xs">
              <h3 className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider pb-2 border-b border-[var(--border-fine)] font-sans">
                Notas Registradas por Texto Curricular
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 my-auto">
                {calificacionesEstudiante.map((c, i) => (
                  <div key={c.libro} className="bg-[var(--bg-surface)] p-2.5 rounded-[2px] border border-[var(--border-fine)] text-center">
                    <span className="text-[10px] text-[var(--text-muted)] font-mono block">Libro {c.libro}</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={c.nota}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        const copia = [...calificacionesEstudiante];
                        copia[i].nota = val;
                        setCalificacionesEstudiante(copia);
                      }}
                      className="w-full bg-[var(--bg-card)] border border-[var(--border-fine)] text-center text-sm font-mono font-bold text-[var(--text-main)] rounded mt-1 py-1"
                    />
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-[var(--border-fine)] text-[10px] font-mono text-[var(--text-muted)]">
                Seguimiento pedagógico preventivo SACA CEDMIL
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
