import express from 'express';
import bodyParser from 'body-parser';
import { Routes } from './routes.js';
import { webhookHandler } from './requestHandlers/webhookHandler';

const port = process.env.SERVER_PORT;
const app = express();

export const initServer = (): void => {
  app.use(bodyParser.json());
  app.post(Routes.Webhook, webhookHandler);

  app.listen(port, () => {
    console.log(
      `GitLab Webhook Receiver listening at http://localhost:${port}`
    );
  });
};
