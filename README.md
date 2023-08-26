# Node Express.js MongoDB Starter Template

This app is a template of a node app with proper folder structure defined and important dependencies pre-installed. This template can be used to save some time when setting up a new node project. You can look at the guide below to understand how to set it up.

## Installed Modules

The following modules are installed in this template of node.

| Module | Repository Link |
| ------ | ------ |
| Axios | https://www.npmjs.com/package/axios |
| body-parser | https://www.npmjs.com/package/body-parser |
| cors | https://www.npmjs.com/package/cors |
| dotenv | https://www.npmjs.com/package/dotenv |
| express | https://www.npmjs.com/package/express |
| mongoose | https://www.npmjs.com/package/mongoose |
| nodemon(dev-dependency) | https://www.npmjs.com/package/nodemon |



## Folder Structure

This template follows the Service Repository pattern structure. 

- /src - this folder contains all the source code
- /src/config - this folder contains all the config files required to run the project
- /src/controllers - this folder contains the functions which deals with the services of the project
- /src/middleware - this folder contains all the middleware functions used in the node project
- /src/models - this folder contains all the model for schemas used in the project
- /src/routes - this folder contains various files having routing configuration
- /src/services - this folder contains all the functions which act as services (mostly logical and database related part of the project)
- /src/validations - this folder contains all the validation files require for this project

## Installation

This Template requires https://nodejs.org/ 

Clone this repository, change the path to the root directory of the template, install the dependencies, after that is done update your credentials in the .env file and start coding. 

```sh
npm i
npm start
```