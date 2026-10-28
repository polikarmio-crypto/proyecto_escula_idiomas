// Base de Datos Local y Resiliente para la Escuela de Idiomas del Ejército (EIE)
// Alineada 100% con el Modelo Físico, Diccionario de Datos y Casos de Uso del UML

export interface GestionCat {
  id_gestion: number;
  anio_gestion: number;
  estado_gestion: 'Activa' | 'Cerrada';
}

export interface IdiomaCat {
  id_idioma: number;
  nombre_idioma: string;
  codigo?: string;
  descripcion?: string;
  tipo: 'Nativo' | 'Extranjero';
}

export interface AulaCat {
  id_aula: number;
  nombre_aula: string;
  capacidad_aula: number;
}

export interface HorarioCat {
  id_horario: number;
  hora_inicio_horario: string;
  hora_fin_horario: string;
  turno?: 'Mañana' | 'Tarde' | 'Noche';
}

export interface TipoProgramaCat {
  id_tipo_programa: number;
  nombre_tipo_programa: string;
}

export interface ModalidadCat {
  id_modalidad: number;
  nombre_modalidad: string;
}

export interface TipoPagoCat {
  id_tipo_pago: number;
  nombre_tipo_pago: string;
  monto_sugerido?: number;
}

export interface ProgramaItem {
  id_programa: number;
  id_idioma: number;
  id_tipo_programa: number;
  nombre_programa: string;
  duracion_anios_programa: number;
  niveles?: NivelItem[];
}

export interface NivelItem {
  id_nivel: number;
  id_programa: number;
  numero_nivel: number;
  nombre_nivel: string;
  cantidad_libros_nivel: number;
  libros?: LibroItem[];
}

export interface LibroItem {
  id_libro: number;
  id_nivel: number;
  numero_libro: number;
  nombre_libro: string;
}

export interface DocenteItem {
  id_docente: number;
  ci_docente: string;
  nombre_docente: string;
  apellido_docente: string;
  telefono_docente: string;
  email_docente: string;
  estado_docente: 'Activo' | 'Inactivo';
  idiomas?: string[];
}

export interface EstudianteItem {
  id: number;
  id_estudiante: number;
  ci_estudiante: string;
  expedido?: string;
  nombre_estudiante: string;
  apellido_estudiante: string;
  fecha_nacimiento_estudiante: string;
  telefono_estudiante: string;
  email_estudiante: string;
  email_institucional?: string;
  direccion_estudiante: string;
  tipo_estudiante: 'Civil' | 'Militar';
  // Exclusivo militar
  grado_militar?: string;
  unidad_militar?: string;
  id_militar_estudiante?: string;
  // Estado académico
  estado_estudiante?: string;
  idioma_actual?: string;
  nivel_actual?: string;
  paralelo_actual?: string;
  codigo_matricula?: string;
  fecha_registro?: string;
}

export interface ParaleloItem {
  id_paralelo: number;
  codigo_paralelo: string;
  id_nivel: number;
  id_aula: number;
  id_horario: number;
  id_modalidad: number;
  id_gestion: number;
  id_docente: number;
  capacidad_maxima_paralelo: number;
  capacidad_minima_apertura: number;
  estado_paralelo: 'Planificado' | 'Abierto' | 'En Curso' | 'Concluido';
  // Extras informativos
  nombre_nivel?: string;
  nombre_programa?: string;
  nombre_aula?: string;
  nombre_docente?: string;
  horario_texto?: string;
  inscritos_actuales?: number;
}

export interface InscripcionItem {
  id_inscripcion: number;
  id_estudiante: number;
  id_paralelo: number;
  fecha_inscripcion: string;
  estado_inscripcion: 'Activa' | 'Retirada' | 'Concluida';
  estudiante_nombre?: string;
  estudiante_ci?: string;
  paralelo_codigo?: string;
}

export interface EvaluacionItem {
  id_evaluacion: number;
  id_inscripcion: number;
  id_libro: number;
  nota_examen: number;
  nota_defensa: number;
  nota_participacion: number;
  nota_final: number;
  estado_libro: 'Aprobado' | 'Reprobado' | 'En curso';
  fecha_evaluacion: string;
  docente_evaluador?: string;
  estudiante_nombre?: string;
  libro_nombre?: string;
}

export interface FichaAtencionItem {
  id_ficha: number;
  numero_ficha: number;
  id_caja: number;
  id_estudiante: number;
  nombre_estudiante: string;
  hora_llegada: string;
  hora_inicio_atencion?: string;
  hora_fin_atencion?: string;
  estado: 'En espera' | 'Atendiendo' | 'Atendida' | 'Anulada';
  tramite: string;
}

export interface PagoItem {
  id_pago: number;
  id_estudiante: number;
  estudiante_nombre: string;
  id_tipo_pago: number;
  tipo_pago_nombre: string;
  id_gestion: number;
  id_caja: number;
  id_ficha?: number;
  monto: number;
  fecha_pago: string;
  comprobante_nro: string;
}

export interface AlmacenItem {
  id_almacen_libro: number;
  id_libro: number;
  nombre_libro: string;
  idioma: string;
  stock_actual: number;
  punto_reorden: number;
  stock_minimo: number;
  stock_maximo: number;
  costo_unitario: number;
  // Parámetros EOQ del informe de Inv. Operativa
  demanda_anual: number; // D
  costo_pedido: number;  // S (120 Bs)
  costo_mantenimiento: number; // H = i * C (17 Bs)
  lote_optimo_eoq: number; // Q* (92 aprox)
  estado_stock: 'Normal' | 'Alerta ROP' | 'Crítico';
}

// ---------------------------------------------------------------------------
// DATOS INICIALES SEED (Conforme a la documentación oficial y datos del Ejército)
// ---------------------------------------------------------------------------

export const INITIAL_GESTIONES: GestionCat[] = [
  { id_gestion: 1, anio_gestion: 2026, estado_gestion: 'Activa' },
  { id_gestion: 2, anio_gestion: 2025, estado_gestion: 'Cerrada' },
  { id_gestion: 3, anio_gestion: 2024, estado_gestion: 'Cerrada' },
];

export const INITIAL_IDIOMAS: IdiomaCat[] = [
  { id_idioma: 1, nombre_idioma: 'Inglés', codigo: 'ENG', tipo: 'Extranjero', descripcion: 'Plan continuo de 36 libros y 6 niveles con rotación docente cada 15 días.' },
  { id_idioma: 2, nombre_idioma: 'Francés', codigo: 'FRA', tipo: 'Extranjero', descripcion: 'Programa modular en niveles Básico, Intermedio y Avanzado.' },
  { id_idioma: 3, nombre_idioma: 'Portugués', codigo: 'POR', tipo: 'Extranjero', descripcion: 'Programa intensivo para relaciones bilaterales y misiones internacionales.' },
  { id_idioma: 4, nombre_idioma: 'Árabe', codigo: 'ARA', tipo: 'Extranjero', descripcion: 'Capacitación lingüística para agregadurías de defensa y misiones de paz.' },
  { id_idioma: 5, nombre_idioma: 'Chino Mandarín', codigo: 'ZHO', tipo: 'Extranjero', descripcion: 'Enseñanza estratégica orientada al ámbito diplomático y tecnológico militar.' },
  { id_idioma: 6, nombre_idioma: 'Quechua', codigo: 'QUE', tipo: 'Nativo', descripcion: 'Lengua originaria oficial orientada a la interculturalidad y vinculación social.' },
  { id_idioma: 7, nombre_idioma: 'Aymara', codigo: 'AYM', tipo: 'Nativo', descripcion: 'Formación en lengua originaria para el personal militar en el occidente boliviano.' },
  { id_idioma: 8, nombre_idioma: 'Guaraní', codigo: 'GUA', tipo: 'Nativo', descripcion: 'Lengua originaria para guarniciones militares de la región del Chaco y oriente.' },
];

export const INITIAL_AULAS: AulaCat[] = [
  { id_aula: 1, nombre_aula: 'Aula 101 - Bloque A (Miraflores)', capacidad_aula: 20 },
  { id_aula: 2, nombre_aula: 'Aula 102 - Bloque A (Miraflores)', capacidad_aula: 20 },
  { id_aula: 3, nombre_aula: 'Aula 103 - Bloque A (Miraflores)', capacidad_aula: 20 },
  { id_aula: 4, nombre_aula: 'Aula 201 - Bloque B (Laboratorio Multimedia)', capacidad_aula: 25 },
  { id_aula: 5, nombre_aula: 'Aula 202 - Bloque B (Laboratorio de Idiomas)', capacidad_aula: 25 },
  { id_aula: 6, nombre_aula: 'Aula Magna - General Bilbao Rioja', capacidad_aula: 60 },
];

export const INITIAL_HORARIOS: HorarioCat[] = [
  { id_horario: 1, hora_inicio_horario: '07:00:00', hora_fin_horario: '08:30:00', turno: 'Mañana' },
  { id_horario: 2, hora_inicio_horario: '08:30:00', hora_fin_horario: '10:00:00', turno: 'Mañana' },
  { id_horario: 3, hora_inicio_horario: '10:30:00', hora_fin_horario: '12:00:00', turno: 'Mañana' },
  { id_horario: 4, hora_inicio_horario: '14:30:00', hora_fin_horario: '16:00:00', turno: 'Tarde' },
  { id_horario: 5, hora_inicio_horario: '16:00:00', hora_fin_horario: '17:30:00', turno: 'Tarde' },
  { id_horario: 6, hora_inicio_horario: '18:00:00', hora_fin_horario: '19:30:00', turno: 'Noche' }, // Hora pico colas M/M/1
  { id_horario: 7, hora_inicio_horario: '19:30:00', hora_fin_horario: '21:00:00', turno: 'Noche' }, // Hora pico colas M/M/1
];

export const INITIAL_TIPOS_PROGRAMA: TipoProgramaCat[] = [
  { id_tipo_programa: 1, nombre_tipo_programa: 'Regular (Técnico Superior)' },
  { id_tipo_programa: 2, nombre_tipo_programa: 'Intensivo Militar' },
  { id_tipo_programa: 3, nombre_tipo_programa: 'Sabatino Civil' },
  { id_tipo_programa: 4, nombre_tipo_programa: 'Convenio Interinstitucional' },
];

export const INITIAL_MODALIDADES: ModalidadCat[] = [
  { id_modalidad: 1, nombre_modalidad: 'Presencial' },
  { id_modalidad: 2, nombre_modalidad: 'Semi-Presencial' },
  { id_modalidad: 3, nombre_modalidad: 'Virtual / A Distancia' },
];

export const INITIAL_TIPOS_PAGO: TipoPagoCat[] = [
  { id_tipo_pago: 1, nombre_tipo_pago: 'Matrícula Anual / Gestión', monto_sugerido: 150 },
  { id_tipo_pago: 2, nombre_tipo_pago: 'Mensualidad Regular', monto_sugerido: 220 },
  { id_tipo_pago: 3, nombre_tipo_pago: 'Texto Académico / Libro', monto_sugerido: 85 },
  { id_tipo_pago: 4, nombre_tipo_pago: 'Derecho a Examen de Nivel', monto_sugerido: 80 },
  { id_tipo_pago: 5, nombre_tipo_pago: 'Certificación de Grado Técnico', monto_sugerido: 250 },
];

export const INITIAL_DOCENTES: DocenteItem[] = [
  {
    id_docente: 1,
    ci_docente: '4820194 LP',
    nombre_docente: 'Fernando',
    apellido_docente: 'Ríos Torrico',
    telefono_docente: '71548920',
    email_docente: 'doc.rios@ejercito.mil.bo',
    estado_docente: 'Activo',
    idiomas: ['Inglés', 'Francés'],
  },
  {
    id_docente: 2,
    ci_docente: '3948201 CB',
    nombre_docente: 'Patricia',
    apellido_docente: 'Morales Vargas',
    telefono_docente: '72591034',
    email_docente: 'doc.morales@ejercito.mil.bo',
    estado_docente: 'Activo',
    idiomas: ['Inglés'],
  },
  {
    id_docente: 3,
    ci_docente: '5920184 LP',
    nombre_docente: 'Mamani Condori',
    apellido_docente: 'Eusebio',
    telefono_docente: '73049182',
    email_docente: 'doc.mamani@ejercito.mil.bo',
    estado_docente: 'Activo',
    idiomas: ['Aymara', 'Quechua'],
  },
  {
    id_docente: 4,
    ci_docente: '6192840 SC',
    nombre_docente: 'Rodrigo',
    apellido_docente: 'Da Silva Rocha',
    telefono_docente: '77920194',
    email_docente: 'doc.dasilva@ejercito.mil.bo',
    estado_docente: 'Activo',
    idiomas: ['Portugués'],
  },
  {
    id_docente: 5,
    ci_docente: '7482910 LP',
    nombre_docente: 'Karim',
    apellido_docente: 'Al-Mansoor',
    telefono_docente: '78849201',
    email_docente: 'doc.almansoor@ejercito.mil.bo',
    estado_docente: 'Activo',
    idiomas: ['Árabe'],
  },
];

export const INITIAL_ESTUDIANTES: EstudianteItem[] = [
  {
    id: 1,
    id_estudiante: 1,
    ci_estudiante: '6849201 LP',
    expedido: 'LP',
    nombre_estudiante: 'Carlos Fernando',
    apellido_estudiante: 'Mamani Quispe',
    fecha_nacimiento_estudiante: '2001-04-12',
    telefono_estudiante: '71928401',
    email_estudiante: 'carlos.mamani.q@gmail.com',
    email_institucional: 'est.carlos.mamani@idiomas.ejercito.mil.bo',
    direccion_estudiante: 'Av. Saavedra Nro. 1420, Miraflores, La Paz',
    tipo_estudiante: 'Militar',
    grado_militar: 'Subteniente de Infantería',
    unidad_militar: 'Regimiento Colorados de Bolivia - Escolta Presidencial',
    id_militar_estudiante: 'MIL-INF-2023-089',
    estado_estudiante: 'Activo',
    idioma_actual: 'Inglés',
    nivel_actual: 'Nivel 1 (Libros 1 al 6)',
    paralelo_actual: 'PAR-ING-101',
    codigo_matricula: 'MAT-2026-0001',
    fecha_registro: '2026-01-15',
  },
  {
    id: 2,
    id_estudiante: 2,
    ci_estudiante: '7291048 SC',
    expedido: 'SC',
    nombre_estudiante: 'Mariana Sofia',
    apellido_estudiante: 'Suárez Justiniano',
    fecha_nacimiento_estudiante: '2002-09-24',
    telefono_estudiante: '77291044',
    email_estudiante: 'mariana.suarez@gmail.com',
    email_institucional: 'est.mariana.suarez@idiomas.ejercito.mil.bo',
    direccion_estudiante: 'Calle Ballivián Nro. 340, Santa Cruz de la Sierra',
    tipo_estudiante: 'Civil',
    estado_estudiante: 'Activo',
    idioma_actual: 'Inglés',
    nivel_actual: 'Nivel 1 (Libros 1 al 6)',
    paralelo_actual: 'PAR-ING-101',
    codigo_matricula: 'MAT-2026-0002',
    fecha_registro: '2026-01-16',
  },
  {
    id: 3,
    id_estudiante: 3,
    ci_estudiante: '5920148 CB',
    expedido: 'CB',
    nombre_estudiante: 'Jorge Luis',
    apellido_estudiante: 'Camacho Torrico',
    fecha_nacimiento_estudiante: '1999-11-03',
    telefono_estudiante: '78291055',
    email_estudiante: 'jorge.camacho@hotmail.com',
    email_institucional: 'est.jorge.camacho@idiomas.ejercito.mil.bo',
    direccion_estudiante: 'Av. Heroínas Nro. 892, Cochabamba',
    tipo_estudiante: 'Militar',
    grado_militar: 'Teniente de Caballería',
    unidad_militar: 'Escuela Militar de Idiomas del Ejército - Filial Cbba.',
    id_militar_estudiante: 'MIL-CAB-2021-042',
    estado_estudiante: 'Activo',
    idioma_actual: 'Portugués',
    nivel_actual: 'Nivel Básico',
    paralelo_actual: 'PAR-POR-101',
    codigo_matricula: 'MAT-2026-0003',
    fecha_registro: '2026-01-18',
  },
  {
    id: 4,
    id_estudiante: 4,
    ci_estudiante: '8392019 LP',
    expedido: 'LP',
    nombre_estudiante: 'Valeria Nicole',
    apellido_estudiante: 'Paredes Rojas',
    fecha_nacimiento_estudiante: '2003-02-18',
    telefono_estudiante: '73019284',
    email_estudiante: 'valeria.paredes@yahoo.com',
    email_institucional: 'est.valeria.paredes@idiomas.ejercito.mil.bo',
    direccion_estudiante: 'Ciudad Satélite, Plan 405, El Alto',
    tipo_estudiante: 'Civil',
    estado_estudiante: 'Activo',
    idioma_actual: 'Aymara',
    nivel_actual: 'Nivel Básico',
    paralelo_actual: 'PAR-AYM-101',
    codigo_matricula: 'MAT-2026-0004',
    fecha_registro: '2026-01-20',
  },
  {
    id: 5,
    id_estudiante: 5,
    ci_estudiante: '4920194 TJ',
    expedido: 'TJ',
    nombre_estudiante: 'Alejandro',
    apellido_estudiante: 'Gutiérrez Mendoza',
    fecha_nacimiento_estudiante: '1998-07-29',
    telefono_estudiante: '72983719',
    email_estudiante: 'alejandro.gutierrez@gmail.com',
    email_institucional: 'est.alejandro.gutierrez@idiomas.ejercito.mil.bo',
    direccion_estudiante: 'Barrio El Tejar, Tarija',
    tipo_estudiante: 'Militar',
    grado_militar: 'Capitán de Artillería',
    unidad_militar: 'Regimiento de Artillería 1 Cnl. Camacho',
    id_militar_estudiante: 'MIL-ART-2018-011',
    estado_estudiante: 'Activo',
    idioma_actual: 'Inglés',
    nivel_actual: 'Nivel 2 (Libros 7 al 12)',
    paralelo_actual: 'PAR-ING-201',
    codigo_matricula: 'MAT-2026-0005',
    fecha_registro: '2026-01-21',
  },
];

export const INITIAL_PARALELOS: ParaleloItem[] = [
  {
    id_paralelo: 1,
    codigo_paralelo: 'PAR-ING-101',
    id_nivel: 1,
    id_aula: 1,
    id_horario: 6, // 18:00 - 19:30 (Turno Noche)
    id_modalidad: 1,
    id_gestion: 1,
    id_docente: 1,
    capacidad_maxima_paralelo: 20, // Conforme al doc de Inv Operativa: 20 alumnos por paralelo
    capacidad_minima_apertura: 10,
    estado_paralelo: 'Abierto',
    nombre_nivel: 'Nivel 1 (Libros 1 al 6)',
    nombre_programa: 'Inglés Técnico Superior',
    nombre_aula: 'Aula 101 - Bloque A',
    nombre_docente: 'Fernando Ríos Torrico',
    horario_texto: '18:00 - 19:30 (Noche)',
    inscritos_actuales: 18,
  },
  {
    id_paralelo: 2,
    codigo_paralelo: 'PAR-ING-102',
    id_nivel: 1,
    id_aula: 2,
    id_horario: 7, // 19:30 - 21:00 (Turno Noche)
    id_modalidad: 1,
    id_gestion: 1,
    id_docente: 2,
    capacidad_maxima_paralelo: 20,
    capacidad_minima_apertura: 10,
    estado_paralelo: 'Abierto',
    nombre_nivel: 'Nivel 1 (Libros 1 al 6)',
    nombre_programa: 'Inglés Técnico Superior',
    nombre_aula: 'Aula 102 - Bloque A',
    nombre_docente: 'Patricia Morales Vargas',
    horario_texto: '19:30 - 21:00 (Noche)',
    inscritos_actuales: 19,
  },
  {
    id_paralelo: 3,
    codigo_paralelo: 'PAR-AYM-101',
    id_nivel: 7,
    id_aula: 3,
    id_horario: 2,
    id_modalidad: 1,
    id_gestion: 1,
    id_docente: 3,
    capacidad_maxima_paralelo: 20,
    capacidad_minima_apertura: 8,
    estado_paralelo: 'Abierto',
    nombre_nivel: 'Aymara Básico',
    nombre_programa: 'Aymara Funcional Intercultural',
    nombre_aula: 'Aula 103 - Bloque A',
    nombre_docente: 'Mamani Condori Eusebio',
    horario_texto: '08:30 - 10:00 (Mañana)',
    inscritos_actuales: 14,
  },
  {
    id_paralelo: 4,
    codigo_paralelo: 'PAR-POR-101',
    id_nivel: 9,
    id_aula: 4,
    id_horario: 4,
    id_modalidad: 1,
    id_gestion: 1,
    id_docente: 4,
    capacidad_maxima_paralelo: 20,
    capacidad_minima_apertura: 10,
    estado_paralelo: 'Abierto',
    nombre_nivel: 'Portugués Básico',
    nombre_programa: 'Portugués Diplomático',
    nombre_aula: 'Laboratorio Multimedia Bloque B',
    nombre_docente: 'Rodrigo Da Silva Rocha',
    horario_texto: '14:30 - 16:00 (Tarde)',
    inscritos_actuales: 15,
  },
];

export const INITIAL_ALMACEN: AlmacenItem[] = [
  {
    id_almacen_libro: 1,
    id_libro: 1,
    nombre_libro: 'American English File - Book 1',
    idioma: 'Inglés',
    stock_actual: 12, // Igual que el informe: bajó a 12 (ROP alcanzado)
    punto_reorden: 12, // ROP = d * L = (600/365) * 7 ≈ 11.5 ≈ 12 unidades
    stock_minimo: 8,
    stock_maximo: 200,
    costo_unitario: 85,
    demanda_anual: 600, // 30 paralelos * 20 alumnos
    costo_pedido: 120, // S = 120 Bs
    costo_mantenimiento: 17, // H = 0.20 * 85 = 17 Bs
    lote_optimo_eoq: 92, // Q* = sqrt(2*600*120 / 17) ≈ 92 unidades
    estado_stock: 'Alerta ROP',
  },
  {
    id_almacen_libro: 2,
    id_libro: 2,
    nombre_libro: 'American English File - Book 2',
    idioma: 'Inglés',
    stock_actual: 45,
    punto_reorden: 12,
    stock_minimo: 8,
    stock_maximo: 200,
    costo_unitario: 85,
    demanda_anual: 580,
    costo_pedido: 120,
    costo_mantenimiento: 17,
    lote_optimo_eoq: 90,
    estado_stock: 'Normal',
  },
  {
    id_almacen_libro: 3,
    id_libro: 18,
    nombre_libro: 'American English File - Book 18 (Intermedio Alto)',
    idioma: 'Inglés',
    stock_actual: 7, // Menor o igual al ROP de 7
    punto_reorden: 7, // ROP = 7 según Cuadro 1.3
    stock_minimo: 5,
    stock_maximo: 150,
    costo_unitario: 95,
    demanda_anual: 360,
    costo_pedido: 120,
    costo_mantenimiento: 19,
    lote_optimo_eoq: 67, // Q* = 67 según Cuadro 1.3
    estado_stock: 'Alerta ROP',
  },
  {
    id_almacen_libro: 4,
    id_libro: 25,
    nombre_libro: 'Novo Avenida Brasil - Año 1',
    idioma: 'Portugués',
    stock_actual: 5,
    punto_reorden: 5, // ROP = 5 según Cuadro 1.3
    stock_minimo: 4,
    stock_maximo: 120,
    costo_unitario: 70,
    demanda_anual: 240,
    costo_pedido: 120,
    costo_mantenimiento: 14,
    lote_optimo_eoq: 64, // Q* = 64 según Cuadro 1.3
    estado_stock: 'Alerta ROP',
  },
  {
    id_almacen_libro: 5,
    id_libro: 30,
    nombre_libro: 'Gramática y Diálogos Aymara - Nivel 1',
    idioma: 'Aymara',
    stock_actual: 38,
    punto_reorden: 10,
    stock_minimo: 6,
    stock_maximo: 100,
    costo_unitario: 50,
    demanda_anual: 180,
    costo_pedido: 100,
    costo_mantenimiento: 10,
    lote_optimo_eoq: 60,
    estado_stock: 'Normal',
  },
];

export const INITIAL_FICHAS: FichaAtencionItem[] = [
  {
    id_ficha: 1,
    numero_ficha: 101,
    id_caja: 1,
    id_estudiante: 1,
    nombre_estudiante: 'Subteniente Carlos Fernando Mamani',
    hora_llegada: '18:10:00',
    hora_inicio_atencion: '18:12:00',
    hora_fin_atencion: '18:15:00',
    estado: 'Atendida',
    tramite: 'Pago de Matrícula 2026',
  },
  {
    id_ficha: 2,
    numero_ficha: 102,
    id_caja: 1,
    id_estudiante: 2,
    nombre_estudiante: 'Mariana Sofia Suárez Justiniano',
    hora_llegada: '18:14:00',
    hora_inicio_atencion: '18:15:30',
    hora_fin_atencion: '18:18:30',
    estado: 'Atendida',
    tramite: 'Compra de Libro 1 Inglés',
  },
  {
    id_ficha: 3,
    numero_ficha: 103,
    id_caja: 1,
    id_estudiante: 4,
    nombre_estudiante: 'Valeria Nicole Paredes Rojas',
    hora_llegada: '18:19:00',
    hora_inicio_atencion: '18:20:00',
    estado: 'Atendiendo',
    tramite: 'Pago de Mensualidad Aymara',
  },
  {
    id_ficha: 4,
    numero_ficha: 104,
    id_caja: 1,
    id_estudiante: 5,
    nombre_estudiante: 'Capitán Alejandro Gutiérrez',
    hora_llegada: '18:22:00',
    estado: 'En espera',
    tramite: 'Derecho a Examen de Nivel',
  },
  {
    id_ficha: 5,
    numero_ficha: 105,
    id_caja: 1,
    id_estudiante: 3,
    nombre_estudiante: 'Teniente Jorge Luis Camacho',
    hora_llegada: '18:25:00',
    estado: 'En espera',
    tramite: 'Compra de Libro Portugués',
  },
];

// Helper para sincronizar y persistir colecciones en localStorage
export class LocalStore {
  static get<T>(key: string, defaultVal: T): T {
    if (typeof window === 'undefined') return defaultVal;
    try {
      const saved = localStorage.getItem(`eie_${key}`);
      return saved ? JSON.parse(saved) : defaultVal;
    } catch {
      return defaultVal;
    }
  }

  static set<T>(key: string, val: T): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(`eie_${key}`, JSON.stringify(val));
    } catch {}
  }
}
