import request from 'supertest';

import app from '../src/app';

describe('app', () => {
	it('responds with a not found message', (done) => {
		request(app)
			.get('/what-is-this-even')
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(404, done);
	});
});

describe('GET /api/health-check', () => {
	it('responds with a json message', (done) => {
		request(app)
			.get('/api/health-check')
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200, {
				status: 200,
				message: 'API - 👋🌎🌍🌏',
			}, done);
	});
});
