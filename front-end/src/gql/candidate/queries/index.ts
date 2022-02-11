import { gql } from "apollo-boost";

export const QUERY_CANDIDATES = gql`
query {
  candidates {
    id,
    name,
    email,
  }
}`
