import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {Pool} from "pg";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";

@Injectable()
export class DbProvider implements OnModuleDestroy {
    private readonly pool: Pool;
    readonly db: NodePgDatabase;

    constructor(private readonly configService: ConfigService) {
        const dbUrl = this.configService.getOrThrow("DB_URL");

        this.pool = new Pool({
            connectionString: dbUrl,
        })

        this.db = drizzle(this.pool);
    }

    async onModuleDestroy() {
        await this.pool.end();
    }
}