const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('auth-container');

signUpButton.addEventListener('click', () => {
  container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
  container.classList.remove("right-panel-active");
});

const regContainerSelector = '#auth-container.right-panel-active';
const loginContainerSelector = '#auth-container:not(.right-panel-active)';

$(document).ready(function() {
  $('body').on('click', `${regContainerSelector} #signup-btn`, (e) => {
    const regFormData = new FormData();
    regFormData.append('fullName', $('#reg_full_name').val());
    regFormData.append('email', $('#reg_email').val());
    regFormData.append('password', $('#reg_password').val());

    $.ajax({
      url: '/auth/reg',
      type: 'POST',
      contentType: false,
      processData: false,
      dataType: 'json',
      data: regFormData,
      success: function(response) {
        console.log(response);
      },
      error: function(error) {
        alert('Login failed. Please check your credentials.');
      }
    });
  });
});
