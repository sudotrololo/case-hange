const answer = document.getElementById("answer");
const input = document.getElementById("input");
const type = document.getElementById("type");
const select = document.getElementById("select");
const alive = document.getElementById("alive");
const etcArea = document.getElementById("etc");
const firstInput = document.getElementById("first");
const labelType = document.querySelector(".labelType");
const kirillicAllert = document.querySelector(".kirillicAllert");

let isAlive = alive.checked;

function etc() {
    input.value = "Йцукен";
    tryToGuess();
}

//фокус на основной инпут при нажатии слова "первое"
function goToFirst() {
    input.focus();
}

//основная функция склонения
function tryToGuess() {
    isAlive = alive.checked;
    labelType.classList.remove("alert");
    input.value = input.value.toLowerCase().trim();// защита от капса и пробелов

    if (!input.validity.patternMismatch) {
        //валидация кириллицы
        kirillicAllert.classList.remove("show");
    } else {
        kirillicAllert.classList.add("show");
    }

    if (input.value.length >= 3 && input.value.length < 20 && select.value !== "" && !input.validity.patternMismatch) {
        if (select.value === "nominative") {
            answer.innerHTML = input.value;
            type.innerHTML = "Ваше слово " + typeInference(declensionForm(input.value));
        }

        if (select.value === "genitive") {
            const result = changeСaseToGenitive(input.value);
            answer.innerHTML = result;
            type.innerHTML = "Ваше слово " + typeInference(declensionForm(input.value));
        }

        if (select.value === "dative") {
            const result = changeСaseToDative(input.value);
            answer.innerHTML = result;
            type.innerHTML = "Ваше слово " + typeInference(declensionForm(input.value));
        }

        if (select.value === "accusative") {
            const result = changeСaseToaccusative(input.value);
            answer.innerHTML = result;
            type.innerHTML = "Ваше слово " + typeInference(declensionForm(input.value));
        }

        if (select.value === "instrumental") {
            const result = changeСaseInstrumental(input.value);
            answer.innerHTML = result;
            type.innerHTML = "Ваше слово " + typeInference(declensionForm(input.value));
        }
        if (select.value === "prepositional") {
            const result = changeСasepPepositional(input.value);
            answer.innerHTML = result;
            type.innerHTML = "Ваше слово " + typeInference(declensionForm(input.value));
        }
    } else {
        // валидация длины строки и наличия выбранного падежа
        if (select.value === "") {
            answer.innerHTML = "Падеж не выбран";
            labelType.classList.add("alert");
        } else {
            answer.innerHTML = "";
        }

        if (input.value.length <= 3) {
            type.innerHTML = "Добавьте символы";
        } else if (input.value.length >= 20) {
            type.innerHTML = "Слишком длинное слово!";
        } else {
            type.innerHTML = "";
        }
    }
}

function typeInference(type) {
    switch (type) {
        case "differing":
            return "разносклоняемое";
            break;
        case "indeclinable":
            return "несклоняемое";
            break;
        case "first_declension":
            return "первого склонения";
            break;
        case "second_declension":
            return "второго склонения";
            break;
        case "third_declension":
            return "третьего склонения";
            break;
        default:
            return "неизвестного склонения";
    }
}
