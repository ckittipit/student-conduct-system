import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private config: ConfigService,
    ) {}

    // Step 1: frontend เรียก endpoint นี้ → redirect ไป Google
    @Get('google')
    @UseGuards(AuthGuard('google'))
    @ApiOperation({ summary: 'Redirect to Google login' })
    googleLogin() {}

    // Step 2: Google redirect กลับมาที่นี่
    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    @ApiOperation({ summary: 'Google OAuth callback' })
    async googleCallback(@Req() req: Request, @Res() res: Response) {
        const { accessToken } = await this.authService.handleGoogleLogin(
            req.user as any,
        );

        const frontendUrl = this.config.get('FRONTEND_URL', 'http://localhost:3000');
        // ส่ง token กลับ frontend ผ่าน query param
        res.redirect(`${frontendUrl}/auth/callback?token=${accessToken}`);
    }

  // ดึงข้อมูล user ปัจจุบัน (ต้องมี JWT)
    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Get current user' })
    getMe(@Req() req: Request) {
        return req.user;
    }
}