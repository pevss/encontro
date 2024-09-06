const wait = function (seconds) {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
};

let currentSection = 0;

const answers = {
    isGoingOut: null,
    timesHoveredNo: 0,
    selectedPlan: null,
    cellphone: null,
};

const shyButtons = document.querySelectorAll(".shy");
const question = document.querySelector(".question");
const nextButtons = document.querySelectorAll(".next");
const sections = document.querySelectorAll("section");
const options = document.querySelectorAll(".option");
const sheSaidYesButton = document.querySelector(".she-said-yes");
const phoneNumberForm = document.querySelector(".phone-number-form");
const submitNumberFormButton = document.querySelector(".submit-number");
const showAfterSubmit = document.querySelector(".show-aftersubmit");

nextButtons.forEach(button => {
    button.addEventListener("click", function (e) {
        if (currentSection === sections.length - 1) return;

        sections[currentSection].classList.add("hidden");
        currentSection++;
        sections[currentSection].classList.remove("hidden");
    });
});

shyButtons.forEach(button => {
    button.addEventListener("mouseenter", function (e) {
        const target = e.target;
        const parent = target.parentElement;

        const isNegative = Math.round(Math.random());

        const randomX = Math.floor(Math.random() * 200);
        const randomY = Math.floor(Math.random() * 200);

        e.target.style.translate = isNegative ? `${-randomX}px ${-randomY}px` : `${randomX}px ${randomY}px`;

        answers.timesHoveredNo = ++answers.timesHoveredNo || 1;

        if (parent) {
            const siblings = [...parent.querySelectorAll("*")].filter(element => !element.isEqualNode(e.target));

            siblings.forEach(sibling => sibling.style.scale = 1 + (answers.timesHoveredNo / 50))
        };
    });
});

sheSaidYesButton.addEventListener("click", () => {
    let currentOption = 0;

    answers.isGoingOut = true;

    const revealOptions = setInterval(async () => {
        if (currentOption === options.length - 1) clearInterval(revealOptions);

        const currentOptionElement = options[currentOption];

        currentOptionElement.classList.remove("hidden");
        await wait(.1);
        currentOptionElement.style.opacity = 1;

        currentOption++
    }, 5000);
});

options.forEach(option => {
    option.addEventListener("click", (e) => answers.selectedPlan = e.target.textContent);
});

phoneNumberForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = Object.fromEntries([...new FormData(phoneNumberForm)]);

    answers.cellphone = formData.number;

    submitNumberFormButton.disabled = true;

    await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            service_id: "ola_gatinha",
            template_id: "template_a10t7cc",
            user_id: "idCZWsNs3wGgSfJ9r",
            template_params: {
                timesHoveredNo: answers.timesHoveredNo,
                selectedPlan: answers.selectedPlan,
                cellphone: answers.cellphone,
            },
        }),
    });

    submitNumberFormButton.disabled = false;

    showAfterSubmit.classList.remove("hidden");
});

// on mount
(async function () {
    await wait(4);
    question.classList.remove("hidden");
    await wait(.1);
    question.style.opacity = 1;
})();
