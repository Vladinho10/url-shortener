import { IsString, IsUrl } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Url {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  @IsString()
  @IsUrl()
  originalUrl: string;

  @Column({ type: 'varchar', unique: true, length: 50 })
  slug: string;
}
