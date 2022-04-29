import Express from 'express';
import cors from 'cors';
import cookie_parser from 'cookie-parser';
import { json } from 'body-parser';
import API_ROUTER from './Routes/api/api';
import AUTH_ROUTER from './Routes/auth/auth';
import { connect_to_mongodb } from './mongo';

(async () => {
    await connect_to_mongodb();

    const app = Express();
    const PORT = process.env.PORT || 5000;
    
    app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
    app.use(json());
    app.use(cookie_parser());

    app.use('/api', API_ROUTER);
    app.use('/auth', AUTH_ROUTER);
    
    app.listen(PORT, () => {
        console.log(`listening on port ${PORT}`);
    });
})();
