import express from 'express';
import bodyParser from 'body-parser';
import { webhookHandler } from './requestHandlers/webhookHandler.js';
import { Routes } from './routes.js';

const port = process.env.PORT;
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
