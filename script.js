document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.carousel-section');
    let currentIndex = 0;
    const totalSections = sections.length;
  
    // Function to show a section by index
    function showSection(index) {
      sections.forEach((section, i) => {
        if (i === index) {
          section.classList.add('active');    // activate the current section
        } else {
          section.classList.remove('active'); // hide other sections
        }
      });
    }
  
    // Initially, ensure only the first section is visible (in case no active class in HTML)
    showSection(currentIndex);
  
    // Automatically rotate sections every 5 seconds
    setInterval(() => {
      // Move to the next index (loop back to 0 at end)
      currentIndex = (currentIndex + 1) % totalSections;
      showSection(currentIndex);
    }, 5000); // 5000ms = 5 seconds per slide (adjust as desired)
  });
  