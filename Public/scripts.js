document.addEventListener("DOMContentLoaded", function () {
  const loginSection = document.getElementById("login");
  const roleChoiceSection = document.querySelector(".rolechoice");
  const driverRegSection = document.querySelector(".DriverReg");
  const studentRegSection = document.querySelector(".StudentReg");

  const signUpLink = document.getElementById("signUpLink");
  const logInLinkDriver = document.getElementById("logInLinkDriver");
  const logInLinkStudent = document.getElementById("logInLinkStudent");
  const studentRole = document.getElementById("studentRole");
  const driverRole = document.getElementById("driverRole");

  function hideAllSections() {
    loginSection.classList.add("d-none");
    roleChoiceSection.classList.add("d-none");
    driverRegSection.classList.add("d-none");
    studentRegSection.classList.add("d-none");
  }

  signUpLink.addEventListener("click", function () {
    hideAllSections();
    roleChoiceSection.classList.remove("d-none");
  });

  logInLinkDriver.addEventListener("click", function () {
    hideAllSections();
    loginSection.classList.remove("d-none");
  });

  logInLinkStudent.addEventListener("click", function () {
    hideAllSections();
    loginSection.classList.remove("d-none");
  });

  studentRole.addEventListener("click", function () {
    hideAllSections();
    studentRegSection.querySelector("input[name='role']").value = "student";
    studentRegSection.classList.remove("d-none");
  });

  driverRole.addEventListener("click", function () {
    hideAllSections();
    driverRegSection.querySelector("input[name='role']").value = "driver";
    driverRegSection.classList.remove("d-none");
  });

  hideAllSections();
  loginSection.classList.remove("d-none");

  // sendind data logic
  function sendFormData(formData, url) {
    console.log('formData:', JSON.stringify(formData));
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
      console.log('data:', data);
    });
    
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  document.querySelector("#login form").addEventListener('submit', function (event) {
    event.preventDefault();
    let form = event.target
    let formData = new FormData(form)    
    sendFormData(formData, '/users/login');
  });

  document.querySelector(".DriverReg form").addEventListener('submit', function (event) {
    event.preventDefault();
    let form = event.target
    let formData = new FormData(form)
    sendFormData(formData, '/users/register/driver');
  });

  document.querySelector(".StudentReg form").addEventListener('submit', function (event) {
    event.preventDefault();
    let form = event.target
    let formData = new FormData(form)
    sendFormData(formData, '/users/register/student');
  });

  function togglePasswordVisibility(inputId, toggleId) {
    const passwordInput = document.getElementById(inputId);
    const toggleButton = document.getElementById(toggleId);

    toggleButton.addEventListener('click', function () {
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleButton.textContent = '🙈';
      } else {
        passwordInput.type = 'password';
        toggleButton.textContent = '👁';
      }
    });
  }

  togglePasswordVisibility('password', 'togglePasswordLogin');
  togglePasswordVisibility('DPassword', 'togglePasswordDriver');
  togglePasswordVisibility('SPassword', 'togglePasswordStudent');
});
