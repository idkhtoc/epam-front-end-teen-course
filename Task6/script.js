// Task
function nameSort(arr, direction = true) {
    if (Array.isArray(arr)) {
        return arr.sort((a, b) => {
            return direction ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        });
    } else { throw Error("You are trying to sort something except Array(") }
}

const contacts = [
    {
        name: 'Tom',
        phoneNumber: '098-76-54-352'
    },
    {
        name: 'Peter',
        phoneNumber: '098-54-54-652'
    },
    {
        name: 'Anna',
        phoneNumber: '050-711-21-21'
    }
];

nameSort(contacts, true);

console.log(contacts);