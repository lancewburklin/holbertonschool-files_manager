import express from 'express';
import router from './routes/index';

const app = express();
let port;
if (process.env.PORT) {
  port = process.env.PORT;
} else {
  port = 5000;
}

app.use('/', router);

app.listen(port);

export default app;
