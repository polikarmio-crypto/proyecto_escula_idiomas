<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Usuario extends Model
{
    protected $table = 'usuario';
    protected $primaryKey = 'id_usuario';

    protected $fillable = [
        'nombre_usuario',
        'email_usuario',
        'password_usuario',
        'rol_usuario',
        'id_docente',
        'estado_usuario',
        'ultimo_acceso_usuario',
    ];

    protected $hidden = [
        'password_usuario',
    ];

    protected $casts = [
        'ultimo_acceso_usuario' => 'datetime',
    ];

    /**
     * Relación opcional con docente (si el usuario es un docente)
     */
    public function docente()
    {
        return $this->belongsTo(Docente::class, 'id_docente', 'id_docente');
    }

    /**
     * Registros de auditoría generados por este usuario
     */
    public function logsAuditoria()
    {
        return $this->hasMany(LogAuditoria::class, 'id_usuario', 'id_usuario');
    }

    /**
     * Verificar si el usuario tiene un rol específico
     */
    public function tieneRol(string $rol): bool
    {
        return $this->rol_usuario === $rol;
    }

    /**
     * Verificar si el usuario es administrador del sistema
     */
    public function esAdmin(): bool
    {
        return $this->rol_usuario === 'Admin';
    }
}
