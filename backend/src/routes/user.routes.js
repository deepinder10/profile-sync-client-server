const express = require("express");
const userController = require("../controllers/user.controller");
const { createUserSchema, updateUserSchema, getUserSchema } = require("../schemas/user.schema");
const router = express.Router();

const validateParams = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.params);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const validateBody = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

router.get("/:id", validateParams(getUserSchema), userController.getUser);
router.post("/", validateBody(createUserSchema), userController.createUser);
router.patch("/:id", validateParams(getUserSchema), validateBody(updateUserSchema), userController.updateUser);

module.exports = router;
