<?php

namespace MkZero\Servidor\Promocion;

use InvalidArgumentException;
use MkZero\Servidor\Conexion\Conexion;
use MkZero\Servidor\Respuesta\RespuestaJson;
use Throwable;
use Valitron\Validator;

class Promocion
{
  private $conexion;

  // Lista de atributos para formateo
  private const ATRIBUTOS_FORMATEO = [
    'id' => ['tipo' => 'int', 'default' => 0],
    'marca' => ['tipo' => 'string', 'default' => ''],
    'nombre' => ['tipo' => 'string', 'default' => ''],
    'cupones' => ['tipo' => 'int', 'default' => 0],
    'estado' => ['tipo' => 'string', 'default' => 'disponible'],
    'rating' => ['tipo' => 'float', 'default' => 0.0],
    'detalles' => ['tipo' => 'string', 'default' => ''],
    'img' => ['tipo' => 'string', 'default' => ''],
    'banner' => ['tipo' => 'string', 'default' => ''],
    'coupon_code' => ['tipo' => 'string', 'default' => ''],
    'fecha_creacion' => ['tipo' => 'string', 'default' => ''],
  ];

  // Mapeo de nombres de campos de la BD
  private const MAPEO_CAMPOS = [
    'id_Promocion' => 'id',
    'fecha_creacion' => 'fecha_creacion'
  ];

  public function __construct(Conexion $conexion)
  {
    $this->conexion = $conexion;
  }

  public function listar(): void
  {
    try {
      $columnasBD = $this->obtenerColumnasTabla('promociones');
      $deseadas = ['id_Promocion', 'marca', 'nombre', 'cupones', 'estado', 'rating', 'detalles', 'img', 'banner', 'coupon_code', 'fecha_creacion'];
      $seleccion = array_values(array_intersect($deseadas, $columnasBD));
      if (empty($seleccion)) {
        throw new \RuntimeException('No hay columnas disponibles para seleccionar en promociones.');
      }

      $sql = 'SELECT ' . implode(', ', $seleccion) . ' FROM promociones ORDER BY fecha_creacion DESC, id_Promocion DESC';

      $registros = $this->conexion->consultar($sql);
      $promociones = array_map([$this, 'formatearDatos'], $registros);

      RespuestaJson::exito(['promociones' => $promociones], 'Promociones disponibles.');
    } catch (Throwable $e) {
      RespuestaJson::error('No se pudieron listar las promociones.', 500, null, $e->getMessage());
    }
  }

  public function crear(): void
  {
    try {
      $datos = $this->sanitizarDatos($_POST ?? []);
      $this->validarDatos($datos);
      // Construir INSERT dinámico según columnas disponibles
      $columnasBD = $this->obtenerColumnasTabla('promociones');
      $posibles = ['marca', 'nombre', 'cupones', 'estado', 'rating', 'detalles', 'img', 'banner', 'coupon_code', 'fecha_creacion'];
      $campos = array_values(array_intersect($posibles, $columnasBD));

      if (empty($campos)) {
        throw new \RuntimeException('No hay columnas disponibles para insertar en promociones.');
      }

      $insertCols = [];
      $placeholders = [];
      $params = [];
      foreach ($campos as $col) {
        if ($col === 'fecha_creacion') {
          $insertCols[] = $col;
          $placeholders[] = 'NOW()';
          continue;
        }
        $insertCols[] = $col;
        $placeholders[] = ':' . $col;
        $params[':' . $col] = $datos[$col] ?? '';
      }

      $sql = 'INSERT INTO promociones (' . implode(', ', $insertCols) . ') VALUES (' . implode(', ', $placeholders) . ')';
      $id = $this->conexion->insertar($sql, $params);
      $columnasBD = $this->obtenerColumnasTabla('promociones');
      $seleccion = array_values(array_intersect(['id_Promocion', 'marca', 'nombre', 'cupones', 'estado', 'rating', 'detalles', 'img', 'banner', 'coupon_code', 'fecha_creacion'], $columnasBD));
      $sqlSelect = 'SELECT ' . implode(', ', $seleccion) . ' FROM promociones WHERE id_Promocion = :id';
      $registro = $this->conexion->consultarUna($sqlSelect, [':id' => $id]);

      $promocion = $this->formatearDatos($registro ?: [
        ...$datos,
        'id_Promocion' => $id,
        'coupon_code' => '',
        'fecha_creacion' => date('Y-m-d H:i:s'),
      ]);

      RespuestaJson::exito(['promocion' => $promocion], 'Promoción creada correctamente.', 201);
    } catch (InvalidArgumentException $e) {
      RespuestaJson::error($e->getMessage(), 422);
    } catch (Throwable $e) {
      RespuestaJson::error('No se pudo crear la promoción.', 500, null, $e->getMessage());
    }
  }

  /**
   * Método único para formatear datos de promoción
   * @param array $datos Datos de entrada
   * @return array Datos formateados
   */
  public function formatearDatos(array $datos): array
  {
    $formateados = [];

    foreach (self::ATRIBUTOS_FORMATEO as $campo => $config) {
      // Buscar el valor en diferentes nombres posibles
      $valor = $this->obtenerValorCampo($datos, $campo, $config['default']);

      // Aplicar tipo de dato
      $formateados[$campo] = $this->aplicarTipo($valor, $config['tipo']);
    }

    return $formateados;
  }

  /**
   * Busca el valor de un campo en diferentes nombres posibles
   */
  private function obtenerValorCampo(array $datos, string $campoDestino, $default)
  {
    // Primero buscar por nombre directo
    if (\array_key_exists($campoDestino, $datos)) {
      return $datos[$campoDestino];
    }

    // Buscar en el mapeo de campos de BD
    foreach (self::MAPEO_CAMPOS as $campoBD => $campoFormateado) {
      if ($campoFormateado === $campoDestino && \array_key_exists($campoBD, $datos)) {
        return $datos[$campoBD];
      }
    }

    return $default;
  }

  /**
   * Aplica el tipo de dato especificado
   */
  private function aplicarTipo($valor, string $tipo)
  {
    return match ($tipo) {
      'int' => (int) $valor,
      'float' => round((float) $valor, 1),
      'string' => (string) $valor,
      default => $valor,
    };
  }

  /**
   * Devuelve las columnas existentes de una tabla (names of fields)
   * @param string $tabla
   * @return array
   */
  private function obtenerColumnasTabla(string $tabla): array
  {
    try {
      $filas = $this->conexion->consultar("SHOW COLUMNS FROM {$tabla}");
      if (!is_array($filas)) {
        return [];
      }
      $cols = [];
      foreach ($filas as $f) {
        if (is_array($f) && isset($f['Field'])) {
          $cols[] = $f['Field'];
        } elseif (is_object($f) && isset($f->Field)) {
          $cols[] = $f->Field;
        }
      }
      return $cols;
    } catch (Throwable $e) {
      return [];
    }
  }

  private function sanitizarDatos(array $input): array
  {
    return [
      'marca' => trim((string)($input['marca'] ?? '')),
      'nombre' => trim((string)($input['nombre'] ?? '')),
      'detalles' => trim((string)($input['detalles'] ?? '')),
      'cupones' => (string)($input['cupones'] ?? ''),
      'estado' => trim((string)($input['estado'] ?? 'disponible')),
      'rating' => (string)($input['rating'] ?? ''),
      'img' => trim((string)($input['img'] ?? '')),
      'banner' => trim((string)($input['banner'] ?? '')),
      'coupon_code' => trim((string)($input['coupon_code'] ?? '')), // <--- AGREGAR ESTO
    ];
  }

  private function validarDatos(array &$datos): void
  {
    $v = new Validator($datos);

    // Reglas de validación con Valitron
    $v->rule('required', ['marca', 'nombre', 'detalles', 'img', 'banner'])
      ->message('{field} es obligatorio');

    $v->rule('lengthMax', 'marca', 120)
      ->message('Marca no puede exceder 120 caracteres');

    $v->rule('lengthMax', 'nombre', 150)
      ->message('Nombre no puede exceder 150 caracteres');

    $v->rule('lengthMax', 'detalles', 255)
      ->message('Detalles no puede exceder 255 caracteres');

    $v->rule('lengthMax', 'estado', 60)
      ->message('Estado no puede exceder 60 caracteres');

    $v->rule('integer', 'cupones')
      ->message('Cupones debe ser un número entero');

    $v->rule('min', 'cupones', 1)
      ->message('Cupones debe ser al menos 1');

    $v->rule('max', 'cupones', 9999)
      ->message('Cupones no puede exceder 9999');

    $v->rule('numeric', 'rating')
      ->message('Rating debe ser numérico');

    $v->rule('min', 'rating', 0)
      ->message('Rating debe ser al menos 0');

    $v->rule('max', 'rating', 5)
      ->message('Rating no puede exceder 5');

    // $v->rule('url', 'img')
    //   ->message('Imagen debe ser una URL válida');

    if (!$v->validate()) {
      $errores = [];
      foreach ($v->errors() as $campoErrores) {
        $errores[] = $campoErrores[0];
      }
      throw new InvalidArgumentException(implode(' ', $errores));
    }

    // Convertir tipos después de validar
    $datos['cupones'] = (int) $datos['cupones'];
    $datos['rating'] = round((float) $datos['rating'], 1);
  }
}
