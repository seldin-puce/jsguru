import {
  HttpException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(authDto: RegisterDto) {
    const {
      email,
      password,
      firstName,
      lastName,
      phoneNumber: phone,
    } = authDto;
    const foundUser = await this.prisma.user.findUnique({ where: { email } });

    if (foundUser) {
      throw new HttpException('Email already taken', 400);
    }

    const newUser = await this.createUser(
      email,
      password,
      firstName,
      lastName,
      phone,
    );
  }

  async login(user: any) {
    const tokens = await this.generateTokens(user.id, user.email, user.phone);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    this.logger.log('JWT issued for:', user);
    return {
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
    };
  }

  async refreshToken(refreshToken: string) {
    const { username } = await this.verifyRefreshToken(refreshToken);
    const user = await this.prisma.user.findUnique({
      where: { email: username },
    });
    if (!user || !user.refreshToken)
    throw new HttpException('Access Denied', 403);
    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (!refreshTokenMatches) throw new HttpException('Access Denied', 403);
    const { accessToken } = await this.generateTokens(
      user.id,
      user.email,
      user.phone,
    );
    return { accessToken };
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.getUserByEmail(username);
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) {
      return null;
    }
    const { password, ...result } = user;

    return result;
  }

  async logout(userId: number) {
    this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  private async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedRefreshToken },
    });
  }

  private async generateTokens(
    userId: number,
    email: string,
    phoneNumber: string,
  ) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username: email,
          phoneNumber: phoneNumber,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '10m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username: email,
          phoneNumber: phoneNumber,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async createUser(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
  ) {
    const hashedPassword = await this.hashData(password);

    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone: phoneNumber,
      },
    });
  }

  private async getUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  private async verifyRefreshToken(refreshToken: string) {
    return this.jwtService.verifyAsync(refreshToken, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });
  }

  private async hashData(password: string): Promise<string> {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }
}
