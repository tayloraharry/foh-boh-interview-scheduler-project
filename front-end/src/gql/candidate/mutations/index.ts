import { gql } from "apollo-boost";

export const ADD_CANDIDATE = gql`
mutation addCandidate($input: CandidateInput!) {
  addCandidate(input: $input) {
    candidate {
      id
      name
      email
    }
  }
}
`;