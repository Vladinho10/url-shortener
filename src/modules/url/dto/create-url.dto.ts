import { IsNumber, IsString, IsUrl } from 'class-validator';

export class CreateUrlDto {
  @IsString()
  @IsUrl()
  originalUrl: string;

  slug?: string;
}
