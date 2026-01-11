<?php

namespace MkZero\Servidor\Modelos\Cupon;

trait CuponTrait
{
  /**
   * Convierte un registro de base de datos en una instancia inmutable.
   */
  public static function desdeRegistro(array $registro): Cupon
  {
    return new Cupon(
      (int) ($registro['id'] ?? 0),
      $registro['marca'] ?? '',
      $registro['descripcion'] ?? '',
      $registro['codigo'] ?? '',
      (int) ($registro['categoria_id'] ?? 0),
      $registro['categoria'] ?? $registro['categoria_nombre'] ?? '',
      $registro['expira'] ?? '',
      $registro['descuento'] ?? '',
      $registro['enlace'] ?? '',
      $registro['logo'] ?? ''
    );
  }

  /**
   * Expone el cupón como arreglo listo para serializarse.
   */
  public function aArreglo(): array
  {
    return [
      'id' => $this->id,
      'marca' => $this->marca,
      'descripcion' => $this->descripcion,
      'codigo' => $this->codigo,
      'categoria_id' => $this->categoriaId,
      'categoria' => $this->categoria,
      'expira' => $this->expira,
      'descuento' => $this->descuento,
      'enlace' => $this->enlace,
      'logo' => $this->logo,
    ];
  }
}
