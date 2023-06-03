function handleRegister(event) {
  event.preventDefault();

  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const data = {
    first_name: firstName,
    last_name: lastName,
    email: email,
    password: password,
  };
  for (const key in data) {
    if (!data[key]) {
      createModalDialog("Fill all data")
      return;
    }
  }

  fetch("https://pra-api.onrender.com/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": localStorage.getItem("token"),
    },
    body: JSON.stringify(data),
  })
    .then(function (response) {
      if (response.ok) {
        createModalDialog("Registration was successful.", true);
      } else if (response.status === 409) {
        response.text()
        .then(message => {
          // Display the error message to the user
          createModalDialog(message)
        })      } else {
        response.text()
        .then(message => {
          // Display the error message to the user
          createModalDialog(message)
        })      }
    })
    .catch(function (error) {
      console.error("Error:", error);
      createModalDialog("An error occurred. Please try again later.");
    });
}

document
  .getElementById("createLecturer")
  .addEventListener("submit", handleRegister);
