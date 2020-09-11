import cacheableResponse from 'cacheable-response';
import express, { Request, Response } from 'express';
import sslRedirect from 'heroku-ssl-redirect';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

const ssrCache = cacheableResponse<{ req: Request; res: Response }>({
  get: async ({ req, res }) => {
    const data = await app.renderToHTML(req, res, req.path, {
      ...req.query,
      ...req.params
    });

    // Add here custom logic for when you do not want to cache the page, for
    // example when the page returns a 404 status code:
    if (res.statusCode === 404) {
      res.end(data);
      return null;
    }

    return { data: data || '', ttl: dev ? 0 : 1000 * 60 * 60 };
  },
  send: ({ data, res }) => res.send(data)
});

(async () => {
  try {
    await app.prepare();
    const server = express();

    server.use(sslRedirect());

    server.get('/', (req, res) => ssrCache({ req, res }));

    server.get('/games/:gameSlug', (req, res) => {
      return ssrCache({ req, res });
    });

    server.get('/games/:gameSlug/:characterSlug', (req, res) => {
      return ssrCache({ req, res });
    });

    server.get('/games/:gameSlug/:characterSlug/*', (req, res) => {
      return ssrCache({ req, res });
    });

    server.all('*', (req: Request, res: Response) => {
      return handle(req, res);
    });

    server.listen(port, (err?: any) => {
      if (err) throw err;
      console.log(`> Ready on localhost:${port} - env ${process.env.NODE_ENV}`);
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
