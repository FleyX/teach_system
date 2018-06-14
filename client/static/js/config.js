let env = 'development';
// let env = 'production';

if (env == "development") {
  window.actionUrl = 'http://localhost:3002/api/v1';
  window.publicUrl= 'http://localhost:8083/login-api';
} else {
  window.actionUrl= 'http://tapme.top/api/v1';
  window.publicUrl= 'http://tapme.top/login-api';
}
