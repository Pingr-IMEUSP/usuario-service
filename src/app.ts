import * as Koa from 'koa';
import * as bodyparser from 'koa-bodyparser';
import * as json from 'koa-json';
import * as cors from '@koa/cors';
import router from './routes';

export const app: Koa = new Koa();

app.use(bodyparser());
app.use(json());
app.use(cors());
app.use(router.routes()).use(router.allowedMethods());
