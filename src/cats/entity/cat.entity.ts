import { Document } from 'mongoose';

export interface CatEntity extends Document {
  readonly name: string;
}
