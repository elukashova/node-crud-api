import 'dotenv/config';
import supertest from 'supertest';
import { StatusCodes, Endpoints, Errors } from '../enums/enums';

const port = +process.env.PORT! || 4000; 
const request = supertest(`http://localhost:${port}`); 

describe('CRUD API', () => {
    test('should get all users', () => {
        request
            .get(Endpoints.GetUsers)
            .end((err, res) => {
                expect(res.status).toBe(StatusCodes.Ok);
                expect(Array.isArray(JSON.parse(res.text))).toBe(true);
                expect(JSON.parse(res.text)).toHaveLength(0);
            })
    });

    let userID: string;
    const dummyUser = {
        username: 'test',
        age: 10,
        hobbies: ['test', 'test'],
    };

    test('should create a new user', done => {
        request
            .post(Endpoints.CreateUser)
            .send(JSON.stringify(dummyUser))
            .end((err, res) => {
                expect(res.status).toBe(StatusCodes.Created);
                expect(JSON.parse(res.text)).toHaveProperty('id');
                expect(JSON.parse(res.text)).toMatchSnapshot({id: expect.any(String), username: dummyUser.username, age: dummyUser.age, hobbies: dummyUser.hobbies});
                userID = JSON.parse(res.text).id;
                done();
            });
    });

    test('should get a user by id', () => {
        request
            .get(`${Endpoints.GetUser}${userID}`)
            .end((err, res) => {
                expect(res.status).toBe(StatusCodes.Ok);
                expect(JSON.parse(res.text)).toHaveProperty('id');
                expect(JSON.parse(res.text).id).toMatch(userID);
                expect(JSON.parse(res.text)).toHaveProperty('username');
                expect(JSON.parse(res.text)).toHaveProperty('age');
                expect(JSON.parse(res.text)).toHaveProperty('hobbies');
            });
    });

    const updatedDummyUser = {
        username: 'test2',
        age: 12,
        hobbies: ['test2', 'test2'],
    };

    test('should update user data', () => {
        request
            .put(`${Endpoints.UpdateUser}${userID}`)
            .send(JSON.stringify(updatedDummyUser))
            .end((err, res) => {
                expect(JSON.parse(res.text)).toMatchSnapshot({id: userID, username: 'test2', age: 12, hobbies: ['test2', 'test3']});
            });
    });

    test('should delete user data', () => {
        request
            .delete(`${Endpoints.DeleteUser}${userID}`)
            .end((err, res) => {
                expect(res.status).toBe(StatusCodes.NoContent);
            });
    });
});
