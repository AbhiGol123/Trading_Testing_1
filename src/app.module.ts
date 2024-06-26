/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CandlestickService } from './candlestick/candlestick.service';
import { CandlestickGateway } from './candlestick/candlestick.gateway';
import { CandlestickModule } from './candlestick/candlestick.module';
import { DatabaseService } from './provider/database.provider';
import { DatabaseModule } from './provider/database.module';
import { BinanceModule } from './binance/binance.module';
import { BinanceService } from './binance/binance.service';
//import configuration from './config/configuration';


@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot('mongodb+srv://abhi:9737477559@cluster0.vigx0aq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // Change the path if your public folder is located elsewhere
    }),
    CandlestickModule,
    DatabaseModule,
    BinanceModule,
    ConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService, CandlestickService, CandlestickGateway, DatabaseService,BinanceService],
  exports: [DatabaseService],
})
export class AppModule {}
