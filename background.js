window.addEventListener('load', function() {
  const canvas = document.getElementById('background-canvas');
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  let dots = [];
  const maxDots = 250; 
  const maxDistance = 150; 
  const dotRadius = 2;
  const mouseRadius = 150;
  const colors = [
    'rgba(52, 152, 219, 0.5)',   // Blue
    'rgba(46, 204, 113, 0.5)',   // Green
    'rgba(231, 76, 60, 0.5)',    // Red
    'rgba(241, 196, 15, 0.5)'    // Yellow
  ];

  const screenArea = canvas.width * canvas.height;
  const numDots = Math.min(maxDots, Math.floor(screenArea / 4000));

  // Create dots with random colors and drift speeds
  for (let i = 0; i < numDots; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const dx = (Math.random() - 0.5) * 0.5; // Random small speed in x-direction
    const dy = (Math.random() - 0.5) * 0.5; // Random small speed in y-direction
    const color = colors[Math.floor(Math.random() * colors.length)];
    dots.push({ x, y, dx, dy, color });
  }

  let mouseX = 0;
  let mouseY = 0;

  document.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function drawBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw dots with varying colors
    dots.forEach(dot => {
      ctx.fillStyle = dot.color;
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dotRadius, 0, Math.PI * 2);
      ctx.fill();
    });

    // Enhanced connection drawing
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const distanceToMouse1 = Math.sqrt((dots[i].x - mouseX) ** 2 + (dots[i].y - mouseY) ** 2);
          const distanceToMouse2 = Math.sqrt((dots[j].x - mouseX) ** 2 + (dots[j].y - mouseY) ** 2);
          
          // Gradient line based on distance
          const gradient = ctx.createLinearGradient(dots[i].x, dots[i].y, dots[j].x, dots[j].y);
          gradient.addColorStop(0, dots[i].color);
          gradient.addColorStop(1, dots[j].color);
          
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1 - (distance / maxDistance);
          
          if (distanceToMouse1 < mouseRadius || distanceToMouse2 < mouseRadius) {
            ctx.lineWidth *= 2;
          }

          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.stroke();
        }
      }
    }

    // Dot movement and random drift
    dots.forEach(dot => {
      const distanceToMouse = Math.sqrt((dot.x - mouseX) ** 2 + (dot.y - mouseY) ** 2);
      const repulsionFactor = (mouseRadius - distanceToMouse) / mouseRadius;

      if (distanceToMouse < mouseRadius) {
        const angle = Math.atan2(dot.y - mouseY, dot.x - mouseX);
        dot.x += Math.cos(angle) * repulsionFactor * 7;
        dot.y += Math.sin(angle) * repulsionFactor * 7;
      } else {
        // Add random drift to movement
        dot.x += dot.dx + (Math.random() - 0.5) * 0.2;
        dot.y += dot.dy + (Math.random() - 0.5) * 0.2;
      }

      // Wrap dots around edges
      dot.x = (dot.x + canvas.width) % canvas.width;
      dot.y = (dot.y + canvas.height) % canvas.height;
    });

    requestAnimationFrame(drawBackground);
  }

  drawBackground();
});
