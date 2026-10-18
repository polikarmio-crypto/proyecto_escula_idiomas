<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Programa;
use App\Models\Nivel;
use App\Models\Libro;

class EstructuraAcademicaController extends Controller
{
    /**
     * Lista todos los programas con sus niveles y libros asociados
     */
    public function index()
    {
        $programas = Programa::with(['idioma', 'tipoPrograma', 'niveles.libros'])->get();
        return response()->json($programas);
    }

    public function showPrograma($id)
    {
        $programa = Programa::with(['idioma', 'tipoPrograma', 'niveles.libros'])->findOrFail($id);
        return response()->json($programa);
    }

    public function storePrograma(Request $request)
    {
        $validated = $request->validate([
            'id_idioma' => 'required|exists:idioma,id_idioma',
            'id_tipo_programa' => 'required|exists:tipo_programa,id_tipo_programa',
            'nombre_programa' => 'required|string|max:80',
            'duracion_anios_programa' => 'nullable|integer|min:1|max:5',
        ]);

        $programa = Programa::create($validated);
        return response()->json(['message' => 'Programa creado con éxito', 'data' => $programa], 201);
    }

    public function storeNivel(Request $request)
    {
        $validated = $request->validate([
            'id_programa' => 'required|exists:programa,id_programa',
            'numero_nivel' => 'required|integer|min:1',
            'nombre_nivel' => 'required|string|max:50',
            'cantidad_libros_nivel' => 'nullable|integer|min:1',
        ]);

        $nivel = Nivel::create($validated);
        return response()->json(['message' => 'Nivel creado con éxito', 'data' => $nivel], 201);
    }

    public function storeLibro(Request $request)
    {
        $validated = $request->validate([
            'id_nivel' => 'required|exists:nivel,id_nivel',
            'numero_libro' => 'required|integer|min:1',
            'nombre_libro' => 'required|string|max:80',
        ]);

        $libro = Libro::create($validated);
        return response()->json(['message' => 'Libro curricular registrado con éxito', 'data' => $libro], 201);
    }
}
