module.exports.index = (req, res ) => {
    res.render("login");
}

module.exports.loginUser = (req, res) => {
    const redirectUrl = req.session.returnTo || "/";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req, res) => {
    req.logout();
    res.redirect("/");
}