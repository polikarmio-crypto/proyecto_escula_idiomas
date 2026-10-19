# 🏛️ Sistema de Gestión Académica — Escuela de Idiomas del Ejército (EIE)

Sistema integral de gestión académica, control financiero, analítica operativa y métodos numéricos para la **Escuela de Idiomas del Ejército de Bolivia (EIE)**.

---

## 📐 Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     FRONTEND WEB (Next.js 14 + React 18)               │
│                 TypeScript, Vanilla CSS, NextAuth.js                   │
│                              Puerto: 3000                              │
└───────────────────▲─────────────────────────────────▲───────────────────┘
                    │                                 │
                    │ REST API                        │ REST API
                    ▼                                 ▼
┌───────────────────────────────────────┐ ┌───────────────────────────────┐
│       BACKEND CORE (Laravel 12)       │ │  MICROSERVICIO IO (Quarkus)   │
│   PHP 8.2 FPM, Eloquent ORM, Sanctum │ │     Java 17+, Quarkus REST    │
│   Reglas de Negocio, FIFO, Almacén    │ │ Teoría Colas M/M/c, Métodos   │
│              Puerto: 8000             │ │ Numéricos    Puerto: 8080     │
└───────────────────▲───────────────────┘ └───────────────▲───────────────┘
                    │                                     │
                    │ SQL / PDO                           │ JDBC
                    ▼                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    BASE DE DATOS (PostgreSQL 16)                       │
│            Normalizada hasta 5FN, Extensiones pg_trgm, UUID           │
│            Índices Parciales, Vistas Materializadas/Performantes       │
│                              Puerto: 5432                              │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 📋 Requisitos Previos

| Herramienta | Versión Mínima | Uso |
|---|---|---|
| **Docker Desktop** | 4.x+ | Contenedores de PostgreSQL y Backend Laravel |
| **Node.js** | 18.x+ | Frontend Next.js |
| **npm** | 9.x+ | Gestor de paquetes del frontend |
| **Java JDK** | 17+ (probado con 25) | Microservicio Quarkus |
| **Apache Maven** | 3.9+ | Compilación y ejecución de Quarkus |

> **Nota:** El backend Laravel corre dentro de un contenedor Docker, **no necesitas PHP instalado** en tu máquina local.

---

## 🚀 Pasos para Ejecutar el Proyecto

### Paso 1 — Clonar y acceder al proyecto

```powershell
git clone <URL_DEL_REPOSITORIO>
cd proyecto_Idiomas
```

### Paso 2 — Crear archivo de variables de entorno

```powershell
# Windows PowerShell:
Copy-Item .env.example .env

# Linux / Mac:
cp .env.example .env
```

### Paso 3 — Levantar PostgreSQL + Backend Laravel (Docker)

```powershell
cd "f:\Pablo Medina\proyecto_Idiomas"
docker compose up -d postgres backend
```

Esto levanta:
- **eie_postgres** — Base de datos PostgreSQL 16 en el puerto `5432`
- **eie_backend** — API REST Laravel 12 en el puerto `8000`

Verificar que estén corriendo:

```powershell
docker compose ps
```

Deberías ver ambos contenedores en estado `Up` / `Healthy`.

### Paso 4 — Ejecutar migraciones y seeders (primera vez)

```powershell
docker compose exec backend php artisan migrate:fresh --seed
```

> Esto crea las 28 tablas, triggers, índices, vistas y carga **450+ registros de prueba** (estudiantes, docentes, paralelos, inscripciones, pagos, etc.).

### Paso 5 — Verificar que la API funciona

```powershell
curl http://localhost:8000/api/v1/health
```

Respuesta esperada:
```json
{
  "status": "OK",
  "service": "Escuela de Idiomas del Ejército - API",
  "timestamp": "..."
}
```

### Paso 6 — Levantar el Frontend (Next.js)

```powershell
cd "f:\Pablo Medina\proyecto_Idiomas\frontend"
npm install      # Solo la primera vez
npm run dev
```

El frontend estará disponible en: **http://localhost:3000**

### Paso 7 — Levantar el Microservicio Quarkus (Opcional — Métodos Numéricos & IO)

```powershell
cd "f:\Pablo Medina\proyecto_Idiomas\quarkus"
mvn quarkus:dev
```

> **Nota:** Usa `mvn` directamente (Maven global), **NO** `./mvnw` ya que el wrapper puede dar problemas en Windows.

El microservicio estará disponible en: **http://localhost:8080**

---

## 🔑 Cuentas de Prueba — Acceso por Roles (Diagrama de Clases UML, pág. 24)

El sistema implementa estrictamente los **6 roles de actores institucionales** del diseño UML:

### Login por Email Institucional (Modo Demo)

En la pantalla de login, haz clic en **"Ingreso con Email Institucional"** e ingresa uno de los siguientes correos. El sistema detecta el rol automáticamente por el prefijo:

| Rol Institucional | Email de Prueba | PIN | Módulos del Sistema Habilitados |
|---|---|---|---|
| 🔴 **Administrador del Sistema** | `admin@ejercito.mil.bo` | `9999` | **Módulo 1: Catálogos Base** (`/catalogos`), Dashboard y Auditoría general. |
| 🔵 **Jefe Académico** | `jefe.academico@ejercito.mil.bo` | `5050` | **Módulo 2:** Estructura Académica (`/estructura`)<br>**Módulo 3:** Docentes (`/docentes`)<br>**Módulo 4:** Estudiantes (`/estudiantes`)<br>**Módulo 5:** Paralelos (`/paralelos`)<br>**Módulo 6:** Inscripciones (`/inscripciones`)<br>**Módulo 7:** Supervisión de Calificaciones (`/calificaciones`)<br>**IO:** Métodos Numéricos (`/metodos-numericos`) |
| 🟢 **Docente / Catedrático** | `doc.rios@ejercito.mil.bo` | `1010` | **Módulo 5:** Consulta de paralelos asignados (`/paralelos`)<br>**Módulo 7:** Registro de notas por libro 80/10/10 (`/calificaciones`) |
| 🟡 **Cajero / Ventanilla** | `cajero@ejercito.mil.bo` | `3030` | **Módulo 8:** Cajas y Recaudaciones (`/cajas` - llamada FIFO, cobro de matrículas/mensualidades/libros y emisión de comprobantes) |
| 🩷 **Encargado de Almacén** | `almacen@ejercito.mil.bo` | `4040` | **Módulo 9:** Almacén e Inventario de Libros (`/almacen` - stock físico, movimientos de entrada/salida, control de ROP y pedidos de reposición) |
| 🔷 **Estudiante (Civil / Militar)** | `est.mamani@ejercito.mil.bo` | _(sin PIN)_ | **Módulo 6:** Consulta de cursos matriculados (`/inscripciones`)<br>**Módulo 7:** Consulta de notas y avance libro a libro (`/calificaciones`)<br>**Módulo 8:** Solicitud de ficha de atención digital para caja (`/cajas`) |

### Matriz de Permisos por Rol — Módulos Accesibles (Casos de Uso 11.1 a 11.9)

| Módulo del Sistema | Caso de Uso | Administrador | Jefe Académico | Docente | Cajero | Encargado Almacén | Estudiante |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Dashboard** | General | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **1. Catálogos Base** | CU 11.1 | ✅ (Exclusivo) | — | — | — | — | — |
| **2. Estructura Académica** | CU 11.2 | — | ✅ (Exclusivo) | — | — | — | — |
| **3. Docentes & Rotación** | CU 11.3 | — | ✅ | — | — | — | — |
| **4. Estudiantes (Expedientes)** | CU 11.4 | — | ✅ | — | — | — | — |
| **5. Paralelos & Asignación** | CU 11.5 | — | ✅ (Crea/Asigna) | 👁️ (Consulta) | — | — | — |
| **6. Inscripciones & Avance** | CU 11.6 | — | ✅ (Inscribe) | — | — | — | 👁️ (Consulta) |
| **7. Calificaciones (80/10/10)** | CU 11.7 | — | ✅ (Examen Nivel) | ✅ (Califica Libros) | — | — | 👁️ (Consulta) |
| **8. Cajas & Recaudaciones** | CU 11.8 | — | — | — | ✅ (Cobra/Atiende) | — | 🎟️ (Saca Ficha) |
| **9. Almacén & ROP** | CU 11.9 | — | — | — | — | ✅ (Exclusivo) | — |
| **Métodos Numéricos & IO** | Analítica | — | ✅ | — | — | — | — |

---

## 🎯 Reglas de Negocio Académicas y Militares

### 1. Rotación Docente Quincenal (≤ 15 días)
Los docentes en aula no deben permanecer más de 15 días continuos en un mismo paralelo.
- Endpoint de alertas: `GET /api/v1/docentes/alertas/rotacion`
- Algoritmo de asignación óptima: `POST /api/analytics/asignacion-optima` (Quarkus)

### 2. Fórmula de Evaluación Ponderada Militar (80 / 10 / 10)
- **Examen Teórico / Práctico:** 80%
- **Defensa Oral / Speaking:** 10%
- **Participación y Disciplina:** 10%
- **Nota Mínima de Aprobación:** **71.0 / 100 puntos**

### 3. Subtipo de Estudiantes (Civiles vs. Militares)
- **Civiles:** Cédula de Identidad, datos particulares, arancel regular.
- **Militares:** Registro complementario con Grado Militar, Unidad Militar y Código Institucional.

---

## ⏱️ Módulo de Cajas: Disciplina FIFO y Teoría de Colas (M/M/c)

- **FIFO (First In, First Out):** Fichas emitidas con marca de tiempo exacta.
- **Métricas Operativas Diarias:** λ (tasa de llegada), μ (tasa de servicio), c (ventanillas), ρ (utilización), Lq (largo de cola), Wq (tiempo de espera).
- **Quarkus:** Cálculo analítico de la Fórmula C de Erlang con `POST /api/analytics/teoria-colas/mmc`.

---

## 📦 Módulo de Almacén: Control ROP

- **ROP (Reorder Point):** Punto de reorden calculado por consumo promedio.
- **Alertas Automáticas:** `GET /api/v1/almacen/alertas-rop`
- **Kardex Físico:** Movimientos auditados (Entrada, Salida, Ajuste).

---

## 📊 Módulo de Métodos Numéricos & Investigación Operativa (H3 MN)

Implementa la suite matemática institucional tanto en el microservicio reactivo **Quarkus** (`/api/analytics/*`) como en el core **Laravel** (`/api/v1/metodos-numericos/*`), siguiendo las especificaciones del documento **H3 - Proyecto Semestral MN**:

| Método / Modelo | Base Matemática | Aplicación en la Escuela de Idiomas |
|---|---|---|
| **Predicción de Rendimiento & Deserción (H3)** | Mínimos Cuadrados $\hat{y} = ax + b$, proyección a exámenes de nivel $x_p \in \{6, 12, 18, 24, 30, 36\}$ y regla $R(x_p)$ (Eq. 4.11) | Alerta temprana al Jefe Académico: clasificación de riesgo **ALTO** ($\hat{y}_p < 51$ o $a < -3.0$), **MEDIO** ($51 \le \hat{y}_p < 65$ o $-3.0 \le a < 0$) y **BAJO** ($\hat{y}_p \ge 65$ y $a \ge 0$). Recálculo por lotes al cierre de rotación docente (Fig. 5.4). |
| **Mínimos Cuadrados General** | Minimización de diferencias al cuadrado $SSE = \sum (y_i - \hat{y}_i)^2$, $R^2$, Pearson $r$ | Proyección de demanda de textos en Almacén y tendencia de matrículas anuales. |
| **Interpolación de Newton** | Polinomio en Diferencias Divididas $P(x) = f[x_0] + \sum f[x_0,\dots,x_k] \prod (x - x_j)$ | Estimación de calificaciones intermedias sin presuponer linealidad estricta. |
| **Programación Lineal Simplex** | Método Simplex estándar en forma canónica (maximización con holguras) | Asignación óptima de carga horaria en aulas y laboratorios de idiomas. |
| **Teoría de Colas M/M/c (FIFO)** | Modelo multiservidor markoviano con fórmula Erlang-C | Optimización de ventanillas de Caja en periodo de matrículas para reducir tiempos de espera $W_q$. |

### Caso de Validación Oficial H3 (Tabla 5.3 del Documento)

El microservicio y el frontend integran la verificación exacta de la Tabla 5.3:
- **Entrada:** Calificaciones de libros 1 al 6: `{78, 74, 75, 68, 66, 61}`
- **Coeficientes obtenidos:** $a \approx -3.3143$ pts/libro, $b \approx 81.9333$, $R^2 \approx 0.9362$ (ajuste fuerte)
- **Proyección al Examen de Nivel 2 ($x_p = 12$):** $\hat{y}_{12} = 42.16$ puntos
- **Clasificación de Riesgo:** **ALTO** ($\hat{y}_{12} < 51$ y $a < -3.0$) $\to$ Requiere intervención pedagógica inmediata del Jefe Académico antes del examen.

---

## 🗄️ Base de Datos Normalizada (5FN)

Estructurada en **11 migraciones** cubriendo 28+ tablas con integridad referencial completa:

- Tablas base del dominio académico, militar, financiero y almacén
- Tabla `usuario` con control multi-rol y tabla `log_auditoria` con payloads JSON
- Índices parciales especializados:
  - `idx_ficha_cola_fifo`: FIFO por antigüedad de llegada
  - `idx_inscripcion_activa`: Inscripciones vigentes
  - `idx_asig_docente_activa`: Rotación de docentes activos
  - `idx_pedido_rep_pendiente`: Pedidos de almacén pendientes
- Vistas SQL de alto rendimiento para métricas de cola, stock y rotación docente
- Triggers PL/pgSQL para validación automática de ponderaciones militares

---

## 📋 Catálogo de Endpoints REST API

### Laravel (`/api/v1`)

| Grupo | Método | Endpoint | Descripción |
|---|---|---|---|
| **Sistema** | `GET` | `/api/v1/health` | Verificación de estado |
| **Auth** | `POST` | `/api/v1/auth/login` | Login con email y contraseña |
| **Auth** | `GET` | `/api/v1/auth/usuarios` | Lista de usuarios y roles |
| **Dashboard** | `GET` | `/api/v1/dashboard` | Métricas consolidadas |
| **Catálogos** | `GET` | `/api/v1/catalogos` | Gestiones, idiomas, aulas, horarios |
| **Estructura** | `GET` | `/api/v1/estructura/programas` | Árbol curricular |
| **Estudiantes** | `GET` | `/api/v1/estudiantes` | Listado con filtros por tipo |
| **Estudiantes** | `POST` | `/api/v1/estudiantes` | Registrar nuevo estudiante |
| **Estudiantes** | `GET` | `/api/v1/estudiantes/{id}` | Ficha completa |
| **Estudiantes** | `PUT` | `/api/v1/estudiantes/{id}` | Actualizar estudiante |
| **Estudiantes** | `DELETE` | `/api/v1/estudiantes/{id}` | Baja lógica (soft delete) |
| **Docentes** | `GET` | `/api/v1/docentes` | Listado de docentes |
| **Docentes** | `POST` | `/api/v1/docentes` | Registrar docente |
| **Docentes** | `GET` | `/api/v1/docentes/alertas/rotacion` | Alertas de rotación ≥15 días |
| **Docentes** | `POST` | `/api/v1/docentes/rotar` | Rotar docente a nuevo paralelo |
| **Paralelos** | `GET` | `/api/v1/paralelos` | Listado con cupos y horarios |
| **Paralelos** | `POST` | `/api/v1/paralelos` | Crear paralelo |
| **Inscripciones** | `GET` | `/api/v1/inscripciones` | Listado de inscritos |
| **Inscripciones** | `POST` | `/api/v1/inscripciones` | Inscribir estudiante |
| **Calificaciones** | `GET` | `/api/v1/calificaciones/paralelo/{id}` | Centralizador de notas |
| **Calificaciones** | `POST` | `/api/v1/calificaciones/libro` | Registrar nota (80/10/10) |
| **Calificaciones** | `POST` | `/api/v1/calificaciones/examen-nivel` | Examen de suficiencia |
| **Cajas** | `GET` | `/api/v1/cajas` | Estado de ventanillas |
| **Cajas** | `GET` | `/api/v1/cajas/cola-fifo` | Cola FIFO ordenada |
| **Cajas** | `GET` | `/api/v1/cajas/metricas` | Indicadores M/M/c del día |
| **Cajas** | `POST` | `/api/v1/cajas/ficha` | Emitir ticket FIFO |
| **Cajas** | `POST` | `/api/v1/cajas/ficha/llamar` | Llamar siguiente en cola |
| **Cajas** | `POST` | `/api/v1/cajas/ficha/finalizar` | Finalizar turno |
| **Cajas** | `POST` | `/api/v1/cajas/pago` | Registrar pago |
| **Cajas** | `GET` | `/api/v1/cajas/pagos` | Historial de pagos |
| **Almacén** | `GET` | `/api/v1/almacen/stock` | Stock actual y ROP |
| **Almacén** | `GET` | `/api/v1/almacen/alertas-rop` | Libros bajo ROP |
| **Almacén** | `POST` | `/api/v1/almacen/movimiento` | Movimiento de kardex |
| **Almacén** | `GET` | `/api/v1/almacen/kardex/{id}` | Historial de un libro |
| **Almacén** | `GET` | `/api/v1/almacen/pedidos` | Pedidos de reposición |
| **Almacén** | `POST` | `/api/v1/almacen/pedidos` | Solicitar reposición |
| **Almacén** | `PUT` | `/api/v1/almacen/pedidos/{id}/recibir` | Recepcionar lote |
| **Métodos Num.** | `POST` | `/api/v1/metodos-numericos/minimos-cuadrados` | Regresión lineal + SSE |
| **Métodos Num.** | `POST` | `/api/v1/metodos-numericos/interpolacion-newton` | Diferencias divididas |
| **Métodos Num.** | `POST` | `/api/v1/metodos-numericos/simplex` | Programación lineal |
| **H3 Predictivo** | `POST` | `/api/v1/metodos-numericos/prediccion-rendimiento` | Predicción individual H3 y riesgo de deserción |
| **H3 Predictivo** | `GET` | `/api/v1/metodos-numericos/prediccion-rendimiento/validacion-h3` | Caso oficial Tabla 5.3 ($a=-3.314$, $R^2=0.936$) |
| **H3 Predictivo** | `POST` | `/api/v1/metodos-numericos/prediccion-rendimiento/lote` | Recálculo por lotes al cierre de rotación |

### Quarkus (`/api/analytics`)

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/analytics/status` | Estado del microservicio (versión 3.0.0-H3) |
| `POST` | `/api/analytics/prediccion-rendimiento` | Predicción de rendimiento y clasificación de riesgo H3 |
| `GET` | `/api/analytics/prediccion-rendimiento/validacion-h3` | Caso de validación Tabla 5.3 del H3 |
| `POST` | `/api/analytics/prediccion-rendimiento/lote` | Recálculo masivo por lotes (Figura 5.4) |
| `POST` | `/api/analytics/asignacion-optima` | Asignación óptima de docentes |
| `POST` | `/api/analytics/teoria-colas/mmc` | Análisis M/M/c (Erlang-C) |
| `POST` | `/api/analytics/minimos-cuadrados` | Mínimos cuadrados (SSE) |
| `POST` | `/api/analytics/interpolacion-newton` | Interpolación Newton |
| `POST` | `/api/analytics/simplex` | Método Simplex |

---

## 🛠️ Comandos Útiles

### Gestión de Docker

```powershell
# Ver estado de los contenedores
docker compose ps

# Ver logs del backend
docker compose logs -f backend

# Ver logs de PostgreSQL
docker compose logs -f postgres

# Detener todos los contenedores
docker compose down

# Reiniciar los contenedores
docker compose restart

# Reconstruir contenedores (después de cambios en Dockerfile)
docker compose up --build -d postgres backend
```

### Comandos Artisan (Laravel) — Ejecutar dentro del contenedor

```powershell
# Migrar base de datos desde cero con seeders
docker compose exec backend php artisan migrate:fresh --seed

# Solo ejecutar migraciones
docker compose exec backend php artisan migrate

# Solo ejecutar seeders
docker compose exec backend php artisan db:seed

# Limpiar caché
docker compose exec backend php artisan cache:clear
docker compose exec backend php artisan config:clear

# Ver rutas registradas
docker compose exec backend php artisan route:list
```

### Base de Datos PostgreSQL

```powershell
# Acceder al shell de PostgreSQL
docker compose exec postgres psql -U postgres -d escuela_idiomas

# Contar registros de una tabla
docker compose exec postgres psql -U postgres -d escuela_idiomas -c "SELECT COUNT(*) FROM estudiante;"

# Ver todas las tablas
docker compose exec postgres psql -U postgres -d escuela_idiomas -c "\dt"
```

---

## 📁 Estructura del Proyecto

```
proyecto_Idiomas/
├── backend/                     # Laravel 12 API REST
│   ├── app/Http/Controllers/Api/  # Controladores de la API
│   ├── app/Models/                # Modelos Eloquent
│   ├── database/migrations/       # 11 migraciones (28+ tablas)
│   ├── database/seeders/          # Seeders con 450+ registros
│   ├── routes/api.php             # Definición de rutas REST
│   └── Dockerfile                 # Imagen Docker PHP 8.2 FPM
├── frontend/                    # Next.js 14 + React 18
│   ├── src/app/                   # Páginas (App Router)
│   │   ├── almacen/               # Módulo de Almacén / ROP
│   │   ├── cajas/                 # Módulo de Cajas / FIFO
│   │   ├── calificaciones/        # Módulo de Calificaciones (80/10/10)
│   │   ├── docentes/              # Módulo de Docentes / Rotación
│   │   ├── estudiantes/           # Módulo de Estudiantes (CRUD)
│   │   ├── inscripciones/         # Módulo de Inscripciones
│   │   ├── metodos-numericos/     # Módulo de Métodos Numéricos & IO
│   │   ├── paralelos/             # Módulo de Paralelos
│   │   └── page.tsx               # Dashboard principal
│   ├── src/components/            # Componentes compartidos
│   │   └── AppShell.tsx           # Layout principal con roles y navegación
│   └── .env.local                 # Variables de entorno del frontend
├── quarkus/                     # Microservicio Java (Quarkus)
│   ├── src/main/java/.../service/   # Servicios de negocio
│   │   └── MetodosNumericosService.java
│   ├── src/main/java/.../resource/  # Endpoints REST
│   │   └── AnalyticsResource.java
│   └── pom.xml                      # Dependencias Maven
├── docker/                      # Configuración Docker
│   └── postgres/init.sql          # Script de inicialización PG
├── docker-compose.yml           # Orquestación de 4 servicios
├── .env.example                 # Template de variables de entorno
└── README.md                    # Esta documentación
```

---

## 🔒 Seguridad

- **Bajas lógicas (Soft Delete):** Los registros eliminados no se borran físicamente, se marcan con `deleted_at`.
- **Baja física:** Disponible bajo confirmación explícita del usuario.
- **Auditoría completa:** Tabla `log_auditoria` con estampas de tiempo, IP y snapshots JSON.
- **PINs de seguridad:** Cada rol (excepto Estudiante) requiere PIN para cambio de contexto.
- **Autenticación dual:** Google OAuth (producción) y Login Demo Institucional (desarrollo).

---

## 📄 Licencia y Uso Institucional

Desarrollado para uso exclusivo del **Ejército de Bolivia** y la **Escuela de Idiomas del Ejército (EIE)**.
