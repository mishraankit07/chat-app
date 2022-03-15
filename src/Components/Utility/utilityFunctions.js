import {db} from '../../firebase'
import { doc, getDoc } from "firebase/firestore";

// contains functions used multiple times throughout

// checks if a document within a collection -> collectionName exists or not
export async function checkDocExists(collectionName, docId) {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    let exists = false;

    if (docSnap.exists()) {
        exists = true;
    }

    return exists;
}