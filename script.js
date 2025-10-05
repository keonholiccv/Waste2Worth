const users = JSON.parse(localStorage.getItem("users")) || {};
const leaderboardList = document.getElementById("leaderboard-list");
const donationList = document.getElementById("donation-history");
const rewardList = document.getElementById("reward-history");
const message = document.getElementById("message");

function saveUsers() {
  localStorage.setItem("users", JSON.stringify(users));
}

function updateLeaderboard() {
  leaderboardList.innerHTML = "";
  const sortedUsers = Object.values(users).sort((a, b) => b.points - a.points);
  sortedUsers.forEach((user, index) => {
    const li = document.createElement("li");
    li.textContent = `${index + 1}. ${user.name} (${user.cluster}) — ${user.points} pts`;
    leaderboardList.appendChild(li);
  });
}

function updateHistories(user) {
  donationList.innerHTML = "";
  rewardList.innerHTML = "";

  user.donations.forEach((don, index) => {
    const li = document.createElement("li");
    li.textContent = `#${index + 1}: Donated +${don.points} pts (${don.date})`;
    donationList.appendChild(li);
  });

  user.rewards.forEach((rw, index) => {
    const li = document.createElement("li");
    li.textContent = `#${index + 1}: Redeemed ${rw.item} (-${rw.cost} pts) (${rw.date})`;
    rewardList.appendChild(li);
  });
}

function login() {
  const name = document.getElementById("name").value.trim();
  const cluster = document.getElementById("cluster").value;

  if (!name || !cluster) {
    message.textContent = "Please enter your name and choose a cluster!";
    return;
  }

  if (!users[name]) {
    users[name] = { 
      name, 
      cluster, 
      points: 0,
      donations: [],
      rewards: []
    };
    saveUsers();
  }

  const user = users[name];
  document.getElementById("login-section").style.display = "none";
  document.getElementById("main-section").style.display = "block";
  document.getElementById("user-name").textContent = user.name;
  document.getElementById("user-cluster").textContent = user.cluster;
  document.getElementById("user-points").textContent = user.points;

  updateHistories(user);
  updateLeaderboard();
}

function donateOil() {
  const name = document.getElementById("user-name").textContent;
  const user = users[name];
  const now = new Date().toLocaleString();

  user.points += 100;
  user.donations.push({ points: 100, date: now });
  document.getElementById("user-points").textContent = user.points;
  message.textContent = "Thanks for donating! 🌱 You earned 100 points!";

  saveUsers();
  updateHistories(user);
  updateLeaderboard();
}

function redeem(cost, item) {
  const name = document.getElementById("user-name").textContent;
  const user = users[name];
  const now = new Date().toLocaleString();

  if (user.points < cost) {
    let needed = cost - user.points;
    message.textContent = `Oops 😅 you need ${needed} more points to get the ${item}! Keep going 🌍💪`;
    return;
  }

  user.points -= cost;
  user.rewards.push({ item, cost, date: now });
  document.getElementById("user-points").textContent = user.points;
  message.textContent = `Yay! 🎁 You redeemed the ${item}! 💚`;

  saveUsers();
  updateHistories(user);
  updateLeaderboard();
}

function resetAll() {
  localStorage.clear();
  location.reload();
}
