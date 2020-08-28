import mongoose, { Model, Document } from 'mongoose';
import { IUser } from '../../user/model/UserModel';

export interface IRoom extends Document {
  name: string
  hostUserId: string
	participantsIds: string[],
	capacity: number,
	participants?: IUser[],
	host?: IUser
}

export interface IRoomModel extends Model<IRoom> {}

const RoomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      index: true,
			required: true,
    },
    hostUserId: {
      type: String,
      required: true,
    },
    participantsIds: {
			type: [String],
			default: [],
		},
		capacity: {
			type: Number,
			required: true,
			default: 5,
		}
  },
  {
    timestamps: true,
    toObject: { virtuals: true, minimize: false },
    toJSON: { virtuals: true, minimize: false },
  },
);

RoomSchema.virtual('host', {
  ref: 'User',
  localField: 'hostUserId',
  foreignField: '_id',
  justOne: true,
});

RoomSchema.virtual('participants', {
  ref: 'User',
  localField: 'participantsIds',
  foreignField: '_id',
  justOne: false,
});


export default mongoose.model<IRoom, IRoomModel>('Room', RoomSchema);

