import {supabase} from './config.js';

document.addEventListener('DOMContentLoaded', async function(){

    const idUser = localStorage.getItem("idUser");    

    if(!idUser)
    {
        window.location.href = "creationCompte.html";
    }
    else
    {
        // On encapsule tout dans une fonction principale pour pouvoir la recharger facilement
        async function chargerEtAfficherTout()
        {
            const {data:examen, error:errExamen} = await supabase.from('examen').select('*').eq('id_user', idUser);
            const {data:task, error:errTask} = await supabase.from('task').select('*').eq('id_user', idUser);

            if(errExamen || errTask)
            {
                console.error("Problème d'importation : ", errExamen || errTask);
                return;
            }

            const arrayExamen = examen || [];
            const arrayTask = task || [];
            
            const urlParams = new URLSearchParams(window.location.search);
            const dateSelectionnee = urlParams.get('date');
            const h1 = document.querySelector("h1");

            if(dateSelectionnee)
            {
                const parties = dateSelectionnee.split('-');
                
                if(parties.length === 3)
                {
                    const annee = parties[0];
                    const mois = parties[1];
                    const jour = parties[2];

                    const dateObj = new Date(annee, mois - 1, jour);

                    const dateTexte = dateObj.toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    });

                    h1.innerHTML = `${dateTexte}`;

                    const arrayExamenDate = rechercheExamen(dateSelectionnee, arrayExamen);
                    const arrayTaskDate = rechercheTache(dateSelectionnee, arrayTask);

                    affichage(arrayExamenDate, arrayTaskDate);
                }
                else
                {
                    h1.innerHTML = "Date invalide";
                }
            }
        }

        // Premier chargement au démarrage de la page
        await chargerEtAfficherTout();

        function rechercheExamen(date, array)
        {
            return array.filter((element) => {
                return element.date == date;
            });
        }

        function rechercheTache(date, array)
        {
            return array.filter((element) => {
                return element.date == date && element.statut != "Terminé";
            });
        }

        function affichage(arrayExamen, arrayTask)
        {
            let html = '', html2 = '';
            const boxTask = document.querySelectorAll('.boxTask');
            const h2 = document.querySelectorAll('h2');
            
            if(arrayExamen.length != 0)
            {
                h2[0].innerHTML = `${arrayExamen.length} examens 📚`;
                arrayExamen.forEach(function(examen){
                    const date = new Date(examen.date + "T00:00").toLocaleDateString('fr-FR', {day:'numeric', month:'short', year:'numeric'});
                    html += `
                    <div class="rowExamen">
                        <p>${examen.description}</p>
                        <p>${examen.matiere}</p>
                        <p>📅 Le ${date} à ${examen.heure}</p>
                        <p>Au local ${examen.lieu}</p>
                    </div>`;
                });
                boxTask[0].innerHTML = html;
            }
            else {
                h2[0].innerHTML = `0 examen 📚`;
                boxTask[0].innerHTML = '<p>Aucun examen ce jour-là</p>';
            }

            if(arrayTask.length != 0)
            {
                h2[1].innerHTML = `${arrayTask.length} tâches 🎯`;
                arrayTask.forEach(function(task){
                    const indStatut = rechercheStatut(task.statut);
                    const date = new Date(task.date + "T00:00").toLocaleDateString('fr-FR', {day:'numeric', month:'short', year:'numeric'});
                    html2 += `
                    <div class="rowTask">
                        <p>${task.titre}</p>
                        <p>${task.description}</p>
                        <p>${task.matiere}</p>
                        <p>${task.priorite}</p>
                        <p>📅 ${date}</p>
                        <select class="statutTache" data-id="${task.id}">
                            <option value="A faire" ${indStatut == 0 ? "selected" : ""}>A faire</option>
                            <option value="En cours" ${indStatut == 1 ? "selected" : ""}>En cours</option>
                            <option value="Terminé" ${indStatut == 2 ? "selected" : ""}>Terminé</option>
                        </select>
                    </div>`;
                });
                boxTask[1].innerHTML = html2;
            }
            else {
                h2[1].innerHTML = `0 tâche 🎯`;
                boxTask[1].innerHTML = '<p>Aucune tâche en cours ce jour-là</p>';
            }

            const selectTask = document.querySelectorAll('.statutTache');
            selectTask.forEach(function(select){
                select.addEventListener('change', async() => {
                    const idTask = select.dataset.id;
                    const { error } = await supabase
                        .from('task')
                        .update({ statut: select.value })
                        .eq('id', idTask);

                    if(error)
                    {
                        console.log(error);
                        return;
                    }

                    // On recharge tout depuis Supabase pour mettre à jour l'écran et masquer les tâches terminées
                    await chargerEtAfficherTout();
                });
            });
        }

        function rechercheStatut(statut)
        {
            if(statut == "A faire")
            {
                return 0;
            }
            else if(statut == "En cours")
            {
                return 1;
            }
            else
            {
                return 2;
            }
        }
    }
});