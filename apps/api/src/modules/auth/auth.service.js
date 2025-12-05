var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import * as argon2 from 'argon2';
let AuthService = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AuthService = _classThis = class {
        constructor(prisma, jwtService, configService, pteroService) {
            this.prisma = prisma;
            this.jwtService = jwtService;
            this.configService = configService;
            this.pteroService = pteroService;
            this.logger = new Logger(AuthService.name);
        }
        async register(registerDto) {
            this.logger.debug(`Attempting registration for email: ${registerDto.email}`);
            // Check if user exists
            const existingUser = await this.prisma.user.findUnique({
                where: { email: registerDto.email },
            });
            if (existingUser) {
                throw new ConflictException('User with this email already exists');
            }
            // Hash password
            const passwordHash = await argon2.hash(registerDto.password);
            // Create user in database
            const user = await this.prisma.user.create({
                data: {
                    email: registerDto.email,
                    passwordHash,
                    firstName: registerDto.firstName,
                    lastName: registerDto.lastName,
                },
            });
            this.logger.log(`User created: ${user.id}`);
            // Create Pterodactyl user (async, with error handling)
            try {
                const pteroUser = await this.pteroService.createUser({
                    email: registerDto.email,
                    username: registerDto.email.split('@')[0],
                    password: registerDto.password,
                    firstName: registerDto.firstName,
                    lastName: registerDto.lastName,
                });
                // Update user with Pterodactyl ID
                await this.prisma.user.update({
                    where: { id: user.id },
                    data: {
                        pteroUserId: pteroUser.id,
                        pteroUsername: pteroUser.username,
                    },
                });
                this.logger.log(`Pterodactyl user created: ${pteroUser.id} for user ${user.id}`);
            }
            catch (error) {
                this.logger.error(`Failed to create Pterodactyl user for ${user.id}: ${error.message}`);
                // User account is created but Pterodactyl sync failed
                // This can be retried later via admin panel
            }
            // Generate tokens
            const tokens = await this.generateTokens(user.id, user.email);
            return {
                user: this.mapUserToDto(user),
                tokens,
            };
        }
        async login(loginDto) {
            this.logger.debug(`Attempting login for email: ${loginDto.email}`);
            const user = await this.prisma.user.findUnique({
                where: { email: loginDto.email },
            });
            if (!user) {
                throw new UnauthorizedException('Invalid credentials');
            }
            // Verify password
            const isPasswordValid = await argon2.verify(user.passwordHash, loginDto.password);
            if (!isPasswordValid) {
                throw new UnauthorizedException('Invalid credentials');
            }
            // Update last login
            await this.prisma.user.update({
                where: { id: user.id },
                data: { lastLoginAt: new Date() },
            });
            // Generate tokens
            const tokens = await this.generateTokens(user.id, user.email);
            return {
                user: this.mapUserToDto(user),
                tokens,
            };
        }
        async refresh(userId) {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
            });
            if (!user) {
                throw new UnauthorizedException('User not found');
            }
            const tokens = await this.generateTokens(user.id, user.email);
            return tokens;
        }
        async verifyToken(token) {
            try {
                const payload = this.jwtService.verify(token);
                return payload;
            }
            catch (error) {
                throw new UnauthorizedException('Invalid token');
            }
        }
        async generateTokens(userId, email) {
            const accessToken = this.jwtService.sign({
                sub: userId,
                email,
            }, {
                expiresIn: '1h',
            });
            const refreshToken = this.jwtService.sign({
                sub: userId,
                email,
            }, {
                expiresIn: '7d',
            });
            return {
                accessToken,
                refreshToken,
            };
        }
        mapUserToDto(user) {
            return {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                isEmailVerified: user.isEmailVerified,
                twoFactorEnabled: user.twoFactorEnabled,
                createdAt: user.createdAt.toISOString(),
            };
        }
    };
    __setFunctionName(_classThis, "AuthService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuthService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuthService = _classThis;
})();
export { AuthService };
//# sourceMappingURL=auth.service.js.map