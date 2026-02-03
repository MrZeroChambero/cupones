-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 03-02-2026 a las 01:18:27
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `bombcoupons`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `slug` varchar(120) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id`, `nombre`, `descripcion`, `slug`, `created_at`, `updated_at`) VALUES
(1, 'Tecnología', 'Dispositivos inteligentes y periféricos', 'tecnologia', '2026-01-14 01:54:03', '2026-01-14 01:54:03'),
(2, 'Moda', 'Colecciones urbanas y lifestyle', 'moda', '2026-01-14 01:54:03', '2026-01-14 01:54:03'),
(3, 'Hogar', 'Decoración y soluciones eco', 'hogar', '2026-01-14 01:54:03', '2026-01-14 01:54:03'),
(4, 'Gastronomía', 'Propuestas gourmet y delivery', 'gastronomia', '2026-01-14 01:54:03', '2026-01-14 01:54:03');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cupones`
--

CREATE TABLE `cupones` (
  `id` int(10) UNSIGNED NOT NULL,
  `marca` varchar(120) NOT NULL,
  `descripcion` text NOT NULL,
  `codigo` varchar(60) NOT NULL,
  `categoria_id` int(10) UNSIGNED NOT NULL,
  `expira` date NOT NULL,
  `descuento` varchar(50) NOT NULL,
  `enlace` varchar(255) NOT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `cupones`
--

INSERT INTO `cupones` (`id`, `marca`, `descripcion`, `codigo`, `categoria_id`, `expira`, `descuento`, `enlace`, `logo`, `created_at`, `updated_at`) VALUES
(1, 'TechNova', '50% de descuento en accesorios inteligentes seleccionados.', 'TECHNOVA50', 1, '2026-02-15', '50%', 'https://tienda.technova.com/ofertas', 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=200&q=60', '2026-01-14 01:54:03', '2026-01-14 01:54:03'),
(2, 'EcoMarket', 'Envío gratis y 15% off en productos sustentables.', 'ECOENVIO', 3, '2026-01-25', '15%', 'https://ecomarket.com/promos', 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=200&q=60', '2026-01-14 01:54:03', '2026-01-14 01:54:03'),
(3, 'UrbanWear', '2x1 en sudaderas premium durante el fin de semana.', 'URBANX2', 2, '2026-01-20', '2x1', 'https://urbanwear.com/colecciones', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=200&q=60', '2026-01-14 01:54:03', '2026-01-14 01:54:03'),
(4, 'FreshBites', '30% menos en combos saludables listos para llevar.', 'FRESH30', 4, '2026-03-05', '30%', 'https://freshbites.com/ahorros', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=200&q=60', '2026-01-14 01:54:03', '2026-01-14 01:54:03'),
(5, 'FitPulse', 'Hasta 40% en membresías anuales premium.', 'FITPULSE40', 1, '2026-04-01', '40%', 'https://fitpulse.com/registros', 'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?auto=format&fit=crop&w=200&q=60', '2026-01-14 01:54:03', '2026-01-14 01:54:03');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `destacados`
--

CREATE TABLE `destacados` (
  `id` int(10) UNSIGNED NOT NULL,
  `titulo` varchar(120) NOT NULL,
  `copy` varchar(255) NOT NULL,
  `codigo` varchar(60) NOT NULL,
  `descuento` varchar(50) NOT NULL,
  `expira` date NOT NULL,
  `enlace` varchar(255) DEFAULT NULL,
  `cupon_id` int(10) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `destacados`
--

INSERT INTO `destacados` (`id`, `titulo`, `copy`, `codigo`, `descuento`, `expira`, `enlace`, `cupon_id`, `created_at`, `updated_at`) VALUES
(1, 'Cuponazo del Mes', 'Aplica para laptops y monitores seleccionados.', 'MEGATECH', 'Hasta 60%', '2026-02-01', 'https://tienda.technova.com/ofertas', 1, '2026-01-14 01:54:03', '2026-01-14 01:54:03'),
(2, 'Delivery Express', 'Comidas frescas en menos de 30 minutos.', 'EATEXPRESS', 'Envío gratis', '2026-01-30', 'https://freshbites.com/ahorros', 4, '2026-01-14 01:54:03', '2026-01-14 01:54:03');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `promociones`
--

CREATE TABLE `promociones` (
  `id_Promocion` int(11) NOT NULL,
  `marca` varchar(255) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `cupones` int(11) NOT NULL,
  `coupon_code` varchar(100) NOT NULL,
  `estado` enum('disponible','usado') NOT NULL DEFAULT 'disponible',
  `rating` decimal(3,1) NOT NULL,
  `detalles` varchar(255) NOT NULL,
  `img` varchar(255) NOT NULL,
  `fecha_creacion` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `promociones`
--

INSERT INTO `promociones` (`id_Promocion`, `marca`, `nombre`, `cupones`, `coupon_code`, `estado`, `rating`, `detalles`, `img`, `fecha_creacion`) VALUES
(5, 'AdHoc Studio', 'Hytale', 256, 'BOMBCPN7871612', 'disponible', 4.5, 'Hytale is a sandbox game by Hypixel Studios. Development began in 2015 by developers from the Minecraft multiplayer server Hypixel with funding from Riot Games. Riot would purchase the studio outright in 2020.', '/img/OgNH0gz285QLknkysED.png', '2026-01-19 21:07:32'),
(19, 'Electronic Arts', 'Battlefield 6', 232, 'T652A-78Q37-DZK0L', 'disponible', 5.0, '**SPONSORS REQUIRE 2 TO UNLOCK GAME CODE**\r\n\r\nThe ultimate all-out warfare experience. In a war of tanks, fighter jets, and massive combat arsenals, your squad is the deadliest weapon.', 'https://i.pinimg.com/736x/9f/5d/3f/9f5d3f85d2817d6ed40fdddfddcc5662.jpg', '2026-01-21 22:03:23'),
(23, 'sdsa', 'sadsad', 1, '', 'disponible', 4.5, 'asdsadas', 'dsadsa', '0000-00-00 00:00:00'),
(24, 'joder', 'xd', 1, '', 'disponible', 4.5, 'qweqweqw', 'wqeqweqw', '0000-00-00 00:00:00'),
(25, 'jjjj', 'jjjj', 1, '', 'disponible', 4.5, 'jjjj', 'https://i.pinimg.com/736x/05/33/1b/05331bd2869333cb2a5b9806687fb6fd.jpg', '0000-00-00 00:00:00');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indices de la tabla `cupones`
--
ALTER TABLE `cupones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_cupon_categoria` (`categoria_id`);

--
-- Indices de la tabla `destacados`
--
ALTER TABLE `destacados`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_destacado_cupon` (`cupon_id`);

--
-- Indices de la tabla `promociones`
--
ALTER TABLE `promociones`
  ADD PRIMARY KEY (`id_Promocion`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `cupones`
--
ALTER TABLE `cupones`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `destacados`
--
ALTER TABLE `destacados`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `promociones`
--
ALTER TABLE `promociones`
  MODIFY `id_Promocion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `cupones`
--
ALTER TABLE `cupones`
  ADD CONSTRAINT `fk_cupon_categoria` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `destacados`
--
ALTER TABLE `destacados`
  ADD CONSTRAINT `fk_destacado_cupon` FOREIGN KEY (`cupon_id`) REFERENCES `cupones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
