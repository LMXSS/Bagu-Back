import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { AuthDto } from './auth.dto';

export class AuthRegisterDto extends AuthDto {
  @ApiProperty({
    example: 'John',
    description: 'Primeiro nome do usuário',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Sobrenome do usuário',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example: '1990-05-20',
    description: 'Data Nascimento',
  })
  @IsString()
  @IsNotEmpty()
  birthdate: string;
}
