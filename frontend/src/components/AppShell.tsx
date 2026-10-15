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
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
}

const navItems: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/estudiantes', label: 'Estudiantes', icon: Users, badge: 'Activo' },
  { href: '/docentes', label: 'Docentes', icon: GraduationCap },
  { href: '/paralelos', label: 'Paralelos', icon: Layers },
  { href: '/inscripciones', label: 'Inscripciones', icon: ClipboardEdit },
  { href: '/calificaciones', label: 'Calificaciones', icon: Award },
  { href: '/cajas', label: 'Cajas / Pagos', icon: Landmark },
  { href: '/almacen', label: 'Almacén Libros', icon: Package },
];

export type ThemeMode = 'dark' | 'light' | 'high-contrast';
export type TextScale = 'normal' | 'medium' | 'large';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Estados de autenticación
  const { data: session, status } = useSession();
  const [demoAuth, setDemoAuth] = useState(true);
  const isAuthenticated = status === 'authenticated' || demoAuth;
  const isAuthenticating = status === 'loading';
  const [authStep, setAuthStep] = useState<string>('');

  // Estados de accesibilidad
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [fontSize, setFontSize] = useState<TextScale>('normal');

  // Estado del menú móvil
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Estado de la cortina de transición entre secciones
  // phase: 'idle' | 'entering' | 'holding' | 'leaving'
  const [transPhase, setTransPhase] = useState<'idle' | 'entering' | 'holding' | 'leaving'>('idle');
  const [transLabel, setTransLabel] = useState<string>('');
  const [TransIcon, setTransIcon] = useState<LucideIcon | null>(null);
  const prevPathRef = useRef(pathname);
  const expectedPathname = useRef<string | null>(null); // Referencia para evitar doble animación

  // Manejador de navegación con cortina de transición en toda la pantalla
  const handleNavClick = (e: React.MouseEvent, item: NavItem) => {
    if (pathname === item.href) {
      e.preventDefault();
      setMobileMenuOpen(false);
      return;
    }
    e.preventDefault();
    if (transPhase !== 'idle') return;

    setMobileMenuOpen(false);
    setTransLabel(item.label);
    setTransIcon(() => item.icon);
    setTransPhase('entering');
    expectedPathname.current = item.href;

    // Al cubrir la pantalla, ejecutar la navegación de Next.js
    setTimeout(() => {
      setTransPhase('holding');
      router.push(item.href);
    }, 350);

    // Salida de la cortina revelando la nueva pantalla
    setTimeout(() => {
      setTransPhase('leaving');
    }, 750);

    // Fin de la transición
    setTimeout(() => {
      setTransPhase('idle');
    }, 1100);
  };

  // Respaldo para cambios de ruta externos (botones atrás/adelante del navegador)
  useEffect(() => {
    if (prevPathRef.current === pathname) return;
    prevPathRef.current = pathname;

    // Si la ruta cambió por un clic en la barra lateral, ignoramos esta transición extra
    if (expectedPathname.current === pathname) {
      expectedPathname.current = null;
      return;
    }

    if (transPhase !== 'idle') return;

    const match = navItems.find((n) => n.href === pathname);
    setTransLabel(match?.label ?? 'Módulo Académico');
    setTransIcon(() => match?.icon ?? Shield);
    setTransPhase('entering');

    const t1 = setTimeout(() => setTransPhase('holding'), 350);
    const t2 = setTimeout(() => setTransPhase('leaving'), 750);
    const t3 = setTimeout(() => setTransPhase('idle'), 1100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [pathname, transPhase]);

  // Formulario de login
  // const [loginRole, setLoginRole] = useState('ADMIN'); // Ya no es necesario


  // Efecto para sincronizar tema y tamaño de texto en el elemento <html>
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.setAttribute('data-font-size', fontSize);
  }, [theme, fontSize]);

  // Manejador del flujo de autenticación con animación y transición estilizada
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthStep('Redirigiendo a autenticación institucional con Google...');
    signIn('google');
  };

  const handleLogout = () => {
    setDemoAuth(false);
    signOut({ redirect: false });
  };

  return (
    <div>
      {/* ── BARRA SUPERIOR DE ACCESIBILIDAD Y CONTROLES VISUALES (Siempre presente) ── */}
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

        {/* Herramientas de Accesibilidad: Tema y Tamaño de Texto */}
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
                title="Tamaño de texto Normal (100%)"
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
                title="Aumento Medio de texto (+16%)"
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
                title="Gran Aumento de texto para baja visión (+33%)"
              >
                A++
              </button>
            </div>
          </div>

          {/* Selector de Modo de Visualización (Claro / Oscuro / Alto Contraste) */}
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
                title="Modo Alto Contraste (Accesibilidad Visual)"
              >
                <Eye size={12} /> Alto Contraste
              </button>
            </div>
          </div>

          {/* Botón de alternar pantalla de login / sesión */}
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="btn btn-secondary"
              style={{ padding: '0.25rem 0.65rem', fontSize: '0.72rem' }}
              title="Salir y regresar a la pantalla de bienvenida / login militar"
            >
              <LogOut size={12} /> Cerrar Sesión
            </button>
          )}
        </div>
      </div>

      {/* ── CONDICIONAL: PANTALLA DE BIENVENIDA / LOGIN O SISTEMA COMPLETO ── */}
      {!isAuthenticated ? (
        /* ===================================================================
           PANTALLA DE BIENVENIDA / LOGIN MILITAR SOBRIO Y ELEGANTE
        =================================================================== */
        <div className="login-screen-wrapper">
          <div className="login-card animate-solemn-fade">
            <div className="login-card-border-top" />

            {/* Cabecera del login */}
            <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
              <div
                style={{
                  width: 60,
                  height: 60,
                  margin: '0 auto 1rem',
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
                <Shield size={32} />
              </div>
              <h2 className="font-solemn" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                ESCUELA DE IDIOMAS DEL EJÉRCITO
              </h2>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--military-gold-primary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Comando de Educación y Doctrina Militar &bull; CEDMIL
              </p>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                Sistema Integrado de Gestión Académica Militar (SACA)
              </p>
            </div>

            {/* Estado de carga con transición durante la autenticación */}
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
              <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                <div style={{ padding: '0.25rem 0', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <button type="submit" className="btn" style={{ width: '100%', padding: '0.75rem', background: '#ffffff', color: '#3c4043', border: '1px solid #dadce0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontWeight: 500, boxShadow: '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)', borderRadius: '4px' }}>
                    <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                      <path fill="none" d="M0 0h48v48H0z"/>
                    </svg>
                    <span>Iniciar sesión con Google</span>
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.2rem 0' }}>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>O acceso de inspección</span>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
                  </div>

                  <button
                    type="button"
                    onClick={() => setDemoAuth(true)}
                    className="btn btn-primary"
                    style={{
                      width: '100%',
                      padding: '0.7rem 1rem',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      background: 'var(--military-green-primary)',
                      border: '1px solid var(--border-accent)',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                    }}
                  >
                    <Shield size={16} style={{ color: 'var(--military-gold-primary)' }} />
                    <span>Acceso Directo (Modo Demostración Oficial)</span>
                  </button>
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem', textAlign: 'center' }}>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    &ldquo;Subordinación y Constancia &bull; ¡Viva Bolivia hacia el mar!&rdquo;
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : (
        /* ===================================================================
           INTERFAZ PRINCIPAL DEL SISTEMA (LAYOUT CON SIDEBAR Y CONTENIDO)
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
                Módulos Académicos
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

              {/* Información del usuario autenticado */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span className="badge badge-military">
                  <Shield size={12} /> Oficial de Registro
                </span>
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
                      background: 'var(--military-green-primary)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                    }}
                  >
                    PM
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.1 }}>
                      {session?.user?.name || (demoAuth ? 'Cap. Pablo Medina' : 'Oficial Institucional')}
                    </p>
                    <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', lineHeight: 1.1 }}>
                      {session?.user?.email || (demoAuth ? 'p.medina@ejercito.mil.bo' : 'institucional@ejercito.mil.bo')}
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
          CORTINA DE TRANSICIÓN MILITAR — VISIBLE EN PANTALLA COMPLETA
      ================================================================= */}
      {transPhase !== 'idle' && TransIcon && (
        <div className={`military-curtain-backdrop curtain-${transPhase}`}>
          <div className="military-curtain-panel">
            {/* Cuadrícula táctica militar */}
            <div className="curtain-tactical-grid" />

            {/* Visores HUD de esquina */}
            <div className="curtain-hud-corner curtain-hud-top-left" />
            <div className="curtain-hud-corner curtain-hud-top-right" />
            <div className="curtain-hud-corner curtain-hud-bottom-left" />
            <div className="curtain-hud-corner curtain-hud-bottom-right" />

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
