document.querySelectorAll('.input-with-icon .input-icon').forEach(function (icon) {
      icon.addEventListener('click', function () {
        const input = this.previousElementSibling;
        if (input.type === 'password') {
          input.type = 'text';
          this.classList.replace('bi-eye', 'bi-eye-slash');
        } else {
          input.type = 'password';
          this.classList.replace('bi-eye-slash', 'bi-eye');
        }
      });
    });