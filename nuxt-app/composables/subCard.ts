import { op4Prob } from "../const/index"

export const useSubCards = () =>{
    const subCards = useState('subCards', ()=>
        ref([{
            subOps: ref([]),
            logic: ref('all'),
            allowOp3: ref(true),
            allowLeveling: ref(true),
        }])
    )
    return subCards.value
}

export const createSubCard = () => {
    const subCards = useSubCards()
    subCards.push({
        subOps: ref([]),
        logic: ref('all'),
        allowOp3: ref(true),
        allowLeveling: ref(true),
    })
}

export const deleteSubCard = (index: number) => {
    const subCards = useSubCards()
    subCards.splice(index, 1)
    if (subCards.length === 0) {
        createSubCard()
    }
}

export const checkProb = (roll:object, index:number): number => {

    const subCards = useSubCards()
    if (!subCards[index]) {
        return 0
    }
    const subCard = subCards[index]

    let prob = 0
    let r3Count = 0
    let r4Count = 0
    subCard.subOps.forEach(op => {
        if (roll.r3List.includes(op.key)) {
            r3Count++
        }
        if (roll.r4List.includes(op.key)) {
            r4Count++
        }
    })
    // console.log(r3Count, r4Count)

    if (r4Count >= subCard.subOps.length) return roll.prob

    if (checkLogic(r3Count, index)) {
        if (subCard.allowOp3) {
            prob = roll.prob
        } else {
            prob = roll.prob * op4Prob / 100
        }
    }
    else if (checkLogic(r4Count, index)) {
        if (subCard.allowOp3 && subCard.allowLeveling) {
            prob = roll.prob
        } else {
            prob = roll.prob * op4Prob / 100
        }
    }

    return prob
}

const checkLogic = (count: number, index: number): boolean => {

    const subCards = useSubCards()
    if (!subCards[index]) {
        return false
    }
    const subCard = subCards[index]

    switch(subCard.logic) {
        case 'all':
            return (count >= subCard.subOps.length)
            break
        case 'get1':
            return  (count >= 1)
            break
        case 'get2':
            return  (count >= 2)
            break
        case 'get3':
            return  (count >= 3)
            break
        default:
            return false
    }
}

export const removeDuplicate = (key: string) => {
    const subCards = useSubCards()
    subCards.forEach((sub) => {
        let duplicated = false
        sub.subOps.forEach((op) => {
            if (op.key === key) {
                duplicated = true
            }
        })
        if (duplicated) {
            sub.subOps = []
        }
    })
}