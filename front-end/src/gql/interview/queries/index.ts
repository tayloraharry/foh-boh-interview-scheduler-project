import { gql } from "apollo-boost";

export const QUERY_INTERVIEWS = gql`
  query {
    interviews {
      id,
      scheduledTime
      locationName
      candidate {
        id
        name
        email
      }
    }
  }
`;
