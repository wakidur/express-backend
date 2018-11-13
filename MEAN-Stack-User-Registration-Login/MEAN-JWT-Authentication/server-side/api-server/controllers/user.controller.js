function getRegister(req, res, next) {
    console.log(`user register controller get`);

    res
        .status(200)
        .json({
            token: "token"
        });
}
function postRegister(req, res, next) {
    console.log(`user register controller post`);
    res
        .status(200)
        .json({
            token: "token"
        });
}

module.exports = {
    getRegister,
    postRegister,
};