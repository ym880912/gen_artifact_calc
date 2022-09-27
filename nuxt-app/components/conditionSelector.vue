<template>
    <div class="content">
        <el-card class="box-card">
            <ClientOnly>
                <el-row class="card-content">
                    <el-col :span="4">
                        <span>聖遺物部位</span>
                    </el-col>
                    <el-col :span="20">
                        <el-select
                            v-model="artifact"
                            value-key="key"
                            v-on:change="chainMainAndSub"
                            class="input-option"
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
                            value-key="key"
                            :disabled="artifact.mainOptions.length==1"
                            v-on:change="chainSub"
                            class="input-option"
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
            <sub-option-conditions
                    :main-op="mainOp"
                    :roll-map="rollMap"
                    ref="subRef"
                />
        </el-card>
        <el-card class="box-card">
            <el-row class="card-content">
                <el-col :span="6">
                    <span>セット内出現率</span>
                </el-col>
                <el-col :span="18">
                    <span>{{(totalProb).toFixed(4)}} %</span>
                </el-col>
            </el-row>
            <el-row class="card-content">
                <el-col :span="6">
                    <span>秘境周回期待値</span>
                </el-col>
                <el-col :span="18">
                    <template v-if="totalProb && totalProb != 0"><span>{{resinExpected.toFixed(0)}} 天然樹脂</span></template>
                    <template v-else>-- 天然樹脂</template>
                </el-col>
            </el-row>
            <el-row class="card-content">
                <el-col :span="6">
                    <span>聖遺物回生期待値</span>
                </el-col>
                <el-col :span="18">
                    <template v-if="totalProb && totalProb != 0"><span>{{strongBoxExpected.toFixed(2)}} 回</span></template>
                    <template v-else>-- 回</template>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>
<style>
.content {
    width: 1000px;
}
.box-card {
    margin: 10px 40px;
}
.card-content {
    margin: 7px 0px;
}
.el-checkbox {
    --el-checkbox-checked-text-color: var(--el-text-color-regular);
}
.input-option {
    width: 250px;
}
</style>

<script lang="ts" setup>
    import { artifactTypes, subOptions } from '../const/index'

    // Data
    const artifact = ref(artifactTypes[0]);
    const mainOp = ref(artifactTypes[0].mainOptions[0]);
    const subRef = ref(null)

    // Computed
    const rollMap = computed(() =>{
        const remainSubOptions = subOptions.filter((op) => !mainOp.value || op.key !== mainOp.value.key)
        const totalSubProb = remainSubOptions.reduce((sum, op) => sum + op.prob, 0)

        let map = [];
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
        rollMap.value.forEach((map) => {
            subProb += subRef.value?.checkProb(map)
        })
        // console.log('subProb',subProb)

        return 1/5 * mainProb * subProb;
    })
    const resinExpected  = computed(()=>{
        return 40 * 100 / totalProb.value;
    })
    const strongBoxExpected = computed(()=>{
        return 100 / totalProb.value
    })

    // Method
    const chainMainAndSub = () => {
        mainOp.value = artifact.value.mainOptions[0]
        chainSub()
    }
    const chainSub = () =>{
        subRef.value?.removeDuplicate(mainOp.value.key)
    }

</script>