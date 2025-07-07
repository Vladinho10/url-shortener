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

  async create(createUrlDto: CreateUrlDto, userId: number): Promise<Url> {
    let slug: string;
    let exists: Url | undefined;
    do {
      if (createUrlDto.slug) {
        slug = createUrlDto.slug;
        createUrlDto.slug = null;
      } else {
        slug = this.generateSlug();
      }
      exists = await this.urlRepository.findOne({ where: { slug } });
    } while (exists);

    const url = this.urlRepository.create({
      originalUrl: createUrlDto.originalUrl,
      slug,
      userId,
    });
    return this.urlRepository.save(url);
  }

  async findBySlug(slug: string): Promise<Url> {
    const url = await this.urlRepository.findOne({ where: { slug } });
    console.log('Finding URL by slug:', slug, 'Result:', url);

    if (!url) throw new NotFoundException('Short URL not found');
    return url;
  }

  async findAll(userId: number): Promise<Url[]> {
    console.log('userId', userId);
    
    return this.urlRepository.find({ where: { user: { id: userId } }, relations: ['user'] });
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

  async getPopularUrls(userId: number) {
    return this.urlRepository.find({ where: { user: { id: userId } } });  
  }

  async updateSlug(id: number, userId: number, newSlug: string): Promise<Url> {
  // Check if slug is available
    const existingUrl = await this.urlRepository.findOne({ 
      where: { slug: newSlug } 
    });
    
    if (existingUrl && existingUrl.id !== id) {
      throw new Error('Slug is already in use');
    }

    // Verify user owns the URL
    const url = await this.urlRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!url) {
      throw new Error('URL not found or you do not have permission');
    }

    // Update the slug
    url.slug = newSlug;
    return this.urlRepository.save(url);
  }
}
