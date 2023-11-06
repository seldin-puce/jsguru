import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { SkipAuth } from '../common/decorators/skip-auth';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { IGetUserAuthInfoRequest } from './interface/get-user-auth-info.interface';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register' })
  @ApiResponse({
    status: 201,
    description: 'Created',
    schema: {
      example: {
        message: 'Signup was successful',
      },
    },
  })
  @SkipAuth()
  @Post('/user/register')
  signUp(@Body() signUpDto: RegisterDto) {
    return this.authService.register(signUpDto);
  }

  @ApiOperation({
    summary: 'Login',
  })
  @ApiBody({
    type: LoginDto,
  })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        access_token: '<your access token>',
      },
    },
  })
  @SkipAuth()
  @Post('/user/login')
  @UseGuards(LocalAuthGuard)
  signIn(@Request() req) {
    return this.authService.login(req.user);
  }

  @ApiOperation({
    summary: 'Refresh access token',
  })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        access_token: '<your new access token>',
      },
    },
  })
  @SkipAuth()
  @Post('auth/refresh-token')
  refreshAccessToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  @ApiOperation({ summary: 'Log out' })
  @ApiResponse({
    status: 200,
    description: 'Log out user, delete refresh token',
    schema: {
      example: {
        message: 'Logged out successfully',
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('logout')
  logout(@Request() req: IGetUserAuthInfoRequest) {
    return this.authService.logout(req.user);
  }
}
