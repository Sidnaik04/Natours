const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty!'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.'],
    },
  },
  {
    // schema object for options
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// one user can write only one review for same tour
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// Query Middleware
// To populate tour and user field
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

// average tour rating
reviewSchema.statics.caclAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 }, //number of ratings
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  // console.log(stats);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

// middleware -> to call caclAverageRatings()
reviewSchema.post('save', function () {
  // this points to current review
  this.constructor.caclAverageRatings(this.tour);
});

// middleware -> to update caclAverageRatings() after review delete or update
// get access to document
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne(); //review
  next();
});

// to calculate after getting access
reviewSchema.post(/^findOneAnd/, async function () {
  //use of query this.findOne() directly doesn't wore here as query is already executed
  await this.r.constructor.caclAverageRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
