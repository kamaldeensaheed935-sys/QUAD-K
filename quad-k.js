const cart = [];
const cartCount = document.querySelector('.cnt');
const toast = document.querySelector('.toast');
const contactNumber = '2348136446489';

function showToast(message) {
  toast.textContent = message;
  toast.style.display = 'block';
  window.setTimeout(() => { toast.style.display = 'none'; }, 2600);
}

document.querySelectorAll('.ad').forEach((button) => {
  button.addEventListener('click', () => {
    cart.push(button.dataset.product);
    cartCount.textContent = cart.length;
    showToast(`${button.dataset.product} added to your order.`);
  });
});

document.querySelector('.b').addEventListener('click', () => {
  if (!cart.length) return showToast('Your basket is empty.');
  const totals = { 'Golden Kitchen Oil': 1700, 'Family 5-Litre Bottle': 8500, 'Reseller 25-Litre Bottle': 50000 };
  const hasUnpricedItem = cart.some((product) => !totals[product]);
  const total = cart.reduce((sum, product) => sum + (totals[product] || 0), 0);
  const totalText = hasUnpricedItem ? 'Please confirm the prices for the items marked price on request' : `Total: ₦${total.toLocaleString()}`;
  const message = `Hello QUAD K, I want to order: ${cart.join(', ')}. ${totalText}. Please send me payment and delivery instructions.`;
  window.open(`https://wa.me/${contactNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
});

const treePhoto = document.querySelector('#tree-photo');
if (treePhoto) treePhoto.addEventListener('change', (event) => {
  const result = document.querySelector('.scan-result');
  if (!event.target.files.length) return;
  result.textContent = `Photo ready for review: ${event.target.files[0].name}. Share this image with a QUAD K grower or agricultural expert for a proper assessment.`;
  result.style.display = 'block';
});

document.querySelector('.copy-button').addEventListener('click', async () => {
  await navigator.clipboard.writeText('8136446489');
  showToast('Payment number copied.');
});

document.querySelector('.fm').addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const message = `Hello QUAD K, I want to join the business. Name: ${formData.get('name')}. Phone: ${formData.get('phone')}. Email: ${formData.get('email')}. Path: ${formData.get('path')}. Interest: ${formData.get('message')}`;
  window.open(`https://wa.me/${contactNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
  document.querySelector('.msg').style.display = 'block';
});
