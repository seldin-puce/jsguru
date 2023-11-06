import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RegisterDto } from './dto/auth.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('AuthController', () => {
    let controller: AuthController;
    let authService: AuthService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                AuthService,
                PrismaService,
                JwtService,
                ConfigService,
                {
                    provide: PrismaService,
                    useValue: {
                        user: {
                            findUnique: jest.fn(),
                            create: jest.fn(),
                        },
                    },
                },
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    describe('signUp', () => {
        it('shouldn\'t create new user because email is taken', async () => {
            const registerDto: RegisterDto = {
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                phoneNumber: '',
            };
            const user = {
                id: 1,
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                phone: '',
                refreshToken: '',
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(user);
            await expect(controller.signUp(registerDto)).rejects.toThrow();
        });
    }); 
});
