const express = require('express');
var bodyParser = require('body-parser');
const route = require('./routes/route.js');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongoose = require('mongoose')

mongoose.connect("mongodb+srv://Ashu-positiveillusions:TPXgNbKjCwkqz4Ax@cluster0.yf3ho.mongodb.net/CollegeInternsProject?retryWrites=true&w=majority", {useNewUrlParser: true})
    .then(() => console.log('mongodb connected'))
    .catch(err => console.log(err))

app.use('/functionup', route);

app.listen(process.env.PORT || 3000, function() {
	console.log('Express app running on port ' + (process.env.PORT || 3000))
});


