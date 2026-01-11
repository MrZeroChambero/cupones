<?php

namespace MkZero\Servidor\Core\Conexion;

use PDO;

trait ConexionTrait
{
  /**
   * Construye el DSN tomando los parámetros definidos en la configuración.
   */
  protected function construirDsn(array $config): string
  {
    $driver = $config['driver'] ?? 'mysql';
    $host = $config['host'] ?? '127.0.0.1';
    $port = $config['port'] ?? '3306';
    $database = $config['database'] ?? '';
    $charset = $config['charset'] ?? 'utf8mb4';

    return sprintf('%s:host=%s;port=%s;dbname=%s;charset=%s', $driver, $host, $port, $database, $charset);
  }

  /**
   * Devuelve las opciones por defecto recomendadas para PDO.
   */
  protected function opcionesPorDefecto(): array
  {
    return [
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
      PDO::ATTR_EMULATE_PREPARES => false,
    ];
  }
}
