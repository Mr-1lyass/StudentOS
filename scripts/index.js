const localMatiere = JSON.parse(localStorage.getItem("matiere"));
const localTask = JSON.parse(localStorage.getItem("task"));
const localExamen = JSON.parse(localStorage.getItem("examen"));

const arrayMatiere = remplirLocal(localMatiere);
const arrayTask = remplirLocal(localTask);
const arrayExamen = remplirLocal(localExamen);

suppr_TacheExamen(arrayExamen,arrayTask);

affichage_donnees();

affichage_echeances();

function remplirLocal(local)
{
    if(local != null)
    {
        return local;
    }
    else
    {
        return [];
    }
}


function affichage_donnees()
{
    const nbreMatiere = arrayMatiere.length;
    const arrayTacheaFaire = recherche_tache();
    const arrayExamenVenir = recherche_examen();
    const nbreTacheAfaire = arrayTacheaFaire.length;
    const nbreExamen = arrayExamenVenir.length;
    const donnees = document.querySelectorAll(".parBulles");
    donnees[0].innerHTML = nbreMatiere;
    donnees[1].innerHTML = nbreTacheAfaire;
    donnees[2].innerHTML = nbreExamen;
}

function recherche_examen()
{
    const dateAujourdhui = new Date();
    dateAujourdhui.setHours(0,0,0,0);
    const dateLimite = new Date(dateAujourdhui);
    dateLimite.setDate(dateLimite.getDate() + 10);
    dateLimite.setHours(23,59,59,999);
    const ExamenVenir =  arrayExamen.filter(function(examen){
        const dateExamen = new Date(examen.date);
        return dateExamen >= dateAujourdhui && dateExamen <= dateLimite
    })
    return ExamenVenir;
}

function recherche_tache() {
    const dateAujourdhui = new Date();
    dateAujourdhui.setHours(0,0,0,0);
    const dateLimite = new Date(dateAujourdhui);
    dateLimite.setDate(dateLimite.getDate() + 10);
    dateLimite.setHours(23,59,59,999);

    const tache = arrayTask.filter((task) => {
        const dateTache = new Date(task.date);
        return (task.statut == "A faire" || task.statut == "En cours") 
               && (dateTache >= dateAujourdhui && dateTache <= dateLimite);
    });

    return tache;
}

function affichage_echeances()
{
    const arrayTacheaFaire = recherche_tache();
    const examenVenir = recherche_examen();
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
        if(item.type == "Examen")
        {
            textHTML += `<div class="rowEcheances"><p>📚 ${item.type} en ${(item.matiere).toLowerCase()}‎ ‎ ⎯ ‎ ‎${item.description}‎ ‎ ➔  ‎ ‎${date}</p></div>`
        }
        else
        {
            textHTML += `<div class="rowEcheances"><p>🎯 ${item.titre} en ${(item.matiere).toLowerCase()}‎ ‎ ⎯ ‎ ‎${item.description}‎ ‎ ➔  ‎ ‎${date}</p></div>`
        }
    });

    html.innerHTML = textHTML;
}

function formaterDate(date)
{
    const aujourdhui = new Date();
    aujourdhui.setHours(0,0,0,0);
    
    const dateCible = new Date(date);
    dateCible.setHours(0,0,0,0);

    const diffTemps = dateCible - aujourdhui;
    const diffJours = Math.round(diffTemps / (24*60*60*1000));

    if(diffJours == 0)
    {
        return "Aujourd'hui";
    }
    else if(diffJours == 1)
    {
        return "Demain";
    }
    else if(diffJours == 2)
    {
        return "Après-demain";
    }
    else if(diffJours <= 7)
    {
        const jour = dateCible.toLocaleDateString('fr-FR', {weekday: 'long'});
        return jour.charAt(0).toUpperCase() + jour.slice(1);
    }
    else
    {
        return dateCible.toLocaleDateString('fr-FR', {day: 'numeric', month:'short'});
    }
}

function suppr_TacheExamen(arrayExamen,arrayTask)
{
    const aujourdhui = new Date();
    aujourdhui.setHours(0,0,0,0);
    const limite = new Date(aujourdhui);
    limite.setDate(limite.getDate() - 7);
    arrayExamen.forEach((examen,index) => {
        if(examen.date < aujourdhui)
        {
            arrayExamen.splice(index,1);
            localStorage.setItem("examen",arrayExamen);
        }
    })
    arrayTask.forEach((task,index) => {
        if(task.statut == "Terminé" && task.date < limite)
        {
            arrayTask.splice(index,1);
            localStorage.setItem("task",arrayTask);
        }
    })
}