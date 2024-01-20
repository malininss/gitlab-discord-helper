import express from 'express';
import bodyParser from 'body-parser';
import { webhookHandler } from './requestHandlers/webhookHandler.js';
import { Endpoints } from './enums.js';

const port = process.env.PORT;
const app = express();

export const initServer = () => {
  app.use(bodyParser.json());
  app.post(Endpoints.Webhook, webhookHandler);

  app.listen(port, () => {
    console.log(
      `GitLab Webhook Receiver listening at http://localhost:${port}`
    );
  });
};
