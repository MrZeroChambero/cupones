<?php

use MkZero\Servidor\Categoria\Categoria;
use MkZero\Servidor\Conexion\Conexion;

return function (\AltoRouter $router, Conexion $conexion): void {
  $servicio = new Categoria($conexion);
  foreach (['', '/api'] as $prefijo) {
    $router->map('GET', $prefijo . '/categorias', [$servicio, 'listar']);
  }
};
