const localMatiere = JSON.parse(localStorage.getItem("matiere"));
const localExamen = JSON.parse(localStorage.getItem("examen"));

var arrayMatiere, arrayExamen;

initialiseLocal();

selectMatiere();

const addButton = document.querySelector(".addButton");
addButton.addEventListener('click', ajoutExamen);

affichageExamen()

function ajoutExamen()
{
    const inputMatiere = document.getElementById('matiere');
    const inputDescription = document.getElementById('description');
    const inputDate = document.getElementById('date');
    const inputHeure = document.getElementById('heure');
    const inputLieu = document.getElementById('lieu');
    const matiere = inputMatiere.value;
    const description = inputDescription.value;
    const date = inputDate.value;
    const heure = inputHeure.value;
    const lieu = inputLieu.value;
    const message = document.querySelector('.message');

    if (matiere == '' || date == '' || lieu == '' || description == '') {
        message.style.color = "red";
        message.innerHTML = "Veuillez entrer toutes les données ❌";
    }
    else {
        arrayExamen.push(
            {
                matiere,
                description,
                date,
                heure,
                lieu
            }
        )
        message.style.color = "green";
        message.innerHTML = "Matière ajouté avec succés ✅";
        triTableau();
        localStorage.setItem("examen",JSON.stringify(arrayExamen));
        inputMatiere.value = "";
        inputDate.value = "";
        inputLieu.value = "";
        affichageExamen();
    }
}


function triTableau()
{
    arrayExamen.sort(function(a,b){
        return new Date(a.date) - new Date(b.date);
    })
}

function affichageExamen()
{
    const html = document.getElementById('sectionExamen');
    var htmlText = '';
    const titre = document.querySelector('h2');

    if(arrayExamen.length != 0)
    {
        titre.style.display = "block"
    }
    else
    {
        titre.style.display = "none";
    }

    arrayExamen.forEach(function (examen) {
        const date = new Date(examen.date + "T00:00").toLocaleDateString('fr-FR', {day:'numeric', month:'short', year:'numeric'});
        htmlText += 
        `<div class="rowExamen">
        <p>${examen.description}</p>
        <p>${examen.matiere}</p>
        <p>📅 Le ${date} à ${examen.heure}</p>
        <p>Au local ${examen.lieu}</p>
        <button class="delete-button">Supprimer</button>
        </div>
        `
    })

    html.innerHTML = htmlText;

    const deleteButtons = document.querySelectorAll(".delete-button");
    deleteButtons.forEach(function(button,index)
    {
        button.addEventListener('click',() => {
            arrayExamen.splice(index,1);
            triTableau();
            localStorage.setItem("examen",JSON.stringify(arrayExamen));
            affichageExamen();
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


function initialiseLocal()
{
    if(localMatiere != null)
    {
        arrayMatiere = localMatiere;
    }
    else
    {
        arrayMatiere = [];
    }
    if(localExamen != null)
    {
        arrayExamen = localExamen;
    }
    else
    {
        arrayExamen = [];
    }
}