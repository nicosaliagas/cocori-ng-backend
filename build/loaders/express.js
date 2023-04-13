"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const api_1 = __importDefault(require("../api"));
const config_1 = __importDefault(require("../config"));
// import routes from '../api';
exports.default = ({ app }) => {
    /**
     * Health Check endpoints
     * @TODO Explain why they are here
     */
    app.get('/status', (req, res) => {
        res.json({ "statut": "OK" }).status(200).end();
    });
    app.head('/status', (req, res) => {
        res.status(200).end();
    });
    // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
    // It shows the real origin IP in the heroku or Cloudwatch logs
    app.enable('trust proxy');
    // The magic package that prevents frontend developers going nuts
    // Alternate description:
    // Enable Cross Origin Resource Sharing to all origins by default
    app.use(cors_1.default({ credentials: true, origin: ['http://localhost:2021', 'https://localhost:2021', 'http://localhost:4200', 'http://localhost:5050'] }));
    // Some sauce that always add since 2014
    // "Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it."
    // Maybe not needed anymore ?
    app.use(require('method-override')());
    // Middleware that transforms the raw string of req.body into json
    app.use(express_1.default.json({ limit: '200mb' })); //Used to parse JSON bodies
    app.use(express_1.default.urlencoded({ limit: '200mb', extended: true }));
    // Load API routes
    app.use(config_1.default.api.prefix, api_1.default());
    /// catch 404 and forward to error handler
    app.use((req, res, next) => {
        const err = new Error('Not Found');
        err['status'] = 404;
        next(err);
    });
    /// error handlers
    app.use((err, req, res, next) => {
        /**
         * Handle 401 thrown by express-jwt library
         */
        if (err.name === 'UnauthorizedError') {
            return res
                .status(err.status)
                .send({ message: err.message })
                .end();
        }
        return next(err);
    });
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.json({
            errors: {
                message: err.message,
            },
        });
    });
};
//# sourceMappingURL=express.js.map