var $http = {};

$http.get = (url, params = null) => {
  return request(url, "get", params, null, false, "admin");
};

$http.post = (url, form, isFormData = false, params = null) => {
  return request(url, "post", params, form, isFormData, "admin");
};

$http.put = (url, form, isFormData = false, params = null) => {
  return request(url, "put", params, form, isFormData, "admin");
};

$http.delete = (url, params = null) => {
  return request(url, "delete", params, null, false, "admin");
};

var $httpc = {};

$httpc.get = (url, params = null) => {
  return request(url, "get", params, null, false, "client");
};

$httpc.post = (url, form, isFormData = false, params = null) => {
  return request(url, "post", params, form, isFormData, "client");
};

$httpc.put = (url, form, isFormData = false, params = null) => {
  return request(url, "put", params, form, isFormData, "client");
};

$httpc.delete = (url, params = null) => {
  return request(url, "delete", params, null, false, "client");
};

request = (url, method, params, form, isFormData, type) => {
  let token;
  if (type == "admin") {
    token = getToken();
  } else {
    token = getClientToken();
  }
  url = (url.startsWith("/") ? "/api/v1" : "/api/v1/") + url;
  let headers = {
    Authorization: token
  };
  if (isFormData) {
    headers["Content-Type"] = "multipart/form-data";
  }
  return new Promise((resolve, reject) => {
    axios({
      url,
      method,
      params,
      data: form,
      headers
      // timeout:2000
    })
      .then(res => {
        resolve(res.data);
        //检查是否有更新token
        // console.log(res);
        if (res.headers["new-token"] != undefined) {
          console.log("set new token");
          if (vm.$route.path.startsWith("/admin")) {
            localStorage.setItem("token", res.headers["new-token"]);
            window.token = undefined;
          } else if (vm.$route.path.startsWith("/client")) {
            localStorage.setItem("clientToken", res.headers["new-token"]);
            window.clientToken = undefined;
          }
        }
      })
      .catch(err => {
        reject(err);
        if (err.code == "ECONNABORTED") {
          alertNotify("错误", "请求超时", "error");
          return;
        }
        if (err.message == "Network Error") {
          alertNotify("错误", "无法连接服务器", "error");
          return;
        }
        if (err.response != undefined) {
          switch (err.response.status) {
            case 401:
              if (window.isGoToLogin) {
                return;
              }
              window.isGoToLogin = true;
              vm.$alert(err.response.data, "警告", {
                type: "warning",
                showClose: false
              }).then(res => {
                window.isGoToLogin = false;
                if (vm.$route.path.startsWith("/admin/")) {
                  clearInfo();
                  vm.$router.replace("/public/admin_login");
                } else {
                  clearClientInfo();
                  vm.$router.replace("/public/client_login");
                }
              });
              break;
            case 403:
              alertNotify("Error:403", "拒绝执行：" + err.response.data, "error");
              break;
            case 404:
              alertNotify("Error:404", "找不到资源：" + url.substr(0, url.indexOf("?")), "error");
              break;
            case 400:
              alertNotify("Error:400", "请求参数错误：" + err.response.data, "error");
              break;
            case 500:
              alertNotify("Error:500", "服务器内部错误：" + err.response.data, "error");
            default:
              console.log("存在错误未处理：" + err);
          }
        } else {
          console.log(err);
        }
      });
  });
};
