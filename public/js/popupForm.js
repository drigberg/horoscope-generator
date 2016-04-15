// Validating Empty Field
function check_empty() {
    if (document.getElementById('name').value == "" || document.getElementById('email').value == "" || document.getElementById('msg').value == "") {
        alert("Fill All Fields !");
    } else {
    document.getElementById('userInfo').submit();
        alert("Form Submitted Successfully...");
    }
}
//Function To Display Popup
function div_show() {
    document.getElementById('popupWithBlur').style.display = "block";
}
//Function to Hide Popup
function div_hide(){
    document.getElementById('popupWithBlur').style.display = "none";
}