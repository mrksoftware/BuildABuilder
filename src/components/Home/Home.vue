<template>
  <v-container fluid style="min-height: 0;" grid-list-lg>
    <v-layout row wrap>

      <v-flex xs12>
        <v-layout column xs12>
          <span class="sectionTitle mb-0 ml-1">Domain class</span>
          <span class="mb-1 ml-1 mt-0">Copy here your class structure</span>
        </v-layout>
        <textarea class="inputTextArea elevation-2" v-model="inputClass"></textarea>

        <v-btn  xs12 
                @click.stop="buildButtonClicked"
                block 
                dark 
                class="mb-3 mt-3 red darken-2">
          Build
        </v-btn>

        <div :class="{hidden: isResultHidden}">
          <v-layout column xs12>
            <span class="sectionTitle mb-0 ml-1">Result</span>
            <span class="mb-1 ml-1 mt-0">Enjoy your brand new builder</span>
          </v-layout>
          <textarea readonly class="outputTextArea elevation-2" v-model="outputBuilder"></textarea>
          <v-layout row-sm column-xs xs12 child-flex-sm>
            <v-btn class='success text-xs-center' v-clipboard:copy="outputBuilder" v-clipboard:success="copyRequested" v-clipboard:error="showErrorDuringCopy">
              Copy to clipboard
              <v-icon right dark>content_copy</v-icon>
            </v-btn>
            <v-btn class='primary text-xs-center' v-clipboard:copy="outputBuilder" v-clipboard:success="cutRequested" v-clipboard:error="showErrorDuringCopy">
              Cut to clipboard
              <v-icon right dark>content_cut</v-icon>
            </v-btn>
          </v-layout>
        </div>
      </v-flex>

    </v-layout>

    <v-snackbar :timeout="timeout"
                :success="context === 'success'"
                :info="context === 'info'"
                :warning="context === 'warning'"
                :error="context === 'error'"
                :primary="context === 'primary'"
                :secondary="context === 'secondary'"
                :multi-line="mode === 'multi-line'"
                :vertical="mode === 'vertical'"
                v-model="snackbar">
      <v-icon class="mr-2" dark>{{ snackbarIcon }}</v-icon>
      {{ snackbarText }}
      <v-btn class="ml-1" dark flat @click.native="snackbar = false">Close</v-btn>
    </v-snackbar>

  </v-container>
</template>

<script>
export default {
  data () {
    return {
      isResultHidden: true,
      inputClass: '',
      outputBuilder: '',
      snackbar: false,
      timeout: 4000,
      context: 'success',
      mode: 'vertical',
      snackbarText: '',
      snackbarIcon: ''
    }
  },
  methods: {
    buildButtonClicked: function () {
      if (this.isResultHidden && this.inputClass) {
        this.isResultHidden = false
      }

      var classPattern = /public\s+class\s*(\S*)/g
      var propPattern = /public\s+virtual\s+(\S*)\s+(\S*)\s*{\s*get;\s*(?:protected|\S*)\s*(?:internal|\S*)\s*set;\s*}/g
      var privateBagPattern = /protected\s+(IList|IEnumerable|List|IObservable|ObservableCollection)<(\S*)>\s*(\S*)\s*=\s*new\s*(?:List|ObservableCollection)<\2>\(\s*\);/g
      var bagPattern = 'public\\s+virtual\\s*(IList|IEnumerable|List|IObservable|ObservableCollection)<({0})>\\s+(\\S*)'

      var classMatch = classPattern.exec(this.inputClass)
      if (!classMatch) {
        this.showError('Class not found...', 'error')
      }
      var className = classMatch[1]

      var propList = []
      var matchedProp
      while ((matchedProp = propPattern.exec(this.inputClass)) != null) {
        propList.push({
          propType: matchedProp[1],
          propName: matchedProp[2]
        })
      }

      if (propList.length === 0) {
        this.showError('Zero properties found...', 'warning')
      }

      var bagList = []
      var matchedBag
      while ((matchedBag = privateBagPattern.exec(this.inputClass)) != null) {
        var subpattern = new RegExp(bagPattern.replace('{0}', matchedBag[2]), 'g')
        var subMatch
        while ((subMatch = subpattern.exec(this.inputClass)) != null) {
          bagList.push({
            listType: subMatch[1],
            bagType: subMatch[2],
            bagName: subMatch[3]
          })
        }
      }
      var output = []

      // class definition
      output.push('internal class ' + className + 'Builder')
      output.push('{')

      output.push('#region private variables')

      output.push('private ' + className + ' ' + this.firstLetterToLower(className) + ' = ' + this.getDefaultType(className) + ';')
      // private props
      propList.forEach(function (prop) {
        output.push('private ' + prop.propType + ' ' + this.firstLetterToLower(prop.propName) + ' = ' + this.getDefaultType(prop.propType) + ';')
      }, this)
      // private bags
      bagList.forEach(function (bag) {
        output.push('private ' + bag.listType + '<' + bag.bagType + '> ' + this.firstLetterToLower(bag.bagName) + ' = new List<' + bag.bagType + '>();')
      }, this)

      output.push('#endregion')

      output.push('')

      // constructor
      output.push('internal ' + className + 'Builder() {}')

      output.push('#region With methods')

      // with methods for props
      propList.forEach(function (prop) {
        output.push('')
        output.push('internal ' + className + 'Builder With' + prop.propName + '(' + prop.propType + ' ' + this.firstLetterToLower(prop.propName) + ')')
        output.push('{')
        output.push('this.' + this.firstLetterToLower(prop.propName) + ' = ' + this.firstLetterToLower(prop.propName) + ';')
        output.push('return this;')
        output.push('}')
      }, this)

      // with methods for bags
      bagList.forEach(function (bag) {
        output.push('')
        output.push('internal ' + className + 'Builder With' + bag.bagName + '(' + bag.listType + '<' + bag.bagType + '> ' + this.firstLetterToLower(bag.bagName) + ')')
        output.push('{')
        output.push('this.' + this.firstLetterToLower(bag.bagName) + ' = ' + this.firstLetterToLower(bag.bagName) + ';')
        output.push('return this;')
        output.push('}')
      }, this)

      output.push('#endregion')

      // build methos
      output.push('')
      output.push('internal ' + className + ' Build()')
      output.push('{')
      output.push('//' + this.firstLetterToLower(className) + ' = insert here your domain Create method...')
      output.push('return ' + this.firstLetterToLower(className) + ';')
      output.push('}')

      // implicit operator
      output.push('')
      output.push('public static implicit operator ' + className + '(' + className + 'Builder builder)')
      output.push('{')
      output.push('return builder.Build();')
      output.push('}')

      // closing bracket
      output.push('}')

      this.outputBuilder = output.join('\r\n')
    },
    firstLetterToLower: function (word) {
      return word.charAt(0).toLowerCase() + word.slice(1)
    },
    getDefaultType: function (type) {
      switch (type.toLowerCase()) {
        case 'int':
          return 0
        case 'int16':
          return 0
        case 'int32':
          return 0
        case 'int64':
          return 0
        case 'byte':
          return 0
        case 'long':
          return 0
        case 'double':
          return 0
        case 'float':
          return 0
        case 'string':
          return 'string.Empty'
        case 'bool':
          return 'false'
        case 'datetime':
          return 'new DateTime()'
        default:
          return 'null'
      }
    },
    cutRequested: function () {
      this.outputBuilder = ''
      this.snackbar = true
      this.snackbarText = 'Builder copied succesfully'
      this.snackbarIcon = 'check_circle'
      this.context = 'success'
      this.isResultHidden = true
    },
    copyRequested: function () {
      this.snackbar = true
      this.snackbarText = 'Builder copied succesfully'
      this.snackbarIcon = 'check_circle'
      this.context = 'success'
    },
    showErrorDuringCopy: function () {
      this.snackbar = true
      this.snackbarText = 'Ops... something went wrong during copy'
      this.snackbarIcon = 'warning'
      this.context = 'error'
    },
    showError: function (message, context) {
      if (context === 'error') {
        this.isResultHidden = true
        this.outputBuilder = ''
      }
      this.snackbar = true
      this.snackbarText = 'Ops... something went wrong: ' + message
      this.snackbarIcon = 'warning'
      this.context = context
    }
  },
  watch: {
    inputClass: function (newClass) {
      if (!this.isResultHidden) {
        this.isResultHidden = true
        this.outputBuilder = ''
      }
    }
  }
}
</script>


<style scoped>

.hidden {
  visibility: hidden;
  opacity: 0;

  transition: visibility 0.5s, opacity 0.5s ease-in-out;
}

textArea {
  background: #FFF;
  width: 100%;
  height: 20em;
  resize: none;
}

.inputTextArea {
  height: 10em;

  -webkit-transition: height 0.35s ease-in-out;
  -moz-transition: height 0.35s ease-in-out;
  -o-transition: height 0.35s ease-in-out;
  transition: height 0.35s ease-in-out !important; /*important for chrome*/
}

.inputTextArea:focus {
  height: 20em;

  -webkit-transition: height 0.35s ease-in-out;
  -moz-transition: height 0.35s ease-in-out;
  -o-transition: height 0.35s ease-in-out;
  transition: height 0.35s ease-in-out !important; /*important for chrome*/
}

.sectionTitle {
  font-size: 20px;
  font-weight: 500;
}

</style>

