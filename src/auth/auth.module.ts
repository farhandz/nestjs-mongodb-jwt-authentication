import { Module, forwardRef } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './service/auth.service';
import { ItemModule } from 'src/item/item.module';
import { RolesGuard } from 'src/guard/roles.guard';
import { JwtAuthGuard } from 'src/guard/jwt-guard';
import { JwtStrategy } from 'src/guard/jwt-starategy';
@Module({
  imports: [
    forwardRef(() => ItemModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (ConfigService: ConfigService) => ({
        secret: ConfigService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1000s' },
      }),
    }),
  ],
  providers: [AuthService, JwtAuthGuard, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
