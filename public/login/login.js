const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('auth-container');

signUpButton.addEventListener('click', () => {
  container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
  container.classList.remove("right-panel-active");
});

$(document).ready(() => {
  const handleFormSubmit = (url, formData, error) => {
    $.ajax({
      url: url,
      type: 'POST',
      contentType: false,
      processData: false,
      dataType: 'json',
      data: formData,
      success: (response) => {
        console.log(response);
      },
      error: (err) => {
        alert(`${error}`);
      }
    });
  };
  
  $('#log-form').on('submit', (e) => {
    e.preventDefault();
    handleFormSubmit(
      '/auth/log',
      new FormData($('#log-form')[0]),
      'Login failed. Please check your credentials.'
    );
  });
  
  $('#reg-form').on('submit', (e) => {
    e.preventDefault();
    handleFormSubmit(
      '/auth/reg',
      new FormData($('#reg-form')[0]),
      'Registration failed. Please check your credentials.'
    );
  });
});
