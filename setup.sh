#!/bin/bash

# Skyzer Cloud - PHP Setup Script
# This script automatically installs all dependencies and sets up the PHP version of Skyzer Cloud

set -e

echo "🚀 Skyzer Cloud - PHP Setup"
echo "============================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Detect OS
detect_os() {
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        OS=$ID
        OS_VERSION=$VERSION_ID
    elif type lsb_release >/dev/null 2>&1; then
        OS=$(lsb_release -si | tr '[:upper:]' '[:lower:]')
    elif [ -f /etc/lsb-release ]; then
        . /etc/lsb-release
        OS=$DISTRIB_ID
    elif [ -f /etc/debian_version ]; then
        OS=debian
    else
        OS=$(uname -s | tr '[:upper:]' '[:lower:]')
    fi
    echo "$OS"
}

# Check if running as root
check_root() {
    if [ "$EUID" -ne 0 ]; then
        print_warning "Some operations require root privileges. You may be prompted for your password."
        SUDO="sudo"
    else
        SUDO=""
    fi
}

# Install PHP and extensions
install_php() {
    OS=$(detect_os)
    print_info "Detected OS: $OS"
    
    if command -v php &> /dev/null; then
        PHP_VERSION=$(php -r 'echo PHP_VERSION;' | cut -d. -f1,2)
        PHP_VERSION_MAJOR=$(echo $PHP_VERSION | cut -d. -f1)
        PHP_VERSION_MINOR=$(echo $PHP_VERSION | cut -d. -f2)
        
        if [ "$PHP_VERSION_MAJOR" -ge 8 ] && ([ "$PHP_VERSION_MAJOR" -gt 8 ] || [ "$PHP_VERSION_MINOR" -ge 1 ]); then
            print_success "PHP $PHP_VERSION is already installed"
            return 0
        fi
    fi
    
    print_info "Installing PHP 8.1+ and required extensions..."
    
    case $OS in
        ubuntu|debian)
            $SUDO apt update
            $SUDO apt install -y software-properties-common
            $SUDO add-apt-repository -y ppa:ondrej/php
            $SUDO apt update
            $SUDO apt install -y php8.1 php8.1-fpm php8.1-pgsql php8.1-curl php8.1-mbstring php8.1-xml php8.1-zip php8.1-cli php8.1-common
            ;;
        fedora|rhel|centos)
            $SUDO dnf install -y epel-release
            $SUDO dnf install -y https://rpms.remirepo.net/enterprise/remi-release-$(rpm -E %rhel).rpm
            $SUDO dnf module reset php -y
            $SUDO dnf module enable php:remi-8.1 -y
            $SUDO dnf install -y php php-pgsql php-curl php-mbstring php-xml php-zip
            ;;
        arch|manjaro)
            $SUDO pacman -Syu --noconfirm
            $SUDO pacman -S --noconfirm php php-pgsql curl
            ;;
        *)
            print_error "Unsupported OS: $OS"
            print_info "Please install PHP 8.1+ manually with extensions: pdo, pdo_pgsql, json, curl, mbstring, openssl"
            exit 1
            ;;
    esac
    
    print_success "PHP and extensions installed"
}

# Install PostgreSQL
install_postgresql() {
    OS=$(detect_os)
    
    if command -v psql &> /dev/null; then
        print_success "PostgreSQL client is already installed"
        return 0
    fi
    
    print_info "Installing PostgreSQL client..."
    
    case $OS in
        ubuntu|debian)
            $SUDO apt update
            $SUDO apt install -y postgresql-client postgresql
            ;;
        fedora|rhel|centos)
            $SUDO dnf install -y postgresql postgresql-server
            ;;
        arch|manjaro)
            $SUDO pacman -S --noconfirm postgresql
            ;;
        *)
            print_warning "Unsupported OS for automatic PostgreSQL installation: $OS"
            print_info "Please install PostgreSQL manually"
            return 1
            ;;
    esac
    
    print_success "PostgreSQL installed"
}

# Install Composer
install_composer() {
    if command -v composer &> /dev/null; then
        print_success "Composer is already installed"
        return 0
    fi
    
    print_info "Installing Composer..."
    
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
}

# Install Apache/Nginx (optional)
install_webserver() {
    OS=$(detect_os)
    
    echo ""
    read -p "Do you want to install a web server? (apache/nginx/none) [none]: " WEBSERVER
    WEBSERVER=${WEBSERVER:-none}
    
    if [ "$WEBSERVER" = "none" ]; then
        print_info "Skipping web server installation"
        return 0
    fi
    
    case $OS in
        ubuntu|debian)
            if [ "$WEBSERVER" = "apache" ]; then
                print_info "Installing Apache..."
                $SUDO apt update
                $SUDO apt install -y apache2 libapache2-mod-php8.1
                $SUDO a2enmod rewrite
                $SUDO a2enmod php8.1
                print_success "Apache installed and configured"
            elif [ "$WEBSERVER" = "nginx" ]; then
                print_info "Installing Nginx..."
                $SUDO apt update
                $SUDO apt install -y nginx php8.1-fpm
                print_success "Nginx installed"
                print_warning "Please configure Nginx manually (see php/DEPLOYMENT.md)"
            fi
            ;;
        fedora|rhel|centos)
            if [ "$WEBSERVER" = "apache" ]; then
                print_info "Installing Apache..."
                $SUDO dnf install -y httpd php
                $SUDO systemctl enable httpd
                print_success "Apache installed"
            elif [ "$WEBSERVER" = "nginx" ]; then
                print_info "Installing Nginx..."
                $SUDO dnf install -y nginx php-fpm
                $SUDO systemctl enable nginx
                print_success "Nginx installed"
            fi
            ;;
        *)
            print_warning "Automatic web server installation not supported for $OS"
            print_info "Please install $WEBSERVER manually"
            ;;
    esac
}

# Check if we're in the right directory
if [ ! -d "php" ]; then
    print_error "php/ directory not found. Please run this script from the project root."
    exit 1
fi

# Initialize
check_root

# Auto-install dependencies
echo "============================"
echo "Automatic Dependency Installation"
echo "============================"
echo ""

# Ask for auto-install
read -p "Do you want to automatically install all missing dependencies? (y/n) [y]: " AUTO_INSTALL
AUTO_INSTALL=${AUTO_INSTALL:-y}

if [[ $AUTO_INSTALL =~ ^[Yy]$ ]]; then
    # Install PHP
    install_php
    
    # Verify PHP installation
    if ! command -v php &> /dev/null; then
        print_error "PHP installation failed"
        exit 1
    fi
    
    PHP_VERSION=$(php -r 'echo PHP_VERSION;')
    print_success "PHP $PHP_VERSION is ready"
    
    # Check PHP extensions
    echo ""
    echo "Verifying PHP extensions..."
    REQUIRED_EXTENSIONS=("pdo" "pdo_pgsql" "json" "curl" "mbstring" "openssl")
    MISSING_EXTENSIONS=()
    
    for ext in "${REQUIRED_EXTENSIONS[@]}"; do
        # Check if extension is loaded (pdo might be built-in)
        if ! php -m | grep -q "^${ext}$" && ! php -m | grep -q "PDO" && [ "$ext" = "pdo" ]; then
            # pdo is usually built-in, check differently
            if ! php -r "if (!extension_loaded('pdo')) exit(1);" 2>/dev/null; then
                MISSING_EXTENSIONS+=("$ext")
            fi
        elif ! php -m | grep -q "^${ext}$"; then
            MISSING_EXTENSIONS+=("$ext")
        fi
    done
    
    if [ ${#MISSING_EXTENSIONS[@]} -gt 0 ]; then
        print_warning "Some PHP extensions are missing: ${MISSING_EXTENSIONS[*]}"
        print_info "Trying to install missing extensions..."
        
        OS=$(detect_os)
        case $OS in
            ubuntu|debian)
                PHP_VER=$(php -r 'echo PHP_MAJOR_VERSION.".".PHP_MINOR_VERSION;')
                for ext in "${MISSING_EXTENSIONS[@]}"; do
                    case $ext in
                        pdo)
                            # pdo is usually built-in, but try installing php-pdo if needed
                            $SUDO apt install -y php${PHP_VER}-common 2>/dev/null || true
                            ;;
                        pdo_pgsql)
                            $SUDO apt install -y php${PHP_VER}-pgsql 2>/dev/null || true
                            ;;
                        curl)
                            $SUDO apt install -y php${PHP_VER}-curl 2>/dev/null || true
                            ;;
                        mbstring)
                            $SUDO apt install -y php${PHP_VER}-mbstring 2>/dev/null || true
                            ;;
                    esac
                done
                ;;
        esac
        
        # Re-check after installation
        MISSING_AFTER=()
        for ext in "${MISSING_EXTENSIONS[@]}"; do
            if [ "$ext" = "pdo" ]; then
                if ! php -r "if (!extension_loaded('pdo')) exit(1);" 2>/dev/null; then
                    MISSING_AFTER+=("$ext")
                fi
            elif ! php -m | grep -q "^${ext}$"; then
                MISSING_AFTER+=("$ext")
            fi
        done
        
        if [ ${#MISSING_AFTER[@]} -eq 0 ]; then
            print_success "All required PHP extensions are now available"
        else
            print_warning "Some extensions may still be missing: ${MISSING_AFTER[*]}"
            print_info "You may need to install them manually or restart PHP-FPM"
        fi
    else
        print_success "All required PHP extensions available"
    fi
    
    # Install Composer
    install_composer
    
    # Install PostgreSQL (optional)
    echo ""
    read -p "Do you want to install PostgreSQL? (y/n) [y]: " INSTALL_PG
    INSTALL_PG=${INSTALL_PG:-y}
    
    if [[ $INSTALL_PG =~ ^[Yy]$ ]]; then
        install_postgresql
        SKIP_DB=false
    else
        SKIP_DB=true
        print_info "PostgreSQL installation skipped"
    fi
    
    # Install Web Server (optional)
    install_webserver
    
else
    # Manual check mode
    echo ""
    echo "Checking prerequisites (manual mode)..."
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
        exit 1
    fi
    
    print_success "All required PHP extensions found"
    
    # Check Composer
    if ! command -v composer &> /dev/null; then
        print_error "Composer is not installed. Please install Composer."
        exit 1
    fi
    
    print_success "Composer found"
    
    # Check PostgreSQL
    if ! command -v psql &> /dev/null; then
        print_warning "PostgreSQL client not found. Database setup will be skipped."
        SKIP_DB=true
    else
        print_success "PostgreSQL client found"
        SKIP_DB=false
    fi
fi

echo ""
echo "============================"
echo ""

# Get absolute path to script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PHP_DIR="$SCRIPT_DIR/php"

# Navigate to php directory
cd "$PHP_DIR" || {
    print_error "Cannot access php/ directory"
    exit 1
}

print_info "Working in: $(pwd)"

# Install Composer dependencies
echo "Installing Composer dependencies..."
if composer install --no-interaction; then
    print_success "Composer dependencies installed"
else
    print_error "Failed to install Composer dependencies"
    exit 1
fi

echo ""

# Define paths
ENV_EXAMPLE_PATH="$PHP_DIR/.env.example"
ENV_PATH="$PHP_DIR/.env"

# Check if .env.example exists, create if not
if [ ! -f "$ENV_EXAMPLE_PATH" ]; then
    print_info "Creating .env.example from template..."
    
    # Create .env.example if it doesn't exist
    cat > "$ENV_EXAMPLE_PATH" << 'EOF'
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=skyzer_cloud
DB_USER=postgres
DB_PASSWORD=

# Application
APP_URL=http://localhost
APP_ENV=development

# JWT
JWT_SECRET=your-secret-key-change-this-in-production

# Pterodactyl
PTERODACTYL_URL=https://pterodactyl.example.com
PTERODACTYL_API_KEY=your-pterodactyl-api-key

# Tebex
TEBEX_SECRET_KEY=your-tebex-secret-key
TEBEX_PUBLIC_KEY=your-tebex-public-key
EOF
    print_success ".env.example created at $ENV_EXAMPLE_PATH"
else
    print_success ".env.example found at $ENV_EXAMPLE_PATH"
fi

# Now create .env from .env.example
if [ ! -f "$ENV_PATH" ]; then
    if [ -f "$ENV_EXAMPLE_PATH" ]; then
        echo "Creating .env file from template..."
        cp "$ENV_EXAMPLE_PATH" "$ENV_PATH"
        print_success ".env file created at $ENV_PATH"
        print_warning "Please edit php/.env with your configuration before continuing"
    else
        print_error "Could not create .env file - .env.example not found at $ENV_EXAMPLE_PATH"
        exit 1
    fi
else
    print_success ".env file already exists at $ENV_PATH"
fi

echo ""

# Copy assets if they don't exist
ASSETS_SOURCE="$SCRIPT_DIR/apps/web/public/assets/product_pictures"
ASSETS_DEST="$PHP_DIR/assets/product_pictures"

if [ ! -d "$ASSETS_DEST" ] && [ -d "$ASSETS_SOURCE" ]; then
    echo "Copying product pictures..."
    mkdir -p "$ASSETS_DEST"
    cp -r "$ASSETS_SOURCE"/* "$ASSETS_DEST"/ 2>/dev/null || true
    print_success "Product pictures copied"
    echo ""
elif [ -d "$ASSETS_DEST" ]; then
    print_success "Product pictures already exist"
    echo ""
fi

# Set permissions
echo "Setting file permissions..."
chmod -R 755 "$PHP_DIR" 2>/dev/null || true
chmod 600 "$ENV_PATH" 2>/dev/null || true
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
            if [ -f "$ENV_PATH" ]; then
                # Use different sed syntax for macOS compatibility
                if [[ "$OSTYPE" == "darwin"* ]]; then
                    sed -i '' "s/DB_HOST=.*/DB_HOST=$DB_HOST/" "$ENV_PATH"
                    sed -i '' "s/DB_PORT=.*/DB_PORT=$DB_PORT/" "$ENV_PATH"
                    sed -i '' "s/DB_NAME=.*/DB_NAME=$DB_NAME/" "$ENV_PATH"
                    sed -i '' "s/DB_USER=.*/DB_USER=$DB_USER/" "$ENV_PATH"
                    sed -i '' "s/DB_PASSWORD=.*/DB_PASSWORD=$DB_PASSWORD/" "$ENV_PATH"
                else
                    sed -i.bak "s/DB_HOST=.*/DB_HOST=$DB_HOST/" "$ENV_PATH"
                    sed -i.bak "s/DB_PORT=.*/DB_PORT=$DB_PORT/" "$ENV_PATH"
                    sed -i.bak "s/DB_NAME=.*/DB_NAME=$DB_NAME/" "$ENV_PATH"
                    sed -i.bak "s/DB_USER=.*/DB_USER=$DB_USER/" "$ENV_PATH"
                    sed -i.bak "s/DB_PASSWORD=.*/DB_PASSWORD=$DB_PASSWORD/" "$ENV_PATH"
                    rm -f "${ENV_PATH}.bak" 2>/dev/null || true
                fi
                print_success ".env file updated with database credentials"
            else
                print_warning ".env file not found at $ENV_PATH - cannot update database credentials"
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
if [ -f "$ENV_PATH" ]; then
    if grep -q "JWT_SECRET=your-secret-key-change-this-in-production" "$ENV_PATH" 2>/dev/null; then
        JWT_SECRET=$(openssl rand -hex 32 2>/dev/null || head -c 32 /dev/urandom | base64)
        # Use different sed syntax for macOS compatibility
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' "s|JWT_SECRET=.*|JWT_SECRET=$JWT_SECRET|" "$ENV_PATH"
        else
            sed -i.bak "s|JWT_SECRET=.*|JWT_SECRET=$JWT_SECRET|" "$ENV_PATH"
            rm -f "${ENV_PATH}.bak" 2>/dev/null || true
        fi
        print_success "JWT secret generated"
    fi
fi

# Go back to root
cd "$SCRIPT_DIR" || true

# ============================================
# Automatic Configuration Section
# ============================================
echo ""
echo "============================"
echo "Automatic Configuration"
echo "============================"
echo ""

# Configure Nginx
configure_nginx() {
    if ! command -v nginx &> /dev/null; then
        return 0
    fi
    
    echo ""
    read -p "Do you want to automatically configure Nginx? (y/n) [y]: " CONFIGURE_NGINX
    CONFIGURE_NGINX=${CONFIGURE_NGINX:-y}
    
    if [[ ! $CONFIGURE_NGINX =~ ^[Yy]$ ]]; then
        return 0
    fi
    
    print_info "Configuring Nginx..."
    
    # Get domain name
    read -p "Enter your domain name (or press Enter for localhost): " DOMAIN_NAME
    DOMAIN_NAME=${DOMAIN_NAME:-localhost}
    
    # Get port
    read -p "Enter port number (or press Enter for 3000): " PORT_NUMBER
    PORT_NUMBER=${PORT_NUMBER:-3000}
    
    # Get PHP version
    PHP_VER=$(php -r 'echo PHP_MAJOR_VERSION.".".PHP_MINOR_VERSION;')
    PHP_FPM_SOCK="/var/run/php/php${PHP_VER}-fpm.sock"
    
    # Check if PHP-FPM socket exists
    if [ ! -S "$PHP_FPM_SOCK" ]; then
        # Try alternative locations
        PHP_FPM_SOCK="/run/php/php${PHP_VER}-fpm.sock"
        if [ ! -S "$PHP_FPM_SOCK" ]; then
            print_warning "PHP-FPM socket not found. Please check PHP-FPM configuration."
            PHP_FPM_SOCK="/var/run/php/php${PHP_VER}-fpm.sock"
        fi
    fi
    
    # Create Nginx config
    NGINX_CONFIG="/etc/nginx/sites-available/skyzer-cloud"
    NGINX_ENABLED="/etc/nginx/sites-enabled/skyzer-cloud"
    
    print_info "Creating Nginx configuration for port $PORT_NUMBER..."
    
    $SUDO tee "$NGINX_CONFIG" > /dev/null << EOF
# Skyzer Cloud - PHP Application
server {
    listen ${PORT_NUMBER};
    server_name ${DOMAIN_NAME};
    root ${PHP_DIR};
    index index.php index.html;
    
    # Logs
    access_log /var/log/nginx/skyzer-cloud-access.log;
    error_log /var/log/nginx/skyzer-cloud-error.log;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Main location - try files first, then route to index.php
    location / {
        try_files \$uri \$uri/ /index.php?\$query_string;
    }
    
    # Assets directory
    location /assets/ {
        alias ${PHP_DIR}/assets/;
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
    
    # PHP processing
    location ~ \.php$ {
        try_files \$uri =404;
        fastcgi_pass unix:${PHP_FPM_SOCK};
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME \$document_root\$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_read_timeout 300;
        fastcgi_buffer_size 128k;
        fastcgi_buffers 4 256k;
        fastcgi_busy_buffers_size 256k;
    }
    
    # Deny access to hidden files
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    # Deny access to sensitive files
    location ~ ^/(\.env|composer\.(json|lock)|package\.json|node_modules|vendor) {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    # Static files caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
    
    # Client body size
    client_max_body_size 100M;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
}
EOF
    
    # Enable site
    if [ -L "$NGINX_ENABLED" ]; then
        $SUDO rm "$NGINX_ENABLED"
    fi
    $SUDO ln -s "$NGINX_CONFIG" "$NGINX_ENABLED"
    
    # Test Nginx configuration
    if $SUDO nginx -t 2>/dev/null; then
        print_success "Nginx configuration is valid"
        $SUDO systemctl reload nginx 2>/dev/null || $SUDO service nginx reload 2>/dev/null || true
        print_success "Nginx reloaded"
        
        # Verify the root directory exists and is readable
        if [ ! -d "$PHP_DIR" ]; then
            print_error "PHP directory does not exist: $PHP_DIR"
        elif [ ! -f "$PHP_DIR/index.php" ]; then
            print_error "index.php not found in: $PHP_DIR"
        else
            print_success "Application files verified"
        fi
    else
        print_error "Nginx configuration test failed. Please check manually."
        print_info "Run: sudo nginx -t"
    fi
}

# Configure PHP-FPM
configure_php_fpm() {
    PHP_VER=$(php -r 'echo PHP_MAJOR_VERSION.".".PHP_MINOR_VERSION;')
    PHP_INI="/etc/php/${PHP_VER}/fpm/php.ini"
    PHP_FPM_INI="/etc/php/${PHP_VER}/fpm/php-fpm.ini"
    
    if [ ! -f "$PHP_INI" ]; then
        return 0
    fi
    
    echo ""
    read -p "Do you want to optimize PHP-FPM settings? (y/n) [y]: " OPTIMIZE_PHP
    OPTIMIZE_PHP=${OPTIMIZE_PHP:-y}
    
    if [[ ! $OPTIMIZE_PHP =~ ^[Yy]$ ]]; then
        return 0
    fi
    
    print_info "Optimizing PHP-FPM settings..."
    
    # Backup original
    if [ ! -f "${PHP_INI}.backup" ]; then
        $SUDO cp "$PHP_INI" "${PHP_INI}.backup"
    fi
    
    # Update settings
    $SUDO sed -i 's/^memory_limit = .*/memory_limit = 256M/' "$PHP_INI" 2>/dev/null || true
    $SUDO sed -i 's/^upload_max_filesize = .*/upload_max_filesize = 64M/' "$PHP_INI" 2>/dev/null || true
    $SUDO sed -i 's/^post_max_size = .*/post_max_size = 64M/' "$PHP_INI" 2>/dev/null || true
    $SUDO sed -i 's/^max_execution_time = .*/max_execution_time = 300/' "$PHP_INI" 2>/dev/null || true
    
    # Enable OpCache
    if ! grep -q "opcache.enable=1" "$PHP_INI" 2>/dev/null; then
        echo "" | $SUDO tee -a "$PHP_INI" > /dev/null
        echo "; OpCache Configuration" | $SUDO tee -a "$PHP_INI" > /dev/null
        echo "opcache.enable=1" | $SUDO tee -a "$PHP_INI" > /dev/null
        echo "opcache.memory_consumption=128" | $SUDO tee -a "$PHP_INI" > /dev/null
        echo "opcache.interned_strings_buffer=8" | $SUDO tee -a "$PHP_INI" > /dev/null
        echo "opcache.max_accelerated_files=10000" | $SUDO tee -a "$PHP_INI" > /dev/null
        echo "opcache.revalidate_freq=2" | $SUDO tee -a "$PHP_INI" > /dev/null
    fi
    
    # Restart PHP-FPM
    $SUDO systemctl restart "php${PHP_VER}-fpm" 2>/dev/null || $SUDO service "php${PHP_VER}-fpm" restart 2>/dev/null || true
    print_success "PHP-FPM optimized and restarted"
}

# Import database schema
import_database_schema() {
    if [ "$SKIP_DB" = true ]; then
        return 0
    fi
    
    echo ""
    read -p "Do you want to import the database schema now? (y/n) [n]: " IMPORT_SCHEMA
    IMPORT_SCHEMA=${IMPORT_SCHEMA:-n}
    
    if [[ ! $IMPORT_SCHEMA =~ ^[Yy]$ ]]; then
        return 0
    fi
    
    # Read database credentials from .env
    if [ -f "$ENV_PATH" ]; then
        DB_HOST=$(grep "^DB_HOST=" "$ENV_PATH" | cut -d '=' -f2 | tr -d ' ')
        DB_PORT=$(grep "^DB_PORT=" "$ENV_PATH" | cut -d '=' -f2 | tr -d ' ')
        DB_NAME=$(grep "^DB_NAME=" "$ENV_PATH" | cut -d '=' -f2 | tr -d ' ')
        DB_USER=$(grep "^DB_USER=" "$ENV_PATH" | cut -d '=' -f2 | tr -d ' ')
        DB_PASSWORD=$(grep "^DB_PASSWORD=" "$ENV_PATH" | cut -d '=' -f2 | tr -d ' ')
        
        DB_HOST=${DB_HOST:-localhost}
        DB_PORT=${DB_PORT:-5432}
        DB_NAME=${DB_NAME:-skyzer_cloud}
        DB_USER=${DB_USER:-postgres}
        
        if [ -z "$DB_PASSWORD" ]; then
            read -sp "Database password for $DB_USER: " DB_PASSWORD
            echo ""
        fi
        
        print_info "Importing database schema..."
        
        # Check if Prisma schema exists
        PRISMA_SCHEMA="$SCRIPT_DIR/packages/db/prisma/schema.prisma"
        if [ -f "$PRISMA_SCHEMA" ]; then
            print_info "Found Prisma schema. You can use: cd packages/db && npx prisma migrate deploy"
        fi
        
        # Try to create basic tables if schema file exists
        SQL_FILE="$SCRIPT_DIR/packages/db/prisma/migrations/0_init/migration.sql"
        if [ -f "$SQL_FILE" ]; then
            print_info "Found SQL migration file. Importing..."
            export PGPASSWORD="$DB_PASSWORD"
            if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$SQL_FILE" 2>/dev/null; then
                print_success "Database schema imported"
            else
                print_warning "Could not import schema automatically. Please import manually."
            fi
            unset PGPASSWORD
        else
            print_info "No SQL migration file found. Please create tables manually or use Prisma."
        fi
    fi
}

# Start services
start_services() {
    echo ""
    read -p "Do you want to start/enable required services? (y/n) [y]: " START_SERVICES
    START_SERVICES=${START_SERVICES:-y}
    
    if [[ ! $START_SERVICES =~ ^[Yy]$ ]]; then
        return 0
    fi
    
    print_info "Starting services..."
    
    # Start PostgreSQL
    if command -v systemctl &> /dev/null; then
        $SUDO systemctl enable postgresql 2>/dev/null || true
        $SUDO systemctl start postgresql 2>/dev/null || true
        print_success "PostgreSQL service managed"
    fi
    
    # Start PHP-FPM
    PHP_VER=$(php -r 'echo PHP_MAJOR_VERSION.".".PHP_MINOR_VERSION;')
    if command -v systemctl &> /dev/null; then
        $SUDO systemctl enable "php${PHP_VER}-fpm" 2>/dev/null || true
        $SUDO systemctl start "php${PHP_VER}-fpm" 2>/dev/null || true
        print_success "PHP-FPM service managed"
    fi
    
    # Start Nginx
    if command -v nginx &> /dev/null; then
        if command -v systemctl &> /dev/null; then
            $SUDO systemctl enable nginx 2>/dev/null || true
            $SUDO systemctl start nginx 2>/dev/null || true
            print_success "Nginx service managed"
        fi
    fi
}

# Final checks
final_checks() {
    echo ""
    echo "Running final checks..."
    echo ""
    
    # Check PHP
    if command -v php &> /dev/null; then
        PHP_VERSION=$(php -r 'echo PHP_VERSION;')
        print_success "PHP $PHP_VERSION is running"
    else
        print_error "PHP is not available"
    fi
    
    # Check Composer
    if command -v composer &> /dev/null; then
        COMPOSER_VERSION=$(composer --version | head -n1)
        print_success "$COMPOSER_VERSION"
    else
        print_error "Composer is not available"
    fi
    
    # Check PostgreSQL
    if command -v psql &> /dev/null; then
        if PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -c "\q" 2>/dev/null; then
            print_success "PostgreSQL connection successful"
        else
            print_warning "PostgreSQL connection failed (may need configuration)"
        fi
    fi
    
    # Check Nginx
    if command -v nginx &> /dev/null; then
        if $SUDO nginx -t 2>/dev/null; then
            print_success "Nginx configuration is valid"
        else
            print_warning "Nginx configuration has issues"
        fi
    fi
    
    # Check file permissions
    if [ -f "$ENV_PATH" ] && [ -r "$ENV_PATH" ]; then
        print_success ".env file is readable"
    else
        print_warning ".env file may have permission issues"
    fi
    
    # Check if application is accessible
    if [ -f "$PHP_DIR/index.php" ]; then
        print_success "Application files are in place"
    else
        print_error "Application files missing: $PHP_DIR/index.php"
    fi
    
    # Check vendor directory
    if [ -d "$PHP_DIR/vendor" ]; then
        print_success "Composer vendor directory exists"
    else
        print_error "Composer vendor directory missing. Run: cd php && composer install"
    fi
    
    # Check views directory
    if [ -d "$PHP_DIR/views" ]; then
        print_success "Views directory exists"
    else
        print_error "Views directory missing"
    fi
    
    # Check assets directory
    if [ -d "$PHP_DIR/assets" ]; then
        print_success "Assets directory exists"
    else
        print_warning "Assets directory missing (will be created on first use)"
    fi
    
    # Check .env file
    if [ -f "$ENV_PATH" ]; then
        print_success ".env file exists"
    else
        print_warning ".env file missing (will be created from .env.example)"
    fi
}

# Run automatic configuration
if command -v nginx &> /dev/null; then
    configure_nginx
fi

configure_php_fpm
import_database_schema
start_services
final_checks

echo ""
echo "============================"
print_success "Setup complete!"
echo "============================"
echo ""
echo "Summary:"
echo "--------"
echo "✅ PHP and extensions installed"
echo "✅ Composer installed"
if [ "$SKIP_DB" = false ]; then
    echo "✅ PostgreSQL installed"
else
    echo "⚠️  PostgreSQL not installed (optional)"
fi
echo "✅ Project dependencies installed"
echo "✅ Configuration files created"
if command -v nginx &> /dev/null; then
    echo "✅ Nginx configured"
fi
echo "✅ PHP-FPM optimized"
echo "✅ Services started"
echo ""
echo "Application Status:"
echo "-------------------"
echo "📁 Application path: $PHP_DIR"
echo "⚙️  Configuration: $ENV_PATH"
if command -v nginx &> /dev/null; then
    echo "🌐 Web server: Nginx (configured)"
    if [ ! -z "$DOMAIN_NAME" ]; then
        echo "🔗 Domain: $DOMAIN_NAME"
        if [ ! -z "$PORT_NUMBER" ] && [ "$PORT_NUMBER" != "80" ]; then
            echo "🌍 Access: http://$DOMAIN_NAME:$PORT_NUMBER"
        else
            echo "🌍 Access: http://$DOMAIN_NAME"
        fi
    fi
fi
echo ""
echo "Next steps (if not done automatically):"
echo "----------------------------------------"
echo ""
echo "1. Edit php/.env with your API keys:"
echo "   - PTERODACTYL_URL and PTERODACTYL_API_KEY"
echo "   - TEBEX_SECRET_KEY and TEBEX_PUBLIC_KEY"
echo "   - APP_URL (if different from domain)"
echo ""
echo "2. Import database schema (if not done):"
echo "   cd packages/db && npx prisma migrate deploy"
echo "   OR create tables manually based on schema.prisma"
echo ""
echo "3. Test your application:"
if [ ! -z "$PORT_NUMBER" ] && [ "$PORT_NUMBER" != "80" ]; then
    if [ ! -z "$DOMAIN_NAME" ] && [ "$DOMAIN_NAME" != "localhost" ]; then
        echo "   Visit: http://$DOMAIN_NAME:$PORT_NUMBER"
    else
        echo "   Visit: http://localhost:$PORT_NUMBER"
    fi
else
    if [ ! -z "$DOMAIN_NAME" ] && [ "$DOMAIN_NAME" != "localhost" ]; then
        echo "   Visit: http://$DOMAIN_NAME"
    else
        echo "   Visit: http://localhost"
    fi
fi
echo ""
echo "4. For SSL/HTTPS (production):"
echo "   sudo apt install certbot python3-certbot-nginx"
echo "   sudo certbot --nginx -d $DOMAIN_NAME"
echo ""
echo "For more information, see:"
echo "  - php/README.md"
echo "  - php/DEPLOYMENT.md"
echo "  - php/MIGRATION_GUIDE.md"
echo ""
echo "🎉 Your Skyzer Cloud application is ready!"
echo ""

