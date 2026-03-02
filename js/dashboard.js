import { db } from "./firebase-config.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const dashboardSummary = document.getElementById("dashboardSummary");

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
document.addEventListener("DOMContentLoaded", () => {
  loadDashboardSummary();
});