import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Item } from 'src/item/model/item.interface';
import { Observable, from, of } from 'rxjs';
import bcrypt = require('bcrypt');
@Injectable()
export class AuthService {
  constructor(private readonly jwtSevie: JwtService) {}
  generateJwt(item: Item): Observable<string> {
    return from(this.jwtSevie.signAsync({ item }));
  }
  hasHpasswor(pasword: string): Observable<string> {
    return from<string>(bcrypt.hash(pasword, 12));
  }
  comparePassword(newPassword: string, passwordHash: string): Observable<any> {
    return of<any | boolean>(bcrypt.compare(newPassword, passwordHash));
  }
}
