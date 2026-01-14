<?php

use MkZero\Servidor\Conexion\Conexion;
use MkZero\Servidor\Promocion\Promocion;

return function (\AltoRouter $router, Conexion $conexion): void {
  $servicio = new Promocion($conexion);
  foreach (['', '/api'] as $prefijo) {
    $router->map('GET', $prefijo . '/promociones', [$servicio, 'listar']);
    $router->map('POST', $prefijo . '/promociones', [$servicio, 'crear']);
  }
};
