const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    artistId: { type: String, required: true},
    artistName: String,
    birthday: String,
    deathday: String,
    nationality: String,
    thumbnail: String,
    addedAt: Date
}, { timestamps: true });
FavoriteSchema.index({ userId: 1, artistId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', FavoriteSchema);
