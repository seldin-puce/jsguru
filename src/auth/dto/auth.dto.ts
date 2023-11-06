import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumberString, IsPhoneNumber, IsStrongPassword } from "class-validator";

export class AuthDto {
    @ApiProperty()
    @IsEmail({}, { message: "Email is invalid"})
    @IsNotEmpty({message: "Email is required"})
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }, { message: "Password is too weak" })
    password: string;
}


export class RegisterDto extends AuthDto {
    @ApiProperty()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty()
    @IsNumberString()
    phoneNumber: string;
}

export class LoginDto extends AuthDto { }



