# RecipeApi
Welcome to the Recipe API! This API allows you to explore a collection of delicious recipes. Built using Express, Mongoose, and Node.js, this API enables you to view recipe details, write reviews, and rate your favorite dishes.

//URL OF DOCUMENTATION - https://documenter.getpostman.com/view/25111836/2s9Y5WxPR3 

The above url provide documentation of the api it is published using  postman 

Certainly! Here's a sample README file for your Recipe API that includes instructions for importing data from the recipes.json file to the database:

## Getting Started

To set up the Recipe API on your local machine, follow these steps:

1. Clone the repository:

Navigate to the project directory:
bash
Install the dependencies:
bash
npm install
Set up your database connection:

Update the config.env file with your MongoDB connection URI.
Import Data (Optional):

To import sample recipe data from the recipes.json file into your database, use the following commands:

To delete existing data before importing:

bash

node data/import-data.js --delete
To import data without deleting existing data:

bash

node data/import-data.js --import
Usage
Run the API server:
bash

npm start
The API will be available at http://localhost:4000.

Importing Data
If you want to populate your database with sample recipe data, you can use the provided data import script:

To delete existing data and import new data:

bash

node data/import-data.js --delete
To import data without deleting existing data:

bash

node data/import-data.js --import
Contributing
Contributions are welcome! If you find any issues or want to enhance the API, feel free to open a pull request.
