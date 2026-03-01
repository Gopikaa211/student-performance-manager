import { db } from "./firebase-config.js";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  setDoc
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const addBtn = document.getElementById("addStudentBtn");
const studentList = document.getElementById("studentList");
const dashboardSummary = document.getElementById("dashboardSummary");

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

  const studentsSnapshot = await getDocs(collection(db, "students"));

  studentsSnapshot.forEach(async (studentDoc) => {
    const data = studentDoc.data();

    const attendanceQuery = query(
      collection(db, "attendance"),
      where("studentId", "==", studentDoc.id)
    );

    const attendanceSnapshot = await getDocs(attendanceQuery);

    let total = 0;
    let present = 0;

    attendanceSnapshot.forEach((doc) => {
      total++;
      if (doc.data().status === "Present") {
        present++;
      }
    });

    const percentage = total > 0 
      ? ((present / total) * 100).toFixed(1)
      : 0;

    studentList.innerHTML += `
      <div>
        <p>
          ${data.name} - ${data.regNo} - Sem ${data.semester}
          <br>
          Attendance: ${percentage}%
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
const attendanceList = document.getElementById("attendanceList");
const saveAttendanceBtn = document.getElementById("saveAttendanceBtn");

async function loadAttendanceStudents() {
  attendanceList.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "students"));

  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();

    attendanceList.innerHTML += `
      <div>
        <span>${data.name}</span>
        <select id="status-${docSnap.id}">
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>
      </div>
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
    const status = document.getElementById(`status-${docSnap.id}`).value;

    await addDoc(collection(db, "attendance"), {
      studentId: docSnap.id,
      date,
      status
    });
  }

  alert("Attendance saved");
});

loadAttendanceStudents();

const resultsList = document.getElementById("resultsList");

async function loadResultsEntry() {
  resultsList.innerHTML = "";

  const studentsSnapshot = await getDocs(collection(db, "students"));

  studentsSnapshot.forEach((studentDoc) => {
    const data = studentDoc.data();

    resultsList.innerHTML += `
      <div>
        <p>${data.name}</p>
        CIA1: <input type="number" id="cia1-${studentDoc.id}" max="10">
        CIA2: <input type="number" id="cia2-${studentDoc.id}" max="10">
        Midsem(30): <input type="number" id="midsem-${studentDoc.id}" max="30">
        Exam (60): <input type="number" id="exam-${studentDoc.id}" max="60">
        <button onclick="saveResult('${studentDoc.id}')">Save</button>
      </div>
    `;
  });
}

window.saveResult = async (studentId) => {
  const cia1 = parseInt(document.getElementById(`cia1-${studentId}`).value) || 0;
  const cia2 = parseInt(document.getElementById(`cia2-${studentId}`).value) || 0;
  const midsem = parseInt(document.getElementById(`midsem-${studentId}`).value) || 0;
  const exam = parseInt(document.getElementById(`exam-${studentId}`).value) || 0;

  const midsemConverted = (midsem / 30) * 20;
  const ciaTotal = cia1 + cia2 + midsemConverted;
  const finalTotal = ciaTotal + exam;

  await setDoc(doc(db, "results", studentId), {
    studentId,
    cia1,
    cia2,
    midsem,
    exam,
    ciaTotal: parseFloat(ciaTotal.toFixed(2)),
    finalTotal: parseFloat(finalTotal.toFixed(2))
  });

  alert("Result saved");
};

loadResultsEntry();

async function loadDashboardSummary() {
  const studentsSnapshot = await getDocs(collection(db, "students"));
  const resultsSnapshot = await getDocs(collection(db, "results"));
  const attendanceSnapshot = await getDocs(collection(db, "attendance"));

  const totalStudents = studentsSnapshot.size;

  // Calculate class average
  let totalMarks = 0;
  let resultCount = 0;

  resultsSnapshot.forEach((doc) => {
    totalMarks += doc.data().finalTotal || 0;
    resultCount++;
  });

  const classAverage = resultCount > 0
    ? (totalMarks / resultCount).toFixed(2)
    : 0;

  // Low performance (< 40)
  let lowPerformance = 0;

  resultsSnapshot.forEach((doc) => {
    if ((doc.data().finalTotal || 0) < 40) {
      lowPerformance++;
    }
  });

  // Low attendance (< 75%)
  let attendanceMap = {};

  attendanceSnapshot.forEach((doc) => {
    const data = doc.data();
    if (!attendanceMap[data.studentId]) {
      attendanceMap[data.studentId] = { total: 0, present: 0 };
    }
    attendanceMap[data.studentId].total++;
    if (data.status === "Present") {
      attendanceMap[data.studentId].present++;
    }
  });

  let lowAttendance = 0;

  Object.values(attendanceMap).forEach((record) => {
    const percentage = (record.present / record.total) * 100;
    if (percentage < 75) {
      lowAttendance++;
    }
  });

  dashboardSummary.innerHTML = `
    <p>Total Students: ${totalStudents}</p>
    <p>Class Average: ${classAverage}</p>
    <p>Low Performance Students: ${lowPerformance}</p>
    <p>Low Attendance Students: ${lowAttendance}</p>
  `;
}
loadDashboardSummary();