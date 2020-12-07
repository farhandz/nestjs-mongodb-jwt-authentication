import {
  Controller,
  Get,
  Req,
  Res,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, from } from 'rxjs';
import { Item, UserRole } from '../model/item.interface';
import { ItemService } from '../service/item.service';
import { map } from 'rxjs/operators';
import { JwtAuthGuard } from 'src/guard/jwt-guard';
import { RolesGuard } from 'src/guard/roles.guard';
import { hasRoles } from 'src/decorator/roles.decorator';

@Controller('item')
export class ItemController {
  constructor(private readonly itemsService: ItemService) {}
  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findall(): Observable<Item[]> {
    return from(this.itemsService.getAllData());
  }
  @Post()
  create(@Body() item: Item): Observable<Item> {
    return from(this.itemsService.createData(item));
  }
  @Get(':id')
  findById(@Param() Param): Observable<Item> {
    return from(this.itemsService.findone(Param.id));
  }
  @Delete(':id')
  deleteOne(@Param() Param): Observable<Item | any> {
    return from(this.itemsService.delete(Param.id));
  }

  @Put(':id')
  update(@Param() Param, @Body() item: Item): Observable<Item> {
    return from(this.itemsService.update(Param.id, item));
  }

  @Post('login')
  login(@Body() item: Item): Observable<any> {
    return from(this.itemsService.login(item)).pipe(
      map((jwt: string) => {
        return { acess_token: jwt };
      }),
    );
  }
}
