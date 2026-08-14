import { Global, Module } from '@nestjs/common';
import { DbProvider } from './db.provider';

@Global()
@Module({
  providers: [DbProvider],
  exports: [DbProvider],
})
export class DbModule {}
