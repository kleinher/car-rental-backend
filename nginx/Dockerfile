# Usar la imagen oficial de Nginx
FROM nginx:latest

# Copiar el archivo de configuración de Nginx
COPY default.conf /etc/nginx/conf.d/default.conf

# Exponer los puertos 80 (HTTP) y 443 (HTTPS)
EXPOSE 80 443

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
