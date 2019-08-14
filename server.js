// const path = require('path');
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000
app.use(express.static('public'))
// app.use(express.static('C:/Users/Nowy użytkownik/Desktop/github - refactor/FrontEndTask/dist/bundle.js'))
app.listen(PORT)

