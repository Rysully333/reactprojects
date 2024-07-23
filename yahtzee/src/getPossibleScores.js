export default function getPossibleScores(diceVals) {
    const possibleRolls = ["Ones", "Twos", "Threes", "Fours", "Fives", "Sixes"]
    //diceVals will be an integer value
    //get the counts of each die number to help calculate scores
    const diceCounts = diceVals.reduce((counts, die) => {
        console.log(`Counts: ${counts}`)
        const roll = possibleRolls[die-1]
        counts[roll] = (counts[roll] || 0) + 1
        return counts;
    }, {})

    //get sum of all dice
    const diceSum = diceVals.reduce((sum, die) => sum + die)
    console.log(`Dice counts: ${JSON.stringify(diceCounts)}`)

    //Checks connectivity of range for small and large straight
    const checkStraight = range => range.reduce((acc, roll) => acc && diceCounts[roll], true)

    const smallStraightBool = checkStraight(possibleRolls.slice(0, 4)) || 
                                checkStraight(possibleRolls.slice(1, 5)) ||
                                checkStraight(possibleRolls.slice(2))

    const largeStraightBool = checkStraight(possibleRolls.slice(0, 5)) || 
                                checkStraight(possibleRolls.slice(1))

    const diceMax = Math.max(...Object.values(diceCounts))
    const diceMin = Math.min(...Object.values(diceCounts))

    const scores = {
        Ones: (diceCounts["Ones"] || 0),
        Twos: (diceCounts["Twos"] || 0) * 2,
        Threes: (diceCounts["Threes"] || 0) * 3,
        Fours: (diceCounts["Fours"] || 0) * 4,
        Fives: (diceCounts["Fives"] || 0) * 5,
        Sixes: (diceCounts["Sixes"] || 0) * 6,
        'Three of a Kind': diceMax>=3 ? diceSum : 0,
        'Four of a Kind': diceMax>=4 ? diceSum : 0,
        'Full House': diceMax==3 && diceMin==2 ? 25 : 0,
        'Small Straight': smallStraightBool ? 30 : 0,
        'Large Straight': largeStraightBool ? 40 : 0,
        Yahtzee: Object.values(diceCounts)[0] == 5 ? 50 : 0,
        Chance: diceSum,
      }

    return scores
}
