function declensionForm(noun) {
    const gender = genus(noun);
    //получаем окончание слова
    const { ending } = splitWord(noun);

    //пытаемся определить тип склонения слова, используя правила
    if (differing.includes(noun)) {
        return "differing";
    } else if (indeclinable.includes(noun)) {
        return "indeclinable";
    } else if (ending === "ь" && gender === "female") {
        return "third_declension";
    } else if (ending === "а" || ending === "я" || ending === "ия" || ending === "ья") {
        return "first_declension";
    } else if (ending === "" || ending === "о" || ending[ending.length - 1] === "е" || ending[ending.length - 1] === "ё" || (ending === "ь" && gender === "male")) {
        return "second_declension";
    }

    /* если конец слова (гласная + й) */
    const yEndings = [];
    for (let i = 0; i <= vowels.length; i++) {
        yEndings.push(vowels[i] + "й");
    }

    if (yEndings.includes(ending)) {
        return "second_declension";
    }

    return "undefind_form";
}

// разбиваем слово на компоненты
function splitWord(word) {
    let ending = []; //массив, в который будем складывать концовку

    const letters = word.split("");

    for (let i = letters.length - 1; i > 0; i--) {
        if (partsOfEnding.includes(letters[i])) {
            ending.push(letters.pop(letters[i]));
        } else {
            ending = ending.reverse().join(""); // окончание
            const wordWithoutEnding = letters.join(""); // остаток слова без окончания, понадобится для замены окончаний при склонении
            return { wordWithoutEnding, ending };
        }
    }
}

// Определяем род (только!) для слов с "ь" на конце
function genus(word) {
    //если название месяца, то мужской
    if (months.includes(word)) {
        return "male";
    }
    //слова исключения мужского рода
    if (exceptionsOfTheGenus.includes(word)) {
        return "male";
    }

    const letters = word.split("").reverse();
    const ending = letters.splice(0, 4).reverse().join(""); // определяем конец слова (не окончание)

    if (ending.includes("арь") || ending.includes("тель")) return "male";

    for (let i = 0; i <= femaleEnding.length - 1; i++) {
        if (ending.includes(femaleEnding[i])) {
            return "female";
        }
    }
    return "female"; // на этом наши полномочия "все" :\ (предполагаем, что женский)
}

// далее функции попытки смены падежа слова с правилами и исключениями

/* РОДИТЕЛЬНЫЙ */

function changeСaseToGenitive(word) {
    const { wordWithoutEnding, ending } = splitWord(word);
    const declension = declensionForm(word);
    const lastLetter = wordWithoutEnding[wordWithoutEnding.length - 1]; //последний символ перед анализируемым концом слова

    switch (declension) {
        case "indeclinable":
            return word;
        case "first_declension":
            if (ending === "а" && lastLetter === "к") return wordWithoutEnding + "и";
            if (ending === "а") return wordWithoutEnding + "(и/ы)";
            if (ending === "я") return wordWithoutEnding + "и";
            if (ending === "ия") return wordWithoutEnding + "ию";
            if (ending === "ья") return wordWithoutEnding + "ьи";
            return word;

        case "second_declension":
            if (word.substr([word.length - 2], 2) === "ок") return word.slice(0, -2) + "ка";
            if (ending === "" && isAlive) return wordWithoutEnding + "а";
            if (ending === "") return word;
            if (ending === "а") return wordWithoutEnding + "у";
            if (ending === "о") return wordWithoutEnding + "а";
            if (ending === "ай") return wordWithoutEnding + "ая";
            if (ending === "ий" && isAlive) return wordWithoutEnding + "ия";
            if (ending === "ий") return word;
            if (ending === "ей" && lastLetter === "м") return wordWithoutEnding + "ея";
            if (ending === "ей" && isAlive) return wordWithoutEnding + "ея";
            if (ending === "ей") return wordWithoutEnding + "ея";
            if (ending === "ой") return wordWithoutEnding + "оя";
            if (ending === "ь") return wordWithoutEnding + "я";
            if (ending === "е") return wordWithoutEnding + "я";
            if (ending === "ьё" || ending === "ье") return wordWithoutEnding + "ья";
            return word;

        case "third_declension":
            return word;
        case "differing":
            return word;
        default:
            return word; //определить не удалось
    }
}

/* ДАТЕЛЬНЫЙ */

function changeСaseToDative(word) {
    const { wordWithoutEnding, ending } = splitWord(word);
    const declension = declensionForm(word);

    const lastLetter = wordWithoutEnding[wordWithoutEnding.length - 1];

    switch (declension) {
        case "indeclinable":
            return word;

        case "first_declension":
            if (ending === "а") return wordWithoutEnding + "е";
            if (ending === "я") return wordWithoutEnding + "е";
            if (ending === "ия") return wordWithoutEnding + "(ии/ие)";
            return word;

        case "second_declension":
            if (word.substr([word.length - 2], 2) === "ок") return word.slice(0, -2) + "ку";
            if (ending === "" && isAlive) return wordWithoutEnding + "у";
            if (ending === "") return wordWithoutEnding + "у";
            if (ending === "о") return wordWithoutEnding + "у";
            if (ending === "е") return wordWithoutEnding + "ю";
            if (ending === "ей" && lastLetter === "м") return wordWithoutEnding + "ею";
            if (ending === "ей") return wordWithoutEnding + "ею";
            if (ending === "ий") return wordWithoutEnding + "ию";
            if (ending === "ие") return wordWithoutEnding + "ию";
            if (ending === "ай") return wordWithoutEnding + "аю";
            if (ending === "ой") return wordWithoutEnding + "ою";
            if (ending === "ьё" || ending === "ье") return wordWithoutEnding + "ью";
            if (ending === "ь") return wordWithoutEnding + "ю";

            return word;
        case "third_declension":
            if (ending === "ь") return wordWithoutEnding + "и";
            return word;
        case "differing":
            if (ending === "ь") return wordWithoutEnding + "и";
            if (ending === "я") return wordWithoutEnding + "ени";
            return word;
        default:
            return word; //определить не удалось
    }
}

/* ВИНИТЕЛЬНЫЙ */

function changeСaseToaccusative(word) {
    const { wordWithoutEnding, ending } = splitWord(word);
    const declension = declensionForm(word);

    const lastLetter = wordWithoutEnding[wordWithoutEnding.length - 1];

    switch (declension) {
        case "indeclinable":
            return word;

        case "first_declension":
            if (ending === "а") return wordWithoutEnding + "у";
            if (ending === "я") return wordWithoutEnding + "ю";
            if (ending === "ия") return wordWithoutEnding + "ию";
            if (ending === "ья") return wordWithoutEnding + "ью";
            return word;

        case "second_declension":
            if (ending === "" && isAlive) return wordWithoutEnding + "а";
            if (ending === "") return word;
            if (ending === "ий") return wordWithoutEnding + "ия";
            if (ending === "ой" && isAlive) return wordWithoutEnding + "оя";
            if (ending === "ой") return wordWithoutEnding + "ой";
            if (ending === "ей" && isAlive) return wordWithoutEnding + "ея";
            if (ending === "ей") return wordWithoutEnding + "ея";
            if (ending === "ай" && isAlive) return wordWithoutEnding + "ая";
            if (ending === "ай") return wordWithoutEnding + "ай";
            if (ending === "ие") return wordWithoutEnding + "ие";
            if (ending === "ь") return wordWithoutEnding + "я";

            return word;
        case "third_declension":
            return word;
        case "differing":
            return word;

        default:
            return word; //определить не удалось
    }
}

/* ТВОРИТЕЛЬНЫЙ */

function changeСaseInstrumental(word) {
    const { wordWithoutEnding, ending } = splitWord(word);
    const declension = declensionForm(word);

    const lastLetter = wordWithoutEnding[wordWithoutEnding.length - 1];

    switch (declension) {
        case "indeclinable":
            return word;

        case "first_declension":
            if (ending === "а") return wordWithoutEnding + "ой";
            if (ending === "я") return wordWithoutEnding + "ей";
            if (ending === "ья") return wordWithoutEnding + "ей";
            if (ending === "ия") return wordWithoutEnding + "ей";
            return word;

        case "second_declension":
            if (word.substr([word.length - 2], 2) === "ок") return word.slice(0, -2) + "ком";
            if (ending === "е") return wordWithoutEnding + "ем";
            if (ending === "о") return wordWithoutEnding + "ом";
            if (ending === "ие") return wordWithoutEnding + "ием";
            if (ending === "") return wordWithoutEnding + "ом";
            if (ending === "ай") return wordWithoutEnding + "аем";
            if (ending === "ой") return wordWithoutEnding + "оем";
            if (ending === "ий") return wordWithoutEnding + "ием";
            if (ending === "ей") return wordWithoutEnding + "еем";
            if (ending === "ьё" || ending === "ье") return wordWithoutEnding + "ьем";
            if (ending === "ь") return wordWithoutEnding + "ем";
            return word;

        case "differing":
            if (ending === "е") return wordWithoutEnding + "ем";
            if (ending === "е") return wordWithoutEnding + "ем";
            if (ending === "я") return wordWithoutEnding + "енем";
            if (ending === "ие") return wordWithoutEnding + "ием";
            if (ending === "") return wordWithoutEnding + "ом";
            if (ending === "ай") return wordWithoutEnding + "аем";
            if (ending === "ой") return wordWithoutEnding + "оем";
            if (ending === "ий") return wordWithoutEnding + "ием";
            if (ending === "ей") return wordWithoutEnding + "еем";
            if (ending === "ьё" || ending === "ье") return wordWithoutEnding + "ьем";
            if (ending === "ь") return wordWithoutEnding + "ем";
            return word;

        case "third_declension":
            if (ending === "ь") return wordWithoutEnding + "ью";

        default:
            return word; //определить не удалось
    }
}

/* ПРЕДЛЖНЫЙ */

function changeСasepPepositional(word) {
    const { wordWithoutEnding, ending } = splitWord(word);
    const declension = declensionForm(word);

    const lastLetter = wordWithoutEnding[wordWithoutEnding.length - 1];

    switch (declension) {
        case "indeclinable":
            return word;

        case "first_declension":
            if (ending === "а") return "о " + wordWithoutEnding + "е";
            if (ending === "я") return "о " + wordWithoutEnding + "е";
            if (ending === "ья") return "о " + wordWithoutEnding + "ье";
            if (ending === "ия") return "о " + wordWithoutEnding + "ии";
            return word;

        case "second_declension":
            if (word.substr([word.length - 2], 2) === "ок") return word.slice(0, -2) + "ке";
            if (ending === "ь") return "о " + wordWithoutEnding + "е";
            if (ending === "") return "о " + wordWithoutEnding + "е";
            if (ending === "о") return "о " + wordWithoutEnding + "е";
            if (ending === "ой") return "о " + wordWithoutEnding + "ое";
            if (ending === "ай") return "о " + wordWithoutEnding + "ае";
            if (ending === "ие") return "о " + wordWithoutEnding + "ии";
            if (ending === "ий") return "о " + wordWithoutEnding + "ии";
            if (ending === "ей") return "о " + wordWithoutEnding + "ее";
            if (ending === "ье" || ending === "ьё") return "о " + wordWithoutEnding + "ье";
            return "о " + word;
        case "third_declension":
            if (ending === "ь") return "о " + wordWithoutEnding + "и";
            return word;
        case "differing":
            if (ending === "ь") return "о " + wordWithoutEnding + "и";
            if (ending === "я" && lastLetter === "т") return "о " + wordWithoutEnding + "е";
            if (ending === "я") return "о " + wordWithoutEnding + "ени";
            return word;

        default:
            return word; //определить не удалось
    }
}
