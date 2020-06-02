module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('errors_msg','please login to view this resource');
    res.redirect("/users/login");
},
  ensureNotAuthenticated:(req,res,next)=>{
      if(req.isAuthenticated()){
        return  res.redirect('/dashboard')
      }else{
       return next()
      }
  }
};
