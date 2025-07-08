const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

// Factory function for delete operation
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No doc found with that ID', 404));
    }

    res.status(204).json({
      //204 status code => no content
      status: 'Success',
      data: null,
    });
  });

// Factory function for update operation
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError('No doc found with that ID', 404));
    }

    res.status(200).json({
      status: 'Success',
      data: {
        data: doc,
      },
    });
  });

// Factory function for create operation
exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      //201 status code => sent
      status: 'Success',
      data: {
        data: doc,
      },
    });
  });

// Factory function for reading one doc
exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError('No doc found with that ID', 404));
    }

    res.status(200).json({
      status: 'Success',
      data: {
        data: doc,
      },
    });
  });

// Factory function for reading all docs
exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // get endpoint for nested route -> GET reviews on tour
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    // EXECUTE QUERY
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const doc = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      //200 status code => Ok
      status: 'Success',
      requestAt: req.requestTime,
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });
