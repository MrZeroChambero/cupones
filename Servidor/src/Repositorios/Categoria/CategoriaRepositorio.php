<?php

namespace MkZero\Servidor\Repositorios\Categoria;

use MkZero\Servidor\Core\Conexion\Conexion;
use PDOException;
use RuntimeException;

class CategoriaRepositorio
{
  use CategoriaRepositorioTrait;

  public function __construct(private Conexion $conexion) {}

  public function todas(): array
  {
    try {
      $pdo = $this->conexion->obtenerPdo();
      $stmt = $pdo->query('SELECT * FROM categorias ORDER BY nombre ASC');
      return $this->mapearCategorias($stmt->fetchAll());
    } catch (PDOException $e) {
      throw new RuntimeException('No se pudieron listar las categorías: ' . $e->getMessage(), 0, $e);
    }
  }
}
