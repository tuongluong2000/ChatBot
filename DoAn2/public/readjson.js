const fs = require('fs');


function jsonReader(filePath, cb) {
    fs.readFile(filePath, (err, fileData) => {
      if (err) {
        return cb && cb(err);
      }
      try {
        const object = JSON.parse(fileData);
        return cb && cb(null, object);
      } catch (err) {
        return cb && cb(err);
      }
    });
  }

async function prepareCorpus() {
    jsonReader("./corpus.json",async (err, input) => {
        if (err) {
          console.log("Error reading file:", err);
          return;
        }

        for (let i = 0; i < input.data.length; i += 1) {
            for (let j = 0; j < input.data[i].answers.length; j += 1) {     
              input.data[i].answers[j] = await TranslateEntoVi(input.data[i].answers[j]);
            }
          }
        // increase customer order count by 1
        await fs.writeFile("./corpus.json", JSON.stringify(input,null,4), err => {
          if (err) console.log("Error writing file:", err);
        });
      });
  }


  model.forEach(async function(value){
    value.data.forEach(async function(da){
      console.log(da)
    })
  })
  

  function jsonReader(filePath, cb) {
    fs.readFile(filePath, (err, fileData) => {
      if (err) {
        return cb && cb(err);
      }
      try {
        const object = JSON.parse(fileData);
        return cb && cb(null, object);
      } catch (err) {
        return cb && cb(err);
      }
    });
  }

async function prepareCorpus() {
    jsonReader("./data.json",async (err, input) => {
        if (err) {
          console.log("Error reading file:", err);
          return;
        }

        for (let i = 0; i < input.data.length; i += 1) {
            input.data[i].intent = "house." + await Translate(input.data[i].intent);
            for (let j = 0; j < input.data[i].utterances.length; j += 1) {     
              input.data[i].utterances[j] = await Translate(input.data[i].utterances[j]);
            }
          }
        // increase customer order count by 1
        await fs.writeFile("./data.json", JSON.stringify(input,null,4), err => {
          if (err) console.log("Error writing file:", err);
        });
      });
  }
