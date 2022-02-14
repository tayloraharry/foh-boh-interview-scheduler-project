import { ICandidate } from "../candidate/types";
import { IGqlResult } from "../types";

// main object types
export interface IInterview {
  id: string;
  scheduledTime: Date;
  locationName: string;
  candidate: ICandidate;
}

// gql return types
export interface IInterviewResult extends IGqlResult {
   interviews: IInterview[]
}
