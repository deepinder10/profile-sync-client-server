*User profile synchronization between server and client*

This project offers a basic synchronization of User profile between a server and client.

The repo contains two folders frontend and backend. Frontend runs on Vite+React and Backend runs on Express+Node+Supabase+Prisma.

There is a `.nvmrc` file in root which can be used for the recommended node version and doing a `npm install` in root would install dependencies on both folders.

To `run` the application and see it in action, command `npm run start` from the root repo would start both the repos.

Some basic tests have been added which can be tested via `npm run test`.

***Frontend stack:***
- It runs on `Vite+React+TS` and `PWA` configuration is used to run the app offline without internet.
- Styling is done with `TailwindCSS`. Forms are handled by `react-hook-form` package and `react-hot-toast` is used for toast messages.
- Tests are handled via `vitest` and `@testing-library/react`.

***Backend stack:***
- It runs on `Express` and `Node`. A simple table is configured in `PostgreSQL` using `Supabase` and `Prisma ORM`.
- Tests are handled via `jest` and `supertest` and `Joi` is used for request validation.
- Basic logging is done with `pino-http`.

***Brief on synchronization logic:***
Mainly all of the logic lies on the client side and in the Context created for User using Context API. Cases where Client synchronizes the profile data:

1. When internet is working, we check if there is a user in client local storage. If the user exists and has an id, that means it exists on the server as database row is linked to that id, we just fetch the user else we create a new user if there was no id on client.
2. In case if the local storage profile createdAt date is more recent than what server has, user is given a conflict resolution dialog to select the one they prefer and that gets updated on both server and client.
3. In case the user is offline, or HTTP request fails, we store the data in localstorage on the client and the moment internet comes back, that data is synced on the server.
4. In case the user creates profile while being offline and user is not created on the server(no id created), we use POST request to create the user on internet availability.
5. If no data exists in server or client, user is given a message to fill out the profile form.

***API's***
`GET /api/user/:id` - Retreive the user via id
`POST /api/user` - Create a new user and returns id from database
`PATCH /api/user/:id` - Update the user using id

Sever/Backend only takes the request, validates it and stores it in the database, or retreives the latest profile using Prisma ORM.

```Schema for user object being used:
{
	"id": "number"
	"name": "XXX",
	"email": "XXX",
	"createdAt": "timestamp"
}
```