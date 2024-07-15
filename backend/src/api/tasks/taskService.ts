import { collection, query, where, getDocs, DocumentSnapshot, QueryDocumentSnapshot, deleteDoc, Timestamp } from 'firebase/firestore';
import { addDoc, DocumentData, QuerySnapshot, getDoc } from 'firebase/firestore';
import { DocumentReference, CollectionReference, Query } from 'firebase/firestore';
import { db } from '../../index';
import { RequestBodyTask, TaskType } from '../../interfaces/TaskType';

/**
 * Function to create a new taks document in Firestore.
 * @param {String} task data of the task to create.
 * @returns {Array} Array containing the newly created Task object.
 */
export const createTask = async (task : RequestBodyTask) => {

	// Reference to the 'users' collection in Firestore
	const tasksRef : CollectionReference = collection(db, 'tasks');

    const now = Timestamp.now().toDate().toISOString();

	const newTask = { 
        ...task, 
        createdAt: now, 
        updatedAt: now 
    };

	// Add a new document to the 'Task' collection with the provided data
	const docRef : DocumentReference<DocumentData> = await addDoc(tasksRef, newTask);

	// Get the newly created document snapshot
	const docSnapshot: DocumentSnapshot<DocumentData> = await getDoc(docRef);

	// If document does not exist, throw an error
	if (!docSnapshot.exists()) {
		throw new Error('Task Not Created');
	}

	// Extract data from the document snapshot and cast it to TaskType
	const data = docSnapshot.data() as TaskType;

	// Construct a response object
	const response: TaskType = { 
        id: docRef.id, 
        ...data,
    }; 

	// Return the response object as an array
	return [response];
};