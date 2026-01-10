<?php

namespace MkZero\Servidor\Repositorios\Cupon;

use MkZero\Servidor\Core\Conexion\Conexion;
use MkZero\Servidor\Modelos\Cupon\Cupon;
use PDOException;
use RuntimeException;

class CuponRepositorio
{
  use CuponRepositorioTrait;

  public function __construct(private Conexion $conexion) {}

  /**
   * Recupera todos los cupones con su categoría asociada.
   */
  public function todos(): array
  {
    try {
      $pdo = $this->conexion->obtenerPdo();
      $sql = 'SELECT c.*, cat.nombre AS categoria, cat.id AS categoria_id
                    FROM cupones c
                    LEFT JOIN categorias cat ON cat.id = c.categoria_id
                    ORDER BY c.created_at DESC, c.id DESC';
      $stmt = $pdo->query($sql);
      $registros = $stmt->fetchAll();
      return $this->mapearCupones($registros);
    } catch (PDOException $e) {
      throw new RuntimeException('No se pudieron obtener los cupones: ' . $e->getMessage(), 0, $e);
    }
  }

  /**
   * Devuelve los cupones más recientes para alimentar la barra lateral.
   */
  public function recientes(int $limite = 4): array
  {
    try {
      $pdo = $this->conexion->obtenerPdo();
      $sql = 'SELECT c.*, cat.nombre AS categoria, cat.id AS categoria_id
                    FROM cupones c
                    LEFT JOIN categorias cat ON cat.id = c.categoria_id
                    ORDER BY c.created_at DESC, c.id DESC
                    LIMIT :limite';
      $stmt = $pdo->prepare($sql);
      $stmt->bindValue(':limite', $limite, \PDO::PARAM_INT);
      $stmt->execute();
      return $this->mapearCupones($stmt->fetchAll());
    } catch (PDOException $e) {
      throw new RuntimeException('No se pudieron obtener los cupones recientes: ' . $e->getMessage(), 0, $e);
    }
  }

  public function crear(array $datos): array
  {
    try {
      $pdo = $this->conexion->obtenerPdo();
      $sql = 'INSERT INTO cupones (marca, descripcion, codigo, categoria_id, expira, descuento, enlace, logo)
              VALUES (:marca, :descripcion, :codigo, :categoria_id, :expira, :descuento, :enlace, :logo)';
      $stmt = $pdo->prepare($sql);
      $stmt->execute([
        ':marca' => $datos['marca'],
        ':descripcion' => $datos['descripcion'],
        ':codigo' => $datos['codigo'],
        ':categoria_id' => $datos['categoria_id'],
        ':expira' => $datos['expira'],
        ':descuento' => $datos['descuento'],
        ':enlace' => $datos['enlace'],
        ':logo' => $datos['logo'] ?? '',
      ]);

      $nuevoId = (int) $pdo->lastInsertId();
      $consulta = 'SELECT c.*, cat.nombre AS categoria
                  FROM cupones c
                  LEFT JOIN categorias cat ON cat.id = c.categoria_id
                  WHERE c.id = :id';
      $stmt = $pdo->prepare($consulta);
      $stmt->bindValue(':id', $nuevoId, \PDO::PARAM_INT);
      $stmt->execute();
      $registro = $stmt->fetch();
      return $registro ? Cupon::desdeRegistro($registro)->aArreglo() : [];
    } catch (PDOException $e) {
      throw new RuntimeException('No se pudo crear el cupón: ' . $e->getMessage(), 0, $e);
    }
  }
}
