interface CustomerResponse {
    data: any;
}

export const useCustomer = (id: string) => {
    return useAsyncData('customer-' + id, () => $fetch<CustomerResponse>('/api/data/find-customer?user_id=' + id));
}
    