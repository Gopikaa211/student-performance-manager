import { db } from "./firebase-config.js";
import {
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const attendanceList = document.getElementById("attendanceList");
const saveAttendanceBtn = document.getElementById("saveAttendanceBtn");

async function loadAttendanceStudents() {
  attendanceList.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "students"));

  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();

    attendanceList.innerHTML += `
    <tr>
    <td>${data.name}</td>

    <td>
    <input type="checkbox" id="status-${docSnap.id}">
    </td>

    </tr>
  `;
  });
}

saveAttendanceBtn.addEventListener("click", async () => {
  const date = document.getElementById("attendanceDate").value;

  if (!date) {
    alert("Select a date");
    return;
  }

  const studentsSnapshot = await getDocs(collection(db, "students"));

  for (const docSnap of studentsSnapshot.docs) {
    const isPresent =
    document.getElementById(`status-${docSnap.id}`).checked;

    const status = isPresent ? "Present" : "Absent";

    await addDoc(collection(db, "attendance"), {
      studentId: docSnap.id,
      date,
      status
    });
  }

  alert("Attendance saved");
});

loadAttendanceStudents();