// Function

const getSum = function (multiplier, ...args) {
    let result = 0;
    for (let el of args) {
        result += +el;
    }

    return result * +multiplier;
};

// Example

while (true) {
    let input = prompt('Введите аргументы через запятую (или Стоп чтобы завершить работу):');

    if (input == 'Стоп' || input === null) {
        break;
    } else {
        alert(`Ваш ответ: ${getSum(...input.split(','))}`);
    }
}