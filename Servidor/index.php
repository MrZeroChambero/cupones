<?php

declare(strict_types=1);

use MkZero\Servidor\Core\Conexion\Conexion;
use MkZero\Servidor\Http\Controllers\Api\ApiController;
use MkZero\Servidor\Repositorios\Categoria\CategoriaRepositorio;
use MkZero\Servidor\Repositorios\Cupon\CuponRepositorio;
use MkZero\Servidor\Repositorios\Destacado\DestacadoRepositorio;

require __DIR__ . '/vendor/autoload.php';

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
  $frontUrl = $_ENV['FRONT_URL'] ?? getenv('FRONT_URL');
  if (!empty($frontUrl)) {
    $allowedOrigins[] = trim($frontUrl);
  }
}

if (empty($allowedOrigins)) {
  $allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
  ];
}

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins, true)) {
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

$controlador = new ApiController(
  new CuponRepositorio($conexion),
  new DestacadoRepositorio($conexion),
  new CategoriaRepositorio($conexion)
);

$router = new AltoRouter();
$basePath = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '/')), '/');
$router->setBasePath($basePath === '' ? '/' : $basePath);

// Definición de rutas principales de la API
$router->map('GET', '/', [$controlador, 'saludo']);
foreach (['', '/api'] as $prefijo) {
  $router->map('GET', $prefijo . '/cupones', [$controlador, 'listarCupones']);
  $router->map('GET', $prefijo . '/destacados', [$controlador, 'listarDestacados']);
  $router->map('GET', $prefijo . '/categorias', [$controlador, 'listarCategorias']);
  $router->map('POST', $prefijo . '/cupones', [$controlador, 'crearCupon']);
}

$coincidencia = $router->match();

if ($coincidencia && is_callable($coincidencia['target'])) {
  call_user_func_array($coincidencia['target'], $coincidencia['params']);
  return;
}

$rutaSolicitada = $_SERVER['REQUEST_URI'] ?? '';
http_response_code(404);
header('Content-Type: application/json; charset=utf-8');
echo json_encode(
  ['mensaje' => "No existe la ruta '{$rutaSolicitada}'"],
  JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
);
