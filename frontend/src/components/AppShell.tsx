'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LucideIcon,
  LayoutDashboard,
  Users,
  GraduationCap,
  Layers,
  ClipboardEdit,
  Award,
  Landmark,
  Package,
  Menu,
  X,
  Shield,
  Sun,
  Moon,
  Eye,
  Type,
  Lock,
  User,
  LogOut,
  ChevronRight,
  CheckCircle,
  FileText,
  KeyRound,
  ShieldAlert,
  UserCheck,
  LineChart,
  Database,
  FolderTree
} from 'lucide-react';
import { useAuthRole, RolUsuario, ROLES_CONFIG } from '@/context/AuthRoleContext';

export interface InfoRol {
  id: RolUsuario;
  titulo: string;
  badge: string;
  nombrePorDefecto: string;
  emailPorDefecto: string;
  pinSeguridad: string;
  palabraClave: string;
  descripcion: string;
  color: string;
  rutasPermitidas: string[];
}

/* ── MAPEO DE PREFIJO DE EMAIL INSTITUCIONAL → ROL ── */
const EMAIL_PREFIX_TO_ROLE: Record<string, RolUsuario> = {
  'admin': 'ADMIN',
  'jef':   'JEFE_ACADEMICO',
  'doc':   'DOCENTE',
  'caj':   'CAJERO',
  'alm':   'ALMACENERO',
  'est':   'ESTUDIANTE',
};

/** Detecta el rol a partir del prefijo del email institucional */
function detectarRolPorEmail(email: string): RolUsuario | null {
  const emailLower = email.toLowerCase().trim();
  for (const [prefix, rol] of Object.entries(EMAIL_PREFIX_TO_ROLE)) {
    if (
      emailLower.startsWith(`${prefix}.`) ||
      emailLower.startsWith(`${prefix}@`) ||
      emailLower.startsWith(`${prefix}_`) ||
      emailLower.startsWith(`${prefix}-`) ||
      emailLower.startsWith(prefix)
    ) {
      return rol;
    }
  }
  return null;
}

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
}

const ALL_NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/catalogos', label: 'Catálogos Base', icon: Database, badge: 'Mód 1' },
  { href: '/estructura', label: 'Estructura Académica', icon: FolderTree, badge: 'Mód 2' },
  { href: '/docentes', label: 'Docentes', icon: GraduationCap, badge: 'Mód 3' },
  { href: '/estudiantes', label: 'Estudiantes', icon: Users, badge: 'Mód 4' },
  { href: '/paralelos', label: 'Paralelos', icon: Layers, badge: 'Mód 5' },
  { href: '/inscripciones', label: 'Inscripciones', icon: ClipboardEdit, badge: 'Mód 6' },
  { href: '/calificaciones', label: 'Calificaciones', icon: Award, badge: 'Mód 7' },
  { href: '/cajas', label: 'Cajas / Pagos', icon: Landmark, badge: 'Mód 8' },
  { href: '/almacen', label: 'Almacén Libros', icon: Package, badge: 'Mód 9' },
  { href: '/metodos-numericos', label: 'Métodos Numéricos & IO', icon: LineChart, badge: 'Analítica' },
];

export type ThemeMode = 'dark' | 'light' | 'high-contrast';
export type TextScale = 'normal' | 'medium' | 'large';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Estados de autenticación
  const { data: session, status } = useSession();
  const [demoAuth, setDemoAuth] = useState(false);
  const isAuthenticated = status === 'authenticated' || demoAuth;
  const isAuthenticating = status === 'loading';
  const [authStep, setAuthStep] = useState<string>('');
  const [loginEmail, setLoginEmail] = useState<string>(''); // email ingresado en demo
  const [loginEmailError, setLoginEmailError] = useState<string | null>(null);

  // ROL ACTIVO EN EL SISTEMA (Sincronizado globalmente con AuthRoleContext)
  const { rolActivo, rolConfig, esAdmin, cambiarRol } = useAuthRole();

  // Modal para cambio de rol institucional y verificación de PIN
  const [modalCambioRol, setModalCambioRol] = useState(false);
  const [rolObjetivo, setRolObjetivo] = useState<RolUsuario | null>(null);
  const [pinIngresado, setPinIngresado] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);

  // Estados de accesibilidad
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [fontSize, setFontSize] = useState<TextScale>('normal');

  // Estado del menú móvil
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Estado de la cortina de transición entre secciones
  const [transPhase, setTransPhase] = useState<'idle' | 'entering' | 'holding' | 'leaving'>('idle');
  const [transLabel, setTransLabel] = useState<string>('');
  const [TransIcon, setTransIcon] = useState<LucideIcon | null>(null);
  const prevPathRef = useRef(pathname);
  const expectedPathname = useRef<string | null>(null);

  // Filtrado de items de navegación según los permisos del rol activo
  const navItems = ALL_NAV_ITEMS.filter((item) => rolConfig.rutasPermitidas.includes(item.href));

  // TEMPORIZADOR DE SEGURIDAD ABSOLUTO: La cortina de transición NUNCA puede quedarse atascada
  useEffect(() => {
    if (transPhase !== 'idle') {
      const failsafe = setTimeout(() => {
        setTransPhase('idle');
      }, 700);
      return () => clearTimeout(failsafe);
    }
  }, [transPhase]);

  // Manejador de navegación con transición ágil y segura
  const handleNavClick = (e: React.MouseEvent, item: NavItem) => {
    if (pathname === item.href) {
      e.preventDefault();
      setMobileMenuOpen(false);
      return;
    }
    e.preventDefault();
    setMobileMenuOpen(false);

    setTransLabel(item.label);
    setTransIcon(() => item.icon);
    setTransPhase('entering');
    expectedPathname.current = item.href;

    setTimeout(() => {
      setTransPhase('leaving');
      router.push(item.href);
    }, 200);

    setTimeout(() => {
      setTransPhase('idle');
    }, 500);
  };

  // Manejador para transiciones cuando la ruta cambia por enlaces internos (ej: Motor Quarkus)
  useEffect(() => {
    if (prevPathRef.current === pathname) return;
    prevPathRef.current = pathname;

    if (expectedPathname.current === pathname) {
      expectedPathname.current = null;
      return;
    }

    const match = ALL_NAV_ITEMS.find((n) => n.href === pathname);
    setTransLabel(match?.label ?? 'Módulo Académico');
    setTransIcon(() => match?.icon ?? Shield);
    setTransPhase('entering');

    const t1 = setTimeout(() => setTransPhase('leaving'), 200);
    const t2 = setTimeout(() => setTransPhase('idle'), 500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      setTransPhase('idle'); // Al desmontar siempre restaura a idle
    };
  }, [pathname]);

  // Sincronizar tema y accesibilidad en el elemento raíz
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.setAttribute('data-font-size', fontSize);
  }, [theme, fontSize]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthStep('Redirigiendo a autenticación institucional con Google...');
    signIn('google');
  };

  // Login demo con detección automática de rol por prefijo de email
  // Cargar sesión persistente de localStorage al iniciar
  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem('eie_auth');
      const savedRole = localStorage.getItem('eie_role');
      const savedEmail = localStorage.getItem('eie_email');
      if (savedAuth === 'true') {
        setDemoAuth(true);
        if (savedRole && ROLES_CONFIG[savedRole as RolUsuario]) {
          cambiarRol(savedRole as RolUsuario);
        }
        if (savedEmail) {
          setLoginEmail(savedEmail);
        }
      }
    } catch (e) {
      // Ignorar en SSR
    }
  }, []);

  const triggerCurtain = (label: string, icon: LucideIcon, onMidpoint: () => void) => {
    setTransLabel(label);
    setTransIcon(() => icon);
    setTransPhase('entering');

    setTimeout(() => {
      onMidpoint();
      setTransPhase('leaving');
    }, 300);

    setTimeout(() => {
      setTransPhase('idle');
    }, 650);
  };

  const handleDemoLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const rolDetectado = detectarRolPorEmail(loginEmail);
    if (!rolDetectado) {
      setLoginEmailError(
        'El email no tiene un prefijo institucional válido. Use: admin, jef, doc, caj, alm o est.'
      );
      return;
    }
    setLoginEmailError(null);

    const config = ROLES_CONFIG[rolDetectado];
    triggerCurtain(`Acceso Concedido: ${config.titulo}`, Shield, () => {
      cambiarRol(rolDetectado);
      setDemoAuth(true);

      try {
        localStorage.setItem('eie_auth', 'true');
        localStorage.setItem('eie_role', rolDetectado);
        localStorage.setItem('eie_email', loginEmail);
      } catch (err) {}
    });
  };

  // Auto-asignar rol cuando la sesión de Google se activa
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      const rolDetectado = detectarRolPorEmail(session.user.email);
      if (rolDetectado) {
        cambiarRol(rolDetectado);
      }
    }
  }, [status, session]);

  const handleLogout = () => {
    triggerCurtain('Cierre de Sesión Operativa', LogOut, () => {
      setDemoAuth(false);
      setLoginEmail('');
      setLoginEmailError(null);
      try {
        localStorage.removeItem('eie_auth');
        localStorage.removeItem('eie_role');
        localStorage.removeItem('eie_email');
      } catch (e) {}
      signOut({ redirect: false });
    });
  };

  // Validación y cambio de rol — SOLO ADMIN puede cambiar roles libremente
  const handleSeleccionarRol = (targetRol: RolUsuario) => {
    // Admin puede asumir cualquier rol sin PIN
    cambiarRol(targetRol);
    setModalCambioRol(false);
    setRolObjetivo(null);
    setPinError(null);
    setPinIngresado('');
  };

  const handleConfirmarPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rolObjetivo) return;

    const config = ROLES_CONFIG[rolObjetivo];
    const valorLimpio = pinIngresado.trim().toUpperCase();

    if (valorLimpio === config.pinSeguridad) {
      cambiarRol(rolObjetivo);
      setModalCambioRol(false);
      setRolObjetivo(null);
      setPinIngresado('');
      setPinError(null);
    } else {
      setPinError(`PIN de seguridad incorrecto para ${config.titulo}.`);
    }
  };

  return (
    <div>
      {/* ── BARRA SUPERIOR DE ACCESIBILIDAD Y CONTROLES VISUALES ── */}
      <div
        style={{
          background: 'var(--bg-surface-elevated)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '0.4rem 1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          fontSize: '0.75rem',
          zIndex: 200,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
          <Shield size={14} style={{ color: 'var(--military-gold-primary)' }} />
          <span>Ejército de Bolivia &bull; Escuela de Idiomas (CEDMIL)</span>
        </div>

        {/* Herramientas de Accesibilidad y Control de Sesión */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Selector de Tamaño de Texto */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Type size={13} /> Texto:
            </span>
            <div style={{ display: 'inline-flex', background: 'var(--bg-surface)', borderRadius: '4px', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
              <button
                type="button"
                onClick={() => setFontSize('normal')}
                style={{
                  padding: '0.2rem 0.55rem',
                  fontSize: '0.75rem',
                  background: fontSize === 'normal' ? 'var(--military-green-primary)' : 'transparent',
                  color: fontSize === 'normal' ? '#fff' : 'var(--text-muted)',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
                title="Texto Normal"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setFontSize('medium')}
                style={{
                  padding: '0.2rem 0.55rem',
                  fontSize: '0.82rem',
                  background: fontSize === 'medium' ? 'var(--military-green-primary)' : 'transparent',
                  color: fontSize === 'medium' ? '#fff' : 'var(--text-muted)',
                  border: 'none',
                  borderLeft: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  fontWeight: 700,
                }}
                title="Texto Medio (+16%)"
              >
                A+
              </button>
              <button
                type="button"
                onClick={() => setFontSize('large')}
                style={{
                  padding: '0.2rem 0.55rem',
                  fontSize: '0.9rem',
                  background: fontSize === 'large' ? 'var(--military-green-primary)' : 'transparent',
                  color: fontSize === 'large' ? '#fff' : 'var(--text-muted)',
                  border: 'none',
                  borderLeft: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  fontWeight: 800,
                }}
                title="Texto Grande (+33%)"
              >
                A++
              </button>
            </div>
          </div>

          {/* Selector de Contraste */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Contraste:</span>
            <div style={{ display: 'inline-flex', background: 'var(--bg-surface)', borderRadius: '4px', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                style={{
                  padding: '0.2rem 0.55rem',
                  background: theme === 'dark' ? 'var(--military-green-primary)' : 'transparent',
                  color: theme === 'dark' ? '#fff' : 'var(--text-muted)',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}
                title="Modo Oscuro Militar"
              >
                <Moon size={12} /> Oscuro
              </button>
              <button
                type="button"
                onClick={() => setTheme('light')}
                style={{
                  padding: '0.2rem 0.55rem',
                  background: theme === 'light' ? 'var(--military-green-primary)' : 'transparent',
                  color: theme === 'light' ? '#fff' : 'var(--text-muted)',
                  border: 'none',
                  borderLeft: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}
                title="Modo Claro Académico"
              >
                <Sun size={12} /> Claro
              </button>
              <button
                type="button"
                onClick={() => setTheme('high-contrast')}
                style={{
                  padding: '0.2rem 0.55rem',
                  background: theme === 'high-contrast' ? '#ffd700' : 'transparent',
                  color: theme === 'high-contrast' ? '#000000' : 'var(--text-muted)',
                  border: 'none',
                  borderLeft: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}
                title="Modo Alto Contraste"
              >
                <Eye size={12} /> Alto Contraste
              </button>
            </div>
          </div>

          {/* Botón de alternar sesión */}
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="btn btn-secondary"
              style={{ padding: '0.25rem 0.65rem', fontSize: '0.72rem' }}
              title="Salir y regresar a la pantalla de bienvenida / login militar"
            >
              <LogOut size={12} /> Salir
            </button>
          )}
        </div>
      </div>

      {/* ── PANTALLA DE BIENVENIDA / LOGIN MILITAR O SISTEMA COMPLETO ── */}
      {!isAuthenticated ? (
        <div className="login-screen-wrapper">
          <div className="login-card animate-solemn-fade" style={{ maxWidth: '520px' }}>
            <div className="login-card-border-top" />

            {/* Cabecera del login */}
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div
                style={{
                  width: 58,
                  height: 58,
                  margin: '0 auto 0.75rem',
                  borderRadius: '50%',
                  background: 'var(--military-green-primary)',
                  border: '2px solid var(--military-gold-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--military-gold-primary)',
                  boxShadow: 'var(--shadow-md)',
                }}
              >
                <Shield size={30} />
              </div>
              <h2 className="font-solemn" style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                ESCUELA DE IDIOMAS DEL EJÉRCITO
              </h2>
              <p style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--military-gold-primary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Comando de Educación y Doctrina Militar &bull; CEDMIL
              </p>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Control de Acceso Multi-Rol Institucional
              </p>
            </div>

            {isAuthenticating ? (
              <div className="military-loader animate-solemn-fade">
                <div className="military-crest-spinner">
                  <div className="spinner-outer-ring" />
                  <div className="spinner-inner-ring" />
                  <div className="spinner-center-symbol">
                    <Shield size={20} />
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                    Autenticando en Servidor Militar...
                  </p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--military-gold-primary)' }}>
                    {authStep}
                  </p>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* 1. Acceso por Email Institucional (auto-detección de rol por prefijo) */}
                <form onSubmit={handleDemoLogin} style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                  <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.45rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <KeyRound size={15} style={{ color: 'var(--military-gold-primary)' }} />
                    Ingreso con Email Institucional
                  </p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
                    El sistema detectará su rol automáticamente según el prefijo de su correo institucional.
                  </p>

                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => { setLoginEmail(e.target.value); setLoginEmailError(null); }}
                    placeholder="Ej: admin.mendez@ejercito.mil.bo"
                    className="input"
                    required
                    autoFocus
                    style={{ width: '100%', padding: '0.6rem', fontSize: '0.85rem', marginBottom: '0.5rem' }}
                  />

                  {loginEmailError && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#f87171', fontSize: '0.72rem', marginBottom: '0.5rem' }}>
                      <ShieldAlert size={14} />
                      <span>{loginEmailError}</span>
                    </div>
                  )}

                  {/* Tabla de prefijos de referencia */}
                  <div style={{ background: 'var(--bg-surface-elevated)', padding: '0.6rem', borderRadius: '5px', border: '1px solid var(--border-subtle)', marginBottom: '0.65rem' }}>
                    <p style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Prefijos Institucionales Registrados:
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.2rem 0.75rem' }}>
                      {Object.entries(EMAIL_PREFIX_TO_ROLE).map(([prefix, rol]) => (
                        <div key={prefix} style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'flex', gap: '0.3rem' }}>
                          <span style={{ fontWeight: 700, color: ROLES_CONFIG[rol].color, fontFamily: 'monospace' }}>{prefix}*</span>
                          <span>→ {ROLES_CONFIG[rol].badge}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.6rem', background: 'var(--military-green-primary)' }}>
                    <UserCheck size={16} /> Ingresar al Sistema
                  </button>
                </form>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.2rem 0' }}>
                  <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>O Autenticación Institucional</span>
                  <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
                </div>

                {/* 2. Login con Google */}
                <form onSubmit={handleLoginSubmit}>
                  <button type="submit" className="btn" style={{ width: '100%', padding: '0.65rem', background: '#ffffff', color: '#3c4043', border: '1px solid #dadce0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontWeight: 500, borderRadius: '4px' }}>
                    <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                      <path fill="none" d="M0 0h48v48H0z"/>
                    </svg>
                    <span>Ingresar con Google (Cuenta Institucional)</span>
                  </button>
                </form>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', textAlign: 'center' }}>
                  <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    &ldquo;Subordinación y Constancia &bull; ¡Viva Bolivia hacia el mar!&rdquo;
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ===================================================================
           INTERFAZ PRINCIPAL DEL SISTEMA (CON SIDEBAR Y FILTRO DE ROLES)
        =================================================================== */
        <div className="layout">
          {/* Overlay móvil */}
          <div
            className={`sidebar-overlay ${mobileMenuOpen ? 'open' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Sidebar */}
          <aside className={`sidebar ${mobileMenuOpen ? 'open' : ''}`}>
            <div className="sidebar-logo">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 6,
                    background: 'var(--military-green-primary)',
                    border: '1px solid var(--border-accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--military-gold-primary)',
                  }}
                >
                  <Shield size={20} />
                </div>
                <div>
                  <p className="font-solemn" style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.1 }}>
                    EIE &bull; CEDMIL
                  </p>
                  <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Escuela de Idiomas</p>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="btn-icon btn-ghost"
                style={{ display: mobileMenuOpen ? 'flex' : 'none' }}
                aria-label="Cerrar navegación"
              >
                <X size={18} />
              </button>
            </div>

            {/* Indicador del rol institucional en la barra lateral */}
            <div style={{ padding: '0.6rem 0.85rem', margin: '0.5rem 0.75rem', background: 'var(--bg-surface-elevated)', borderRadius: '6px', border: `1px solid ${rolConfig.color}44` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Rol Activo</span>
                <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.35rem', borderRadius: '3px', background: `${rolConfig.color}22`, color: rolConfig.color, fontWeight: 700 }}>
                  {rolConfig.badge}
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                {rolConfig.titulo}
              </p>
              {/* Solo Admin puede cambiar de rol libremente */}
              {esAdmin && (
                <button
                  type="button"
                  onClick={() => setModalCambioRol(true)}
                  style={{
                    marginTop: '0.45rem',
                    width: '100%',
                    padding: '0.3rem',
                    fontSize: '0.68rem',
                    background: 'transparent',
                    border: '1px dashed var(--border-subtle)',
                    borderRadius: '4px',
                    color: 'var(--military-gold-primary)',
                    cursor: 'pointer',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <KeyRound size={12} /> Cambiar Rol (Admin)
                </button>
              )}
            </div>

            <nav className="sidebar-nav">
              <div
                style={{
                  padding: '0.4rem 0.75rem',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: 'var(--text-dim)',
                  letterSpacing: '0.08em',
                }}
              >
                Módulos Habilitados
              </div>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item)}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                  >
                    <Icon size={17} />
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.badge && (
                      <span
                        style={{
                          fontSize: '0.62rem',
                          padding: '0.1rem 0.35rem',
                          borderRadius: 3,
                          background: 'var(--military-green-subtle)',
                          color: 'var(--status-active)',
                          fontWeight: 700,
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                    {isActive && <ChevronRight size={14} />}
                  </Link>
                );
              })}
            </nav>

            <div style={{ padding: '0.85rem 1rem', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-surface-elevated)' }}>
              <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Gestión Académica 2026
              </p>
              <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                Comando de Doctrina Militar
              </p>
            </div>
          </aside>

          {/* Área Principal */}
          <div className="main-content">
            <header className="topbar">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="btn btn-secondary btn-icon"
                  style={{ display: 'none' }}
                  id="mobile-menu-trigger"
                  aria-label="Abrir menú"
                >
                  <Menu size={18} />
                </button>
                <style>{`
                  @media (max-width: 860px) {
                    #mobile-menu-trigger { display: inline-flex !important; }
                  }
                `}</style>
                <div>
                  <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Escuela de Idiomas del Ejército
                  </h2>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Comando de Educación y Doctrina Militar &bull; La Paz, Bolivia
                  </p>
                </div>
              </div>

              {/* Información del usuario autenticado y rol activo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {esAdmin ? (
                  <button
                    onClick={() => setModalCambioRol(true)}
                    className="badge badge-gold"
                    style={{ cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.3rem 0.65rem' }}
                    title="Haz clic para cambiar de rol institucional (solo Admin)"
                  >
                    <KeyRound size={12} /> Rol: {rolConfig.titulo} &bull; [Cambiar]
                  </button>
                ) : (
                  <span
                    className="badge badge-gold"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.3rem 0.65rem' }}
                  >
                    <Shield size={12} /> Rol: {rolConfig.titulo}
                  </span>
                )}

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.3rem 0.65rem',
                    background: 'var(--bg-surface-elevated)',
                    borderRadius: '6px',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: '50%',
                      background: rolConfig.color,
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                    }}
                  >
                    {rolActivo.slice(0, 2)}
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.1 }}>
                      {session?.user?.name || rolConfig.nombrePorDefecto}
                    </p>
                    <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', lineHeight: 1.1 }}>
                      {session?.user?.email || rolConfig.emailPorDefecto}
                    </p>
                  </div>
                </div>
              </div>
            </header>

            <main className="page-content">
              <div key={pathname} className="page-transition-wrapper">
                {children}
              </div>
            </main>
          </div>
        </div>
      )}

      {/* =================================================================
          MODAL DE SELECCIÓN DE ROL Y VERIFICACIÓN DE PIN DE SEGURIDAD
      ================================================================= */}
      {/* Modal de cambio de rol — EXCLUSIVO para Admin */}
      {modalCambioRol && esAdmin && (
        <div className="modal-overlay" onClick={() => { setModalCambioRol(false); setRolObjetivo(null); }}>
          <div className="modal-card animate-solemn-fade" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <KeyRound size={18} style={{ color: 'var(--military-gold-primary)' }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                  Cambio de Rol (Administrador)
                </h3>
              </div>
              <button onClick={() => { setModalCambioRol(false); setRolObjetivo(null); }} className="btn-icon btn-ghost">
                <X size={16} />
              </button>
            </div>

            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
              Como Administrador del sistema, puede asumir cualquier rol institucional directamente sin verificación adicional.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {(Object.keys(ROLES_CONFIG) as RolUsuario[]).map((rolKey) => {
                const rol = ROLES_CONFIG[rolKey];
                const esActual = rolActivo === rolKey;

                return (
                  <div
                    key={rolKey}
                    onClick={() => handleSeleccionarRol(rolKey)}
                    style={{
                      padding: '0.65rem 0.85rem',
                      borderRadius: '6px',
                      border: `1px solid ${esActual ? rol.color : 'var(--border-subtle)'}`,
                      background: esActual ? `${rol.color}15` : 'var(--bg-surface-elevated)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.75rem',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: rol.color }}>
                          {rol.titulo}
                        </span>
                        {esActual && (
                          <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.35rem', borderRadius: '3px', background: rol.color, color: '#fff', fontWeight: 700 }}>
                            ACTUAL
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: '0.15rem 0 0' }}>
                        {rol.descripcion}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.65rem', color: 'var(--status-active)', fontWeight: 600 }}>
                        Acceso Directo ✓
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =================================================================
          CORTINA DE TRANSICIÓN MILITAR — VISIBLE EN PANTALLA COMPLETA
          (Clickable y con tiempo de descarte automático para nunca atascarse)
      ================================================================= */}
      {transPhase !== 'idle' && TransIcon && (
        <div
          className={`military-curtain-backdrop curtain-${transPhase}`}
          onClick={() => setTransPhase('idle')}
          title="Haz clic para continuar de inmediato"
        >
          <div className="military-curtain-panel">
            {/* Cuadrícula táctica militar */}
            <div className="curtain-tactical-grid" />

            {/* Visores HUD de esquina */}
            <div className="curtain-hud-corner curtain-hud-top-left" />
            <div className="curtain-hud-corner curtain-hud-top-right" />
            <div className="curtain-hud-corner curtain-hud-bottom-left" />
            <div className="curtain-hud-corner curtain-hud-bottom-right" />

            {/* Botón de omisión rápida en esquina para asegurar que nunca se atasque */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setTransPhase('idle');
              }}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.5rem',
                background: 'rgba(0,0,0,0.5)',
                border: '1px solid var(--military-gold-primary)',
                color: 'var(--military-gold-primary)',
                padding: '0.35rem 0.75rem',
                borderRadius: '4px',
                fontSize: '0.72rem',
                cursor: 'pointer',
                zIndex: 1000,
                fontWeight: 600,
              }}
            >
              Omitir [✕]
            </button>

            {/* Núcleo central con radar, escudo y textos */}
            <div className="curtain-core">
              <div className="curtain-radar-ring">
                <div className="curtain-radar-dial" />
                <div className="curtain-radar-dial-inner" />
                <div className="curtain-emblem-badge">
                  <TransIcon size={46} strokeWidth={2.2} />
                </div>
              </div>

              <div className="curtain-module-tag">Módulo Académico Militar</div>

              <h2 className="curtain-module-title">{transLabel}</h2>

              <div className="curtain-divider-gold" />

              <p className="curtain-institution">
                Escuela de Idiomas del Ejército &bull; CEDMIL
              </p>

              <div className="curtain-status-indicator">
                <div className="curtain-status-dot" />
                <span>DESPLEGANDO MÓDULO OPERATIVO...</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
