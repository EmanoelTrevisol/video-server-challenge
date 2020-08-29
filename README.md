# video-server-challenge

## Requirements
* Node v14
* MongoDB v4

## How to run

Add a `.env` file to the project root, following the example:
```
MONGO_URI=mongodb://localhost:27017/video-server-challenge
SECRET=gVF39rZHZAgDUDymv94W
PORT=8000
```

On your terminal, change to the project root directory and run `npm install` or use `yarn` if you prefer.

After everything installed, simply run `npm run dev` and you can now use the APIs from your favorite rest client. I used Insomnia as a rest client for the develoment of this challenge. In the project root you can find a Insomnia workspace config file. It should speed things up when using/testing this project.

## Assumptions

* Username cannot have space and should be at least 3 characters.
* Password should be at least 6 characters
* Password confirmation is done in the client.
* `Get users` is a single route with an option querystring parameter `username` for matching users. Returns a list of users.
* For simplicity, room capacity does not consider the host as a participant. 
* Only a participant in the room can become a host.
* Search for the rooms of a given user expects an exact username in the querystring

## Future improvements

* Add testing with Jest
* Improve type extension for better use of express and mongoose.
* Finish setting up tslint, prettier and husky.
* Improve password security by requiring numbers and special characters.

