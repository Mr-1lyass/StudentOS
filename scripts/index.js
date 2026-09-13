import { supabase } from './config.js';

document.addEventListener('DOMContentLoaded', async function() {

    const idUser = localStorage.getItem("idUser");    

    if(!idUser)
    {
        window.location.href = "creationCompte.html";
    }
    else
    {
        async function chargerEtAfficherTout() {

        await suppr_TacheExamen();

        const { data: arrayMatiere, error: errMat } = await supabase.from('matiere').select('*').eq('id_user',idUser);
        const { data: arrayTask, error: errTask } = await supabase.from('task').select('*').eq('id_user',idUser);
        const { data: arrayExamen, error: errEx } = await supabase.from('examen').select('*').eq('id_user',idUser);

        if(errMat || errTask || errEx) {
            console.error("Erreur lors du chargement depuis Supabase :", errMat || errTask || errEx);
            return;
        }

        const matiere = arrayMatiere || [];
        const task = arrayTask || [];
        const examen = arrayExamen || [];

        const logoutBtn = document.querySelector('.logoutBtn');
        logoutBtn.addEventListener('click',()=>{
            localStorage.clear();
            window.location.reload();
        })

        await affichage_donnees(matiere, task, examen);
        affichage_echeances(task, examen);
        }

        await chargerEtAfficherTout();

        async function affichage_donnees(matiere, task, examen) {
            const nbreMatiere = matiere.length;
            const arrayTacheaFaire = recherche_tache(task);
            const arrayExamenVenir = recherche_examen(examen);
            const nbreTacheAfaire = arrayTacheaFaire.length;
            const nbreExamen = arrayExamenVenir.length;
            const donnees = document.querySelectorAll(".parBulles");
            
            donnees[0].innerHTML = nbreMatiere;
            donnees[1].innerHTML = nbreTacheAfaire;
            donnees[2].innerHTML = nbreExamen;
        }

        function recherche_examen(examen) {
            const dateAujourdhui = new Date();
            dateAujourdhui.setHours(0,0,0,0);
            const dateLimite = new Date(dateAujourdhui);
            dateLimite.setDate(dateLimite.getDate() + 10);
            dateLimite.setHours(23,59,59,999);

            return examen.filter(function(ex){
                const dateExamen = new Date(ex.date);
                return dateExamen >= dateAujourdhui && dateExamen <= dateLimite;
            });
        }

        function recherche_tache(task) {
            const dateAujourdhui = new Date();
            dateAujourdhui.setHours(0,0,0,0);
            const dateLimite = new Date(dateAujourdhui);
            dateLimite.setDate(dateLimite.getDate() + 10);
            dateLimite.setHours(23,59,59,999);

            return task.filter((t) => {
                const dateTache = new Date(t.date);
                return (t.statut == "A faire" || t.statut == "En cours") 
                    && (dateTache >= dateAujourdhui && dateTache <= dateLimite);
            });
        }

        function affichage_echeances(task, examen) {
            const arrayTacheaFaire = recherche_tache(task);
            const examenVenir = recherche_examen(examen);
            const html = document.getElementById('containerEcheances');
            var textHTML = '';

            const toutBientot = [
                ...arrayTacheaFaire.map(item => ({
                    ...item,
                    type : 'tache'
                })),
                ...examenVenir.map(item => ({
                    ...item,
                    type : 'Examen'
                }))
            ].sort((a,b) => {
                return new Date(a.date) - new Date(b.date);
            });

            toutBientot.forEach(function(item) {
                const date = formaterDate(item.date);
                if(item.type == "Examen") {
                    textHTML += `<div class="rowEcheances"><p>📚 ${item.type} en ${(item.matiere).toLowerCase()}‎ ‎ ⎯ ‎ ‎${item.description}‎ ‎ ➔  ‎ ‎${date}</p></div>`;
                } else {
                    textHTML += `<div class="rowEcheances"><p>🎯 ${item.titre} en ${(item.matiere).toLowerCase()}‎ ‎ ⎯ ‎ ‎${item.description}‎ ‎ ➔  ‎ ‎${date}</p></div>`;
                }
            });

            html.innerHTML = textHTML;
        }

        function formaterDate(date) {
            const aujourdhui = new Date();
            aujourdhui.setHours(0,0,0,0);
            
            const dateCible = new Date(date);
            dateCible.setHours(0,0,0,0);

            const diffTemps = dateCible - aujourdhui;
            const diffJours = Math.round(diffTemps / (24*60*60*1000));

            if(diffJours == 0) return "Aujourd'hui";
            else if(diffJours == 1) return "Demain";
            else if(diffJours == 2) return "Après-demain";
            else if(diffJours <= 7) {
                const jour = dateCible.toLocaleDateString('fr-FR', {weekday: 'long'});
                return jour.charAt(0).toUpperCase() + jour.slice(1);
            } else {
                return dateCible.toLocaleDateString('fr-FR', {day: 'numeric', month:'short'});
            }
        }

        async function suppr_TacheExamen() {
            const aujourdhui = new Date();
            aujourdhui.setHours(0,0,0,0);
            const limite = new Date(aujourdhui);
            limite.setDate(limite.getDate() - 7);

            const aujourdhuiStr = aujourdhui.toISOString().split('T')[0];
            const limiteStr = limite.toISOString().split('T')[0];

            const {error: errExamen} = await supabase
                .from('examen')
                .delete()
                .lt('date', aujourdhuiStr);

            const {error : errTask} = await supabase
                .from('task')
                .delete()
                .eq('statut', 'Terminé')
                .lt('date', limiteStr);

            if (errExamen || errTask) {
                console.error("Erreur lors du nettoyage :", errExamen || errTask);
            } else {
                console.log("Nettoyage automatique effectué dans le cloud !");
            }
        }
    
    
    }
});