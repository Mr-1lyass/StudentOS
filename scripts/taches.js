const localTask = JSON.parse(localStorage.getItem("task"));
const localMatiere = JSON.parse(localStorage.getItem("matiere"));

const arrayTask = setLocal(localTask);
const arrayMatiere = setLocal(localMatiere);

selectMatiere();

const addButton = document.querySelector(".addButton");
addButton.addEventListener('click', ajoutTache);

const allInput = document.querySelectorAll("input");
allInput.forEach((input) => {
    input.addEventListener('keydown', (event) => {
        if(event.key == 'Enter')
        {
            ajoutTache();
        }
    })
})

affichageTache()


function ajoutTache() {

    const inputTitre = document.getElementById('titre');
    const inputDescription = document.getElementById('description');
    const inputMatiere = document.getElementById('matiere');
    const inputPriorite = document.getElementById('priorite');
    const inputDate = document.getElementById('date');
    const inputStatut = document.getElementById('statut');
    const titre = inputTitre.value;
    const description = inputDescription.value;
    const matiere = inputMatiere.value;
    const priorite = inputPriorite.value;
    const date = inputDate.value;
    const statut = inputStatut.value;
    const message = document.querySelector('.message');

    if (titre == '' || date == '' || description == '') {
        message.style.color = "red";
        message.innerHTML = "Veuillez entrer toutes les données ❌";
    }
    else {
        arrayTask.push(
            {
                titre,
                description,
                matiere,
                priorite,
                date,
                statut
            }
        )
        message.style.color = "green";
        message.innerHTML = "Tâche ajouté avec succés ✅";
        triTableau();
        localStorage.setItem("task",JSON.stringify(arrayTask));
        inputTitre.value = "";
        inputDescription.value = "";
        inputDate.value = "";
        affichageTache();
    }
}

function triTableau()
{
    arrayTask.sort(function(a,b){
        return new Date(a.date) - new Date(b.date);
    })
}

function affichageTache() {

    const titre = document.querySelector('h2');
    const sousSection = document.querySelectorAll('.sousSectionTachesDonnees');
    const h3 = document.querySelectorAll('h3');
    let i;
    var htmlText = [];
    for(i = 0; i<3; i++)
    {
        htmlText[i] = "";
    }
    if(arrayTask.length != 0)
    {
        titre.style.display = "block";
        h3.forEach(function(titre){
            titre.style.display = "block";
        })
    }
    else
    {
        titre.style.display = "none";
        h3.forEach(function(titre){
            titre.style.display = "none";
        })
    }

    arrayTask.forEach(function (task,index) {
        indStatut = rechercheStatut(task.statut);
        const date = new Date(task.date + "T00:00").toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
        htmlText[indStatut] += 
        `<div class="rowTask">
        <p>${task.titre}</p>
        <p>${task.description}</p>
        <p>${task.matiere}</p>
        <p>${task.priorite}</p>
        <p>📅 ${date}</p>
        <select class="statutTache" data-index="${index}">
            <option value="A faire" ${indStatut == 0 ? "selected" : ""}>A faire</option>
            <option value="En cours" ${indStatut == 1 ? "selected" : ""}>En cours</option>
            <option value="Terminé" ${indStatut == 2 ? "selected" : ""}>Terminé</option>
        </select>
        <br>
        <button class="delete-button" data-index="${index}">Supprimer</button>
        </div>
        `
    })

    for(i=0; i<3; i++)
    {
        sousSection[i].innerHTML = htmlText[i];
    }

    const deleteButtons = document.querySelectorAll(".delete-button");
    deleteButtons.forEach(function(button)
    {
        button.style.backgroundColor = "red";
        button.addEventListener('click',() => {
            const index = button.dataset.index;
            arrayTask.splice(index,1);
            localStorage.setItem("task",JSON.stringify(arrayTask));
            affichageTache();
        })
    })

    const selectTask = document.querySelectorAll('.statutTache');
    selectTask.forEach(function(select){
        select.addEventListener('change',() => {
            const index = select.dataset.index;
            arrayTask[index].statut = select.value;
            localStorage.setItem("task",JSON.stringify(arrayTask));
            affichageTache();
        })
    })
}

function selectMatiere()
{
    const select = document.querySelector('#matiere');
    var htmlText = '';
    
    arrayMatiere.forEach(function(matiere)
    {
        htmlText += `<option value="${matiere.nom}">${matiere.nom}</option>`;
    })
    select.innerHTML = htmlText;
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