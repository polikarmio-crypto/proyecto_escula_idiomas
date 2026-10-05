'use client';

import React from 'react';
import { Layers, Plus, Calendar, Users, MapPin, Search, Filter, BookOpen } from 'lucide-react';

// ==========================================
// ⚠️ TODO IMPORTANTE: CONEXIÓN A BASE DE DATOS
// ==========================================
// Estos datos son estáticos (MOCK) para el diseño inicial.
// Deben ser reemplazados por una llamada a la API de Laravel
// Ejemplo: fetch('/api/v1/paralelos')
// ==========================================
const MOCK_PARALELOS = [
  { id: 'ING-101-A', language: 'Inglés Militar', level: 'Básico', teacher: 'Tte. Carlos Ramos', schedule: '08:00 - 09:30', days: 'Lun-Vie', room: 'Aula 101', enrolled: 24, capacity: 30 },
  { id: 'ING-102-B', language: 'Inglés Militar', level: 'Intermedio', teacher: 'Sgto. María Condori', schedule: '10:00 - 11:30', days: 'Lun-Vie', room: 'Aula 102', enrolled: 18, capacity: 30 },
  { id: 'FRA-101-A', language: 'Francés', level: 'Básico', teacher: 'Cap. Fernando Ríos', schedule: '08:00 - 09:30', days: 'Mar-Jue', room: 'Aula 201', enrolled: 12, capacity: 20 },
  { id: 'MAN-201-A', language: 'Mandarín', level: 'Avanzado', teacher: 'Lic. Ana Blanco', schedule: '14:00 - 16:00', days: 'Lun-Mie-Vie', room: 'Aula 205', enrolled: 8, capacity: 15 },
];

export default function ParalelosPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
            Paralelos y Cursos
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Programación académica y asignación de aulas
          </p>
        </div>
        <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem' }}>
          <Plus size={16} />
          <span>Abrir Nuevo Paralelo</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="card" style={{ padding: '1.5rem' }}>
        
        {/* Actions Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '350px' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input 
              type="text" 
              placeholder="Buscar paralelo (ej. ING-101)..." 
              className="input" 
              style={{ paddingLeft: '2.2rem', width: '100%' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <select className="input" style={{ width: 'auto', padding: '0.4rem 2rem 0.4rem 0.75rem', cursor: 'pointer' }}>
              <option value="">Todos los idiomas</option>
              <option value="ingles">Inglés</option>
              <option value="frances">Francés</option>
              <option value="mandarin">Mandarín</option>
            </select>
            <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={16} /> Filtros
            </button>
          </div>
        </div>

        {/* Paralelos Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="table" style={{ width: '100%', minWidth: '800px' }}>
            <thead>
              <tr>
                <th>Código</th>
                <th>Idioma / Nivel</th>
                <th>Docente Asignado</th>
                <th>Horario / Días</th>
                <th>Aula</th>
                <th>Capacidad</th>
                <th style={{ textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_PARALELOS.map((paralelo) => (
                <tr key={paralelo.id}>
                  <td>
                    <span style={{ fontWeight: 700, color: '#f8fafc', background: 'rgba(56, 189, 248, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                      {paralelo.id}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <BookOpen size={14} color="#64748b" />
                      <div>
                        <div style={{ fontWeight: 600, color: '#e2e8f0' }}>{paralelo.language}</div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{paralelo.level}</div>
                      </div>
                    </div>
                  </td>
                  <td>{paralelo.teacher}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Calendar size={14} color="#64748b" />
                      <div>
                        <div style={{ color: '#e2e8f0' }}>{paralelo.schedule}</div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{paralelo.days}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#cbd5e1' }}>
                      <MapPin size={14} color="#64748b" /> {paralelo.room}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ flex: 1, background: '#334155', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ 
                          width: `${(paralelo.enrolled / paralelo.capacity) * 100}%`, 
                          background: (paralelo.enrolled / paralelo.capacity) > 0.8 ? '#fbbf24' : '#10b981',
                          height: '100%' 
                        }} />
                      </div>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8', width: '45px', textAlign: 'right' }}>
                        {paralelo.enrolled}/{paralelo.capacity}
                      </span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>
                      Gestionar
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
