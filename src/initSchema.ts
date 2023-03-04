import { Pool } from "pg";

export async function initSchema(pool: Pool) {
    try {
        await pool.query(` CREATE TABLE IF NOT EXISTS player_stats (id SERIAL PRIMARY KEY, username VARCHAR(16) NOT NULL, stat_name VARCHAR(255) NOT NULL, timestamp TIMESTAMP NOT NULL DEFAULT NOW(), value NUMERIC NOT NULL) `);
    } catch (err) {
        console.error(err);
    }
}