import { createNestServer, expressServer } from './server';

async function bootstrap() {
  const app = await createNestServer(expressServer);

  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
