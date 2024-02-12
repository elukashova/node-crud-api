import 'dotenv/config';
import supertest from 'supertest';
import { StatusCodes, Endpoints, Errors } from '../enums/enums';

const port = +process.env.PORT! || 4000; 
const request = supertest(`http://localhost:${port}`); 

describe('CRUD API', () => {
    test('should inform if user data is not complete', () => {
        const dummyUser = {
            username: 'test',
            age: 10,
        };
        
        request
            .post(Endpoints.CreateUser)
            .send(JSON.stringify(dummyUser))
            .end((err, res) => {
                expect(res.status).toBe(StatusCodes.BadRequest);
                expect(JSON.parse(res.text)).toBe(Errors.Message400Body);
            });
    });

    test('should inform if user data is not valid', () => {
        const dummyUser = {
            username: 12,
            age: 10,
            hobbies: [ 11, 11]
        };
        
        request
            .post(Endpoints.CreateUser)
            .send(JSON.stringify(dummyUser))
            .end((err, res) => {
                expect(res.status).toBe(StatusCodes.BadRequest);
                expect(JSON.parse(res.text)).toBe(Errors.Message400Body);
            });
    });

    test('should inform that id doens\'t exist', () => {
        let userID = 'f4f756b9-0b40-4fbb-1232-a2c531114e43';

        request            
            .delete(`${Endpoints.GetUser}${userID}`)
            .end((err, res) => {
                expect(res.status).toBe(StatusCodes.BadRequest);
                expect(JSON.parse(res.text)).toBe(Errors.Message400Uuid);
            });
    });
});