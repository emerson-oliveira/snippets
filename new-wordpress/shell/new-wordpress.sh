#!/usr/bin/bash
WORDPRESS_URL="wordpress.com.br"
PROJECT_NAME="wordpressnew"
PATH_FILE="./"
#PATH_FILE="/var/www/wordpressnew"


WORDPRESS_DB="wordpressdb"
WORDPRESS_USER="wordpressuser"
WORDPRESS_PASSWORD="password"
WORDPRESS_PREFIX="xyz"

mkdir ./$PROJECT_NAME
cd ./$PROJECT_NAME

# mysql -u yourusername -p
# create database wordpress;
# grant all on wordpress.* to 'username' identified by 'yourpassword';

#  Instala o Wordpress
wp --allow-root core download --force --skip-content --locale=pt_BR  --version=latest

#  Instala os principais plugins para desenvolvimento
wp --allow-root plugin install elementor 
wp --allow-root plugin install elementor-pro 
wp --allow-root plugin install happy-elementor-addons
wp --allow-root plugin install essential-addons-for-elementor-lite
wp --allow-root plugin install classic-editor 
wp --allow-root plugin install really-simple-ssl
wp --allow-root plugin install updraftplus 
wp --allow-root plugin install wp-mail-smtp

# instala o tema utilizado por padrão nos projetos de desenvolvimento
wp --allow-root theme install page-builder-framework

# Ativa o tema
wp --allow-root theme activate page-builder-framework


# ambiente de produção
# wp --allow-root plugin install better-search-replace
# wp --allow-root plugin install wordpress-seo


# wp --allow-root language core install pt_BR
# wp --allow-root language core activate pt_BR

# wp core config --dbname=wordpress --dbuser=user --dbpass=password --dbhost=localhost --dbprefix=wp_
# wp --allow-root  config create --dbname=testing --dbuser=wp --dbpass=securepswd --locale=pt_BR latest
# wp --allow-root core config --dbname=$WORDPRESS_DB --dbuser=$WORDPRESS_USER --dbpass=$WORDPRESS_PASSWORD --dbhost=localhost --dbprefix=$WORDPRESS_PREFIX

