'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // default true for immediate browsing, can toggle
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
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
  const [loginCi, setLoginCi] = useState('6849201');
  const [loginPassword, setLoginPassword] = useState('••••••••');
  const [loginRole, setLoginRole] = useState('ADMIN');

  // Efecto para sincronizar tema y tamaño de texto en el elemento <html>
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.setAttribute('data-font-size', fontSize);
  }, [theme, fontSize]);

  // Manejador del flujo de autenticación con animación y transición estilizada
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setAuthStep('Validando credenciales en el Estado Mayor...');

    setTimeout(() => {
      setAuthStep('Verificando nivel de seguridad y permisos académicos...');
    }, 800);

    setTimeout(() => {
      setAuthStep('Acceso militar autorizado. Sincronizando módulos...');
    }, 1600);

    setTimeout(() => {
      setIsAuthenticating(false);
      setIsAuthenticated(true);
    }, 2200);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthStep('');
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
                <div>
                  <label>Perfil de Acceso</label>
                  <select
                    value={loginRole}
                    onChange={(e) => setLoginRole(e.target.value)}
                    className="input"
                    style={{ cursor: 'pointer' }}
                  >
                    <option value="ADMIN">Oficial de Registro / Estado Mayor</option>
                    <option value="DOCENTE">Personal Docente de Idiomas</option>
                    <option value="ESTUDIANTE">Estudiante / Oficial Cursante</option>
                  </select>
                </div>

                <div>
                  <label>Carnet de Identidad o NUA Militar</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      required
                      value={loginCi}
                      onChange={(e) => setLoginCi(e.target.value)}
                      placeholder="Ingrese CI o NUA"
                      className="input"
                    />
                  </div>
                </div>

                <div>
                  <label>Código de Autenticación / Contraseña</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="input"
                    />
                  </div>
                </div>

                <div style={{ padding: '0.5rem 0' }}>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
                    <Lock size={16} />
                    <span>Ingresar al Sistema Académico</span>
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
                      Pablo Medina
                    </p>
                    <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', lineHeight: 1.1 }}>
                      CI 6849201 LP
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
