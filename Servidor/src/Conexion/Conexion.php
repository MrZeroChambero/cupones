<?php

namespace MkZero\Servidor\Conexion;

use MkZero\Servidor\Respuesta\RespuestaJson;
use PDO;
use PDOException;
use PDOStatement;

class Conexion
{
  private PDO $pdo;

  public function __construct(array $configuracion = [])
  {
    $parametros = $this->normalizar($configuracion);
    $driver = $parametros['driver'];
    $dsn = sprintf(
      '%s:host=%s;port=%s;dbname=%s;charset=%s',
      $driver,
      $parametros['host'],
      $parametros['port'],
      $parametros['database'],
      $parametros['charset']
    );

    try {
      $this->pdo = new PDO($dsn, $parametros['username'], $parametros['password'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
      ]);
    } catch (PDOException $e) {
      RespuestaJson::error('Error de conexión a la base de datos.', 500, null, $e->getMessage());
      exit;
    }
  }

  public function obtenerPdo(): PDO
  {
    return $this->pdo;
  }

  public function consultar(string $sql, array $parametros = []): array
  {
    return $this->ejecutarConsulta($sql, $parametros)->fetchAll() ?: [];
  }

  public function consultarUna(string $sql, array $parametros = []): array
  {
    $resultado = $this->ejecutarConsulta($sql, $parametros)->fetch();
    return $resultado === false ? [] : $resultado;
  }

  public function insertar(string $sql, array $parametros = []): int
  {
    $this->ejecutarConsulta($sql, $parametros);
    return (int) $this->pdo->lastInsertId();
  }

  public function ejecutar(string $sql, array $parametros = []): int
  {
    return $this->ejecutarConsulta($sql, $parametros)->rowCount();
  }

  private function ejecutarConsulta(string $sql, array $parametros = []): PDOStatement
  {
    $stmt = $this->pdo->prepare($sql);
    $stmt->execute($parametros);
    return $stmt;
  }

  private function normalizar(array $configuracion): array
  {
    $env = static fn(string $clave, string $alterno = '') => $_ENV[$clave] ?? getenv($clave) ?? $alterno;

    return [
      'driver' => $configuracion['driver'] ?? $env('DB_DRIVER', 'mysql'),
      'host' => $configuracion['host'] ?? $env('DB_HOST', '127.0.0.1'),
      'port' => $configuracion['port'] ?? $env('DB_PORT', '3306'),
      'database' => $configuracion['database']
        ?? $env('DB_NAME')
        ?? $env('DB_DATABASE')
        ?? 'bombcoupons',
      'username' => $configuracion['username']
        ?? $env('DB_USER')
        ?? $env('DB_USERNAME')
        ?? 'root',
      'password' => $configuracion['password'] ?? $env('DB_PASSWORD', ''),
      'charset' => $configuracion['charset'] ?? $env('DB_CHARSET', 'utf8mb4'),
    ];
  }
}
