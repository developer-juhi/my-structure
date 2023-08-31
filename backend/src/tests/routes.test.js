const request = require('supertest')
const app = require('../app')
describe('Post Endpoints', () => {
    it('should create a new post', async () => {
        const res = await request(app)
            .post('/user/verify-phone')
            .expect('Content-Type', /json/)
            .send({
                mobile_no: '+917575030796',
            })
        expect(res.statusCode).toEqual(201)
        expect(res.body).toHaveProperty('post')
    })
})