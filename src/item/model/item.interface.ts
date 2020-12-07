import { Document } from 'mongoose';

export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  CHIEFEDITOR = 'chiefeditor',
  USER = 'user',
}

export interface Item extends Document {
  id?: string;
  name?: string;
  jenis: string;
  description?: number;
  email?: string;
  password?: string;
  role?: UserRole;
}
