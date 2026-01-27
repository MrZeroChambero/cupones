<?php

return [
  'driver' => $_ENV['DB_DRIVER'] ?? 'mysql',
  'host' => $_ENV['DB_HOST'] ?? 'sql211.infinityfree.com',
  'port' => $_ENV['DB_PORT'] ?? '3306',
  'database' => $_ENV['DB_NAME'] ?? 'if0_41009421_bombcoupons',
  'username' => $_ENV['DB_USER'] ?? 'if0_41009421',
  'password' => $_ENV['DB_PASSWORD'] ?? '72fHtFHNn8',
  'charset' => $_ENV['DB_CHARSET'] ?? 'utf8mb4',
];
