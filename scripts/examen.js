import { supabase } from './config.js';

document.addEventListener('DOMContentLoaded', async function(){

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
            const {data:examen, error:errExamen} = await supabase.from('examen').select('*').eq('id_user',idUser);

            if(errMatiere || errExamen)
            {
                console.log("Erreur lors de l'importation : ",errMatiere || errExamen);
            }

            const arrayMatiere = matiere || [];
            const arrayExamen = examen || [];

            triTableau(arrayExamen);
            selectMatiere(arrayMatiere);
            affichageExamen(arrayExamen);
        }

        await chargerEtAfficherTout();

        const addButton = document.querySelector(".addButton");
        addButton.addEventListener('click', async() => {
            await ajoutExamen();
        });

        const allInput = document.querySelectorAll("input");
        allInput.forEach((input) => {
            input.addEventListener('keydown', async(event) => {
                if(event.key == 'Enter')
                {
                    await ajoutExamen();
                }
            })
        })

        async function ajoutExamen()
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
                
                const {error:error} = await supabase
                .from('examen')
                .insert([{
                    matiere: matiere,
                    description: description,
                    date: date,
                    heure: heure,
                    lieu: lieu,
                    id_user: idUser
                }])

                if(error)
                {
                    console.log(error);
                    return;
                }

                message.style.color = "green";
                message.innerHTML = "Examen ajouté avec succés ✅";
                inputMatiere.value = "";
                inputDate.value = "";
                inputLieu.value = "";
                await chargerEtAfficherTout();
            }
        }


        function triTableau(arrayExamen)
        {
            arrayExamen.sort(function(a,b){
                return new Date(a.date) - new Date(b.date);
            })
        }

        function affichageExamen(arrayExamen)
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
                <button class="delete-button" data-id=${examen.id}>Supprimer</button>
                </div>
                `
            })

            html.innerHTML = htmlText;

            const deleteButtons = document.querySelectorAll(".delete-button");
            deleteButtons.forEach(function(button)
            {
                button.addEventListener('click',async() => {
                    const idExamen = button.dataset.id;

                    const {error:error} = await supabase
                    .from('examen')
                    .delete()
                    .eq('id',idExamen)

                    if(error)
                    {
                        console.log(error);
                        return;
                    }
                    
                    await chargerEtAfficherTout();
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
        }
})