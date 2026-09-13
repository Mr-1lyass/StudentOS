import {supabase} from './config.js';

document.addEventListener('DOMContentLoaded', async function() {
    
    const idUser = localStorage.getItem("idUser");    

    if(!idUser)
    {
        window.location.href = "creationCompte.html";
    }
    else
    {
        const monthYear = document.getElementById('month-year');
        const daysContainer = document.getElementById('days');
        const prevButton = document.getElementById('prev');
        const nextButton = document.getElementById('next');

        const months = [
            'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
            'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
        ];

        let currentDate = new Date();
        let today = new Date();

        async function renderCalendar(date)
        {
            daysContainer.innerHTML = '<p style="width:100%;text-align:center;margin-top:50px;font-weight:bold;">Chargement des dâtes... ⏳</p>';

            const {data: task, error: errTask} = await supabase.from('task').select('*').eq('id_user', idUser);
            const {data: examen, error: errExamen} = await supabase.from('examen').select('*').eq('id_user', idUser);

            if(errTask || errExamen)
            {
                console.error(errTask || errExamen);
                return;
            }

            const arrayTask = task || [];
            const arrayExamen = examen || [];

            var html = '';
            const year = date.getFullYear();
            const month = date.getMonth();
            let firstDay = new Date(year, month, 1).getDay();
            firstDay = firstDay === 0 ? 7 : firstDay;
            const lastDay = new Date(year, month+1, 0).getDate();

            monthYear.textContent = `${months[month]} ${year}`;


            //Les dates du mois d'avant
            const prevMonthLastDay = new Date(year, month, 0).getDate();
            for(let i = firstDay - 1; i>0; i--)
            {
                const textContent = prevMonthLastDay - i + 1;
                html += `<div class="fade dayDiv">${textContent}</div>`;
            }

            //Les dates du mois
            for (let i = 1; i <= lastDay; i++)
                {
                    const moisFormat = String(month + 1).padStart(2, '0');
                    const jourFormat = String(i).padStart(2,'0');
                    const dateComplete = `${year}-${moisFormat}-${jourFormat}`;

                    let task = 0;
                    let classes = "dayDiv";
                    if(i === today.getDate() && month === today.getMonth() && year === today.getFullYear()){
                        classes += " today";
                    }
                    const aDesExamens = arrayExamen.some((examen) => {
                        return examen.date == dateComplete
                    })

                    const aDesTaches = arrayTask.some((task) => {
                        return task.date == dateComplete && task.statut !== "Terminé"
                    })

                    if(aDesExamens || aDesTaches)
                    {
                        classes += " taskDate";
                    }

                    html += `<div class="${classes}" data-date="${dateComplete}">${i}</div>`;
            }

            //Les dates du mois prochain 
            let lastDayOfWeek = new Date(year,month + 1,0).getDay();

            lastDayOfWeek = lastDayOfWeek === 0 ? 7 : lastDayOfWeek;

            const nextMonthStartDay = 7 - lastDayOfWeek;

            for (let i = 1; i<= nextMonthStartDay; i++)
            {
                html += `<div class="fade dayDiv">${i}</div>`;
            }
            daysContainer.innerHTML = html;

            const divDate = document.querySelectorAll('.dayDiv');
            divDate.forEach((div) => {
                div.addEventListener('click', () => {
                    const date = div.getAttribute('data-date');
                    if(date)
                    {
                        window.location.href = `date.html?date=${date}`;
                    }
                })
            })
        }

        prevButton.addEventListener('click', async function() {
            currentDate.setMonth(currentDate.getMonth() - 1);
            await renderCalendar(currentDate);
        });

        nextButton.addEventListener('click', async function() {
            currentDate.setMonth(currentDate.getMonth() + 1);
            await renderCalendar(currentDate);
        });

        await renderCalendar(currentDate);
    }

    
})