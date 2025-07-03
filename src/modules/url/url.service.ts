import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Url } from './url.entity';
import { CreateUrlDto } from './dto/create-url.dto';

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(Url)
    private readonly urlRepository: Repository<Url>,
  ) {}

  async create(createUrlDto: CreateUrlDto): Promise<Url> {
    let slug: string;
    let exists: Url | undefined;
    do {
      slug = this.generateSlug();
      exists = await this.urlRepository.findOne({ where: { slug } });
    } while (exists);

    const url = this.urlRepository.create({
      originalUrl: createUrlDto.originalUrl,
      slug,
    });
    return this.urlRepository.save(url);
  }

  async findBySlug(slug: string): Promise<Url> {
    const url = await this.urlRepository.findOne({ where: { slug } });
    console.log('Finding URL by slug:', slug, 'Result:', url);

    if (!url) throw new NotFoundException('Short URL not found');
    return url;
  }

  async findAll(): Promise<Url[]> {
    return this.urlRepository.find();
  }

  private generateSlug(length = 6): string {
    const chars =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let slug = '';
    for (let i = 0; i < length; i++) {
      slug += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return slug;
  }
}
