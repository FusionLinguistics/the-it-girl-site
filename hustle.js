document.querySelectorAll('.middle_box2').forEach(section => {
    const uploadBtn = section.querySelector('.upload-btn');
    const fileInput = section.querySelector('input[type="file"]');
    const preview = section.querySelector('.video-preview');
  
    uploadBtn.addEventListener('click', () => {
      const file = fileInput.files[0];
      if (!file) return alert('Choose a video file');
  
      const fileRef = storage.ref(`progress_videos/${Date.now()}-${file.name}`);
      fileRef.put(file).then(snapshot => {
        snapshot.ref.getDownloadURL().then(url => {
          const video = document.createElement('video');
          video.src = url;
          video.controls = true;
          preview.appendChild(video);
  
          db.collection('videos').add({ url, timestamp: Date.now() });
          fileInput.value = '';
        });
      });
    });
  });
  
  const noteEl = document.querySelector('.inspo-note');

noteEl.addEventListener('blur', () => {
  const note = noteEl.innerText.trim();
  db.collection('notes').doc('weeklyNote').set({ note });
});

db.collection('notes').doc('weeklyNote').get().then(doc => {
  if (doc.exists) {
    noteEl.innerText = doc.data().note;
  }
});

  