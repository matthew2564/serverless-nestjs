import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { Context, Handler, Callback } from 'aws-lambda';
import serverlessHttp from 'serverless-http';
import { AppModule } from './app.module';

let server: Handler;

async function bootstrapServer() {
  // create nest app
  const app = await NestFactory.create(AppModule, new FastifyAdapter());
  // enable cors
  app.enableCors();
  // start app
  await app.init();
  return app;
}

if (process.env.IS_OFFLINE === 'true') {
  const port = process.env.PORT || 3000;

  (async () => {
    // create module
    const app = await bootstrapServer();

    // bind server to app
    server = app.getHttpAdapter().getInstance();

    // listen on port
    await app.listen(port, () => console.log(`Server running on port ${port}`));
  })();
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  if (!server) {
    server = serverlessHttp(
      await bootstrapServer().then((app) => app.getHttpAdapter().getInstance()),
    );
  }

  return server(event, context, callback);
};
