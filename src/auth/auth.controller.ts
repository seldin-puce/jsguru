import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto/auth.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { SkipAuth } from '../common/decorators/skip-auth';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { IGetUserAuthInfoRequest } from './interface/get-user-auth-info.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Sign up' })
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
  @Post('signup')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @ApiOperation({
    summary: 'Sign in',
  })
  @ApiBody({
    type: SignInDto,
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
  @Post('signin')
  @UseGuards(LocalAuthGuard)
  signIn(@Request() req) {
    return this.authService.signIn(req.user);
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
  @Post('refresh-token')
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
