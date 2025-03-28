document.addEventListener("DOMContentLoaded", async function () {
    const postButton = document.querySelector(".post-btn");
    const textarea = document.querySelector(".create-post textarea");
    const fileInput = document.querySelector(".create-post input[type='file']");
    const timeline = document.querySelector(".timeline-container");
    const db = firebase.firestore();
  
    let journalCount = 0;
  
    // Load posts from Firestore
    const querySnapshot = await db.collection("posts").orderBy("date", "desc").get();
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      journalCount++;
      createPost(doc.id, data.text, data.image, data.date, journalCount);
    });
  
    postButton.addEventListener("click", () => {
      const text = textarea.value.trim();
      const file = fileInput.files[0];
  
      if (!text && !file) {
        alert("Write something or add an image before posting.");
        return;
      }
  
      journalCount++;
      const date = new Date().toISOString();
  
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const postData = {
            text,
            image: e.target.result,
            date,
            journalNumber: journalCount,
            comments: []
          };
          db.collection("posts").add(postData).then((docRef) => {
            createPost(docRef.id, text, e.target.result, date, journalCount);
          });
        };
        reader.readAsDataURL(file);
      } else {
        const postData = {
          text,
          image: null,
          date,
          journalNumber: journalCount,
          comments: []
        };
        db.collection("posts").add(postData).then((docRef) => {
          createPost(docRef.id, text, null, date, journalCount);
        });
      }
  
      textarea.value = "";
      fileInput.value = "";
    });
  
    function createPost(postId, text, image, date, journalNumber) {
      const postSection = document.createElement("section");
      postSection.classList.add("post");
  
      const postHTML = `
        <div class="post-content">
          <div class="post-text">
            <h3>Journal Entry #${journalNumber} — ${new Date(date).toLocaleDateString()} <span class="tag">#journal</span></h3>
            <p>${text}</p>
            <div class="post-actions">
              <button class="like-btn">❤️ Like (<span class="like-count">0</span>)</button>
              <button class="comment-toggle">💬 Comment</button>
              <button class="share-btn">📤 Share</button>
              <button class="edit-post">✏️ Edit</button>
              <button class="delete-post">🗑️ Delete</button>
            </div>
            <div class="comment-box" style="display:none; margin-top: 1rem;">
              <textarea placeholder="Write a comment..." style="width:100%; padding: 0.5rem; border-radius:8px; border: 1px solid #ccc;"></textarea>
              <button class="submit-comment" style="margin-top: 0.5rem;">Post Comment</button>
              <div class="comment-list" style="margin-top: 1rem;"></div>
            </div>
          </div>
          ${image ? `<div class="post-image"><img src="${image}" alt="User post image" /></div>` : ""}
        </div>
      `;
  
      postSection.innerHTML = postHTML;
      timeline.insertBefore(postSection, timeline.querySelector(".post") || null);
  
      const likeBtn = postSection.querySelector(".like-btn");
      const likeCount = likeBtn.querySelector(".like-count");
      let liked = false;
      likeBtn.addEventListener("click", () => {
        liked = !liked;
        likeCount.textContent = liked ? "1" : "0";
        likeBtn.style.color = liked ? "#e74c3c" : "#000";
      });
  
      const commentToggle = postSection.querySelector(".comment-toggle");
      const commentBox = postSection.querySelector(".comment-box");
      commentToggle.addEventListener("click", () => {
        commentBox.style.display = commentBox.style.display === "none" ? "block" : "none";
      });
  
      const commentInput = commentBox.querySelector("textarea");
      const commentList = commentBox.querySelector(".comment-list");
      const submitComment = commentBox.querySelector(".submit-comment");
      submitComment.addEventListener("click", () => {
        const commentText = commentInput.value.trim();
        if (commentText) {
          const comment = document.createElement("div");
          comment.style.background = "#f3f0e6";
          comment.style.padding = "0.5rem 1rem";
          comment.style.borderRadius = "8px";
          comment.style.marginBottom = "0.5rem";
  
          const commentTime = new Date().toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit"
          });
  
          comment.innerHTML = `
            <p style="margin: 0 0 0.25rem 0;">${commentText}</p>
            <small style="color: #555; font-size: 0.8rem;">🕒 Commented on ${commentTime}</small>
          `;
  
          commentList.appendChild(comment);
          commentInput.value = "";
        }
      });
  
      const editBtn = postSection.querySelector(".edit-post");
      editBtn.addEventListener("click", () => {
        const newText = prompt("Edit your journal entry:", text);
        if (newText && newText.trim() !== "") {
          postSection.querySelector("p").textContent = newText;
          db.collection("posts").doc(postId).update({ text: newText });
        }
      });
  
      const deleteBtn = postSection.querySelector(".delete-post");
      deleteBtn.addEventListener("click", () => {
        const confirmDelete = confirm("Are you sure you want to delete this post?");
        if (confirmDelete) {
          db.collection("posts").doc(postId).delete().then(() => {
            postSection.remove();
          });
        }
      });
  
      const shareBtn = postSection.querySelector(".share-btn");
      shareBtn.addEventListener("click", () => {
        const shareText = postSection.querySelector("p").textContent;
        if (navigator.share) {
          navigator.share({
            title: "Mind Musings – Journal Entry",
            text: shareText,
            url: window.location.href
          });
        } else {
          alert("Copy and share manually: " + shareText);
        }
      });
    }
  });
  