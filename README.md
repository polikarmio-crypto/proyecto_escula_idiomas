# Sistema de Gestión Académica - Escuela de Idiomas del Ejército

## División de responsabilidades del equipo

| Módulo | Responsable |
|---|---|
| **Frontend React/Next.js (este repo)** | Pablo Medina |
| **Backend Laravel REST API** | Pablo Medina / Compañero asignado |
| **Microservicio Quarkus (IO / analítica)** | Compañero asignado |
| **Base de Datos PostgreSQL** | Compartido / DBA |

---

## Estructura del proyecto

```
proyecto_Idiomas/
├── laravel/                  # API REST Laravel 12 (Backend Principal)
├── frontend/                 # Frontend Next.js 14 + TypeScript (Interfaz de Usuario)
└── quarkus/                  # Microservicio Quarkus (Analítica y Reportes)
```

## Dependencias Principales

**Frontend:**
- Next.js 14
- React 18
- TypeScript
- NextAuth.js (Autenticación Google)

**Laravel:**
- PHP 8.2+
- Laravel 12
- PostgreSQL Driver

**Quarkus:**
- Java 17+
- Quarkus Framework

---

## ⚠️ AVISO IMPORTANTE PARA DESARROLLADORES (MOCK DATA)

Actualmente, las vistas del Frontend (`/docentes`, `/paralelos`, `/inscripciones`, y el panel principal) utilizan **datos de prueba estáticos (Mock Data)** para demostrar el diseño y funcionamiento de la interfaz. 

Cuando el backend de **Laravel** esté listo:
1. Deben buscar en los archivos de React los bloques marcados con `⚠️ TODO IMPORTANTE: CONEXIÓN A BASE DE DATOS`.
2. Eliminar los arrays constantes (ej. `MOCK_DOCENTES`).
3. Reemplazar la asignación de datos con llamadas reales a la API (usando `fetch` o la librería que prefieran).

---

## Instalación y Configuración para Colaboradores

Para facilitar la descarga de dependencias y configuración del entorno, puedes usar los scripts de inicialización provistos en la raíz del proyecto.

### Paso a paso:

1. **Clonar el repositorio:**
   ```bash
   git clone <url-del-repo>
   cd proyecto_Idiomas
   ```

2. **Ejecutar script de configuración automática:**
   - En Windows (Command Prompt o PowerShell): `setup.bat`
   - En Linux/Mac: `bash setup.sh`

   *Nota: Estos scripts se encargarán de instalar las dependencias (NPM, Composer) y copiar los archivos `.env.example` a `.env` en cada subproyecto.*

3. **Configuración de Variables de Entorno (.env):**
   - En la carpeta `frontend/`, edita el archivo `.env.local` y agrega tus credenciales de Google Auth (`GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET`).
   - En la carpeta `laravel/`, edita el archivo `.env` para configurar tu conexión a PostgreSQL.

4. **Arrancar los servicios en desarrollo:**
   - **Frontend:**
     ```bash
     cd frontend
     npm run dev
     ```
     Disponible en [http://localhost:3000](http://localhost:3000)
   
   - **Backend Laravel:**
     ```bash
     cd laravel
     php artisan serve
     ```
     Disponible en [http://localhost:8000](http://localhost:8000)
