'use strict';

//variable
var accountName = document.getElementById('user');
// console.log('User', localStorage.getItem("username"));
// accountName.innerHTML = localStorage.getItem("username") || "Login";

//home button
const homeBtn = document.querySelector('.rhombus');
homeBtn.addEventListener('click', function() {
    window.location.reload();
})

//variables
const row = document.querySelector('.row');
const account = document.querySelector('.account');

//toggle account login
//checks to see if user is logged and if they aren't, login button is displayed
if(loggedIn == false){
  account.addEventListener('click', () => {
    var acc = document.querySelector('#loginPopup');
    acc.classList.toggle('show');
  });

  //login/signup popus hides when user clicks off of it
  window.addEventListener('mousedown', async function(event){
    if(event.target.tagName == 'INPUT' || event.target.tagName == 'LABEL' || event.target.tagName == 'BUTTON' || event.target.tagName == 'FORM' || event.target.tagName == 'H3') {
        return;
    }

    if(!event.target.matches('.account')){
        var accounts = document.getElementsByClassName("popup");
        var i;
        for(i = 0; i<accounts.length; i++){
            var accs = accounts[i];
            if(accs.classList.contains('show')){
                accs.classList.remove('show');
            }
        }
    }
  });
}
//checks to see if user is logged in and if they are, settings, logout and account info are displayed
if(loggedIn == true){
  account.addEventListener('click', () => {
    var acc = document.querySelector('#accountOptions');
    acc.classList.toggle('show');
  });

  //hides dropdown when user clicks off of it
  window.addEventListener('mousedown', async function(e){
    if(e.target.tagName == 'INPUT' || e.target.tagName == 'LABEL' || event.target.tagName == 'BUTTON'){
      return;
    }

    if(!e.target.matches('.account')){
      var accounts = document.getElementsByClassName("popup2");
      var i;
      for(i = 0; i < accounts.length; i++) {
        var accs = accounts[i];
        if(accs.classList.contains('show')){
          accs.classList.remove('show');
        }
      }
    }
  });
}

//Login
//loginBtn
//user is to fill out the form and submit it
var loginForm = document.querySelector('#myform');
loginForm.addEventListener('submit', async function(e){
  e.preventDefault();

  //form variables
  var getUser = loginForm.querySelector('[name="username"]')
  var getPass = loginForm.querySelector('[name="password"]')

  //puts password into a hash
  var hashedPass = await hash(getPass.value);

  //username and password go to the server to see if the credentials are correct
  var loginData = new URLSearchParams();
      loginData.set('username', getUser.value);
      loginData.set('password', hashedPass);
  fetch('/api/login', {method: 'POST', body: loginData}).then(res => res.text()).then(async (data) => {
    data = JSON.parse(data);
    if(data.error) {
      // display err message
      var error6 = document.getElementById('error6');
      error6.innerHTML = "Invalid Password or Username.";
      //error disappears after 5 seconds
      setTimeout(function () {
        error6.innerHTML = "";
      }, 5000);
    }
    else {
      //refresh page with useer account being logged in 
      window.location.reload();
    }
  });
  
});

//loginBtnGoogle
//idea button to give the user an option to login with google
const Glogin = document.querySelector('.go');

Glogin.addEventListener('click', function(){
  alert("Not available yet");
});

//loginBtnFacebook
//idea button to give the user an option to login with facebook
const Flogin = document.querySelector('.fb');

Flogin.addEventListener('click', function(){
  alert("Not available yet");
});

//Signup
//SignupBtn
var signupForm = document.querySelector('#myform2');
signupForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    //form variables
    var setUser = signupForm.querySelector('[name="username"]');
    var setEmail = signupForm.querySelector('[name="email"]');
    var setPassword = signupForm.querySelector('[name="password"]');
    var setConPassword = signupForm.querySelector('[name="confirmPassword"]');
    
    //function to check if password has an uppercase letter in it
    function passUpperValid(pass){
      for (var i=0; i<pass.length; i++){
          if (pass.charAt(i) == pass.charAt(i).toUpperCase() && pass.charAt(i).match(/[a-z]/i)){
          return true;
          }
      }
      return false;
    };

    //function to check if password has a lowercase letter in it
    function passLowerValid(pass){
      for (var i=0; i<pass.length; i++){
          if  (pass.charAt(i) == pass.charAt(i).toLowerCase() && pass.charAt(i).match(/[A-Z]/i)){
              return true;
          }
      }
      return false;
    }

    //function to check if password has a number in it
    function passHasNumber(pass){
      return /\d/.test(pass);
    }

    //function to check if password has a special character in it
    function passIsSpecial(pass) {
      return /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(pass);
    }

    //checks if the username is blank
    if(!setUser.value){
      setUser.setAttribute("style", "border: 2px solid red;");
      var error2 = document.getElementById('error2');
      error2.innerHTML = "Fields are missing.";
      setUser.addEventListener("change", function(){
        setUser.setAttribute("style", "border: 2px solid transparent;");
        error2.innerHTML = "";
      });
    }

    //checks if the email is blank
    if(!setEmail.value){
      setEmail.setAttribute("style", "border: 2px solid red;");
      var error2 = document.getElementById('error2');
      error2.innerHTML = "Fields are missing.";
      setEmail.addEventListener("change", function(){
        setEmail.setAttribute("style", "border: 2px solid transparent;");
        error2.innerHTML = "";
      });
    }

    //checks if the password is blank
    if(!setPassword.value){
      setPassword.setAttribute("style", "border: 2px solid red;");
      var error2 = document.getElementById('error2');
      error2.innerHTML = "Fields are missing.";
      setPassword.addEventListener("change", function(){
        setPassword.setAttribute("style", "border: 2px solid transparent;");
        error2.innerHTML = "";
      });
    }

    //checks if the email has a "+" sign in it and not allow it
    //(due to emails with + tend to go to the same email address so it could lead to unnecessary problems)
    if(setEmail.value.includes('+')){
      setEmail.setAttribute("style", "border: 2px solid red;");
      var error3 = document.getElementById('error3');
      error3.innerHTML = "Invalid email address";
      setEmail.addEventListener("change", function(){
        setEmail.setAttribute("style", "border: 2px solid transparent;");
        error3.innerHTML = "";
      });
    }

    //checks to see if the email is a valid email address
    const emailValid = new RegExp("[a-z0-9]+@[a-z]+\.[a-z]{2,3}");
    if(!emailValid.test(setEmail.value)){
      setEmail.setAttribute("style", "border: 2px solid red;");
      var error3 = document.getElementById('error3');
      error3.innerHTML = "Invalid email address";
      setEmail.addEventListener("change", function(){
        setEmail.setAttribute("style", "border: 2px solid transparent;");
        error3.innerHTML = "";
      });
    }

    //checks to make sure the password correctly follows all the rules
    if((setPassword.value.length < 11) || (passUpperValid(setPassword.value) == false) || (passLowerValid(setPassword.value) == false) || (passHasNumber(setPassword.value) == false) || (passIsSpecial(setPassword.value) == false)){
      setPassword.setAttribute("style", "border: 2px solid red;");
      var error4 = document.getElementById('error4');
      error4.innerHTML = "Needs: 11 characters, 1 capital, 1 lower, 1 number, and 1 special";
      setPassword.addEventListener("change", function() {
        setPassword.setAttribute("style", "border: 2px solid transparent;");
        error4.innerHTML = "";
      });
    }

    //checks if the confirmation password matches the password
    if(setPassword.value != setConPassword.value){
      setConPassword.setAttribute("style", "border: 2px solid red;");
      var error = document.getElementById('error');
      error.innerHTML = "Password does not match!";
      setConPassword.addEventListener("change", function(){
        setConPassword.setAttribute("style", "border: 2px solid transparent;");
        error.innerHTML = "";
      });
    }

    //if all prerequisites are met, hash the password and submit information to the server
    if((setPassword.value == setConPassword.value) && (setUser.value) && (setEmail.value) && (setPassword.value) && (!setEmail.value.includes('+')) && ((setPassword.value.length >= 11) || (passUpperValid(setPassword.value) == true) || (passLowerValid(setPassword.value) == true) || (passHasNumber(setPassword.value) == true) || (passIsSpecial(setPassword.value) == true))){
      var hashedPass = await hash(setPassword.value);

      //send info to server database
      var signupData = new URLSearchParams();
      signupData.set('username', setUser.value);
      signupData.set('email', setEmail.value);
      signupData.set('password', hashedPass);
      fetch('/api/signup', {method: 'POST', body: signupData}).then(res => res.text()).then(async (data) => {
        if(data[0] == '<') {
          //refresh page with user account being logged in 
          window.location.reload();
        }
        data = JSON.parse(data);
        if(data.error) {
          // display err message
          var error5 = document.getElementById('error5');
          error5.innerHTML = "Account already exists.";
          //error disappears after 5 seconds
          setTimeout(function () {
            error5.innerHTML = "";
          }, 5000);
        }
        else {
        }
      });
    }
});

// toggle account screens
//switches from the login window to the sign up window
const tabBtn = document.querySelectorAll('.tabBtn');
for(let tabs of tabBtn){
  tabs.addEventListener('click', function(e){
    e.preventDefault();
    var tab = document.querySelector('#signUp-form');
    var tab2 = document.querySelector('#login-form');
    tab.classList.toggle('show');
    tab2.classList.toggle('show');
  });
}

//the hash function being used to hash the password
async function hash(string) {
  var myBitArray = sjcl.hash.sha256.hash(string);
  var myHash = sjcl.codec.hex.fromBits(myBitArray);
  return myHash;
}

//unused.. for debugging
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}