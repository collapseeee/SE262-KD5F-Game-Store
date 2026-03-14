import { animate, stagger, splitText } from 'https://esm.sh/animejs';

const welcomefooter = document.getElementById('welcome-popup-footer');
const { chars } = splitText(welcomefooter, { words: false, chars: true });

animate(chars, {
  // Gentler bounce
  y: [
    { to: '-1.5rem', ease: 'outExpo', duration: 600 },
    { to: 0, ease: 'outBounce', duration: 800, delay: 100 }
  ],
  // Subtle wobble instead of full spin
  rotate: {
    from: '-5deg',
    to: '5deg',
    delay: 0
  },
  delay: stagger(40),
  ease: 'inOutCirc',
  loopDelay: 1000,
  loop: true
});
