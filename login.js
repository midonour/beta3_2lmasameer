import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-analytics.js";
import {getAuth,signInWithEmailAndPassword,} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import {getFirestore,doc,addDoc,setDoc,collection,} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyDw94vAJhWbCgOyueN1lLHZ8w5OJaZdaPY",
  authDomain: "beta3-2lmsameer.firebaseapp.com",
  databaseURL: "https://beta3-2lmsameer-default-rtdb.firebaseio.com",
  projectId: "beta3-2lmsameer",
  storageBucket: "beta3-2lmsameer.firebasestorage.app",
  messagingSenderId: "882100066937",
  appId: "1:882100066937:web:8ee77b1a3d6580dbb152a8",
  measurementId: "G-Q2W8520QL4",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

const btn = document.getElementById("submit");
btn.addEventListener("click", (event)=>{
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      alert("تم تسجيل الدخول");
      window.location = "main page.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(`حدث خطأ! حاول مرة اخرى`);
    });
})