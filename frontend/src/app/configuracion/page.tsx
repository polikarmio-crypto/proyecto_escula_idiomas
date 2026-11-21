'use client';

import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Sun,
  Moon,
  Eye,
  Type,
  CheckCircle2,
  Lock,
  KeyRound,
  AlertCircle,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { useAuthRole } from '@/context/AuthRoleContext';

export default function ConfiguracionPage() {
  const { usuario } = useAuthRole();
  const [theme, setTheme] = useState<'light' | 'dark' | 'high-contrast'>('light');
  const [fontSize, setFontSize] = useState<'normal' | 'medium' | 'large'>('normal');

  // Estado para cambio de contraseñas
  const [passActual, setPassActual] = useState('');
  const [passNueva, setPassNueva] = useState('');
  const [passConfirm, setPassConfirm] = useState('');
  const [passLoading, setPassLoading] = useState(false);
  const [passMensaje, setPassMensaje] = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null);

  const handleCambiarPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMensaje(null);

    if (!passActual) {
      setPassMensaje({ tipo: 'error', texto: 'Por favor ingrese su contraseña actual o clave temporal.' });
      return;
    }
    if (!passNueva || passNueva.length < 4) {
      setPassMensaje({ tipo: 'error', texto: 'La nueva contraseña debe tener al menos 4 caracteres.' });
      return;
    }
    if (passNueva !== passConfirm) {
      setPassMensaje({ tipo: 'error', texto: 'La confirmación de la nueva contraseña no coincide.' });
      return;
    }

    setPassLoading(true);
    try {
      const res = await fetch('/api/v1/auth/cambiar-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_usuario: usuario?.id,
          email: usuario?.email,
          password_actual: passActual,
          password_nueva: passNueva,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'No fue posible actualizar la contraseña.');
      }

      setPassMensaje({ tipo: 'ok', texto: '¡Contraseña actualizada con éxito! Sus nuevas credenciales ya están activas.' });
      setPassActual('');
      setPassNueva('');
      setPassConfirm('');
    } catch (err: any) {
      setPassMensaje({ tipo: 'error', texto: err.message || 'Error de conexión al cambiar contraseña.' });
    } finally {
      setPassLoading(false);
    }
  };

  useEffect(() => {
    const sincronizarTema = () => {
      try {
        const savedTheme = localStorage.getItem('eie_theme') as any;
        if (savedTheme === 'dark' || savedTheme === 'light' || savedTheme === 'high-contrast') {
          setTheme(savedTheme);
          document.documentElement.setAttribute('data-theme', savedTheme);
          if (savedTheme === 'dark' || savedTheme === 'high-contrast') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      } catch (e) {}
    };

    sincronizarTema();

    try {
      const savedFontSize = localStorage.getItem('eie_font_size') as any;
      if (savedFontSize === 'normal' || savedFontSize === 'medium' || savedFontSize === 'large') {
        setFontSize(savedFontSize);
        document.documentElement.setAttribute('data-font-size', savedFontSize);
      }
    } catch (e) {}

    window.addEventListener('eie_theme_change', sincronizarTema);
    window.addEventListener('storage', sincronizarTema);
    return () => {
      window.removeEventListener('eie_theme_change', sincronizarTema);
      window.removeEventListener('storage', sincronizarTema);
    };
  }, []);

  const aplicarTema = (nuevo: 'light' | 'dark' | 'high-contrast') => {
    setTheme(nuevo);
    try {
      localStorage.setItem('eie_theme', nuevo);
      document.documentElement.setAttribute('data-theme', nuevo);
      if (nuevo === 'dark' || nuevo === 'high-contrast') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      window.dispatchEvent(new Event('eie_theme_change'));
    } catch (e) {}
  };

  const aplicarFontSize = (nuevo: 'normal' | 'medium' | 'large') => {
    setFontSize(nuevo);
    try {
      localStorage.setItem('eie_font_size', nuevo);
      document.documentElement.setAttribute('data-font-size', nuevo);
    } catch (e) {}
  };

  return (
    <div className="h-full flex flex-col min-h-0 overflow-hidden bg-[var(--bg-base)] text-[var(--text-main)]">
      {/* 1. FRANJA SUPERIOR COMPACTA (44px) */}
      <div className="strip-utility-bar">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[var(--military-green-subtle)] border border-[var(--border-accent)] text-[var(--military-green-primary)] dark:text-[var(--military-gold-primary)] font-mono text-[11px] font-bold shrink-0">
            <Sliders className="w-3.5 h-3.5" />
            <span>SACA / Preferencias & Accesibilidad</span>
          </div>

          <div className="h-4 w-[1px] bg-[var(--border-fine)] shrink-0" />

          <span className="text-xs font-bold text-[var(--text-main)] truncate hidden sm:inline">
            Configuración del Cockpit
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {usuario?.email && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-fine)] text-[var(--text-muted)]">
              {usuario.email}
            </span>
          )}
        </div>
      </div>

      {/* 2. ÁREA DE PANELES PARALELOS (100% CERO SCROLL EXTERNO) */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-2.5 p-2.5 overflow-hidden">
        {/* Panel Izquierdo: Apariencia, Tema y Escala Tipográfica */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-fine)] rounded-[2px] p-3 flex flex-col justify-between shadow-xs overflow-hidden">
          <div className="space-y-3">
            <div className="pb-2 border-b border-[var(--border-fine)] flex items-center justify-between">
              <h2 className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider flex items-center gap-1.5 font-sans">
                <Sun className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                Tema Visual Institucional
              </h2>
              <span className="text-[10px] font-mono text-[var(--text-muted)]">ESTILO DUAL</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => aplicarTema('light')}
                className={`p-2.5 rounded-[2px] border text-left transition flex flex-col justify-between ${
                  theme === 'light'
                    ? 'border-[var(--color-primary)] dark:border-[var(--color-accent)] bg-[var(--bg-surface)] ring-1 ring-[var(--color-accent)]/50'
                    : 'border-[var(--border-fine)] bg-[var(--bg-card)] hover:border-[var(--color-accent)]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Sun className="w-4 h-4 text-amber-600" />
                    <span className="font-bold text-xs text-[var(--text-main)] font-sans">Modo Claro</span>
                  </div>
                  {theme === 'light' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                </div>
                <p className="text-[10.5px] text-[var(--text-muted)] leading-tight">
                  Papel técnico cálido (#F4F3EF), bordes finos y verde militar institucional.
                </p>
              </button>

              <button
                type="button"
                onClick={() => aplicarTema('dark')}
                className={`p-2.5 rounded-[2px] border text-left transition flex flex-col justify-between ${
                  theme === 'dark'
                    ? 'border-[var(--color-accent)] bg-[var(--bg-surface)] ring-1 ring-[var(--color-accent)]/50'
                    : 'border-[var(--border-fine)] bg-[var(--bg-card)] hover:border-[var(--color-accent)]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Moon className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-xs text-[var(--text-main)] font-sans">Modo Oscuro</span>
                  </div>
                  {theme === 'dark' && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                </div>
                <p className="text-[10.5px] text-[var(--text-muted)] leading-tight">
                  Consola táctica nocturna (#0A0C0B), acentos dorados y alto contraste.
                </p>
              </button>
            </div>

            <div className="pt-2 border-t border-[var(--border-fine)]">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider flex items-center gap-1.5 font-sans">
                  <Type className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                  Escala Tipográfica del Monitor
                </h3>
                <span className="text-[10px] font-mono text-[var(--text-muted)]">ACCESIBILIDAD</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'normal', label: 'Estándar', sample: '100% (14px)', tag: 'A' },
                  { id: 'medium', label: 'Mediano', sample: '+15% (16px)', tag: 'A+' },
                  { id: 'large', label: 'Ampliado', sample: '+30% (18px)', tag: 'A++' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => aplicarFontSize(item.id as any)}
                    className={`p-2 rounded-[2px] border text-left transition flex items-center justify-between ${
                      fontSize === item.id
                        ? 'border-[var(--color-primary)] dark:border-[var(--color-accent)] bg-[var(--bg-surface)] ring-1 ring-[var(--color-accent)]/50'
                        : 'border-[var(--border-fine)] bg-[var(--bg-card)] hover:border-[var(--color-accent)]'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold text-[var(--text-main)] block">{item.label}</span>
                      <span className="text-[10px] text-[var(--text-muted)] font-mono">{item.sample}</span>
                    </div>
                    <span className="font-mono text-xs font-black text-[var(--color-accent)]">{item.tag}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[var(--border-fine)] text-[10.5px] font-mono text-[var(--text-muted)] flex items-center justify-between">
            <span>SACA CEDMIL • Sistema Operativo</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">● SINCRONIZADO</span>
          </div>
        </div>

        {/* Panel Derecho: Seguridad & Cambio de Credenciales */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-fine)] rounded-[2px] p-3 flex flex-col justify-between shadow-xs overflow-hidden">
          <div className="space-y-3">
            <div className="pb-2 border-b border-[var(--border-fine)] flex items-center justify-between">
              <h2 className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider flex items-center gap-1.5 font-sans">
                <KeyRound className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                Seguridad & Actualización de Contraseña
              </h2>
              <span className="text-[10px] font-mono text-[var(--text-muted)]">CREDENCIALES</span>
            </div>

            {passMensaje && (
              <div
                className={`p-2 rounded-[2px] border text-xs flex items-center gap-2 ${
                  passMensaje.tipo === 'ok'
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
                    : 'bg-red-950/20 border-red-500/40 text-red-600 dark:text-red-400'
                }`}
              >
                {passMensaje.tipo === 'ok' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                )}
                <span>{passMensaje.texto}</span>
              </div>
            )}

            <form onSubmit={handleCambiarPassword} className="space-y-2.5 text-xs">
              <div>
                <label className="text-[11px] font-mono text-[var(--text-muted)] block mb-1">
                  Contraseña Actual o Clave Temporal:
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={passActual}
                    onChange={(e) => setPassActual(e.target.value)}
                    placeholder="Ingrese su clave actual"
                    required
                    className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded bg-[var(--bg-surface)] border border-[var(--border-fine)] text-[var(--text-main)] outline-none focus:border-[var(--color-accent)] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-mono text-[var(--text-muted)] block mb-1">
                    Nueva Contraseña:
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={passNueva}
                      onChange={(e) => setPassNueva(e.target.value)}
                      placeholder="Mínimo 4 caracteres"
                      required
                      className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded bg-[var(--bg-surface)] border border-[var(--border-fine)] text-[var(--text-main)] outline-none focus:border-[var(--color-accent)] font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-[var(--text-muted)] block mb-1">
                    Confirmar Contraseña:
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={passConfirm}
                      onChange={(e) => setPassConfirm(e.target.value)}
                      placeholder="Repita la clave"
                      required
                      className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded bg-[var(--bg-surface)] border border-[var(--border-fine)] text-[var(--text-main)] outline-none focus:border-[var(--color-accent)] font-mono"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={passLoading}
                className="btn btn-primary w-full py-2 text-xs font-bold mt-2 flex items-center justify-center gap-1.5"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>{passLoading ? 'Actualizando...' : 'Guardar Nueva Contraseña'}</span>
              </button>
            </form>
          </div>

          <div className="pt-2 border-t border-[var(--border-fine)] text-[10.5px] font-mono text-[var(--text-muted)]">
            Cifrado de credenciales de usuario bajo régimen militar
          </div>
        </div>
      </div>
    </div>
  );
}
