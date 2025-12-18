import { apiClient } from "../api";

export interface Contact {
  _id: string;
  name: string;
  email?: string;
  phone_number?: string;
  message: string;
  created_at: string;
}

export interface GetContactsResponse {
  message: string;
  contacts: Contact[];
}

/**
 * Get all contact messages
 * @returns Promise with array of contacts
 */
export const getAllContacts = async (): Promise<Contact[]> => {
  const response = await apiClient.get<GetContactsResponse>("/contact");
  return response.data.contacts;
};

/**
 * Delete a contact message
 * @param id - Contact ID
 */
export const deleteContact = async (id: string): Promise<void> => {
  await apiClient.delete(`/contact/${id}`);
};
