var photos = [];
var currentIndex = 0;

document.querySelectorAll('.gallery-thumb').forEach(function(thumb, index) {
  photos.push({ src: thumb.dataset.src, caption: thumb.dataset.caption });
  thumb.addEventListener('click', function() {
    currentIndex = index;
    showPhoto(currentIndex);
    var modal = new bootstrap.Modal(document.getElementById('lightbox'));
    modal.show();
  });
});

function showPhoto(index) {
  document.getElementById('lightbox-img').src = photos[index].src;
  document.getElementById('lightbox-caption').textContent = photos[index].caption || '';
  document.getElementById('lightbox-prev').style.visibility = index === 0 ? 'hidden' : 'visible';
  document.getElementById('lightbox-next').style.visibility = index === photos.length - 1 ? 'hidden' : 'visible';
}

document.getElementById('lightbox-prev').addEventListener('click', function() {
  if (currentIndex > 0) { currentIndex--; showPhoto(currentIndex); }
});

document.getElementById('lightbox-next').addEventListener('click', function() {
  if (currentIndex < photos.length - 1) { currentIndex++; showPhoto(currentIndex); }
});

document.getElementById('lightbox').addEventListener('keydown', function(e) {
  if (e.key === 'ArrowLeft' && currentIndex > 0) { currentIndex--; showPhoto(currentIndex); }
  if (e.key === 'ArrowRight' && currentIndex < photos.length - 1) { currentIndex++; showPhoto(currentIndex); }
});
