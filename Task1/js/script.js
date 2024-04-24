window.addEventListener('DOMContentLoaded', () => {
    // Products behavior

    const setCards = function (data) {
        data.forEach(({name, price, imgPath, imgAlt, id}) => {
            const element = document.createElement('div');

            element.innerHTML = `
                <img src="${imgPath}" alt="${imgAlt}" class="main__card-img">

                <a href="#" class="main__card-name">${name}</a>

                <div class="main__card-buy">
                    <button class="main__card-button">Add to Cart</button>
                    <p class="main__card-price">$${price}</p>
                </div>
            `;

            element.classList.add('main__card');
            element.setAttribute('data-id', id);

            document.querySelector('.main__cards-wrapper').append(element);
        });
    };

    const smthGoWrong = function () {
        const element = document.createElement('div');

        element.innerHTML = '<p> Sorry, but smth went wrong( </p>';
        element.classList.add('main__wrong-text');

        document.querySelector('.main__container').append(element);
    };

    axios.get('http://localhost:3000/products')
        .then(data => setCards(data.data))
        .catch(() => smthGoWrong());

    // Cart

    // Cart modal dialog 

    const modal = document.querySelector('.modal'),
          cartEntry = document.querySelector('.header__cart'),
          total = modal.querySelector('.modal__cart-total span');

    const toggleModal = function () {
        modal.classList.toggle('show');
        document.body.style.overflow = (modal.classList.contains('show')) ? 'hidden' : '';
    };

    cartEntry.addEventListener('click', () => toggleModal());

    modal.addEventListener('click', event => {
        if (event.target === modal || event.target.getAttribute('data-close-modal') == '') {
            toggleModal();
        }
    });

    document.addEventListener('keydown', key => {
        if (key.code == 'Escape' && modal.classList.contains('show')) {
            toggleModal();
        }
    });

    // Start website cart update

    if (!localStorage.cart) {
        localStorage.cart = '[0, 0]';
    }

    const cartCounter = document.querySelector('.header__cart-counter'),
          cart = JSON.parse(localStorage.cart);

    cartCounter.innerHTML = cart[0];

    cart.forEach((item, index) => {
        if (index > 1) {
            addToCartHTML(item);
        }
    });

    // Cart logic

    const modalContent = modal.querySelector('.modal__content'),
          productsWrapper = modalContent.querySelector('.modal__products-wrapper'),
          clearButton = modalContent.querySelector('.modal__cart-clear');

    document.querySelector('.main__cards-wrapper').addEventListener('click', event => {
        if (event.target.classList.contains('main__card-button')) {
            addToCart(event.target.parentElement.parentElement);
        }
    });

    modalContent.addEventListener('click', event => {
        let product = event.target.parentElement;

        if (product.classList.contains('modal__product') || product.classList.contains('modal__product-count')) {
            if (product.classList.contains('modal__product-count')){
                product = product.parentElement;
            }

            product = {
                imgPath: product.querySelector('.modal__product-img img').src,
                imgAlt: product.querySelector('.modal__product-img img').alt,
                name: product.querySelector('.modal__product-name').innerHTML,
                price: +product.querySelector('.modal__product-price').innerHTML.slice(1),
                amount: +product.querySelector('.modal__product-count-value').innerHTML,
                id: +product.getAttribute('data-id')
            };
        }

        if (event.target === clearButton) {
            productsWrapper.innerHTML = '';
            localStorage.cart = '[0, 0]';

            cartCounter.innerHTML = 0;
            total.innerHTML = 0;
        }
        else if (event.target.classList.contains('modal__product-count-arrow')) {
            if (product.amount > 1 || event.target.classList.contains('up')) {
                updateCart(product, (event.target.classList.contains('up')) ? 1 : -1);
            }
        }
        else if (event.target.classList.contains('modal__product-clear')) {
            event.target.parentElement.remove();

            let cart = JSON.parse(localStorage.cart);
            cart.splice(cart.indexOf(cart.find(item => item.id == product.id)), 1);

            cart[0] = +cart[0] - product.amount;
            cartCounter.innerHTML = cart[0];

            cart[1] = +cart[1] - product.price * product.amount;
            total.innerHTML = cart[1];

            localStorage.cart = JSON.stringify(cart);
        }
    });

    function updateCart(product, direction) {
        const cart = JSON.parse(localStorage.cart),
              curentProduct = modal.querySelector(`.modal__product[data-id="${product.id}"]`),
              productCounter = curentProduct.querySelector('.modal__product-count-value'),
              index = cart.indexOf(cart.find(item => item.id == product.id));

        cart[0] += direction;
        cartCounter.innerHTML = cart[0];

        cart[1] = +cart[1] + direction * product.price;
        total.innerHTML = +cart[1];

        cart[index].amount += direction;
        productCounter.innerHTML = cart[index].amount;

        localStorage.cart = JSON.stringify(cart);
    }

    function addToCartHTML(product) {
        const wrapper = modal.querySelector('.modal__products-wrapper'), 
              element = document.createElement('div'); 

        element.innerHTML = ` 
            <div class="modal__product-img">
                <img src="${product.imgPath}" alt="${product.imgAlt}">
            </div> 
            <div class="modal__product-info"> 
                <p class="modal__product-name">${product.name}</p> 
                <p class="modal__product-price">$${product.price}</p> 
            </div> 
            <div class="modal__product-count"> 
                <img src="resources/images/cart/arrow.svg" alt="arrow Up" class="modal__product-count-arrow up"> 
                <span class="modal__product-count-value">${product.amount}</span> 
                <img src="resources/images/cart/arrow.svg" alt="arrow Down" class="modal__product-count-arrow down"> 
            </div> 
            <img src="resources/images/cart/trash.svg" alt="trash" class="modal__product-clear"> 
        `; 

        element.classList.add('modal__product'); 
        element.setAttribute('data-id', product.id);

        wrapper.append(element); 
    }

    function addToCart(product) {
        const img = product.querySelector('.main__card-img'),
              name = product.querySelector('.main__card-name').innerHTML, 
              price = +product.querySelector('.main__card-price').innerHTML.slice(1),
              id = +product.getAttribute('data-id'),
              cart = JSON.parse(localStorage.cart);

        let curentProduct = {
            imgPath: img.src,
            imgAlt: img.alt,
            name: name,
            price: price,
            amount: product.amount || 0,
            id: id
        };

        if (!cart.find(item => item.id == id)) {
            cart.push(curentProduct);

            addToCartHTML(curentProduct);
        }

        localStorage.cart = JSON.stringify(cart);

        updateCart(curentProduct, 1);
    }

    // Sort products

    const buttons = document.querySelector('.main__sort-wrapper');

    function sort(byWhat, target) {
        document.querySelector('.main__cards-wrapper').innerHTML = '';

        axios.get('http://localhost:3000/products')
        .then(data => {
            data = data.data;

            if (target.dataset.direction == '') {
                data.sort((a, b) => a[byWhat] > b[byWhat] ? -1 : 1);
                
                target.innerHTML += ' ↓';
                target.dataset.direction = 'down';
            } else {

                target.innerHTML += (target.dataset.direction == 'down') ? ' ↑' : ' ↓';
                target.dataset.direction = (target.dataset.direction == 'down') ? 'up' : 'down';
                
                data.sort((a, b) => a[byWhat] > b[byWhat] ? 1 : -1);
                
                if (target.dataset.direction == 'down') {
                    data.reverse();
                }
            }

            setCards(data);
        })
        .catch(() => smthGoWrong());
    }

    buttons.addEventListener('click', event => {
        if (event.target.classList.contains('main__sort-by-name')) {
            buttons.querySelector('.main__sort-by-price').innerHTML = 'Sort by Price';
            event.target.innerHTML = 'Sort by Product Name';

            sort('name', event.target);
        }
        else if (event.target.classList.contains('main__sort-by-price')) {
            buttons.querySelector('.main__sort-by-name').innerHTML = 'Sort by Product Name';
            event.target.innerHTML = 'Sort by Price';

            sort('price', event.target);
        }
    });
});