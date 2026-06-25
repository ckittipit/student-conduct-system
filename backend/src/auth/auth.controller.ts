import { Controller, Get, Post, Body, Req, Res, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
// import { OAuth2Client} from 'google-auth-library'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    // private googleClient: OAuth2Client;

    constructor(
        private authService: AuthService,
        private config: ConfigService,
    ) {}

    // รับ Google id_token จาก NextAuth แล้วแลกเป็น JWT ของระบบ
    @Post('google/token')
    @ApiOperation({ summary: 'Exchange Google id_token for system JWT' })
    async exchangeToken(@Body('accessToken') accessToken: string) {
        try {
            // เรียก Google userinfo API เพื่อยืนยัน token และดึงข้อมูล user
            const res = await fetch(
                'https://www.googleapis.com/oauth2/v2/userinfo',
                { headers: { Authorization: `Bearer ${accessToken}` } },
            );

            if (!res.ok) throw new UnauthorizedException('Invalid Google token');

            const profile = await res.json();

            return this.authService.handleGoogleLogin({
                googleId: profile.id,
                email: profile.email,
                name: profile.name,
                image: profile.picture ?? '',
            });
        } catch {
            throw new UnauthorizedException('Invalid Google token');
        }
    }




    @Get('google')
    @UseGuards(AuthGuard('google'))
    @ApiOperation({ summary: 'Redirect to Google login' })
    googleLogin() {}

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    @ApiOperation({ summary: 'Google OAuth callback' })
    async googleCallback(@Req() req: Request, @Res() res: Response) {
        const { accessToken } = await this.authService.handleGoogleLogin(
            req.user as any,
        );
        const frontendUrl = this.config.get('FRONTEND_URL', 'http://localhost:3000');
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