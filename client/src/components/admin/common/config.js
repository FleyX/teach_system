export default {
  person_space: [{
    index: "person_space",
    name: "个人资料",
  }, {
    index: "person_space/safe",
    name: "安全设置",
    data: [{
      index: "person_space/safe/change_email",
      name: "修改邮箱"
    }, {
      index: "person_space/safe/change_password",
      name: "修改密码"
    }]
  }],
  manage: [{
    index: 'manage/course_manage',
    name: '课程管理'
  }, {
    index: 'manage/user_manage',
    name: '用户管理'
  }],
  student: [{
    index: 'student',
    name: '学生概览'
  }, {
    index: 'student/add',
    name: '录入学生',
    data: [{
      index: 'student/add_one',
      name: "单个录入"
    }, {
      index: 'student/add_many',
      name: "批量录入"
    }]
  }],
  announcement: [{
    index: 'announcement',
    name: '公告概览'
  }, {
    index: 'announcement/add',
    name: '新增公告'
  }],
  base:[{
    index:'base',
    name:'课程简介'
  },{
    index:'base/teacher_intro',
    name:'教师简介',
  },{
    index:'base/first_course',
    name:'先导课程'
  },{
    index:'base/teach_plan',
    name:'教学计划'
  },{
    index:'base/exam_type',
    name:'考试方式'
  },{
    index:'base/reference_book',
    name:'参考书目'
  },{
    index:'base/section',
    name:'章节管理'
  },{
    index:'base/courseware_manage',
    name:'课件管理'
  }],
  question_bank:[{
    index:'question_bank',
    name:'题库总览'
  },{
    index:'add',
    name:'录入题目',
    data:[{
      index:'question_bank/add/choice_question',
      name:'选择题'
    },{
      index:'question_bank/add/gap_filling',
      name:'填空题'
    },{
      index:'question_bank/add/program',
      name:'编程题'
    }]
  },{
    index:'question_bank/question_group_overview',
    name:'题组总览'
  },{
    index:'question_bank/organize_question',
    name:"组织题目"
  }],
  test:[{
    index:'test',
    name:"测试总览"
  },{
    index:'test/add_homework',
    name:"发布作业"
  },{
    index:'test/add_exam',
    name:"发布考试"
  }],
  statistics:[
    {
      index:'statistics',
      name:'总览'
    },
  ],
  //答疑
  Q_A:[
    {
      index:'Q_A',
      name:"当前答疑"
    }
  ],
  //主页统计
  admin:[
    {
      index:'overview',
      name:'总览'
    }
  ]
}
