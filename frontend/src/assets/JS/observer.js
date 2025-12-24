document.addEventListener("DOMContentLoaded", () => {
    const video = document.querySelector(".hero-video");

    if (!video) {
        console.error("Video element not found!");
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                console.log("Video is in view, playing...");
                video.play();
            } else {
                console.log("Video is out of view, pausing...");
                video.pause();
            }
        });
    });

    observer.observe(video);
});
