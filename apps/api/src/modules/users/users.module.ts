import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../common/modules/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [],
})
export class UsersModule {}
