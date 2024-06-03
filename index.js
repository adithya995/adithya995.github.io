document.addEventListener("DOMContentLoaded", () => {
  const inputField = document.getElementById("input");
  inputField.addEventListener("keydown", (e) => {
    if (e.code === "Enter") {
      let input = inputField.value;
      inputField.value = "";
      output(input);
    }
  });
});

function fetchData(text) {
  return new Promise((resolve, reject) => {
    fetch('https://mc-b2x.azurewebsites.net/api/emchat?name=' + text, {
      method: 'POST'
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          reject(new Error('Request failed with status: ' + response.status));
        }
      })
      .then(data => resolve(data))
      .catch(error => reject(error));
  });
}

function output(input) {
  const messagesContainer = document.getElementById("messages");

  let userDiv = document.createElement("div");
  userDiv.id = "user";
  userDiv.className = "user response";
  userDiv.innerHTML = `<img src="user.png" class="avatar"><span>${input}</span>`;
  messagesContainer.appendChild(userDiv);

  let text = input.toLowerCase().replace(/[^\w\s]/gi, "").replace(/[\d]/gi, "").trim();
  text = text
    .replace(/ a /g, " ")
    .replace(/i feel /g, "")
    .replace(/whats/g, "what is")
    .replace(/please /g, "")
    .replace(/ please/g, "")
    .replace(/r u/g, "are you");

  if (compare(prompts, replies, text)) {
    let product = compare(prompts, replies, text);
    addChat(input, product);
  } else if (text.match(/thank/gi)) {
    let product = "You're welcome!";
    addChat(input, product);
  } else {
    fetchData(text)
      .then(data => {
        addChat(input, data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
}

function compare(promptsArray, repliesArray, string) {
  for (let x = 0; x < promptsArray.length; x++) {
    for (let y = 0; y < promptsArray[x].length; y++) {
      if (promptsArray[x][y] === string) {
        let replies = repliesArray[x];
        return replies[Math.floor(Math.random() * replies.length)];
      }
    }
  }
  return null;
}

function addChat(input, product) {
  const messagesContainer = document.getElementById("messages");

  let botDiv = document.createElement("div");
  botDiv.id = "bot";
  botDiv.className = "bot response";

  let botImg = document.createElement("img");
  botImg.src = "bot-mini.png";
  botImg.className = "avatar";

  let botText = document.createElement("span");
  botText.innerText = "Typing...";
  
  botDiv.appendChild(botImg);
  botDiv.appendChild(botText);
  messagesContainer.appendChild(botDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight - messagesContainer.clientHeight;

  setTimeout(() => {
    if (typeof product === 'string') {
      botText.innerText = product;
    } else {
      let chatResponse = product[0].message.replace(/\n/g, '\n');
      botText.innerText = chatResponse;

      product.forEach(prod => {
        let productElement = document.createElement('div');

        let productName = document.createElement('span');
        productName.innerText = prod.productName;
        productElement.appendChild(productName);

        let productLink = document.createElement('a');
        productLink.href = prod.productUrl;
        productLink.innerText = '---Click to Purchase this product---';
        productElement.appendChild(productLink);

        let productImage = document.createElement('img');
        productImage.src = prod.imageUrl;
        productImage.className = 'prodclass';
        productElement.appendChild(productImage);

        botDiv.appendChild(productElement);
      });
    }
    messagesContainer.scrollTop = messagesContainer.scrollHeight - messagesContainer.clientHeight;
  }, 1000);
}
