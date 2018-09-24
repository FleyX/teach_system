//let env = 'development';
let env = 'production';

if (env == "development") {
  window.actionUrl = 'http://192.168.189.132/api/v1';
  window.publicUrl= 'http://192.168.189.132/login-api';
} else {
  window.actionUrl= '/api/v1';
  window.publicUrl= '/login-api';
}
