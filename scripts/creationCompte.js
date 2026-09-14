import {supabase} from './config.js';
import bcrypt from 'https://esm.sh/bcryptjs';

document.addEventListener('DOMContentLoaded', async() => {

    const local = localStorage.getItem("idUser");

    if(local)
    {
        const main = document.querySelector('.mainConnexion');
        main.innerHTML = "Vous êtes déjà connecté"
    }
    else
    {
        const button = document.querySelector('.addButtonConnexion');
        button.addEventListener('click', async() => {
        await addUser();
        })

        const allInput = document.querySelectorAll('input');
        allInput.forEach((input) => {
            input.addEventListener('keydown', async(event)=>{
                if(event.key == 'Enter')
                {
                    await addUser();
                }
            })
        })
    }

    async function addUser()
    {
        const inputNom = document.getElementById('nom');
        const inputPrenom = document.getElementById('prenom');
        const inputMail = document.getElementById('mail');
        const inputPassword = document.getElementById('password');
        const divMessage = document.querySelector('.divMessage');
        const nom = inputNom.value.trim();
        const prenom = inputPrenom.value.trim();
        const mail = inputMail.value.trim();
        const password = inputPassword.value;

        if(nom == '' || prenom == '' || mail == '' || password == '')
        {
            divMessage.innerHTML = `<p style="color:red">Veuillez entrer toutes les données ❌</p>`;
        }

        else
        {
            try
            {
                const salt = bcrypt.genSaltSync(10);
                const hashedPassword = bcrypt.hashSync(password,salt);

                const {data:user ,error:error} = await supabase 
                    .from('user')
                    .insert([{
                        nom: nom,
                        prenom: prenom,
                        mail: mail,
                        password: hashedPassword
                    }])
                    .select()

                if(error)
                {
                    console.error(error);
                    return;
                }

                divMessage.innerHTML = `<p style="color:green">Compte créé avec succés ✅</p>`;
                localStorage.setItem("idUser",user[0].id);
                inputNom.value = '';
                inputPrenom.value = '';
                inputMail.value = '';
                inputPassword.value = '';

                setTimeout(() => {
                    window.location.href = "index.html";
                }, 1600);
            }
            catch(err)
            {
                console.error(err);
                divMessage.innerHTML = `<p style="color:red">Erreur technique lors du hachage ❌</p>`;
            }
        }
    }
})