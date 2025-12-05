import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { PrismaService } from '../../common/services/prisma.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { PteroService } from '../ptero/ptero.service';
import { AuthTokens, UserDto } from '@skyzer/shared';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly pteroService: PteroService,
  ) {}

  async register(registerDto: RegisterDto) {
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
    } catch (error) {
      this.logger.error(
        `Failed to create Pterodactyl user for ${user.id}: ${error.message}`,
      );
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

  async login(loginDto: LoginDto) {
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

  async refresh(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const tokens = await this.generateTokens(user.id, user.email);

    return tokens;
  }

  async verifyToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private async generateTokens(userId: string, email: string): Promise<AuthTokens> {
    const accessToken = this.jwtService.sign(
      {
        sub: userId,
        email,
      },
      {
        expiresIn: '1h',
      },
    );

    const refreshToken = this.jwtService.sign(
      {
        sub: userId,
        email,
      },
      {
        expiresIn: '7d',
      },
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  private mapUserToDto(user: any): UserDto {
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
}
