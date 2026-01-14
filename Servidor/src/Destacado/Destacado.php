<?php

namespace MkZero\Servidor\Destacado;

use MkZero\Servidor\Conexion\Conexion;
use MkZero\Servidor\Respuesta\RespuestaJson;
use Throwable;

class Destacado
{
  private array $atributos = [
    'id' => 0,
    'titulo' => '',
    'marca' => '',
    'copy' => '',
    'codigo' => '',
    'descuento' => '',
    'expira' => '',
    'enlace' => null,
    'cuponId' => 0,
  ];

  public function __construct(private Conexion $conexion) {}

  public function listar(): void
  {
    try {
      $sql = 'SELECT d.id, d.titulo,
             COALESCE(c.marca, d.titulo) AS marca,
             d.copy, d.codigo,
                     d.descuento, d.expira, COALESCE(d.enlace, c.enlace) AS enlace, d.cupon_id
              FROM destacados d
              LEFT JOIN cupones c ON c.id = d.cupon_id
              ORDER BY d.expira ASC';
      $registros = $this->conexion->consultar($sql);
      $destacados = array_map([$this, 'formatear'], $registros);
      RespuestaJson::exito(['destacados' => $destacados], 'Destacados listos.');
    } catch (Throwable $e) {
      RespuestaJson::error('No se pudieron listar los destacados.', 500, null, $e->getMessage());
    }
  }

  private function formatear(array $registro): array
  {
    return [
      'id' => (int) ($registro['id'] ?? $this->atributos['id']),
      'titulo' => (string) ($registro['titulo'] ?? $this->atributos['titulo']),
      'marca' => (string) ($registro['marca'] ?? $this->atributos['marca']),
      'copy' => (string) ($registro['copy'] ?? $this->atributos['copy']),
      'codigo' => (string) ($registro['codigo'] ?? $this->atributos['codigo']),
      'descuento' => (string) ($registro['descuento'] ?? $this->atributos['descuento']),
      'expira' => (string) ($registro['expira'] ?? $this->atributos['expira']),
      'enlace' => $registro['enlace'] ?? $this->atributos['enlace'],
      'cuponId' => (int) ($registro['cupon_id'] ?? $this->atributos['cuponId']),
    ];
  }
}
