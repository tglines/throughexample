var PostSchema = new Schema({
  category_id: ObjectId,
  url_name: String,
  items: [String],
  date: Date
});

mongoose.model('Post', PostSchema);
