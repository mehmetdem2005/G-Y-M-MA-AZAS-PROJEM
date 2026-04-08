import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { validatePassword } from '../common/password-policy';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(dto: { email: string; password: string; firstName?: string; consentKVKK: boolean }) {
    if (!dto.consentKVKK) throw new BadRequestException('KVKK aydınlatma metni onaylanmalı.');

    const passwordCheck = validatePassword(dto.password);
    if (!passwordCheck.valid) {
      throw new BadRequestException(passwordCheck.reason);
    }

    const email = dto.email.toLowerCase().trim();
    const exists = await this.prisma.user.findUnique({ where: { email } });
    if (exists) throw new BadRequestException('E-posta zaten kullanımda.');

    const hash = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: { email, passwordHash: hash, firstName: dto.firstName, consentKVKK: true },
    });

    return this.generateTokens(user.id);
  }

  async login(dto: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase().trim() } });
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Geçersiz kimlik bilgileri.');
    }

    return this.generateTokens(user.id);
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwt.verify<{ sub: string }>(refreshToken, { secret: process.env.JWT_REFRESH_SECRET });
      return this.generateTokens(payload.sub);
    } catch {
      throw new UnauthorizedException('Geçersiz veya süresi dolmuş refresh token.');
    }
  }

  private generateTokens(userId: string) {
    const accessToken = this.jwt.sign({ sub: userId }, { expiresIn: '15m' });
    const refreshToken = this.jwt.sign(
      { sub: userId },
      { expiresIn: '7d', secret: process.env.JWT_REFRESH_SECRET },
    );

    return { accessToken, refreshToken };
  }
}
