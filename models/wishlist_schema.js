const mongoose = require("mongoose");

const WishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",          // 👈 अपनी user model का नाम यहां रखो
      required: true,
    },

    // किस model का item है (dynamic ref)
    itemModel: {
      type: String,
      required: true,
      enum: [
        "aartichalisadata", // Mantra / Aarti / Chalisa
        "geetasloka",       // Geeta Sloka
        "kabirdohadata",    // Kabir Doha
        "thoughtquote",     // Normal quotes
        "VivekanandQuote",  // Swami Vivekanand quotes
      ],
    },

    // actual item id (उस model ka _id)
    item: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "itemModel", // 👈 yahan se dynamic ref lagta hai
    },
  },
  {
    timestamps: true,
  }
);

// same user + same item duplicate na ho
WishlistSchema.index(
  { user: 1, itemModel: 1, item: 1 },
  { unique: true }
);

module.exports = mongoose.model("WishlistData", WishlistSchema);
