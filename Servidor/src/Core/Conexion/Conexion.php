<?php

namespace MkZero\Servidor\Core\Conexion;

use PDO;
use PDOException;
use RuntimeException;

class Conexion
{
  use ConexionTrait;

  private array $config;
  private ?PDO $pdo = null;

  public function __construct(array $config)
  {
    $this->config = $config;
  }

  /**
   * Expone la instancia PDO reutilizable.
   */
  public function obtenerPdo(): PDO
  {
    if ($this->pdo instanceof PDO) {
      return $this->pdo;
    }

    try {
      $dsn = $this->construirDsn($this->config);
      $usuario = $this->config['username'] ?? '';
      $password = $this->config['password'] ?? '';
      $this->pdo = new PDO($dsn, $usuario, $password, $this->opcionesPorDefecto());
      return $this->pdo;
    } catch (PDOException $e) {
      throw new RuntimeException('No se pudo conectar a la base de datos: ' . $e->getMessage(), 0, $e);
    }
  }
}
