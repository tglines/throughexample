var express = require('express');
var force_domain = require('connect-force-domain');
app = module.exports = express.createServer(force_domain('www.throughexample.com'));
sys = require('sys');
fs = require('fs');

mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/db');
Schema = mongoose.Schema;
ObjectId = Schema.ObjectId

require('./models/account.js');
require('./models/category.js');
require('./models/post.js');

Account = mongoose.model('Account');
Category = mongoose.model('Category');
Post = mongoose.model('Post');

connect = require('connect');
auth = require('connect-auth')

mongoStore = require('connect-mongodb');

require('./secret_facebook_stuff.js');

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyDecoder());
  app.use(express.methodOverride());
  app.use(express.cookieDecoder());
  app.use(express.session({
    store: mongoStore({
      dbname: 'sessions',
      username: '',
      password: ''
    }),
    secret: 'another_secret'
  }));
  app.use(express.logger({ format: ':date :remote-addr :method :status :url' }));
  app.use(auth([
    auth.Facebook({appId : fbId, appSecret: fbSecret, scope : "email", callback: fbCallbackAddress})
  ]));
  app.use(express.staticProvider(__dirname + '/public'));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

loadAccount = function(req,callback){
  if(req.isAuthenticated() && req.getAuthDeatails().user.id){
    //its a facebook login - try and grab out of db otherwise make a user off of fbook credentials
    var fb_details = req.getAuthDetails();
    Account.findOne({ facebook_id: fb_details.user.id }, function(err,account){
      if(account){
        loadCallback(account);
      }
      else if (fb_details.user.id == trav_id){
        var n = new Account();
        n.email = fb_details.user.email;
        n.username = 'travis';
        n.facebook_id = fb_details.user.id;
        n.date = new Date();
        n.save(function(err){
          callback(n);
        });
      }
    });
  }
  else{
    callback(null);
  }
}

//Routes

// Main Routes/Controllers
require('./controllers/home.js');
require('./controllers/auth.js');
require('./controllers/ajax.js');

//Only listen on $ node app.js
if (!module.parent) {
  app.listen(80);
  console.log("Express server listening on port %d", app.address().port)
}
