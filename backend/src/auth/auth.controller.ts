import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dtos/register-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './roles.guard';
import { Role } from './role.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async login(@Body(ValidationPipe) loginUser: LoginUserDto) {
    const user = await this.authService.validateUser(loginUser);
    if (!user) throw new UnauthorizedException('Wrong username or password');

    return this.authService.login(user);
  }

  @Post('register')
  create(@Body(ValidationPipe) registerUser: RegisterUserDto) {
    return this.authService.register(registerUser);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('profile')
  updateProfile(@Body(ValidationPipe) updateDto: UpdateProfileDto, @Request() req) {
    return this.authService.updateProfile(req.user.id, updateDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('profile')
  deleteOwnAccount(@Request() req) {
    return this.authService.deleteOwnAccount(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Role('DIYETISYEN')
  @Get('clients')
  listClients() {
    return this.authService.listClients();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Role('DANISAN')
  @Get('dietitians')
  listDietitians() {
    return this.authService.listDietitians();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Role('ADMIN')
  @Get('users')
  listAllUsers() {
    console.log('Fetching all users for admin...');
    return this.authService.listUsers();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Role('ADMIN')
  @Delete('users/:id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.authService.deleteUser(id);
  }
}