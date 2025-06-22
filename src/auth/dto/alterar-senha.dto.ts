import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AlterarSenhaDto {
  @ApiProperty({
    example: 'nsdahkuhlkasgwhkhsakjfhdskjfbhsdjh',
    description: 'hash enviada para o email do usuário',
  })
  @IsString()
  @IsNotEmpty()
  hash: string;

  @ApiProperty({
    example: '******',
    description: 'nova senha do usuário',
  })
  @IsString()
  @IsNotEmpty()
  senha: string;
}
