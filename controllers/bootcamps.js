//desc      Get all bootcamps
//route     GET /api/v1/bootcamps
//access    Public
exports.getBootcamps = (req, res, next) => {
    res.status(200).json('Get all BootCamps');
    // res.sendStatus();
};

//desc      Create all bootcamps
//route     POST /api/v1/bootcamps
//access    Private
exports.createBootcamps = (req, res, next) => {
    res.status(200).json('Create new bootcamp');
};

//desc      GET a single  bootcamps
//route     GET /api/v1/bootcamps/:Id
//access    Private
exports.getBootcampByID = (req, res, next) => {
    res.status(200).json(`Show Bootcamp ${req.params.id}`);
};

//desc      Update a bootcamp
//route     PUT /api/v1/bootcamps/:Id
//access    Private
exports.updateBootcamp = (req, res, next) => {
    res.status(200).json(`Modify Bootcamp ${req.params.id}`);
};

//desc      Delete a bootcamp
//route     DELETE /api/v1/bootcamps/:Id
//access    Private
exports.deleteBootcamp = (req, res, next) => {
    res.status(200).json(`Delete Bootcamp ${req.params.id}`);
};
