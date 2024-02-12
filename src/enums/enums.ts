export enum Requests {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Delete = 'DELETE',
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
  Message404 = 'The requested resource cannot be found by server',
  Message400Uuid = 'Invalid UUID. Please, provide a correct one.',
}