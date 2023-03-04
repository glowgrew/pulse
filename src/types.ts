export interface CreateStatsRequest {
    username: string;
    stat_name: string;
    value: number;
    timestamp?: string;
}

export interface GetStatsRequest {
    username: string;
    stat_name: string;
    start_date?: string;
    end_date?: string;
}

export interface Stats {
    username: string;
    stat_name: string;
    value: number;
    timestamp: string;
}