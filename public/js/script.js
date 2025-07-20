// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})();


let taxSwitch = document.getElementById("switchCheckDefault");

taxSwitch.addEventListener("click", () => {
    let prices = document.querySelectorAll(".price");

    prices.forEach((priceDiv) => {
        const originalPrice = parseFloat(priceDiv.dataset.price);
        const priceValueSpan = priceDiv.querySelector(".price-value");
        const taxInfo = priceDiv.querySelector(".tax-info");

        if (taxSwitch.checked) {
           
            const totalPrice = Math.round(originalPrice * 1.18);
            priceValueSpan.textContent = totalPrice.toLocaleString("en-IN");
             
             taxInfo.style.display = "inline";
        } else {
            
            priceValueSpan.textContent = originalPrice.toLocaleString("en-IN");
            
            taxInfo.style.display = "none";
        }
    });
});



const scrollContainer = document.querySelector('.filter-scroll');
const leftBtn = document.querySelector('.scroll-btn.left');
const rightBtn = document.querySelector('.scroll-btn.right');
const filters = document.querySelectorAll('.filter');


function updateScrollButtons() {
  const scrollLeft = scrollContainer.scrollLeft;
  const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;

 
  if (scrollLeft <= 0) {
    leftBtn.classList.add('hidden');
  } else {
    leftBtn.classList.remove('hidden');
  }

 
  if (scrollLeft >= maxScrollLeft - 1) { // -1 for rounding issues
    rightBtn.classList.add('hidden');
  } else {
    rightBtn.classList.remove('hidden');
  }
}


scrollContainer.addEventListener('scroll', updateScrollButtons);


leftBtn.addEventListener('click', () => {
  scrollContainer.scrollBy({ left: -200, behavior: 'smooth' });
});

rightBtn.addEventListener('click', () => {
  scrollContainer.scrollBy({ left: 200, behavior: 'smooth' });
});

// Filter click handlers
filters.forEach(filter => {
  filter.addEventListener('click', () => {
    
    filters.forEach(f => f.classList.remove('active'));
    
    filter.classList.add('active');
  });
});


updateScrollButtons();


window.addEventListener('resize', updateScrollButtons);


