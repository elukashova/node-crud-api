export enum Requests {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Delete = 'DELETE',
}

export enum Actions {
  GetUsers,
  GetUser,
  CreateUser,
  UpdateUser,
  DeleteUser,
}

export enum Endpoints {
  Base = '/api/users',
  GetUsers = '/api/users',
  GetUser = '/api/users/',
  CreateUser = '/api/users',
  UpdateUser = '/api/users/',
  DeleteUser = '/api/users/',
}

export enum StatusCodes {
  Ok = 200,
  Created = 201,
  NoContent = 204,
  BadRequest = 400,
  NotFound = 404,
  InternalServerError = 500,
}

export enum Errors {
  Message404NotFound = 'The requested resource cannot be found by the server.',
  Message404User = 'The user with this id cannot be found by the server.',
  Message404Endpoint = 'Ooops, this endpoint doesn\'t seem correct. Please retry.',
  Message400Uuid = 'Invalid UUID. Please, provide a correct one.',
  Message400Body = 'Invalid user data. Please, provide user\'s \'username\', \'age\' and [hobbies].',
  Message500Server = 'The server encountered an error and could not complete your request.'
}