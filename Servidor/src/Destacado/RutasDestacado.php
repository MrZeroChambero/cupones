<?php

use MkZero\Servidor\Conexion\Conexion;
use MkZero\Servidor\Destacado\Destacado;

return function (\AltoRouter $router, Conexion $conexion): void {
  $servicio = new Destacado($conexion);
  foreach (['', '/api'] as $prefijo) {
    $router->map('GET', $prefijo . '/destacados', [$servicio, 'listar']);
  }
};
