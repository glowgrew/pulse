import express, { Request, Response } from "express";
import { Pool } from "pg";
import bodyParser from "body-parser";
import { CreateStatsRequest, GetStatsRequest, Stats } from "./types";
import { initSchema } from "./initSchema";

const {
    POSTGRES_HOST = "localhost",
    POSTGRES_PORT = "5432",
    POSTGRES_USER = "app",
    POSTGRES_PASSWORD = "gbplf",
    POSTGRES_DB = "app",
} = process.env;

const pool = new Pool({
    host: POSTGRES_HOST,
    port: +POSTGRES_PORT,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    database: POSTGRES_DB,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

const app = express();
app.use(bodyParser.json());

app.post("/stats", async (req: Request<{}, CreateStatsRequest>, res: Response) => {
    try {
        const {username, stat_name, value, timestamp} = req.body;

        const query = "INSERT INTO player_stats (username, stat_name, value, timestamp) VALUES ($1, $2, $3, $4)";
        const values = [username, stat_name, value, timestamp || new Date().toISOString()];
        await pool.query(query, values);

        res.status(201).json({success: true});
    } catch (err) {
        console.error(err);
        // @ts-ignore
        res.status(500).json({error: "Internal server error"});
    }
});

app.get("/stats", async (req: Request<{}, {}, {}, GetStatsRequest>, res: Response<Stats[]>) => {
    try {
        const {username, stat_name, start_date, end_date} = req.query;

        const query = "SELECT * FROM player_stats WHERE username = $1 AND stat_name = $2 AND timestamp >= $3 AND timestamp <= $4 ORDER BY timestamp";
        const values = [username, stat_name, start_date, end_date];
        const result = await pool.query(query, values);

        const stats = result.rows.map((row) => ({
            username: row.username,
            stat_name: row.stat_name,
            value: row.value,
            timestamp: row.timestamp,
        }));

        res.status(200).json(stats);
    } catch (err) {
        console.error(err);
        // @ts-ignore
        res.status(500).json({error: "Internal server error"});
    }
});

app.listen(3000, async () => {
    await initSchema(pool).then(() => console.log("Ran init schema"));
    console.log("Server listening on port 3000");
});

