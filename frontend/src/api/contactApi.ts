import { graphqlClient } from './graphqlClient';
import { gql } from "graphql-request";


// Filters type should match your GraphQL input
interface GetUsersMessagesFilters {
  username?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  country?: string;
  city?: string;
  page?: number;
  limit?: number;
}


/**
 * Fetch filtered messages
 */
export const fetchFilteredUserMessages = async (
  filters: GetUsersMessagesFilters
) => {
  const query = gql`
    query GetUsersMessages(
      $username: String
      $firstName: String
      $lastName: String
      $phoneNumber: String
      $country: String
      $city: String
      $page: Int
      $limit: Int
    ) {
      getUsersMessages(
        filters: {
          username: $username
          firstName: $firstName
          lastName: $lastName
          phoneNumber: $phoneNumber
          country: $country
          city: $city
          page: $page
          limit: $limit
        }
      ) {
        messages {
          username
          firstName
          lastName
          phoneNumber
          country
          city
          subject
          message
          createdAt
        }
        total
        page
        limit
        totalPages
      }
    }
  `;

  try {
    const res = await graphqlClient.request(query, filters);
    return res.getUsersMessages;
  } catch (error: any) {
    console.error("Error fetching user messages:", error);
    throw error;
  }
};

/**
 * Send a message
 */
export const sendMessage = async (payload: { subject: string; message: string }) => {
  const mutation = gql`
    mutation SendMessage($subject: String!, $message: String!) {
      sendMessage(data: { subject: $subject, message: $message }) {
        message
        data {
          subject
          message
          createdAt
        }
      }
    }
  `;

  const res = await graphqlClient.request(mutation, {
    subject: payload.subject,
    message: payload.message,
  });

  return res.sendMessage;
};
