// src/api/debitCardApi.ts
import { graphqlClient } from "./graphqlClient";
import type { UserDebitCard } from "../types/debitCard/UserDebitCard";
import type { CreateDebitCard } from "../types/debitCard/CreateDebitCard";
import type { UpdateDebitCard } from "../types/debitCard/UpdateDebitCard";
import type { DeleteDebitCard } from "../types/debitCard/DeleteDebitCard";

/**
 * Fetch all debit cards associated with the current user
 */
export const fetchUserDebitCards = async (): Promise<UserDebitCard[]> => {
  const query = `
    query {
      getUserDebitCards {
        userDebitCards {
          username
          accountNb
          expirationDate
          cardStatus
        }
        message
      }
    }
  `;

  try {
    const response = await graphqlClient.request<{
      getUserDebitCards: { userDebitCards: UserDebitCard[]; message: string };
    }>(query);

    return response.getUserDebitCards.userDebitCards || [];
  } catch (error: any) {
    console.error("Error fetching user debit cards:", error);
    throw error;
  }
};

/**
 * Create a new debit card for the user
 */
export const createDebitCard = async (newDebitCard: CreateDebitCard) => {
  const mutation = `
    mutation ($data: CreateDebitCardInput!) {
      createDebitCard(data: $data) {
        message
        data {
          username
          accountNb
          expirationDate
          cardStatus
        }
      }
    }
  `;

  try {
    const response = await graphqlClient.request<{
      createDebitCard: { message: string; data: UserDebitCard | null };
    }>(mutation, { data: newDebitCard });

    return response.createDebitCard;
  } catch (error: any) {
    console.error("Error creating debit card:", error);
    throw error;
  }
};

/**
 * Update an existing debit card
 */
export const updateDebitCard = async (dbCard: UpdateDebitCard) => {
  const mutation = `
    mutation ($data: UpdateDebitCardInput!) {
      updateDebitCard(data: $data) {
        message
        data {
          username
          accountNb
          expirationDate
          cardStatus
        }
      }
    }
  `;

  try {
    const response = await graphqlClient.request<{
      updateDebitCard: { message: string; data: UserDebitCard | null };
    }>(mutation, { data: dbCard });

    return response.updateDebitCard;
  } catch (error: any) {
    console.error("Error updating debit card:", error);
    throw error;
  }
};

/**
 * Delete a user debit card
 */
export const deleteDebitCard = async (dbCard: DeleteDebitCard) => {
  const mutation = `
    mutation ($data: DeleteDebitCardInput!) {
      deleteDebitCard(data: $data) {
        message
        deleted
      }
    }
  `;

  try {
    const response = await graphqlClient.request<{
      deleteDebitCard: { message: string; deleted: boolean };
    }>(mutation, { data: dbCard });

    return response.deleteDebitCard;
  } catch (error: any) {
    console.error("Error deleting debit card:", error);
    throw error;
  }
};
