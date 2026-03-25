import { Module, Global } from '@nestjs/common';
import { StorageService } from './storage.service';
import { FilesController } from './files.controller';

@Global()
@Module({
    controllers: [FilesController],
    providers: [StorageService],
    exports: [StorageService],
})
export class StorageModule { }
