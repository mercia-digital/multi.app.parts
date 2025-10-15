<template>
    <div class="header mb-8">
        <div class="top">
            <ul class="top-nav container">
                <li><NuxtLink to="https://www.multi-inc.com/service" target="_blank">Schedule Service</NuxtLink></li>
                <li><NuxtLink to="https://www.multi-inc.com/contact" target="_blank">Contact</NuxtLink></li>
            </ul>
        </div>
        <div class="mid container">
            <NuxtLink to="/">
                <img :src="runtimeConfig.public.directus.url + '/assets/' + appSettings.header_logo + '?fit=inside&width=256'" alt="Logo"></img>
            </NuxtLink>
            <button class="mobile-menu-toggle" @click="toggleMobileMenu">
                <svg v-if="!isMobileMenuOpen" xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 0 24 24" width="36px" fill="#304d6d"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 0 24 24" width="36px" fill="#dc602e"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
            </button>
        </div>
        <div class="bottom" :class="{ 'mobile-open': isMobileMenuOpen }">
            <div class="nav-main container">
                <div class="link">
                    <NuxtLink to="https://www.multi-inc.com/htm-professionals" target="_blank">HTM/ISO Professionals</NuxtLink>
                </div>
                <div class="link mega">
                    <span class="link-title cursor-default">Parts</span>
                    <div class="mega-menu">
                        <div class="content-wrapper">
                            <div class="content">
                                <span>Parts Home</span>
                                <p>We only offer parts sourced directly from the OEM through our contracted relationships - new, used, refurbished, or harvested.</p>
                            </div>
                            <div class="cta">
                                <NuxtLink to="/parts">Explore the Catalog</NuxtLink>
                            </div>
                        </div>
                        <div class="brands">
                            <span>By Brand</span>
                            <ul>
                                <li><NuxtLink to="/parts/manufacturer/ge-healthcare">GE HealthCare</NuxtLink></li>
                                <li><NuxtLink to="/parts/manufacturer/siemens-healthineers">Siemens Healthineers</NuxtLink></li>
                                <li><NuxtLink to="/parts/manufacturer/canon-medical-systems-usa">Canon Medical Systems USA</NuxtLink></li>
                                <li><NuxtLink to="/parts/manufacturer/philips-healthcare">Philips Healthcare</NuxtLink></li>
                                <li><NuxtLink to="/parts/manufacturer/carestream-health">Carestream Health</NuxtLink></li>
                                <li><NuxtLink to="/parts/manufacturer/fujifilm-medical-systems">Fujifilm Medical Systems</NuxtLink></li>
                                <li><NuxtLink to="/parts/manufacturer/agfa-healthcare">AGFA Healthcare</NuxtLink></li>
                                <li><NuxtLink to="/parts/manufacturer/konica-minolta">Konica Minolta</NuxtLink></li>
                                <li><NuxtLink to="/parts/manufacturer/nxt-power">NXT Power</NuxtLink></li>
                            </ul>
                        </div>
                        <div class="other">
                            <span>Other</span>
                            <ul>
                                <li><NuxtLink to="/parts/modality/batteries">Batteries</NuxtLink></li>
                                <li><NuxtLink to="/parts/modality/bulbs">Bulbs</NuxtLink></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="link">
                    <NuxtLink to="https://www.multi-inc.com/medical-equipment" target="_blank">Medical Equipment</NuxtLink>
                </div>
                <div class="link">
                    <NuxtLink to="https://www.multi-inc.com/surgical-equipment" target="_blank">Surgical Equipment</NuxtLink>
                </div>
                <div class="link">
                    <NuxtLink to="/parts/manufacturer/nxt-power">Power Quality Solutions</NuxtLink>
                </div>
                <div class="link">
                    <NuxtLink to="https://www.multi-inc.com/service" target="_blank">Schedule Service</NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';
const runtimeConfig = useRuntimeConfig();

const { data: appSettings } = await useAppSettings();

const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
};
</script>
<style scoped lang="less">
.header {
    .top {
        border-bottom: 1px solid rgba(204, 204, 204, 0.5);
        padding: 0.5rem 0;
        margin-bottom: 1rem;
        .top-nav {
            display: flex;
            justify-content: flex-end;
            gap: 2rem;
            padding: 0 1rem;
            li {
                a {
                    text-transform: uppercase;
                    color: #304d6d;
                    border-bottom: 2px solid transparent;
                    transition: all 0.3s ease;
                    &:hover {
                        border-bottom: 1px solid #304e6ebf;
                    }
                }
            }
        }
    }
    .mid {
        padding: 0 1rem;
        position: relative;
        a {
            display: inline-block;
        }
        img {
            @media (max-width: 768px) {
                max-width: 180px;
            }
        }
    }
    .mobile-menu-toggle {
        display: none;
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.5rem;
        @media (max-width: 1100px) {
            display: block;
            position: absolute;
            right: 1rem;
            top: 50%;
            transform: translateY(-50%);
        }
    }
    .bottom {
        padding: 1rem 0;
        margin-top: 1rem;
        background-color: #304d6d;   
        .nav-main {
            display: flex;
            gap: 2rem;
            justify-content: space-between;
            padding: 0 1rem;
            .link {
                &>a, &>span {
                    color: #fff;
                    font-size: 18px;
                    font-weight: 600;
                }
                &>a {
                    transition: all 0.3s ease;
                    &:hover {
                        opacity: 0.6;
                    }
                }
                &.mega {
                    position: relative;
                    &::before {
                        content: '';
                        position: absolute;
                        top: 50%;
                        left: 0;
                        width: 100%;
                        height: 200%;
                        transform: translateY(-50%);
                    }
                    .mega-menu {
                        position: absolute;
                        z-index: 2;
                        top: calc(100% + 1rem);
                        left: -180px;                        
                        width: 640px;
                        background-color: #f3f8fb;
                        padding: 1.5rem;                        
                        transition: all 0.3s ease;
                        color: #2275b5;
                        display: flex;
                        flex-direction: row;
                        gap: 1.5rem;
                        opacity: 0;
                        visibility: hidden;
                        span {
                            display: block;
                            text-transform: uppercase;
                            font-size: 16px;
                            font-weight: 700;
                            margin-bottom: 1rem;
                            color: #304d6d;
                        }
                        .content-wrapper {
                            display: flex;
                            flex-direction: column;
                            gap: 1rem;
                            justify-content: space-between;
                            .cta a {
                                display: block;
                                background-color: #dc602e;
                                color: #fff;
                                text-align: center;
                                padding: 0.5rem 1rem;
                                border-radius: 50px;
                                text-decoration: none;
                                font-size: 20px;
                                transition: all 0.3s ease;
                                &:hover {
                                    opacity: 0.6;
                                }
                            }
                        }
                        .brands, .other {
                            ul {
                                display: flex;
                                flex-direction: column;
                                gap: 5px;
                                li {
                                    a {
                                        color: #2275b5;
                                        transition: all 0.3s ease;
                                        border-bottom: 1px solid rgba(204, 204, 204, 0.5);
                                        white-space: nowrap;
                                        padding-bottom: 5px;
                                        &:hover {
                                            opacity: 0.6;
                                        }
                                    }
                                    &:last-of-type {
                                        a {
                                            border-bottom: none;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    &:hover {
                        .mega-menu {
                            opacity: 1;
                            visibility: visible;
                        }
                    }
                }
            }
        }
    }
    @media (max-width: 1100px) {
        .top {
            .top-nav {
                justify-content: center;
                li {
                    a {
                        font-size: 14px;
                    }
                }
            }
        }
        .mid {
            display: flex;
            justify-content: center;
        }
        .bottom {
            display: none;
            &.mobile-open {
                display: block;
            }
            background-color: transparent;   
            padding: 0 1rem;
            .nav-main {
                flex-direction: column;
                gap: 1rem;
                justify-content: flex-start;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                padding: 1rem;
                .link {
                    order: 1;
                    &>a, &>span {
                        color: #2275b5;
                    }
                    &.mega {
                        order: 2;
                        &::before {
                            /* Disable desktop hover extender on mobile to prevent overlay blocking clicks */
                            display: none;
                            content: none;
                        }
                        .mega-menu {
                            position: relative;
                            top: auto;
                            left: auto;                        
                            width: auto;
                            background-color: #fff;
                            flex-direction: column;
                            opacity: 1;
                            visibility: visible;
                            .content-wrapper {
                                display: none;
                                visibility: hidden;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
    

