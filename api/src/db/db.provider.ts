import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';

@Injectable()
export class DbProvider implements OnModuleDestroy {
  private readonly logger = new Logger(DbProvider.name);
  private readonly pool: Pool;
  readonly db: NodePgDatabase;

  constructor(private readonly configService: ConfigService) {
    const dbUrl = this.configService.getOrThrow<string>('DB_URL');

    this.pool = new Pool({
      connectionString: dbUrl,
    });

    this.pool.on('error', (err) => {
      this.logger.error(`Database pool error: ${err.message}`);
    });

    this.db = drizzle(this.pool);
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}
