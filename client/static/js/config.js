let env = 'development';
// let env = 'production';

if (env == "development") {
  window.actionUrl = 'http://localhost:8081/api/v1';
  window.publicUrl= 'http://localhost:8083/login-api';
} else {
  window.actionUrl= '/api/v1';
  window.publicUrl= '/login-api';
}
