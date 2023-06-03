window.onload = function () {
  const fullName = localStorage.getItem("fullName");
  const welcomeMessage = document.createElement("p");
  welcomeMessage.textContent = `Welcome ${fullName}!`;
  welcomeMessage.id = "title";

  document.querySelector("header").appendChild(welcomeMessage);

  const role = localStorage.getItem("role") === "true";
  const userId = localStorage.getItem("userId");

  if (role) {
    getNotificationsAdmin();
  } else {
    getNotifications(userId);
  }
};

function getNotificationsAdmin() {
  fetch("https://pra-api.onrender.com/notifications", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": localStorage.getItem("token"),
    },
  })
    .then((res) => res.json())
    .then((data) => {
      const currentDate = new Date().toLocaleDateString('en-US');
      const filteredData = data.filter(
        (notification) => new Date(notification.date_expired).toLocaleDateString('en-US') >= currentDate
      );
      if (filteredData.length > 0) {
        filteredData.forEach((notification) => {
          createNotificationCard(notification);
        });
      }
    })
    .catch((err) => console.log(err));
}

function getNotifications(userId) {
  fetch(`https://pra-api.onrender.com/notifications/${userId}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": localStorage.getItem("token"),
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      const currentDate = new Date();
      const filteredData = data.filter(
        (notification) => new Date(notification.date_expired) > currentDate
      );
      if (filteredData.length > 0) {
        filteredData.forEach((notification) => {
          createNotificationCard(notification);
        });
      }
    })
    .catch((err) => console.log(err + "tu pukne 2"));
}

function createNotificationCard(notification) {
  let divCard = document.createElement("div");
  divCard.className = "notificationCard";

  let title = document.createElement("h3");
  title.className = "titleOfNotification";
  title.innerText = notification.name;

  let course = document.createElement("p");
  course.className = "nameOfCourse";
  course.innerText = notification.course.course_name;

  let description = document.createElement("p");
  description.className = "description";
  description.innerText = notification.description;

  let informations = document.createElement("div");
  informations.className = "informations";

  let date = document.createElement("p");
  date.className = "date";
  date.innerText = `${formatDate(notification.date_created)} - ${formatDate(
    notification.date_expired
  )}`;

  let creator = document.createElement("p");
  creator.className = "creator";
  if (notification.user) {
    creator.innerText = notification.user.full_name;
  } else {
    creator.innerText = "Deleted user";
  }

  informations.appendChild(date);
  informations.appendChild(creator);

  divCard.appendChild(title);
  divCard.appendChild(course);
  divCard.appendChild(description);
  divCard.appendChild(informations);

  document.querySelector(".container").appendChild(divCard);
}

function formatDate(dateString) {
  let date = new Date(dateString);
  return (
    String(date.getDate()).padStart(2, "0") +
    "-" +
    String(date.getMonth() + 1).padStart(2, "0") +
    "-" +
    date.getFullYear()
  );
}