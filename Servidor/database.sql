CREATE DATABASE IF NOT EXISTS bombcoupons CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bombcoupons;

CREATE TABLE IF NOT EXISTS categorias (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255) DEFAULT NULL,
    slug VARCHAR(120) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cupones (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    marca VARCHAR(120) NOT NULL,
    descripcion TEXT NOT NULL,
    codigo VARCHAR(60) NOT NULL,
    categoria_id INT UNSIGNED NOT NULL,
    expira DATE NOT NULL,
    descuento VARCHAR(50) NOT NULL,
    enlace VARCHAR(255) NOT NULL,
    logo VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_cupon_categoria FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS destacados (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(120) NOT NULL,
    copy VARCHAR(255) NOT NULL,
    codigo VARCHAR(60) NOT NULL,
    descuento VARCHAR(50) NOT NULL,
    expira DATE NOT NULL,
    enlace VARCHAR(255) DEFAULT NULL,
    cupon_id INT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_destacado_cupon FOREIGN KEY (cupon_id) REFERENCES cupones(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS promociones (
    id_Promocion INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    marca VARCHAR(120) NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    cupones INT UNSIGNED DEFAULT 0,
    estado VARCHAR(60) DEFAULT 'disponible',
    rating DECIMAL(3,1) DEFAULT 0.0,
    detalles VARCHAR(255) NOT NULL,
    img VARCHAR(255) NOT NULL,
    icono VARCHAR(255) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO categorias (nombre, descripcion, slug) VALUES
    ('Tecnología', 'Dispositivos inteligentes y periféricos', 'tecnologia'),
    ('Moda', 'Colecciones urbanas y lifestyle', 'moda'),
    ('Hogar', 'Decoración y soluciones eco', 'hogar'),
    ('Gastronomía', 'Propuestas gourmet y delivery', 'gastronomia')
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);

INSERT INTO cupones (marca, descripcion, codigo, categoria_id, expira, descuento, enlace, logo) VALUES
    ('TechNova', '50% de descuento en accesorios inteligentes seleccionados.', 'TECHNOVA50', 1, '2026-02-15', '50%', 'https://tienda.technova.com/ofertas', 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=200&q=60'),
    ('EcoMarket', 'Envío gratis y 15% off en productos sustentables.', 'ECOENVIO', 3, '2026-01-25', '15%', 'https://ecomarket.com/promos', 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=200&q=60'),
    ('UrbanWear', '2x1 en sudaderas premium durante el fin de semana.', 'URBANX2', 2, '2026-01-20', '2x1', 'https://urbanwear.com/colecciones', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=200&q=60'),
    ('FreshBites', '30% menos en combos saludables listos para llevar.', 'FRESH30', 4, '2026-03-05', '30%', 'https://freshbites.com/ahorros', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=200&q=60'),
    ('FitPulse', 'Hasta 40% en membresías anuales premium.', 'FITPULSE40', 1, '2026-04-01', '40%', 'https://fitpulse.com/registros', 'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?auto=format&fit=crop&w=200&q=60')
ON DUPLICATE KEY UPDATE descripcion = VALUES(descripcion);

INSERT INTO destacados (titulo, copy, codigo, descuento, expira, enlace, cupon_id) VALUES
        (
            'Cuponazo del Mes',
            'Aplica para laptops y monitores seleccionados.',
            'MEGATECH',
            'Hasta 60%',
            '2026-02-01',
            'https://tienda.technova.com/ofertas',
            1
        ),
        (
            'Delivery Express',
            'Comidas frescas en menos de 30 minutos.',
            'EATEXPRESS',
            'Envío gratis',
            '2026-01-30',
            'https://freshbites.com/ahorros',
            4
        )
ON DUPLICATE KEY UPDATE copy = VALUES(copy), enlace = VALUES(enlace);

INSERT INTO promociones (marca, nombre, cupones, estado, rating, detalles, img, icono)
VALUES
    (
        'ShopiTech',
        'Semana Gamer',
        6,
        'disponible',
        4.8,
        'Hasta 50 % en periféricos RGB y envíos gratis en pedidos mayores a $80.',
        '/img/sample-reel.png',
        '/icons/sample-reel.png'
    )
ON DUPLICATE KEY UPDATE detalles = VALUES(detalles);
