import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PuskesmasService } from './puskesmas.service';
import { PuskesmasController } from './puskesmas.controller';
import { Puskesmas } from './entity/puskesmas.entity';
import { LogactivityModule } from '../logactivity/logactivity.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Puskesmas]),
    LogactivityModule,
  ],
  controllers: [PuskesmasController],
  providers: [PuskesmasService],
  exports: [PuskesmasService],
})
export class PuskesmasModule { }
