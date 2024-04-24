// Task 1

const login = prompt('Enter login:');
if (login == 'Admin') {
    const password = prompt('Enter password:');
    if (password == '12345') {
        alert('Welcome!');
    } else {
        alert('Password is not correct(');
    }
} else {
    alert('Access is denied');
}

// Task 2

const m = +prompt('Enter first value:'),
      n = +prompt('Enter second value:');
let result = 1;

for (let i = m; i <= n; i++) {
    if (i % 2 != 0) {
        result *= i;
    }
}
console.log(result);