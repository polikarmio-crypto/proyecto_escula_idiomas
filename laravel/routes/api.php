<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - Escuela de Idiomas del Ejército (EIE)
|--------------------------------------------------------------------------
|
| Todas las rutas del backend REST van aquí. El compañero debe implementar
| los Controllers correspondientes.
|
*/

Route::prefix('v1')->group(function () {

    // HEALTHCHECK
    Route::get('/health', function () {
        return response()->json([
            'status'   => 'online',
            'servicio' => 'Escuela de Idiomas del Ejército - Core API (Laravel 12)',
        ]);
    });

    // MÓDULO: ESTUDIANTES - TODO: EstudianteController
    // Route::get('/estudiantes', [EstudianteController::class, 'index']);
    // Route::post('/estudiantes', [EstudianteController::class, 'store']);
    // Route::get('/estudiantes/{id}', [EstudianteController::class, 'show']);

    // MÓDULO: DOCENTES Y ROTACIÓN 15 DÍAS - TODO: DocenteController
    // Route::get('/docentes', [DocenteController::class, 'index']);
    // Route::get('/docentes/alertas/rotacion', [DocenteController::class, 'alertarRotaciones']);
    // Route::post('/docentes/rotar', [DocenteController::class, 'rotarDocente']);

    // MÓDULO: PARALELOS - TODO: ParaleloController
    // Route::get('/paralelos', [ParaleloController::class, 'index']);
    // Route::get('/paralelos/{id}', [ParaleloController::class, 'show']);

    // MÓDULO: INSCRIPCIONES - TODO: InscripcionController
    // Route::get('/inscripciones', [InscripcionController::class, 'index']);
    // Route::post('/inscripciones', [InscripcionController::class, 'inscribir']);

    // MÓDULO: CALIFICACIONES - TODO: CalificacionController
    // Route::post('/calificaciones/libro', [CalificacionController::class, 'registrarNotaLibro']);
    // Route::post('/calificaciones/examen-nivel', [CalificacionController::class, 'registrarExamenNivel']);

    // MÓDULO: CAJAS Y PAGOS - TODO: CajaPagoController
    // Route::get('/cajas', [CajaPagoController::class, 'listarCajas']);
    // Route::post('/cajas/ficha', [CajaPagoController::class, 'emitirFicha']);
    // Route::post('/cajas/pago', [CajaPagoController::class, 'registrarPago']);

    // MÓDULO: ALMACÉN - TODO: AlmacenController
    // Route::get('/almacen/stock', [AlmacenController::class, 'stock']);
    // Route::post('/almacen/movimiento', [AlmacenController::class, 'registrarMovimiento']);
});
