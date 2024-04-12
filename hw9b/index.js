// Load the Express package as a module
const express = require("express");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

// Access the exported service
const app = express();

// Start listening to incoming requests
// If process.env.PORT is not defined, port number 3000 is used
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});

// Load the multer package as a module
const multer = require("multer");

// Access the exported service
const upload = multer();

// Add the below to allow parsing of data sent via POST with 
//  "Content-Type": "application/json".  
// Use the below instead of the body-parser package
// Available with Express 4.16+
app.use(express.json());

// Enable CORS (see https://enable-cors.org/server_expressjs.html)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Serve content of the "public" subfolder directly
app.use(express.static("public"));

// Serve content of the "public and css" subfolder directly
app.use(express.static("css"));

// Return the index.html for requests to the root URL ("/")
app.get("/", (request, response) => {
  //response.send("Hello from Express!");
  response.sendFile(`${__dirname}/views/index.html`);
});

// Define an article list
const articles = [
  { id: 1, title: "First article", content: "Hello World!" },
  {
    id: 2,
    title: "Lorem ipsum",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut hendrerit mauris ac porttitor accumsan. Nunc vitae pulvinar odio, auctor interdum dolor. Aenean sodales dui quis metus iaculis, hendrerit vulputate lorem vestibulum."
  },
  {
    id: 3,
    title: "Lorem ipsum in French",
    content:
      "J’en dis autant de ceux qui, par mollesse d’esprit, c’est-à-dire par la crainte de la peine et de la douleur, manquent aux devoirs de la vie. Et il est très facile de rendre raison de ce que j’avance."
  }
];

// Define a country list
const countries = {
  name: "Dennis",
  countries: [
    {
      name: "Italy",
      year: 2022
    },
    {
      name: "Ireland",
      year: 2021
    },
    {
      name: "France",
      year: 2023
    },
    {
      name: "Japan",
      year: 2024
    }
  ]
};

// Return the articles list in JSON format
app.get("/api/articles", (request, response) => {
  response.json(articles);
});

// Return the countries list in JSON format
app.get("/api/countries", (request, response) => {
  response.json(countries);
});

// Return a web page for requests to "/ex1"
app.get("/ex1", (request, response) => {
  response.sendFile(`${__dirname}/views/ex1.html`);
});

// Return a web page for requests to "/ex2"
app.get("/ex2", (request, response) => {
  response.sendFile(`${__dirname}/views/ex2.html`);
});

// Return a web page for requests to "/ex3"
app.get("/ex3", (request, response) => {
  response.sendFile(`${__dirname}/views/ex3.html`);
});


// Handle form data submission to the "/ex1" route
app.post("/ex1", upload.array(), (request, response) => {
  const name = request.body.name;
  const email = request.body.email;
  response.send(`${name}, Thank you for your order. We will keep you posted on delivery status at ${email}.`);
  console.log("============  USER POST ============");
  console.log("request body is: ", request.body);
});

// Countries using jsonParser, was hoping for this info to be displayed (name, # of countries) for traveler, unfortunately did not work...need to review.
app.post("/api/countries", jsonParser, upload.array(), (request, response) => {
  response.send(`Your name is ${countries.name} and you visited ${countries.countries.length} countries. Keep traveling!`);
  console.log("============  USER POST ============");
  console.log("request body is: ", request.body);
});

// Handle form data submission to the "/ex3" route. From JSWAY example/code at end of chapter.
app.post("/ex3", upload.array(), (request, response) => {
  const title = request.body.title;
  const content = request.body.content;
  // New array for IDs
  const idList = articles.map((article) => article.id);
  // Reducing the array to the maximum id value
  const maxId = idList.reduce((acc, value) => {
    if (value > acc) return value;
    return acc;
  });
  const id = maxId + 1;
  // Push article
  articles.push({ id, title, content });
  response.send(`New article added successfully with ID ${id}!`);
});