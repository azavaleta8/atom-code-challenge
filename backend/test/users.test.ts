import request from 'supertest';
import app from '../src/app';
import { MessageResponse } from '../src/interfaces/ResponseType';
import { Token, UserType } from '../src/interfaces/UserType';

describe('User API Endpoints', () => {
	const testEmail = 'test@example.com';

	describe('POST /api/users', () => {
		it('should create a new user', async () => {
			const response = await request(app)
				.post('/api/users')
				.send({ email: testEmail });

			const body : MessageResponse = response.body as MessageResponse;
			expect(response.status).toBe(201);
			expect(body).toHaveProperty('status', 201);

			const payload : UserType[] = body.payload as UserType[]
			if (payload) {
				expect(payload[0]).toHaveProperty('id');
				expect(payload[0]).toHaveProperty('email', testEmail);
			} else {
				fail('Expected response.body.payload to be defined');
			}
		});

		it('should return 422 for invalid email format', async () => {
			const response = await request(app)
				.post('/api/users')
				.send({ email: 'invalidemail' });

			const body : MessageResponse = response.body as MessageResponse;
			expect(response.status).toBe(422);
			expect(body).toHaveProperty('status', 422);
			expect(body).toHaveProperty('error', 'Invalid email format');
		});

		it('should return 409 if user already exists', async () => {
			// Create user first
			await request(app).post('/api/users').send({ email: testEmail });

			// Attempt to create the same user again
			const response = await request(app)
				.post('/api/users')
				.send({ email: testEmail });

			expect(response.status).toBe(409);
			expect(response.body).toHaveProperty('status', 409);
			expect(response.body).toHaveProperty('error', 'User Already Exist');
		});
	});

	describe('GET /api/users/:email', () => {
		it('should retrieve an existing user by email', async () => {
			const response = await request(app).get(`/api/users/${testEmail}`);

			expect(response.status).toBe(200);

			const body : MessageResponse = response.body as MessageResponse;
			expect(response.body).toHaveProperty('status', 200);

			const payload : UserType[] = body.payload as UserType[]
			if (payload) {
				expect(payload[0]).toHaveProperty('id');
				expect(payload[0]).toHaveProperty('email', testEmail);
			} else {
				fail('Expected response.body.payload to be defined');
			}
		});

		it('should return 404 if user is not found', async () => {
			const response = await request(app).get('/api/users/nonexistent@example.com');

			const body : MessageResponse = response.body as MessageResponse;
			expect(response.status).toBe(404);
			expect(body).toHaveProperty('status', 404);
			expect(body).toHaveProperty('error', 'User Not Found');
		});

		it('should return 422 for invalid email format', async () => {
			const response = await request(app).get('/api/users/invalidemail');

			expect(response.status).toBe(422);
			expect(response.body).toHaveProperty('status', 422);
			expect(response.body).toHaveProperty('error', 'Invalid email format');
		});
	});

	describe('POST /api/users/login', () => {

		it('should login an existing user and return a JWT', async () => {
			const response = await request(app)
				.post('/api/users/login')
				.send({ email: testEmail });
	
			const body: MessageResponse = response.body as MessageResponse;
			expect(response.status).toBe(200);
			expect(body).toHaveProperty('status', 200);
	
			const payload = body.payload as Token;
			expect(payload).toHaveProperty('token');
			expect(payload.token).not.toBe('');
		});
	
		it('should return 404 if user is not found', async () => {
			const response = await request(app)
				.post('/api/users/login')
				.send({ email: 'nonexistent@example.com' });
	
			const body: MessageResponse = response.body as MessageResponse;
			expect(response.status).toBe(404);
			expect(body).toHaveProperty('status', 404);
			expect(body).toHaveProperty('error', 'User Not Found');
		});
	
		it('should return 422 for invalid email format', async () => {
			const response = await request(app)
				.post('/api/users/login')
				.send({ email: 'invalidemail' });
	
			expect(response.status).toBe(422);
			expect(response.body).toHaveProperty('status', 422);
			expect(response.body).toHaveProperty('error', 'Invalid email format');
		});
	});

	describe('DELETE /api/users/:email', () => {
		it('should delete an existing user by email', async () => {
			const response = await request(app).delete(`/api/users/${testEmail}`);

			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty('status', 200);
			expect(response.body).toHaveProperty('message', 'User successfully deleted');
		});

		it('should return 404 if user is not found', async () => {
			const response = await request(app).delete('/api/users/nonexistent@example.com');

			expect(response.status).toBe(404);
			expect(response.body).toHaveProperty('status', 404);
			expect(response.body).toHaveProperty('error', 'User Not Found');
		});

		it('should return 422 for invalid email format', async () => {
			const response = await request(app).delete('/api/users/invalidemail');

			expect(response.status).toBe(422);
			expect(response.body).toHaveProperty('status', 422);
			expect(response.body).toHaveProperty('error', 'Invalid email format');
		});
	});
});