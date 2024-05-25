<br />
<p align="center">
  <a href="https://doryapi.herokuapp.com">
  </a>

  <h3 align="center">DealApp </h3>

  <p align="center">
  Deal App Matching System
    <br />
    <h4 align="center">Give a star ⭐ if you like it ❤️  </h4>
    <br/>
</p>

<!-- TABLE OF CONTENTS -->

## Table of Contents 📋

- [About the Project](#about-the-project-eyes)
  - [Built With](#built-with-hammer)
- [Getting Started](#getting-started-rocket)
  - [Prerequisites](#prerequisites-computer)
  - [Installation](#installation-arrow_down)
  - [Docker](#docker-whale)
  - [Running](#running-running_man)
  - [Database Backup](#database-backup-disk)
  - [Testing](#testing)
  - [Swagger](#swagger)
- [Authors](#authors-closed_book)
<!-- ABOUT THE PROJECT -->

## About The Project :eyes:

A Matching System that match Property Request with Ads.

### Built With :hammer:

- [Node.js](https://nodejs.org)
- [Express](https://expressjs.com)
- [MongoDB](https://www.mongodb.com)

<!-- GETTING STARTED -->

## Getting Started 🚀

To get a local copy up and running follow these simple example steps.

### Prerequisites 💻

- Node ([Download here!](https://nodejs.org/en/download))
- MongoDB ([Download here!](https://www.mongodb.com/try/download/community))
- Nodemon (for development mode)

```sh
npm install -g nodemon
```

### Installation :arrow_down:

**1.** Fork [this](https://github.com/aman-atg/doryapi) repository :fork_and_knife:

**2.** Clone your forked repository to your local system :busts_in_silhouette:

```sh
git clone https://github.com/<your-username>/deadealapp-assessment.git
```

Or Download and extract the zip file.

### Environmental Variables

You need to make your own `.env` and place at root with the following structure.

```json
 NODE_ENV=development
 PORT=5000
 MONGO_URI=mongodb://localhost:27017/DealApp
 JWT_SECRET=0000000
 JWT_EXPIRE=30d
 JWT_COOKIE_EXPIRE=30
```

- `NODE_ENV`: It should be `"production"` in order to run the api on production otherwise use `"development"`
- `PORT`: Your api hosting port
- `MONGO_URI`: Your database path
  > Eg: `"mongodb://localhost:27017/DealApp"` If you're hosting on your localhost server.
- `JWT_SECRET`: Your json web token secret key.
- `JWT_EXPIRE`: The period token can last before expiring expressed in seconds or a string describing a time span
  > Eg: `60`, `"2 days"`, `"10h"`, `"7d"`. A numeric value is interpreted as a seconds count. If you use a string be sure you provide the time units (days, hours, etc), otherwise milliseconds unit is used by default (`"120"` is equal to `"120ms"`).

### Docker :whale:

To build and run the application using Docker, use the following commands:

```sh
docker-compose build
docker-compose up
```

### Running Locally

**1.** Install NPM packages :arrow_down:

```sh
npm install
```

**2.** Run! :running_man:

```sh
npm start
```

**3.** Or Run on Dev! :running_man:

```sh
npm run dev
```

### Database Backup

To backup the database locally, you can use `seed.js`:

```sh
npm run seed
```

or you can use mongorestore at root:

```sh
mongorestore --db DealApp ./backup/DealApp
```

### Test

To run test:

```sh
npm test
```

### Swagger

You can access the Swagger documentation at:

```sh
http://localhost:5000/docs
```

## Authors 📝

- [Mohaned Ashraf](https://github.com/MohanedAshraf)
