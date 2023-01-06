const Lookup = require('./Lookup');

class CorpusLookup {
  constructor(features, intents) {
    if (features) {
      this.inputLookup = new Lookup();
      this.outputLookup = new Lookup();
      for (let i = 0; i < features.length; i += 1) {
        this.inputLookup.add(features[i]);
      }
      for (let i = 0; i < intents.length; i += 1) {
        this.outputLookup.add(intents[i]);
      }
      this.numInputs = this.inputLookup.items.length;
      this.numOutputs = this.outputLookup.items.length;
    }
  }

  build(corpus) {
    this.inputLookup = new Lookup(corpus, 'input');
    this.outputLookup = new Lookup(corpus, 'output');
    this.numInputs = this.inputLookup.items.length;
    this.numOutputs = this.outputLookup.items.length;
    const result = [];
    console.log (corpus)
    for (let i = 0; i < corpus.length; i += 1) {
      const { input, output } = corpus[i];
      const a = this.inputLookup.prepare(input);
      const b = this.outputLookup.prepare(output);
      console.log (a)
      console.log (b)
      result.push({
        input: a,
        output: b,
      });
    }
    return result;
  }

  transformInput(input) {
    return this.inputLookup.prepare(input);
  }
}

module.exports = CorpusLookup;
