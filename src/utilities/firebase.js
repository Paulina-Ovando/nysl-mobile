import { initializeApp } from "firebase/app";
import { getDatabase, ref } from "firebase/database";
import { useObject } from "react-firebase-hooks/database";

const firebaseConfig = {
  apiKey: "AIzaSyDg-uMeuist3a1ZuKOnfOB1XGtYbIZVVF4",
  authDomain: "nysl-mobile-1840a.firebaseapp.com",
  databaseURL: "https://nysl-mobile-1840a-default-rtdb.firebaseio.com/",
  projectId: "nysl-mobile-1840a",
  storageBucket: "nysl-mobile-1840a.firebasestorage.app",
  messagingSenderId: "410858659245",
  appId: "1:410858659245:web:3cdd731cfc1ea15cf2d524"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);

export const useData = (path, transform) => {
  const [snapshot, loading, error] = useObject(ref(database, path));
  let data;
  if (snapshot) {
    const value = snapshot.val();
    data = !loading && !error && transform ? transform(value) : value;
  }
  return [data, loading, error];
};