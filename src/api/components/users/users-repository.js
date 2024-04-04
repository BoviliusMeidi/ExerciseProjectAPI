const { User } = require('../../../models');
const { password } = require('../../../models/users-schema');

/**
 * Get a list of users
 * @returns {Promise}
 */
async function getUsers() {
  return User.find({});
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function getUser(id) {
  return User.findById(id);
}

/**
 * Get user detail(email)
 * @param {string} email - User email
 * @returns {Promise}
 */
async function getUserEmail(email) {
  return User.findOne({email: email});
}

/**
 * Get user detail(password)
 * @param {string} oldpassword - User old password
 * @returns {Promise}
 */
// Assuming bcrypt is used for hashing and you have a method to get the user by username
async function checkOldPassword(id, oldPassword) {
  const user = await User.findOne({ id: id });
  if (user) {
      const match = await bcrypt.compare(oldPassword, user.password);
      if (match) {
          return true;
      } else {
          return false;
      }
  } else {
      return false;
  }
}


/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Hashed password
 * @returns {Promise}
 */
async function createUser(name, email, password) {
  return User.create({
    name,
    email,
    password,
  });
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateUser(id, name, email) {
  return User.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        email,
      },
    }
  );
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} password - Password
 * @returns {Promise}
 */
async function updatePassword(id, password) {
  return User.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        password,
      },
    }
  );
}

/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function deleteUser(id) {
  return User.deleteOne({ _id: id });
}

module.exports = {
  getUsers,
  getUser,
  getUserEmail,
  checkOldPassword,
  createUser,
  updateUser,
  updatePassword,
  deleteUser,
};
