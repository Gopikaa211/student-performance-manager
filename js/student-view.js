import { auth, db } from "./firebase-config.js";
import { doc, getDoc, collection, query, where, getDocs } 
from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

import { onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const studentInfo = document.getElementById("studentInfo");
const attendanceInfo = document.getElementById("attendanceInfo");
const resultInfo = document.getElementById("resultInfo");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const uid = user.uid;

  // Load student basic info
  const studentDoc = await getDoc(doc(db, "students", uid));
  if (studentDoc.exists()) {
    const data = studentDoc.data();
    studentInfo.innerHTML = `
    <p>Name: ${data.name}</p>
    <p>Register No: ${data.regNo}</p>
    <p>Semester: ${data.semester}</p>
    <p>Department: ${data.department}</p>
    `;
  }

  // Load attendance percentage
  const attendanceQuery = query(
    collection(db, "attendance"),
    where("studentId", "==", uid)
  );

  const attendanceSnapshot = await getDocs(attendanceQuery);

  let total = 0;
  let present = 0;

  attendanceSnapshot.forEach((doc) => {
    total++;
    if (doc.data().status === "Present") present++;
  });

  const percentage = total > 0
    ? ((present / total) * 100).toFixed(1)
    : 0;

  let attendanceMessage = "";

if (percentage < 75) {
  attendanceMessage = "<p style='color:red;'>Warning: Attendance below 75%</p>";
}

attendanceInfo.innerHTML = `
<p><strong>Attendance:</strong></p>
<p class="stat-value">${percentage}%</p>
${attendanceMessage}
`;

  // Load results
const resultDoc = await getDoc(doc(db, "results", uid));

if (resultDoc.exists()) {
  const result = resultDoc.data();

  let performanceMessage = "";

  if (result.finalTotal < 40) {
    performanceMessage = "<p style='color:red;'>Warning: Low overall performance</p>";
  }

  resultInfo.innerHTML = `
  <p>Activity 1: ${result.cia1}</p>
  <p>Activity 2: ${result.cia2}</p>
  <p>Mid semester: ${result.midsem}</p>
  <p>End Semester: ${result.exam}</p>
  <p class="stat-value">Final: ${result.finalTotal}</p>
  ${performanceMessage}
  `;
}
});