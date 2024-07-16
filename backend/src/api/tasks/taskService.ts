import { collection, query, where, getDocs, DocumentSnapshot, QueryDocumentSnapshot, deleteDoc, Timestamp, doc, updateDoc } from 'firebase/firestore';
import { addDoc, DocumentData, QuerySnapshot, getDoc } from 'firebase/firestore';
import { DocumentReference, CollectionReference, Query } from 'firebase/firestore';
import { db } from '../../index';
import { RequestBodyTask, TaskType } from '../../interfaces/TaskType';

/**
 * Function to fetch a tasks document by userId.
 * @param {String} userId userId of the user to fetch.
 * @returns {Object} Document containing a User object.
 */
export const fetchTaskByUserId = async (userId: string) => {

	// Reference to the 'tasks' collection in Firestore
	const tasksRef : CollectionReference = collection(db, 'tasks');

	// Query to find documents where 'email' field equals the provided email
	const q: Query = query(tasksRef, where('userId', '==', userId));
    
	// Execute the query and get a snapshot of the results
	const querySnapshot: QuerySnapshot = await getDocs(q);
    
	// Array to hold transformed user data
	const docsArray: TaskType[] = querySnapshot.docs.reduce(
		// Reducing the query snapshot to an array of UserType objects
		(accumulator: TaskType[], doc: QueryDocumentSnapshot<DocumentData>) => {
			// Extract data from the document and cast it to UserType
			const data = doc.data() as TaskType;
			accumulator.push({
				id: doc.id,
				...data,
			});
			return accumulator;
		}, []
	);

	// Return the array of UserType objects
	return docsArray;
};


/**
 * Function to create a new taks document in Firestore.
 * @param {String} task data of the task to create.
 * @returns {Array} Array containing the newly created Task object.
 */
export const createTask = async (task : RequestBodyTask) => {

	// Reference to the 'tasks' collection in Firestore
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

/**
 * Function to update a task document by taskId.
 * @param {String} taskId Id of the task to delete.
 * @param {String} updates data to update.
 * @returns {void}
 */
export const updateTask = async (taskId: string, updates: RequestBodyTask): Promise<TaskType> => {

	const taskRef : DocumentReference<DocumentData, DocumentData> = doc(db, 'tasks', taskId);
	const taskSnap : DocumentSnapshot<DocumentData>= await getDoc(taskRef);
  
	if (!taskSnap.exists()) {
		throw new Error('Task not found');
	}
  
	const now = Timestamp.now().toDate().toISOString();

	const updatedTask  = {
		...taskSnap.data() as TaskType,
		...updates,
		updatedAt: now
	};
	
	console.log(updateTask)
	await updateDoc(taskRef, updatedTask);
  
	return { id: taskId, ...updatedTask };
};

/**
 * Function to delete a task document by taskId.
 * @param {String} userId UserId of the task to delete.
 * @param {String} taskId Id of the task to delete.
 * @returns {void}
 */
export const deleteTask = async (userId: string, taskId: string) => {
	
	// Query to find taks by ID
	const q : DocumentReference<DocumentData, DocumentData> = doc(db, "tasks", taskId)

	// Get the query snapshot (expecting only one document)
	const querySnapshot: DocumentSnapshot<DocumentData> = await getDoc(q);
	const taskDoc : TaskType = querySnapshot.data() as TaskType

	// Check if there is exactly one document found
	if (!querySnapshot.exists()) {
		throw new Error('Task Not Found');
	}

	if (taskDoc.userId !== userId) {
		throw new Error('Unauthorized to delete this task');
	}

	// Get the document reference
	const docSnapshot = querySnapshot;

	// Delete the document
	await deleteDoc(docSnapshot.ref);

	// Return success message or handle as needed
	return "Task successfully deleted";
};