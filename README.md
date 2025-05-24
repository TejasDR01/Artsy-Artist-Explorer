# Arsty Artist Explorer
* Interactive Artist Search App – Built a sleek and responsive web app using Angular, integrating the Artsy API to fetch and display artists as dynamic cards.

* Seamless UX & Cloud Hosting – Designed an intuitive UI with smooth interactions and deployed it on Google Cloud Platform (GCP) for high availability and performance.

* Used NodeJS for the backend to make Api calls and feed data to the front end which is served as static pages.

Hosted Live Link: https://20250416t185315-dot-first-nodejs-3491.uw.r.appspot.com
Link to Android app implementation of frontend: https://github.com/TejasDR01/Artsy-Android-App

Or To Locally run web application install node and all node modules in the package.json and then run "server.js" file. Visit localhost:8080 in your browser.
Note: Need to add Your Mongo database access link in the "backend/server.js" file. Also log in to artsy website and get the client_id and client_secret to access the artsy api service and place it in the "backend/artist_routes.js" file

To modify the front-end after modifications in the frontend directory run cmd "ng build --configuration production" to save the modification in the list directory to which serves as static files to the backend.
