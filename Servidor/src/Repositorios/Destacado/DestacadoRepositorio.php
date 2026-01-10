<?php

namespace MkZero\Servidor\Repositorios\Destacado;

use MkZero\Servidor\Core\Conexion\Conexion;
use PDOException;
use RuntimeException;

class DestacadoRepositorio
{
  use DestacadoRepositorioTrait;

  public function __construct(private Conexion $conexion) {}

  public function todos(): array
  {
    try {
      $pdo = $this->conexion->obtenerPdo();
      $sql = 'SELECT d.*, c.marca, COALESCE(d.enlace, c.enlace) AS enlace
                    FROM destacados d
                    LEFT JOIN cupones c ON c.id = d.cupon_id
                    ORDER BY d.expira ASC';
      $stmt = $pdo->query($sql);
      return $this->mapearDestacados($stmt->fetchAll());
    } catch (PDOException $e) {
      throw new RuntimeException('No se pudieron obtener los destacados: ' . $e->getMessage(), 0, $e);
    }
  }
}
