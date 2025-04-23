document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn-primary');
    buttons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            alert('You clicked on ' + this.textContent);
        });
    });
});
