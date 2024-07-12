import app from './app';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';
import { exit } from 'process';
import 'dotenv/config';

const { NODE_ENV, HOST, PORT, DB_API_KEY } = process.env;

const firebaseConfig = {
	apiKey: DB_API_KEY,
	authDomain: 'atom-challenge-d97de.firebaseapp.com',
	projectId: 'atom-challenge-d97de',
	storageBucket: 'atom-challenge-d97de.appspot.com',
	messagingSenderId: '812434207375',
	appId: '1:812434207375:web:1ed787c0a880776a85f6fa',
};

export let db: Firestore;

try {
	const firebase: FirebaseApp = initializeApp(firebaseConfig);
	db  = getFirestore(firebase);

	console.log('Firestore initialized successfully:', firebaseConfig.projectId);

	app.listen(PORT, () => {
		console.log(`Server (${NODE_ENV}) running on port http://${HOST}:${PORT}`);
		console.log(`Swagger docs are available at  http://${HOST}:${PORT}/api-docs`);
	});

} catch (error) {
	console.error('Error initializing the server:', error);
	exit();
}