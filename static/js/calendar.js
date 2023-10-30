'use strict';

// Calendar script

let calendar = document.querySelector('.calendar')

const month_names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const isLeapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0 && year % 400 !== 0) || (year % 100 === 0 && year % 400 ===0)
}

const getFebDays = (year) => {
    return isLeapYear(year) ? 29 : 28
}

const generateCalendar = (month, year) => {
    let calendar_days = calendar.querySelector('.calendar-days')
    let calendar_header_year = calendar.querySelector('#year')

    const firstDayOfMonth = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    calendar_days.innerHTML = ''

    calendar_header_year.innerHTML = year
    month_picker.innerHTML = month_names[month]

    for (let i = 0; i < firstDayOfMonth; i++) {
        // Add empty cells for days before the 1st day of the month
        const emptyDay = document.createElement('div')
        emptyDay.classList.add('calendar-empty-day')
        calendar_days.appendChild(emptyDay)
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div')
        dayElement.classList.add('calendar-day-hover')
        dayElement.innerHTML = day;

        if (day === currDate.getDate() && year === currDate.getFullYear() && month === currDate.getMonth()) {
            dayElement.classList.add('curr-date')
        }

        calendar_days.appendChild(dayElement)

        dayElement.addEventListener('click', (evt) => {
            evt.preventDefault();
            const date_picked = String(day);
            const month_picked = month_names[month];
            const url = `day-picker/${month_picked}/${date_picked}`

            fetch(url)
                .then(response => {
                    if (response.status === 200) {
                        window.location.href = url
                    } else {
                        console.error('Error:', response.status)
                    }
                })
                .catch(error => {
                    console.error('Error:', error)
                })
        })
    }
}

let month_list = calendar.querySelector('.month-list')

month_names.forEach((e, index) => {
    let month = document.createElement('div')
    month.innerHTML = `<div data-month="${index}">${e}</div>`
    month.querySelector('div').onclick = () => {
        month_list.classList.remove('show')
        curr_month.value = index
        generateCalendar(index, curr_year.value)
    }
    month_list.appendChild(month)
})

let month_picker = calendar.querySelector('#month-picker')

month_picker.onclick = () => {
    month_list.classList.add('show')
}

let currDate = new Date()

let curr_month = {value: currDate.getMonth()}
let curr_year = {value: currDate.getFullYear()}

generateCalendar(curr_month.value, curr_year.value)

document.querySelector('#prev-year').onclick = () => {
    --curr_year.value
    generateCalendar(curr_month.value, curr_year.value)
}

document.querySelector('#next-year').onclick = () => {
    ++curr_year.value
    generateCalendar(curr_month.value, curr_year.value)
}

