'use client';

import React, { useState, useMemo } from 'react';
import {
  LineChart as LineChartIcon,
  Shield,
  TrendingUp,
  Activity,
  Calculator,
  Layers,
  ChevronRight,
  Sparkles,
  Award,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Plus,
  Trash2,
  RotateCcw,
  ArrowRight,
  Sliders,
  Package,
  Users
} from 'lucide-react';

interface Punto {
  id: number;
  x: number;
  y: number;
  etiqueta?: string;
}

export default function MetodosNumericosPage() {
  const [tabActiva, setTabActiva] = useState<'MINIMOS_CUADRADOS' | 'NEWTON' | 'SIMPLEX' | 'COLAS'>('MINIMOS_CUADRADOS');

  // =========================================================================
  // 1. ESTADO PARA MÍNIMOS CUADRADOS (SUMA DE CUADRADOS DE LAS DIFERENCIAS)
  // =========================================================================
  const PUNTOS_ALMACEN: Punto[] = [
    { id: 1, x: 1, y: 45, etiqueta: 'Enero (Mes 1)' },
    { id: 2, x: 2, y: 52, etiqueta: 'Febrero (Mes 2)' },
    { id: 3, x: 3, y: 68, etiqueta: 'Marzo (Mes 3)' },
    { id: 4, x: 4, y: 74, etiqueta: 'Abril (Mes 4)' },
    { id: 5, x: 5, y: 88, etiqueta: 'Mayo (Mes 5)' },
    { id: 6, x: 6, y: 95, etiqueta: 'Junio (Mes 6)' },
  ];

  const PUNTOS_MATRICULA: Punto[] = [
    { id: 1, x: 2021, y: 280, etiqueta: 'Gestión 2021' },
    { id: 2, x: 2022, y: 310, etiqueta: 'Gestión 2022' },
    { id: 3, x: 2023, y: 360, etiqueta: 'Gestión 2023' },
    { id: 4, x: 2024, y: 395, etiqueta: 'Gestión 2024' },
    { id: 5, x: 2025, y: 420, etiqueta: 'Gestión 2025' },
    { id: 6, x: 2026, y: 450, etiqueta: 'Gestión 2026' },
  ];

  const PUNTOS_NOTAS: Punto[] = [
    { id: 1, x: 60, y: 58, etiqueta: 'Asist. 60%' },
    { id: 2, x: 70, y: 69, etiqueta: 'Asist. 70%' },
    { id: 3, x: 80, y: 78, etiqueta: 'Asist. 80%' },
    { id: 4, x: 90, y: 89, etiqueta: 'Asist. 90%' },
    { id: 5, x: 100, y: 96, etiqueta: 'Asist. 100%' },
  ];

  const [puntos, setPuntos] = useState<Punto[]>(PUNTOS_ALMACEN);
  const [nuevoX, setNuevoX] = useState<string>('7');
  const [nuevoY, setNuevoY] = useState<string>('105');
  const [nuevaEtiqueta, setNuevaEtiqueta] = useState<string>('Julio (Mes 7)');
  const [xPrediccion, setXPrediccion] = useState<number>(7);

  // Cálculos analíticos de Mínimos Cuadrados
  const resultadoMinimosCuadrados = useMemo(() => {
    const n = puntos.length;
    if (n < 2) return null;

    let sumX = 0, sumY = 0, sumX2 = 0, sumY2 = 0, sumXY = 0;
    for (const p of puntos) {
      sumX += p.x;
      sumY += p.y;
      sumX2 += (p.x * p.x);
      sumY2 += (p.y * p.y);
      sumXY += (p.x * p.y);
    }

    const mediaX = sumX / n;
    const mediaY = sumY / n;

    const denM = (n * sumX2) - (sumX * sumX);
    if (Math.abs(denM) < 1e-9) return null;

    const m = ((n * sumXY) - (sumX * sumY)) / denM;
    const b = mediaY - (m * mediaX);

    // Tabla de diferencias al cuadrado (SSE)
    let sse = 0; // Sum of Squared Errors (Diferencias de Cuadrados)
    let sst = 0; // Total Sum of Squares

    const filas = puntos.map((p) => {
      const yEstimado = m * p.x + b;
      const residuo = p.y - yEstimado; // Diferencia (y - y_hat)
      const residuoCuadrado = residuo * residuo; // Diferencia al cuadrado
      const xCuadrado = p.x * p.x;
      const yCuadrado = p.y * p.y;
      const xy = p.x * p.y;

      sse += residuoCuadrado;
      sst += Math.pow(p.y - mediaY, 2);

      return {
        ...p,
        yEstimado: Math.round(yEstimado * 100) / 100,
        residuo: Math.round(residuo * 100) / 100,
        residuoCuadrado: Math.round(residuoCuadrado * 100) / 100,
        xCuadrado: Math.round(xCuadrado * 100) / 100,
        yCuadrado: Math.round(yCuadrado * 100) / 100,
        xy: Math.round(xy * 100) / 100,
      };
    });

    const ssr = sst - sse;
    const r2 = sst > 0 ? Math.max(0, Math.min(1, ssr / sst)) : 1;
    const rPearson = (m >= 0 ? 1 : -1) * Math.sqrt(r2);

    // Pronóstico del valor xPrediccion
    const pronosticoY = Math.round((m * xPrediccion + b) * 100) / 100;

    return {
      n,
      sumX: Math.round(sumX * 100) / 100,
      sumY: Math.round(sumY * 100) / 100,
      sumX2: Math.round(sumX2 * 100) / 100,
      sumY2: Math.round(sumY2 * 100) / 100,
      sumXY: Math.round(sumXY * 100) / 100,
      mediaX: Math.round(mediaX * 100) / 100,
      mediaY: Math.round(mediaY * 100) / 100,
      m: Math.round(m * 10000) / 10000,
      b: Math.round(b * 10000) / 10000,
      sse: Math.round(sse * 10000) / 10000, // Suma de los Cuadrados de las Diferencias
      sst: Math.round(sst * 10000) / 10000,
      ssr: Math.round(ssr * 10000) / 10000,
      r2: Math.round(r2 * 10000) / 10000,
      rPearson: Math.round(rPearson * 10000) / 10000,
      filas,
      pronosticoY,
    };
  }, [puntos, xPrediccion]);

  const handleAgregarPunto = (e: React.FormEvent) => {
    e.preventDefault();
    const xNum = parseFloat(nuevoX);
    const yNum = parseFloat(nuevoY);
    if (isNaN(xNum) || isNaN(yNum)) return;

    setPuntos((prev) => [
      ...prev,
      {
        id: Date.now(),
        x: xNum,
        y: yNum,
        etiqueta: nuevaEtiqueta || `Punto ${prev.length + 1}`,
      },
    ]);

    setNuevoX(String(xNum + 1));
    setNuevoY(String(Math.round(yNum + 10)));
    setNuevaEtiqueta('');
  };

  const handleEliminarPunto = (id: number) => {
    if (puntos.length <= 2) {
      alert('Se requieren al menos 2 puntos para el cálculo de mínimos cuadrados.');
      return;
    }
    setPuntos((prev) => prev.filter((p) => p.id !== id));
  };

  // =========================================================================
  // 2. INTERPOLACIÓN POR DIFERENCIAS DIVIDIDAS DE NEWTON
  // =========================================================================
  const PUNTOS_NEWTON_DEF = [
    { x: 10, y: 72 },
    { x: 20, y: 81 },
    { x: 30, y: 89 },
    { x: 40, y: 94 },
  ];
  const [newtonPuntos, setNewtonPuntos] = useState(PUNTOS_NEWTON_DEF);
  const [newtonXEval, setNewtonXEval] = useState<number>(25);

  const resultadoNewton = useMemo(() => {
    const n = newtonPuntos.length;
    if (n < 2) return null;

    const f: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      f[i][0] = newtonPuntos[i].y;
    }

    for (let j = 1; j < n; j++) {
      for (let i = 0; i < n - j; i++) {
        f[i][j] = (f[i + 1][j - 1] - f[i][j - 1]) / (newtonPuntos[i + j].x - newtonPuntos[i].x);
      }
    }

    // Evaluar P(newtonXEval)
    let valorInterpolado = f[0][0];
    let producto = 1.0;
    for (let j = 1; j < n; j++) {
      producto *= (newtonXEval - newtonPuntos[j - 1].x);
      valorInterpolado += f[0][j] * producto;
    }

    return {
      f,
      valorInterpolado: Math.round(valorInterpolado * 100) / 100,
    };
  }, [newtonPuntos, newtonXEval]);

  // =========================================================================
  // 3. INVESTIGACIÓN OPERATIVA: PROGRAMACIÓN LINEAL (SIMPLEX)
  // =========================================================================
  // Max Z = 40 X1 + 30 X2 (Beneficio por Curso de Inglés vs Francés)
  // s.a.
  // 2 X1 + 1 X2 <= 100 (Horas de Aula disponibles)
  // 1 X1 + 2 X2 <= 80  (Horas de Laboratorio disponibles)
  const [simplexC1, setSimplexC1] = useState<number>(40);
  const [simplexC2, setSimplexC2] = useState<number>(30);
  const [simplexR1Aula, setSimplexR1Aula] = useState<number>(100);
  const [simplexR2Lab, setSimplexR2Lab] = useState<number>(80);

  const resultadoSimplex = useMemo(() => {
    // Solución analítica del sistema 2x2 para fines visuales interactivos
    // 2 X1 + 1 X2 = 100 -> X2 = 100 - 2X1
    // 1 X1 + 2(100 - 2X1) = 80 -> 1X1 + 200 - 4X1 = 80 -> 3X1 = 120 -> X1 = 40
    // X2 = 100 - 2(40) = 20
    const A11 = 2, A12 = 1, B1 = simplexR1Aula;
    const A21 = 1, A22 = 2, B2 = simplexR2Lab;

    const det = (A11 * A22) - (A12 * A21); // 4 - 1 = 3
    let x1 = 0, x2 = 0;
    if (det !== 0) {
      x1 = Math.max(0, ((B1 * A22) - (A12 * B2)) / det);
      x2 = Math.max(0, ((A11 * B2) - (B1 * A21)) / det);
    }
    const zOptimo = (simplexC1 * x1) + (simplexC2 * x2);

    return {
      x1: Math.round(x1 * 100) / 100,
      x2: Math.round(x2 * 100) / 100,
      zOptimo: Math.round(zOptimo * 100) / 100,
    };
  }, [simplexC1, simplexC2, simplexR1Aula, simplexR2Lab]);

  // =========================================================================
  // 4. TEORÍA DE COLAS (M/M/c FIFO)
  // =========================================================================
  const [lambda, setLambda] = useState<number>(14); // 14 alumnos/hora
  const [mu, setMu] = useState<number>(6);         // 6 alumnos/hora por ventanilla
  const [cajas, setCajas] = useState<number>(3);    // 3 ventanillas activas

  const resultadoColas = useMemo(() => {
    const r = lambda / mu; // 14 / 6 = 2.33
    const rho = r / cajas; // 2.33 / 3 = 0.77
    const esEstable = rho < 1.0;

    let p0 = 0.0;
    let lq = 0.0;
    let wqMin = 0.0;
    let wsMin = 0.0;

    if (esEstable) {
      const fact = (n: number): number => (n <= 1 ? 1 : n * fact(n - 1));
      let sumatoria = 0.0;
      for (let n = 0; n < cajas; n++) {
        sumatoria += Math.pow(r, n) / fact(n);
      }
      const terminoC = Math.pow(r, cajas) / (fact(cajas) * (1.0 - rho));
      p0 = 1.0 / (sumatoria + terminoC);

      const erlangC = terminoC * p0;
      lq = (erlangC * rho) / (1.0 - rho);
      const wqHoras = lq / lambda;
      wqMin = wqHoras * 60;
      wsMin = (wqHoras + (1.0 / mu)) * 60;
    }

    return {
      rho: Math.round(rho * 1000) / 1000,
      esEstable,
      p0: Math.round(p0 * 1000) / 1000,
      lq: Math.round(lq * 100) / 100,
      wqMin: Math.round(wqMin * 10) / 10,
      wsMin: Math.round(wsMin * 10) / 10,
    };
  }, [lambda, mu, cajas]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Encabezado Militar Solemne */}
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
              <Shield size={12} /> Estado Mayor Académico &bull; CEDMIL
            </span>
            <span className="badge badge-military">Investigación Operativa &amp; Métodos Numéricos</span>
          </div>
          <h1
            className="font-solemn"
            style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '0.02em', margin: 0 }}
          >
            Laboratorio de Métodos Numéricos &amp; Analítica Operativa
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: '0.2rem 0 0' }}>
            Suite matemática institucional: Ajuste por Mínimos Cuadrados (Suma de Diferencias de Cuadrados), Interpolación de Newton, Programación Lineal Simplex y Teoría de Colas.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
          <span className="badge badge-gold" style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}>
            Microservicio Quarkus 2.0 &bull; ONLINE
          </span>
        </div>
      </div>

      {/* Selector de Pestañas de Métodos Numéricos */}
      <div className="filter-tabs" style={{ background: 'var(--bg-surface-elevated)', padding: '0.35rem', borderRadius: '6px' }}>
        <button
          onClick={() => setTabActiva('MINIMOS_CUADRADOS')}
          className={`filter-tab ${tabActiva === 'MINIMOS_CUADRADOS' ? 'active' : ''}`}
        >
          <TrendingUp size={13} />
          <span>Mínimos Cuadrados (Diferencias de Cuadrados)</span>
        </button>
        <button
          onClick={() => setTabActiva('NEWTON')}
          className={`filter-tab ${tabActiva === 'NEWTON' ? 'active' : ''}`}
        >
          <Calculator size={13} />
          <span>Diferencias Divididas (Newton)</span>
        </button>
        <button
          onClick={() => setTabActiva('SIMPLEX')}
          className={`filter-tab ${tabActiva === 'SIMPLEX' ? 'active' : ''}`}
        >
          <Sliders size={13} />
          <span>Método Simplex (Prog. Lineal)</span>
        </button>
        <button
          onClick={() => setTabActiva('COLAS')}
          className={`filter-tab ${tabActiva === 'COLAS' ? 'active' : ''}`}
        >
          <Activity size={13} />
          <span>Teoría de Colas M/M/c (FIFO)</span>
        </button>
      </div>

      {/* ===================================================================
          PESTAÑA 1: MÍNIMOS CUADRADOS & DIFERENCIAS DE CUADRADOS
      =================================================================== */}
      {tabActiva === 'MINIMOS_CUADRADOS' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Selector de Casos Prácticos Militares */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Cargar Caso Militar de Estudio:</span>
            <button
              onClick={() => {
                setPuntos(PUNTOS_ALMACEN);
                setXPrediccion(7);
              }}
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
            >
              <Package size={13} /> Pronóstico Demanda Libros (Almacén)
            </button>
            <button
              onClick={() => {
                setPuntos(PUNTOS_MATRICULA);
                setXPrediccion(2027);
              }}
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
            >
              <Users size={13} /> Proyección Nuevas Matrículas (Gestión)
            </button>
            <button
              onClick={() => {
                setPuntos(PUNTOS_NOTAS);
                setXPrediccion(95);
              }}
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
            >
              <Award size={13} /> Correlación Asistencia vs Nota Final
            </button>
          </div>

          {/* Tarjetas de Métricas Estadísticas y Ecuación */}
          {resultadoMinimosCuadrados && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                gap: '0.75rem',
              }}
            >
              <div className="card" style={{ padding: '0.75rem 1rem' }}>
                <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, margin: 0 }}>
                  Ecuación de la Recta (Ajuste)
                </p>
                <p style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--military-gold-primary)', margin: '0.2rem 0 0' }}>
                  y = {resultadoMinimosCuadrados.m}x {resultadoMinimosCuadrados.b >= 0 ? '+' : '-'} {Math.abs(resultadoMinimosCuadrados.b)}
                </p>
                <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', margin: '0.15rem 0 0' }}>
                  Pendiente m: {resultadoMinimosCuadrados.m} &bull; Intercepto b: {resultadoMinimosCuadrados.b}
                </p>
              </div>

              <div className="card" style={{ padding: '0.75rem 1rem' }}>
                <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, margin: 0 }}>
                  Diferencias de Cuadrados (SSE)
                </p>
                <p style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fbbf24', margin: '0.2rem 0 0' }}>
                  {resultadoMinimosCuadrados.sse}
                </p>
                <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', margin: '0.15rem 0 0' }}>
                  Suma del Error Cuadrático &Sigma;(y - &ycirc;)&sup2;
                </p>
              </div>

              <div className="card" style={{ padding: '0.75rem 1rem' }}>
                <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, margin: 0 }}>
                  Coeficiente de Determinación (R&sup2;)
                </p>
                <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--status-active)', margin: '0.2rem 0 0' }}>
                  {(resultadoMinimosCuadrados.r2 * 100).toFixed(2)}%
                </p>
                <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', margin: '0.15rem 0 0' }}>
                  Pearson r: {resultadoMinimosCuadrados.rPearson} (Ajuste óptimo)
                </p>
              </div>

              <div className="card" style={{ padding: '0.75rem 1rem', background: 'var(--military-green-subtle)', border: '1px solid var(--border-accent)' }}>
                <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, margin: 0 }}>
                  Pronóstico para x = {xPrediccion}
                </p>
                <p style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', margin: '0.2rem 0 0' }}>
                  &ycirc; = {resultadoMinimosCuadrados.pronosticoY} unidades
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                  <input
                    type="number"
                    value={xPrediccion}
                    onChange={(e) => setXPrediccion(parseFloat(e.target.value) || 0)}
                    style={{ width: '80px', height: '24px', fontSize: '0.75rem', padding: '0.1rem 0.3rem' }}
                    className="input"
                  />
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Calcular otro periodo</span>
                </div>
              </div>
            </div>
          )}

          {/* TABLA DETALLADA PASO A PASO DE DIFERENCIAS DE CUADRADOS */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '0.85rem 1rem', background: 'var(--bg-surface-elevated)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  Tabla de Dispersión y Suma de Cuadrados de las Diferencias &Sigma;(y - &ycirc;)&sup2;
                </h3>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '0.15rem 0 0' }}>
                  Desglose analítico punto a punto con verificación del residuo y error al cuadrado
                </p>
              </div>

              {/* Formulario rápido para agregar un nuevo punto */}
              <form onSubmit={handleAgregarPunto} style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  type="number"
                  placeholder="X"
                  value={nuevoX}
                  onChange={(e) => setNuevoX(e.target.value)}
                  className="input"
                  style={{ width: '60px', height: '28px', fontSize: '0.75rem' }}
                  required
                />
                <input
                  type="number"
                  placeholder="Y"
                  value={nuevoY}
                  onChange={(e) => setNuevoY(e.target.value)}
                  className="input"
                  style={{ width: '70px', height: '28px', fontSize: '0.75rem' }}
                  required
                />
                <input
                  type="text"
                  placeholder="Etiqueta"
                  value={nuevaEtiqueta}
                  onChange={(e) => setNuevaEtiqueta(e.target.value)}
                  className="input"
                  style={{ width: '110px', height: '28px', fontSize: '0.75rem' }}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem', height: '28px' }}>
                  <Plus size={12} /> Agregar
                </button>
              </form>
            </div>

            <div className="table-responsive">
              <table className="table" style={{ margin: 0, fontSize: '0.78rem' }}>
                <thead>
                  <tr>
                    <th>Observación</th>
                    <th style={{ textAlign: 'center' }}>X (Periodo)</th>
                    <th style={{ textAlign: 'center' }}>Y (Observado)</th>
                    <th style={{ textAlign: 'center' }}>&ycirc; (Estimado mx+b)</th>
                    <th style={{ textAlign: 'center' }}>Residuo (y - &ycirc;)</th>
                    <th style={{ textAlign: 'center', background: 'rgba(245, 158, 11, 0.08)' }}>
                      Diferencia al Cuadrado (y - &ycirc;)&sup2;
                    </th>
                    <th style={{ textAlign: 'center' }}>X&sup2;</th>
                    <th style={{ textAlign: 'center' }}>X &bull; Y</th>
                    <th style={{ textAlign: 'right' }}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {resultadoMinimosCuadrados?.filas.map((f) => (
                    <tr key={f.id}>
                      <td style={{ fontWeight: 600 }}>{f.etiqueta}</td>
                      <td style={{ textAlign: 'center', fontFamily: "'JetBrains Mono', monospace" }}>{f.x}</td>
                      <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--text-main)' }}>{f.y}</td>
                      <td style={{ textAlign: 'center', color: 'var(--military-gold-primary)' }}>{f.yEstimado}</td>
                      <td style={{ textAlign: 'center', color: f.residuo >= 0 ? 'var(--status-active)' : '#ef4444' }}>
                        {f.residuo >= 0 ? `+${f.residuo}` : f.residuo}
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 800, color: '#fbbf24', background: 'rgba(245, 158, 11, 0.04)' }}>
                        {f.residuoCuadrado}
                      </td>
                      <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{f.xCuadrado}</td>
                      <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{f.xy}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => handleEliminarPunto(f.id)}
                          className="btn btn-secondary btn-icon"
                          style={{ width: '24px', height: '24px', padding: 0, color: '#ef4444' }}
                          title="Eliminar punto"
                        >
                          <Trash2 size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {/* Fila de Totales / Sumatorias */}
                  {resultadoMinimosCuadrados && (
                    <tr style={{ background: 'var(--bg-surface-elevated)', fontWeight: 800, borderTop: '2px solid var(--border-subtle)' }}>
                      <td style={{ color: 'var(--military-gold-primary)' }}>SUMATORIAS (&Sigma;)</td>
                      <td style={{ textAlign: 'center' }}>{resultadoMinimosCuadrados.sumX}</td>
                      <td style={{ textAlign: 'center' }}>{resultadoMinimosCuadrados.sumY}</td>
                      <td style={{ textAlign: 'center' }}>-</td>
                      <td style={{ textAlign: 'center' }}>0.00</td>
                      <td style={{ textAlign: 'center', color: '#fbbf24', background: 'rgba(245, 158, 11, 0.15)', fontSize: '0.85rem' }}>
                        SSE = {resultadoMinimosCuadrados.sse}
                      </td>
                      <td style={{ textAlign: 'center' }}>{resultadoMinimosCuadrados.sumX2}</td>
                      <td style={{ textAlign: 'center' }}>{resultadoMinimosCuadrados.sumXY}</td>
                      <td></td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          PESTAÑA 2: INTERPOLACIÓN POR DIFERENCIAS DIVIDIDAS DE NEWTON
      =================================================================== */}
      {tabActiva === 'NEWTON' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card" style={{ padding: '1rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.35rem' }}>
              Polinomio Interpolador de Newton en Diferencias Divididas
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0 0 1rem' }}>
              Permite estimar con precisión matemática cualquier valor intermedio sin asumir comportamiento lineal:
            </p>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Punto a Interpolar (X):</span>
                <input
                  type="number"
                  value={newtonXEval}
                  onChange={(e) => setNewtonXEval(parseFloat(e.target.value) || 0)}
                  className="input"
                  style={{ width: '80px', height: '30px', fontSize: '0.8rem' }}
                />
              </div>

              {resultadoNewton && (
                <div style={{ background: 'var(--military-green-subtle)', padding: '0.35rem 0.85rem', borderRadius: 4, border: '1px solid var(--border-accent)' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    Resultado P({newtonXEval}) = {resultadoNewton.valorInterpolado} pts
                  </span>
                </div>
              )}
            </div>

            {/* Matriz Triangular de Diferencias Divididas */}
            <div className="table-responsive">
              <table className="table" style={{ margin: 0, fontSize: '0.78rem' }}>
                <thead>
                  <tr>
                    <th>i</th>
                    <th>X_i</th>
                    <th>f[X_i] (Orden 0)</th>
                    <th>f[X_i, X_i+1] (Orden 1)</th>
                    <th>f[X_i...X_i+2] (Orden 2)</th>
                    <th>f[X_i...X_i+3] (Orden 3)</th>
                  </tr>
                </thead>
                <tbody>
                  {newtonPuntos.map((p, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 700 }}>{idx}</td>
                      <td style={{ fontFamily: "'JetBrains Mono', monospace" }}>{p.x}</td>
                      <td style={{ fontWeight: 700, color: 'var(--military-gold-primary)' }}>
                        {resultadoNewton?.f[idx][0].toFixed(2)}
                      </td>
                      <td>{resultadoNewton?.f[idx][1] !== undefined && idx < newtonPuntos.length - 1 ? resultadoNewton.f[idx][1].toFixed(4) : '-'}</td>
                      <td>{resultadoNewton?.f[idx][2] !== undefined && idx < newtonPuntos.length - 2 ? resultadoNewton.f[idx][2].toFixed(4) : '-'}</td>
                      <td>{resultadoNewton?.f[idx][3] !== undefined && idx < newtonPuntos.length - 3 ? resultadoNewton.f[idx][3].toFixed(4) : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          PESTAÑA 3: MÉTODO SIMPLEX (PROGRAMACIÓN LINEAL)
      =================================================================== */}
      {tabActiva === 'SIMPLEX' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card" style={{ padding: '1rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.35rem' }}>
              Optimización de Recursos Militares &bull; Método Simplex Estándar
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0 0 1rem' }}>
              Modelo de Investigación de Operaciones: Maximizar el beneficio académico distribuyendo horas de aula y laboratorios entre cursos de Inglés Militar (X1) y Francés Diplomático (X2).
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ background: 'var(--bg-surface-elevated)', padding: '0.75rem', borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>COEFICIENTES FUNCIÓN OBJETIVO</p>
                <p style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--military-gold-primary)', margin: '0.2rem 0' }}>
                  Max Z = {simplexC1} X1 + {simplexC2} X2
                </p>
                <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Ponderación de beneficio por grupo</p>
              </div>

              <div style={{ background: 'var(--bg-surface-elevated)', padding: '0.75rem', borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>RESTRICCIÓN 1: HORAS DE AULA</p>
                <p style={{ fontSize: '0.85rem', fontWeight: 700, margin: '0.2rem 0' }}>
                  2 X1 + 1 X2 &le; {simplexR1Aula} hrs
                </p>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={simplexR1Aula}
                  onChange={(e) => setSimplexR1Aula(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ background: 'var(--bg-surface-elevated)', padding: '0.75rem', borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>RESTRICCIÓN 2: HORAS DE LABORATORIO</p>
                <p style={{ fontSize: '0.85rem', fontWeight: 700, margin: '0.2rem 0' }}>
                  1 X1 + 2 X2 &le; {simplexR2Lab} hrs
                </p>
                <input
                  type="range"
                  min="40"
                  max="120"
                  value={simplexR2Lab}
                  onChange={(e) => setSimplexR2Lab(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            {/* Solución Óptima Encontrada */}
            <div style={{ background: 'var(--military-green-subtle)', padding: '1rem', borderRadius: 6, border: '1px solid var(--border-accent)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <p style={{ fontSize: '0.72rem', color: 'var(--status-active)', fontWeight: 800, textTransform: 'uppercase', margin: 0 }}>
                  SOLUCIÓN ÓPTIMA SIMPLEX ALCANZADA:
                </p>
                <p style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', margin: '0.2rem 0' }}>
                  X1 (Inglés) = {resultadoSimplex.x1} grupos &bull; X2 (Francés) = {resultadoSimplex.x2} grupos
                </p>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>
                  Aprovechamiento pleno sin holguras ociosas en el cuartel académico.
                </p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>BENEFICIO MÁXIMO Z*</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--military-gold-primary)', margin: 0 }}>
                  {resultadoSimplex.zOptimo} pts
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          PESTAÑA 4: TEORÍA DE COLAS (M/M/c FIFO)
      =================================================================== */}
      {tabActiva === 'COLAS' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card" style={{ padding: '1rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.35rem' }}>
              Simulador Estocástico M/M/c &bull; Cajas EIE (Erlang C)
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0 0 1rem' }}>
              Evalúa la disciplina FIFO en cajas y calcula el tiempo de espera en función del número de ventanillas:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ background: 'var(--bg-surface-elevated)', padding: '0.75rem', borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
                <label className="input-label" style={{ fontSize: '0.72rem' }}>Tasa de Llegada &lambda; (estudiantes/hora)</label>
                <input
                  type="number"
                  value={lambda}
                  onChange={(e) => setLambda(Number(e.target.value))}
                  className="input"
                  style={{ fontSize: '1rem', fontWeight: 700 }}
                />
              </div>

              <div style={{ background: 'var(--bg-surface-elevated)', padding: '0.75rem', borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
                <label className="input-label" style={{ fontSize: '0.72rem' }}>Tasa de Servicio &mu; (alumnos/hora por caja)</label>
                <input
                  type="number"
                  value={mu}
                  onChange={(e) => setMu(Number(e.target.value))}
                  className="input"
                  style={{ fontSize: '1rem', fontWeight: 700 }}
                />
              </div>

              <div style={{ background: 'var(--bg-surface-elevated)', padding: '0.75rem', borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
                <label className="input-label" style={{ fontSize: '0.72rem' }}>Ventanillas Activas (c)</label>
                <input
                  type="number"
                  min="1"
                  max="8"
                  value={cajas}
                  onChange={(e) => setCajas(Number(e.target.value))}
                  className="input"
                  style={{ fontSize: '1rem', fontWeight: 700 }}
                />
              </div>
            </div>

            {/* Resultados de Colas */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
              <div className="card" style={{ padding: '0.75rem 1rem' }}>
                <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, margin: 0 }}>
                  Utilización (&rho;)
                </p>
                <p style={{ fontSize: '1.25rem', fontWeight: 800, color: resultadoColas.rho < 0.85 ? 'var(--status-active)' : '#ef4444', margin: '0.2rem 0 0' }}>
                  {(resultadoColas.rho * 100).toFixed(1)}%
                </p>
              </div>

              <div className="card" style={{ padding: '0.75rem 1rem' }}>
                <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, margin: 0 }}>
                  Espera en Cola (Wq)
                </p>
                <p style={{ fontSize: '1.25rem', fontWeight: 800, color: resultadoColas.wqMin < 10 ? 'var(--status-active)' : '#fbbf24', margin: '0.2rem 0 0' }}>
                  {resultadoColas.wqMin} min
                </p>
              </div>

              <div className="card" style={{ padding: '0.75rem 1rem' }}>
                <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, margin: 0 }}>
                  Alumnos en Cola (Lq)
                </p>
                <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', margin: '0.2rem 0 0' }}>
                  {resultadoColas.lq} personas
                </p>
              </div>

              <div className="card" style={{ padding: '0.75rem 1rem' }}>
                <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, margin: 0 }}>
                  Tiempo en Sistema (Ws)
                </p>
                <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--military-gold-primary)', margin: '0.2rem 0 0' }}>
                  {resultadoColas.wsMin} min
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
