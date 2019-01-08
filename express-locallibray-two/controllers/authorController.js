const Author = require('../models/authorModule');



// Get all author
function getAllAuthor(req, res, next) {
    Author.find().then((result) => {
        res.render('./author/authorListView', {
            title: "Author list",
            authors: result
        });
    }).catch((err) => {
        req.flash('error', err);
    });
}

// Display Author create form on GET
function authorCreateGet(req, res) {
    res.render('./author/authorCreateFormView', {
        title: "Create Author"
    });
}

function authorCreatePost(req, res) {
    
    // Create an Author object with escaped and trimmed data.
    let author = new Author();
    author.firstName = req.body.firstName || '';
    author.lastName = req.body.lastName || '';
    author.professionalBackground = req.body.professionalBackground || '';
    author.education = req.body.education || '';
    author.currentBusinessOrProfession = req.body.currentBusinessOrProfession || '';
    author.achievementsOrAwards = req.body.achievementsOrAwards || '';
    author.PreviousPublishingExperience = req.body.PreviousPublishingExperience || '';
    author.personalDetails.family.wifeName = req.body.wifeName || '';
    author.personalDetails.family.childName = req.body.childName || '';
    author.personalDetails.cityOfResidence = req.body.cityOfResidence || '';
    author.personalDetails.location = req.body.location || '';
    author.contactInformation.email = req.body.email || '';
    author.contactInformation.website = req.body.website || '';
    author.contactInformation.phoneNumber = req.body.phoneNumber || '';
    author.contactInformation.picture = req.body.picture || '';
    author.whatAuthorSaid = req.body.whatAuthorSaid || '';
    author.dateOfBirth = req.body.dateOfBirth || '';
    author.dateOfDeath = req.body.dateOfDeath || '';


    author.save(function (err, result) {
        if (err) {
            req.flash('error', err);
        }
        // Successful - redirect to new author record.
        console.log(result);
    });
}




// Controller function expose
exports.authorCreateGet = authorCreateGet;
exports.authorCreatePost = authorCreatePost;
exports.getAllAuthor = getAllAuthor;