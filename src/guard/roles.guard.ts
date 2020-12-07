import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { map } from 'rxjs/operators';
import { ItemService } from 'src/item/service/item.service';
import { Item } from 'src/item/model/item.interface';
import { hasRoles } from 'src/decorator/roles.decorator';
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(forwardRef(() => ItemService)) private userService: ItemService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user: Item = request.user.user.item;
    console.log(user);
    return this.userService.findone(user._id).pipe(
      map((user: Item) => {
        const hasRole = () => roles.indexOf(user.role) > -1;
        let hasPermision = false;
        console.log('inin', hasRole());
        if (hasRoles()) {
          hasPermision = true;
        }
        return user && hasPermision;
      }),
    );
  }
}
