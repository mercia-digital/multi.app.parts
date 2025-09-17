<template>
    <div class="wrapper p-3 border-b-2 border-b-solid border-b-gray-200 mb-8">
        <div class="flex justify-between items-center gap-3 max-w-6xl mx-auto">
            <div class="logo">
                <NuxtLink to="/">
                    <img :src="runtimeConfig.public.directus.url + '/assets/' + appSettings.header_logo + '?fit=inside&width=256'" alt="Logo"></img>
                </NuxtLink>
            </div>
            <div class="menu" v-if="user">
                <ul>
                    <li><button @click="onLogout">Logout</button></li>
                </ul>
            </div>
            <div class="user" v-if="user">
                <div>{{ customer.Customer_Name }}</div>
            </div>
            <div class="contact">
                <div v-html="appSettings.portal_contact_info"></div>
            </div>
        </div>
    </div>
</template>
<script setup>
const customer = ref(null);
//for image
const runtimeConfig = useRuntimeConfig();

//for app settings
const { data: appSettings } = await useAppSettings();

//for user and customer
const user = useDirectusUser();

watch(user, async (newUser) => {
    if (newUser?.id) {
        const { data: _customer } = await useCustomer(newUser.id);
        customer.value = _customer.value;
    } else {
        customer.value = null;
    }
}, { immediate: true });

//for logout
const { logout } = useDirectusAuth();
const onLogout = async () => {
    logout();
    navigateTo("/login");
};
</script>
