const ContextObject = require('./context_object').ContextObject

class LunchEventScheduling extends ContextObject {
  constructor(lunchEvents) {
    super([
      {
        id: 1,
        question: () => { 
          var printedEvents = ''
          this.lunchEvents.forEach((v,k,m) => { 
            printedEvents += "Event #" + k + " - " + v.title + "\r\n"
          })
          return 'Which event do you want to schedule? (Number)' + "\r\n" + printedEvents
           },
        accept: /\d+/
      },
      {
        id: 2,
        question: () => { 
          return "Do you want to schedule the following event? (Yes/Back) " + "\r\n"
          + "Name: '" + this.lunchEvents[this.answers[0]].title + "'" + "\r\n"
          + "Participants: '" + this.lunchEvents[this.answers[0]].participants + "'" },
        accept: /Yes/,
        return: /Back/
      },
      {
        id: 3,
        question: () => { return "How many groups do you want make?" },
        accept: /\d+/,
        return: /Back/
      },
      {
        id: 4,
        question: () => { 
          let groups = this.shuffleParticipants(this.lunchEvents[this.answers[0]].participants, this.answers[2])
          let printedGroups = '', i = 1
          groups.forEach( (item,index,arr) => { printedGroups += i++ + ". " + item.join(", ") + "\r\n" })
          return "Do you accept the following groups? (Yes / No to repeat / Back)" + "\r\n"
          + printedGroups
          },
        accept: /Yes/,
        repeat: /No/,
        return: /Back/,
      }
    ], {title: '', date: '', participants: ''})
    
    this.lunchEvents = lunchEvents
  }

  shuffleParticipants(participantsOrig, numberOfGroups) {
    var a = 0, b = 0
    var participants = participantsOrig.split(", "), shuffledParticipants = []
      
    //Courtesy https://gist.github.com/guilhermepontes/17ae0cc71fa2b13ea8c20c94c5c35dc4#gistcomment-2271465
    shuffledParticipants = participants.map( (a) => [Math.random(),a]).sort((a,b) => a[0]-b[0]).map((a) => a[1])
  
    var factor = shuffledParticipants.length / numberOfGroups
    var result = []
    for (a = 0; a < shuffledParticipants.length; a += factor) {
      var arr = (shuffledParticipants.slice(a, a + factor))
      result.push(arr)
    }
    return result
  }

}

module.exports = { LunchEventScheduling }