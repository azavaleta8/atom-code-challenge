import request from 'supertest';
import app from '../src/app';  // Ajusta esta ruta según la ubicación de tu app
import { MessageResponse } from '../src/interfaces/ResponseType';
import { TaskType } from '../src/interfaces/TaskType';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'SECRET';

describe('Task API Endpoints', () => {
	let authToken: string;
	let userId: string;
	let taskId: string;

	beforeAll(() => {
		userId = 'testUserId';
		authToken = jwt.sign({ id: userId }, JWT_SECRET);
	});

	describe('POST /api/tasks', () => {
		it('should create a new task', async () => {
			const newTask = {
				userId,
				title: 'Test Task',
				description: 'This is a test task',
				completed: false
			};

			const response = await request(app)
				.post('/api/tasks')
				.set('Authorization', `Bearer ${authToken}`)
				.send(newTask);

			const body = response.body as MessageResponse;
			const payload = body.payload as TaskType[];
			expect(response.status).toBe(201);
			expect(body).toHaveProperty('status', 201);
			expect(payload).toHaveLength(1);

			const task = payload[0];
			expect(task).toHaveProperty('id');
			expect(task).toHaveProperty('userId', userId);
			expect(task).toHaveProperty('title', newTask.title);
			expect(task).toHaveProperty('description', newTask.description);
			expect(task).toHaveProperty('completed', newTask.completed);
			expect(task).toHaveProperty('createdAt');
			expect(task).toHaveProperty('updatedAt');

			taskId = task.id as string;  // Save for later tests
		});

		it('should return 401 if not authenticated', async () => {
			const response = await request(app)
				.post('/api/tasks')
				.send({});

			expect(response.status).toBe(401);
		});
	});

	describe('GET /api/tasks/users/:userId', () => {
		it('should get all tasks for a user', async () => {
			const response = await request(app)
				.get(`/api/tasks/users/${userId}`)
				.set('Authorization', `Bearer ${authToken}`);

			const body = response.body as MessageResponse;
			expect(response.status).toBe(200);
			expect(body).toHaveProperty('status', 200);
			expect(Array.isArray(body.payload)).toBe(true);

			const tasks = body.payload as TaskType[];
			expect(tasks.length).toBeGreaterThan(0);
			tasks.forEach(task => {
				expect(task).toHaveProperty('id');
				expect(task).toHaveProperty('userId', userId);
				expect(task).toHaveProperty('title');
				expect(task).toHaveProperty('description');
				expect(task).toHaveProperty('completed');
				expect(task).toHaveProperty('createdAt');
				expect(task).toHaveProperty('updatedAt');
			});
		});

		it('should return 401 if not authenticated', async () => {
			const response = await request(app)
				.get(`/api/tasks/users/${userId}`);

			expect(response.status).toBe(401);
		});
	});

	describe('PUT /api/tasks/:taskId', () => {

		it('should return 401 if not authenticated', async () => {
			const response = await request(app)
				.put(`/api/tasks/${taskId}`)
				.send({});

			expect(response.status).toBe(401);
		});

		it('should return 403 if trying to update another user\'s task', async () => {

			const updateData = {
				userId,
				title: 'Updated Test Task',
				description: 'This is an updated test task',
				completed: true
			};

			const anotherUserToken = jwt.sign({ id: 'anotherUserId' }, JWT_SECRET);

			const response = await request(app)
				.put(`/api/tasks/${taskId}`)
				.set('Authorization', `Bearer ${anotherUserToken}`)
				.send(updateData);

			expect(response.status).toBe(403);
		});

		it('should update an existing task', async () => {

			const updateData = {
				userId,
				title: 'Updated Test Task',
				description: 'This is an updated test task',
				completed: true
			};

			const response = await request(app)
				.put(`/api/tasks/${taskId}`)
				.set('Authorization', `Bearer ${authToken}`)
				.send(updateData);

			const body = response.body as MessageResponse;
			const payload = body.payload as TaskType[];
			expect(response.status).toBe(200);
			expect(body).toHaveProperty('status', 200);
			expect(payload).toHaveLength(1);

			const updatedTask = payload[0];
			expect(updatedTask).toHaveProperty('id', taskId);
			expect(updatedTask).toHaveProperty('userId', userId);
			expect(updatedTask).toHaveProperty('title', updateData.title);
			expect(updatedTask).toHaveProperty('description', updateData.description);
			expect(updatedTask).toHaveProperty('completed', updateData.completed);
			expect(updatedTask).toHaveProperty('createdAt');
			expect(updatedTask).toHaveProperty('updatedAt');
		});
	});

	describe('DELETE /api/tasks/:taskId', () => {

		it('should return 401 if not authenticated', async () => {
			const response = await request(app)
				.delete(`/api/tasks/${taskId}`);

			expect(response.status).toBe(401);
		});

		it('should return 403 if trying to delete another user\'s task', async () => {
			const anotherUserToken = jwt.sign({ id: 'anotherUserId' }, JWT_SECRET);

			const response = await request(app)
				.delete(`/api/tasks/${taskId}`)
				.set('Authorization', `Bearer ${anotherUserToken}`);

			expect(response.status).toBe(403);
		});

		it('should delete an existing task', async () => {
			const response = await request(app)
				.delete(`/api/tasks/${taskId}`)
				.set('Authorization', `Bearer ${authToken}`);

			const body = response.body as MessageResponse;
			expect(response.status).toBe(200);
			expect(body).toHaveProperty('status', 200);
			expect(body).toHaveProperty('message', 'Task successfully deleted');
		});

	});
});