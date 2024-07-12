import request from 'supertest';
import app from '../src/app';
import { db } from '../src/index'; // Ensure this is the correct path

describe('User API Endpoints', () => {
	const testEmail = 'test@example.com';

	// afterAll(async () => {
	// 	// Clean up the test user if it exists
	// 	await db.collection('users').doc(testEmail).delete();
	// });

	describe('POST /api/users', () => {
		it('should create a new user', async () => {
			const response = await request(app)
				.post('/api/users')
				.send({ email: testEmail });

			expect(response.status).toBe(201);
			expect(response.body).toHaveProperty('status', 201);
			expect(response.body.payload[0]).toHaveProperty('id');
			expect(response.body.payload[0]).toHaveProperty('email', testEmail);
		});

		it('should return 422 for invalid email format', async () => {
			const response = await request(app)
				.post('/api/users')
				.send({ email: 'invalidemail' });

			expect(response.status).toBe(422);
			expect(response.body).toHaveProperty('status', 422);
			expect(response.body).toHaveProperty('error', 'Invalid email format');
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
			expect(response.body).toHaveProperty('status', 200);
            expect(response.body.payload[0]).toHaveProperty('id');
			expect(response.body.payload[0]).toHaveProperty('email', testEmail);
		});

		it('should return 404 if user is not found', async () => {
			const response = await request(app).get('/api/users/nonexistent@example.com');

			expect(response.status).toBe(404);
			expect(response.body).toHaveProperty('status', 404);
			expect(response.body).toHaveProperty('error', 'User Not Found');
		});

		it('should return 422 for invalid email format', async () => {
			const response = await request(app).get('/api/users/invalidemail');

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