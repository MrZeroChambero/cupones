<?php

namespace MkZero\Servidor\Promocion;

use MkZero\Servidor\Conexion\Conexion;
use MkZero\Servidor\Respuesta\RespuestaJson;
use Throwable;

class Promocion
{
  private array $atributos = [
    'id' => 0,
    'marca' => '',
    'nombre' => '',
    'cupones' => 0,
    'estado' => 'disponible',
    'rating' => 0.0,
    'detalles' => '',
    'img' => '',
    'icono' => '',
    'fecha_creacion' => '',
  ];

  public function __construct(private Conexion $conexion) {}

  public function listar(): void
  {
    try {
      $sql = 'SELECT id_Promocion, marca, nombre, cupones, estado, rating, detalles, img, icono, fecha_creacion
              FROM promociones
              ORDER BY fecha_creacion DESC, id_Promocion DESC';
      $registros = $this->conexion->consultar($sql);
      $promociones = array_map([$this, 'formatear'], $registros);
      RespuestaJson::exito(['promociones' => $promociones], 'Promociones disponibles.');
    } catch (Throwable $e) {
      RespuestaJson::error('No se pudieron listar las promociones.', 500, null, $e->getMessage());
    }
  }

  private function formatear(array $registro): array
  {
    return [
      'id' => (int) ($registro['id_Promocion'] ?? $registro['id'] ?? $this->atributos['id']),
      'marca' => (string) ($registro['marca'] ?? $this->atributos['marca']),
      'nombre' => (string) ($registro['nombre'] ?? $this->atributos['nombre']),
      'cupones' => (int) ($registro['cupones'] ?? $this->atributos['cupones']),
      'estado' => (string) ($registro['estado'] ?? $this->atributos['estado']),
      'rating' => (float) ($registro['rating'] ?? $this->atributos['rating']),
      'detalles' => (string) ($registro['detalles'] ?? $this->atributos['detalles']),
      'img' => (string) ($registro['img'] ?? $this->atributos['img']),
      'icono' => (string) ($registro['icono'] ?? $this->atributos['icono']),
      'fecha_creacion' => (string) ($registro['fecha_creacion'] ?? $this->atributos['fecha_creacion']),
    ];
  }
}
