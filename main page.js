import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-analytics.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  updateDoc,
  setDoc,
  addDoc,
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

const usersSection = document.getElementById("clientDetails");
let username = "";
let userphone = "";
let useremail = "";
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const uid = user.uid;
    try {
      const userDocRef = doc(db, "users", uid); // Reference to the user's document
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        // Now you have the user's data in the userData object.
        // Display it on the page.
        const name = document.getElementById("name");
        const email = document.getElementById("email");
        const phone = document.getElementById("phone");
        username = userData.Name;
        userphone = userData.Phone;
        useremail = userData.Email;
        if (name) {
          name.textContent += userData.Name || "الاسم غير متاح"; // Handle cases where data might be missing
        }
        if (email) {
          email.innerHTML += "<br>" + (userData.Email || "الجيميل غير متاح");
        }
        if (phone) {
          phone.textContent += userData.Phone || "رقم الهاتف غير متاح";
        }
      } else {
        console.log("User document not found in Firestore.");
        const nameElement = document.getElementById("name");
        if (nameElement) {
          nameElement.textContent = "Please Complete Profile";
        }
      }
    } catch (error) {
      console.error("Error getting user data:", error);
    }
  } else {
    alert("signed out");
  }
});

let addbtn = document.getElementById("add");
let kind = document.getElementById("kind");
let size = document.getElementById("size");
let length = document.getElementById("length");
let weight = document.getElementById("weight");

kind.addEventListener("change", function () {
  length.style.visibility = this.value !== "مسمار" ? "hidden" : "visible";
});

function validateWeight(weight) {
  return /^\d+$/.test(weight); // Use a regular expression for a concise check
}

async function getProductPrice(productID) {
  try {
    const productRef = doc(db, "products", productID);
    const docSnap = await getDoc(productRef);

    if (docSnap.exists()) {
      const productData = docSnap.data();
      return productData.price;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting product price:", error);
    return null;
  }
}
async function updateQuantity(productID, orderQuantity) {
  try {
    const productRef = doc(db, "products", productID);
    const docSnap = await getDoc(productRef);

    if (docSnap.exists()) {
      const productData = docSnap.data();
      const newQuantity = productData.availableQuantity - orderQuantity;
      await updateDoc(productRef, {
        availableQuantity: newQuantity,
      });
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting product price:", error);
    return null;
  }
}
async function checkWeightAvailability(productID, requestedWeight) {
  try {
    const productRef = doc(db, "products", productID);
    const docSnap = await getDoc(productRef);

    if (docSnap.exists()) {
      const productData = docSnap.data();
      const availableQuantity = productData.availableQuantity;
      if (requestedWeight <= availableQuantity) {
        return true;
      } else {
        return false;
      }
    } else {
      console.log("No such document!");
      return false;
    }
  } catch (error) {
    console.error("Error getting document:", error);
    return false;
  }
}
let orderTable = document.getElementById("order");
let elementTotal = 0;
let total = document.getElementById("total");
addbtn.addEventListener("click", async (e) => {
  e.preventDefault();

  if (kind.value === "") {
    alert("رجاء اختر منتجًا");
  } else if (size.value === "") {
    alert("رجاء اختر المقاس");
  } else if (length.value === "" && length.style.visibility !== "hidden") {
    alert("رجاء اختر الطول الذي تريده");
  } else if (weight.value === "") {
    alert("رجاء ادخل الوزن");
  } else if (!validateWeight(weight.value)) {
    alert("رجاء ادخل أرقامًا فقط");
  } else {
    let productID = ``;
    if (kind.value == "مسمار") {
      productID = `${kind.value} ${size.value} طول ${length.value} سم`;
    } else {
      productID = `${kind.value} ${size.value}`;
    }
    const requestedWeight = parseFloat(weight.value);
    const isAvailable = await checkWeightAvailability(
      productID,
      requestedWeight
    );

    if (isAvailable) {
      const productPrice = await getProductPrice(productID);
      await updateQuantity(productID, requestedWeight);
      if (productPrice !== null) {
        let element = ``;
        if (length.style.visibility == "hidden") {
          element = `${kind.value} ${size.value}`;
        } else {
          element = `${kind.value} ${size.value} طول ${length.value} سم`;
        }
        let elementWeight = `${weight.value} كجم`;
        let price = productPrice * requestedWeight;
        let body = document.getElementById("tablebody");
        let tr = body.insertRow();
        let tdElement = tr.insertCell();
        let tdWeight = tr.insertCell();
        let tdPrice = tr.insertCell();
        tdPrice.id = "cost";
        tdElement.textContent = element;
        tdWeight.textContent = elementWeight;
        tdPrice.textContent = price;
        elementTotal += price;
        total.innerHTML = `الحساب:<br> ${elementTotal}`;
      } else {
        alert("فشل في استرجاع سعر المنتج.");
      }
    } else {
      alert("الكمية المطلوبة غير متوفرة.");
    }
    kind.value = "";
    weight.value = "";
    size.value = "";
    length.value = "";
  }
});

const confirmOrder = document.getElementById("confirm");
function sendEmail(Subject, fromName, Message, fromemail) {
  let params = {
    subject: Subject,
    name: fromName,
    fromEmail: fromemail,
    message: Message,
  };

  emailjs.send("service_pyo1tw6", "template_742esac", params);
}
confirmOrder.addEventListener("click", async (e) => {
  e.preventDefault();
  let row = document.querySelectorAll("tbody tr");
  let orderArray = [];
  row.forEach((row) => {
    let cells = row.querySelectorAll("td");
    let cellsArray = "";
    cells.forEach((data) => {
      if (data.id != "cost") cellsArray += data.textContent + " ";
      else {
        cellsArray += "\n";
      }
    });
    orderArray.push(cellsArray);
  });

  try {
    const newOrderRef = await addDoc(collection(db, "orders"), {
      clientName: username,
      clientPhone: userphone,
      orderDetails: orderArray,
    });
    console.log("New order created with ID: ", newOrderRef.id);
    alert("تم إنشاء الطلب بنجاح!");
    sendEmail("طلبية جديدة", username, orderArray, useremail);
    document.getElementById("tablebody").innerHTML = "";
    total.innerHTML = "الحساب:";
  } catch (error) {
    console.error("Error creating order: ", error);
    alert("حدث خطأ أثناء إنشاء الطلب. الرجاء المحاولة مرة أخرى.");
  }
});
