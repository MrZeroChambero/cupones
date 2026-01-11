<?php

namespace MkZero\Servidor\Modelos\Destacado;

class Destacado
{
  use DestacadoTrait;

  public function __construct(
    public int $id,
    public string $titulo,
    public string $marca,
    public string $copy,
    public string $codigo,
    public string $descuento,
    public string $expira,
    public ?string $enlace,
    public int $cuponId
  ) {}
}
