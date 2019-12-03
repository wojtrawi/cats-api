import * as mongoose from 'mongoose';

// tslint:disable-next-line: no-var-requires
const mongoosePaginate = require('mongoose-paginate-v2');

export const CatSchema = new mongoose.Schema({
  name: String,
  userId: String,
}).plugin(mongoosePaginate);
