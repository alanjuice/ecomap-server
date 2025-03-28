const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  profilepic: {
    type: String,
    default:
      "https://cdn.pixabay.com/photo/2021/07/02/04/48/user-6380868_1280.png",
  },
});

userSchema.pre("findOneAndDelete", async function (next) {
  try {
    const user = await this.model.findOne(this.getQuery());
    if (user) {
      await mongoose.model("Upload").deleteMany({ user: user._id });
      await mongoose.model("Occurrence").deleteMany({ userId: user._id });
    }
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
