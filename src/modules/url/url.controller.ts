import { Controller, Post, Body, Get, Param, Res, Req, UseGuards } from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Throttle } from '@nestjs/throttler';

@Controller('urls')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
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

  @Get()
  async findAll() {
    return this.urlService.findAll();
  }

  @Get('stats/popular')
  @UseGuards(JwtAuthGuard)
  async getPopularUrls(@Req() req: Request) {
    const userId = (req as any).user.id;
    return this.urlService.getPopularUrls(userId);
  }
}
