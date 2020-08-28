import mongoose, { Model, Document } from 'mongoose';
import errors from '../../errors';

// TODO: integrate typescript interface with mongoose Document
export interface IUser extends Document {
  username: string;
  password?: string;
  mobileToken: string;
}

export interface IUserModel extends Model<IUser> {
  hashPassword(password: string): Promise<string>;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      index: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      select: false,
    },
    mobileToken: String,
  },
  {
    timestamps: true,
    toObject: { virtuals: true, minimize: false },
    toJSON: { virtuals: true, minimize: false },
  }
);

UserSchema.path('username').validate(
  usernameValidation,
  errors.user.USERNAME_ALREADY_EXISTS
);

async function usernameValidation(this: any, username: string) {
  const count = await User.countDocuments({
    _id: { $ne: this._id },
    username,
  });
  return !count;
}

const User = mongoose.model<IUser, IUserModel>('User', UserSchema);

export default User;
