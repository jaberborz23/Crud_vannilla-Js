

(()=> {
   //  IIFE
   //   selector
const filterInputElm = document.querySelector('#filter')
const  nameInputElm = document.querySelector('.nameInput')
const  priceInputElm = document.querySelector('.priceInput')
const msgElm = document.querySelector('.msg')
const collectionElm = document.querySelector('.collection')
const form = document.querySelector('form')
const submitBtnElm = document.querySelector('.submit-btn button')

//  data store( memory)
let products = localStorage.getItem('storeProducts') ? JSON.parse(localStorage.getItem('storeProducts')) : []

function receiveInputs() {
    const name = nameInputElm.value
   const price = priceInputElm.value
   return { name , price}
}

function clearMsg() {
   msgElm.textContent = ''
}
function showMsg(msgInput, action= "success") {
  const msg = `<div class="alert alert-${action}" role="alert">
  ${msgInput}
  </div>`
  msgElm.insertAdjacentHTML('afterbegin',msg)
  setTimeout(() => {
   clearMsg()
  },2000)
}

function validateInputs(name, price) {
  let isvalid = true
  //    check input is empty
  if (name === '' || price === '') {
     isvalid = false
     showMsg('Please provide necessary info',"danger")
  }
  if (Number(price) !== Number(price)) {
     isvalid = false
     showMsg('Please provide price in number' , "danger")
  }
  return isvalid
}
function resetInput() {
  nameInputElm.value = ''
  priceInputElm.value = ''
}
function addProduct(name,price) {
 
  const product = {
     id:products.length + 1,
        name,
     price
  }
  // memory data store
  products.push(product)
  return product
}
function showProductToUI(productInfo) {
  const notfoundMsgElm = document.querySelector('.not-found-product')
  if (notfoundMsgElm) {
     notfoundMsgElm.remove()
  }
  const { id , name , price} = productInfo
  const elm = `
    <li
           class="list-group-item collection-item d-flex flex-row justify-content-between"
           data-productId= "${id}"
         >
           <div class="product-info">
             <strong>${name}</strong>- <span class="price">$${price}</span>
           </div>
           <div class="action-btn">
             <i class="fa fa-pencil-alt edit-product float-right me-2"></i>
             <i class="fa fa-trash-alt delete-product float-right"></i>
           </div>
         </li>
  `
  collectionElm.insertAdjacentHTML('afterbegin', elm)
  showMsg(" Product added sucessfully")
  }
function addProducttoStorage(product) {
  
  let products
  if (localStorage.getItem('storeProducts')) {
     products = JSON.parse(localStorage.getItem('storeProducts'))
     // update and add the existing data
     products.push(product)
     
  } else {
      products = []
     products.push(product)
     localStorage.setItem('storeProducts',JSON.stringify(products))
  }
// save to localstorage
localStorage.setItem('storeProducts',JSON.stringify(products))
}

function updateProduct(receivedProduct , storageProducts = products ) {
  const updatedProducts = storageProducts.map((product) => {
     if (product.id === receivedProduct.id) {
        return {
           ...product,
           name: receivedProduct.name,
           price:receivedProduct.price,
           
        }
     } else {
        return product
      }
  })
  
  return updatedProducts
  
  
}
function clearEditForm() {
    submitBtnElm.classList.remove("update-btn")
  submitBtnElm.classList.remove("btn-secondary")
  submitBtnElm.textContent = 'Submit'
  submitBtnElm.removeAttribute('[data-id]')
}
function updateProductToStorage(product) {
  //   long way
  // find existing product from localstorage
  let products
   products = JSON.parse(localStorage.getItem('storeProducts'))
  // update product with new product
 products = updateProduct(product,products)
  // save back to localstorage
  localStorage.setItem('storeProducts',JSON.stringify(products))
  // alternative way
  // localStorage.setItem('storeProducts',JSON.stringify(products))
 }


function handleFormSubmit(evt) {
   evt.preventDefault();
   receiveInputs()

  const { name, price } = receiveInputs()
  const isValid = validateInputs(name, price)
  if (!isValid) return
  // reset the input
  resetInput()
  if (submitBtnElm.classList.contains('update-product')) {
   
     // user want to update the product
     const id = Number(submitBtnElm.dataset.id)
     // Update data to memory store
     const product = {
        id,
        name,
        price,
     }
     const updatedProducts = updateProduct(product)
     // memory store
     products = updatedProducts
     // Localstorage
     updateProductToStorage(product)
     // Dom Update
     showAllProductsToUI(products)
     // clear edit state
     clearEditForm()
     
  } else {
     //  add product to the data store
  const product = addProduct(name, price)
  // add data to the Local storage
    addProducttoStorage(product)
  // add product info to the ui
  showProductToUI(product)
  }
  // //  add product to the data store
  // const product = addProduct(name, price)
  // // add data to the Local storage
  //   addProducttoStorage(product)
  // // add product info to the ui
  // showProductToUI(product)
}
function getProductID(evt) {
  const liElm = evt.target.parentElement.parentElement
  const id = Number(liElm.getAttribute('data-productId'))
  return id
}
function removeItem(id) {
 products = products.filter((product) => product.id !== id)
}
 
function removeItemFromUI(id) {
  document.querySelector(`[data-productID = "${id}"]`).remove()
  showMsg("Product deleted successfully",'warning')
}
function removeProductFromStorage(id){
  let products;
  products = JSON.parse(localStorage.getItem('storeProducts'))
 products = products.filter(product => product.id !== id)
  localStorage.setItem('storeProducts', JSON.stringify(products))
}

function findProduct(id) {
  const foundProduct = products.find((product )=> product.id === id)
  return foundProduct
}
function populateEditForm(product) {
  nameInputElm.value = product.name
  priceInputElm.value = product.price
  // change btn submit
  submitBtnElm.textContent = 'Update Product'
  submitBtnElm.classList.add('btn-secondary')
  submitBtnElm.classList.add('update-product')
  submitBtnElm.setAttribute('data-id', product.id);  // Set the product ID
}
function handleManipulateProduct(evt) {
  //  get the product id
     const id = getProductID(evt)
  if (evt.target.classList.contains('delete-product')) {
     // remove product
     removeItem(id)
     // remove item from localstorage
     removeProductFromStorage(id)
     // remove product from UI
     removeItemFromUI(id)
  } else if (evt.target.classList.contains('edit-product')){
     // finding the product
    const foundProduct = findProduct(id)
     console.log(foundProduct)
     // populating existing form in edit-state
     populateEditForm(foundProduct)
     // update existing product
}
}
function showAllProductsToUI(products) {
  // clear existing content from  collectionElm/ul
  collectionElm.textContent = ''
  //  looping
   let liElms
   liElms = products.length === 0 ? '<li class="list-group-item collection-item not-found-product"> No products to show </li>' : ''
  //  sorting product descending
  const sortedProducts = products.sort((a, b) => b.id - a.id)
  products.forEach(product => {
     const  { id,name,price } = product
 liElms +=     `<li
           class="list-group-item collection-item d-flex flex-row justify-content-between"
           data-productId= "${id}">
           <div class="product-info">
             <strong>${name}</strong>- <span class="price">$${price}</span>
           </div>
           <div class="action-btn">
             <i class="fa fa-pencil-alt edit-product float-right me-2"></i>
             <i class="fa fa-trash-alt delete-product float-right"></i>
           </div>
         </li>
  `
  })
  collectionElm.insertAdjacentHTML('afterbegin',liElms)
}
function handleFilter(evt) {
  const text = evt.target.value
  
  // filter the text
 const filteredProducts = products.filter((product) => product.name.includes(text.toLowerCase()))
 console.log('Trigger', evt.target.value)
  showAllProductsToUI(filteredProducts)
 }
function init() {
  form.addEventListener('submit', handleFormSubmit)
  collectionElm.addEventListener('click',
     handleManipulateProduct
  )
  filterInputElm.addEventListener('keyup',handleFilter)
  
  document.addEventListener('DOMContentLoaded',()=> showAllProductsToUI(products))
  
  
  }


init()
















 })()







