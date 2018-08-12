import Client from '@/components/client/Main'
import ClientMain from '@/components/client/pages/ClientMain'
import ClientHome from '@/components/client/pages/Home.vue'

import Announcement from '@/components/client/pages/Announcement'

import StudentInfo from '@/components/client/pages/studentInfo/StudentInfo'


import CourseIntro from '@/components/client/pages/courseInfo/CourseIntro'
import ExamType from '@/components/client/pages/courseInfo/ExamType'
import FirstCourse from '@/components/client/pages/courseInfo/FirstCourse'
import ReferenceBook from '@/components/client/pages/courseInfo/ReferenceBook'
import TeacherIntro from '@/components/client/pages/courseInfo/TeacherIntro'
import TeachPlan from '@/components/client/pages/courseInfo/TeachPlan'
import Courseware from '@/components/client/pages/courseInfo/Courseware'

import CurrentWork from '@/components/client/pages/work/CurrentWork'
import LastWork from '@/components/client/pages/work/LastWork'
import WorkDetail from '@/components/client/pages/work/WorkDetail'

import CurrentExam from '@/components/client/pages/exam/CurrentExam'
import LastExam from '@/components/client/pages/exam/LastExam'
import ExamDetail from '@/components/client/pages/exam/ExamDetail'

import EvaluateList from '@/components/client/pages/rankList/EvaluateList'
import CoverageList from '@/components/client/pages/rankList/CoverageList'

import KnowledgePointView from '@/components/client/pages/KnowledgePoint/KnowledgePointView'
import KnowledgePointHistory from '@/components/client/pages/KnowledgePoint/History'
import KnowledgeTestDetail from '@/components/client/pages/KnowledgePoint/KnowledgeTestDetail'

import NewQuestionAnswer from '@/components/client/pages/questionAnswer/NewQuestionAnswer'
import CurrentQuestionAnswer from '@/components/client/pages/questionAnswer/CurrentQuestionAnswer'
import QuestionAnswerHistory from '@/components/client/pages/questionAnswer/QuestionAnswerHistory'

export default {
  path: "/client",
  component: Client,
  beforeEnter: (to, from, next) => {
    if (getClientUserInfo() == null) {
      next({
        path: '/public/client_login',
        replace: true,
      })
    } else {
      next();
    }
  },
  children: [{
      //学生端主页
      path: '',
      name: "ClientMain",
      component: ClientHome
    }, {
      //学生个人资料页面
      path: 'person/student_info',
      name: "StudentInfo",
      component: StudentInfo
    }, {
      //公告页面
      path: 'course/:c_id/announcement',
      name: 'Main',
      component: Announcement
    }, {
      //课程基本信息
      path: 'course/:c_id/base',
      component: ClientMain,
      children: [{
        path: 'course_intro',
        name: "ClientCourseIntro",
        component: CourseIntro
      }, {
        path: 'exam_type',
        name: "ClientExamType",
        component: ExamType
      }, {
        path: 'first_course',
        name: "ClientFirstCourse",
        component: FirstCourse
      }, {
        path: 'reference_book',
        name: "ClientReferenceBook",
        component: ReferenceBook
      }, {
        path: 'teacher_intro',
        name: "ClientTeacherIntro",
        component: TeacherIntro
      }, {
        path: 'teach_plan',
        name: "ClientTeachPlan",
        component: TeachPlan
      }, {
        path: 'courseware',
        name: "ClientCourseware",
        component: Courseware
      }]
    }, {
      //知识点覆盖率检测
      path: 'course/:c_id/knowledge_point',
      component: ClientMain,
      children: [{
        path: 'overview',
        name: "KnowledgePointView",
        component: KnowledgePointView
      }, {
        path: 'history',
        name: "KnowledgePointHistory",
        component: KnowledgePointHistory
      }, {
        path: 'history/:test_id',
        name: "KnowledgeTestDetail",
        component: KnowledgeTestDetail
      }]
    }, {
      //在线作业
      path: 'course/:c_id/work',
      component: ClientMain,
      children: [{
        path: 'current_work',
        name: 'CurrentWork',
        component: CurrentWork
      }, {
        path: 'last_work',
        name: 'LastWork',
        component: LastWork
      }, {
        path: 'current_work/:test_id',
        name: 'WorkDetail',
        component: WorkDetail
      }, {
        path: 'last_work/:test_id',
        name: 'WorkDetail',
        component: WorkDetail
      }]
    }, {
      //在线考试
      path: 'course/:c_id/exam',
      component: ClientMain,
      children: [{
        path: 'current_exam',
        name: 'CurrentExam',
        component: CurrentExam
      }, {
        path: 'last_exam',
        name: 'LastExam',
        component: LastExam
      }, {
        path: 'current_exam/:test_id',
        name: 'ExamDetail',
        component: ExamDetail
      }, {
        path: 'last_exam/:test_id',
        name: 'ExamDetail',
        component: ExamDetail
      }]
    },
    //排行榜
    {
      path: 'course/:c_id/rank_list',
      component: ClientMain,
      children: [{
        path: 'evaluate',
        name: 'EvaluateList',
        component: EvaluateList
      }, {
        path: 'coverage',
        name: 'CoverageList',
        component: CoverageList
      }]
    },
    //答疑
    {
      path:'course/:c_id/question_answer',
      component:ClientMain,
      children:[{
        path:'new',
        name:"NewQuestionAnswer",
        component:NewQuestionAnswer
      },{
        path:'current',
        name:'CurrentQuestionAnswer',
        component:CurrentQuestionAnswer
      },{
        path:'historyqa',
        name:"QuestionAnswerHistory",
        component:QuestionAnswerHistory
      }]
    }
  ]
}
