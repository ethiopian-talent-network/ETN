

exports.authorizeRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res
        .status(403)
        .json({ msg: "you dont have access this resource" });
    }
    next();
  };
};