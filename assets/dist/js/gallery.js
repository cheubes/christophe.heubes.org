var lightboxEl = document.getElementById('lightbox');
var lightboxModal = new bootstrap.Modal(lightboxEl);
var viewUrl = lightboxEl.dataset.viewUrl;
var openSlug = lightboxEl.dataset.openSlug;

var photos = [];
document.querySelectorAll('.gallery-thumb').forEach(function(thumb) {
  photos.push({
    src: thumb.dataset.src,
    caption: thumb.dataset.caption,
    slug: thumb.dataset.slug,
    url: thumb.getAttribute('href')
  });
});

var currentIndex = 0;

// Bootstrap silently ignores show()/hide() calls made while its own fade
// transition is still running, so a fast popstate right after opening the
// modal could otherwise leave the URL and the modal visibility out of sync.
var isTransitioning = false;
var pendingAction = null;

lightboxEl.addEventListener('show.bs.modal', function() { isTransitioning = true; });
lightboxEl.addEventListener('hide.bs.modal', function() { isTransitioning = true; });
lightboxEl.addEventListener('shown.bs.modal', function() { isTransitioning = false; runPendingAction(); });

lightboxEl.addEventListener('hidden.bs.modal', function() {
  isTransitioning = false;
  // A hide that's immediately followed by a queued re-show (fast back/forward
  // navigation) isn't really a "close": leave the URL on the photo being reopened.
  var reopening = pendingAction === 'show';
  runPendingAction();
  if (!reopening && window.location.pathname !== viewUrl) {
    history.pushState({}, '', viewUrl);
  }
});

function runPendingAction() {
  var action = pendingAction;
  pendingAction = null;
  if (action === 'show') { showModal(); }
  if (action === 'hide') { hideModal(); }
}

function showModal() {
  if (isTransitioning) { pendingAction = 'show'; return; }
  lightboxModal.show();
}

function hideModal() {
  if (isTransitioning) { pendingAction = 'hide'; return; }
  lightboxModal.hide();
}

function showPhoto(index) {
  document.getElementById('lightbox-img').src = photos[index].src;
  document.getElementById('lightbox-img').alt = photos[index].caption || '';
  document.getElementById('lightbox-caption').textContent = photos[index].caption || '';
  document.getElementById('lightbox-prev').style.visibility = index === 0 ? 'hidden' : 'visible';
  document.getElementById('lightbox-next').style.visibility = index === photos.length - 1 ? 'hidden' : 'visible';
}

function openPhoto(index, pushState) {
  currentIndex = index;
  showPhoto(currentIndex);
  showModal();
  if (pushState) {
    history.pushState({ lightbox: true }, '', photos[currentIndex].url);
  }
}

function navigateTo(index) {
  currentIndex = index;
  showPhoto(currentIndex);
  history.replaceState({ lightbox: true }, '', photos[currentIndex].url);
}

document.querySelectorAll('.gallery-thumb').forEach(function(thumb, index) {
  thumb.addEventListener('click', function(event) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    openPhoto(index, true);
  });
});

document.getElementById('lightbox-prev').addEventListener('click', function() {
  if (currentIndex > 0) { navigateTo(currentIndex - 1); }
});

document.getElementById('lightbox-next').addEventListener('click', function() {
  if (currentIndex < photos.length - 1) { navigateTo(currentIndex + 1); }
});

lightboxEl.addEventListener('keydown', function(e) {
  if (e.key === 'ArrowLeft' && currentIndex > 0) { navigateTo(currentIndex - 1); }
  if (e.key === 'ArrowRight' && currentIndex < photos.length - 1) { navigateTo(currentIndex + 1); }
});

window.addEventListener('popstate', function() {
  if (window.location.pathname === viewUrl) {
    hideModal();
    return;
  }
  var index = photos.findIndex(function(photo) {
    return window.location.pathname === photo.url;
  });
  if (index !== -1) { openPhoto(index, false); }
});

if (openSlug) {
  var initialIndex = photos.findIndex(function(photo) { return photo.slug === openSlug; });
  if (initialIndex !== -1) { openPhoto(initialIndex, false); }
}
