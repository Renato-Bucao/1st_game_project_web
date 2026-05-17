import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/gaurds/jwt-auth.guard';
import { RolesGuard } from '../auth/gaurds/roles.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  @Roles('admin')
  @Get('dashboard')
  getAdminDashboard() {
    return { message: 'Welcome Admin!' };
  }
}
