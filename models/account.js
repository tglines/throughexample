var AccountSchema = new Schema({
  facebook_id: String,
  email: String,
  password: String,
  date: Date
});

mongoose.model('Account', AccountSchema);
