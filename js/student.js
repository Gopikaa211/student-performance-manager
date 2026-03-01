import { db } from "./firebase-config.js";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

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

  clearForm();
  loadStudents();
});

function clearForm() {
  document.getElementById("name").value = "";
  document.getElementById("regNo").value = "";
  document.getElementById("department").value = "";
  document.getElementById("semester").value = "";
}

async function loadStudents() {
  studentList.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "students"));

  querySnapshot.forEach((document) => {
    const data = document.data();

    studentList.innerHTML += `
      <div>
        <p>
          ${data.name} - ${data.regNo} - Sem ${data.semester}
          <button onclick="editStudent('${document.id}', '${data.name}', '${data.regNo}', '${data.department}', ${data.semester})">Edit</button>
          <button onclick="deleteStudent('${document.id}')">Delete</button>
        </p>
      </div>
    `;
  });
}

window.editStudent = async (id, name, regNo, department, semester) => {
  const newName = prompt("Edit Name:", name);
  if (!newName) return;

  await updateDoc(doc(db, "students", id), {
    name: newName
  });

  loadStudents();
};

window.deleteStudent = async (id) => {
  const confirmDelete = confirm("Are you sure?");
  if (!confirmDelete) return;

  await deleteDoc(doc(db, "students", id));
  loadStudents();
};

loadStudents();