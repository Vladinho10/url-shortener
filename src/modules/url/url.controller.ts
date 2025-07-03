import { Controller, Post, Body, Get, Param, Res } from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { Response } from 'express';

@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('shorten')
  async create(@Body() createUrlDto: CreateUrlDto) {
    const url = await this.urlService.create(createUrlDto);
    return {
      shortUrl: `${process.env.DOMAIN || 'http://localhost:3000'}/${url.slug}`,
      ...url,
    };
  }

  @Get(':slug')
  async redirect(@Param('slug') slug: string, @Res() res: Response) {
    try {
      const url = await this.urlService.findBySlug(slug);
      return res.redirect(url.originalUrl);
    } catch {
      return res.status(404).send({ mess: '404 Not Found' });
    }
  }

  @Get('api/urls')
  async findAll() {
    return this.urlService.findAll();
  }
}
