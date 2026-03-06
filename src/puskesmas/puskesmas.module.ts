import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PuskesmasService } from './puskesmas.service';
import { PuskesmasController } from './puskesmas.controller';
import { Puskesmas } from './entity/puskesmas.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Puskesmas])],
  controllers: [PuskesmasController],
  providers: [PuskesmasService],
  exports: [PuskesmasService],
})
export class PuskesmasModule { }
