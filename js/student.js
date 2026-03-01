import { db } from "./firebase-config.js";
import { collection, addDoc, getDocs } 
  from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const addBtn = document.getElementById("addStudentBtn");
const studentList = document.getElementById("studentList");

addBtn.addEventListener("click", async () => {
  const name = document.getElementById("name").value;
  const regNo = document.getElementById("regNo").value;
  const department = document.getElementById("department").value;
  const semester = parseInt(document.getElementById("semester").value);

  if (!name || !regNo) {
    alert("Please fill required fields");
    return;
  }

  await addDoc(collection(db, "students"), {
    name,
    regNo,
    department,
    semester
  });

  alert("Student added");
  loadStudents();
});

async function loadStudents() {
  studentList.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "students"));

  querySnapshot.forEach((doc) => {
    const data = doc.data();

    studentList.innerHTML += `
      <p>${data.name} - ${data.regNo} - Sem ${data.semester}</p>
    `;
  });
}

loadStudents();