<?php

namespace MkZero\Servidor\Repositorios\Destacado;

use MkZero\Servidor\Modelos\Destacado\Destacado;

trait DestacadoRepositorioTrait
{
  protected function mapearDestacados(array $registros): array
  {
    return array_map(static fn(array $registro) => Destacado::desdeRegistro($registro)->aArreglo(), $registros);
  }
}
