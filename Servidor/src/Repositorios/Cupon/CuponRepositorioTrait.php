<?php

namespace MkZero\Servidor\Repositorios\Cupon;

use MkZero\Servidor\Modelos\Cupon\Cupon;

trait CuponRepositorioTrait
{
  /**
   * Normaliza el arreglo de resultados hacia instancias de Cupon.
   */
  protected function mapearCupones(array $registros): array
  {
    return array_map(static fn(array $registro) => Cupon::desdeRegistro($registro)->aArreglo(), $registros);
  }
}
