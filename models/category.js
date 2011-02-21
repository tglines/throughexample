var CategorySchema = new Schema({
  url_name : String,
  date: Date
});

mongoose.model('Category', CategorySchema);
