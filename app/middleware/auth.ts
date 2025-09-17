export default defineNuxtRouteMiddleware(async (to, _from) => {
    const { fetchUser, setUser } = useDirectusAuth();
    const user = useDirectusUser();
    if (!user.value) {
        const fetchedUser = await fetchUser();
        setUser(fetchedUser.value);
    }
    if (!user.value) {
        return navigateTo("/login");
    }
});