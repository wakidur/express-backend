function homePage(req, res, next) {
    console.log(`user register controller`);
    res.render('index', { title: 'Express' });
}

module.exports = {
    homePage,
};