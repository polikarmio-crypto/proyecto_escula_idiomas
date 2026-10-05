'use client';

import React from 'react';
import { Search, UserPlus, Filter, Shield, BookOpen, Clock, AlertTriangle, Mail, Phone, ChevronRight } from 'lucide-react';

// ==========================================
// ⚠️ TODO IMPORTANTE: CONEXIÓN A BASE DE DATOS
// ==========================================
// Estos datos son estáticos (MOCK) para el diseño inicial.
// Deben ser reemplazados por una llamada a la API de Laravel
// Ejemplo: fetch('/api/v1/docentes')
// ==========================================
const MOCK_DOCENTES = [
  { id: 1, name: 'Tte. Carlos Ramos', language: 'Inglés Militar', status: 'Activo', daysLeft: 5, phone: '+591 71234567', email: 'c.ramos@ejercito.mil.bo' },
  { id: 2, name: 'Sgto. María Condori', language: 'Francés', status: 'Activo', daysLeft: 2, phone: '+591 78901234', email: 'm.condori@ejercito.mil.bo' },
  { id: 3, name: 'Cap. Fernando Ríos', language: 'Mandarín', status: 'Próximo Relevo', daysLeft: 0, phone: '+591 76543210', email: 'f.rios@ejercito.mil.bo' },
  { id: 4, name: 'Lic. Ana Blanco', language: 'Quechua', status: 'Activo', daysLeft: 12, phone: '+591 73332211', email: 'a.blanco@ejercito.mil.bo' },
];

export default function DocentesPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
            Personal Docente
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Gestión de Instructores y Ciclos de Rotación (15 días)
          </p>
        </div>
        <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem' }}>
          <UserPlus size={16} />
          <span>Registrar Docente</span>
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '0.8rem', borderRadius: '50%', color: '#38bdf8' }}>
            <Shield size={24} />
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Total Docentes</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>24</p>
          </div>
        </div>
        
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.8rem', borderRadius: '50%', color: '#10b981' }}>
            <BookOpen size={24} />
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>En Aula (Activos)</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>18</p>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '0.8rem', borderRadius: '50%', color: '#fbbf24' }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Relevos Pendientes</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>3</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="card" style={{ padding: '1.5rem' }}>
        
        {/* Filters and Search */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '350px' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input 
              type="text" 
              placeholder="Buscar por grado, nombre o CI..." 
              className="input" 
              style={{ paddingLeft: '2.2rem', width: '100%' }}
            />
          </div>
          <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={16} /> Filtros
          </button>
        </div>

        {/* Teachers Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {MOCK_DOCENTES.map((docente) => (
            <div key={docente.id} style={{ 
              border: '1px solid #334155', 
              borderRadius: '8px', 
              padding: '1.25rem',
              background: 'rgba(30, 41, 59, 0.5)',
              transition: 'all 0.2s',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = '#475569'}
            onMouseOut={(e) => e.currentTarget.style.borderColor = '#334155'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc' }}>{docente.name}</h3>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500, marginTop: '0.1rem' }}>{docente.language}</p>
                </div>
                <span className={`badge ${docente.daysLeft === 0 ? 'badge-yellow' : 'badge-green'}`}>
                  {docente.status}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #334155' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1', fontSize: '0.8rem' }}>
                  <Clock size={14} color="#64748b" />
                  <span>Días para relevo: <strong style={{ color: docente.daysLeft === 0 ? '#fbbf24' : '#f8fafc' }}>{docente.daysLeft} días</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1', fontSize: '0.8rem' }}>
                  <Phone size={14} color="#64748b" />
                  <span>{docente.phone}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1', fontSize: '0.8rem' }}>
                  <Mail size={14} color="#64748b" />
                  <span>{docente.email}</span>
                </div>
              </div>

              <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  Ver Perfil <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
