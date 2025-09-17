# Project Refactoring Guide: From Private Portal to Public Catalog

This document outlines the steps to convert the existing Nuxt 3 application from a private, authenticated portal with customer-specific pricing into a public-facing catalog site. The goal is to remove all authentication, login, and pricing-related features, leaving only the part catalog functionality.

## 1. Remove Authentication Middleware

*   **Delete the `auth.ts` middleware file.**
    *   **File to delete:** `app/middleware/auth.ts`
    *   **Reasoning:** This middleware prevents unauthenticated users from accessing the site. Since the new site will be public, this is no longer needed.

## 2. Delete Login Page

*   **Delete the `login.vue` page.**
    *   **File to delete:** `app/pages/login.vue`
    *   **Reasoning:** With authentication removed, the login page is obsolete.

## 3. Remove Customer Data Logic

*   **Delete the `useCustomers.ts` composable.**
    *   **File to delete:** `app/composables/useCustomers.ts`
    *   **Reasoning:** This composable is used to fetch customer-specific data, which is not needed in the public catalog.

## 4. Clean Up the Application Header

*   **Modify `AppHeader.vue` to remove user-specific elements.**
    *   **File to modify:** `app/components/AppHeader.vue`
    *   **Remove the following:**
        *   The logout button and its associated logic (`onLogout` function).
        *   The display of the customer's name.
        *   All references to `useDirectusUser`, `useDirectusAuth`, and `useCustomer`.
        *   The `watch` function that observes the user object.

## 5. Remove Pricing from the Parts Table

*   **Modify `PartsTable.vue` to remove pricing information.**
    *   **File to modify:** `app/components/PartsTable.vue`
    *   **Remove the following:**
        *   The "List Price" and "Your Price" columns from the table header.
        *   The corresponding cells that display the price data for each part.
        *   The `formatCurrency` function, as it will no longer be used.

## 6. Update Global Application Files

*   **Check `app.vue` and remove any global middleware.**
    *   **File to check:** `app/app.vue`
    *   **Action:** Ensure that the `auth` middleware is not applied globally. If it is, remove the `definePageMeta` block or the relevant middleware declaration.

By following these steps, the application will be successfully converted into a public-facing catalog site without any authentication or pricing information.
