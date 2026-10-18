<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LogAuditoria extends Model
{
    protected $table = 'log_auditoria';
    protected $primaryKey = 'id_log';

    protected $fillable = [
        'id_usuario',
        'accion_log',
        'tabla_afectada_log',
        'registro_id_log',
        'datos_anteriores_log',
        'datos_nuevos_log',
        'ip_origen_log',
    ];

    protected $casts = [
        'datos_anteriores_log' => 'array',
        'datos_nuevos_log'     => 'array',
    ];

    /**
     * Usuario que realizó la acción
     */
    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'id_usuario', 'id_usuario');
    }

    /**
     * Registrar una acción de auditoría
     */
    public static function registrar(
        ?int $idUsuario,
        string $accion,
        string $tabla,
        ?int $registroId = null,
        ?array $datosAnteriores = null,
        ?array $datosNuevos = null,
        ?string $ip = null
    ): self {
        return self::create([
            'id_usuario'           => $idUsuario,
            'accion_log'           => $accion,
            'tabla_afectada_log'   => $tabla,
            'registro_id_log'      => $registroId,
            'datos_anteriores_log' => $datosAnteriores,
            'datos_nuevos_log'     => $datosNuevos,
            'ip_origen_log'        => $ip ?? request()?->ip(),
        ]);
    }
}
