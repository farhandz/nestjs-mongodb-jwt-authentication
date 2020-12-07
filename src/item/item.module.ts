import { Module } from '@nestjs/common';
import { ItemService } from './service/item.service';
import { ItemController } from './controllers/item.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { IiemShema } from '../item/model/item.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Item', schema: IiemShema }]),
    AuthModule,
  ],
  providers: [ItemService],
  controllers: [ItemController],
})
export class ItemModule {}
