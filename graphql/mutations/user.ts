import { gql } from "@apollo/client";

export const UPDATE_SUBMISSION_NOTI = gql`
mutation updateSubmissionNoti($userId: bigint!, $submissionId: jsonb, $submissionIdForCheck: bigint!){
    update_section_user(
      where:{
        user_id:{_eq: $userId},
        section:{
          course:{
            assignments:{
              configs:{
                submissions:{
                  id:{_eq: $submissionIdForCheck}
                }
              }
            }
          }
        }
      },
      _append: {submissions:$submissionId}
    ){
      affected_rows
    }
}
`