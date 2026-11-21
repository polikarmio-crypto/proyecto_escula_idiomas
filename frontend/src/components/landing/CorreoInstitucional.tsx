'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  KeyRound,
  AlertCircle,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Lock,
  Mail,
  ShieldCheck,
} from 'lucide-react';

export default function CorreoInstitucional() {
  const [ciBusqueda, setCiBusqueda] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorCorreo, setErrorCorreo] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [resultado, setResultado] = useState<{
    estudiante: any;
    emailGenerado: string;
    passwordTemporal: string;
    fechaEmision: string;
  } | null>(null);

  const handleSolicitarCorreo = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorCorreo(null);
    setResultado(null);
    setCopiado(false);

    const q = ciBusqueda.trim();
    if (!q || q.length < 4) {
      setErrorCorreo('Por favor ingrese un número de C.I. o Código de Inscripción válido (al menos 4 caracteres).');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/v1/estudiantes?q=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error('No se pudo verificar la inscripción en la base de datos');
      const json = await res.json();
      const lista = json.data || [];
      const coincidencia = lista.length > 0 ? lista[0] : null;

      if (!coincidencia) {
        setErrorCorreo(
          'No se encontró ninguna inscripción activa con ese documento o código. Verifique su número de C.I. o realice primero su preinscripción digital.'
        );
        return;
      }

      const nombres = coincidencia.nombre_estudiante || coincidencia.nombres || '';
      const apellidos = coincidencia.apellido_estudiante || coincidencia.apellidos || '';
      const ci = coincidencia.ci_estudiante || coincidencia.ci || '';

      const primerNombre = (nombres.split(' ')[0] || 'est').toLowerCase().replace(/[^a-z0-9]/g, '');
      const primerApellido = (apellidos.split(' ')[0] || 'militar').toLowerCase().replace(/[^a-z0-9]/g, '');
      const emailOficial = `est.${primerNombre}.${primerApellido}@idiomas.ejercito.mil.bo`;

      const ciNumerico = ci.replace(/\D/g, '').slice(-4) || '2026';
      const passTemporal = `Eie.${ciNumerico}*!`;

      // Activar la cuenta de usuario en el backend
      try {
        await fetch('/api/v1/auth/activar-cuenta-estudiante', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_estudiante: coincidencia.id_estudiante || coincidencia.id,
            email: emailOficial,
            password: passTemporal,
          }),
        });
      } catch (actErr) {
        console.warn('Advertencia en vinculación backend inmediata', actErr);
      }

      setResultado({
        estudiante: coincidencia,
        emailGenerado: emailOficial,
        passwordTemporal: passTemporal,
        fechaEmision: new Date().toLocaleDateString('es-BO', { day: '2-digit', month: 'long', year: 'numeric' }),
      });
    } catch (err: any) {
      setErrorCorreo(err.message || 'Error de conexión con el servidor institucional');
    } finally {
      setLoading(false);
    }
  };

  const copiarCredenciales = () => {
    if (!resultado) return;
    const texto = `CUENTA INSTITUCIONAL - ESCUELA DE IDIOMAS DEL EJÉRCITO\nUsuario: ${resultado.emailGenerado}\nContraseña Temporal: ${resultado.passwordTemporal}\nPortal de Acceso: https://accounts.google.com`;
    navigator.clipboard.writeText(texto);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 3000);
  };

  return (
    <section id="correo-institucional" className="relative py-16 sm:py-24 border-t border-[#D4D4D0] dark:border-[#242B27]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Encabezado Técnico */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#D4D4D0] dark:border-[#242B27] pb-4">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold tracking-widest text-[#D97706] dark:text-[#F59E0B] uppercase">
              05 // TELEMETRÍA Y CREDENCIALES
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#111312] dark:text-white font-display uppercase tracking-tight">
              Correo Institucional Google Workspace
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#4B524E] dark:text-zinc-400 max-w-md font-sans">
            Activación y entrega de cuentas oficiales con dominio{' '}
            <strong className="text-[#D97706] dark:text-[#F59E0B]">@idiomas.ejercito.mil.bo</strong> para acceso al aula
            virtual, laboratorios y Google Classroom.
          </p>
        </div>

        {/* Contenedor Táctico */}
        <div className="relative bg-white dark:bg-[#121614] border border-[#D4D4D0] dark:border-[#242B27] p-6 sm:p-10 max-w-3xl mx-auto shadow-sm">
          <div className="hud-bracket-tl" />
          <div className="hud-bracket-tr" />
          <div className="hud-bracket-bl" />
          <div className="hud-bracket-br" />

          <form onSubmit={handleSolicitarCorreo} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#111312] dark:text-zinc-300 block">
                Ingrese su Cédula de Identidad (C.I.) o Código de Pre-Inscripción:
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Ej: 6849201 LP o EIE-2026-..."
                  value={ciBusqueda}
                  onChange={(e) => {
                    setCiBusqueda(e.target.value);
                    setErrorCorreo(null);
                  }}
                  required
                  className="flex-1 bg-[#F4F3EF] dark:bg-[#0A0C0B] border border-[#D4D4D0] dark:border-[#242B27] focus:border-[#D97706] dark:focus:border-[#F59E0B] px-4 py-3 text-xs sm:text-sm text-[#111312] dark:text-white font-mono outline-none"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-[#F59E0B] hover:bg-[#D97706] text-zinc-950 font-mono font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-50 shrink-0 shadow-md"
                >
                  <KeyRound className="w-4 h-4 text-zinc-950" />
                  <span className="text-zinc-950">{loading ? 'Verificando...' : 'Tramitar Correo'}</span>
                </button>
              </div>
            </div>

            {errorCorreo && (
              <div className="p-3 bg-red-100 dark:bg-red-950/60 border border-red-300 dark:border-red-500/50 text-red-800 dark:text-red-300 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
                <span>{errorCorreo}</span>
              </div>
            )}
          </form>

          {/* Resultado de Credenciales Emitidas */}
          {resultado && (
            <div className="mt-8 p-6 bg-[#F4F3EF] dark:bg-[#0A0C0B] border border-[#D97706]/70 dark:border-[#F59E0B]/60 space-y-5 animate-solemn-fade">
              <div className="flex items-center justify-between border-b border-[#D4D4D0] dark:border-[#242B27] pb-3">
                <div>
                  <span className="text-[10px] text-[#D97706] dark:text-[#F59E0B] font-mono font-bold uppercase block">
                    CUENTA INSTITUCIONAL GENERADA
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-[#111312] dark:text-white font-display">
                    {resultado.estudiante.nombre_estudiante} {resultado.estudiante.apellido_estudiante}
                  </h4>
                </div>
                <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-500/50 text-[#1B3B2B] dark:text-emerald-400 text-[10px] font-mono font-bold uppercase">
                  ACTIVO
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 bg-white dark:bg-[#121614] border border-[#D4D4D0] dark:border-[#242B27]">
                  <span className="text-[10px] text-zinc-500 uppercase block mb-1">
                    Dirección de Correo Oficial:
                  </span>
                  <strong className="text-[#1B3B2B] dark:text-emerald-400 break-all text-xs sm:text-sm">
                    {resultado.emailGenerado}
                  </strong>
                </div>

                <div className="p-3 bg-white dark:bg-[#121614] border border-[#D4D4D0] dark:border-[#242B27]">
                  <span className="text-[10px] text-zinc-500 uppercase block mb-1">
                    Contraseña Temporal Asignada:
                  </span>
                  <strong className="text-[#D97706] dark:text-[#F59E0B] text-xs sm:text-sm">
                    {resultado.passwordTemporal}
                  </strong>
                  <span className="text-[9px] text-zinc-500 block mt-0.5">
                    (Cambiar en el primer inicio de sesión)
                  </span>
                </div>
              </div>

              {/* Instrucciones de Acceso */}
              <div className="p-3 bg-white/80 dark:bg-[#121614]/80 border border-[#D4D4D0] dark:border-[#242B27] text-[11px] font-mono text-zinc-600 dark:text-zinc-400 space-y-1">
                <p className="text-[#111312] dark:text-zinc-300 font-bold">Pasos para ingresar:</p>
                <p>1. Ingrese a <span className="text-[#111312] dark:text-white font-semibold">mail.google.com</span> con la dirección de correo indicada.</p>
                <p>2. Escriba la contraseña temporal y configure su nueva clave personal.</p>
              </div>

              {/* Botones de Acción */}
              <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-xs">
                <button
                  onClick={copiarCredenciales}
                  className="px-4 py-2.5 bg-white dark:bg-[#121614] hover:bg-[#F4F3EF] dark:hover:bg-[#181F1A] border border-[#D4D4D0] dark:border-[#242B27] text-zinc-800 dark:text-zinc-200 flex items-center gap-2"
                >
                  {copiado ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiado ? 'Credenciales Copiadas' : 'Copiar Credenciales'}</span>
                </button>

                <a
                  href="https://accounts.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 bg-[#1B3B2B] hover:bg-[#12281D] text-white dark:bg-[#4D6B53] dark:hover:bg-[#3d5743] font-bold uppercase tracking-wider flex items-center gap-2"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Abrir Google Workspace</span>
                </a>

                <Link
                  href="/login"
                  className="px-5 py-2.5 bg-[#F59E0B] hover:bg-[#D97706] text-zinc-950 font-black uppercase tracking-wider flex items-center gap-2 shadow-sm"
                >
                  <KeyRound className="w-3.5 h-3.5 text-zinc-950" />
                  <span className="text-zinc-950">Ingresar a SACA</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
