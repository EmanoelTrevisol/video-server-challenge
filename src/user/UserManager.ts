import Boom from '@hapi/boom';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import User, { IUser } from './model/UserModel';
import errors from '../errors';

const bcryptSaltRounds = 12;

function hashPassword(password: string) {
  return bcrypt.hash(password, bcryptSaltRounds);
}

function checkPassword(plainText: string, hash: string) {
  return bcrypt.compare(plainText, hash);
}
export default {
  // returns an Object. Additional sanitization can be done here
  sanitize(user: IUser) {
    return user.toObject();
  },

  async get(userId: string, selectPassword = false) {
    const user = await User.findById(userId).select(
      selectPassword ? '+password' : ''
    );

    if (!user) throw Boom.badData(errors.user.USER_INEXISTENT);

    return this.sanitize(user);
  },

  async getUserByUsername(username: string) {
    const user = await User.findOne({ username });
    if (!user) throw Boom.badData(errors.user.USER_INEXISTENT);

    return this.sanitize(user);
  },

  async register({
    username,
    password,
    mobile_token,
  }: {
    username: string;
    password: string;
    mobile_token: string;
  }) {
    const newUser = {
      username,
      mobileToken: mobile_token,
      password: await hashPassword(password),
    };

    await User.create(newUser);

    return this.signIn({ username, password });
  },

  async signIn({ username, password }: { username: string; password: string }) {
    const user = await User.findOne({ username }).select('+password');

    if (!user || !(await checkPassword(password, user.password!)))
      throw Boom.unauthorized(errors.user.WRONG_CREDENTIALS);

    const token = jwt.sign(
      { id: user._id.toString() },
      process.env.SECRET || '',
      {
        expiresIn: '24h',
      }
    );

    return {
      user: await this.get(user._id),
      token,
    };
  },

  async update({
    userId,
    password,
    mobile_token: mobileToken,
  }: {
    userId: string;
    password: string;
    mobile_token: string;
  }) {
    const $set: { password?: string; mobileToken?: string } = {};

    let passwordUpdated = false;

    if (password) {
      passwordUpdated = true;
      $set.password = await hashPassword(password);
    }

    if (mobileToken) {
      $set.mobileToken = mobileToken;
    }

    await User.findByIdAndUpdate(userId, { $set });

    if (passwordUpdated) {
      const { username } = await this.get(userId, true);

      return this.signIn({ username, password });
    }

    return this.get(userId);
  },

  async list(username: string) {
    const query: any = {};

    if (username) query.username = { $regex: username };

    const [list, total] = await Promise.all([
      User.find(query),
      User.countDocuments(query),
    ]);

    return {
      list,
      total,
    };
  },

  async delete(userId: string) {
    await User.findByIdAndRemove(userId);

    return {
      deleted: true,
      userId,
    };
  },
};
