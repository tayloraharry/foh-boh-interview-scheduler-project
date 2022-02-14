import { gql } from "apollo-boost";

export const SCHEDULE_INTERVIEW = gql`
  mutation addInterview($input: InterviewInput!) {
    addInterview(input: $input) {
      interview {
        candidate {
          id
        }
      }
    }
  }
`;

export const UPDATE_INTERVIEW = gql`
  mutation updateInterview(
    $id: ID
    $locationName: String!
    $scheduledTime: DateTime!
  ) {
    updateInterview(
      interviewId: $id
      locationName: $locationName
      scheduledTime: $scheduledTime
    ) {
      interview {
        id
      }
    }
  }
`;

export const CANCEL_INTERVIEW = gql`
  mutation ($id: ID) {
    cancelInterview(interviewId: $id) {
      ok
    }
  }
`;
