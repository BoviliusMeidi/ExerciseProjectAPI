const usersService = require('./users-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

/**
 * Handle get list of users request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getUsers(request, response, next) {
  try {
    const users = await usersService.getUsers();
    return response.status(200).json(users);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get user detail request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getUser(request, response, next) {
  try {
    const user = await usersService.getUser(request.params.id);

    if (!user) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown user');
    }

    return response.status(200).json(user);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle create user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function createUser(request, response, next) {
  try {
    const name = request.body.name;
    const emailBefore = request.body.email;
    const email = emailBefore.toLowerCase();
    const password = request.body.password;
    const password_confirm = request.body.password_confirm;
    const checkEmail = await usersService.getCheckEmail(email);

    if (!checkEmail) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Email already exist'
      );
    }

    if (password_confirm != password) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Invalid Confirm Password'
      );
    }

    const success = await usersService.createUser(
      name,
      email,
      password,
      password_confirm
    );
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create user'
      );
    }

    return response.status(200).json({ name, email });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updateUser(request, response, next) {
  try {
    const id = request.params.id;
    const name = request.body.name;
    const emailBefore = request.body.email;
    const email = emailBefore.toLowerCase();
    const checkEmail = await usersService.getCheckEmail(email);

    if (!checkEmail) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Email already exist'
      );
    }

    const success = await usersService.updateUser(id, name, email);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update user'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update user password request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updatePassword(request, response, next) {
  try {
    const id = request.params.id;
    const old_password = request.body.old_password;
    const password = request.body.password;
    const password_confirm = request.body.password_confirm;
    const checkPasswordOld = await usersService.getCheckPasswordOld(
      id,
      old_password
    );

    if (!checkPasswordOld) {
      throw errorResponder(errorTypes.INVALID_PASSWORD, 'Invalid Old Password');
    }

    if (password_confirm != password) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Invalid Confirm Password'
      );
    }

    const success = await usersService.updatePassword(id, password);
    if (!success) {
      throw errorResponder(
        errorTypes.WRONG_RESET_PASSWORD_TOKEN,
        'Invalid update password'
      );
    }

    return response
      .status(200)
      .json({ id, message: 'Password Success Change' });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle delete user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteUser(request, response, next) {
  try {
    const id = request.params.id;

    const success = await usersService.deleteUser(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete user'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updatePassword,
  deleteUser,
};
