<template>
    <form @submit.prevent="onSubmit">
        <table>
            <tbody>
                <tr>
                    <td class="p-2">
                        <label for="email">Email</label>
                    </td>
                    <td class="p-2">
                        <UInput type="email" id="email" v-model="email" />
                    </td>
                </tr>
                <tr>
                    <td class="p-2">
                        <label for="password">Password</label>
                    </td>
                    <td class="p-2">
                        <UInput type="password" id="password" v-model="password" />
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="p-2">
            <div v-html="appSettings.nda_text" class="mb-8 terms"></div>
            <UCheckbox id="terms" v-model="terms" required label="I accept the terms"/>
        </div>
        <div class="p-2">
            <UAlert v-if="error" color="red" variant="soft" :title="error" class="mb-4" />
            <UButton type="submit" color="primary">Login</UButton>
        </div>
    </form>
</template>
<script setup>
const { login } = useDirectusAuth();
const { data: appSettings } = await useAppSettings();
const router = useRouter();
const email = ref("");
const password = ref("");
const terms = ref(false);
const error = ref("");

const onSubmit = async () => {
    error.value = "";
    
    if (!terms.value) {
        error.value = "You must accept the terms to continue.";
        return;
    }
    
    try {
        await login({ email: email.value, password: password.value });
        router.push("/");
    } catch (e) {
        console.error(e);
        error.value = "Login failed. Please check your credentials and try again.";
    }
};
</script>
<style lang="less" scoped>
.terms {
    margin-top: 25px;
    :deep(p:not(:last-child)) {
        margin-bottom: 25px;
    }
    :deep(h2) {
        margin-bottom: 10px;
        font-size: 1.25rem;
        font-weight: bold;
    }
}
</style>
    