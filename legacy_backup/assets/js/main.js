// Utility functions for UI interactions
document.addEventListener('DOMContentLoaded', () => {
    // Add simple click animations to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            let x = e.clientX - e.target.offsetLeft;
            let y = e.clientY - e.target.offsetTop;
            
            let ripples = document.createElement('span');
            ripples.style.left = x + 'px';
            ripples.style.top = y + 'px';
            ripples.style.position = 'absolute';
            ripples.style.background = 'rgba(255,255,255,0.5)';
            ripples.style.transform = 'translate(-50%, -50%)';
            ripples.style.pointerEvents = 'none';
            ripples.style.borderRadius = '50%';
            ripples.style.animation = 'animate 1s linear infinite';
            
            this.appendChild(ripples);
            
            setTimeout(() => {
                ripples.remove();
            }, 500);
        });
    });
});
