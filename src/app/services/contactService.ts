import { apiClient } from "./api";

export interface CreateContactDto {
  name: string;
  email?: string;
  phone_number?: string;
  message: string;
}

export interface ContactResponseDto {
  name: string;
  email?: string;
  phone_number?: string;
  message: string;
  created_at: Date;
}

/**
 * Submit a contact form message
 * @param data - Contact form data
 * @returns Promise with the contact response
 */
export const submitContactForm = async (
  data: CreateContactDto
): Promise<ContactResponseDto> => {
  const response = await apiClient.post<ContactResponseDto>("/contact", data);
  return response.data;
};
