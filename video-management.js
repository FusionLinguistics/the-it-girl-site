const sections = [
  { name: "dance", emoji: "🕺", goals: ["Improve arm flow", "Expression control"] },
  { name: "violin", emoji: "🎻", goals: ["Smooth bow", "Good intonation"] },
  { name: "cooking", emoji: "🍳", goals: ["Knife skills", "Flavor layering"] },
  { name: "motorcycle", emoji: "🏍️", goals: ["Clutch control", "Confident turning"] },
  { name: "coding", emoji: "💻", goals: ["Responsive design", "JS practice"] },
  { name: "speaking", emoji: "🎤", goals: ["Clear speech", "Eye contact"] }
];

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("sections-container");

  sections.forEach(({ name, emoji, goals }) => {
    const section = document.createElement("section");
    section.className = `masterpiece-section ${name}`;
    section.innerHTML = `
      <h2>${name.toUpperCase()} ${emoji}</h2>
      <div class="master-grid">
        <div class="goals" contenteditable="true">
          <h3>Goals</h3>
          <ul>${goals.map(g => `<li>${g}</li>`).join("")}</ul>
        </div>
        <div class="progress">
          <h3>Progress Videos</h3>
          <input type="file" accept="video/*" class="file-input" />
          <button class="upload-btn">Upload</button>
          <div class="video-grid"></div>
        </div>
        <div class="goal-video">
          <h3>Goal Reference</h3>
          <video controls></video>
        </div>
      </div>
    `;
    container.appendChild(section);

    const input = section.querySelector(".file-input");
    const button = section.querySelector(".upload-btn");
    const grid = section.querySelector(".video-grid");

    loadVideos(name, grid);

    button.addEventListener("click", () => {
      if (input.files.length > 0) {
        handleVideoUpload(input, name, grid);
      } else {
        alert("Please select a video first.");
      }
    });
  });
});

function handleVideoUpload(input, category, grid) {
  const file = input.files[0];
  const storageRef = firebase.storage().ref(`${category}/${Date.now()}-${file.name}`);
  storageRef.put(file).then(snapshot => {
    snapshot.ref.getDownloadURL().then(url => {
      firebase.firestore().collection(category).add({ url, timestamp: Date.now() }).then(docRef => {
        addVideoToGrid(url, grid, category, docRef.id);
        input.value = "";
      });
    });
  });
}

function loadVideos(category, grid) {
  firebase.firestore().collection(category).orderBy("timestamp", "desc").get().then(snapshot => {
    snapshot.forEach(doc => {
      addVideoToGrid(doc.data().url, grid, category, doc.id);
    });
  });
}

function addVideoToGrid(url, grid, category, docId) {
  const wrapper = document.createElement("div");
  const video = document.createElement("video");
  video.src = url;
  video.controls = true;

  const delBtn = document.createElement("button");
  delBtn.textContent = "Delete";
  delBtn.className = "delete-btn";
  delBtn.addEventListener("click", () => {
    wrapper.remove();
    firebase.firestore().collection(category).doc(docId).delete();
  });

  wrapper.appendChild(video);
  wrapper.appendChild(delBtn);
  grid.appendChild(wrapper);
}
