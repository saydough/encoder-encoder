document.getElementById('addWeekBtn').addEventListener('click', addWeek);

let weekCount = 0;
let existingCourseData = {}; 
let newCourseData = {}; 

function addWeek() {
    weekCount++;
    const weeksContainer = document.getElementById('weeksContainer');

    const weekDiv = document.createElement('div');
    weekDiv.classList.add('week');
    weekDiv.id = `week${weekCount}`;

    weekDiv.innerHTML = `
        <h3>Week ${weekCount}</h3>
        <button type="button" onclick="removeWeek(this)">Delete Week</button>
        ${generateInputFields('Objective', 4, weekCount)}
        ${generateInputFields('Subtopic', 4, weekCount)}
        ${generateInitialInputFields('Activity', 2, weekCount)}
        <div id="activityContainer${weekCount}"></div>
        <button type="button" onclick="addField('Activity', ${weekCount}, 2)">Add Activity</button>
        ${generateInitialInputFields('Technology Utilized', 2, weekCount)}
        <div id="technologyutilizedContainer${weekCount}"></div>
        <button type="button" onclick="addField('Technology Utilized', ${weekCount}, 2)">Add Technology Utilized</button>
    `;

    weeksContainer.appendChild(weekDiv);
}

function generateInputFields(label, count, weekCount) {
    let html = '';
    const labelLower = label.toLowerCase().replace(/ /g, '');
    for (let i = 1; i <= count; i++) {
        html += `
            <label for="${labelLower}${weekCount}_${i}">${label} ${i}:</label>
            <input type="text" id="${labelLower}${weekCount}_${i}" name="${labelLower}${weekCount}_${i}" required>
        `;
    }
    return html;
}

function generateInitialInputFields(label, count, weekCount) {
    let html = '';
    const labelLower = label.toLowerCase().replace(/ /g, '');
    for (let i = 1; i <= count; i++) {
        html += `
            <label for="${labelLower}${weekCount}_${i}">${label} ${i}:</label>
            <input type="text" id="${labelLower}${weekCount}_${i}" name="${labelLower}${weekCount}_${i}" required>
        `;
    }
    return html;
}

function addField(label, weekCount, initialCount) {
    const labelLower = label.toLowerCase().replace(/ /g, '');
    const container = document.getElementById(`${labelLower}Container${weekCount}`);
    const inputs = container.querySelectorAll(`input[id^=${labelLower}${weekCount}_]`);
    const nextIndex = initialCount + inputs.length + 1;

    const newField = document.createElement('div');
    newField.innerHTML = `
        <label for="${labelLower}${weekCount}_${nextIndex}">${label} ${nextIndex}:</label>
        <input type="text" id="${labelLower}${weekCount}_${nextIndex}" name="${labelLower}${weekCount}_${nextIndex}" required>
        <button type="button" onclick="removeField(this)">Delete</button>
    `;

    container.appendChild(newField);
}

function removeField(button) {
    const fieldDiv = button.parentNode;
    fieldDiv.remove();
}

function removeWeek(button) {
    const weekDiv = button.closest('.week');
    weekDiv.remove();

    updateWeekIndexes();
}

function updateWeekIndexes() {
    const weeksContainer = document.getElementById('weeksContainer');
    const weeks = weeksContainer.querySelectorAll('.week');
    
    weekCount = 0; // Reset week count
    weeks.forEach((weekDiv, index) => {
        weekCount = index + 1; // Update week count
        weekDiv.id = `week${weekCount}`;
        weekDiv.querySelector('h3').textContent = `Week ${weekCount}`;

        ['objective', 'subtopic', 'activity', 'technologyutilized'].forEach(label => {
            const container = weekDiv.querySelector(`#${label}Container${weekCount}`);
            if (container) {
                const inputs = container.querySelectorAll(`input[id^=${label}${weekCount}_]`);
                inputs.forEach((input, idx) => {
                    const newIndex = idx + 1;
                    input.id = `${label}${weekCount}_${newIndex}`;
                    input.name = `${label}${weekCount}_${newIndex}`;
                    input.previousElementSibling.textContent = `${label.charAt(0).toUpperCase() + label.slice(1)} ${newIndex}:`;
                });
            }
        });
    });
}

document.getElementById('courseForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const filename = formData.get('filename');

    if (!filename) {
        alert('Please enter a filename.');
        return;
    }

    newCourseData = {
        course_title: formData.get('courseTitle'),
        course_description: formData.get('courseDescription'),
        course_outcome: [
            formData.get('courseOutcome1'),
            formData.get('courseOutcome2'),
            formData.get('courseOutcome3')
        ],
        week: {}
    };

    for (let [key, value] of formData.entries()) {
        if (key.startsWith('objective') || key.startsWith('subtopic') || key.startsWith('activity') || key.startsWith('technologyutilized')) {
            const [label, weekNum] = key.match(/([a-z]+)(\d+)/).slice(1, 3);
            const weekKey = `week_${weekNum}`;
            if (!newCourseData.week[weekKey]) {
                newCourseData.week[weekKey] = { objectives: [], subtopics: [], activities: [], technologies_utilized: [] };
            }
            newCourseData.week[weekKey][label === 'objective' ? 'objectives' : label === 'subtopic' ? 'subtopics' : label === 'activity' ? 'activities' : 'technologies_utilized'].push(value);
        }
    }

    existingCourseData = { courses: [newCourseData] };

    triggerDownload(existingCourseData, filename);
    
    event.target.reset();
    
    document.getElementById('weeksContainer').innerHTML = '';
    weekCount = 0;
});

function triggerDownload(data, filename) {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
