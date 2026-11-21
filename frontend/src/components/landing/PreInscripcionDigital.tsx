'use client';

import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Shield,
  UserCheck,
  Building,
  Printer,
  Copy,
  Check,
} from 'lucide-react';

export default function PreInscripcionDigital() {
  const [formInscripcion, setFormInscripcion] = useState({
    tipo_estudiante: 'Civil' as 'Civil' | 'Militar',
    grado_militar: '',
    unidad_militar: '',
    id_militar_estudiante: '',
    ci_estudiante: '',
    expedido: 'LP',
    nombre_estudiante: '',
    apellido_estudiante: '',
    fecha_nacimiento: '2002-05-15',
    telefono_estudiante: '',
    email_estudiante: '',
    direccion_estudiante: '',
    sede: 'La Paz - Sede Central Miraflores',
    idioma: 'Inglés',
    nivel: 'Nivel 1 (Libros 1 al 6)',
    turno: 'Noche (18:00 - 19:30)',
  });

  const [erroresFormulario, setErroresFormulario] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [comprobanteInscripcion, setComprobanteInscripcion] = useState<{
    codigo: string;
    nombre: string;
    ci: string;
    idioma: string;
    sede: string;
    fecha: string;
    tipo: string;
  } | null>(null);

  const [errorInscripcion, setErrorInscripcion] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);

  const handleInscripcionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorInscripcion(null);
    const errors: Record<string, string> = {};

    const nombres = formInscripcion.nombre_estudiante.trim();
    if (!nombres || nombres.length < 3) {
      errors.nombre_estudiante = 'El nombre debe tener al menos 3 caracteres.';
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(nombres)) {
      errors.nombre_estudiante = 'El campo nombres solo admite letras y espacios.';
    }

    const apellidos = formInscripcion.apellido_estudiante.trim();
    if (!apellidos || apellidos.length < 3) {
      errors.apellido_estudiante = 'Los apellidos deben tener al menos 3 caracteres.';
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(apellidos)) {
      errors.apellido_estudiante = 'El campo apellidos solo admite letras y espacios.';
    }

    const ci = formInscripcion.ci_estudiante.trim();
    if (!ci || ci.length < 5 || ci.length > 10) {
      errors.ci_estudiante = 'La C.I. debe tener entre 5 y 10 dígitos numéricos.';
    } else if (!/^\d+$/.test(ci)) {
      errors.ci_estudiante = 'La C.I. solo admite números sin letras.';
    }

    const tel = formInscripcion.telefono_estudiante.trim();
    if (!tel || tel.length !== 8) {
      errors.telefono_estudiante = 'El teléfono WhatsApp debe tener exactamente 8 dígitos.';
    } else if (!/^\d+$/.test(tel)) {
      errors.telefono_estudiante = 'El teléfono solo admite números.';
    }

    const email = formInscripcion.email_estudiante.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email_estudiante = 'Ingrese una dirección de correo electrónico válida.';
    }

    if (formInscripcion.tipo_estudiante === 'Militar') {
      if (!formInscripcion.grado_militar.trim() || formInscripcion.grado_militar.trim().length < 3) {
        errors.grado_militar = 'Indique su grado militar completo (mínimo 3 caracteres).';
      }
      if (!formInscripcion.unidad_militar.trim() || formInscripcion.unidad_militar.trim().length < 3) {
        errors.unidad_militar = 'Indique su unidad o recinto militar (mínimo 3 caracteres).';
      }
    }

    if (Object.keys(errors).length > 0) {
      setErroresFormulario(errors);
      setErrorInscripcion('Por favor corrija los campos marcados en rojo antes de continuar.');
      return;
    }

    setErroresFormulario({});
    setLoading(true);

    const ciCompleto = `${ci} ${formInscripcion.expedido}`;

    try {
      const res = await fetch('/api/v1/estudiantes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ci_estudiante: ciCompleto,
          nombre_estudiante: nombres,
          apellido_estudiante: apellidos,
          fecha_nacimiento_estudiante: formInscripcion.fecha_nacimiento || '2000-01-01',
          telefono_estudiante: tel,
          email_estudiante: email,
          direccion_estudiante: formInscripcion.direccion_estudiante.trim() || 'Dirección registrada en preinscripción',
          tipo_estudiante: formInscripcion.tipo_estudiante,
          grado_militar: formInscripcion.tipo_estudiante === 'Militar' ? formInscripcion.grado_militar : null,
          unidad_militar: formInscripcion.tipo_estudiante === 'Militar' ? formInscripcion.unidad_militar : null,
          id_militar_estudiante: formInscripcion.tipo_estudiante === 'Militar' ? formInscripcion.id_militar_estudiante : null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Error al procesar la inscripción en la base de datos');
      }

      const estudianteCreado = data.data || data;
      const codigoMat =
        estudianteCreado.codigoMatricula ||
        `EIE-2026-${estudianteCreado.id_estudiante || Math.floor(1000 + Math.random() * 9000)}`;

      setComprobanteInscripcion({
        codigo: codigoMat,
        nombre: `${nombres} ${apellidos}`,
        ci: ciCompleto,
        idioma: formInscripcion.idioma,
        sede: formInscripcion.sede,
        fecha: new Date().toLocaleDateString('es-BO', { day: '2-digit', month: 'long', year: 'numeric' }),
        tipo: formInscripcion.tipo_estudiante,
      });
    } catch (err: any) {
      setErrorInscripcion(err.message || 'Error de conexión con el servidor institucional');
    } finally {
      setLoading(false);
    }
  };

  const copiarCodigo = () => {
    if (!comprobanteInscripcion) return;
    navigator.clipboard.writeText(comprobanteInscripcion.codigo);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  };

  return (
    <section id="inscripciones" className="relative py-16 sm:py-24 border-t border-[#D4D4D0] dark:border-[#242B27]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Encabezado Técnico */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#D4D4D0] dark:border-[#242B27] pb-4">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold tracking-widest text-[#D97706] dark:text-[#F59E0B] uppercase">
              04 // MATRICULACIÓN DIGITAL
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#111312] dark:text-white font-display uppercase tracking-tight">
              Pre-Inscripción Oficial II-2026
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#4B524E] dark:text-zinc-400 max-w-md font-sans">
            Formalice su reserva de cupo en la plataforma oficial del Ejército. Datos protegidos
            bajo normativa castrense y confidencialidad académica.
          </p>
        </div>

        {/* Contenedor del Formulario / Comprobante */}
        <div className="relative bg-white dark:bg-[#121614] border border-[#D4D4D0] dark:border-[#242B27] p-6 sm:p-10 shadow-sm">
          <div className="hud-bracket-tl" />
          <div className="hud-bracket-tr" />
          <div className="hud-bracket-bl" />
          <div className="hud-bracket-br" />

          {comprobanteInscripcion ? (
            /* Boleta Oficial Generada */
            <div className="space-y-6 max-w-2xl mx-auto animate-solemn-fade">
              <div className="flex items-center gap-3 p-4 bg-[#1B3B2B]/10 dark:bg-[#4D6B53]/20 border border-[#1B3B2B]/30 dark:border-[#4D6B53]/50 text-[#1B3B2B] dark:text-emerald-300 text-xs font-mono">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <strong className="block text-[#111312] dark:text-white text-sm">PRE-MATRÍCULA REGISTRADA CON ÉXITO</strong>
                  <span>Su solicitud fue asentada en el sistema de la Escuela de Idiomas del Ejército.</span>
                </div>
              </div>

              {/* Ficha Técnica de la Boleta */}
              <div className="p-6 bg-[#F4F3EF] dark:bg-[#0A0C0B] border border-[#D4D4D0] dark:border-[#242B27] space-y-4">
                <div className="flex items-center justify-between border-b border-[#D4D4D0] dark:border-[#242B27] pb-4">
                  <div className="flex items-center gap-3">
                    <img src="/images/logos/logo-eie.png" alt="Logo EIE" className="w-10 h-10 object-contain" />
                    <div>
                      <h4 className="text-sm font-bold text-[#111312] dark:text-white font-display uppercase">
                        Boleta Oficial de Pre-Inscripción
                      </h4>
                      <span className="text-[10px] text-[#D97706] dark:text-[#F59E0B] font-mono">
                        CEDMIL • GESTIÓN ACADÉMICA II-2026
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-500 font-mono block">CÓDIGO OFICIAL</span>
                    <span className="text-base font-black font-mono text-[#D97706] dark:text-[#F59E0B]">
                      {comprobanteInscripcion.codigo}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
                  <div>
                    <span className="text-zinc-500 text-[10px] uppercase block">Postulante</span>
                    <strong className="text-[#111312] dark:text-white block truncate">{comprobanteInscripcion.nombre}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-[10px] uppercase block">C.I. / Expedido</span>
                    <strong className="text-[#111312] dark:text-white block">{comprobanteInscripcion.ci}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-[10px] uppercase block">Condición</span>
                    <strong className="text-[#D97706] dark:text-[#F59E0B] block">{comprobanteInscripcion.tipo}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-[10px] uppercase block">Programa</span>
                    <strong className="text-[#1B3B2B] dark:text-emerald-400 block">{comprobanteInscripcion.idioma}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-[10px] uppercase block">Sede Asignada</span>
                    <strong className="text-[#111312] dark:text-white block truncate">{comprobanteInscripcion.sede}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-[10px] uppercase block">Fecha Emisión</span>
                    <strong className="text-zinc-700 dark:text-zinc-300 block">{comprobanteInscripcion.fecha}</strong>
                  </div>
                </div>
              </div>

              {/* Acciones del Comprobante */}
              <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-xs">
                <button
                  onClick={copiarCodigo}
                  className="px-4 py-2.5 bg-white dark:bg-[#121614] hover:bg-[#F4F3EF] dark:hover:bg-[#181F1A] border border-[#D4D4D0] dark:border-[#242B27] text-zinc-800 dark:text-zinc-200 flex items-center gap-2"
                >
                  {copiado ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiado ? 'Código Copiado' : 'Copiar Código'}</span>
                </button>

                <a
                  href="#correo-institucional"
                  className="px-5 py-2.5 bg-[#F59E0B] hover:bg-[#D97706] text-zinc-950 font-black uppercase tracking-wider flex items-center gap-2 shadow-sm"
                >
                  <span>Solicitar Correo Institucional</span>
                  <ChevronRight className="w-4 h-4 text-zinc-950" />
                </a>

                <button
                  onClick={() => setComprobanteInscripcion(null)}
                  className="px-4 py-2.5 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white underline text-[11px]"
                >
                  Registrar otra postulación
                </button>
              </div>
            </div>
          ) : (
            /* Formulario de Pre-Inscripción */
            <form onSubmit={handleInscripcionSubmit} className="space-y-6">
              {errorInscripcion && (
                <div className="p-3 bg-red-100 dark:bg-red-950/60 border border-red-300 dark:border-red-500/50 text-red-800 dark:text-red-300 text-xs font-mono flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
                  <span>{errorInscripcion}</span>
                </div>
              )}

              {/* Selector de Condición: Civil vs Militar */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#111312] dark:text-zinc-300 block">
                  1. Condición del Postulante:
                </label>
                <div className="grid grid-cols-2 gap-3 max-w-md">
                  <button
                    type="button"
                    onClick={() => setFormInscripcion({ ...formInscripcion, tipo_estudiante: 'Civil' })}
                    className={`p-3 text-xs font-mono font-black uppercase border transition-all text-center ${
                      formInscripcion.tipo_estudiante === 'Civil'
                        ? 'bg-[#F59E0B] text-zinc-950 border-[#F59E0B] shadow-sm'
                        : 'bg-[#F4F3EF] text-zinc-700 border-[#D4D4D0] hover:border-zinc-500 dark:bg-[#0A0C0B] dark:text-zinc-300 dark:border-[#242B27]'
                    }`}
                  >
                    Estudiante Civil
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormInscripcion({ ...formInscripcion, tipo_estudiante: 'Militar' })}
                    className={`p-3 text-xs font-mono font-black uppercase border transition-all text-center ${
                      formInscripcion.tipo_estudiante === 'Militar'
                        ? 'bg-[#F59E0B] text-zinc-950 border-[#F59E0B] shadow-sm'
                        : 'bg-[#F4F3EF] text-zinc-700 border-[#D4D4D0] hover:border-zinc-500 dark:bg-[#0A0C0B] dark:text-zinc-300 dark:border-[#242B27]'
                    }`}
                  >
                    Personal Militar
                  </button>
                </div>
              </div>

              {/* Campos Militares Condicionales */}
              {formInscripcion.tipo_estudiante === 'Militar' && (
                <div className="p-4 bg-[#F4F3EF] dark:bg-[#0A0C0B] border border-[#D4D4D0] dark:border-[#242B27] grid grid-cols-1 sm:grid-cols-3 gap-3 animate-solemn-fade">
                  <div>
                    <label className="text-[10px] font-mono uppercase text-zinc-600 dark:text-zinc-400 block mb-1">
                      Grado Militar *
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Sbtte., Tte., Cap."
                      value={formInscripcion.grado_militar}
                      onChange={(e) => setFormInscripcion({ ...formInscripcion, grado_militar: e.target.value })}
                      className="w-full bg-white dark:bg-[#121614] border border-[#D4D4D0] dark:border-[#242B27] px-3 py-2 text-xs text-[#111312] dark:text-white font-mono"
                    />
                    {erroresFormulario.grado_militar && (
                      <span className="text-[10px] text-red-500 dark:text-red-400 font-mono">{erroresFormulario.grado_militar}</span>
                    )}
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase text-zinc-600 dark:text-zinc-400 block mb-1">
                      Unidad / Repartición *
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: RI-1 Colorados, EMG"
                      value={formInscripcion.unidad_militar}
                      onChange={(e) => setFormInscripcion({ ...formInscripcion, unidad_militar: e.target.value })}
                      className="w-full bg-white dark:bg-[#121614] border border-[#D4D4D0] dark:border-[#242B27] px-3 py-2 text-xs text-[#111312] dark:text-white font-mono"
                    />
                    {erroresFormulario.unidad_militar && (
                      <span className="text-[10px] text-red-500 dark:text-red-400 font-mono">{erroresFormulario.unidad_militar}</span>
                    )}
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase text-zinc-600 dark:text-zinc-400 block mb-1">
                      Carnet Militar / Escalafón
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: MIL-84920"
                      value={formInscripcion.id_militar_estudiante}
                      onChange={(e) => setFormInscripcion({ ...formInscripcion, id_militar_estudiante: e.target.value })}
                      className="w-full bg-white dark:bg-[#121614] border border-[#D4D4D0] dark:border-[#242B27] px-3 py-2 text-xs text-[#111312] dark:text-white font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Datos Personales */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-mono uppercase text-[#111312] dark:text-zinc-300 block mb-1">
                    Nombres del Postulante *
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Juan Carlos"
                    value={formInscripcion.nombre_estudiante}
                    onChange={(e) => setFormInscripcion({ ...formInscripcion, nombre_estudiante: e.target.value })}
                    required
                    className="w-full bg-[#F4F3EF] dark:bg-[#0A0C0B] border border-[#D4D4D0] dark:border-[#242B27] focus:border-[#D97706] dark:focus:border-[#F59E0B] px-3 py-2.5 text-xs text-[#111312] dark:text-white font-sans outline-none"
                  />
                  {erroresFormulario.nombre_estudiante && (
                    <span className="text-[10px] text-red-500 dark:text-red-400 font-mono">{erroresFormulario.nombre_estudiante}</span>
                  )}
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase text-[#111312] dark:text-zinc-300 block mb-1">
                    Apellidos Completos *
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Pérez Mamani"
                    value={formInscripcion.apellido_estudiante}
                    onChange={(e) => setFormInscripcion({ ...formInscripcion, apellido_estudiante: e.target.value })}
                    required
                    className="w-full bg-[#F4F3EF] dark:bg-[#0A0C0B] border border-[#D4D4D0] dark:border-[#242B27] focus:border-[#D97706] dark:focus:border-[#F59E0B] px-3 py-2.5 text-xs text-[#111312] dark:text-white font-sans outline-none"
                  />
                  {erroresFormulario.apellido_estudiante && (
                    <span className="text-[10px] text-red-500 dark:text-red-400 font-mono">{erroresFormulario.apellido_estudiante}</span>
                  )}
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase text-[#111312] dark:text-zinc-300 block mb-1">
                    Cédula de Identidad y Expedido *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Número CI (solo números)"
                      value={formInscripcion.ci_estudiante}
                      onChange={(e) => setFormInscripcion({ ...formInscripcion, ci_estudiante: e.target.value })}
                      required
                      className="flex-1 bg-[#F4F3EF] dark:bg-[#0A0C0B] border border-[#D4D4D0] dark:border-[#242B27] focus:border-[#D97706] dark:focus:border-[#F59E0B] px-3 py-2.5 text-xs text-[#111312] dark:text-white font-mono outline-none"
                    />
                    <select
                      value={formInscripcion.expedido}
                      onChange={(e) => setFormInscripcion({ ...formInscripcion, expedido: e.target.value })}
                      className="bg-[#F4F3EF] dark:bg-[#0A0C0B] border border-[#D4D4D0] dark:border-[#242B27] px-2 py-2.5 text-xs text-[#111312] dark:text-white font-mono outline-none"
                    >
                      <option value="LP">LP</option>
                      <option value="CB">CB</option>
                      <option value="SC">SC</option>
                      <option value="OR">OR</option>
                      <option value="PT">PT</option>
                      <option value="TJ">TJ</option>
                      <option value="CH">CH</option>
                      <option value="BN">BN</option>
                      <option value="PA">PA</option>
                    </select>
                  </div>
                  {erroresFormulario.ci_estudiante && (
                    <span className="text-[10px] text-red-500 dark:text-red-400 font-mono">{erroresFormulario.ci_estudiante}</span>
                  )}
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase text-[#111312] dark:text-zinc-300 block mb-1">
                    WhatsApp de Contacto (8 dígitos) *
                  </label>
                  <input
                    type="text"
                    maxLength={8}
                    placeholder="Ej: 72005358"
                    value={formInscripcion.telefono_estudiante}
                    onChange={(e) => setFormInscripcion({ ...formInscripcion, telefono_estudiante: e.target.value })}
                    required
                    className="w-full bg-[#F4F3EF] dark:bg-[#0A0C0B] border border-[#D4D4D0] dark:border-[#242B27] focus:border-[#D97706] dark:focus:border-[#F59E0B] px-3 py-2.5 text-xs text-[#111312] dark:text-white font-mono outline-none"
                  />
                  {erroresFormulario.telefono_estudiante && (
                    <span className="text-[10px] text-red-500 dark:text-red-400 font-mono">{erroresFormulario.telefono_estudiante}</span>
                  )}
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase text-[#111312] dark:text-zinc-300 block mb-1">
                    Correo Electrónico Personal *
                  </label>
                  <input
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={formInscripcion.email_estudiante}
                    onChange={(e) => setFormInscripcion({ ...formInscripcion, email_estudiante: e.target.value })}
                    required
                    className="w-full bg-[#F4F3EF] dark:bg-[#0A0C0B] border border-[#D4D4D0] dark:border-[#242B27] focus:border-[#D97706] dark:focus:border-[#F59E0B] px-3 py-2.5 text-xs text-[#111312] dark:text-white font-sans outline-none"
                  />
                  {erroresFormulario.email_estudiante && (
                    <span className="text-[10px] text-red-500 dark:text-red-400 font-mono">{erroresFormulario.email_estudiante}</span>
                  )}
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase text-[#111312] dark:text-zinc-300 block mb-1">
                    Sede y Filial de Preferencia *
                  </label>
                  <select
                    value={formInscripcion.sede}
                    onChange={(e) => setFormInscripcion({ ...formInscripcion, sede: e.target.value })}
                    className="w-full bg-[#F4F3EF] dark:bg-[#0A0C0B] border border-[#D4D4D0] dark:border-[#242B27] px-3 py-2.5 text-xs text-[#111312] dark:text-white font-mono outline-none"
                  >
                    <option value="La Paz - Sede Central Miraflores">La Paz - Sede Central Miraflores</option>
                    <option value="Cochabamba - Filial Regional">Cochabamba - Filial Regional</option>
                    <option value="El Alto - Ciudad Satélite">El Alto - Ciudad Satélite</option>
                    <option value="Santa Cruz - Col. Mil. Aviación">Santa Cruz - Col. Mil. Aviación</option>
                    <option value="Viacha - Regimiento Max Toledo">Viacha - Regimiento Max Toledo</option>
                    <option value="Tarija - Barrio El Tejar">Tarija - Barrio El Tejar</option>
                    <option value="Achacachi - Regimiento Ayacucho">Achacachi - Regimiento Ayacucho</option>
                    <option value="Riberalta - Guarnición Amazonía">Riberalta - Guarnición Amazonía</option>
                    <option value="Uncía - Regimiento Chichas">Uncía - Regimiento Chichas</option>
                  </select>
                </div>
              </div>

              {/* Selección Académica */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[#D4D4D0] dark:border-[#242B27]">
                <div>
                  <label className="text-[11px] font-mono uppercase text-[#111312] dark:text-zinc-300 block mb-1">
                    Idioma Seleccionado *
                  </label>
                  <select
                    value={formInscripcion.idioma}
                    onChange={(e) => setFormInscripcion({ ...formInscripcion, idioma: e.target.value })}
                    className="w-full bg-[#F4F3EF] dark:bg-[#0A0C0B] border border-[#D4D4D0] dark:border-[#242B27] px-3 py-2.5 text-xs text-[#111312] dark:text-white font-mono outline-none"
                  >
                    <option value="Inglés">Inglés (STANAG 6001 / ALC)</option>
                    <option value="Francés">Francés (Cooperación Militar)</option>
                    <option value="Portugués">Portugués (Mercosur)</option>
                    <option value="Ruso">Ruso (Técnico Táctico)</option>
                    <option value="Mandarín">Mandarín (HSK Estándar)</option>
                    <option value="Alemán">Alemán (Académico)</option>
                    <option value="Aymara">Aymara (Interculturalidad)</option>
                    <option value="Quechua">Quechua (Interculturalidad)</option>
                    <option value="Guaraní">Guaraní (Interculturalidad)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase text-[#111312] dark:text-zinc-300 block mb-1">
                    Nivel Inicial *
                  </label>
                  <select
                    value={formInscripcion.nivel}
                    onChange={(e) => setFormInscripcion({ ...formInscripcion, nivel: e.target.value })}
                    className="w-full bg-[#F4F3EF] dark:bg-[#0A0C0B] border border-[#D4D4D0] dark:border-[#242B27] px-3 py-2.5 text-xs text-[#111312] dark:text-white font-mono outline-none"
                  >
                    <option value="Nivel 1 (Libros 1 al 6)">Nivel 1 (Elemental - Libros 1 al 6)</option>
                    <option value="Nivel 2 (Libros 7 al 12)">Nivel 2 (Básico - Libros 7 al 12)</option>
                    <option value="Nivel 3 (Libros 13 al 18)">Nivel 3 (Intermedio - Libros 13 al 18)</option>
                    <option value="Nivel 4 (Libros 19 al 24)">Nivel 4 (Intermedio Alto - Libros 19 al 24)</option>
                    <option value="Nivel 5 (Libros 25 al 30)">Nivel 5 (Avanzado - Libros 25 al 30)</option>
                    <option value="Nivel 6 (Libros 31 al 36)">Nivel 6 (Superior - Libros 31 al 36)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase text-[#111312] dark:text-zinc-300 block mb-1">
                    Turno y Horario de Preferencia *
                  </label>
                  <select
                    value={formInscripcion.turno}
                    onChange={(e) => setFormInscripcion({ ...formInscripcion, turno: e.target.value })}
                    className="w-full bg-[#F4F3EF] dark:bg-[#0A0C0B] border border-[#D4D4D0] dark:border-[#242B27] px-3 py-2.5 text-xs text-[#111312] dark:text-white font-mono outline-none"
                  >
                    <option value="Mañana (07:00 - 08:30)">Mañana (07:00 - 08:30)</option>
                    <option value="Tarde (14:30 - 16:00)">Tarde (14:30 - 16:00)</option>
                    <option value="Noche (18:00 - 19:30)">Noche (18:00 - 19:30)</option>
                    <option value="Noche 2 (19:30 - 21:00)">Noche 2 (19:30 - 21:00)</option>
                    <option value="Sabatino Intensivo (08:00 - 13:00)">Sabatino Intensivo (08:00 - 13:00)</option>
                  </select>
                </div>
              </div>

              {/* Botón de Envío */}
              <div className="pt-4 border-t border-[#D4D4D0] dark:border-[#242B27] flex items-center justify-between">
                <span className="text-[11px] text-zinc-500 font-mono hidden sm:inline">
                  REQUISITO: Cédula de Identidad boliviana vigente.
                </span>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#F59E0B] hover:bg-[#D97706] text-zinc-950 font-mono font-black text-xs uppercase tracking-wider transition-all disabled:opacity-50 shadow-md"
                >
                  {loading ? 'Procesando en Sistema...' : '[ Registrar Pre-Inscripción Oficial ]'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
