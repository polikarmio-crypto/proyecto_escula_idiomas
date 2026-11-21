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
  FolderTree,
  Globe,
  ArrowLeft,
  ArrowRight,
  Home,
  UserPlus,
  LogIn,
  AlertCircle,
  CheckCircle2,
  Sliders,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { useAuthRole, RolUsuario, ROLES_CONFIG } from '@/context/AuthRoleContext';
import { logger } from '@/utils/logger';

import ThemeToggle from '@/components/workspace/ThemeToggle';

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

const EMAIL_PREFIX_TO_ROLE: Record<string, RolUsuario> = {
  'admin': 'ADMIN',
  'jef':   'JEFE_ACADEMICO',
  'doc':   'DOCENTE',
  'caj':   'CAJERO',
  'alm':   'ALMACENERO',
  'est':   'ESTUDIANTE',
};

function detectarRolPorEmail(email: string): RolUsuario {
  const emailLower = email.toLowerCase().trim();

  for (const [prefix, rol] of Object.entries(EMAIL_PREFIX_TO_ROLE)) {
    if (
      emailLower.startsWith(`${prefix}.`) ||
      emailLower.startsWith(`${prefix}@`) ||
      emailLower.startsWith(`${prefix}_`) ||
      emailLower.startsWith(`${prefix}-`) ||
      emailLower.includes(prefix)
    ) {
      return rol;
    }
  }
  return 'ESTUDIANTE';
}

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
}

interface NavCategory {
  title: string;
  items: NavItem[];
}

const CATEGORIZED_NAV_ITEMS: NavCategory[] = [
  {
    title: 'Operación Académica',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/paralelos', label: 'Paralelos', icon: Layers },
      { href: '/estudiantes', label: 'Estudiantes', icon: Users },
      { href: '/docentes', label: 'Docentes', icon: GraduationCap },
      { href: '/inscripciones', label: 'Inscripciones', icon: ClipboardEdit },
      { href: '/calificaciones', label: 'Calificaciones', icon: Award },
      { href: '/asistencia', label: 'Control Asistencia', icon: UserCheck },
    ],
  },
  {
    title: 'Control y Finanzas',
    items: [
      { href: '/cajas', label: 'Cajas y Recaudaciones', icon: Landmark },
      { href: '/almacen', label: 'Almacén de Libros', icon: Package },
    ],
  },
  {
    title: 'Analítica y Auditoría',
    items: [
      { href: '/catalogos', label: 'Catálogos Base', icon: Database },
      { href: '/estructura', label: 'Estructura Académica', icon: FolderTree },
      { href: '/metodos-numericos', label: 'Modelos & Proyecciones', icon: LineChart },
      { href: '/logs', label: 'Logs del Sistema', icon: ShieldAlert },
      { href: '/configuracion', label: 'Configuración', icon: Sliders },
    ],
  },
];

export type ThemeMode = 'dark' | 'light' | 'high-contrast';
export type TextScale = 'normal' | 'medium' | 'large';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const { usuario, autenticado, rolActivo, rolConfig, esAdmin, canAccessRoute, cambiarRol, iniciarSesion, cerrarSesion } = useAuthRole();
  const { data: session, status } = useSession();
  const [demoAuth, setDemoAuth] = useState(false);
  const isAuthenticated = status === 'authenticated' || autenticado || demoAuth;
  const isAuthenticating = status === 'loading';
  const [authStep, setAuthStep] = useState<string>('');
  const [authTab, setAuthTab] = useState<'login' | 'registro'>('login');
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [loginEmailError, setLoginEmailError] = useState<string | null>(null);

  const [regForm, setRegForm] = useState({
    nombres: '',
    apellidos: '',
    ci: '',
    expedido: 'LP',
    telefono: '',
    rol: 'ESTUDIANTE' as RolUsuario,
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [regErrors, setRegErrors] = useState<Record<string, string>>({});
  const [regSuccess, setRegSuccess] = useState<string | null>(null);

  const [modalCambioRol, setModalCambioRol] = useState(false);
  const [rolObjetivo, setRolObjetivo] = useState<RolUsuario | null>(null);
  const [pinIngresado, setPinIngresado] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('eie_theme') as ThemeMode;
      if (saved && (saved === 'light' || saved === 'dark' || saved === 'high-contrast')) {
        return saved;
      }
    }
    return 'light';
  });
  const [fontSize, setFontSize] = useState<TextScale>('normal');

  const cambiarTema = (nuevoTema: ThemeMode) => {
    setTheme(nuevoTema);
    logger.info('CLIENT_THEME_CHANGED', { nuevoTema });
    try {
      localStorage.setItem('eie_theme', nuevoTema);
      document.documentElement.setAttribute('data-theme', nuevoTema);
      if (nuevoTema === 'dark' || nuevoTema === 'high-contrast') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {}
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [transPhase, setTransPhase] = useState<'idle' | 'entering' | 'holding' | 'leaving'>('idle');
  const [transLabel, setTransLabel] = useState<string>('');
  const [TransIcon, setTransIcon] = useState<LucideIcon | null>(null);
  const prevPathRef = useRef(pathname);
  const expectedPathname = useRef<string | null>(null);

  const navCategories = CATEGORIZED_NAV_ITEMS.map((cat) => ({
    title: cat.title,
    items: cat.items.filter((item) => rolConfig.rutasPermitidas.includes(item.href)),
  })).filter((cat) => cat.items.length > 0);

  const allFilteredNavItems = navCategories.flatMap((c) => c.items);

  useEffect(() => {
    if (transPhase === 'entering' || transPhase === 'holding') {
      const failsafe = setTimeout(() => {
        setTransPhase('leaving');
        setTimeout(() => setTransPhase('idle'), 180);
      }, 1200);
      return () => clearTimeout(failsafe);
    }
  }, [transPhase]);

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

    router.push(item.href);
  };

  useEffect(() => {
    if (prevPathRef.current === pathname) return;
    prevPathRef.current = pathname;

    if (transPhase !== 'idle') {
      setTransPhase('leaving');
      const timer = setTimeout(() => {
        setTransPhase('idle');
        expectedPathname.current = null;
      }, 180);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.setAttribute('data-font-size', fontSize);
    if (theme === 'dark' || theme === 'high-contrast') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme, fontSize]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthStep('Redirigiendo a autenticación institucional con Google...');
    signIn('google', { callbackUrl: '/dashboard' }, { prompt: 'select_account' });
  };

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
    setLoginEmailError(null);

    const emailTrim = loginEmail.trim();
    if (!emailTrim || emailTrim.length < 3) {
      setLoginEmailError('Por favor ingrese su correo electrónico institucional o registrado.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) {
      setLoginEmailError('El formato de correo no es válido (ej: usuario@idiomas.ejercito.mil.bo).');
      return;
    }
    if (!loginPassword || loginPassword.length < 4) {
      setLoginEmailError('Por favor ingrese su contraseña institucional (mínimo 4 caracteres).');
      return;
    }

    const rolDetectado = detectarRolPorEmail(emailTrim);
    const config = ROLES_CONFIG[rolDetectado];
    if (typeof window !== 'undefined' && window.navigator && 'credentials' in window.navigator) {
      try {
        (window.navigator as any).credentials?.preventSilentAccess?.();
      } catch (e) {}
    }
    setLoginPassword('');
    triggerCurtain(`Acceso Concedido: ${config.titulo}`, Shield, () => {
      iniciarSesion({
        email: emailTrim,
        nombre: config.nombrePorDefecto,
        ci: config.ciPorDefecto,
        rol: rolDetectado,
        id_estudiante: null,
        id_docente: null,
      });
      setDemoAuth(true);
    });
  };

  const handleRegistroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    const nombresTrim = regForm.nombres.trim();
    if (!nombresTrim || nombresTrim.length < 3) {
      errors.nombres = 'El nombre debe tener al menos 3 caracteres (no se permite una sola letra).';
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(nombresTrim)) {
      errors.nombres = 'El campo nombres solo debe admitir letras.';
    }

    const apellidosTrim = regForm.apellidos.trim();
    if (!apellidosTrim || apellidosTrim.length < 3) {
      errors.apellidos = 'Los apellidos deben tener al menos 3 caracteres.';
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(apellidosTrim)) {
      errors.apellidos = 'El campo apellidos solo debe admitir letras.';
    }

    const ciTrim = regForm.ci.trim();
    if (!ciTrim || ciTrim.length < 5 || ciTrim.length > 10) {
      errors.ci = 'La Cédula de Identidad debe tener entre 5 y 10 dígitos numéricos.';
    } else if (!/^\d+$/.test(ciTrim)) {
      errors.ci = 'El C.I. solo admite dígitos numéricos.';
    }

    const telTrim = regForm.telefono.trim();
    if (!telTrim || telTrim.length !== 8) {
      errors.telefono = 'El teléfono celular debe contener exactamente 8 dígitos.';
    } else if (!/^\d+$/.test(telTrim)) {
      errors.telefono = 'El teléfono solo admite dígitos numéricos.';
    }

    const emailTrim = regForm.email.trim();
    if (!emailTrim || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) {
      errors.email = 'Ingrese una dirección de correo electrónico válida.';
    }

    if (!regForm.password || regForm.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres.';
    }

    if (regForm.password !== regForm.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden.';
    }

    if (Object.keys(errors).length > 0) {
      setRegErrors(errors);
      return;
    }

    setRegErrors({});

    setRegSuccess('¡Cuenta registrada exitosamente! Ahora puede iniciar sesión con sus credenciales.');
    setLoginEmail(emailTrim);
    setLoginPassword(regForm.password);
    setTimeout(() => {
      setAuthTab('login');
      setRegSuccess(null);
    }, 1800);
  };

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      const email = session.user.email;
      const rolDetectado = detectarRolPorEmail(email);
      iniciarSesion({
        email,
        nombre: session.user.name || email.split('@')[0],
        ci: '',
        rol: rolDetectado || 'ESTUDIANTE',
      });
    }
  }, [status, session]);

  const handleLogout = () => {
    triggerCurtain('Cierre de Sesión Operativa', LogOut, () => {
      setDemoAuth(false);
      setLoginEmail('');
      setLoginPassword('');
      setLoginEmailError(null);
      cerrarSesion();
      signOut({ redirect: false });
      router.push('/login');
    });
  };

  const handleSeleccionarRol = (targetRol: RolUsuario) => {
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

  useEffect(() => {
    if (pathname !== '/' && pathname !== '/login' && !isAuthenticated && status !== 'loading') {
      router.replace('/login');
    }
  }, [pathname, isAuthenticated, status, router]);

  if (pathname === '/' || pathname === '/login') {
    return (
      <>
        {transPhase !== 'idle' && (
          <div
            className={`military-curtain-backdrop curtain-${transPhase}`}
            onClick={() => setTransPhase('idle')}
            title="Haz clic para continuar de inmediato"
          >
            <div className="military-curtain-panel">
              <div className="curtain-tactical-grid" />
              <div className="curtain-hud-corner curtain-hud-top-left" />
              <div className="curtain-hud-corner curtain-hud-top-right" />
              <div className="curtain-hud-corner curtain-hud-bottom-left" />
              <div className="curtain-hud-corner curtain-hud-bottom-right" />
              <div className="curtain-core">
                <div className="curtain-radar-ring">
                  <div className="curtain-radar-dial" />
                  <div className="curtain-radar-dial-inner" />
                  <div className="curtain-emblem-badge">
                    <img src="/images/logos/logo-eie.png" alt="EIE" style={{ width: 56, height: 56, objectFit: 'contain' }} />
                  </div>
                </div>
                <div className="curtain-module-tag">Sistema Académico EIE</div>
                <h2 className="curtain-module-title">{transLabel}</h2>
                <div className="curtain-divider-gold" />
                <p className="curtain-institution">Escuela de Idiomas del Ejército &bull; CEDMIL</p>
                <div className="curtain-status-indicator">
                  <div className="curtain-status-dot" />
                  <span>CARGANDO...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        {children}
      </>
    );
  }

  return (
    <div>
      {!isAuthenticated ? (
        <div className="login-screen-wrapper" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Redirigiendo a autenticación institucional SACA...</p>
        </div>
      ) : (
        <div className="layout h-screen w-screen overflow-hidden flex flex-col bg-[var(--bg-base)] text-[var(--text-main)]">
          {/* Franja Tricolor Institucional Superior (2px) */}
          <div className="h-[2px] w-full bg-gradient-to-r from-[#dc2626] via-[#f59e0b] to-[#15803d] shrink-0 z-30" />

          {/* Header Único Superior (48px) */}
          <header className="topbar h-12 min-h-[48px] max-h-[48px] px-3 sm:px-4 flex items-center justify-between gap-3 shrink-0 z-20 shadow-xs border-b border-[var(--border-fine)]">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="btn btn-secondary btn-icon md:hidden p-1.5"
                aria-label="Abrir menú"
              >
                <Menu size={16} />
              </button>

              {/* Escudo Compacto EIE-CEDMIL con enlace al Dashboard */}
              <Link href="/dashboard" className="flex items-center gap-2 group shrink-0">
                <div className="w-8 h-8 rounded-[2px] bg-white dark:bg-[#121614] border border-[#D4D4D0] dark:border-[#242B27] flex items-center justify-center p-1 group-hover:border-[#D97706] dark:group-hover:border-[#F59E0B] transition">
                  <img
                    src="/images/logos/logo-eie.png"
                    alt="EIE"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="hidden sm:block">
                  <span className="text-[11px] font-black font-display text-white uppercase tracking-wider block leading-none">
                    EIE • SACA
                  </span>
                  <span className="text-[8px] font-mono text-[#F59E0B] uppercase">
                    CEDMIL // LA PAZ
                  </span>
                </div>
              </Link>

              {/* Botones de Historial y Home */}
              <div className="hidden lg:flex items-center gap-0.5 bg-black/20 border border-white/10 px-1 py-0.5 rounded-[2px]">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="p-1 hover:text-white text-zinc-300 transition"
                  title="Atrás"
                  aria-label="Atrás"
                >
                  <ArrowLeft size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => router.forward()}
                  className="p-1 hover:text-white text-zinc-300 transition"
                  title="Adelante"
                  aria-label="Adelante"
                >
                  <ArrowRight size={13} />
                </button>
                <div className="w-[1px] h-3 bg-white/20 mx-0.5" />
                <Link
                  href="/dashboard"
                  className="p-1 hover:text-white text-zinc-300 transition"
                  title="Inicio SACA"
                  aria-label="Inicio SACA"
                >
                  <Home size={13} />
                </Link>
              </div>

              {/* Breadcrumb Dinámico Táctico */}
              <div className="hidden md:flex items-center gap-1.5 text-xs font-mono text-zinc-300">
                <span className="text-zinc-400">SISTEMA</span>
                <span className="text-[#F59E0B]">&gt;</span>
                <span className="text-zinc-300">{rolConfig.titulo.split(' ')[0].toUpperCase()}</span>
                <span className="text-[#F59E0B]">&gt;</span>
                <span className="text-white font-bold uppercase truncate max-w-[140px] lg:max-w-none">
                  {pathname.replace('/', '') || 'DASHBOARD'}
                </span>
              </div>
            </div>

            {/* Acciones de la Derecha: Telemetría, Toggle Tema, Pill Usuario */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Indicador de Conexión Táctico */}
              <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 bg-black/30 border border-white/15 font-mono text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-zinc-400">SESIÓN:</span>
                <span className="text-emerald-400 font-bold">ONLINE</span>
              </div>

              {/* Acceso a Configuración */}
              <Link
                href="/configuracion"
                className="hidden md:flex items-center gap-1 px-2 py-1 bg-white/10 hover:bg-white/15 border border-white/20 text-white text-[11px] font-mono transition"
                title="Configuración & Accesibilidad"
              >
                <Sliders size={12} className="text-[#F59E0B]" />
                <span>Ajustes</span>
              </Link>

              {/* Selector de Modo Claro / Oscuro */}
              <ThemeToggle />

              {/* Pill Compacta de Credenciales */}
              <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-white/20">
                <div
                  style={{ backgroundColor: 'var(--military-green-primary)' }}
                  className="w-7 h-7 rounded-[2px] text-white flex items-center justify-center text-xs font-black border border-[#D97706] dark:border-[#F59E0B] shrink-0"
                >
                  {(usuario?.nombre || session?.user?.name || rolConfig.nombrePorDefecto).slice(0, 2).toUpperCase()}
                </div>
                <div className="hidden xl:block min-w-0 max-w-[150px]">
                  <p className="text-[11px] font-bold text-white truncate leading-none">
                    {usuario?.nombre || session?.user?.name || rolConfig.nombrePorDefecto}
                  </p>
                  <span className="text-[9px] font-mono text-[#F59E0B] truncate block mt-0.5">
                    ROL // {rolConfig.titulo.split(' ')[0].toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* Área de Trabajo Dividida: Sidebar + Contenido */}
          <div className="flex-1 flex min-h-0 overflow-hidden relative">
            {/* Overlay para Móviles */}
            <div
              className={`sidebar-overlay ${mobileMenuOpen ? 'open' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Sidebar Compacto (220px / 60px colapsable) */}
            <aside
              className={`sidebar flex flex-col justify-between shrink-0 transition-all duration-200 border-r border-[#D4D4D0] dark:border-[#242B27] ${
                sidebarCollapsed ? 'w-[60px] min-w-[60px]' : 'w-[220px] min-w-[220px]'
              } ${mobileMenuOpen ? 'open' : ''}`}
              style={{ width: sidebarCollapsed ? 60 : 220, minWidth: sidebarCollapsed ? 60 : 220 }}
            >
              {/* Header del Sidebar con Botón Colapsar */}
              <div className="h-10 px-2.5 border-b border-[#D4D4D0] dark:border-[#242B27] flex items-center justify-between shrink-0">
                {!sidebarCollapsed && (
                  <span className="text-[10px] font-mono font-bold tracking-widest text-[#D97706] dark:text-[#F59E0B] uppercase truncate">
                    MENÚ OPERATIVO
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="p-1 hover:bg-[#EAE8E1] dark:hover:bg-[#181E1B] text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition mx-auto"
                  title={sidebarCollapsed ? 'Expandir menú (220px)' : 'Colapsar menú (60px)'}
                >
                  {sidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
                </button>
              </div>

              {/* Navegación Agrupada por Categorías */}
              <nav className="sidebar-nav flex-1 min-h-0 overflow-y-auto px-1.5 py-2 space-y-3">
                {navCategories.map((cat, catIdx) => (
                  <div key={catIdx} className="space-y-0.5">
                    {!sidebarCollapsed ? (
                      <div className="px-2 py-1 text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest">
                        {cat.title}
                      </div>
                    ) : (
                      <div className="h-[1px] bg-[#D4D4D0] dark:bg-[#242B27] my-1.5 mx-1" />
                    )}

                    {cat.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={(e) => handleNavClick(e, item)}
                          className={`nav-item flex items-center gap-2.5 px-2 py-1.5 text-xs font-mono transition-all border-l-2 ${
                            isActive
                              ? 'bg-[#1B3B2B]/10 dark:bg-[#4D6B53]/20 text-[#1B3B2B] dark:text-white border-[#D97706] dark:border-[#F59E0B] font-bold'
                              : 'text-zinc-700 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-[#EAE8E1]/60 dark:hover:bg-[#181E1B] border-transparent'
                          } ${sidebarCollapsed ? 'justify-center' : ''}`}
                          title={sidebarCollapsed ? item.label : undefined}
                        >
                          <Icon size={16} className="shrink-0" />
                          {!sidebarCollapsed && <span className="truncate flex-1 text-[11px]">{item.label}</span>}
                          {!sidebarCollapsed && isActive && <ChevronRight size={12} className="text-[#D97706] dark:text-[#F59E0B] shrink-0" />}
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </nav>

              {/* Tarjeta de Credenciales al Fondo */}
              <div className="p-2 border-t border-[#D4D4D0] dark:border-[#242B27] bg-[#F4F3EF]/60 dark:bg-[#0A0C0B] shrink-0">
                {!sidebarCollapsed ? (
                  <div className="space-y-2">
                    <div className="p-2 bg-white dark:bg-[#121614] border border-[#D4D4D0] dark:border-[#242B27]">
                      <div className="flex items-center justify-between text-[9px] font-mono mb-1">
                        <span className="text-[#D97706] dark:text-[#F59E0B] font-bold uppercase truncate">
                          ROL // {rolConfig.titulo.split(' ')[0]}
                        </span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">● ACTIVO</span>
                      </div>
                      <p className="text-[11px] font-bold text-[#111312] dark:text-white truncate">
                        {usuario?.nombre || session?.user?.name || rolConfig.nombrePorDefecto}
                      </p>
                      <p className="text-[9px] font-mono text-zinc-500 truncate">
                        {usuario?.email || session?.user?.email || rolConfig.emailPorDefecto}
                      </p>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="w-full py-1.5 px-2 bg-red-100 hover:bg-red-200 dark:bg-red-950/40 dark:hover:bg-red-900/60 border border-red-300 dark:border-red-900/60 text-red-700 dark:text-red-400 text-[10px] font-mono font-bold uppercase flex items-center justify-center gap-1.5 transition"
                    >
                      <LogOut size={12} />
                      <span>TERMINAR SESIÓN</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="w-full py-2 flex items-center justify-center text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/40 transition"
                    title="Terminar Sesión"
                  >
                    <LogOut size={16} />
                  </button>
                )}
              </div>
            </aside>

            {/* Área Principal de Contenido (Zero-Scroll Estricto) */}
            <div className="flex-1 flex flex-col min-h-0 min-w-0 overflow-hidden relative">
              {/* Marca de Agua Institucional de Fondo */}
              <div className="institutional-watermark pointer-events-none select-none" aria-hidden="true">
                <img
                  src="/images/logos/logo-eie.png"
                  alt="Escudo Oficial EIE"
                  style={{ width: '360px', height: 'auto', opacity: 0.04 }}
                />
              </div>

              {/* Contenedor de la Página Actual */}
              <main className="page-content flex-1 h-full min-h-0 overflow-hidden flex flex-col p-0 z-10">
                <div key={pathname} className="h-full w-full min-h-0 overflow-hidden flex flex-col">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </div>
      )}

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

      {transPhase !== 'idle' && TransIcon && (
        <div
          className={`military-curtain-backdrop curtain-${transPhase}`}
          onClick={() => setTransPhase('idle')}
          title="Haz clic para continuar de inmediato"
        >
          <div className="military-curtain-panel">
            <div className="curtain-tactical-grid" />

            <div className="curtain-hud-corner curtain-hud-top-left" />
            <div className="curtain-hud-corner curtain-hud-top-right" />
            <div className="curtain-hud-corner curtain-hud-bottom-left" />
            <div className="curtain-hud-corner curtain-hud-bottom-right" />

            <div className="curtain-core">
              <div className="curtain-radar-ring">
                <div className="curtain-radar-dial" />
                <div className="curtain-radar-dial-inner" />
                <div className="curtain-emblem-badge">
                  <img src="/images/logos/logo-eie.png" alt="EIE" style={{ width: 56, height: 56, objectFit: 'contain' }} />
                </div>
              </div>

              <div className="curtain-module-tag">Sistema Académico EIE</div>

              <h2 className="curtain-module-title">{transLabel}</h2>

              <div className="curtain-divider-gold" />

              <p className="curtain-institution">
                Escuela de Idiomas del Ejército &bull; CEDMIL
              </p>

              <div className="curtain-status-indicator">
                <div className="curtain-status-dot" />
                <span>CARGANDO...</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
