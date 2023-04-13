"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
exports.default = {
    /** port d'écoute du serveur Node */
    port: 8080,
    portNgServeProjetGénéré: 9900,
    nomSchemaLibrairie: "cocori-schematics-lib-0.0.6.tgz",
    api: {
        prefix: '/api',
    },
    /** Used by winston logger */
    logs: {
        level: process.env.LOG_LEVEL || 'silly',
    },
};
//# sourceMappingURL=index.js.map