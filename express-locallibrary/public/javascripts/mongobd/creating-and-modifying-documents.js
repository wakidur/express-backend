// step -1 

/**
 * create a record 
 * 
 */

// Create an instance of model SomeModel
var awesom_instance = new SomeModel({
    name: 'awesome'
});

// Save the new model instance, passsing a callback
awesom_instance.save(function (err) {
    if (err)
        return handleError(err);
    //save
});

/**
 * use create() to define the model instance at the same time as you save it.
 */
SomeModel.create({
    name: 'also_awesome'
}, function (err, awesome_instance) {
    if (err)
        return handleError(err);
    // saved!
});

/**
 * 
 */
// Access model field value using dot notation 
console.log(awesom_instance.name);
// change recode by modifying the fields, thend calling 

awesom_instance.name = "New cool name";
awesom_instance.save(function (err) {
    if (err) {
        return handleError(err); // saved!
    }
});


/**
 * Searching for records 
 * 
 */

var Athlete = mongoose.model('Athlete', yourSchema);

// Find all athletes who play tennis, selectiong the "name" and "age" fieldes
Athlete.find({
    'sport': 'Tennis'
}, 'name age', function (err, athletes) {
    if (err) {
        return handleError(err);
    }
    // 'athletes' contains the list of athletes that match the criteria.
});


/**
 * 
 */
// find all athletes that play tennis
var query = Athlete.find({
    'sport': 'Tennis'
});

// selecting the 'name' and 'age' fields
query.select('name age');

// limit our results to 5 items
query.limit(5);

//sort by age
query.sort({
    age: -1
});

// execute the query at a later time
query.exec(function (err, athletes) {
    if (err) {
        return handleError(err);
    }
    // athletes contains an ordered list of 5 athletes who play 
});

/**
 * using where();
 */

Athlete
    .find()
    .where('sport')
    .equals('Tennis')
    .where('age').gt(17).lt(50)
    .limit(5)
    .sort({
        age: -1
    })
    .select('name age')
    .exec(callback); //Where callback is the name of our callback

/**
 * Working with related documents — population
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var authorSchema = Schema({
    name: String,
    stories: [{
        type: Schema.Types.ObjectId,
        ref: 'Story'
    }]
});

var storySchema = Schema({
    title: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Author'
    }
});

var Story = mongoose.model('Store', storySchema);
var Author = mongoose.model('Author', authorSchema);

/**
 * assigning the _id
 */

var bob = new Author({
    name: 'Bob Smith'
});

bob.save(function (err) {
    if (err) {
        return handleError(err);
    }
    // Bob new exists, so lets create a story 
    var story = new Story({
        title: "Bob goes sledding",
        author: bob._id // assign the _id from the our author Bob. This ID is created by default!
    });

    story.save(function (err) {
        if (err) return handleError(err);
        // Bob now has his sotry
    });
});

/**
 *  populate()
 */
Story
.findOne({
        title: 'Bob goes sledding'
    })
    .populate('author') // this populates the author id with actual author information! 
    .exec(function (err, story) {
        if (err) return handleError(err);
        console.log('The author is %s', story.author.name);
        // prints "This author is Bob smith"
    });


/**
 * assigning the _id value. 
 */
Story.find({author: bob._id})
.exec(function(err, stories){
    if (err) {
        return handleError(err);
    }
    // returns all stroies that have Bob's id as their their author.
});


/**
 * exporting the method to create the model
 */

 // File : ./models/somemodel.js

 // Require Mongoose

 var mongoose = require('mongoose');

 // Define a schema
 var Schema = mongoose.Schema;

 var SomeModelSchema = new Schema({
     a_string: String,
     a_date: Date
 })

 // Export function to create "SomeModel" model class
 module.exports = mongoose.model('SomeModel', SomeModelSchema );



 // Create a SomeModel model just by requiring the module
 var SomeModel = require('../models/somemodel');

 // Use the SomeModel object (model) to find all SomeModel records

 SomeModel.find(callback_function);