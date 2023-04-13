"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const boulle_bo_apis_1 = __importDefault(require("./routes/boulle-bo-apis"));
const cocoring_apis_1 = __importDefault(require("./routes/cocoring-apis"));
const loto_apis_1 = __importDefault(require("./routes/loto-apis"));
const uploader_apis_1 = __importDefault(require("./routes/uploader-apis"));
// guaranteed to get dependencies
exports.default = () => {
    const app = express_1.Router();
    boulle_bo_apis_1.default(app);
    uploader_apis_1.default(app);
    loto_apis_1.default(app);
    cocoring_apis_1.default(app);
    return app;
};
//# sourceMappingURL=index.js.map