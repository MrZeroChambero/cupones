<?php

namespace MkZero\Servidor\Modelos\Cupon;

class Cupon
{
  use CuponTrait;

  public function __construct(
    public int $id,
    public string $marca,
    public string $descripcion,
    public string $codigo,
    public int $categoriaId,
    public string $categoria,
    public string $expira,
    public string $descuento,
    public string $enlace,
    public string $logo
  ) {}
}
