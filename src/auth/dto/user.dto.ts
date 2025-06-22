import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UserDto {
  @ApiProperty({ example: '123456', description: 'ID do usuário no banco de dados' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ example: 'João', description: 'Primeiro nome do usuário' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Silva', description: 'Sobrenome do usuário' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: '1990-05-20', description: 'Data de nascimento do usuário (YYYY-MM-DD)' })
  @IsString()
  @IsNotEmpty()
  birthdate: string;

  @ApiProperty({ example: 'joao@email.com', description: 'Endereço de e-mail do usuário' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'abc123firebase', description: 'ID do usuário no Firebase' })
  @IsString()
  @IsNotEmpty()
  firebaseId: string;
}
