<template>
    <div class="content">
        <el-row :gutter="10">
            <el-col :span="7">
                <result-card :total-prob="totalProb" />
            </el-col>
            <el-col :span="17">
                <el-card class="card-main card-info">
                    <span>
                        聖遺物ドロップ率計算機(α版)
                    </span>
                    <br />
                    <br />
                    <span>・この計算機は統計データをもとにドロップ率を推定するツールであり、計算結果通りに実際に聖遺物がドロップすることを保証するものではありません。</span>
                    <br />
                    <span>・オプション付与のアルゴリズムは以下のページの情報をもとに作成しています。</span>
                    <br />
                    <span>Genshin Impact Wiki </span>
                    <el-link target="_blank" href="https://genshin-impact.fandom.com/wiki/Artifact/Distribution">Artifact/Distribution</el-link>
                    <span>, </span>
                    <el-link target="_blank" href="https://genshin-impact.fandom.com/wiki/Artifact/Occurrence">Artifact/Occurrence</el-link>
                    <br />
                    <span>・4オプション聖遺物のドロップ率{{op4Prob}}%、秘境の聖遺物2個ドロップ率{{drop2Prob}}%として計算しています。</span>
                    <br />
                    <br />
                    <span>・大量の条件を設定すると、計算に時間がかかる場合やフリーズする場合があります。この計算機を使用したことにより生じるいかなる損害に対し、作者は責任を負わないものとします。</span>
                </el-card>
            </el-col>
        </el-row>
        <el-row>
            <el-card class="card-main card-condition">
                <ClientOnly>
                    <el-row class="container-input">
                        <el-col :span="3">
                            <span class="label-input">聖遺物部位</span>
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
                            <span class="label-input">メインOP</span>
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
                <el-row class="container-input">
                    <el-col :span="24">
                        <span class="label-input">サブOP</span>
                    </el-col>
                </el-row>
                <el-row>
                    <el-scrollbar class="container-sub-option" max-height="500px">
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
                    </el-scrollbar>
                </el-row>
            </el-card>
        </el-row>
    </div>
</template>

<style>
.content {
    width: 900px;
    margin: 10px 40px;
}
.card-main {
    width: 100%;
}
.card-info {
    height: 100%;
}
.card-condition {
    margin-top: 10px;
}
.input-artifact {
    width: 150px;
}
.input-main-option {
    width: 250px;
}
.container-sub-option {
    width: 100%;
    padding: 10px 5px 5px 10px;
}
.card-sub-option {
    margin-bottom: 10px;
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
.label-input {
    vertical-align: middle;
}
.container-input {
    margin: 3px 0px;
}
</style>

<script lang="ts" setup>
import { artifactTypes, subOptions, op4Prob, drop2Prob } from '../const/index'

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
    const chainSub = () => {
        removeDuplicate(mainOp.value.key)
    }

</script>