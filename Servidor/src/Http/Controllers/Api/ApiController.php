<?php

namespace MkZero\Servidor\Http\Controllers\Api;

use DateTimeImmutable;
use MkZero\Servidor\Repositorios\Categoria\CategoriaRepositorio;
use MkZero\Servidor\Repositorios\Cupon\CuponRepositorio;
use MkZero\Servidor\Repositorios\Destacado\DestacadoRepositorio;
use Throwable;

class ApiController
{
  use ApiControllerTrait;

  public function __construct(
    private CuponRepositorio $cuponRepositorio,
    private DestacadoRepositorio $destacadoRepositorio,
    private CategoriaRepositorio $categoriaRepositorio
  ) {}

  /**
   * Respuesta simple para comprobar que el router funciona.
   */
  public function saludo(): void
  {
    $this->responderJson([
      'mensaje' => 'API de BombCoupons clon lista.',
      'endpoints' => [
        'GET /api/cupones',
        'GET /api/destacados',
        'GET /api/categorias',
      ],
    ]);
  }

  public function listarCupones(): void
  {
    try {
      $this->responderJson(['cupones' => $this->cuponRepositorio->todos()]);
    } catch (Throwable $e) {
      $this->responderError($e->getMessage());
    }
  }

  public function listarDestacados(): void
  {
    try {
      $this->responderJson(['destacados' => $this->destacadoRepositorio->todos()]);
    } catch (Throwable $e) {
      $this->responderError($e->getMessage());
    }
  }

  public function listarCategorias(): void
  {
    try {
      $this->responderJson(['categorias' => $this->categoriaRepositorio->todas()]);
    } catch (Throwable $e) {
      $this->responderError($e->getMessage());
    }
  }

  public function crearCupon(): void
  {
    [$payload, $errorPayload] = $this->obtenerPayload();
    if ($errorPayload !== null) {
      $this->responderJson([
        'mensaje' => $errorPayload,
      ], 400);
      return;
    }

    [$datosLimpios, $errores] = $this->validarCupon($payload);
    if (!empty($errores)) {
      $this->responderJson([
        'mensaje' => 'Revisa los campos enviados.',
        'errores' => $errores,
      ], 422);
      return;
    }

    if (!empty($datosLimpios['logo_archivo']) && is_array($datosLimpios['logo_archivo'])) {
      [$logoSubido, $errorLogoSubido] = $this->procesarLogoSubido($datosLimpios['logo_archivo']);
      if ($errorLogoSubido !== null) {
        $this->responderJson([
          'mensaje' => 'No se pudo guardar el logo enviado.',
          'errores' => ['logo' => $errorLogoSubido],
        ], 422);
        return;
      }
      $datosLimpios['logo'] = $logoSubido;
    }
    unset($datosLimpios['logo_archivo']);

    try {
      $cuponCreado = $this->cuponRepositorio->crear($datosLimpios);
      $this->responderJson(['cupon' => $cuponCreado], 201);
    } catch (Throwable $e) {
      $this->responderError($e->getMessage());
    }
  }

  /**
   * @return array{0: array<string, mixed>, 1: array<string, string>}
   */
  private function validarCupon(array $payload): array
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

    [$enlaceNormalizado, $errorEnlace] = $this->normalizarUrl($datos['enlace'], true);
    if ($errorEnlace !== null) {
      $errores['enlace'] = $errorEnlace;
    } else {
      $datos['enlace'] = $enlaceNormalizado;
    }

    return [$datos, $errores];
  }

  /**
   * @return array{0: array<string, mixed>, 1: ?string}
   */
  private function obtenerPayload(): array
  {
    $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
    if (is_string($contentType) && str_contains($contentType, 'multipart/form-data')) {
      $payload = $_POST;
      if (!empty($_FILES['logo']) && is_array($_FILES['logo'])) {
        $error = $_FILES['logo']['error'] ?? UPLOAD_ERR_NO_FILE;
        if ($error !== UPLOAD_ERR_NO_FILE) {
          $payload['logo_archivo'] = $_FILES['logo'];
        }
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

  /**
   * @param array<string, mixed> $archivo
   * @return array{0: string, 1: ?string}
   */
  private function procesarLogoSubido(array $archivo): array
  {
    $error = $archivo['error'] ?? UPLOAD_ERR_NO_FILE;
    if ($error !== UPLOAD_ERR_OK) {
      return ['', 'No se pudo recibir el archivo proporcionado.'];
    }

    $peso = (int) ($archivo['size'] ?? 0);
    if ($peso <= 0) {
      return ['', 'El archivo de logo está vacío.'];
    }

    $limite = 2 * 1024 * 1024; // 2 MB
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

    if (!array_key_exists($mime, $permitidos)) {
      return ['', 'Formato no soportado. Usa PNG, JPG, WEBP, GIF o SVG.'];
    }

    $extension = $permitidos[$mime];
    try {
      $nombreArchivo = sprintf('logo_%s.%s', bin2hex(random_bytes(8)), $extension);
    } catch (Throwable $e) {
      return ['', 'No se pudo generar el nombre del archivo.'];
    }

    $carpetaBase = dirname(__DIR__, 4) . '/uploads/logos';
    if (!is_dir($carpetaBase) && !mkdir($carpetaBase, 0775, true) && !is_dir($carpetaBase)) {
      return ['', 'No se pudo preparar la carpeta de logos.'];
    }

    $rutaDestino = $carpetaBase . DIRECTORY_SEPARATOR . $nombreArchivo;
    if (!move_uploaded_file($tmp, $rutaDestino)) {
      return ['', 'No se pudo mover el archivo subido.'];
    }

    $rutaPublica = '/uploads/logos/' . $nombreArchivo;
    return [$this->construirUrlPublica($rutaPublica), null];
  }

  private function construirUrlPublica(string $rutaRelativa): string
  {
    $rutaRelativa = '/' . ltrim($rutaRelativa, '/');

    $appUrl = rtrim((string) ($_ENV['APP_URL'] ?? getenv('APP_URL') ?? ''), '/');
    if ($appUrl !== '') {
      return $appUrl . $rutaRelativa;
    }

    $esHttps = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
    $protocolo = $esHttps ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
    $scriptDir = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? ''));
    if ($scriptDir === '\\' || $scriptDir === '/') {
      $scriptDir = '';
    }

    return rtrim("{$protocolo}://{$host}{$scriptDir}", '/') . $rutaRelativa;
  }

  /**
   * Normaliza URLs permitiendo que se omita el esquema (http/https).
   *
   * @return array{0: string, 1: ?string}
   */
  private function normalizarUrl(string $valor, bool $requerida): array
  {
    $valor = trim($valor);
    if ($valor === '') {
      return $requerida
        ? ['', 'Debes proporcionar una URL.']
        : ['', null];
    }

    if (!preg_match('#^https?://#i', $valor)) {
      $valor = 'https://' . ltrim($valor, '/');
    }

    if (!filter_var($valor, FILTER_VALIDATE_URL)) {
      return ['', 'La URL proporcionada no es válida.'];
    }

    return [$valor, null];
  }
}
