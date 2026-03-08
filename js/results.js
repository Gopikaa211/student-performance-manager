import { db } from "./firebase-config.js";
import {
  collection,
  getDocs,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const resultsList = document.getElementById("resultsList");

async function loadResultsEntry() {
  resultsList.innerHTML = "";

  const studentsSnapshot = await getDocs(collection(db, "students"));

  studentsSnapshot.forEach((studentDoc) => {
    const data = studentDoc.data();

    resultsList.innerHTML += `
      <div>
        <p>${data.name}</p>
        Activity1: <input class="results-input" type="number" id="cia1-${studentDoc.id}" max="10">
        Activity 2: <input class="results-input" type="number" id="cia2-${studentDoc.id}" max="10">
        Mid semester(30): <input class="results-input" type="number" id="midsem-${studentDoc.id}" max="30">
        End semester (60): <input class="results-input" type="number" id="exam-${studentDoc.id}" max="60">
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