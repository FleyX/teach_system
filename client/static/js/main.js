function clearInfo() {
  window.token = undefined;
  localStorage.removeItem('token');
  localStorage.removeItem('userInfo');
}

function clearClientInfo(){
  window.clientToken = undefined;
  localStorage.removeItem('clientToken');
  localStorage.removeItem('clientUserInfo');
}

function getToken() {
  if (window.token == undefined || window.token==null)
    window.token = localStorage.getItem('token');
  return window.token;
}

function getClientToken() {
  if (window.clientToken == undefined || window.clientToken==null)
    window.clientToken = localStorage.getItem('clientToken');
  return window.clientToken;
}

function getUserInfo() {
  return JSON.parse(localStorage.getItem('userInfo'));
}

function getClientUserInfo() {
  return JSON.parse(localStorage.getItem('clientUserInfo'));
}

function alertConfirm(text) {
  return vm.$confirm(text, '提示', {
    confirmButtonText: "确定",
    cancelButtonText: "取消"
  });
}

function alertMessage(message, type) {
  vm.$message({
    message,
    type,
    center: true,
    duration:2000
  });
}

function alertNotify(title, message, type) {
  vm.$notify({
    title,
    message,
    type,
    duration:2000
  })
}
