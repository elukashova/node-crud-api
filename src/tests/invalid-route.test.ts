import 'dotenv/config';
import supertest from 'supertest';
import { StatusCodes, Endpoints, Errors } from '../enums/enums';

const port = +process.env.PORT! || 4000; 
const request = supertest(`http://localhost:${port}`); 

describe('CRUD API', () => {
    test('should inform that the endpoint is not valid', () => {
        const dummyRoute = '/invalid';
        
        request
            .get(dummyRoute)
            .end((err, res) => {
                expect(res.status).toBe(StatusCodes.NotFound);
                expect(JSON.parse(res.text)).toBe(Errors.Message404Endpoint);
            });
    });
});