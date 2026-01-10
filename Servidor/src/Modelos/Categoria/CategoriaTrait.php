<?php

namespace MkZero\Servidor\Modelos\Categoria;

trait CategoriaTrait
{
  public static function desdeRegistro(array $registro): Categoria
  {
    return new Categoria(
      (int) ($registro['id'] ?? 0),
      $registro['nombre'] ?? '',
      $registro['descripcion'] ?? '',
      $registro['slug'] ?? ''
    );
  }

  public function aArreglo(): array
  {
    return [
      'id' => $this->id,
      'nombre' => $this->nombre,
      'descripcion' => $this->descripcion,
      'slug' => $this->slug,
    ];
  }
}
