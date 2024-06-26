"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const common_1 = require("@nestjs/common");
const mongodb_1 = require("mongodb");
let DatabaseService = class DatabaseService {
    async onModuleInit() {
        this.client = new mongodb_1.MongoClient('mongodb+srv://abhi:9737477559@cluster0.vigx0aq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {});
        await this.client.connect();
        console.log('Connected to MongoDB');
    }
    getClient() {
        if (!this.client) {
            throw new Error('MongoClient is not initialized');
        }
        return this.client;
    }
    getDatabase(dbName) {
        if (!this.client) {
            throw new Error('Database client is not initialized');
        }
        return this.client.db(dbName);
    }
    closeConnection() {
        return this.client.close();
    }
};
exports.DatabaseService = DatabaseService;
exports.DatabaseService = DatabaseService = __decorate([
    (0, common_1.Injectable)()
], DatabaseService);
//# sourceMappingURL=database.provider.js.map