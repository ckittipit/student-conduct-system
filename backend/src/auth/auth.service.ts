import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

interface GoogleUser {
    googleId: string;
    email: string;
    name: string;
    image: string;
}

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
    ) {}

    async handleGoogleLogin(googleUser: GoogleUser) {
        // หา user จาก googleId — ถ้าไม่มีให้สร้างใหม่
        let user = await this.prisma.user.findUnique({
            where: { googleId: googleUser.googleId },
        });

        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    googleId: googleUser.googleId,
                    email: googleUser.email,
                    name: googleUser.name,
                    image: googleUser.image,
                    role: Role.TEACHER,
                },
            });
        }

        const token = this.jwt.sign({
            sub: user.id,
            email: user.email,
            role: user.role,
        });

        return { accessToken: token, user };
    }
}