const textToType = document.getElementById('text-to-type');
const userInput = document.getElementById('user-input');
const startButton = document.getElementById('start-button');
const resultDiv = document.getElementById('result');
const resultTableBody = document.querySelector('#result-table tbody');
const handMessage = document.createElement('p'); // رسالة توضيح اليد
document.body.insertBefore(handMessage, textToType); // إضافة الرسالة قبل النص

const rows = [
    { text: "asdf", hand: "اليد اليسرى" },
    { text: "ghjkl", hand: "اليد اليمنى" },
    { text: "zxcv", hand: "اليد اليسرى" },
    { text: "bnm", hand: "اليد اليمنى" },
    { text: "qwerty", hand: "اليد اليسرى" },
    { text: "uiop", hand: "اليد اليمنى" },
    { text: "12345", hand: "اليد اليسرى" },
    { text: "67890", hand: "اليد اليمنى" }
];

// ... (بقية الكود كما هو)

let currentIndex = 0;
let startTime;
let correctAnswers = 0;
let totalAnswers = 0;
let testOrder = [];
let studentName = ""; // متغير لتخزين اسم المتدرب

startButton.addEventListener('click', startTest);

function startTest() {
    // طلب اسم المتدرب قبل بدء الاختبار
    studentName = prompt("أدخل اسم المتدرب:");
    if (!studentName) {
        // إذا لم يتم إدخال اسم، نوقف الاختبار
        return;
    }

    testOrder = generateRandomOrder();
    currentIndex = 0;
    correctAnswers = 0;
    totalAnswers = 0;
    displayNextRow();
    startTime = new Date().getTime();
    startButton.disabled = true;
    userInput.value = '';
    userInput.focus();
}

function generateRandomOrder() {
    let order = [];
    for (let i = 0; i < rows.length; i++) {
        order.push(i);
    }
    let randomOrder = [];
    for (let i = 0; i < 4; i++) {
        randomOrder = randomOrder.concat(shuffleArray(order));
    }
    return randomOrder;
}

function shuffleArray(array) {
    let shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}
function displayNextRow() {
    if (currentIndex < testOrder.length) {
        textToType.textContent = rows[testOrder[currentIndex]].text;
        handMessage.textContent = `استخدم ${rows[testOrder[currentIndex]].hand} للكتابة.`; // عرض رسالة اليد
        currentIndex++;
    } else {
        endTest();
    }
}

userInput.addEventListener('input', checkInput);

function checkInput() {
    totalAnswers++;
    if (userInput.value === textToType.textContent) {
        correctAnswers++;
        displayNextRow();
        userInput.value = '';
    }
}

function endTest() {
    const endTime = new Date().getTime();
    const elapsedTime = (endTime - startTime) / 1000; // بالثواني
    const wordsPerMinute = calculateWPM(elapsedTime);
    const accuracy = (correctAnswers / totalAnswers) * 100;

    // استخدام اسم المتدرب الذي تم إدخاله مسبقًا
    const newRow = resultTableBody.insertRow();
    newRow.innerHTML = `
        <td>${studentName}</td>
        <td>${wordsPerMinute} كلمة في الدقيقة</td>
        <td>${accuracy.toFixed(2)}%</td>
    `;
    startButton.disabled = false;
}

function calculateWPM(time) {
    const words = rows.join('').length / 5; // متوسط طول الكلمة 5 أحرف
    return Math.round((words / time) * 60);
}