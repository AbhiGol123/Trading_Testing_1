"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const express_1 = require("express");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, express_1.json)({ limit: '50mb' }));
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.use((0, express_1.urlencoded)({ extended: true, limit: '50mb' }));
    await app.listen(8000);
}
bootstrap();
//# sourceMappingURL=main.js.map