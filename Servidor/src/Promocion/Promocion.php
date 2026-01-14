<?php

namespace MkZero\Servidor\Promocion;

use InvalidArgumentException;
use MkZero\Servidor\Conexion\Conexion;
use MkZero\Servidor\Respuesta\RespuestaJson;
use Throwable;

class Promocion
{
  private const MIMES_IMAGENES = [
    'image/jpeg' => 'jpg',
    'image/png' => 'png',
    'image/webp' => 'webp',
    'image/gif' => 'gif',
  ];

  private const MIMES_ICONOS = [
    'image/png' => 'png',
    'image/svg+xml' => 'svg',
    'image/x-icon' => 'ico',
    'image/vnd.microsoft.icon' => 'ico',
  ];

  private const TAMANIO_MAX_ARCHIVO = 5_000_000; // 5MB

  private array $atributos = [
    'id' => 0,
    'marca' => '',
    'nombre' => '',
    'cupones' => 0,
    'estado' => 'disponible',
    'rating' => 0.0,
    'detalles' => '',
    'img' => '',
    'icono' => '',
    'fecha_creacion' => '',
  ];

  private string $directorioImagenes;
  private string $directorioIconos;

  public function __construct(private Conexion $conexion)
  {
    $baseCliente = dirname(__DIR__, 2) . '/../Cliente/public';
    $baseNormalizada = realpath($baseCliente) ?: $baseCliente;
    $this->directorioImagenes = defined('CLIENTE_PUBLIC_IMG_DIR')
      ? CLIENTE_PUBLIC_IMG_DIR
      : $baseNormalizada . '/img';
    $this->directorioIconos = defined('CLIENTE_PUBLIC_ICON_DIR')
      ? CLIENTE_PUBLIC_ICON_DIR
      : $baseNormalizada . '/icons';

    $this->asegurarDirectorio($this->directorioImagenes);
    $this->asegurarDirectorio($this->directorioIconos);
  }

  public function listar(): void
  {
    try {
      $sql = 'SELECT id_Promocion, marca, nombre, cupones, estado, rating, detalles, img, icono, fecha_creacion
              FROM promociones
              ORDER BY fecha_creacion DESC, id_Promocion DESC';
      $registros = $this->conexion->consultar($sql);
      $promociones = array_map([$this, 'formatear'], $registros);
      RespuestaJson::exito(['promociones' => $promociones], 'Promociones disponibles.');
    } catch (Throwable $e) {
      RespuestaJson::error('No se pudieron listar las promociones.', 500, null, $e->getMessage());
    }
  }

  public function crear(): void
  {
    $imagenGuardada = null;
    $iconoGuardado = null;

    try {
      $datos = $this->sanitizarDatos($_POST ?? []);
      $this->validarDatos($datos);

      $imagenGuardada = $this->procesarArchivo(
        'imagen',
        self::MIMES_IMAGENES,
        $this->directorioImagenes,
        '/img/'
      );

      $iconoGuardado = $this->procesarArchivo(
        'icono',
        self::MIMES_ICONOS,
        $this->directorioIconos,
        '/icons/'
      );

      $sql = 'INSERT INTO promociones (marca, nombre, cupones, estado, rating, detalles, img, icono)
              VALUES (:marca, :nombre, :cupones, :estado, :rating, :detalles, :img, :icono)';

      $id = $this->conexion->insertar($sql, [
        ':marca' => $datos['marca'],
        ':nombre' => $datos['nombre'],
        ':cupones' => $datos['cupones'],
        ':estado' => $datos['estado'],
        ':rating' => $datos['rating'],
        ':detalles' => $datos['detalles'],
        ':img' => $imagenGuardada['relativa'],
        ':icono' => $iconoGuardado['relativa'],
      ]);

      $registro = $this->conexion->consultarUna(
        'SELECT id_Promocion, marca, nombre, cupones, estado, rating, detalles, img, icono, fecha_creacion FROM promociones WHERE id_Promocion = :id',
        [':id' => $id]
      );

      $promocion = $this->formatear($registro ?: array_merge($datos, [
        'id_Promocion' => $id,
        'img' => $imagenGuardada['relativa'],
        'icono' => $iconoGuardado['relativa'],
        'fecha_creacion' => date('Y-m-d H:i:s'),
      ]));

      RespuestaJson::exito(['promocion' => $promocion], 'Promoción creada correctamente.', 201);
    } catch (InvalidArgumentException $e) {
      if ($imagenGuardada) {
        $this->eliminarArchivo($imagenGuardada['absoluta']);
      }
      if ($iconoGuardado) {
        $this->eliminarArchivo($iconoGuardado['absoluta']);
      }
      RespuestaJson::error($e->getMessage(), 422);
    } catch (Throwable $e) {
      if ($imagenGuardada) {
        $this->eliminarArchivo($imagenGuardada['absoluta']);
      }
      if ($iconoGuardado) {
        $this->eliminarArchivo($iconoGuardado['absoluta']);
      }
      RespuestaJson::error('No se pudo crear la promoción.', 500, null, $e->getMessage());
    }
  }

  private function formatear(array $registro): array
  {
    return [
      'id' => (int) ($registro['id_Promocion'] ?? $registro['id'] ?? $this->atributos['id']),
      'marca' => (string) ($registro['marca'] ?? $this->atributos['marca']),
      'nombre' => (string) ($registro['nombre'] ?? $this->atributos['nombre']),
      'cupones' => (int) ($registro['cupones'] ?? $this->atributos['cupones']),
      'estado' => (string) ($registro['estado'] ?? $this->atributos['estado']),
      'rating' => (float) ($registro['rating'] ?? $this->atributos['rating']),
      'detalles' => (string) ($registro['detalles'] ?? $this->atributos['detalles']),
      'img' => (string) ($registro['img'] ?? $this->atributos['img']),
      'icono' => (string) ($registro['icono'] ?? $this->atributos['icono']),
      'fecha_creacion' => (string) ($registro['fecha_creacion'] ?? $this->atributos['fecha_creacion']),
    ];
  }

  private function sanitizarDatos(array $input): array
  {
    $estado = trim((string)($input['estado'] ?? 'disponible'));
    $estado = $estado === '' ? 'disponible' : mb_substr($estado, 0, 60);

    return [
      'marca' => trim((string)($input['marca'] ?? '')),
      'nombre' => trim((string)($input['nombre'] ?? '')),
      'detalles' => trim((string)($input['detalles'] ?? '')),
      'cupones' => (string)($input['cupones'] ?? ''),
      'estado' => $estado,
      'rating' => (string)($input['rating'] ?? ''),
    ];
  }

  private function validarDatos(array &$datos): void
  {
    $requeridos = ['marca', 'nombre', 'detalles'];
    foreach ($requeridos as $campo) {
      if ($datos[$campo] === '') {
        throw new InvalidArgumentException("El campo {$campo} es obligatorio.");
      }
    }

    $this->validarLongitud($datos['marca'], 120, 'marca');
    $this->validarLongitud($datos['nombre'], 150, 'nombre');
    $this->validarLongitud($datos['detalles'], 255, 'detalles');
    $this->validarLongitud($datos['estado'], 60, 'estado');

    $cupones = filter_var($datos['cupones'], FILTER_VALIDATE_INT, [
      'options' => ['min_range' => 1, 'max_range' => 9999],
    ]);
    if ($cupones === false) {
      throw new InvalidArgumentException('El campo cupones debe ser un número positivo.');
    }

    $rating = filter_var($datos['rating'], FILTER_VALIDATE_FLOAT);
    if ($rating === false) {
      throw new InvalidArgumentException('El campo rating debe ser numérico.');
    }
    if ($rating < 0 || $rating > 5) {
      throw new InvalidArgumentException('El rating debe estar entre 0 y 5.');
    }

    $datos['cupones'] = (int) $cupones;
    $datos['rating'] = round((float) $rating, 1);
  }

  private function validarLongitud(string $valor, int $maximo, string $campo): void
  {
    if (mb_strlen($valor) > $maximo) {
      throw new InvalidArgumentException("El campo {$campo} supera el máximo de {$maximo} caracteres.");
    }
  }

  private function procesarArchivo(string $campo, array $mimesPermitidos, string $directorio, string $prefijo): array
  {
    if (!isset($_FILES[$campo])) {
      throw new InvalidArgumentException("El archivo {$campo} es obligatorio.");
    }

    $archivo = $_FILES[$campo];
    if (!is_array($archivo) || ($archivo['error'] ?? UPLOAD_ERR_OK) !== UPLOAD_ERR_OK) {
      throw new InvalidArgumentException("No se pudo recibir el archivo {$campo}.");
    }

    if (!is_uploaded_file($archivo['tmp_name'])) {
      throw new InvalidArgumentException("El archivo {$campo} no es válido.");
    }

    if (($archivo['size'] ?? 0) > self::TAMANIO_MAX_ARCHIVO) {
      throw new InvalidArgumentException("El archivo {$campo} supera el tamaño permitido de 5MB.");
    }

    $mime = (new \finfo(FILEINFO_MIME_TYPE))->file($archivo['tmp_name']) ?: '';
    if (!isset($mimesPermitidos[$mime])) {
      throw new InvalidArgumentException("El archivo {$campo} no tiene un formato permitido.");
    }

    $extension = $mimesPermitidos[$mime];
    $rutaRelativa = '';
    $rutaAbsoluta = '';
    do {
      $nombreAleatorio = $this->generarNombreAleatorio();
      $nombreArchivo = $nombreAleatorio . '.' . $extension;
      $rutaRelativa = $prefijo . $nombreArchivo;
      $rutaAbsoluta = rtrim($directorio, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $nombreArchivo;
    } while (file_exists($rutaAbsoluta));

    if (!move_uploaded_file($archivo['tmp_name'], $rutaAbsoluta)) {
      throw new InvalidArgumentException("No se pudo guardar el archivo {$campo}.");
    }

    return [
      'relativa' => $rutaRelativa,
      'absoluta' => $rutaAbsoluta,
    ];
  }

  private function generarNombreAleatorio(int $min = 10, int $max = 20): string
  {
    $longitud = random_int($min, $max);
    $caracteres = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    $resultado = '';
    $caracteresMax = strlen($caracteres) - 1;
    for ($i = 0; $i < $longitud; $i++) {
      $resultado .= $caracteres[random_int(0, $caracteresMax)];
    }
    return $resultado;
  }

  private function asegurarDirectorio(string $ruta): void
  {
    if (!is_dir($ruta) && !mkdir($ruta, 0775, true) && !is_dir($ruta)) {
      throw new InvalidArgumentException('No se pudo preparar el directorio para subir archivos.');
    }
  }

  private function eliminarArchivo(?string $ruta): void
  {
    if ($ruta && file_exists($ruta)) {
      @unlink($ruta);
    }
  }
}
