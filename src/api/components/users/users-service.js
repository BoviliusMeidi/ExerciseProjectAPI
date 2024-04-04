const usersRepository = require('./users-repository');
const passwordBcrypt = require('../../../utils/password');

/**
 * Get list of users
 * @returns {Array}
 */
async function getUsers() {
  const users = await usersRepository.getUsers();

  const results = [];
  for (let i = 0; i < users.length; i += 1) {
    const user = users[i];
    results.push({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  return results;
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

/**
 * Get user email detail
 * @param {string} email - email
 * @returns {Object}
 */
async function getCheckEmail(email) {
  const checkEmail = await usersRepository.getUserEmail(email);

  // Email
  if (!checkEmail) {
    return true;
  } else {
    return false;
  }
}

/**
 * Get user password detail
 * @param {string} oldpassword - password
 * @returns {Object}
 */
async function getCheckPasswordOld(id, oldPassword) {
  const user = await usersRepository.getUser(id);
  console.log(user);
  if (user) {
    const match = await passwordBcrypt.passwordMatched(
      oldPassword,
      user.password
    );
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
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createUser(name, email, password) {
  // Hash password
  const hashedPassword = await passwordBcrypt.hashPassword(password);

  try {
    await usersRepository.createUser(name, email, hashedPassword);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateUser(id, name, email) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.updateUser(id, name, email);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update password user
 * @param {string} id - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function updatePassword(id, password) {
  const user = await usersRepository.getUser(id);
  const hashedPassword = await passwordBcrypt.hashPassword(password);
  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.updatePassword(id, hashedPassword);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.deleteUser(id);
  } catch (err) {
    return null;
  }

  return true;
}

module.exports = {
  getUsers,
  getUser,
  getCheckEmail,
  getCheckPasswordOld,
  createUser,
  updateUser,
  updatePassword,
  deleteUser,
};
