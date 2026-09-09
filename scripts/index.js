const arrayMatiere = JSON.parse(localStorage.getItem("matiere"));
const arrayTask = JSON.parse(localStorage.getItem("task"));
const arrayExamen = JSON.parse(localStorage.getItem("examen"));

affichage_donnees();

affichage_echeances();


function affichage_donnees()
{
    const nbreMatiere = arrayMatiere.length;
    const arrayTacheaFaire = recherche_tache();
    const nbreTacheAfaire = arrayTacheaFaire.length;
    const nbreExamens = calcul_examen();
    const donnees = document.querySelectorAll(".parBulles");
    donnees[0].innerHTML = nbreMatiere;
    donnees[1].innerHTML = nbreTacheAfaire;
    donnees[2].innerHTML = nbreExamens;
}

function calcul_examen()
{
    let i = 0;
    const dateAujourdhui = new Date();
    dateAujourdhui.setHours(0,0,0,0);
    arrayExamen.forEach(function(task){
        const dateExamen = new Date(task.date);
        if(dateExamen >= dateAujourdhui)
        {
            i++;
        }
    })
    return i;
}

function recherche_tache()
{
    const tache = arrayTask.filter((task) => {
        return task.statut == "A faire" || task.statut == "En cours";
    });

    return tache;
}

function affichage_echeances()
{
    const arrayTacheaFaire = recherche_tache();
    const html = document.getElementById('containerEcheances');
    var textHTML = '';
    const aujourdhui = new Date().setHours(0,0,0,0);
    const DansDixjours = new Date(aujourdhui)
    DansDixjours.setDate(DansDixjours.getDate() + 10);
    DansDixjours.setHours(23,59,59,999);

    const examenBientot = arrayExamen.filter((examen) => {
        const dateExamen = new Date(examen.date);
        return dateExamen >= aujourdhui && dateExamen <= DansDixjours;
    });
    
    const taskBientot = arrayTacheaFaire.filter((task) => {
        const dateTask = new Date(task.date);
        return dateTask >= aujourdhui && dateTask <= DansDixjours;
    });

    const toutBientot = [
        ...taskBientot.map(item => ({
            ...item,
            type : 'tache'
        })),
        ...examenBientot.map(item => ({
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