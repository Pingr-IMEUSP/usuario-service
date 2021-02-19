import * as Router from 'koa-router';
import { Context } from 'koa';
import User, { UserInterface } from './db/mockdb';

const router = new Router();

interface UserParams {
  username: string,
  name: string,
  email: string,
  password: string,
  password_confirmation: string
}

interface UserResponseInterface extends UserInterface {
  password?: string,
}

const parseAndValidateUserData = (data : UserParams) => {
  let { username, name, email, password, password_confirmation } = data;

  const errors = [];
  const emailRegex = /^[a-z0-9.]+@[a-z0-9]+.[a-z]+.([a-z]+)?$/i;

  if (!name || !name.trim())
    name = username;

  if (!username || !username.trim())
    errors.push("username can't be blank");
    
  if (User.all.some((user: UserInterface) => user.username == username))
    errors.push("username already taken");

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

  const response = { ...payload } as UserResponseInterface
  delete response['password'];

  broker.publish('USER_CREATED', JSON.stringify(response));

  ctx.body = response
})

export default router;
