import { Controller, Post, Body, Get, Param, Res, Req, UseGuards, Patch, BadRequestException } from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Throttle } from '@nestjs/throttler';
import { RequestWithUser } from '../auth/request-with-user.interface';

@Controller('urls')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @UseGuards(JwtAuthGuard)
  async create(@Body() createUrlDto: CreateUrlDto, @Req() req: RequestWithUser) {    
    const url = await this.urlService.create(createUrlDto, req.user.id);
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
  @UseGuards(JwtAuthGuard)
  async findAll(@Req() req: RequestWithUser) {    
    return this.urlService.findAll(req.user.id);
  }

  @Get('stats/popular')
  @UseGuards(JwtAuthGuard)
  async getPopularUrls(@Req() req: Request) {
    const userId = (req as any).user.id;
    return this.urlService.getPopularUrls(userId);
  }

  @Patch(':id/slug')
  @UseGuards(JwtAuthGuard)
  async updateSlug(
    @Param('id') id: number,
    @Body('slug') newSlug: string,
    @Req() req: RequestWithUser,
  ) {
    try {
      const url = await this.urlService.updateSlug(id, req.user.id, newSlug);
      return {
        success: true,
        shortUrl: `${process.env.DOMAIN || 'http://localhost:3000'}/${url.slug}`,
        url,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
