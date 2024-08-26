# Movie Web Application

A dynamic movie web application built using the MERN stack (MongoDB, Express.js, React, Node.js) with Redux Toolkit for state management. The application includes features like seat booking with real-time updates using Socket.IO and payment processing through VNPay.

# Link Demo: https://web-film-eosin.vercel.app/

# Test VNPay:

- Ngân hàng: NCB
- Số thẻ: 9704198526191432198
- Tên chủ thẻ:NGUYEN VAN A
- Ngày phát hành:07/15
- Mật khẩu OTP:123456

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Version Requirements](#version-requirements)
- [Environment Variables](#environment-variables)
- [Installation and Running the Application](#installation-and-running-the-application)
- [Client](#run-client)
- [Server](#run-server)
- [Database Setup](#database-setup)
- [Deployment](#deployment)
- [Deploying the Application](#deploying-the-application)
- [Connecting Frontend and Backend](#connecting-frontend-and-backend)
- [Testing and Updates](#testing-and-updating)
- [Contact Information](#contact-information)

## TECH STACK

Frontend: React, Redux Toolkit
Backend: Node.js, Express.js
Database: MongoDB
Payment Integration: VNPay
Real-time Communication: Socket.IO

## FEATURES

User Authentication: Register and log in to access personalized features.
Browse Movies: View and filter movies from a comprehensive list.
Seat Booking: Reserve seats in real-time with Socket.IO.
Payment Processing: Secure payments through VNPay.
View Order History: Keep track of past bookings and payments.
Movie Ratings and Comments: Rate and comment on movies.

## VERSION REQUIREMENTS

Node.js: v16.14.0
MongoDB: v4.4.2
Git: Version 2.41.0.windows.1

## ENVIRONMENT VARIABLES

Create a .env file in the root of your server directory with the following variables:
MONGODB_URL=<your-mongodb-url>
PORT=<your-server-port>
TOKEN_SECRET=<your-token-secret>
TMDB_URL=https://api.themoviedb.org/3/
TMDB_KEY=<your-tmdb-key>

VNP_TMN_CODE=<your-vnp-tmn-code>
VNP_HASH_SECRET=<your-vnp-hash-secret>
APP_URL=http://localhost:3000

SMTP_EMAIL=<your-smtp-email>
SMTP_PASSWORD=<your-smtp-password>
FROM_NAME=<your-from-name>
FROM_EMAIL=<your-from-email>

OAUTH_CLIENT_ID=<your-oauth-client-id>
OAUTH_CLIENT_SECRET=<your-oauth-client-secret>
OAUTH_REFRESH_TOKEN=<your-oauth-refresh-token>
OATH_ACCESS_TOKEN=<your-oath-access-token>

## INSTALLATION AND RUNNING THE APPLICATION

Clone the repository and follow the instructions below to set up the project:

## RUN Client

cd client
npm install
yarn start

## RUN Server

cd server
npm install
yarn start

## DATABASE SETUP

Use MongoDB Atlas for managing your database. You can restore the provided example database using the following command:
mongorestore --db <database_name> dump/movieapp
Replace <database_name> with your desired database name.

## DEPLOYMENT

MongoDB Atlas Setup
Create an Account: Sign up on MongoDB Atlas and create a new project.
Create a Cluster: Configure your cluster and obtain the connection string.
Set Up Collections: Import your database or create collections manually.

## DEPLOYING THE APPLICATION

Push Code to GitHub: Ensure your client and server code is hosted on GitHub.
Deploy Backend: Use platforms like Render to deploy your backend.
Deploy Frontend: Use Vercel for deploying the frontend.

## CONNECTING FRONTEND AND BACKEND

Update your environment variables to point the frontend to the deployed backend API.
Ensure both frontend and backend URLs are correctly set in the deployment settings.

## TESTING AND UPDATING

Regularly test the application by navigating to the deployed frontend URL.
For updates, push changes to the respective GitHub repositories, which will trigger redeployment.

## CONTACT INFORMATION

Name: Nguyễn Minh Trí
Email: minhtri240301@gmail.com
