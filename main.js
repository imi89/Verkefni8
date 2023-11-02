// @ts-nocheck
import { createCartLine, showCartContent } from './lib/ui.js';

/**
 * @typedef {object} Product
 * @property {number} id Auðkenni vöru, jákvæð heiltala stærri en 0.
 * @property {string} title Titill vöru, ekki tómur strengur.
 * @property {string} description Lýsing á vöru, ekki tómur strengur.
 * @property {number} price Verð á vöru, jákvæð heiltala stærri en 0.
 */
const products = [
  {
    id: 1,
    title: 'HTML húfa',
    description:
      'Húfa sem heldur hausnum heitum og hvíslar hugsanlega að þér hvaða element væri best að nota.',
    price: 5_000,
  },
  {
    id: 2,
    title: 'CSS sokkar',
    description: 'Sokkar sem skalast vel með hvaða fótum sem er.',
    price: 3_000,
  },
  {
    id: 3,
    title: 'JavaScript jakki',
    description: 'Mjög töff jakki fyrir öll sem skrifa JavaScript reglulega.',
    price: 20_000,
  },
];


/** 
 * Bæta vöru í körfu 
* @param {Product} product
 * @param {number} quantity
 */

function updateTotal() {
  const cartTableBodyElement = document.querySelector('.cart table tbody');
  const cartRows = Array.from(cartTableBodyElement.querySelectorAll('tr'));
  let total = 0;

  for (const row of cartRows) {
    const quantity = Number(row.querySelector('.quantity').textContent);
    const price = Number(row.querySelector('.price').textContent.replace(' kr.-', '').replace('.', ''));
    total += quantity * price;
  }

  const totalElement = document.querySelector('.cart tfoot .price');
  totalElement.textContent = `${total.toLocaleString('is-IS')} kr.-`;
}

function showOrderForm() {
  const orderForm = document.querySelector('.order-form');
  orderForm.classList.remove('hidden');
}

function addProductToCart(product, quantity) {
  const cartTableBodyElement = document.querySelector('.cart table tbody');
  
  if (!cartTableBodyElement) {
    console.warn('fann ekki .cart table');
    return;
  }
  
  // Athuga hvort lína fyrir vöruna sé þegar til
  const existingProductRow = cartTableBodyElement.querySelector(`tr[data-cart-product-id="${product.id}"]`);
  
  if (existingProductRow) {
    // Uppfæra fjölda í körfu
    const quantityElement = existingProductRow.querySelector('.quantity');
    const currentQuantity = Number(quantityElement.textContent);
    const newQuantity = currentQuantity + quantity;
    quantityElement.textContent = newQuantity;

    // Uppfæra heildarverð vöru í körfu
    const totalElement = existingProductRow.querySelector('.total');
    totalElement.textContent = formatPrice(product.price * newQuantity);
  } else {
    const cartLine = createCartLine(product, quantity);
    cartTableBodyElement.appendChild(cartLine);
  }

  // Sýna efni körfu
  showCartContent(true);

  // Sýna/uppfæra samtölu körfu
  updateTotal();
}




function submitHandler(event) {
  // Komum í veg fyrir að form submiti
  event.preventDefault();
  
  // Finnum næsta element sem er `<tr>`
  const parent = event.target.closest('tr');

  // Það er með attribute sem tiltekur auðkenni vöru, t.d. `data-product-id="1"`
  const productId = Number.parseInt(parent.dataset.productId);

  // Finnum vöru með þessu productId
  const product = products.find((i) => i.id === productId);

  if (!product){
    return;
  }

  // Finna fjölda sem á að bæta vi ð körfu með því að athuga á input
  const inputElement = parent.querySelector('input[type="number"]');
  const quantity = inputElement ? Number(inputElement.value) : 1;

  // Bætum vöru í körfu (hér væri gott að bæta við athugun á því að varan sé til)
  addProductToCart(product, quantity);
}

// Finna öll form með class="add"
const addToCartForms = document.querySelectorAll('.add')

// Ítra í gegnum þau sem fylki (`querySelectorAll` skilar NodeList)
for (const form of Array.from(addToCartForms)) {
  // Bæta submit event listener við hvert
  form.addEventListener('submit', submitHandler);
}

// Bæta við event handler á form sem submittar pöntun
document.querySelector('section.cart form').addEventListener('submit', (e) => {
  e.preventDefault();

  // Hide cart section
  const cartSection = document.querySelector('section.cart');
  cartSection.style.display = 'none';

  // Show receipt section
  const receiptSection = document.querySelector('section.receipt');
  receiptSection.style.display = 'block';
});

document.querySelector('.order-form').addEventListener('submit', (e) => {
  e.preventDefault();

  // Hide cart and order form
  document.querySelector('section.cart').classList.add('hidden');
  
  // Show receipt
  document.querySelector('section.receipt').classList.remove('hidden');
});