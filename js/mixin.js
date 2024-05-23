$(document).ready(function(){
    $('.item-card').hover(
      function() {
        // Al pasar el ratón sobre un elemento .item-card, añade la clase 'blur' a todos los demás
        $('.item-card').not(this).addClass('blur');
      },
      function() {
        // Al mover el ratón fuera de un elemento .item-card, quita la clase 'blur' de todos los demás
        $('.item-card').not(this).removeClass('blur');
      }
    );
  });

let texto = 'Hola!';
let indice = 0;
let elemento = document.getElementById('typed-text');

function escribirTexto() {
    if (indice < texto.length) {
        elemento.innerHTML += texto.charAt(indice);
        indice++;
        setTimeout(escribirTexto, 300); // Ajusta la velocidad de tecleo cambiando el valor de timeout
    }
}
  
window.onload = escribirTexto;

$(document).ready(function(){
    $('.item-card').click(function() {
      window.location.href = $(this).data('href');
    });
  });
