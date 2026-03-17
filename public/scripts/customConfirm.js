// ─── Custom Confirm Modal ──────────────────────────────────────────

export function customConfirm(message) {
  return new Promise((resolve) => {

    // Overlay
    const overlay = document.createElement("div");
    Object.assign(overlay.style, {
      position: "fixed", inset: "0",
      background: "rgba(0,0,0,0.5)",
      zIndex: "9999",
      display: "flex", alignItems: "center", justifyContent: "center",
      backdropFilter: "blur(3px)",
    });

    // Modal box
    const modal = document.createElement("div");
    Object.assign(modal.style, {
      background: "#8122C9",
      borderRadius: "12px",
      padding: "28px 32px",
      maxWidth: "380px",
      width: "90%",
      boxShadow: "0 10px 20px #B6EE01",
      textAlign: "center",
      fontFamily: "sans-serif",
    });

    modal.innerHTML = `
       <style>
                h3 {
                    font-weight: 600;
                    color: #f0f0f0;

                }
                .modal-btn {
                    padding: 10px 24px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 600;
                    transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
                    position: relative;
                    overflow: hidden;
                }

                /* Cancel button */
                .modal-btn-cancel {
                    border: 1px solid #ddd;
                    background: #f5f5f5;
                    color: #050505;
                }
                .modal-btn-cancel:hover {
                    background: #e8e8e8;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }
                .modal-btn-cancel:active {
                    transform: scale(0.95) translateY(0);
                    box-shadow: none;
                }

                /* Confirm button */
                .modal-btn-confirm {
                    border: none;
                    background: #ef4444;
                    color: #fff;
                }
                .modal-btn-confirm:hover {
                    background: #dc2626;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 16px rgba(239,68,68,0.4);
                }
                .modal-btn-confirm:active {
                    transform: scale(0.95) translateY(0);
                    box-shadow: none;
                }

                /* Ripple effect */
                .ripple {
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.4);
                    transform: scale(0);
                    animation: ripple-anim 0.5s linear;
                    pointer-events: none;
                }
                @keyframes ripple-anim {
                    to { transform: scale(4); opacity: 0; }
                }
            </style>

            <div style="font-size:40px; margin-bottom:12px;">🗑️</div>
            <h3 style="margin:0 0 8px; font-size:18px;">Remove Item</h3>
            <p style="margin:0 0 24px; color:#B6EE01; font-size:14px;">${message}</p>
            <div style="display:flex; gap:12px; justify-content:center;">
                <button id="modal-cancel"  class="modal-btn modal-btn-cancel">Cancel</button>
                <button id="modal-confirm" class="modal-btn modal-btn-confirm">Yes, Remove</button>
            </div>
        `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Animate in
    modal.style.transform = "scale(0.85)";
    modal.style.opacity = "0";
    modal.style.transition = "all 0.2s ease";
    requestAnimationFrame(() => {
      modal.style.transform = "scale(1)";
      modal.style.opacity = "1";
    });

    // ─── Ripple effect on click ──────────────────────────────
        function addRipple(event) {
            const btn = event.currentTarget;
            const ripple = document.createElement("span");
            const size = Math.max(btn.offsetWidth, btn.offsetHeight);
            const rect = btn.getBoundingClientRect();

            ripple.classList.add("ripple");
            Object.assign(ripple.style, {
                width:  `${size}px`,
                height: `${size}px`,
                left:   `${event.clientX - rect.left - size / 2}px`,
                top:    `${event.clientY - rect.top  - size / 2}px`,
            });

            btn.appendChild(ripple);
            ripple.addEventListener("animationend", () => ripple.remove());
      }

    // Close helper
    function close(result) {
      modal.style.transform = "scale(0.85)";
      modal.style.opacity = "0";
      setTimeout(() => {
        overlay.remove();
        resolve(result); // ✅ true or false, just like window.confirm()
      }, 200);
    }

    // Buttons
    modal.querySelector("#modal-confirm").addEventListener("click", () => close(true));
    modal.querySelector("#modal-cancel").addEventListener("click",  () => close(false));

    // Click outside to cancel
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close(false);
    });

  });
}