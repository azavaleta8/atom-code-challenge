import request from 'supertest';
import app from '../src/app';

describe('app', () => {
	it('responds with a not found message', async () => {
		await request(app)
			.get('/what-is-this-even')
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(404);
	});

	it('GET /api/health-check responds with a json message', async () => {
		await request(app)
			.get('/api/health-check')
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200, {
				status: 200,
				message: 'API - 👋🌎🌍🌏',
			});
	});
});