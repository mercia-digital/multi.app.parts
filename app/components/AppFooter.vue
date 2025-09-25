<template>
    <div class="footer mt-8">
        <div class="top container">
            <div class="column full">
                <img src="https://www.multi-inc.com/hubfs/footer-logo.png" alt="Logo" loading="lazy">
            </div>
            <div class="column">
                <h3>Connect With Us</h3>
                <p><a href="https://www.linkedin.com/company/multi-diagnostic-imaging-surgical-solutions/" target="_blank"><img src="https://www.multi-inc.com/hubfs/linkedin_ico.svg" alt="LinkedIn" width="32" loading="lazy" style="width:32px;"></a></p>
            </div>
            <div class="column">
                <h3>Contact Us</h3>
                <p>990 E. Cedar Street</p>
                <p>Ontario, Calif 91761</p>
                <p class="mt-4">Toll-Free: <a href="tel:8004004549">(800) 400-4549</a></p>
                <p>Local: <a href="tel:9095916444">(909) 591-6444</a></p>
                <p>Fax: 909-591-5293</p>
                <p class="mt-4"><a href="mailto:sales@multi-inc.com">sales@multi-inc.com</a></p>
            </div>
            <div class="column">
                <h3>About</h3>
                <p>MULTI, INC. exists to provide access to authentic parts, service and technology through our OEM allegiant relationships.</p>
                <div class="cta">
                    <NuxtLink to="/parts">Explore the Catalog</NuxtLink>
                </div>
            </div>
            <div class="column">
                <h3>Quick Links</h3>
                <ul>
                    <li><NuxtLink to="https://www.multi-inc.com/htm-professionals" target="_blank">HTM/ISO Professionals</NuxtLink></li>
                    <li><NuxtLink to="/parts">Parts</NuxtLink></li>
                    <li><NuxtLink to="/sitemap">Sitemap</NuxtLink></li>
                    <li><NuxtLink to="https://www.multi-inc.com/medical-equipment" target="_blank">Medical Equipment</NuxtLink></li>
                    <li><NuxtLink to="https://www.multi-inc.com/surgical-equipment" target="_blank">Surgical Equipment</NuxtLink></li>
                    <li><NuxtLink to="https://www.multi-inc.com/service" target="_blank">Schedule Service</NuxtLink></li>
                </ul>
            </div>
        </div>
        <div class="bottom">
            <div class="copyright">
                <p>Copyright &copy; {{ new Date().getFullYear() }}. All rights reserved. Parts Catalog by <a href="https://mercia.digital/" target="_blank">Mercia Digital LLC</a></p>
            </div>
        </div>
    </div>
</template>
<script setup>
const runtimeConfig = useRuntimeConfig();
const { data: appSettings } = await useAppSettings();
</script>
<style scoped lang="less">
.footer {
    background-color: #2275b5;
    .top {       
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        @media (max-width: 768px) {
            gap: 4rem;
            grid-template-columns: repeat(2, 1fr);
        }
        @media (max-width: 580px) {
            gap: 2rem;
            grid-template-columns: repeat(1, 1fr);
        }
        color: #fff;
        gap: 2rem;
        padding: 4rem 1rem;
        .column {
            flex: 1;
        }
        .full {
            grid-column-start: 1;
            grid-column-end: -1;
            padding-bottom: 2rem;
            img {
                width: 180px;
            }
        }
        h3 {
            text-transform: uppercase;
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 1rem;
        }
        a {
            color: #fff;
            text-decoration: none;
            transition: all 0.3s ease;
            &:hover {
                opacity: 0.6;
            }
        }
        ul {
            display: flex;
            flex-direction: column;
            gap: .5rem;
            li {
                a {
                    border-bottom: 2px solid rgba(255, 255, 255, 0.25);
                    padding-bottom: .5rem;
                }
                &:last-of-type a {
                    border-bottom: none;
                }
            }
        }
        .cta {
            margin-top: 2rem;
            a {
                display: block;
                background-color: transparent;
                border: 2px solid #fff;
                color: #fff;
                text-align: center;
                padding: 0.5rem 1rem;
                border-radius: 50px;
                text-decoration: none;
                font-size: 18px;
                transition: all 0.3s ease;
                &:hover {
                    opacity: 1;
                    background-color: #dc602e;
                    border-color: #dc602e;
                }
            }
        }
    }
    .bottom {
        padding: 1rem 0;
        background-color: #304d6d;
        color: #fff;
        .copyright {
            text-align: center;
            p {
                a {
                    color: #fff;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    &:hover {
                        opacity: 0.6;
                    }
                }
            }
        }
    }
}
</style>
