<?php

use MkZero\Servidor\Conexion\Conexion;
use MkZero\Servidor\Respuesta\RespuestaJson;

return function (\AltoRouter $router, Conexion $conexion): void {
  $router->map('GET', '/', static function (): void {
    RespuestaJson::exito([
      'mensaje' => 'API BombCoupons lista',
      'endpoints' => [
        'GET /cupones',
        'GET /destacados',
        'GET /categorias',
        'GET /promociones',
        'POST /cupones',
      ],
    ]);
  });

  $archivosRutas = [
    __DIR__ . '/Cupon/RutasCupon.php',
    __DIR__ . '/Destacado/RutasDestacado.php',
    __DIR__ . '/Categoria/RutasCategoria.php',
    __DIR__ . '/Promocion/RutasPromocion.php',
  ];

  foreach ($archivosRutas as $archivo) {
    if (!is_file($archivo)) {
      continue;
    }
    $registrar = require $archivo;
    if (is_callable($registrar)) {
      $registrar($router, $conexion);
    }
  }
};
