/* eslint-disable prettier/prettier */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { MongoClient } from 'mongodb';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private client: MongoClient;

  async onModuleInit() {
    this.client = new MongoClient('mongodb+srv://abhi:9737477559@cluster0.vigx0aq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
      //useNewUrlParser: true,
      //useUnifiedTopology: true,
    });

    await this.client.connect();
    console.log('Connected to MongoDB');
  }

  getClient(): MongoClient {
    if (!this.client) {
      throw new Error('MongoClient is not initialized');
    }
    return this.client;
  }

  getDatabase(dbName: string) {
    if (!this.client) {
      throw new Error('Database client is not initialized');
    }
    return this.client.db(dbName);
  }
  
  closeConnection(): Promise<void> {
    return this.client.close();
  }
}

