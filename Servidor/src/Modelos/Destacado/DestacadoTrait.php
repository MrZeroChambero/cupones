<?php

namespace MkZero\Servidor\Modelos\Destacado;

trait DestacadoTrait
{
  public static function desdeRegistro(array $registro): Destacado
  {
    return new Destacado(
      (int) ($registro['id'] ?? 0),
      $registro['titulo'] ?? '',
      $registro['marca'] ?? '',
      $registro['copy'] ?? '',
      $registro['codigo'] ?? '',
      $registro['descuento'] ?? '',
      $registro['expira'] ?? '',
      $registro['enlace'] ?? null,
      (int) ($registro['cupon_id'] ?? 0)
    );
  }

  public function aArreglo(): array
  {
    return [
      'id' => $this->id,
      'titulo' => $this->titulo,
      'marca' => $this->marca,
      'copy' => $this->copy,
      'codigo' => $this->codigo,
      'descuento' => $this->descuento,
      'expira' => $this->expira,
      'enlace' => $this->enlace,
      'cuponId' => $this->cuponId,
    ];
  }
}
