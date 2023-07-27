const fs = require('fs').promises;


function isValidInput(input) {
//This Regular Expression will help check if the input contains only letters (upper/lower) and numbers
  const regex = /^[a-zA-Z0-9]+$/;
  return regex.test(input);
}

//reads the input file and filter elements with valid input
async function readInputFile(file) {
  try {
    //Read the content of the file
    const content = await fs.readFile(file, 'utf-8');

    //Split the content by commas and remove whitespace
    const elements = content.split(',').map((element) => element.trim());

    //This will filter the elements that contain only letters and numbers
    return elements.filter((element) => isValidInput(element));
  } catch (error) {
    throw new Error('Error reading the file: ' + error.message);
  }
}

//Step 1: Counts the occurrences of all elements and return a sorted result object
function step1(elements) {
  //Create an empty object to help store the count of each element
  const countMap = {};

  //Iterate through the elements and count occurrences
  elements.forEach((element) => {
    countMap[element] = (countMap[element] || 0) + 1;
  });

  //Sort the countMap in ascending order based on the values (count). If counts are equal, sort by the keys (elements) in ascending order
  const sortedResult = Object.fromEntries(
    Object.entries(countMap).sort((a, b) => {
      const countDiff = a[1] - b[1];
      if (countDiff !== 0) {
        return countDiff;
      } else {
        return a[0].localeCompare(b[0]);
      }
    })
  );

  return sortedResult;
}

//Step 2: Return an object with element counts and indices
function step2(elements) {
  //Create an empty object to store the indices of each element
  const indicesMap = {};

  //Goes through each element and keeps track of their indices
  elements.forEach((element, index) => {
    if (!indicesMap[element]) {
      indicesMap[element] = [index];
    } else {
      indicesMap[element].push(index);
    }
  });

  return indicesMap;
}

//Step 3: Combine the results from Step 1 and Step 2
function step3(step1Result, step2Result) {
  //This will store the combined result
  const combinedResult = [];

  //Loop through the unique elements in step1Result
  for (const key in step1Result) {
    combinedResult.push({
      [key]: {
      count: step1Result[key],
      indices: step2Result[key],
      },
    });
  }

  return combinedResult;
}

//Main function (performs the entire process)
(async () => {
  //Verify if the script is called with the right number of arguments
  if (process.argv.length !== 3) {
    console.error('Usage: node your_script.js file_to_read.txt');
    process.exit(1);
  }

  //Retrieve the input file path from the command line arguments
  const inputFile = process.argv[2];

  try {
    //Step 1: Read the input file and filter valid elements
    const elements = await readInputFile(inputFile);

    //Step 2: Count occurrences of each element and store their indices
    const resultStep1 = step1(elements);
    const resultStep2 = step2(elements);

    //Step 3: Combine the results of Step 1 and Step 2
    const combinedResult = step3(resultStep1, resultStep2);

    //Print the final output in a readable format
    console.log(JSON.stringify(combinedResult, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
