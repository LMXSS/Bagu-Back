import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class AuthDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'E-mail do usuário. Obrigatório para método "password"',
    required: false,
  })
  @IsString()
  @IsOptional()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Senha do usuário. Obrigatório para método "password"',
    required: false,
  })
  @IsString()
  @IsOptional()
  password: string;
}
