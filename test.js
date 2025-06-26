fetch('test.php')
.then(res => res.json())
.then( notes => {
    console.log(notes);
    const ul= document.getElementById('notesList');
    ul.innerHTML='';
    notes.forEach(note => {
        const li = document.createElement('li');
        li.textContent = note.titre + ' : ' + note.contenu;
        ul.appendChild(li);
    })
});

document.getElementById('ajoutBtn').addEventListener('click', ajoutNote);
function ajoutNote(e) {
    // Si tu appelles cette fonction depuis un bouton de formulaire, préviens la soumission
    if (e) e.preventDefault();

    const noteTitre = document.getElementById('titreText').value.trim();
    const noteContenu = document.getElementById('contenuText').value.trim();

    if (noteTitre !== '' && noteContenu !== '') {
        fetch('test.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ titre: noteTitre, contenu: noteContenu })
        })
        .then(res => res.text()) // ou res.json() si ton PHP retourne un JSON
        .then(data => {
            console.log('Réponse serveur :', data);
            // Optionnel : réinitialiser les champs
            document.getElementById('titreText').value = '';
            document.getElementById('contenuText').value = '';
            // Optionnel : recharger les notes
            // loadNotes(); // si tu as une fonction pour ça
        })
        .catch(err => {
            console.error('Erreur fetch :', err);
        });
    } else {
        console.warn('Champs vides, ajout annulé');
    }
}

