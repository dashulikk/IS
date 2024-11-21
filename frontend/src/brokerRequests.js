const host = "http://13.60.236.147:5000";

const getStockPrice = (stock_name) => {
    return fetch(`${host}/get_stock_price`, {
        method: "POST",  // Change to POST request
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            stock: `${stock_name}`  // Send the stock parameter in the body
        })
    });
};

const createUser = (username, password) => {
    fetch(`${host}/create_user`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: `${username}`,
            password: `${password}`
        })
    })
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => console.error("Error creating a user:", error));
}

const loginUser = (username, password) => {
    return fetch(`${host}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: `${username}`,
            password: `${password}`
        })
    });
}

const getBalance = (token) => {
    return fetch(`${host}/get_balance`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });
}

const topUp = (token, amount) => {
    return fetch(`${host}/topup`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            amount: `${amount}`,
        })
    });
}

const getPortfolio = (token) => {
    return fetch(`${host}/get_portfolio`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
}

const buyStock = (token, stock, amount) => {
    return fetch(`${host}/buy`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            stock: `${stock}`,
            amount: `${amount}`,
        })
    });
}

const sellStock = (token, stock, amount) => {
    return fetch(`${host}/sell`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            stock: `${stock}`,
            amount: `${amount}`,
        })
    });
}

export { getStockPrice, createUser, loginUser, getBalance, topUp, getPortfolio, buyStock, sellStock };
