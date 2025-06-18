const spanOpen = document.getElementById("date-span");
const itens = document.getElementById("itens");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const addressInput = document.getElementById("address");
const addressWarning = document.getElementById("address-warning");
const closeModalBtn = document.getElementById("close-modal-btn");
const checkoutBtn = document.getElementById("checkout-btn");
const cartBtn = document.getElementById("cart-btn");
const cartCounter = document.getElementById("cart-count");

let cart = [];

cartBtn.addEventListener("click", function() {
    cartModal.classList.remove("hidden");
    cartModal.classList.add("flex");
    updateCartModal();
})

cartModal.addEventListener("click", function(event) {
    if(event.target === cartModal || event.target === closeModalBtn) {
        cartModal.classList.remove("flex");
        cartModal.classList.add("hidden");
    }
})

itens.addEventListener("click", function(event) {
    let parentButton = event.target.closest(".add-to-cart-btn");
    if(parentButton) {
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));
        addToCart(name, price);
    }
})

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if(existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name,
            price,
            quantity: 1
        });
    }  

    updateCartModal();
}

function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");

        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between border-b border-b-zinc-200">
                <div>
                    <p class="font-medium">${item.name}</p>
                    <p class="font-medium mb-2">
                        <span class="font-bold">${item.quantity}</span> x R$ ${item.price.toFixed(2)}
                    </p>
                </div>

                <button class="bg-red-500 px-4 rounded remove-cart-btn" data-name="${item.name}">
                    <i class="far fa-trash-alt text-lg text-white"></i>
                </button>
            </div>      
        `;

        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement);
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;
}

cartItemsContainer.addEventListener("click", function(event) {
    let parentRemoveBtn = event.target.closest(".remove-cart-btn");
    if(parentRemoveBtn) {
        const name = parentRemoveBtn.getAttribute("data-name");
        removeItemCart(name);
    }
})

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1) {
        const item = cart[index];
        if(item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}

addressInput.addEventListener("input", function(event) {
    let inputValue = event.target.value;
    if(inputValue !== "") {
        addressInput.classList.remove("border-red-500");
        addressWarning.classList.add("hidden");
    } 
})

checkoutBtn.addEventListener("click", function() {
    const isOpen = checkOpen();
    if(!isOpen) {
        Toastify({
            text: "Ops... o estabelecimento está fechado!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
        }).showToast();

        return;
    }

    if(cart.length === 0) return;

    if(addressInput.value === "") {
        addressWarning.classList.remove("hidden");
        addressInput.classList.add("border-red-500");
        return;
    }

    const cartItems = cart.map((item) => {
        return (
            `${item.name} - Quantidade: (${item.quantity}) - Preço: R$ ${item.price.toFixed(2)}`
        )
    }).join("\n");

    const message = encodeURIComponent(cartItems);
    const totalOrder = encodeURIComponent(`\nTotal a Pagar: ${cartTotal.textContent}\n`);
    const contato = "vai rapido delivery";
    const deliveryAddress = encodeURIComponent(`Endereço: ${addressInput.value}`);

    window.open(`${contato}?text=${message}${totalOrder}${deliveryAddress}`, "_blank");

    cart = [];
    addressInput.value = "";
    updateCartModal();

})

const isOpen = checkOpen();
if(isOpen) {
    spanOpen.classList.remove("bg-red-500");
    spanOpen.innerHTML = '<span class="font-medium text-white">Seg à Dom - 18h às 22h</span>';
    spanOpen.classList.add("bg-green-600");
} else {
    spanOpen.classList.remove("bg-green-600");
    spanOpen.innerHTML = '<span class="font-medium text-white">FECHADO!</span>';
    spanOpen.classList.add("bg-red-500");
}

function checkOpen() {
    const date = new Date();
    const hour = date.getHours();
    return hour >= 24 && hour <= 22;
}