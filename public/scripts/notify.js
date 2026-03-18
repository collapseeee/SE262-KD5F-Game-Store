const Notify = {
  container: null,

  init() {
    if (this.container) return;

    this.container = document.createElement("div");
    this.container.id = "notify-container";
    Object.assign(this.container.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      zIndex: "9999",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    });
    document.body.appendChild(this.container);
  },

  show(message, type = "success", duration = 3000) {
    if (!this.container) this.init();

    const icons = {
      success: "bi-check-circle-fill",
      error: "bi-x-circle-fill",
      info: "bi-info-circle-fill",
      warning: "bi-exclamation-circle-fill",
    };

    const colors = {
      success: "#22c55e",
      error: "#ef4444",
      info: "#3b82f6",
      warning: "#f59e0b",
    };

    const toast = document.createElement("div");
    toast.innerHTML = `<i class="bi ${icons[type]}"></i> <span>${message}</span>`;

    Object.assign(toast.style, {
      background: "#1e1e2e",
      color: "#fff",
      border: `1px solid ${colors[type]}`,
      borderLeft: `4px solid ${colors[type]}`,
      padding: "12px 18px",
      borderRadius: "8px",
      fontSize: "14px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      minWidth: "220px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      opacity: "0",
      transform: "translateX(40px)",
      transition: "all 0.3s ease",
      cursor: "pointer",
    });

    this.container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateX(0)";
    });

    toast.addEventListener("click", () => this._remove(toast));

    setTimeout(() => this._remove(toast), duration);
  },

  _remove(toast) {
    if (!toast.parentNode) return;
    toast.style.opacity = "0";
    toast.style.transform = "translateX(40px)";
    setTimeout(() => toast.remove(), 300);
  },
};

document.addEventListener("DOMContentLoaded", () => Notify.init());
