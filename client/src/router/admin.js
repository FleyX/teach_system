import Admin from '@/components/admin/Main'
import CourseMange from '@/components/admin/pages/manage/CourseManage'
import UserManage from '@/components/admin/pages/manage/UserManage'
import TotalStatistic from '@/components/admin/pages/manage/TotalStatistic'
import PersonInfo from '@/components/admin/pages/manage/PersonInfo'
import PersonSafe from '@/components/admin/pages/manage/Safe'

import CourseIntro from '@/components/admin/pages/course/base/CourseIntro'
import TeachPlan from '@/components/admin/pages/course/base/TeachPlan'
import TeacherIntro from '@/components/admin/pages/course/base/TeacherIntro'
import FirstCourse from '@/components/admin/pages/course/base/FirstCourse'
import ExamType from '@/components/admin/pages/course/base/ExamType'
import ReferenceBook from '@/components/admin/pages/course/base/ReferenceBook'
import Section from '@/components/admin/pages/course/base/Section'
import CoursewareManage from '@/components/admin/pages/course/base/CoursewareManage'

import AOverView from '@/components/admin/pages/course/announcement/OverView'
import AddAnnouncement from '@/components/admin/pages/course/announcement/AddAnnouncement'

import QBOverview from '@/components/admin/pages/course/QuestionBank/Overview'
import AddChoiceQuestion from '@/components/admin/pages/course/QuestionBank/AddChoiceQuestion'
import AddGapFilling from '@/components/admin/pages/course/QuestionBank/AddGapFilling'
import AddProgram from '@/components/admin/pages/course/QuestionBank/AddProgram'
import OrganizeQuestion from '@/components/admin/pages/course/QuestionBank/OrganizeQuestion'
import QuestionGroupOverview from '@/components/admin/pages/course/QuestionBank/QuestionGroupOverview'

import TestOverView from '@/components/admin/pages/course/test/Overview'
import AddHomework from '@/components/admin/pages/course/test/AddHomework'
import AddExam from '@/components/admin/pages/course/test/AddExam'

import CourseMain from '@/components/admin/pages/course/Main'
import OverView from '@/components/admin/pages/course/student/OverView'
import AddSingleStudent from '@/components/admin/pages/course/student/AddSingleStudent'
import AddManyStudent from '@/components/admin/pages/course/student/AddManyStudent'

import CurrentQuestionAnswer from '@/components/admin/pages/course/Q_A/CurrentQuestionAnswer'

import StudentStatistics from '@/components/admin/pages/course/statistics/StudentStatistics'
export default {
  path: '/admin',
  component: Admin,
  beforeEnter: (to, from, next) => {
    if (getUserInfo() == null) {
      console.log('asdf');
      next({
        path: '/public/admin_login',
        replace: true,
      })
    } else {
      next();
    }
  },
  children: [{
      path: "",
      name: "TotalStatistic",
      component: TotalStatistic
    }, {
      path: 'manage',
      component: CourseMain,
      children: [{
          path: 'course_manage',
          name: 'CourseManage',
          component: CourseMange
        },
        {
          path: "user_manage",
          name: "UserManage",
          component: UserManage
        }
      ]
    }, {
      path: "person_space",
      component: CourseMain,
      children: [{
        path: '',
        name: "PersonInfo",
        component: PersonInfo
      }, {
        path: "safe/:type",
        name: "PersonSafe",
        component: PersonSafe
      }]
    }, {
      path: "course/:c_id/base",
      component: CourseMain,
      children: [{
          path: '',
          name: 'CourseIntro',
          component: CourseIntro
        }, {
          path: 'teacher_intro',
          name: 'Teacher_intro',
          component: TeacherIntro
        },
        {
          path: 'first_course',
          name: 'FirstCourse',
          component: FirstCourse
        },
        {
          path: 'teach_plan',
          name: 'TeachPlan',
          component: TeachPlan
        },
        {
          path: 'exam_type',
          name: 'ExamType',
          component: ExamType
        },
        {
          path: 'reference_book',
          name: 'ReferenceBook',
          component: ReferenceBook
        }, {
          path: 'section',
          name: 'Section',
          component: Section
        }, {
          path: 'courseware_manage',
          name: "CoursewareManage",
          component: CoursewareManage
        }
      ]
    },
    //题库管理
    {
      path: "course/:c_id/question_bank",
      component: CourseMain,
      children: [{
        path: '',
        name: "Overwatch",
        component: QBOverview
      }, {
        path: 'question_group_overview',
        name: "QuestionGroupOverview",
        component: QuestionGroupOverview
      }, {
        path: 'organize_question',
        name: 'OrganizeQuestion',
        component: OrganizeQuestion
      }, {
        path: 'add/choice_question',
        name: "AddChoiceQuestion",
        component: AddChoiceQuestion
      }, {
        path: 'add/gap_filling',
        name: "AddGapFilling",
        component: AddGapFilling
      }, {
        path: 'add/program',
        name: "AddProgram",
        component: AddProgram
      }]
    },
    //测试
    {
      path: "course/:c_id/test",
      component: CourseMain,
      children: [{
        path: '',
        name: 'TestOverView',
        component: TestOverView
      }, {
        path: 'add_homework',
        name: "AddHomework",
        component: AddHomework
      }, {
        path: 'add_exam',
        name: "AddExam",
        component: AddExam
      }]
    }, {
      path: "course/:c_id/statistics",
      component: CourseMain,
      children: [{
        path: '',
        name: 'StudentStatistics',
        component: StudentStatistics
      }]
    }, {
      path: 'course/:c_id/student',
      component: CourseMain,
      children: [{
        path: '',
        name: 'OverView',
        component: OverView,
      }, {
        path: 'add_one',
        name: 'AddSingleStudent',
        component: AddSingleStudent
      }, {
        path: 'add_many',
        name: 'AddManyStudent',
        component: AddManyStudent
      }]
    },
    //公告管理
    {
      path: 'course/:c_id/announcement',
      component: CourseMain,
      children: [{
        path: '',
        name: "AnnouncementOverView",
        component: AOverView
      }, {
        path: 'add',
        name: "AddAnnouncement",
        component: AddAnnouncement
      }]
    },
    //答疑
    {
      path: 'course/:c_id/Q_A',
      component: CourseMain,
      children: [{
        path: '',
        name: 'CurrentQuestionAnswer',
        component: CurrentQuestionAnswer
      }]
    }
  ]
}
