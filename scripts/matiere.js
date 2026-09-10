const local = JSON.parse(localStorage.getItem("matiere"));

var arrayMatiere;

if(local != null)
{
    arrayMatiere = local;
}
else
{
    arrayMatiere = [];
}

const addButton = document.querySelector(".addButton");
addButton.addEventListener('click', ajoutMatiere);

const allInput = document.querySelectorAll("input");
allInput.forEach((input) => {
    input.addEventListener('keydown', (event) => {
        if(event.key == 'Enter')
        {
            ajoutMatiere();
        }
    })
})

affichageMatiere()


function ajoutMatiere() {

    const inputNom = document.getElementById('name');
    const inputProfesseur = document.getElementById('professeur');
    const inputGenre = document.getElementById('genre');
    const nom = inputNom.value;
    const professeur = inputProfesseur.value;
    const genre = inputGenre.value;
    const message = document.querySelector('.message');

    if (nom == '' || professeur == '') {
        message.style.color = "red";
        message.innerHTML = "Veuillez entrer toutes les données ❌";
    }
    else {
        arrayMatiere.push(
            {
                nom,
                professeur,
                genre
            }
        )
        message.style.color = "green";
        message.innerHTML = "Matière ajouté avec succés ✅";
        localStorage.setItem("matiere",JSON.stringify(arrayMatiere));
        inputNom.value = "";
        inputProfesseur.value = "";
        affichageMatiere();
    }
}

function affichageMatiere() {

    const html = document.getElementById('sectionMatiere');
    var htmlText = '';
    const titre = document.querySelector('h2');

    if(arrayMatiere.length != 0)
    {
        titre.style.display = "block"
    }
    else
    {
        titre.style.display = "none";
    }

    arrayMatiere.forEach(function (matiere) {
        htmlText += 
        `<div class="rowMatiere">
        <p>Nom : ${matiere.nom}</p>
        <p>Professeur : ${matiere.genre} ${matiere.professeur}</p>
        <button class="delete-button">Supprimer</button>
        </div>
        `
    })

    html.innerHTML = htmlText;

    const deleteButtons = document.querySelectorAll(".delete-button");
    deleteButtons.forEach(function(button,index)
    {
        button.addEventListener('click',() => {
            arrayMatiere.splice(index,1);
            localStorage.setItem("matiere",JSON.stringify(arrayMatiere));
            affichageMatiere();
        })
    })
}