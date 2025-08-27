import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Symbol, SymbolDocument } from './schemas/symbol.schema';
import { CreateSymbolDto } from './dto/create-symbol.dto';
import { UpdateSymbolDto } from './dto/update-symbol.dto';

@Injectable()
export class SymbolsService {
  constructor(
    @InjectModel(Symbol.name) private symbolModel: Model<SymbolDocument>,
  ) {}

  async create(createSymbolDto: CreateSymbolDto): Promise<Symbol> {
    try {
      const createdSymbol = new this.symbolModel(createSymbolDto);
      return await createdSymbol.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Symbol with this name or code already exists');
      }
      throw error;
    }
  }

  async findAll(query: any = {}): Promise<Symbol[]> {
    const { page = 1, limit = 10, search, isActive, sortBy = 'sortOrder', sortOrder = 'asc' } = query;
    
    let filter: any = {};
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    const sort: any = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (page - 1) * limit;
    
    return await this.symbolModel
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .exec();
  }

  async findOne(id: string): Promise<Symbol> {
    const symbol = await this.symbolModel.findById(id).exec();
    if (!symbol) {
      throw new NotFoundException('Symbol not found');
    }
    return symbol;
  }

  async update(id: string, updateSymbolDto: UpdateSymbolDto): Promise<Symbol> {
    try {
      const updatedSymbol = await this.symbolModel
        .findByIdAndUpdate(id, updateSymbolDto, { new: true })
        .exec();
      
      if (!updatedSymbol) {
        throw new NotFoundException('Symbol not found');
      }
      
      return updatedSymbol;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Symbol with this name or code already exists');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.symbolModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Symbol not found');
    }
  }

  async count(query: any = {}): Promise<number> {
    let filter: any = {};
    
    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { code: { $regex: query.search, $options: 'i' } }
      ];
    }
    
    if (query.isActive !== undefined) {
      filter.isActive = query.isActive === 'true';
    }

    return await this.symbolModel.countDocuments(filter);
  }
}
