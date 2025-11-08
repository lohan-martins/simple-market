const INCREASE = "increase";
const DECREASE = "decrease";

const containerProducts = document.querySelector(".js-products");
const containerShoppingCart = document.querySelector(".js-items");
const totalValueElem = document.querySelector(".js-value");

const marketProducts = {
  Apple: { name: "Maçã", price: 4.5, src: "./images/apple.png" },
  Banana: { name: "Banana", price: 3.2, src: "./images/banana.png" },
  beans: { name: "Feijão", price: 8.0, src: "./images/beans.png" },
  beer: { name: "Cerveja", price: 6.5, src: "./images/beer.png" },
  cauliflower: { name: "Couve-Flor", price: 5.0, src: "./images/cauliflower.png" },
  "coffee-cup": { name: "Xícara de café", price: 7.0, src: "./images/coffee-cup.png" },
  grapes: { name: "Uvas", price: 6.5, src: "./images/grapes.png" },
  lemon: { name: "Limão", price: 1.5, src: "./images/lemon.png" },
  mango: { name: "Manga", price: 4.0, src: "./images/mango.png" },
  meat: { name: "Carne", price: 25.0, src: "./images/meat.png" },
  milk: { name: "Leite", price: 5.5, src: "./images/milk.png" },
  orange: { name: "Laranja", price: 3.0, src: "./images/orange.png" },
  pasta: { name: "Massa", price: 4.5, src: "./images/pasta.png" },
  pear: { name: "Pera", price: 5.0, src: "./images/pear.png" },
  rice: { name: "Arroz", price: 6.0, src: "./images/rice.png" },
  "soft-drink": { name: "Refrigerante", price: 6.0, src: "./images/soft-drink.png" },
  strawberry: { name: "Morango", price: 7.5, src: "./images/strawberry.png" },
  sugar: { name: "Açúcar", price: 4.0, src: "./images/sugar.png" },
  water: { name: "Água", price: 2.0, src: "./images/water.png" },
  wine: { name: "Vinho", price: 40.0, src: "./images/wine.png" },
};

const shoppingCart = new Map();

let totalValue = 0;

function attachShoppingCartEvent(productElem, price) {
  const { productName } = productElem.dataset;
  productElem.addEventListener("click", () => addItemToShoppingCart(productName, price));
}

function createProduct({ name, price, src }) {
  const container = document.createElement("div");
  container.classList.add("product");
  container.dataset.productName = name;

  const containerImg = document.createElement("div");
  containerImg.classList.add("product-img");

  const img = document.createElement("img");
  img.alt = name;
  img.title = name;
  img.src = src;

  const priceTag = document.createElement("span");
  priceTag.textContent = formatCurrency(price);

  containerImg.appendChild(img);
  container.appendChild(containerImg);
  container.appendChild(priceTag);

  attachShoppingCartEvent(container, price);

  return container;
}

function renderAllProducts(container, products) {
  const fragment = document.createDocumentFragment();

  Object.values(products).forEach((product) => {
    const productElem = createProduct(product);
    fragment.appendChild(productElem);
  });

  container.appendChild(fragment);
}

renderAllProducts(containerProducts, marketProducts);

function addItemToShoppingCart(productName, price) {
  let item;

  if (shoppingCart.has(productName)) {
    item = shoppingCart.get(productName);
    processQuantityUpdate(productName, item, INCREASE);
  } else {
    const { itemElem, quantityElem } = createItemShoppingCart(productName);
    item = { itemElem, quantityElem, quantity: 1, price };

    setCartItem(productName, item);
    addItemToCartDisplay(itemElem);
  }
  processTotalValueUpdate(item, INCREASE);
}

function processQuantityUpdate(name, item, operation) {
  const newQuantity = changeQuantityByOne(operation, item.quantity);
  const updatedItem = { ...item, quantity: newQuantity };

  updateQuantityDisplay(item, newQuantity);
  setCartItem(name, updatedItem);
}

function changeQuantityByOne(operation, quantity) {
  if (operation === "increase") return quantity + 1;
  if (operation === "decrease") return quantity - 1;
  return quantity; // segurança, caso a operação seja inválida
}

function updateQuantityDisplay(item, quantity) {
  const { quantityElem } = item;
  quantityElem.textContent = `${quantity}x`;
}

function setCartItem(name, item) {
  shoppingCart.set(name, item);
}

function createItemShoppingCart(productName) {
  const itemElem = document.createElement("div");
  itemElem.classList.add("item");
  itemElem.dataset.itemName = productName;

  const quantityElem = document.createElement("span");
  quantityElem.classList.add("item-quantity");
  quantityElem.textContent = "1x";

  const nameElem = document.createElement("span");
  nameElem.textContent = productName;

  const removeBtn = document.createElement("button");
  removeBtn.classList.add("btn-remove-item");
  removeBtn.addEventListener("click", () => handleClickRemoveBtn(productName));

  itemElem.append(quantityElem, nameElem, removeBtn);

  return { itemElem, quantityElem };
}

function handleClickRemoveBtn(productName) {
  const item = shoppingCart.get(productName);

  if (item.quantity > 1) {
    decreaseProduct(productName, item);
  } else {
    removeItem(productName, item);
  }
}

function decreaseProduct(productName, item) {
  processQuantityUpdate(productName, item, DECREASE);
  processTotalValueUpdate(item, DECREASE);
}

function removeItem(productName, item) {
  const { itemElem } = item;

  processTotalValueUpdate(item, DECREASE);

  itemElem.remove();
  shoppingCart.delete(productName);
}

function processTotalValueUpdate(item, operation) {
  const total = calculateTotalValue(operation, item.price);

  setTotalValue(total);
  updateTotalValueDisplay(total);
}

function addItemToCartDisplay(itemElem) {
  containerShoppingCart.appendChild(itemElem);
}

function calculateTotalValue(operation, value) {
  const total = getTotalValue();
  const amount = Number(value);

  if (operation === "increase") return total + amount;
  if (operation === "decrease") return Math.max(0, total - amount);

  return total;
}

function getTotalValue() {
  return totalValue;
}

function setTotalValue(value) {
  totalValue = value;
}

function updateTotalValueDisplay(value) {
  if (!totalValueElem) return;
  totalValueElem.textContent = formatCurrency(value);
}

function formatCurrency(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}



