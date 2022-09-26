import { gql } from "apollo-boost";

export const VEOCEAN_SUMMARY = gql`{
  veOCEANs(first:1000) {
    id
    lockedAmount
    unlockTime
    block
  }
}`;
