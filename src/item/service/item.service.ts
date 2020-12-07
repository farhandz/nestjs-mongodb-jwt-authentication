import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Item, UserRole } from '../model/item.interface';
import { Observable, from, throwError } from 'rxjs';
import { AuthService } from 'src/auth/service/auth.service';
import { switchMap, map } from 'rxjs/operators';
import { IiemShema } from '../model/item.schema';
import { match } from 'assert';

@Injectable()
export class ItemService {
  constructor(
    @InjectModel('Item') private readonly itemModel: Model<Item>,
    private authServie: AuthService,
  ) {}
  getAllData(): Observable<Item[]> {
    return from(this.itemModel.find());
  }
  createData(item: Item): Observable<Item | any> {
    return this.authServie.hasHpasswor(item.password).pipe(
      switchMap((hassPassword: string) => {
        item.name = item.name;
        item.jenis = item.jenis;
        item.description = item.description;
        item.email = item.email;
        item.password = hassPassword;
        item.role = UserRole.USER;
        return from(this.itemModel.create(item)).pipe(
          map((item: Item) => {
            return {
              message: 'berhasil insert',
              name: item.name,
              email: item.email,
              id: item.id,
            };
          }),
        );
      }),
    );
  }
  findone(id: string): Observable<Item | any> {
    return from(this.itemModel.findById({ _id: id })).pipe(
      map((item: Item) => {
        delete item.password;
        return {
          message: 'berhasil get id data',
          item: item,
        };
      }),
    );
  }
  delete(id: string): Observable<Item | any> {
    return from(this.itemModel.deleteOne({ _id: id }));
  }

  update(id: string, item: Item): Observable<Item | any> {
    return from(this.itemModel.findByIdAndUpdate(id, item, { new: true })).pipe(
      map((item: Item) => {
        return {
          message: 'berhasil update data',
          name: item.name,
          email: item.email,
          description: item.description,
        };
      }),
    );
  }
  findByEmail(email: string): Observable<Item> {
    return from(this.itemModel.findOne({ email: email }));
  }
  validateUser(email: string, password: string): Observable<Item> {
    return this.findByEmail(email).pipe(
      switchMap((item: Item) =>
        this.authServie.comparePassword(password, item.password).pipe(
          map((match: boolean) => {
            if (match) {
              return item;
            } else {
              throw Error;
            }
          }),
        ),
      ),
    );
  }
  login(item: Item): Observable<string> {
    return this.validateUser(item.email, item.password).pipe(
      switchMap((item: Item) => {
        if (item) {
          return this.authServie
            .generateJwt(item)
            .pipe(map((jwt: string) => jwt));
        } else {
          return 'wrong';
        }
      }),
    );
  }
}
