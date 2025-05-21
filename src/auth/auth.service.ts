import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService, // Injects JWT service for token operations
    private prisma: PrismaService   // Injects Prisma service for DB access
  ) {}

  // Validates user credentials
  async validateUser(email: string, pass: string) {
    // Find user by email
    const user = await this.prisma.user.findUnique({ where: { email } });
    // If user exists and password matches
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user; // Exclude password from result
      return result; // Return user data without password
    }
    // Throw error if credentials are invalid
    throw new UnauthorizedException('Invalid credentials');
  }

  // Generates JWT token for authenticated user
  async login(user: any) {
    const payload = { sub: user.id, email: user.email }; // JWT payload
    return {
      access_token: this.jwtService.sign(payload), // Sign and return token
    };
  }
}
