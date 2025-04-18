import { DotLottie } from '@lottiefiles/dotlottie-web';

try {
    // Lottie анимации

    const dLoaders = document.querySelectorAll('.d-loader');
    dLoaders?.forEach((dLoader) => {
        new DotLottie({
            autoplay: true,
            loop: true,
            canvas: dLoader,
            src: 'https://lottie.host/b816b1ca-73aa-452d-b295-bf8cb9b3b3b1/fqUmFIbkpf.lottie'
        });
    });
} catch (e) {
    console.error('Ошибка загрузки Lottiefiles: ' + e);
}

// try {
// 	// Маска на все поля ввода телефона

// 	const phoneInputs = document.querySelectorAll("input[type=tel]");
// 	phoneInputs?.forEach((phoneInput) => {
// 		const maskOptions = {
// 			mask: "+{7} (000) 000-00-00",
// 		};
// 		IMask(phoneInput, maskOptions);
// 	});
// } catch (e) {
// 	console.error("Ошибка работы IMask: " + e);
// }

try {
    // Функционал модальных окон

    const modals = document.querySelectorAll('.d-modal');
    modals?.forEach((modal) => {
        modal.querySelector('.d-modal__close').addEventListener('click', (e) => {
            modal.classList.remove('modal--active');
        });
    });
} catch (e) {
    console.error('Ошибка работы модального окна: ' + e);
}

try {
    // Функционал сайдбара

    const sidebar = document.getElementById('sidebar');
    const sidebarToggles = document.querySelectorAll('[data-sidebar-toggle]');

    sidebarToggles?.forEach((sidebarToggle) => {
        sidebarToggle.addEventListener('click', (e) => {
            const sidebarIsFull = sidebar.classList.contains('sidebar--full');

            if (sidebarIsFull) {
                sidebar.classList.remove('sidebar--full');
            } else {
                sidebar.classList.add('sidebar--full');
            }
        });
    });
} catch (e) {
    console.error('Ошибка работы сайдбара: ' + e);
}

try {
    // Функционал каталога

    const catalogs = document.querySelectorAll('[data-catalog]');
    const catalogToggles = document.querySelectorAll('[data-catalog-toggle]');
    const catalogDesign = document.querySelector('[data-catalog-design]');

    catalogToggles?.forEach((catalogToggle) => {
        catalogToggle.addEventListener('click', (e) => {
            const catalogIsActive = Array.from(catalogs).reduce((result, catalog) => catalog.classList.contains('catalog--active') || result, false);
            const catalogDesignIsActive = catalogDesign.classList.contains('header__design--active');

            if (catalogIsActive) {
                catalogs.forEach((catalog) => catalog.classList.remove('catalog--active'));
            } else {
                catalogs.forEach((catalog) => catalog.classList.add('catalog--active'));
            }

            if (catalogDesignIsActive) {
                catalogDesign.classList.remove('header__design--active');
            } else {
                catalogDesign.classList.add('header__design--active');
            }
        });
    });

    window.addEventListener('click', (e) => {
        let isAvailable =
            Array.from(catalogs).reduce((result, catalog) => !catalog.contains(e.target) && result, true) &&
            Array.from(catalogToggles).reduce((result, toggle) => !toggle.contains(e.target) & result, true);

        if (isAvailable) {
            catalogs?.forEach((catalog) => catalog.classList.remove('catalog--active'));
            catalogDesign?.classList.remove('header__design--active');
        }
    });
} catch (e) {
    console.error('Ошибка работы каталога: ' + e);
}

try {
    // Функционал счетчика

    const counters = document.querySelectorAll('[data-counter]');

    counters?.forEach((counter) => {
        const decreaseButton = counter.querySelector("[data-counter-button='decrement']");
        const increaseButton = counter.querySelector("[data-counter-button='increment']");
        const input = counter.querySelector('[data-counter-input]');

        decreaseButton.addEventListener('click', () => {
            if (input.value > 1) {
                input.value--;
            }
        });

        increaseButton.addEventListener('click', () => {
            input.value++;
        });
    });
} catch (e) {
    console.error('Ошибка работы счетчика: ' + e);
}

try {
    // Липкая шапка на странице акции

    const promotionsInfo = document.querySelector('.promotions__info');
    const header = document.querySelector('.header');
    const main = document.querySelector('.main');

    if (main) {
        main.addEventListener('scroll', (e) => {
            const promotionsInfoTop = Math.floor(promotionsInfo.getClientRects()[0].top);
            const headerHeight = Math.floor(header.getClientRects()[0].height);

            if (promotionsInfoTop === headerHeight) {
                promotionsInfo.classList.add('promotions__info--sticky');
            } else {
                promotionsInfo.classList.remove('promotions__info--sticky');
            }
        });
    }
} catch (e) {
    console.error('Ошибка обработки липкого хедера: ' + e);
}

try {
    // Функционал модалок

    const modals = document.querySelectorAll('[data-modal2]');
    modals.forEach((modal) => {
        const closeButtons = modal.querySelectorAll('[data-modal2-close]');
        closeButtons.forEach((close) => {
            close.addEventListener('click', () => modal.classList.remove('show-modal'));
        });
    });
} catch (e) {
    console.error('Ошибка работы модалки2: ' + e);
}
