async function handleLogin(event) {
  event.preventDefault();

  const submitButton = document.getElementById("submit");
  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  removeErrorMessage(); // Remove previous error message
  // Disable the submit button
  submitButton.disabled = true;

  // Change the button text to "Loading..."
  submitButton.value = "Loading...";

  // Add the "loading" class
  submitButton.classList.add("loading");

  // Create the request payload
  const data = {
    email,
    password,
  };

  try {
    const response = await fetch(`https://pra-api.onrender.com/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const data = await response.json();
      const token = data.token;
      const role = data.administrator;
      const userId = data._id;
      const firstName = data.first_name;
      const lastName = data.last_name;
      localStorage.setItem("userId", userId);
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("fullName", firstName + " " + lastName);

      window.location.href = "/html/index.html";
    } else {
      const error = await response.text();
      console.error("Error:", error);

      const errorMessageElement = document.createElement("p");
      errorMessageElement.textContent = error;
      errorMessageElement.style.color = "red";
      errorMessageElement.id = "error-message"; // Assign an ID to the error message element

      submitButton.insertAdjacentElement("afterend", errorMessageElement);
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    // Enable the submit button
    submitButton.disabled = false;

    // Reset the button text
    submitButton.value = "Log In";

    // Remove the "loading" class
    submitButton.classList.remove("loading");
  }
}

function removeErrorMessage() {
  const errorMessageElement = document.getElementById("error-message");
  if (errorMessageElement) {
    errorMessageElement.remove();
  }
}

document.getElementById("login").addEventListener("submit", handleLogin);
