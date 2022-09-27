export const useSubCard = (index: number) => {
    const subCards = useState('subCards', ()=>
        ref([{
            subOps: ref([]),
            logic: ref('all'),
            allowOp3: ref(true),
            allowLeveling: ref(true),
        }])
    )
    // console.log('test', subCards.value[index])
    return subCards.value[index]
}

export const useSubCardCount = () => {
    const useSubCardCount = useState('subCardCount', () => ref(1))
    return useSubCardCount
}