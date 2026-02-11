import { gql } from "graphql-request";

/**
 * Query to fetch minimal poll metadata for distribution purposes
 */
export const GET_POLL_DISTRIBUTION_DATA = gql`
  query GetPollDistributionData($id: ID!) {
    poll(id: $id) {
      id
      title
      description
      is_active
      is_open
    }
  }
`;

export interface PollDistributionData {
	poll: {
		id: string;
		title: string;
		description: string;
		is_active: boolean;
		is_open: boolean;
	};
}
