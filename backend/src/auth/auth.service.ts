import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dtos/register-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { UpdateProfileDto } from './dtos/update-profile.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) { }

  async validateUser(loginUser: LoginUserDto) {
    const user = await this.usersRepository.findOneBy({
      username: loginUser.username,
    });
    if (!user) return null;

    const ok = await bcrypt.compare(loginUser.password, user.password);
    return ok ? user : null;
  }

  async login(user: User) {
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      email: user.email,
      phone: user.phone,
      accessToken: this.jwtService.sign(payload),
    };
  }

  async register(registerUser: RegisterUserDto) {
    try {
      console.log('AUTH.register called with:', { username: registerUser.username, role: registerUser.role, fullName: registerUser.fullName });
      const user = this.usersRepository.create({
        username: registerUser.username,
        password: bcrypt.hashSync(registerUser.password, 10),
        role: registerUser.role || 'DANISAN',
        fullName: registerUser.fullName,
        email: registerUser.email,
        phone: registerUser.phone,
      });
      console.log('AUTH.user created, about to save:', user);
      const saved = await this.usersRepository.save(user);
      console.log('AUTH.user saved successfully:', saved);
      return saved;
    } catch (error) {
      console.error('AUTH.register error:', error);
      throw error;
    }
  }

  async updateProfile(userId: number, updateDto: UpdateProfileDto) {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('User not found');
    }

    if (updateDto.fullName) user.fullName = updateDto.fullName;
    if (updateDto.email) user.email = updateDto.email;
    if (updateDto.phone) user.phone = updateDto.phone;

    if (updateDto.password) {
      user.password = bcrypt.hashSync(updateDto.password, 10);
    }

    const updated = await this.usersRepository.save(user);

    const { password, ...result } = updated;
    return result;
  }

  async deleteOwnAccount(userId: number) {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('User not found');
    }

    if (user.role === 'ADMIN') {
      throw new Error('Admin users cannot delete their own account');
    }

    await this.usersRepository.delete(userId);
    return { message: 'Account deleted successfully' };
  }

  async listUsers() {
    return this.usersRepository.find({
      select: ['id', 'username', 'fullName', 'role', 'email', 'phone'],
    });
  }

  async listClients() {
    console.log('LOG_CLIENTS: Calling listClients');
    const clients = await this.usersRepository.find({
      where: { role: 'DANISAN' },
      select: ['id', 'username', 'fullName', 'email', 'phone'],
    });
    console.log('LOG_CLIENTS:', clients);
    return clients;
  }

  async listDietitians() {
    return this.usersRepository.find({
      where: { role: 'DIYETISYEN' },
      select: ['id', 'username', 'fullName', 'email', 'phone'],
    });
  }

  async deleteUser(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new Error('User not found');
    }

    // Prevent deleting admin users
    if (user.role === 'ADMIN') {
      throw new Error('Cannot delete admin users');
    }

    await this.usersRepository.delete(id);
    return { message: 'User deleted successfully', deletedUserId: id };
  }

  async seedAdmin() {
    const adminUser = this.usersRepository.create({
      username: 'admin',
      password: bcrypt.hashSync('admin123', 10),
      role: 'ADMIN',
      fullName: 'Administrator',
      email: 'admin@example.com',
      phone: '1234567890',
    });
    try {
      return await this.usersRepository.save(adminUser);
    } catch (error) {
      return { message: 'Admin already exists or error', error: error.message };
    }
  }
}