import { IsString, IsUrl } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/entities/user.entity';

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

  @Column({ default: 0 })
  clicks: number;

  @ManyToOne(() => User, user => user.urls)
  @JoinColumn({ name: 'userId' }) // Explicit column name
  user: User;

  @Column() // Add this column
  userId: number;
}
