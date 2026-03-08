import { auth } from "./firebase-config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
logoutBtn.addEventListener("click", async () => {

await signOut(auth);

window.location.href = "login.html";

});
}