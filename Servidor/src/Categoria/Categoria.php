<?php

namespace MkZero\Servidor\Categoria;

use MkZero\Servidor\Conexion\Conexion;
use MkZero\Servidor\Respuesta\RespuestaJson;
use Throwable;

class Categoria
{
  private array $atributos = [
    'id' => 0,
    'nombre' => '',
    'descripcion' => '',
    'slug' => '',
  ];

  public function __construct(private Conexion $conexion) {}

  public function listar(): void
  {
    try {
      $sql = 'SELECT id, nombre, descripcion, slug FROM categorias ORDER BY nombre ASC';
      $registros = $this->conexion->consultar($sql);
      $categorias = array_map([$this, 'formatear'], $registros);
      RespuestaJson::exito(['categorias' => $categorias], 'Categorías disponibles.');
    } catch (Throwable $e) {
      RespuestaJson::error('No se pudieron listar las categorías.', 500, null, $e->getMessage());
    }
  }

  private function formatear(array $registro): array
  {
    return [
      'id' => (int) ($registro['id'] ?? $this->atributos['id']),
      'nombre' => (string) ($registro['nombre'] ?? $this->atributos['nombre']),
      'descripcion' => (string) ($registro['descripcion'] ?? $this->atributos['descripcion']),
      'slug' => (string) ($registro['slug'] ?? $this->atributos['slug']),
    ];
  }
}
