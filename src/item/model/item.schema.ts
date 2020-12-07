import * as mongoose from 'mongoose';
import { UserRole } from './item.interface';

export const IiemShema = new mongoose.Schema({
  name: String,
  jenis: String,
  description: String,
  email: String,
  password: String,
  role: String,
});
