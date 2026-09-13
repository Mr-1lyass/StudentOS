import { supabase } from './config.js';

document.addEventListener('DOMContentLoaded', async function () {

    const idUser = localStorage.getItem("idUser");    

    if(!idUser)
    {
        window.location.href = "creationCompte.html";
    }
    else
    {
        async function chargerDonnees() {
        const { data: matiere, error: errMat } = await supabase.from('matiere').select('*').eq('id_user',idUser);

        if (errMat) {
            console.error("Erreur de chargement :", errMat);
            return [];
        }

            return matiere || [];
        }

        let arrayMatiere = await chargerDonnees();
        affichageMatiere();

        const addButton = document.querySelector(".addButton");
        addButton.addEventListener('click', async() => {
            await ajoutMatiere();
        });

        const allInput = document.querySelectorAll("input");
        allInput.forEach((input) => {
            input.addEventListener('keydown', async(event) => {
                if (event.key == 'Enter') {
                    await ajoutMatiere();
                }
            });
        });

        async function ajoutMatiere() {
            const inputNom = document.getElementById('name');
            const inputProfesseur = document.getElementById('professeur');
            const inputGenre = document.getElementById('genre');
            const nom = inputNom.value.trim();
            const professeur = inputProfesseur.value.trim();
            const genre = inputGenre.value;
            const message = document.querySelector('.message');

            if (nom == '' || professeur == '') {
                message.style.color = "red";
                message.innerHTML = "Veuillez entrer toutes les données ❌";
                return;
            }

            const { error } = await supabase
                .from('matiere')
                .insert([{
                    nom: nom,
                    professeur: professeur,
                    genre: genre, 
                    id_user: idUser
                }]);

            if (error) {
                console.error("Erreur lors de l'ajout :", error);
                return;
            }

            message.style.color = "green";
            message.innerHTML = "Matière ajoutée avec succès ✅";
            inputNom.value = "";
            inputProfesseur.value = "";

            arrayMatiere = await chargerDonnees();
            affichageMatiere();
        }

        function affichageMatiere() {
            const html = document.getElementById('sectionMatiere');
            let htmlText = '';
            const titre = document.querySelector('h2');

            if (arrayMatiere.length != 0) {
                titre.style.display = "block";
            } else {
                titre.style.display = "none";
            }

            arrayMatiere.forEach(function (matiere) {
                htmlText += `
                <div class="rowMatiere">
                    <p>Nom : ${matiere.nom}</p>
                    <p>Professeur : ${matiere.genre} ${matiere.professeur}</p>
                    <button class="delete-button" data-id="${matiere.id}">Supprimer</button>
                </div>
                `;
            });

            html.innerHTML = htmlText;

            const deleteButtons = document.querySelectorAll(".delete-button");
            deleteButtons.forEach(function (button) {
                button.addEventListener('click', async () => {
                    const idMatiere = button.dataset.id;

                    const { error } = await supabase
                        .from('matiere')
                        .delete()
                        .eq('id', idMatiere);

                    if (error) {
                        console.error("Erreur lors de la suppression :", error);
                        return;
                    }

                    arrayMatiere = await chargerDonnees();
                    affichageMatiere();
                });
            });
        }
    }

    
});