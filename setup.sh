#!/bin/bash

# Skyzer Cloud - PHP Setup Script
# This script sets up the PHP version of Skyzer Cloud

set -e

echo "🚀 Skyzer Cloud - PHP Setup"
echo "============================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Check if we're in the right directory
if [ ! -d "php" ]; then
    print_error "php/ directory not found. Please run this script from the project root."
    exit 1
fi

# Check prerequisites
echo "Checking prerequisites..."
echo ""

# Check PHP
if ! command -v php &> /dev/null; then
    print_error "PHP is not installed. Please install PHP 8.1 or higher."
    exit 1
fi

PHP_VERSION=$(php -r 'echo PHP_VERSION;' | cut -d. -f1,2)
PHP_VERSION_MAJOR=$(echo $PHP_VERSION | cut -d. -f1)
PHP_VERSION_MINOR=$(echo $PHP_VERSION | cut -d. -f2)

if [ "$PHP_VERSION_MAJOR" -lt 8 ] || ([ "$PHP_VERSION_MAJOR" -eq 8 ] && [ "$PHP_VERSION_MINOR" -lt 1 ]); then
    print_error "PHP 8.1 or higher is required. Found: $PHP_VERSION"
    exit 1
fi

print_success "PHP $PHP_VERSION found"

# Check PHP extensions
echo ""
echo "Checking PHP extensions..."

REQUIRED_EXTENSIONS=("pdo" "pdo_pgsql" "json" "curl" "mbstring" "openssl")
MISSING_EXTENSIONS=()

for ext in "${REQUIRED_EXTENSIONS[@]}"; do
    if ! php -m | grep -q "^${ext}$"; then
        MISSING_EXTENSIONS+=("$ext")
    fi
done

if [ ${#MISSING_EXTENSIONS[@]} -gt 0 ]; then
    print_error "Missing PHP extensions: ${MISSING_EXTENSIONS[*]}"
    print_info "Install them with: sudo apt install php${PHP_VERSION_MAJOR}.${PHP_VERSION_MINOR}-pgsql php${PHP_VERSION_MAJOR}.${PHP_VERSION_MINOR}-curl php${PHP_VERSION_MAJOR}.${PHP_VERSION_MINOR}-mbstring"
    exit 1
fi

print_success "All required PHP extensions found"

# Check Composer
if ! command -v composer &> /dev/null; then
    print_warning "Composer is not installed. Installing Composer..."
    
    if command -v curl &> /dev/null; then
        EXPECTED_CHECKSUM="$(php -r 'copy("https://composer.github.io/installer.sig", "php://stdout");')"
        php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
        ACTUAL_CHECKSUM="$(php -r "echo hash_file('sha384', 'composer-setup.php');")"
        
        if [ "$EXPECTED_CHECKSUM" != "$ACTUAL_CHECKSUM" ]; then
            print_error "Composer installer checksum mismatch"
            rm -f composer-setup.php
            exit 1
        fi
        
        php composer-setup.php --install-dir=/usr/local/bin --filename=composer
        rm composer-setup.php
        print_success "Composer installed"
    else
        print_error "curl is required to install Composer. Please install Composer manually."
        exit 1
    fi
else
    print_success "Composer found"
fi

# Check PostgreSQL
if ! command -v psql &> /dev/null; then
    print_warning "PostgreSQL client not found. Database setup will be skipped."
    print_info "Install PostgreSQL client: sudo apt install postgresql-client"
    SKIP_DB=true
else
    print_success "PostgreSQL client found"
    SKIP_DB=false
fi

echo ""
echo "============================"
echo ""

# Navigate to php directory
cd php

# Install Composer dependencies
echo "Installing Composer dependencies..."
if composer install --no-interaction; then
    print_success "Composer dependencies installed"
else
    print_error "Failed to install Composer dependencies"
    exit 1
fi

echo ""

# Create .env file
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        echo "Creating .env file from template..."
        cp .env.example .env
        print_success ".env file created"
        print_warning "Please edit php/.env with your configuration before continuing"
    else
        print_error ".env.example not found"
        exit 1
    fi
else
    print_success ".env file already exists"
fi

echo ""

# Copy assets if they don't exist
if [ ! -d "assets/product_pictures" ] && [ -d "../apps/web/public/assets/product_pictures" ]; then
    echo "Copying product pictures..."
    mkdir -p assets/product_pictures
    cp -r ../apps/web/public/assets/product_pictures/* assets/product_pictures/ 2>/dev/null || true
    print_success "Product pictures copied"
    echo ""
fi

# Set permissions
echo "Setting file permissions..."
chmod -R 755 . 2>/dev/null || true
chmod 600 .env 2>/dev/null || true
print_success "Permissions set"
echo ""

# Database setup (optional)
if [ "$SKIP_DB" = false ]; then
    echo "Database Setup"
    echo "============="
    echo ""
    read -p "Do you want to set up the database now? (y/n) " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo ""
        read -p "Database host [localhost]: " DB_HOST
        DB_HOST=${DB_HOST:-localhost}
        
        read -p "Database port [5432]: " DB_PORT
        DB_PORT=${DB_PORT:-5432}
        
        read -p "Database name [skyzer_cloud]: " DB_NAME
        DB_NAME=${DB_NAME:-skyzer_cloud}
        
        read -p "Database user [postgres]: " DB_USER
        DB_USER=${DB_USER:-postgres}
        
        read -sp "Database password: " DB_PASSWORD
        echo ""
        
        # Test database connection
        echo ""
        echo "Testing database connection..."
        if PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -c "\q" 2>/dev/null; then
            print_success "Database connection successful"
            
            # Create database if it doesn't exist
            echo "Creating database if it doesn't exist..."
            PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -c "CREATE DATABASE $DB_NAME;" 2>/dev/null || print_info "Database already exists or creation failed"
            
            # Update .env file
            if [ -f .env ]; then
                sed -i.bak "s/DB_HOST=.*/DB_HOST=$DB_HOST/" .env
                sed -i.bak "s/DB_PORT=.*/DB_PORT=$DB_PORT/" .env
                sed -i.bak "s/DB_NAME=.*/DB_NAME=$DB_NAME/" .env
                sed -i.bak "s/DB_USER=.*/DB_USER=$DB_USER/" .env
                sed -i.bak "s/DB_PASSWORD=.*/DB_PASSWORD=$DB_PASSWORD/" .env
                rm -f .env.bak 2>/dev/null || true
                print_success ".env file updated with database credentials"
            fi
            
            # Check if schema exists
            echo ""
            read -p "Do you want to import the database schema? (y/n) " -n 1 -r
            echo ""
            
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                if [ -f "../packages/db/prisma/schema.prisma" ]; then
                    print_info "Please run Prisma migrations or import the schema manually"
                    print_info "Schema file: ../packages/db/prisma/schema.prisma"
                else
                    print_warning "Schema file not found. Please create the database tables manually."
                fi
            fi
        else
            print_error "Database connection failed. Please check your credentials."
        fi
    else
        print_info "Database setup skipped. Configure database in php/.env manually."
    fi
    echo ""
fi

# Generate JWT secret if not set
if [ -f .env ]; then
    if grep -q "JWT_SECRET=your-secret-key-change-this-in-production" .env; then
        JWT_SECRET=$(openssl rand -hex 32 2>/dev/null || head -c 32 /dev/urandom | base64)
        sed -i.bak "s|JWT_SECRET=.*|JWT_SECRET=$JWT_SECRET|" .env
        rm -f .env.bak 2>/dev/null || true
        print_success "JWT secret generated"
    fi
fi

# Go back to root
cd ..

echo ""
echo "============================"
print_success "Setup complete!"
echo "============================"
echo ""
echo "Next steps:"
echo ""
echo "1. Edit php/.env with your configuration:"
echo "   - Database credentials"
echo "   - PTERODACTYL_URL and PTERODACTYL_API_KEY"
echo "   - TEBEX_SECRET_KEY and TEBEX_PUBLIC_KEY"
echo "   - APP_URL"
echo ""
echo "2. Set up your web server:"
echo "   - Apache: Enable mod_rewrite and point DocumentRoot to php/"
echo "   - Nginx: See php/DEPLOYMENT.md for configuration"
echo ""
echo "3. Import database schema:"
echo "   - Use Prisma migrations from packages/db/"
echo "   - Or create tables manually based on schema.prisma"
echo ""
echo "4. Start your web server and visit your domain"
echo ""
echo "For more information, see:"
echo "  - php/README.md"
echo "  - php/DEPLOYMENT.md"
echo "  - php/MIGRATION_GUIDE.md"
echo ""

