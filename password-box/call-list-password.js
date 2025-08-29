const errorText = document.querySelector(".error-text");
var Password ="604359";
function passcheck(){
    if (document.getElementById('pass1').value != Password) {
        errorText.style.display = "block";
        errorText.textContent = "দুঃখিত! ভুল পাসওয়ার্ড।";
        return false;
    }
    if (document.getElementById('pass1').value == Password) {
        window.open("main/index2.html", "_blank");
    }

}
