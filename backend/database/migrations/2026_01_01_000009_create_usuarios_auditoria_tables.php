<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Módulo 10: Usuarios del Sistema, Roles y Auditoría (5NF Normalization)
     * Gestión de accesos multi-rol para los 6 actores institucionales
     */
    public function up(): void
    {
        // 1.27 USUARIO (Autenticación y control de accesos)
        Schema::create('usuario', function (Blueprint $table) {
            $table->id('id_usuario');
            $table->string('nombre_usuario', 80)->comment('Nombre completo del operador');
            $table->string('email_usuario', 100)->unique()->comment('Correo institucional o personal');
            $table->string('password_usuario', 255)->comment('Hash bcrypt de la contraseña');
            $table->string('rol_usuario', 30)->comment('Admin, JefeAcademico, Docente, Secretaria, Cajero, Almacenero');
            $table->foreignId('id_docente')->nullable()->constrained('docente', 'id_docente')->onDelete('set null')->onUpdate('cascade');
            $table->string('estado_usuario', 15)->default('Activo')->comment('Activo, Inactivo, Bloqueado');
            $table->timestamp('ultimo_acceso_usuario')->nullable();
            $table->timestamps();

            $table->index('rol_usuario', 'idx_usuario_rol');
            $table->index('estado_usuario', 'idx_usuario_estado');
        });

        // 1.28 LOG_AUDITORIA (Registro de acciones sensibles para trazabilidad)
        Schema::create('log_auditoria', function (Blueprint $table) {
            $table->id('id_log');
            $table->foreignId('id_usuario')->nullable()->constrained('usuario', 'id_usuario')->onDelete('set null')->onUpdate('cascade');
            $table->string('accion_log', 50)->comment('CREATE, UPDATE, DELETE, LOGIN, LOGOUT');
            $table->string('tabla_afectada_log', 50)->comment('Nombre de la tabla afectada');
            $table->unsignedBigInteger('registro_id_log')->nullable()->comment('ID del registro modificado');
            $table->json('datos_anteriores_log')->nullable()->comment('Snapshot JSON pre-modificación');
            $table->json('datos_nuevos_log')->nullable()->comment('Snapshot JSON post-modificación');
            $table->string('ip_origen_log', 45)->nullable();
            $table->timestamps();

            $table->index(['tabla_afectada_log', 'accion_log'], 'idx_auditoria_tabla_accion');
            $table->index('id_usuario', 'idx_auditoria_usuario');
            $table->index('created_at', 'idx_auditoria_fecha');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('log_auditoria');
        Schema::dropIfExists('usuario');
    }
};
