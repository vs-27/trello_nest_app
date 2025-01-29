import {
  Body,
  Controller, Delete, Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../decorators/user.decorator';
import { CreateColumnDto } from '../../../dto/column.dto';
import { ColumnEntity } from '../../../entities/column.entity';
import { UserEntity } from '../../../entities/user.entity';
import { AuthGuard } from '../../../guards/auth.guard';
import { ColumnService } from '../../../services/column.service';

@Controller('columns')
export class ColumnController {
  constructor(
    private readonly columnService: ColumnService,
    @InjectRepository(ColumnEntity)
    private readonly columnRepository: Repository<ColumnEntity>,
  ) {
  }

  @Post()
  @UseGuards(AuthGuard)
  async createColumn(
    @Body() createColumnDto: CreateColumnDto,
    @User() user: UserEntity,
  ): Promise<ColumnEntity> {
    return await this.columnService.createColumn(user, createColumnDto);
  }

  @Delete(':id')
  async deleteColumn(@Param('id') id: number): Promise<boolean> {
    return this.columnService.deleteColumn(id);
  }
}
