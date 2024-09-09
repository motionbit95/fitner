import {
  collection,
  query,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  orderBy,
} from "firebase/firestore";
import { auth, db, storage } from "./firebase_conf";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
export const getAllDoc = async (collectionName) => {
  const q = query(collection(db, collectionName), orderBy("index", "asc"));
  const docs = [];
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    docs.push({ ...doc.data(), docId: doc.id });
  });
  return docs;
};

export const getAllDoc2 = async (collectionName) => {
  // console.log("getAllDoc2", collectionName);
  const q = query(collection(db, collectionName), orderBy("createdAt", "desc"));
  const docs = [];
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    docs.push({ ...doc.data(), docId: doc.id });
  });
  return docs;
};

export const addDocument = async (collectionName, data) => {
  console.log(data);
  const docRef = await addDoc(collection(db, collectionName), data);
  return docRef.id;
};

export const updateDocument = async (collectionName, docId, data) => {
  const docRef = doc(db, collectionName, docId);
  await updateDoc(docRef, data);
};

export const signAuth = async () => {
  signInAnonymously(auth)
    .then(() => {
      // Signed in..
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ...
    });
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
    console.log(uid);
    // ...
  } else {
    // User is signed out
    // ...
    signAuth();
  }
});

export const uploadFile = async (dir, file) => {
  console.log(file);
  const storageRef = ref(storage, dir + "/" + file.name);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
};
