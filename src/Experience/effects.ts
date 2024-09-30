import confetti from "canvas-confetti";

const atariConfetti = () => {
  var end = Date.now() + 5 * 1000;

  // go Buckeyes!

  (function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
};

export { atariConfetti };
