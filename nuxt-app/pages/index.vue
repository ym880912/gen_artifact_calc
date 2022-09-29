<template>
    <div class="content">
        <el-row :gutter="20">
            <el-col :span="18">
                <el-card class="card-main">
                    <ClientOnly>
                        <el-row>
                            <el-col :span="3">
                                <span>聖遺物部位</span>
                            </el-col>
                            <el-col :span="6">
                                <el-select
                                    v-model="artifact"
                                    value-key="key"
                                    v-on:change="chainMainAndSub"
                                    class="input-artifact"
                                >
                                    <el-option
                                        v-for="item in artifactTypes"
                                        :key="item"
                                        :label="item.label"
                                        :value="item"
                                    />
                                </el-select>
                            </el-col>
                            <el-col :span="3">
                                <span>メインOP</span>
                            </el-col>
                            <el-col :span="9">
                                <el-select
                                    v-model="mainOp"
                                    value-key="key"
                                    :disabled="artifact.mainOptions.length==1"
                                    v-on:change="chainSub"
                                    class="input-main-option"
                                >
                                    <template v-for="a in artifactTypes" >
                                        <template v-if="a.key === artifact.key">
                                            <el-option
                                                v-for="item in a.mainOptions"
                                                :key="item"
                                                :label="item.label"
                                                :value="item"
                                            >
                                                <span style="float: left">{{ item.label }}</span>
                                                <span
                                                    style="
                                                        float: right;
                                                        color: var(--el-text-color-secondary);
                                                        font-size: 11px;
                                                    "
                                                >{{ item.prob.toFixed(2) }} %</span>
                                    </el-option>
                                        </template>
                                    </template>
                                </el-select>
                            </el-col>
                        </el-row>
                    </ClientOnly>
                    <el-row>
                        <el-col :span="24">
                            <span>サブOP</span>
                        </el-col>
                    </el-row>
                    <el-row>
                        <template
                            v-for=" n of subCards.length "
                            :key="n-1"
                        >
                            <sub-option-or-card
                                :main-op="mainOp"
                                :roll-map="rollMap"
                                :index="n-1"
                            />
                        </template>
                        <el-card class="card-sub-option card-new">
                            <el-button
                                class="button-or"
                                v-on:click="createSubCard"
                            >OR</el-button>
                        </el-card>
                    </el-row>
                </el-card>
            </el-col>
            <el-col :span="6">
                <result-card :total-prob="totalProb" />
            </el-col>
        </el-row>
    </div>
</template>

<style>
.content {
    width: 1200px;
    margin: 10px 40px;
}
.card-main {
    width: 100%;
}
.input-artifact {
    width: 150px;
}
.input-main-option {
    width: 250px;
}
.card-sub-option {
    width: 100%;
    margin: 10px 10px 0px 10px;
}
.card-sub-option:last-child {
    margin-bottom: 0px;
}
.card-sub-option .el-card__body {
    padding: 10px 5px 15px 20px;
}
.card-sub-option.card-new .el-card__body{
    padding: 5px;
}
.card-new {
    text-align: center;
}
</style>

<script lang="ts" setup>
import { artifactTypes, subOptions } from '../const/index'

    // Data
    const artifact = ref(artifactTypes[0])
    const mainOp = ref(artifactTypes[0].mainOptions[0])
    const subCards = useSubCards()

    // Computed
    const rollMap = computed(() => {
        const remainSubOptions = subOptions.filter((op) => !mainOp.value || op.key !== mainOp.value.key)
        const totalSubProb = remainSubOptions.reduce((sum, op) => sum + op.prob, 0)

        let map = []
        remainSubOptions.forEach((roll1) => {
            const prob1 = 100 * roll1.prob / totalSubProb
            const remainOp1 = remainSubOptions.filter(op => op.key !== roll1.key)
            remainOp1.forEach((roll2) => {
                const prob2 = prob1 * roll2.prob / (totalSubProb - roll1.prob)
                const remainOp2 = remainOp1.filter(op => op.key !== roll2.key)
                remainOp2.forEach((roll3) => {
                    const prob3 = prob2 * roll3.prob / (totalSubProb - roll1.prob - roll2.prob)
                    const remainOp3 = remainOp2.filter(op => op.key !== roll3.key)
                    remainOp3.forEach((roll4) => {
                        const prob4 = prob3 * roll4.prob / (totalSubProb - roll1.prob - roll2.prob - roll3.prob)
                        map.push({
                            r3List: [roll1.key, roll2.key, roll3.key],
                            r4List: [roll1.key, roll2.key, roll3.key, roll4.key],
                            prob: prob4,
                        })
                    })
                })
            })
        })
        return map
    })

    const totalProb = computed(() => {
        const mainProb = mainOp.value.prob / 100

        let subProb = 0
        rollMap.value.forEach((roll) => {
            let currentProb = 0
            subCards?.forEach((sub, index)=>{
                currentProb = Math.max(currentProb, checkProb(roll, index))
            })
            subProb += currentProb
        })
        // console.log('subProb',subProb)

        return mainProb * subProb
    })

    // Method
    const chainMainAndSub = () => {
        mainOp.value = artifact.value.mainOptions[0]
        chainSub()
    }
    const chainSub = () =>{
        removeDuplicate(mainOp.value.key)
    }

</script>