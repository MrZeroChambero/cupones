<?php

namespace MkZero\Servidor\Http\Controllers\Api;

trait ApiControllerTrait
{
  protected function responderJson(array $payload, int $codigo = 200): void
  {
    http_response_code($codigo);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  }

  protected function responderError(string $mensaje, int $codigo = 500): void
  {
    $this->responderJson(['mensaje' => $mensaje], $codigo);
  }
}
