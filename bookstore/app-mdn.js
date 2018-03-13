
var express = require('express');
var app = express();

app.get('/', (req, res) => {
	res.send("hello Wrold!");
});

// Square 
//var square = require('./developerMozilla/square'); // Here we require() the name of the file without the (optional) .js file extension


// using class
const Square = require('./developerMozilla/square');
const mySquare = new Square(2);
console.log(`The area of mySqueare is ${mySquare.area()} ` + `The perimeter of mySqueare is ${mySquare.perimeter()}`);
//console.log('The area of a squeare with a wiedth of 4 is ' + square.area(5) + " " + square.perimeter(8));
app.listen(3000, () => {
	console.log("Example app listening on port 3000!" );
});