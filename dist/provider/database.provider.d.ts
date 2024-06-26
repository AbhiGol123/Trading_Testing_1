import { OnModuleInit } from '@nestjs/common';
import { MongoClient } from 'mongodb';
export declare class DatabaseService implements OnModuleInit {
    private client;
    onModuleInit(): Promise<void>;
    getClient(): MongoClient;
    getDatabase(dbName: string): import("mongodb").Db;
    closeConnection(): Promise<void>;
}
