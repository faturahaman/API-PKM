import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisitorService } from './visitor.service';
import { VisitorController } from './visitor.controller';
import { Visitor } from './entity/visitor.entity';
import { Puskesmas } from '../puskesmas/entity/puskesmas.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Visitor, Puskesmas])],
  controllers: [VisitorController],
  providers: [VisitorService],
  exports: [VisitorService]
})
export class VisitorModule { }