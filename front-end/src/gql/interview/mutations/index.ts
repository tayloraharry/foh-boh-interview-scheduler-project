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

export const CANCEL_INTERVIEW = gql`
  mutation ($id: ID) {
    cancelInterview(interviewId: $id) {
      ok
    }
  }
`;
