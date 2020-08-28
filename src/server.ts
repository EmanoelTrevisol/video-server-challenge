import mongoose from 'mongoose';
import express from 'express';
import routes from './routes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

mongoose.connect(process.env.MONGO_URI || '', {
  config: {
    autoIndex: true,
  },
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('connected', () => {
  // tslint:disable-next-line: no-console
  console.log('MongoDB connected');
});

db.on('error', () => {
  throw new Error(`Unable to connect to database at ${process.env.MONGO_URI}`);
});

app.use(express.json());

routes(app);

app.listen(process.env.PORT, () => {
  // tslint:disable-next-line: no-console
  console.log(`Listening on port ${process.env.PORT}`);
});
