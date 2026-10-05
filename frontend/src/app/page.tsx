// Dashboard principal - ~60% implementado
// TODO: conectar las cards de KPI con datos reales desde la API Laravel
// TODO: implementar gráficos de tendencias (librería pendiente de definir)

export default function DashboardPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

      {/* Encabezado de página */}
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
          Panel de Control Académico
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          Gestión 2026 — Escuela de Idiomas del Ejército (EIE)
        </p>
      </div>

      {/* ── KPI Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>

        <div className="card">
          <p style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Estudiantes Inscritos
          </p>
          {/* TODO: reemplazar con dato real: GET /api/v1/estudiantes */}
          <p style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', margin: '0.35rem 0 0.5rem' }}>
            —
          </p>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span className="badge badge-green">Militares</span>
            <span className="badge badge-blue">Civiles</span>
          </div>
        </div>

        <div className="card">
          <p style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Rotación Docente
          </p>
          {/* TODO: GET /api/v1/docentes/alertas/rotacion */}
          <p style={{ fontSize: '2rem', fontWeight: 800, color: '#fbbf24', margin: '0.35rem 0 0.5rem' }}>
            —
          </p>
          <span className="badge badge-yellow">Ciclo de 15 Días</span>
        </div>

        <div className="card">
          <p style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Tiempo Espera Cajas
          </p>
          {/* TODO: dato desde Quarkus (compañero) */}
          <p style={{ fontSize: '2rem', fontWeight: 800, color: '#38bdf8', margin: '0.35rem 0 0.5rem' }}>
            — min
          </p>
          <span className="badge badge-blue">M/M/c Quarkus</span>
        </div>

        <div className="card">
          <p style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Alertas de Inventario
          </p>
          {/* TODO: GET /api/v1/almacen/stock (filtrar stock <= punto_reorden) */}
          <p style={{ fontSize: '2rem', fontWeight: 800, color: '#f87171', margin: '0.35rem 0 0.5rem' }}>
            —
          </p>
          <span className="badge badge-red">Libros bajo ROP</span>
        </div>
      </div>

      {/* ── Sección de tablas (estructura pendiente de llenar) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '1.5rem' }}>

        {/* Tabla: Rotación Docente */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            borderBottom: '1px solid #334155', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Asignaciones Docentes Activas</h2>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Regla institucional: relevo cada 15 días</p>
            </div>
            <span className="badge badge-yellow">⚠ Pendiente</span>
          </div>
          {/* TODO: renderizar datos reales */}
          <table className="table">
            <thead>
              <tr>
                <th>Paralelo</th>
                <th>Docente</th>
                <th>Días en Aula</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', color: '#64748b', padding: '1.5rem' }}>
                  Conectar con <code style={{ color: '#10b981' }}>GET /api/v1/docentes/alertas/rotacion</code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Tabla: Padrón de Estudiantes */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            borderBottom: '1px solid #334155', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Padrón de Estudiantes</h2>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Civiles y Efectivos Militares</p>
            </div>
            <span className="badge badge-yellow">⚠ Pendiente</span>
          </div>
          {/* TODO: renderizar datos reales */}
          <table className="table">
            <thead>
              <tr>
                <th>C.I.</th>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Grado / Unidad</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', color: '#64748b', padding: '1.5rem' }}>
                  Conectar con <code style={{ color: '#10b981' }}>GET /api/v1/estudiantes</code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

      {/* ── Nota de trabajo pendiente ── */}
      <div style={{
        background: 'rgba(245,158,11,0.08)',
        border: '1px solid rgba(245,158,11,0.25)',
        borderRadius: '10px',
        padding: '1rem 1.25rem',
        fontSize: '0.82rem',
        color: '#fbbf24',
      }}>
        <strong>📌 Trabajo pendiente (próxima iteración):</strong>{' '}
        Implementar la conexión real con la API Laravel, agregar gráficos de tendencias de notas,
        completar las páginas de cada módulo (Inscripciones, Calificaciones, Almacén) y agregar
        el simulador interactivo de Teoría de Colas (Quarkus).
      </div>

    </div>
  );
}
