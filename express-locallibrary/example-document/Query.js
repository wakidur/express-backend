Author.find().sort([
    ['family_name', 'ascending']
]).exec(function (err, list_authors) {
    if (err) {
        return next(err);
    }
    res.render('./author/authorListView', {
        title: 'Author List',
        author_list: list_authors
    });
});