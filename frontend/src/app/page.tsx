'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield,
  GraduationCap,
  BookOpen,
  Award,
  Users,
  Compass,
  MapPin,
  Phone,
  Mail,
  Clock,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  Copy,
  Download,
  Calendar,
  Sparkles,
  ArrowRight,
  Send,
  Languages,
  Check,
  FileText,
  KeyRound,
  ExternalLink,
  Laptop,
  Building2,
  Lock,
  Globe
} from 'lucide-react';

export default function IndexPage() {
  const slides = [
    {
      id: 1,
      tag: 'COMANDO DE INSTITUTOS MILITARES',
      titulo: 'Excelencia Lingüística para la Soberanía y el Futuro',
      subtitulo: 'Capacitación académica integral para el personal de cuadros de las Fuerzas Armadas y la sociedad civil boliviana.',
      badge: 'Gestión Académica 2026',
      icono: Shield,
      color: 'from-emerald-950/80 via-neutral-900 to-neutral-950',
      borderAccent: 'border-emerald-500/40',
      tagColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    },
    {
      id: 2,
      tag: 'PLAN DE ESTUDIOS 36 LIBROS',
      titulo: 'Programa Integral de Inglés Técnico Superior',
      subtitulo: '6 niveles secuenciales, 36 módulos de contenido continuo y rotación pedagógica docente cada 15 días con certificación STANAG 6001.',
      badge: 'Metodología Militar Certificada',
      icono: BookOpen,
      color: 'from-amber-950/80 via-neutral-900 to-neutral-950',
      borderAccent: 'border-amber-500/40',
      tagColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    },
    {
      id: 3,
      tag: 'IDENTIDAD E INTERCULTURALIDAD',
      titulo: 'Enseñanza de Lenguas Nativas Originarias',
      subtitulo: 'Cursos formativos de Aymara, Quechua y Guaraní orientados a la integración comunitaria, defensa nacional y vinculación social.',
      badge: 'CPE Art. 103 & Ley 164',
      icono: Globe,
      color: 'from-sky-950/80 via-neutral-900 to-neutral-950',
      borderAccent: 'border-sky-500/40',
      tagColor: 'bg-sky-500/20 text-sky-400 border-sky-500/40',
    },
    {
      id: 4,
      tag: 'PRESENCIA TERRITORIAL',
      titulo: '9 Sedes y Filiales a Nivel Nacional',
      subtitulo: 'Presencia académica en La Paz, El Alto, Viacha, Achacachi, Cochabamba, Santa Cruz, Tarija, Uncía y Riberalta.',
      badge: 'Cobertura Nacional Permanente',
      icono: Building2,
      color: 'from-purple-950/80 via-neutral-900 to-neutral-950',
      borderAccent: 'border-purple-500/40',
      tagColor: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

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

  const handleInscripcionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorInscripcion(null);

    if (!formInscripcion.nombre_estudiante.trim() || !formInscripcion.apellido_estudiante.trim()) {
      setErrorInscripcion('Por favor complete su nombre y apellidos.');
      return;
    }
    if (!formInscripcion.ci_estudiante.trim()) {
      setErrorInscripcion('Ingrese su número de cédula de identidad.');
      return;
    }

    const ciCompleto = `${formInscripcion.ci_estudiante.trim()} ${formInscripcion.expedido}`;

    try {
      const res = await fetch('http://localhost:8000/api/v1/estudiantes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          ci_estudiante: ciCompleto,
          nombre_estudiante: formInscripcion.nombre_estudiante.trim(),
          apellido_estudiante: formInscripcion.apellido_estudiante.trim(),
          fecha_nacimiento_estudiante: formInscripcion.fecha_nacimiento || '2000-01-01',
          telefono_estudiante: formInscripcion.telefono_estudiante.trim() || '70000000',
          email_estudiante: formInscripcion.email_estudiante.trim(),
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
      const codigoMat = estudianteCreado.codigoMatricula || `EIE-2026-${estudianteCreado.id_estudiante || Math.floor(1000 + Math.random() * 9000)}`;

      setComprobanteInscripcion({
        codigo: codigoMat,
        nombre: `${formInscripcion.nombre_estudiante} ${formInscripcion.apellido_estudiante}`,
        ci: ciCompleto,
        idioma: formInscripcion.idioma,
        sede: formInscripcion.sede,
        fecha: new Date().toLocaleDateString('es-BO', { day: '2-digit', month: 'long', year: 'numeric' }),
        tipo: formInscripcion.tipo_estudiante,
      });

      setCiBusquedaCorreo(ciCompleto);
    } catch (err: any) {
      setErrorInscripcion(err.message || 'Error de conexión con el servidor institucional');
    }
  };

  const [ciBusquedaCorreo, setCiBusquedaCorreo] = useState('');
  const [resultadoCorreo, setResultadoCorreo] = useState<{
    estudiante: any;
    emailGenerado: string;
    passwordTemporal: string;
    fechaEmision: string;
    yaExistia: boolean;
  } | null>(null);
  const [errorCorreo, setErrorCorreo] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);

  const handleSolicitarCorreo = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorCorreo(null);
    setResultadoCorreo(null);
    setCopiado(false);

    const q = ciBusquedaCorreo.trim();
    if (!q) {
      setErrorCorreo('Por favor ingrese su número de C.I. o Código de Inscripción.');
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/api/v1/estudiantes?q=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error('No se pudo verificar la inscripción');
      const json = await res.json();
      const lista = json.data || [];
      const coincidencia = lista.length > 0 ? lista[0] : null;

      if (!coincidencia) {
        setErrorCorreo('No se encontró ninguna inscripción activa con ese documento o código en la base de datos.');
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

      setResultadoCorreo({
        estudiante: coincidencia,
        emailGenerado: emailOficial,
        passwordTemporal: passTemporal,
        fechaEmision: new Date().toLocaleDateString('es-BO', { day: '2-digit', month: 'long', year: 'numeric' }),
        yaExistia: false,
      });
    } catch (err: any) {
      setErrorCorreo(err.message || 'Error al conectar con la base de datos');
    }
  };

  const handleCopiarCredenciales = () => {
    if (!resultadoCorreo) return;
    const texto = `CUENTA INSTITUCIONAL - ESCUELA DE IDIOMAS DEL EJÉRCITO\nUsuario: ${resultadoCorreo.emailGenerado}\nContraseña Temporal: ${resultadoCorreo.passwordTemporal}\nPortal de Acceso: https://accounts.google.com`;
    navigator.clipboard.writeText(texto);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 3000);
  };

  const [tabIdioma, setTabIdioma] = useState<'INGLES' | 'NATIVOS' | 'EXTRANJEROS'>('INGLES');

  return (
    <div className="space-y-16 pb-16">
      <section className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-950 shadow-2xl">
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#2d5f42_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="relative z-10 p-6 md:p-12 lg:p-14">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-neutral-800/80">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-neutral-900/80 border-2 border-amber-500/40 p-2 shadow-xl flex items-center justify-center shrink-0">
                <img
                  src="/logo-eie.png"
                  alt="Escudo de la Escuela de Idiomas del Ejército de Bolivia"
                  className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(234,179,8,0.4)]"
                />
              </div>
              <div>
                <span className="text-[11px] md:text-xs font-mono font-bold tracking-widest text-amber-400 uppercase bg-amber-500/10 border border-amber-500/30 px-3 py-0.5 rounded-full inline-block mb-1">
                  &ldquo;THINK GLOBALLY, ACT LOCALLY&rdquo;
                </span>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                  ESCUELA DE IDIOMAS DEL EJÉRCITO
                </h1>
                <p className="text-xs md:text-sm text-neutral-400">
                  Comando de Educación y Doctrina Militar &bull; CEDMIL &bull; Estado Plurinacional de Bolivia
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="btn btn-primary flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold shadow-lg shadow-emerald-900/30 hover:scale-[1.02] transition"
                style={{ background: 'var(--military-green-primary)', border: '1px solid var(--border-accent)' }}
              >
                <img src="/logo-eie.png" alt="" className="w-4 h-4 object-contain" />
                <span>Ingresar al Sistema SACA</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="mt-8 transition-all duration-500">
            {slides.map((s, idx) => {
              if (idx !== currentSlide) return null;
              const IconComp = s.icono;
              return (
                <div
                  key={s.id}
                  className={`bg-gradient-to-br ${s.color} border ${s.borderAccent} rounded-2xl p-6 md:p-10 shadow-2xl relative overflow-hidden`}
                >
                  <div className="max-w-3xl space-y-4">
                    <div className="flex items-center gap-2.5">
                      <span className={`text-[11px] font-mono font-bold tracking-wider px-3 py-1 rounded-md border ${s.tagColor}`}>
                        {s.tag}
                      </span>
                      <span className="text-xs text-neutral-400 font-medium">
                        {s.badge}
                      </span>
                    </div>

                    <h2 className="text-2xl md:text-4xl font-extrabold text-white leading-tight">
                      {s.titulo}
                    </h2>

                    <p className="text-sm md:text-base text-neutral-300 leading-relaxed">
                      {s.subtitulo}
                    </p>

                    <div className="pt-3 flex flex-wrap items-center gap-4">
                      <a
                        href="#inscripciones"
                        className="btn btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs md:text-sm font-bold"
                        style={{ background: 'var(--military-gold-primary)', color: '#000' }}
                      >
                        <FileText className="w-4 h-4" />
                        <span>Inscribirme en Línea</span>
                      </a>
                      <a
                        href="#correo-institucional"
                        className="btn btn-secondary inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs md:text-sm font-semibold"
                      >
                        <Mail className="w-4 h-4 text-amber-400" />
                        <span>Solicitar Correo Institucional</span>
                      </a>
                      <a
                        href="#oferta-academica"
                        className="inline-flex items-center gap-1.5 text-xs md:text-sm text-neutral-400 hover:text-white font-medium transition"
                      >
                        <span>Ver Oferta de Idiomas</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  <div className="absolute -bottom-6 -right-6 opacity-10 pointer-events-none text-white">
                    <IconComp size={220} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-neutral-800/60">
            <div className="flex items-center gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === currentSlide ? 'w-8 bg-amber-400' : 'w-2 bg-neutral-700 hover:bg-neutral-600'
                  }`}
                  aria-label={`Ir a diapositiva ${i + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={prevSlide}
                className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 transition"
                aria-label="Diapositiva anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSlide}
                className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 transition"
                aria-label="Diapositiva siguiente"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="mision-vision" className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full inline-block">
            Doctrina Institucional
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">
            Misión y Visión
          </h2>
          <p className="text-xs md:text-sm text-neutral-400">
            Pilares estratégicos que fundamentan el liderazgo académico de la Escuela de Idiomas del Ejército.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative rounded-2xl border border-emerald-500/30 bg-neutral-900/60 p-7 shadow-xl hover:border-emerald-500/50 transition group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full pointer-events-none" />
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center p-1.5">
                <img src="/logo-eie.png" alt="EIE" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-semibold text-emerald-400 uppercase tracking-widest">
                  Cometido Institucional
                </span>
                <h3 className="text-xl font-bold text-white">Misión</h3>
              </div>
            </div>
            <p className="text-xs md:text-sm text-neutral-300 leading-relaxed text-justify">
              La Escuela de Idiomas del Ejército planifica, coordina y desarrolla de forma permanente el sistema de enseñanza y aprendizaje de idiomas extranjeros y nativos en sus distintas filiales en todo el territorio nacional. Su objetivo es capacitar al recurso humano del Ejército y al personal civil con un elevado nivel de dominio lingüístico para satisfacer sus requerimientos y cumplir con la misión educativa del Comando de Institutos Militares y su función constitucional.
            </p>
            <div className="mt-5 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-500 font-mono">
              <span>CEDMIL &bull; Ejto. de Bolivia</span>
              <span className="text-emerald-400 font-semibold">Función Constitucional</span>
            </div>
          </div>

          <div className="relative rounded-2xl border border-amber-500/30 bg-neutral-900/60 p-7 shadow-xl hover:border-amber-500/50 transition group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-bl-full pointer-events-none" />
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-semibold text-amber-400 uppercase tracking-widest">
                  Horizonte Estratégico
                </span>
                <h3 className="text-xl font-bold text-white">Visión</h3>
              </div>
            </div>
            <p className="text-xs md:text-sm text-neutral-300 leading-relaxed text-justify">
              Es una institución líder y competitiva en la enseñanza de idiomas nativos y extranjeros con excelencia académica, que forma talento humano especializado en lingüística capaz de afrontar los desafíos de un mundo globalizado y competitivo, consolidando además la interculturalidad a través de su personal académico y profesional.
            </p>
            <div className="mt-5 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-500 font-mono">
              <span>Liderazgo &bull; Competitividad</span>
              <span className="text-amber-400 font-semibold">Interculturalidad y Excelencia</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-6 md:p-10 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full inline-block">
              Presentación Oficial
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">
              Líderes en Enseñanza Lingüística Técnico-Militar
            </h2>
            <p className="text-xs md:text-sm text-neutral-300 leading-relaxed">
              La <strong>Escuela de Idiomas del Ejército</strong> es la máxima entidad de formación lingüística de las Fuerzas Armadas del Estado Plurinacional de Bolivia. Dependiente del <strong>Comando de Educación y Doctrina Militar (CEDMIL)</strong>, imparte programas formativos de nivel <strong>Técnico Superior</strong> tanto para personal de cuadros militares como para la comunidad civil en general.
            </p>
            <p className="text-xs md:text-sm text-neutral-400 leading-relaxed">
              Bajo nuestro lema <em>&ldquo;Think Globally, Act Locally&rdquo;</em>, combinamos la disciplina, la ética y la rigurosidad militar con metodologías pedagógicas de vanguardia: rotación docente cada 15 días, laboratorios multimedia y el nuevo Sistema de Gestión Académica (SACA) integrado con modelos matemáticos de optimización operativa.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-neutral-950/70 border border-neutral-800 p-3.5 rounded-xl">
                <p className="text-xl font-bold font-mono text-amber-400">36 Libros</p>
                <p className="text-[11px] text-neutral-400">Plan continuo de Inglés</p>
              </div>
              <div className="bg-neutral-950/70 border border-neutral-800 p-3.5 rounded-xl">
                <p className="text-xl font-bold font-mono text-emerald-400">15 Días</p>
                <p className="text-[11px] text-neutral-400">Rotación docente continua</p>
              </div>
              <div className="bg-neutral-950/70 border border-neutral-800 p-3.5 rounded-xl">
                <p className="text-xl font-bold font-mono text-sky-400">9 Filiales</p>
                <p className="text-[11px] text-neutral-400">En todo el país</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative p-6 rounded-3xl bg-gradient-to-b from-neutral-900 to-neutral-950 border border-neutral-800 shadow-2xl text-center max-w-sm w-full">
              <div className="w-28 h-28 mx-auto mb-4 p-2 rounded-2xl bg-neutral-900 border border-amber-500/30 flex items-center justify-center shadow-lg">
                <img
                  src="/logo-ejercito.png"
                  alt="Emblema Oficial Ejército de Bolivia"
                  className="w-full h-full object-contain"
                />
              </div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                ESCUELA DE IDIOMAS DEL EJÉRCITO
              </h4>
              <p className="text-[11px] text-amber-400 font-mono mt-1 font-semibold">
                &ldquo;SUBORDINACIÓN Y CONSTANCIA&rdquo;
              </p>
              <div className="my-3 h-[1px] bg-neutral-800" />
              <p className="text-[11px] text-neutral-400">
                Certificaciones avaladas por el Comando General del Ejército y el Ministerio de Educación.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="oferta-academica" className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400 bg-sky-500/10 border border-sky-500/20 px-3 py-1 rounded-full inline-block">
              Oferta Formativa
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
              Catálogo de Idiomas y Programas
            </h2>
          </div>

          <div className="inline-flex bg-neutral-900 border border-neutral-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setTabIdioma('INGLES')}
              className={`px-3.5 py-1.5 rounded-lg transition ${
                tabIdioma === 'INGLES' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Programa de Inglés (36 Libros)
            </button>
            <button
              onClick={() => setTabIdioma('NATIVOS')}
              className={`px-3.5 py-1.5 rounded-lg transition ${
                tabIdioma === 'NATIVOS' ? 'bg-emerald-600 text-white font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Lenguas Nativas
            </button>
            <button
              onClick={() => setTabIdioma('EXTRANJEROS')}
              className={`px-3.5 py-1.5 rounded-lg transition ${
                tabIdioma === 'EXTRANJEROS' ? 'bg-sky-600 text-white font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Idiomas Extranjeros
            </button>
          </div>
        </div>

        {tabIdioma === 'INGLES' && (
          <div className="bg-neutral-900/50 border border-amber-500/20 rounded-2xl p-6 md:p-8 space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Plan de Estudio Insignia
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-white">
                  Inglés Técnico Superior &bull; 36 Libros y 6 Niveles
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Estructura curricular progresiva con rotación de docentes cada 15 días y exámenes de nivel cada 6 libros.
                </p>
              </div>
              <span className="px-3 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold rounded-lg shrink-0">
                STANAG 6001 / TOEFL
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { nivel: 'Nivel 1', libros: 'Libros 1 al 6', tit: 'Inglés Elemental / Básico', eval: 'Examen de Nivel en Libro 6' },
                { nivel: 'Nivel 2', libros: 'Libros 7 al 12', tit: 'Inglés Pre-Intermedio', eval: 'Examen de Nivel en Libro 12' },
                { nivel: 'Nivel 3', libros: 'Libros 13 al 18', tit: 'Inglés Intermedio', eval: 'Examen de Nivel en Libro 18' },
                { nivel: 'Nivel 4', libros: 'Libros 19 al 24', tit: 'Inglés Intermedio Alto', eval: 'Examen de Nivel en Libro 24' },
                { nivel: 'Nivel 5', libros: 'Libros 25 al 30', tit: 'Inglés Avanzado Profesional', eval: 'Examen de Nivel en Libro 30' },
                { nivel: 'Nivel 6', libros: 'Libros 31 al 36', tit: 'Suficiencia & Especialidad Militar', eval: 'Defensa de Grado Técnico Superior' },
              ].map((item, idx) => (
                <div key={idx} className="bg-neutral-950/70 border border-neutral-800 p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-400">{item.nivel}</span>
                    <span className="text-[10px] bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded font-mono">
                      {item.libros}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{item.tit}</h4>
                  <p className="text-[11px] text-neutral-500">{item.eval}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tabIdioma === 'NATIVOS' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                idioma: 'Aymara',
                sub: 'Jach\'a Qhana',
                desc: 'Lengua originaria hablada en la cuenca del Altiplano. Cursos con enfoque comunicativo e intercultural.',
                niveles: 'Básico, Intermedio y Avanzado (6 módulos)',
                color: 'border-emerald-500/30',
                badge: 'text-emerald-400 bg-emerald-500/10',
              },
              {
                idioma: 'Quechua',
                sub: 'Runasimi',
                desc: 'Idioma ancestral de los valles interandinos y oriente. Destinado a la interacción civil-militar.',
                niveles: 'Básico, Intermedio y Avanzado (6 módulos)',
                color: 'border-emerald-500/30',
                badge: 'text-emerald-400 bg-emerald-500/10',
              },
              {
                idioma: 'Guaraní',
                sub: 'Avañe\'ẽ',
                desc: 'Lengua originaria de la región Chaqueña y guarniciones del sur de Bolivia. Metodología práctica inmersiva.',
                niveles: 'Básico, Intermedio y Avanzado (6 módulos)',
                color: 'border-emerald-500/30',
                badge: 'text-emerald-400 bg-emerald-500/10',
              },
            ].map((lang, idx) => (
              <div key={idx} className={`bg-neutral-900/50 border ${lang.color} rounded-2xl p-6 space-y-3`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">{lang.idioma}</h3>
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${lang.badge}`}>
                    {lang.sub}
                  </span>
                </div>
                <p className="text-xs text-neutral-400">{lang.desc}</p>
                <div className="pt-3 border-t border-neutral-800 text-[11px] text-neutral-300 font-mono">
                  Estructura: {lang.niveles}
                </div>
              </div>
            ))}
          </div>
        )}

        {tabIdioma === 'EXTRANJEROS' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { idioma: 'Francés', desc: 'Diplomacia militar, misiones de paz cascos azules ONU y cooperación europea.' },
              { idioma: 'Portugués', desc: 'Integración fronteriza, acuerdos bilaterales y doctrina militar de la región suramericana.' },
              { idioma: 'Árabe', desc: 'Capacitación especializada para agregadurías de defensa y análisis geopolítico internacional.' },
              { idioma: 'Chino Mandarín', desc: 'Enseñanza estratégica orientada a la transferencia tecnológica y relaciones multilaterales.' },
            ].map((lang, idx) => (
              <div key={idx} className="bg-neutral-900/50 border border-sky-500/20 rounded-2xl p-5 space-y-2">
                <span className="text-[10px] font-mono font-bold text-sky-400 uppercase">Especialización</span>
                <h4 className="text-lg font-bold text-white">{lang.idioma}</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">{lang.desc}</p>
                <div className="pt-2 text-[10px] text-neutral-500 font-mono">Niveles Básico, Intermedio y Avanzado</div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full inline-block">
            Filiales en Bolivia
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">
            Nuestras Filiales y Sedes Nacionales
          </h2>
          <p className="text-xs md:text-sm text-neutral-400">
            Infraestructura académica y laboratorios de idiomas en guarniciones de todo el territorio boliviano.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { ciudad: 'La Paz (Sede Central)', dir: 'Av. Saavedra Nro. 1420, Miraflores (Cuartel General)', tel: '2-2223401' },
            { ciudad: 'El Alto', dir: 'Ciudad Satélite, Plan 405 (Guarnición Militar El Alto)', tel: '2-2819034' },
            { ciudad: 'Viacha', dir: 'Regimiento de Artillería 1 Cnl. Max Toledo', tel: '2-2801944' },
            { ciudad: 'Achacachi', dir: 'Regimiento de Infantería 8 Ayacucho', tel: '2-2891044' },
            { ciudad: 'Cochabamba', dir: 'Av. Ramón Rivero y Calle Heroínas', tel: '4-4259102' },
            { ciudad: 'Santa Cruz', dir: 'Av. Ejército Nro. 520 (Colegio Militar de Aviación)', tel: '3-3349102' },
            { ciudad: 'Tarija', dir: 'Barrio El Tejar, Av. Las Américas', tel: '4-6649102' },
            { ciudad: 'Uncía (Potosí)', dir: 'Regimiento de Caballería 7 Chichas', tel: '2-5810294' },
            { ciudad: 'Riberalta (Beni)', dir: 'Guarnición Militar de la Amazonía', tel: '3-8529104' },
          ].map((sede, i) => (
            <div key={i} className="bg-neutral-900/60 border border-neutral-800 p-4 rounded-xl space-y-1.5 hover:border-neutral-700 transition">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <h4 className="font-bold text-white text-sm">{sede.ciudad}</h4>
              </div>
              <p className="text-xs text-neutral-400">{sede.dir}</p>
              <p className="text-[11px] text-neutral-500 font-mono">Telf: {sede.tel}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="inscripciones" className="space-y-6">
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl space-y-2 mb-8">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full inline-block">
              Matriculación Digital 2026
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">
              Inscripción en Línea / Pre-Matrícula
            </h2>
            <p className="text-xs md:text-sm text-neutral-300">
              Complete el formulario oficial para reservar su cupo en el curso de idiomas correspondiente.
              Al finalizar, el sistema emitirá su comprobante oficial y podrá tramitar de inmediato su correo institucional.
            </p>
          </div>

          {comprobanteInscripcion ? (
            <div className="bg-neutral-950 border-2 border-emerald-500/50 rounded-2xl p-6 md:p-8 space-y-5 animate-solemn-fade">
              <div className="flex items-center gap-3 text-emerald-400">
                <CheckCircle2 className="w-8 h-8 shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-white">¡Pre-Inscripción Registrada Exitosamente!</h3>
                  <p className="text-xs text-neutral-400">Su solicitud ha sido asentada en la base de datos de la Escuela de Idiomas del Ejército.</p>
                </div>
              </div>

              <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <img src="/logo-ejercito.png" alt="Logo" className="w-10 h-10 object-contain" />
                    <div>
                      <p className="text-xs font-bold text-white">BOLETA OFICIAL DE PRE-INSCRIPCIÓN</p>
                      <p className="text-[10px] text-amber-400 font-mono">Gestión Académica 2026</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-neutral-400 block font-mono">CÓDIGO DE TRÁMITE</span>
                    <span className="text-base font-extrabold text-emerald-400 font-mono">{comprobanteInscripcion.codigo}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-neutral-500 block text-[10px]">Estudiante:</span>
                    <strong className="text-white">{comprobanteInscripcion.nombre}</strong>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[10px]">Cédula de Identidad:</span>
                    <strong className="text-white font-mono">{comprobanteInscripcion.ci}</strong>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[10px]">Condición:</span>
                    <strong className="text-amber-400">{comprobanteInscripcion.tipo}</strong>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[10px]">Programa / Idioma:</span>
                    <strong className="text-white">{comprobanteInscripcion.idioma}</strong>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[10px]">Sede Asignada:</span>
                    <strong className="text-white">{comprobanteInscripcion.sede}</strong>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[10px]">Fecha de Emisión:</span>
                    <strong className="text-neutral-300 font-mono">{comprobanteInscripcion.fecha}</strong>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#correo-institucional"
                  onClick={() => setCiBusquedaCorreo(comprobanteInscripcion.ci)}
                  className="btn btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg"
                  style={{ background: 'var(--military-green-primary)' }}
                >
                  <Mail className="w-4 h-4 text-amber-400" />
                  <span>Proceder a Solicitar mi Correo Institucional</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => setComprobanteInscripcion(null)}
                  className="btn btn-secondary text-xs px-4 py-2.5 rounded-xl font-medium"
                >
                  Registrar Otra Inscripción
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleInscripcionSubmit} className="space-y-6">
              {errorInscripcion && (
                <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{errorInscripcion}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-2">
                  Tipo de Postulante:
                </label>
                <div className="grid grid-cols-2 gap-3 max-w-md">
                  <button
                    type="button"
                    onClick={() => setFormInscripcion({ ...formInscripcion, tipo_estudiante: 'Civil' })}
                    className={`p-3 rounded-xl border text-xs font-bold text-center transition ${
                      formInscripcion.tipo_estudiante === 'Civil'
                        ? 'border-amber-500 bg-amber-500/10 text-white'
                        : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-white'
                    }`}
                  >
                    Estudiante Civil
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormInscripcion({ ...formInscripcion, tipo_estudiante: 'Militar' })}
                    className={`p-3 rounded-xl border text-xs font-bold text-center transition ${
                      formInscripcion.tipo_estudiante === 'Militar'
                        ? 'border-emerald-500 bg-emerald-500/10 text-white'
                        : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-white'
                    }`}
                  >
                    Personal Militar (FF.AA.)
                  </button>
                </div>
              </div>

              {formInscripcion.tipo_estudiante === 'Militar' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-neutral-950 border border-emerald-500/30">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                      Grado Militar *
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Subteniente de Infantería"
                      value={formInscripcion.grado_militar}
                      onChange={(e) => setFormInscripcion({ ...formInscripcion, grado_militar: e.target.value })}
                      required
                      className="input w-full text-xs p-2.5 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                      Unidad / Recinto Militar *
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Regimiento Colorados"
                      value={formInscripcion.unidad_militar}
                      onChange={(e) => setFormInscripcion({ ...formInscripcion, unidad_militar: e.target.value })}
                      required
                      className="input w-full text-xs p-2.5 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                      Código de Escalafón Militar
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: MIL-INF-2024"
                      value={formInscripcion.id_militar_estudiante}
                      onChange={(e) => setFormInscripcion({ ...formInscripcion, id_militar_estudiante: e.target.value })}
                      className="input w-full text-xs p-2.5 rounded-lg"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Nombres *
                  </label>
                  <input
                    type="text"
                    placeholder="Sus nombres completos"
                    value={formInscripcion.nombre_estudiante}
                    onChange={(e) => setFormInscripcion({ ...formInscripcion, nombre_estudiante: e.target.value })}
                    required
                    className="input w-full text-xs p-2.5 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Apellidos *
                  </label>
                  <input
                    type="text"
                    placeholder="Sus apellidos"
                    value={formInscripcion.apellido_estudiante}
                    onChange={(e) => setFormInscripcion({ ...formInscripcion, apellido_estudiante: e.target.value })}
                    required
                    className="input w-full text-xs p-2.5 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Cédula de Identidad (C.I.) *
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="Ej: 6849201"
                      value={formInscripcion.ci_estudiante}
                      onChange={(e) => setFormInscripcion({ ...formInscripcion, ci_estudiante: e.target.value })}
                      required
                      className="input w-full text-xs p-2.5 rounded-lg font-mono"
                    />
                    <select
                      value={formInscripcion.expedido}
                      onChange={(e) => setFormInscripcion({ ...formInscripcion, expedido: e.target.value })}
                      className="input text-xs p-2 rounded-lg font-mono"
                    >
                      {['LP', 'CB', 'SC', 'OR', 'PT', 'TJ', 'CH', 'BE', 'PA'].map((dep) => (
                        <option key={dep} value={dep}>{dep}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Teléfono / Celular WhatsApp *
                  </label>
                  <input
                    type="tel"
                    placeholder="Ej: 71928401"
                    value={formInscripcion.telefono_estudiante}
                    onChange={(e) => setFormInscripcion({ ...formInscripcion, telefono_estudiante: e.target.value })}
                    required
                    className="input w-full text-xs p-2.5 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Correo Electrónico Personal *
                  </label>
                  <input
                    type="email"
                    placeholder="ejemplo@gmail.com"
                    value={formInscripcion.email_estudiante}
                    onChange={(e) => setFormInscripcion({ ...formInscripcion, email_estudiante: e.target.value })}
                    required
                    className="input w-full text-xs p-2.5 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Dirección Domiciliaria
                  </label>
                  <input
                    type="text"
                    placeholder="Zona, Avenida o Calle"
                    value={formInscripcion.direccion_estudiante}
                    onChange={(e) => setFormInscripcion({ ...formInscripcion, direccion_estudiante: e.target.value })}
                    className="input w-full text-xs p-2.5 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-neutral-950/70 border border-neutral-800">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                    Sede o Filial
                  </label>
                  <select
                    value={formInscripcion.sede}
                    onChange={(e) => setFormInscripcion({ ...formInscripcion, sede: e.target.value })}
                    className="input w-full text-xs p-2 rounded-lg"
                  >
                    <option value="La Paz - Sede Central Miraflores">La Paz - Sede Central Miraflores</option>
                    <option value="El Alto - Ciudad Satélite">El Alto - Ciudad Satélite</option>
                    <option value="Viacha - Regimiento Max Toledo">Viacha - Regimiento Max Toledo</option>
                    <option value="Achacachi - Regimiento Ayacucho">Achacachi - Regimiento Ayacucho</option>
                    <option value="Cochabamba - Filial Cbba">Cochabamba - Filial Cbba</option>
                    <option value="Santa Cruz - Colegio Militar de Aviación">Santa Cruz - Colegio Militar de Aviación</option>
                    <option value="Tarija - Filial Tarija">Tarija - Filial Tarija</option>
                    <option value="Uncía - Regimiento Chichas">Uncía - Regimiento Chichas</option>
                    <option value="Riberalta - Guarnición Amazonía">Riberalta - Guarnición Amazonía</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                    Idioma
                  </label>
                  <select
                    value={formInscripcion.idioma}
                    onChange={(e) => setFormInscripcion({ ...formInscripcion, idioma: e.target.value })}
                    className="input w-full text-xs p-2 rounded-lg"
                  >
                    <option value="Inglés">Inglés (36 Libros)</option>
                    <option value="Aymara">Aymara</option>
                    <option value="Quechua">Quechua</option>
                    <option value="Guaraní">Guaraní</option>
                    <option value="Portugués">Portugués</option>
                    <option value="Francés">Francés</option>
                    <option value="Árabe">Árabe</option>
                    <option value="Chino Mandarín">Chino Mandarín</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                    Nivel Inicial
                  </label>
                  <select
                    value={formInscripcion.nivel}
                    onChange={(e) => setFormInscripcion({ ...formInscripcion, nivel: e.target.value })}
                    className="input w-full text-xs p-2 rounded-lg"
                  >
                    <option value="Nivel 1 (Libros 1 al 6)">Nivel 1 (Libros 1 al 6)</option>
                    <option value="Nivel 2 (Libros 7 al 12)">Nivel 2 (Libros 7 al 12)</option>
                    <option value="Nivel 3 (Libros 13 al 18)">Nivel 3 (Libros 13 al 18)</option>
                    <option value="Examen de Clasificación">Examen de Clasificación</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                    Turno de Clases
                  </label>
                  <select
                    value={formInscripcion.turno}
                    onChange={(e) => setFormInscripcion({ ...formInscripcion, turno: e.target.value })}
                    className="input w-full text-xs p-2 rounded-lg"
                  >
                    <option value="Mañana (07:00 - 08:30)">Mañana (07:00 - 08:30)</option>
                    <option value="Mañana (08:30 - 10:00)">Mañana (08:30 - 10:00)</option>
                    <option value="Tarde (14:30 - 16:00)">Tarde (14:30 - 16:00)</option>
                    <option value="Tarde (16:00 - 17:30)">Tarde (16:00 - 17:30)</option>
                    <option value="Noche (18:00 - 19:30)">Noche (18:00 - 19:30)</option>
                    <option value="Noche (19:30 - 21:00)">Noche (19:30 - 21:00)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="btn btn-primary w-full md:w-auto px-8 py-3 rounded-xl font-bold text-xs md:text-sm shadow-xl flex items-center justify-center gap-2"
                  style={{ background: 'var(--military-green-primary)' }}
                >
                  <Send className="w-4 h-4 text-amber-400" />
                  <span>Confirmar Pre-Inscripción y Generar Comprobante</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      <section id="correo-institucional" className="space-y-6">
        <div className="bg-gradient-to-r from-neutral-900 via-neutral-900/95 to-neutral-950 border border-neutral-800 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl space-y-2 mb-6">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full inline-block">
              Google Workspace Institucional
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">
              Solicitud y Activación de Correo Institucional
            </h2>
            <p className="text-xs md:text-sm text-neutral-300">
              Tras haber formalizado su inscripción, solicite aquí su cuenta de correo con dominio oficial
              <strong className="text-amber-400"> @idiomas.ejercito.mil.bo</strong> para acceder al aula virtual, material académico y notificaciones oficiales.
            </p>
          </div>

          <form onSubmit={handleSolicitarCorreo} className="max-w-xl space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Cédula de Identidad (C.I.) o Código de Inscripción:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ej: 6849201 LP o EIE-2026-..."
                  value={ciBusquedaCorreo}
                  onChange={(e) => {
                    setCiBusquedaCorreo(e.target.value);
                    setErrorCorreo(null);
                  }}
                  required
                  className="input flex-1 text-xs md:text-sm p-3 rounded-xl font-mono"
                />
                <button
                  type="submit"
                  className="btn btn-primary px-5 py-3 rounded-xl text-xs font-bold shrink-0 flex items-center gap-2"
                  style={{ background: 'var(--military-gold-primary)', color: '#000' }}
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Tramitar Correo</span>
                </button>
              </div>
            </div>

            {errorCorreo && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorCorreo}</span>
              </div>
            )}
          </form>

          {resultadoCorreo && (
            <div className="mt-8 bg-neutral-950 border border-amber-500/40 rounded-2xl p-6 md:p-8 space-y-6 max-w-2xl animate-solemn-fade shadow-2xl">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-bold text-white">
                      Credenciales de Correo Institucional
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Cuenta habilitada para: <strong>{resultadoCorreo.estudiante.nombre_estudiante} {resultadoCorreo.estudiante.apellido_estudiante}</strong>
                    </p>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2.5 py-1 rounded-md font-mono font-bold">
                  ACTIVO
                </span>
              </div>

              <div className="space-y-3">
                <div className="bg-neutral-900 border border-neutral-800 p-3.5 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-neutral-400 font-mono block">DIRECCIÓN DE CORREO:</span>
                    <strong className="text-sm font-mono text-emerald-400 break-all">{resultadoCorreo.emailGenerado}</strong>
                  </div>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 p-3.5 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-neutral-400 font-mono block">CONTRASEÑA TEMPORAL:</span>
                    <strong className="text-sm font-mono text-amber-400">{resultadoCorreo.passwordTemporal}</strong>
                  </div>
                  <span className="text-[10px] text-neutral-500">Cambiar al primer ingreso</span>
                </div>

                <div className="text-[11px] text-neutral-400 bg-neutral-900/50 p-3 rounded-lg space-y-1">
                  <p><strong>Instrucciones de Acceso:</strong></p>
                  <p>1. Ingrese a <a href="https://mail.google.com" target="_blank" rel="noreferrer" className="text-sky-400 underline">mail.google.com</a> o la app de Gmail.</p>
                  <p>2. Inicie sesión con la dirección y la contraseña temporal proporcionadas arriba.</p>
                  <p>3. Configure su segundo factor de autenticación y cree su contraseña definitiva.</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={handleCopiarCredenciales}
                  className="btn btn-secondary text-xs px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2"
                >
                  {copiado ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiado ? '¡Copiado al portapapeles!' : 'Copiar Credenciales'}</span>
                </button>

                <a
                  href="https://accounts.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary text-xs px-5 py-2.5 rounded-xl font-bold flex items-center gap-2"
                  style={{ background: 'var(--military-green-primary)' }}
                >
                  <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                  <span>Abrir Google Workspace</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      <section id="contacto" className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full inline-block">
            Atención al Usuario
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">
            Canales de Contacto y Asistencia
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-neutral-900/60 border border-neutral-800 p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base">Sede Central Miraflores</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Av. Saavedra Nro. 1420 (frente al Estado Mayor General del Ejército). La Paz, Bolivia.
            </p>
          </div>

          <div className="bg-neutral-900/60 border border-neutral-800 p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Phone className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base">Central Telefónica y Cajas</h4>
            <p className="text-xs text-neutral-400 leading-relaxed font-mono">
              Teléfono: (591-2) 2223401 &bull; 2223402<br />
              WhatsApp Oficial: +591 71548920
            </p>
          </div>

          <div className="bg-neutral-900/60 border border-neutral-800 p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base">Horarios de Atención</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Lunes a Viernes: 07:30 a 21:30<br />
              Sábados: 08:00 a 14:00 (Cursos Intensivos)
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-neutral-800/80 pt-10 text-xs text-neutral-400 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-3">
              <img src="/logo-ejercito.png" alt="Logo Ejército" className="w-10 h-10 object-contain" />
              <div>
                <p className="font-bold text-white text-sm">ESCUELA DE IDIOMAS DEL EJÉRCITO</p>
                <p className="text-[10px] text-amber-400 font-mono">Comando de Educación y Doctrina Militar &bull; CEDMIL</p>
              </div>
            </div>
            <p className="text-xs text-neutral-400 max-w-md leading-relaxed">
              Institución líder en la enseñanza de idiomas extranjeros y nativos para las Fuerzas Armadas y el personal civil boliviano. Formando talento humano bajo altos preceptos de excelencia, disciplina y patriotismo.
            </p>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-white uppercase text-[11px] tracking-wider">Enlaces Rápidos</p>
            <ul className="space-y-1.5 text-xs">
              <li><a href="#mision-vision" className="hover:text-amber-400 transition">Misión y Visión</a></li>
              <li><a href="#oferta-academica" className="hover:text-amber-400 transition">Oferta de Idiomas</a></li>
              <li><a href="#inscripciones" className="hover:text-amber-400 transition">Inscripciones Online</a></li>
              <li><a href="#correo-institucional" className="hover:text-amber-400 transition">Solicitud de Correo</a></li>
              <li><Link href="/dashboard" className="text-amber-400 font-semibold hover:underline">Acceso a SACA</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-white uppercase text-[11px] tracking-wider">Marco Normativo</p>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              Constitución Política del Estado (Art. 103)<br />
              Ley N° 164 de Telecomunicaciones y TIC<br />
              Ley N° 1322 de Propiedad Intelectual<br />
              Ley N° 1178 (SAFCO - Control Gubernamental)
            </p>
          </div>
        </div>

        <div className="border-t border-neutral-800/60 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-neutral-500">
          <p>
            &copy; 2026 Escuela de Idiomas del Ejército &bull; Todos los derechos reservados.
          </p>
          <p className="text-center md:text-right">
            Desarrollado para UNIFRANZ &bull; Materia: Análisis y Diseño II (MSc. Hilaria Adima Vasquez Duran)
          </p>
        </div>
      </footer>
    </div>
  );
}
