<?php

namespace MkZero\Servidor\Modelos\Categoria;

class Categoria
{
  use CategoriaTrait;

  public function __construct(
    public int $id,
    public string $nombre,
    public string $descripcion,
    public string $slug
  ) {}
}
