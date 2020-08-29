import Boom from '@hapi/boom';
import mongoose from 'mongoose';

import Room, { IRoom } from './model/RoomModel';
import { IUser } from '../user/model/UserModel';
import errors from '../errors';
import UserManager from '../user/UserManager';

export default {
  // returns an Object. Additional sanitization can be done here
  sanitize(room: mongoose.Document) {
    return room.toObject();
  },

  async create({
    name,
    hostUserId,
    capacity = 5,
  }: {
    name: string;
    hostUserId: string;
    participants: string[];
    capacity: number;
  }) {
    const newRoom = {
      name,
      hostUserId,
      capacity,
      participantsIds: [],
    };

    const room = await Room.create(newRoom);

    return this.get(room._id.toString());
  },

  async getUserRooms({ username }: { username: string }) {
    const { _id: userId } = await UserManager.getUserByUsername(username);

    const rooms = await Room.find({
      $or: [{ participantsIds: userId }, { hostUserId: userId }],
    });

    return rooms.map((room) => {
      const cleanedRoom = this.sanitize(room);

      return {
        name: cleanedRoom.name,
        _id: cleanedRoom._id,
      };
    });
  },

  async get(roomId: string) {
    try {
      const room = await Room.findById(roomId).populate('host participants');

      if (!room) throw Boom.badData(errors.room.ROOM_INEXISTENT);

      return this.sanitize(room);
    } catch (error) {
      throw new Boom.Boom(error);
    }
  },

  async changeHost(roomId: string, newHost: string) {
    let user: mongoose.Document & IUser;
    const update: any = {};

    const room = await this.get(roomId);

    try {
      user = await UserManager.get(newHost);
    } catch (error) {
      if (error.message === errors.user.USER_INEXISTENT) {
        throw Boom.badData(errors.room.NEW_HOST_INEXISTENT);
      } else throw error;
    }

    if (room.hostUserId === user._id.toString())
      throw Boom.badData(errors.room.USER_ALREADY_HOST);

    // If the new host is a participant in the room, he will be removed as the participant
    if (room.participantsIds.includes(user._id.toString())) {
      update.$pull = { participantsIds: user._id };
    }

    update.$set = { hostUserId: user._id };

    await Room.findByIdAndUpdate(roomId, update);

    return this.get(roomId);
  },

  async joinOrLeaveRoom({
    action,
    roomId,
    userId,
  }: {
    action: string;
    roomId: string;
    userId: string;
  }) {
    const [room, user] = await Promise.all([
      this.get(roomId),
      UserManager.get(userId),
    ]);

    await (action === 'join'
      ? this.join({ room, user })
      : this.leave({ room, user }));

    return this.get(roomId);
  },

  join({ room, user }: { room: IRoom; user: IUser }) {
    const userId = user._id.toString();

    if (room.participants!.length === room.capacity)
      throw Boom.badData(errors.room.MAXIMUM_CAPACITY_REACHED);
    if (room.hostUserId === userId || room.participantsIds.includes(userId))
      throw Boom.forbidden(errors.room.JOIN_USER_ALREADY_IN_ROOM);

    return Room.findByIdAndUpdate(room._id, {
      $push: { participantsIds: user._id },
    });
  },

  leave({ room, user }: { room: IRoom; user: IUser }) {
    if (room.hostUserId === user._id.toString())
      throw Boom.badData(errors.room.HOST_UNABLE_LEAVE_ROOM);
    if (!room.participantsIds.includes(user._id.toString()))
      throw Boom.badData(errors.room.USER_NOT_IN_ROOM);

    return Room.findByIdAndUpdate(room._id, {
      $pull: { participantsIds: user._id },
    });
  },
};
