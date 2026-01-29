<?php

declare(strict_types=1);

use MkZero\Servidor\Conexion\Conexion;
use MkZero\Servidor\Respuesta\RespuestaJson;

require __DIR__ . '/vendor/autoload.php';

// Cargar variables de entorno desde .env
$envFile = __DIR__ . '/.env';
if (file_exists($envFile)) {
  $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
  foreach ($lines as $line) {
    $line = trim($line);
    if (strpos($line, '#') === 0 || strpos($line, '=') === false) continue;
    list($name, $value) = explode('=', $line, 2);
    $name = trim($name);
    $value = trim($value);
    if (!isset($_ENV[$name])) {
      $_ENV[$name] = $value;
      putenv("$name=$value");
    }
  }
}


error_reporting(E_ALL);
$errorEmitido = false;
$emitirErrorJson = static function (string $mensaje, int $status = 500, array $contexto = []) use (&$errorEmitido): void {
  if ($errorEmitido) {
    return;
  }
  $errorEmitido = true;
  if (!headers_sent()) {
    header('Content-Type: application/json; charset=utf-8');
    http_response_code($status);
  }
  echo json_encode([
    'estado' => 'error',
    'mensaje' => $mensaje,
    'detalles' => $contexto,
  ], JSON_UNESCAPED_UNICODE);
};

set_error_handler(static function (int $severity, string $message, string $file = '', int $line = 0): bool {
  if (!(error_reporting() & $severity)) {
    return false;
  }
  throw new \ErrorException($message, 0, $severity, $file, $line);
});

set_exception_handler(static function (\Throwable $ex) use ($emitirErrorJson): void {
  $emitirErrorJson('Error interno en el servidor.', 500, [
    'tipo' => get_class($ex),
    'mensaje' => $ex->getMessage(),
    'archivo' => $ex->getFile(),
    'linea' => $ex->getLine(),
  ]);
});

register_shutdown_function(static function () use ($emitirErrorJson): void {
  $error = error_get_last();
  if ($error && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR], true)) {
    $emitirErrorJson('Error fatal en el servidor.', 500, [
      'tipo' => $error['type'],
      'mensaje' => $error['message'],
      'archivo' => $error['file'],
      'linea' => $error['line'],
    ]);
  }
});

$uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$rutaArchivo = __DIR__ . $uri;

if ($uri !== '/' && file_exists($rutaArchivo) && !is_dir($rutaArchivo)) {
  return false; // Permitir archivos estáticos reales
}

// Configuración de conexión (puede sobrescribirse con variables de entorno)
$configuracion = require __DIR__ . '/config/database.php';
$conexion = new Conexion($configuracion);

// Configuración básica de CORS para permitir al front consumir la API
$allowedOrigins = [];
$allowedOriginsConfigurados = $_ENV['ALLOWED_ORIGINS'] ?? getenv('ALLOWED_ORIGINS');
if ($allowedOriginsConfigurados !== false && $allowedOriginsConfigurados !== null && $allowedOriginsConfigurados !== '') {
  $allowedOrigins = array_filter(array_map('trim', explode(',', $allowedOriginsConfigurados)));
}

if (empty($allowedOrigins)) {
  $frontUrl = $_ENV['ALLOWED_ORIGINS'] ?? getenv('FRONT_URL');
  if (!empty($frontUrl)) {
    $allowedOrigins[] = trim($frontUrl);
  }
}

if (empty($allowedOrigins)) {
  $allowedOrigins = [
    $_ENV['ALLOWED_ORIGINS'] ?? '',
  ];
}

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$originNormalizado = rtrim($origin, '/');
$allowedOriginsNormalizados = array_map(
  static fn($permitido) => rtrim($permitido, '/'),
  $allowedOrigins
);

if ($origin !== '' && in_array($originNormalizado, $allowedOriginsNormalizados, true)) {
  header('Access-Control-Allow-Origin: ' . $origin);
  header('Access-Control-Allow-Credentials: true');
  header('Vary: Origin');
}

header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
  http_response_code(204);
  exit;
}

$router = new AltoRouter();
$basePath = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '/')), '/');
$router->setBasePath($basePath === '' ? '/' : $basePath);

// Definición de rutas principales de la API en un solo archivo
$registrar = require __DIR__ . '/src/Endpoints.php';
$registrar($router, $conexion);

$coincidencia = $router->match();

if ($coincidencia && is_callable($coincidencia['target'])) {
  call_user_func_array($coincidencia['target'], $coincidencia['params']);
  return;
}

$rutaSolicitada = $_SERVER['REQUEST_URI'] ?? '';
RespuestaJson::error("No existe la ruta '{$rutaSolicitada}'", 404);
