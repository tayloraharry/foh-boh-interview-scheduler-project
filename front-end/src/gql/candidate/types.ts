import { IGqlResult } from "../types";

// main object types
export interface ICandidate {
  id: string;
  name: string;
  email: string;
}

// gql return types
export interface ICandidateResult extends IGqlResult {
  candidates: ICandidate[]
}
