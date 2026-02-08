FROM php:8.3-apache

# 1. Instalar extensiones de PHP y dependencias
RUN docker-php-ext-install pdo pdo_mysql && \
    apt-get update && apt-get install -y curl

# 2. Habilitar mod_rewrite (necesario para las reglas de reescritura de .htaccess)
RUN a2enmod rewrite

# 3. Habilitar AllowOverride para que Apache lea el archivo .htaccess
RUN sed -i '/<Directory \/var\/www\/>/,/<\/Directory>/ s/AllowOverride None/AllowOverride All/' /etc/apache2/apache2.conf

# 4. (Opcional) Definir el ServerName para eliminar el aviso en los logs
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf