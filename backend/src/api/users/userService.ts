import { collection, query, where, getDocs, DocumentSnapshot, QueryDocumentSnapshot } from 'firebase/firestore';
import { addDoc, DocumentData, QuerySnapshot, getDoc } from 'firebase/firestore';
import { DocumentReference, CollectionReference, Query } from 'firebase/firestore';
import { db } from '../../index';
import { UserType } from '../../interfaces/UserType';



/**
* * Función encargada de obtener un usuario por email 
* @param {String} email email del usuario a consultar
* @returns {Object} Documento con un objeto de tipo User
*/
export const fetchUser  = async (email: string) => {
    

	const usersRef : CollectionReference = collection(db, 'users');

	const q : Query = query(usersRef, where('email', '==', email));
	const querySnapshot : QuerySnapshot = await getDocs(q);
	const querySnapshotDocs : QueryDocumentSnapshot<DocumentData>[]  = querySnapshot.docs;

	const docsArray: UserType[] = querySnapshotDocs.reduce(

		(accumulator: UserType[], doc: QueryDocumentSnapshot<DocumentData>) => {

			const data = doc.data() as UserType;
			accumulator.push({
				id: doc.id,
				email: data.email,
			});
			return accumulator;

		}, [],

	);

	if (docsArray.length == 0) throw new Error('User Not Found');

	return docsArray;
    
};

export const createUser = async (email:string) => {
	
	const usersRef = collection(db, 'users');

	//Check if user already exist
	const user : UserType[] = await fetchUser(email);

	if (user.length !== 0) throw new Error('User Already exist');

	// Agregar el documento
	const docRef: DocumentReference<DocumentData> = await addDoc(usersRef, { email });

	// Obtener el documento recién creado
	const docSnapshot : DocumentSnapshot<DocumentData> = await getDoc(docRef);

	if (!docSnapshot.exists()) {
		throw new Error('User Not Created');
	}

	const data = docSnapshot.data() as UserType;
	const response : UserType = {
		id: docSnapshot.id, 
		email: data.email,
	};

	return [response];
    
};