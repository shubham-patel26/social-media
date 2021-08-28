# social-media
### This is a nodejs project with mysql database.

To run the project in your local machine, clone this project to your machine and run the command ```npm install``` to install the dependencies of the project in the terminal of the project folder.

Make a file config.js in the project folder and paste the following code inside it.

```javascript
module.exports = {
    "secretKey": "12345-67890-09876-54322",
    "host": "localhost",
    "user": "root",
    "password": "", // set the password of your database
    "database": ""  // name of the database
} 
```

Open your mysql workbench and run each query of the file ```./Database/social-media.sql```
and then in the terminal of the project folder run the command ```npm start```.
