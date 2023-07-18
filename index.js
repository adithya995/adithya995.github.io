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
    fetch('https://mc-b2x.azurewebsites.net/api/emchat?name='+text,{
      method: 'POST'
    })
      .then(response => {
        if (response.ok) {
          resolve(response.json());
        } else {
          reject(new Error('Request failed with status: ' + response.status));
        }
      })
      .catch(error => {
        reject(error);
      });
  });
}

function output(input) {
  const messagesContainer = document.getElementById("messages");

  let userDiv = document.createElement("div");
  userDiv.id = "user";
  userDiv.className = "user response";
  userDiv.innerHTML = `<img src="user.png" class="avatar"><span>${input}</span>`;
  messagesContainer.appendChild(userDiv);
  let product;

  // Regex remove non word/space chars
  // Trim trailing whitespce
  // Remove digits - not sure if this is best
  // But solves problem of entering something like 'hi1'

  let text = input.toLowerCase().replace(/[^\w\s]/gi, "").replace(/[\d]/gi, "").trim();
  text = text
    .replace(/ a /g, " ")   // 'tell me a story' -> 'tell me story'
    .replace(/i feel /g, "")
    .replace(/whats/g, "what is")
    .replace(/please /g, "")
    .replace(/ please/g, "")
    .replace(/r u/g, "are you");

  if (compare(prompts, replies, text)) { 
    // Search for exact match in `prompts`
    product = compare(prompts, replies, text);
  } else if (text.match(/thank/gi)) {
    product = "You're welcome!"
  } else if (text.match()) {
    fetchData(text)
  .then(data => {
    console.log(data);
    product=data
    setTimeout(addChat(input, product), 2000000);// Process the response data
  })
  .catch(error => {
    console.error('Error:', error);
  });
    	  
  } 
  ;
}

function compare(promptsArray, repliesArray, string) {
  let reply;
  let replyFound = false;
  for (let x = 0; x < promptsArray.length; x++) {
    for (let y = 0; y < promptsArray[x].length; y++) {
      if (promptsArray[x][y] === string) {
        let replies = repliesArray[x];
        reply = replies[Math.floor(Math.random() * replies.length)];
        replyFound = true;
        // Stop inner loop when input value matches prompts
        break;
      }
    }
    if (replyFound) {
      // Stop outer loop when reply is found instead of interating through the entire array
      break;
    }
  }
  return reply;
}

function addChat(input, product) {
  const messagesContainer = document.getElementById("messages");

  let botDiv = document.createElement("div");
  let botImg = document.createElement("img");
  let botText = document.createElement("span");
  let hyperlink = document.createElement('a');
  botDiv.id = "bot";
  botImg.src = "bot-mini.png";
  botImg.className = "avatar";
  botDiv.className = "bot response";
  botText.innerText = "Typing...";
  botDiv.appendChild(botText);
  botDiv.appendChild(botImg);
  messagesContainer.appendChild(botDiv);
  // Keep messages at most recent
  messagesContainer.scrollTop = messagesContainer.scrollHeight - messagesContainer.clientHeight;
  //product=product.replace(/\n/g, '\n')
  let chatresponse=product[0].message
  chatresponse=chatresponse.replace(/\n/g, '\n')
  botText.innerText = `${chatresponse}`;
  botText.innerText+='\n';
  product.forEach(prod => {
    let spanElement = document.createElement('span');     
    let productName = prod.productName;
    let productUrl = prod.productUrl;
    hyperlink.href=productUrl
    hyperlink.innerText='---Click to Purchase this product---'
    let imageUrl = prod.imageUrl;
    spanElement.innerText+='\n\n';
    spanElement.innerText += `${productName}`;
    spanElement.innerText+='\n\n';
    spanElement.innerHTML += '<a href='+productUrl+'>---Click to Purchase this product---</a>';
    botText.appendChild(spanElement);
    let breakelement=document.createElement('br');
    botText.appendChild(breakelement);
    //botText.innerText += `${productUrl}`;
  });
  // Fake delay to seem "real"
  setTimeout(() => {
    //botText.innerText = `${product}`;
  }, 2000
  )

}
