const courses = [
    {
        subject: 'CSE',
        number: 110,
        title: 'Introduction to Programming',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course will introduce students to programming. It will introduce the building blocks of programming languages (variables, decisions, calculations, loops, array, and input/output) and use them to solve problems.',
        technology: [
            'Python'
        ],
        completed: true
    },
    {
        subject: 'WDD',
        number: 130,
        title: 'Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course introduces students to the World Wide Web and to careers in web site design and development. The course is hands on with students actually participating in simple web designs and programming. It is anticipated that students who complete this course will understand the fields of web design and development and will have a good idea if they want to pursue this degree as a major.',
        technology: [
            'HTML',
            'CSS'
        ],
        completed: true
    },
    {
        subject: 'CSE',
        number: 111,
        title: 'Programming with Functions',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'CSE 111 students become more organized, efficient, and powerful computer programmers by learning to research and call functions written by others; to write, call , debug, and test their own functions; and to handle errors within functions. CSE 111 students write programs with functions to solve problems in many disciplines, including business, physical science, human performance, and humanities.',
        technology: [
            'Python'
        ],
        completed: true
    },
    {
        subject: 'CSE',
        number: 210,
        title: 'Programming with Classes',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course will introduce the notion of classes and objects. It will present encapsulation at a conceptual level. It will also work with inheritance and polymorphism.',
        technology: [
            'C#'
        ],
        completed: true
    },
    {
        subject: 'WDD',
        number: 131,
        title: 'Dynamic Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course builds on prior experience in Web Fundamentals and programming. Students will learn to create dynamic websites that use JavaScript to respond to events, update content, and create responsive user experiences.',
        technology: [
            'HTML',
            'CSS',
            'JavaScript'
        ],
        completed: true
    },
    {
        subject: 'WDD',
        number: 231,
        title: 'Frontend Web Development I',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course builds on prior experience with Dynamic Web Fundamentals and programming. Students will focus on user experience, accessibility, compliance, performance optimization, and basic API usage.',
        technology: [
            'HTML',
            'CSS',
            'JavaScript'
        ],
        completed: false
    }
]

const filterAllBtn = document.querySelector("#filter-all-btn");
const filterWddBtn = document.querySelector("#filter-wdd-btn");
const filterCseBtn = document.querySelector("#filter-cse-btn");

filterAllBtn.addEventListener('click', () => {
    document.querySelectorAll('#filter-list button').forEach(btn => btn.classList.remove('current'));
    filterAllBtn.classList.toggle('current');
    filterCourses('all');
});

filterWddBtn.addEventListener('click', () => {
    document.querySelectorAll('#filter-list button').forEach(btn => btn.classList.remove('current'));
    filterWddBtn.classList.add('current');
    filterCourses('WDD');
});

filterCseBtn.addEventListener('click', () => {
    document.querySelectorAll('#filter-list button').forEach(btn => btn.classList.remove('current'));
    filterCseBtn.classList.add('current');
    filterCourses('CSE');
});

function filterCourses(subject) {
    const courseList = document.querySelector('#course-list');

    let filteredCourses;
    if (subject === 'all') {
        filteredCourses = courses;
    } else {
        filteredCourses = courses.filter(course => course.subject === subject);
    }

    courseList.innerHTML = '';
    filteredCourses.forEach((course) => {
        const li = document.createElement('li');
        if (course.completed) li.className = 'completed';
        li.innerHTML = `<p>${course.subject} ${course.number}</p>`;
        li.addEventListener('click', () => {
            displayCourseDetails(course);
        });
        courseList.appendChild(li);
    });

    const totalCredits = filteredCourses.reduce((sum, course) => sum + course.credits, 0);
    document.querySelector('#total-credits').textContent = `The total credits for courses listed above is ${totalCredits}`;
}

document.addEventListener('DOMContentLoaded', () => {
    filterAllBtn.classList.add('current');
    filterCourses('all');
});

const modal = document.querySelector('#myModal');
const closeModal = document.querySelector('#closeModal');

//modal.showModal(); // display the modal dialog right away.
// Usually you will want to wait for a user action to show the modal dialog
closeModal.addEventListener('click', () => {
    modal.close();
});

const courseDetails = document.querySelector("#course-details");

function displayCourseDetails(course) {
    courseDetails.innerHTML = '';
    courseDetails.innerHTML = `
    <button id="closeModal">❌</button>
    <h2>${course.subject} ${course.number}</h2>
    <h3>${course.title}</h3>
    <p><strong>Credits</strong>: ${course.credits}</p>
    <p><strong>Certificate</strong>: ${course.certificate}</p>
    <p>${course.description}</p>
    <p><strong>Technologies</strong>: ${course.technology.join(', ')}</p>
  `;
    courseDetails.showModal();

    const closeModalBtn = courseDetails.querySelector("#closeModal");
    closeModalBtn.addEventListener("click", () => {
        courseDetails.close();
    });
}