import { gql } from "apollo-boost";

export const TOTAL_LOCKED = gql`{
    veOCEANs(first:1000) {
      id
      lockedAmount
    }
}`;

export const DEPOSITS = gql`{
    veDeposits(first:1000) {
      timestamp
      unlockTime
    }
}`
