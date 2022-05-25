const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function startApplication() {
  console.log('Adquiriendo recursos de la API...')
  fetch('https://mach-eight.uc.r.appspot.com')
  .then(response => response.json())
  .then(data => {
    // sorting the list of players will give us a great advantange for this task
    startUI(sortPlayersByHeight(data.values))
  })
  .catch(error => console.error(error))
}

function sortPlayersByHeight(players) {
  return players.sort(function (playerA, playerB) {
    return playerA.h_in - playerB.h_in;
  });
}

function startUI(players) {
  const recursiveAsyncReadLine = function () {
    rl.question('Indique la suma de la altura de 2 jugadores de la NBA ', function(answer) {
      if (answer == 'exit') {
        return rl.close();
      }
      // validate sum is a number higher than 2 so at least one pair can be formed
      const sumNumber = Number(answer)
      if (Number.isInteger(sumNumber) && sumNumber > 1) {
        printPairs(players, parseInt(answer))
      } else {
        printNotFound()
      }
      recursiveAsyncReadLine();
    })
  }
  recursiveAsyncReadLine();
}

function shortenPlayersList(players, heightsSum) {
  // find the player index exceeding the maximum allowed height
  let maxMatchingHeight = heightsSum - players[0].h_in
  let topMatchingIndex = players.length - 1
  // check if tallest player is still a posible match
  if (maxMatchingHeight < players[topMatchingIndex].h_in) {
    topMatchingIndex = players.findIndex((player) => player.h_in > maxMatchingHeight) - 1
  }
  return players.slice(0, topMatchingIndex + 1)
}


function printPairs(players, heightsSum) {
  let pairFound = false
  players = shortenPlayersList(players, heightsSum)
  let bottomIndex = 0
  // Using while loops and composed conditions to make sure complexity does not reach cuadratic level
  while(bottomIndex < players.length - 1) {
    // starting to check second player height from the end of list as there is more chance to find matches faster
    let topIndex = players.length - 1
    let currentSum = heightsSum
    // inner loop may break when the current sum starts to be smaller than the input sum
    while(topIndex > bottomIndex && currentSum >= heightsSum) {
      currentSum = parseInt(players[bottomIndex].h_in) + parseInt(players[topIndex].h_in)
      if (currentSum === heightsSum) {
        pairFound = true
        console.log(`- ${players[bottomIndex].first_name} ${players[bottomIndex].last_name}          ${players[topIndex].first_name} ${players[topIndex].last_name}`)
      }
      topIndex--
    }
    bottomIndex++
  }
  if (!pairFound) {
    printNotFound()
  }
}

function printNotFound() {
  console.log('No se encontraron coincidencias')
}

startApplication()
