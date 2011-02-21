// Auth Routes
app.get('/logout',function(req,res,params){
  req.logout();
  if(req.headers.referer){
    res.redirect(req.headers.referer);
  }
  else
    res.redirect('/');
});

app.get('/auth/facebook', function(req,res) {
  req.authenticate(['facebook'], function(error, authenticated) {
    res.redirect('/');
  });
});
