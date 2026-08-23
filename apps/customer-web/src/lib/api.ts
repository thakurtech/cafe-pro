import { createApiClient } from '@restaurant-os/api-client';
import { Product, Order } from '@restaurant-os/types';

export const apiClient = createApiClient({
  baseUrl: 'http://localhost:4000/api/v1',
});

export const fetchMenu = async (outletId: string): Promise<Product[]> => {
  return apiClient.request<Product[]>(`/outlets/${outletId}/menu`);
};

export const submitOrder = async (orderData: Partial<Order>): Promise<Order> => {
  return apiClient.request<Order>('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
};
