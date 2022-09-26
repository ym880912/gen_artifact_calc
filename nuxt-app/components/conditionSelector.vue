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
                            v-on:change="clearMainAndSub"
                            style="width: 300px"
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
                            v-on:change="clearSub"
                            style="width: 300px"
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
                <el-row class="card-content">
                    <el-col :span="4">
                        <span>サブOP条件</span>
                    </el-col>
                    <el-col :span="20">
                        <el-select
                            v-model="subOps"
                            value-key="key"
                            multiple
                            :multiple-limit="4"
                            style="width: 500px"
                            placeholder=" "
                        >
                            <el-option
                                v-for="item in subOptions"
                                :key="item"
                                :label="item.label"
                                :value="item"
                                :disabled="mainOp && item.key===mainOp.key"
                            >
                                <span style="float: left">{{ item.label }}</span>
                                <span
                                    style="
                                        float: right;
                                        color: var(--el-text-color-secondary);
                                        font-size: 11px;
                                        margin-right: 30px;
                                    "
                                >
                                    <template v-if="mainOp.key === item.key || subOps.find(sub => sub.key === item.key)">selected</template>
                                    <template v-else-if="subOps.length < 4">{{ (item.prob * 100 / unSelectedToltalProb).toFixed(2) }} %</template>
                                </span>
                            </el-option>
                        </el-select>
                        <span> をすべて含む</span>
                    </el-col>
                </el-row>
                <el-row class="card-content">
                    <el-col :span="4"/>
                    <el-col :span="20">
                        <el-tooltip
                            class="box-item"
                            effect="light"
                            placement="right-end"
                            :content="'4オプション聖遺物は部位・メインOP・サブOPに関わらす一律'+op4Prob+'%で出現するとした場合'"
                        >
                            <el-checkbox
                                v-model="allowOp3"
                                label="ドロップ時にサブオプションが３つだけの聖遺物を含む"
                                size="large"
                                v-on:change="chainAllowLeveling"
                            />
                        </el-tooltip>
                    </el-col>
                </el-row>
                <el-row class="card-content">
                    <el-col :span="4"/>
                    <el-col :span="20">
                        <el-checkbox
                            v-model="allowLeveling"
                            label="４レベルで追加される４つ目のサブオプションを条件に含む"
                            size="large"
                            :disabled="!allowOp3"
                        />
                    </el-col>
                </el-row>
                <!-- <sub-option-conditions
                    :main-op="mainOp"
                    :roll-map="rollMap"
                /> -->
            </ClientOnly>
        </el-card>
        <el-card class="box-card">
            <el-row class="card-content">
                <el-col :span="6">
                    <span>セット内出現率</span>
                </el-col>
                <el-col :span="18">
                    <template v-if="totalProb"><span>{{(totalProb*100).toFixed(4)}} %</span></template>
                    <template v-else>-- %</template>
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
</style>

<script lang="ts" setup>
    import { artifactTypes, subOptions, op4Prob } from '../const/index'

    const artifact=ref(artifactTypes[0]);
    const mainOp=ref(artifactTypes[0].mainOptions[0]);
    const subOps=ref([]);
    const allowOp3=ref(true)
    const allowLeveling=ref(true)

    const chainAllowLeveling = () => {
        allowLeveling.value = allowOp3.value
    }

    const clearMainAndSub = () => {
        mainOp.value = artifact.value.mainOptions[0]
        subOps.value = [];
    }
    const clearSub = () => {
        const index = subOps.value.findIndex(n => n.key === mainOp.value.key)
        if (index >= 0) {
            subOps.value.splice(index, 1);
        }
    }
    const unSelectedToltalProb = computed(() => {
        const unSelectedOptions =  subOptions.filter(op => mainOp.value.key !== op.key && !subOps.value.find(sub => sub.key === op.key))
        // console.log(subOps.value, unSelectedOptions);
        return unSelectedOptions.reduce((sum, op) => sum + op.prob, 0)
    })

    const rollMap = computed(() =>{
        const remainSubOptions = subOptions.filter((op) => !mainOp.value || op.key !== mainOp.value.key)
        const totalSubProb = remainSubOptions.reduce((sum, op) => sum + op.prob, 0)

        let map = [];
        remainSubOptions.forEach((roll1) => {
            const prob1 = roll1.prob / totalSubProb
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
        let mainProb = 1
        if (!mainOp.value) {
            return null
        }
        mainProb = mainOp.value.prob /100

        let subProb = 0
        if (!subOps.value || subOps.value.length < 1) {
            if (allowOp3.value) {
                subProb = 1
            } else {
                subProb = 1 * op4Prob / 100
            }
        }
        else {
            rollMap.value.forEach((map) => {
                let includes = true
                subOps.value.forEach(op => {
                    includes = includes && map.r3List.includes(op.key)
                })
                if (includes) {
                    if (allowOp3.value) {
                        subProb += map.prob
                    } else {
                        subProb += map.prob * op4Prob /100
                    }
                } else {
                    let r4includes = true
                    subOps.value.forEach(op => {
                        r4includes = r4includes && map.r4List.includes(op.key)
                    })
                    if (r4includes) {
                        if (allowOp3.value && allowLeveling.value) {
                            subProb += map.prob
                        } else {
                            subProb += map.prob * op4Prob /100
                        }
                    }
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