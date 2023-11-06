import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { HttpException } from '@nestjs/common';



    @Catch()
    export class AllExceptionsFilter implements ExceptionFilter {
        catch(exception: unknown, host: ArgumentsHost) {
            const ctx = host.switchToHttp();
            const response = ctx.getResponse();
            const status = exception instanceof HttpException ? exception.getStatus() : 500;

            response.status(status).json({
                statusCode: status,
                message: (exception instanceof HttpException) ? exception.message : 'Internal server error',
            });
        }
    }
