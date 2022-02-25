import { gql } from "@apollo/client";

export interface User {
  id: number
  itsc: string
  name: string
}

export const SIDEBAR = gql`
  query getSidebarData($userId: bigint!, $semesterId: bigint!) {
    user(id: $userId) {
      id
      itsc
      name
      initials
      courses(where: {
        course: {
          semester_id: { _eq: $semesterId }
        }
      }) {
        role
        course {
          id
          code
        }
      }
    }
    semesters {
      id
      name
    }
  }
`

export const GET_STUDYING_COURSES = gql`
  query getStudyingCourses($userId: bigint!, $semesterId: bigint!) {
    user(id: $userId) {
      courses(where: {
        course: {
          semester_id: { _eq: $semesterId }
        }
      }) {
        course {
          name
          code
        }
      }
    }
  }
`

export const GET_GRADES = gql`
  query getGrades($userId: bigint!, $courseIds: [bigint!]!) {
    courses
  }
`



export const GET_SEMESTERS = gql`
  query getSemester {
    semesters {
      id
      name
    }
  }
`

export const GET_REPORT = gql`
  query getReport($id: bigint!) {
    report(id: $id) {
      id
      is_final
      sanitizedReports
      grade
      createdAt
      submission {
        upload_name
      }
    }
  }
`

export const SUBMISSION_SUBSCRIPTION = gql`
  subscription submissionsForAssignment($userId: bigint, $assignmentConfigId: bigint!) {
    submissions(
      order_by: [
        {
          created_at: desc
        }
      ]
      where: {
        user_id: { _eq: $userId }
        assignment_config_id: { _eq: $assignmentConfigId }
      }
    ) {
      id
      created_at
      upload_name
      fail_reason
      reports(order_by: [
        {
          createdAt: desc
        }
      ]) {
        id
        is_final
        createdAt
      }
    }
  }
`

export const GET_ASSIGNMENTS = gql`
  query getAssignmentsFromCourses($courseIds: [bigint!]!, $userId: bigint!) {
    user(id: $userId) {
      assignedTasks(
        where: {
          assignment_config: {
            assignment: {
              course_id: { _in: $courseIds }
            }
          }
        }
        order_by: [
          {
            assignment_config: {
              assignment: {
                type: asc
              }
              showAt: desc
            }
          }
        ]
      ) {
        assignment_config {
          id
          showAt
          createdAt
          dueAt
          attemptLimits
          assignment {
            workloadType {
              name
            }
            name
            course {
              code
            }
          }
        }
      }
    }
  }
`

export const GET_ASSIGNMENT_DETAIL = gql`
  query getAssignmentDetail($assignmentConfigId: bigint!) {
    assignmentConfig(id: $assignmentConfigId) {
      id
      showAt
      createdAt
      dueAt
      openForSubmission
      stopCollectionAt
      submissionWindowPassed
      assignment {
        name
        description
        course {
          code
          name
          website
          users(where: {
            permission: {
              _gt: 1
            }
          }) {
            user {
              name
              itsc
            }
          }
        }
        workloadType {
          name
        }
      }
    }
  }
`