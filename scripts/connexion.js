import {supabase} from './config.js';

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
        await connexion();
        })

        const allInput = document.querySelectorAll('input');
        allInput.forEach((input) => {
            input.addEventListener('keydown', async(event)=>{
                if(event.key == 'Enter')
                {
                    await connexion();
                }
            })
        })
    }

    async function connexion()
    {
        const inputMail = document.getElementById('mail');
        const inputPassword = document.getElementById('password');
        const divMessage = document.querySelector('.divMessage');

        const mail = inputMail.value.trim();
        const password = inputPassword.value;

        if(mail == '' || password == '')
        {
            divMessage.innerHTML = `<p style="color:red">Veuillez entrer toutes les données ❌</p>`;
        }

        else
        {
            const {data:user ,error:error} = await supabase 
            .from('user')
            .select('*')
            .eq('mail',mail)
            .eq('password',password)

            if(error)
            {
                console.error(error);
                return;
            }

            if(user && user.length > 0)
            {
                divMessage.innerHTML = `<p style="color:green">Connexion avec succès ✅</p>`;
                localStorage.setItem("idUser",user[0].id);
                inputMail.value = '';
                inputPassword.value = '';

                setTimeout(() => {
                    window.location.href = "index.html";
                }, 3000);
            }
            else
            {
                divMessage.innerHTML = `<p style="color:red">Adresse mail ou mot de passe incorrect ❌</p>`;
            }
        }
    }

})