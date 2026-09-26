<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'proyecto' => 'Sistema de Gestión Académica - Escuela de Idiomas del Ejército',
        'version' => '1.0.0',
        'documentacion' => '/api/v1/health'
    ]);
});
