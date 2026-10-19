'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type RolUsuario =
  | 'ADMIN'
  | 'JEFE_ACADEMICO'
  | 'DOCENTE'
  | 'CAJERO'
  | 'ALMACENERO'
  | 'ESTUDIANTE';

export interface UsuarioActual {
  id: number;
  nombre: string;
  email: string;
  ci: string;
  rol: RolUsuario;
  tituloRol: string;
  subtitulo: string;
}

export interface InfoRolConfig {
  id: RolUsuario;
  titulo: string;
  badge: string;
  nombrePorDefecto: string;
  emailPorDefecto: string;
  ciPorDefecto: string;
  pinSeguridad: string;
  descripcion: string;
  color: string;
  rutasPermitidas: string[];
}

export const ROLES_CONFIG: Record<RolUsuario, InfoRolConfig> = {
  ADMIN: {
    id: 'ADMIN',
    titulo: 'Administrador del Sistema',
    badge: 'Módulo 1: Catálogos Base & Auditoría',
    nombrePorDefecto: 'Cnl. DAEN. Roberto Méndez Silva',
    emailPorDefecto: 'admin@ejercito.mil.bo',
    ciPorDefecto: '3490218 LP',
    pinSeguridad: '9999',
    descripcion: 'Administra los catálogos base del sistema: gestiones, idiomas, aulas y aforos, horarios, modalidades, tipos de programa y tipos de pago.',
    color: '#eab308',
    rutasPermitidas: ['/', '/catalogos'],
  },
  JEFE_ACADEMICO: {
    id: 'JEFE_ACADEMICO',
    titulo: 'Jefe Académico',
    badge: 'Módulos 2 al 7: Gestión Curricular y Académica',
    nombrePorDefecto: 'Tcnl. DEM. Hugo Banzer Rivera',
    emailPorDefecto: 'jefe.academico@ejercito.mil.bo',
    ciPorDefecto: '2948102 LP',
    pinSeguridad: '5050',
    descripcion: 'Planifica programas, niveles y libros; registra docentes e idiomas; inscribe alumnos validando cupos; apertura paralelos y supervisa actas y exámenes de nivel.',
    color: '#3b82f6',
    rutasPermitidas: ['/', '/estructura', '/docentes', '/estudiantes', '/paralelos', '/inscripciones', '/calificaciones', '/metodos-numericos'],
  },
  DOCENTE: {
    id: 'DOCENTE',
    titulo: 'Docente / Catedrático',
    badge: 'Módulo 5 & 7: Evaluación y Consulta de Paralelos',
    nombrePorDefecto: 'Prof. Fernando Ríos Torrico',
    emailPorDefecto: 'doc.rios@ejercito.mil.bo',
    ciPorDefecto: '4820194 CB',
    pinSeguridad: '1010',
    descripcion: 'Consulta sus paralelos y su cronograma de rotación de 15 días; registra calificaciones por libro con la fórmula oficial (Examen 80%, Oral 10%, Participación 10%).',
    color: '#10b981',
    rutasPermitidas: ['/', '/paralelos', '/calificaciones'],
  },
  CAJERO: {
    id: 'CAJERO',
    titulo: 'Cajero / Ventanilla',
    badge: 'Módulo 8: Gestión de Cajas y Recaudaciones',
    nombrePorDefecto: 'Sof. My. David Choquehuanca',
    emailPorDefecto: 'cajero@ejercito.mil.bo',
    ciPorDefecto: '5920148 LP',
    pinSeguridad: '3030',
    descripcion: 'Controla la cola de atención FIFO, atiende turnos en ventanilla, cobra conceptos (matrícula, mensualidad, compra de libro) y emite comprobantes oficiales.',
    color: '#f59e0b',
    rutasPermitidas: ['/', '/cajas'],
  },
  ALMACENERO: {
    id: 'ALMACENERO',
    titulo: 'Encargado de Almacén',
    badge: 'Módulo 9: Almacén e Inventario de Libros',
    nombrePorDefecto: 'Sgto. 2do. Marcelo Justiniano',
    emailPorDefecto: 'almacen@ejercito.mil.bo',
    ciPorDefecto: '6019284 SC',
    pinSeguridad: '4040',
    descripcion: 'Supervisa el stock físico de libros, registra salidas/entradas de kardex, gestiona el punto de reorden (ROP) y pedidos de reposición a proveedores.',
    color: '#ec4899',
    rutasPermitidas: ['/', '/almacen'],
  },
  ESTUDIANTE: {
    id: 'ESTUDIANTE',
    titulo: 'Estudiante (Civil / Militar)',
    badge: 'Consultas Académicas y Turnos en Caja',
    nombrePorDefecto: 'Cad. Carlos Fernando Mamani',
    emailPorDefecto: 'est.mamani@ejercito.mil.bo',
    ciPorDefecto: '6849201 LP',
    pinSeguridad: '', // Acceso directo sin PIN
    descripcion: 'Consulta su historial de avance libro a libro y calificaciones, sus cursos inscritos, y solicita fichas de turno digital para trámites en caja.',
    color: '#06b6d4',
    rutasPermitidas: ['/', '/calificaciones', '/cajas', '/inscripciones'],
  },
};

interface AuthRoleContextType {
  usuario: UsuarioActual;
  rolActivo: RolUsuario;
  rolConfig: InfoRolConfig;
  esAdmin: boolean;
  esJefeAcademico: boolean;
  esDocente: boolean;
  esCajero: boolean;
  esAlmacenero: boolean;
  esEstudiante: boolean;
  canAccessRoute: (pathname: string) => boolean;
  cambiarRol: (nuevoRol: RolUsuario) => void;
  cerrarSesion: () => void;
}

const AuthRoleContext = createContext<AuthRoleContextType | undefined>(undefined);

export function AuthRoleProvider({ children }: { children: React.ReactNode }) {
  const [rolActivo, setRolActivo] = useState<RolUsuario>('JEFE_ACADEMICO');

  useEffect(() => {
    try {
      const savedRole = localStorage.getItem('eie_rol_activo') as RolUsuario;
      if (savedRole && ROLES_CONFIG[savedRole]) {
        setRolActivo(savedRole);
      }
    } catch (e) {
      // Ignorar en SSR
    }
  }, []);

  const cambiarRol = (nuevoRol: RolUsuario) => {
    if (ROLES_CONFIG[nuevoRol]) {
      setRolActivo(nuevoRol);
      try {
        localStorage.setItem('eie_rol_activo', nuevoRol);
      } catch (e) {}
    }
  };

  const cerrarSesion = () => {
    cambiarRol('ESTUDIANTE');
  };

  const rolConfig = ROLES_CONFIG[rolActivo];

  const usuario: UsuarioActual = {
    id: 1,
    nombre: rolConfig.nombrePorDefecto,
    email: rolConfig.emailPorDefecto,
    ci: rolConfig.ciPorDefecto,
    rol: rolActivo,
    tituloRol: rolConfig.titulo,
    subtitulo: rolConfig.badge,
  };

  const canAccessRoute = (pathname: string): boolean => {
    if (pathname === '/') return true;
    return rolConfig.rutasPermitidas.some(
      (r) => r === pathname || (r !== '/' && pathname.startsWith(r))
    );
  };

  return (
    <AuthRoleContext.Provider
      value={{
        usuario,
        rolActivo,
        rolConfig,
        esAdmin: rolActivo === 'ADMIN',
        esJefeAcademico: rolActivo === 'JEFE_ACADEMICO',
        esDocente: rolActivo === 'DOCENTE',
        esCajero: rolActivo === 'CAJERO',
        esAlmacenero: rolActivo === 'ALMACENERO',
        esEstudiante: rolActivo === 'ESTUDIANTE',
        canAccessRoute,
        cambiarRol,
        cerrarSesion,
      }}
    >
      {children}
    </AuthRoleContext.Provider>
  );
}

export function useAuthRole() {
  const ctx = useContext(AuthRoleContext);
  if (!ctx) {
    throw new Error('useAuthRole debe ser usado dentro de un AuthRoleProvider');
  }
  return ctx;
}
