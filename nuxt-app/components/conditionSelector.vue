<template>
    <div class="content">
        <el-card class="box-card">
            <ClientOnly>
                <el-row class="card-content">
                    <el-col :span="4">
                        <span>聖遺物種類</span>
                    </el-col>
                    <el-col :span="20">
                        <el-select
                            v-model="artifact"
                            value-key="label"
                            v-on:change="clearMainAndSub"
                        >
                            <el-option
                                v-for="item in artifactTypes"
                                :key="item"
                                :label="item.label"
                                :value="item"
                            />
                        </el-select>
                    </el-col>
                </el-row>
                <el-row class="card-content">
                    <el-col :span="4">
                        <span>メインOP</span>
                    </el-col>
                    <el-col :span="20">
                        <el-select
                            v-model="mainOp"
                            value-key="label"
                            :disabled="artifact.mainOptions.length==1"
                            v-on:change="clearSub"
                        >
                            <template v-for="a in artifactTypes" >
                                <template v-if="a.label === artifact.label">
                                    <el-option
                                        v-for="item in a.mainOptions"
                                        :key="item"
                                        :label="item.label"
                                        :value="item"
                                    />
                                </template>
                            </template>
                        </el-select>
                    </el-col>
                </el-row>
                <el-row class="card-content">
                    <el-col :span="4">
                        <span>サブOP条件</span>
                    </el-col>
                    <el-col :span="20">
                        <el-select
                            v-model="subOps"
                            value-key="label"
                            multiple
                            :multiple-limit="4"
                            style="width: 500px"
                        >
                            <el-option
                                v-for="item in subOptions"
                                :key="item"
                                :label="item.label"
                                :value="item"
                                :disabled="mainOp && item.label===mainOp.label"
                            />
                        </el-select>
                        <span> をすべて含む</span>
                    </el-col>
                </el-row>
            </ClientOnly>
        </el-card>
        <el-card class="box-card">
            <el-row class="card-content">
                <el-col :span="6">
                    <span>セット内出現率</span>
                </el-col>
                <el-col :span="18">
                    <span>{{(totalProb*100).toFixed(2)}}%</span>
                </el-col>
            </el-row>
            <el-row class="card-content">
                <el-col :span="6">
                    <span>秘境周回期待値</span>
                </el-col>
                <el-col :span="18">
                    <span>{{resinExpected.toFixed(0)}} 樹脂</span>
                </el-col>
            </el-row>
            <el-row class="card-content">
                <el-col :span="6">
                    <span>聖遺物回生期待値</span>
                </el-col>
                <el-col :span="18">
                    <span>{{strongBoxExpected.toFixed(2)}} 回</span>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>
<style>
.content{
    width: 1000px;
}
.box-card{
    margin: 10px 40px;
}
.card-content{
    margin: 7px 0px;
}
</style>


<script lang="ts" setup>
    const artifactTypes = [
        {label: '生の花', mainOptions:[
            {prob: 100, label: 'HP+',},
        ]},
        {label: '死の羽', mainOptions:[
            {prob: 100, label: '攻撃力+',},
        ]},
        {label: '時の砂', mainOptions:[
            {prob: 80/3, label: 'HP%',},
            {prob: 80/3, label: '攻撃力%',},
            {prob: 80/3, label: '防御力%',},
            {prob: 10, label: '元素熟知',},
            {prob: 10, label: '元素チャージ効率',},
        ]},
        {label: '空の杯', mainOptions:[
            {prob: 19.175, label: 'HP%',},
            {prob: 19.175, label: '攻撃力%',},
            {prob: 19.15, label: '防御力%',},
            {prob: 2.5, label: '元素熟知',},
            {prob: 5, label: '各元素・物理ダメージ',},
        ]},
        {label: '理の冠', mainOptions:[
            {prob: 22, label: 'HP%',},
            {prob: 22, label: '攻撃力%',},
            {prob: 22, label: '防御力%',},
            {prob: 4, label: '元素熟知',},
            {prob: 10, label: '会心率',},
            {prob: 10, label: '会心ダメージ',},
            {prob: 10, label: '治癒効果',},
        ]},
    ];
    const subOptions = [
        {prob: 15, label: 'HP+',},
        {prob: 10, label: 'HP%',},
        {prob: 15, label: '攻撃力+',},
        {prob: 10, label: '攻撃力%',},
        {prob: 15, label: '防御力+',},
        {prob: 10, label: '防御力%',},
        {prob: 10, label: '元素熟知',},
        {prob: 10, label: '元素チャージ効率',},
        {prob: 7.5, label: '会心率',},
        {prob: 7.5, label: '会心ダメージ',},
    ];
    const artifact=ref(artifactTypes[0]);
    const mainOp=ref(artifactTypes[0].mainOptions[0]);
    const subOps=ref([]);

    const clearMainAndSub = () => {
        if (artifact.value.mainOptions.length == 1) {
            mainOp.value = artifact.value.mainOptions[0]
        } else{
            mainOp.value = null
        }
        subOps.value = [];
    }
    const clearSub = () => {
        const index = subOps.value.findIndex(n => n.label === mainOp.value.label)
        if (index >= 0) {
            subOps.value.splice(index, 1);
        }
    }
    const totalProb = computed(()=>{
        let mainProb = 1
        if (mainOp.value) {
            mainProb = mainOp.value.prob /100
        }

        let subProb = 0
        if (!subOps.value || subOps.value.length < 1) {
            subProb = 1
        }
        else {
            const remainSubOptions = subOptions.filter((op) => !mainOp.value || op.label !== mainOp.value.label)
            const totalSubProbs = remainSubOptions.reduce((sum, op) => sum + op.prob, 0)

            let allRollMap = [];
            remainSubOptions.forEach((roll_1) => {
                const prob_1 = roll_1.prob / totalSubProbs
                const remainOp_1 = remainSubOptions.filter(op => op.label !== roll_1.label)
                remainOp_1.forEach((roll_2) => {
                    const prob_2 = prob_1 * roll_2.prob / (totalSubProbs - roll_1.prob)
                    const remainOp_2 = remainOp_1.filter(op => op.label !== roll_2.label)
                    remainOp_2.forEach((roll_3) => {
                        const prob_3 = prob_2 * roll_3.prob / (totalSubProbs - roll_1.prob - roll_2.prob)
                        const remainOp_3 = remainOp_2.filter(op => op.label !== roll_3.label)
                        remainOp_3.forEach((roll_4) => {
                            const prob_4 = prob_3 * roll_4.prob / (totalSubProbs - roll_1.prob - roll_2.prob - roll_3.prob)
                            allRollMap.push({rolls:[roll_1.label, roll_2.label, roll_3.label, roll_4.label], prob: prob_4})
                        })
                    })
                })
            })
            allRollMap.forEach((map) => {
                let includes = true
                subOps.value.forEach(op => {
                    includes = includes && map.rolls.includes(op.label)
                });
                if (includes) {
                    subProb += map.prob
                }
            })
        }
        console.log('subProb',subProb)

        return 1/5 * mainProb * subProb;
    })
    const resinExpected  = computed(()=>{
        return 40 / totalProb.value;
    })
    const strongBoxExpected = computed(()=>{
        return 1 / totalProb.value
    })
</script>