##  👓 About this Project
A Node server that will make a call to an Auth0 tenant's Management API, using an authorized client's credentials. 

When trying to access on the /list route in the index file, you will be redirected to your API's login page. Authenticating into your application will then allow you to access the /list route.

Upon successfully authenticating, the endpoint will recieve a bearer token, which the server can then use to fetch all deployed clients and actions from the tenant.

This script assumes (and only handles) the code blocks of the user's actions that make reference to a client(s) via the `name`. It will use the client's name as a substring to search for, within the action's code block (string).

Afterwards, it will console.log a dymanic list of tenant's actions, the client they reference, and their supported triggers.

![All Apps in Auth0 tenant](/src/images/Applications%202022-09-05%20at%208.48.48%20PM.jpg)

![Client name in action code export](/src/images/Actions%202022-09-05%20at%208.50.14%20PM.jpg)

![Data being logged to the console](/src/images/-env%20%E2%80%94%20auth-0-simlutation%202022-09-05%20at%208.02.39%20PM.jpg)

## 🚨 Forking this repo (please read!)

You will need your own _**CLIENT_ID**_, _**CLIENT_SECRET**_, _**DOMAIN**_, _**SECRET**_, _**BASEURL**_, and _**AUTH0_ISSUER_BASE_URL**_
Make sure that the application credentials are authorised to use your Management API.

The API must also have the `read:clients` and `read:actions` scopes enabled.


## 🛠 Installation & Set Up

1. Install and use the correct version of NPM

   ```sh
   npm install npm@latest -g
   ```

2. Install dependencies

   ```sh
   npm install
   ```

3. Start the development server

   ```sh
   npm start