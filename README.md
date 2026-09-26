# Sistema de Gestión Académica - Escuela de Idiomas del Ejército

## División de responsabilidades del equipo

| Módulo | Responsable |
|---|---|
| **Frontend React/Next.js (este repo)** | Pablo Medina  |
| **Backend Laravel 12 REST API** | Pablo Medina  — estructura base lista |
| **Microservicio Quarkus (IO / analítica)** | Compañero asignado |
| **Base de Datos PostgreSQL** | Compartido / DBA |

---

## Estructura del proyecto

```
proyecto_Idiomas/
├── backend-laravel/          # API REST Laravel 12
│   ├── app/
│   │   ├── Http/Controllers/ # Controllers a implementar por el compañero
│   │   └── Models/           # Modelos Eloquent (pendiente compañero)
│   ├── routes/
│   │   └── api.php           # Rutas esqueleto (comentadas hasta que el compañero implemente)
│   ├── composer.json
│   └── .env.example          # Copia y renombra a .env (poner tu contraseña de Postgres)
│
└── frontend-nextjs/          # Frontend Next.js 14 + TypeScript
    ├── src/app/
    │   ├── globals.css        # Sistema de design (tokens, cards, badges, botones, layout)
    │   ├── layout.tsx         # Layout con sidebar y topbar institucional
    │   ├── page.tsx           # Dashboard principal (~60% listo)
    │   ├── estudiantes/       # Página en construcción
    │   ├── docentes/          # Página en construcción
    │   ├── paralelos/         # Página en construcción
    │   ├── inscripciones/     # Página en construcción
    │   ├── calificaciones/    # Página en construcción
    │   ├── cajas/             # Página en construcción
    │   └── almacen/           # Página en construcción
    ├── package.json
    ├── tsconfig.json
    ├── next.config.mjs
    └── .env.example
```

---

## Cómo arrancar el frontend

```bash
cd frontend-nextjs

# 1. Instalar dependencias
npm install

# 2. Copiar variables de entorno
cp .env.example .env.local

# 3. Arrancar en modo desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

---

## Cómo arrancar el backend Laravel (cuando el compañero lo tenga listo)

```bash
cd backend-laravel

# 1. Instalar dependencias PHP
composer install

# 2. Configurar entorno
cp .env.example .env
php artisan key:generate

# 3. Arrancar servidor
php artisan serve
```

La API estará en [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health)
