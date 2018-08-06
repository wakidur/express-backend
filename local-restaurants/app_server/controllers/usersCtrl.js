/**
 * Get user page
 */
function users(req, res) {
    res.render('users', {
        title: 'user',
        id: 123456,
        name: 'Wakidur',
        department: 'Web'
    });
}

module.exports = {
    users
}