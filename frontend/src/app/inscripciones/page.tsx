'use client';

import React from 'react';
import { UserPlus, Search, Filter, Shield, Calendar, CreditCard, CheckCircle, Clock } from 'lucide-react';

// ==========================================
// ⚠️ TODO IMPORTANTE: CONEXIÓN A BASE DE DATOS
// ==========================================
// Estos datos son estáticos (MOCK) para el diseño inicial.
// Deben ser reemplazados por una llamada a la API de Laravel
// Ejemplo: fetch('/api/v1/inscripciones')
// ==========================================
const MOCK_INSCRIPCIONES = [
  { id: 'INS-26-001', student: 'Subtte. Juan Pérez', ci: '1234567', type: 'Militar', language: 'Inglés Militar', level: 'Básico', date: '04 Oct 2026', status: 'Pagado', amount: 'Bs. 0 (Beca)' },
  { id: 'INS-26-002', student: 'Sgto. Luis Mamani', ci: '7654321', type: 'Militar', language: 'Mandarín', level: 'Avanzado', date: '04 Oct 2026', status: 'Pendiente', amount: 'Bs. 150' },
  { id: 'INS-26-003', student: 'Ana Gómez', ci: '8877665', type: 'Civil', language: 'Francés', level: 'Básico', date: '03 Oct 2026', status: 'Pagado', amount: 'Bs. 300' },
  { id: 'INS-26-004', student: 'My. Roberto Daza', ci: '5544332', type: 'Militar', language: 'Quechua', level: 'Intermedio', date: '02 Oct 2026', status: 'Pagado', amount: 'Bs. 150' },
];

export default function InscripcionesPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
            Registro de Inscripciones
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Proceso de matriculación para personal militar y civil
          </p>
        </div>
        <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem', background: '#10b981', borderColor: '#10b981' }}>
          <UserPlus size={16} />
          <span>Nueva Inscripción</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="card" style={{ padding: '1.5rem' }}>
        
        {/* Filters and Search */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '350px' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input 
              type="text" 
              placeholder="Buscar por código, estudiante o CI..." 
              className="input" 
              style={{ paddingLeft: '2.2rem', width: '100%' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={16} /> Periodo: Octubre 2026
            </button>
            <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={16} /> Filtros
            </button>
          </div>
        </div>

        {/* Enrollments Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="table" style={{ width: '100%', minWidth: '850px' }}>
            <thead>
              <tr>
                <th>Código</th>
                <th>Estudiante</th>
                <th>C.I. / Tipo</th>
                <th>Idioma / Nivel</th>
                <th>Fecha de Registro</th>
                <th>Estado de Pago</th>
                <th style={{ textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_INSCRIPCIONES.map((inscripcion) => (
                <tr key={inscripcion.id}>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                      {inscripcion.id}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ 
                        width: 28, height: 28, borderRadius: '50%', 
                        background: inscripcion.type === 'Militar' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(56, 189, 248, 0.1)',
                        color: inscripcion.type === 'Militar' ? '#10b981' : '#38bdf8',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        {inscripcion.type === 'Militar' ? <Shield size={14} /> : <UserPlus size={14} />}
                      </div>
                      <span style={{ fontWeight: 600, color: '#f8fafc' }}>{inscripcion.student}</span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div style={{ color: '#e2e8f0' }}>{inscripcion.ci}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{inscripcion.type}</div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div style={{ fontWeight: 500, color: '#e2e8f0' }}>{inscripcion.language}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{inscripcion.level}</div>
                    </div>
                  </td>
                  <td>
                    <div style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>{inscripcion.date}</div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {inscripcion.status === 'Pagado' ? (
                        <CheckCircle size={16} color="#10b981" />
                      ) : (
                        <Clock size={16} color="#fbbf24" />
                      )}
                      <div>
                        <div style={{ color: inscripcion.status === 'Pagado' ? '#10b981' : '#fbbf24', fontWeight: 600, fontSize: '0.85rem' }}>
                          {inscripcion.status}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{inscripcion.amount}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', marginLeft: 'auto' }}>
                      <CreditCard size={14} /> Facturación
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
