import { gql } from "apollo-boost";

export const TOTAL_LOCKED = gql`
  {
    veOCEANs(first: 1000) {
      id
      lockedAmount
    }
  }
`;

export const GET_USER_LAST_ACTIVE_REWARDS_CLAIM = gql`
  query userDelegation($userAddress: String!) {
    dfrewards(where: { id: $userAddress }) {
      id
      receiver {
        id
      }
      history(
        first: 1
        orderBy: timestamp
        orderDirection: desc
        where: { type: "Claimed" }
      ) {
        id
        timestamp
      }
    }
  }
`;
