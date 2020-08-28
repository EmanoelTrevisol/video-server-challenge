export default {
	room: {
		NAME_REQUIRED: 'The room name is required',
		ROOM_INEXISTENT: 'Room not found',
		MAXIMUM_CAPACITY_REACHED: 'The room capacity has been reached',
		HOST_UNABLE_LEAVE_ROOM: 'You cannot leave the room because you are the host. Change the host before leaving the room.',
		ROOM_HOST_INEXISTENT: 'The new host was not found. Please inform an existent user',
		USER_NOT_IN_ROOM: 'The informed user is not in this room',
		NEW_HOST_INEXISTENT: 'The new host informed was not found. Please inform a valid user in the room',
		USER_ALREADY_HOST: 'The informed user is already the host of this room. If you wish to change the host, please inform another user',
		NO_USERNAME_INFORMED: 'Please inform a username',
		NEW_HOST_NOT_INFORMED: 'Please inform a new host',
		JOIN_USER_ALREADY_IN_ROOM: 'The informed user is already in the room',
	},
	user: {
		USER_INEXISTENT: 'User not found',
		PASSWORD_TOO_SHORT: 'Password should contain at least 6 characters',
		USERNAME_TOO_SHORT: 'The username should contain at least 3 characters',
		USERNAME_WITH_SPACES: 'The username should not contain spaces',
		USERNAME_ALREADY_EXISTS: 'This username already exists in our database. Please provide another',
		WRONG_CREDENTIALS: 'Username or password incorrect. Please check and try again',
	},
}
