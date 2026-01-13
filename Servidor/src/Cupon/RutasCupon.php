<?php

use MkZero\Servidor\Conexion\Conexion;
use MkZero\Servidor\Cupon\Cupon;

return function (\AltoRouter $router, Conexion $conexion): void {
  $servicio = new Cupon($conexion);
  foreach (['', '/api'] as $prefijo) {
    $router->map('GET', $prefijo . '/cupones', [$servicio, 'listar']);
    $router->map('POST', $prefijo . '/cupones', [$servicio, 'crear']);
  }
};
