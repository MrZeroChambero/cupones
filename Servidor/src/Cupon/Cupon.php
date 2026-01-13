<?php

namespace MkZero\Servidor\Cupon;

use DateTimeImmutable;
use MkZero\Servidor\Conexion\Conexion;
use MkZero\Servidor\Respuesta\RespuestaJson;
use Throwable;

class Cupon
{
  private array $atributos = [
    'id' => 0,
    'marca' => '',
    'descripcion' => '',
    'codigo' => '',
    'categoria_id' => 0,
    'categoria' => '',
    'expira' => '',
    'descuento' => '',
    'enlace' => '',
    'logo' => '',
  ];

  public function __construct(private Conexion $conexion) {}

  public function listar(): void
  {
    try {
      $sql = <<<SQL
SELECT c.id, c.marca, c.descripcion, c.codigo, c.categoria_id, c.expira, c.descuento,
       c.enlace, c.logo, COALESCE(cat.nombre, '') AS categoria
FROM cupones c
LEFT JOIN categorias cat ON cat.id = c.categoria_id
ORDER BY c.created_at DESC, c.id DESC
SQL;
      $registros = $this->conexion->consultar($sql);
      $cupones = array_map([$this, 'formatear'], $registros);
      RespuestaJson::exito(['cupones' => $cupones], 'Cupones encontrados.');
    } catch (Throwable $e) {
      RespuestaJson::error('No se pudieron listar los cupones.', 500, null, $e->getMessage());
    }
  }

  public function crear(): void
  {
    [$payload, $errorPayload] = $this->obtenerDatosEntrada();
    if ($errorPayload !== null) {
      RespuestaJson::error('Entrada inválida.', 400, ['general' => $errorPayload]);
      return;
    }

    [$datos, $errores] = $this->validarDatos($payload);
    if (!empty($errores)) {
      RespuestaJson::error('Revisa los campos enviados.', 422, $errores);
      return;
    }

    try {
      $sql = 'INSERT INTO cupones (marca, descripcion, codigo, categoria_id, expira, descuento, enlace, logo)
              VALUES (:marca, :descripcion, :codigo, :categoria_id, :expira, :descuento, :enlace, :logo)';
      $nuevoId = $this->conexion->insertar($sql, [
        ':marca' => $datos['marca'],
        ':descripcion' => $datos['descripcion'],
        ':codigo' => $datos['codigo'],
        ':categoria_id' => $datos['categoria_id'],
        ':expira' => $datos['expira'],
        ':descuento' => $datos['descuento'],
        ':enlace' => $datos['enlace'],
        ':logo' => $datos['logo'] ?? '',
      ]);
      $cupon = $this->buscarPorId($nuevoId);
      RespuestaJson::exito(['cupon' => $cupon], 'Cupón creado.', 201);
    } catch (Throwable $e) {
      RespuestaJson::error('No se pudo crear el cupón.', 500, null, $e->getMessage());
    }
  }

  private function formatear(array $registro): array
  {
    return [
      'id' => (int) ($registro['id'] ?? $this->atributos['id']),
      'marca' => (string) ($registro['marca'] ?? $this->atributos['marca']),
      'descripcion' => (string) ($registro['descripcion'] ?? $this->atributos['descripcion']),
      'codigo' => (string) ($registro['codigo'] ?? $this->atributos['codigo']),
      'categoria_id' => (int) ($registro['categoria_id'] ?? $this->atributos['categoria_id']),
      'categoria' => (string) ($registro['categoria'] ?? $this->atributos['categoria']),
      'expira' => (string) ($registro['expira'] ?? $this->atributos['expira']),
      'descuento' => (string) ($registro['descuento'] ?? $this->atributos['descuento']),
      'enlace' => (string) ($registro['enlace'] ?? $this->atributos['enlace']),
      'logo' => (string) ($registro['logo'] ?? $this->atributos['logo']),
    ];
  }

  private function buscarPorId(int $id): array
  {
    $sql = <<<SQL
    SELECT c.id, c.marca, c.descripcion, c.codigo, c.categoria_id, c.expira, c.descuento,
           c.enlace, c.logo, COALESCE(cat.nombre, '') AS categoria
    FROM cupones c
    LEFT JOIN categorias cat ON cat.id = c.categoria_id
    WHERE c.id = :id
    LIMIT 1
    SQL;
    $registro = $this->conexion->consultarUna($sql, [':id' => $id]);
    return $this->formatear($registro);
  }

  private function obtenerDatosEntrada(): array
  {
    $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
    if (is_string($contentType) && str_contains($contentType, 'multipart/form-data')) {
      $payload = $_POST;
      if (!empty($_FILES['logo']) && is_array($_FILES['logo'])) {
        $payload['logo_archivo'] = $_FILES['logo'];
      }
      return [$payload, null];
    }

    $crudo = file_get_contents('php://input') ?: '[]';
    $decodificado = json_decode($crudo, true);
    if (!is_array($decodificado)) {
      return [[], 'JSON inválido en la petición.'];
    }

    return [$decodificado, null];
  }

  private function validarDatos(array $payload): array
  {
    $datos = [
      'marca' => trim((string) ($payload['marca'] ?? '')),
      'descripcion' => trim((string) ($payload['descripcion'] ?? '')),
      'codigo' => strtoupper(trim((string) ($payload['codigo'] ?? ''))),
      'categoria_id' => (int) ($payload['categoria_id'] ?? 0),
      'expira' => trim((string) ($payload['expira'] ?? '')),
      'descuento' => trim((string) ($payload['descuento'] ?? '')),
      'enlace' => trim((string) ($payload['enlace'] ?? '')),
      'logo' => '',
      'logo_archivo' => $payload['logo_archivo'] ?? null,
    ];

    $errores = [];

    if ($datos['marca'] === '' || mb_strlen($datos['marca']) < 3) {
      $errores['marca'] = 'La marca es obligatoria (mínimo 3 caracteres).';
    }

    if ($datos['descripcion'] === '' || mb_strlen($datos['descripcion']) < 10) {
      $errores['descripcion'] = 'La descripción debe tener al menos 10 caracteres.';
    }

    if ($datos['codigo'] === '') {
      $errores['codigo'] = 'El código es obligatorio.';
    }

    if ($datos['categoria_id'] <= 0) {
      $errores['categoria_id'] = 'Selecciona una categoría válida.';
    }

    if ($datos['expira'] === '') {
      $errores['expira'] = 'Define la fecha de expiración.';
    } else {
      $fecha = DateTimeImmutable::createFromFormat('Y-m-d', $datos['expira']);
      if (!$fecha || $fecha->format('Y-m-d') !== $datos['expira']) {
        $errores['expira'] = 'La fecha debe seguir el formato YYYY-MM-DD.';
      }
    }

    if ($datos['descuento'] === '') {
      $errores['descuento'] = 'Indica el descuento que aplica.';
    }

    [$enlaceNormalizado, $errorEnlace] = $this->normalizarEnlace($datos['enlace'], true);
    if ($errorEnlace !== null) {
      $errores['enlace'] = $errorEnlace;
    } else {
      $datos['enlace'] = $enlaceNormalizado;
    }

    if (!empty($datos['logo_archivo']) && is_array($datos['logo_archivo'])) {
      [$logoSubido, $errorLogo] = $this->guardarLogo($datos['logo_archivo']);
      if ($errorLogo !== null) {
        $errores['logo'] = $errorLogo;
      } else {
        $datos['logo'] = $logoSubido;
      }
    }

    unset($datos['logo_archivo']);

    return [$datos, $errores];
  }

  private function normalizarEnlace(string $url, bool $obligatorio = false): array
  {
    $url = trim($url);
    if ($url === '') {
      return $obligatorio ? ['', 'El enlace es obligatorio.'] : ['', null];
    }

    if (!preg_match('#^https?://#i', $url)) {
      return ['', 'El enlace debe iniciar con http:// o https://'];
    }

    return [$url, null];
  }

  private function guardarLogo(array $archivo): array
  {
    $error = $archivo['error'] ?? UPLOAD_ERR_NO_FILE;
    if ($error !== UPLOAD_ERR_OK) {
      return ['', 'No se pudo recibir el archivo proporcionado.'];
    }

    $peso = (int) ($archivo['size'] ?? 0);
    if ($peso <= 0) {
      return ['', 'El archivo de logo está vacío.'];
    }

    $limite = 2 * 1024 * 1024;
    if ($peso > $limite) {
      return ['', 'El logo no puede superar los 2 MB.'];
    }

    $tmp = $archivo['tmp_name'] ?? '';
    if ($tmp === '' || !is_uploaded_file($tmp)) {
      return ['', 'El archivo temporal no es válido.'];
    }

    $mime = mime_content_type($tmp) ?: '';
    $permitidos = [
      'image/png' => 'png',
      'image/jpeg' => 'jpg',
      'image/webp' => 'webp',
      'image/gif' => 'gif',
      'image/svg+xml' => 'svg',
    ];

    if (!isset($permitidos[$mime])) {
      return ['', 'Formato de logo no permitido.'];
    }

    $nombre = 'logo_' . str_replace('.', '', uniqid('', true)) . '.' . $permitidos[$mime];
    $destino = __DIR__ . '/../../uploads/logos/' . $nombre;
    if (!is_dir(dirname($destino))) {
      mkdir(dirname($destino), 0775, true);
    }

    if (!move_uploaded_file($tmp, $destino)) {
      return ['', 'No se pudo guardar el logo.'];
    }

    $publicPath = ($_ENV['BASE_URL_LOGOS'] ?? getenv('BASE_URL_LOGOS'))
      ?: ($_ENV['BASE_URL'] ?? getenv('BASE_URL') ?? '');
    if ($publicPath !== '') {
      $publicPath = rtrim($publicPath, '/');
      return [$publicPath . '/uploads/logos/' . $nombre, null];
    }

    return ['/uploads/logos/' . $nombre, null];
  }
}
