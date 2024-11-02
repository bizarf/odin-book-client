# The Odin Project - Project: Odin-Book client

The goal of this project is to make a Facebook clone using all that I've learnt. This is the client for that clone.

-   [View the live site here](https://bizarf.github.io/odin-book-client/)
-   [View the book api repo](https://github.com/bizarf/odin-book-api)

#### Install:

To run this project on your local server, first install the dependencies with the command:

```
npm install
```

Now create a file called ".env.development" and ".env.production" at the root of the project and inside each file add:

```
VITE_API_HOST="(backend_host_location)"
```

The VITE_API_HOST variable in ".env.development" is for development purposes, while the variable in ".env.production" is used when Vite builds the site.

After that is done, you can start the server with:

```
npm run dev
```

<hr>

##### Tools and technologies used:

-   React
-   React Router
-   Vite
-   Typescript
-   Tailwind CSS
-   DayJS
-   Universal-Cookie
-   ESLint
-   Prettier
-   JWT Decode
-   Playwright
-   shadcn/ui

<hr>

##### Credits:

-   Ivan Samkov for splash image photo (https://www.pexels.com/photo/person-writing-on-a-notebook-4240497/)
