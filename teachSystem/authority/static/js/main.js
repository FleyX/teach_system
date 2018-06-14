var app;
app = new Vue({
    el: '#app',
    data: {
        urls: [],
        roles: [],
        warmText: '警告：此页面仅用于配置角色权限，请使用后及时关闭本服务',
        roleCheckedIndex: -1,
        isAddRole:false,
        name:''
    },
    created: function () {
        this.getRole();
        this.getUrls();
    },
    methods: {
        getRole: function () {
            get('/role').then(res => {
                app.getRoleUrl(res)
                    .then(data => {
                        res.forEach((item, index) => {
                            item.urls = data[index];
                        })
                        app.roles = res;
                    });
            }).catch(err => {
                console.log(err);
                alert("Error");
            })
        },
        getUrls: function () {
            get('/url').then(res => {
                res.forEach(item => {
                    item.checked = false
                });
                app.urls = res;
            }).catch(err => {
                console.log(err);
                alert("Error");
            })
        },
        roleClick: function (index) {
            let role = this.roles[index];
            this.urls.forEach(item => {
                if (role.urls[item.r_id] != undefined) {
                    item.checked = true;
                }
                else {
                    item.checked = false;
                }
            })
            this.roleCheckedIndex = index;
        },
        getRoleUrl: function (res) {
            return new Promise((resolve, reject) => {
                var functions = res.map(item => {
                    return get('/role_url?roleId=' + item.j_id);
                })
                Promise.all(functions).then((res) => {
                    res = res.map(item => {
                        var temp = {};
                        item.forEach(one => {
                            temp[one.r_id] = true;
                        })
                        return temp;
                    })
                    // console.log(res);
                    resolve(res);
                }).catch(err => {
                    reject(err);
                })
            })
        },
        addRole: function () {
            get('/add_role',{name:this.name}).then(res=>{
                res.urls = {};
                app.roles.push(res);
                app.name = '';
                alert('操作成功');
            }).catch(err=>{
                alert('操作失败');
            })
        },
        submit: function () {
            let arr = [];
            let urls = {};
            this.urls.forEach(item => {
                if (item.checked) {
                    arr.push(item.r_id);
                    urls[item.r_id] = true;
                }
            })
            let role = this.roles[this.roleCheckedIndex];
            get("/change_role_url", {j_id: role.j_id, arr: JSON.stringify(arr)})
                .then(res => {
                    role.urls = urls;
                    alert(res);
                }).catch(err => {
                alert("操作失败");
            })
        }
    }
})
;

function get(url, params = null) {
    return new Promise((resolve, reject) => {
        axios.get(url, {params}).then(res => {
            if (res.status == 200) {
                resolve(res.data);
            } else {
                reject(res);
            }
        }).catch(err => {
            console.log(err);
            reject(err);
        })
    })
}
