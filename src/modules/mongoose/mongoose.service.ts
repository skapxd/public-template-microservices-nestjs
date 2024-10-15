import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateMongooseDto } from './dto/create-mongoose.dto';
import { UpdateMongooseDto } from './dto/update-mongoose.dto';
import { MongooseCollection, MongooseDocument } from './schema/schema';

@Injectable()
export class MongooseService {
  constructor(
    @InjectModel(MongooseCollection.name)
    private readonly model: Model<MongooseDocument>,
  ) {}

  async create(createMongooseDto: CreateMongooseDto) {
    await this.model.create(createMongooseDto);
  }

  async findAll() {
    return await this.model.find();
  }

  async update(id: string, updateMongooseDto: UpdateMongooseDto) {
    await this.model.updateOne({ _id: id }, { $set: updateMongooseDto });
  }

  async remove(id: string) {
    await this.model.deleteOne({ _id: id });
  }
}
