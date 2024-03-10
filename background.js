window.addEventListener('load', function() {
  const canvas = document.getElementById('background-canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let dots = [];
  const maxDots = 200; // Maximum number of dots
  const maxDistance = 200;
  const dotRadius = 2;
  const mouseRadius = 100;

  // Calculate the number of dots based on screen resolution
  const screenArea = canvas.width * canvas.height;
  const numDots = Math.min(maxDots, Math.floor(screenArea / 5000));

  // Create dots
  for (let i = 0; i < numDots; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    dots.push({ x, y });
  }

  let mouseX = 0;
  let mouseY = 0;

  // Mouse move event on document
  document.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Draw background
  function drawBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw dots
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    dots.forEach(dot => {
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dotRadius, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw connections
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const distanceToMouse1 = Math.sqrt((dots[i].x - mouseX) ** 2 + (dots[i].y - mouseY) ** 2);
          const distanceToMouse2 = Math.sqrt((dots[j].x - mouseX) ** 2 + (dots[j].y - mouseY) ** 2);
          const lineWidth = 1 - (distance / maxDistance);

          if (distanceToMouse1 < mouseRadius || distanceToMouse2 < mouseRadius) {
            ctx.lineWidth = lineWidth * 2;
          } else {
            ctx.lineWidth = lineWidth;
          }

          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.stroke();
        }
      }
    }

    // Move dots
    dots.forEach(dot => {
      const distanceToMouse = Math.sqrt((dot.x - mouseX) ** 2 + (dot.y - mouseY) ** 2);
      const repulsionFactor = (mouseRadius - distanceToMouse) / mouseRadius;

      if (distanceToMouse < mouseRadius) {
        const angle = Math.atan2(dot.y - mouseY, dot.x - mouseX);
        dot.x += Math.cos(angle) * repulsionFactor * 5;
        dot.y += Math.sin(angle) * repulsionFactor * 5;
      } else {
        dot.x += (Math.random() * 2 - 1) * 2;
        dot.y += (Math.random() * 2 - 1) * 2;
      }

      // Wrap dots around the edges
      if (dot.x < 0) dot.x = canvas.width;
      if (dot.x > canvas.width) dot.x = 0;
      if (dot.y < 0) dot.y = canvas.height;
      if (dot.y > canvas.height) dot.y = 0;
    });

    requestAnimationFrame(drawBackground);
  }

  drawBackground();
});
