<?php

namespace MkZero\Servidor\Repositorios\Categoria;

use MkZero\Servidor\Modelos\Categoria\Categoria;

trait CategoriaRepositorioTrait
{
  protected function mapearCategorias(array $registros): array
  {
    return array_map(static fn(array $registro) => Categoria::desdeRegistro($registro)->aArreglo(), $registros);
  }
}
