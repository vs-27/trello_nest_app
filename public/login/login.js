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
  const handleFormSubmit = (url, formData, error, callback = () => {}) => {
    $.ajax({
      url: url,
      type: 'POST',
      contentType: false,
      processData: false,
      dataType: 'formData',
      data: formData,
      success: (response) => {
        callback(response);
      },
      error: (err) => {
        alert(`${error}`);
      }
    });
  };
  
  $('#log-form').on('submit', (e) => {
    e.preventDefault();
    handleFormSubmit(
      'http://localhost:3000/api/users/log',
      new FormData($('#log-form')[0]),
      'Login failed. Please check your credentials.',
      ({ token }) => {
        setJwtToken(token)
      }
    );
  });
  
  $('#reg-form').on('submit', (e) => {
    e.preventDefault();
    handleFormSubmit(
      'http://localhost:3000/api/users/reg',
      new FormData($('#reg-form')[0]),
      'Registration failed. Please check your credentials.'
    );
  });
});

function setJwtToken(token) {
  if (!token) {
    console.error('No token provided');
    return;
  }
  try {
    localStorage.setItem('jwtToken', token);
    console.log('Token saved successfully');
  } catch (error) {
    console.error('Error saving token to localStorage:', error);
  }
}
