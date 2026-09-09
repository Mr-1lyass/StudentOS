const local = JSON.parse(localStorage.getItem("task"));

const arrayTask = local;

const progressBar = document.querySelectorAll('.progress-bar-fill');

const Task = TachesTermines();

function TachesTermines()
{
    let tachTerminés = 0, tachRestantes = 0;
    const aujourdhui = new Date();
    aujourdhui.setHours(0,0,0,0);

    const limiteAvant = new Date(aujourdhui);
    limiteAvant.setDate(limiteAvant.getDate() - 7);

    const limiteApres = new Date(aujourdhui);
    limiteApres.setDate(limiteApres.getDate() + 7);
    limiteApres.setHours(23,59,59,999);

    const tacheValide = arrayTask.filter((task) => {
        const date = new Date(task.date);
        return limiteAvant <= date && date <= limiteApres;
    });

    tacheValide.forEach((tache) => {
        if(tache.statut = "Terminé")
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
    percTachesTerminés.innerHTML = `${tachTerminés}%`
    numberTaskFinished.innerHTML = `${tachTerminés} tâches terminés`
    numberTaskStay.innerHTML = `${tachRestantes} tâches restantes`
}