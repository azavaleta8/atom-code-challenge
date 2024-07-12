import { collection, query, where, getDocs, DocumentSnapshot, QueryDocumentSnapshot, deleteDoc } from 'firebase/firestore';
import { addDoc, DocumentData, QuerySnapshot, getDoc } from 'firebase/firestore';
import { DocumentReference, CollectionReference, Query } from 'firebase/firestore';
import { db } from '../../index';
import { UserType } from '../../interfaces/UserType';

/**
 * Function to fetch a user document by email.
 * @param {String} email Email of the user to fetch.
 * @returns {Object} Document containing a User object.
 */
export const fetchUserByEmail = async (email: string) => {

	// Reference to the 'users' collection in Firestore
	const usersRef: CollectionReference = collection(db, 'users');

	// Query to find documents where 'email' field equals the provided email
	const q: Query = query(usersRef, where('email', '==', email));
    
	// Execute the query and get a snapshot of the results
	const querySnapshot: QuerySnapshot = await getDocs(q);
    
	// Array to hold transformed user data
	const docsArray: UserType[] = querySnapshot.docs.reduce(
		// Reducing the query snapshot to an array of UserType objects
		(accumulator: UserType[], doc: QueryDocumentSnapshot<DocumentData>) => {
			// Extract data from the document and cast it to UserType
			const data = doc.data() as UserType;
			accumulator.push({
				id: doc.id,
				email: data.email,
			});
			return accumulator;
		}, []
	);

	// If no documents found, throw an error
	if (docsArray.length === 0) throw new Error('User Not Found');

	// Return the array of UserType objects
	return docsArray;
};

/**
 * Function to create a new user document in Firestore.
 * @param {String} email Email of the user to create.
 * @returns {Array} Array containing the newly created User object.
 */
export const createUser = async (email: string) => {

	// Reference to the 'users' collection in Firestore
	const usersRef: CollectionReference = collection(db, 'users');

	// Query to find documents where 'email' field equals the provided email
	const q: Query = query(usersRef, where('email', '==', email));

	// Get the query snapshot (expecting only one document)
	const querySnapshot: QuerySnapshot = await getDocs(q);

	// Check if there is the user not exist
	if (querySnapshot.size !== 0) {
		throw new Error('User Already Exist');
	}

	// Add a new document to the 'users' collection with the provided email
	const docRef: DocumentReference<DocumentData> = await addDoc(usersRef, { email });

	// Get the newly created document snapshot
	const docSnapshot: DocumentSnapshot<DocumentData> = await getDoc(docRef);

	// If document does not exist, throw an error
	if (!docSnapshot.exists()) {
		throw new Error('User Not Created');
	}

	// Extract data from the document snapshot and cast it to UserType
	const data = docSnapshot.data() as UserType;

	// Construct a response object with id and email
	const response: UserType = {
		id: docSnapshot.id,
		email: data.email,
	};

	// Return the response object as an array
	return [response];
};

/**
 * Function to delete a user document by email.
 * @param {String} email Email of the user to delete.
 * @returns {void}
 */
export const deleteUserByEmail = async (email: string) => {
	
	// Reference to the 'users' collection in Firestore
	const usersRef: CollectionReference = collection(db, 'users');

	// Query to find documents where 'email' field equals the provided email
	const q: Query = query(usersRef, where('email', '==', email));

	// Get the query snapshot (expecting only one document)
	const querySnapshot: QuerySnapshot = await getDocs(q);

	// Check if there is exactly one document found
	if (querySnapshot.size !== 1) {
		throw new Error('User Not Found');
	}

	// Get the document reference
	const docSnapshot = querySnapshot.docs[0];
	
	// Delete the document
	await deleteDoc(docSnapshot.ref);

	// Return success message or handle as needed
	return "User successfully deleted";
};