import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-analytics.js";
import {getAuth,createUserWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  addDoc,
  setDoc,
  collection
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
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

const submit = document.getElementById("submit");
submit.addEventListener("click", async function (event) {
  event.preventDefault();
  const firstname = document.getElementById("fname").value;
  const lastname = document.getElementById("lname").value;
  const password = document.getElementById("pass").value;
  const confirmpassword = document.getElementById("passwordconf").value;
  const email = document.getElementById("e-mail").value;
  const phone = document.getElementById("mobile").value;
 
  function validateEmail(Email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(Email);
  }
  function validatePhoneNumber(phoneNumber) {
    const egyptianPhoneRegex = /^(01(0|1|2|5)[0-9]{8})$/;

    return egyptianPhoneRegex.test(phoneNumber);
  }
  if (!(firstname.length <= 12) || firstname.length == 0) {
    alert("الاسم الأول يجب ان يتكون من 1 الي 12 حرفًا");
  } else if (!(lastname.length <= 12) || lastname.length == 0) {
    alert("الاسم الثاني يجب ان يتكون من 1 الي 12 حرفًا");
  } else if (!validateEmail(email)) {
    alert("حساب الجيميل غير صحيح");
  } else if (!validatePhoneNumber(phone)) {
    alert("رقم الهاتف غير صحيح");
  } else if (password.length < 8) {
    alert("كلمة المرور يجب ان تتكون من 8 أحرف او أكثر");
  } else if (password != confirmpassword) {
    alert("تأكد ان كلمة المرور هي نفسها في خانة التأكيد");
    document.getElementById("passwordconf").value = "";
  } else {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        Name: firstname + " " + lastname,
        Email: email,
        Phone: phone,
      });
      alert("تم انشاء الحساب بنجاح");
      window.location = "login.html";
    } catch (error) {
      console.log(error.message);
      alert("هناك خطأ في التسجيل, حاول لاحقًا");
    }
  }
});
