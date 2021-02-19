import * as Router from 'koa-router';
import { Context } from 'koa';
import User from './db/mockdb';

const router = new Router();

interface UserParams {
  username: string,
  name: string,
  email: string,
  password: string,
  password_confirmation: string
}

interface UserResponseInterface {
  username: string,
  name: string,
  email: string,
  password?: string,
}

const parseAndValidateUserData = (data : UserParams) => {
  let { username, name, email, password, password_confirmation } = data;

  const errors = [];
  const emailRegex = /^(([^<>()[].,;:\s@"]+(.[^<>()[].,;:\s@"]+)*)|(".+"))@(([^<>()[].,;:\s@"]+.)+[^<>()[].,;:\s@"]{2,})$/i;

  if (!name || !name.trim())
    name = username;

  if (!username || !username.trim())
    errors.push("username can't be blank");

  if (!email || !email.match(emailRegex))
    errors.push("Email is not a valid email");

  if ((!password || !password_confirmation) || !password.length || !password_confirmation.length)
    errors.push("Password can't be blank")
  
  if (password != password_confirmation)
    errors.push("Passwords don't match")

  if (errors.length > 0) {
    return {
      isValid: false,
      reason: errors
    }
  }

  return {
    isValid: true,
    payload: {
      id: ++User.count,
      name,
      username,
      email,
      password
    }
  }
}

router.post('/users', (ctx : Context) => {
  const { isValid, reason, payload } = parseAndValidateUserData(ctx.request.body);
  const {broker } = ctx;

  if (!isValid) {
    ctx.status = 400;
    ctx.body = {
      errors: reason
    }
    return;
  }

  broker.publish('USER_CREATED', JSON.stringify(payload));
  const response = { ...payload } as UserResponseInterface
  delete response['password'];

  ctx.body = response
})

export default router;
