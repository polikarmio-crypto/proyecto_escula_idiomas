<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Gestion;
use App\Models\Idioma;
use App\Models\TipoPrograma;
use App\Models\Modalidad;
use App\Models\Horario;
use App\Models\Aula;
use App\Models\TipoPago;
use App\Models\Caja;

class CatalogoController extends Controller
{
    /**
     * Retorna todos los catálogos base configurados en el sistema
     */
    public function index()
    {
        return response()->json([
            'gestiones' => Gestion::all(),
            'idiomas' => Idioma::all(),
            'tipos_programa' => TipoPrograma::all(),
            'modalidades' => Modalidad::all(),
            'horarios' => Horario::all(),
            'aulas' => Aula::all(),
            'tipos_pago' => TipoPago::all(),
            'cajas' => Caja::all(),
        ]);
    }

    public function gestiones()
    {
        return response()->json(Gestion::orderBy('anio_gestion', 'desc')->get());
    }

    public function idiomas()
    {
        return response()->json(Idioma::all());
    }

    public function aulas()
    {
        return response()->json(Aula::all());
    }

    public function horarios()
    {
        return response()->json(Horario::all());
    }

    public function tiposPago()
    {
        return response()->json(TipoPago::all());
    }

    public function cajas()
    {
        return response()->json(Caja::all());
    }
}
