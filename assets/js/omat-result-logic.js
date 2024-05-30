const shareButton = document.querySelector('.share-button');

let blob;
fetch('/api/sharepic?answers=' + answers + '&weights=' + weights).then(response => response.blob()).then(data => {
    // if blob is error
    if(data.type.includes('text/html')) {
        blob = null;
        return;
    }

    blob = data;

    // remove disabled attribute
    shareButton.removeAttribute('disabled');
    
    // add onclick event
    shareButton.onclick = share;
});

/* async function share() {
    if(blob == null) {
        alert('Fehler beim Erstellen des Bildes.');
        return;
    }

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'omat.png';
    a.click();
} */
