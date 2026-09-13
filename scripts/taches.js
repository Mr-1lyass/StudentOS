import { supabase } from './config.js';

document.addEventListener('DOMContentLoaded',async function() {

    const idUser = localStorage.getItem("idUser");

    if(!idUser)
    {
        window.location.href = "creationCompte.html";
    }
    else
    {
        async function chargerEtAfficherTout()
        {
            const {data:matiere, error:errMatiere} = await supabase.from('matiere').select('*').eq('id_user',idUser);
            const {data:task, error: errTask} = await supabase.from('task').select('*').eq('id_user',idUser);

            if(errMatiere || errTask)
            {
                console.error("Erreur lors du chargement depuis Supabase :",errMatiere || errTask);
                return;
            }

            const arrayMatiere = matiere || [];
            const arrayTask = task || [];

            triTableau(arrayTask);
            selectMatiere(arrayMatiere);
            affichageTache(arrayTask);
        }

        await chargerEtAfficherTout();

        const addButton = document.querySelector(".addButton");
        addButton.addEventListener('click', async() => {
            await ajoutTache();
        });

        const allInput = document.querySelectorAll("input");
        allInput.forEach((input) => {
            input.addEventListener('keydown', async(event) => {
                if(event.key == 'Enter')
                {
                    await ajoutTache();
                }
            })
        })



        async function ajoutTache() {

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
                const {error:error} = await supabase
                .from('task')
                .insert([{
                    titre: titre,
                    description: description,
                    matiere: matiere,
                    priorite: priorite,
                    date: date,
                    statut: statut,
                    id_user: idUser
                }])

                if(error)
                {
                    console.log(error);
                    return;
                }

                message.style.color = "green";
                message.innerHTML = "Tâche ajouté avec succés ✅";
                inputTitre.value = "";
                inputDescription.value = "";
                inputDate.value = "";
                await chargerEtAfficherTout();
            }
        }

        function triTableau(arrayTask)
        {
            arrayTask.sort(function(a,b){
                return new Date(a.date) - new Date(b.date);
            })
        }

        function affichageTache(arrayTask) {

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

            arrayTask.forEach(function (task) {
                const indStatut = rechercheStatut(task.statut);
                const date = new Date(task.date + "T00:00").toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
                htmlText[indStatut] += 
                `<div class="rowTask">
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
                <br>
                <button class="delete-button" data-id="${task.id}">Supprimer</button>
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
                button.addEventListener('click',async() => {
                    const idTask = button.dataset.id;
                    const {error:error} = await supabase
                    .from('task')
                    .delete()
                    .eq('id',idTask);

                    if(error)
                    {
                        console.log(error);
                        return;
                    }

                    await chargerEtAfficherTout();
                })
            })

            const selectTask = document.querySelectorAll('.statutTache');
            selectTask.forEach(function(select){
                select.addEventListener('change',async() => {
                    const idTask = select.dataset.id;
                    const {error:error} = await supabase
                    .from('task')
                    .update({ statut: select.value })
                    .eq('id',idTask);

                    if(error)
                    {
                        console.log(error);
                        return;
                    }

                    await AfficherTout();
                })
            })
        }

        function selectMatiere(arrayMatiere)
        {
            const select = document.querySelector('#matiere');
            var htmlText = '';
            
            arrayMatiere.forEach(function(matiere)
            {
                htmlText += `<option value="${matiere.nom}">${matiere.nom}</option>`;
            })
            select.innerHTML = htmlText;
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
})