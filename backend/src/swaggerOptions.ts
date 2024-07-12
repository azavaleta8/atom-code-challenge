import { Options } from 'swagger-jsdoc';

const swaggerOptions: Options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'To Do API',
			version: '1.0.0',
			description: 'API documentation',
		},
	},
	apis: ['./src/api/**/*.ts'], // Asegúrate de que esta ruta apunte a tus archivos de rutas
};

export default swaggerOptions;
