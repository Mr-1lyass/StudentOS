const local = JSON.parse(localStorage.getItem("task"));

const arrayTask = setLocal(local);


const progressBar = document.querySelectorAll('.progress-bar-fill');

const Task = TachesTermines();

const matiereTask = rechercheMatiere(Task);

saisieTacheMatiere(matiereTask);

function TachesTermines()
{
    let tachTerminés = 0, tachRestantes = 0;
    const aujourdhui = new Date();
    aujourdhui.setHours(0,0,0,0);

    const limiteAvant = new Date(aujourdhui);
    limiteAvant.setDate(limiteAvant.getDate() - 7);

    const limiteApres = new Date(aujourdhui);
    limiteApres.setDate(limiteApres.getDate() + 10);
    limiteApres.setHours(23,59,59,999);

    const tacheValide = arrayTask.filter((task) => {
        const date = new Date(task.date);
        return limiteAvant <= date && date <= limiteApres;
    });

    tacheValide.forEach((tache) => {
        if(tache.statut == "Terminé")
        {
            tachTerminés++;
        }
        else
        {
            tachRestantes++;
        }
    })

    saisieTacheTerminés(tacheValide,tachTerminés,tachRestantes);

    return tacheValide;
}

function saisieTacheTerminés(tacheValide, tachTerminés, tachRestantes)
{
    const numberTaskFinished = document.getElementById('numberTaskFinished');
    const numberTaskStay = document.getElementById('numberTaskStay');
    const percTachesTerminés = document.getElementById('percTachesTerminés');



    var pourcentage = Math.round(tachTerminés / (tacheValide.length) * 100);

    if(Number.isNaN(pourcentage))
    {
        pourcentage = 0;
    }

    progressBar[0].style.width = `${pourcentage}%`;
    percTachesTerminés.innerHTML = `${pourcentage}%`
    numberTaskFinished.innerHTML = `${tachTerminés} tâches terminés`
    numberTaskStay.innerHTML = `${tachRestantes} tâches restantes`
}

function rechercheMatiere(arrayTask)
{
    const matiereTask = []

    arrayTask.forEach(function(task){
        const indMatiere = rechercheMatiereExiste(matiereTask,task.matiere);
        const indStatut = tacheStatut(task.statut);
        if(indMatiere == -1)
        {
            let tachRestantes = 0;
            let tachTerminés = 0;
            if(!indStatut)
            {
                tachRestantes++;
            }
            else
            {
                tachTerminés++;
            }

            const matiere = task.matiere;
            matiereTask.push(
                {
                    matiere,
                    tachTerminés,
                    tachRestantes
                }
            )
        }
        else
        {
            if(!indStatut)
            {
                matiereTask[indMatiere].tachRestantes++;
            }
            else
            {
                matiereTask[indMatiere].tachTerminés++;
            }
        }
    })

    return matiereTask;
}

function rechercheMatiereExiste(matiereTask,matiere)
{
    matiereTask.forEach(function(mat,indice){
        if(mat.matiere === matiere)
        {
            return indice;
        }
    })

    return -1;
}

function tacheStatut(statut)
{
    if(statut == "Terminé")
    {
        return 1;
    }
    return 0;
}

function saisieTacheMatiere(matiereTask)
{
    const html = document.getElementById('matiereStat');
    var text = '';

    matiereTask.forEach(function(matiere)
    {
        const pourcentage = Math.round(matiere.tachTerminés / (matiere.tachTerminés +matiere.tachRestantes) * 100);
        text += `<div class="rowMatiereStat">
                    <p>${matiere.matiere}</p>
                    <div class="progress-bar-container">
                        <div class="progress-bar-fill" style="width:${pourcentage}">‎</div>
                    </div>
                    <p>${pourcentage}%</p> 
                </div>`
    })

    html.innerHTML = text;
}

function setLocal(local)
{
    if(Array.isArray(local))
    {
        return local;
    }
    else
    {
        return [];
    }
}