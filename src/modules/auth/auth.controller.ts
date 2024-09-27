import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthDto } from './dto/auth.dto';

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'User registration' })
  @Post('register')
  register(@Body() body: AuthDto) {
    return this.authService.register(body);
  }

  @ApiOperation({ summary: 'User log in' })
  @Post('login')
  login(@Body() body: AuthDto) {
    return this.authService.login(body);
  }
}
