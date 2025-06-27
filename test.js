fetch('test.php')
.then(res => res.json())
.then( notes => {
    console.log(notes)
    const ul= document.getElementById('notesList');
    ul.innerHTML='';
    notes.forEach(note => {
        const li = document.createElement('li');
        li.textContent = note.titre + ' : ' + note.contenu;

        const suppr = document.createElement('button');
        suppr.textContent = 'Supprimer';
        suppr.addEventListener('click', () => supprimerNote(note['id']) );

        const modif = document.createElement('button');
        modif.textContent = 'Modifier la note';
        modif.addEventListener('click', ()=>modifNote(note.id));
        li.appendChild(suppr);
        li.appendChild(modif);
        ul.appendChild(li);
    })
});
 function supprimerNote(id){
    fetch('test.php', {
        method : 'DELETE',
        headers: {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({id : id})
    })
    .then(res => res.json())
    .then(data => {
        console.log('reponse du serveur :', data);

    })
 }

 function modifNote(id) {
    document.getElementById('modifModal').style.display = 'block';
    document.getElementById('envoieModif').addEventListener('click', ()=>envoieModif(id));
 }
 function envoieModif(id){
    const newTitre = document.getElementById('modifTitre').value;
    const newContenu = document.getElementById('modifContenu').value;
    fetch('test.php', {
        method : 'PUT',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({id :id, titre : newTitre, contenu : newContenu})
    })
    .then(res => res.json)
    .then(data => {
        console.log(data);
    })
 }

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


